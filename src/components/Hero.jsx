import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const TAGLINES = [
  'Baked with love, delivered with joy',
  'Where every celebration becomes a memory',
  'Cakes, flowers & unforgettable moments',
]

const BG_IMAGES = [
  '/hero/bg8.jpeg',
  '/hero/bg10.jpeg',
  '/hero/bg4.jpeg',
  '/hero/bg5.jpeg',
]

// How long each image stays fully visible (ms)
const SLIDE_DURATION = 5000
// Crossfade duration (ms) — matches the CSS transition below
const FADE_DURATION  = 1500


export default function Hero() {
  const [taglineIdx, setTaglineIdx]   = useState(0)
  const [taglineFade, setTaglineFade] = useState(true)

  // Index of the image that is currently visible
  const [activeIdx, setActiveIdx] = useState(0)
  
  
  // ── Tagline rotation ────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      setTaglineFade(false)
      setTimeout(() => {
        setTaglineIdx(i => (i + 1) % TAGLINES.length)
        setTaglineFade(true)
      }, 500)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  // ── Background image crossfade ──────────────────────────────────
  // All images are always mounted and stacked. Only the active one
  // has opacity 1 — the rest are 0. CSS transition handles the fade
  // for every slide, including last → first, with no special casing.
  useEffect(() => {
    if (BG_IMAGES.length < 2) return
    const id = setInterval(() => {
      setActiveIdx(i => (i + 1) % BG_IMAGES.length)
    }, SLIDE_DURATION)
    return () => clearInterval(id)
  }, [])

  return (
    <section style={{
      position: 'relative',
      minHeight: '100svh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'var(--cream)',
    }}>
    
      {/* ── Cycling background images ────────────────────────────── */}
      {/* Every image is always mounted and stacked at zIndex 0.
          Only the active one has opacity 1; all others are 0.
          CSS transition makes every crossfade — including last→first —
          identical and smooth, with zero jump. */}
      {BG_IMAGES.map((src, i) => (
        <div key={src} style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: i === activeIdx ? 1 : 0,
          transition: `opacity ${FADE_DURATION}ms ease-in-out`,
          animation: 'bgDrift 20s ease-in-out infinite alternate',
          // Stagger the drift phase per image so they don't all move identically
          animationDelay: `${i * -5}s`,
        }} />
      ))}

      {/* Decorative background blobs */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: '60vw', height: '60vw', maxWidth: 600, maxHeight: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,105,180,0.18) 0%, rgba(255,248,240,0) 70%)',
          animation: 'float 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-5%', left: '-10%',
          width: '50vw', height: '50vw', maxWidth: 500, maxHeight: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,149,108,0.15) 0%, rgba(255,248,240,0) 70%)',
          animation: 'float 10s ease-in-out infinite reverse',
        }} />
        <div style={{
          position: 'absolute', top: '30%', left: '10%',
          width: '30vw', height: '30vw', maxWidth: 300, maxHeight: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,214,232,0.3) 0%, transparent 70%)',
          animation: 'float 12s ease-in-out infinite 2s',
        }} />

        {/* Floating emoji decorations */}
        {[
          { emoji: '🌸', top: '15%', left: '8%', size: '1.8rem', delay: '0s' },
          { emoji: '✦', top: '20%', right: '12%', size: '1.2rem', delay: '1s', color: 'var(--rose-gold)' },
          { emoji: '🌹', bottom: '25%', right: '8%', size: '1.6rem', delay: '2s' },
          { emoji: '✦', bottom: '30%', left: '15%', size: '0.9rem', delay: '1.5s', color: 'var(--pink-light)' },
          { emoji: '🎂', top: '60%', right: '18%', size: '1.4rem', delay: '0.5s' },
        ].map((d, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: d.top, bottom: d.bottom, left: d.left, right: d.right,
            fontSize: d.size, color: d.color,
            animation: `float ${6 + i}s ease-in-out infinite`,
            animationDelay: d.delay,
            opacity: 0.6,
          }}>
            {d.emoji}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="container" style={{
        position: 'relative', zIndex: 1,
        textAlign: 'center',
        padding: '120px 20px 60px',
      }}>
        {/* Logo */}
        <div style={{
          width: 110, height: 110, margin: '0 auto 24px',
          borderRadius: '50%',
          background: 'white',
          boxShadow: '0 8px 40px rgba(255,20,147,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 6,
          animation: 'scaleIn 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards',
        }}>
          <img
            src="/logo.jpeg"
            alt="Rosebella Perfections"
            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }}
          />
        </div>

        {/* Eyebrow */}
		<p style={{
		  fontFamily: 'var(--font-ui)',
		  fontSize: '0.72rem',
		  letterSpacing: '0.2em',
		  textTransform: 'uppercase',
		  color: '#111', // black text
		  marginBottom: 16,
		  animation: 'fadeUp 0.8s 0.2s ease both, eyebrowPulse 3s ease-in-out infinite',

		  // neon gold edge glow
		  textShadow: `
			0 0 2px #ffd700,
			0 0 6px #ffcc00,
			0 0 12px #ffb300,
			0 0 24px rgba(255, 200, 0, 0.8)
		  `,
		}}>
		  ✦ Handcrafted with Love ✦
		</p>


        {/* Heading */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.8rem, 8vw, 6rem)',
          fontWeight: 500,
          lineHeight: 1.05,
          color: 'var(--text-dark)',
          marginBottom: 12,
          animation: 'fadeUp 0.8s 0.35s ease both',
        }}>
          Rosebella<br />
          <em style={{ color: 'var(--pink)', fontStyle: 'italic', fontWeight: 400 }}>
            Perfections
          </em>
        </h1>

        {/* Animated tagline */}
		<p style={{
		  fontFamily: 'var(--font-body)',
		  fontSize: 'clamp(1rem, 3vw, 1.35rem)',
		  color: '#000',
		  fontStyle: 'italic',
		  fontWeight: 600,
		  marginBottom: 40,
		  opacity: taglineFade ? 1 : 0,
		  transition: 'opacity 0.5s ease',
		  animation: 'fadeUp 0.8s 0.5s ease both',
		  minHeight: '2em',

		  textShadow: `
			0 0 3px #ffd700,
			0 0 8px #ffcc00,
			0 0 18px #ffb300,
			0 0 40px rgba(255, 180, 0, 0.7)
		  `,
		}}>
		  {TAGLINES[taglineIdx]}
		</p>


        {/* CTAs */}
        <div style={{
          display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap',
          animation: 'fadeUp 0.8s 0.65s ease both',
        }}>
          <Link to="/catalog" className="btn-primary">
            Shop Now 🛍️
          </Link>
          <Link to="/booking" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            padding: '14px 28px',
            borderRadius: 'var(--radius-full, 999px)',
            background: 'linear-gradient(135deg, #f5c400 0%, #e8a800 100%)',
            color: '#3a1a00',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.9rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textDecoration: 'none',
            boxShadow: '0 0 12px rgba(255,200,0,0.7), 0 0 30px rgba(255,175,0,0.4), 0 4px 16px rgba(180,120,0,0.35)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 0 18px rgba(255,200,0,0.9), 0 0 40px rgba(255,175,0,0.55), 0 6px 20px rgba(180,120,0,0.4)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 0 12px rgba(255,200,0,0.7), 0 0 30px rgba(255,175,0,0.4), 0 4px 16px rgba(180,120,0,0.35)'
            }}
          >
            Book an Event
          </Link>
        </div>

        {/* Service pills */}
        <div style={{
          display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap',
          marginTop: 48,
          animation: 'fadeUp 0.8s 0.8s ease both',
        }}>
          {['🎂 Custom Cakes', '🍱 Bento Cakes', '🌹 Flowers', '🎉 Party Planning'].map(s => (
            <span key={s} style={{
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--cream-deeper)',
              borderRadius: 'var(--radius-full)',
              padding: '8px 18px',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.78rem',
              color: 'var(--text-mid)',
              letterSpacing: '0.04em',
            }}>
              {s}
            </span>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{
          marginTop: 64,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          animation: 'fadeUp 0.8s 1s ease both',
        }}>
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--text-light)',
          }}>
            Scroll to explore
          </p>
          <div style={{
            width: 1, height: 40,
            background: 'linear-gradient(to bottom, var(--rose-gold-light), transparent)',
            animation: 'scrollPulse 2s ease-in-out infinite',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.3); }
        }
        @keyframes bgDrift {
          0%   { transform: scale(1)    translateX(0)   translateY(0); }
          100% { transform: scale(1.06) translateX(-1%) translateY(-1%); }
        }
        @keyframes eyebrowPulse {
          0%, 100% { text-shadow: 0 0 6px rgba(255,210,0,0.95), 0 0 18px rgba(255,190,0,0.75), 0 0 38px rgba(255,160,0,0.45); }
          50%       { text-shadow: 0 0 10px rgba(255,220,0,1),    0 0 28px rgba(255,200,0,0.9),  0 0 55px rgba(255,170,0,0.6); }
        }
      `}</style>
    </section>
  )
}
