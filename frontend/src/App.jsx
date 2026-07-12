import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './views/Dashboard';
import Chat from './views/Chat';
import Pharmacy from './views/Pharmacy';
import OrderTracking from './views/OrderTracking';
import Doctors from './views/Doctors';
import Consultation from './views/Consultation';
import Prescription from './views/Prescription';
import Records from './views/Records';
import Admin from './views/Admin';
import Login from './views/Login';
import LandingPage from './views/LandingPage';
import Navbar from './components/Navbar';
import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  FileText,
  Activity,
  ShieldAlert,
  LogOut,
  Bell,
  Search,
  UserCheck,
  Package,
  Stethoscope,
  Brain,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────────
   PHARMA CARE — Root Application Shell
   Handles: Landing route, Auth gate, Sidebar + Header layout,
   All shared state (cart, orders, doctors, prescriptions…)
   ────────────────────────────────────────────────────────────── */

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  /* ── Theme State (Light by default) ───────────────────────── */
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  /* ── Auth State ─────────────────────────────────────────────── */
  const [showLanding, setShowLanding] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('Patient');
  const [userName, setUserName] = useState('Rishi Kumar');

  /* ── Shared Dynamic Datasets ────────────────────────────────── */
  const [safetyLogs, setSafetyLogs] = useState([]);
  const [doctorsList, setDoctorsList] = useState([
    { id: '1', name: 'Dr. Evelyn Rao',  specialty: 'General Medicine', exp: '12 years', rating: 4.9, slots: ['4:30 PM', '5:00 PM', '6:00 PM'], fee: 500.00,  bio: 'Experienced in treating acute/chronic conditions with a focus on preventative care and patient education.' },
    { id: '2', name: 'Dr. Kabir Mehta', specialty: 'Dermatology',       exp: '8 years',  rating: 4.8, slots: ['9:30 AM', '11:00 AM', '2:30 PM'], fee: 700.00,  bio: 'Specialist in clinical dermatology, acne management, and digital skin health diagnostics.' },
    { id: '3', name: 'Dr. Sarah Alva',  specialty: 'Pediatrics',        exp: '15 years', rating: 5.0, slots: ['10:00 AM', '11:30 AM', '4:00 PM'], fee: 600.00,  bio: 'Dedicated pediatric clinician providing child development consultations and nutritional guidance.' },
    { id: '4', name: 'Dr. Rajesh Nair', specialty: 'Cardiology',        exp: '20 years', rating: 4.9, slots: ['3:00 PM', '4:30 PM'],              fee: 1000.00, bio: 'Interventional cardiologist specializing in lipid management, hypertension, and cardiovascular health.' },
    { id: '5', name: 'Dr. Tanya Sen',   specialty: 'Psychiatry',        exp: '10 years', rating: 4.7, slots: ['1:00 PM', '2:00 PM', '5:30 PM'],  fee: 800.00,  bio: 'Focus on stress management, cognitive behavioral therapy, and neurodevelopmental consults.' },
  ]);

  const [medicinesList, setMedicinesList] = useState([
    { id: '1', name: 'Paracetamol 650mg',       generic: 'Acetaminophen',            category: 'Pain Relief',      price: 40.00,  requiresRx: false, inStock: true,  details: 'Used to treat mild-to-moderate pain and reduce fever. Adults: 500mg-1000mg every 4-6 hours.', precautions: 'Avoid if you have history of liver disease.', sideEffects: 'Rare: skin rash, liver enzyme changes.' },
    { id: '2', name: 'Ibuprofen 400mg',          generic: 'NSAID',                   category: 'Pain Relief',      price: 60.00,  requiresRx: false, inStock: true,  details: 'Nonsteroidal anti-inflammatory drug (NSAID) used to reduce hormones that cause pain and inflammation.', precautions: 'Take with food to avoid gastric irritation.', sideEffects: 'Stomach upset, mild headache.' },
    { id: '3', name: 'Amoxicillin 500mg',        generic: 'Penicillin Antibiotic',   category: 'Antibiotics',      price: 120.00, requiresRx: true,  inStock: true,  details: 'Used to treat infections caused by bacteria, such as tonsillitis, bronchitis, and pneumonia.', precautions: 'Do not use if allergic to penicillin.', sideEffects: 'Diarrhea, skin rash, nausea.' },
    { id: '4', name: 'Multivitamin Complex',     generic: 'Essential Micronutrients',category: 'Vitamins',         price: 250.00, requiresRx: false, inStock: true,  details: 'Contains active forms of Vitamin B12, D3, Zinc, and Selenium for daily immune support.', precautions: 'Do not exceed daily recommended dosage.', sideEffects: 'Mild nausea if taken on empty stomach.' },
    { id: '5', name: 'HPMC Veggie Shells',       generic: 'Hypromellose Capsules',   category: 'Veg-Caps',         price: 180.00, requiresRx: false, inStock: true,  details: 'Premium vegetable-based capsule shells. Ideal for custom compounding or sensitive patients.', precautions: 'Store in dry place, away from moisture.', sideEffects: 'None reported.' },
    { id: '6', name: 'Pantoprazole 40mg',         generic: 'Proton Pump Inhibitor',  category: 'Digestive Health', price: 95.00,  requiresRx: true,  inStock: false, details: 'Decreases the amount of acid produced in the stomach. Used for GERD and acid reflux.', precautions: 'Take 30 minutes before first meal of the day.', sideEffects: 'Headache, diarrhea, gas.', genericAlternative: { id: '7', name: 'Aciloc 150mg', price: 30.00, requiresRx: false, generic: 'Ranitidine (Generic Equivalent)' } },
  ]);

  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([
    {
      id: 'ORD-98210', patient: 'Rishi Kumar', date: 'Jul 09, 11:15 AM',
      items: ['Amoxicillin 500mg x1', 'Paracetamol 650mg x2'],
      status: 'pending_verification', statusIndex: 1, total: 200.00,
      age: 24, prescriptionName: 'rishi_kumar_prescription.jpg',
      waitingTime: '45 mins ago', urgencyColor: 'var(--color-success)', rxDoctor: 'Dr. Evelyn Rao',
    },
  ]);
  const [appointments, setAppointments] = useState([
    { id: 'APT-4421', doctor: 'Dr. Evelyn Rao', specialty: 'General Medicine', date: 'Today, 4:30 PM', status: 'ready' },
  ]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  /* ── Cart Management ────────────────────────────────────────── */
  const addToCart = useCallback((med) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === med.id);
      if (existing) return prev.map(item => item.id === med.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...med, quantity: 1 }];
    });
    alert(`${med.name} added to cart.`);
  }, []);

  const addCartItems  = useCallback((items) => items.forEach(item => addToCart(item)), [addToCart]);
  const removeFromCart  = useCallback((id) => setCart(prev => prev.filter(item => item.id !== id)), []);
  const updateCartQuantity = useCallback((id, qty) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
  }, [removeFromCart]);
  const clearCart = useCallback(() => setCart([]), []);

  /* ── Orders & Appointments ──────────────────────────────────── */
  const checkoutOrders     = useCallback((newOrder) => setOrders(prev => [newOrder, ...prev]), []);
  const updateOrderStatus  = useCallback((orderId, newStatusIndex) => setOrders(prev => prev.map(o => o.id === orderId ? { ...o, statusIndex: newStatusIndex } : o)), []);
  const addAppointment     = useCallback((newApt) => setAppointments(prev => [newApt, ...prev]), []);
  const cancelAppointment  = useCallback((aptId) => setAppointments(prev => prev.filter(a => a.id !== aptId)), []);
  const rescheduleAppointment = useCallback((aptId, newDateStr) => setAppointments(prev => prev.map(a => a.id === aptId ? { ...a, date: newDateStr } : a)), []);

  /* ── Prescriptions & Admin ──────────────────────────────────── */
  const addPrescription     = useCallback((newRx)  => setPrescriptions(prev => [...prev, newRx]), []);
  const handleSafetyFlagged = useCallback((evt)    => setSafetyLogs(prev => [evt, ...prev]), []);
  const handleRegisterDoctor = useCallback((doc)   => setDoctorsList(prev => [...prev, doc]), []);
  const handleAddMedicine   = useCallback((med)    => setMedicinesList(prev => [...prev, med]), []);

  /* ── Routing helpers ────────────────────────────────────────── */
  const handleLogin = useCallback((role, name) => {
    setShowLanding(false);
    setLoggedIn(true);
    setUserRole(role);
    setUserName(name);
    navigate('/');
  }, [navigate]);

  /* ── SHOW LANDING PAGE ──────────────────────────────────────── */
  if (showLanding && location.pathname === '/') {
    return (
      <>
        <Navbar
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          isDark={isDark}
          onToggleTheme={() => setIsDark(d => !d)}
          onSignIn={() => setShowLanding(false)}
          onGetStarted={() => { setShowLanding(false); }}
          onLogoClick={() => { setShowLanding(true); navigate('/'); }}
        />
        <LandingPage
          onEnterApp={() => setShowLanding(false)}
        />
      </>
    );
  }

  /* ── SHOW AUTH / LOGIN ──────────────────────────────────────── */
  if (!isLoggedIn || location.pathname === '/login') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background aurora for login screen */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-20%', left: '-15%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,214,143,0.06) 0%, transparent 70%)', animation: 'aurora 20s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', animation: 'aurora 25s ease-in-out infinite reverse' }} />
          <div className="mesh-grid" />
        </div>
        <div style={{ width: '100%', maxWidth: '1000px', position: 'relative', zIndex: 1 }}>
          <Login
            setLoggedIn={setLoggedIn}
            setUserRole={setUserRole}
            setUserName={setUserName}
            onLoginSuccess={handleLogin}
            onReturnToLanding={() => { setShowLanding(true); navigate('/'); }}
          />
        </div>
      </div>
    );
  }

  /* ── SIDEBAR + MAIN APP SHELL ───────────────────────────────── */
  const isNavActive = (path) => location.pathname === path;
  const getInitials = (name) => name.split(' ').map(n => n[0]).join('');
  const closeSidebar = () => setSidebarOpen(false);

  const navLinks = [
    { path: '/',             icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
    { path: '/chat',         icon: <Brain size={17} />,           label: 'AI Companion' },
    { path: '/pharmacy',     icon: <ShoppingBag size={17} />,     label: 'Pharmacy' },
    { path: '/orders',       icon: <Package size={17} />,         label: 'Deliveries' },
    { path: '/doctors',      icon: <Stethoscope size={17} />,     label: 'Specialists' },
    { path: '/consultation', icon: <Calendar size={17} />,        label: 'Telemedicine' },
    { path: '/prescription', icon: <FileText size={17} />,        label: 'Prescriptions' },
    { path: '/records',      icon: <Activity size={17} />,        label: 'Health Records' },
  ];

  return (
    <div className="app-container">
      {/* Mobile sidebar overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      />

      {/* ── SIDEBAR ───────────────────────────────────────────── */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Logo */}
        <Link to="/" className="sidebar-logo" onClick={() => { closeSidebar(); setShowLanding(true); }}>
          <div className="sidebar-logo-icon">⚕</div>
          <span className="sidebar-logo-text">Pharma Care</span>
          <span className="sidebar-logo-badge">AI</span>
        </Link>

        <nav className="sidebar-nav">
          {/* Patient / common nav */}
          <span className="sidebar-section-label">Navigation</span>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isNavActive(link.path) ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <span className="nav-icon">{link.icon}</span>
              {link.label}
              {link.path === '/chat' && <span className="nav-link-badge">AI</span>}
              {link.path === '/orders' && cart.length > 0 && (
                <span className="nav-link-badge" style={{ background: 'var(--color-primary)', color: 'white' }}>{cart.length}</span>
              )}
            </Link>
          ))}

          {/* Admin section (visible to all roles for seamless consultancy maintenance & demo testing) */}
          <div className="sidebar-divider" />
          <span className="sidebar-section-label">Clinical & Telemedicine Admin</span>
          <Link to="/admin" className={`nav-link ${isNavActive('/admin') ? 'active' : ''}`} onClick={closeSidebar}>
            <span className="nav-icon"><ShieldAlert size={17} /></span>
            Admin Suite & Maintenance
            <span className="nav-link-badge" style={{ background: 'rgba(220,38,38,0.15)', color: 'var(--color-error)' }}>Admin</span>
          </Link>

          <div style={{ flex: 1 }} />
          <div className="sidebar-divider" />

          {/* Theme Toggle — prominent in sidebar */}
          <button
            onClick={() => setIsDark(d => !d)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              margin: '0 10px 6px', padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: isDark ? 'rgba(245,158,11,0.12)' : 'rgba(15,23,42,0.07)',
              border: `1px solid ${isDark ? 'rgba(245,158,11,0.25)' : 'rgba(15,23,42,0.12)'}`,
              cursor: 'pointer', width: 'calc(100% - 20px)',
              transition: 'all 0.25s ease',
            }}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem' }}>{isDark ? '☀️' : '🌙'}</span>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
            </div>
            {/* Toggle pill indicator */}
            <div style={{
              width: '36px', height: '20px',
              borderRadius: '10px',
              background: isDark ? '#F59E0B' : '#CBD5E1',
              position: 'relative',
              transition: 'background 0.25s',
              flexShrink: 0,
            }}>
              <div style={{
                position: 'absolute',
                top: '2px',
                left: isDark ? '18px' : '2px',
                width: '16px', height: '16px',
                borderRadius: '50%',
                background: 'white',
                transition: 'left 0.25s var(--ease-spring)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }} />
            </div>
          </button>

          {/* Role indicator */}
          <div style={{ margin: '0 10px 6px', padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-dim)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <div className="avatar" style={{ width: '30px', height: '30px', fontSize: '0.7rem' }}>{getInitials(userName)}</div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--color-text-primary)', lineHeight: 1.2 }}>{userName}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{userRole}</div>
              </div>
            </div>
          </div>

          {/* Sign out */}
          <button
            className="nav-link"
            style={{ border: 'none', background: 'transparent', width: '100%', textAlign: 'left', cursor: 'pointer', color: 'var(--color-text-muted)', marginBottom: '4px' }}
            onClick={() => { setLoggedIn(false); setShowLanding(true); navigate('/'); }}
          >
            <span className="nav-icon"><LogOut size={17} /></span>
            Sign Out
          </button>
        </nav>
      </aside>

      {/* ── MAIN CONTENT AREA ─────────────────────────────────── */}
      <main className="main-content">
        {/* Top Header Bar */}
        <header className="header">
          {/* Hamburger (mobile only) */}
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>

          <div className="header-search">
            <Search size={15} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <input type="text" placeholder="Search medicines, doctors, records…" />
            <span className="hide-mobile" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--color-text-muted)', background: 'var(--color-surface-alt)', padding: '2px 6px', borderRadius: '4px', flexShrink: 0, border: '1px solid var(--color-border)' }}>⌘K</span>
          </div>

          <div className="header-actions">
            {/* Switch Role — hide on very small screens */}
            <button
              onClick={() => { setLoggedIn(false); navigate('/login'); }}
              className="btn btn-secondary hide-mobile"
              style={{ fontSize: '0.78rem', padding: '7px 14px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
              title="Switch Role"
            >
              <UserCheck size={14} style={{ color: 'var(--color-primary)' }} />
              Switch Role
            </button>

            {/* Theme toggle — compact pill in header */}
            <button
              onClick={() => setIsDark(d => !d)}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
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
                flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
            >
              <span style={{ fontSize: '0.95rem' }}>{isDark ? '☀️' : '🌙'}</span>
              <span className="hide-mobile">{isDark ? 'Light' : 'Dark'}</span>
            </button>

            {/* Bell */}
            <button className="notif-btn">
              <Bell size={16} style={{ color: 'var(--color-text-secondary)' }} />
              <div className="notif-dot" />
            </button>

            {/* User Chip */}
            <div className="header-user-chip">
              <div className="avatar">{getInitials(userName)}</div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', lineHeight: 1.2, color: 'var(--color-text-primary)' }}>{userName}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{userRole}</div>
              </div>
            </div>
          </div>
        </header>

        {/* ── ROUTED VIEWS ──────────────────────────────────── */}
        <div className="content-body">
          <Routes>
            <Route path="/" element={
              <Dashboard
                cart={cart}
                orders={orders}
                appointments={appointments}
                setSelectedDoctor={setSelectedDoctor}
                rescheduleAppointment={rescheduleAppointment}
                cancelAppointment={cancelAppointment}
              />
            } />
            <Route path="/chat" element={
              <Chat addToCart={addToCart} onSafetyFlagged={handleSafetyFlagged} />
            } />
            <Route path="/pharmacy" element={
              <Pharmacy
                cart={cart}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                updateCartQuantity={updateCartQuantity}
                clearCart={clearCart}
                checkoutOrders={checkoutOrders}
                medicinesList={medicinesList}
              />
            } />
            <Route path="/orders" element={<OrderTracking orders={orders} />} />
            <Route path="/doctors" element={<Doctors addAppointment={addAppointment} doctorsList={doctorsList} />} />
            <Route path="/consultation" element={
              <Consultation selectedDoctor={selectedDoctor} addPrescription={addPrescription} />
            } />
            <Route path="/prescription" element={
              <Prescription prescriptions={prescriptions} addCartItems={addCartItems} />
            } />
            <Route path="/records" element={<Records />} />
            <Route path="/admin" element={
              <Admin
                adminOrders={orders}
                updateOrderStatus={updateOrderStatus}
                userRole={userRole}
                safetyLogs={safetyLogs}
                doctorsList={doctorsList}
                onRegisterDoctor={handleRegisterDoctor}
                onAddMedicine={handleAddMedicine}
              />
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
