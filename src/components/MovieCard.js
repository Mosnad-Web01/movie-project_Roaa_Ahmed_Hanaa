import React, { useState } from 'react';
import { FaEllipsisH } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import DropdownMenu from './DropdownMenu'; 
import UserScore from './UserScore'; 

const MovieCard = ({ item, isLoggedIn, media_type }) => {
  const [dropdownVisible, setDropdownVisible] = useState(null);

  const toggleDropdown = (id, event) => {
    event.stopPropagation();
    setDropdownVisible(dropdownVisible === id ? null : id);
  };

  // Handle missing or invalid values
  const score = item.vote_average ? Math.round(item.vote_average * 10) : 0;
  const releaseDate = item.release_date ? new Date(item.release_date).toDateString() : 'Unknown Release Date';
  const name = item.title || item.name || 'Untitled';
  const posterPath = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/path/to/placeholder.jpg';

  return (
    <div className="relative bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-md overflow-hidden w-[300px] h-[450px]">
      <div className="relative">
      <Link href={`/${media_type === 'movie' || item.title ? 'movies' : 'tv'}/${item.id}`} passHref>
        <Image
          src={posterPath}
          alt={name}
          width={500}
          height={700}
          className={`w-full h-[350px] object-cover ${dropdownVisible === item.id ? 'filter blur-sm' : ''}`}
        />
      </Link>


        <div className="absolute bottom-2 left-2">
          <UserScore score={score} />
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{releaseDate}</p>
      </div>
       {/*
      <div className="absolute top-2 right-2">
        <button onClick={(event) => toggleDropdown(item.id, event)} className="focus:outline-none">
          <FaEllipsisH className="text-gray-600 dark:text-gray-400" />
        </button>

        {dropdownVisible === item.id && (
          <DropdownMenu itemId={item.id} itemType={media_type} /> // Pass media_type as itemType
        )}
      </div>
      */}
    </div>
  );
};

export default MovieCard;
