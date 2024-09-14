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
  const [show, setShow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const creditsData = await fetchFromTMDB(`/tv/${id}/credits`);
        if (creditsData) {
          setCast(creditsData.cast);
          setCrew(creditsData.crew);
        }

        const showData = await fetchFromTMDB(`/tv/${id}`);
        if (showData) {
          setShow(showData);
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
      console.error("No show ID found.");
      setIsLoading(false);
    }
  }, [id]);

  const handleActorClick = (actor) => {
    router.push(`/people/${actor.id}`);
  };

  if (isLoading) {
    return <div>Loading full cast & crew...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          {show && (
            <>
              <img
                src={`https://image.tmdb.org/t/p/w200${show.poster_path}`}
                alt={show.name}
                className="w-24 h-36 object-cover rounded-lg mr-4"
              />
              <div>
                <h1 className="text-3xl font-bold">{show.name}</h1>
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
            <div className="flex flex-wrap gap-4">
              {cast.map((actor) => (
                <div 
                  key={actor.id} 
                  className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-4 text-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 relative"
                  onClick={() => handleActorClick(actor)}
                  style={{ cursor: 'pointer' }}
                >
                  {actor.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                      alt={actor.name}
                      className="rounded-lg mb-2 transition-transform transform hover:scale-105"
                      width={150}
                      height={225}
                    />
                  ) : (
                    <div className="w-24 h-36 bg-gray-300 dark:bg-gray-700 rounded-lg mb-2"></div>
                  )}
                  <p className="font-semibold">{actor.name}</p>
                  <p className="text-sm text-gray-500">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Crew</h2>
            <div className="flex flex-wrap gap-4">
              {crew.map((member) => (
                <div 
                  key={member.id} 
                  className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-4 text-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 relative"
                  onClick={() => handleActorClick(member)}
                  style={{ cursor: 'pointer' }}
                >
                  {member.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${member.profile_path}`}
                      alt={member.name}
                      className="rounded-lg mb-2 transition-transform transform hover:scale-105"
                      width={150}
                      height={225}
                    />
                  ) : (
                    <div className="w-24 h-36 bg-gray-300 dark:bg-gray-700 rounded-lg mb-2"></div>
                  )}
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.job}</p>
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
