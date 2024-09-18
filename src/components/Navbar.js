"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaSearch, FaUser, FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';
import NavbarDropdown from './NavbarDropdown';
import { signOut } from '../lib/firebase';
import useAuth from '../lib/useAuth';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const user = useAuth();

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

  const handleSignOut = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      try {
        await signOut();
        window.location.href = '/Login';
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };

  return (
    <nav className="p-4 flex items-center justify-between bg-gray-900 dark:bg-gray-800 text-gray-200 dark:text-white">
      <div className="flex items-center space-x-6">
        <Link href="/">
          <Image src="/images/logo.svg" alt="Logo" width={100} height={40} />
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
            links={[{ label: 'Popular People', href: '/PopularPeople' }]}
          />
        </div>
        <button className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" onClick={toggleMobileMenu}>
          <FaBars className="text-xl" />
        </button>
      </div>

      {/* القائمة المنسدلة للجوال */}
      <div className={`fixed inset-0 bg-gray-900 dark:bg-gray-800 text-gray-200 dark:text-white z-50 transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
        <div className="flex flex-col items-center p-4 space-y-4 relative">
          <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" onClick={toggleMobileMenu}>
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
            links={[{ label: 'Popular People', href: '/PopularPeople' }]}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 relative">
        {!user ? (
          <Link href="/Login" className="text-gray-200 hover:text-gray-400">
            Log In
          </Link>
        ) : (
          <>
            <button className="p-2 rounded-full hover:bg-gray-600 dark:hover:bg-gray-700" onClick={() => setUserMenuVisible(!userMenuVisible)}>
              <FaUser className="text-xl" />
            </button>
            {userMenuVisible && (
  <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
    <div className="p-3 border-b dark:border-gray-700">
      <p className="text-gray-700 dark:text-gray-300">Logged in as:</p>
      <p className="font-semibold text-gray-800 dark:text-gray-200 break-words">
        {user.email}
      </p>
    </div>

   {/* 
<ul>
  <li>
    <Link href="/Favorite" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
      Favorite
    </Link>
  </li>
  <li>
    <Link href="/Watchlist" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
      Watchlist
    </Link>
  </li>
  <li>
    <Link href="/YourRating" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
      Your Rating
    </Link>
  </li>
</ul>
*/}

    <div className="p-3 border-t dark:border-gray-700">
      <button onClick={handleSignOut} className="w-full text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 text-sm">
        Log Out
      </button>
    </div>
  </div>
)}

          </>
        )}
        <button className="p-2 rounded-full hover:bg-gray-600 dark:hover:bg-gray-700" onClick={() => setSearchVisible(!searchVisible)}>
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
            <button onClick={handleSearch} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400">
              Search
            </button>
          </div>
        )}
        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-600 dark:hover:bg-gray-700">
          {darkMode ? <FaSun className="text-xl text-white" /> : <FaMoon className="text-xl text-gray-200 dark:text-white" />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
