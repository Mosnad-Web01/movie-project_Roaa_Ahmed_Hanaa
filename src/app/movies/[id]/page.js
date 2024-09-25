"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchFromTMDB } from '../../../lib/tmdbClient';
import Image from 'next/image';
import Cast from './cast/page';
import Link from 'next/link';
import SocialOptions from './SocialOptions';
import Media from './media/Media';
import Recommendations from './recommendations/Recommendations';
import { FaList, FaHeart, FaEye, FaStar, FaPlay } from 'react-icons/fa';
import ReactModal from 'react-modal';
import useAuth from '../../../lib/useAuth';
import { useTranslation } from 'react-i18next'; // استيراد مكتبة i18next للترجمة

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState('');
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
  const [overviewTooLong, setOverviewTooLong] = useState(false);
  const { i18n } = useTranslation(); // جلب اللغة الحالية من i18next

  useEffect(() => {
    if (id) {
      const fetchMovieDetails = async () => {
        try {
          // إضافة اللغة إلى الفيتش
          const data = await fetchFromTMDB(`/movie/${id}`, i18n.language);
          if (data) {
            setMovie(data);

            // Fetch credits to get the director
            const credits = await fetchFromTMDB(`/movie/${id}/credits`, i18n.language);
            const director = credits.crew.find(member => member.job === 'Director');
            data.director = director ? director : null; // Add director info to movie object

            // Check if the overview is too long
            const overviewLengthThreshold = 300; // Adjust the threshold as needed
            if (data.overview.length > overviewLengthThreshold) {
              setOverviewTooLong(true);
            }

            // Fetch trailers
            const videos = await fetchFromTMDB(`/movie/${id}/videos`, i18n.language);
            const trailer = videos.results.find(video => video.type === 'Trailer');
            if (trailer) {
              setTrailerKey(trailer.key);
            }
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to fetch movie details:", error);
          setIsLoading(false);
        }
      };
      fetchMovieDetails();
    } else {
      console.error("No movie ID found.");
      setIsLoading(false);
    }
  }, [id, i18n.language]); // إضافة i18n.language كمراقب

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!movie) {
    return <div>No movie details found.</div>;
  }

  const toggleOverview = () => setIsOverviewExpanded(!isOverviewExpanded);

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Movie details */}
        <section className="mb-12">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/4 mb-8 lg:mb-0">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={300}
                height={450}
                className="rounded-lg shadow-lg"
                layout="responsive"
              />
            </div>
            <div className="w-full lg:w-3/4 lg:ml-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {movie.title} ({new Date(movie.release_date).getFullYear()})
              </h1>
              {/* عرض نوع الفيلم هنا */}
              {movie.genres && movie.genres.length > 0 && (
                <p className="text-md md:text-lg mb-4">
                  {i18n.t('Genres')}: {movie.genres.map(genre => genre.name).join(', ')}
                </p>
              )}
              <p className="text-md md:text-lg mb-4">{i18n.t('Release Date')}: {new Date(movie.release_date).toLocaleDateString()}</p>
              <p className="text-md md:text-lg mb-4">{i18n.t('Runtime')}: {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</p>
              <p className="text-md md:text-lg mb-4">{i18n.t('Language')}: {movie.original_language.toUpperCase()}</p>
              <p className="text-md md:text-lg mb-4">{i18n.t('Rating')}: {movie.vote_average} ({movie.vote_count} votes)</p>
              <p className="text-md md:text-lg mb-4">{i18n.t('Director')}: {movie.director ? movie.director.name : 'N/A'}</p>
              <p className={`text-md md:text-lg mb-4 ${!isOverviewExpanded && overviewTooLong ? 'line-clamp-3' : ''}`}>
                {movie.overview}
              </p>
              {overviewTooLong && (
                <button
                  onClick={toggleOverview}
                  className="text-blue-500 hover:underline mt-4"
                >
                  {isOverviewExpanded ? i18n.t('Read Less') : i18n.t('Read More')}
                </button>
              )}

              {/* Production Companies */}
              {movie.production_companies && movie.production_companies.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl md:text-2xl font-bold mb-2">{i18n.t('Production Companies')}</h2>
                  <div className="flex flex-wrap gap-6">
                    {movie.production_companies.map(company => (
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
                <ul className="flex flex-wrap sm:flex-nowrap space-x-4">
                  <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center">
                    <FaList className="mr-2" /> {i18n.t('Add to list')}
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center">
                    <FaHeart className="mr-2" /> {i18n.t('Favorite')}
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center">
                    <FaEye className="mr-2" /> {i18n.t('Watchlist')}
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center">
                    <FaStar className="mr-2" /> {i18n.t('Your rating')}
                  </li>
                </ul>
              </div>

              <button
                onClick={openModal}
                className="bg-gray-700 dark:hover:bg-gray-500 text-white rounded-full py-2 px-6 mt-8 flex items-center justify-center hover:bg-gray-900 border border-gray-700"
              >
                <FaPlay className="mr-2" /> {i18n.t('Play Trailer')}
              </button>
            </div>
          </div>
        </section>

        {/* Cast section */}
        <section>
          <Cast movieId={id} />
        </section>

        {/* Divider */}
        <hr className="my-8 border-t border-gray-300 dark:border-gray-700" />

        {/* Full Cast & Crew */}
        <section className="mt-8">
          <Link href={`/movies/${id}/full-cast`} className="text-black dark:text-white text-lg font-semibold border-b-2 border-black dark:border-white inline-block pb-1">
            {i18n.t('Full Cast & Crew')}
          </Link>
        </section>

        {/* Divider */}
        <hr className="my-8 border-t border-gray-300 dark:border-gray-700" />

        {/* Social Options */}
        <section className="text-lg mt-8">
          <SocialOptions movieId={id} />
        </section>
        
          {/* Media Section */}
          <section className="mt-8">
          <Media movieId={id} />
        </section>

        {/* Recommendations */}
        <section className="mt-8">
          <Recommendations movieId={id} />
        </section>
        
        
        {/* Modal for Trailer */}
        <ReactModal isOpen={modalIsOpen} onRequestClose={closeModal}>
          <div className="relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-700 hover:text-gray-900">
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4">{i18n.t('Trailer')}</h2>
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title={movie.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </ReactModal>
      </div>
    </div>
  );
};

export default MovieDetails;
