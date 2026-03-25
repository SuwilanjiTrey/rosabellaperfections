import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { SHOWCASE_PRODUCTS } from '../data/products'
import { useCart } from '../context/CartContext'

const PRODUCTS = SHOWCASE_PRODUCTS.length >= 5 ? SHOWCASE_PRODUCTS : [
  ...SHOWCASE_PRODUCTS,
  ...SHOWCASE_PRODUCTS,
].slice(0, 5)

export default function ProductShowcase() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const { addItem } = useCart()
  const [addedId, setAddedId] = useState(null)

  const next = useCallback(() => {
    if (transitioning) return
    setTransitioning(true)
    setTimeout(() => {
      setActiveIdx(i => (i + 1) % PRODUCTS.length)
      setTransitioning(false)
    }, 350)
  }, [transitioning])

  useEffect(() => {
    const timer = setInterval(next, 3500)
    return () => clearInterval(timer)
  }, [next])

  const handleAdd = (product) => {
    addItem(product)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 2000)
  }

  const featured = PRODUCTS[activeIdx]
  const others = PRODUCTS.filter((_, i) => i !== activeIdx)

  return (
    <section style={{
      padding: 'clamp(64px, 10vw, 100px) 0',
      background: 'var(--cream-dark)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorations */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '40%', height: '100%',
        background: 'linear-gradient(to left, rgba(255,20,147,0.04), transparent)',
        pointerEvents: 'none',
      }} />

      <div className="container">
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 64px)' }}>
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.72rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--rose-gold)',
            marginBottom: 12,
          }}>
            ✦ Our Favourites ✦
          </p>
          <h2 className="section-title" style={{ marginBottom: 12 }}>
            Handpicked for You
          </h2>
          <p className="section-subtitle">
            Bestsellers & new arrivals, refreshed constantly
          </p>
        </div>

        {/* Bento Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'auto',
          gap: 16,
        }}>
          {/* Featured product - large */}
          <div
            key={featured.id}
            style={{
              gridColumn: 'span 12',
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? 'scale(0.98)' : 'scale(1)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}
            className="featured-bento"
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
              className="featured-inner"
            >
              {/* Visual */}
              <div style={{
                height: 'clamp(200px, 35vw, 320px)',
                background: 'linear-gradient(135deg, var(--pink-pale), var(--cream-dark))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(5rem, 12vw, 9rem)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {featured.image ? (
                  <img src={featured.image} alt={featured.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ filter: 'drop-shadow(0 8px 24px rgba(255,20,147,0.3))' }}>
                    {featured.placeholder}
                  </span>
                )}

                {/* Tags */}
                <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 8 }}>
                  {featured.tags?.includes('bestseller') && (
                    <span style={{
                      background: 'var(--pink)', color: 'white',
                      fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 700,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      padding: '5px 12px', borderRadius: 'var(--radius-full)',
                    }}>★ Best Seller</span>
                  )}
                  {featured.tags?.includes('new') && (
                    <span style={{
                      background: 'var(--rose-gold)', color: 'white',
                      fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 700,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      padding: '5px 12px', borderRadius: 'var(--radius-full)',
                    }}>New</span>
                  )}
                </div>

                {/* Cycle dots */}
                <div style={{
                  position: 'absolute', bottom: 16, left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex', gap: 6,
                }}>
                  {PRODUCTS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      style={{
                        width: i === activeIdx ? 24 : 8,
                        height: 8,
                        borderRadius: 4,
                        background: i === activeIdx ? 'var(--pink)' : 'rgba(255,255,255,0.6)',
                        transition: 'all 0.3s ease',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: 'clamp(16px, 4vw, 28px)' }}>
                <p style={{
                  fontFamily: 'var(--font-ui)', fontSize: '0.7rem',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'var(--rose-gold)', marginBottom: 8,
                }}>
                  {featured.category}
                </p>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.3rem, 4vw, 2rem)',
                  fontWeight: 500, color: 'var(--text-dark)',
                  marginBottom: 8,
                }}>
                  {featured.name}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                  color: 'var(--text-light)', lineHeight: 1.6,
                  marginBottom: 20,
                }}>
                  {featured.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
                    fontWeight: 600, color: 'var(--pink)',
                  }}>
                    K{featured.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleAdd(featured)}
                    style={{
                      background: addedId === featured.id ? '#22c55e' : 'var(--pink)',
                      color: 'white',
                      fontFamily: 'var(--font-ui)', fontSize: '0.82rem',
                      fontWeight: 600, letterSpacing: '0.06em',
                      padding: '12px 28px',
                      borderRadius: 'var(--radius-full)',
                      transition: 'var(--transition)',
                      boxShadow: '0 4px 20px rgba(255,20,147,0.3)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {addedId === featured.id ? '✓ Added to Cart' : '+ Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Small product tiles */}
          {others.slice(0, 4).map((product, i) => (
            <div
              key={product.id}
              onClick={() => setActiveIdx(PRODUCTS.indexOf(product))}
              style={{
                gridColumn: 'span 6',
                background: 'white',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-soft)',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              className="small-bento"
            >
              <div style={{
                height: 90,
                background: 'linear-gradient(135deg, var(--cream-dark), var(--pink-pale))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.5rem',
                overflow: 'hidden',
              }}>
                {product.image ? (
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : product.placeholder}
              </div>
              <div style={{ padding: '10px 12px' }}>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: '0.82rem',
                  fontWeight: 500, color: 'var(--text-dark)',
                  marginBottom: 2, lineHeight: 1.3,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {product.name}
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--pink)', fontWeight: 600 }}>
                  K{product.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link to="/catalog" className="btn-primary" style={{ fontSize: '0.9rem' }}>
            View Full Catalog →
          </Link>
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .featured-bento { grid-column: span 8 !important; grid-row: span 2; }
          .small-bento:nth-child(odd) { grid-column: 9 / span 4 !important; }
          .small-bento:nth-child(even) { grid-column: 9 / span 4 !important; }
          .featured-inner { flex-direction: row !important; }
        }
        @media (min-width: 1024px) {
          .small-bento { grid-column: span 3 !important; }
        }
      `}</style>
    </section>
  )
}
