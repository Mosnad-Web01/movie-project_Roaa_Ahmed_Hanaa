// src/app/Watchlist/page.js
 "use client";
import React, { useEffect, useState } from 'react';
import MovieCard from '../../components/MovieCard';

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const storedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || {};
    const watchlistedMovies = storedWatchlist.movie || [];
    const watchlistedTVShows = storedWatchlist.tv || [];
    setWatchlist([...watchlistedMovies, ...watchlistedTVShows]);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {watchlist.map((item) => (
        <MovieCard key={item.id} item={item} media_type="movie" />
      ))}
      {watchlist.length === 0 && <p>No items in watchlist.</p>}
    </div>
  );
};

export default WatchlistPage;
