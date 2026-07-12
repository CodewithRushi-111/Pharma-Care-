import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/* ──────────────────────────────────────────────────────────────
   PHARMA CARE — Premium Floating Navbar
   Transparent → Glass-blur on scroll, Mobile hamburger, 
   Theme-aware text & dropdowns, Theme Toggle Integration
   ────────────────────────────────────────────────────────────── */

const NAV_ITEMS = [
  { label: 'Platform', submenu: ['AI Assistant', 'Telemedicine', 'Pharmacy', 'Health Records'] },
  { label: 'Doctors', href: '/doctors' },
  { label: 'Pharmacy', href: '/pharmacy' },
  { label: 'AI Assistant', href: '/chat' },
  { label: 'About', href: '#' },
];

export default function Navbar({ isLoggedIn, onSignIn, onGetStarted, _userRole, isDark, onToggleTheme, onLogoClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handle = () => setActiveDropdown(null);
    document.addEventListener('click', handle);
    return () => document.removeEventListener('click', handle);
  }, []);

  const handleNav = useCallback((href) => {
    setMobileOpen(false);
    setActiveDropdown(null);
    if (href && href !== '#') navigate(href);
  }, [navigate]);

  return (
    <>
      <style>{`
        .nav-item-link { background: none; border: none; color: var(--color-text-secondary); font-size: 0.9rem; font-weight: 600; font-family: var(--font-body); cursor: pointer; padding: 6px 12px; border-radius: 8px; transition: all 0.2s ease; display: flex; align-items: center; gap: 5px; white-space: nowrap; }
        .nav-item-link:hover { color: var(--color-text-primary); background: var(--color-surface-alt); }
        .nav-item-link.active { color: var(--color-primary); }
        .dropdown-menu { position: absolute; top: calc(100% + 12px); left: 50%; transform: translateX(-50%); background: var(--color-surface); backdrop-filter: blur(24px); border: 1px solid var(--color-border); border-radius: 16px; padding: 8px; min-width: 200px; box-shadow: var(--shadow-lg); z-index: 1000; animation: slideDown 0.2s ease both; }
        .dropdown-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 10px; font-size: 0.88rem; font-weight: 500; color: var(--color-text-secondary); cursor: pointer; transition: all 0.15s; border: none; background: none; font-family: var(--font-body); width: 100%; text-align: left; }
        .dropdown-item:hover { background: var(--color-primary-dim); color: var(--color-primary); }
        .mobile-menu { position: fixed; inset: 0; background: var(--color-bg); z-index: 999; display: flex; flex-direction: column; padding: 100px 24px 40px; animation: fadeIn 0.25s ease both; }
        .mobile-nav-item { font-size: 1.6rem; font-weight: 700; font-family: var(--font-display); color: var(--color-text-primary); padding: 16px 0; border-bottom: 1px solid var(--color-border); cursor: pointer; background: none; border-top: none; border-left: none; border-right: none; text-align: left; letter-spacing: -0.03em; transition: color 0.2s; }
        .mobile-nav-item:hover { color: var(--color-primary); }
        .hamburger { width: 38px; height: 38px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 5px; cursor: pointer; background: var(--color-surface-alt); border: 1px solid var(--color-border); border-radius: 10px; transition: background 0.2s; padding: 0; }
        .hamburger:hover { background: var(--color-border); }
        .hamburger-line { width: 18px; height: 1.5px; background: var(--color-text-primary); border-radius: 100px; transition: all 0.3s ease; }
        .hamburger.open .hamburger-line:nth-child(1) { transform: rotate(45deg) translate(4.5px, 4.5px); }
        .hamburger.open .hamburger-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger.open .hamburger-line:nth-child(3) { transform: rotate(-45deg) translate(4.5px, -4.5px); }
        @media (max-width: 900px) { .desktop-nav { display: none !important; } }
      `}</style>

      {/* Main navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        transition: 'all 0.3s ease',
        background: scrolled ? 'var(--color-surface)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--color-border)' : 'transparent'}`,
        boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
      }}>

        {/* Logo */}
        <button
          onClick={() => { setMobileOpen(false); if (onLogoClick) onLogoClick(); else navigate('/'); }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <div style={{
            width: '34px', height: '34px', borderRadius: '9px',
            background: 'linear-gradient(135deg, #059669, #047857)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', color: 'white', fontWeight: '800',
            boxShadow: 'var(--shadow-primary)',
          }}>
            ⚕
          </div>
          <span style={{ fontWeight: '800', fontSize: '1.05rem', letterSpacing: '-0.03em', color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
            Pharma Care
          </span>
          <span className="sidebar-logo-badge" style={{ marginLeft: 0 }}>
            AI
          </span>
        </button>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }} className="desktop-nav">
          {NAV_ITEMS.map((item, i) => (
            <div key={i} style={{ position: 'relative' }}>
              {item.submenu ? (
                <>
                  <button
                    className="nav-item-link"
                    onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === i ? null : i); }}
                  >
                    {item.label}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: 'transform 0.2s', transform: activeDropdown === i ? 'rotate(180deg)' : 'rotate(0)' }}>
                      <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  {activeDropdown === i && (
                    <div className="dropdown-menu" onClick={e => e.stopPropagation()}>
                      {item.submenu.map((sub, j) => (
                        <button key={j} className="dropdown-item" onClick={() => handleNav('/chat')}>
                          <span style={{ fontSize: '1rem' }}>
                            {j === 0 ? '🧠' : j === 1 ? '🎥' : j === 2 ? '💊' : '📋'}
                          </span>
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button
                  className={`nav-item-link ${location.pathname === item.href ? 'active' : ''}`}
                  onClick={() => handleNav(item.href)}
                >
                  {item.label}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Theme Toggle Pill */}
          <button
            onClick={onToggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px 6px 8px',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid var(--color-border)',
              background: 'var(--color-surface-alt)',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: '700',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
          >
            <span style={{ fontSize: '0.95rem' }}>{isDark ? '☀️' : '🌙'}</span>
            <span className="hide-mobile">{isDark ? 'Light' : 'Dark'}</span>
          </button>

          {isLoggedIn ? (
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary"
              style={{
                borderRadius: '100px',
                padding: '9px 20px',
                fontSize: '0.875rem',
              }}
            >
              <span>✦</span> Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={onSignIn}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', padding: '8px 14px', borderRadius: '8px', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text-primary)'; e.currentTarget.style.background = 'var(--color-surface-alt)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.background = 'none'; }}
              >
                Sign In
              </button>
              <button
                onClick={onGetStarted}
                className="btn btn-primary"
                style={{
                  borderRadius: '100px',
                  padding: '9px 20px',
                  fontSize: '0.875rem',
                }}
              >
                <span>✦</span> Get Started
              </button>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            className={`hamburger ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
            style={{ display: 'none' }}
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </button>
          <style>{`
            @media (max-width: 900px) {
              .hamburger { display: flex !important; }
            }
          `}</style>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="mobile-menu">
          {/* Close button */}
          <button
            onClick={() => setMobileOpen(false)}
            style={{ position: 'absolute', top: '24px', right: '24px', background: 'var(--color-surface-alt)', border: '1px solid var(--color-border)', borderRadius: '10px', width: '40px', height: '40px', color: 'var(--color-text-primary)', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ✕
          </button>

          {/* Logo in mobile */}
          <div style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #059669, #047857)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', color: 'white', fontWeight: '800' }}>⚕</div>
            <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>Pharma Care</span>
          </div>

          {/* Mobile links */}
          {[
            { label: 'Dashboard', href: '/' },
            { label: 'AI Assistant', href: '/chat' },
            { label: 'Pharmacy', href: '/pharmacy' },
            { label: 'Doctors', href: '/doctors' },
            { label: 'Consultations', href: '/consultation' },
            { label: 'Health Records', href: '/records' },
          ].map((item, i) => (
            <button
              key={i}
              className="mobile-nav-item"
              onClick={() => handleNav(item.href)}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {item.label}
            </button>
          ))}

          {/* Mobile CTA */}
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => { setMobileOpen(false); if (onGetStarted) { onGetStarted(); } }}
              className="btn btn-primary"
              style={{ padding: '16px', borderRadius: '14px', fontSize: '1rem' }}
            >
              ✦ Get Started Free
            </button>
            <button
              onClick={() => { setMobileOpen(false); if (onSignIn) { onSignIn(); } }}
              className="btn btn-secondary"
              style={{ padding: '15px', borderRadius: '14px', fontSize: '1rem' }}
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </>
  );
}
