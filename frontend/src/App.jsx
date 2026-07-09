import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
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
import { 
  Sparkles, 
  LayoutDashboard, 
  ShoppingBag, 
  Calendar, 
  FileText, 
  Activity, 
  ShieldAlert, 
  LogOut,
  Bell,
  Search
} from 'lucide-react';

function AppContent() {
  const location = useLocation();
  const [isLoggedIn, setLoggedIn] = useState(true); 
  const [userRole, setUserRole] = useState('Patient'); // 'Patient', 'Doctor', 'Pharmacy Admin', 'Platform Admin'
  const [userName, setUserName] = useState('Rishi Kumar');

  // Shared Dynamic Datasets (linking all modules together)
  const [safetyLogs, setSafetyLogs] = useState([]);
  const [doctorsList, setDoctorsList] = useState([
    { id: '1', name: 'Dr. Evelyn Rao', specialty: 'General Medicine', exp: '12 years', rating: 4.9, slots: ['4:30 PM', '5:00 PM', '6:00 PM'], fee: 500.00, bio: 'Experienced in treating acute/chronic conditions with a focus on preventative care and patient education.' },
    { id: '2', name: 'Dr. Kabir Mehta', specialty: 'Dermatology', exp: '8 years', rating: 4.8, slots: ['9:30 AM', '11:00 AM', '2:30 PM'], fee: 700.00, bio: 'Specialist in clinical dermatology, acne management, and digital skin health diagnostics.' },
    { id: '3', name: 'Dr. Sarah Alva', specialty: 'Pediatrics', exp: '15 years', rating: 5.0, slots: ['10:00 AM', '11:30 AM', '4:00 PM'], fee: 600.00, bio: 'Dedicated pediatric clinician providing child development consultations and nutritional guidance.' },
    { id: '4', name: 'Dr. Rajesh Nair', specialty: 'Cardiology', exp: '20 years', rating: 4.9, slots: ['3:00 PM', '4:30 PM'], fee: 1000.00, bio: 'Interventional cardiologist specializing in lipid management, hypertension, and cardiovascular health.' },
    { id: '5', name: 'Dr. Tanya Sen', specialty: 'Psychiatry', exp: '10 years', rating: 4.7, slots: ['1:00 PM', '2:00 PM', '5:30 PM'], fee: 800.00, bio: 'Focus on stress management, cognitive behavioral therapy, and neurodevelopmental consults.' }
  ]);

  const [medicinesList, setMedicinesList] = useState([
    { id: '1', name: 'Paracetamol 650mg', generic: 'Acetaminophen', category: 'Pain Relief', price: 40.00, requiresRx: false, inStock: true, details: 'Used to treat mild-to-moderate pain and reduce fever. Adults: 500mg-1000mg every 4-6 hours.', precautions: 'Avoid if you have history of liver disease.', sideEffects: 'Rare: skin rash, liver enzyme changes.' },
    { id: '2', name: 'Ibuprofen 400mg', generic: 'NSAID', category: 'Pain Relief', price: 60.00, requiresRx: false, inStock: true, details: 'Nonsteroidal anti-inflammatory drug (NSAID) used to reduce hormones that cause pain and inflammation.', precautions: 'Take with food to avoid gastric irritation.', sideEffects: 'Stomach upset, mild headache.' },
    { id: '3', name: 'Amoxicillin 500mg', generic: 'Penicillin Antibiotic', category: 'Antibiotics', price: 120.00, requiresRx: true, inStock: true, details: 'Used to treat infections caused by bacteria, such as tonsillitis, bronchitis, and pneumonia.', precautions: 'Do not use if allergic to penicillin.', sideEffects: 'Diarrhea, skin rash, nausea.' },
    { id: '4', name: 'Multivitamin Complex', generic: 'Essential Micronutrients', category: 'Vitamins', price: 250.00, requiresRx: false, inStock: true, details: 'Contains active forms of Vitamin B12, D3, Zinc, and Selenium for daily immune support.', precautions: 'Do not exceed daily recommended dosage.', sideEffects: 'Mild nausea if taken on empty stomach.' },
    { id: '5', name: 'HPMC Veggie Shells (Empty)', generic: 'Hypromellose Capsules', category: 'Veg-Caps', price: 180.00, requiresRx: false, inStock: true, details: 'Premium vegetable-based capsule shells. Ideal for custom compounding or sensitive patients.', precautions: 'Store in dry place, away from moisture.', sideEffects: 'None reported.' },
    { id: '6', name: 'Pantoprazole 40mg', generic: 'Proton Pump Inhibitor', category: 'Digestive Health', price: 95.00, requiresRx: true, inStock: false, details: 'Decreases the amount of acid produced in the stomach. Used for GERD and acid reflux.', precautions: 'Take 30 minutes before first meal of the day.', sideEffects: 'Headache, diarrhea, gas.', genericAlternative: { id: '7', name: 'Aciloc 150mg', price: 30.00, requiresRx: false, generic: 'Ranitidine (Generic Equivalent)' } }
  ]);

  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([
    {
      id: 'ORD-98210',
      patient: 'Rishi Kumar',
      date: 'Jul 09, 11:15 AM',
      items: ['Amoxicillin 500mg x1', 'Paracetamol 650mg x2'],
      status: 'pending_verification',
      statusIndex: 1,
      total: 200.00,
      age: 24,
      prescriptionName: 'rishi_kumar_prescription.jpg',
      waitingTime: '45 mins ago',
      urgencyColor: 'var(--color-success)',
      rxDoctor: 'Dr. Evelyn Rao'
    }
  ]);
  const [appointments, setAppointments] = useState([
    { id: 'APT-4421', doctor: 'Dr. Evelyn Rao', specialty: 'General Medicine', date: 'Today, 4:30 PM', status: 'ready' }
  ]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Cart Management
  const addToCart = (med) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === med.id);
      if (existing) {
        return prev.map(item => item.id === med.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...med, quantity: 1 }];
    });
    alert(`${med.name} added to cart.`);
  };

  const addCartItems = (items) => {
    items.forEach(item => addToCart(item));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const clearCart = () => setCart([]);

  // Orders Management
  const checkoutOrders = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId, newStatusIndex) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, statusIndex: newStatusIndex } : o));
  };

  // Appointments Management (Booking, Cancellation, Rescheduling)
  const addAppointment = (newApt) => {
    setAppointments(prev => [newApt, ...prev]);
  };

  const cancelAppointment = (aptId) => {
    setAppointments(prev => prev.filter(a => a.id !== aptId));
  };

  const rescheduleAppointment = (aptId, newDateStr) => {
    setAppointments(prev => prev.map(a => a.id === aptId ? { ...a, date: newDateStr } : a));
  };

  // Prescription Management
  const addPrescription = (newRx) => {
    setPrescriptions(prev => [...prev, newRx]);
  };

  // Platform Admin Handlers
  const handleSafetyFlagged = (safetyEvent) => {
    setSafetyLogs(prev => [safetyEvent, ...prev]);
  };

  const handleRegisterDoctor = (newDoc) => {
    setDoctorsList(prev => [...prev, newDoc]);
  };

  const handleAddMedicine = (newMed) => {
    setMedicinesList(prev => [...prev, newMed]);
  };

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '40px 20px', minHeight: '100vh', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1000px' }}>
          <Login setLoggedIn={setLoggedIn} setUserRole={setUserRole} setUserName={setUserName} />
        </div>
      </div>
    );
  }

  const isNavActive = (path) => {
    return location.pathname === path;
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Pharma Care Logo" />
          <span className="sidebar-logo-text">Pharma Care</span>
        </div>

        <nav className="sidebar-nav">
          <Link to="/" className={`nav-link ${isNavActive('/') ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link to="/chat" className={`nav-link ${isNavActive('/chat') ? 'active' : ''}`}>
            <Sparkles size={18} />
            AI Companion
          </Link>
          <Link to="/pharmacy" className={`nav-link ${isNavActive('/pharmacy') ? 'active' : ''}`}>
            <ShoppingBag size={18} />
            Pharmacy
          </Link>
          <Link to="/orders" className={`nav-link ${isNavActive('/orders') ? 'active' : ''}`}>
            <FileText size={18} />
            Deliveries
          </Link>
          <Link to="/doctors" className={`nav-link ${isNavActive('/doctors') ? 'active' : ''}`}>
            <Calendar size={18} />
            Consultations
          </Link>
          <Link to="/records" className={`nav-link ${isNavActive('/records') ? 'active' : ''}`}>
            <Activity size={18} />
            Health History
          </Link>

          {(userRole === 'Pharmacy Admin' || userRole === 'Platform Admin') && (
            <>
              <div style={{ margin: '20px 0', borderTop: '1px solid var(--color-border)' }} />
              <span className="caption" style={{ padding: '0 16px', color: 'var(--color-text-secondary)', marginBottom: '8px', fontSize: '11px' }}>Clinical Admin</span>
              
              <Link to="/admin" className={`nav-link ${isNavActive('/admin') ? 'active' : ''}`}>
                <ShieldAlert size={18} />
                Admin Suite
              </Link>
            </>
          )}

          <button 
            className="nav-link" 
            style={{ marginTop: 'auto', border: 'none', background: 'transparent', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            onClick={() => setLoggedIn(false)}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Panel Content */}
      <main className="main-content">
        <header className="header">
          <div className="header-search">
            <Search size={16} style={{ color: 'var(--color-text-secondary)' }} />
            <input type="text" placeholder="Global search timeline or scripts..." />
          </div>

          <div className="header-actions">
            <button className="btn btn-secondary" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, border: '1px solid var(--color-border)' }}>
              <Bell size={18} style={{ color: 'var(--color-text-primary)' }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="avatar">{getInitials(userName)}</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{userName}</span>
                <span className="caption" style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>{userRole.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </header>

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
              />
            } />
            <Route path="/orders" element={
              <OrderTracking orders={orders} />
            } />
            <Route path="/doctors" element={
              <Doctors addAppointment={addAppointment} doctorsList={doctorsList} />
            } />
            <Route path="/consultation" element={
              <Consultation selectedDoctor={selectedDoctor} addPrescription={addPrescription} />
            } />
            <Route path="/prescription" element={
              <Prescription prescriptions={prescriptions} addCartItems={addCartItems} />
            } />
            <Route path="/records" element={
              <Records />
            } />
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
