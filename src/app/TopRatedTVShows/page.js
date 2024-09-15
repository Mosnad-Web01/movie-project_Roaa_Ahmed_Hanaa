"use client";
import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../../lib/tmdbClient';
import FilterByGenreAndSort from '../../components/FilterByGenreAndSort';
import DropdownMenu from '../../components/DropdownMenu'; // Import the DropdownMenu component
import Link from 'next/link';

const TopRatedTVShows = () => {
  const [tvShows, setTVShows] = useState([]);
  const [filteredTVShows, setFilteredTVShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showsPerPage] = useState(6); // Number of shows per page
  const [dropdownVisible, setDropdownVisible] = useState(null);

  useEffect(() => {
    const fetchTVShows = async () => {
      const data = await fetchFromTMDB('/tv/top_rated');
      if (data) {
        setTVShows(data.results);
        setFilteredTVShows(data.results);
      }
    };

    fetchTVShows();
  }, []);

  const handleFilterChange = (selectedGenres, sortOrder) => {
    let filtered = tvShows;

    // Filter by selected genres
    if (selectedGenres.length > 0) {
      filtered = tvShows.filter(show =>
        selectedGenres.every(genre => show.genre_ids.includes(genre))
      );
    }

    // Sort by selected order
    filtered.sort((a, b) => {
      if (sortOrder === 'popularity.desc') {
        return b.popularity - a.popularity;
      } else if (sortOrder === 'first_air_date.desc') {
        return new Date(b.first_air_date) - new Date(a.first_air_date);
      } else if (sortOrder === 'vote_average.desc') {
        return b.vote_average - a.vote_average;
      } else if (sortOrder === 'vote_count.desc') {
        return b.vote_count - a.vote_count;
      }
      return 0;
    });

    setFilteredTVShows(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  // Pagination logic
  const indexOfLastShow = currentPage * showsPerPage;
  const indexOfFirstShow = indexOfLastShow - showsPerPage;
  const currentShows = filteredTVShows.slice(indexOfFirstShow, indexOfLastShow);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredTVShows.length / showsPerPage)) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  // Toggle dropdown visibility
  const toggleDropdown = (showId, event) => {
    event.stopPropagation(); // Prevent closing the dropdown when clicking inside
    setDropdownVisible(prevState => (prevState === showId ? null : showId));
  };

  return (
    <div className="flex flex-col lg:flex-row dark:bg-gray-900">
      {/* Sidebar - Filters */}
      <aside className="w-full lg:w-1/4 bg-white dark:bg-gray-800 p-4 sm:p-6 space-y-6 sm:space-y-8 shadow-md rounded-lg">
        <FilterByGenreAndSort onFilterChange={handleFilterChange} />
      </aside>

      {/* Main Content - TV Shows */}
      <main className="w-full lg:w-3/4 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {currentShows.map(show => (
            <div key={show.id} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <Link href={`/tv/${show.id}`}>
                <div className="cursor-pointer" onClick={(e) => dropdownVisible === show.id && e.preventDefault()}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.name}
                    className="w-full h-[250px] sm:h-[300px] md:h-[350px] object-cover"
                  />
                  <div className="p-2 sm:p-4">
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-gray-100">{show.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {new Date(show.first_air_date).toDateString()}
                    </p>
                  </div>
                </div>
              </Link>
              <DropdownMenu dropdownVisible={dropdownVisible} toggleDropdown={toggleDropdown} movieId={show.id} /> {/* Add DropdownMenu here */}
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
            disabled={currentPage === Math.ceil(filteredTVShows.length / showsPerPage)}
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default TopRatedTVShows;
