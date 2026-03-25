// ─── seedFirebase.js ──────────────────────────────────────────────
// ONE-TIME utility: seeds STATIC_PRODUCTS into Firestore, converting
// each product's local /public/images/* path into a base64 string.
//
// HOW TO RUN (in the browser, from your app's dev console, or as a
// standalone script by importing into a temporary React page):
//
//   import { seedFirebase } from './seedFirebase'
//   seedFirebase().then(() => console.log('Done!'))
//
// Or drop a temporary button in any page:
//   <button onClick={seedFirebase}>Seed Firebase</button>
//
// Safe to run multiple times — it checks for existing documents by
// name before inserting, so duplicates won't be created.
// ─────────────────────────────────────────────────────────────────
import { db } from '../firebase/config'
import {
  collection, addDoc, getDocs, query,
  where, serverTimestamp,
} from 'firebase/firestore'
import { STATIC_PRODUCTS } from './products'

const COLLECTION = 'rosabellaProducts'

// ── Image path → base64 ───────────────────────────────────────────
// Fetches the image from /public (same origin), draws it onto a
// canvas, and compresses to WebP or JPEG under 700 KB.

const MAX_DIM   = 1200
const TARGET_KB = 700
const MIN_Q     = 0.20

async function imagePathToBase64(path) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onerror = () => {
      console.warn(`[seed] Could not load ${path} — storing null`)
      resolve(null)
    }
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
      // Fallback to JPEG if WebP encoding is not supported
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

      console.log(`[seed] ${path} → ${Math.round(kb)} KB`)
      resolve(dataUrl)
    }
    // Use the public path directly — works in dev (Vite / CRA serve /public)
    img.src = path
  })
}

function calcKB(dataUrl) {
  const base64  = dataUrl.split(',')[1] || ''
  const padding = (base64.match(/=+$/) || [''])[0].length
  return ((base64.length * 3) / 4 - padding) / 1024
}

// ── Main seed function ────────────────────────────────────────────
export async function seedFirebase(onProgress) {
  const col   = collection(db, COLLECTION)
  const total = STATIC_PRODUCTS.length
  let   done  = 0

  console.log(`[seed] Starting — ${total} products to seed`)
  onProgress?.({ done: 0, total, current: null })

  for (const product of STATIC_PRODUCTS) {
    // Check if a document with this name already exists
    const existing = await getDocs(query(col, where('name', '==', product.name)))
    if (!existing.empty) {
      console.log(`[seed] Skipping "${product.name}" — already in Firestore`)
      done++
      onProgress?.({ done, total, current: product.name, skipped: true })
      continue
    }

    // Convert image to base64
    const imageBase64 = product.image ? await imagePathToBase64(product.image) : null

    // Write to Firestore
    await addDoc(col, {
      name:        product.name,
      category:    product.category,
      price:       product.price,
      description: product.description,
      placeholder: product.placeholder,
      tags:        product.tags,
      inStock:     true,
      imageBase64,
      // Keep the original path as a reference (not used by UI)
      _imagePath:  product.image || null,
      createdAt:   serverTimestamp(),
      updatedAt:   serverTimestamp(),
    })

    done++
    console.log(`[seed] ✓ "${product.name}" seeded (${done}/${total})`)
    onProgress?.({ done, total, current: product.name, skipped: false })
  }

  console.log(`[seed] Complete — ${done} products in Firestore`)
  return done
}

// ── Booking helpers ───────────────────────────────────────────────
// Import and use these in your Booking form component.

export async function saveBooking(formData) {
  return addDoc(collection(db, 'bookings'), {
    ...formData,
    status:    'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}
