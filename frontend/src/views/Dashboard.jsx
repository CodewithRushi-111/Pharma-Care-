import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusStepper from '../components/StatusStepper';
import {
  Calendar, ArrowRight, Activity,
  X, Edit2, Brain, Pill, Stethoscope, Package,
  CheckCircle, Clock, Heart, Zap,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────────
   PHARMA CARE — Dashboard (Patient View)
   Rich activity data, responsive grid, metric cards, quick actions
   ────────────────────────────────────────────────────────────── */

const QUICK_ACTIONS = [
  { icon: '🧠', label: 'AI Triage', path: '/chat', color: '#059669', bg: 'rgba(5,150,105,0.10)' },
  { icon: '👨‍⚕️', label: 'Book Doctor', path: '/doctors', color: '#2563EB', bg: 'rgba(37,99,235,0.10)' },
  { icon: '💊', label: 'Buy Medicine', path: '/pharmacy', color: '#D97706', bg: 'rgba(217,119,6,0.10)' },
  { icon: '🎥', label: 'Telemedicine', path: '/consultation', color: '#7C3AED', bg: 'rgba(124,58,237,0.10)' },
  { icon: '📋', label: 'Prescriptions', path: '/prescription', color: '#DC2626', bg: 'rgba(220,38,38,0.10)' },
  { icon: '📊', label: 'Health Records', path: '/records', color: '#0891B2', bg: 'rgba(8,145,178,0.10)' },
];

const ACTIVITY_FEED = [
  { icon: '💊', title: 'Amoxicillin 500mg ordered', detail: 'Order ORD-98210 placed — awaiting pharmacy verification', time: '45 min ago', type: 'order', color: 'rgba(217,119,6,0.12)', iconColor: '#D97706' },
  { icon: '📋', title: 'Prescription issued by Dr. Evelyn Rao', detail: 'Amoxicillin 500mg, Paracetamol 650mg — 5 day course', time: '2 hrs ago', type: 'prescription', color: 'rgba(5,150,105,0.10)', iconColor: '#059669' },
  { icon: '🎥', title: 'Telemedicine session completed', detail: 'General Medicine consult — Duration: 18 minutes', time: 'Jul 09, 10:30 AM', type: 'consult', color: 'rgba(37,99,235,0.10)', iconColor: '#2563EB' },
  { icon: '🧪', title: 'Lab results uploaded', detail: 'CBC + Lipid Panel — All values in normal range', time: 'Jul 08, 4:00 PM', type: 'lab', color: 'rgba(8,145,178,0.10)', iconColor: '#0891B2' },
  { icon: '⚡', title: 'AI Emergency Check performed', detail: 'Symptom: chest tightness — Escalated to Dr. Rao', time: 'Jul 07, 8:15 PM', type: 'ai', color: 'rgba(220,38,38,0.10)', iconColor: '#DC2626' },
  { icon: '✅', title: 'Annual health check scheduled', detail: 'Dr. Rajesh Nair — Cardiology — Jul 14, 11:00 AM', time: 'Jul 06, 3:00 PM', type: 'appointment', color: 'rgba(124,58,237,0.10)', iconColor: '#7C3AED' },
];

const HEALTH_METRICS = [
  { label: 'Heart Rate', value: '72', unit: 'bpm', icon: '❤️', trend: 'stable', change: '+2', bg: 'rgba(220,38,38,0.08)', color: '#DC2626', sparkline: [68, 72, 70, 74, 72, 71, 72] },
  { label: 'Blood Pressure', value: '118/78', unit: 'mmHg', icon: '🩺', trend: 'good', change: '–3', bg: 'rgba(5,150,105,0.08)', color: '#059669', sparkline: [120, 118, 122, 116, 118, 120, 118] },
  { label: 'Blood Sugar', value: '95', unit: 'mg/dL', icon: '🩸', trend: 'stable', change: '+1', bg: 'rgba(217,119,6,0.08)', color: '#D97706', sparkline: [94, 96, 93, 97, 95, 96, 95] },
  { label: 'BMI', value: '22.4', unit: 'kg/m²', icon: '⚖️', trend: 'good', change: '–0.2', bg: 'rgba(37,99,235,0.08)', color: '#2563EB', sparkline: [22.8, 22.6, 22.5, 22.4, 22.4, 22.4, 22.4] },
];

const UPCOMING_MEDICATIONS = [
  { name: 'Amoxicillin 500mg', dose: '1 capsule', time: '8:00 AM', taken: true },
  { name: 'Paracetamol 650mg', dose: '1 tablet', time: '2:00 PM', taken: false },
  { name: 'Multivitamin Complex', dose: '1 tablet', time: '8:00 PM', taken: false },
];

/* Micro sparkline SVG */
function Sparkline({ values = [], color = '#059669', w = 70, h = 30 }) {
  if (values.length < 2) return null;
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) =>
    `${(i / (values.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`
  ).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Dashboard({ _cart, orders = [], appointments = [], _setSelectedDoctor, rescheduleAppointment, cancelAppointment }) {
  const navigate = useNavigate();
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAptId, setSelectedAptId] = useState(null);
  const [newSlot, setNewSlot] = useState('');
  const [medicationDone, setMedicationDone] = useState({ 0: true });

  const displayOrders = orders.length > 0 ? orders : [
    { id: 'ORD-98210', items: ['Amoxicillin 500mg', 'Paracetamol 650mg'], statusIndex: 1, date: '2026-07-09' }
  ];
  const displayAppointments = appointments.length > 0 ? appointments : [
    { id: 'APT-4421', doctor: 'Dr. Evelyn Rao', specialty: 'General Medicine', date: 'Today, 4:30 PM', status: 'ready' }
  ];

  const handleCancelClick = (aptId) => {
    if (window.confirm('Cancel this consultation? This action cannot be undone.')) {
      if (cancelAppointment) { cancelAppointment(aptId); }
    }
  };
  const handleRescheduleSubmit = () => {
    if (!newSlot) { alert('Please select a time slot.'); return; }
    if (rescheduleAppointment) { rescheduleAppointment(selectedAptId, newSlot); }
    setShowRescheduleModal(false);
    alert(`Rescheduled to: ${newSlot}`);
  };
  const availableSlots = ['Tomorrow, 10:00 AM', 'Tomorrow, 2:30 PM', 'Sat Jul 11, 11:00 AM', 'Sat Jul 11, 4:00 PM'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeInUp 0.5s ease both' }}>

      {/* ── WELCOME HERO STRIP ─────────────────────────────── */}
      <div style={{
        borderRadius: 'var(--radius-lg)',
        padding: 'clamp(20px, 4vw, 36px)',
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
        boxShadow: 'var(--shadow-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* BG decoration */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-30px', right: '120px', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            👋 Good afternoon
          </p>
          <h2 style={{ color: 'white', fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: '8px' }}>Rishi Kumar</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            You have <strong style={{ color: 'white' }}>{displayAppointments.length} upcoming consultation</strong> and{' '}
            <strong style={{ color: 'white' }}>{displayOrders.length} active order</strong> today.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <button className="btn" style={{ background: 'white', color: 'var(--color-primary)', fontWeight: '700', borderRadius: 'var(--radius-full)', padding: '10px 20px', fontSize: '0.875rem' }} onClick={() => navigate('/chat')}>
            <Brain size={15} /> AI Check-up
          </button>
          <button className="btn" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1.5px solid rgba(255,255,255,0.35)', borderRadius: 'var(--radius-full)', padding: '9px 20px', fontSize: '0.875rem' }} onClick={() => navigate('/doctors')}>
            <Stethoscope size={15} /> Book Doctor
          </button>
        </div>
      </div>

      {/* ── HEALTH METRIC CARDS ─────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '7px' }}><Heart size={16} color="var(--color-primary)" /> Health Vitals</h3>
          <button className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '4px 10px' }} onClick={() => navigate('/records')}>
            View Records <ArrowRight size={13} />
          </button>
        </div>
        <div className="grid-4" style={{ gap: '12px' }}>
          {HEALTH_METRICS.map((m, i) => (
            <div key={i} className="metric-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{m.icon}</div>
                <Sparkline values={m.sparkline} color={m.color} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span className="metric-value" style={{ color: m.color, fontSize: '1.5rem' }}>{m.value}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>{m.unit}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{m.label}</div>
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: m.trend === 'good' ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                {m.change} from last week
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUICK ACTIONS ───────────────────────────────────── */}
      <div>
        <h3 style={{ fontSize: '1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '7px' }}><Zap size={16} color="var(--color-accent)" /> Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px' }}>
          {QUICK_ACTIONS.map((action, i) => (
            <button key={i} className="quick-action" onClick={() => navigate(action.path)}>
              <div className="quick-action-icon" style={{ background: action.bg }}>
                <span style={{ fontSize: '1.4rem' }}>{action.icon}</span>
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--color-text-secondary)' }}>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── MIDDLE ROW: APPOINTMENTS + MEDICATIONS ──────────── */}
      <div className="grid-2" style={{ gap: '20px', alignItems: 'start' }}>
        {/* Upcoming Appointments */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={15} color="var(--color-primary)" /> Consultations
            </h3>
            <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.78rem', borderRadius: 'var(--radius-full)' }} onClick={() => navigate('/doctors')}>
              + Book
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {displayAppointments.map((apt) => (
              <div key={apt.id} style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-alt)', border: '1px solid var(--color-border)', transition: 'border-color 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--color-primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: '800' }}>👨‍⚕️</div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>{apt.doctor}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{apt.specialty}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}>
                      <Clock size={12} /> {apt.date}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <span className={`badge ${apt.status === 'ready' ? 'badge-success' : 'badge-warning'}`}>
                      {apt.status === 'ready' ? '● Ready' : '● Upcoming'}
                    </span>
                  </div>
                </div>
                {apt.status === 'ready' && (
                  <button className="btn btn-primary" style={{ marginTop: '10px', width: '100%', padding: '8px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)' }} onClick={() => navigate('/consultation')}>
                    Join Consultation Room →
                  </button>
                )}
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button className="btn btn-ghost" style={{ padding: '5px 10px', fontSize: '0.75rem', flex: 1 }} onClick={() => { setSelectedAptId(apt.id); setShowRescheduleModal(true); }}>
                    <Edit2 size={11} /> Reschedule
                  </button>
                  <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: '0.75rem', flex: 1 }} onClick={() => handleCancelClick(apt.id)}>
                    <X size={11} /> Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Medications */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Pill size={15} color="var(--color-accent)" /> Today's Medications
            </h3>
            <span className="badge badge-primary">{UPCOMING_MEDICATIONS.filter(m => medicationDone[UPCOMING_MEDICATIONS.indexOf(m)]).length}/{UPCOMING_MEDICATIONS.length} taken</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {UPCOMING_MEDICATIONS.map((med, i) => {
              const taken = !!medicationDone[i];
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: 'var(--radius-md)', background: taken ? 'var(--color-primary-dim)' : 'var(--color-surface-alt)', border: `1px solid ${taken ? 'rgba(5,150,105,0.25)' : 'var(--color-border)'}`, transition: 'all 0.25s' }}>
                  <button
                    onClick={() => setMedicationDone(prev => ({ ...prev, [i]: !prev[i] }))}
                    style={{ width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${taken ? 'var(--color-primary)' : 'var(--color-border-hover)'}`, background: taken ? 'var(--color-primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' }}
                  >
                    {taken && <CheckCircle size={13} color="white" strokeWidth={3} />}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: taken ? 'var(--color-text-muted)' : 'var(--color-text-primary)', textDecoration: taken ? 'line-through' : 'none', transition: 'all 0.2s' }}>{med.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{med.dose}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-muted)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} /> {med.time}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Progress bar */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: '600' }}>
              <span>Adherence today</span>
              <span>{Math.round((Object.values(medicationDone).filter(Boolean).length / UPCOMING_MEDICATIONS.length) * 100)}%</span>
            </div>
            <div style={{ height: '6px', background: 'var(--color-surface-alt)', borderRadius: '3px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
              <div style={{ height: '100%', width: `${(Object.values(medicationDone).filter(Boolean).length / UPCOMING_MEDICATIONS.length) * 100}%`, background: 'var(--color-primary)', borderRadius: '3px', transition: 'width 0.4s ease' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: ORDER + ACTIVITY FEED ───────────────── */}
      <div className="grid-2-1" style={{ gap: '20px', alignItems: 'start' }}>
        {/* Active Orders */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Package size={15} color="var(--color-primary)" /> Active Orders</h3>
            <button className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '4px 10px' }} onClick={() => navigate('/orders')}>View all <ArrowRight size={12} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {displayOrders.map((order) => (
              <div key={`${order.id}-dash`} style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-alt)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-primary)' }}>{order.id}</span>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{order.items?.join(', ') || '—'}</div>
                  </div>
                  <span className="badge badge-warning">Verifying Rx</span>
                </div>
                <StatusStepper statusIndex={order.statusIndex ?? 1} />
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button className="btn btn-secondary" style={{ flex: 1, padding: '7px', fontSize: '0.78rem' }} onClick={() => navigate('/orders')}>Track Order</button>
                  <button className="btn btn-ghost" style={{ flex: 1, padding: '7px', fontSize: '0.78rem' }} onClick={() => navigate('/pharmacy')}>+ Reorder</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={15} color="var(--color-primary)" /> Recent Activity</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {ACTIVITY_FEED.map((item, i) => (
              <div key={i} className="activity-item">
                <div className="activity-icon" style={{ background: item.color, flexShrink: 0, fontSize: '1.05rem' }}>{item.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--color-text-primary)', lineHeight: 1.3, marginBottom: '2px' }}>{item.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.detail}</div>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', flexShrink: 0, fontWeight: '500', whiteSpace: 'nowrap' }}>{item.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── AI HEALTH INSIGHT BANNER ─────────────────────────── */}
      <div style={{ padding: '18px 20px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-dim)', border: '1px solid rgba(5,150,105,0.20)', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🧠</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--color-text-primary)', marginBottom: '3px' }}>AI Health Insight</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
            Based on your recent CBC results, your hemoglobin is within normal range. Consider scheduling a follow-up in 3 months for preventive screening.
          </div>
        </div>
        <button className="btn btn-primary" style={{ fontSize: '0.82rem', padding: '8px 16px', borderRadius: 'var(--radius-full)', flexShrink: 0 }} onClick={() => navigate('/chat')}>
          Ask AI <ArrowRight size={13} />
        </button>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '20px', animation: 'fadeIn 0.2s ease' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '28px', animation: 'bounceIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Reschedule Appointment</h3>
              <button className="btn btn-ghost" style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%' }} onClick={() => setShowRescheduleModal(false)}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {availableSlots.map((slot) => (
                <button key={slot} onClick={() => setNewSlot(slot)} className="btn" style={{ background: newSlot === slot ? 'var(--color-primary-dim)' : 'var(--color-surface-alt)', border: `1.5px solid ${newSlot === slot ? 'var(--color-primary)' : 'var(--color-border)'}`, color: newSlot === slot ? 'var(--color-primary)' : 'var(--color-text-secondary)', borderRadius: 'var(--radius-md)', padding: '12px', fontSize: '0.875rem', justifyContent: 'flex-start', fontWeight: newSlot === slot ? '700' : '500' }}>
                  <Clock size={14} /> {slot}
                </button>
              ))}
            </div>
            <button className="btn btn-primary" style={{ marginTop: '20px', width: '100%', padding: '12px', borderRadius: 'var(--radius-md)' }} onClick={handleRescheduleSubmit}>
              Confirm Reschedule
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
