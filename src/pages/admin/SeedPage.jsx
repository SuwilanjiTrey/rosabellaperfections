// ─── SeedPage.jsx ─────────────────────────────────────────────────
// Mount this temporarily at /admin/seed to run the one-time seed.
// Remove or restrict behind auth once done.
//
//   <Route path="/admin/seed" element={<SeedPage />} />
// ─────────────────────────────────────────────────────────────────
import React, { useState } from 'react'
import { seedFirebase } from '../../data/seedFirebase'

export default function SeedPage() {
  const [status,   setStatus]   = useState('idle')   // idle | running | done | error
  const [progress, setProgress] = useState(null)
  const [log,      setLog]      = useState([])

  const handleSeed = async () => {
    setStatus('running')
    setLog([])
    try {
      await seedFirebase((p) => {
        setProgress(p)
        setLog(prev => [
          ...prev,
          p.skipped
            ? `⏭  Skipped: "${p.current}" (already exists)`
            : `✓  Seeded: "${p.current}" (${p.done}/${p.total})`,
        ])
      })
      setStatus('done')
    } catch (e) {
      console.error(e)
      setStatus('error')
      setLog(prev => [...prev, `✗ Error: ${e.message}`])
    }
  }

  const pct = progress ? Math.round((progress.done / progress.total) * 100) : 0

  return (
    <div style={{
      minHeight: '100svh', background: 'var(--cream)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        width: '100%', maxWidth: 520,
        background: 'var(--white)', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--pink), var(--pink-light))',
          padding: '28px 28px 20px',
        }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 500, color: 'white', marginBottom: 4 }}>
            🌸 Firebase Seed
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
            One-time migration of static products → Firestore
          </p>
        </div>

        <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Info */}
          <div style={{
            background: 'rgba(255,20,147,0.04)', borderRadius: 'var(--radius-md)',
            padding: '14px 16px', border: '1px solid var(--pink-pale)',
          }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-mid)', lineHeight: 1.6 }}>
              This will upload all static products to Firestore, converting their
              <code style={{ background: 'var(--cream-dark)', padding: '1px 5px', borderRadius: 3, fontSize: '0.8rem' }}>/public/images/*</code>
              {' '}paths into compressed <strong>WebP base64</strong> strings stored directly in each document.
              Existing products (matched by name) are skipped automatically.
            </p>
          </div>

          {/* Progress bar */}
          {status === 'running' && progress && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--text-mid)' }}>
                  {progress.done} / {progress.total} products
                </span>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--pink)' }}>
                  {pct}%
                </span>
              </div>
              <div style={{ background: 'var(--cream-dark)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', background: 'var(--pink)',
                  width: `${pct}%`, transition: 'width 0.4s ease',
                  borderRadius: 4,
                }} />
              </div>
            </div>
          )}

          {/* Done / error message */}
          {status === 'done' && (
            <div style={{
              background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 'var(--radius-md)', padding: '12px 16px',
              fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: '#16a34a',
            }}>
              ✓ Seed complete — {progress?.total} products in Firestore. You can remove this page now.
            </div>
          )}
          {status === 'error' && (
            <div style={{
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--radius-md)', padding: '12px 16px',
              fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: '#dc2626',
            }}>
              ✗ Seed failed — check the log below and your Firebase config.
            </div>
          )}

          {/* Action button */}
          <button
            onClick={handleSeed}
            disabled={status === 'running' || status === 'done'}
            style={{
              background: status === 'done' ? '#22c55e' : status === 'running' ? 'var(--rose-gold)' : 'var(--pink)',
              color: 'white', fontFamily: 'var(--font-ui)', fontSize: '0.85rem',
              fontWeight: 600, letterSpacing: '0.06em',
              padding: '14px', borderRadius: 'var(--radius-full)',
              cursor: status === 'running' || status === 'done' ? 'default' : 'pointer',
              boxShadow: '0 4px 16px rgba(255,20,147,0.3)',
              transition: 'background 0.3s',
            }}
          >
            {status === 'idle'    && '🌸 Run Seed Now'}
            {status === 'running' && `Seeding… ${pct}%`}
            {status === 'done'    && '✓ Seed Complete'}
            {status === 'error'   && '↺ Retry'}
          </button>

          {/* Log */}
          {log.length > 0 && (
            <div style={{
              background: 'var(--cream)', borderRadius: 'var(--radius-sm)',
              padding: '12px 14px', maxHeight: 220, overflowY: 'auto',
            }}>
              {log.map((line, i) => (
                <p key={i} style={{
                  fontFamily: 'monospace', fontSize: '0.78rem',
                  color: line.startsWith('✗') ? '#dc2626' : line.startsWith('⏭') ? 'var(--text-light)' : 'var(--text-mid)',
                  margin: '2px 0', lineHeight: 1.4,
                }}>
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
