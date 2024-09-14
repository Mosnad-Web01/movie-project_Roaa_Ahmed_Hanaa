import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../../../../lib/tmdbClient';
import Link from 'next/link';
import Image from 'next/image';

const Recommendations = ({ movieId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (movieId) {
      const fetchRecommendations = async () => {
        try {
          const data = await fetchFromTMDB(`/movie/${movieId}/recommendations`);
          if (data && data.results) {
            setRecommendations(data.results);
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to fetch recommendations:", error);
          setIsLoading(false);
        }
      };
      fetchRecommendations();
    }
  }, [movieId]);

  if (isLoading) {
    return <div>Loading recommendations...</div>;
  }

  if (!recommendations.length) {
    return <div>No recommendations available.</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Recommended Movies</h2>
      <div className="flex space-x-4 overflow-x-auto no-scrollbar">
        {recommendations.map((movie) => (
          <div key={movie.id} className="min-w-[150px] bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-2 flex-shrink-0">
            <Link href={`/movies/${movie.id}`}>
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={150}
                height={225}
                className="rounded-md object-cover"
              />
              <h3 className="text-sm mt-2 font-semibold text-center">{movie.title}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
