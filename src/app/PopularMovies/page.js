"use client";
import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../../lib/tmdbClient';
import FilterByGenreAndSort from '../../components/FilterByGenreAndSort';
import MovieCard from '../../components/MovieCard';
import useAuth from '../../lib/useAuth'; // تأكد من مسار useAuth

const PopularMovies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(6); // عدد الأفلام في كل صفحة
  const [loading, setLoading] = useState(true); // حالة التحميل

  const user = useAuth(); // الحصول على معلومات المستخدم

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const data = await fetchFromTMDB('/movie/popular');
        if (data) {
          // إضافة media_type بشكل ثابت كـ 'movie'
          const moviesWithType = data.results.map(movie => ({
            ...movie,
            media_type: 'movie'
          }));
          setMovies(moviesWithType);
          setFilteredMovies(moviesWithType);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleFilterChange = (selectedGenres, sortOrder) => {
    let filtered = movies;

    // Filter by selected genres
    if (selectedGenres.length > 0) {
      filtered = movies.filter(movie =>
        selectedGenres.every(genre => movie.genre_ids.includes(genre))
      );
    }

    // Sort by selected order
    filtered.sort((a, b) => {
      if (sortOrder === 'popularity.desc') {
        return b.popularity - a.popularity;
      } else if (sortOrder === 'release_date.desc') {
        return new Date(b.release_date) - new Date(a.release_date);
      } else if (sortOrder === 'vote_average.desc') {
        return b.vote_average - a.vote_average;
      } else if (sortOrder === 'vote_count.desc') {
        return b.vote_count - a.vote_count;
      }
      return 0;
    });

    setFilteredMovies(filtered);
    setCurrentPage(1); // العودة إلى الصفحة الأولى بعد التصفية
  };

  // Pagination logic
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredMovies.length / moviesPerPage)) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row dark:bg-gray-900">
      {/* Sidebar - Filters */}
      <aside className="w-full lg:w-1/4 bg-white dark:bg-gray-800 p-4 sm:p-6 space-y-6 sm:space-y-8 shadow-md rounded-lg">
        <FilterByGenreAndSort onFilterChange={handleFilterChange} />
      </aside>

      {/* Main Content - Movies */}
      <main className="w-full lg:w-3/4 p-4 sm:p-6">
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {currentMovies.map(movie => (
              <MovieCard 
                key={movie.id} 
                item={{ ...movie, media_type: 'movie' }} 
                isLoggedIn={!!user} 
              />
            ))}
          </div>
        )}

        {/* Pagination Buttons */}
        <div className="flex flex-col sm:flex-row justify-between mt-4 sm:mt-6 space-y-2 sm:space-y-0">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
          >
            Previous
          </button>

          <button
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(filteredMovies.length / moviesPerPage)}
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default PopularMovies;
