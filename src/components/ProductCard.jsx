import React, { useState } from 'react'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product, compact = false }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [note, setNote] = useState('')
  const [showNote, setShowNote] = useState(false)

  const handleAdd = () => {
    addItem(product, 1, note)
    setAdded(true)
    setNote('')
    setShowNote(false)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div style={{
      background: 'var(--white)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-card)',
      transition: 'var(--transition)',
      display: 'flex',
      flexDirection: 'column',
    }}
      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Image area */}
      <div style={{
        position: 'relative',
        height: compact ? 160 : 220,
        background: 'linear-gradient(135deg, var(--cream-dark), var(--pink-pale))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: compact ? '3.5rem' : '5rem',
        overflow: 'hidden',
      }}>
        {product.imageBase64 ? (
          <img
            src={product.imageBase64}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ filter: 'drop-shadow(0 4px 12px rgba(255,20,147,0.2))' }}>
            {product.placeholder}
          </span>
        )}

        {/* Tags */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          display: 'flex', gap: 6, flexWrap: 'wrap',
        }}>
          {product.tags?.includes('bestseller') && (
            <span style={{
              background: 'var(--pink)', color: 'white',
              fontFamily: 'var(--font-ui)', fontSize: '0.6rem',
              fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
            }}>★ Best Seller</span>
          )}
          {product.tags?.includes('new') && (
            <span style={{
              background: 'var(--rose-gold)', color: 'white',
              fontFamily: 'var(--font-ui)', fontSize: '0.6rem',
              fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
            }}>New</span>
          )}
          {product.tags?.includes('premium') && (
            <span style={{
              background: 'var(--brown)', color: 'var(--cream)',
              fontFamily: 'var(--font-ui)', fontSize: '0.6rem',
              fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
            }}>✦ Premium</span>
          )}
        </div>

        {/* Category badge */}
        <div style={{
          position: 'absolute', bottom: 12, right: 12,
          background: 'rgba(255,248,240,0.9)',
          backdropFilter: 'blur(4px)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          fontFamily: 'var(--font-ui)', fontSize: '0.6rem',
          color: 'var(--text-mid)', letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: compact ? '16px' : '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: compact ? '1rem' : '1.15rem',
          fontWeight: 500,
          color: 'var(--text-dark)',
          marginBottom: 6,
          lineHeight: 1.3,
        }}>
          {product.name}
        </h3>
        {!compact && (
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--text-light)',
            lineHeight: 1.6,
            flex: 1,
            marginBottom: 16,
          }}>
            {product.description}
          </p>
        )}

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: compact ? 8 : 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: compact ? '1.1rem' : '1.3rem',
            fontWeight: 600,
            color: 'var(--pink)',
          }}>
            K{product.price.toLocaleString()}
          </span>

          <div style={{ display: 'flex', gap: 6 }}>
            {!compact && (
              <button
                onClick={() => setShowNote(v => !v)}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: showNote ? 'var(--pink-pale)' : 'var(--cream-dark)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem', transition: 'var(--transition)',
                }}
                title="Add a note"
              >
                ✏️
              </button>
            )}
            <button
              onClick={handleAdd}
              style={{
                background: added ? '#22c55e' : 'var(--pink)',
                color: 'white',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                padding: compact ? '8px 14px' : '10px 20px',
                borderRadius: 'var(--radius-full)',
                transition: 'var(--transition)',
                whiteSpace: 'nowrap',
                boxShadow: added ? '0 4px 16px rgba(34,197,94,0.3)' : '0 4px 16px rgba(255,20,147,0.25)',
              }}
            >
              {added ? '✓ Added' : '+ Add'}
            </button>
          </div>
        </div>

        {/* Note input */}
        {showNote && !compact && (
          <div style={{ marginTop: 12 }}>
            <input
              type="text"
              placeholder="Special instructions (e.g. name, flavour...)"
              value={note}
              onChange={e => setNote(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--cream)',
                border: '1px solid var(--cream-deeper)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '0.85rem',
                color: 'var(--text-dark)',
                outline: 'none',
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
