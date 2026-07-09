import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrescriptionBadge from '../components/PrescriptionBadge';
import LeftAccentCard from '../components/LeftAccentCard';
import InfoDisclaimer from '../components/InfoDisclaimer';
import { Search, ShoppingCart, UploadCloud, Check, FileText, ArrowRight, X, AlertTriangle, AlertCircle } from 'lucide-react';

export default function Pharmacy({ cart, addToCart, removeFromCart, updateCartQuantity, clearCart, checkoutOrders, medicinesList = [] }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState('catalog'); // 'catalog', 'cart', 'checkout', 'success'
  const [latestOrderId, setLatestOrderId] = useState('');

  const categories = ['All', 'Pain Relief', 'Antibiotics', 'Vitamins', 'Veg-Caps', 'Digestive Health'];

  const defaultMedicines = [
    { id: '1', name: 'Paracetamol 650mg', generic: 'Acetaminophen', category: 'Pain Relief', price: 40.00, requiresRx: false, inStock: true, details: 'Used to treat mild-to-moderate pain and reduce fever. Adults: 500mg-1000mg every 4-6 hours.', precautions: 'Avoid if you have history of liver disease.', sideEffects: 'Rare: skin rash, liver enzyme changes.' },
    { id: '2', name: 'Ibuprofen 400mg', generic: 'NSAID', category: 'Pain Relief', price: 60.00, requiresRx: false, inStock: true, details: 'Nonsteroidal anti-inflammatory drug (NSAID) used to reduce hormones that cause pain and inflammation.', precautions: 'Take with food to avoid gastric irritation.', sideEffects: 'Stomach upset, mild headache.' },
    { id: '3', name: 'Amoxicillin 500mg', generic: 'Penicillin Antibiotic', category: 'Antibiotics', price: 120.00, requiresRx: true, inStock: true, details: 'Used to treat infections caused by bacteria, such as tonsillitis, bronchitis, and pneumonia.', precautions: 'Do not use if allergic to penicillin.', sideEffects: 'Diarrhea, skin rash, nausea.' },
    { id: '4', name: 'Multivitamin Complex', generic: 'Essential Micronutrients', category: 'Vitamins', price: 250.00, requiresRx: false, inStock: true, details: 'Contains active forms of Vitamin B12, D3, Zinc, and Selenium for daily immune support.', precautions: 'Do not exceed daily recommended dosage.', sideEffects: 'Mild nausea if taken on empty stomach.' },
    { id: '5', name: 'HPMC Veggie Shells (Empty)', generic: 'Hypromellose Capsules', category: 'Veg-Caps', price: 180.00, requiresRx: false, inStock: true, details: 'Premium vegetable-based capsule shells. Ideal for custom compounding or sensitive patients.', precautions: 'Store in dry place, away from moisture.', sideEffects: 'None reported.' },
    { id: '6', name: 'Pantoprazole 40mg', generic: 'Proton Pump Inhibitor', category: 'Digestive Health', price: 95.00, requiresRx: true, inStock: false, details: 'Decreases the amount of acid produced in the stomach. Used for GERD and acid reflux.', precautions: 'Take 30 minutes before first meal of the day.', sideEffects: 'Headache, diarrhea, gas.', genericAlternative: { id: '7', name: 'Aciloc 150mg', price: 30.00, requiresRx: false, generic: 'Ranitidine (Generic Equivalent)' } }
  ];

  const activeMedicines = medicinesList.length > 0 ? medicinesList : defaultMedicines;

  const filteredMedicines = activeMedicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          med.generic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = cartSubtotal > 500 ? 0 : 50.00;
  const cartTotal = cartSubtotal + deliveryFee;
  const cartRequiresRx = cart.some(item => item.requiresRx);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPrescriptionFile(file);
    }
  };

  const handlePlaceOrder = () => {
    if (cartRequiresRx && !prescriptionFile) {
      alert("Please upload your digital prescription (Rx) to checkout prescription-required medicines.");
      return;
    }

    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      items: cart.map(item => `${item.name} x${item.quantity}`),
      statusIndex: cartRequiresRx ? 1 : 2, // 1 = Verification queue, 2 = Confirmed/Shipped
      date: new Date().toISOString().split('T')[0],
      total: cartTotal,
      hasRx: cartRequiresRx,
      prescriptionName: prescriptionFile ? prescriptionFile.name : 'uploaded_prescription.jpg'
    };

    checkoutOrders(newOrder);
    setLatestOrderId(newOrder.id);
    clearCart();
    setPrescriptionFile(null);
    setCheckoutStep('success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {checkoutStep === 'catalog' && (
        <>
          {/* Header Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2>Pharmacy Catalog</h2>
              <p style={{ fontSize: '0.85rem' }}>Browse medicines, compounding ingredients, and generics.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                  placeholder="Search brand or generic name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem' }}
                />
              </div>
              <button className="btn btn-primary" onClick={() => setCheckoutStep('cart')} style={{ position: 'relative' }}>
                <ShoppingCart size={16} />
                Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})
                {cart.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    backgroundColor: 'var(--color-accent)',
                    color: 'white',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700'
                  }}>{cart.length}</span>
                )}
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map((cat, idx) => (
              <button 
                key={idx}
                className="btn"
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  backgroundColor: selectedCategory === cat ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: selectedCategory === cat ? 'white' : 'var(--color-text-secondary)',
                  border: selectedCategory === cat ? 'none' : '1px solid var(--color-border)'
                }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Catalog Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {filteredMedicines.map((med) => (
              <div 
                key={med.id} 
                className="card"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between', 
                  minHeight: '320px',
                  border: med.inStock ? '1px solid var(--color-border)' : '1px dashed var(--color-error)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface-alt)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                      <FileText size={24} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {!med.inStock && <span className="badge badge-rx" style={{ backgroundColor: 'var(--color-error)', color: 'white', border: 'none' }}>Out of Stock</span>}
                      {med.requiresRx && <PrescriptionBadge />}
                    </div>
                  </div>
                  
                  <h3 
                    style={{ fontSize: '1.05rem', cursor: 'pointer' }}
                    onClick={() => setSelectedMedicine(med)}
                  >
                    {med.name}
                  </h3>
                  <span className="mono-text" style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block', margin: '4px 0 12px' }}>
                    {med.generic}
                  </span>
                  <p style={{ fontSize: '0.85rem', lineClamp: 2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {med.details}
                  </p>

                  {/* Out of Stock Generic recommendation inline snippet */}
                  {!med.inStock && med.genericAlternative && (
                    <div style={{
                      backgroundColor: 'var(--color-surface-alt)',
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)',
                      marginTop: '12px',
                      fontSize: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      borderLeft: '3px solid var(--color-success)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', fontWeight: '600' }}>
                        <Check size={12} /> Suggesting Generic Equivalent:
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{med.genericAlternative.name} &bull; ₹{med.genericAlternative.price.toFixed(2)}</span>
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '2px 6px', fontSize: '10px' }}
                          onClick={() => addToCart(med.genericAlternative)}
                        >
                          Substitute
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '20px', borderTop: '1px solid var(--color-border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="mono-text" style={{ fontSize: '1.15rem', fontWeight: '600' }}>₹{med.price.toFixed(2)}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }} onClick={() => setSelectedMedicine(med)}>
                      Details
                    </button>
                    {med.inStock ? (
                      <button className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '0.8rem' }} onClick={() => addToCart(med)}>
                        Add to Cart
                      </button>
                    ) : (
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '8px 12px', fontSize: '0.8rem', color: 'var(--color-success)', borderColor: 'var(--color-success)' }}
                        onClick={() => addToCart(med.genericAlternative)}
                      >
                        Add Generic
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Cart View */}
      {checkoutStep === 'cart' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={() => setCheckoutStep('catalog')} style={{ padding: '6px 12px' }}>
              &larr; Back to Catalog
            </button>
            <h2>Your Shopping Cart</h2>
          </div>

          {cart.length === 0 ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
              <ShoppingCart size={48} style={{ color: 'var(--color-border)', marginBottom: '16px' }} />
              <h3>Your cart is empty</h3>
              <p style={{ marginBottom: '20px' }}>Browse our medicines catalog to add pharmaceutical products.</p>
              <button className="btn btn-primary" onClick={() => setCheckoutStep('catalog')}>Go to Catalog</button>
            </div>
          ) : (
            <div className="grid-2-1">
              {/* Left Column: Items List & Upload Prescription */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {cart.map((item) => (
                    <div 
                      key={item.id} 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: '16px',
                        borderBottom: '1px solid var(--color-border)',
                        gap: '16px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: '600' }}>{item.name}</h4>
                          {item.requiresRx && <PrescriptionBadge />}
                        </div>
                        <span className="mono-text" style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{item.generic}</span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                          <button className="btn" style={{ padding: '4px 10px', fontSize: '1rem' }} onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>-</button>
                          <span style={{ padding: '0 12px', fontFamily: 'var(--font-mono)' }}>{item.quantity}</span>
                          <button className="btn" style={{ padding: '4px 10px', fontSize: '1rem' }} onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                        <span className="mono-text" style={{ fontWeight: '600', minWidth: '70px', textAlign: 'right' }}>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button className="btn btn-secondary" style={{ color: 'var(--color-error)', borderColor: 'transparent', padding: '6px' }} onClick={() => removeFromCart(item.id)}>
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Prescription Upload Area if Rx needed */}
                {cartRequiresRx && (
                  <LeftAccentCard accentColor="var(--color-accent)">
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '8px' }}>Prescription Upload Required</h3>
                    <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>
                      One or more items in your cart require a valid prescription. Please upload a clear image of your doctor's signed digital or print prescription.
                    </p>
                    
                    <div style={{
                      border: '2px dashed var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '24px',
                      backgroundColor: 'var(--color-bg)',
                      textAlign: 'center',
                      cursor: 'pointer',
                      position: 'relative'
                    }}>
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        onChange={handleFileUpload} 
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                      />
                      <UploadCloud size={32} style={{ color: 'var(--color-primary)', marginBottom: '8px' }} />
                      {prescriptionFile ? (
                        <div>
                          <p style={{ fontWeight: '600', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <Check size={16} /> Ready: {prescriptionFile.name}
                          </p>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Click or drag to change file</span>
                        </div>
                      ) : (
                        <div>
                          <p style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>Upload prescription here</p>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Supports JPG, PNG, PDF up to 5MB</span>
                        </div>
                      )}
                    </div>
                  </LeftAccentCard>
                )}
              </div>

              {/* Right Column: Checkout Summary */}
              <div className="card" style={{ height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                  Order Summary
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span>Items Subtotal</span>
                    <span className="mono-text">₹{cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span>Delivery Charges</span>
                    <span className="mono-text">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '700', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                    <span>Total Amount</span>
                    <span className="mono-text" style={{ color: 'var(--color-primary)' }}>₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '12px' }}
                  onClick={handlePlaceOrder}
                >
                  Confirm and Place Order
                </button>
                
                <p style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '8px' }}>
                  {cartRequiresRx 
                    ? 'Orders with prescriptions will be verified by our pharmacist before dispatch.' 
                    : 'Pharma Care certified products include 100% satisfaction guarantee.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Checkout Success Screen */}
      {checkoutStep === 'success' && (
        <div className="card" style={{ maxWidth: '600px', margin: '48px auto', textAlign: 'center', padding: '48px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-info-banner-bg)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <Check size={36} strokeWidth={3} />
          </div>
          <h2 style={{ marginBottom: '8px' }}>Order Successfully Placed!</h2>
          <p style={{ marginBottom: '16px' }}>Your order reference code is:</p>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1.25rem',
            fontWeight: '700',
            backgroundColor: 'var(--color-surface-alt)',
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            width: 'fit-content',
            margin: '0 auto 24px',
            letterSpacing: '1px'
          }}>
            {latestOrderId}
          </div>
          {cartRequiresRx ? (
            <p style={{ fontSize: '0.9rem', marginBottom: '24px' }}>
              Our clinical pharmacist is currently verifying your uploaded prescription. You can track this step live on the tracking dashboard.
            </p>
          ) : (
            <p style={{ fontSize: '0.9rem', marginBottom: '24px' }}>
              Your order is verified and is being packed. Delivery is expected within 24-48 hours.
            </p>
          )}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => setCheckoutStep('catalog')}>
              Back to Catalog
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/deliveries')}>
              Track Delivery &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedMedicine && (
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
            maxWidth: '700px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            padding: '32px'
          }}>
            <button 
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
              onClick={() => setSelectedMedicine(null)}
            >
              <X size={24} />
            </button>

            <div className="grid-1-2" style={{ gap: '32px' }}>
              {/* Product illustration */}
              <div style={{
                backgroundColor: 'var(--color-surface-alt)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '180px'
              }}>
                <FileText size={48} style={{ color: 'var(--color-primary)' }} />
              </div>

              {/* Product details */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {!selectedMedicine.inStock && <span className="badge badge-rx" style={{ backgroundColor: 'var(--color-error)', color: 'white', border: 'none' }}>Out of Stock</span>}
                    {selectedMedicine.requiresRx && <PrescriptionBadge />}
                  </div>
                  <span className="caption" style={{ color: 'var(--color-text-secondary)' }}>{selectedMedicine.category}</span>
                </div>
                
                <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>{selectedMedicine.name}</h2>
                <span className="mono-text" style={{ color: 'var(--color-text-secondary)', display: 'block', marginBottom: '16px' }}>
                  {selectedMedicine.generic}
                </span>
                
                <span className="mono-text" style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block', marginBottom: '20px' }}>
                  ₹{selectedMedicine.price.toFixed(2)}
                </span>

                {selectedMedicine.inStock ? (
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginBottom: '24px' }}
                    onClick={() => {
                      addToCart(selectedMedicine);
                      setSelectedMedicine(null);
                    }}
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div>
                    <div style={{
                      backgroundColor: 'var(--color-surface-alt)',
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '16px',
                      fontSize: '0.85rem'
                    }}>
                      <div style={{ color: 'var(--color-accent)', fontWeight: '600', marginBottom: '4px' }}>
                        Suggesting In-Stock Generic Substitute:
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{selectedMedicine.genericAlternative.name} (₹{selectedMedicine.genericAlternative.price.toFixed(2)})</span>
                        <button 
                          className="btn btn-primary"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          onClick={() => {
                            addToCart(selectedMedicine.genericAlternative);
                            setSelectedMedicine(null);
                          }}
                        >
                          Add Generic
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Extra details panels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
              <LeftAccentCard accentColor="var(--color-primary)">
                <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: '600', marginBottom: '6px' }}>Usage &amp; Dosage</h4>
                <p style={{ fontSize: '0.85rem' }}>{selectedMedicine.details}</p>
              </LeftAccentCard>
              
              <LeftAccentCard accentColor="var(--color-warning)">
                <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: '600', marginBottom: '6px' }}>Precautions</h4>
                <p style={{ fontSize: '0.85rem' }}>{selectedMedicine.precautions}</p>
              </LeftAccentCard>
              
              <LeftAccentCard accentColor="var(--color-text-secondary)">
                <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: '600', marginBottom: '6px' }}>Side Effects</h4>
                <p style={{ fontSize: '0.85rem' }}>{selectedMedicine.sideEffects}</p>
              </LeftAccentCard>

              <InfoDisclaimer text="Always confirm active dosages with your primary care provider or certified Pharma Care pharmacist." />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
