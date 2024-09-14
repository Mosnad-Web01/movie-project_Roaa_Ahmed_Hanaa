"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchFromTMDB } from '../../../lib/tmdbClient';
import Image from 'next/image';
import Cast from './cast/page'; // Ensure this component exists
import Link from 'next/link';
import SocialOptions from './SocialOptions'; // Ensure this component exists
import Media from './media/Media'; // Ensure this component exists
import Recommendations from './recommendations/Recommendations'; // Ensure this component exists
import { FaList, FaHeart, FaEye, FaStar, FaPlay } from 'react-icons/fa';
import ReactModal from 'react-modal';

const TVShowDetails = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState('');
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchShowDetails = async () => {
        try {
          const data = await fetchFromTMDB(`/tv/${id}`);
          if (data) {
            setShow(data);

            // Fetch trailers
            const videos = await fetchFromTMDB(`/tv/${id}/videos`);
            const trailer = videos.results.find(video => video.type === 'Trailer');
            if (trailer) {
              setTrailerKey(trailer.key);
            }
          }
          setIsLoading(false);
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

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const toggleOverview = () => setIsOverviewExpanded(!isOverviewExpanded);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!show) {
    return <div>No TV show details found.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* TV Show details */}
        <section className="mb-12">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/4 mb-8 lg:mb-0">
              <Image
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
                width={300}
                height={450}
                className="rounded-lg shadow-lg"
                layout="responsive"
              />
            </div>
            <div className="w-full lg:w-3/4 lg:ml-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {show.name} ({new Date(show.first_air_date).getFullYear()})
              </h1>
              <p className="text-md md:text-lg mb-4">Release Date: {new Date(show.first_air_date).toLocaleDateString()}</p>
              <p className="text-md md:text-lg mb-4">
                Runtime: {show.episode_run_time && show.episode_run_time.length > 0 
                  ? `${Math.floor(show.episode_run_time[0] / 60)}h ${show.episode_run_time[0] % 60}m` 
                  : 'N/A'}
              </p>

              <p className="text-md md:text-lg mb-4">Language: {show.original_language.toUpperCase()}</p>
              <p className="text-md md:text-lg mb-4">Rating: {show.vote_average} ({show.vote_count} votes)</p>
              <p className="text-md md:text-lg mb-4">Creator: {show.created_by && show.created_by.length > 0 ? show.created_by.map(creator => creator.name).join(', ') : 'N/A'}</p>
              <p className={`text-md md:text-lg mb-4 ${!isOverviewExpanded ? 'line-clamp-3' : ''}`}>
                {show.overview}
              </p>
              <button
                onClick={toggleOverview}
                className="text-blue-500 hover:underline mt-4"
              >
                {isOverviewExpanded ? 'Read Less' : 'Read More'}
              </button>

              {/* Production Companies */}
              {show.production_companies && show.production_companies.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl md:text-2xl font-bold mb-2">Production Companies</h2>
                  <div className="flex flex-wrap gap-6">
                    {show.production_companies.map(company => (
                      <div key={company.id} className="flex items-center mb-4">
                        {company.logo_path && (
                          <Image
                            src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                            alt={company.name}
                            width={100}
                            height={50}
                            className="mr-4"
                          />
                        )}
                        <p className="text-md md:text-lg">{company.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8">
                <ul className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
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

              <button
                onClick={openModal}
                className="bg-gray-700 dark:hover:bg-gray-500 text-white rounded-full py-2 px-6 mt-8 flex items-center justify-center hover:bg-gray-900 border border-gray-700"
              >
                <FaPlay className="mr-2" /> Play Trailer
              </button>
            </div>
          </div>
        </section>

        {/* Cast section */}
        <section>
          <Cast showId={id} />
        </section>

        {/* Divider */}
        <hr className="my-8 border-t border-gray-300 dark:border-gray-700" />

        {/* Full Cast & Crew */}
        <section className="mt-8">
          <Link href={`/tv/${id}/full-cast`} className="text-black dark:text-white text-lg font-semibold border-b-2 border-black dark:border-white inline-block pb-1">
            Full Cast & Crew
          </Link>
        </section>

        {/* Divider */}
        <hr className="my-8 border-t border-gray-300 dark:border-gray-700" />

        {/* Social Options */}
        <section className="text-left">
          <SocialOptions showId={id} />
        </section>

        {/* Media Section */}
        <section className="mt-8">
          <Media showId={id} />
        </section>

        {/* Recommendations Section */}
        <section>
          <Recommendations showId={id} />
        </section>

        {/* Trailer Modal */}
        <ReactModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Trailer"
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-70"
        >
          {trailerKey ? (
            <div className="relative w-full max-w-3xl">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-white text-2xl"
              >
                ×
              </button>
              <iframe
                width="100%"
                height="500"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="text-white">Trailer not available</div>
          )}
        </ReactModal>
      </div>
    </div>
  );
};

export default TVShowDetails;
