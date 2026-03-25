import React, { useEffect } from 'react'
import { useCart } from '../context/CartContext'

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQty, total, count, sendToWhatsapp, clearCart } = useCart()

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 1100,
          background: 'rgba(44,24,16,0.5)',
          backdropFilter: 'blur(4px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 1200,
        width: 'min(420px, 100vw)',
        background: 'var(--cream)',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(44,24,16,0.15)',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 24px 20px',
          borderBottom: '1px solid var(--cream-deeper)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 500,
              color: 'var(--text-dark)',
            }}>
              Your Order
            </h2>
            {count > 0 && (
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-light)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                {count} item{count !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <button onClick={() => setIsOpen(false)} style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--cream-dark)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', color: 'var(--text-dark)',
            transition: 'var(--transition)',
          }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>🛒</div>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                color: 'var(--text-mid)',
                marginBottom: 8,
              }}>Your cart is empty</p>
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-light)', fontStyle: 'italic' }}>
                Add some delights from our shop!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {items.map(item => (
                <div key={item.id} style={{
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex', gap: 12,
                  boxShadow: 'var(--shadow-soft)',
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 'var(--radius-sm)',
                    background: 'var(--cream-dark)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8rem', flexShrink: 0,
                  }}>
                  <img
                    src={item.imageBase64 || item.placeholder}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                   />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      color: 'var(--text-dark)',
                      marginBottom: 4,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {item.name}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-ui)', fontSize: '0.78rem',
                      color: 'var(--pink)', fontWeight: 600,
                    }}>
                      K{(item.price * item.quantity).toLocaleString()}
                    </p>
                    {item.note && (
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-light)', fontStyle: 'italic', marginTop: 2 }}>
                        Note: {item.note}
                      </p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        style={{
                          width: 26, height: 26, borderRadius: '50%',
                          background: 'var(--cream-dark)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dark)',
                        }}
                      >−</button>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', minWidth: 20, textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        style={{
                          width: 26, height: 26, borderRadius: '50%',
                          background: 'var(--pink-pale)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.9rem', fontWeight: 600, color: 'var(--pink)',
                        }}
                      >+</button>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          marginLeft: 'auto', color: 'var(--text-light)',
                          fontSize: '0.8rem', fontFamily: 'var(--font-ui)',
                          padding: '2px 6px',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: '20px 24px 32px',
            borderTop: '1px solid var(--cream-deeper)',
            background: 'var(--white)',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 16,
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-mid)' }}>
                Total
              </span>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '1.5rem',
                fontWeight: 600, color: 'var(--text-dark)',
              }}>
                K{total.toLocaleString()}
              </span>
            </div>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.8rem',
              color: 'var(--text-light)', fontStyle: 'italic',
              marginBottom: 16, textAlign: 'center',
            }}>
              Prices may vary — we'll confirm on WhatsApp 💬
            </p>
            <button
              onClick={() => { sendToWhatsapp(); setIsOpen(false) }}
              style={{
                width: '100%',
                background: '#25D366',
                color: 'white',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.9rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                padding: '16px',
                borderRadius: 'var(--radius-full)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 20px rgba(37,211,102,0.3)',
                transition: 'var(--transition)',
                marginBottom: 10,
              }}
            >
              💬 Send Order via WhatsApp
            </button>
            <button
              onClick={clearCart}
              style={{
                width: '100%',
                background: 'transparent',
                color: 'var(--text-light)',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.78rem',
                letterSpacing: '0.06em',
                padding: '10px',
                textAlign: 'center',
              }}
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}
