import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/* ──────────────────────────────────────────────────────────────
   PHARMA CARE — Premium Landing Page
   "Healthcare, Reimagined." — Apple × Stripe × Linear aesthetic
   Three distinct scroll sections with theme-aware colors (Light & Dark)
   ────────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: '⚡',
    color: '#059669',
    glow: 'rgba(5,150,105,0.15)',
    title: 'AI Health Companion',
    desc: 'Sub-10ms emergency pre-flight interceptor. Clinical AI triage with symptom analysis, dosage verification, and crisis escalation protocols.',
    tag: 'AI-Powered',
  },
  {
    icon: '🎥',
    color: '#2563EB',
    glow: 'rgba(37,99,235,0.15)',
    title: 'Video Telemedicine',
    desc: 'Crystal-clear WebRTC consultation rooms. Connect with 100% MCI-verified specialists for real-time diagnosis and prescription signing.',
    tag: 'Live Sessions',
  },
  {
    icon: '💊',
    color: '#D97706',
    glow: 'rgba(217,119,6,0.15)',
    title: 'Smart Pharmacy',
    desc: 'Schedule H prescription verification, intelligent generic alternatives, real-time inventory tracking, and guaranteed home delivery.',
    tag: 'Verified Medicines',
  },
  {
    icon: '📋',
    color: '#7C3AED',
    glow: 'rgba(124,58,237,0.15)',
    title: 'Digital Prescriptions',
    desc: 'Tamper-proof e-prescriptions with QR verification, automated pharmacy routing, and complete prescription archive.',
    tag: 'Blockchain-Ready',
  },
  {
    icon: '🛡️',
    color: '#DC2626',
    glow: 'rgba(220,38,38,0.15)',
    title: 'Emergency Guard',
    desc: 'Real-time crisis keyword detection. Immediate escalation to emergency services with location-aware hospital routing.',
    tag: 'Safety Critical',
  },
  {
    icon: '📊',
    color: '#0891B2',
    glow: 'rgba(8,145,178,0.15)',
    title: 'Clinical Analytics',
    desc: 'Comprehensive health records, lab result integration, medication history, and personalized wellness insights.',
    tag: 'Health Intel',
  },
];

const STATS = [
  { number: '50K+', label: 'Active Patients', suffix: '' },
  { number: '1,200', label: 'Verified Specialists', suffix: '+' },
  { number: '8', label: 'Emergency Response', suffix: 'ms' },
  { number: '99.9', label: 'Platform Uptime', suffix: '%' },
];

const WORKFLOW = [
  { step: '01', title: 'Describe Symptoms', icon: '💬', desc: 'Share your health concerns with our AI companion. Voice or text input supported.' },
  { step: '02', title: 'AI Pre-Analysis', icon: '🧠', desc: 'Sub-10ms clinical triage. Emergency keywords instantly escalated to verified doctors.' },
  { step: '03', title: 'Doctor Review', icon: '👨‍⚕️', desc: 'Live WebRTC video consultation with MCI-verified specialist in your preferred language.' },
  { step: '04', title: 'Digital Prescription', icon: '📋', desc: 'Tamper-proof e-prescription signed digitally and stored in your secure health vault.' },
  { step: '05', title: 'Medicine Delivered', icon: '🚀', desc: 'Verified pharmacy dispatches within 2 hours. Real-time GPS tracking to your door.' },
];

const DOCTORS = [
  { name: 'Dr. Evelyn Rao', spec: 'General Medicine', exp: '12 yrs', rating: '4.9', available: true, initials: 'ER', color: '#059669' },
  { name: 'Dr. Rajesh Nair', spec: 'Cardiology', exp: '20 yrs', rating: '4.9', available: true, initials: 'RN', color: '#2563EB' },
  { name: 'Dr. Sarah Alva', spec: 'Pediatrics', exp: '15 yrs', rating: '5.0', available: false, initials: 'SA', color: '#D97706' },
];

/* ── Mouse Parallax Hook ─────────────────────────────────────── */
function useMouseParallax() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handle = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', handle, { passive: true });
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  return mouse;
}

/* ── Animated Counter ────────────────────────────────────────── */
function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ''));
          const isDecimal = target.includes('.');
          const duration = 1800;
          const start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const val = eased * numericTarget;
            setCount(isDecimal ? val.toFixed(1) : Math.floor(val));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const displayVal = target.includes('K') ? `${count}K` : target.includes(',') ? count.toLocaleString() : count;

  return <span ref={ref}>{displayVal}{suffix}</span>;
}

/* ── 3D Hero Card (3-Layer Holographic Parallax Matrix) ───────── */
function HeroCard3D({ mouse, onLaunchFeature }) {
  const tiltX = mouse.y * -12;
  const tiltY = mouse.x * 12;

  return (
    <div
      style={{
        perspective: '1200px',
        width: '100%',
        maxWidth: '460px',
        margin: '0 auto',
      }}
    >
      {/* LAYER 1: Base Holographic Matrix Card */}
      <div
        style={{
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transition: 'transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)',
          transformStyle: 'preserve-3d',
          borderRadius: '24px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          padding: '28px',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        {/* Holographic shimmer overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '24px',
          background: `radial-gradient(circle at ${50 + mouse.x * 40}% ${50 + mouse.y * 40}%, rgba(5,150,105,0.12) 0%, transparent 60%), linear-gradient(${135 + mouse.x * 30}deg, rgba(37,99,235,0.08) 0%, transparent 100%)`,
          pointerEvents: 'none',
        }} />

        {/* Header row (Layer 1 Depth: 15px) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', transform: 'translateZ(15px)', transformStyle: 'preserve-3d' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary)', boxShadow: '0 0 14px var(--color-primary-glow)', animation: 'pulse-glow 2s infinite' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: '800', letterSpacing: '0.08em', color: 'var(--color-text-primary)' }}>CLINICAL AI MATRIX 3D</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-primary)', background: 'var(--color-primary-dim)', padding: '3px 10px', borderRadius: '100px', border: '1px solid var(--color-border)' }}>LIVE INTERCEPT</span>
        </div>

        {/* AI Safety Latency Bar (Layer 1 Depth: 25px) */}
        <div style={{ background: 'var(--color-surface-alt)', borderRadius: '14px', padding: '16px', marginBottom: '18px', border: '1px solid var(--color-border)', transform: 'translateZ(25px)', transformStyle: 'preserve-3d', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontWeight: '600' }}>Emergency Pre-Flight Latency</span>
            <strong style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', fontWeight: '800' }}>8.1 ms</strong>
          </div>
          <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '99%', background: 'linear-gradient(90deg, var(--color-primary), #00e5ff)', borderRadius: '4px', animation: 'heartbeat 1.5s ease-in-out infinite' }} />
          </div>
        </div>

        {/* LAYER 2: Middle Orbit Floating Cards (Depth: 55px) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', transform: 'translateZ(55px)', transformStyle: 'preserve-3d', marginBottom: '18px' }}>
          {[
            { icon: '⚡', label: 'Sub-10ms Safety Guard Active', status: 'Pre-flight Check', color: 'var(--color-primary)', path: '/chat', desc: 'Click to test instant crisis detection' },
            { icon: '🎥', label: 'WebRTC Telemedicine Suite', status: '1,200 Doctors Online', color: '#2563EB', path: '/consultation', desc: 'Click to open live video rooms' },
            { icon: '💊', label: 'Schedule H Verified Pharmacy', status: 'In-Stock Delivery', color: '#D97706', path: '/pharmacy', desc: 'Click to explore generic alternatives' },
          ].map((card, i) => (
            <div
              key={i}
              onClick={() => onLaunchFeature && onLaunchFeature(card.path)}
              style={{
                background: 'var(--color-surface)',
                padding: '12px 16px',
                borderRadius: '14px',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                animation: `float 4.5s ease-in-out ${i * 0.7}s infinite`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.04) translateZ(12px)';
                e.currentTarget.style.borderColor = card.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateZ(0px)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--color-surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                  {card.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>{card.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{card.desc}</div>
                </div>
              </div>
              <span className="badge" style={{ fontSize: '0.68rem', backgroundColor: 'var(--color-surface-alt)', color: card.color, fontWeight: '700', whiteSpace: 'nowrap' }}>{card.status}</span>
            </div>
          ))}
        </div>

        {/* LAYER 3: Foreground Interactive Diagnostic Orb & Experiment Bar (Depth: 90px) */}
        <div
          style={{
            transform: `translateZ(90px) rotateX(${tiltX * -0.5}deg) rotateY(${tiltY * -0.5}deg)`,
            transformStyle: 'preserve-3d',
            background: 'linear-gradient(135deg, var(--color-primary), #047857)',
            padding: '16px',
            borderRadius: '18px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 16px 32px rgba(5, 150, 105, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onClick={() => onLaunchFeature && onLaunchFeature('/chat')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
              🧬
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '0.92rem' }}>Launch 3D Diagnostic AI</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)' }}>Click to interact with application triage layer</div>
            </div>
          </div>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'white', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1rem' }}>
            →
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Landing Page ───────────────────────────────────────── */
export default function LandingPage({ onEnterApp }) {
  const navigate = useNavigate();
  const mouse = useMouseParallax();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handle = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const handleEnter = useCallback(() => {
    if (onEnterApp) onEnterApp();
    else navigate('/dashboard');
  }, [onEnterApp, navigate]);

  return (
    <div className="landing-wrapper" style={{ position: 'relative' }}>
      <style>{`
        .hero-word { display: inline-block; opacity: 0; transform: translateY(30px); animation: fadeInUp 0.8s var(--ease-out) forwards; }
        .hero-word:nth-child(1) { animation-delay: 0.1s; }
        .hero-word:nth-child(2) { animation-delay: 0.22s; }
        .hero-word:nth-child(3) { animation-delay: 0.34s; }
        .hero-word:nth-child(4) { animation-delay: 0.46s; }
        .cta-primary { background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover)); color: #ffffff; font-weight: 800; font-size: 1rem; padding: 15px 36px; border-radius: 100px; border: none; cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: var(--shadow-primary); letter-spacing: -0.02em; display: inline-flex; align-items: center; gap: 8px; }
        .cta-primary:hover { transform: translateY(-2px) scale(1.04); filter: brightness(1.05); }
        .cta-secondary { background: var(--color-surface); color: var(--color-text-primary); font-weight: 600; font-size: 1rem; padding: 14px 32px; border-radius: 100px; border: 1px solid var(--color-border); cursor: pointer; transition: all 0.25s ease; letter-spacing: -0.01em; display: inline-flex; align-items: center; gap: 8px; box-shadow: var(--shadow-sm); }
        .cta-secondary:hover { background: var(--color-surface-alt); border-color: var(--color-border-hover); transform: translateY(-1px); }
        .feature-card-inner:hover .feature-icon-wrap { transform: scale(1.1) rotate(-3deg); }
        .testimonial-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 20px; padding: 28px; transition: all 0.3s ease; box-shadow: var(--shadow-sm); }
        .testimonial-card:hover { border-color: var(--color-primary); transform: translateY(-4px); box-shadow: var(--shadow-md); }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ticker-wrap { overflow: hidden; position: relative; }
        .ticker-inner { display: flex; width: max-content; animation: ticker 30s linear infinite; }
        .ticker-item { padding: 12px 32px; white-space: nowrap; font-size: 0.82rem; font-weight: 600; color: var(--color-text-secondary); border-right: 1px solid var(--color-border); display: flex; align-items: center; gap: 10px; }
        .pill-badge { background: var(--color-primary-dim); color: var(--color-primary); border: 1px solid var(--color-border-active); font-size: 0.72rem; font-weight: 700; padding: 4px 12px; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.08em; display: inline-block; }
        @keyframes scan-line { 0% { top: -10%; } 100% { top: 110%; } }
        .scan-line { position: absolute; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--color-primary), transparent); animation: scan-line 4s ease-in-out infinite; pointer-events: none; }
        @media (max-width: 900px) {
          .landing-wrapper section { padding-top: 80px !important; }
          .landing-wrapper .grid-1-1, .landing-wrapper style + div + section > div > div { grid-template-columns: 1fr !important; gap: 40px !important; text-align: center; }
          .landing-wrapper .cta-primary, .landing-wrapper .cta-secondary { justify-content: center; width: 100%; }
          .landing-wrapper h1 { font-size: 2.4rem !important; }
          .landing-wrapper p { max-width: 100% !important; }
          .landing-wrapper div[style*="display: flex; gap: 28px"] { justify-content: center; }
        }
      `}</style>

      {/* ── BACKGROUND SYSTEM ───────────────────────────────── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Aurora blobs */}
        <div style={{ position: 'absolute', top: '-20%', left: '-15%', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, var(--color-primary-dim) 0%, transparent 70%)', animation: 'aurora 20s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, var(--color-primary-dim) 0%, transparent 70%)', animation: 'aurora 25s ease-in-out infinite reverse' }} />
        {/* Mesh grid */}
        <div className="mesh-grid" />
        {/* Noise texture */}
        <div className="noise-overlay" />
      </div>

      {/* ── HERO SECTION ────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', zIndex: 1, paddingTop: '100px' }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            {/* Left: Text Content */}
            <div>
              <div style={{ marginBottom: '24px', animation: 'fadeIn 0.6s ease both' }}>
                <span className="pill-badge">✦ India's No.1 Clinical AI Platform</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.8rem, 5vw, 5rem)',
                fontWeight: '800',
                lineHeight: '1.08',
                letterSpacing: '-0.04em',
                marginBottom: '28px',
                color: 'var(--color-text-primary)',
              }}>
                <span className="hero-word">Healthcare,&nbsp;</span>
                <span className="hero-word" style={{ display: 'block' }}>
                  <span style={{
                    backgroundImage: 'linear-gradient(135deg, var(--color-primary) 0%, #06B6D4 50%, #7C3AED 100%)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'gradient-shift 4s ease infinite',
                  }}>
                    Reimagined.
                  </span>
                </span>
              </h1>

              <p style={{
                fontSize: '1.15rem',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.7',
                marginBottom: '40px',
                maxWidth: '500px',
                animation: 'fadeInUp 0.8s 0.5s var(--ease-out) both',
              }}>
                One intelligent platform for every healthcare journey — from AI symptom triage and verified specialist consultations to schedule H pharmacy delivery.
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', animation: 'fadeInUp 0.8s 0.7s var(--ease-out) both' }}>
                <button className="cta-primary" onClick={handleEnter}>
                  <span>✦</span> Enter Platform
                </button>
                <button className="cta-secondary" onClick={handleEnter}>
                  <span>🎥</span> Watch Demo
                </button>
              </div>

              {/* Trust Signals */}
              <div style={{ display: 'flex', gap: '28px', marginTop: '48px', animation: 'fadeInUp 0.8s 0.9s var(--ease-out) both' }}>
                {[
                  { val: '50K+', label: 'Patients Served' },
                  { val: '1,200+', label: 'MCI Verified Doctors' },
                  { val: '< 10ms', label: 'AI Response Time' },
                ].map((t, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>{t.val}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: '600', marginTop: '2px' }}>{t.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: 3D Interactive Holographic Card */}
            <div style={{ animation: 'fadeInUp 0.9s 0.4s var(--ease-out) both' }}>
              <HeroCard3D mouse={mouse} onLaunchFeature={(path) => { if (onEnterApp) onEnterApp(); navigate(path); }} />

              {/* Floating doctor bubbles */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                {DOCTORS.map((doc, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '100px',
                      padding: '8px 14px',
                      animation: `float 3s ease-in-out ${i * 0.4}s infinite`,
                    }}
                  >
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: doc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: '800', color: 'white' }}>{doc.initials}</div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-primary)', lineHeight: 1.2 }}>{doc.name.split(' ').slice(0, 2).join(' ')}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)' }}>{doc.spec}</div>
                    </div>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: doc.available ? '#059669' : '#D97706', boxShadow: `0 0 6px ${doc.available ? '#059669' : '#D97706'}`, flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', animation: 'float 2.5s ease-in-out infinite', opacity: scrollY > 50 ? 0 : 1, transition: 'opacity 0.3s ease' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Scroll to explore</span>
          <div style={{ width: '24px', height: '38px', border: '1.5px solid var(--color-border)', borderRadius: '100px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '6px' }}>
            <div style={{ width: '4px', height: '8px', background: 'var(--color-primary)', borderRadius: '100px', animation: 'float 1.5s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ── TICKER STRIP ────────────────────────────────────── */}
      <div style={{ background: 'var(--color-primary-dim)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {Array(2).fill([
              '⚡ Sub-10ms AI Emergency Guard',
              '🛡️ 100% MCI Verified Doctors',
              '💊 Schedule H Prescription Verified',
              '📦 Same-Day Home Delivery',
              '🎥 WebRTC Secure Video Consult',
              '🔬 AI Medication Safety Checker',
              '⭐ 4.9/5 Patient Rating',
              '🔐 HIPAA-Grade Data Security',
            ]).flat().map((text, i) => (
              <div key={i} className="ticker-item">
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, boxShadow: '0 0 6px var(--color-primary-glow)' }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS SECTION ───────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 24px' }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {STATS.map((stat, i) => (
              <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="stat-number text-gradient-static">
                  <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: '500', marginTop: '6px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ───────────────────────────────────── */}
      <section className="section" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-header">
          <div className="overline">✦ Core Capabilities</div>
          <h2>One Platform.<br />Every Healthcare Need.</h2>
          <p>Enterprise-grade clinical tools built for patients, doctors, pharmacists, and platform administrators.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {FEATURES.map((feat, i) => (
            <div
              key={i}
              className="feature-card feature-card-inner"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Glow blob behind icon */}
              <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '120px', height: '120px', borderRadius: '50%', background: feat.glow, filter: 'blur(30px)', pointerEvents: 'none', transition: 'opacity 0.3s ease' }} />

              <div className="feature-icon-wrap" style={{ marginBottom: '18px', transition: 'transform 0.3s var(--ease-spring)' }}>
                <div
                  className="feature-icon"
                  style={{
                    background: `linear-gradient(135deg, ${feat.color}20, ${feat.color}08)`,
                    border: `1px solid ${feat.color}30`,
                    boxShadow: `0 0 20px ${feat.glow}`,
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{feat.icon}</span>
                </div>
              </div>

              <span style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: feat.color, marginBottom: '10px', display: 'block' }}>
                {feat.tag}
              </span>

              <h3 style={{ marginBottom: '10px', color: 'var(--color-text-primary)' }}>{feat.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.65' }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI WORKFLOW TIMELINE ─────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
          <div className="section-header" style={{ marginBottom: '48px' }}>
            <div className="overline">✦ AI-Powered Flow</div>
            <h2>From Symptom to Cure.<br />In Minutes.</h2>
          </div>

          <div style={{ display: 'flex', gap: 0, overflowX: 'auto', paddingBottom: '8px' }}>
            {WORKFLOW.map((step, i) => (
              <div key={i} style={{ flex: '1', minWidth: '180px', position: 'relative' }}>
                {/* Connector line */}
                {i < WORKFLOW.length - 1 && (
                  <div style={{ position: 'absolute', top: '36px', left: '50%', right: '-50%', height: '1px', background: 'linear-gradient(90deg, var(--color-primary), var(--color-border))', zIndex: 0, transform: 'translateY(-50%)' }}>
                    <div style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '6px solid var(--color-primary)' }} />
                  </div>
                )}

                <div style={{ textAlign: 'center', padding: '0 16px', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-primary-dim)', border: '1.5px solid var(--color-border-active)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.6rem', boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s ease' }}>
                    {step.icon}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-primary)', marginBottom: '6px', fontWeight: '700' }}>{step.step}</div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '8px' }}>{step.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────── */}
      <section className="section" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-header">
          <div className="overline">✦ Patient Stories</div>
          <h2>Trusted by Thousands.<br />Across India.</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {[
            {
              name: 'Priya Sharma', role: 'Patient, Mumbai',
              quote: 'The AI companion flagged my blood pressure medication interaction in seconds. What could have been a serious incident was prevented seamlessly.',
              rating: 5, avatar: 'PS',
            },
            {
              name: 'Dr. Kabir Mehta', role: 'Dermatologist',
              quote: 'The telemedicine infrastructure is exceptional. Crystal-clear video, integrated prescription pad, and patients can order medicines directly after the session.',
              rating: 5, avatar: 'KM',
            },
            {
              name: 'Anita Rao', role: 'Patient, Bangalore',
              quote: 'Ordered Amoxicillin with my e-prescription at 9 PM. By 11 AM next morning, it was at my door with proper cold-chain packaging. Incredible.',
              rating: 5, avatar: 'AR',
            },
          ].map((t, i) => (
            <div key={i} className="testimonial-card">
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {Array(t.rating).fill(0).map((_, si) => (
                  <span key={si} style={{ color: '#f59e0b', fontSize: '0.9rem' }}>★</span>
                ))}
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: '1.7', marginBottom: '20px', fontStyle: 'italic' }}>"{t.quote}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #00c8ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800', color: 'white' }}>{t.avatar}</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA SECTION ───────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 24px', textAlign: 'center', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, var(--color-primary-dim) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <span className="pill-badge">✦ Start Your Journey</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2.3rem, 5vw, 3.8rem)', marginBottom: '20px', lineHeight: '1.1' }}>
            The Future of Healthcare<br />
            <span style={{ backgroundImage: 'linear-gradient(135deg, var(--color-primary), #00c8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Starts Here.
            </span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', marginBottom: '40px', lineHeight: '1.7' }}>
            Join 50,000+ patients already experiencing India's most advanced clinical AI platform. Your health intelligence hub awaits.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button className="cta-primary" onClick={handleEnter} style={{ fontSize: '1.05rem', padding: '16px 40px' }}>
              <span>✦</span> Get Started Free
            </button>
            <button className="cta-secondary" onClick={handleEnter}>
              <span>📞</span> Talk to a Doctor
            </button>
          </div>

          <p style={{ marginTop: '28px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            No credit card required &bull; HIPAA compliant &bull; 100% MCI verified doctors
          </p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid var(--color-border)', padding: '60px 24px 32px', background: 'var(--color-surface-alt)' }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '40px', marginBottom: '48px', textAlign: 'left' }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: 'white' }}>⚕</div>
                <span style={{ fontWeight: '800', fontSize: '1.05rem', letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>Pharma Care</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.7', marginBottom: '20px', maxWidth: '260px' }}>
                India's premier enterprise-grade AI healthcare platform. Combining telemedicine, pharmacy, and clinical AI.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['𝕏', 'in', '⧉', '⬡'].map((icon, i) => (
                  <button key={i} style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: 'Platform', links: ['AI Assistant', 'Telemedicine', 'Pharmacy', 'Health Records', 'Prescriptions'] },
              { title: 'Doctors', links: ['General Medicine', 'Cardiology', 'Dermatology', 'Pediatrics', 'Psychiatry'] },
              { title: 'Company', links: ['About Us', 'Privacy Policy', 'Terms of Service', 'MCI Compliance', 'Contact'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: '16px' }}>{col.title}</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <button
                        onClick={handleEnter}
                        style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', fontSize: '0.88rem', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-body)', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.target.style.color = 'var(--color-primary)'}
                        onMouseLeave={e => e.target.style.color = 'var(--color-text-secondary)'}
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              &copy; 2026 Pharma Care Health Systems. All Rights Reserved.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              {['MCI Compliant', 'HIPAA Grade', 'ISO 27001'].map((cert, i) => (
                <span key={i} style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', fontWeight: '600', background: 'var(--color-surface)', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                  ✓ {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
