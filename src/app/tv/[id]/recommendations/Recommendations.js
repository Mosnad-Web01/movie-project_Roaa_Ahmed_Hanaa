import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../../../../lib/tmdbClient';
import Link from 'next/link';
import Image from 'next/image';

const Recommendations = ({ showId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (showId) {
      const fetchRecommendations = async () => {
        try {
          const data = await fetchFromTMDB(`/tv/${showId}/recommendations`);
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
  }, [showId]);

  if (isLoading) {
    return <div>Loading recommendations...</div>;
  }

  if (!recommendations.length) {
    return <div>No recommendations available.</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Recommended TV Shows</h2>
      <div className="flex space-x-4 overflow-x-auto no-scrollbar">
        {recommendations.map((show) => (
          <div key={show.id} className="min-w-[150px] bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-2 flex-shrink-0">
            <Link href={`/tv/${show.id}`}>
              <Image
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
                width={150}
                height={225}
                className="rounded-md object-cover"
              />
              <h3 className="text-sm mt-2 font-semibold text-center">{show.name}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
