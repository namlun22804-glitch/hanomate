import React from 'react';
import { Link } from 'react-router-dom';

const steps = [
  { num: '01', icon: '📍', title: 'Share Your Location', desc: 'Tell us where you are in Hanoi and how much time you have. We\'ll handle the rest.', color: '#1A56DB' },
  { num: '02', icon: '🤖', title: 'AI Builds Your Plan', desc: 'Our Gemini-powered AI crafts a personalized itinerary with food spots, attractions, and timing.', color: '#7C3AED' },
  { num: '03', icon: '💰', title: 'See Real Prices', desc: 'Every recommendation comes with verified, crowdsourced prices so you budget accurately.', color: '#FF6F00' },
  { num: '04', icon: '🗺️', title: 'Navigate & Explore', desc: 'Follow turn-by-turn directions on our interactive map. Rate spots to help the community.', color: '#059669' },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="section" style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)' }}>
    <div className="container">
      <div className="section-header reveal">
        <span className="badge badge-purple" style={{ marginBottom: 14 }}>⚡ How It Works</span>
        <h2>Plan Your Perfect Hanoi Day<br /><span style={{ color: '#7C3AED' }}>in 4 Simple Steps</span></h2>
        <p style={{ marginTop: 14 }}>From zero to full itinerary in under 30 seconds. No signup required.</p>
      </div>

      {/* Steps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 32, position: 'relative' }}>
        {/* Connector line */}
        <div className="hide-mobile" style={{ position: 'absolute', top: 48, left: '12.5%', right: '12.5%', height: 2, background: 'linear-gradient(90deg,#1A56DB,#7C3AED,#FF6F00,#059669)', opacity: 0.2, zIndex: 0 }} />

        {steps.map((s, i) => (
          <div key={i} className="reveal" style={{ textAlign: 'center', position: 'relative', zIndex: 1, animationDelay: `${i * 0.15}s` }}>
            {/* Step number bubble */}
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${s.color}15`, border: `2px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', position: 'relative' }}>
              <span style={{ fontSize: '1.8rem' }}>{s.icon}</span>
              <span style={{ position: 'absolute', top: -8, right: -8, width: 24, height: 24, borderRadius: '50%', background: s.color, color: '#fff', fontSize: '.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
            </div>
            <div style={{ fontSize: '.75rem', fontWeight: 700, color: s.color, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>{s.num}</div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 10, color: '#111827' }}>{s.title}</h3>
            <p style={{ color: '#6B7280', fontSize: '.88rem', lineHeight: 1.7, maxWidth: 220, margin: '0 auto' }}>{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Demo block */}
      <div className="reveal" style={{ marginTop: 72, background: 'linear-gradient(135deg,#0B192C,#1A2F5A)', borderRadius: 28, padding: '48px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'radial-gradient(circle,rgba(26,86,219,.3),transparent 70%)', borderRadius: '50%' }} />
        <div>
          <span className="badge" style={{ background: 'rgba(26,86,219,.2)', color: '#5B8FF9', border: '1px solid rgba(26,86,219,.3)', marginBottom: 20 }}>🚀 Live Demo</span>
          <h3 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', color: '#fff', fontWeight: 800, marginBottom: 14, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Try It Now — No Account Needed</h3>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '.95rem', lineHeight: 1.75, marginBottom: 28 }}>Just type what you want to do in Hanoi and our AI will instantly create your plan. Free forever for basic trips.</p>
          <Link to="/planner" className="btn btn-white btn-lg">Plan My Trip Now →</Link>
        </div>
        <div className="hide-mobile">
          {/* Mini demo preview */}
          <div style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 20, padding: 24 }}>
            <div style={{ background: 'rgba(26,86,219,.3)', borderRadius: 12, padding: '10px 16px', marginBottom: 12 }}>
              <p style={{ color: '#fff', fontSize: '.83rem', margin: 0 }}>"I have 2 hours near Hoan Kiem Lake and love street food 🍜"</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 12, padding: '14px 16px' }}>
              <p style={{ color: 'rgba(255,255,255,.85)', fontSize: '.83rem', margin: 0, lineHeight: 1.65 }}>
                ✨ <strong style={{ color: '#fff' }}>Your 2-Hour Foodie Tour:</strong><br />
                🕐 9:00 — Bún chả Hương Liên (est. 65,000đ)<br />
                🕐 10:00 — Egg coffee at Café Giang (est. 35,000đ)<br />
                🕐 10:45 — Bánh mì 25 (est. 25,000đ)<br />
                <span style={{ color: '#10B981', fontSize: '.78rem' }}>💰 Total: ~125,000đ · Verified prices</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
