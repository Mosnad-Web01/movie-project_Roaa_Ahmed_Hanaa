"use client"; 
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaSearch, FaBell, FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';
import NavbarDropdown from './NavbarDropdown'; // استيراد المكون الجديد

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`p-4 flex items-center justify-between bg-gray-900 dark:bg-gray-800 text-gray-200 dark:text-white`}>
      <div className="flex items-center space-x-6">
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={100}
            height={40}
          />
        </Link>
        <div className="hidden md:flex space-x-6">
          <NavbarDropdown
            title="Movies"
            links={[
              { label: 'Popular', href: '/PopularMovies' }, 
              { label: 'Now Playing', href: '/NowPlaying' },  
              { label: 'Upcoming', href: '/UpcomingMovies' },  
              { label: 'Top Rated', href: '/TopRatedMovies' }, 
            ]}
          />
          <NavbarDropdown
            title="TV Shows"
            links={[
              { label: 'Popular', href: '/PopularTVShows' },  
              { label: 'Airing Today', href: '/AiringToday' }, 
              { label: 'On TV', href: '/OnTV' }, 
              { label: 'Top Rated', href: '/TopRatedTVShows' },
            ]}
          />
          <NavbarDropdown
            title="People"
            links={[
              { label: 'Popular People', href: '/PopularPeople' },  // تعديل الرابط
            ]}
          />
        </div>
        <button
          className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={toggleMobileMenu}
        >
          <FaBars className="text-xl" />
        </button>
      </div>
      <div className={`fixed inset-0 bg-white dark:bg-gray-900 z-50 transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
        <div className="flex flex-col items-center p-4 space-y-4 relative">
          <button
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={toggleMobileMenu}
          >
            <FaTimes className="text-xl" />
          </button>
          <NavbarDropdown
            title="Movies"
            links={[
              { label: 'Popular', href: '/PopularMovies' }, 
              { label: 'Now Playing', href: '/NowPlaying' },  
              { label: 'Upcoming', href: '/UpcomingMovies' },  
              { label: 'Top Rated', href: '/TopRatedMovies' }, 
            ]}
          />
          <NavbarDropdown
            title="TV Shows"
            links={[
              { label: 'Popular', href: '/PopularTVShows' },  
              { label: 'Airing Today', href: '/AiringToday' }, 
              { label: 'On TV', href: '/OnTV' }, 
              { label: 'Top Rated', href: '/TopRatedTVShows' },
            ]}
          />
          <NavbarDropdown
            title="People"
            links={[
              { label: 'Popular People', href: '/PopularPeople' },  // تعديل الرابط
            ]}
          />
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
          {darkMode ? <FaSun className="text-xl text-white" /> : <FaMoon className="text-xl text-gray-200 dark:text-white" />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
