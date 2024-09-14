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
        <span className="text-white font-bold text-xs md:text-sm">{score}%</span>
      </div>
    </div>
  );
};

const WhatsPopular = () => {
  const [content, setContent] = useState([]);
  const [filter, setFilter] = useState('in-theaters');
  const [dropdownVisible, setDropdownVisible] = useState(null);

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

  const toggleDropdown = (itemId, event) => {
    event.stopPropagation();
    setDropdownVisible(dropdownVisible === itemId ? null : itemId);
  };

  return (
    <div className="px-6 py-4 bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">Whats Popular</h2>
        <div className="flex flex-wrap gap-2 md:gap-4 mt-4 md:mt-0">
          <button 
            onClick={() => setFilter('streaming')} 
            className={`px-3 py-1.5 md:px-5 md:py-2.5 rounded-full ${filter === 'streaming' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
          >
            Streaming
          </button>
          <button 
            onClick={() => setFilter('on-tv')} 
            className={`px-3 py-1.5 md:px-5 md:py-2.5 rounded-full ${filter === 'on-tv' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
          >
            On TV
          </button>
          <button 
            onClick={() => setFilter('for-rent')} 
            className={`px-3 py-1.5 md:px-5 md:py-2.5 rounded-full ${filter === 'for-rent' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
          >
            For Rent
          </button>
          <button 
            onClick={() => setFilter('in-theaters')} 
            className={`px-3 py-1.5 md:px-5 md:py-2.5 rounded-full ${filter === 'in-theaters' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
          >
            In Theaters
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-4 md:space-x-6" style={{ width: content.length * 300 }}>
            {content.map(item => (
              <div 
                key={item.id} 
                className="relative bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-md overflow-hidden w-[200px] md:w-[300px] h-[300px] md:h-[450px]"
              >
                <div className="relative">
                  <Link href={`/${item.media_type === 'movie' || item.title ? 'movies' : 'tv'}/${item.id}`}>  
                    <img 
                      src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/default-poster.png'} 
                      alt={item.title || item.name} 
                      className={`w-full h-[200px] md:h-[350px] object-cover ${dropdownVisible === item.id ? 'filter blur-sm' : ''}`}
                    />
                  </Link>

                  <div className="absolute bottom-2 left-2">
                    <UserScore score={Math.round(item.vote_average * 10)} />
                  </div>
                </div>

                <div className="p-2 md:p-4">
                  <h3 className="text-sm md:text-lg font-semibold">{item.title || item.name}</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{new Date(item.release_date || item.first_air_date).toDateString()}</p>
                </div>

                <div className="absolute top-2 right-2">
                  <button onClick={(event) => toggleDropdown(item.id, event)} className="focus:outline-none">
                    <span className="text-gray-600 dark:text-gray-400">•••</span>
                  </button>

                  {dropdownVisible === item.id && (
                    <div className="absolute right-0 mt-2 w-32 md:w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10">
                      <ul>
                        <li className="px-2 md:px-4 py-1 md:py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center text-xs md:text-sm">
                          <FaList className="mr-1 md:mr-2" /> Add to list
                        </li>
                        <li className="px-2 md:px-4 py-1 md:py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center text-xs md:text-sm">
                          <FaHeart className="mr-1 md:mr-2" /> Favorite
                        </li>
                        <li className="px-2 md:px-4 py-1 md:py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center text-xs md:text-sm">
                          <FaEye className="mr-1 md:mr-2" /> Watchlist
                        </li>
                        <li className="px-2 md:px-4 py-1 md:py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center text-xs md:text-sm">
                          <FaStar className="mr-1 md:mr-2" /> Your rating
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

export default WhatsPopular;
