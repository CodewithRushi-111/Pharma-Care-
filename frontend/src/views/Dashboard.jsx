import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftAccentCard from '../components/LeftAccentCard';
import StatusStepper from '../components/StatusStepper';
import { Sparkles, Calendar, Clipboard, ArrowRight, Activity, FileText, ShoppingBag, X, Clock, Edit2 } from 'lucide-react';

export default function Dashboard({ cart, orders = [], appointments = [], setSelectedDoctor, rescheduleAppointment, cancelAppointment }) {
  const navigate = useNavigate();
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAptId, setSelectedAptId] = useState(null);
  const [newSlot, setNewSlot] = useState('');

  // Mock data if none passed
  const displayOrders = orders.length > 0 ? orders : [
    { id: 'ORD-98210', items: ['Amoxicillin 500mg', 'Paracetamol 650mg'], statusIndex: 1, date: '2026-07-09' }
  ];

  const displayAppointments = appointments.length > 0 ? appointments : [
    { id: 'APT-4421', doctor: 'Dr. Evelyn Rao', specialty: 'General Medicine', date: 'Today, 4:30 PM', status: 'ready' }
  ];

  const timelineEvents = [
    { title: 'Prescription Issued', detail: 'Dr. Evelyn Rao — Amoxicillin 500mg', type: 'prescription', date: 'Jul 09, 10:30 AM', color: 'var(--color-accent)' },
    { title: 'Pharmacy Order Placed', detail: 'Order ID: ORD-98210', type: 'order', date: 'Jul 09, 11:15 AM', color: 'var(--color-primary)' },
    { title: 'Lab Results Uploaded', detail: 'Complete Blood Count (CBC) Report', type: 'consultation', date: 'Jul 08, 04:00 PM', color: 'var(--color-success)' }
  ];

  const handleCancelClick = (aptId) => {
    // 2-hour cutoff check validation simulation
    const confirmCancel = window.confirm("Are you sure you want to cancel this digital consultation? Cancellations are only permitted up to 2 hours before the start time.");
    if (confirmCancel) {
      if (cancelAppointment) {
        cancelAppointment(aptId);
      } else {
        alert("Appointment successfully cancelled.");
      }
    }
  };

  const handleRescheduleSubmit = () => {
    if (!newSlot) {
      alert("Please select a new time slot.");
      return;
    }
    if (rescheduleAppointment) {
      rescheduleAppointment(selectedAptId, newSlot);
    }
    setShowRescheduleModal(false);
    alert(`Appointment has been rescheduled to: ${newSlot}`);
  };

  const availableSlots = [
    'Tomorrow, 10:00 AM',
    'Tomorrow, 2:30 PM',
    'Sat (Jul 11), 11:00 AM',
    'Sat (Jul 11), 4:00 PM'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, #3e6d60 100%)',
        color: 'var(--color-bg)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
          <h1 style={{ color: 'var(--color-bg)', marginBottom: '12px', fontSize: '2.5rem' }}>Welcome to Pharma Care</h1>
          <p style={{ color: 'rgba(250, 249, 246, 0.85)', fontSize: '1rem', marginBottom: '20px' }}>
            Your premium, digital-first destination for clinical consultations, instant AI-assisted medical information, and verified home pharmacy deliveries.
          </p>
          <button className="btn btn-accent" onClick={() => navigate('/chat')}>
            <Sparkles size={16} />
            Ask Health AI Assistant
          </button>
        </div>
        <div style={{
          position: 'absolute',
          right: '-20px',
          bottom: '-30px',
          fontSize: '180px',
          color: 'rgba(250, 249, 246, 0.05)',
          fontFamily: 'var(--font-display)',
          userSelect: 'none',
          pointerEvents: 'none'
        }}>Rx</div>
      </div>

      {/* Grid of Main Sections */}
      <div className="grid-3">
        {/* Ask AI Prompt Card */}
        <LeftAccentCard accentColor="var(--color-primary)">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Sparkles size={20} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Ask AI Assistant</h3>
          </div>
          <p style={{ marginBottom: '20px', fontSize: '0.9rem' }}>
            Need help checking symptoms, understanding active ingredients, or learning about dosage? Query the AI instantly.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['What is Paracetamol used for?', 'How should I take Amoxicillin?', 'Verify capsule shell materials'].map((q, idx) => (
              <button 
                key={idx} 
                className="btn btn-secondary" 
                style={{ justifyContent: 'space-between', padding: '10px 14px', fontSize: '0.85rem', textAlign: 'left' }}
                onClick={() => navigate('/chat', { state: { initialQuery: q } })}
              >
                <span>{q}</span>
                <ArrowRight size={14} />
              </button>
            ))}
          </div>
        </LeftAccentCard>

        {/* Appointment Card */}
        <LeftAccentCard accentColor="var(--color-accent)">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Calendar size={20} style={{ color: 'var(--color-accent)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Telemedicine Call</h3>
          </div>
          {displayAppointments.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '24px 0' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>No active appointments booked.</p>
              <button className="btn btn-primary" onClick={() => navigate('/doctors')}>Book Doctor Now</button>
            </div>
          ) : (
            displayAppointments.map((apt, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', fontWeight: '600' }}>{apt.doctor}</h4>
                    <span className="mono-text" style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>{apt.id}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', marginBottom: '12px' }}>{apt.specialty}</p>
                  <div style={{
                    backgroundColor: 'var(--color-surface-alt)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    color: 'var(--color-text-primary)',
                    marginBottom: '10px'
                  }}>
                    {apt.date}
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', backgroundColor: apt.status === 'ready' ? 'var(--color-accent)' : 'var(--color-border)' }}
                    disabled={apt.status !== 'ready'}
                    onClick={() => {
                      setSelectedDoctor(apt);
                      navigate('/consultation');
                    }}
                  >
                    Join Consultation Room
                  </button>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ flex: 1, padding: '6px 8px', fontSize: '0.8rem' }}
                      onClick={() => {
                        setSelectedAptId(apt.id);
                        setShowRescheduleModal(true);
                      }}
                    >
                      <Edit2 size={12} style={{ marginRight: '4px' }} /> Reschedule
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      style={{ flex: 1, padding: '6px 8px', fontSize: '0.8rem', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                      onClick={() => handleCancelClick(apt.id)}
                    >
                      <X size={12} style={{ marginRight: '4px' }} /> Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </LeftAccentCard>

        {/* Recent Order Tracker */}
        <LeftAccentCard accentColor="var(--color-success)">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <ShoppingBag size={20} style={{ color: 'var(--color-success)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Active Order</h3>
          </div>
          {displayOrders.map((ord, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="mono-text" style={{ fontSize: '0.85rem' }}>{ord.id}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{ord.date}</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '16px' }}>
                  {ord.items.join(', ')}
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                <StatusStepper 
                  steps={['Placed', 'Verified', 'Shipped', 'Delivered']} 
                  currentStepIndex={ord.statusIndex} 
                />
                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', marginTop: '12px', fontSize: '0.85rem' }}
                  onClick={() => navigate('/deliveries')}
                >
                  View Delivery Details
                </button>
              </div>
            </div>
          ))}
        </LeftAccentCard>
      </div>

      {/* Health Timeline Segment */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={22} style={{ color: 'var(--color-primary)' }} />
            <h2 style={{ fontSize: '1.5rem' }}>Health Records Timeline</h2>
          </div>
          <button className="btn btn-secondary" style={{ fontSize: '0.85rem' }} onClick={() => navigate('/records')}>
            View Full Records
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {timelineEvents.map((ev, idx) => (
            <LeftAccentCard key={idx} accentColor={ev.color} style={{ padding: '14px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                    {ev.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem' }}>{ev.detail}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="mono-text" style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    {ev.date}
                  </span>
                  <FileText size={16} style={{ color: ev.color }} />
                </div>
              </div>
            </LeftAccentCard>
          ))}
        </div>
      </div>

      {/* Reschedule Selector Dialog Modal */}
      {showRescheduleModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(31, 37, 33, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ width: '90%', maxWidth: '400px', padding: '32px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Reschedule Consultation</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>Please choose a new available availability slot:</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {availableSlots.map((slot) => (
                <label 
                  key={slot}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: newSlot === slot ? 'var(--color-surface-alt)' : 'var(--color-surface)',
                    cursor: 'pointer'
                  }}
                >
                  <input 
                    type="radio" 
                    name="reschedule_slot" 
                    value={slot} 
                    checked={newSlot === slot}
                    onChange={() => setNewSlot(slot)}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{slot}</span>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowRescheduleModal(false)}>Back</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleRescheduleSubmit}>Confirm Slot</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
