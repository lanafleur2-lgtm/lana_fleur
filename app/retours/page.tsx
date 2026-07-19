export default function RetoursPage() {
  return (
    <div dir="rtl" style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px', fontFamily: 'sans-serif', color: '#2C2420', lineHeight: 1.8, colorScheme: 'light' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 36, marginBottom: 24 }}>سياسة الإرجاع والاستبدال</h1>

      <p style={{ backgroundColor: '#FFF3E0', padding: 16, borderRadius: 8, marginBottom: 24 }}>
        ⚠️ نظراً لطبيعة منتجاتنا (زهور طازجة)، سياسة الإرجاع محدودة مقارنة بالمنتجات العادية.
      </p>

      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12 }}>✅ متى نقبل الاستبدال/التعويض</h2>
      <ul style={{ paddingRight: 20 }}>
        <li>إذا وصلت الباقة تالفة أو ذابلة بشكل واضح</li>
        <li>إذا كان المنتج المستلم مختلف تماماً عما تم طلبه</li>
        <li>إذا لم يتم التوصيل في الوقت المتفق عليه بشكل كامل</li>
      </ul>

      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12 }}>⏰ المدة</h2>
      <p>يجب التبليغ عن أي مشكل خلال 2 إلى 4 ساعات من استلام الطلب، مع إرفاق صورة توضح المشكل عبر واتساب.</p>

      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12 }}>❌ حالات لا نقبل فيها الإرجاع</h2>
      <ul style={{ paddingRight: 20 }}>
        <li>تغيير الرأي بعد التوصيل الناجح</li>
        <li>سوء التخزين من طرف العميل بعد الاستلام</li>
        <li>الطلبات المخصصة حسب الطلب (custom) بعد الموافقة على التصميم</li>
      </ul>

      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12 }}>💬 كيفاش تطلب استبدال</h2>
      <p>تواصل معنا مباشرة عبر <a href="https://wa.me/212668440978" style={{ color: '#8FAF8A' }}>واتساب</a> مع صورة المنتج ورقم الطلب، وسنتكفل بحل المشكل في أقرب وقت.</p>
    </div>
  )
}