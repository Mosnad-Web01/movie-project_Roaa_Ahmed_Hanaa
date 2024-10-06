"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchFromTMDB } from '../../../../lib/tmdbClient';
import ActorCard from '../../../../components/ActorCard'; // استدعاء مكون ActorCard
import ShowHeader from '../../../../components/ShowHeader'; // استدعاء مكون ShowHeader

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

  if (isLoading) {
    return <div>Loading full cast & crew...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      {show && <ShowHeader show={show} />} {/* استدعاء المكون هنا */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Cast</h2>
            <div className="flex flex-wrap gap-4">
              {cast.map((actor) => (
                <ActorCard 
                  key={actor.id} 
                  person={actor} 
                  character={actor.character} 
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Crew</h2>
            <div className="flex flex-wrap gap-4">
              {crew.map((member) => (
                <ActorCard 
                  key={member.id} 
                  person={member} 
                  character={member.job} 
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FullCastAndCrew;
