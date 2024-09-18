"use client";
import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../lib/tmdbClient';
import MovieCard from './MovieCard'; // تأكد من أن MovieCard موجود ويمكنك استخدامه
import useAuth from '../lib/useAuth'; // تأكد من أن المسار صحيح

const Trending = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [timeRange, setTimeRange] = useState('week');
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const user = useAuth(); // جلب المستخدم
  const isLoggedIn = !!user; // إذا كان المستخدم موجودًا، يعني أنه مسجل الدخول

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      const data = await fetchFromTMDB(`/trending/movie/${timeRange}`);
      if (data) {
        setTrendingMovies(data.results);
      }
    };

    fetchTrendingMovies();
  }, [timeRange]);

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
        <h2 className="text-3xl font-bold mb-4 sm:mb-0">Trending</h2>

        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
          <button
            onClick={() => setTimeRange('day')}
            className={`px-4 py-2 rounded-full ${timeRange === 'day' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-full ${timeRange === 'week' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
          >
            This Week
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex flex-nowrap space-x-4" style={{ width: trendingMovies.length * 300 }}>
            {trendingMovies.map(movie => (
              <MovieCard
                key={movie.id}
                item={movie}
                isLoggedIn={isLoggedIn} // تمرير حالة تسجيل الدخول
                toggleDropdown={(event) => toggleDropdown(movie.id, event)}
                dropdownVisible={dropdownVisible === movie.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trending;
