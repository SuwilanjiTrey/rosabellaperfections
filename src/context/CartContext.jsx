import React, { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = useCallback((product, quantity = 1, note = '') => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + quantity, note: note || i.note }
            : i
        )
      }
      return [...prev, { ...product, quantity, note }]
    })
  }, [])

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const updateQty = useCallback((id, quantity) => {
    if (quantity < 1) return
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  const sendToWhatsapp = useCallback(() => {
    // 📱 REPLACE WITH ACTUAL WHATSAPP NUMBER (include country code, no +)
    const WHATSAPP_NUMBER = '260978615850'

    const lines = items.map(i =>
      `• ${i.name} x${i.quantity} = K${(i.price * i.quantity).toLocaleString()}${i.note ? ` (Note: ${i.note})` : ''}`
    )

    const message = [
      '🌸 *Order from Rosebella Perfections* 🌸',
      '',
      ...lines,
      '',
      `*Total: K${total.toLocaleString()}*`,
      '',
      'Please confirm my order. Thank you! 💕'
    ].join('\n')

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }, [items, total])

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart,
      total, count, isOpen, setIsOpen, sendToWhatsapp
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
