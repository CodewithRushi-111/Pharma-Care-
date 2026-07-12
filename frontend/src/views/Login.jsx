import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, CheckCircle2, Shield } from 'lucide-react';

export default function Login({ setLoggedIn, setUserRole, setUserName, onReturnToLanding }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login'); // 'login', 'signup'
  const [email, setEmail] = useState('patient@pharmacare.com');
  const [password, setPassword] = useState('password');
  const [role, setRole] = useState('Patient'); // 'Patient', 'Doctor', 'Pharmacy Admin', 'Platform Admin'

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'Patient') {
      setEmail('patient@pharmacare.com');
      setUserName('Rishi Kumar');
    } else if (selectedRole === 'Doctor') {
      setEmail('doctor.rao@pharmacare.com');
      setUserName('Dr. Evelyn Rao');
    } else if (selectedRole === 'Pharmacy Admin') {
      setEmail('meera.sen@pharmacare.com');
      setUserName('Meera Sen');
    } else if (selectedRole === 'Platform Admin') {
      setEmail('admin@pharmacare.com');
      setUserName('Super Admin');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      setUserRole(role);
      if (role === 'Patient') setUserName('Rishi Kumar');
      else if (role === 'Doctor') setUserName('Dr. Evelyn Rao');
      else if (role === 'Pharmacy Admin') setUserName('Meera Sen');
      else if (role === 'Platform Admin') setUserName('Super Admin');
      setLoggedIn(true);
      navigate('/');
    }
  };

  return (
    <div 
      className="login-container-card"
      style={{
        display: 'flex',
        minHeight: 'calc(100vh - 120px)',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      <style>{`
        @media (max-width: 900px) {
          .login-container-card { flex-direction: column !important; min-height: auto !important; }
          .login-illustration-panel { display: none !important; }
          .login-form-panel { padding: 32px 20px !important; }
        }
      `}</style>

      {/* Left Column: Branding Illustration Panel */}
      <div 
        className="login-illustration-panel"
        style={{
          flex: 1.2,
          background: 'linear-gradient(135deg, var(--color-primary) 0%, #254a40 100%)',
          color: 'white',
          padding: '64px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Logo mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 2 }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'white', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.2rem' }}>⚕</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: '700', letterSpacing: '0.5px', color: '#ffffff' }}>Pharma Care</span>
        </div>

        {/* Branding Message */}
        <div style={{ zIndex: 2, maxWidth: '480px', margin: '48px 0', textAlign: 'left' }}>
          <h1 style={{ color: '#ffffff', fontFamily: 'var(--font-display)', fontSize: '2.8rem', lineHeight: '1.2', marginBottom: '20px' }}>
            Clinical trust meets digital speed.
          </h1>
          <p style={{ color: 'rgba(250, 249, 246, 0.8)', fontSize: '1.05rem', marginBottom: '32px' }}>
            Consult verified physicians, obtain secure digital prescriptions, and order medications delivered directly to your doorstep.
          </p>

          {/* Quick value proposition points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              '100% verified pharmacy licensing & logistics',
              'AI-assisted active ingredient and dosage safety checks',
              'Secure WebRTC video rooms for doctor consults'
            ].map((pt, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Abstract Graphic Background */}
        <div style={{
          position: 'absolute',
          right: '-50px',
          bottom: '-50px',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          border: '2px solid rgba(250, 249, 246, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <div style={{
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            border: '2px dashed rgba(250, 249, 246, 0.08)'
          }} />
        </div>
      </div>

      {/* Right Column: Authentication form */}
      <div 
        className="login-form-panel"
        style={{
          flex: 1,
          padding: '64px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: 'var(--color-surface)'
        }}
      >
        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
          
          <button
            type="button"
            onClick={() => { if (onReturnToLanding) onReturnToLanding(); else navigate('/'); }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '20px',
              padding: 0
            }}
          >
            ← Return to 3D Landing Page
          </button>

          {/* Role selector selector cards */}
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '8px' }}>
              Select Prototype Role Profile
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              {['Patient', 'Doctor', 'Pharmacy Admin', 'Platform Admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  className="btn"
                  onClick={() => handleRoleSelect(r)}
                  style={{
                    padding: '10px 8px',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: role === r ? 'var(--color-primary)' : 'var(--color-surface-alt)',
                    color: role === r ? 'white' : 'var(--color-text-primary)',
                    border: '1px solid var(--color-border)',
                    fontWeight: role === r ? '600' : '500'
                  }}
                >
                  {r === 'Platform Admin' || r === 'Pharmacy Admin' ? <Shield size={12} style={{ marginRight: '4px' }} /> : null}
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--color-border)', marginBottom: '24px' }}>
            <button 
              className="caption"
              type="button"
              style={{
                background: 'transparent',
                border: 'none',
                paddingBottom: '12px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontWeight: '700',
                color: activeTab === 'login' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                borderBottom: activeTab === 'login' ? '3px solid var(--color-primary)' : 'none'
              }}
              onClick={() => setActiveTab('login')}
            >
              Sign In
            </button>
            <button 
              className="caption"
              type="button"
              style={{
                background: 'transparent',
                border: 'none',
                paddingBottom: '12px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontWeight: '700',
                color: activeTab === 'signup' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                borderBottom: activeTab === 'signup' ? '3px solid var(--color-primary)' : 'none'
              }}
              onClick={() => setActiveTab('signup')}
            >
              Create Account
            </button>
          </div>

          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '4px' }}>
            {role} Access
          </h3>
          <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>
            {activeTab === 'login' ? `Sign in to access the ${role} space.` : 'Register credentials to begin.'}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--color-text-secondary)' }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@pharmacare.com"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-body)'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--color-text-secondary)' }} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-body)'
                  }}
                  required
                />
              </div>
            </div>

            {activeTab === 'login' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="caption" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Demo pass: password</span>
                <a href="#forgot" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '500' }}>
                  Forgot Password?
                </a>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '12px' }}>
              Authenticate Role &rarr;
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
