import React from 'react'
import { Link } from 'react-router-dom'



export default function Footer() {
const iconStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 42,
  height: 42,
  borderRadius: '50%',
  background: 'rgba(255,248,240,0.08)',
  color: 'white',
  fontSize: '1.1rem',
  transition: 'all 0.25s ease',
  textDecoration: 'none',
}


  return (
    <footer style={{
      background: 'var(--text-dark)',
      color: 'var(--cream)',
      padding: '56px 0 0',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 40,
          paddingBottom: 48,
          borderBottom: '1px solid rgba(255,248,240,0.1)',
        }}>
          {/* Brand */}
          <div>
            <img src="/logo.jpeg" alt="Rosebella" style={{
              width: 64, height: 64, borderRadius: '50%',
              objectFit: 'contain', marginBottom: 16,
              background: 'white', padding: 4,
            }} />
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 500,
              color: 'var(--pink-light)',
              marginBottom: 8,
            }}>
              Rosebella Perfections
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)',
              color: 'rgba(255,248,240,0.6)',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              fontStyle: 'italic',
            }}>
              Handcrafted cakes, bespoke florals<br />& unforgettable celebrations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--rose-gold-light)',
              marginBottom: 20,
            }}>
              Quick Links
            </h4>
            {[
              { to: '/', label: 'Home' },
              { to: '/catalog', label: 'Shop' },
              { to: '/events', label: 'Events' },
              { to: '/booking', label: 'Book Now' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                color: 'rgba(255,248,240,0.7)',
                marginBottom: 10,
                fontSize: '1rem',
                transition: 'color 0.2s',
              }}
                onMouseOver={e => e.target.style.color = 'var(--pink-light)'}
                onMouseOut={e => e.target.style.color = 'rgba(255,248,240,0.7)'}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Services */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--rose-gold-light)',
              marginBottom: 20,
            }}>
              What We Do
            </h4>
            {['Custom Cakes', 'Bento Cakes', 'Roses & Flowers', 'Party Planning', 'Event Décor', 'Gift Hampers'].map(s => (
              <p key={s} style={{
                fontFamily: 'var(--font-body)',
                color: 'rgba(255,248,240,0.7)',
                marginBottom: 8,
                fontSize: '1rem',
              }}>
                {s}
              </p>
            ))}
          </div>

		{/* Contact */}
		<div>
		  <h4 style={{
			fontFamily: 'var(--font-ui)',
			fontSize: '0.75rem',
			letterSpacing: '0.12em',
			textTransform: 'uppercase',
			color: 'var(--rose-gold-light)',
			marginBottom: 20,
		  }}>
			Get In Touch
		  </h4>

		  {/* WhatsApp CTA */}
		  <a
			href="https://wa.me/260978615850"
			target="_blank"
			rel="noopener noreferrer"
			style={{
			  display: 'inline-flex',
			  alignItems: 'center',
			  gap: 8,
			  background: '#25D366',
			  color: 'white',
			  fontFamily: 'var(--font-ui)',
			  fontSize: '0.82rem',
			  fontWeight: 500,
			  padding: '12px 20px',
			  borderRadius: 'var(--radius-full)',
			  letterSpacing: '0.05em',
			  marginBottom: 20,
			}}
		  >
			💬 WhatsApp Us
		  </a>

		{/* Social icons */}
		<div style={{
		  display: 'flex',
		  gap: 12,
		  marginBottom: 16,
		}}>
		  {/* Instagram */}
		  <a
			href="https://instagram.com/rosabella_perfections"
			target="_blank"
			rel="noopener noreferrer"
			style={iconStyle}
		  >
			<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
			  <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm5 5a5 5 0 110 10 5 5 0 010-10zm6.5-.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM12 9a3 3 0 100 6 3 3 0 000-6z"/>
			</svg>
		  </a>

		  {/* Facebook */}
		  <a
			href="https://facebook.com/people/Rosabella-Perfections/100071243590367/"
			target="_blank"
			rel="noopener noreferrer"
			style={iconStyle}
		  >
			<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
			  <path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5V12H17l-.5 3h-2.2v7A10 10 0 0022 12z"/>
			</svg>
		  </a>

		  {/* TikTok */}
		  <a
			href="https://www.tiktok.com/@rosabella_perfections"
			target="_blank"
			rel="noopener noreferrer"
			style={iconStyle}
		  >
			<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
			  <path d="M16 3c.4 2.1 2 3.8 4 4.2v3c-1.5-.1-3-.6-4-1.5V15a6 6 0 11-6-6c.3 0 .7 0 1 .1v3.1a3 3 0 10 3 3V3h2z"/>
			</svg>
		  </a>

		  {/* Email */}
		  <a
			href="mailto:Rossybusinessventure@gmail.com"
			style={iconStyle}
		  >
			<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
			  <path d="M2 6l10 7 10-7v12H2V6zm10 5L2 4h20l-10 7z"/>
			</svg>
		  </a>
		</div>


		  <p style={{
			fontFamily: 'var(--font-body)',
			color: 'rgba(255,248,240,0.5)',
			fontSize: '0.9rem',
			lineHeight: 1.7,
		  }}>
			Orders placed daily.<br />
			Delivery available in Lusaka.
		  </p>
		</div>
		</div>

        {/* Bottom bar */}
       <div style={{
		  fontFamily: 'var(--font-ui)',
		  color: 'rgba(255,248,240,0.35)',
		  fontSize: '0.75rem',
		  letterSpacing: '0.06em',
		}}>
		  <p>
			Made with 💕 by <br />
			<span style={{ color: 'var(--pink-light)', fontWeight: 500 }}>
			  Suwilanji Trey Chellah
			</span><br />
			WhatsApp: +260571919051<br />
			Call/SMS: +260971168716
		  </p>

		  {/* Email button */}
		  <a
			href="mailto:Suwilanajichellah0228@gmail.com"
			style={{
			  display: 'inline-flex',
			  alignItems: 'center',
			  gap: 8,
			  background: '#D44638',
			  color: 'white',
			  marginTop: 10,
			  marginBottom: 10,
			}}
		  >
			📧 Email Me
		  </a>
		</div>
      </div>
    </footer>
  )
}
