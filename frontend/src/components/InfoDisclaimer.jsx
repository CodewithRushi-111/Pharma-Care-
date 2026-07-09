import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function InfoDisclaimer({ text, className = '' }) {
  return (
    <div className={`info-disclaimer ${className}`}>
      <AlertCircle size={18} strokeWidth={2} />
      <span style={{ fontWeight: '500' }}>{text}</span>
    </div>
  );
}
