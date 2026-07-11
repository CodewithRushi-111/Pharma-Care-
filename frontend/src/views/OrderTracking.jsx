import React, { useState } from 'react';
import StatusStepper from '../components/StatusStepper';
import LeftAccentCard from '../components/LeftAccentCard';
import { Calendar, MapPin, AlertTriangle } from 'lucide-react';

export default function OrderTracking({ orders = [] }) {
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);

  const defaultOrders = [
    {
      id: 'ORD-98210',
      date: '2026-07-09',
      items: ['Amoxicillin 500mg x1', 'Paracetamol 650mg x2'],
      statusIndex: 1, // Prescription Verification
      total: '₹200.00',
      address: 'Suite 404, Health City Heights, Mumbai - 400001',
      deliveryDate: '2026-07-11',
      hasRx: true,
      pharmacistNote: 'Your prescription check is in progress. Our pharmacist is cross-referencing your digital Amoxicillin script.'
    },
    {
      id: 'ORD-88125',
      date: '2026-07-08',
      items: ['Multivitamin Complex x1', 'HPMC Veggie Shells x1'],
      statusIndex: 3, // Shipped
      total: '₹430.00',
      address: 'Suite 404, Health City Heights, Mumbai - 400001',
      deliveryDate: '2026-07-10',
      hasRx: false
    }
  ];

  const activeOrders = orders.length > 0 ? [...orders, ...defaultOrders] : defaultOrders;
  const currentOrder = activeOrders[selectedOrderIndex] || activeOrders[0];

  const stepperStages = ['Placed', 'Verification', 'Confirmed', 'Shipped', 'Delivered'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2>Order Delivery Tracker</h2>

      <div className="grid-1-2">
        {/* Left Side: Orders List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '8px' }}>Your Orders</h3>
          {activeOrders.map((ord, idx) => (
            <div 
              key={ord.id} 
              className={`left-accent-card ${selectedOrderIndex === idx ? 'active' : ''}`}
              style={{
                '--accent-color': selectedOrderIndex === idx ? 'var(--color-primary)' : 'var(--color-border)',
                borderLeftWidth: '4px',
                cursor: 'pointer',
                backgroundColor: 'var(--color-surface)',
                opacity: selectedOrderIndex === idx ? 1 : 0.8
              }}
              onClick={() => setSelectedOrderIndex(idx)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="mono-text" style={{ fontWeight: '600' }}>{ord.id}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{ord.date}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {ord.items.join(', ')}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <span className="mono-text" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-primary)' }}>{ord.total}</span>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: ord.statusIndex === 4 ? 'var(--color-success)' : 'var(--color-accent)'
                }}>
                  {stepperStages[ord.statusIndex]}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Detailed Tracking View */}
        {currentOrder && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
              <div>
                <span className="caption" style={{ color: 'var(--color-text-secondary)' }}>Active Delivery</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginTop: '4px' }}>Order {currentOrder.id}</h3>
              </div>
              <span className="mono-text" style={{ backgroundColor: 'var(--color-surface-alt)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                Placed: {currentOrder.date}
              </span>
            </div>

            {/* Stepper display */}
            <div>
              <StatusStepper 
                steps={stepperStages} 
                currentStepIndex={currentOrder.statusIndex} 
              />
            </div>

            {/* Pharmacist flag note */}
            {currentOrder.pharmacistNote && currentOrder.statusIndex === 1 && (
              <LeftAccentCard accentColor="var(--color-warning)" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <AlertTriangle size={20} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '4px' }}>Pharmacist Verification Pending</h4>
                    <p style={{ fontSize: '0.85rem' }}>{currentOrder.pharmacistNote}</p>
                  </div>
                </div>
              </LeftAccentCard>
            )}

            {/* Order Items & Delivery Details */}
            <div className="grid-2-1" style={{ gap: '24px', borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
              <div>
                <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: '600', marginBottom: '12px', fontSize: '0.95rem' }}>Items Ordered</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentOrder.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '8px 12px', backgroundColor: 'var(--color-surface-alt)', borderRadius: 'var(--radius-sm)' }}>
                      <span>{item.split(' x')[0]}</span>
                      <span className="mono-text" style={{ fontWeight: '600' }}>x{item.split(' x')[1] || '1'}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: '600', marginBottom: '8px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} /> Destination
                  </h4>
                  <p style={{ fontSize: '0.85rem' }}>{currentOrder.address}</p>
                </div>

                <div>
                  <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: '600', marginBottom: '8px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={16} /> Estimated Arrival
                  </h4>
                  <span className="mono-text" style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-primary)' }}>
                    {currentOrder.deliveryDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
