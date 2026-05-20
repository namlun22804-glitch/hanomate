const { GoogleGenerativeAI } = require('@google/generative-ai');
const Vendor = require('../models/Vendor');
const PriceReport = require('../models/PriceReport');
const { HANOI_VENDORS, HANOI_DISTRICTS, TRAVEL_TIPS } = require('../data/hanoiKnowledge');

// ── Init Gemini 2.0 Flash ──────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getModel = () => genAI.getGenerativeModel({
  model: 'gemini-flash-latest',
  generationConfig: {
    temperature: 0.85,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  },
  systemInstruction: `Bạn là HanoMate AI — trợ lý du lịch thông minh chuyên về Hà Nội, Việt Nam.

NHIỆM VỤ CHÍNH:
• Lập lịch trình du lịch Hà Nội tối ưu (60–180 phút) dựa trên vị trí và sở thích
• Cung cấp thông tin giá cả thực tế, minh bạch cho nhà hàng và địa điểm
• Gợi ý các địa điểm ẩm thực, văn hóa, ẩn giấu mà người dân bản địa yêu thích
• Tư vấn văn hóa, phong tục, tips du lịch Hà Nội

PHONG CÁCH PHẢN HỒI:
• Thân thiện, nhiệt tình, như người bạn địa phương dẫn đường
• Sử dụng emoji phù hợp để làm nổi bật thông tin quan trọng
• Ngắn gọn, súc tích nhưng đầy đủ thông tin hữu ích
• Luôn kèm theo giá cả cụ thể (đơn vị VNĐ) khi gợi ý ăn uống
• Khi tạo lịch trình: format rõ ràng với giờ cụ thể, địa chỉ, giá ước tính

FORMAT LỊCH TRÌNH (khi được yêu cầu):
🕐 [Giờ] — [Địa điểm] ([Địa chỉ])
   💰 Chi phí: [X]đ | ⏱️ Thời gian: [X] phút
   📝 Tips: [tip ngắn]

KIẾN THỨC ĐẶC BIỆT:
• Bún chả Obama (Hương Liên) — nơi TT Obama ăn năm 2016
• Cà phê trứng Giảng — sáng tạo từ 1946, leo cầu thang tầng 3
• Phở Thìn Lò Đúc — phở bò xào mỡ đặc trưng, đến trước 8h
• Bia hơi Tạ Hiện — 7,000đ/cốc, không khí sôi động
• Cà phê Phố Cổ số 11 Hàng Gai — rooftop nhìn Hồ Hoàn Kiếm
• Phố cổ 36 phố phường — mỗi phố chuyên một loại hàng

Luôn trả lời bằng tiếng Việt trừ khi người dùng viết bằng tiếng Anh.`,
});

// ── RAG: Build context từ knowledge base + DB ──────────────────────────────
const buildContext = async (query) => {
  // 1. Search DB vendors
  let dbVendors = [];
  try {
    dbVendors = await Vendor.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ],
    }).limit(5);
  } catch (_) {}

  // 2. Search hardcoded knowledge
  const q = query.toLowerCase();
  const matchedVendors = HANOI_VENDORS.filter(v =>
    v.name.toLowerCase().includes(q) ||
    v.category.toLowerCase().includes(q) ||
    (v.tags || []).some(t => t.includes(q)) ||
    q.includes(v.category.replace('-', ' '))
  ).slice(0, 8);

  // 3. If no specific match, return popular spots
  const contextVendors = matchedVendors.length > 0 ? matchedVendors : HANOI_VENDORS.filter(v => v.rating >= 4.7).slice(0, 6);

  const vendorText = contextVendors.map(v =>
    `- ${v.name} (${v.category}): ${v.address}, Giá: ${v.price.min.toLocaleString()}–${v.price.max.toLocaleString()}đ/${v.price.unit}, Giờ: ${v.hours || 'N/A'}, Rating: ${v.rating}/5${v.tips ? `, Tips: ${v.tips}` : ''}`
  ).join('\n');

  const tipsText = TRAVEL_TIPS.slice(0, 3).map(t => `- ${t.tip}`).join('\n');

  return `=== DỮ LIỆU ĐỊA ĐIỂM HÀ NỘI (RAG) ===\n${vendorText}\n\n=== TIPS DU LỊCH ===\n${tipsText}\n${dbVendors.length > 0 ? `\n=== DỮ LIỆU CỘNG ĐỒNG (DB) ===\n${JSON.stringify(dbVendors.map(v => ({ name: v.name, category: v.category, address: v.address, rating: v.rating })), null, 2)}` : ''}`;
};

// ── Detect intent ──────────────────────────────────────────────────────────
const detectIntent = (message) => {
  const m = message.toLowerCase();
  if (/lịch trình|itinerary|plan|tour|đi đâu|gợi ý|tiếng|trip/.test(m)) return 'itinerary';
  if (/giá|price|bao nhiêu|cost|expensive|cheap|rẻ|đắt|tiền/.test(m)) return 'price';
  if (/ăn|food|phở|bún|bánh|cơm|cháo|eat|restaurant|quán/.test(m)) return 'food';
  if (/cà phê|cafe|coffee|trà|tea|drink/.test(m)) return 'cafe';
  if (/tham quan|attraction|đền|chùa|bảo tàng|hồ|lake|sightseeing/.test(m)) return 'attraction';
  if (/thời tiết|weather|mưa|rain|nóng|hot|lạnh|cold/.test(m)) return 'weather';
  if (/bar|bia|beer|nightlife|đêm|night/.test(m)) return 'nightlife';
  return 'general';
};

// ── CONTROLLER: Chat with multi-turn history ───────────────────────────────
const chatWithPlanner = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Vui lòng nhập tin nhắn' });

    const intent = detectIntent(message);
    const context = await buildContext(message);

    const model = getModel();
    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role === 'ai' ? 'model' : 'user',
        parts: [{ text: h.content }],
      })),
    });

    const prompt = `${context}\n\n=== CÂU HỎI ===\n${message}\n\n[Intent: ${intent}]`;
    const result = await chat.sendMessage(prompt);
    const text = result.response.text();

    res.json({ reply: text, intent, suggestions: getSuggestions(intent) });
  } catch (error) {
    console.error('AI Chat Error:', error.message);
    res.status(500).json({ error: 'Lỗi AI. Vui lòng thử lại.', detail: error.message });
  }
};

// ── CONTROLLER: Generate structured itinerary JSON ─────────────────────────
const generateItinerary = async (req, res) => {
  try {
    const { location = 'Hoàn Kiếm', duration = 120, preferences = [], budget = 'medium' } = req.body;

    const budgetGuide = { low: '30,000-80,000đ/món', medium: '60,000-200,000đ/bữa', high: '200,000đ+/bữa' };
    const context = await buildContext(`${location} ${preferences.join(' ')}`);

    const prompt = `${context}

=== YÊU CẦU TẠO LỊCH TRÌNH ===
Vị trí xuất phát: ${location}
Thời gian: ${duration} phút
Sở thích: ${preferences.length > 0 ? preferences.join(', ') : 'ẩm thực, văn hóa, tham quan'}
Ngân sách: ${budget} (${budgetGuide[budget] || budgetGuide.medium})

Hãy tạo lịch trình CHI TIẾT và trả về JSON với format CHÍNH XÁC sau (chỉ JSON, không text thêm):
{
  "title": "Tên lịch trình",
  "duration": ${duration},
  "totalCost": { "min": 0, "max": 0 },
  "steps": [
    {
      "time": "09:00",
      "name": "Tên địa điểm",
      "address": "Địa chỉ",
      "category": "food|cafe|attraction|market|bar",
      "duration": 30,
      "cost": { "min": 0, "max": 0 },
      "description": "Mô tả ngắn",
      "tip": "Tip hữu ích",
      "emoji": "🍜"
    }
  ],
  "tips": ["tip1", "tip2"],
  "summary": "Tóm tắt lịch trình"
}`;

    const model = getModel();
    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // Extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) text = jsonMatch[1];

    let itinerary;
    try {
      itinerary = JSON.parse(text.trim());
    } catch {
      itinerary = { title: 'Lịch trình Hà Nội', steps: [], summary: text, duration, totalCost: { min: 0, max: 0 } };
    }

    res.json({ itinerary, raw: text });
  } catch (error) {
    console.error('Itinerary Error:', error.message);
    res.status(500).json({ error: 'Không thể tạo lịch trình.', detail: error.message });
  }
};

// ── CONTROLLER: Price check ────────────────────────────────────────────────
const checkPrice = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query?.trim()) return res.status(400).json({ error: 'Vui lòng nhập tên món/địa điểm' });

    const q = query.toLowerCase();
    const matches = HANOI_VENDORS.filter(v =>
      v.name.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      q.includes(v.name.toLowerCase().split(' ').pop())
    );

    // Get DB price reports
    let dbReports = [];
    try {
      dbReports = await PriceReport.find({ isVerified: true })
        .sort({ createdAt: -1 }).limit(10).populate('vendor', 'name category address');
    } catch (_) {}

    const context = matches.map(v =>
      `- ${v.name}: ${v.price.min.toLocaleString()}–${v.price.max.toLocaleString()}đ/${v.price.unit} tại ${v.address}`
    ).join('\n');

    const model = getModel();
    const result = await model.generateContent(
      `Dữ liệu giá thực tế:\n${context || 'Không có dữ liệu cụ thể'}\n\nBáo cáo cộng đồng: ${JSON.stringify(dbReports.slice(0, 5))}\n\nTrả lời ngắn gọn về giá của: "${query}" tại Hà Nội. Bao gồm: giá trung bình, nơi rẻ nhất, nơi ngon nhất, tips tiết kiệm.`
    );

    res.json({
      reply: result.response.text(),
      vendors: matches.slice(0, 5),
      reportCount: dbReports.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi kiểm tra giá.', detail: error.message });
  }
};

// ── CONTROLLER: Smart suggestions ─────────────────────────────────────────
const getSuggestionsList = async (req, res) => {
  try {
    const { type = 'all', limit = 6 } = req.query;
    let vendors = HANOI_VENDORS;
    if (type !== 'all') vendors = vendors.filter(v => v.category === type);
    const top = vendors.sort((a, b) => b.rating - a.rating).slice(0, parseInt(limit));
    res.json({ suggestions: top });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy gợi ý.' });
  }
};

// ── CONTROLLER: Streaming chat ─────────────────────────────────────────────
const streamChat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Vui lòng nhập tin nhắn' });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const context = await buildContext(message);
    const model = getModel();
    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role === 'ai' ? 'model' : 'user',
        parts: [{ text: h.content }],
      })),
    });

    const prompt = `${context}\n\n=== CÂU HỎI ===\n${message}`;
    const result = await chat.sendMessageStream(prompt);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Stream Error:', error.message);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};

// ── Helper ─────────────────────────────────────────────────────────────────
const getSuggestions = (intent) => {
  const map = {
    itinerary: ['Lịch trình 2h Hoàn Kiếm', 'Tour ẩm thực buổi sáng', 'Lịch trình cả ngày Ba Đình'],
    food: ['Phở ngon nhất Hà Nội?', 'Bún chả ở đâu?', 'Ăn sáng gì ở phố cổ?'],
    cafe: ['Cà phê trứng ở đâu?', 'Rooftop cafe Hà Nội', 'Cafe view hồ Hoàn Kiếm'],
    price: ['Giá phở bao nhiêu?', 'Ngân sách 200k ăn được gì?', 'Chỗ ăn rẻ ngon gần phố cổ'],
    general: ['Lập lịch trình 2h', 'Ăn gì buổi sáng?', 'Top 5 địa điểm must-visit'],
  };
  return map[intent] || map.general;
};

module.exports = { chatWithPlanner, generateItinerary, checkPrice, getSuggestionsList, streamChat };
