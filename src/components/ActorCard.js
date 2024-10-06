// src/components/ActorCard.js

import React, { useState } from 'react';
import { FaEllipsisH } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';


const ActorCard = ({ person, isLoggedIn, character }) => {
  const [dropdownVisible, setDropdownVisible] = useState(null);

  const toggleDropdown = (id, event) => {
    event.stopPropagation();
    setDropdownVisible(dropdownVisible === id ? null : id);
  };

  // Handle missing or invalid profile picture
  const profilePath = person.profile_path 
    ? `https://image.tmdb.org/t/p/w500${person.profile_path}` 
    : '/path/to/placeholder.jpg';

  const name = person.name || 'Unknown Actor';
  const knownFor = person.known_for 
    ? person.known_for.map(item => item.title || item.name).join(', ') 
    : 'Unknown';

  return (
    <div className="relative bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-md overflow-hidden w-[250px] h-[480px]">
      <div className="relative">
        <Link href={`/people/${person.id}`} passHref>
          <Image
            src={profilePath}
            alt={name}
            width={500}
            height={700}
            className={`w-full h-[350px] object-cover ${dropdownVisible === person.id ? 'filter blur-sm' : ''}`}
          />
        </Link>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        {character ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">Character: {character}</p> // عرض الشخصية إذا كانت موجودة
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400">Known for: {knownFor}</p> // عرض العناوين المعروفة إذا لم تكن الشخصية موجودة
        )}
      </div>
    </div>
  );
};

export default ActorCard;
