// src/components/Navbar.js

"use client"; 
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaSearch, FaBell, FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';
import NavbarDropdown from './NavbarDropdown';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      window.location.href = `/Search?query=${encodeURIComponent(searchInput.trim().toLowerCase())}`;
    }
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
              { label: 'Popular People', href: '/PopularPeople' }, 
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
      <div className={`fixed inset-0 bg-gray-900 dark:bg-gray-800 text-gray-200 dark:text-white z-50 transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
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
              { label: 'Popular People', href: '/PopularPeople' }, 
            ]}
          />
        </div>
      </div>
      <div className="flex items-center space-x-4 relative">
        <button
          className="p-2 rounded-full hover:bg-gray-600 dark:hover:bg-gray-700"
          onClick={() => setSearchVisible(!searchVisible)}
        >
          <FaSearch className="text-xl" />
        </button>
        {searchVisible && (
          <div className="absolute top-12 right-0 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-2 flex items-center space-x-2 z-50">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search..."
              className="p-2 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <button
              onClick={handleSearch}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              Search
            </button>
          </div>
        )}
        <button className="p-2 rounded-full hover:bg-gray-600 dark:hover:bg-gray-700">
          <FaBell className="text-xl" />
        </button>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-600 dark:hover:bg-gray-700"
        >
          {darkMode ? <FaSun className="text-xl text-white" /> : <FaMoon className="text-xl text-gray-200 dark:text-white" />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
