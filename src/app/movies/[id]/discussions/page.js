// src/app/movies/[id]/discussions/page.js
"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchFromTMDB } from '../../../../lib/tmdbClient';

const Discussions = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const data = await fetchFromTMDB(`/movie/${id}`);
        if (data) {
          setMovie(data);
        }
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!movie) {
    return <div className="flex items-center justify-center min-h-screen">No movie details found.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Discussions for <span className="text-blue-500">{movie.title}</span>
          </h1>
          <p className="text-lg mb-4">
            Here you can participate in discussions about the movie.
          </p>
          <p className="text-lg mb-4">
            Be notified when someone makes the first post.
          </p>
          <Link href={`/movies/${id}`} className="text-gray-700 dark:text-gray-300 underline hover:text-blue-500">
            Back to Movie Details
          </Link>
        </section>

        {/* General Discussions Table */}
        <section className="mb-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap space-x-2 text-lg mb-4">
              <li><Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">Discuss</Link></li>
              <li><span className="text-gray-600 dark:text-gray-400">→ Movies</span></li>
              <li><span className="text-gray-600 dark:text-gray-400">→ {movie.title}</span></li>
              <li><span className="text-gray-600 dark:text-gray-400">→ General</span></li>
            </ol>
          </nav>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b">Subject</th>
                  <th className="py-3 px-4 border-b">Status</th>
                  <th className="py-3 px-4 border-b">Replies</th>
                  <th className="py-3 px-4 border-b">Last Reply</th>
                </tr>
              </thead>
              <tbody>
                {/* Example row */}
                <tr>
                  <td className="py-3 px-4 border-b">Example Subject</td>
                  <td className="py-3 px-4 border-b">Open</td>
                  <td className="py-3 px-4 border-b">5</td>
                  <td className="py-3 px-4 border-b">2024-09-13</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Content Issues Table */}
        <section>
          <nav aria-label="Breadcrumb" className="mt-4">
            <ol className="flex flex-wrap space-x-2 text-lg mb-4">
              <li><Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">Discuss</Link></li>
              <li><span className="text-gray-600 dark:text-gray-400">→ Movies</span></li>
              <li><span className="text-gray-600 dark:text-gray-400">→ {movie.title}</span></li>
              <li><span className="text-gray-600 dark:text-gray-400">→ Content Issues</span></li>
            </ol>
          </nav>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b">Subject</th>
                  <th className="py-3 px-4 border-b">Status</th>
                  <th className="py-3 px-4 border-b">Replies</th>
                  <th className="py-3 px-4 border-b">Last Reply</th>
                </tr>
              </thead>
              <tbody>
                {/* Example row */}
                <tr>
                  <td className="py-3 px-4 border-b">Example Issue</td>
                  <td className="py-3 px-4 border-b">Resolved</td>
                  <td className="py-3 px-4 border-b">2</td>
                  <td className="py-3 px-4 border-b">2024-09-12</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Discussions;
