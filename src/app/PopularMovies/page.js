"use client";
import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../../lib/tmdbClient';
import { FaList, FaHeart, FaEye, FaStar } from 'react-icons/fa';
import Link from 'next/link';

const PopularMovies = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 15;

  // Sorting and Filtering state
  const [userScore, setUserScore] = useState([0, 10]);
  const [minVotes, setMinVotes] = useState(0);
  const [runtime, setRuntime] = useState([0, 360]);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      const data = await fetchFromTMDB('/movie/popular');
      if (data) {
        setPopularMovies(data.results);
        setFilteredMovies(data.results); // Initialize with all movies
      }
    };

    fetchPopularMovies();
  }, []);

  const handleDropdownToggle = (movieId, event) => {
    event.stopPropagation();
    setDropdownVisible(dropdownVisible === movieId ? null : movieId);
  };

  const handleSearch = () => {
    const filtered = popularMovies.filter(movie => {
      // Apply filters
      return (
        movie.vote_average >= userScore[0] &&
        movie.vote_average <= userScore[1] &&
        movie.vote_count >= minVotes &&
        movie.runtime >= runtime[0] &&
        movie.runtime <= runtime[1]
      );
    });

    setFilteredMovies(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  // New function to handle "Show All" button click
  const handleShowAll = () => {
    setFilteredMovies(popularMovies);
    setCurrentPage(1); // Reset to first page
  };

  // Pagination logic
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredMovies.length / moviesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row dark:bg-gray-900">
     
      {/* Sidebar for sorting and filters */}
      <aside className="w-full lg:w-1/4 bg-white dark:bg-gray-800 p-6 space-y-8 shadow-md rounded-lg">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Sort & Filter</h3>

        <div className="space-y-6">
          {/* User Score */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">User Score</label>
            <input
              type="range"
              min="0"
              max="10"
              value={userScore[1]}
              onChange={(e) => setUserScore([userScore[0], e.target.value])}
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
            <span className="text-sm text-gray-900 dark:text-gray-100">{userScore[0]} - {userScore[1]}</span>
          </div>

          {/* Minimum User Votes */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">Minimum User Votes</label>
            <input
              type="range"
              min="0"
              max="500"
              value={minVotes}
              onChange={(e) => setMinVotes(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
            <span className="text-sm text-gray-900 dark:text-gray-100">{minVotes}</span>
          </div>

          {/* Runtime */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">Runtime</label>
            <input
              type="range"
              min="0"
              max="360"
              value={runtime[1]}
              onChange={(e) => setRuntime([runtime[0], e.target.value])}
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
            <span className="text-sm text-gray-900 dark:text-gray-100">{runtime[0]} - {runtime[1]} min</span>
          </div>
        </div>

        {/* Additional Filters */}
        <h3 className="text-xl font-bold mt-8 text-gray-900 dark:text-gray-100">Filters</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">Show Me</label>
            <select className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm text-gray-900 dark:text-gray-300">
              <option>Everything</option>
              <option>Movies I Have not Seen</option>
              <option>Movies I Have Seen</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">Availabilities</label>
            <select className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm text-gray-900 dark:text-gray-300">
              <option>All availabilities</option>
              <option>Available to stream</option>
              <option>Available for rent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">Release Dates</label>
            <input type="date" className="w-full mb-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm text-gray-900 dark:text-gray-300" />
            <input type="date" className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm text-gray-900 dark:text-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">Genres</label>
            <select className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm text-gray-900 dark:text-gray-300">
              <option>Action</option>
              <option>Adventure</option>
              <option>Comedy</option>
              <option>Drama</option>
              <option>Horror</option>
              {/* Add more genres as required */}
            </select>
          </div>
        </div>

        {/* Search and Show All Buttons */}
        <button 
          onClick={handleSearch} 
          className="w-full mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800">
          Search
        </button>
        <button 
          onClick={handleShowAll} 
          className="w-full mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700">
          Show All
        </button>
      </aside>

      {/* Main content for displaying movies */}
      <main className="w-full lg:w-3/4 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentMovies.map(movie => (
            <div key={movie.id} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <Link href={`/movies/${movie.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-[350px] object-cover"
                />
              </Link>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{movie.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(movie.release_date).toDateString()}</p>
              </div>
              <div className="absolute top-2 right-2">
                <button onClick={(e) => handleDropdownToggle(movie.id, e)} className="focus:outline-none">
                  <span className="text-gray-600 dark:text-gray-400 text-xl">•••</span>
                </button>
                {dropdownVisible === movie.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-20">
                    <ul className="list-none p-0 m-0">
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

        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-6">
          <button 
            className={`px-4 py-2 border rounded-lg text-sm font-medium ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''} dark:border-gray-600 dark:text-gray-300 dark:bg-gray-800`} 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{currentPage} / {Math.ceil(filteredMovies.length / moviesPerPage)}</span>
          <button 
            className={`px-4 py-2 border rounded-lg text-sm font-medium ${currentPage === Math.ceil(filteredMovies.length / moviesPerPage) ? 'opacity-50 cursor-not-allowed' : ''} dark:border-gray-600 dark:text-gray-300 dark:bg-gray-800`} 
            onClick={handleNextPage} 
            disabled={currentPage === Math.ceil(filteredMovies.length / moviesPerPage)}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default PopularMovies;
