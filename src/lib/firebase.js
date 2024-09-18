// src/lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// إعدادات Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// إعداد المصادقة
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// وظيفة تسجيل الدخول باستخدام Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log('User Info:', user);
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// وظيفة تسجيل الخروج
export const signOut = async () => {
  try {
    await firebaseSignOut(auth); // استخدام دالة تسجيل الخروج من Firebase
    console.log('User signed out');
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

// تهيئة Firestore
const db = getFirestore(app);

// تصدير auth و db للتعامل معهما في أجزاء أخرى من المشروع
export { auth, db, provider, signInWithPopup, firebaseSignOut };
