import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setShowAuthModal, logout } = React.useContext(AuthContext);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const isHome = location.pathname === '/';
  const textColor = scrolled ? '#374151' : isHome ? 'rgba(255,255,255,.88)' : '#374151';
  const logoColor = scrolled ? '#1A56DB' : isHome ? '#fff' : '#1A56DB';

  const navLinks = [
    { label: 'Tính Năng', href: '/#features' },
    { label: 'Cách Hoạt Động', href: '/#how-it-works' },
    { label: 'Bản Đồ 🗺️', href: '/map', isRoute: true },
    { label: 'Giá Cả', href: '/#pricing' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(255,255,255,.96)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid #E5E7EB' : 'none',
      boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,.06)' : 'none',
      transition: 'all .4s cubic-bezier(.4,0,.2,1)',
      padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.25rem', color: logoColor, transition: 'color .3s ease', letterSpacing: '-0.02em' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#1A56DB,#5B8FF9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: '#fff', fontWeight: 900, flexShrink: 0, boxShadow: '0 4px 12px rgba(26,86,219,.35)' }}>H</div>
          HanoMate
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="hide-mobile">
          {navLinks.map(l => l.isRoute ? (
            <Link key={l.label} to={l.href} style={{ padding: '8px 16px', borderRadius: 50, fontWeight: 500, fontSize: '.88rem', color: textColor, transition: 'all .25s ease', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#D4A017'; e.currentTarget.style.background = 'rgba(212,160,23,.10)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = textColor; e.currentTarget.style.background = 'transparent'; }}>
              {l.label}
            </Link>
          ) : (
            <a key={l.label} href={l.href} style={{ padding: '8px 16px', borderRadius: 50, fontWeight: 500, fontSize: '.88rem', color: textColor, transition: 'all .25s ease' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#D4A017'; e.currentTarget.style.background = 'rgba(212,160,23,.10)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = textColor; e.currentTarget.style.background = 'transparent'; }}>
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="hide-mobile">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: scrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)', padding: '4px 12px 4px 4px', borderRadius: 50 }}>
                <img src={user.avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: textColor }}>{user.name}</span>
              </div>
              <button onClick={logout} style={{ padding: '8px 16px', borderRadius: 50, background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Đăng xuất</button>
            </div>
          ) : (
            <>
              <button onClick={() => setShowAuthModal(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: 50, fontWeight: 500, fontSize: '.88rem', color: textColor, transition: 'color .25s ease' }}
                onMouseEnter={e => e.currentTarget.style.color = '#1A56DB'}
                onMouseLeave={e => e.currentTarget.style.color = textColor}>Sign In</button>
              <Link to="/planner" style={{ padding: '10px 22px', borderRadius: 50, background: '#1A56DB', color: '#fff', fontWeight: 600, fontSize: '.88rem', boxShadow: '0 4px 14px rgba(26,86,219,.32)', transition: 'all .25s ease', display: 'flex', alignItems: 'center', gap: 6 }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1548c9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1A56DB'; e.currentTarget.style.transform = 'none'; }}>
                Get Started Free <span>→</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="show-mobile" onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', padding: 8, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5 }} aria-label="Toggle menu">
          {[0, 1, 2].map(i => (
            <span key={i} style={{ display: 'block', width: 22, height: 2, background: scrolled ? '#1A56DB' : '#fff', borderRadius: 2, transition: 'all .3s ease', transform: menuOpen ? (i === 0 ? 'translateY(7px) rotate(45deg)' : i === 2 ? 'translateY(-7px) rotate(-45deg)' : 'scaleX(0)') : 'none' }} />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: '#fff', padding: '16px 24px 24px', borderTop: '1px solid #E5E7EB', animation: 'slideInDown .25s ease' }}>
          {navLinks.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid #F3F4F6', fontWeight: 500, color: '#374151' }}>{l.label}</a>
          ))}
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            {user ? (
              <button onClick={logout} style={{ flex: 1, padding: '12px', borderRadius: 50, border: 'none', background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontWeight: 600 }}>Đăng xuất</button>
            ) : (
              <button onClick={() => { setMenuOpen(false); setShowAuthModal(true); }} style={{ flex: 1, textAlign: 'center', padding: '12px', borderRadius: 50, border: '1.5px solid #1A56DB', background: 'transparent', color: '#1A56DB', fontWeight: 600 }}>Sign In</button>
            )}
            <Link to="/planner" style={{ flex: 1, textAlign: 'center', padding: '12px', borderRadius: 50, background: '#1A56DB', color: '#fff', fontWeight: 600 }}>Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
