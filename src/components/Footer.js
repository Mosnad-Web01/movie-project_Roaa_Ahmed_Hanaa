"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const Footer = () => {
  const [buildInfo, setBuildInfo] = useState(null);

  useEffect(() => {
    fetch('/api/buildinfo')
      .then(res => res.json())
      .then(data => setBuildInfo(data));
  }, []);

  return (
    <footer className="bg-blue-900 text-white py-6 text-center">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-6">
          {/* استخدام الشعار */}
          <Link href="/">
            <Image
              src="/images/logo.svg"
              alt="Site Logo"
              width={150}
              height={50}
            />
          </Link>
        </div>

        {/* التخطيط الشبكي لعرض القوائم بجانب بعضها */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 text-left">
          
          {/* القائمة الأولى */}
          <div>
            <h4 className="font-bold mb-2">The Basics</h4>
            <ul className="space-y-1">
              <li><Link href="/about" className="hover:underline">About TMDB</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
              <li><Link href="/support-forums" className="hover:underline">Support Forums</Link></li>
              <li><Link href="/api" className="hover:underline">API</Link></li>
              <li><Link href="/system-status" className="hover:underline">System Status</Link></li>
            </ul>
          </div>

          {/* القائمة الثانية */}
          <div>
            <h4 className="font-bold mb-2">Get Involved</h4>
            <ul className="space-y-1">
              <li><Link href="/get-involved" className="hover:underline">Get Involved</Link></li>
              <li><Link href="/contribution-bible" className="hover:underline">Contribution Bible</Link></li>
              <li><Link href="/add-new-movie" className="hover:underline">Add New Movie</Link></li>
              <li><Link href="/add-new-tv-show" className="hover:underline">Add New TV Show</Link></li>
            </ul>
          </div>

          {/* القائمة الثالثة */}
          <div>
            <h4 className="font-bold mb-2">Community</h4>
            <ul className="space-y-1">
              <li><Link href="/community" className="hover:underline">Community</Link></li>
              <li><Link href="/guidelines" className="hover:underline">Guidelines</Link></li>
              <li><Link href="/discussions" className="hover:underline">Discussions</Link></li>
              <li><Link href="/leaderboard" className="hover:underline">Leaderboard</Link></li>
            </ul>
          </div>

          {/* القائمة الرابعة */}
          <div>
            <h4 className="font-bold mb-2">Legal</h4>
            <ul className="space-y-1">
              <li><Link href="/legal" className="hover:underline">Legal</Link></li>
              <li><Link href="/terms-of-use" className="hover:underline">Terms of Use</Link></li>
              <li><Link href="/api-terms-of-use" className="hover:underline">API Terms of Use</Link></li>
              <li><Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/dmca-policy" className="hover:underline">DMCA Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* المعلومات الإضافية */}
        <div className="mt-6">
          {buildInfo && (
            <span className="text-xs">
              Build {buildInfo.build} ({buildInfo.commit})
            </span>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
