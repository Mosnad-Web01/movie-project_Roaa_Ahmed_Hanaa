"use client"; // إضافة هذا السطر في أعلى الملف

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaSearch, FaBell, FaMoon, FaSun } from 'react-icons/fa'; // تأكد من تثبيت react-icons

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  return (
    <nav className={`p-4 flex items-center justify-between bg-white dark:bg-gray-900 text-black dark:text-white`}>
      <div className="flex items-center space-x-6">
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={100} // يمكنك تغيير العرض حسب الحاجة
            height={40} // يمكنك تغيير الارتفاع حسب الحاجة
          />
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link href="/movies">Movies</Link>
          <Link href="/tv-shows">TV Shows</Link>
          <Link href="/people">People</Link>
          <Link href="/more">More</Link>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/login">Log In</Link>
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <FaSearch className="text-xl" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <FaBell className="text-xl" />
        </button>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {darkMode ? <FaSun className="text-xl text-white" /> : <FaMoon className="text-xl text-black" />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
