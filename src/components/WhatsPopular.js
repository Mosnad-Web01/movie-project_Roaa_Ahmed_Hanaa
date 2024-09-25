// src/components/WhatsPopular.js

"use client"; // تعريف المكون كعميل في Next.js
import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../lib/tmdbClient'; // استيراد دالة fetch لجلب البيانات من TMDB
import useAuth from '../lib/useAuth'; // استيراد hook التحقق من تسجيل الدخول
import { useTranslation } from 'react-i18next'; // استيراد مكتبة الترجمة
import ScrollableMovieList from './ScrollableMovieList'; // استيراد مكون شريط التمرير للأفلام
import FilterButtons from './FilterButtons'; // استيراد مكون الأزرار الخاصة بالتصفية
import { motion } from 'framer-motion'; // استيراد مكتبة framer-motion للأنيميشن

const WhatsPopular = () => {
  const [content, setContent] = useState([]); // حالة لتخزين محتوى الأفلام والبرامج
  const [filter, setFilter] = useState('in-theaters'); // حالة للتحكم في الفلتر الحالي
  const [dropdownVisible, setDropdownVisible] = useState(null); // حالة للتحكم في ظهور القائمة المنسدلة
  const user = useAuth(); // جلب المستخدم
  const isLoggedIn = !!user; // التحقق إذا كان المستخدم مسجل الدخول
  const { t, i18n } = useTranslation(); // استخدام الترجمة للحصول على النصوص حسب اللغة

  useEffect(() => {
    const fetchMoviesAndShows = async () => {
      let movieEndpoint = '';
      let tvEndpoint = '';

      switch (filter) {
        case 'streaming':
          movieEndpoint = `/movie/popular?with_watch_monetization_types=flatrate`;
          tvEndpoint = `/tv/popular?with_watch_monetization_types=flatrate`;
          break;
        case 'on-tv':
          movieEndpoint = `/movie/popular`;
          tvEndpoint = `/tv/popular`;
          break;
        case 'for-rent':
          movieEndpoint = `/movie/popular?with_watch_monetization_types=rental`;
          tvEndpoint = `/tv/popular?with_watch_monetization_types=rental`;
          break;
        case 'in-theaters':
          movieEndpoint = `/movie/now_playing`;
          tvEndpoint = `/tv/on_the_air`;
          break;
        default:
          movieEndpoint = `/movie/popular`;
          tvEndpoint = `/tv/popular`;
      }

      try {
        const [moviesData, tvData] = await Promise.all([
          fetchFromTMDB(movieEndpoint, i18n.language),
          fetchFromTMDB(tvEndpoint, i18n.language)
        ]);

        if (moviesData && tvData) {
          const combinedContent = [...moviesData.results, ...tvData.results];
          setContent(combinedContent.sort(() => Math.random() - 0.5));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMoviesAndShows(); // استدعاء الدالة لجلب البيانات
  }, [filter, i18n.language]); // جلب البيانات عند تغيير الفلتر أو اللغة

  // دالة لإخفاء القائمة المنسدلة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownVisible(null);
    };

    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownVisible]);

  // دالة للتبديل بين عرض القائمة المنسدلة للأفلام
  const toggleDropdown = (id, event) => {
    event.stopPropagation(); // منع إغلاق القائمة عند النقر داخلها
    setDropdownVisible(dropdownVisible === id ? null : id);
  };

  return (
    <div className="px-6 py-4 bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">{t('What is Popular')}</h2> {/* استخدام الترجمة لعنوان */}
        
        {/* مكون الأزرار لتصفية الأفلام بين الفئات المختلفة */}
        <FilterButtons
          filterOptions={['streaming', 'on-tv', 'for-rent', 'in-theaters']} // خيارات التصفية
          currentFilter={filter} // الفلتر الحالي
          setFilter={setFilter} // دالة لتغيير الفلتر
          i18n={i18n} // تمرير مكتبة الترجمة
        />
      </div>

      {/* عرض الأفلام مع تأثير دخول بالأنيميشن */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} // وضع البداية للأنيميشن
        animate={{ opacity: 1, y: 0 }} // الوضع النهائي
        transition={{ duration: 1.5, ease: "easeOut" }} // ضبط سرعة الانيميشن
      >
        <ScrollableMovieList
          content={content} // تمرير المحتوى المعروض (الأفلام والبرامج)
          isLoggedIn={isLoggedIn} // تمرير حالة تسجيل الدخول
          toggleDropdown={toggleDropdown} // تمرير دالة التحكم بالقائمة المنسدلة
          dropdownVisible={dropdownVisible} // تمرير حالة ظهور القائمة المنسدلة
        />
      </motion.div>
    </div>
  );
};

export default WhatsPopular;
