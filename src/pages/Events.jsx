import React from 'react'
import { Link } from 'react-router-dom'

const EVENTS = [
  {
    icon: '🎂',
    image: '/images/event_planning3.jpeg',
    title: 'Birthday Parties',
    desc: 'From intimate gatherings to grand celebrations — balloon arches, cake tables, custom décor and more.',
    includes: ['Balloon installation', 'Table & linen setup', 'Cake table styling', 'Custom signage'],
    from: 1500,
  },
  {
    icon: '👶',
    image: '/images/event_planning3.jpeg',
    title: 'Baby Showers',
    desc: 'Sweet, soft and magical. We create the perfect ambiance for welcoming your little one.',
    includes: ['Gender reveal setup', 'Floral arrangements', 'Dessert table', 'Memory corner'],
    from: 1800,
  },
  {
    icon: '💍',
    image: '/images/event_planning3.jpeg',
    title: 'Bridal Showers',
    desc: 'Celebrate the bride-to-be with elegance, flowers, and a setup she\'ll remember forever.',
    includes: ['Floral backdrop', 'Gift table setup', 'Bubbly station', 'Photo corner'],
    from: 2000,
  },
  {
    icon: '🕯️',
    image: '/images/event_planning3.jpeg',
    title: 'Romantic Dinners',
    desc: 'An intimate candlelit setup for two — roses, soft lighting and every detail perfected.',
    includes: ['Rose petal arrangement', 'Candle setup', 'Floral centrepiece', 'Mood lighting'],
    from: 950,
  },
  {
    icon: '🎓',
    image: '/images/event_planning3.jpeg',
    title: 'Graduation Parties',
    desc: 'Mark the milestone in style with personalised décor, a custom cake and celebration setup.',
    includes: ['Themed décor', 'Photo wall', 'Dessert spread', 'Custom cake'],
    from: 1200,
  },
  {
    icon: '🌸',
    image: '/images/event_planning3.jpeg',
    title: 'Custom Events',
    desc: 'Have something unique in mind? We bring any vision to life — just tell us your dream.',
    includes: ['Consultation included', 'Fully bespoke design', 'Flexible packages', 'Full coordination'],
    from: null,
  },
]

const PROCESS = [
  { step: '01', title: 'Reach Out', desc: 'Contact us via WhatsApp or our booking form with your event details.' },
  { step: '02', title: 'Consultation', desc: 'We\'ll discuss your vision, preferences, budget and date.' },
  { step: '03', title: 'Proposal', desc: 'Receive a personalised quote and mood board within 24 hours.' },
  { step: '04', title: 'We Set Up', desc: 'On your event day, we arrive early and handle everything beautifully.' },
]

export default function Events() {
  return (
    <div className="page-enter" style={{ paddingTop: 88 }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--text-dark) 0%, #3d1a0d 100%)',
        padding: 'clamp(56px, 10vw, 100px) 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 60% 40%, rgba(255,20,147,0.15) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div className="container" style={{ position: 'relative' }}>
          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: '0.72rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--rose-gold-light)', marginBottom: 12,
          }}>
            ✦ Event Services ✦
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 7vw, 4.5rem)',
            fontWeight: 500, color: 'var(--cream)', lineHeight: 1.1,
            marginBottom: 16,
          }}>
            We Turn Moments Into<br />
            <em style={{ color: 'var(--pink-light)', fontStyle: 'italic' }}>Memories</em>
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '1.1rem',
            color: 'rgba(255,248,240,0.65)', fontStyle: 'italic',
            marginBottom: 36,
          }}>
            Full-service event planning & styling across Lusaka
          </p>
          <Link to="/booking" className="btn-primary">Book Your Event</Link>
        </div>
      </div>

      {/* Events grid */}
      <section style={{ padding: 'clamp(64px, 10vw, 100px) 0', background: 'var(--cream)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 64px)' }}>
            <h2 className="section-title" style={{ marginBottom: 12 }}>Our Event Packages</h2>
            <p className="section-subtitle">Every celebration styled to perfection</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 24,
          }}>
            {EVENTS.map((ev, i) => (
              <div key={i} style={{
                background: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
                transition: 'var(--transition)',
                display: 'flex', flexDirection: 'column',
              }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-6px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Top colour band */}
                <div style={{
                  height: 120,
                  background: `linear-gradient(135deg, var(--pink-pale), var(--cream-dark))`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '3.5rem',
                }}>
                  <img src={ev.image} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                    fontWeight: 500, color: 'var(--text-dark)', marginBottom: 10,
                  }}>
                    {ev.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                    color: 'var(--text-light)', lineHeight: 1.6, marginBottom: 16,
                  }}>
                    {ev.desc}
                  </p>

                  {/* Includes */}
                  <div style={{ flex: 1, marginBottom: 20 }}>
                    {ev.includes.map((item, j) => (
                      <div key={j} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        marginBottom: 6,
                      }}>
                        <span style={{ color: 'var(--pink)', fontSize: '0.7rem' }}>✦</span>
                        <span style={{
                          fontFamily: 'var(--font-body)', fontSize: '0.88rem',
                          color: 'var(--text-mid)',
                        }}>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--cream-dark)',
                    paddingTop: 16,
                  }}>
                    <div>
                      <p style={{
                        fontFamily: 'var(--font-ui)', fontSize: '0.65rem',
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: 'var(--text-light)', marginBottom: 2,
                      }}>
                        Starting from
                      </p>
                      <p style={{
                        fontFamily: 'var(--font-display)', fontSize: '1.3rem',
                        fontWeight: 600, color: ev.from ? 'var(--pink)' : 'var(--rose-gold)',
                      }}>
                        {ev.from ? `K${ev.from.toLocaleString()}` : 'Custom'}
                      </p>
                    </div>
                    <Link to="/booking" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.75rem' }}>
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section style={{ padding: 'clamp(64px, 10vw, 100px) 0', background: 'var(--cream-dark)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 64px)' }}>
            <p style={{
              fontFamily: 'var(--font-ui)', fontSize: '0.72rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--rose-gold)', marginBottom: 12,
            }}>✦ How It Works ✦</p>
            <h2 className="section-title" style={{ marginBottom: 12 }}>Simple & Seamless</h2>
            <p className="section-subtitle">From enquiry to event — we handle everything</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 32, position: 'relative',
          }}>
            {PROCESS.map((p, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'var(--pink)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600,
                  margin: '0 auto 20px',
                  boxShadow: '0 8px 24px rgba(255,20,147,0.3)',
                }}>
                  {p.step}
                </div>
                <h4 style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                  fontWeight: 500, color: 'var(--text-dark)', marginBottom: 8,
                }}>
                  {p.title}
                </h4>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.88rem',
                  color: 'var(--text-light)', lineHeight: 1.6,
                }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: 'clamp(56px, 8vw, 88px) 0',
        background: 'linear-gradient(135deg, var(--pink-pale), var(--cream))',
        textAlign: 'center',
      }}>
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: 16 }}>
            Let's Plan Your Perfect Event
          </h2>
          <p className="section-subtitle" style={{ marginBottom: 36 }}>
            Reach out today — consultations are free
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/booking" className="btn-primary">Book a Consultation</Link>
            <a
              href="https://wa.me/260XXXXXXXXX"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#25D366', color: 'white',
                fontFamily: 'var(--font-ui)', fontSize: '0.85rem', fontWeight: 600,
                padding: '14px 28px', borderRadius: 'var(--radius-full)',
                boxShadow: '0 4px 16px rgba(37,211,102,0.3)',
              }}
            >
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
