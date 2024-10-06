// src/components/ScrollableMovieList.js

import React from 'react';
import MovieCard from './MovieCard'; // تأكد من وجود MovieCard

const ScrollableMovieList = ({ content, isLoggedIn, toggleDropdown, dropdownVisible }) => {
  return (
    <div className="relative">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300">
        <div className="flex flex-nowrap space-x-4" style={{ width: content.length * 300 }}>
          {content.map(item => (
            <MovieCard
              key={item.id}
              item={item}
              isLoggedIn={isLoggedIn}
              media_type={item.media_type} // تأكد من تمرير media_type
              toggleDropdown={(event) => toggleDropdown(item.id, event)}
              dropdownVisible={dropdownVisible === item.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollableMovieList;
