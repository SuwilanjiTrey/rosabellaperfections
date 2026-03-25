// ─── data/products.js ─────────────────────────────────────────────
// Live Firestore hook + static fallback.
// Static data is shown immediately while Firestore loads so the
// storefront never shows a blank page.
// ─────────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import { db } from '../firebase/config'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'

const COLLECTION = 'rosabellaProducts'

export const CATEGORIES = ['All', 'Cakes', 'Bento Cakes', 'Flowers & Roses', 'Party Packages']

// ── Static fallback ───────────────────────────────────────────────
// Shown instantly while Firestore loads, or if the fetch fails.
// Run seedFirebase.js once to migrate these into Firestore as base64.
export const STATIC_PRODUCTS = [
  { id: 'c1', name: 'Classic Birthday Cake',  category: 'Cakes',          price: 350,  description: 'A beautifully layered vanilla sponge with buttercream roses and gold leaf accents.', tags: ['bestseller'], image: '/images/cakes1.jpeg',          placeholder: '🎂' },
  { id: 'c2', name: 'Chocolate Dream Cake',   category: 'Cakes',          price: 420,  description: 'Rich triple chocolate layers with ganache drip, chocolate shards and edible pearls.', tags: [],            image: '/images/cakes7.jpeg',          placeholder: '🍫' },
  { id: 'c3', name: 'Wedding Tier Cake',      category: 'Cakes',          price: 1200, description: 'Elegant 3-tier wedding cake with fondant florals, gold detailing and custom topper.',  tags: ['premium'],   image: '/images/cakes11.jpeg',         placeholder: '👰' },
  { id: 'b1', name: 'Aesthetic Bento Cake',   category: 'Bento Cakes',    price: 180,  description: 'Adorable single-serve Korean-style bento cake. Perfect for birthdays and gifting.',   tags: ['bestseller','new'], image: '/images/cakes8.jpeg', placeholder: '🍱' },
  { id: 'b2', name: 'Custom Bento Cakes',     category: 'Bento Cakes',    price: 200,  description: 'Custom message bento cake with hand-painted details and ribbon packaging.',            tags: ['new'],       image: '/images/cakes4.jpeg',          placeholder: '💌' },
  { id: 'b3', name: 'Mini Bento Set (3)',     category: 'Bento Cakes',    price: 480,  description: 'Set of three matching mini bento cakes — ideal for small celebrations or gifts.',     tags: [],            image: '/images/cakes9.jpeg',          placeholder: '🎁' },
  { id: 'f1', name: 'Luxury Rose Bouquet',    category: 'Flowers & Roses',price: 280,  description: 'Premium long-stem roses wrapped in craft paper with ribbon and personalised card.',   tags: ['bestseller'], image: '/images/flowers4.jpeg',        placeholder: '🌹' },
  { id: 'f2', name: 'Mixed Bloom Arrangement',category: 'Flowers & Roses',price: 320,  description: "Seasonal mixed flowers including peonies, lilies and baby's breath in a keepsake vase.", tags: [],        image: '/images/flowers7.jpeg',        placeholder: '💐' },
  { id: 'f3', name: 'Forever Rose Box',       category: 'Flowers & Roses',price: 450,  description: 'Preserved roses in an elegant luxury box.',                                             tags: ['premium','new'], image: '/images/flowers2.jpeg',   placeholder: '🌸' },
  { id: 'p1', name: 'Birthday Party Package', category: 'Party Packages', price: 1500, description: 'Full birthday setup: balloon arch, table décor, cake table styling and linen.',        tags: ['premium'],   image: '/images/event_planning3.jpeg', placeholder: '🎉' },
  { id: 'p2', name: 'Baby Shower Package',    category: 'Party Packages', price: 1800, description: 'Sweet baby shower setup with florals, gender reveal elements and dessert table.',       tags: [],            image: '/images/event_planning6.jpeg', placeholder: '👶' },
  { id: 'p3', name: 'Intimate Dinner Setup',  category: 'Party Packages', price: 950,  description: 'Romantic dinner for two with rose petal path, candles and floral centrepiece.',        tags: ['new'],       image: '/images/event_planning7.jpeg', placeholder: '🕯️' },
]

// ── Live Firestore hook ───────────────────────────────────────────
/**
 * useProducts()
 * Returns { products, loading, error, refetch }
 *
 * Firestore documents have:
 *   imageBase64  — compressed WebP base64 string (written by Admin)
 *   image        — optional legacy path (from static seed, kept as fallback)
 */
export function useProducts() {
  const [products, setProducts] = useState(STATIC_PRODUCTS)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  const refetch = async () => {
    setLoading(true)
    try {
      const q    = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      if (data.length > 0) setProducts(data)
    } catch (err) {
      console.warn('[useProducts] Firestore unavailable — showing static fallback:', err.message)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refetch() }, [])

  return { products, loading, error, refetch }
}

// ── Showcase helper ───────────────────────────────────────────────
export function getShowcaseProducts(products) {
  const picks = products.filter(p => p.tags?.includes('bestseller') || p.tags?.includes('new'))
  if (picks.length >= 5) return picks.slice(0, 5)
  const ids    = new Set(picks.map(p => p.id))
  const extras = products.filter(p => !ids.has(p.id))
  return [...picks, ...extras].slice(0, 5)
}

// ── Legacy named exports (keep existing imports working) ──────────
export const SHOWCASE_PRODUCTS = STATIC_PRODUCTS
  .filter(p => p.tags?.includes('bestseller') || p.tags?.includes('new'))
  .slice(0, 5)
