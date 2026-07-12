'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'changeme123'

interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  badge: string | null
  image_url: string | null
  video_url: string | null
  created_at: string
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [pwd, setPwd] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '', price: '', category: 'باقات', description: '', badge: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const imgInputRef = useRef<HTMLInputElement>(null)
  const vidInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('lanafleur_admin_authed')
    if (saved === 'true') setAuthed(true)
    setCheckingAuth(false)
  }, [])

  useEffect(() => { if (authed) fetchProducts() }, [authed])

  async function fetchProducts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setProducts(data || [])
    setLoading(false)
  }

  function handleLogin() {
    if (pwd === ADMIN_PASSWORD) {
      setAuthed(true)
      localStorage.setItem('lanafleur_admin_authed', 'true')
    } else {
      setError('كلمة السر خاطئة')
    }
  }

  function handleLogout() {
    localStorage.removeItem('lanafleur_admin_authed')
    setAuthed(false)
  }

  async function uploadFile(file: File, bucket: string): Promise<string | null> {
    const ext = file.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)
    if (uploadError) {
      setError(uploadError.message)
      return null
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
    return data.publicUrl
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.price) {
      setError('الاسم والسعر إجباريين')
      return
    }
    setUploading(true)
    setError('')

    let image_url: string | null = null
    let video_url: string | null = null

    if (imageFile) {
      image_url = await uploadFile(imageFile, 'product-images')
      if (!image_url) { setUploading(false); return }
    }
    if (videoFile) {
      video_url = await uploadFile(videoFile, 'product-videos')
      if (!video_url) { setUploading(false); return }
    }

    const { error: insertError } = await supabase.from('products').insert({
      name: form.name,
      price: parseFloat(form.price),
      category: form.category,
      description: form.description,
      badge: form.badge || null,
      image_url,
      video_url
    })

    if (insertError) {
      setError(insertError.message)
    } else {
      setForm({ name: '', price: '', category: 'باقات', description: '', badge: '' })
      setImageFile(null)
      setVideoFile(null)
      if (imgInputRef.current) imgInputRef.current.value = ''
      if (vidInputRef.current) vidInputRef.current.value = ''
      fetchProducts()
    }
    setUploading(false)
  }

  async function handleDeleteProduct(product: Product) {
    if (!confirm(`متأكد باغي تحذف "${product.name}"؟`)) return

    if (product.image_url) {
      const path = product.image_url.split('/').pop()
      if (path) await supabase.storage.from('product-images').remove([path])
    }
    if (product.video_url) {
      const path = product.video_url.split('/').pop()
      if (path) await supabase.storage.from('product-videos').remove([path])
    }

    const { error } = await supabase.from('products').delete().eq('id', product.id)
    if (error) setError(error.message)
    else fetchProducts()
  }

  async function handleReplaceImage(product: Product, file: File) {
    const url = await uploadFile(file, 'product-images')
    if (!url) return
    if (product.image_url) {
      const oldPath = product.image_url.split('/').pop()
      if (oldPath) await supabase.storage.from('product-images').remove([oldPath])
    }
    await supabase.from('products').update({ image_url: url }).eq('id', product.id)
    fetchProducts()
  }

  if (checkingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF6F1' }}>
        <p style={{ color: '#8FAF8A', fontSize: '18px' }}>جاري التحميل...</p>
      </div>
    )
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF6F1', direction: 'rtl', colorScheme: 'light' }}>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '320px', color: '#333' }}>
          <h1 style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: '28px', color: '#8FAF8A', marginBottom: '24px', textAlign: 'center' }}>
            LanaFleur Admin
          </h1>
          <input
            type="password"
            placeholder="كلمة السر"
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '12px', border: '1px solid #E8C5C0', borderRadius: '8px', marginBottom: '12px', fontSize: '16px', boxSizing: 'border-box', color: '#333', backgroundColor: 'white' }}
          />
          {error && <p style={{ color: '#c0392b', fontSize: '14px', marginBottom: '12px' }}>{error}</p>}
          <button
            onClick={handleLogin}
            style={{ width: '100%', padding: '12px', backgroundColor: '#8FAF8A', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}
          >
            دخول
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF6F1', direction: 'rtl', padding: '24px', fontFamily: 'sans-serif', color: '#333', colorScheme: 'light' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: '32px', color: '#8FAF8A', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>🌸 لوحة تحكم LanaFleur</span>
          <button
            onClick={handleLogout}
            style={{ fontSize: '13px', fontFamily: 'sans-serif', fontStyle: 'normal', color: '#c0392b', backgroundColor: 'transparent', border: '1px solid #c0392b', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}
          >
            تسجيل الخروج
          </button>
        </h1>

        {error && (
          <div style={{ backgroundColor: '#fde8e8', color: '#c0392b', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAddProduct} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', marginBottom: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#333' }}>➕ إضافة منتج جديد</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <input
              placeholder="اسم الباقة"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="السعر (درهم)"
              type="number"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
              <option>باقات</option>
              <option>أعراس</option>
              <option>هدايا</option>
              <option>توصيل</option>
            </select>
            <select value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} style={inputStyle}>
              <option value="">بدون badge</option>
              <option value="Bestseller">Bestseller</option>
              <option value="Nouveau">Nouveau</option>
            </select>
          </div>

          <textarea
            placeholder="الوصف"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ ...inputStyle, width: '100%', minHeight: '80px', marginBottom: '12px', boxSizing: 'border-box' }}
          />

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#666' }}>📷 صورة المنتج</label>
            <input ref={imgInputRef} type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#666' }}>🎥 فيديو (اختياري)</label>
            <input ref={vidInputRef} type="file" accept="video/*" onChange={e => setVideoFile(e.target.files?.[0] || null)} />
          </div>

          <button
            type="submit"
            disabled={uploading}
            style={{ padding: '12px 32px', backgroundColor: uploading ? '#ccc' : '#8FAF8A', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: uploading ? 'not-allowed' : 'pointer' }}
          >
            {uploading ? 'جاري الرفع...' : 'حفظ المنتج'}
          </button>
        </form>

        <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#333' }}>📦 المنتجات ({products.length})</h2>

        {loading ? (
          <p>جاري التحميل...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {products.map(p => (
              <div key={p.id} style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                {p.image_url && (
                  <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                )}
                {p.video_url && (
                  <video src={p.video_url} controls style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                )}
                <div style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <strong style={{ fontSize: '15px', color: '#333' }}>{p.name}</strong>
                    {p.badge && (
                      <span style={{ fontSize: '11px', backgroundColor: '#E8C5C0', color: '#333', padding: '2px 8px', borderRadius: '10px' }}>
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: '#666', margin: '4px 0' }}>{p.category} — {p.price} DH</p>

                  <label style={{ fontSize: '12px', color: '#8FAF8A', cursor: 'pointer', display: 'block', marginTop: '8px' }}>
                    🔄 تبديل الصورة
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const f = e.target.files?.[0]
                        if (f) handleReplaceImage(p, f)
                      }}
                    />
                  </label>

                  <button
                    onClick={() => handleDeleteProduct(p)}
                    style={{ marginTop: '8px', width: '100%', padding: '8px', backgroundColor: '#fde8e8', color: '#c0392b', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
                  >
                    🗑️ حذف المنتج
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  border: '1px solid #E8C5C0',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#333',
  backgroundColor: 'white',
  colorScheme: 'light',
}