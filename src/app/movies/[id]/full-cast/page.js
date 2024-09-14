"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchFromTMDB } from '../../../../lib/tmdbClient';
import Link from 'next/link';

const FullCastAndCrew = () => {
  const { id } = useParams();
  const router = useRouter();
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredActor, setHoveredActor] = useState(null); // For hover effect on cast
  const [hoveredCrewMember, setHoveredCrewMember] = useState(null); // For hover effect on crew

  useEffect(() => {
    const fetchData = async () => {
      try {
        const creditsData = await fetchFromTMDB(`/movie/${id}/credits`);
        if (creditsData) {
          setCast(creditsData.cast);
          setCrew(creditsData.crew);
        }

        const movieData = await fetchFromTMDB(`/movie/${id}`);
        if (movieData) {
          setMovie(movieData);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      console.error("No movie ID found.");
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return <div>Loading full cast & crew...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          {movie && (
            <>
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                className="w-24 h-36 object-cover rounded-lg mr-4"
              />
              <div>
                <h1 className="text-3xl font-bold">{movie.title}</h1>
                <button
                  onClick={() => router.back()}
                  className="mt-2 text-blue-500 hover:underline"
                >
                  &larr; Back to main
                </button>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Cast</h2>
            <div className="flex flex-wrap gap-4 relative">
              {cast.map((actor) => (
                <div
                  key={actor.id}
                  className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-4 text-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 relative"
                  onMouseEnter={() => setHoveredActor(actor)}
                  onMouseLeave={() => setHoveredActor(null)}
                >
                  <Link href={`/people/${actor.id}`}>
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                        alt={actor.name}
                        className="rounded-lg mb-2 cursor-pointer"
                        width={150}
                        height={225}
                      />
                    ) : (
                      <div className="w-24 h-36 bg-gray-300 dark:bg-gray-700 rounded-lg mb-2"></div>
                    )}
                  </Link>
                  <p className="font-semibold">{actor.name}</p>
                  <p className="text-sm text-gray-500">{actor.character}</p>
                  {hoveredActor === actor && (
                    <div className="absolute bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg top-full mt-2 left-1/2 transform -translate-x-1/2">
                      <p className="font-semibold">{actor.name}</p>
                      <p className="text-sm text-gray-500">{actor.character}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Crew</h2>
            <div className="flex flex-wrap gap-4 relative">
              {crew.map((member) => (
                <div
                  key={member.id}
                  className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-4 text-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 relative"
                  onMouseEnter={() => setHoveredCrewMember(member)}
                  onMouseLeave={() => setHoveredCrewMember(null)}
                >
                  <Link href={`/people/${member.id}`}>
                    {member.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${member.profile_path}`}
                        alt={member.name}
                        className="rounded-lg mb-2 cursor-pointer"
                        width={150}
                        height={225}
                      />
                    ) : (
                      <div className="w-24 h-36 bg-gray-300 dark:bg-gray-700 rounded-lg mb-2"></div>
                    )}
                  </Link>
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.job}</p>
                  {hoveredCrewMember === member && (
                    <div className="absolute bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg top-full mt-2 left-1/2 transform -translate-x-1/2">
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.job}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FullCastAndCrew;
