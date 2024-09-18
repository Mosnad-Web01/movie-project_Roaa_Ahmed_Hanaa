"use client";
import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../lib/tmdbClient';
import MovieCard from './MovieCard'; // تأكد من أن MovieCard موجود ويمكنك استخدامه
import useAuth from '../lib/useAuth'; // تأكد من أن المسار صحيح

const WhatsPopular = () => {
  const [content, setContent] = useState([]);
  const [filter, setFilter] = useState('in-theaters');
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const user = useAuth(); // جلب المستخدم
  const isLoggedIn = !!user; // إذا كان المستخدم موجودًا، يعني أنه مسجل الدخول

  useEffect(() => {
    const fetchMoviesAndShows = async () => {
      let movieEndpoint = '';
      let tvEndpoint = '';

      switch (filter) {
        case 'streaming':
          movieEndpoint = `/movie/popular?with_watch_monetization_types=flatrate`;
          tvEndpoint = `/tv/popular?with_watch_monetization_types=flatrate`;
          break;
        case 'on-tv':
          movieEndpoint = `/movie/popular`;
          tvEndpoint = `/tv/popular`;
          break;
        case 'for-rent':
          movieEndpoint = `/movie/popular?with_watch_monetization_types=rental`;
          tvEndpoint = `/tv/popular?with_watch_monetization_types=rental`;
          break;
        case 'in-theaters':
          movieEndpoint = `/movie/now_playing`;
          tvEndpoint = `/tv/on_the_air`;
          break;
        default:
          movieEndpoint = `/movie/popular`;
          tvEndpoint = `/tv/popular`;
      }

      try {
        const [moviesData, tvData] = await Promise.all([
          fetchFromTMDB(movieEndpoint),
          fetchFromTMDB(tvEndpoint)
        ]);

        if (moviesData && tvData) {
          const combinedContent = [...moviesData.results, ...tvData.results];
          // دمج المحتوى وترتيبه عشوائياً
          setContent(combinedContent.sort(() => Math.random() - 0.5));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMoviesAndShows();
  }, [filter]);

  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownVisible(null);
    };

    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownVisible]);

  const toggleDropdown = (id, event) => {
    event.stopPropagation(); // Prevent closing the dropdown when clicking inside
    setDropdownVisible(dropdownVisible === id ? null : id);
  };

  return (
    <div className="px-6 py-4 bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold mb-4 sm:mb-0">What is Popular</h2>

        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
          <button
            onClick={() => setFilter('streaming')}
            className={`px-4 py-2 rounded-full ${filter === 'streaming' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
          >
            Streaming
          </button>
          <button
            onClick={() => setFilter('on-tv')}
            className={`px-4 py-2 rounded-full ${filter === 'on-tv' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
          >
            On TV
          </button>
          <button
            onClick={() => setFilter('for-rent')}
            className={`px-4 py-2 rounded-full ${filter === 'for-rent' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
          >
            For Rent
          </button>
          <button
            onClick={() => setFilter('in-theaters')}
            className={`px-4 py-2 rounded-full ${filter === 'in-theaters' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
          >
            In Theaters
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex flex-nowrap space-x-4" style={{ width: content.length * 300 }}>
            {content.map(item => (
              <MovieCard
                key={item.id}
                item={item}
                isLoggedIn={isLoggedIn} // تمرير حالة تسجيل الدخول
                toggleDropdown={(event) => toggleDropdown(item.id, event)}
                dropdownVisible={dropdownVisible === item.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsPopular;
