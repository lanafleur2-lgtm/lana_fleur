'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ⚠️ بدل هاد الرقم برقم الواتساب ديالك (بصيغة دولية بلا + وبلا صفر البداية)
const WHATSAPP_NUMBER = '212690838186'

interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  badge: string | null
  image_url: string | null
  video_url: string | null
}

const COLORS = {
  rose: '#E8C5C0',
  ivory: '#FAF6F1',
  sage: '#8FAF8A',
  charcoal: '#333333',
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('الكل')
  const [contactForm, setContactForm] = useState({ name: '', occasion: '', message: '' })

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  const categories = ['الكل', 'باقات', 'أعراس', 'هدايا', 'توصيل']
  const filteredProducts = activeCategory === 'الكل'
    ? products
    : products.filter(p => p.category === activeCategory)

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleWhatsAppSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = encodeURIComponent(
      `مرحبا، اسمي ${contactForm.name}.\nالمناسبة: ${contactForm.occasion}\nالرسالة: ${contactForm.message}`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank')
  }

  return (
    <div style={{ direction: 'rtl', colorScheme: 'light', color: COLORS.charcoal, fontFamily: 'sans-serif', backgroundColor: COLORS.ivory }}>

      {/* ===== NAVBAR ===== */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(250,246,241,0.95)', backdropFilter: 'blur(8px)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${COLORS.rose}` }}>
        <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '24px', color: COLORS.sage }}>LanaFleur 🌸</span>
        <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
          <button onClick={() => scrollTo('collections')} style={navBtn}>المنتجات</button>
          <button onClick={() => scrollTo('contact')} style={navBtn}>تواصل</button>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section style={{ position: 'relative', padding: '80px 24px 60px', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '400px', fontFamily: 'Georgia, serif', color: COLORS.rose, opacity: 0.15, lineHeight: 1, zIndex: 0, pointerEvents: 'none' }}>L</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-block', backgroundColor: 'white', color: COLORS.sage, padding: '6px 16px', borderRadius: '20px', fontSize: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            🌸 500+ créations
          </span>
          <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '44px', color: COLORS.charcoal, marginBottom: '16px', lineHeight: 1.2 }}>
            زهور تحكي<br /><span style={{ color: COLORS.sage }}>قصص المحبة</span>
          </h1>
          <p style={{ fontSize: '15px', color: '#777', maxWidth: '400px', margin: '0 auto 28px' }}>
            باقات مصممة بعناية لكل مناسبة، من قلبنا لقلبك
          </p>
          <button onClick={() => scrollTo('collections')} style={{ backgroundColor: COLORS.sage, color: 'white', border: 'none', padding: '14px 36px', borderRadius: '30px', fontSize: '15px', cursor: 'pointer' }}>
            اكتشف المجموعة
          </button>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div style={{ backgroundColor: COLORS.sage, color: 'white', padding: '10px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-block', animation: 'marquee 20s linear infinite', fontSize: '13px' }}>
          🌸 توصيل سريع &nbsp;&nbsp;•&nbsp;&nbsp; 💐 باقات مخصصة &nbsp;&nbsp;•&nbsp;&nbsp; 💍 أعراس &nbsp;&nbsp;•&nbsp;&nbsp; 🎁 هدايا &nbsp;&nbsp;•&nbsp;&nbsp; 🌸 توصيل سريع &nbsp;&nbsp;•&nbsp;&nbsp; 💐 باقات مخصصة &nbsp;&nbsp;•&nbsp;&nbsp; 💍 أعراس &nbsp;&nbsp;•&nbsp;&nbsp; 🎁 هدايا
        </div>
        <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }`}</style>
      </div>

      {/* ===== SERVICES ===== */}
      <section style={{ padding: '60px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '28px', marginBottom: '40px', color: COLORS.charcoal }}>خدماتنا</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
          {[
            { icon: '💐', title: 'باقات' },
            { icon: '💍', title: 'أعراس' },
            { icon: '🎁', title: 'هدايا' },
            { icon: '🚚', title: 'توصيل' },
          ].map(s => (
            <div key={s.title} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px 16px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{s.icon}</div>
              <p style={{ fontSize: '14px', color: COLORS.charcoal, fontWeight: 500 }}>{s.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== COLLECTIONS ===== */}
      <section id="collections" style={{ padding: '60px 24px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '28px', marginBottom: '24px', color: COLORS.charcoal }}>مجموعتنا</h2>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '20px',
                  border: `1px solid ${COLORS.rose}`,
                  backgroundColor: activeCategory === cat ? COLORS.sage : 'white',
                  color: activeCategory === cat ? 'white' : COLORS.charcoal,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#999' }}>جاري التحميل...</p>
          ) : filteredProducts.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999' }}>لا توجد منتجات فهاد الفئة حالياً</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {filteredProducts.map(p => (
                <div key={p.id} style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', backgroundColor: COLORS.ivory }}>
                  <div style={{ position: 'relative' }}>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                    ) : p.video_url ? (
                      <video src={p.video_url} style={{ width: '100%', height: '200px', objectFit: 'cover' }} muted loop autoPlay playsInline />
                    ) : (
                      <div style={{ width: '100%', height: '200px', backgroundColor: COLORS.rose }} />
                    )}
                    {p.badge && (
                      <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white', color: COLORS.sage, fontSize: '11px', padding: '4px 10px', borderRadius: '12px' }}>
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ fontSize: '16px', color: COLORS.charcoal, marginBottom: '4px' }}>{p.name}</h3>
                    {p.description && <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>{p.description}</p>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '15px', fontWeight: 600, color: COLORS.sage }}>{p.price} DH</span>
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`مرحبا، بغيت نطلب: ${p.name} (${p.price} DH)`)}`}
                        target="_blank"
                        style={{ fontSize: '12px', backgroundColor: COLORS.sage, color: 'white', padding: '6px 14px', borderRadius: '16px', textDecoration: 'none' }}
                      >
                        اطلب
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section style={{ padding: '60px 24px', maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '28px', marginBottom: '16px', color: COLORS.charcoal }}>قصتنا</h2>
        <p style={{ fontSize: '14px', color: '#777', lineHeight: 1.8, marginBottom: '32px' }}>
          LanaFleur ولدات من شغف حقيقي بالورد والجمال. كل باقة كنصاوبوها بحب، بحال هدية كنعطيوها لأحبابنا. حنا هنا باش نحولو كل مناسبة لذكرى لا تنسى.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
          {[{ n: '500+', l: 'باقة' }, { n: '3', l: 'سنوات خبرة' }, { n: '98%', l: 'رضا العملاء' }].map(s => (
            <div key={s.l}>
              <p style={{ fontSize: '24px', fontWeight: 700, color: COLORS.sage }}>{s.n}</p>
              <p style={{ fontSize: '12px', color: '#999' }}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== OCCASIONS ===== */}
      <section style={{ padding: '60px 24px', backgroundColor: 'white' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '28px', marginBottom: '32px', color: COLORS.charcoal }}>لكل مناسبة</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { icon: '💍', t: 'أعراس' },
            { icon: '🎂', t: 'عيد ميلاد' },
            { icon: '🏢', t: 'شركات' },
            { icon: '🎁', t: 'هدايا' },
          ].map(o => (
            <div key={o.t} style={{ backgroundColor: COLORS.ivory, borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{o.icon}</div>
              <p style={{ fontSize: '13px' }}>{o.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section style={{ padding: '60px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '28px', marginBottom: '32px', color: COLORS.charcoal }}>آراء عملائنا</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {[
            { name: 'سارة', text: 'باقة العرس ديالي كانت رائعة، فاقت التوقعات!' },
            { name: 'يوسف', text: 'توصيل سريع وجودة عالية، شكراً LanaFleur' },
            { name: 'خديجة', text: 'أحسن متجر ورد جربتو، خدمة زوينة بزاف' },
          ].map(t => (
            <div key={t.name} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px', lineHeight: 1.6 }}>&quot;{t.text}&quot;</p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: COLORS.sage }}>— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" style={{ padding: '60px 24px', backgroundColor: COLORS.sage, color: 'white' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '28px', marginBottom: '24px' }}>تواصل معنا</h2>
          <form onSubmit={handleWhatsAppSubmit} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', textAlign: 'right' }}>
            <input
              placeholder="اسمك"
              value={contactForm.name}
              onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${COLORS.rose}`, marginBottom: '10px', color: COLORS.charcoal, backgroundColor: 'white', boxSizing: 'border-box', colorScheme: 'light' }}
            />
            <input
              placeholder="المناسبة"
              value={contactForm.occasion}
              onChange={e => setContactForm({ ...contactForm, occasion: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${COLORS.rose}`, marginBottom: '10px', color: COLORS.charcoal, backgroundColor: 'white', boxSizing: 'border-box', colorScheme: 'light' }}
            />
            <textarea
              placeholder="رسالتك"
              value={contactForm.message}
              onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${COLORS.rose}`, marginBottom: '14px', minHeight: '80px', color: COLORS.charcoal, backgroundColor: 'white', boxSizing: 'border-box', colorScheme: 'light' }}
            />
            <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' }}>
              📱 إرسال عبر واتساب
            </button>
          </form>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ padding: '32px 24px', textAlign: 'center', backgroundColor: COLORS.charcoal, color: '#ccc', fontSize: '12px' }}>
        <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '18px', color: 'white', marginBottom: '12px' }}>LanaFleur 🌸</p>
        <p>© 2026 LanaFleur. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  )
}

const navBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#555',
  fontSize: '13px',
  cursor: 'pointer',
}
