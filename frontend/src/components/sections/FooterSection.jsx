import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Map từng link đến đích thực tế
const footerLinks = {
  'Sản Phẩm': [
    { label: 'AI Planner', to: '/planner', desc: 'Lên lịch trình du lịch với AI' },
    { label: 'Bản Đồ Tương Tác', to: '/map', desc: 'Xem địa điểm trên bản đồ GPS' },
    { label: 'Kiểm Tra Giá', href: '/#pricing', desc: 'So sánh gói dịch vụ' },
    { label: 'Tính Năng', href: '/#features', desc: 'Khám phá tất cả tính năng' },
    { label: 'Đánh Giá', href: '/#reviews', desc: 'Nhận xét từ du khách' },
  ],
  'Công Ty': [
    { label: 'Về Chúng Tôi', modal: 'about', desc: 'Câu chuyện HanoMate' },
    { label: 'Blog Du Lịch', modal: 'blog', desc: 'Tips & kinh nghiệm Hà Nội' },
    { label: 'Tuyển Dụng', modal: 'careers', desc: 'Gia nhập đội ngũ chúng tôi' },
    { label: 'Liên Hệ', modal: 'contact', desc: 'Hỗ trợ & phản hồi' },
    { label: 'Press Kit', modal: 'press', desc: 'Tài liệu báo chí' },
  ],
  'Hỗ Trợ': [
    { label: 'Trung Tâm Trợ Giúp', modal: 'help', desc: 'Câu hỏi thường gặp' },
    { label: 'Hướng Dẫn Sử Dụng', modal: 'guide', desc: 'Cách dùng HanoMate' },
    { label: 'Cộng Đồng', modal: 'community', desc: 'Nhóm du lịch Hà Nội' },
    { label: 'Chính Sách BM', modal: 'privacy', desc: 'Bảo vệ dữ liệu của bạn' },
    { label: 'Điều Khoản DV', modal: 'terms', desc: 'Điều khoản sử dụng' },
  ],
};

const MODAL_CONTENT = {
  about: {
    title: '🏮 Về HanoMate',
    content: `HanoMate ra đời từ tình yêu với Hà Nội — một thành phố ngàn năm văn hiến với những góc phố cổ kính, hương vị ẩm thực độc đáo và con người thân thiện.

Chúng tôi tin rằng mỗi du khách đều xứng đáng được trải nghiệm Hà Nội như một người địa phương thực thụ — không bị "chặt chém", không lạc đường trong ngõ hẻm, và luôn tìm được quán phở ngon nhất phố.

Được xây dựng bởi đội ngũ người Hà Nội với sự hỗ trợ của AI Gemini, HanoMate kết hợp công nghệ hiện đại và kiến thức địa phương để tạo ra trải nghiệm du lịch tốt nhất.`,
  },
  blog: {
    title: '📰 Blog Du Lịch Hà Nội',
    content: `✦ Top 10 quán bún chả ngon nhất Hà Nội 2026
✦ Hà Nội về đêm — 5 điểm check-in không thể bỏ lỡ
✦ Tour ẩm thực phố cổ: Lịch trình 3 tiếng hoàn hảo
✦ Cà phê Hà Nội — Nghệ thuật trong từng giọt
✦ Mùa thu Hà Nội: Khi lá vàng phủ đầy Hồ Gươm
✦ Báo cáo giá ẩm thực đường phố tháng 5/2026

Blog sẽ ra mắt chính thức vào tháng 6/2026. Đăng ký email để nhận thông báo sớm!`,
  },
  careers: {
    title: '💼 Tuyển Dụng',
    content: `Chúng tôi đang tìm kiếm những người đam mê Hà Nội và công nghệ:

🔹 Frontend Developer (React/Next.js)
🔹 AI/ML Engineer (Python, LLM)
🔹 Content Creator (Ẩm thực & Du lịch)
🔹 Community Manager
🔹 Data Analyst

Môi trường làm việc: Linh hoạt, remote-friendly, team trẻ nhiệt huyết.
Phúc lợi: Ăn trưa miễn phí (đương nhiên là phở!) + stock options.

📧 Gửi CV về: careers@hanomate.vn`,
  },
  contact: {
    title: '📞 Liên Hệ',
    content: `Chúng tôi luôn sẵn sàng lắng nghe bạn!

📧 Email: hello@hanomate.vn
📱 Hotline: 1800-HANOI (miễn phí)
🏠 Địa chỉ: 25 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội
⏰ Giờ làm việc: T2-T6, 8:00 - 18:00

Facebook: facebook.com/hanomate
Instagram: @hanomate_official

Thời gian phản hồi email trung bình: dưới 2 giờ làm việc.`,
  },
  press: {
    title: '📋 Press Kit',
    content: `HanoMate — AI Travel Assistant #1 tại Hà Nội

📊 Số liệu chính (Q1 2026):
• 10,000+ người dùng hoạt động
• 500+ địa điểm đã xác minh
• 4.9/5 đánh giá trên App Store
• Phục vụ 50+ quốc tịch khác nhau

🏆 Giải thưởng:
• Top App Vietnam 2025 — TechCrunch
• Google AI Partner — Certified
• Best Travel Tech Startup 2026 — VnExpress

📥 Tải logo, ảnh và tài liệu:
Liên hệ press@hanomate.vn để nhận press kit đầy đủ.`,
  },
  help: {
    title: '❓ Câu Hỏi Thường Gặp',
    content: `Q: HanoMate có miễn phí không?
A: Có! Gói Explorer miễn phí hoàn toàn với 5 lịch trình AI/tháng.

Q: AI lên lịch trình mất bao lâu?
A: Dưới 30 giây cho một lịch trình hoàn chỉnh!

Q: Tôi có thể dùng khi không có internet không?
A: Có với gói Traveler trở lên — bản đồ offline hoạt động tốt.

Q: Giá trong app có chính xác không?
A: Dữ liệu từ cộng đồng, được đối chiếu theo thuật toán. Sai số < 10%.

Q: App có trên iOS/Android không?
A: Hiện tại là web app. App native sẽ ra mắt Q3/2026.

📧 Câu hỏi khác: support@hanomate.vn`,
  },
  guide: {
    title: '📖 Hướng Dẫn Sử Dụng',
    content: `🚀 Bắt đầu trong 3 bước:

1️⃣ Mở AI Planner
   → Nhấn "Bắt Đầu Miễn Phí" trên trang chủ

2️⃣ Nhập yêu cầu của bạn
   → Ví dụ: "Tour ẩm thực 2 tiếng quanh Hồ Gươm"
   → Hoặc dùng gợi ý nhanh ở đầu trang chat

3️⃣ Nhận lịch trình & khám phá
   → AI sẽ gợi ý địa điểm, giá cả, thời gian di chuyển

🗺️ Dùng Bản Đồ:
   → Vào menu "Bản Đồ" → Cho phép GPS → Bắt đầu khám phá`,
  },
  community: {
    title: '👥 Cộng Đồng HanoMate',
    content: `Tham gia cộng đồng du lịch Hà Nội sôi động nhất!

🏮 Facebook Group: "Hà Nội Xưa & Nay"
   → 15,000+ thành viên, chia sẻ địa điểm mỗi ngày

📸 Instagram: @hanomate_community
   → Tag #HanoMate để xuất hiện trên feed chính thức

💬 Discord Server: discord.gg/hanomate
   → Chat trực tiếp, hỏi đáp, tổ chức meetup

📍 HanoMate Meetup:
   → Tổ chức mỗi tháng 1 lần tại các địa điểm khác nhau
   → Lần tới: Hồ Tây sunrise tour — 15/06/2026`,
  },
  privacy: {
    title: '🔒 Chính Sách Bảo Mật',
    content: `HanoMate cam kết bảo vệ dữ liệu cá nhân của bạn.

📋 Chúng tôi thu thập:
• Email và tên (khi đăng ký)
• Vị trí GPS (chỉ khi bạn cho phép, không lưu trữ)
• Lịch sử tìm kiếm (để cải thiện gợi ý AI)

🛡️ Chúng tôi CAM KẾT:
• Không bán dữ liệu cho bên thứ ba
• Mã hóa toàn bộ dữ liệu (AES-256)
• Tuân thủ GDPR và luật BVDL Việt Nam
• Xóa dữ liệu trong 30 ngày khi bạn yêu cầu

📧 DPO: privacy@hanomate.vn
Phiên bản: 2.1 | Cập nhật: 01/05/2026`,
  },
  terms: {
    title: '📄 Điều Khoản Dịch Vụ',
    content: `Bằng cách sử dụng HanoMate, bạn đồng ý với:

✅ Điều khoản sử dụng hợp lệ:
• Sử dụng cho mục đích cá nhân và du lịch
• Chia sẻ thông tin giá cả trung thực
• Tôn trọng cộng đồng và văn hóa Hà Nội

❌ Không được phép:
• Tạo tài khoản giả mạo
• Spam hoặc quảng cáo trái phép
• Scraping dữ liệu tự động

💡 Lưu ý:
Thông tin giá cả từ cộng đồng mang tính tham khảo. HanoMate không chịu trách nhiệm về sự chênh lệch giá thực tế.

📧 Câu hỏi pháp lý: legal@hanomate.vn
Phiên bản: 1.4 | Hiệu lực: 01/01/2026`,
  },
};

const socials = [
  { icon: 'f', label: 'Facebook', color: '#1877F2' },
  { icon: '▶', label: 'YouTube', color: '#FF0000' },
  { icon: '𝕏', label: 'Twitter/X', color: '#aaa' },
  { icon: 'in', label: 'LinkedIn', color: '#0A66C2' },
];

const FOOTER_BG = 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=60&w=1800&auto=format&fit=crop';

const FooterSection = () => {
  const [activeModal, setActiveModal] = useState(null);

  const handleLinkClick = (item, e) => {
    if (item.modal) {
      e.preventDefault();
      setActiveModal(item.modal);
    }
    // href và to links navigate bình thường
  };

  const modal = activeModal ? MODAL_CONTENT[activeModal] : null;

  return (
    <>
      {/* Info Modal */}
      {modal && (
        <div onClick={() => setActiveModal(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'rgba(12,8,3,0.97)', border: '1px solid rgba(212,160,23,0.3)',
            borderRadius: 20, padding: '36px 40px', maxWidth: 540, width: '100%',
            boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
            backgroundImage: 'linear-gradient(135deg, rgba(212,160,23,0.04) 0%, transparent 60%)',
            animation: 'modalIn .25s ease',
            maxHeight: '80vh', overflowY: 'auto',
          }}>
            <style>{`@keyframes modalIn { from{opacity:0;transform:scale(.95)translateY(12px)} to{opacity:1;transform:none} }`}</style>
            {/* Gold top bar */}
            <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,#D4A017,transparent)', marginBottom: 24, borderRadius: 2 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFD700', marginBottom: 16, fontFamily: "'Playfair Display',serif" }}>
              {modal.title}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '.9rem', lineHeight: 1.85, whiteSpace: 'pre-line' }}>
              {modal.content}
            </p>
            <button onClick={() => setActiveModal(null)} style={{
              marginTop: 28, padding: '10px 28px', borderRadius: 50,
              background: 'linear-gradient(135deg,#D4A017,#FF8C00)', border: 'none',
              color: '#fff', fontWeight: 700, fontSize: '.88rem', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(212,160,23,0.4)',
            }}>Đóng ✕</button>
          </div>
        </div>
      )}

      <footer style={{
        position: 'relative', overflow: 'hidden',
        backgroundImage: `url(${FOOTER_BG})`,
        backgroundSize: 'cover', backgroundPosition: 'center top',
        borderTop: '1px solid rgba(212,160,23,0.15)',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,3,1,0.92)', backdropFilter: 'blur(2px)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #D4A017, #FF8C00, #D4A017, transparent)' }} />

          <div className="container" style={{ paddingTop: 64 }}>
            <div className="hanoi-divider" style={{ marginBottom: 48 }}>
              <span>🏮</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, paddingBottom: 56 }}>
              {/* Brand */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#D4A017,#FF8C00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem', color: '#fff', boxShadow: '0 4px 16px rgba(212,160,23,.5)' }}>H</div>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: '1.3rem', color: '#FFD700', letterSpacing: '.02em' }}>HanoMate</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,.48)', fontSize: '.86rem', lineHeight: 1.8, maxWidth: 260, marginBottom: 24 }}>
                  Trợ lý du lịch AI cho Hà Nội. Khám phá những viên ngọc ẩn, lên lịch trình thông minh và tận hưởng như người địa phương.
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  {socials.map(s => (
                    <a key={s.label} href="#" aria-label={s.label}
                      style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.5)', fontSize: '.8rem', fontWeight: 700, transition: 'all .25s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = s.color; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = s.color; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; e.currentTarget.style.color = 'rgba(255,255,255,.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'; }}>
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Link columns */}
              {Object.entries(footerLinks).map(([group, links]) => (
                <div key={group}>
                  <h5 style={{ color: '#FFD700', fontWeight: 700, fontSize: '.78rem', marginBottom: 18, letterSpacing: '.1em', textTransform: 'uppercase' }}>{group}</h5>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {links.map(item => (
                      <li key={item.label}>
                        {item.to ? (
                          <Link to={item.to}
                            style={{ color: 'rgba(255,255,255,.42)', fontSize: '.84rem', display: 'flex', alignItems: 'center', gap: 6, transition: 'all .2s', paddingLeft: 0 }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#D4A017'; e.currentTarget.style.paddingLeft = '6px'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.42)'; e.currentTarget.style.paddingLeft = '0'; }}>
                            <span style={{ opacity: 0.4, fontSize: '.7rem' }}>→</span> {item.label}
                          </Link>
                        ) : item.href ? (
                          <a href={item.href}
                            style={{ color: 'rgba(255,255,255,.42)', fontSize: '.84rem', display: 'flex', alignItems: 'center', gap: 6, transition: 'all .2s', paddingLeft: 0 }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#D4A017'; e.currentTarget.style.paddingLeft = '6px'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.42)'; e.currentTarget.style.paddingLeft = '0'; }}>
                            <span style={{ opacity: 0.4, fontSize: '.7rem' }}>→</span> {item.label}
                          </a>
                        ) : (
                          <button onClick={e => handleLinkClick(item, e)}
                            style={{ background: 'none', border: 'none', padding: 0, color: 'rgba(255,255,255,.42)', fontSize: '.84rem', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6, transition: 'all .2s', width: '100%', paddingLeft: 0, fontFamily: 'Inter,sans-serif' }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#D4A017'; e.currentTarget.style.paddingLeft = '6px'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.42)'; e.currentTarget.style.paddingLeft = '0'; }}>
                            <span style={{ opacity: 0.4, fontSize: '.7rem' }}>→</span> {item.label}
                          </button>
                        )}
                        {/* Tooltip desc khi hover */}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <div style={{ borderTop: '1px solid rgba(212,160,23,0.15)', padding: '32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <h5 style={{ color: '#fff', fontWeight: 700, marginBottom: 4 }}>🏮 Nhận tips du lịch Hà Nội hàng tuần</h5>
                <p style={{ color: 'rgba(255,255,255,.38)', fontSize: '.82rem' }}>Không spam. Huỷ đăng ký bất cứ lúc nào.</p>
              </div>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(212,160,23,.25)', borderRadius: 50, overflow: 'hidden', maxWidth: 380, width: '100%' }}>
                <input type="email" placeholder="email@example.com" style={{ flex: 1, background: 'none', border: 'none', padding: '12px 20px', color: '#fff', fontSize: '.88rem', outline: 'none', fontFamily: 'Inter,sans-serif' }} />
                <button className="btn btn-primary btn-sm" style={{ borderRadius: 50, margin: 4, flexShrink: 0 }}>Đăng Ký</button>
              </div>
            </div>

            {/* Bottom bar */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <p style={{ color: 'rgba(255,255,255,.28)', fontSize: '.78rem' }}>© 2026 HanoMate. Made with ❤️ tại Hà Nội, Việt Nam.</p>
              <div style={{ display: 'flex', gap: 20 }}>
                {[
                  { label: 'Bảo Mật', modal: 'privacy' },
                  { label: 'Điều Khoản', modal: 'terms' },
                  { label: 'Liên Hệ', modal: 'contact' },
                ].map(t => (
                  <button key={t.label} onClick={() => setActiveModal(t.modal)}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.28)', fontSize: '.76rem', cursor: 'pointer', transition: 'color .2s', fontFamily: 'Inter,sans-serif', padding: 0 }}
                    onMouseEnter={e => e.currentTarget.style.color = '#D4A017'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.28)'}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterSection;
