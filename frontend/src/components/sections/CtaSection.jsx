import React from 'react';
import { Link } from 'react-router-dom';

const CtaSection = () => (
  <section style={{ padding: '96px 24px', background: 'linear-gradient(135deg,rgba(11,25,44,0.85) 0%,rgba(26,47,90,0.85) 60%,rgba(11,25,44,0.85) 100%)', backdropFilter: 'blur(12px)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
    {/* Background decorations */}
    <div style={{ position: 'absolute', top: -80, left: -80, width: 320, height: 320, background: 'radial-gradient(circle,rgba(26,86,219,.3),transparent 70%)', borderRadius: '50%' }} />
    <div style={{ position: 'absolute', bottom: -60, right: -60, width: 280, height: 280, background: 'radial-gradient(circle,rgba(255,111,0,.2),transparent 70%)', borderRadius: '50%' }} />
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

    <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
      <span className="badge reveal" style={{ background: 'rgba(26,86,219,.2)', color: '#5B8FF9', border: '1px solid rgba(26,86,219,.3)', marginBottom: 24, display: 'inline-flex' }}>
        🚀 Get Started Today
      </span>
      <h2 className="reveal" style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', color: '#fff', fontWeight: 900, marginBottom: 18, fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: '-0.03em', lineHeight: 1.15 }}>
        Your Perfect Hanoi Trip<br />
        <span style={{ background: 'linear-gradient(135deg,#5B8FF9,#60D5FA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Starts Right Now</span>
      </h2>
      <p className="reveal" style={{ color: 'rgba(255,255,255,.68)', fontSize: '1.1rem', lineHeight: 1.75, marginBottom: 40, maxWidth: 520, margin: '0 auto 40px' }}>
        Join 10,000+ travelers who explore Hanoi smarter with AI. Free forever for basic use. No signup required to get your first itinerary.
      </p>

      <div className="reveal" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
        <Link to="/planner" className="btn btn-white btn-lg" style={{ fontWeight: 700 }}>
          🗺️ Plan My Trip — Free
        </Link>
        <a href="#features" className="btn btn-ghost btn-lg">
          See All Features
        </a>
      </div>

      <div className="reveal" style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
        {['✓ No credit card', '✓ AI-powered plans', '✓ Real local prices', '✓ Works offline'].map(t => (
          <span key={t} style={{ color: 'rgba(255,255,255,.5)', fontSize: '.82rem', fontWeight: 500 }}>{t}</span>
        ))}
      </div>
    </div>
  </section>
);

export default CtaSection;
