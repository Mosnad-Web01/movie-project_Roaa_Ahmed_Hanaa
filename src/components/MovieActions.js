import React, { useState, useEffect } from 'react';
import { FaList, FaHeart, FaEye, FaStar } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import useAuth from '../lib/useAuth';

const MovieActions = ({ movieId, movieName, moviePoster, movieType }) => {
  const { i18n } = useTranslation();
  const user = useAuth();
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchlist, setIsWatchlist] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showListOptions, setShowListOptions] = useState(false); // حالة لإظهار قائمة الخيارات
  const [lists, setLists] = useState([]); // قائمة القوائم المتاحة
  const [selectedList, setSelectedList] = useState(''); // القائمة المحددة

  // جلب البيانات المخزنة من localStorage
  useEffect(() => {
    const listData = JSON.parse(localStorage.getItem('list')) || [];
    const favoriteData = JSON.parse(localStorage.getItem('favorites')) || [];
    const watchlistData = JSON.parse(localStorage.getItem('watchlist')) || [];
    const ratingData = JSON.parse(localStorage.getItem('ratings')) || {};
    const storedLists = JSON.parse(localStorage.getItem('lists')) || [];

    setIsAdded(listData.some(item => item.id === movieId));
    setIsFavorite(favoriteData.some(item => item.id === movieId));
    setIsWatchlist(watchlistData.some(item => item.id === movieId));
    setUserRating(ratingData[movieId] || 0);
    setLists(storedLists); // تعيين القوائم المخزنة
  }, [movieId]);

  const handleAddToList = () => {
    if (!user) return alert('You need to be logged in!');

    let listData = JSON.parse(localStorage.getItem(selectedList) || '[]');

    // التحقق مما إذا كان العنصر قد تم إضافته بالفعل إلى القائمة المحددة
    if (isAdded) {
      const updatedList = listData.filter(item => item.id !== movieId);
      localStorage.setItem(selectedList, JSON.stringify(updatedList));
      setIsAdded(false);
    } else {
      const newItem = {
        id: movieId,
        name: movieName,
        type: movieType,
        poster: moviePoster,
        media_type: movieType
      };
      listData.push(newItem); // إضافة العنصر الجديد إلى القائمة
      localStorage.setItem(selectedList, JSON.stringify(listData)); // تخزين القائمة المحدثة
      setIsAdded(true);
    }
  };

  const handleAddToFavorites = () => {
    if (!user) return alert('You need to be logged in!');

    let favoriteData = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      const updatedFavorites = favoriteData.filter(item => item.id !== movieId);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      favoriteData.push({
        id: movieId,
        name: movieName,
        type: movieType,
        poster: moviePoster,
        media_type: movieType
      });
      localStorage.setItem('favorites', JSON.stringify(favoriteData));
      setIsFavorite(true);
    }
  };

  const handleAddToWatchlist = () => {
    if (!user) return alert('You need to be logged in!');

    let watchlistData = JSON.parse(localStorage.getItem('watchlist') || '[]');
    if (isWatchlist) {
      const updatedWatchlist = watchlistData.filter(item => item.id !== movieId);
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      setIsWatchlist(false);
    } else {
      watchlistData.push({
        id: movieId,
        name: movieName,
        type: movieType,
        poster: moviePoster,
        media_type: movieType
      });
      localStorage.setItem('watchlist', JSON.stringify(watchlistData));
      setIsWatchlist(true);
    }
  };

  const handleRating = (rating) => {
    if (!user) return alert('You need to be logged in!');

    const ratingData = JSON.parse(localStorage.getItem('ratings') || '{}');
    if (userRating === rating) {
      delete ratingData[movieId];
      setUserRating(0);
    } else {
      ratingData[movieId] = rating;
      setUserRating(rating);
    }
    localStorage.setItem('ratings', JSON.stringify(ratingData));
  };

  return (
    <div className="mt-8">
      <ul className="flex flex-wrap sm:flex-nowrap space-x-4">
        <li
          className="relative px-4 py-2 hover:bg-gray-500 dark:hover:bg-gray-700 cursor-pointer flex items-center"
          onClick={() => setShowListOptions(!showListOptions)} // عكس حالة ظهور القائمة
        >
          <FaList className={`mr-2 ${isAdded ? 'text-gray-500' : ''}`} />
          {i18n.t(isAdded ? 'Already in List' : 'Add to list')}
          {showListOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2">
              <select 
                value={selectedList} 
                onChange={(e) => setSelectedList(e.target.value)} 
                className="w-full p-2 border rounded-md mb-2"
              >
                <option value="">Select a list</option>
                {lists.map((list, index) => (
                  <option key={index} value={list}>{list}</option>
                ))}
              </select>
              <button 
                onClick={handleAddToList} 
                className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={!selectedList}
              >
                <FaList className={`mr-2 ${isAdded ? 'text-gray-500' : ''}`} />
                {i18n.t(isAdded ? 'Remove from List' : 'Add to List')}
              </button>
            </div>
          )}
        </li>
        <li 
          className="px-4 py-2 hover:bg-gray-500 dark:hover:bg-gray-700 cursor-pointer flex items-center"
          onClick={handleAddToFavorites}
        >
          <FaHeart className={`mr-2 ${isFavorite ? 'text-gray-500' : ''}`} />
          {i18n.t(isFavorite ? 'Already in Favorites' : 'Favorite')}
        </li>
        <li 
          className="px-4 py-2 hover:bg-gray-500 dark:hover:bg-gray-700 cursor-pointer flex items-center"
          onClick={handleAddToWatchlist}
        >
          <FaEye className={`mr-2 ${isWatchlist ? 'text-gray-500' : ''}`} />
          {i18n.t(isWatchlist ? 'Already in Watchlist' : 'Watchlist')}
        </li>
        <li className="px-4 py-2 flex items-center">
          <span className="mr-2">{i18n.t('Your rating')}:</span>
          {[1, 2, 3, 4, 5].map(star => (
            <FaStar
              key={star}
              className={`mr-1 cursor-pointer ${star <= userRating ? 'text-yellow-500' : 'text-gray-400'}`}
              onClick={() => handleRating(star)}
            />
          ))}
        </li>
      </ul>
    </div>
  );
};

export default MovieActions;
