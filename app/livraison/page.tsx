export default function LivraisonPage() {
  return (
    <div dir="rtl" style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px', fontFamily: 'sans-serif', color: '#F0E8DC', lineHeight: 1.8 }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 36, marginBottom: 24, color: '#F5F0EA' }}>سياسة التوصيل</h1>

      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12, color: '#F5F0EA' }}>📍 المناطق المغطاة</h2>
      <p>نوصل حالياً داخل الدار البيضاء والعيون والمناطق المجاورة. للتأكد من إمكانية التوصيل لمنطقتك، تواصل معنا عبر واتساب قبل الطلب.</p>

      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12, color: '#F5F0EA' }}>💰 أثمنة التوصيل</h2>
      <ul style={{ paddingRight: 20 }}>
        <li>داخل المدينة: مجاني</li>
        <li>الضواحي القريبة: 15 درهم</li>
        <li>توصيل مجاني للطلبات فوق 500 درهم (بغض النظر عن المنطقة)</li>
      </ul>

      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12, color: '#F5F0EA' }}>⏱️ مدة التوصيل</h2>
      <p>الطلبات العادية: خلال 24 إلى 48 ساعة.<br />
      الطلبات المستعجلة (نفس اليوم): متاحة حسب التوفر، تواصل معنا قبل الساعة 6 مساءً.</p>

      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12, color: '#F5F0EA' }}>📦 كيفاش كيتم التوصيل</h2>
      <p>بمجرد تأكيد الطلب عبر واتساب، كنجهزو الباقة ونتواصلو معك لتحديد وقت التوصيل المناسب. التوصيل كيتم من طرف فريقنا مباشرة لضمان جودة المنتج.</p>

      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12, color: '#F5F0EA' }}>❓ عندك سؤال؟</h2>
      <p>تواصل معنا عبر <a href="https://wa.me/212668440978" style={{ color: '#8FAF8A' }}>واتساب</a> أو زور <a href="/contact" style={{ color: '#8FAF8A' }}>صفحة التواصل</a>.</p>
    </div>
  )
}