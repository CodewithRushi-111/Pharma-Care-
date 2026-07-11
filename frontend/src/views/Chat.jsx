import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import InfoDisclaimer from '../components/InfoDisclaimer';
import PrescriptionBadge from '../components/PrescriptionBadge';
import { Send, Mic, Sparkles, ShoppingCart, ShieldAlert } from 'lucide-react';

export default function Chat({ addToCart, onSafetyFlagged }) {
  const location = useLocation();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your Pharma Care AI health assistant. I can answer questions about medicines, check common dosage structures, or help you find specialized doctors. What can I help you with today?",
      timestamp: '11:15 AM'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Check if initial query passed from dashboard
  useEffect(() => {
    if (location.state && location.state.initialQuery) {
      handleSend(location.state.initialQuery);
      // Clear state so it doesn't trigger again on refresh
      location.state.initialQuery = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim()) return;

    // Add user message
    const userMsg = {
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Pre-filter for crisis/safety flags (FR-1.7 & Non-Functional Safety constraints)
    const lowerText = queryText.toLowerCase();
    const crisisKeywords = ['suicide', 'kill myself', 'overdose', 'poisoning', 'heart attack', 'stroke', 'bleeding out', 'self-harm'];
    const matchesCrisis = crisisKeywords.some(kw => lowerText.includes(kw));

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      if (matchesCrisis) {
        // Log safety audit flag
        if (onSafetyFlagged) {
          onSafetyFlagged({
            query: queryText,
            timestamp: new Date().toLocaleString(),
            user: 'Rishi Kumar',
            category: 'Critical Safety Intervention'
          });
        }

        setMessages(prev => [...prev, {
          sender: 'ai',
          isEmergency: true,
          text: "EMERGENCY SAFEGUARD INTERCEPT: Your query indicates a potential medical emergency or crisis. Pharma Care AI cannot provide advice for life-threatening situations.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        return;
      }

      let aiText = "I understand your query. For detailed clinical queries, I recommend scheduling a quick consult with our digital doctors.";
      let suggestions = [];
      let disclaimer = "This is general information, not medical advice. Please consult a doctor or pharmacist for guidance specific to you.";

      if (lowerText.includes('paracetamol') || lowerText.includes('crocin') || lowerText.includes('pain')) {
        aiText = "Paracetamol (Acetaminophen) is a common analgesic and antipyretic medication used to treat mild-to-moderate pain and reduce fever. The standard adult dose is 500mg to 1000mg every 4 to 6 hours as needed, not exceeding 4000mg in 24 hours. Severe liver damage can occur if you exceed the limit.";
        suggestions = [
          { id: '1', name: 'Paracetamol 650mg', price: '₹40.00', requiresRx: false, generic: 'Analgesic & Antipyretic' }
        ];
      } else if (lowerText.includes('amoxicillin') || lowerText.includes('antibiotic') || lowerText.includes('infection')) {
        aiText = "Amoxicillin is a moderate-spectrum, bactericidal, beta-lactam antibiotic used to treat bacterial infections. It is a prescription-only medication (Rx). Common side-effects include nausea, rash, or antibiotic-associated colitis. Full course must be completed even if symptoms resolve.";
        suggestions = [
          { id: '3', name: 'Amoxicillin 500mg', price: '₹120.00', requiresRx: true, generic: 'Penicillin Antibiotic' }
        ];
      } else if (lowerText.includes('pantoprazole') || lowerText.includes('acidity') || lowerText.includes('reflux')) {
        // FR-2.7 out of stock and generic substitution
        aiText = "Pantoprazole 40mg is currently OUT OF STOCK. However, our database suggests Aciloc 150mg (Ranitidine 150mg) as a generic equivalent in-stock option to reduce gastric acid production.";
        suggestions = [
          { id: '7', name: 'Aciloc 150mg', price: '₹30.00', requiresRx: false, generic: 'Ranitidine (Generic Equivalent)', isAlternative: true }
        ];
      } else if (lowerText.includes('capsule') || lowerText.includes('shell')) {
        aiText = "Most capsules on Pharma Care are standard pharmaceutical-grade gelatin shells. For vegetarian patients, we offer certified Hypromellose (HPMC) plant-based veggie capsule shells. You can filter for 'Veg-Caps' in our catalog.";
      }

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: aiText,
        suggestions,
        disclaimer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--header-height) - 64px)' }}>
      {/* Chat header info */}
      <div style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopLeftRadius: 'var(--radius-md)',
        borderTopRightRadius: 'var(--radius-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>Pharma Care AI Health Companion</h3>
            <p style={{ fontSize: '0.8rem' }}>Verified clinical information &bull; Active 24/7</p>
          </div>
        </div>
        <div className="badge badge-success" style={{ gap: '6px' }}>
          Safety Filters Active
        </div>
      </div>

      {/* Messages area */}
      <div style={{
        flex: 1,
        padding: '24px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        backgroundColor: 'var(--color-bg)'
      }}>
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            {msg.sender === 'user' ? (
              // User message bubble
              <div style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                padding: '12px 18px',
                borderRadius: 'var(--radius-md)',
                borderBottomRightRadius: '2px',
                fontSize: '0.95rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {msg.text}
              </div>
            ) : msg.isEmergency ? (
              // Emergency Intercept Card
              <div 
                className="left-accent-card"
                style={{
                  '--accent-color': 'var(--color-error)',
                  backgroundColor: '#FFF2F2',
                  border: '1px solid #FFC1C1',
                  width: '100%'
                }}
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <ShieldAlert size={24} style={{ color: 'var(--color-error)', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ color: 'var(--color-error)', fontWeight: '700', marginBottom: '8px', fontSize: '1.05rem' }}>
                      Immediate Medical Help Required
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: '#6A2A2A', marginBottom: '16px', lineHeight: '1.4' }}>
                      {msg.text} Please contact emergency rescue immediately or visit the nearest emergency room.
                    </p>
                    
                    <div style={{
                      backgroundColor: 'white',
                      padding: '16px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #FFD3D3',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>Emergency Services</span>
                        <a href="tel:112" style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--color-error)', textDecoration: 'none', backgroundColor: '#FFEBEB', padding: '4px 10px', borderRadius: '4px' }}>Call 112</a>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #FFE3E3', paddingTop: '8px' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>National Ambulance</span>
                        <a href="tel:102" style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--color-error)', textDecoration: 'none', backgroundColor: '#FFEBEB', padding: '4px 10px', borderRadius: '4px' }}>Call 102</a>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #FFE3E3', paddingTop: '8px' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>Kiran Mental Health Line</span>
                        <a href="tel:18005990019" style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--color-error)', textDecoration: 'none', backgroundColor: '#FFEBEB', padding: '4px 10px', borderRadius: '4px' }}>1800-599-0019</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // AI message bubble / left accent card
              <div 
                className="left-accent-card"
                style={{
                  '--accent-color': 'var(--color-primary)',
                  backgroundColor: 'var(--color-surface)',
                  width: '100%'
                }}
              >
                <div style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)', lineHeight: '1.5' }}>
                  {msg.text}
                </div>
                
                {/* Embedded Disclaimer */}
                {msg.disclaimer && (
                  <InfoDisclaimer text={msg.disclaimer} className="info-disclaimer-small" style={{ marginTop: '12px' }} />
                )}

                {/* Inline drug suggestions */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '14px' }}>
                    <span className="caption" style={{ color: 'var(--color-primary)', fontSize: '0.75rem' }}>
                      {msg.suggestions[0].isAlternative ? "Generic Substitution Alternative:" : "Related Catalog Products:"}
                    </span>
                    {msg.suggestions.map((prod) => (
                      <div 
                        key={prod.id} 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: 'var(--color-bg)',
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-border)'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{prod.name}</span>
                            {prod.requiresRx && <PrescriptionBadge />}
                            {prod.isAlternative && <span className="badge badge-success" style={{ fontSize: '10px', padding: '2px 6px' }}>Alternative In-Stock</span>}
                          </div>
                          <span className="mono-text" style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{prod.generic}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span className="mono-text" style={{ fontWeight: '600' }}>{prod.price}</span>
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            onClick={() => addToCart({
                              id: prod.id,
                              name: prod.name,
                              price: parseFloat(prod.price.replace('₹', '')),
                              requiresRx: prod.requiresRx || false,
                              generic: prod.generic
                            })}
                          >
                            <ShoppingCart size={12} />
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-secondary)',
              marginTop: '4px',
              fontFamily: 'var(--font-mono)'
            }}>
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start', padding: '12px 16px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ animation: 'pulse 1s infinite', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input zone */}
      <div style={{
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        padding: '16px 24px',
        borderBottomLeftRadius: 'var(--radius-md)',
        borderBottomRightRadius: 'var(--radius-md)'
      }}>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
        >
          <button 
            type="button" 
            className="btn btn-secondary" 
            style={{ borderRadius: '50%', width: '42px', height: '42px', padding: 0 }}
            title="Voice input"
          >
            <Mic size={18} />
          </button>
          
          <input 
            type="text" 
            placeholder="Ask about symptoms, drug compositions, dosages, or side-effects..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 20px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg)',
              outline: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem'
            }}
          />
          
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ borderRadius: '50%', width: '42px', height: '42px', padding: 0 }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
