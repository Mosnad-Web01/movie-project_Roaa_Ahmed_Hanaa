"use client";
import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../lib/tmdbClient';
import MovieCard from './MovieCard';
import useAuth from '../lib/useAuth';// تأكد من المسار الصحيح


const FreeToWatch = () => {
  const [content, setContent] = useState([]);
  const [timeRange, setTimeRange] = useState('week');
  const [filter, setFilter] = useState('movie');
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const user = useAuth(); // جلب المستخدم
  const isLoggedIn = !!user; // إذا كان المستخدم موجودًا، يعني أنه مسجل الدخول

  useEffect(() => {
    const fetchContent = async () => {
      const endpoint = filter === 'movie' ? `/trending/movie/${timeRange}` : `/trending/tv/${timeRange}`;
      const data = await fetchFromTMDB(endpoint);
      console.log('Fetched content:', data); // Log data to verify structure
      if (data) {
        setContent(data.results);
      }
    };

    fetchContent();
  }, [timeRange, filter]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownVisible !== null) {
        setDropdownVisible(null);
      }
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
        <h2 className="text-3xl font-bold mb-4 sm:mb-0">Free to Watch</h2>

        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
          <button
            onClick={() => setFilter('movie')}
            className={`px-4 py-2 rounded-full ${filter === 'movie' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
          >
            Movies
          </button>
          <button
            onClick={() => setFilter('tv')}
            className={`px-4 py-2 rounded-full ${filter === 'tv' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
          >
            TV
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

export default FreeToWatch;
