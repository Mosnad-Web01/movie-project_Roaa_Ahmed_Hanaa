"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // إذا كنت تستخدم Next.js 13+

const Main = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [randomImage, setRandomImage] = useState('');
  const router = useRouter(); // استخدام useRouter هنا

  useEffect(() => {
    // Fetch the list of images
    fetch('/imageList.json')
      .then(response => response.json())
      .then(data => {
        const randomIndex = Math.floor(Math.random() * data.length);
        setRandomImage(`/images_show/${data[randomIndex]}`);
      });
  }, []);

  const handleSearch = () => {
    if (searchQuery) {
      const formattedQuery = searchQuery.toLowerCase(); // تحويل الاستعلام إلى حروف صغيرة
      router.push(`/Search?query=${formattedQuery}`); // استخدم S الكبيرة هنا
    }
  };

  return (
    <div className="relative bg-blue-700 py-16 px-4 sm:px-6 lg:px-8">
      {randomImage && (
        <>
          <Image
            src={randomImage}
            alt="Random background"
            layout="fill"
            objectFit="cover"
            className="absolute top-0 left-0 z-0"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-blue-500 bg-opacity-40 z-10"></div>
        </>
      )}
      <div className="relative z-20 max-w-3xl mx-auto text-center md:text-left">
        <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">Welcome.</h1>
        <p className="text-white text-base md:text-lg mb-8">
          Millions of movies, TV shows and people to discover. Explore now.
        </p>
        <div className="relative w-full max-w-lg mx-auto">
          <input
            type="text"
            className="w-full px-4 py-3 rounded-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for a movie, tv show, person..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="absolute right-0 top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-500 to-green-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-white px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
