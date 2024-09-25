"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaSearch, FaUser, FaMoon, FaSun, FaBars, FaTimes, FaGlobe } from 'react-icons/fa'; 
import { useTranslation } from 'react-i18next';
import NavbarDropdown from './NavbarDropdown';
import { signOut } from '../lib/firebase';
import useAuth from '../lib/useAuth';
import i18n from '../lib/translationConfig';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [languageMenuVisible, setLanguageMenuVisible] = useState(false); 
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false); // حالة التحميل
  const user = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    setLanguage(savedLanguage);
    i18n.changeLanguage(savedLanguage);
    document.documentElement.lang = savedLanguage;
  }, []);

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
    const confirmed = window.confirm(t('Are you sure you want to log out?'));
    if (confirmed) {
      try {
        await signOut();
        window.location.href = '/Login';
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    document.documentElement.lang = newLanguage;
    localStorage.setItem('preferredLanguage', newLanguage);
  };

  const toggleLanguageMenu = () => {
    setLanguageMenuVisible(!languageMenuVisible);
  };

  const handleLinkClick = (href) => {
    setLoading(true); // تعيين حالة التحميل عند الضغط على رابط
    window.location.href = href;
  };

  return (
    <nav className="p-4 flex items-center justify-between bg-gray-900 dark:bg-gray-800 text-gray-200 dark:text-white">
      <div className="flex items-center space-x-6">
        <Link href="/">
          <Image src="/images/logo.svg" alt="Logo" width={100} height={40} />
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-xl font-semibold hover:underline">
            {t('Home')}
          </Link>
          <NavbarDropdown
            title={t('Movies')}
            links={[
              { label: t('Popular'), href: '/PopularMovies' },
              { label: t('Now Playing'), href: '/NowPlaying' },
              { label: t('Upcoming'), href: '/UpcomingMovies' },
              { label: t('Top Rated'), href: '/TopRatedMovies' },
            ].map(link => ({ ...link, onClick: () => handleLinkClick(link.href) }))} // إضافة onClick
          />
          <NavbarDropdown
            title={t('TV Shows')}
            links={[
              { label: t('Popular'), href: '/PopularTVShows' },
              { label: t('Airing Today'), href: '/AiringToday' },
              { label: t('On TV'), href: '/OnTV' },
              { label: t('Top Rated'), href: '/TopRatedTVShows' },
            ].map(link => ({ ...link, onClick: () => handleLinkClick(link.href) }))} // إضافة onClick
          />
          <NavbarDropdown
            title={t('People')}
            links={[{ label: t('Popular People'), href: '/PopularPeople', onClick: () => handleLinkClick('/PopularPeople') }]} // إضافة onClick
          />
        </div>
        <button className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" onClick={toggleMobileMenu}>
          <FaBars className="text-xl" />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-gray-900 dark:bg-gray-800 text-gray-200 dark:text-white z-50 transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
        <div className="flex flex-col items-center p-4 space-y-4 relative">
          <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" onClick={toggleMobileMenu}>
            <FaTimes className="text-xl" />
          </button>
          <NavbarDropdown
            title={t('Movies')}
            links={[
              { label: t('Popular'), href: '/PopularMovies', onClick: () => handleLinkClick('/PopularMovies') },
              { label: t('Now Playing'), href: '/NowPlaying', onClick: () => handleLinkClick('/NowPlaying') },
              { label: t('Upcoming'), href: '/UpcomingMovies', onClick: () => handleLinkClick('/UpcomingMovies') },
              { label: t('Top Rated'), href: '/TopRatedMovies', onClick: () => handleLinkClick('/TopRatedMovies') },
            ]}
          />
          <NavbarDropdown
            title={t('TV Shows')}
            links={[
              { label: t('Popular'), href: '/PopularTVShows', onClick: () => handleLinkClick('/PopularTVShows') },
              { label: t('Airing Today'), href: '/AiringToday', onClick: () => handleLinkClick('/AiringToday') },
              { label: t('On TV'), href: '/OnTV', onClick: () => handleLinkClick('/OnTV') },
              { label: t('Top Rated'), href: '/TopRatedTVShows', onClick: () => handleLinkClick('/TopRatedTVShows') },
            ]}
          />
          <NavbarDropdown
            title={t('People')}
            links={[{ label: t('Popular People'), href: '/PopularPeople', onClick: () => handleLinkClick('/PopularPeople') }]}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 relative">
        {!user ? (
          <Link href="/Login" className="text-gray-200 hover:text-gray-400">
            {t('Log In')}
          </Link>
        ) : (
          <>
            <button className="p-2 rounded-full hover:bg-gray-600 dark:hover:bg-gray-700" onClick={() => setUserMenuVisible(!userMenuVisible)}>
              <FaUser className="text-xl" />
            </button>
            {userMenuVisible && (
              <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300">{t('Logged in as')}:</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 break-words">
                    {user.email}
                  </p>
                </div>
                <div className="p-3 border-t dark:border-gray-700">
                  <button onClick={handleSignOut} className="w-full text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 text-sm">
                    {t('Log Out')}
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
          <div className="absolute top-12 right-0 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg z-50">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="p-2 w-48 dark:bg-gray-800 dark:text-white rounded-lg"
              placeholder={t('Search...')}
            />
          </div>
        )}
        <button className="p-2 rounded-full hover:bg-gray-600 dark:hover:bg-gray-700" onClick={toggleDarkMode}>
          {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
        </button>
        <button className="p-2 rounded-full hover:bg-gray-600 dark:hover:bg-gray-700" onClick={toggleLanguageMenu}>
          <FaGlobe className="text-xl" />
        </button>
        {languageMenuVisible && (
          <div className="absolute right-0 top-12 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
            <button onClick={toggleLanguage} className="w-full text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 text-sm">
              {language === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        )}
      </div>
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin h-10 w-10 border-4 border-t-4 border-t-transparent rounded-full" />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
