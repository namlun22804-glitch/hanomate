import React from 'react';
import { Link } from 'react-router-dom';

const stats = [
  { value: '10,000+', label: 'Active Users' },
  { value: '500+', label: 'Local Spots' },
  { value: '4.9★', label: 'App Rating' },
  { value: '100%', label: 'Free to Use' },
];

const HeroSection = () => (
  <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'transparent' }}>
    {/* Animated background blobs */}
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(26,86,219,.35) 0%, transparent 70%)', borderRadius: '50%', animation: 'float 6s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(255,111,0,.2) 0%, transparent 70%)', borderRadius: '50%', animation: 'float 8s ease-in-out infinite reverse' }} />
      <div style={{ position: 'absolute', top: '40%', left: '30%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(124,58,237,.15) 0%, transparent 70%)', borderRadius: '50%', animation: 'float 7s ease-in-out infinite 1s' }} />
      {/* Grid pattern overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.6 }} />
    </div>

    <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: 100, paddingBottom: 60 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        {/* Left content */}
        <div className="animate-fade-up">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(26,86,219,.2)', border: '1px solid rgba(26,86,219,.4)', borderRadius: 50, padding: '6px 16px', marginBottom: 28 }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, background: '#10B981', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            <span style={{ color: 'rgba(255,255,255,.9)', fontSize: '.82rem', fontWeight: 600 }}>🏮 AI Travel Assistant #1 in Hanoi</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontWeight: 900, color: '#fff', marginBottom: 20, lineHeight: 1.1, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
            Explore Hanoi<br />
            <span style={{ background: 'linear-gradient(135deg,#5B8FF9,#60D5FA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Like a Local</span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,.72)', fontSize: '1.1rem', maxWidth: 480, marginBottom: 36, lineHeight: 1.75 }}>
            Smart itinerary planning, transparent pricing, and hidden gems — all powered by AI. Your perfect Hanoi adventure starts here.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 48 }}>
            <Link to="/planner" className="btn btn-primary btn-lg" style={{ fontSize: '1rem' }}>
              🚀 Start Exploring Free
            </Link>
            <a href="#how-it-works" className="btn btn-ghost btn-lg" style={{ fontSize: '1rem' }}>
              Watch Demo ▶
            </a>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', fontSize: '.82rem', color: 'rgba(255,255,255,.5)' }}>
              {['✓ No credit card', '✓ Free forever', '✓ AI-powered'].map(t => (
                <span key={t} style={{ marginRight: 16, color: 'rgba(255,255,255,.55)' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right — App mockup card */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="animate-fade-up hide-mobile">
          <div style={{ position: 'relative', width: '100%', maxWidth: 420 }}>
            {/* Main card */}
            <div style={{ background: 'rgba(255,255,255,.06)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 28, padding: 28, boxShadow: '0 32px 80px rgba(0,0,0,.4)' }}>
              {/* Chat header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#1A56DB,#5B8FF9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>H</div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '.9rem' }}>HanoMate AI</div>
                  <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '.75rem' }}>● Online — Ready to plan!</div>
                </div>
              </div>
              {/* Chat bubbles */}
              {[
                { role: 'user', text: 'Plan a 3-hour food tour in Hoan Kiem 🍜' },
                { role: 'ai', text: '✨ Perfect! Here\'s your personalized itinerary:\n\n🕐 9:00 AM — Bún chả Hương Liên (2km away)\n🕐 10:30 AM — Egg coffee at Café Giang\n🕐 11:30 AM — Bánh mì 25 on Đinh Tiên Hoàng' },
                { role: 'ai', text: '💰 Est. total cost: 120,000đ — verified prices!' },
              ].map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
                  <div style={{ background: m.role === 'user' ? '#1A56DB' : 'rgba(255,255,255,.1)', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '10px 14px', maxWidth: '85%' }}>
                    <p style={{ color: '#fff', fontSize: '.82rem', lineHeight: 1.55, whiteSpace: 'pre-line', margin: 0 }}>{m.text}</p>
                  </div>
                </div>
              ))}
              {/* Input field */}
              <div style={{ display: 'flex', gap: 8, marginTop: 16, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 50, padding: '8px 8px 8px 16px', alignItems: 'center' }}>
                <span style={{ flex: 1, color: 'rgba(255,255,255,.4)', fontSize: '.83rem' }}>Ask me anything about Hanoi...</span>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#1A56DB', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                  <span style={{ color: '#fff', fontSize: '.9rem' }}>↑</span>
                </div>
              </div>
            </div>

            {/* Floating info cards */}
            <div style={{ position: 'absolute', top: -24, right: -24, background: '#fff', borderRadius: 16, padding: '12px 16px', boxShadow: '0 8px 32px rgba(0,0,0,.2)', minWidth: 150, animation: 'float 4s ease-in-out infinite' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.4rem' }}>📍</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '.82rem', color: '#111827' }}>500+ Spots</div>
                  <div style={{ fontSize: '.72rem', color: '#6B7280' }}>Verified locations</div>
                </div>
              </div>
            </div>

            <div style={{ position: 'absolute', bottom: -20, left: -24, background: 'linear-gradient(135deg,#1A56DB,#5B8FF9)', borderRadius: 16, padding: '12px 16px', boxShadow: '0 8px 32px rgba(26,86,219,.4)', animation: 'float 5s ease-in-out infinite 1.5s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.3rem' }}>✨</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '.82rem', color: '#fff' }}>AI-Powered</div>
                  <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.7)' }}>Instant itineraries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ marginTop: 72, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 20, overflow: 'hidden' }} className="reveal">
        {stats.map((s, i) => (
          <div key={i} style={{ padding: '24px', textAlign: 'center', borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,.08)' : 'none' }}>
            <div style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 900, color: '#fff', fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: '-0.03em' }}>{s.value}</div>
            <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.5)', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HeroSection;
