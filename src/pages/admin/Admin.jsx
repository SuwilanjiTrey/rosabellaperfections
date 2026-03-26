// ─── Admin.jsx ────────────────────────────────────────────────────
// Mobile-first admin panel.
// • Bottom nav with Lucide-react icons (matches app theme)
// • Images stored as base64 in Firestore — no Firebase Storage
// • Product list filterable by category
// • Full CRUD: add / edit / delete products
// • Bookings tab reads from Firestore 'bookings' collection
// ─────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { db, auth } from '../../firebase/config'
import {
  collection, addDoc, getDocs, deleteDoc,
  doc, updateDoc, orderBy, query, serverTimestamp,
} from 'firebase/firestore'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import {
  LayoutGrid, CalendarDays, Settings, LogOut,
  Plus, Pencil, Trash2, RefreshCw, Package,
  CheckCircle2, XCircle, Tag, ChevronDown,
} from 'lucide-react'
import { CATEGORIES } from '../../data/products'

// ── Constants ──────────────────────────────────────────────────────
const COLLECTION = 'rosabellaProducts'
const TAGS = ['bestseller', 'new', 'premium']

// ── Image → base64 helper (same compression logic as useImageProcessor) ─
const MAX_DIM   = 1200
const TARGET_KB = 700
const MIN_Q     = 0.20

function compressToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('FileReader failed'))
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = () => reject(new Error('Image decode failed'))
      img.onload = () => {
        const scale  = Math.min(1, MAX_DIM / Math.max(img.naturalWidth, img.naturalHeight))
        const w      = Math.round(img.naturalWidth  * scale)
        const h      = Math.round(img.naturalHeight * scale)
        const canvas = document.createElement('canvas')
        canvas.width  = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, w, h)

        let quality = 0.85
        let dataUrl = canvas.toDataURL('image/webp', quality)
        let kb      = calcKB(dataUrl)
        while (kb > TARGET_KB && quality > MIN_Q) {
          quality = Math.max(MIN_Q, +(quality - 0.08).toFixed(2))
          dataUrl = canvas.toDataURL('image/webp', quality)
          kb      = calcKB(dataUrl)
        }
        // Fallback to JPEG if WebP not supported (old iOS)
        if (!dataUrl.startsWith('data:image/webp')) {
          quality = 0.85
          dataUrl = canvas.toDataURL('image/jpeg', quality)
          kb      = calcKB(dataUrl)
          while (kb > TARGET_KB && quality > MIN_Q) {
            quality = Math.max(MIN_Q, +(quality - 0.08).toFixed(2))
            dataUrl = canvas.toDataURL('image/jpeg', quality)
            kb      = calcKB(dataUrl)
          }
        }
        resolve(dataUrl)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

function calcKB(dataUrl) {
  const base64  = dataUrl.split(',')[1] || ''
  const padding = (base64.match(/=+$/) || [''])[0].length
  return ((base64.length * 3) / 4 - padding) / 1024
}

// ── Shared UI primitives ──────────────────────────────────────────

function AdminInput({ label, ...props }) {
  return (
    <div>
      {label && (
        <label style={{
          display: 'block', fontFamily: 'var(--font-ui)',
          fontSize: '0.72rem', letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--text-mid)', marginBottom: 6,
        }}>{label}</label>
      )}
      <input
        {...props}
        style={{
          width: '100%', padding: '11px 14px', boxSizing: 'border-box',
          background: 'var(--cream)', border: '1.5px solid var(--cream-deeper)',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-dark)',
          outline: 'none', transition: 'border-color 0.2s',
          WebkitAppearance: 'none',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--pink-light)'}
        onBlur={e  => e.target.style.borderColor = 'var(--cream-deeper)'}
      />
    </div>
  )
}

function Toast({ message }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 80,
        left: '50%',
        transform: `translateX(-50%) translateY(${message ? 0 : 80}px)`,

        background: message ? 'var(--text-dark)' : 'transparent',
        color: 'white',

        padding: '12px 24px',
        borderRadius: 'var(--radius-full)',
        fontFamily: 'var(--font-ui)',
        fontSize: '0.82rem',

        opacity: message ? 1 : 0,
        visibility: message ? 'visible' : 'hidden',

        transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        
        //transition: 'opacity 0.3s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',

        zIndex: 9999,
        whiteSpace: 'nowrap',
        boxShadow: message ? '0 8px 24px rgba(0,0,0,0.2)' : 'none',

        pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  );
}


// ── Login screen ──────────────────────────────────────────────────
function Login() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return }
    setLoading(true); setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--cream)', padding: 20,
    }}>
      <div style={{
        width: '100%', maxWidth: 380,
        background: 'var(--white)', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)', overflow: 'hidden',
      }}>
        {/* Header band */}
        <div style={{
          background: 'linear-gradient(135deg, var(--pink), var(--pink-light))',
          padding: '36px 32px 28px', textAlign: 'center',
        }}>
          <img src="/logo.jpeg" alt="Logo" style={{
            width: 72, height: 72, borderRadius: '50%',
            objectFit: 'contain', background: 'white',
            padding: 5, margin: '0 auto 14px', display: 'block',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 500, color: 'white', marginBottom: 4 }}>
            Admin Panel
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
            Rosebella Perfections
          </p>
        </div>

        <div style={{ padding: '28px 28px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{
              background: 'rgba(255,20,147,0.08)', border: '1px solid var(--pink)',
              borderRadius: 'var(--radius-sm)', padding: '10px 14px',
              fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--pink)',
            }}>{error}</div>
          )}
          <AdminInput label="Email" type="email" value={email}
            onChange={e => setEmail(e.target.value)} placeholder="admin@rosebella.com" />
          <AdminInput label="Password" type="password" value={password}
            onChange={e => setPassword(e.target.value)} placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          <button onClick={handleLogin} disabled={loading} style={{
            background: loading ? 'var(--rose-gold)' : 'var(--pink)',
            color: 'white', fontFamily: 'var(--font-ui)',
            fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.06em',
            padding: '14px', borderRadius: 'var(--radius-full)',
            transition: 'var(--transition)', cursor: loading ? 'wait' : 'pointer',
            marginTop: 4,
          }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Admin shell ──────────────────────────────────────────────
export default function Admin() {
  const [user,        setUser]        = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [products,    setProducts]    = useState([])
  const [bookings,    setBookings]    = useState([])
  const [activeTab,   setActiveTab]   = useState('products')
  const [showForm,    setShowForm]    = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [toast,       setToast]       = useState('')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => { setUser(u); setAuthLoading(false) })
    return unsub
  }, [])

  useEffect(() => { if (user) { fetchProducts(); fetchBookings() } }, [user])

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }, [])

  const fetchProducts = async () => {
    try {
      const q    = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (e) { console.error(e) }
  }

  const fetchBookings = async () => {
    try {
      const q    = query(collection(db, 'rosabellaBookings'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (e) { console.error(e) }
  }

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return
    try {
      await deleteDoc(doc(db, COLLECTION, product.id))
      setProducts(prev => prev.filter(p => p.id !== product.id))
      showToast('Product deleted')
    } catch { showToast('Error deleting product') }
  }

  const openEdit = (product) => {
    setEditProduct(product)
    setShowForm(true)
  }

  const openAdd = () => {
    setEditProduct(null)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditProduct(null)
  }

  const onSaved = () => {
    closeForm()
    fetchProducts()
    showToast(editProduct ? 'Product updated ✓' : 'Product added ✓')
  }

  if (authLoading) return (
    <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
      <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>✦</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (!user) return <Login />

  const NAV_TABS = [
    { id: 'products', label: 'Products',  Icon: LayoutGrid    },
    { id: 'bookings', label: 'Bookings',  Icon: CalendarDays  },
    { id: 'settings', label: 'Settings',  Icon: Settings      },
  ]

  return (
    <div style={{ minHeight: '100svh', background: '#f8f4f0', display: 'flex', flexDirection: 'column', paddingBottom: 64 }}>

      {/* ── Top bar ── */}
      <header style={{
        background: 'var(--white)',
        borderBottom: '1px solid var(--cream-deeper)',
        padding: '0 20px',
        height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 200,
        boxShadow: 'var(--shadow-soft)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.jpeg" alt="logo" style={{
            width: 34, height: 34, borderRadius: '50%',
            objectFit: 'contain', background: 'var(--cream)', padding: 2,
          }} />
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dark)', lineHeight: 1.2 }}>
              Rosebella
            </p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--rose-gold)' }}>
              Admin
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut(auth)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-ui)', fontSize: '0.72rem',
            color: 'var(--text-light)', padding: '7px 14px',
            border: '1px solid var(--cream-deeper)', borderRadius: 'var(--radius-full)',
            background: 'transparent', cursor: 'pointer',
          }}
        >
          <LogOut size={13} />
          <span className="hide-xs">Sign out</span>
        </button>
      </header>

      {/* ── Page content ── */}
      <main style={{ flex: 1, padding: '20px 16px', maxWidth: 720, margin: '0 auto', width: '100%' }}>
        {activeTab === 'products' && (
          <ProductsTab
            products={products}
            onRefresh={fetchProducts}
            onDelete={handleDelete}
            onEdit={openEdit}
            onAdd={openAdd}
            showForm={showForm}
            editProduct={editProduct}
            onClose={closeForm}
            onSaved={onSaved}
            showToast={showToast}
          />
        )}
        {activeTab === 'bookings' && <BookingsTab bookings={bookings} onRefresh={fetchBookings} />}
        {activeTab === 'settings' && <SettingsTab user={user} />}
      </main>

      {/* ── Bottom nav (mobile-first) ── */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 300,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--cream-deeper)',
        display: 'flex',
        height: 64,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
      }}>
        {NAV_TABS.map(({ id, label, Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                flex: 1, border: 'none', background: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 4, padding: '8px 0',
                color: active ? 'var(--pink)' : 'var(--text-light)',
                position: 'relative', transition: 'color 0.2s',
              }}
            >
              {/* Active pill indicator */}
              {active && (
                <span style={{
                  position: 'absolute', top: 0, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 32, height: 3,
                  background: 'var(--pink)',
                  borderRadius: '0 0 4px 4px',
                }} />
              )}
              <Icon size={20} strokeWidth={active ? 2.2 : 1.7} />
              <span style={{
                fontFamily: 'var(--font-ui)', fontSize: '0.6rem',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                fontWeight: active ? 700 : 400,
              }}>
                {label}
              </span>
            </button>
          )
        })}
      </nav>

      <Toast message={toast} />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hide-xs { display: none; }
        @media (min-width: 400px) { .hide-xs { display: inline; } }
      `}</style>
    </div>
  )
}

// ── Products tab ──────────────────────────────────────────────────
function ProductsTab({ products, onRefresh, onDelete, onEdit, onAdd, showForm, editProduct, onClose, onSaved, showToast }) {
  const [filterCat,  setFilterCat]  = useState('All')
  const [filterTag,  setFilterTag]  = useState('all')
  const [search,     setSearch]     = useState('')
  const [showFilter, setShowFilter] = useState(false)

  const ALL_CATS = ['All', ...CATEGORIES.filter(c => c !== 'All')]

  const filtered = products.filter(p => {
    const matchCat    = filterCat === 'All' || p.category === filterCat
    const matchTag    = filterTag === 'all' || p.tags?.includes(filterTag)
    const matchSearch = !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchTag && matchSearch
  })

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 500, color: 'var(--text-dark)', marginBottom: 2 }}>
            Products
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-light)' }}>
            {filtered.length} of {products.length} shown
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onRefresh} style={{
            width: 38, height: 38, borderRadius: '50%',
            border: '1px solid var(--cream-deeper)', background: 'var(--white)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-light)',
          }}>
            <RefreshCw size={15} />
          </button>
          <button onClick={onAdd} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--pink)', color: 'white',
            fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.06em',
            padding: '0 16px', height: 38, borderRadius: 'var(--radius-full)',
            cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,20,147,0.3)',
          }}>
            <Plus size={15} />
            Add
          </button>
        </div>
      </div>

      {/* Search + filter toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '10px 14px', paddingRight: 36,
              background: 'var(--white)', border: '1.5px solid var(--cream-deeper)',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-dark)',
              outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--pink-light)'}
            onBlur={e  => e.target.style.borderColor = 'var(--cream-deeper)'}
          />
        </div>
        <button
          onClick={() => setShowFilter(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '0 14px', height: 42, borderRadius: 'var(--radius-full)',
            border: `1.5px solid ${showFilter ? 'var(--pink)' : 'var(--cream-deeper)'}`,
            background: showFilter ? 'var(--pink-pale)' : 'var(--white)',
            color: showFilter ? 'var(--pink)' : 'var(--text-mid)',
            fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 500,
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <Tag size={13} />
          Filter
          <ChevronDown size={12} style={{ transform: showFilter ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
        </button>
      </div>

      {/* Filter panel */}
      {showFilter && (
        <div style={{
          background: 'var(--white)', borderRadius: 'var(--radius-md)',
          padding: '16px', marginBottom: 14,
          border: '1px solid var(--cream-deeper)',
          display: 'flex', flexDirection: 'column', gap: 14,
          animation: 'slideUp 0.2s ease',
        }}>
          {/* Category filter */}
          <div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-mid)', marginBottom: 8 }}>
              Category
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ALL_CATS.map(cat => (
                <button key={cat} onClick={() => setFilterCat(cat)} style={{
                  padding: '6px 12px', borderRadius: 'var(--radius-full)',
                  border: `1.5px solid ${filterCat === cat ? 'var(--pink)' : 'var(--cream-deeper)'}`,
                  background: filterCat === cat ? 'var(--pink)' : 'transparent',
                  color: filterCat === cat ? 'white' : 'var(--text-mid)',
                  fontFamily: 'var(--font-ui)', fontSize: '0.72rem',
                  cursor: 'pointer', transition: 'var(--transition)',
                }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tag filter */}
          <div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-mid)', marginBottom: 8 }}>
              Tag
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['all', ...TAGS].map(tag => (
                <button key={tag} onClick={() => setFilterTag(tag)} style={{
                  padding: '6px 12px', borderRadius: 'var(--radius-full)',
                  border: `1.5px solid ${filterTag === tag ? 'var(--rose-gold)' : 'var(--cream-deeper)'}`,
                  background: filterTag === tag ? 'var(--rose-gold)' : 'transparent',
                  color: filterTag === tag ? 'white' : 'var(--text-mid)',
                  fontFamily: 'var(--font-ui)', fontSize: '0.72rem', textTransform: 'capitalize',
                  cursor: 'pointer', transition: 'var(--transition)',
                }}>
                  {tag === 'all' ? 'All Tags' : tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product form (inline) */}
      {showForm && (
        <ProductForm
          product={editProduct}
          onClose={onClose}
          onSaved={onSaved}
          showToast={showToast}
        />
      )}

      {/* Product cards */}
      {filtered.length === 0 ? (
        <div style={{
          background: 'var(--white)', borderRadius: 'var(--radius-lg)',
          padding: 48, textAlign: 'center', boxShadow: 'var(--shadow-soft)',
        }}>
          <Package size={40} style={{ color: 'var(--cream-deeper)', margin: '0 auto 12px' }} />
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-mid)', marginBottom: 6 }}>
            {products.length === 0 ? 'No products yet' : 'No matches'}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
            {products.length === 0 ? 'Tap + Add to get started' : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(p => (
            <ProductRow key={p.id} product={p} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Single product row card ───────────────────────────────────────
function ProductRow({ product: p, onEdit, onDelete }) {
  return (
    <div style={{
      background: 'var(--white)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-soft)',
      display: 'flex',
      border: '1px solid var(--cream-deeper)',
    }}>
      {/* Thumbnail */}
      <div style={{
        width: 80, flexShrink: 0,
        background: 'linear-gradient(135deg, var(--pink-pale), var(--cream-dark))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2rem', position: 'relative', overflow: 'hidden',
      }}>
        {p.imageBase64
          ? <img src={p.imageBase64} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span>{p.placeholder || '🎂'}</span>
        }
        <span style={{
          position: 'absolute', top: 4, right: 4,
          width: 8, height: 8, borderRadius: '50%',
          background: p.inStock === false ? '#ef4444' : '#22c55e',
          boxShadow: '0 0 0 2px white',
        }} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, padding: '12px 14px', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: '0.92rem', fontWeight: 500,
              color: 'var(--text-dark)', marginBottom: 2,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {p.name}
            </p>
            <p style={{
              fontFamily: 'var(--font-ui)', fontSize: '0.65rem',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: 'var(--text-light)', marginBottom: 6,
            }}>
              {p.category}
            </p>
          </div>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600,
            color: 'var(--pink)', flexShrink: 0,
          }}>
            K{Number(p.price).toLocaleString()}
          </span>
        </div>

        {/* Tags row */}
        {p.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
            {p.tags.map(t => (
              <span key={t} style={{
                background: 'var(--pink-pale)', color: 'var(--pink)',
                fontFamily: 'var(--font-ui)', fontSize: '0.58rem',
                fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                padding: '2px 8px', borderRadius: 'var(--radius-full)',
              }}>{t}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onEdit(p)} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 12px', borderRadius: 'var(--radius-full)',
            border: '1px solid var(--cream-deeper)', background: 'transparent',
            fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--text-mid)',
            cursor: 'pointer', transition: 'var(--transition)',
          }}>
            <Pencil size={11} /> Edit
          </button>
          <button onClick={() => onDelete(p)} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 12px', borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(239,68,68,0.25)', background: 'transparent',
            fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#ef4444',
            cursor: 'pointer', transition: 'var(--transition)',
          }}>
            <Trash2 size={11} /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Product form ──────────────────────────────────────────────────
function ProductForm({ product, onClose, onSaved, showToast }) {
  const isEdit   = !!product
  const fileRef  = useRef()
  const [form, setForm] = useState({
    name:        product?.name        || '',
    category:    product?.category    || (CATEGORIES.find(c => c !== 'All') || 'Cakes'),
    price:       product?.price       || '',
    description: product?.description || '',
    placeholder: product?.placeholder || '🎂',
    tags:        product?.tags        || [],
    inStock:     product?.inStock     !== false,
    imageBase64: product?.imageBase64 || null,
  })
  const [preview,    setPreview]    = useState(product?.imageBase64 || null)
  const [processing, setProcessing] = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [sizeKB,     setSizeKB]     = useState(null)

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleTag = (tag) =>
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }))

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setProcessing(true)
    try {
      const dataUrl = await compressToBase64(file)
      const kb      = calcKB(dataUrl)
      setPreview(dataUrl)
      setSizeKB(Math.round(kb))
      update('imageBase64', dataUrl)
    } catch (err) {
      showToast('Image processing failed — try another photo')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const handleSave = async () => {
    if (!form.name || !form.price) { showToast('Name and price are required'); return }
    setSaving(true)
    try {
      const data = {
        ...form,
        price:     Number(form.price),
        updatedAt: new Date().toISOString(),
      }
      if (isEdit) {
        await updateDoc(doc(db, COLLECTION, product.id), data)
      } else {
        await addDoc(collection(db, COLLECTION), { ...data, createdAt: serverTimestamp() })
      }
      onSaved()
    } catch (e) {
      console.error(e)
      showToast('Error saving — check your connection')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{
      background: 'var(--white)', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-card)', overflow: 'hidden',
      marginBottom: 20, border: '2px solid var(--pink-pale)',
      animation: 'slideUp 0.25s ease',
    }}>
      {/* Form header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', borderBottom: '1px solid var(--cream-deeper)',
        background: 'var(--cream)',
      }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 500, color: 'var(--text-dark)' }}>
          {isEdit ? 'Edit Product' : 'New Product'}
        </h3>
        <button onClick={onClose} style={{ color: 'var(--text-light)', fontSize: '1.1rem', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Image upload */}
        <div>
          <label style={{
            display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.72rem',
            letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-mid)', marginBottom: 8,
          }}>Product Image</label>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${preview ? 'var(--pink)' : 'var(--cream-deeper)'}`,
              borderRadius: 'var(--radius-md)', height: 180,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', background: 'var(--cream)',
              position: 'relative', overflow: 'hidden', transition: 'border-color 0.2s',
            }}
          >
            {processing ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', animation: 'spin 0.8s linear infinite' }}>⟳</div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: 'var(--text-light)', marginTop: 6 }}>
                  Processing…
                </p>
              </div>
            ) : preview ? (
              <>
                <img src={preview} alt="preview" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                {sizeKB && (
                  <span style={{
                    position: 'absolute', bottom: 8, right: 8,
                    background: 'rgba(0,0,0,0.6)', color: 'white',
                    fontFamily: 'var(--font-ui)', fontSize: '0.6rem',
                    padding: '3px 8px', borderRadius: 4, backdropFilter: 'blur(4px)',
                  }}>
                    WebP · {sizeKB} KB
                  </span>
                )}
                <span style={{
                  position: 'absolute', top: 8, right: 8,
                  background: 'var(--pink)', color: 'white', borderRadius: '50%',
                  width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem',
                }}>✎</span>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>📷</div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                  Tap to choose or take a photo
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: 'var(--rose-gold)', marginTop: 4 }}>
                  Auto-compressed · stored in Firestore
                </p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
        </div>

        <AdminInput label="Product Name *" value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Classic Birthday Cake" />
        <AdminInput label="Price (K) *" type="number" inputMode="decimal" value={form.price} onChange={e => update('price', e.target.value)} placeholder="350" />

        {/* Category */}
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-mid)', marginBottom: 8 }}>
            Category
          </label>
          <select
            value={form.category}
            onChange={e => update('category', e.target.value)}
            style={{
              width: '100%', padding: '11px 14px',
              background: 'var(--cream)', border: '1.5px solid var(--cream-deeper)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-dark)',
              outline: 'none', cursor: 'pointer', appearance: 'none',
            }}
          >
            {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-mid)', marginBottom: 8 }}>
            Description
          </label>
          <textarea
            value={form.description} onChange={e => update('description', e.target.value)}
            rows={3} placeholder="Describe this product…"
            style={{
              width: '100%', boxSizing: 'border-box', padding: '11px 14px',
              background: 'var(--cream)', border: '1.5px solid var(--cream-deeper)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-dark)',
              outline: 'none', resize: 'vertical', lineHeight: 1.5,
            }}
            onFocus={e => e.target.style.borderColor = 'var(--pink-light)'}
            onBlur={e  => e.target.style.borderColor = 'var(--cream-deeper)'}
          />
        </div>

        {/* Emoji placeholder */}
        <AdminInput label="Emoji (fallback)" value={form.placeholder} onChange={e => update('placeholder', e.target.value)} placeholder="🎂" />

        {/* Tags */}
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-mid)', marginBottom: 8 }}>
            Tags
          </label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TAGS.map(tag => {
              const on = form.tags.includes(tag)
              return (
                <button key={tag} type="button" onClick={() => toggleTag(tag)} style={{
                  padding: '7px 14px', borderRadius: 'var(--radius-full)',
                  border: `1.5px solid ${on ? 'var(--pink)' : 'var(--cream-deeper)'}`,
                  background: on ? 'var(--pink)' : 'transparent',
                  color: on ? 'white' : 'var(--text-mid)',
                  fontFamily: 'var(--font-ui)', fontSize: '0.75rem', textTransform: 'capitalize',
                  cursor: 'pointer', transition: 'var(--transition)',
                }}>
                  {on ? `✓ ${tag}` : tag}
                </button>
              )
            })}
          </div>
        </div>

        {/* In-stock toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={() => update('inStock', !form.inStock)}
            style={{
              width: 48, height: 26, borderRadius: 13, flexShrink: 0,
              background: form.inStock ? 'var(--pink)' : 'var(--cream-deeper)',
              position: 'relative', transition: 'background 0.3s', cursor: 'pointer',
              border: 'none',
            }}
          >
            <span style={{
              position: 'absolute', top: 3,
              left: form.inStock ? 26 : 3,
              width: 20, height: 20, borderRadius: '50%', background: 'white',
              transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            }} />
          </button>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-mid)', display: 'flex', alignItems: 'center', gap: 6 }}>
            {form.inStock
              ? <><CheckCircle2 size={14} color="#22c55e" /> In Stock</>
              : <><XCircle     size={14} color="#ef4444" /> Out of Stock</>
            }
          </span>
        </div>

        {/* Save / cancel */}
        <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '12px', borderRadius: 'var(--radius-full)',
            border: '1.5px solid var(--cream-deeper)', background: 'transparent',
            fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--text-mid)',
            cursor: 'pointer',
          }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving || processing} style={{
            flex: 2, padding: '12px', borderRadius: 'var(--radius-full)',
            background: saving ? 'var(--rose-gold)' : 'var(--pink)',
            color: 'white', fontFamily: 'var(--font-ui)', fontSize: '0.82rem',
            fontWeight: 600, letterSpacing: '0.06em',
            cursor: saving || processing ? 'wait' : 'pointer',
            boxShadow: '0 4px 16px rgba(255,20,147,0.3)',
          }}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Pill style for booking detail chips ──────────────────────────
const pillStyle = {
  background: 'var(--cream-dark)',
  color: 'var(--text-mid)',
  fontFamily: 'var(--font-ui)',
  fontSize: '0.68rem',
  padding: '3px 10px',
  borderRadius: 'var(--radius-full)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

// ── Bookings tab ──────────────────────────────────────────────────
function BookingsTab({ bookings, onRefresh }) {
  const STATUS_COLORS = {
    pending:   { bg: 'rgba(245,158,11,0.1)',  color: '#d97706' },
    confirmed: { bg: 'rgba(34,197,94,0.1)',   color: '#16a34a' },
    cancelled: { bg: 'rgba(239,68,68,0.1)',   color: '#dc2626' },
  }

  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'rosabellaBookings', id), { status, updatedAt: new Date().toISOString() })
      onRefresh()
    } catch (e) { console.error(e) }
  }

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 500, color: 'var(--text-dark)', marginBottom: 2 }}>Bookings</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-light)' }}>{bookings.length} total</p>
        </div>
        <button onClick={onRefresh} style={{
          width: 38, height: 38, borderRadius: '50%',
          border: '1px solid var(--cream-deeper)', background: 'var(--white)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--text-light)',
        }}>
          <RefreshCw size={15} />
        </button>
      </div>

      {bookings.length === 0 ? (
        <div style={{
          background: 'var(--white)', borderRadius: 'var(--radius-lg)',
          padding: 48, textAlign: 'center', boxShadow: 'var(--shadow-soft)',
        }}>
          <CalendarDays size={40} style={{ color: 'var(--cream-deeper)', margin: '0 auto 12px' }} />
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-mid)' }}>No bookings yet</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic', marginTop: 4 }}>
            Bookings submitted via the website appear here
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {bookings.map(b => {
            const sc = STATUS_COLORS[b.status] || STATUS_COLORS.pending
            return (
              <div key={b.id} style={{
                background: 'var(--white)', borderRadius: 'var(--radius-md)',
                padding: 16, boxShadow: 'var(--shadow-soft)',
                border: '1px solid var(--cream-deeper)',
              }}>
                {/* Header row: name + status badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-dark)', marginBottom: 2 }}>
                      {b.name || 'Anonymous'}
                    </p>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {b.eventType || 'Event booking'} · {b.eventDate || b.date || '—'}
                    </p>
                  </div>
                  <span style={{
                    background: sc.bg, color: sc.color,
                    fontFamily: 'var(--font-ui)', fontSize: '0.65rem',
                    fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                    padding: '4px 10px', borderRadius: 'var(--radius-full)', flexShrink: 0,
                  }}>
                    {b.status || 'pending'}
                  </span>
                </div>

                {/* Detail pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {b.guestCount && (
                    <span style={pillStyle}>👥 {b.guestCount} guests</span>
                  )}
                  {b.budget && (
                    <span style={pillStyle}>💰 {b.budget}</span>
                  )}
                  {b.servicesLabel && (
                    <span style={{ ...pillStyle, maxWidth: '100%' }}>🛠 {b.servicesLabel}</span>
                  )}
                </div>

                {/* Notes */}
                {b.notes && (
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.83rem',
                    color: 'var(--text-light)', lineHeight: 1.5,
                    marginBottom: 10, fontStyle: 'italic',
                    borderLeft: '3px solid var(--pink-pale)', paddingLeft: 10,
                  }}>
                    {b.notes}
                  </p>
                )}

                {/* Contact links */}
                {(b.phone || b.email) && (
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                    {b.phone && (
                      <a href={`https://wa.me/${b.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                        style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#25D366', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                        💬 {b.phone}
                      </a>
                    )}
                    {b.email && (
                      <a href={`mailto:${b.email}`}
                        style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--pink)', textDecoration: 'none' }}>
                        ✉ {b.email}
                      </a>
                    )}
                  </div>
                )}

                {/* Status actions */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['pending', 'confirmed', 'cancelled'].map(s => (
                    <button key={s} onClick={() => updateStatus(b.id, s)} style={{
                      padding: '5px 12px', borderRadius: 'var(--radius-full)',
                      border: `1px solid ${(b.status || 'pending') === s ? sc.color : 'var(--cream-deeper)'}`,
                      background: (b.status || 'pending') === s ? sc.bg : 'transparent',
                      color: (b.status || 'pending') === s ? sc.color : 'var(--text-light)',
                      fontFamily: 'var(--font-ui)', fontSize: '0.65rem', textTransform: 'capitalize',
                      cursor: 'pointer', fontWeight: (b.status || 'pending') === s ? 700 : 400,
                    }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Settings tab ──────────────────────────────────────────────────
function SettingsTab({ user }) {
  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 500, color: 'var(--text-dark)', marginBottom: 20 }}>
        Settings
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Account card */}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 20, boxShadow: 'var(--shadow-soft)' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--rose-gold)', marginBottom: 10 }}>
            Admin Account
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-mid)', marginBottom: 4 }}>Signed in as</p>
          <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, color: 'var(--pink)' }}>{user.email}</p>
        </div>

        {/* Firebase config card 
        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 20, boxShadow: 'var(--shadow-soft)' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--rose-gold)', marginBottom: 10 }}>
            Firebase
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
            Config in{' '}
            <code style={{ background: 'var(--cream-dark)', padding: '2px 6px', borderRadius: 4, fontSize: '0.8rem', color: 'var(--text-dark)' }}>
              src/firebase/config.js
            </code>
            <br />
            Collection: <code style={{ background: 'var(--cream-dark)', padding: '2px 6px', borderRadius: 4, fontSize: '0.8rem', color: 'var(--text-dark)' }}>rosabellaProducts</code>
          </p>
        </div>
        */}

        {/* Image storage info */}
        <div style={{
          background: 'rgba(255,20,147,0.04)', borderRadius: 'var(--radius-lg)',
          padding: 20, border: '1px solid var(--pink-pale)',
        }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--rose-gold)', marginBottom: 10 }}>
            Image Storage
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
            Images are compressed to WebP and stored as base64 strings directly in Firestore documents.
            Each image is capped at <strong>700 KB</strong> to stay within
            the database's 1 MiB document limit.
          </p>
        </div>

        {/* Sign out */}
        <button onClick={() => signOut(auth)} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '14px', borderRadius: 'var(--radius-full)',
          border: '1.5px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)',
          color: '#dc2626', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 600,
          cursor: 'pointer',
        }}>
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  )
}
