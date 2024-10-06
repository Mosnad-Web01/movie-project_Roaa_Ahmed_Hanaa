"use client";
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ScrollableMovieList from '../../components/ScrollableMovieList';
import { fetchFromTMDB } from '../../lib/tmdbClient'; // تأكد من استيراد دالة fetchFromTMDB

const ListsPage = () => {
  const { t, i18n } = useTranslation(); // استخدام الترجمة
  const [lists, setLists] = useState([]); // تخزين القوائم المتاحة
  const [selectedList, setSelectedList] = useState(null); // تخزين القائمة المحددة
  const [listItems, setListItems] = useState([]); // تخزين العناصر في القائمة المحددة
  const [loadedListItems, setLoadedListItems] = useState([]); // تخزين العناصر المفصلة
  const [loading, setLoading] = useState(true); // حالة التحميل

  // Fetch stored lists from localStorage
  useEffect(() => {
    const storedLists = JSON.parse(localStorage.getItem('lists')) || [];
    setLists(storedLists);
  }, []);

  // Fetch items of the selected list
  useEffect(() => {
    if (selectedList) {
      const items = JSON.parse(localStorage.getItem(selectedList)) || [];
      setListItems(items);
    }
  }, [selectedList]);

  // Fetch details for the items in the selected list
  useEffect(() => {
    const fetchListItemsDetails = async () => {
        const promises = listItems.map(async (item) => {
            const endpoint = item.type === 'movie' 
                ? `/movie/${item.id}`
                : `/tv/${item.id}`;
            const data = await fetchFromTMDB(endpoint, i18n.language);
            
            console.log(`Fetched data for ${item.type} with ID ${item.id}:`, data);
            return { ...item, ...data };
        });
    
        const detailedListItems = await Promise.all(promises);
        console.log('Detailed List Items:', detailedListItems); // تحقق من البيانات هنا
        setLoadedListItems(detailedListItems);
        setLoading(false);
    };
    
      

    if (listItems.length > 0) {
      fetchListItemsDetails();
    } else {
      setLoading(false);
    }
  }, [listItems, i18n.language]);

  const handleListClick = (list) => {
    setSelectedList(list);
  };

  const handleBack = () => {
    setSelectedList(null); // مسح القائمة المحددة للعودة
  };

  return (
    <div className="container mx-auto p-4 bg-white dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-4">{t('Your Lists')}</h1>
      {selectedList ? (
        <div>
          <button onClick={handleBack} className="mb-4 p-2 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-200 rounded-full">
            {t('Back to Lists')}
          </button>
          <h2 className="text-xl font-semibold mb-2">{selectedList}</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            loadedListItems.length === 0 ? (
              <p>{t('No items in this list.')}</p>
            ) : (
              <ScrollableMovieList
                content={loadedListItems} // تمرير العناصر الموجودة في القائمة المحددة
                isLoggedIn={true} // استبدل هذه القيمة بناءً على حالة تسجيل الدخول للمستخدم
                toggleDropdown={() => {}} // قم بتمرير دالة مناسبة هنا
                dropdownVisible={null} // استبدلها بالقيمة المناسبة
              />
            )
          )}
        </div>
      ) : (
        <ul className="space-y-2">
          {lists.map((list, index) => (
            <li key={index} className="border p-2 rounded cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleListClick(list)}>
              {list}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListsPage;
