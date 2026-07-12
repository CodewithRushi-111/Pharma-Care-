import React from 'react';
import { Check } from 'lucide-react';

export default function StatusStepper({ 
  steps = ['Placed', 'Verification', 'Confirmed', 'Shipped', 'Delivered'], 
  currentStepIndex,
  statusIndex 
}) {
  const activeIndex = currentStepIndex !== undefined ? currentStepIndex : (statusIndex !== undefined ? statusIndex : 1);
  const safeSteps = Array.isArray(steps) ? steps : [];

  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '16px 0', overflowX: 'auto' }}>
      {safeSteps.map((step, idx) => {
        const isCompleted = idx < activeIndex;
        const isActive = idx === activeIndex;
        
        return (
          <React.Fragment key={idx}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px', flex: 1, position: 'relative' }}>
              <div 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isCompleted 
                    ? 'var(--color-primary)' 
                    : isActive 
                      ? 'var(--color-accent)' 
                      : 'var(--color-surface)',
                  color: isCompleted || isActive ? 'white' : 'var(--color-text-secondary)',
                  border: isCompleted || isActive ? 'none' : '2px solid var(--color-border)',
                  boxShadow: isActive ? '0 0 0 4px var(--color-accent-soft)' : 'none',
                  zIndex: 2,
                  transition: 'all 0.3s ease'
                }}
              >
                {isCompleted ? (
                  <Check size={16} strokeWidth={3} />
                ) : (
                  <span style={{ fontSize: '13px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{idx + 1}</span>
                )}
              </div>
              
              <span 
                style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive 
                    ? 'var(--color-text-primary)' 
                    : isCompleted 
                      ? 'var(--color-primary)' 
                      : 'var(--color-text-secondary)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                {step}
              </span>
            </div>
            
            {idx < safeSteps.length - 1 && (
              <div 
                style={{
                  flex: 1,
                  height: '3px',
                  backgroundColor: idx < activeIndex ? 'var(--color-primary)' : 'var(--color-border)',
                  margin: '0 -20px 20px -20px',
                  zIndex: 1,
                  transition: 'background-color 0.3s ease'
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
