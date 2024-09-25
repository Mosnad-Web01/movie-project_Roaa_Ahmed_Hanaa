// src/components/FreeToWatch.js

"use client";
import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../lib/tmdbClient';
import MovieCard from './MovieCard';
import useAuth from '../lib/useAuth';
import { useTranslation } from 'react-i18next'; // استيراد useTranslation
import ScrollableMovieList from './ScrollableMovieList'; // استيراد ScrollableMovieList
import FilterButtons from './FilterButtons'; // استيراد FilterButtons
import { motion } from 'framer-motion'; // استيراد framer-motion

const FreeToWatch = () => {
  const [content, setContent] = useState([]);
  const [filter, setFilter] = useState('movie'); // حالة الفلتر (فيلم أو مسلسل)
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const user = useAuth();
  const isLoggedIn = !!user;
  const { i18n } = useTranslation(); // استخدام i18n

  useEffect(() => {
    const fetchContent = async () => {
      const endpoint = filter === 'movie' ? `/trending/movie/week` : `/trending/tv/week`; // استرجاع المحتوى بناءً على الفلتر
      const data = await fetchFromTMDB(endpoint, i18n.language); // تمرير اللغة
      if (data) {
        setContent(data.results);
      }
    };

    fetchContent();
  }, [filter, i18n.language]); // إضافة i18n.language

  // تابع لتفعيل القائمة المنسدلة
  const toggleDropdown = (id, event) => {
    event.stopPropagation(); // منع إغلاق القائمة عند النقر داخلها
    setDropdownVisible(dropdownVisible === id ? null : id);
  };

  return (
    <motion.div
      className="px-6 py-4 bg-white dark:bg-gray-900 text-black dark:text-white"
      initial={{ opacity: 0, x: -50 }} // تأثير الدخول
      animate={{ opacity: 1, x: 0 }} // تأثير الدخول
      transition={{ duration: 0.5 }} // مدة التأثير
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold mb-4 sm:mb-0">{i18n.t('Free to Watch')}</h2> {/* استخدام الترجمة */}

        {/* استدعاء مكون الأزرار */}
        <FilterButtons
          filterOptions={['movie', 'tv']}
          currentFilter={filter}
          setFilter={setFilter}
          i18n={i18n}
        />
      </div>

      {/* استدعاء مكون شريط التمرير */}
      <ScrollableMovieList
        content={content}
        isLoggedIn={isLoggedIn}
        toggleDropdown={toggleDropdown}
        dropdownVisible={dropdownVisible}
      />
    </motion.div>
  );
};

export default FreeToWatch;
