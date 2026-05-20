import React from 'react';

const features = [
  {
    icon: '🤖',
    color: '#1A56DB',
    bg: '#EBF2FF',
    badge: 'AI-Powered',
    badgeColor: '#1A56DB',
    badgeBg: '#EBF2FF',
    title: 'Smart Itinerary Planner',
    desc: 'Get a personalized 60–180 minute itinerary in seconds. AI suggests where to eat, what to see, and how much to budget — optimized for your location.',
    features: ['Real-time route optimization', 'Budget-aware suggestions', 'Local hidden gems'],
  },
  {
    icon: '💰',
    color: '#FF6F00',
    bg: '#FFF8EB',
    badge: 'Crowdsourced',
    badgeColor: '#FF6F00',
    badgeBg: '#FFF8EB',
    title: 'Transparent Pricing',
    desc: 'Crowdsourced price data verified with our consensus algorithm. Never get overcharged again — know what locals actually pay.',
    features: ['Cross-verified prices', 'Price history trends', 'Tourist vs local rates'],
  },
  {
    icon: '🗺️',
    color: '#7C3AED',
    bg: '#F5EDFF',
    badge: 'Interactive',
    badgeColor: '#7C3AED',
    badgeBg: '#F5EDFF',
    title: 'Interactive Map',
    desc: 'Explore Hanoi\'s 36 Streets and beyond with our live map. Filter by cuisine, budget, and distance from your current location.',
    features: ['500+ verified locations', 'Real-time walk directions', 'Offline map access'],
  },
  {
    icon: '🏮',
    color: '#059669',
    bg: '#ECFDF5',
    badge: 'Exclusive',
    badgeColor: '#059669',
    badgeBg: '#ECFDF5',
    title: "Local's Secrets",
    desc: 'Access the hidden alleys, rooftop cafés, and family-run restaurants that only Hanoi locals know. Updated weekly by our community.',
    features: ['Community-curated spots', 'Weekly new discoveries', 'Story-rich content'],
  },
];

const FeaturesSection = () => (
  <section id="features" className="section" style={{ background: 'rgba(249, 250, 251, 0.85)', backdropFilter: 'blur(12px)' }}>
    <div className="container">
      <div className="section-header reveal">
        <span className="badge badge-blue" style={{ marginBottom: 14 }}>✦ Features</span>
        <h2>Everything You Need for<br /><span className="grad-blue">The Perfect Hanoi Trip</span></h2>
        <p style={{ marginTop: 14 }}>Four powerful tools, one seamless experience. Powered by AI and local community.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24 }}>
        {features.map((f, i) => (
          <div key={i} className="card reveal" style={{ padding: '32px 28px', animationDelay: `${i * 0.1}s`, cursor: 'default' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = f.color + '30'; e.currentTarget.style.boxShadow = `0 12px 40px ${f.color}18`; e.currentTarget.style.transform = 'translateY(-6px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
            {/* Icon */}
            <div style={{ width: 64, height: 64, borderRadius: 18, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: 20, boxShadow: `0 4px 16px ${f.color}18` }}>
              {f.icon}
            </div>
            {/* Badge */}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 50, fontSize: '.72rem', fontWeight: 600, background: f.badgeBg, color: f.badgeColor, marginBottom: 12, border: `1px solid ${f.color}20` }}>
              {f.badge}
            </span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 10, color: '#111827' }}>{f.title}</h3>
            <p style={{ color: '#6B7280', fontSize: '.88rem', lineHeight: 1.7, marginBottom: 20 }}>{f.desc}</p>
            {/* Feature list */}
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {f.features.map((feat, j) => (
                <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.82rem', color: '#4B5563' }}>
                  <span style={{ color: f.color, fontWeight: 700, fontSize: '1rem' }}>✓</span> {feat}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="reveal" style={{ textAlign: 'center', marginTop: 56 }}>
        <p style={{ color: '#6B7280', marginBottom: 20, fontSize: '.95rem' }}>Join 10,000+ travelers who explore Hanoi smarter</p>
        <a href="/planner" className="btn btn-primary btn-lg">Explore All Features →</a>
      </div>
    </div>
  </section>
);

export default FeaturesSection;
