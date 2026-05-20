import React from 'react';

const reviews = [
  { name: 'Sarah M.', role: 'Travel Blogger', country: '🇬🇧', avatar: 'SM', color: '#FFD700', rating: 5, text: 'HanoMate đã thay đổi hoàn toàn chuyến đi Hà Nội của tôi. AI gợi ý một tour ẩm thực 3 tiếng hoàn hảo ở Phố Cổ mà tôi không bao giờ tự tìm được. Tính năng minh bạch giá cả đã cứu tôi khỏi bị chặt chém nhiều lần!' },
  { name: 'Kenji T.', role: 'Solo Traveler', country: '🇯🇵', avatar: 'KT', color: '#FF8C00', rating: 5, text: 'Là người không biết tiếng Việt, đi Hà Nội rất choáng ngợp cho đến khi tôi tìm thấy HanoMate. AI hiểu văn hoá địa phương. Nó gợi ý cà phê trứng tại Cà Phê Giảng — một viên ngọc ẩn thực sự!' },
  { name: 'Linh N.', role: 'Hướng Dẫn Viên', country: '🇻🇳', avatar: 'LN', color: '#10B981', rating: 5, text: 'Dù là người Hà Nội gốc, tôi vẫn khám phá ra những địa điểm mới qua ứng dụng này! Báo cáo giá từ cộng đồng cực kỳ chính xác. Tôi dùng nó để lên kế hoạch tour cho khách và họ rất thích.' },
  { name: 'Marco R.', role: 'Food Enthusiast', country: '🇮🇹', avatar: 'MR', color: '#A78BFA', rating: 5, text: 'App du lịch tốt nhất tôi từng dùng. Lên kế hoạch cả ngày ở Hà Nội trong vài phút — bún bò, bánh mì, phở, tất cả với chỉ đường đi bộ và giá thực tế. Công nghệ đỉnh cao tuyệt đối!' },
  { name: 'Emma L.', role: 'Digital Nomad', country: '🇺🇸', avatar: 'EL', color: '#FFD700', rating: 5, text: 'Tôi ở Hà Nội 2 tuần và dùng HanoMate mỗi ngày. Tính năng bản đồ offline là cứu cánh khi bạn lọt vào ngõ hẻm không có sóng. 10/10 sẽ giới thiệu cho mọi du khách!' },
  { name: 'Nadia K.', role: 'Backpacker', country: '🇩🇪', avatar: 'NK', color: '#FF8C00', rating: 5, text: 'Du lịch tiết kiệm ở Hà Nội dễ dàng hơn rất nhiều với tính năng minh bạch giá. Tôi biết chính xác mọi thứ đáng bao nhiêu tiền và không cảm thấy bị lừa bao giờ. App này nên bắt buộc với mọi khách du lịch!' },
];

const Stars = ({ n }) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {[...Array(n)].map((_, i) => <span key={i} style={{ color: '#F59E0B', fontSize: '.9rem' }}>★</span>)}
  </div>
);

const ReviewsSection = () => (
  <section id="reviews" style={{ padding: '80px 0', background: 'transparent' }}>
    <div className="container">
      <div className="section-header reveal" style={{ marginBottom: 48 }}>
        <span className="badge" style={{ marginBottom: 14, background: 'rgba(212,160,23,0.15)', color: '#D4A017', borderColor: 'rgba(212,160,23,0.3)' }}>⭐ Đánh Giá</span>
        <h2 style={{ color: '#fff' }}>Được Yêu Thích Bởi <span style={{ background: 'linear-gradient(135deg,#FFD700,#FF8C00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>10,000+ Du Khách</span></h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 14 }}>Từ phượt thủ đơn độc đến blogger du lịch — nghe họ nói về HanoMate.</p>
      </div>

      {/* Stats */}
      <div className="reveal" style={{ display: 'flex', justifyContent: 'center', gap: 56, marginBottom: 56, flexWrap: 'wrap' }}>
        {[['4.9', '★ Đánh Giá', '#F59E0B'], ['10K+', 'Người Dùng', '#FFD700'], ['98%', 'Hài Lòng', '#10B981']].map(([val, lbl, col]) => (
          <div key={lbl} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: col, fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: '-0.03em' }}>{val}</div>
            <div style={{ fontSize: '.82rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500, marginTop: 2 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Review grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
        {reviews.map((r, i) => (
          <div key={i} className="reveal" style={{
            padding: '24px', animationDelay: `${i * 0.08}s`, borderRadius: 16,
            background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.08)',
            transition: 'transform 0.3s ease, background 0.3s ease',
            cursor: 'default',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'none'; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${r.color}22`, border: `2px solid ${r.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '.82rem', color: r.color, flexShrink: 0 }}>
                  {r.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {r.name} <span>{r.country}</span>
                  </div>
                  <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,0.45)' }}>{r.role}</div>
                </div>
              </div>
              <Stars n={r.rating} />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '.87rem', lineHeight: 1.75, margin: 0 }}>"{r.text}"</p>
          </div>
        ))}
      </div>

      <div className="reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, marginTop: 48, flexWrap: 'wrap' }}>
        {['Featured on TechCrunch', 'Top App Vietnam 2025', 'Google AI Partner', 'Verified Reviews'].map(b => (
          <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.35)', fontSize: '.82rem', fontWeight: 500 }}>
            <span style={{ color: '#D4A017' }}>✦</span> {b}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ReviewsSection;
