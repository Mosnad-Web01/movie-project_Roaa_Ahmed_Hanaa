"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next'; // إضافة useTranslation

const Main = () => {
  const { t } = useTranslation(); // استخدام useTranslation للحصول على الدالة t
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [randomImage, setRandomImage] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/imageList.json')
      .then(response => response.json())
      .then(data => {
        const randomIndex = Math.floor(Math.random() * data.length);
        setRandomImage(`/images_show/${data[randomIndex]}`);
      });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const fetchSuggestions = async () => {
        const response = await fetch(`/Api?query=${searchQuery}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        } else {
          setSuggestions([]);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery) {
      const formattedQuery = searchQuery.toLowerCase();
      router.push(`/Search?query=${formattedQuery}`);
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
        <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">{t('Welcome.')}</h1>
        <p className="text-white text-base md:text-lg mb-8">
          {t('Millions of movies, TV shows and people to discover. Explore now.')}
        </p>
        <div className="relative w-full max-w-lg mx-auto">
          <input
            type="text"
            className="w-full px-4 py-3 rounded-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t('Search for a movie, tv show, person...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="absolute right-0 top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-500 to-green-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-white px-5 py-2.5 text-center"
            onClick={handleSearch}
          >
            {t('Search')}
          </button>
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white shadow-lg mt-1 rounded">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setSuggestions([]);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
