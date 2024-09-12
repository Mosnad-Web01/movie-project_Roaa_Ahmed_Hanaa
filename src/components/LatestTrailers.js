"use client";
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { fetchFromTMDB } from '../lib/tmdbClient'; // تأكد من أن هذه الدالة تجلب بيانات الأفلام بشكل صحيح

const LatestTrailers = () => {
  const [trailers, setTrailers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [filter, setFilter] = useState('popular'); // الفلتر الافتراضي هو "Popular"

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement('body'); // استخدام 'body' كعنصر للتطبيق لتفادي تحذيرات الوصول
    }
  }, []);

  useEffect(() => {
    const fetchLatestTrailers = async () => {
      try {
        let endpoint = '';

        // تحديد مسار الـ API بناءً على الفلتر
        switch (filter) {
          case 'popular':
            endpoint = '/movie/popular';
            break;
          case 'streaming':
            endpoint = '/movie/now_playing'; // أفلام متاحة للبث
            break;
          case 'on_tv':
            endpoint = '/tv/on_the_air'; // برامج تلفزيونية حالية
            break;
          case 'for_rent':
            endpoint = '/movie/upcoming'; // يمكنك استخدام API مناسب إذا كان متاحًا
            break;
          case 'in_theaters':
            endpoint = '/movie/now_playing'; // أفلام في السينما الآن
            break;
          default:
            endpoint = '/movie/popular';
        }

        // جلب البيانات بناءً على الفلتر
        const moviesData = await fetchFromTMDB(endpoint);
        const movieResults = moviesData.results || [];

        // جلب الترايلرز لكل فيلم عبر ID الفيلم
        const trailerPromises = movieResults.map(async (movie) => {
          const videoData = await fetchFromTMDB(`/movie/${movie.id}/videos`);
          return videoData.results.find((video) => video.type === 'Trailer' && video.site === 'YouTube');
        });

        const fetchedTrailers = await Promise.all(trailerPromises);
        setTrailers(fetchedTrailers.filter(Boolean)); // فلترة النتائج الغير موجودة
      } catch (error) {
        console.error("Error fetching trailers:", error);
      }
    };

    fetchLatestTrailers();
  }, [filter]); // جلب البيانات عند تغيير الفلتر

  const openModal = (trailer) => {
    setSelectedTrailer(trailer);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedTrailer(null);
    setIsOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-4"> {/* تغيير الخلفية والنص */}
      <h2 className="text-2xl font-bold mb-4">Latest Trailers</h2>

      {/* قائمة الفلاتر */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setFilter('popular')}
          className={`px-5 py-2.5 rounded-full ${filter === 'popular' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
        >
          Popular
        </button>
        <button
          onClick={() => setFilter('streaming')}
          className={`px-5 py-2.5 rounded-full ${filter === 'streaming' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
        >
          Streaming
        </button>
        <button
          onClick={() => setFilter('on_tv')}
          className={`px-5 py-2.5 rounded-full ${filter === 'on_tv' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
        >
          On TV
        </button>
        <button
          onClick={() => setFilter('for_rent')}
          className={`px-5 py-2.5 rounded-full ${filter === 'for_rent' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
        >
          For Rent
        </button>
        <button
          onClick={() => setFilter('in_theaters')}
          className={`px-5 py-2.5 rounded-full ${filter === 'in_theaters' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
        >
          In Theaters
        </button>
      </div>


      <div className="relative overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4">
          {trailers.length > 0 ? (
            trailers.map((trailer) => (
              <div key={trailer.id} className="relative rounded-md shadow-md overflow-hidden w-80 flex-shrink-0">
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={trailer.title || trailer.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="p-2">
                  <h3 className="text-lg font-bold">{trailer.title || trailer.name}</h3>
                  <p className="text-sm">{new Date(trailer.release_date).toDateString()}</p>
                </div>
                <button
                  onClick={() => openModal(trailer)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-4.576-2.608A1 1 0 009 9.383v5.233a1 1 0 001.576.815l4.576-2.608a1 1 0 000-1.632z" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <p>No trailers available for the selected category.</p>
          )}
        </div>
      </div>

      {/* نافذة عرض الـ Trailer */}
      <Modal
  isOpen={isOpen}
  onRequestClose={closeModal}
  contentLabel="Trailer"
  className="bg-gray-800 p-4 rounded-md w-full max-w-4xl mx-auto my-20" // زيادة العرض
  overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
>
  {selectedTrailer && (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4 text-white">{selectedTrailer.title || selectedTrailer.name}</h2>
      <iframe
        width="100%"
        height="400"
        src={`https://www.youtube.com/embed/${selectedTrailer.key}`}
        title={selectedTrailer.title || selectedTrailer.name}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <button onClick={closeModal} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
        Close
      </button>
    </div>
  )}
</Modal>


    </div>
  );
};

export default LatestTrailers;
