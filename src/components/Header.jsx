import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/catalog', label: 'Shop' },
  { to: '/events', label: 'Events' },
  { to: '/booking', label: 'Book Now' },
]

export default function Header() {
  const { count, setIsOpen } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const menuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(255,248,240,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201,149,108,0.15)' : 'none',
        transition: 'all 0.4s ease',
        padding: scrolled ? '12px 0' : '20px 0',
      }}>
        <div className="container" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, zIndex: 1001 }}>
            <img
              src="/logo.jpeg"
              alt="Rosebella Perfections"
              style={{ height: 48, width: 48, objectFit: 'contain', borderRadius: '50%' }}
            />
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: 600,
              color: 'var(--pink)',
              lineHeight: 1.1,
              display: 'none',
            }}
              className="logo-text"
            >
              Rosebella<br />
              <span style={{ fontStyle: 'italic', fontWeight: 400, fontSize: '0.9rem', color: 'var(--text-mid)' }}>
                Perfections
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="desktop-nav">
            {NAV_LINKS.map(({ to, label }) => (
              label === 'Book Now' ? (
                <Link key={to} to={to} className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.78rem' }}>
                  {label}
                </Link>
              ) : (
                <Link key={to} to={to} style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: isActive(to) ? 'var(--pink)' : 'var(--text-dark)',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  transition: 'var(--transition)',
                  background: isActive(to) ? 'rgba(255,20,147,0.08)' : 'transparent',
                  position: 'relative',
                }}>
                  {label}
                </Link>
              )
            ))}

            {/* Cart button */}
            <button
              onClick={() => setIsOpen(true)}
              style={{
                position: 'relative',
                width: 42, height: 42,
                borderRadius: '50%',
                background: 'var(--cream-dark)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem',
                transition: 'var(--transition)',
                marginLeft: 4,
              }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--pink-pale)'}
              onMouseOut={e => e.currentTarget.style.background = 'var(--cream-dark)'}
              aria-label="Cart"
            >
              🛒
              {count > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  background: 'var(--pink)', color: '#fff',
                  borderRadius: '50%', width: 20, height: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 700,
                  border: '2px solid var(--cream)',
                }}>
                  {count}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="mobile-right">
            <button
              onClick={() => setIsOpen(true)}
              style={{
                position: 'relative',
                width: 40, height: 40,
                borderRadius: '50%',
                background: 'var(--cream-dark)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem',
              }}
              aria-label="Cart"
            >
              🛒
              {count > 0 && (
                <span style={{
                  position: 'absolute', top: -3, right: -3,
                  background: 'var(--pink)', color: '#fff',
                  borderRadius: '50%', width: 18, height: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 700,
                  border: '2px solid var(--cream)',
                }}>
                  {count}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              ref={menuRef}
              onClick={() => setMenuOpen(v => !v)}
              style={{
                width: 40, height: 40, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 5,
                background: 'transparent', zIndex: 1001,
              }}
              aria-label="Menu"
            >
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: 'block', width: 22, height: 2,
                  background: menuOpen && i === 1 ? 'transparent' : 'var(--text-dark)',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  transform: menuOpen
                    ? i === 0 ? 'translateY(7px) rotate(45deg)' : i === 2 ? 'translateY(-7px) rotate(-45deg)' : 'none'
                    : 'none',
                }} />
              ))}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'var(--cream)',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        padding: '100px 32px 40px',
      }}>
        <img src="/logo.jpeg" alt="logo" style={{
          width: 80, height: 80, borderRadius: '50%', objectFit: 'contain',
          margin: '0 auto 32px',
        }} />
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: isActive(to) ? 600 : 400,
              color: isActive(to) ? 'var(--pink)' : 'var(--text-dark)',
              padding: '12px 0',
              borderBottom: '1px solid var(--cream-dark)',
              fontStyle: label === 'Book Now' ? 'italic' : 'normal',
            }}>
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-light)', fontStyle: 'italic', fontSize: '0.95rem' }}>
            Made with love 🌸
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-right { display: none !important; }
          .logo-text { display: block !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-right { display: flex !important; }
        }
      `}</style>
    </>
  )
}
