"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const Main = () => {
  const [randomImage, setRandomImage] = useState('');

  useEffect(() => {
    // Fetch the list of images
    fetch('/imageList.json')
      .then(response => response.json())
      .then(data => {
        // Pick a random image from the list
        const randomIndex = Math.floor(Math.random() * data.length);
        setRandomImage(`/images_show/${data[randomIndex]}`);
      });
  }, []);

  return (
    <div className="relative bg-blue-700 py-16">
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
      <div className="relative z-20 container mx-auto px-4 text-left">
        <h1 className="text-white text-4xl font-bold mb-4">Welcome.</h1>
        <p className="text-white text-lg mb-8">
          Millions of movies, TV shows and people to discover. Explore now.
        </p>
        <div className="relative w-full max-w-lg mx-auto">
          <input
            type="text"
            className="w-full px-4 py-3 rounded-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for a movie, tv show, person......"
          />
          <button
            className="absolute right-0 top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-500 to-green-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-white px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
