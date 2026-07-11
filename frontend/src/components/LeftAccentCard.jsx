import React from 'react';

export default function LeftAccentCard({ accentColor, children, className = '', onClick }) {
  const cardStyle = accentColor ? { '--accent-color': accentColor } : {};
  
  return (
    <div 
      className={`left-accent-card ${className}`} 
      onClick={onClick}
      role={onClick ? "button" : undefined}
      style={{ ...cardStyle, cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </div>
  );
}
