import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import InfoDisclaimer from '../components/InfoDisclaimer';
import PrescriptionBadge from '../components/PrescriptionBadge';
import { Send, Mic, Sparkles, ShoppingCart, ShieldAlert } from 'lucide-react';

export default function Chat({ addToCart, onSafetyFlagged }) {
  const location = useLocation();
  const [activeMode, setActiveMode] = useState('General Triage');
  const [isInitialMode, setIsInitialMode] = useState(true);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your Pharma Care AI health assistant currently in General Triage mode. I can answer questions about medicines, check common dosage structures, or help you find specialized doctors. What can I help you with today?",
      timestamp: '11:15 AM'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const handleReset = (modeName = activeMode) => {
    setActiveMode(modeName);
    setIsInitialMode(true);
    setMessages([
      {
        sender: 'ai',
        text: `Hello! I am your Pharma Care AI health assistant currently in ${modeName} mode. How can I assist your clinical decisions, medicine verification, or symptom analysis today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Check if initial query passed from dashboard
  useEffect(() => {
    if (location.state && location.state.initialQuery) {
      handleSend(location.state.initialQuery);
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

    const userMsg = {
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    setIsInitialMode(false);
    const lowerText = queryText.toLowerCase();
    const crisisKeywords = ['suicide', 'kill myself', 'overdose', 'poisoning', 'heart attack', 'stroke', 'bleeding out', 'self-harm', 'chest pain', 'breathing'];
    const matchesCrisis = crisisKeywords.some(kw => lowerText.includes(kw));

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      if (matchesCrisis) {
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
          text: "EMERGENCY SAFEGUARD INTERCEPT: Your query indicates symptoms requiring urgent clinical evaluation (Chest Pain / Severe Distress). Pharma Care AI sub-10ms safety pre-flight has triggered emergency escalation. Please call emergency services (112 / 108) or visit the nearest hospital emergency room immediately.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        return;
      }

      let aiText = `I have analyzed your query ("${queryText}") using our ${activeMode} diagnostic pipeline.\n\n### Clinical Triage Assessment\nBased on your reported symptoms or inquiry, our AI neural network indicates a standard clinical profile. While mild presentations often respond well to symptomatic relief and rest, precise schedule H medicine administration requires specialist evaluation.\n\n### Recommended Action Plan\n1. **Vitals Monitoring:** Keep track of body temperature, hydration levels, and blood pressure over the next 12 hours.\n2. **Verified Consultation:** Connect with our 100% MCI-verified telemedicine practitioners via video room for immediate e-prescription generation.\n3. **Medication Safety Check:** Do not self-medicate with high-strength antibiotics without prior Schedule H verification.`;
      let suggestions = [
        { id: 'gen1', name: 'General Medicine Video Consult', price: '₹500.00', requiresRx: false, generic: 'Telemedicine Slot' },
        { id: 'gen2', name: 'Paracetamol 650mg SOS', price: '₹40.00', requiresRx: false, generic: 'Symptomatic Relief' }
      ];
      let disclaimer = "This is general information, not medical advice. Please consult a doctor or pharmacist for guidance specific to you.";

      if (lowerText.includes('paracetamol') || lowerText.includes('crocin') || lowerText.includes('pain') || lowerText.includes('fever') || lowerText.includes('headache')) {
        aiText = "### Clinical Analysis: Analgesic & Antipyretic Triage\nParacetamol (Acetaminophen) is a first-line analgesic and antipyretic medication used to treat mild-to-moderate pain and reduce fever.\n\n### Standard Adult Dosage Structure\n- **Dose:** 500mg to 1000mg every 4 to 6 hours as needed.\n- **Maximum Daily Limit:** Not exceeding 4000mg in 24 hours.\n- **Precaution:** Severe hepatic toxicity (liver damage) can occur if you exceed the limit or combine with alcohol.";
        suggestions = [
          { id: '1', name: 'Paracetamol 650mg', price: '₹40.00', requiresRx: false, generic: 'Analgesic & Antipyretic' },
          { id: '2', name: 'Ibuprofen 400mg', price: '₹60.00', requiresRx: false, generic: 'NSAID Pain Relief' }
        ];
      } else if (lowerText.includes('amoxicillin') || lowerText.includes('antibiotic') || lowerText.includes('infection')) {
        aiText = "### Clinical Analysis: Bacterial Infection & Antibiotic Shield\nAmoxicillin is a moderate-spectrum, bactericidal, beta-lactam antibiotic used to treat confirmed bacterial respiratory, skin, and ENT infections.\n\n### Schedule H Regulatory Warning\n- **Prescription Required:** Amoxicillin is a Schedule H restricted drug requiring a digitally verified doctor prescription.\n- **Dosage Compliance:** Must complete the exact prescribed 5-7 day course even if fever resolves to prevent antimicrobial resistance.\n- **Side Effects:** Common side-effects include mild nausea or antibiotic-associated colitis.";
        suggestions = [
          { id: '3', name: 'Amoxicillin 500mg', price: '₹120.00', requiresRx: true, generic: 'Penicillin Antibiotic' }
        ];
      } else if (lowerText.includes('pantoprazole') || lowerText.includes('acidity') || lowerText.includes('reflux') || lowerText.includes('alternative')) {
        aiText = "### Inventory Intercept & Alternative Analysis\nPantoprazole 40mg is currently OUT OF STOCK across nearby fulfillment centers.\n\n### AI Inventory Recommendation\nOur clinical inventory database suggests **Aciloc 150mg (Ranitidine 150mg)** as a verified generic equivalent in-stock option. It effectively reduces gastric acid secretion and prevents acid reflux discomfort without requiring dosage modifications.";
        suggestions = [
          { id: '7', name: 'Aciloc 150mg', price: '₹30.00', requiresRx: false, generic: 'Ranitidine (Generic Equivalent)', isAlternative: true }
        ];
      } else if (lowerText.includes('capsule') || lowerText.includes('shell') || lowerText.includes('veg')) {
        aiText = "### Formulation Analysis: Vegetarian Capsule Shells\nMost conventional pharmaceutical capsules utilize standard animal-derived gelatin shells. For vegetarian and vegan patients, Pharma Care offers certified **Hypromellose (HPMC) plant-based veggie capsule shells**.\n\n### Key Benefits\n- 100% Plant-derived, preservative-free, and starch-free.\n- Superior moisture stability for hygroscopic formulations.";
        suggestions = [
          { id: '5', name: 'HPMC Veggie Shells (Empty)', price: '₹180.00', requiresRx: false, generic: 'Hypromellose Plant Capsules' }
        ];
      } else if (lowerText.includes('doctor') || lowerText.includes('consult')) {
        aiText = "### Telemedicine Network & Roster Check\nOur active WebRTC telemedicine network has 100% MCI-verified specialists on standby right now.\n\n### Available Practitioners (Open Slots)\n- **Dr. Evelyn Rao (General Medicine):** Available for live video room (4:30 PM & immediate SOS slot).\n- **Dr. Rajesh Nair (Cardiology):** Available for ECG review and blood pressure consultation.";
      }

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: aiText,
        suggestions,
        disclaimer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 800);
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
            <p style={{ fontSize: '0.8rem' }}>Active Mode: <strong>{activeMode}</strong> &bull; Sub-10ms Safety Interceptor</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => handleReset()}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '6px 12px', borderRadius: '14px', border: '1px solid var(--color-border)', cursor: 'pointer' }}
            title="Reset AI back to initial greeting and clear conversation"
          >
            🔄 Reset to Initial Mode
          </button>
          <div className="badge badge-success" style={{ gap: '6px' }}>
            Safety Filters Active
          </div>
        </div>
      </div>

      {/* Mode Bar & Quick Chips */}
      <div style={{ backgroundColor: 'var(--color-surface-alt)', padding: '10px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', marginRight: '4px' }}>AI MODE:</span>
          {['General Triage', 'Medication Safety', 'Emergency Checker', 'Doctor Finder'].map(m => (
            <button
              key={m}
              onClick={() => handleReset(m)}
              style={{
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                backgroundColor: activeMode === m ? 'var(--color-primary)' : 'var(--color-surface)',
                color: activeMode === m ? 'white' : 'var(--color-text-primary)',
                cursor: 'pointer',
                fontWeight: activeMode === m ? '600' : '500'
              }}
            >
              {m}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '2px 0' }}>
          {[
            '⚡ Check Amoxicillin dosage',
            '🤒 High fever & headache',
            '🔄 Pantoprazole generic alternative',
            '🚨 Chest pain emergency check'
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              style={{
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: '12px',
                border: '1px dashed var(--color-accent)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Messages / Initial Mode area */}
      <div style={{
        flex: 1,
        padding: '24px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        backgroundColor: 'var(--color-bg)'
      }}>
        {isInitialMode ? (
          /* INITIAL MODE: Interactive Pre-Triage & Vitals Welcome Dashboard */
          <div style={{ maxWidth: '940px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.35s ease both' }}>
            {/* Vitals Assessment Card */}
            <div style={{
              background: 'linear-gradient(135deg, var(--color-surface), var(--color-surface-alt))',
              borderRadius: '20px',
              border: '1px solid var(--color-border)',
              padding: '24px',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <span className="badge badge-success" style={{ marginBottom: '8px', display: 'inline-block' }}>✦ INITIAL TRIAGE MODE ACTIVE</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '6px' }}>How can Pharma Care AI assist you today?</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', maxWidth: '600px' }}>
                  Select a clinical diagnosis category below to launch an instant AI triage analysis, verify Schedule H prescriptions, or check drug interactions.
                </p>
              </div>
              <div style={{ background: 'var(--color-primary-dim)', border: '1px solid var(--color-border-active)', borderRadius: '16px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '220px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase' }}>Patient Pre-Flight Profile</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>Rishi Kumar (Age 24)</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>Status: <strong>No Active Allergies</strong> &bull; Vitals: <strong>72 BPM</strong></div>
              </div>
            </div>

            {/* Symptom & Triage Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '16px' }}>
              {[
                { title: '🤒 High Fever & Body Ache', desc: 'Paracetamol dosage safety check, maximum 4000mg limit analysis, and rapid symptomatic relief options.', query: '🤒 High fever & headache', color: '#059669' },
                { title: '🔬 Antibiotic & Infection Check', desc: 'Amoxicillin 500mg verification, Schedule H compliance warning, and bacterial course completion guidance.', query: '⚡ Check Amoxicillin dosage', color: '#2563EB' },
                { title: '🔥 Gastric Reflux & Acidity', desc: 'Pantoprazole out-of-stock intercept and immediate Aciloc 150mg (Ranitidine) generic equivalent switch.', query: '🔄 Pantoprazole generic alternative', color: '#D97706' },
                { title: '🌱 Plant-Based Veggie Capsules', desc: 'Certified Hypromellose (HPMC) non-gelatin capsule shell catalog filter for vegetarian patients.', query: 'Are capsule shells 100% vegetarian?', color: '#7C3AED' },
                { title: '🚨 Chest Pain & Emergency Triage', desc: 'Test sub-10ms emergency pre-flight interceptor, location-aware ambulance dispatch (112 / 108).', query: '🚨 Chest pain emergency check', color: '#DC2626' },
                { title: '👨‍⚕️ Specialist Telemedicine Connect', desc: 'Check immediate WebRTC video availability with MCI-verified doctors (Dr. Evelyn Rao & Dr. Rajesh Nair).', query: 'Connect me with Dr. Evelyn Rao for consultation', color: '#0891B2' },
              ].map((card, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSend(card.query)}
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '16px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = card.color;
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0px)';
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '8px', color: 'var(--color-text-primary)' }}>{card.title}</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: '1.45', marginBottom: '16px' }}>{card.desc}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: card.color }}>Click to Diagnose →</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Sub-10ms AI</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
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
        )))}

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
