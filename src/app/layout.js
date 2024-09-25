// src/app/layout.js
import { headers } from 'next/headers'; // Import headers from next/headers
import { metadata } from './metadata'; // استيراد البيانات الوصفية
import localFont from "next/font/local";
import "./globals.css";
import Navbar from '../components/Navbar'; 
import Footer from '@/components/Footer';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Define the RootLayout as an async function to use async operations like fetching headers
export default async function RootLayout({ children }) {
  // Get headers from the request context
  const headersList = headers();
  // Extract the 'accept-language' header to determine the locale
  const locale = headersList.get('accept-language')?.split(',')[0] || 'en';

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
