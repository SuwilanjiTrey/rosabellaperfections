import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const EVENTS = [
  {
    icon: '🎂',
    image: '/images/event_planning2.jpeg',
    title: 'Birthday Parties',
    desc: 'From intimate gatherings to grand celebrations — balloon arches, cake tables, custom décor and more.',
    includes: ['Balloon installation', 'Table & linen setup', 'Cake table styling', 'Custom signage'],
    from: 1500,
  },
  {
    icon: '👶',
    image: '/images/event_planning1.jpeg',
    title: 'Baby Showers',
    desc: 'Sweet, soft and magical. We create the perfect ambiance for welcoming your little one.',
    includes: ['Gender reveal setup', 'Floral arrangements', 'Dessert table', 'Memory corner'],
    from: 1800,
  },
  {
    icon: '💍',
    image: '/images/event_planning6.jpeg',
    title: 'Bridal Showers',
    desc: 'Celebrate the bride-to-be with elegance, flowers, and a setup she\'ll remember forever.',
    includes: ['Floral backdrop', 'Gift table setup', 'Bubbly station', 'Photo corner'],
    from: 2000,
  },
  {
    icon: '🕯️',
    image: '/images/event_planning7.jpeg',
    title: 'Wedding Events',
    desc: 'An intimate, vibrant setup — roses, soft lighting and every detail perfected.',
    includes: ['Rose petal arrangement', 'Wedding Decor', 'Floral centrepiece', 'Mood lighting'],
    from: 950,
  },
  {
    icon: '🎓',
    image: '/images/event_planning8.jpeg',
    title: 'Graduation Parties',
    desc: 'Mark the milestone in style with personalised décor, a custom cake and celebration setup.',
    includes: ['Themed décor', 'Photo wall', 'Dessert spread', 'Custom cake'],
    from: 1200,
  },
  {
    icon: '🌸',
    image: '/images/event_planning5.jpeg',
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
  const [lightbox, setLightbox] = useState(null) // { src, title } | null
  const [activeCard, setActiveCard] = useState(null)


  return (
    <div className="page-enter" style={{ paddingTop: 88 }}>
      {/* ── Lightbox — bottom sheet on mobile, centered modal on desktop ── */}
	{/* ── Modal Viewer ── */}
	{lightbox && (
	  <div
		onClick={() => setLightbox(null)}
		style={{
		  position: 'fixed',
		  inset: 0,
		  zIndex: 1000,
		  background: 'rgba(0,0,0,0.85)',
		  display: 'flex',
		  alignItems: 'center',
		  justifyContent: 'center',
		  padding: 20,
		  animation: 'fadeIn 0.2s ease',
		}}
	  >
		<div
		  onClick={(e) => e.stopPropagation()}
		  style={{
		    position: 'relative',
		    maxWidth: '900px',
		    width: '100%',
		    maxHeight: '90vh',
		    borderRadius: 16,
		    overflow: 'hidden',
		    background: '#000',
		    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
		  }}
		>
		  {/* Close button */}
		  <button
		    onClick={() => setLightbox(null)}
		    style={{
		      position: 'absolute',
		      top: 12,
		      right: 12,
		      width: 36,
		      height: 36,
		      borderRadius: '50%',
		      background: 'rgba(0,0,0,0.6)',
		      color: 'white',
		      border: '1px solid rgba(255,255,255,0.2)',
		      fontSize: '1rem',
		      cursor: 'pointer',
		      zIndex: 2,
		    }}
		  >
		    ✕
		  </button>

		  {/* Image */}
		  <img
		    src={lightbox.src}
		    alt={lightbox.title}
		    style={{
		      width: '100%',
		      height: '100%',
		      objectFit: 'contain',
		      maxHeight: '90vh',
		    }}
		  />
		</div>
	  </div>
	)}


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
			{EVENTS.map((ev, i) => {
			  const isActive = activeCard === i

			  return (
				<div
				  key={i}
				  style={{
					background: 'var(--white)',
					borderRadius: 'var(--radius-lg)',
					overflow: 'hidden',
					boxShadow: 'var(--shadow-card)',
					transition: 'all 0.4s ease',
					display: 'flex',
					flexDirection: 'column',

					// 🔥 expand card when active
					transform: isActive ? 'scale(1.03)' : 'scale(1)',
					zIndex: isActive ? 2 : 1,
				  }}
				>
				  {/* Image (click to toggle) */}
				  <div
					onClick={() =>
					  setActiveCard(isActive ? null : i)
					}
					style={{
					  height: isActive ? 260 : 120,
					  overflow: 'hidden',
					  cursor: 'pointer',
					  position: 'relative',
					  transition: 'height 0.4s ease',
					}}
				  >
					<img
					  src={ev.image}
					  alt={ev.title}
					  style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						transition: 'transform 0.4s ease',
					  }}
					/>

					{/* Hint */}
					<span style={{
					  position: 'absolute',
					  bottom: 8,
					  right: 8,
					  background: 'rgba(0,0,0,0.5)',
					  color: 'white',
					  fontSize: '0.6rem',
					  padding: '3px 8px',
					  borderRadius: 4,
					}}>
					  {isActive ? 'tap to close' : 'tap to view'}
					</span>
				  </div>

				  {/* Content (collapses when active) */}
				  <div
					style={{
					  padding: '24px',
					  maxHeight: isActive ? 0 : 500,
					  opacity: activeCard !== null && !isActive ? 0.5 : 1,
					  filter: activeCard !== null && !isActive ? 'blur(2px)' : 'none',
					  overflow: 'hidden',
					  transform: isActive ? 'scale(1.08)' : 'scale(1)',
					  transition: 'all 0.35s ease',
					}}
				  >
					<h3 style={{
					  fontFamily: 'var(--font-display)',
					  fontSize: '1.2rem',
					  marginBottom: 10,
					  marginTop: -10,
					}}>
					  {ev.title}
					</h3>

					<p style={{
					  fontFamily: 'var(--font-body)',
					  fontSize: '0.9rem',
					  color: 'var(--text-light)',
					  marginBottom: 16,
					}}>
					  {ev.desc}
					</p>

					{/* Includes */}
					<div style={{ marginBottom: 20 }}>
					  {ev.includes.map((item, j) => (
						<div key={j} style={{
						  display: 'flex',
						  gap: 8,
						  marginBottom: 6,
						}}>
						  <span style={{ color: 'var(--pink)' }}>✦</span>
						  <span style={{ fontSize: '0.88rem' }}>{item}</span>
						</div>
					  ))}
					</div>

					{/* Price */}
					<div style={{
					  display: 'flex',
					  justifyContent: 'space-between',
					  alignItems: 'center',
					}}>
					  <p style={{
						fontFamily: 'var(--font-display)',
						fontSize: '1.2rem',
						color: 'var(--pink)',
					  }}>
						{ev.from ? `K${ev.from}` : 'Custom'}
					  </p>

					  <Link to="/booking" className="btn-primary">
						Book Now
					  </Link>
					</div>
				  </div>
				</div>
			  )
			})}

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
              href="https://wa.me/260978615850"
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
		<style>{`
		  @keyframes fadeIn {
			from { opacity: 0; }
			to { opacity: 1; }
		  }
		`}</style>

    </div>
  )
}
