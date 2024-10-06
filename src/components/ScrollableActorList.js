// src/components/ScrollableActorList.js

import React from 'react';
import ActorCard from './ActorCard'; // تأكد من وجود ActorCard

const ScrollableActorList = ({ actors, isLoggedIn, toggleDropdown, dropdownVisible }) => {
  return (
    <div className="relative">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300">
        <div className="flex flex-nowrap space-x-4" style={{ width: actors.length * 250 }}>
          {actors.map(person => (
            <ActorCard
              key={person.id}
              person={person}
              isLoggedIn={isLoggedIn}
              character={person.character} // تمرير الشخصية هنا
              toggleDropdown={(event) => toggleDropdown(person.id, event)}
              dropdownVisible={dropdownVisible === person.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollableActorList;
