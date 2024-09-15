"use client";
import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../../lib/tmdbClient';
import FilterByGenreAndSort from '../../components/FilterByGenreAndSort';
import DropdownMenu from '../../components/DropdownMenu';
import Link from 'next/link';

const NowPlaying = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(6); // عدد الأفلام في كل صفحة
  const [dropdownVisible, setDropdownVisible] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await fetchFromTMDB('/movie/now_playing');
      if (data) {
        setMovies(data.results);
        setFilteredMovies(data.results);
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

  // Toggle dropdown visibility
  const toggleDropdown = (movieId, event) => {
    event.stopPropagation(); // لتجنب إغلاق القائمة عند الضغط على أي مكان آخر
    setDropdownVisible(prevState => (prevState === movieId ? null : movieId));
  };

  return (
    <div className="flex flex-col lg:flex-row dark:bg-gray-900">
      {/* Sidebar - Filters */}
      <aside className="w-full lg:w-1/4 bg-white dark:bg-gray-800 p-4 sm:p-6 space-y-6 sm:space-y-8 shadow-md rounded-lg">
        <FilterByGenreAndSort onFilterChange={handleFilterChange} />
      </aside>

      {/* Main Content - Movies */}
      <main className="w-full lg:w-3/4 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {currentMovies.map(movie => (
            <div key={movie.id} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <Link href={`/movies/${movie.id}`}>
                <div className="cursor-pointer" onClick={(e) => dropdownVisible === movie.id && e.preventDefault()}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-[250px] sm:h-[300px] md:h-[350px] object-cover"
                  />
                  <div className="p-2 sm:p-4">
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-gray-100">{movie.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {new Date(movie.release_date).toDateString()}
                    </p>
                  </div>
                </div>
              </Link>
              <DropdownMenu dropdownVisible={dropdownVisible} toggleDropdown={toggleDropdown} movieId={movie.id} />
            </div>
          ))}
        </div>

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

export default NowPlaying;
