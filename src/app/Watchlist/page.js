// src/app/Watchlist/page.js

'use client'; // إضافة هذا السطر لتحديد أن هذا مكون عميل

import React, { useState, useEffect } from 'react';
import MovieCard from '../../components/MovieCard';

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchWatchlist = () => {
      const allWatchlist = [];
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('movie-') || key.startsWith('tv-')) {
          const data = JSON.parse(localStorage.getItem(key));
          if (data.watchlist) {
            allWatchlist.push({ ...data, id: key.split('-')[1], type: key.split('-')[0] });
          }
        }
      });
      setWatchlist(allWatchlist);
    };

    fetchWatchlist();
  }, []);

  const filteredWatchlist = filter === 'all' ? watchlist : watchlist.filter(item => item.type === filter);

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full ${filter === 'all' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
        >
          All
        </button>
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
          TV Shows
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredWatchlist.map(item => (
          <MovieCard key={item.id} item={item} media_type={item.type} isLoggedIn={true} />
        ))}
      </div>
    </div>
  );
};

export default WatchlistPage;
