import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'

const Home = lazy(() => import('./pages/Home'))
const Catalog = lazy(() => import('./pages/Catalog'))
const Events = lazy(() => import('./pages/Events'))
const Booking = lazy(() => import('./pages/Booking'))
const Admin = lazy(() => import('./pages/admin/Admin'))
//const SeedPage = lazy(() => import('./pages/admin/SeedPage'))

function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', color: 'var(--pink)', fontFamily: 'var(--font-display)',
      fontSize: '1.5rem', letterSpacing: '0.05em'
    }}>
      ✦
    </div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/admin/*" element={
            <Suspense fallback={<PageLoader />}>
              <Admin />
            </Suspense>
          } />
          
          <Route path="*" element={
            <>
              <Header />
              <CartDrawer />
              <main style={{ flex: 1 }}>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/booking" element={<Booking />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </CartProvider>
  )
}
