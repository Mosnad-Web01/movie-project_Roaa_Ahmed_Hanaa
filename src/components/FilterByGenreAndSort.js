import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../lib/tmdbClient';

const FilterByGenreAndSort = ({ onFilterChange }) => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortOrder, setSortOrder] = useState('popularity.desc');

  useEffect(() => {
    const fetchGenres = async () => {
      const genreData = await fetchFromTMDB('/genre/movie/list');
      if (genreData) {
        setGenres(genreData.genres);
      }
    };

    fetchGenres();
  }, []);

  // Handle genre changes
  const handleGenreChange = (genreId) => {
    const updatedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];
    
    setSelectedGenres(updatedGenres);
    onFilterChange(updatedGenres, sortOrder);
  };

  // Handle sort order changes
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    onFilterChange(selectedGenres, e.target.value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Genres</h3>
        <div className="grid grid-cols-2 gap-4">
          {genres.map(genre => (
            <label key={genre.id} className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">
              <input
                type="checkbox"
                value={genre.id}
                onChange={() => handleGenreChange(genre.id)}
                checked={selectedGenres.includes(genre.id)}
                className="mr-2"
              />
              {genre.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Sort By</h3>
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="block w-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300"
        >
          <option value="popularity.desc">Most Popular</option>
          <option value="release_date.desc">Newest</option>
          <option value="vote_average.desc">Highest Rated</option>
          <option value="vote_count.desc">Most Voted</option>
        </select>
      </div>
    </div>
  );
};

export default FilterByGenreAndSort;
