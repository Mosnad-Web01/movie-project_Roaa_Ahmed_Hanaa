// src/components/ShowHeader.js
import React from 'react';
import { useRouter } from 'next/navigation';

const ShowHeader = ({ show }) => {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="container mx-auto px-4 py-4 flex items-center">
        {show && (
          <>
            <img
              src={`https://image.tmdb.org/t/p/w200${show.poster_path}`}
              alt={show.name}
              className="w-24 h-36 object-cover rounded-lg mr-4"
            />
            <div>
              <h1 className="text-3xl font-bold">{show.name}</h1>
              <p className="text-sm text-gray-600">{show.media_type ? show.media_type.charAt(0).toUpperCase() + show.media_type.slice(1) : 'Item'}</p>
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
    </div>
  );
};

export default ShowHeader;
