import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend'; // استيراد الـ Backend


i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: typeof window !== 'undefined' && localStorage.getItem('preferredLanguage') || 'en', // استعادة اللغة المخزنة
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    interpolation: {
      escapeValue: false,
    },
    // إضافة هذه الخاصية
    keySeparator: false, // لا تستخدم فواصل للمفاتيح
    returnObjects: true, // السماح بإرجاع كائنات
    // جعل المفاتيح غير حساسة لحالة الأحرف
    compatibilityJSON: 'v3', // إذا كان هناك حاجة لمزيد من التوافق
    lng: 'en',
    initImmediate: false,
    // تعديل طريقة التعامل مع المفاتيح
    parse: (key) => key.toLowerCase(), // تحويل المفاتيح إلى حروف صغيرة
  });

export default i18n;
