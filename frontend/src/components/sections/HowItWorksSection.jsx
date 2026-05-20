import React from 'react';
import { Link } from 'react-router-dom';

// Ảnh Cầu Long Biên làm nền cho demo block
const LONG_BIEN_BG = 'https://images.unsplash.com/photo-1591608971362-f08b2a75731a?q=80&w=1600&auto=format&fit=crop';

const steps = [
  { icon: '📍', title: 'Chia Sẻ Vị Trí', desc: 'Cho chúng tôi biết bạn đang ở đâu tại Hà Nội và bạn có bao nhiêu thời gian. AI sẽ lo phần còn lại.', color: '#FFD700' },
  { icon: '🤖', title: 'AI Lập Lịch Trình', desc: 'AI được hỗ trợ bởi Gemini tạo ra hành trình cá nhân hoá với địa điểm ăn, tham quan và thời gian tối ưu.', color: '#FF8C00' },
  { icon: '💰', title: 'Xem Giá Thực Tế', desc: 'Mỗi gợi ý đều có giá đã được xác minh từ cộng đồng để bạn lên ngân sách chính xác.', color: '#10B981' },
  { icon: '🗺️', title: 'Điều Hướng & Khám Phá', desc: 'Theo dõi chỉ đường chi tiết trên bản đồ tương tác. Đánh giá địa điểm để giúp cộng đồng.', color: '#A78BFA' },
];

const HowItWorksSection = () => (
  <section id="how-it-works" style={{ padding: '80px 0', background: 'transparent' }}>
    <div className="container">
      <div className="section-header reveal" style={{ marginBottom: 60 }}>
        <span className="badge" style={{ marginBottom: 14, background: 'rgba(212,160,23,0.15)', color: '#D4A017', borderColor: 'rgba(212,160,23,0.3)' }}>⚡ Cách Hoạt Động</span>
        <h2 style={{ color: '#fff' }}>Lên Kế Hoạch Ngày Hoàn Hảo Tại Hà Nội<br /><span style={{ background: 'linear-gradient(135deg,#FFD700,#FF8C00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Chỉ 4 Bước Đơn Giản</span></h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 14 }}>Từ không có gì đến lịch trình hoàn chỉnh trong dưới 30 giây.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24, position: 'relative' }}>
        {steps.map((s, i) => (
          <div key={i} className="reveal" style={{ textAlign: 'center', animationDelay: `${i * 0.15}s` }}>
            <div style={{ width: 80, height: 80, borderRadius: 24, background: `${s.color}18`, border: `2px solid ${s.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', position: 'relative', backdropFilter: 'blur(8px)' }}>
              <span style={{ fontSize: '2rem' }}>{s.icon}</span>
              <span style={{ position: 'absolute', top: -10, right: -10, width: 26, height: 26, borderRadius: '50%', background: s.color, color: '#000', fontSize: '.72rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 10, color: '#fff' }}>{s.title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '.85rem', lineHeight: 1.7, maxWidth: 200, margin: '0 auto' }}>{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Demo block with Long Bien Bridge background */}
      <div className="reveal" style={{
        marginTop: 72, borderRadius: 24, padding: '52px 44px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center',
        overflow: 'hidden', position: 'relative',
        backgroundImage: `url(${LONG_BIEN_BG})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,10,25,0.82)', backdropFilter: 'blur(2px)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="badge" style={{ background: 'rgba(212,160,23,0.2)', color: '#FFD700', border: '1px solid rgba(212,160,23,0.35)', marginBottom: 20 }}>🚀 Thử Ngay</span>
          <h3 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', color: '#fff', fontWeight: 800, marginBottom: 14, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Không Cần Tài Khoản — Thử Ngay Bây Giờ</h3>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '.95rem', lineHeight: 1.75, marginBottom: 28 }}>Chỉ cần gõ điều bạn muốn làm ở Hà Nội và AI sẽ tạo kế hoạch ngay lập tức. Miễn phí vĩnh viễn cho các chuyến cơ bản.</p>
          <Link to="/planner" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 50, background: 'linear-gradient(135deg,#D4A017,#FF8C00)', color: '#fff', fontWeight: 700, fontSize: '.95rem', textDecoration: 'none', boxShadow: '0 8px 24px rgba(212,160,23,0.4)' }}>
            Lên Kế Hoạch Ngay →
          </Link>
        </div>
        <div className="hide-mobile" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 20, padding: 24, backdropFilter: 'blur(12px)' }}>
            <div style={{ background: 'rgba(212,160,23,0.25)', borderRadius: 12, padding: '10px 16px', marginBottom: 12 }}>
              <p style={{ color: '#fff', fontSize: '.83rem', margin: 0 }}>"Tôi có 2 tiếng gần Hồ Gươm và thích đồ ăn đường phố 🍜"</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ color: 'rgba(255,255,255,.85)', fontSize: '.83rem', margin: 0, lineHeight: 1.65 }}>
                ✨ <strong style={{ color: '#FFD700' }}>Tour Ẩm Thực 2 Tiếng Của Bạn:</strong><br />
                🕐 9:00 — Bún chả Hương Liên (~65.000đ)<br />
                🕐 10:00 — Cà phê trứng Cà Phê Giảng (~35.000đ)<br />
                🕐 10:45 — Bánh mì 25 (~25.000đ)<br />
                <span style={{ color: '#10B981', fontSize: '.78rem' }}>💰 Tổng: ~125.000đ · Giá đã xác minh</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
