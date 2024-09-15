import React from 'react';
import { FaList, FaHeart, FaEye, FaStar } from 'react-icons/fa';

const DropdownMenu = ({ dropdownVisible, toggleDropdown, movieId }) => {
  return (
    <div className="absolute top-2 right-2">
      <button onClick={(event) => toggleDropdown(movieId, event)} className="focus:outline-none">
        <span className="text-gray-600 dark:text-gray-400">•••</span>
      </button>

      {dropdownVisible === movieId && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10">
          <ul>
            <li className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center text-sm">
              <FaList className="mr-2" /> Add to list
            </li>
            <li className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center text-sm">
              <FaHeart className="mr-2" /> Favorite
            </li>
            <li className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center text-sm">
              <FaEye className="mr-2" /> Watchlist
            </li>
            <li className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center text-sm">
              <FaStar className="mr-2" /> Your rating
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
