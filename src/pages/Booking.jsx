import React, { useState } from 'react'

const EVENT_TYPES = [
  'Birthday Party', 'Baby Shower', 'Bridal Shower',
  'Romantic Dinner', 'Graduation', 'Wedding', 'Corporate', 'Other'
]

const SERVICES_LIST = [
  { id: 'cakes', label: '🎂 Custom Cake' },
  { id: 'bento', label: '🍱 Bento Cakes' },
  { id: 'flowers', label: '🌹 Flowers & Roses' },
  { id: 'decor', label: '🎉 Event Décor & Setup' },
  { id: 'planning', label: '📋 Full Event Planning' },
]

const BUDGET_RANGES = [
  'Under K500', 'K500 – K1,000', 'K1,000 – K2,000',
  'K2,000 – K5,000', 'K5,000+', 'Not sure yet'
]

export default function Booking() {
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    eventType: '', eventDate: '', guestCount: '',
    services: [], budget: '', notes: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
  }

  const toggleService = (id) => {
    setForm(f => ({
      ...f,
      services: f.services.includes(id)
        ? f.services.filter(s => s !== id)
        : [...f.services, id]
    }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Please enter your name'
    if (!form.phone.trim()) e.phone = 'Please enter your WhatsApp number'
    if (!form.eventType) e.eventType = 'Please select an event type'
    if (!form.eventDate) e.eventDate = 'Please select a date'
    if (form.services.length === 0) e.services = 'Please select at least one service'
    return e
  }

  const handleSubmit = () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)

    // Build WhatsApp message
    const selectedServices = SERVICES_LIST
      .filter(s => form.services.includes(s.id))
      .map(s => s.label).join(', ')

    const message = [
      '🌸 *Booking Request — Rosebella Perfections* 🌸',
      '',
      `*Name:* ${form.name}`,
      `*Phone:* ${form.phone}`,
      form.email ? `*Email:* ${form.email}` : null,
      '',
      `*Event Type:* ${form.eventType}`,
      `*Event Date:* ${form.eventDate}`,
      form.guestCount ? `*Guests:* ${form.guestCount}` : null,
      '',
      `*Services Required:* ${selectedServices}`,
      form.budget ? `*Budget:* ${form.budget}` : null,
      '',
      form.notes ? `*Additional Notes:*\n${form.notes}` : null,
      '',
      'Looking forward to hearing from you! 💕',
    ].filter(Boolean).join('\n')

    const WHATSAPP_NUMBER = '260978615850'
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      window.open(url, '_blank')
    }, 1000)
  }

  if (submitted) {
    return (
      <div className="page-enter" style={{ paddingTop: 88 }}>
        <div style={{
          minHeight: '70vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '40px 20px',
        }}>
          <div style={{ textAlign: 'center', maxWidth: 480 }}>
            <div style={{ fontSize: '5rem', marginBottom: 24, animation: 'scaleIn 0.6s ease both' }}>🌸</div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
              fontWeight: 500, color: 'var(--text-dark)', marginBottom: 16,
            }}>
              Booking Sent!
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '1.05rem',
              color: 'var(--text-light)', lineHeight: 1.7,
              fontStyle: 'italic', marginBottom: 32,
            }}>
              Your booking request has been sent to WhatsApp.
              We'll confirm your details and get back to you within a few hours!
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name:'',phone:'',email:'',eventType:'',eventDate:'',guestCount:'',services:[],budget:'',notes:'' }) }}
              className="btn-secondary"
            >
              Make Another Booking
            </button>
          </div>
        </div>
        <style>{`@keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }`}</style>
      </div>
    )
  }

  return (
    <div className="page-enter" style={{ paddingTop: 88 }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--pink-pale), var(--cream-dark))',
        padding: 'clamp(40px, 8vw, 72px) 0',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div className="container" style={{ position: 'relative' }}>
          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: '0.72rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--rose-gold)', marginBottom: 12,
          }}>✦ Bookings ✦</p>
          <h1 className="section-title" style={{ marginBottom: 12 }}>Book Your Event</h1>
          <p className="section-subtitle">Fill in the details below and we'll reach out on WhatsApp</p>
        </div>
      </div>

      <div className="container" style={{ padding: 'clamp(40px, 8vw, 72px) 20px' }}>
        <div style={{
          maxWidth: 680, margin: '0 auto',
          background: 'var(--white)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          overflow: 'hidden',
        }}>
          {/* Progress indicator */}
          <div style={{
            background: 'linear-gradient(90deg, var(--pink), var(--pink-light))',
            height: 4,
          }} />

          <div style={{ padding: 'clamp(24px, 5vw, 48px)' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: '1.5rem',
              fontWeight: 500, color: 'var(--text-dark)', marginBottom: 8,
            }}>
              Tell us about your celebration ✨
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              color: 'var(--text-light)', fontStyle: 'italic', marginBottom: 32,
            }}>
              All fields marked with * are required
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Contact section */}
              <div>
                <SectionLabel>Contact Details</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 16 }}>
                  <Field label="Full Name *" error={errors.name}>
                    <input
                      type="text" placeholder="Your name"
                      value={form.name} onChange={e => update('name', e.target.value)}
                    />
                  </Field>
                  <Field label="WhatsApp Number *" error={errors.phone}>
                    <input
                      type="tel" placeholder="+260 XXX XXX XXX"
                      value={form.phone} onChange={e => update('phone', e.target.value)}
                    />
                  </Field>
                  <Field label="Email (optional)">
                    <input
                      type="email" placeholder="your@email.com"
                      value={form.email} onChange={e => update('email', e.target.value)}
                    />
                  </Field>
                </div>
              </div>

              {/* Event details */}
              <div>
                <SectionLabel>Event Details</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 16 }}>
                  <Field label="Event Type *" error={errors.eventType}>
                    <select value={form.eventType} onChange={e => update('eventType', e.target.value)}>
                      <option value="">Select event type</option>
                      {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Event Date *" error={errors.eventDate}>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={form.eventDate} onChange={e => update('eventDate', e.target.value)}
                    />
                  </Field>
                  <Field label="Number of Guests (approx.)">
                    <input
                      type="number" placeholder="e.g. 30"
                      value={form.guestCount} onChange={e => update('guestCount', e.target.value)}
                      min="1"
                    />
                  </Field>
                </div>
              </div>

              {/* Services */}
              <div>
                <SectionLabel>Services Required *</SectionLabel>
                {errors.services && <p style={{ color: 'var(--pink)', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', marginTop: 4 }}>{errors.services}</p>}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                  gap: 10, marginTop: 16,
                }}>
                  {SERVICES_LIST.map(s => {
                    const selected = form.services.includes(s.id)
                    return (
                      <button
                        key={s.id}
                        onClick={() => toggleService(s.id)}
                        style={{
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-md)',
                          border: `2px solid ${selected ? 'var(--pink)' : 'var(--cream-deeper)'}`,
                          background: selected ? 'var(--pink-pale)' : 'transparent',
                          color: selected ? 'var(--pink)' : 'var(--text-mid)',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.9rem',
                          textAlign: 'left',
                          transition: 'var(--transition)',
                          cursor: 'pointer',
                        }}
                      >
                        {s.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Budget */}
              <div>
                <SectionLabel>Budget Range</SectionLabel>
                <div style={{
                  display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16,
                }}>
                  {BUDGET_RANGES.map(b => {
                    const selected = form.budget === b
                    return (
                      <button
                        key={b}
                        onClick={() => update('budget', b)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 'var(--radius-full)',
                          border: `1.5px solid ${selected ? 'var(--pink)' : 'var(--cream-deeper)'}`,
                          background: selected ? 'var(--pink)' : 'transparent',
                          color: selected ? 'white' : 'var(--text-mid)',
                          fontFamily: 'var(--font-ui)',
                          fontSize: '0.78rem',
                          transition: 'var(--transition)',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {b}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <SectionLabel>Additional Notes</SectionLabel>
                <div style={{ marginTop: 16 }}>
                  <textarea
                    placeholder="Tell us more about your vision, colour scheme, special requests..."
                    value={form.notes}
                    onChange={e => update('notes', e.target.value)}
                    rows={4}
                    style={{
                      width: '100%',
                      background: 'var(--cream)',
                      border: '1.5px solid var(--cream-deeper)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 16px',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      color: 'var(--text-dark)',
                      outline: 'none',
                      resize: 'vertical',
                      lineHeight: 1.6,
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--pink-light)'}
                    onBlur={e => e.target.style.borderColor = 'var(--cream-deeper)'}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? 'var(--rose-gold)' : '#25D366',
                  color: 'white',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  padding: '18px',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxShadow: '0 4px 24px rgba(37,211,102,0.3)',
                  transition: 'var(--transition)',
                  cursor: loading ? 'wait' : 'pointer',
                }}
              >
                {loading ? '⏳ Preparing your request...' : '💬 Send Booking Request via WhatsApp'}
              </button>

              <p style={{
                textAlign: 'center',
                fontFamily: 'var(--font-body)', fontSize: '0.82rem',
                color: 'var(--text-light)', fontStyle: 'italic',
              }}>
                Your details will be sent to WhatsApp for confirmation 🌸
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: 'var(--font-ui)', fontSize: '0.7rem',
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color: 'var(--rose-gold)', fontWeight: 600,
    }}>
      {children}
    </p>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontFamily: 'var(--font-body)', fontSize: '0.88rem',
        color: 'var(--text-mid)', marginBottom: 6,
      }}>
        {label}
      </label>
      <div style={{
        position: 'relative',
      }}>
        {React.cloneElement(children, {
          style: {
            width: '100%',
            background: 'var(--cream)',
            border: `1.5px solid ${error ? 'var(--pink)' : 'var(--cream-deeper)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '12px 14px',
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            color: 'var(--text-dark)',
            outline: 'none',
            transition: 'border-color 0.2s',
            appearance: 'none',
            ...children.props.style,
          },
          onFocus: e => e.target.style.borderColor = 'var(--pink-light)',
          onBlur: e => e.target.style.borderColor = error ? 'var(--pink)' : 'var(--cream-deeper)',
        })}
      </div>
      {error && (
        <p style={{
          fontFamily: 'var(--font-ui)', fontSize: '0.72rem',
          color: 'var(--pink)', marginTop: 4,
        }}>{error}</p>
      )}
    </div>
  )
}
