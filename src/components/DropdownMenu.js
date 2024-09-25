import React, { useState, useEffect } from 'react';
import { FaHeart, FaEye, FaStar } from 'react-icons/fa';
import useAuth from '../lib/useAuth';

const DropdownMenu = ({ itemId, itemType, itemName, itemPoster }) => {
  const user = useAuth(); // الحصول على معلومات المستخدم

  // تحقق إذا كان العنصر مضافًا إلى القوائم
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [rating, setRating] = useState(0); // حالة لتخزين التقييم

  useEffect(() => {
    // تحقق من وجود العنصر في التخزين المحلي للقوائم
    const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || {};
    const ratings = JSON.parse(localStorage.getItem('ratings')) || {};

    setIsFavorite(!!favorites[itemType]?.find(item => item.id === itemId));
    setIsWatchlisted(!!watchlist[itemType]?.find(item => item.id === itemId));
    
    // تعيين التقييم إذا كان موجودًا مسبقًا في التخزين المحلي
    const storedRating = ratings[itemType]?.find(item => item.id === itemId)?.rating || 0;
    setRating(storedRating);
  }, [itemId, itemType]);

  const handleLocalStorageAction = (actionType) => {
    if (!user) {
      alert('Please log in to perform this action.');
      return;
    }

    const listKey = actionType === 'Favorite' || actionType === 'RemoveFavorite' ? 'favorites' : 'watchlist';
    const list = JSON.parse(localStorage.getItem(listKey)) || {};
    const updatedList = list[itemType] || [];

    if (actionType === 'Favorite') {
      updatedList.push({ id: itemId, name: itemName, poster: itemPoster });
      localStorage.setItem(listKey, JSON.stringify({ ...list, [itemType]: updatedList }));
      setIsFavorite(true);
    } else if (actionType === 'RemoveFavorite') {
      const filteredList = updatedList.filter(item => item.id !== itemId);
      localStorage.setItem(listKey, JSON.stringify({ ...list, [itemType]: filteredList }));
      setIsFavorite(false);
    } else if (actionType === 'Watchlist') {
      updatedList.push({ id: itemId, name: itemName, poster: itemPoster });
      localStorage.setItem(listKey, JSON.stringify({ ...list, [itemType]: updatedList }));
      setIsWatchlisted(true);
    } else if (actionType === 'RemoveWatchlist') {
      const filteredList = updatedList.filter(item => item.id !== itemId);
      localStorage.setItem(listKey, JSON.stringify({ ...list, [itemType]: filteredList }));
      setIsWatchlisted(false);
    }
  };

  const handleLocalStorageRating = (star) => {
    if (!user) {
      alert('Please log in to rate this item.');
      return;
    }

    // تحديث حالة التقييم وحفظها في التخزين المحلي
    const ratings = JSON.parse(localStorage.getItem('ratings')) || {};
    const updatedRatings = ratings[itemType] || [];

    // تحديث أو إضافة التقييم
    const itemIndex = updatedRatings.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      updatedRatings[itemIndex].rating = star;
    } else {
      updatedRatings.push({ id: itemId, rating: star });
    }

    localStorage.setItem('ratings', JSON.stringify({ ...ratings, [itemType]: updatedRatings }));
    setRating(star);
  };

  return (
    <div className="relative">
      <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg z-50">
        <ul>
          <li
            className={`px-3 py-2 text-sm hover:bg-gray-500 cursor-pointer flex items-center ${isFavorite ? 'text-red-500' : ''}`}
            onClick={() => handleLocalStorageAction(isFavorite ? 'RemoveFavorite' : 'Favorite')}
          >
            <FaHeart className={`mr-2 ${isFavorite ? 'text-red-400' : ''}`} />
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </li>
          <li
            className={`px-3 py-2 text-sm hover:bg-gray-500 cursor-pointer flex items-center ${isWatchlisted ? 'text-blue-500' : ''}`}
            onClick={() => handleLocalStorageAction(isWatchlisted ? 'RemoveWatchlist' : 'Watchlist')}
          >
            <FaEye className={`mr-2 ${isWatchlisted ? 'text-blue-400' : ''}`} />
            {isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </li>
          <li className="px-3 py-2 text-sm hover:bg-gray-500 cursor-pointer flex items-center">
            <FaStar className="mr-2" /> Your rating
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`cursor-pointer ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  onClick={() => handleLocalStorageRating(star)}
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
