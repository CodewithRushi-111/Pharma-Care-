import React from 'react';
import { FileText } from 'lucide-react';

export default function PrescriptionBadge({ className = '' }) {
  return (
    <span className={`badge badge-rx ${className}`} title="Prescription Required">
      <FileText size={12} style={{ marginRight: '2px' }} />
      Rx Required
    </span>
  );
}
