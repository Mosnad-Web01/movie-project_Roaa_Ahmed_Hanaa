import React, { useState, useEffect } from 'react';
import { FaHeart, FaEye, FaStar } from 'react-icons/fa';
import useAuth from '../lib/useAuth'; // استيراد حالة تسجيل الدخول

const DropdownMenu = ({ itemId, itemType }) => {
  const user = useAuth(); // التحقق من حالة المستخدم
  const [rating, setRating] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  useEffect(() => {
    if (user) {
      if (!['movie', 'tv'].includes(itemType)) {
        console.error('Invalid itemType:', itemType);
        return;
      }

      const key = `${itemType}-${itemId}`;
      console.log('Fetching data for key:', key); // Print the key for debugging
      const storedData = localStorage.getItem(key);
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setRating(parsedData.rating || null);
          setIsFavorite(!!parsedData.favorite);
          setIsWatchlisted(!!parsedData.watchlist);
        } catch (error) {
          console.error('Error parsing stored data:', error);
        }
      } else {
        setRating(null);
        setIsFavorite(false);
        setIsWatchlisted(false);
      }
    }
  }, [itemId, itemType, user]);

  const handleActionClick = (action) => {
    if (!user) {
      alert('You must be logged in to perform this action.');
      return;
    }

    if (!['movie', 'tv'].includes(itemType)) {
      console.error('Invalid itemType:', itemType);
      return;
    }

    const key = `${itemType}-${itemId}`;
    console.log('Action key:', key); // Print the key for debugging
    const storedData = JSON.parse(localStorage.getItem(key)) || {};
    const actionKey = action.toLowerCase().replace(' ', '_');

    storedData[actionKey] = true;
    try {
      localStorage.setItem(key, JSON.stringify({
        ...storedData,
        itemType // تخزين نوع العنصر
      }));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
    alert(`Done: ${action}`);

    // تحديث حالة العناصر بعد الإضافة
    if (action === 'Favorite') setIsFavorite(true);
    if (action === 'Watchlist') setIsWatchlisted(true);
  };

  const handleRatingClick = (newRating) => {
    if (!user) {
      alert('You must be logged in to rate.');
      return;
    }

    if (!['movie', 'tv'].includes(itemType)) {
      console.error('Invalid itemType:', itemType);
      return;
    }

    const key = `${itemType}-${itemId}`;
    console.log('Rating key:', key); // Print the key for debugging
    const storedData = JSON.parse(localStorage.getItem(key)) || {};
    storedData.rating = newRating;
    try {
      localStorage.setItem(key, JSON.stringify({
        ...storedData,
        itemType // تخزين نوع العنصر
      }));
    } catch (error) {
      console.error('Error saving rating to localStorage:', error);
    }
    setRating(newRating);
    alert(`Rated: ${newRating} stars`);
  };

  return (
    <div className="relative">
      <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
        <ul>
          <li
            className={`px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center ${isFavorite ? 'text-gray-500' : ''}`}
            onClick={() => handleActionClick('Favorite')}
          >
            <FaHeart className="mr-2" /> {isFavorite ? 'Already favorited' : 'Favorite'}
          </li>
          <li
            className={`px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center ${isWatchlisted ? 'text-gray-500' : ''}`}
            onClick={() => handleActionClick('Watchlist')}
          >
            <FaEye className="mr-2" /> {isWatchlisted ? 'Already in watchlist' : 'Watchlist'}
          </li>
          <li className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center">
            <FaStar className="mr-2" /> Your rating
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`cursor-pointer ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  onClick={() => handleRatingClick(star)}
                />
              ))}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DropdownMenu;
