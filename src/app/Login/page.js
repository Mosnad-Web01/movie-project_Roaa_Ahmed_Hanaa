// src/app/Login/page.js
"use client"; 
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // استيراد useRouter من Next.js
import { signInWithGoogle } from '../../lib/firebase'; // تأكد من صحة المسار لـ signInWithGoogle
import { FaGoogle } from 'react-icons/fa'; // أيقونة Google

const LoginPage = () => {
  const [error, setError] = useState('');
  const router = useRouter(); // تهيئة useRouter

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle(); // استدعاء تسجيل الدخول عبر Google باستخدام نافذة منبثقة
      router.push('/'); // إعادة التوجيه إلى الصفحة الرئيسية بعد النجاح
    } catch (error) {
      console.error("Error during sign in: ", error); // تسجيل الخطأ في الـ console للتشخيص
      setError('Failed to sign in with Google.'); // عرض رسالة الخطأ للمستخدم
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Login</h1>
        <button
          onClick={handleSignInWithGoogle}
          className="flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full"
        >
          <FaGoogle className="mr-2" />
          Sign in with Google
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>} {/* عرض رسالة الخطأ إذا حدث خطأ */}
      </div>
    </div>
  );
};

export default LoginPage;
