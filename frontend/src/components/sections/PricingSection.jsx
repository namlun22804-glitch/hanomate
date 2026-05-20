import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Explorer',
    price: { monthly: 0, yearly: 0 },
    desc: 'Perfect for first-time visitors and casual explorers.',
    color: '#6B7280',
    border: '#E5E7EB',
    bg: '#F9FAFB',
    cta: 'Start Free',
    ctaClass: 'btn-gray',
    features: [
      { text: '5 AI itineraries/month', included: true },
      { text: 'Basic map access', included: true },
      { text: '100 verified locations', included: true },
      { text: 'Community prices', included: true },
      { text: 'Offline map', included: false },
      { text: 'Priority AI responses', included: false },
    ],
  },
  {
    name: 'Traveler',
    price: { monthly: 99000, yearly: 79000 },
    desc: 'For frequent visitors who want the full Hanoi experience.',
    color: '#1A56DB',
    border: '#1A56DB',
    bg: '#fff',
    cta: 'Get Traveler',
    ctaClass: 'btn-primary',
    popular: true,
    features: [
      { text: 'Unlimited AI itineraries', included: true },
      { text: 'Full interactive map', included: true },
      { text: '500+ verified locations', included: true },
      { text: 'Real-time prices', included: true },
      { text: 'Offline map access', included: true },
      { text: 'Priority AI responses', included: false },
    ],
  },
  {
    name: 'Pro Local',
    price: { monthly: 199000, yearly: 159000 },
    desc: 'For travel guides, bloggers, and Hanoi enthusiasts.',
    color: '#7C3AED',
    border: '#7C3AED',
    bg: '#fff',
    cta: 'Go Pro',
    ctaClass: 'btn-purple',
    features: [
      { text: 'Everything in Traveler', included: true },
      { text: 'Priority AI responses', included: true },
      { text: 'API access', included: true },
      { text: 'Custom itinerary exports', included: true },
      { text: 'Early access to features', included: true },
      { text: 'Dedicated support', included: true },
    ],
  },
];

const PricingSection = () => {
  const [yearly, setYearly] = useState(false);
  const fmt = (n) => n === 0 ? 'Free' : n.toLocaleString('vi-VN') + 'đ';

  return (
    <section id="pricing" className="section" style={{ background: 'rgba(249, 250, 251, 0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="badge badge-orange" style={{ marginBottom: 14 }}>💰 Pricing</span>
          <h2>Simple, Transparent Pricing</h2>
          <p style={{ marginTop: 14 }}>Start free. Upgrade when you're ready. No hidden fees, ever.</p>
          {/* Toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginTop: 24, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 50, padding: '6px 6px 6px 18px', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
            <span style={{ fontSize: '.88rem', fontWeight: 500, color: !yearly ? '#111827' : '#9CA3AF' }}>Monthly</span>
            <button onClick={() => setYearly(!yearly)} style={{ width: 48, height: 26, borderRadius: 13, background: yearly ? '#1A56DB' : '#E5E7EB', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background .25s ease', flexShrink: 0 }}>
              <span style={{ position: 'absolute', top: 3, left: yearly ? 24 : 3, width: 20, height: 20, background: '#fff', borderRadius: '50%', transition: 'left .25s ease', display: 'block', boxShadow: '0 1px 4px rgba(0,0,0,.15)' }} />
            </button>
            <span style={{ fontSize: '.88rem', fontWeight: 500, color: yearly ? '#111827' : '#9CA3AF' }}>Yearly</span>
            {yearly && <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 50, border: '1px solid rgba(5,150,105,.2)', marginRight: 6 }}>Save 20%</span>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, alignItems: 'start' }}>
          {plans.map((p, i) => (
            <div key={i} className="reveal" style={{ background: p.bg, border: `2px solid ${p.popular ? p.border : p.border}`, borderRadius: 24, padding: '32px 28px', position: 'relative', boxShadow: p.popular ? `0 16px 48px ${p.color}20` : 'none', transform: p.popular ? 'scale(1.03)' : 'none', animationDelay: `${i * 0.1}s` }}>
              {p.popular && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: p.color, color: '#fff', fontSize: '.75rem', fontWeight: 700, padding: '6px 18px', borderRadius: 50, whiteSpace: 'nowrap', boxShadow: `0 4px 12px ${p.color}40` }}>
                  ⭐ Most Popular
                </div>
              )}
              <div style={{ fontSize: '.82rem', fontWeight: 700, color: p.color, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                <span style={{ fontSize: 'clamp(2rem,4vw,2.6rem)', fontWeight: 900, color: '#111827', fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: '-0.03em' }}>
                  {fmt(yearly ? p.price.yearly : p.price.monthly)}
                </span>
                {p.price.monthly > 0 && <span style={{ color: '#9CA3AF', fontSize: '.88rem' }}>/month</span>}
              </div>
              <p style={{ color: '#6B7280', fontSize: '.85rem', lineHeight: 1.6, marginBottom: 24, minHeight: 40 }}>{p.desc}</p>
              <div style={{ height: 1, background: '#E5E7EB', marginBottom: 24 }} />
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                {p.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '.88rem', color: f.included ? '#374151' : '#D1D5DB' }}>
                    <span style={{ color: f.included ? p.color : '#D1D5DB', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>{f.included ? '✓' : '✗'}</span>
                    {f.text}
                  </li>
                ))}
              </ul>
              <Link to="/planner" className={`btn ${p.ctaClass}`} style={{ width: '100%', justifyContent: 'center' }}>{p.cta}</Link>
            </div>
          ))}
        </div>

        <p className="reveal" style={{ textAlign: 'center', marginTop: 36, color: '#9CA3AF', fontSize: '.85rem' }}>
          All plans include a 7-day free trial. No credit card required. Cancel anytime.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
