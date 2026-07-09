import React, { useState } from 'react';
import LeftAccentCard from '../components/LeftAccentCard';
import { Calendar, Filter, Eye, ChevronDown, ChevronUp, FileText, CheckCircle2 } from 'lucide-react';

export default function Records() {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [filterType, setFilterType] = useState({
    consultations: true,
    prescriptions: true,
    orders: true
  });

  const timelineItems = [
    {
      id: 'REC-101',
      title: 'Digital Consultation — Dr. Evelyn Rao',
      specialty: 'General Medicine',
      date: 'Jul 09, 2026',
      type: 'consultation',
      color: 'var(--color-success)',
      summary: 'Patient presented with mild throat discomfort and dry cough. Recommended warm fluids, paracetamol, and amoxicillin course.',
      details: 'Symptoms: Sore throat, cough, no fever. Diagnosis: Mild pharyngitis. Prescribed Amoxicillin 500mg, Paracetamol 650mg.'
    },
    {
      id: 'REC-102',
      title: 'Prescription Digital Release — RX-908125',
      doctor: 'Dr. Evelyn Rao',
      date: 'Jul 09, 2026',
      type: 'prescription',
      color: 'var(--color-accent)',
      summary: 'Amoxicillin 500mg (15 Caps) & Paracetamol 650mg (10 Tabs) authorized.',
      details: 'Authorized script sent directly to Pharma Care delivery system. Status: Approved & Active.'
    },
    {
      id: 'REC-103',
      title: 'Pharmacy Dispense & Pack — ORD-98210',
      status: 'Verification Completed',
      date: 'Jul 09, 2026',
      type: 'order',
      color: 'var(--color-primary)',
      summary: 'Amoxicillin & Paracetamol checked and verified by Dispensing Pharmacist Dr. Alok Sen.',
      details: 'Dispense verification timestamp: Jul 09 11:45 AM. Cold-chain storage validated. Packaging: Sealed child-resistant amber vials.'
    },
    {
      id: 'REC-104',
      title: 'General Health Profile Created',
      status: 'Onboarding Complete',
      date: 'Jul 08, 2026',
      type: 'consultation',
      color: 'var(--color-text-secondary)',
      summary: 'Primary profile setup, allergy verification (Nil reported), age check completed.',
      details: 'User verification via national health records portal. Medical profile state: Active. Age: 24.'
    }
  ];

  const filteredItems = timelineItems.filter(item => {
    if (item.type === 'consultation' && !filterType.consultations) return false;
    if (item.type === 'prescription' && !filterType.prescriptions) return false;
    if (item.type === 'order' && !filterType.orders) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2>Clinical Health Timeline</h2>

      <div className="grid-2-1">
        {/* Left Side: Timeline flow */}
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', paddingLeft: '24px' }}>
          
          {/* Vertical line connector */}
          <div style={{
            position: 'absolute',
            top: '8px',
            bottom: '8px',
            left: '7px',
            width: '2px',
            backgroundColor: 'var(--color-border)'
          }} />

          {filteredItems.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div key={item.id} style={{ position: 'relative', marginBottom: '24px' }}>
                
                {/* Timeline connector dot */}
                <div style={{
                  position: 'absolute',
                  left: '-24px',
                  top: '18px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: item.color,
                  border: '4px solid var(--color-bg)',
                  zIndex: 2,
                  boxShadow: 'var(--shadow-sm)'
                }} />

                {/* Record card */}
                <LeftAccentCard 
                  accentColor={item.color} 
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  style={{ padding: '16px 24px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span className="mono-text" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{item.date}</span>
                      <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', fontWeight: '600', color: 'var(--color-text-primary)', marginTop: '4px' }}>
                        {item.title}
                      </h4>
                    </div>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>

                  <p style={{ fontSize: '0.85rem', marginTop: '12px', color: 'var(--color-text-secondary)' }}>
                    {item.summary}
                  </p>

                  {isExpanded && (
                    <div style={{
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--color-border)',
                      fontSize: '0.85rem',
                      animation: 'slideIn 0.2s ease-out'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '6px', color: 'var(--color-text-primary)' }}>Details &amp; Observations:</div>
                      <p style={{ color: 'var(--color-text-primary)' }}>{item.details}</p>
                      
                      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                        <span className="mono-text" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-surface-alt)', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>
                          RECORD ID: {item.id}
                        </span>
                        <span className="mono-text" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-surface-alt)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={12} style={{ color: 'var(--color-success)' }} /> VERIFIED
                        </span>
                      </div>
                    </div>
                  )}
                </LeftAccentCard>
              </div>
            );
          })}
        </div>

        {/* Right Side: Filters */}
        <div className="card" style={{ height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} /> Filter Records
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input 
                type="checkbox" 
                checked={filterType.consultations}
                onChange={() => setFilterType(prev => ({ ...prev, consultations: !prev.consultations }))}
                style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
              />
              <span>Consultations</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input 
                type="checkbox" 
                checked={filterType.prescriptions}
                onChange={() => setFilterType(prev => ({ ...prev, prescriptions: !prev.prescriptions }))}
                style={{ width: '16px', height: '16px', accentColor: 'var(--color-accent)' }}
              />
              <span>Prescriptions</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input 
                type="checkbox" 
                checked={filterType.orders}
                onChange={() => setFilterType(prev => ({ ...prev, orders: !prev.orders }))}
                style={{ width: '16px', height: '16px', accentColor: 'var(--color-success)' }}
              />
              <span>Pharmacy Deliveries</span>
            </label>
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
            <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: '600', fontSize: '0.85rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date Range</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input type="date" className="btn btn-secondary" style={{ width: '100%', fontSize: '0.85rem', textAlign: 'left' }} defaultValue="2026-07-01" />
              <input type="date" className="btn btn-secondary" style={{ width: '100%', fontSize: '0.85rem', textAlign: 'left' }} defaultValue="2026-07-09" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
