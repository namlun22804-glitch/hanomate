import React from 'react';

// Ảnh các địa danh nổi tiếng Hà Nội
const HANOI_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?q=80&w=800&auto=format&fit=crop',
    label: 'Phố Cổ 36 Phường',
  },
  {
    url: 'https://images.unsplash.com/photo-1599708153386-62bf23145451?q=80&w=800&auto=format&fit=crop',
    label: 'Hồ Hoàn Kiếm',
  },
  {
    url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=800&auto=format&fit=crop',
    label: 'Ẩm Thực Đường Phố',
  },
  {
    url: 'https://images.unsplash.com/photo-1569441941693-91fe0d15acb0?q=80&w=800&auto=format&fit=crop',
    label: 'Văn Miếu',
  },
];

const features = [
  {
    icon: '🤖',
    color: '#D4A017',
    photo: HANOI_PHOTOS[0],
    badge: 'AI-Powered',
    title: 'Smart Itinerary Planner',
    desc: 'Lịch trình cá nhân hoá 60–180 phút chỉ trong vài giây. AI gợi ý điểm ăn, điểm tham quan và ngân sách — tối ưu theo vị trí của bạn.',
    features: ['Tối ưu lộ trình thực tế', 'Gợi ý theo ngân sách', 'Góc khuất chỉ người địa phương biết'],
  },
  {
    icon: '💰',
    color: '#FF6F00',
    photo: HANOI_PHOTOS[2],
    badge: 'Crowdsourced',
    title: 'Giá Cả Minh Bạch',
    desc: 'Dữ liệu giá được cộng đồng đóng góp và xác minh bằng thuật toán đồng thuận. Không bao giờ bị chặt chém — biết giá thật như người địa phương.',
    features: ['Giá được đối chiếu chéo', 'Lịch sử xu hướng giá', 'Giá khách/giá dân địa phương'],
  },
  {
    icon: '🗺️',
    color: '#7C3AED',
    photo: HANOI_PHOTOS[1],
    badge: 'Interactive',
    title: 'Bản Đồ Tương Tác',
    desc: 'Khám phá 36 phố phường Hà Nội và hơn thế nữa với bản đồ trực tuyến. Lọc theo ẩm thực, ngân sách và khoảng cách từ vị trí bạn.',
    features: ['500+ địa điểm đã xác minh', 'Chỉ đường đi bộ thực tế', 'Dùng được offline'],
  },
  {
    icon: '🏮',
    color: '#059669',
    photo: HANOI_PHOTOS[3],
    badge: 'Exclusive',
    title: 'Bí Mật Người Địa Phương',
    desc: 'Khám phá những con ngõ nhỏ, cà phê sân thượng và nhà hàng gia truyền mà chỉ người Hà Nội mới biết. Cập nhật hàng tuần.',
    features: ['Địa điểm từ cộng đồng', 'Khám phá mới mỗi tuần', 'Nội dung phong phú về văn hoá'],
  },
];

const FeaturesSection = () => (
  <section id="features" className="section" style={{ background: 'transparent', padding: '80px 0' }}>
    <div className="container">
      <div className="section-header reveal" style={{ marginBottom: 60 }}>
        <span className="badge badge-blue" style={{ marginBottom: 14, background: 'rgba(212,160,23,0.15)', color: '#D4A017', borderColor: 'rgba(212,160,23,0.3)' }}>✦ Tính Năng</span>
        <h2 style={{ color: '#fff' }}>Mọi Thứ Bạn Cần Cho<br /><span style={{ background: 'linear-gradient(135deg,#FFD700,#FF8C00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Chuyến Đi Hà Nội Hoàn Hảo</span></h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 14 }}>Bốn công cụ mạnh mẽ, một trải nghiệm liền mạch. Được hỗ trợ bởi AI và cộng đồng người địa phương.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
        {features.map((f, i) => (
          <div key={i} className="reveal" style={{ animationDelay: `${i * 0.1}s`, borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'default' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'; }}>
            {/* Photo header */}
            <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
              <img src={f.photo.url} alt={f.photo.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)' }} />
              <div style={{ position: 'absolute', bottom: 12, left: 16 }}>
                <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '.72rem', fontWeight: 600, padding: '4px 12px', borderRadius: 50 }}>{f.badge}</span>
              </div>
              <div style={{ position: 'absolute', top: 12, right: 14, fontSize: '1.6rem' }}>{f.icon}</div>
            </div>
            {/* Content */}
            <div style={{ background: 'rgba(15,20,40,0.82)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderTop: 'none', padding: '20px 22px 24px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 10, color: '#fff' }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '.85rem', lineHeight: 1.7, marginBottom: 16 }}>{f.desc}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
                {f.features.map((feat, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.80rem', color: 'rgba(255,255,255,0.75)' }}>
                    <span style={{ color: f.color, fontWeight: 700 }}>✓</span> {feat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="reveal" style={{ textAlign: 'center', marginTop: 56 }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 20, fontSize: '.95rem' }}>Tham gia cùng 10,000+ du khách khám phá Hà Nội thông minh hơn</p>
        <a href="/planner" className="btn btn-primary btn-lg" style={{ background: 'linear-gradient(135deg,#D4A017,#FF8C00)', border: 'none' }}>Khám Phá Tất Cả Tính Năng →</a>
      </div>
    </div>
  </section>
);

export default FeaturesSection;
