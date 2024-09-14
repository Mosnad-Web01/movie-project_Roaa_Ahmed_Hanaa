"use client";
import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../../lib/tmdbClient';
import Link from 'next/link';

const PopularPeople = () => {
  const [popularPeople, setPopularPeople] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const peoplePerPage = 30;

  useEffect(() => {
    const fetchPopularPeople = async () => {
      const data = await fetchFromTMDB('/person/popular');
      if (data) {
        setPopularPeople(data.results);
      }
    };

    fetchPopularPeople();
  }, []);

  // Pagination logic
  const indexOfLastPerson = currentPage * peoplePerPage;
  const indexOfFirstPerson = indexOfLastPerson - peoplePerPage;
  const currentPeople = popularPeople.slice(indexOfFirstPerson, indexOfLastPerson);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(popularPeople.length / peoplePerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-6 dark:bg-gray-900">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {currentPeople.map(person => (
          <div key={person.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <Link href={`/people/${person.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                alt={person.name}
                className="w-full h-[350px] object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{person.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {person.known_for.map((work, index) => (
                    <span key={index}>
                      {work.title || work.name}
                      {index < person.known_for.length - 1 && ', '}
                    </span>
                  ))}
                </p>
              </div>
            </Link>
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
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{currentPage} / {Math.ceil(popularPeople.length / peoplePerPage)}</span>
        <button 
          className={`px-4 py-2 border rounded-lg text-sm font-medium ${currentPage === Math.ceil(popularPeople.length / peoplePerPage) ? 'opacity-50 cursor-not-allowed' : ''} dark:border-gray-600 dark:text-gray-300 dark:bg-gray-800`} 
          onClick={handleNextPage} 
          disabled={currentPage === Math.ceil(popularPeople.length / peoplePerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PopularPeople;
