import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Clipboard, Plus } from 'lucide-react';

export default function Consultation({ selectedDoctor, addPrescription }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('live'); // 'live', 'schedule', 'history'
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  
  // Prescription inputs
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [prescribedItems, setPrescribedItems] = useState([]);

  // Consultancy Maintenance State
  const [consultancyList, setConsultancyList] = useState([
    { id: 'APT-4421', doctor: 'Dr. Evelyn Rao', specialty: 'General Medicine', date: 'Today, 4:30 PM', fee: '₹500', status: 'Ready to Join', notes: 'Routine checkup & Amoxicillin verification' },
    { id: 'APT-8912', doctor: 'Dr. Rajesh Nair', specialty: 'Cardiology', date: 'Tomorrow, 11:00 AM', fee: '₹800', status: 'Scheduled', notes: 'Post-discharge ECG and vitals review' },
    { id: 'APT-3301', doctor: 'Dr. Priya Desai', specialty: 'Pediatrics', date: 'Jul 14, 2:00 PM', fee: '₹600', status: 'Confirmed', notes: 'Child vaccination schedule review' }
  ]);

  const doctorName = selectedDoctor ? selectedDoctor.doctor : 'Dr. Evelyn Rao';
  const specialty = selectedDoctor ? selectedDoctor.specialty : 'General Medicine';

  const handleAddItem = () => {
    if (!medName || !dosage || !frequency || !duration) {
      alert("Please fill in all prescription fields.");
      return;
    }
    const newItem = {
      name: medName,
      dosage: dosage,
      frequency: frequency,
      duration: duration
    };
    setPrescribedItems(prev => [...prev, newItem]);
    setMedName('');
    setDosage('');
    setFrequency('');
    setDuration('');
  };

  const handleCompleteConsult = () => {
    const newRx = {
      id: `RX-${Math.floor(100000 + Math.random() * 900000)}`,
      doctor: doctorName,
      specialty: specialty,
      date: new Date().toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' }),
      items: prescribedItems.length > 0 ? prescribedItems : [
        { name: 'Amoxicillin 500mg', dosage: '1 capsule', frequency: 'Thrice daily', duration: '5 days' },
        { name: 'Paracetamol 650mg', dosage: '1 tablet', frequency: 'As needed (SOS)', duration: '3 days' }
      ]
    };
    addPrescription(newRx);
    navigate('/prescription');
  };

  const handleStatusUpdate = (aptId, newStatus) => {
    setConsultancyList(prev => prev.map(a => a.id === aptId ? { ...a, status: newStatus } : a));
    alert(`Consultancy session ${aptId} status updated to: ${newStatus}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Consultancy Suite Navigation Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-surface)', padding: '16px 24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '4px' }}>Telemedicine &amp; Consultancy Suite</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Manage clinical schedules, live WebRTC rooms, and prescription verification maintenance.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'live', label: '🎥 Live Consultation Room' },
            { id: 'schedule', label: '📅 Consultancy Maintenance' },
            { id: 'history', label: '📋 Prescription Archive' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-surface-alt)',
                color: activeTab === tab.id ? 'white' : 'var(--color-text-primary)',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? '600' : '500',
                fontSize: '0.85rem'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 2: CONSULTANCY MAINTENANCE & DOCTOR SCHEDULES */}
      {activeTab === 'schedule' && (
        <div style={{ backgroundColor: 'var(--color-surface)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>Scheduled Consultancy Sessions &amp; Roster Maintenance</h3>
            <button className="btn btn-primary" onClick={() => navigate('/doctors')} style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
              + Schedule New Consult
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {consultancyList.map(apt => (
              <div key={apt.id} style={{ padding: '16px', backgroundColor: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span className="mono-text" style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{apt.id}</span>
                    <span className={`badge ${apt.status.includes('Ready') ? 'badge-success' : 'badge-warning'}`}>{apt.status}</span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>{apt.doctor} <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>({apt.specialty})</span></h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Time: <strong>{apt.date}</strong> &bull; Fee: <strong>{apt.fee}</strong> &bull; Notes: {apt.notes}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-accent" onClick={() => setActiveTab('live')} style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                    Enter Live Room
                  </button>
                  <button className="btn btn-secondary" onClick={() => handleStatusUpdate(apt.id, 'Rescheduled / Maintained')} style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                    Maintain Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PRESCRIPTION ARCHIVE & VERIFICATION LOGS */}
      {activeTab === 'history' && (
        <div style={{ backgroundColor: 'var(--color-surface)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '16px' }}>Verified Clinical Prescriptions &amp; Audit Trail</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { id: 'RX-94021', doctor: 'Dr. Evelyn Rao', specialty: 'General Medicine', date: 'July 09, 2026', items: 'Amoxicillin 500mg, Paracetamol 650mg', status: 'Verification Passed' },
              { id: 'RX-88102', doctor: 'Dr. Rajesh Nair', specialty: 'Cardiology', date: 'July 04, 2026', items: 'Atorvastatin 20mg, Aspirin 75mg', status: 'Dispensed & Delivered' }
            ].map((rx, idx) => (
              <div key={idx} style={{ padding: '16px', backgroundColor: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span className="mono-text" style={{ fontWeight: '700', color: 'var(--color-accent)' }}>{rx.id}</span>
                    <span className="badge badge-success">{rx.status}</span>
                  </div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Issued by {rx.doctor} ({rx.specialty})</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Date: {rx.date} &bull; Script: <strong>{rx.items}</strong></p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/pharmacy')} style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                  Order from Pharmacy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 1: LIVE VIDEO STREAM ROOM */}
      {activeTab === 'live' && (
        <div style={{
      display: 'flex',
      backgroundColor: '#16171d', // Dark canvas area for focus
      height: 'calc(100vh - var(--header-height) - 64px)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      color: 'white',
      position: 'relative'
    }}>
      {/* Video Stream Main Area */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f1013' }}>
        
        {/* Large Doctor Video (Placeholder) */}
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          {videoActive ? (
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#1f2025',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {/* Doctor Avatar */}
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', border: '3px solid white', marginBottom: '16px' }}>
                ER
              </div>
              <h3 style={{ color: 'white', fontFamily: 'var(--font-body)' }}>{doctorName}</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>{specialty} &bull; Connected</p>
            </div>
          ) : (
            <div style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.4)' }}>Doctor camera feed disabled</div>
          )}

          {/* Top Info Bar Overlay */}
          <div style={{ position: 'absolute', top: '20px', left: '20px', padding: '10px 16px', backgroundColor: 'rgba(22, 23, 29, 0.8)', borderRadius: 'var(--radius-sm)', backdropFilter: 'blur(4px)' }}>
            <span className="mono-text" style={{ fontSize: '0.85rem' }}>SESSION: ROOM-EVE-RAO &bull; LIVE</span>
          </div>

          {/* PIP Patient Video Tile */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            width: '150px',
            height: '100px',
            backgroundColor: '#1f2025',
            borderRadius: 'var(--radius-sm)',
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
            zIndex: 10
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>Patient (You)</span>
          </div>
        </div>

        {/* Floating Call Controls */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '16px',
          backgroundColor: 'rgba(22, 23, 29, 0.85)',
          padding: '12px 24px',
          borderRadius: 'var(--radius-full)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 20
        }}>
          <button 
            onClick={() => setMicActive(!micActive)}
            style={{ width: '48px', height: '48px', borderRadius: '50%', border: 'none', backgroundColor: micActive ? 'rgba(255,255,255,0.1)' : 'var(--color-error)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            {micActive ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
          
          <button 
            onClick={() => setVideoActive(!videoActive)}
            style={{ width: '48px', height: '48px', borderRadius: '50%', border: 'none', backgroundColor: videoActive ? 'rgba(255,255,255,0.1)' : 'var(--color-error)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            {videoActive ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          <button 
            onClick={() => setShowNotes(!showNotes)}
            style={{ width: '48px', height: '48px', borderRadius: '50%', border: 'none', backgroundColor: showNotes ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            title="Prescription prescription notes"
          >
            <Clipboard size={20} />
          </button>

          <button 
            onClick={handleCompleteConsult}
            style={{ width: '48px', height: '48px', borderRadius: '50%', border: 'none', backgroundColor: 'var(--color-error)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            title="End consultation session"
          >
            <PhoneOff size={20} />
          </button>
        </div>
      </div>

      {/* Slide-out Doctor Prescribing Panel */}
      {showNotes && (
        <div style={{
          width: '360px',
          backgroundColor: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          color: 'var(--color-text-primary)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          {/* Notes Header */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--color-primary)' }}>Prescription Pad</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Add prescription details to patient timeline</p>
          </div>

          {/* Form fields */}
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, overflowY: 'auto' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Medicine Name</label>
              <input 
                type="text" 
                placeholder="e.g. Amoxicillin 500mg"
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Dosage</label>
                <input 
                  type="text" 
                  placeholder="e.g. 1 capsule"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.9rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Frequency</label>
                <input 
                  type="text" 
                  placeholder="e.g. Thrice daily"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Duration</label>
              <input 
                type="text" 
                placeholder="e.g. 5 days"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.9rem' }}
              />
            </div>

            <button 
              className="btn btn-secondary" 
              style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
              onClick={handleAddItem}
            >
              <Plus size={14} /> Add to Prescription
            </button>

            {/* Prescribed list */}
            {prescribedItems.length > 0 && (
              <div style={{ marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                <span className="caption" style={{ color: 'var(--color-primary)', display: 'block', marginBottom: '10px' }}>Active Script:</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {prescribedItems.map((item, idx) => (
                    <div key={idx} style={{ padding: '10px', backgroundColor: 'var(--color-surface-alt)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                        {item.dosage} &bull; {item.frequency} &bull; {item.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notes Footer */}
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--color-border)' }}>
            <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }} onClick={handleCompleteConsult}>
              Complete Session &amp; Sign
            </button>
          </div>
        </div>
      )}
    </div>
  )}
</div>
  );
}
