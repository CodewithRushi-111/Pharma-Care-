import React, { useState } from 'react';
import { Search, Clock, Star, Check } from 'lucide-react';

export default function Doctors({ addAppointment, doctorsList = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const specialties = ['All', 'General Medicine', 'Dermatology', 'Pediatrics', 'Cardiology', 'Psychiatry'];

  const defaultDoctors = [
    { id: '1', name: 'Dr. Evelyn Rao', specialty: 'General Medicine', exp: '12 years', rating: 4.9, slots: ['4:30 PM', '5:00 PM', '6:00 PM'], fee: 500.00, bio: 'Experienced in treating acute/chronic conditions with a focus on preventative care and patient education.' },
    { id: '2', name: 'Dr. Kabir Mehta', specialty: 'Dermatology', exp: '8 years', rating: 4.8, slots: ['9:30 AM', '11:00 AM', '2:30 PM'], fee: 700.00, bio: 'Specialist in clinical dermatology, acne management, and digital skin health diagnostics.' },
    { id: '3', name: 'Dr. Sarah Alva', specialty: 'Pediatrics', exp: '15 years', rating: 5.0, slots: ['10:00 AM', '11:30 AM', '4:00 PM'], fee: 600.00, bio: 'Dedicated pediatric clinician providing child development consultations and nutritional guidance.' },
    { id: '4', name: 'Dr. Rajesh Nair', specialty: 'Cardiology', exp: '20 years', rating: 4.9, slots: ['3:00 PM', '4:30 PM'], fee: 1000.00, bio: 'Interventional cardiologist specializing in lipid management, hypertension, and cardiovascular health.' },
    { id: '5', name: 'Dr. Tanya Sen', specialty: 'Psychiatry', exp: '10 years', rating: 4.7, slots: ['1:00 PM', '2:00 PM', '5:30 PM'], fee: 800.00, bio: 'Focus on stress management, cognitive behavioral therapy, and neurodevelopmental consults.' }
  ];

  const activeDoctors = doctorsList.length > 0 ? doctorsList : defaultDoctors;


  const filteredDoctors = activeDoctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const nextSevenDays = [
    { label: 'Today', date: 'Jul 09' },
    { label: 'Fri', date: 'Jul 10' },
    { label: 'Sat', date: 'Jul 11' },
    { label: 'Sun', date: 'Jul 12' },
    { label: 'Mon', date: 'Jul 13' },
    { label: 'Tue', date: 'Jul 14' }
  ];

  const handleConfirmBooking = () => {
    if (!selectedSlot) {
      alert("Please select a time slot first.");
      return;
    }

    const newApt = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      doctor: bookingDoctor.name,
      specialty: bookingDoctor.specialty,
      date: `${selectedDate === 'Today' ? 'Today' : selectedDate + ' (Jul 10)'}, ${selectedSlot}`,
      status: 'ready'
    };

    addAppointment(newApt);
    setIsSuccess(true);
  };

  const handleCloseBooking = () => {
    setBookingDoctor(null);
    setSelectedSlot(null);
    setIsSuccess(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Search Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <h2>Consult Digital Doctors</h2>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-full)',
          padding: '8px 16px',
          width: '300px',
          gap: '8px'
        }}>
          <Search size={16} style={{ color: 'var(--color-text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search doctor or specialty..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem' }}
          />
        </div>
      </div>

      {/* Specialization Chips */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
        {specialties.map((spec, idx) => (
          <button 
            key={idx}
            className="btn"
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              backgroundColor: selectedSpecialty === spec ? 'var(--color-primary)' : 'var(--color-surface)',
              color: selectedSpecialty === spec ? 'white' : 'var(--color-text-secondary)',
              border: selectedSpecialty === spec ? 'none' : '1px solid var(--color-border)'
            }}
            onClick={() => setSelectedSpecialty(spec)}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Doctor Grid */}
      <div className="grid-3">
        {filteredDoctors.map((doc) => (
          <div key={doc.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '280px' }}>
            <div>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-alt)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary)',
                  fontWeight: '700',
                  fontSize: '1.2rem',
                  border: '1px solid var(--color-border)'
                }}>
                  {doc.name.split(' ').slice(1).map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem' }}>{doc.name}</h3>
                  <span className="badge badge-rx" style={{ marginTop: '4px' }}>{doc.specialty}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', fontSize: '0.85rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-accent)', fontWeight: '600' }}>
                  <Star size={14} fill="currentColor" /> {doc.rating.toFixed(1)}
                </span>
                <span style={{ color: 'var(--color-text-secondary)' }}>Exp: {doc.exp}</span>
              </div>
              
              <p style={{ fontSize: '0.85rem', lineClamp: 2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', marginBottom: '16px' }}>
                {doc.bio}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
              <div>
                <span className="caption" style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '0.7rem' }}>Consultation Fee</span>
                <span className="mono-text" style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-primary)' }}>₹{doc.fee.toFixed(2)}</span>
              </div>
              <button className="btn btn-primary" onClick={() => setBookingDoctor(doc)}>
                Book Session
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Calendar Dialog Modal */}
      {bookingDoctor && (
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
          <div className="card" style={{
            width: '90%',
            maxWidth: '550px',
            padding: '32px',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {!isSuccess ? (
              <>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '4px' }}>Book Appointment</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '24px' }}>with {bookingDoctor.name} ({bookingDoctor.specialty})</p>

                {/* Calendar picker */}
                <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: '600', fontSize: '0.9rem', marginBottom: '12px' }}>1. Select Date</h4>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '24px' }}>
                  {nextSevenDays.map((d, idx) => (
                    <button
                      key={idx}
                      className="btn"
                      style={{
                        flexDirection: 'column',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: selectedDate === d.label ? 'var(--color-primary)' : 'var(--color-surface-alt)',
                        color: selectedDate === d.label ? 'white' : 'var(--color-text-primary)',
                        minWidth: '64px',
                        border: '1px solid var(--color-border)'
                      }}
                      onClick={() => setSelectedDate(d.label)}
                    >
                      <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>{d.label}</span>
                      <span className="mono-text" style={{ fontSize: '0.9rem', fontWeight: '700' }}>{d.date}</span>
                    </button>
                  ))}
                </div>

                {/* Time slot picker */}
                <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: '600', fontSize: '0.9rem', marginBottom: '12px' }}>2. Select Time</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
                  {bookingDoctor.slots.map((slot, idx) => (
                    <button
                      key={idx}
                      className="btn"
                      style={{
                        padding: '10px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: selectedSlot === slot ? 'var(--color-accent)' : 'var(--color-surface)',
                        color: selectedSlot === slot ? 'white' : 'var(--color-text-primary)',
                        border: '1px solid var(--color-border)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem'
                      }}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <Clock size={12} style={{ marginRight: '4px' }} />
                      {slot}
                    </button>
                  ))}
                </div>

                {/* Confirm booking button */}
                <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleCloseBooking}>Cancel</button>
                  <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleConfirmBooking}>Confirm Booking &bull; ₹{bookingDoctor.fee}</button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-info-banner-bg)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <Check size={32} strokeWidth={3} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '8px' }}>Booking Confirmed!</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '24px', color: 'var(--color-text-secondary)' }}>
                  Your digital consultation with {bookingDoctor.name} is successfully booked for {selectedDate === 'Today' ? 'Today' : selectedDate + ' (Jul 10)'} at {selectedSlot}.
                </p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px',
                  backgroundColor: 'var(--color-surface-alt)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '24px'
                }}>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Access Room Code</span>
                  <span className="mono-text" style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-primary)' }}>ROOM-EVE-RAO</span>
                </div>
                <button className="btn btn-primary" onClick={handleCloseBooking}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
