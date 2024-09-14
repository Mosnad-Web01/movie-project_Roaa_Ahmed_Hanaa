// src/app/movies/[id]/SocialOptions.js
"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchFromTMDB } from '../../../lib/tmdbClient';
import Link from 'next/link';

const SocialOptions = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState('reviews');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const data = await fetchFromTMDB(`/movie/${id}`);
        if (data) {
          setMovieDetails(data);
        }
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
        setError("Failed to fetch movie details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen">{error}</div>;
  }

  return (
    <div className="mt-8 text-left">
      <div className="flex justify-start gap-4">
        <button
          onClick={() => setSelectedOption('reviews')}
          className={`text-lg font-semibold border-b-2 ${
            selectedOption === 'reviews' ? 'border-black dark:border-white' : 'border-transparent'
          }`}
        >
          Reviews
        </button>
        
        <button
          onClick={() => setSelectedOption('discussions')}
          className={`text-lg font-semibold border-b-2 ${
            selectedOption === 'discussions' ? 'border-black dark:border-white' : 'border-transparent'
          }`}
        >
          Discussions
        </button>
      </div>

      {selectedOption === 'reviews' && (
        <div className="mt-4">
          <Link href={`/movies/${id}/reviews`} className="text-gray-700 underline">
            Go to Reviews
          </Link>
        </div>
      )}

      {selectedOption === 'discussions' && (
        <div className="mt-4">
          <p className="text-lg">
            Want to be notified when someone makes the first post? 
            <input type="checkbox" className="ml-2" /> Yes, notify me!
          </p>
          <Link href={`/movies/${id}/discussions`} className="text-gray-700 underline">
            Go to Discussions
          </Link>
        </div>
      )}
    </div>
  );
};

export default SocialOptions;
