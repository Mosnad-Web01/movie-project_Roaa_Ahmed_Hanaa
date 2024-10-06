import React, { useState, useEffect } from 'react';
import { FaList, FaHeart, FaStar, FaEye } from 'react-icons/fa'; 
import useAuth from '../lib/useAuth';

const DropdownMenu = ({ itemId, itemType, itemName, itemPoster }) => {
  const user = useAuth();  // Get the current authenticated user
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchlist, setIsWatchlist] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [lists, setLists] = useState([]); // Store available lists
  const [newListName, setNewListName] = useState(''); // Store the name of the new list
  const [selectedList, setSelectedList] = useState(''); // Store the selected list

  // Fetch stored data from localStorage
  useEffect(() => {
    const listData = JSON.parse(localStorage.getItem('list')) || [];
    const favoriteData = JSON.parse(localStorage.getItem('favorites')) || [];
    const watchlistData = JSON.parse(localStorage.getItem('watchlist')) || [];
    const ratingData = JSON.parse(localStorage.getItem('ratings')) || {};
    const storedLists = JSON.parse(localStorage.getItem('lists')) || [];

    setIsAdded(Array.isArray(listData) && listData.some(item => item.id === itemId));
    setIsFavorite(Array.isArray(favoriteData) && favoriteData.some(item => item.id === itemId));
    setIsWatchlist(Array.isArray(watchlistData) && watchlistData.some(item => item.id === itemId));
    setUserRating(ratingData[itemId] || 0);
    setLists(storedLists);
  }, [itemId]);

  const handleAddToList = () => {
    if (!user) return alert('You need to be logged in!');

    let listData = JSON.parse(localStorage.getItem(selectedList) || '[]');

    console.log("Current selected list:", selectedList); // Check selected list
    console.log("List data before update:", listData); // Check existing list data

    // Check if item is already added to the selected list
    if (isAdded) {
        const updatedList = listData.filter(item => item.id !== itemId);
        localStorage.setItem(selectedList, JSON.stringify(updatedList));
        setIsAdded(false);
    } else {
        const newItem = {
            id: itemId,
            name: itemName,
            type: itemType,
            poster: itemPoster,
            media_type: itemType
        };
        listData.push(newItem); // Add new item to the list
        localStorage.setItem(selectedList, JSON.stringify(listData)); // Store updated list
        setIsAdded(true);
    }
    
    console.log("List data after update:", JSON.parse(localStorage.getItem(selectedList))); // Check updated list data
};

  // Handle creating a new list
  const handleCreateNewList = () => {
    if (!newListName) return alert('Please enter a list name');
    
    let newLists = [...lists, newListName];
    setLists(newLists);
    setSelectedList(newListName);
    localStorage.setItem('lists', JSON.stringify(newLists));
    setNewListName('');
  };

  const handleAddToFavorites = () => {
    if (!user) return alert('You need to be logged in!');

    let favoriteData = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!Array.isArray(favoriteData)) favoriteData = [];

    if (isFavorite) {
      const updatedFavorites = favoriteData.filter(item => item.id !== itemId);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      favoriteData.push({ 
        id: itemId, 
        name: itemName, 
        type: itemType, 
        poster: itemPoster, 
        media_type: itemType
      });
      localStorage.setItem('favorites', JSON.stringify(favoriteData));
      setIsFavorite(true);
    }
  };

  const handleAddToWatchlist = () => {
    if (!user) return alert('You need to be logged in!');

    let watchlistData = JSON.parse(localStorage.getItem('watchlist') || '[]');
    if (!Array.isArray(watchlistData)) watchlistData = [];

    if (isWatchlist) {
      const updatedWatchlist = watchlistData.filter(item => item.id !== itemId);
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      setIsWatchlist(false);
    } else {
      watchlistData.push({ 
        id: itemId, 
        name: itemName, 
        type: itemType, 
        poster: itemPoster, 
        media_type: itemType
      });
      localStorage.setItem('watchlist', JSON.stringify(watchlistData));
      setIsWatchlist(true);
    }
  };

  const handleRating = (rating) => {
    if (!user) return alert('You need to be logged in!');

    const ratingData = JSON.parse(localStorage.getItem('ratings') || '{}');
    if (userRating === rating) {
      delete ratingData[itemId];
      setUserRating(0);
    } else {
      ratingData[itemId] = rating;
      setUserRating(rating);
    }
    localStorage.setItem('ratings', JSON.stringify(ratingData));
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2">
      <div className="mb-2">
        <select 
          value={selectedList} 
          onChange={(e) => setSelectedList(e.target.value)} 
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select a list</option>
          {lists.map((list, index) => (
            <option key={index} value={list}>{list}</option>
          ))}
        </select>
      </div>

      <div className="flex mb-2">
        <input 
          type="text" 
          placeholder="New list name" 
          value={newListName} 
          onChange={(e) => setNewListName(e.target.value)} 
          className="w-full p-2 border rounded-md"
        />
        <button 
          onClick={handleCreateNewList} 
          className="p-2 bg-blue-500 text-white rounded-md ml-2"
        >
          Create
        </button>
      </div>

      <button 
        onClick={handleAddToList} 
        className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        disabled={!selectedList}
      >
        <FaList className={`mr-2 ${isAdded ? 'text-gray-500' : ''}`} />
        {isAdded ? 'Already in List' : 'Add to List'}
      </button>

      <button onClick={handleAddToFavorites} className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
        <FaHeart className={`mr-2 ${isFavorite ? 'text-gray-500' : ''}`} />
        {isFavorite ? 'Already in Favorites' : 'Add to Favorites'}
      </button>

      <button onClick={handleAddToWatchlist} className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
        <FaEye className={`mr-2 ${isWatchlist ? 'text-gray-500' : ''}`} />
        {isWatchlist ? 'Already in Watchlist' : 'Add to Watchlist'}
      </button>

      <div className="flex items-center w-full p-2">
        <span className="mr-2">Your Rating:</span>
        {[1, 2, 3, 4, 5].map(star => (
          <FaStar
            key={star}
            className={`mr-1 cursor-pointer ${star <= userRating ? 'text-yellow-500' : 'text-gray-400'}`}
            onClick={() => handleRating(star)}
          />
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;
