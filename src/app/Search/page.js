"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchTMDB } from '../../lib/searchClient';
import Image from 'next/image';
import Link from 'next/link';

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      const search = async () => {
        setLoading(true);
        try {
          const data = await searchTMDB(query);
          console.log('Search data:', data);
          if (data && data.results) {
            setResults(data.results);
          } else {
            console.log('No results found in data:', data);
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
        } finally {
          setLoading(false);
        }
      };
      search();
    }
  }, [query]);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-4">Search Results for: {query}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.length > 0 ? (
            results.map((item) => {
              const isMovie = item.media_type === 'movie';
              const isTV = item.media_type === 'tv';
              const isPerson = item.media_type === 'person';
              const itemLink = isMovie ? `/movies/${item.id}` : isTV ? `/tv/${item.id}` : isPerson ? `/people/${item.id}` : '#';

              return (
                <div key={item.id} className="bg-gray-100 dark:bg-gray-800 p-4 shadow rounded">
                  <Link href={itemLink} className="block">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500/${item.poster_path || item.profile_path}`}
                      alt={item.title || item.name}
                      className="w-full h-auto rounded"
                      width={500}
                      height={750}
                    />
                  </Link>
                  <div className="mt-2 text-center">
                    <h2 className="text-xl font-bold mb-2">{item.title || item.name}</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {isMovie ? 'Movie' : isTV ? 'TV Show' : isPerson ? 'Person' : 'Unknown'}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
