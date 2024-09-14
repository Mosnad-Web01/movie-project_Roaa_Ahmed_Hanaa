"use client";
import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../../../../lib/tmdbClient';

const Media = ({ movieId }) => {
  const [mostPopularVideos, setMostPopularVideos] = useState([]);
  const [backdrops, setBackdrops] = useState([]);
  const [posters, setPosters] = useState([]);
  const [selectedSection, setSelectedSection] = useState('popular'); // default section is 'popular'

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        console.log("Fetching media for movieId:", movieId);

        // Fetch video data
        const videoData = await fetchFromTMDB(`/movie/${movieId}/videos`);
        setMostPopularVideos(videoData?.results || []);

        // Fetch images data
        const imageData = await fetchFromTMDB(`/movie/${movieId}/images`);
        setBackdrops(imageData?.backdrops || []);
        setPosters(imageData?.posters || []);
      } catch (error) {
        console.error("Failed to fetch media:", error);
      }
    };

    if (movieId) {
      fetchMedia(); // Fetch media if movieId is available
    }
  }, [movieId]);

  if (!movieId) {
    return <div className="text-center p-4">No movie ID provided.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Media</h2>

        {/* Section Navigation */}
        <div className="flex flex-wrap space-x-4 mb-6">
          <button
            onClick={() => setSelectedSection('popular')}
            className={`py-2 px-4 text-xl font-semibold rounded-t-lg transition-all ${selectedSection === 'popular' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'}`}
          >
            Most Popular
          </button>
          <button
            onClick={() => setSelectedSection('videos')}
            className={`py-2 px-4 text-xl font-semibold rounded-t-lg transition-all ${selectedSection === 'videos' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'}`}
          >
            Videos
          </button>
          <button
            onClick={() => setSelectedSection('backdrops')}
            className={`py-2 px-4 text-xl font-semibold rounded-t-lg transition-all ${selectedSection === 'backdrops' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'}`}
          >
            Backdrops
          </button>
          <button
            onClick={() => setSelectedSection('posters')}
            className={`py-2 px-4 text-xl font-semibold rounded-t-lg transition-all ${selectedSection === 'posters' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'}`}
          >
            Posters
          </button>
        </div>

        {/* Media Content */}
        <div>
          {selectedSection === 'popular' && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Most Popular</h3>
              <div className="flex space-x-4 overflow-x-auto p-4">
                {mostPopularVideos.slice(0, 5).map((video) => (
                  <iframe
                    key={video.id}
                    width="300"
                    height="200"
                    src={`https://www.youtube.com/embed/${video.key}`}
                    frameBorder="0"
                    allowFullScreen
                    className="rounded-lg shadow-lg"
                  ></iframe>
                ))}
                {backdrops.slice(0, 5).map((backdrop) => (
                  <img
                    key={backdrop.file_path}
                    src={`https://image.tmdb.org/t/p/w500${backdrop.file_path}`}
                    alt="Backdrop"
                    className="rounded-lg shadow-lg min-w-[200px] h-[120px] object-cover"
                  />
                ))}
                {posters.slice(0, 5).map((poster) => (
                  <img
                    key={poster.file_path}
                    src={`https://image.tmdb.org/t/p/w500${poster.file_path}`}
                    alt="Poster"
                    className="rounded-lg shadow-lg min-w-[200px] h-[300px] object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          {selectedSection === 'videos' && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Videos</h3>
              <div className="flex space-x-4 overflow-x-auto p-4">
                {mostPopularVideos.map((video) => (
                  <iframe
                    key={video.id}
                    width="300"
                    height="200"
                    src={`https://www.youtube.com/embed/${video.key}`}
                    frameBorder="0"
                    allowFullScreen
                    className="rounded-lg shadow-lg"
                  ></iframe>
                ))}
              </div>
            </div>
          )}

          {selectedSection === 'backdrops' && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Backdrops</h3>
              <div className="flex space-x-4 overflow-x-auto p-4">
                {backdrops.map((backdrop) => (
                  <img
                    key={backdrop.file_path}
                    src={`https://image.tmdb.org/t/p/w500${backdrop.file_path}`}
                    alt="Backdrop"
                    className="rounded-lg shadow-lg min-w-[200px] h-[120px] object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          {selectedSection === 'posters' && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Posters</h3>
              <div className="flex space-x-4 overflow-x-auto p-4">
                {posters.map((poster) => (
                  <img
                    key={poster.file_path}
                    src={`https://image.tmdb.org/t/p/w500${poster.file_path}`}
                    alt="Poster"
                    className="rounded-lg shadow-lg min-w-[200px] h-[300px] object-cover"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Media;
