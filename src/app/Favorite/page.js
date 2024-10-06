"use client";
import React, { useState, useEffect } from 'react';
import ScrollableMovieList from '../../components/ScrollableMovieList';
import TranslationFilterButtons from '../../components/TranslationFilterButtons'; 
import { fetchFromTMDB } from '../../lib/tmdbClient';
import { useTranslation } from 'react-i18next';

const FavoritePage = () => {
  const { t, i18n } = useTranslation();
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loadedFavorites, setLoadedFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const favoriteData = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(favoriteData);
  }, []);

  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      const promises = favorites.map(async (item) => {
        const endpoint = item.type === 'movie' 
          ? `/movie/${item.id}`
          : `/tv/${item.id}`;
        const data = await fetchFromTMDB(endpoint, i18n.language);
        return { ...item, ...data };
      });

      const detailedFavorites = await Promise.all(promises);
      setLoadedFavorites(detailedFavorites);
      setLoading(false);
    };
  
    if (favorites.length > 0) {
      fetchFavoriteDetails();
    } else {
      setLoading(false);
    }
  }, [favorites, i18n.language]);

  const filterOptions = ['all', 'movies', 'tv'];

  const filteredFavorites = loadedFavorites.filter(item => {
    if (filter === 'all') return true;
    return filter === 'movies' ? item.media_type === 'movie' : item.media_type === 'tv';
  });

  return (
    <div className="container mx-auto p-4 bg-white dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-4">{t('Favorites')}</h1>
      
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
          <ScrollableMovieList content={filteredFavorites} isLoggedIn={true} />
        </div>
      )}
    </div>
  );
};

export default FavoritePage;
