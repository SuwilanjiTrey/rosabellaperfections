import React from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import ProductShowcase from '../components/ProductShowcase'

const SERVICES = [
  {
    icon: '🎂',
    title: 'Custom Cakes',
    desc: 'Birthday, wedding, anniversary — every occasion deserves a cake as special as the moment.',
  },
  {
    icon: '🍱',
    title: 'Bento Cakes',
    desc: 'Adorable Korean-style mini cakes, perfect for gifting and personal celebrations.',
  },
  {
    icon: '🌹',
    title: 'Flowers & Roses',
    desc: 'Fresh bouquets, luxury rose boxes and preserved florals for every emotion.',
  },
  {
    icon: '🎉',
    title: 'Party Planning',
    desc: 'Full-service event setup — we handle décor, florals, and styling so you just show up.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Chanda M.',
    text: 'The bento cake was absolutely gorgeous! Everyone at my birthday party was obsessed.',
    rating: 5,
  },
  {
    name: 'Natasha K.',
    text: 'Rosebella did our baby shower and it looked like something out of Pinterest. Stunning!',
    rating: 5,
  },
  {
    name: 'Mwamba T.',
    text: 'Ordered roses for my wife and she cried happy tears. Beautifully packaged and fresh.',
    rating: 5,
  },
]

export default function Home() {
  return (
    <div className="page-enter">
      <Hero />

      {/* Services */}
      <section style={{
        padding: 'clamp(64px, 10vw, 100px) 0',
        background: 'var(--cream)',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 64px)' }}>
            <p style={{
              fontFamily: 'var(--font-ui)', fontSize: '0.72rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--rose-gold)', marginBottom: 12,
            }}>
              ✦ What We Offer ✦
            </p>
            <h2 className="section-title" style={{ marginBottom: 12 }}>
              Everything for Your Special Day
            </h2>
            <p className="section-subtitle">
              From a single bento to a full party setup — we've got you
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24,
          }}>
            {SERVICES.map((s, i) => (
              <div key={i} style={{
                background: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px 24px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-soft)',
                transition: 'var(--transition)',
                border: '1px solid transparent',
              }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.borderColor = 'var(--pink-pale)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-hover)'
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'transparent'
                  e.currentTarget.style.boxShadow = 'var(--shadow-soft)'
                }}
              >
                <div style={{ fontSize: '2.8rem', marginBottom: 16 }}>{s.icon}</div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                  fontWeight: 500, color: 'var(--text-dark)', marginBottom: 10,
                }}>
                  {s.title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                  color: 'var(--text-light)', lineHeight: 1.7,
                }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase (Bento Grid) */}
      <ProductShowcase />

      {/* Why choose us */}
      <section style={{
        padding: 'clamp(64px, 10vw, 100px) 0',
        background: 'var(--cream)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 70% 50%, rgba(255,20,147,0.04) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 48,
            alignItems: 'center',
          }}>
            <div>
              <p style={{
                fontFamily: 'var(--font-ui)', fontSize: '0.72rem',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'var(--rose-gold)', marginBottom: 12,
              }}>
                ✦ Why Rosebella ✦
              </p>
              <h2 className="section-title" style={{ marginBottom: 20 }}>
                Made With Love,<br />
                <em style={{ color: 'var(--pink)', fontStyle: 'italic' }}>
                  Delivered With Joy
                </em>
              </h2>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '1.05rem',
                color: 'var(--text-light)', lineHeight: 1.8,
                fontStyle: 'italic', marginBottom: 32,
              }}>
                Every order is crafted from scratch with premium ingredients.
                We believe your celebration deserves nothing but the best.
              </p>
              <Link to="/booking" className="btn-primary">Book Your Event</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: '✨', title: 'Premium Quality', desc: 'Only the finest ingredients and freshest flowers' },
                { icon: '🎨', title: 'Custom Designs', desc: 'Every piece tailored to your vision and taste' },
                { icon: '⚡', title: 'Fast Delivery', desc: 'Same-day delivery available across Lusaka' },
                { icon: '💬', title: 'Personal Service', desc: 'Direct WhatsApp communication for every order' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                  background: 'var(--white)',
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-soft)',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-sm)',
                    background: 'var(--cream)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem', flexShrink: 0,
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 style={{
                      fontFamily: 'var(--font-display)', fontSize: '1rem',
                      fontWeight: 600, color: 'var(--text-dark)', marginBottom: 4,
                    }}>
                      {item.title}
                    </h4>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.88rem',
                      color: 'var(--text-light)',
                    }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{
        padding: 'clamp(64px, 10vw, 100px) 0',
        background: 'var(--cream-dark)',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 56px)' }}>
            <p style={{
              fontFamily: 'var(--font-ui)', fontSize: '0.72rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--rose-gold)', marginBottom: 12,
            }}>
              ✦ Loved By Many ✦
            </p>
            <h2 className="section-title">Happy Customers</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24,
          }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                background: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                boxShadow: 'var(--shadow-soft)',
                position: 'relative',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 12, color: 'var(--pink)', fontFamily: 'Georgia', lineHeight: 1 }}>
                  "
                </div>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '1rem',
                  color: 'var(--text-mid)', lineHeight: 1.7,
                  fontStyle: 'italic', marginBottom: 20,
                }}>
                  {t.text}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: '0.9rem',
                    fontWeight: 600, color: 'var(--text-dark)',
                  }}>
                    — {t.name}
                  </span>
                  <span style={{ color: 'var(--pink)', fontSize: '0.85rem' }}>
                    {'★'.repeat(t.rating)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        padding: 'clamp(56px, 8vw, 88px) 0',
        background: 'linear-gradient(135deg, var(--text-dark) 0%, #3d1a0d 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 80% 50%, rgba(255,20,147,0.15) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🌸</div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 5vw, 3rem)',
            fontWeight: 500, color: 'var(--cream)', marginBottom: 16,
          }}>
            Ready to Make It Special?
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '1.1rem',
            color: 'rgba(255,248,240,0.65)', fontStyle: 'italic',
            marginBottom: 40,
          }}>
            Tell us about your dream celebration and we'll bring it to life
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/catalog" style={{
              background: 'var(--pink)', color: 'white',
              fontFamily: 'var(--font-ui)', fontSize: '0.85rem',
              fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '16px 36px', borderRadius: 'var(--radius-full)',
              boxShadow: '0 4px 24px rgba(255,20,147,0.4)',
              transition: 'var(--transition)',
            }}>
              Shop Now
            </Link>
            <Link to="/booking" style={{
              background: 'transparent', color: 'var(--cream)',
              fontFamily: 'var(--font-ui)', fontSize: '0.85rem',
              fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '15px 35px', borderRadius: 'var(--radius-full)',
              border: '1.5px solid rgba(255,248,240,0.3)',
              transition: 'var(--transition)',
            }}>
              Book an Event
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
