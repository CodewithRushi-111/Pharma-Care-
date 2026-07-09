import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Check, ShoppingBag } from 'lucide-react';

export default function Prescription({ prescriptions = [], addCartItems }) {
  const navigate = useNavigate();

  const defaultRx = {
    id: 'RX-908125',
    doctor: 'Dr. Evelyn Rao',
    specialty: 'General Medicine',
    date: 'July 09, 2026',
    items: [
      { name: 'Amoxicillin 500mg', dosage: '1 capsule', frequency: 'Thrice daily', duration: '5 days', requiresRx: true, price: 120.00, id: '3', generic: 'Penicillin Antibiotic' },
      { name: 'Paracetamol 650mg', dosage: '1 tablet', frequency: 'As needed (SOS)', duration: '3 days', requiresRx: false, price: 40.00, id: '1', generic: 'Analgesic & Antipyretic' }
    ]
  };

  const currentRx = prescriptions.length > 0 ? prescriptions[prescriptions.length - 1] : defaultRx;

  const handleOrderAll = () => {
    // Map items to catalog medicine formats
    const itemsToOrder = currentRx.items.map(item => ({
      id: item.id || `MOCK-${Math.random()}`,
      name: item.name,
      generic: item.generic || 'Prescribed Drug',
      price: item.price || 100.00,
      requiresRx: item.requiresRx !== undefined ? item.requiresRx : true
    }));
    
    addCartItems(itemsToOrder);
    navigate('/pharmacy', { state: { goToCart: true } });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
      
      {/* Action buttons at top */}
      <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: '700px', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Prescription Document</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Download size={16} /> Download PDF
          </button>
          <button className="btn btn-primary" onClick={handleOrderAll}>
            <ShoppingBag size={16} /> Order Medicines
          </button>
        </div>
      </div>

      {/* The Printable Prescription Card */}
      <div 
        className="card" 
        style={{
          width: '100%',
          maxWidth: '700px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-lg)',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          color: 'var(--color-text-primary)'
        }}
      >
        {/* Doctor Letterhead */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--color-primary)', paddingBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--color-primary)', marginBottom: '4px' }}>
              {currentRx.doctor}
            </h1>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
              {currentRx.specialty}
            </span>
            <p style={{ fontSize: '0.8rem', marginTop: '6px' }}>Registration No: PMC-9821-A &bull; Tel: +91 22 5550190</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>Pharma Care</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Digital Healthcare Suite</p>
          </div>
        </div>

        {/* Patient & Date Meta Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', backgroundColor: 'var(--color-surface-alt)', padding: '16px 20px', borderRadius: 'var(--radius-sm)' }}>
          <div>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>PATIENT NAME</span>
            <div style={{ fontWeight: '600', fontFamily: 'var(--font-mono)' }}>Rishi Kumar</div>
          </div>
          <div>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>PRESCRIPTION ID</span>
            <div style={{ fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{currentRx.id}</div>
          </div>
          <div>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>ISSUE DATE</span>
            <div style={{ fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{currentRx.date}</div>
          </div>
        </div>

        {/* Prescription Symbol and Table */}
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '16px', lineHeight: 1 }}>Rx</div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', paddingBottom: '12px' }}>
                <th style={{ padding: '12px 8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Medicine details</th>
                <th style={{ padding: '12px 8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Dosage</th>
                <th style={{ padding: '12px 8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Frequency</th>
                <th style={{ padding: '12px 8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Duration</th>
              </tr>
            </thead>
            <tbody>
              {currentRx.items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '16px 8px' }}>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{item.name}</div>
                    {item.generic && <span className="mono-text" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{item.generic}</span>}
                  </td>
                  <td className="mono-text" style={{ padding: '16px 8px', fontSize: '0.85rem' }}>{item.dosage}</td>
                  <td className="mono-text" style={{ padding: '16px 8px', fontSize: '0.85rem' }}>{item.frequency}</td>
                  <td className="mono-text" style={{ padding: '16px 8px', fontSize: '0.85rem' }}>{item.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Digital Signature & Verification Check */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '24px' }}>
          <div>
            <div className="badge badge-success" style={{ gap: '6px', padding: '6px 12px' }}>
              <Check size={14} strokeWidth={3} />
              Digitally verified &amp; signed
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '8px', maxWidth: '300px' }}>
              This document is digitally authorized by the practitioner under Pharma Care health policy rules and is valid for fulfillment.
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Fraunces', fontStyle: 'italic', fontSize: '1.25rem', color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border)', width: '150px', paddingBottom: '6px', marginBottom: '4px' }}>
              Evelyn Rao
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Authorized Signatory</span>
          </div>
        </div>
      </div>
    </div>
  );
}
