import React, { useState } from 'react';
import { Check, X, FileText, AlertTriangle, Plus, ShieldAlert, ShoppingBag } from 'lucide-react';

export default function Admin({ 
  adminOrders = [], 
  updateOrderStatus, 
  userRole = 'Pharmacy Admin',
  safetyLogs = [],
  doctorsList = [],
  onRegisterDoctor,
  onAddMedicine
}) {
  const [activeTab, setActiveTab] = useState('triage'); // 'triage', 'consultancy', 'safety', 'doctors', 'inventory'
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);

  // Consultancy Maintenance State
  const [consultancyList, setConsultancyList] = useState([
    { id: 'APT-4421', doctor: 'Dr. Evelyn Rao', specialty: 'General Medicine', date: 'Today, 4:30 PM', fee: '₹500', status: 'Ready to Join', patient: 'Rishi Kumar', notes: 'Routine checkup & Amoxicillin verification' },
    { id: 'APT-8912', doctor: 'Dr. Rajesh Nair', specialty: 'Cardiology', date: 'Tomorrow, 11:00 AM', fee: '₹800', status: 'Scheduled', patient: 'Sunita Sharma', notes: 'Post-discharge ECG and vitals review' },
    { id: 'APT-3301', doctor: 'Dr. Priya Desai', specialty: 'Pediatrics', date: 'Jul 14, 2:00 PM', fee: '₹600', status: 'Confirmed', patient: 'Aarav Patel', notes: 'Child vaccination schedule review' }
  ]);
  const [newConsultDoc, setNewConsultDoc] = useState('Dr. Evelyn Rao');
  const [newConsultPatient, setNewConsultPatient] = useState('');
  const [newConsultDate, setNewConsultDate] = useState('Tomorrow, 4:00 PM');
  const [newConsultFee, setNewConsultFee] = useState('₹500');

  // Doctor onboarding form state
  const [docName, setDocName] = useState('');
  const [docSpec, setDocSpec] = useState('General Medicine');
  const [docExp, setDocExp] = useState('');
  const [docFee, setDocFee] = useState('');
  const [docBio, setDocBio] = useState('');

  // Inventory addition form state
  const [medName, setMedName] = useState('');
  const [medGeneric, setMedGeneric] = useState('');
  const [medCategory, setMedCategory] = useState('Pain Relief');
  const [medPrice, setMedPrice] = useState('');
  const [medDetails, setMedDetails] = useState('');
  const [medRx, setMedRx] = useState(false);

  const defaultAdminOrders = [
    {
      id: 'ORD-98210',
      patient: 'Rishi Kumar',
      date: 'Jul 09, 11:15 AM',
      items: ['Amoxicillin 500mg x1', 'Paracetamol 650mg x2'],
      status: 'pending_verification',
      statusIndex: 1,
      total: '₹200.00',
      age: 24,
      prescriptionName: 'rishi_kumar_prescription.jpg',
      waitingTime: '45 mins ago',
      urgencyColor: 'var(--color-success)', // green (under 1hr)
      rxDoctor: 'Dr. Evelyn Rao'
    },
    {
      id: 'ORD-77512',
      patient: 'Sunita Sharma',
      date: 'Jul 09, 08:30 AM',
      items: ['Pantoprazole 40mg x2'],
      status: 'pending_verification',
      statusIndex: 1,
      total: '₹190.00',
      age: 48,
      prescriptionName: 'sunita_sharma_rx.pdf',
      waitingTime: '3 hrs ago',
      urgencyColor: 'var(--color-warning)', // amber (1-4hrs)
      rxDoctor: 'Dr. Kabir Mehta'
    }
  ];

  const queue = adminOrders.length > 0 ? adminOrders : defaultAdminOrders;
  const currentOrder = queue[selectedOrderIndex] || queue[0];

  const handleApprove = (orderId) => {
    updateOrderStatus(orderId, 2); // 2 = Confirmed
    alert(`Order ${orderId} has been verified and approved for fulfillment.`);
  };

  const handleReject = (orderId) => {
    updateOrderStatus(orderId, 0); // Reject/Cancel
    alert(`Order ${orderId} has been rejected.`);
  };

  const handleDocSubmit = (e) => {
    e.preventDefault();
    if (!docName || !docExp || !docFee) {
      alert("Please fill all doctor fields.");
      return;
    }
    const newDoc = {
      id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
      name: `Dr. ${docName}`,
      specialty: docSpec,
      exp: `${docExp} years`,
      rating: 5.0,
      fee: parseFloat(docFee),
      bio: docBio || 'Verified digital consultation practitioner.',
      slots: ['10:00 AM', '2:00 PM', '4:30 PM']
    };
    if (onRegisterDoctor) {
      onRegisterDoctor(newDoc);
    }
    alert(`Doctor Dr. ${docName} successfully onboarded.`);
    setDocName('');
    setDocExp('');
    setDocFee('');
    setDocBio('');
  };

  const handleMedSubmit = (e) => {
    e.preventDefault();
    if (!medName || !medGeneric || !medPrice) {
      alert("Please fill all medicine fields.");
      return;
    }
    const newMed = {
      id: `MED-${Math.floor(100 + Math.random() * 900)}`,
      name: medName,
      generic: medGeneric,
      category: medCategory,
      price: parseFloat(medPrice),
      requiresRx: medRx,
      inStock: true,
      details: medDetails || 'Pharma Care certified medicinal item.',
      precautions: 'Consult pharmacist before dosage.',
      sideEffects: 'Mild digestive discomfort in rare cases.'
    };
    if (onAddMedicine) {
      onAddMedicine(newMed);
    }
    alert(`Medicine ${medName} added to active catalog.`);
    setMedName('');
    setMedGeneric('');
    setMedPrice('');
    setMedDetails('');
    setMedRx(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header with Switcher Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Pharma Care Management Workspace</h2>
          <p style={{ fontSize: '0.85rem' }}>Active Role: <strong style={{ color: 'var(--color-primary)' }}>{userRole}</strong></p>
        </div>

        {/* Tab selector (All tabs accessible for comprehensive consultancy & triage maintenance) */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            className="btn" 
            onClick={() => setActiveTab('triage')}
            style={{
              fontSize: '0.8rem',
              backgroundColor: activeTab === 'triage' ? 'var(--color-primary)' : 'var(--color-surface)',
              color: activeTab === 'triage' ? 'white' : 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)'
            }}
          >
            📋 Prescription Triage ({adminOrders.length || 2})
          </button>

          <button 
            className="btn" 
            onClick={() => setActiveTab('consultancy')}
            style={{
              fontSize: '0.8rem',
              backgroundColor: activeTab === 'consultancy' ? 'var(--color-primary)' : 'var(--color-surface)',
              color: activeTab === 'consultancy' ? 'white' : 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)'
            }}
          >
            📅 Consultancy Maintenance ({consultancyList.length})
          </button>

          <button 
            className="btn" 
            onClick={() => setActiveTab('doctors')}
            style={{
              fontSize: '0.8rem',
              backgroundColor: activeTab === 'doctors' ? 'var(--color-primary)' : 'var(--color-surface)',
              color: activeTab === 'doctors' ? 'white' : 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)'
            }}
          >
            👨‍⚕️ Onboard Doctors ({doctorsList.length || 3})
          </button>

          <button 
            className="btn" 
            onClick={() => setActiveTab('inventory')}
            style={{
              fontSize: '0.8rem',
              backgroundColor: activeTab === 'inventory' ? 'var(--color-primary)' : 'var(--color-surface)',
              color: activeTab === 'inventory' ? 'white' : 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)'
            }}
          >
            📦 Inventory Manager
          </button>

          <button 
            className="btn" 
            onClick={() => setActiveTab('safety')}
            style={{
              fontSize: '0.8rem',
              backgroundColor: activeTab === 'safety' ? 'var(--color-primary)' : 'var(--color-surface)',
              color: activeTab === 'safety' ? 'white' : 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)'
            }}
          >
            🛡️ AI Safety Audits ({safetyLogs.length || 1})
          </button>
        </div>
      </div>

      {/* 1. Triage Tab */}
      {activeTab === 'triage' && (
        <>
          {queue.length === 0 ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
              <Check size={48} style={{ color: 'var(--color-success)', marginBottom: '16px' }} />
              <h3>All prescriptions verified!</h3>
              <p>No orders are currently waiting in the verification queue.</p>
            </div>
          ) : (
            <div className="grid-1-2">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '8px' }}>Triage Queue</h3>
                {queue.map((ord, idx) => (
                  <div 
                    key={ord.id}
                    className="left-accent-card"
                    style={{
                      '--accent-color': ord.urgencyColor || 'var(--color-success)',
                      borderLeftWidth: '5px',
                      cursor: 'pointer',
                      opacity: selectedOrderIndex === idx ? 1 : 0.8,
                      backgroundColor: selectedOrderIndex === idx ? 'var(--color-surface-alt)' : 'var(--color-surface)',
                      borderWidth: selectedOrderIndex === idx ? '1px 1px 1px 5px' : '1px'
                    }}
                    onClick={() => setSelectedOrderIndex(idx)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className="mono-text" style={{ fontWeight: '600' }}>{ord.id}</span>
                      <span className="mono-text" style={{ fontSize: '0.75rem', color: ord.urgencyColor, fontWeight: '700' }}>
                        {ord.waitingTime || 'New'}
                      </span>
                    </div>
                    <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: '600' }}>{ord.patient}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {ord.items.join(', ')}
                    </p>
                  </div>
                ))}
              </div>

              {currentOrder && (
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
                    <div>
                      <span className="caption" style={{ color: 'var(--color-text-secondary)' }}>Fulfillment Check</span>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginTop: '4px' }}>Compare Screen: {currentOrder.id}</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-secondary" style={{ color: 'var(--color-warning)', borderColor: 'var(--color-warning)', padding: '8px 12px', fontSize: '0.8rem' }}>
                        Request Re-upload
                      </button>
                      <button className="btn btn-secondary" style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)', padding: '8px 12px', fontSize: '0.8rem' }} onClick={() => handleReject(currentOrder.id)}>
                        <X size={14} /> Reject
                      </button>
                      <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={() => handleApprove(currentOrder.id)}>
                        <Check size={14} /> Approve Order
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', backgroundColor: 'var(--color-surface-alt)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>PATIENT</span>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{currentOrder.patient}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>ISSUING DOCTOR</span>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{currentOrder.rxDoctor || 'Verified Practitioner'}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>ORDER TOTAL</span>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--color-primary)' }}>{currentOrder.total}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span className="caption" style={{ color: 'var(--color-text-secondary)' }}>Uploaded Prescription Script</span>
                      <div style={{
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-bg)',
                        padding: '24px',
                        height: '240px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center'
                      }}>
                        <FileText size={48} style={{ color: 'var(--color-accent)', marginBottom: '12px' }} />
                        <span className="mono-text" style={{ fontSize: '0.85rem', fontWeight: '600' }}>{currentOrder.prescriptionName}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Signed &bull; Clinical Letterhead Present</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span className="caption" style={{ color: 'var(--color-text-secondary)' }}>Items to Dispense</span>
                      <div style={{
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-surface)',
                        padding: '20px',
                        height: '240px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}>
                        {currentOrder.items.map((item, idx) => (
                          <label 
                            key={idx} 
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '10px 14px',
                              backgroundColor: 'var(--color-bg)',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--color-border)'
                            }}
                          >
                            <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }} />
                            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* 2. Safety Logs Tab */}
      {activeTab === 'safety' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>AI Conversation Crisis Logs</h3>
            <p style={{ fontSize: '0.85rem' }}>Review interactions flagged for self-harm, overdose, or emergency medical symptoms.</p>
          </div>

          {safetyLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <Check size={48} style={{ color: 'var(--color-success)', marginBottom: '12px', margin: '0 auto' }} />
              <h4>No conversation safety violations flagged.</h4>
              <p style={{ fontSize: '0.85rem' }}>AI pre-filters are actively monitoring conversations for health risks.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {safetyLogs.map((log, idx) => (
                <div 
                  key={idx} 
                  className="left-accent-card"
                  style={{
                    '--accent-color': 'var(--color-error)',
                    backgroundColor: '#FFF8F8',
                    border: '1px solid #FFDCDC'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldAlert size={16} style={{ color: 'var(--color-error)' }} />
                      <strong style={{ fontSize: '0.9rem', color: 'var(--color-error)' }}>{log.category}</strong>
                    </div>
                    <span className="mono-text" style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{log.timestamp}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', fontStyle: 'italic', backgroundColor: 'white', padding: '10px 14px', borderRadius: '4px', border: '1px solid #FFE0E0' }}>
                    "{log.query}"
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    <span>Patient User: <strong>{log.user}</strong></span>
                    <span>Action Taken: <strong>Emergency Intercept Card Triggered</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Onboard Doctors Tab */}
      {activeTab === 'doctors' && (
        <div className="grid-1-2">
          {/* Form */}
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '16px' }}>Register Doctor</h3>
            <form onSubmit={handleDocSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Doctor Name</label>
                <input 
                  type="text" 
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Kabir Mehta (don't type Dr.)"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Specialty</label>
                <select 
                  value={docSpec}
                  onChange={(e) => setDocSpec(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none' }}
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Psychiatry">Psychiatry</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Experience (Years)</label>
                <input 
                  type="number" 
                  value={docExp}
                  onChange={(e) => setDocExp(e.target.value)}
                  placeholder="e.g. 10"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Consultation Fee (₹)</label>
                <input 
                  type="number" 
                  value={docFee}
                  onChange={(e) => setDocFee(e.target.value)}
                  placeholder="e.g. 500"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Bio / Summary</label>
                <textarea 
                  value={docBio}
                  onChange={(e) => setDocBio(e.target.value)}
                  placeholder="Doctor's credentials and clinical fields..."
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', minHeight: '80px', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                <Plus size={16} /> Register Practitioner
              </button>
            </form>
          </div>

          {/* Directory Preview */}
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '16px' }}>Current Directory</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
              {doctorsList.map((doc) => (
                <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>{doc.name}</h4>
                    <span className="mono-text" style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{doc.specialty} &bull; {doc.exp} Exp</span>
                  </div>
                  <span className="badge badge-success">₹{doc.fee}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="grid-1-2">
          {/* Add Item Form */}
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '16px' }}>Add Catalog Item</h3>
            <form onSubmit={handleMedSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Medicine Name</label>
                <input 
                  type="text" 
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  placeholder="e.g. Vitamin D3 Capsules"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Generic Formula</label>
                <input 
                  type="text" 
                  value={medGeneric}
                  onChange={(e) => setMedGeneric(e.target.value)}
                  placeholder="e.g. Cholecalciferol"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Category</label>
                <select 
                  value={medCategory}
                  onChange={(e) => setMedCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none' }}
                >
                  <option value="Pain Relief">Pain Relief</option>
                  <option value="Antibiotics">Antibiotics</option>
                  <option value="Vitamins">Vitamins</option>
                  <option value="Veg-Caps">Veg-Caps</option>
                  <option value="Digestive Health">Digestive Health</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Price (₹)</label>
                <input 
                  type="number" 
                  value={medPrice}
                  onChange={(e) => setMedPrice(e.target.value)}
                  placeholder="e.g. 150"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Precautions / Details</label>
                <textarea 
                  value={medDetails}
                  onChange={(e) => setMedDetails(e.target.value)}
                  placeholder="Precautions and side effects details..."
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', minHeight: '80px', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={medRx} 
                  onChange={(e) => setMedRx(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Requires Digital Prescription (Rx)</span>
              </label>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                <Plus size={16} /> Add to Stock Catalog
              </button>
            </form>
          </div>

          {/* Catalog Stock Preview */}
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '16px' }}>Pharmacy Stock Banners</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div 
                className="left-accent-card"
                style={{
                  '--accent-color': 'var(--color-warning)',
                  backgroundColor: 'var(--color-surface-alt)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <AlertTriangle size={18} style={{ color: 'var(--color-warning)' }} />
                  <strong style={{ fontSize: '0.9rem' }}>Low Stock Alert: Pantoprazole 40mg (0 units)</strong>
                </div>
                <p style={{ fontSize: '0.8rem', marginTop: '6px' }}>Generic recommendation active: Aciloc 150mg suggestion is serving on frontend.</p>
              </div>

              <div 
                className="left-accent-card"
                style={{
                  '--accent-color': 'var(--color-success)',
                  backgroundColor: 'var(--color-surface-alt)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <ShoppingBag size={18} style={{ color: 'var(--color-success)' }} />
                  <strong style={{ fontSize: '0.9rem' }}>Adequate Stock: Paracetamol 650mg</strong>
                </div>
                <p style={{ fontSize: '0.8rem', marginTop: '6px' }}>120 boxes verified in storage zone B.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Consultancy & Telemedicine Maintenance Suite */}
      {activeTab === 'consultancy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s ease both' }}>
          <div style={{ backgroundColor: 'var(--color-surface)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <span className="badge badge-success" style={{ marginBottom: '6px', display: 'inline-block' }}>Telemedicine Administration</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>Live Consultancy Maintenance & Schedule Control</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>Monitor doctor schedules, verify WebRTC rooms, adjust consultation fees, and maintain patient sessions.</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {consultancyList.map(apt => (
                <div key={apt.id} style={{ padding: '18px', backgroundColor: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ flex: '1 1 300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span className="mono-text" style={{ fontWeight: '700', color: 'var(--color-primary)', background: 'var(--color-primary-dim)', padding: '2px 8px', borderRadius: '4px' }}>{apt.id}</span>
                      <span className={`badge ${apt.status.includes('Ready') || apt.status.includes('Confirmed') ? 'badge-success' : 'badge-warning'}`}>{apt.status}</span>
                    </div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '4px', color: 'var(--color-text-primary)' }}>{apt.doctor} <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>({apt.specialty})</span></h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>Patient: <strong>{apt.patient}</strong> &bull; Slot: <strong>{apt.date}</strong> &bull; Fee: <strong>{apt.fee}</strong></p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Notes: {apt.notes}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => {
                        setConsultancyList(prev => prev.map(a => a.id === apt.id ? { ...a, status: 'Ready to Join (WebRTC Active)' } : a));
                        alert(`Session ${apt.id} WebRTC Room verified & opened for consultation.`);
                      }}
                      style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                    >
                      🎥 Verify WebRTC
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => {
                        setConsultancyList(prev => prev.map(a => a.id === apt.id ? { ...a, status: 'Rescheduled / Maintained' } : a));
                        alert(`Session ${apt.id} schedule maintained & patient notified.`);
                      }}
                      style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                    >
                      🔄 Reschedule / Maintain
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => {
                        setConsultancyList(prev => prev.filter(a => a.id !== apt.id));
                        alert(`Session ${apt.id} marked as completed & archived.`);
                      }}
                      style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                    >
                      ✓ Complete Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule New Consultation Form */}
          <div style={{ backgroundColor: 'var(--color-surface)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '16px' }}>Schedule & Assign New Consultancy Session</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newConsultPatient) { alert("Please enter patient name."); return; }
              const newApt = {
                id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
                doctor: newConsultDoc,
                specialty: newConsultDoc.includes('Evelyn') ? 'General Medicine' : newConsultDoc.includes('Rajesh') ? 'Cardiology' : 'Pediatrics',
                date: newConsultDate,
                fee: newConsultFee,
                status: 'Confirmed (Admin Assigned)',
                patient: newConsultPatient,
                notes: 'Administrative consultation booking via Telemedicine Suite.'
              };
              setConsultancyList(prev => [newApt, ...prev]);
              setNewConsultPatient('');
              alert(`Consultancy session ${newApt.id} scheduled successfully for ${newConsultPatient}.`);
            }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Doctor Assignment</label>
                <select value={newConsultDoc} onChange={(e) => setNewConsultDoc(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none' }}>
                  <option value="Dr. Evelyn Rao">Dr. Evelyn Rao (General Medicine)</option>
                  <option value="Dr. Rajesh Nair">Dr. Rajesh Nair (Cardiology)</option>
                  <option value="Dr. Priya Desai">Dr. Priya Desai (Pediatrics)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Patient Full Name</label>
                <input type="text" value={newConsultPatient} onChange={(e) => setNewConsultPatient(e.target.value)} placeholder="e.g. Amit Verma" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none' }} required />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Schedule Slot Date & Time</label>
                <input type="text" value={newConsultDate} onChange={(e) => setNewConsultDate(e.target.value)} placeholder="e.g. Tomorrow, 4:00 PM" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none' }} required />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Consultation Fee</label>
                <input type="text" value={newConsultFee} onChange={(e) => setNewConsultFee(e.target.value)} placeholder="₹500" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none' }} required />
              </div>
              <div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '11px 16px' }}>+ Assign Consultancy</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
