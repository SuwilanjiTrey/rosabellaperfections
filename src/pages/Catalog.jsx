import React, { useState, useMemo } from 'react'
import { useProducts, CATEGORIES } from '../data/products'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'

export default function Catalog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const { count, setIsOpen } = useCart();
  const { products, loading, error } = useProducts();


const filtered = useMemo(() => {
  return products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory

    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())

    return matchCat && matchSearch
  })
}, [products, activeCategory, search])

if (loading) {
  return (
    <div style={{ textAlign: 'center', padding: '120px 0' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>⏳</div>
      <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>
        Loading products...
      </h3>
      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-light)' }}>
        Please wait while we fetch the latest catalog
      </p>
    </div>
  )
}

if (error) {
  return (
    <div style={{ textAlign: 'center', padding: '120px 0' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>⚠️</div>
      <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>
        Failed to load products
      </h3>
      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-light)' }}>
        Showing cached items instead. Please try again later.
      </p>
    </div>
  )
}




  return (
    <div className="page-enter" style={{ paddingTop: 88 }}>
      {/* Page header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--cream-dark) 0%, var(--pink-pale) 100%)',
        padding: 'clamp(40px, 8vw, 72px) 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(255,20,147,0.08) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div className="container" style={{ position: 'relative' }}>
          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: '0.72rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--rose-gold)', marginBottom: 12,
          }}>
            ✦ Shop ✦
          </p>
          <h1 className="section-title" style={{ marginBottom: 12 }}>
            Our Catalog
          </h1>
          <p className="section-subtitle">
            Select your items and send your order directly via WhatsApp
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 20px' }}>
        {/* Sticky controls */}
        <div style={{
          position: 'sticky', top: 76, zIndex: 100,
          background: 'rgba(255,248,240,0.95)',
          backdropFilter: 'blur(12px)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          marginBottom: 32,
          boxShadow: 'var(--shadow-soft)',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              fontSize: '1rem', pointerEvents: 'none',
            }}>🔍</span>
            <input
              type="text"
              placeholder="Search cakes, flowers, parties..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--cream)',
                border: '1.5px solid var(--cream-deeper)',
                borderRadius: 'var(--radius-full)',
                padding: '12px 16px 12px 42px',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text-dark)',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--pink-light)'}
              onBlur={e => e.target.style.borderColor = 'var(--cream-deeper)'}
            />
          </div>

          {/* Category filters */}
          <div style={{
            display: 'flex', gap: 8, overflowX: 'auto',
            paddingBottom: 4,
            scrollbarWidth: 'none',
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  flexShrink: 0,
                  background: activeCategory === cat ? 'var(--pink)' : 'var(--cream-dark)',
                  color: activeCategory === cat ? 'white' : 'var(--text-mid)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  transition: 'var(--transition)',
                  whiteSpace: 'nowrap',
                  boxShadow: activeCategory === cat ? '0 4px 16px rgba(255,20,147,0.25)' : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 24,
          flexWrap: 'wrap', gap: 8,
        }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.9rem',
            color: 'var(--text-light)', fontStyle: 'italic',
          }}>
            {filtered.length} item{filtered.length !== 1 ? 's' : ''} found
          </p>
          {count > 0 && (
            <button
              onClick={() => setIsOpen(true)}
              style={{
                background: 'var(--pink)', color: 'white',
                fontFamily: 'var(--font-ui)', fontSize: '0.78rem',
                fontWeight: 600, letterSpacing: '0.06em',
                padding: '10px 20px',
                borderRadius: 'var(--radius-full)',
                display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(255,20,147,0.3)',
                animation: 'pulse 2s ease infinite',
              }}
            >
              🛒 View Cart ({count})
            </button>
          )}
        </div>

        {/* Products grid */}
        {filtered.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-mid)', marginBottom: 8 }}>
              Nothing found
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-light)', fontStyle: 'italic' }}>
              Try a different search or category
            </p>
          </div>
        )}

        {/* WhatsApp floating CTA */}
        {count > 0 && (
          <div style={{
            position: 'fixed', bottom: 24, left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 500,
          }}>
            <button
              onClick={() => setIsOpen(true)}
              style={{
                background: '#25D366',
                color: 'white',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.85rem',
                fontWeight: 600,
                padding: '14px 28px',
                borderRadius: 'var(--radius-full)',
                display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 8px 32px rgba(37,211,102,0.4)',
                whiteSpace: 'nowrap',
                animation: 'bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              💬 Review & Send Order ({count} item{count !== 1 ? 's' : ''})
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes bounceIn {
          from { transform: translateX(-50%) translateY(80px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
