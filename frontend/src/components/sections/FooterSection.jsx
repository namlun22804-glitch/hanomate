import React from 'react';
import { Link } from 'react-router-dom';

const footerLinks = {
  Product: ['AI Planner', 'Interactive Map', 'Price Checker', 'Local Secrets', 'Offline Mode'],
  Company: ['About Us', 'Blog', 'Careers', 'Press Kit', 'Contact'],
  Resources: ['Help Center', 'API Docs', 'Community', 'Privacy Policy', 'Terms of Service'],
};

const socials = [
  { icon: '𝕏', label: 'Twitter', href: '#' },
  { icon: 'f', label: 'Facebook', href: '#' },
  { icon: 'in', label: 'LinkedIn', href: '#' },
  { icon: '▶', label: 'YouTube', href: '#' },
];

const FooterSection = () => (
  <footer style={{ background: 'rgba(11, 25, 44, 0.85)', backdropFilter: 'blur(12px)', padding: '72px 0 0', borderTop: '1px solid rgba(255,255,255,.05)' }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, paddingBottom: 56 }}>
        {/* Brand column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg,#1A56DB,#5B8FF9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem', color: '#fff', boxShadow: '0 4px 12px rgba(26,86,219,.4)' }}>H</div>
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#fff', letterSpacing: '-0.02em' }}>HanoMate</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '.88rem', lineHeight: 1.75, maxWidth: 280, marginBottom: 24 }}>
            AI-powered travel assistant for Hanoi. Discover hidden gems, plan smart itineraries, and travel like a local.
          </p>
          {/* Social links */}
          <div style={{ display: 'flex', gap: 10 }}>
            {socials.map(s => (
              <a key={s.label} href={s.href} aria-label={s.label} style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.55)', fontSize: '.8rem', fontWeight: 700, transition: 'all .25s ease' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1A56DB'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#1A56DB'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; e.currentTarget.style.color = 'rgba(255,255,255,.55)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'; }}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([group, links]) => (
          <div key={group}>
            <h5 style={{ color: '#fff', fontWeight: 700, fontSize: '.88rem', marginBottom: 18, fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: '.01em' }}>{group}</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
              {links.map(link => (
                <li key={link}>
                  <a href="#" style={{ color: 'rgba(255,255,255,.42)', fontSize: '.85rem', transition: 'color .2s ease', display: 'block' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#5B8FF9'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.42)'}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Newsletter */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', padding: '32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h5 style={{ color: '#fff', fontWeight: 700, marginBottom: 4, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Get Hanoi travel tips weekly</h5>
          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.82rem' }}>No spam. Unsubscribe anytime.</p>
        </div>
        <div style={{ display: 'flex', gap: 0, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 50, overflow: 'hidden', maxWidth: 380, width: '100%' }}>
          <input type="email" placeholder="your@email.com" style={{ flex: 1, background: 'none', border: 'none', padding: '12px 20px', color: '#fff', fontSize: '.88rem', outline: 'none', fontFamily: 'Inter,sans-serif' }} />
          <button className="btn btn-primary btn-sm" style={{ borderRadius: 50, margin: 4, flexShrink: 0 }}>Subscribe</button>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '.8rem' }}>© 2026 HanoMate. Made with ❤️ in Hà Nội, Vietnam.</p>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms', 'Cookies'].map(t => (
            <a key={t} href="#" style={{ color: 'rgba(255,255,255,.3)', fontSize: '.78rem', transition: 'color .2s ease' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,.7)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.3)'}>
              {t}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default FooterSection;
