// src/components/Trending.js
"use client";
import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../lib/tmdbClient';
import { FaList, FaHeart, FaEye, FaStar } from 'react-icons/fa'; // Import icons
import Link from 'next/link'; // Import Link

const UserScore = ({ score }) => {
  const circleRadius = 20;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const progressOffset = circleCircumference - (score / 100) * circleCircumference;

  return (
    <div className="relative w-12 h-12">
      <svg className="transform -rotate-90" width="48" height="48" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r={circleRadius}
          stroke="#ccc"
          strokeWidth="4"
          fill="transparent"
        />
        <circle
          cx="24"
          cy="24"
          r={circleRadius}
          stroke="#21d07a"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circleCircumference}
          strokeDashoffset={progressOffset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-sm">{score}%</span>
      </div>
    </div>
  );
};

const Trending = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [timeRange, setTimeRange] = useState('week');
  const [dropdownVisible, setDropdownVisible] = useState(null);

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

  const toggleDropdown = (movieId, event) => {
    event.stopPropagation(); // Prevent closing the dropdown when clicking inside
    setDropdownVisible(dropdownVisible === movieId ? null : movieId);
  };

  return (
    <div className="px-6 py-4 bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Trending</h2>
        <div className="flex space-x-4">
          <button 
            onClick={() => setTimeRange('day')} 
            className={`px-5 py-2.5 rounded-full ${timeRange === 'day' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
          >
            Today
          </button>
          <button 
            onClick={() => setTimeRange('week')} 
            className={`px-5 py-2.5 rounded-full ${timeRange === 'week' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
          >
            This Week
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-6" style={{ width: trendingMovies.length * 300 }}>
            {trendingMovies.map(movie => (
              <div 
                key={movie.id} 
                className="relative bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-md overflow-hidden w-[300px] h-[450px]"
              >
                <div className="relative">
                  <Link href={`/movies/${movie.id}`}>
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                      alt={movie.title} 
                      className={`w-full h-[350px] object-cover ${dropdownVisible === movie.id ? 'filter blur-sm' : ''}`}
                    />
                  </Link>
                  <div className="absolute bottom-2 left-2">
                    <UserScore score={Math.round(movie.vote_average * 10)} />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold">{movie.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(movie.release_date).toDateString()}</p>
                </div>

                <div className="absolute top-2 right-2">
                  <button onClick={(event) => toggleDropdown(movie.id, event)} className="focus:outline-none">
                    <span className="text-gray-600 dark:text-gray-400">•••</span>
                  </button>

                  {dropdownVisible === movie.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10">
                      <ul>
                        <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center">
                          <FaList className="mr-2" /> Add to list
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center">
                          <FaHeart className="mr-2" /> Favorite
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center">
                          <FaEye className="mr-2" /> Watchlist
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center">
                          <FaStar className="mr-2" /> Your rating
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trending;
