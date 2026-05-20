/**
 * HanoMate RAG Knowledge Base
 * Dữ liệu thực tế về Hà Nội — địa điểm, giá cả, tips
 */

const HANOI_VENDORS = [
  // === PHỞ ===
  { id: 'pho-thin', name: 'Phở Thìn Lò Đúc', category: 'pho', address: '13 Lò Đúc, Hai Bà Trưng', district: 'Hai Bà Trưng', price: { min: 65000, max: 85000, unit: 'bowl' }, hours: '6:00-14:00', rating: 4.8, coords: [105.8512, 21.0245], tags: ['famous', 'breakfast', 'beef'], tips: 'Đến sớm trước 8h, hay hết sớm. Phở bò xào mỡ đặc trưng Hà Nội.' },
  { id: 'pho-bat-dan', name: 'Phở Bát Đàn', category: 'pho', address: '49 Bát Đàn, Hoàn Kiếm', district: 'Hoàn Kiếm', price: { min: 55000, max: 75000, unit: 'bowl' }, hours: '6:00-9:00, 18:00-20:30', rating: 4.7, coords: [105.8489, 21.0346], tags: ['queue', 'authentic', 'old-quarter'], tips: 'Xếp hàng tự lấy bát. Không có phục vụ, rất đông vào giờ cao điểm.' },
  { id: 'pho-gia-truyen', name: 'Phở Gia Truyền Bờ Hồ', category: 'pho', address: 'Đinh Tiên Hoàng, Hoàn Kiếm', district: 'Hoàn Kiếm', price: { min: 60000, max: 80000, unit: 'bowl' }, hours: '6:30-10:30', rating: 4.6, coords: [105.8526, 21.0312], tags: ['lake-view', 'breakfast'] },

  // === BÚN CHA ===
  { id: 'bun-cha-huong-lien', name: 'Bún chả Hương Liên', category: 'bun-cha', address: '24 Lê Văn Hưu, Hai Bà Trưng', district: 'Hai Bà Trưng', price: { min: 65000, max: 90000, unit: 'set' }, hours: '8:30-21:00', rating: 4.9, coords: [105.8524, 21.0218], tags: ['obama', 'famous', 'must-try'], tips: 'Nổi tiếng với "Bún chả Obama" — Tổng thống Obama đã ăn ở đây năm 2016.' },
  { id: 'bun-cha-dac-kim', name: 'Bún chả Đắc Kim', category: 'bun-cha', address: '1 Hàng Mành, Hoàn Kiếm', district: 'Hoàn Kiếm', price: { min: 60000, max: 80000, unit: 'set' }, hours: '11:00-21:00', rating: 4.6, coords: [105.8467, 21.0338], tags: ['old-quarter', 'lunch'] },
  { id: 'bun-cha-37-hang-than', name: 'Bún chả 37 Hàng Than', category: 'bun-cha', address: '37 Hàng Than, Ba Đình', district: 'Ba Đình', price: { min: 55000, max: 70000, unit: 'set' }, hours: '10:30-14:00', rating: 4.5, coords: [105.8445, 21.0372], tags: ['local', 'cheap'] },

  // === CÀ PHÊ ===
  { id: 'cafe-giang', name: 'Cà phê Giảng (Egg Coffee)', category: 'cafe', address: '39 Nguyễn Hữu Huân, Hoàn Kiếm', district: 'Hoàn Kiếm', price: { min: 30000, max: 55000, unit: 'cup' }, hours: '7:00-22:00', rating: 4.8, coords: [105.8521, 21.0341], tags: ['egg-coffee', 'iconic', 'must-try', 'hidden-gem'], tips: 'Cà phê trứng độc đáo được tạo ra từ năm 1946. Leo cầu thang hẹp lên tầng 3.' },
  { id: 'cafe-dinh', name: 'Cà phê Đinh', category: 'cafe', address: '13 Đinh Tiên Hoàng, Hoàn Kiếm', district: 'Hoàn Kiếm', price: { min: 25000, max: 45000, unit: 'cup' }, hours: '7:00-23:00', rating: 4.5, coords: [105.8527, 21.0316], tags: ['lake-view', 'cozy'] },
  { id: 'cafe-pho-co', name: 'Cà phê Phố Cổ', category: 'cafe', address: '11 Hàng Gai, Hoàn Kiếm', district: 'Hoàn Kiếm', price: { min: 35000, max: 65000, unit: 'cup' }, hours: '8:00-22:00', rating: 4.7, coords: [105.8498, 21.0340], tags: ['rooftop', 'hidden-gem', 'view'], tips: 'Đi qua ngõ hẹp để lên rooftop nhìn ra Hồ Hoàn Kiếm. Rất đẹp lúc hoàng hôn.' },
  { id: 'trangs-bakery', name: "Trang's Bakery & Coffee", category: 'cafe', address: '1 Hàng Bông, Hoàn Kiếm', district: 'Hoàn Kiếm', price: { min: 40000, max: 80000, unit: 'item' }, hours: '7:30-21:30', rating: 4.6, coords: [105.8469, 21.0332], tags: ['bakery', 'western', 'brunch'] },

  // === BÁNH MÌ ===
  { id: 'banh-mi-25', name: 'Bánh mì 25', category: 'banh-mi', address: '25 Hàng Cá, Hoàn Kiếm', district: 'Hoàn Kiếm', price: { min: 25000, max: 40000, unit: 'piece' }, hours: '6:00-21:00', rating: 4.8, coords: [105.8484, 21.0353], tags: ['famous', 'crispy', 'cheap'], tips: 'Bánh mì ngon nhất Hà Nội theo nhiều review. Thử thêm chả cá nướng.' },
  { id: 'banh-mi-hoi-an', name: 'Bánh mì Hội An Hà Nội', category: 'banh-mi', address: 'Phố Cổ', district: 'Hoàn Kiếm', price: { min: 30000, max: 50000, unit: 'piece' }, hours: '7:00-20:00', rating: 4.4, coords: [105.8490, 21.0338], tags: ['fusion'] },

  // === BÚN BÒ / MÌ ===
  { id: 'bun-bo-nam-bo', name: 'Bún bò Nam Bộ Lê Văn Hưu', category: 'noodles', address: '67 Lê Văn Hưu, Hai Bà Trưng', district: 'Hai Bà Trưng', price: { min: 55000, max: 75000, unit: 'bowl' }, hours: '7:00-21:00', rating: 4.6, coords: [105.8520, 21.0214], tags: ['dry-noodle', 'southern-style'] },

  // === CÁC MÓN ĂN ĐẶC SẢN ===
  { id: 'cha-ca-la-vong', name: 'Chả cá Lã Vọng', category: 'seafood', address: '14 Chả Cá, Hoàn Kiếm', district: 'Hoàn Kiếm', price: { min: 300000, max: 500000, unit: 'portion' }, hours: '10:00-21:00', rating: 4.7, coords: [105.8483, 21.0349], tags: ['iconic', 'expensive', 'traditional', 'must-try'], tips: 'Món chả cá truyền thống Hà Nội 100+ năm. Nấu ngay tại bàn với thì là và hành.' },
  { id: 'banh-cuon-thanh-van', name: 'Bánh cuốn Thanh Vân', category: 'banh-cuon', address: '14 Hàng Gà, Hoàn Kiếm', district: 'Hoàn Kiếm', price: { min: 35000, max: 55000, unit: 'plate' }, hours: '6:00-12:00', rating: 4.7, coords: [105.8481, 21.0347], tags: ['breakfast', 'traditional'] },
  { id: 'xoi-yen', name: 'Xôi Yến', category: 'sticky-rice', address: '35B Nguyễn Hữu Huân, Hoàn Kiếm', district: 'Hoàn Kiếm', price: { min: 25000, max: 60000, unit: 'portion' }, hours: '6:30-23:00', rating: 4.6, coords: [105.8519, 21.0337], tags: ['breakfast', 'quick', 'cheap'] },

  // === NHÀ HÀNG / ĂN TỐI ===
  { id: 'net-hue', name: 'Nhà hàng Net Huế', category: 'restaurant', address: 'Nhiều chi nhánh', district: 'Hoàn Kiếm', price: { min: 80000, max: 200000, unit: 'person' }, hours: '10:00-22:00', rating: 4.4, tags: ['hue-cuisine', 'air-conditioned', 'chain'] },
  { id: 'quan-an-ngon', name: 'Quán ăn Ngon', category: 'restaurant', address: '18 Phan Bội Châu, Hoàn Kiếm', district: 'Hoàn Kiếm', price: { min: 100000, max: 250000, unit: 'person' }, hours: '7:00-22:00', rating: 4.5, coords: [105.8450, 21.0270], tags: ['variety', 'tourist-friendly', 'vietnamese'] },

  // === ĐỊA ĐIỂM THAM QUAN ===
  { id: 'hoan-kiem-lake', name: 'Hồ Hoàn Kiếm', category: 'attraction', address: 'Đinh Tiên Hoàng, Hoàn Kiếm', district: 'Hoàn Kiếm', price: { min: 0, max: 0, unit: 'free' }, hours: '24/7', rating: 4.9, coords: [105.8522, 21.0285], tags: ['iconic', 'free', 'must-see', 'lake', 'walking'], tips: 'Đi bộ quanh hồ vào sáng sớm hoặc tối là thú vị nhất. Thứ 7-CN đường phố đi bộ.' },
  { id: 'ngoc-son-temple', name: 'Đền Ngọc Sơn', category: 'temple', address: 'Hồ Hoàn Kiếm, Hoàn Kiếm', district: 'Hoàn Kiếm', price: { min: 30000, max: 30000, unit: 'ticket' }, hours: '8:00-18:00', rating: 4.7, coords: [105.8528, 21.0290], tags: ['temple', 'history', 'lake'] },
  { id: 'hoan-kiem-old-quarter', name: 'Phố cổ Hà Nội (36 phố phường)', category: 'attraction', address: 'Hoàn Kiếm', district: 'Hoàn Kiếm', price: { min: 0, max: 0, unit: 'free' }, hours: '24/7', rating: 4.8, coords: [105.8490, 21.0340], tags: ['walking', 'shopping', 'food', 'culture', 'free'], tips: 'Mỗi phố chuyên bán một loại hàng hóa. Hàng Đào (lụa), Hàng Bạc (bạc), Hàng Gai (silk).' },
  { id: 'ho-chi-minh-mausoleum', name: 'Lăng Hồ Chí Minh', category: 'attraction', address: 'Hùng Vương, Ba Đình', district: 'Ba Đình', price: { min: 0, max: 0, unit: 'free' }, hours: 'T3-T5: 7:30-10:30, T7-CN: 7:30-11:00', rating: 4.8, coords: [105.8350, 21.0368], tags: ['history', 'free', 'must-see'], tips: 'Miễn phí nhưng phải ăn mặc nghiêm túc, không quần soóc/váy ngắn.' },
  { id: 'van-mieu', name: 'Văn Miếu - Quốc Tử Giám', category: 'attraction', address: 'Quốc Tử Giám, Đống Đa', district: 'Đống Đa', price: { min: 30000, max: 30000, unit: 'ticket' }, hours: '8:00-17:00', rating: 4.7, coords: [105.8362, 21.0277], tags: ['history', 'temple', 'culture'] },
  { id: 'west-lake', name: 'Hồ Tây', category: 'attraction', address: 'Tây Hồ', district: 'Tây Hồ', price: { min: 0, max: 0, unit: 'free' }, hours: '24/7', rating: 4.7, coords: [105.8280, 21.0540], tags: ['lake', 'cycling', 'sunset', 'free'], tips: 'Thuê xe đạp 30,000-50,000đ/h để đạp quanh hồ 17km. Đẹp nhất lúc hoàng hôn.' },
  { id: 'dong-xuan-market', name: 'Chợ Đồng Xuân', category: 'market', address: 'Đồng Xuân, Hoàn Kiếm', district: 'Hoàn Kiếm', price: { min: 0, max: 0, unit: 'free' }, hours: '6:00-18:00', rating: 4.3, coords: [105.8477, 21.0374], tags: ['market', 'shopping', 'local', 'free'] },

  // === BIA HƠI / NIGHTLIFE ===
  { id: 'bia-hoi-corner', name: 'Bia Hơi Corner (Ngã Tư Tạ Hiện)', category: 'bar', address: 'Tạ Hiện & Lương Ngọc Quyến, Hoàn Kiếm', district: 'Hoàn Kiếm', price: { min: 7000, max: 15000, unit: 'glass' }, hours: '17:00-24:00', rating: 4.5, coords: [105.8510, 21.0346], tags: ['nightlife', 'cheap', 'social', 'backpacker', 'beer'], tips: 'Bia hơi tươi chỉ 7,000-10,000đ/cốc. Không khí sôi động nhất từ 19-22h.' },
];

const HANOI_DISTRICTS = {
  'hoan-kiem': { name: 'Hoàn Kiếm', description: 'Trung tâm lịch sử, Hồ Hoàn Kiếm, Phố Cổ 36 phố phường', highlights: ['Hồ Hoàn Kiếm', 'Phố Cổ', 'Đền Ngọc Sơn'] },
  'ba-dinh': { name: 'Ba Đình', description: 'Trung tâm chính trị, Lăng Hồ Chí Minh, Bảo tàng Hồ Chí Minh', highlights: ['Lăng Bác', 'Chùa Một Cột', 'Phố Phan Đình Phùng'] },
  'tay-ho': { name: 'Tây Hồ', description: 'Hồ Tây, café phong cách, cộng đồng expat', highlights: ['Hồ Tây', 'Đường Tô Ngọc Vân', 'Đền Quán Thánh'] },
  'dong-da': { name: 'Đống Đa', description: 'Văn Miếu, khu phố ẩm thực đa dạng', highlights: ['Văn Miếu', 'Ô Chợ Dừa'] },
};

const TRAVEL_TIPS = [
  { category: 'transport', tip: 'Đặt xe Grab thay vì xe ôm truyền thống để tránh bị chặt chém. GrabBike khoảng 15-25k cho 3km.' },
  { category: 'food', tip: 'Ăn sáng và trưa ở hàng vỉa hè giá 30-80k/người. Tránh nhà hàng có menu dịch tiếng Anh giá sẽ cao hơn 2-3 lần.' },
  { category: 'money', tip: 'ATM rút tiền VNĐ, phí khoảng 50-100k/lần. Mang tiền mặt khi đi ăn hàng vỉa hè.' },
  { category: 'weather', tip: 'Hà Nội có 4 mùa rõ rệt. Tháng 10-12 và tháng 3-4 là thời gian đẹp nhất để ghé thăm.' },
  { category: 'culture', tip: 'Cởi giày khi vào đền/chùa. Ăn mặc kín đáo ở những nơi tôn giáo.' },
  { category: 'safety', tip: 'Giữ chặt túi xách ở phố cổ và chợ đông người. Không để điện thoại lên bàn ở vỉa hè.' },
];

const ITINERARY_TEMPLATES = {
  '1h': { name: '1 giờ', spots: 2, types: ['cafe', 'attraction'] },
  '2h': { name: '2 giờ', spots: 3, types: ['food', 'attraction', 'cafe'] },
  '3h': { name: '3 giờ', spots: 4, types: ['food', 'attraction', 'cafe', 'market'] },
  '4h': { name: 'Nửa ngày', spots: 5, types: ['food', 'attraction', 'cafe', 'market', 'shopping'] },
  'fullday': { name: 'Cả ngày', spots: 8, types: ['breakfast', 'attraction', 'lunch', 'cafe', 'attraction', 'dinner', 'bar'] },
};

module.exports = { HANOI_VENDORS, HANOI_DISTRICTS, TRAVEL_TIPS, ITINERARY_TEMPLATES };
