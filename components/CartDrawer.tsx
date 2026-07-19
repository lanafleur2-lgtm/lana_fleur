'use client'
import { useState } from 'react'
import { useCart } from '../contexts/CartContext'

interface CartDrawerProps {
  isAr: boolean
  whatsappNumber: string
  t: (key: string) => string
}

export default function CartDrawer({ isAr, whatsappNumber, t }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, clearCart, cartTotal, isOpen, closeCart } = useCart()
  const [checkoutMode, setCheckoutMode] = useState(false)
  const [form, setForm] = useState({ name: '', address: '', phone: '' })

  if (!isOpen) return null

  function sendOrder(e: React.FormEvent) {
    e.preventDefault()
    const itemsList = items.map(i => `• ${i.name} x${i.quantity} = ${i.quantity * i.price} DH`).join('\n')
    const text = encodeURIComponent(
      `🌸 ${t('cart.newOrder')}\n\n${itemsList}\n\n${t('cart.total')}: ${cartTotal} DH\n\n${t('form.name')}: ${form.name}\n${t('cart.address')}: ${form.address}\n${t('cart.phone')}: ${form.phone}`
    )
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank')
    clearCart()
    setCheckoutMode(false)
    closeCart()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', justifyContent: isAr ? 'flex-start' : 'flex-end' }}>
      <div onClick={closeCart} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)' }} />
      <div dir={isAr ? 'rtl' : 'ltr'} style={{
        position: 'relative', width: '100%', maxWidth: 420, height: '100%',
        background: 'var(--ivory)', color: 'var(--charcoal)', display: 'flex', flexDirection: 'column',
        boxShadow: '0 0 40px rgba(0,0,0,.3)', fontFamily: isAr ? 'Cairo, sans-serif' : 'Jost, sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--mink-l)' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 26, margin: 0 }}>{t('cart.title')}</h2>
          <button onClick={closeCart} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--charcoal)' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {items.length === 0 ? (
            <p style={{ color: 'var(--mink)', textAlign: 'center', marginTop: 40 }}>{t('cart.empty')}</p>
          ) : !checkoutMode ? (
            items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 6, overflow: 'hidden', background: 'var(--petal-l)', flexShrink: 0 }}>
                  {item.image_url
                    ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🌸</div>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 17 }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--mink)', marginBottom: 6 }}>{item.price} DH</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => updateQuantity(item.id, -1)} style={qtyBtnStyle}>−</button>
                    <span style={{ fontSize: 13, minWidth: 16, textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} style={qtyBtnStyle}>+</button>
                    <button onClick={() => removeFromCart(item.id)} style={{ marginInlineStart: 'auto', background: 'none', border: 'none', color: 'var(--petal-d)', fontSize: 12, cursor: 'pointer' }}>{t('cart.remove')}</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <form onSubmit={sendOrder}>
              <p style={{ fontSize: 13, color: 'var(--mink)', marginBottom: 16 }}>{t('cart.checkoutDesc')}</p>
              <input required placeholder={t('form.name')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              <input required placeholder={t('cart.address')} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={inputStyle} />
              <input required placeholder={t('cart.phone')} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
              <button type="submit" style={{
                width: '100%', background: 'var(--petal-d)', color: '#fff', padding: 14, fontSize: 12,
                letterSpacing: '.1em', textTransform: 'uppercase', border: 'none', borderRadius: 4, cursor: 'pointer', marginTop: 8,
              }}>{t('cart.sendOrder')} 🌸</button>
              <button type="button" onClick={() => setCheckoutMode(false)} style={{ width: '100%', background: 'none', border: 'none', color: 'var(--mink)', fontSize: 12, marginTop: 12, cursor: 'pointer' }}>
                ← {t('cart.back')}
              </button>
            </form>
          )}
        </div>

        {items.length > 0 && !checkoutMode && (
          <div style={{ padding: 24, borderTop: '1px solid var(--mink-l)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 15 }}>
              <span>{t('cart.total')}</span>
              <strong>{cartTotal} DH</strong>
            </div>
            <button onClick={() => setCheckoutMode(true)} style={{
              width: '100%', background: 'var(--charcoal)', color: '#fff', padding: 14, fontSize: 12,
              letterSpacing: '.1em', textTransform: 'uppercase', border: 'none', borderRadius: 4, cursor: 'pointer',
            }}>{t('cart.checkout')}</button>
          </div>
        )}
      </div>
    </div>
  )
}

const qtyBtnStyle: React.CSSProperties = {
  width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--mink-l)',
  background: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1,
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', marginBottom: 12, border: '1px solid var(--mink-l)',
  borderRadius: 4, fontSize: 14, background: '#fff', color: 'var(--charcoal)', boxSizing: 'border-box',
}
