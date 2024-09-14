import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchFromTMDB } from '../lib/tmdbClient';
import Image from 'next/image';

const SearchResults = () => {
  const router = useRouter();
  const { query: { query } = {} } = router; // Correctly extracting the query parameter from the URL
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      const search = async () => {
        setLoading(true);
        try {
          // Fetching search results for movies, TV shows, or people
          const data = await fetchFromTMDB(`/search/multi?query=${query}`);
          if (data && data.results) {
            setResults(data.results);
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
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Search Results for: {query}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.length > 0 ? (
            results.map((item) => (
              <div key={item.id} className="bg-white p-4 shadow rounded">
                <h2 className="text-xl font-bold mb-2">{item.title || item.name}</h2>
                <p>{item.media_type}</p>
                {item.poster_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                    alt={item.title || item.name}
                    className="w-full h-auto rounded"
                    width={500}
                    height={750}
                  />
                )}
              </div>
            ))
          ) : (
            <p>No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
