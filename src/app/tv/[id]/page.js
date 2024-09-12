"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchFromTMDB } from '../../../lib/tmdbClient';
import Image from 'next/image';
import Navbar from '../../../components/Navbar';

const TVShowDetails = () => {
  const { id } = useParams(); // الحصول على معرف المسلسل من useParams
  const [show, setShow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchShowDetails = async () => {
        try {
          const data = await fetchFromTMDB(`/tv/${id}`);
          if (data) {
            setShow(data);
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Failed to fetch TV show details:", error);
          setIsLoading(false);
        }
      };
      fetchShowDetails();
    } else {
      console.error("No TV show ID found.");
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!show) {
    return <div>No TV show details found.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <Navbar /> {/* الناف بار الرئيسي */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 mb-8 md:mb-0">
            <Image
              src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
              alt={show.name}
              width={300}
              height={450}
              className="rounded-lg shadow-lg"
              layout="responsive"
            />
          </div>
          <div className="md:w-3/4 md:ml-8">
            <h1 className="text-4xl font-bold mb-2">
              {show.name} ({new Date(show.first_air_date).getFullYear()})
            </h1>
            <p className="text-lg mb-4">{show.genres.map(genre => genre.name).join(', ')}</p>
            <p className="text-lg mb-4">{show.overview}</p>

            <div className="flex items-center mb-4">
              <button className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12h15m0 0l-9-9m9 9l-9 9" />
                </svg>
              </button>
              <button className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 mr-4">
                Play Trailer
              </button>
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Whats your Vibe?</h2>
              <div className="flex space-x-4">
                <button className="bg-green-500 rounded-full p-4 hover:scale-110 transform transition">
                  😄
                </button>
                <button className="bg-red-500 rounded-full p-4 hover:scale-110 transform transition">
                  😡
                </button>
                <button className="bg-blue-500 rounded-full p-4 hover:scale-110 transform transition">
                  🤯
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVShowDetails;
