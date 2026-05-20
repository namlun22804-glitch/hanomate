import React, { useState } from 'react';

const reviews = [
  { name: 'Sarah M.', role: 'Travel Blogger', country: '🇬🇧', avatar: 'SM', color: '#1A56DB', rating: 5, text: 'HanoMate completely transformed my Hanoi trip. The AI suggested a perfect 3-hour food tour in the Old Quarter that I never would have found on my own. The price transparency feature saved me from overpaying multiple times!' },
  { name: 'Kenji T.', role: 'Solo Traveler', country: '🇯🇵', avatar: 'KT', color: '#7C3AED', rating: 5, text: 'As someone who doesn\'t speak Vietnamese, navigating Hanoi felt overwhelming until I found HanoMate. The AI understands context and local culture. It suggested egg coffee at Café Giang — a true hidden gem!' },
  { name: 'Linh N.', role: 'Local Guide', country: '🇻🇳', avatar: 'LN', color: '#059669', rating: 5, text: 'Even as a Hanoian, I discovered new spots through this app! The community price reports are incredibly accurate. I\'ve been using it to plan tours for my clients and they love it.' },
  { name: 'Marco R.', role: 'Food Enthusiast', country: '🇮🇹', avatar: 'MR', color: '#FF6F00', rating: 5, text: 'The best travel app I\'ve ever used. Planned a whole day in Hanoi in minutes — bún bò, bánh mì, phở, all with walking directions and real prices. Absolutely incredible technology!' },
  { name: 'Emma L.', role: 'Digital Nomad', country: '🇺🇸', avatar: 'EL', color: '#1A56DB', rating: 5, text: 'I spent 2 weeks in Hanoi and used HanoMate every single day. The offline map feature is a lifesaver when you\'re in the alleyways with no signal. 10/10 would recommend to every traveler!' },
  { name: 'Nadia K.', role: 'Backpacker', country: '🇩🇪', avatar: 'NK', color: '#7C3AED', rating: 5, text: 'Budget travel in Hanoi is so much easier with transparent pricing. I knew exactly what things should cost and never felt like I was being scammed. This app should be mandatory for every tourist!' },
];

const Stars = ({ n }) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {[...Array(n)].map((_, i) => <span key={i} style={{ color: '#F59E0B', fontSize: '.9rem' }}>★</span>)}
  </div>
);

const ReviewsSection = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="reviews" className="section" style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="badge badge-green" style={{ marginBottom: 14 }}>⭐ Reviews</span>
          <h2>Loved by <span className="grad-blue">10,000+ Travelers</span></h2>
          <p style={{ marginTop: 14 }}>From solo backpackers to travel bloggers — hear what they say about HanoMate.</p>
        </div>

        {/* Rating summary */}
        <div className="reveal" style={{ display: 'flex', justifyContent: 'center', gap: 48, marginBottom: 56, flexWrap: 'wrap' }}>
          {[['4.9', '★ App Rating', '#F59E0B'], ['10K+', 'Active Users', '#1A56DB'], ['98%', 'Satisfaction', '#059669']].map(([val, lbl, col]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: col, fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: '-0.03em' }}>{val}</div>
              <div style={{ fontSize: '.82rem', color: '#9CA3AF', fontWeight: 500, marginTop: 2 }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Review grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
          {reviews.map((r, i) => (
            <div key={i} className="card reveal" style={{ padding: '28px 24px', cursor: 'default', animationDelay: `${i * 0.08}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${r.color}18`, border: `2px solid ${r.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '.82rem', color: r.color, flexShrink: 0 }}>
                    {r.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '.9rem', color: '#111827', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {r.name} <span>{r.country}</span>
                    </div>
                    <div style={{ fontSize: '.75rem', color: '#9CA3AF' }}>{r.role}</div>
                  </div>
                </div>
                <Stars n={r.rating} />
              </div>
              <p style={{ color: '#4B5563', fontSize: '.88rem', lineHeight: 1.75, margin: 0 }}>"{r.text}"</p>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, marginTop: 48, flexWrap: 'wrap' }}>
          {['Featured in TechCrunch', 'Top App Vietnam 2025', 'Google AI Partner', 'Verified Reviews'].map(b => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9CA3AF', fontSize: '.82rem', fontWeight: 500 }}>
              <span style={{ color: '#D1D5DB' }}>✦</span> {b}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
