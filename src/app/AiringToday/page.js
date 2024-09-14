// src/app/PopularTVShows/page.js
"use client";
import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../../lib/tmdbClient';
import { FaList, FaHeart, FaEye, FaStar } from 'react-icons/fa';
import Link from 'next/link';

const PopularTVShows = () => {
  const [popularTVShows, setPopularTVShows] = useState([]);
  const [filteredTVShows, setFilteredTVShows] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const showsPerPage = 15;

  // Sorting and Filtering state
  const [userScore, setUserScore] = useState([0, 10]);
  const [minVotes, setMinVotes] = useState(0);
  const [runtime, setRuntime] = useState([0, 360]);

  // Additional Filters
  const [showType, setShowType] = useState("Everything");
  const [availability, setAvailability] = useState("All availabilities");
  const [releaseDateStart, setReleaseDateStart] = useState("");
  const [releaseDateEnd, setReleaseDateEnd] = useState("");
  const [genre, setGenre] = useState("All");

  useEffect(() => {
    const fetchPopularTVShows = async () => {
     const data = await fetchFromTMDB('/tv/airing_today');
      if (data) {
        setPopularTVShows(data.results);
        setFilteredTVShows(data.results); // Initialize with all TV shows
      }
    };

    fetchPopularTVShows();
  }, []);

  const handleDropdownToggle = (showId, event) => {
    event.stopPropagation();
    setDropdownVisible(dropdownVisible === showId ? null : showId);
  };

  const handleSearch = () => {
    const filtered = popularTVShows.filter(show => {
      const showDate = new Date(show.first_air_date).getTime();
      const startDate = releaseDateStart ? new Date(releaseDateStart).getTime() : 0;
      const endDate = releaseDateEnd ? new Date(releaseDateEnd).getTime() : Date.now();
      
      // Check if episode_run_time exists and has a valid value
      const showRuntime = show.episode_run_time && show.episode_run_time.length > 0 ? show.episode_run_time[0] : 0;
  
      return (
        show.vote_average >= userScore[0] &&
        show.vote_average <= userScore[1] &&
        show.vote_count >= minVotes &&
        showRuntime >= runtime[0] &&
        showRuntime <= runtime[1] &&
        showDate >= startDate &&
        showDate <= endDate &&
        (genre === "All" || show.genre_ids.includes(genre))
      );
    });
  
    setFilteredTVShows(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };
  
  const handleShowAll = () => {
    setFilteredTVShows(popularTVShows);
    setCurrentPage(1);
  };

  const indexOfLastShow = currentPage * showsPerPage;
  const indexOfFirstShow = indexOfLastShow - showsPerPage;
  const currentShows = filteredTVShows.slice(indexOfFirstShow, indexOfLastShow);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredTVShows.length / showsPerPage)) {
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
            <select 
              value={showType} 
              onChange={(e) => setShowType(e.target.value)} 
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm text-gray-900 dark:text-gray-300"
            >
              <option>Everything</option>
              <option>Shows I Have not Seen</option>
              <option>Shows I Have Seen</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">Availabilities</label>
            <select 
              value={availability} 
              onChange={(e) => setAvailability(e.target.value)} 
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm text-gray-900 dark:text-gray-300"
            >
              <option>All availabilities</option>
              <option>Available to stream</option>
              <option>Available for rent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">Release Dates</label>
            <input 
              type="date" 
              value={releaseDateStart} 
              onChange={(e) => setReleaseDateStart(e.target.value)} 
              className="w-full mb-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm text-gray-900 dark:text-gray-300" 
            />
            <input 
              type="date" 
              value={releaseDateEnd} 
              onChange={(e) => setReleaseDateEnd(e.target.value)} 
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm text-gray-900 dark:text-gray-300" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-300">Genres</label>
            <select 
              value={genre} 
              onChange={(e) => setGenre(e.target.value)} 
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm text-gray-900 dark:text-gray-300"
            >
              <option value="All">All Genres</option>
              <option value="28">Action</option>
              <option value="12">Adventure</option>
              <option value="16">Animation</option>
              {/* Add other genres as necessary */}
            </select>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-4 mt-6">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Apply Filters
          </button>
          <button
            onClick={handleShowAll}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Show All
          </button>
        </div>
      </aside>

      {/* Main content for displaying TV shows */}
      <main className="w-full lg:w-3/4 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentShows.map(show => (
            <div key={show.id} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <Link href={`/tv/${show.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                  alt={show.name}
                  className="w-full h-[350px] object-cover"
                />
              </Link>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{show.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(show.first_air_date).toDateString()}</p>
              </div>
              <div className="absolute top-2 right-2">
                <button onClick={(e) => handleDropdownToggle(show.id, e)} className="focus:outline-none">
                  <span className="text-gray-600 dark:text-gray-400 text-xl">•••</span>
                </button>
                {dropdownVisible === show.id && (
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
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {currentPage} / {Math.ceil(filteredTVShows.length / showsPerPage)}
          </span>
          <button
            className={`px-4 py-2 border rounded-lg text-sm font-medium ${currentPage === Math.ceil(filteredTVShows.length / showsPerPage) ? 'opacity-50 cursor-not-allowed' : ''} dark:border-gray-600 dark:text-gray-300 dark:bg-gray-800`}
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(filteredTVShows.length / showsPerPage)}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default PopularTVShows;
