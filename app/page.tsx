// app/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ⚠️ بدل هاد الرقم برقم الواتساب ديالك (صيغة دولية بلا + وبلا صفر البداية)
const WHATSAPP_NUMBER = '212610171350'

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

type Lang = 'fr' | 'ar' | 'en' | 'es'

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  fr: {
    'nav.services': 'Services', 'nav.collections': 'Collections', 'nav.occasions': 'Occasions',
    'nav.about': 'Notre Histoire', 'nav.order': 'Commander',
    'hero.eyebrow': 'Art Floral — Casablanca',
    'hero.desc': "Bouquets sur mesure, décoration de mariages et événements, cadeaux floraux — créés avec passion à Casablanca.",
    'hero.cta1': 'Passer une commande', 'hero.cta2': 'Voir les collections →', 'hero.badge': 'Créations livrées',
    'services.label': 'Ce que nous offrons', 'services.title': 'Nos services floraux',
    's1.name': 'Bouquets & Compositions', 's1.desc': 'Créations florales personnalisées pour toutes les occasions.',
    's2.name': 'Mariages & Fiançailles', 's2.desc': 'Décoration florale complète pour votre grand jour.',
    's3.name': 'Cadeaux Floraux', 's3.desc': 'Coffrets cadeaux et arrangements originaux.',
    's4.name': 'Livraison à Domicile', 's4.desc': 'Livraison rapide et soignée. Commandez en ligne ou via WhatsApp.',
    'collections.label': 'Nos créations', 'collections.title': 'Collections du moment',
    'cat.all': 'Tout', 'cat.baqat': 'Bouquets', 'cat.aaras': 'Mariages', 'cat.hadaya': 'Cadeaux', 'cat.tawsil': 'Livraison',
    'order.btn': 'Commander',
    'about.label': 'Notre histoire', 'about.title': "Née d'une passion pour la beauté naturelle",
    'about.text': "Lana Fleur est née d'un rêve simple : transformer les fleurs en émotions. Basée à Casablanca, notre boutique florale crée des arrangements uniques qui racontent votre histoire.",
    'about.stat1': 'Créations livrées', 'about.stat2': "Années d'expérience", 'about.stat3': 'Clients satisfaits',
    'occasions.label': 'Pour chaque moment', 'occasions.title': 'Toutes les occasions',
    'occ1.name': 'Mariage & Fiançailles', 'occ1.desc': 'Bouquets de mariée, arches florales, centres de table.',
    'occ2.name': 'Anniversaires', 'occ2.desc': 'Surprenez vos proches avec un bouquet personnalisé.',
    'occ3.name': "Événements d'entreprise", 'occ3.desc': 'Décoration florale professionnelle pour vos événements.',
    'occ4.name': 'Cadeaux & Hommages', 'occ4.desc': "Offrez de l'amour sous forme de fleurs.",
    'testimonials.label': "Ce qu'ils disent", 'testimonials.title': 'Avis de nos clients',
    'contact.label': 'Commandez maintenant', 'contact.title': 'Parlons de votre projet floral',
    'contact.sub': 'Décrivez-nous votre vision et nous créerons quelque chose d\'unique. Réponse sous 2h.',
    'contact.addr': 'Casablanca, Maroc', 'contact.wa': 'WhatsApp disponible 7j/7', 'contact.hours': 'Lun–Sam : 9h00 – 20h00',
    'form.name': 'Votre nom', 'form.occasion': 'La occasion', 'form.msg': 'Décrivez votre vision', 'form.send': 'Envoyer via WhatsApp 🌸',
    'footer.copy': '© 2026 LanaFleur.com — Tous droits réservés',
  },
  ar: {
    'nav.services': 'خدماتنا', 'nav.collections': 'المجموعات', 'nav.occasions': 'المناسبات',
    'nav.about': 'قصتنا', 'nav.order': 'اطلب الآن',
    'hero.eyebrow': 'فن الأزهار — المغرب',
    'hero.desc': 'باقات مخصصة، تزيين الأعراس والمناسبات، هدايا زهرية — مصنوعة بشغف.',
    'hero.cta1': 'اطلب الآن', 'hero.cta2': 'اكتشف المجموعات ←', 'hero.badge': 'تصميم تم توصيله',
    'services.label': 'ما نقدمه', 'services.title': 'خدماتنا الزهرية',
    's1.name': 'باقات وتنسيقات', 's1.desc': 'تصاميم زهرية مخصصة لكل المناسبات.',
    's2.name': 'الأعراس والخطوبة', 's2.desc': 'تزيين زهري كامل ليومك الكبير.',
    's3.name': 'هدايا زهرية', 's3.desc': 'صناديق هدايا وترتيبات أصيلة.',
    's4.name': 'توصيل للمنزل', 's4.desc': 'توصيل سريع وعناية كاملة. اطلب عبر الموقع أو واتساب.',
    'collections.label': 'إبداعاتنا', 'collections.title': 'مجموعات الموسم',
    'cat.all': 'الكل', 'cat.baqat': 'باقات', 'cat.aaras': 'أعراس', 'cat.hadaya': 'هدايا', 'cat.tawsil': 'توصيل',
    'order.btn': 'اطلب',
    'about.label': 'قصتنا', 'about.title': 'وُلدت من شغف بالجمال الطبيعي',
    'about.text': 'LanaFleur وُلدت من حلم بسيط: تحويل الأزهار إلى مشاعر. تبتكر متجرنا تنسيقات فريدة تروي قصتك.',
    'about.stat1': 'تصميم تم توصيله', 'about.stat2': 'سنوات خبرة', 'about.stat3': 'عملاء راضون',
    'occasions.label': 'لكل لحظة', 'occasions.title': 'كل المناسبات',
    'occ1.name': 'زفاف وخطوبة', 'occ1.desc': 'باقات العروس، أقواس زهرية، مراكز الطاولات.',
    'occ2.name': 'أعياد الميلاد', 'occ2.desc': 'فاجئ أحبائك بباقة مخصصة.',
    'occ3.name': 'مناسبات الشركات', 'occ3.desc': 'تزيين زهري احترافي للاجتماعات والمؤتمرات.',
    'occ4.name': 'هدايا وتكريم', 'occ4.desc': 'أهد حبك على شكل أزهار.',
    'testimonials.label': 'ماذا قالوا', 'testimonials.title': 'آراء عملائنا',
    'contact.label': 'اطلب الآن', 'contact.title': 'لنتحدث عن مشروعك الزهري',
    'contact.sub': 'أخبرنا بما تحلم به وسنخلق لك شيئاً لا يُنسى. رد خلال ساعتين.',
    'contact.addr': 'المغرب', 'contact.wa': 'واتساب متاح 7 أيام/7', 'contact.hours': 'الاثنين–السبت: 9:00–20:00',
    'form.name': 'اسمك', 'form.occasion': 'المناسبة', 'form.msg': 'صف ما تريد', 'form.send': 'إرسال عبر واتساب 🌸',
    'footer.copy': '© 2026 LanaFleur.com — جميع الحقوق محفوظة',
  },
  en: {
    'nav.services': 'Services', 'nav.collections': 'Collections', 'nav.occasions': 'Occasions',
    'nav.about': 'Our Story', 'nav.order': 'Order Now',
    'hero.eyebrow': 'Floral Art — Morocco',
    'hero.desc': 'Custom bouquets, wedding and event decoration, floral gifts — crafted with passion.',
    'hero.cta1': 'Place an order', 'hero.cta2': 'Explore collections →', 'hero.badge': 'Creations delivered',
    'services.label': 'What we offer', 'services.title': 'Our floral services',
    's1.name': 'Bouquets & Arrangements', 's1.desc': 'Personalised floral creations for every occasion.',
    's2.name': 'Weddings & Engagements', 's2.desc': 'Full floral decoration for your big day.',
    's3.name': 'Floral Gifts', 's3.desc': 'Gift boxes and original arrangements.',
    's4.name': 'Home Delivery', 's4.desc': 'Fast and careful delivery. Order online or via WhatsApp.',
    'collections.label': 'Our creations', 'collections.title': 'Current collections',
    'cat.all': 'All', 'cat.baqat': 'Bouquets', 'cat.aaras': 'Weddings', 'cat.hadaya': 'Gifts', 'cat.tawsil': 'Delivery',
    'order.btn': 'Order',
    'about.label': 'Our story', 'about.title': 'Born from a passion for natural beauty',
    'about.text': 'Lana Fleur was born from a simple dream: turning flowers into emotions. Our floral boutique creates unique arrangements that tell your story.',
    'about.stat1': 'Creations delivered', 'about.stat2': 'Years of experience', 'about.stat3': 'Happy clients',
    'occasions.label': 'For every moment', 'occasions.title': 'All occasions',
    'occ1.name': 'Weddings & Engagements', 'occ1.desc': 'Bridal bouquets, floral arches, table centrepieces.',
    'occ2.name': 'Birthdays', 'occ2.desc': 'Surprise your loved ones with a personalised bouquet.',
    'occ3.name': 'Corporate Events', 'occ3.desc': 'Professional floral decoration for your events.',
    'occ4.name': 'Gifts & Tributes', 'occ4.desc': 'Give love in the form of flowers.',
    'testimonials.label': 'What they say', 'testimonials.title': 'Client reviews',
    'contact.label': 'Order now', 'contact.title': "Let's talk about your floral project",
    'contact.sub': "Tell us your vision and we'll create something unique. We reply within 2 hours.",
    'contact.addr': 'Morocco', 'contact.wa': 'WhatsApp available 7 days/7', 'contact.hours': 'Mon–Sat: 9am – 8pm',
    'form.name': 'Your name', 'form.occasion': 'Occasion', 'form.msg': 'Describe your vision', 'form.send': 'Send via WhatsApp 🌸',
    'footer.copy': '© 2026 LanaFleur.com — All rights reserved',
  },
  es: {
    'nav.services': 'Servicios', 'nav.collections': 'Colecciones', 'nav.occasions': 'Ocasiones',
    'nav.about': 'Nuestra Historia', 'nav.order': 'Pedir ahora',
    'hero.eyebrow': 'Arte Floral — Marruecos',
    'hero.desc': 'Ramos a medida, decoración de bodas y eventos, regalos florales — creados con pasión.',
    'hero.cta1': 'Hacer un pedido', 'hero.cta2': 'Ver colecciones →', 'hero.badge': 'Creaciones entregadas',
    'services.label': 'Lo que ofrecemos', 'services.title': 'Nuestros servicios florales',
    's1.name': 'Ramos & Composiciones', 's1.desc': 'Creaciones florales personalizadas para todas las ocasiones.',
    's2.name': 'Bodas & Compromisos', 's2.desc': 'Decoración floral completa para tu gran día.',
    's3.name': 'Regalos Florales', 's3.desc': 'Cajas de regalo y arreglos originales.',
    's4.name': 'Entrega a Domicilio', 's4.desc': 'Entrega rápida y cuidadosa. Pide online o por WhatsApp.',
    'collections.label': 'Nuestras creaciones', 'collections.title': 'Colecciones del momento',
    'cat.all': 'Todo', 'cat.baqat': 'Ramos', 'cat.aaras': 'Bodas', 'cat.hadaya': 'Regalos', 'cat.tawsil': 'Entrega',
    'order.btn': 'Pedir',
    'about.label': 'Nuestra historia', 'about.title': 'Nacida de una pasión por la belleza natural',
    'about.text': 'Lana Fleur nació de un sueño simple: convertir flores en emociones. Creamos arreglos únicos que cuentan tu historia.',
    'about.stat1': 'Creaciones entregadas', 'about.stat2': 'Años de experiencia', 'about.stat3': 'Clientes satisfechos',
    'occasions.label': 'Para cada momento', 'occasions.title': 'Todas las ocasiones',
    'occ1.name': 'Bodas & Compromisos', 'occ1.desc': 'Ramos de novia, arcos florales, centros de mesa.',
    'occ2.name': 'Cumpleaños', 'occ2.desc': 'Sorprende a tus seres queridos con un ramo personalizado.',
    'occ3.name': 'Eventos Corporativos', 'occ3.desc': 'Decoración floral profesional para tus eventos.',
    'occ4.name': 'Regalos & Homenajes', 'occ4.desc': 'Regala amor en forma de flores.',
    'testimonials.label': 'Lo que dicen', 'testimonials.title': 'Opiniones de clientes',
    'contact.label': 'Pide ahora', 'contact.title': 'Hablemos de tu proyecto floral',
    'contact.sub': 'Cuéntanos tu visión y crearemos algo único. Respuesta en 2 horas.',
    'contact.addr': 'Marruecos', 'contact.wa': 'WhatsApp disponible 7d/7', 'contact.hours': 'Lun–Sáb: 9h00 – 20h00',
    'form.name': 'Tu nombre', 'form.occasion': 'Ocasión', 'form.msg': 'Describe tu visión', 'form.send': 'Enviar por WhatsApp 🌸',
    'footer.copy': '© 2026 LanaFleur.com — Todos los derechos reservados',
  },
}

const CATS = ['all', 'باقات', 'أعراس', 'هدايا', 'توصيل']
const CAT_KEY: Record<string, string> = { all: 'cat.all', 'باقات': 'cat.baqat', 'أعراس': 'cat.aaras', 'هدايا': 'cat.hadaya', 'توصيل': 'cat.tawsil' }

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('ar')
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [activeCat, setActiveCat] = useState('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [form, setForm] = useState({ name: '', occasion: '', message: '' })

  const isAr = lang === 'ar'
  const t = (key: string) => TRANSLATIONS[lang][key] ?? TRANSLATIONS.fr[key] ?? key

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('lanafleur_lang') as Lang | null
    if (saved) setLang(saved)
    fetchProducts()
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function changeLang(l: Lang) {
    setLang(l)
    localStorage.setItem('lanafleur_lang', l)
  }

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  function submitForm(e: React.FormEvent) {
    e.preventDefault()
    const text = encodeURIComponent(`🌸 ${t('contact.title')}\n${t('form.name')}: ${form.name}\n${t('form.occasion')}: ${form.occasion}\n${form.message}`)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank')
  }

  const filtered = activeCat === 'all' ? products : products.filter(p => p.category === activeCat)

  if (!mounted) return null

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ colorScheme: 'light' }}>
      <style>{`
        :root {
          --petal: #E8C5C0; --petal-d: #C9908A; --petal-l: #F7EDEB;
          --ivory: #FAF6F1; --ivory-d: #F0E9E0; --sage: #8FAF8A; --sage-l: #EAF1E9;
          --charcoal: #2C2420; --mink: #8C7B75; --mink-l: #D4C8C4; --white: #FFFFFF;
        }
        .lf * { box-sizing: border-box; }
        .lf { font-family: 'Jost', system-ui, sans-serif; background: var(--ivory); color: var(--charcoal); font-weight: 300; font-size: 15px; line-height: 1.7; }
        .lf[dir="rtl"] { font-family: 'Cairo', sans-serif; }
        .lf img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .lf-display { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 300; font-style: italic; line-height: 1.05; }
        .lf-heading { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 400; line-height: 1.2; }
        .lf-label { font-size: 10px; font-weight: 500; letter-spacing: .18em; text-transform: uppercase; color: var(--mink); }
        .lf-langbar { position: sticky; top: 0; z-index: 200; display: flex; align-items: center; justify-content: flex-end; gap: 2px; padding: 10px 32px; background: var(--ivory); border-bottom: 1px solid var(--mink-l); }
        .lf-lang-btn { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; color: var(--mink); border: 1px solid transparent; background: none; cursor: pointer; }
        .lf-lang-btn.active { background: var(--petal-l); color: var(--petal-d); border-color: var(--petal); }
        .lf-nav { position: sticky; top: 41px; z-index: 199; display: flex; align-items: center; justify-content: space-between; padding: 18px 40px; background: var(--ivory); border-bottom: 1px solid ${scrolled ? 'var(--mink-l)' : 'transparent'}; }
        .lf-logo { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; font-weight: 300; font-style: italic; color: var(--charcoal); }
        .lf-logo span { color: var(--petal-d); }
        .lf-navlinks { display: flex; gap: 36px; list-style: none; margin: 0; padding: 0; }
        .lf-navlinks button { font-size: 12px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--mink); background: none; border: none; cursor: pointer; }
        .lf-navlinks button:hover { color: var(--charcoal); }
        .lf-cta { background: var(--charcoal); color: var(--white) !important; padding: 10px 24px; border-radius: 2px; font-size: 11px !important; letter-spacing: .14em; }
        .lf-toggle { display: none; flex-direction: column; gap: 5px; padding: 4px; background: none; border: none; cursor: pointer; }
        .lf-toggle span { width: 22px; height: 1.5px; background: var(--charcoal); }
        .lf-mobilemenu { display: none; position: fixed; inset: 0; background: var(--ivory); z-index: 300; flex-direction: column; align-items: center; justify-content: center; gap: 36px; }
        .lf-mobilemenu.open { display: flex; }
        .lf-mobilemenu button { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-style: italic; color: var(--charcoal); background: none; border: none; }
        section.lf-sec { padding: 64px 24px; }
        .lf-container { max-width: 1200px; margin: 0 auto; }
        #hero { min-height: 70vh; display: flex; align-items: center; position: relative; overflow: hidden; padding: 60px 24px; }
        .hero-watermark { position: absolute; top: -60px; left: -20px; font-family: 'Cormorant Garamond', serif; font-size: clamp(180px,35vw,420px); font-style: italic; color: var(--petal-l); line-height: 1; z-index: 0; opacity: .8; }
        .hero-content { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; text-align: center; }
        .hero-eyebrow { display: inline-flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .hero-title { font-size: clamp(38px,7vw,72px); margin-bottom: 20px; color: var(--charcoal); }
        .hero-title em { display: block; color: var(--petal-d); font-style: italic; }
        .hero-desc { color: var(--mink); max-width: 420px; margin: 0 auto 32px; }
        .hero-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .btn-primary { background: var(--charcoal); color: var(--white); padding: 14px 32px; font-size: 11px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; border-radius: 2px; border: none; cursor: pointer; }
        .btn-secondary { color: var(--charcoal); font-size: 11px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; border-bottom: 1px solid var(--charcoal); background: none; border-top:none;border-left:none;border-right:none; cursor: pointer; padding-bottom: 2px; }
        .lf-marquee { background: var(--charcoal); color: var(--white); padding: 14px 0; overflow: hidden; white-space: nowrap; }
        .lf-marquee-inner { display: inline-flex; gap: 40px; animation: lfmarquee 22s linear infinite; }
        @keyframes lfmarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .lf-marquee-item { font-size: 11px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; opacity: .85; }
        #services-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 2px; background: var(--white); }
        .service-card { background: var(--ivory); padding: 32px 24px; }
        .service-icon { font-size: 32px; margin-bottom: 16px; display: block; }
        .service-name { font-size: 20px; margin-bottom: 8px; }
        .service-desc { font-size: 13px; color: var(--mink); }
        #collections { background: var(--white); }
        .cat-filters { display: flex; gap: 8px; justify-content: center; margin-bottom: 32px; flex-wrap: wrap; }
        .cat-btn { padding: 8px 18px; border-radius: 20px; border: 1px solid var(--mink-l); background: var(--white); color: var(--charcoal); font-size: 12px; cursor: pointer; }
        .cat-btn.active { background: var(--sage); color: white; border-color: var(--sage); }
        .products-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
        .product-card { cursor: pointer; }
        .product-img-wrap { aspect-ratio: 3/4; background: var(--petal-l); border-radius: 4px; overflow: hidden; position: relative; margin-bottom: 14px; }
        .product-badge { position: absolute; top: 14px; right: 14px; background: var(--white); color: var(--charcoal); font-size: 9px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; padding: 5px 10px; border-radius: 20px; }
        .product-name { font-size: 19px; margin-bottom: 4px; }
        .product-price { font-size: 13px; color: var(--mink); }
        #about { background: var(--charcoal); color: var(--white); display: grid; grid-template-columns: 1fr 1fr; padding: 0; }
        .about-img { background: var(--petal-l); min-height: 400px; display: flex; align-items: center; justify-content: center; font-size: 100px; }
        .about-content { padding: 48px; display: flex; flex-direction: column; justify-content: center; }
        .about-label { color: var(--petal); margin-bottom: 16px; }
        .about-title { font-size: clamp(30px,4vw,44px); margin-bottom: 20px; }
        .about-text { color: rgba(255,255,255,.65); font-size: 14px; line-height: 1.85; margin-bottom: 28px; }
        .about-stats { display: flex; gap: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,.1); }
        .about-stat-val { font-family: 'Cormorant Garamond',serif; font-size: 36px; color: var(--petal); }
        .about-stat-lbl { font-size: 11px; color: rgba(255,255,255,.45); }
        #occasions { background: var(--petal-l); }
        .occasions-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 2px; }
        .occasion-tile { background: var(--white); padding: 32px; display: flex; gap: 20px; }
        .occasion-num { font-family: 'Cormorant Garamond',serif; font-size: 44px; color: var(--mink-l); width: 44px; flex-shrink: 0; }
        .occasion-name { font-size: 21px; margin-bottom: 8px; }
        .occasion-desc { font-size: 13px; color: var(--mink); }
        #testimonials { background: var(--ivory); }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .testimonial-card { background: var(--white); border: 1px solid var(--mink-l); border-radius: 12px; padding: 28px; }
        .stars { color: var(--petal-d); margin-bottom: 12px; }
        .testimonial-text { font-family: 'Cormorant Garamond',serif; font-size: 16px; font-style: italic; margin-bottom: 16px; }
        .testimonial-author { font-size: 12px; color: var(--mink); }
        #contact-sec { background: var(--charcoal); color: var(--white); }
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
        .contact-title { font-size: clamp(28px,4vw,40px); margin-bottom: 16px; }
        .contact-sub { color: rgba(255,255,255,.55); font-size: 13px; line-height: 1.8; margin-bottom: 28px; }
        .contact-info-line { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,.08); font-size: 13px; color: rgba(255,255,255,.7); }
        .form-control { width: 100%; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.15); border-radius: 4px; padding: 12px 14px; font-size: 14px; color: var(--white); margin-bottom: 12px; box-sizing: border-box; colorScheme: dark; }
        .form-control::placeholder { color: rgba(255,255,255,.35); }
        .btn-submit { width: 100%; background: var(--petal-d); color: var(--white); padding: 14px; font-size: 12px; letter-spacing: .1em; text-transform: uppercase; border: none; border-radius: 4px; cursor: pointer; }
        .lf-footer { background: #1A110E; color: rgba(255,255,255,.45); padding: 32px 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .lf-footer-logo { font-family: 'Cormorant Garamond',serif; font-size: 20px; font-style: italic; color: rgba(255,255,255,.7); }
        .lf-footer-logo span { color: var(--petal); }
        .lf-wa-float { position: fixed; bottom: 24px; right: 24px; width: 54px; height: 54px; background: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 26px; box-shadow: 0 6px 24px rgba(37,211,102,.35); z-index: 999; text-decoration: none; }
        @media(max-width: 900px) {
          #services-grid { grid-template-columns: 1fr 1fr; }
          .products-grid { grid-template-columns: 1fr 1fr; }
          #about { grid-template-columns: 1fr; }
          .contact-grid { grid-template-columns: 1fr; }
          .occasions-grid { grid-template-columns: 1fr; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .lf-navlinks { display: none; }
          .lf-toggle { display: flex; }
        }
        @media(max-width: 500px) {
          .products-grid { grid-template-columns: 1fr; }
          #services-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="lf" dir={isAr ? 'rtl' : 'ltr'}>
        {/* LANG BAR */}
        <div className="lf-langbar">
          {(['fr', 'ar', 'en', 'es'] as Lang[]).map(l => (
            <button key={l} onClick={() => changeLang(l)} className={`lf-lang-btn ${lang === l ? 'active' : ''}`}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* NAV */}
        <nav className="lf-nav">
          <span className="lf-logo">Lana<span>Fleur</span></span>
          <ul className="lf-navlinks">
            <li><button onClick={() => scrollTo('services-sec')}>{t('nav.services')}</button></li>
            <li><button onClick={() => scrollTo('collections')}>{t('nav.collections')}</button></li>
            <li><button onClick={() => scrollTo('occasions')}>{t('nav.occasions')}</button></li>
            <li><button onClick={() => scrollTo('about')}>{t('nav.about')}</button></li>
            <li><button onClick={() => scrollTo('contact-sec')} className="lf-cta">{t('nav.order')}</button></li>
          </ul>
          <button className="lf-toggle" onClick={() => setMobileMenuOpen(true)} aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </nav>

        {/* MOBILE MENU */}
        <div className={`lf-mobilemenu ${mobileMenuOpen ? 'open' : ''}`}>
          <button onClick={() => scrollTo('services-sec')}>{t('nav.services')}</button>
          <button onClick={() => scrollTo('collections')}>{t('nav.collections')}</button>
          <button onClick={() => scrollTo('occasions')}>{t('nav.occasions')}</button>
          <button onClick={() => scrollTo('about')}>{t('nav.about')}</button>
          <button onClick={() => scrollTo('contact-sec')}>{t('nav.order')}</button>
          <button onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 14, marginTop: 20, color: '#999' }}>✕</button>
        </div>

        {/* HERO */}
        <section id="hero">
          <div className="hero-watermark" aria-hidden="true">L</div>
          <div className="hero-content">
            <div className="hero-eyebrow"><span className="lf-label">{t('hero.eyebrow')}</span></div>
            <h1 className="lf-display hero-title">
              {isAr ? <>فن تجميل<br />كل لحظة<br /><em>بالأزهار</em></> :
                lang === 'en' ? <>The art of<br />making every<br /><em>moment bloom</em></> :
                  lang === 'es' ? <>El arte de<br />embellecer<br /><em>cada instante</em></> :
                    <>L'art de<br />sublimer<br /><em>chaque instant</em></>}
            </h1>
            <p className="hero-desc">{t('hero.desc')}</p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => scrollTo('contact-sec')}>{t('hero.cta1')}</button>
              <button className="btn-secondary" onClick={() => scrollTo('collections')}>{t('hero.cta2')}</button>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="lf-marquee">
          <div className="lf-marquee-inner">
            {Array(2).fill(null).map((_, i) => (
              <span key={i} style={{ display: 'inline-flex', gap: 40 }}>
                <span className="lf-marquee-item">✿ {t('cat.baqat')}</span>
                <span className="lf-marquee-item">✿ {t('cat.aaras')}</span>
                <span className="lf-marquee-item">✿ {t('cat.tawsil')}</span>
                <span className="lf-marquee-item">✿ {t('cat.hadaya')}</span>
              </span>
            ))}
          </div>
        </div>

        {/* SERVICES */}
        <section id="services-sec" className="lf-sec">
          <div className="lf-container" style={{ textAlign: 'center', marginBottom: 40 }}>
            <p className="lf-label" style={{ marginBottom: 12 }}>{t('services.label')}</p>
            <h2 className="lf-heading" style={{ fontSize: 'clamp(28px,4vw,42px)' }}>{t('services.title')}</h2>
          </div>
          <div id="services-grid">
            {[
              { icon: '💐', n: 's1' }, { icon: '💍', n: 's2' }, { icon: '🎁', n: 's3' }, { icon: '🚗', n: 's4' },
            ].map(s => (
              <div key={s.n} className="service-card">
                <span className="service-icon">{s.icon}</span>
                <div className="service-name lf-heading">{t(`${s.n}.name`)}</div>
                <p className="service-desc">{t(`${s.n}.desc`)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* COLLECTIONS */}
        <section id="collections" className="lf-sec">
          <div className="lf-container">
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <p className="lf-label" style={{ marginBottom: 12 }}>{t('collections.label')}</p>
              <h2 className="lf-heading" style={{ fontSize: 'clamp(28px,4vw,42px)' }}>{t('collections.title')}</h2>
            </div>
            <div className="cat-filters">
              {CATS.map(c => (
                <button key={c} onClick={() => setActiveCat(c)} className={`cat-btn ${activeCat === c ? 'active' : ''}`}>
                  {t(CAT_KEY[c])}
                </button>
              ))}
            </div>
            <div className="products-grid">
              {filtered.map(p => (
                <div key={p.id} className="product-card">
                  <div className="product-img-wrap">
                    {p.image_url ? <img src={p.image_url} alt={p.name} /> :
                      p.video_url ? <video src={p.video_url} muted loop autoPlay playsInline /> :
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>🌸</div>}
                    {p.badge && <span className="product-badge">{p.badge}</span>}
                  </div>
                  <div className="product-name lf-heading">{p.name}</div>
                  <p className="product-price"><strong style={{ color: 'var(--charcoal)' }}>{p.price} DH</strong></p>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`🌸 ${t('order.btn')}: ${p.name} (${p.price} DH)`)}`}
                    target="_blank"
                    className="btn-secondary"
                    style={{ display: 'inline-block', marginTop: 8 }}
                  >
                    {t('order.btn')} →
                  </a>
                </div>
              ))}
              {filtered.length === 0 && <p style={{ color: 'var(--mink)', gridColumn: '1/-1', textAlign: 'center' }}>...</p>}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about">
          <div className="about-img">🌺</div>
          <div className="about-content">
            <p className="lf-label about-label">{t('about.label')}</p>
            <h2 className="lf-display about-title">{t('about.title')}</h2>
            <p className="about-text">{t('about.text')}</p>
            <div className="about-stats">
              <div><div className="about-stat-val">500+</div><div className="about-stat-lbl">{t('about.stat1')}</div></div>
              <div><div className="about-stat-val">3+</div><div className="about-stat-lbl">{t('about.stat2')}</div></div>
              <div><div className="about-stat-val">98%</div><div className="about-stat-lbl">{t('about.stat3')}</div></div>
            </div>
          </div>
        </section>

        {/* OCCASIONS */}
        <section id="occasions" className="lf-sec">
          <div className="lf-container">
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <p className="lf-label" style={{ marginBottom: 12 }}>{t('occasions.label')}</p>
              <h2 className="lf-heading" style={{ fontSize: 'clamp(28px,4vw,42px)' }}>{t('occasions.title')}</h2>
            </div>
            <div className="occasions-grid">
              {['occ1', 'occ2', 'occ3', 'occ4'].map((o, i) => (
                <div key={o} className="occasion-tile">
                  <div className="occasion-num">{String(i + 1).padStart(2, '0')}</div>
                  <div>
                    <div className="occasion-name lf-heading">{t(`${o}.name`)}</div>
                    <p className="occasion-desc">{t(`${o}.desc`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="lf-sec">
          <div className="lf-container">
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <p className="lf-label" style={{ marginBottom: 12 }}>{t('testimonials.label')}</p>
              <h2 className="lf-heading" style={{ fontSize: 'clamp(28px,4vw,42px)' }}>{t('testimonials.title')}</h2>
            </div>
            <div className="testimonials-grid">
              {[
                { name: 'سارة', text: 'باقة العرس ديالي كانت رائعة، فاقت التوقعات!' },
                { name: 'يوسف', text: 'توصيل سريع وجودة عالية، شكراً LanaFleur' },
                { name: 'خديجة', text: 'أحسن متجر ورد جربتو، خدمة زوينة بزاف' },
              ].map(tst => (
                <div key={tst.name} className="testimonial-card">
                  <div className="stars">★★★★★</div>
                  <p className="testimonial-text">"{tst.text}"</p>
                  <div className="testimonial-author">— {tst.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact-sec" className="lf-sec">
          <div className="lf-container contact-grid">
            <div>
              <p className="lf-label" style={{ color: 'var(--petal)', marginBottom: 14 }}>{t('contact.label')}</p>
              <h2 className="lf-display contact-title">{t('contact.title')}</h2>
              <p className="contact-sub">{t('contact.sub')}</p>
              <div className="contact-info-line"><span>📍</span><span>{t('contact.addr')}</span></div>
              <div className="contact-info-line"><span>💬</span><span>{t('contact.wa')}</span></div>
              <div className="contact-info-line"><span>🕐</span><span>{t('contact.hours')}</span></div>
            </div>
            <form onSubmit={submitForm}>
              <input className="form-control" placeholder={t('form.name')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={{ colorScheme: 'dark' }} />
              <input className="form-control" placeholder={t('form.occasion')} value={form.occasion} onChange={e => setForm({ ...form, occasion: e.target.value })} style={{ colorScheme: 'dark' }} />
              <textarea className="form-control" placeholder={t('form.msg')} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ minHeight: 90, colorScheme: 'dark' }} />
              <button type="submit" className="btn-submit">{t('form.send')}</button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="lf-footer">
          <div className="lf-footer-logo">Lana<span>Fleur</span></div>
          <div className="lf-footer-logo" style={{ fontSize: 11, opacity: .7 }}>{t('footer.copy')}</div>
        </footer>

        {/* WHATSAPP FLOAT */}
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="lf-wa-float">💬</a>
      </div>
    </div>
  )
}