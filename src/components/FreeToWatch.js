"use client";
import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../lib/tmdbClient';
import { FaList, FaHeart, FaEye, FaStar } from 'react-icons/fa';
import Link from 'next/link';

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

const FreeToWatch = () => {
  const [content, setContent] = useState([]);
  const [timeRange, setTimeRange] = useState('week');
  const [filter, setFilter] = useState('movie');
  const [dropdownVisible, setDropdownVisible] = useState(null);

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Free to Watch</h2>
          
        <div className="flex space-x-4 mt-4">
          <button 
            onClick={() => setFilter('movie')} 
            className={`px-5 py-2.5 rounded-full ${filter === 'movie' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
          >
            Movies
          </button>
          <button 
            onClick={() => setFilter('tv')} 
            className={`px-5 py-2.5 rounded-full ${filter === 'tv' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
          >
            TV
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-6" style={{ width: content.length * 300 }}>
            {content.map(item => (
              <div 
                key={item.id} 
                className="relative bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-md overflow-hidden w-[300px] h-[450px]"
              >
                <div className="relative">
                <Link href={`/${item.media_type === 'movie' || item.title ? 'movies' : 'tv'}/${item.id}`}>  
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
                      alt={item.title || item.name} 
                      className={`w-full h-[350px] object-cover ${dropdownVisible === item.id ? 'filter blur-sm' : ''}`}
                    />
                  </Link>
                  <div className="absolute bottom-2 left-2">
                    <UserScore score={Math.round(item.vote_average * 10)} />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold">{item.title || item.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(item.release_date || item.first_air_date).toDateString()}</p>
                </div>

                <div className="absolute top-2 right-2">
                  <button onClick={(event) => toggleDropdown(item.id, event)} className="focus:outline-none">
                    <span className="text-gray-600 dark:text-gray-400">•••</span>
                  </button>

                  {dropdownVisible === item.id && (
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

export default FreeToWatch;
