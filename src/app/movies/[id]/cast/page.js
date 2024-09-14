"use client";
import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../../../../lib/tmdbClient'; // تأكد من مسار استيراد tmdbClient
import Image from 'next/image';
import Link from 'next/link'; // استيراد Link للتنقل بين الصفحات

const Cast = ({ movieId }) => {
  const [cast, setCast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (movieId) {
      const fetchCast = async () => {
        try {
          const castData = await fetchFromTMDB(`/movie/${movieId}/credits`);
          if (castData && castData.cast) {
            setCast(castData.cast);
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to fetch cast:", error);
          setIsLoading(false);
        }
      };
      fetchCast();
    }
  }, [movieId]);

  if (isLoading) {
    return <div>Loading cast...</div>;
  }

  if (cast.length === 0) {
    return <div>No cast information available.</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Cast</h2>
      <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
        {cast.map((actor) => (
          <Link key={actor.id} href={`/people/${actor.id}`} passHref>
            <div className="min-w-[150px] bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-4 text-center cursor-pointer">
              <Image
                src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                alt={actor.name}
                width={100}
                height={150}
                className="rounded-lg"
              />
              <p className="mt-2 text-sm font-semibold">{actor.name}</p>
              <p className="text-xs text-gray-500">{actor.character}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Cast;
