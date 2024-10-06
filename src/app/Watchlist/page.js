"use client";
import React, { useState, useEffect } from 'react';
import ScrollableMovieList from '../../components/ScrollableMovieList';
import TranslationFilterButtons from '../../components/TranslationFilterButtons';
import { fetchFromTMDB } from '../../lib/tmdbClient';
import { useTranslation } from 'react-i18next';

const WatchlistPage = () => {
  const { t, i18n } = useTranslation();
  const [watchlist, setWatchlist] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loadedWatchlist, setLoadedWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const watchlistData = JSON.parse(localStorage.getItem('watchlist')) || [];
    setWatchlist(watchlistData);
  }, []);

  useEffect(() => {
    const fetchWatchlistDetails = async () => {
      const promises = watchlist.map(async (item) => {
        const endpoint = item.type === 'movie' 
          ? `/movie/${item.id}`
          : `/tv/${item.id}`;
        const data = await fetchFromTMDB(endpoint, i18n.language);
        return { ...item, ...data };
      });

      const detailedWatchlist = await Promise.all(promises);
      setLoadedWatchlist(detailedWatchlist);
      setLoading(false);
    };

    if (watchlist.length > 0) {
      fetchWatchlistDetails();
    } else {
      setLoading(false);
    }
  }, [watchlist, i18n.language]);

  const filterOptions = ['all', 'movies', 'tv'];

  const filteredWatchlist = loadedWatchlist.filter(item => {
    if (filter === 'all') return true;
    return filter === 'movies' ? item.media_type === 'movie' : item.media_type === 'tv';
  });

  return (
    <div className="container mx-auto p-4 bg-white dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-4">{t('Watchlist')}</h1>
      <div className="mb-4">
        <TranslationFilterButtons 
          filterOptions={filterOptions}
          currentFilter={filter}
          setFilter={setFilter}
          t={t}
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          <ScrollableMovieList content={filteredWatchlist} isLoggedIn={true} />
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
