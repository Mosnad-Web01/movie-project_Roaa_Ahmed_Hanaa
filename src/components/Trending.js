// src/components/Trending.js

"use client"; // تعريف هذا المكون كمكون عميل في Next.js
import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../lib/tmdbClient'; // استيراد دالة fetch لجلب البيانات من TMDB
import useAuth from '../lib/useAuth'; // استيراد hook التحقق من تسجيل الدخول
import { useTranslation } from 'react-i18next'; // استيراد مكتبة i18next للترجمة
import ScrollableMovieList from './ScrollableMovieList'; // استيراد مكون عرض الأفلام في شريط تمرير
import FilterButtons from './FilterButtons'; // استيراد مكون الأزرار الخاصة بالتصفية
import { motion } from 'framer-motion'; // استيراد مكتبة framer-motion

const Trending = () => {
  const [trendingMovies, setTrendingMovies] = useState([]); // حالة لتخزين قائمة الأفلام المتداولة
  const [timeRange, setTimeRange] = useState('week'); // حالة للتحكم في نطاق الوقت (يوم أو أسبوع)
  const [dropdownVisible, setDropdownVisible] = useState(null); // حالة للتحكم في ظهور القائمة المنسدلة
  const user = useAuth(); // جلب المستخدم الحالي إذا كان مسجل الدخول
  const isLoggedIn = !!user; // التحقق إذا كان المستخدم مسجل الدخول
  const { i18n } = useTranslation(); // جلب اللغة الحالية من i18next

  // دالة لجلب الأفلام المتداولة بناءً على نطاق الوقت
  useEffect(() => {
    const fetchTrendingMovies = async () => {
      const data = await fetchFromTMDB(`/trending/movie/${timeRange}`, i18n.language); // جلب البيانات من TMDB مع تمرير اللغة
      if (data) setTrendingMovies(data.results); // إذا تم جلب البيانات بنجاح، تحديث حالة الأفلام
    };
    fetchTrendingMovies(); // استدعاء الدالة لجلب البيانات
  }, [timeRange, i18n.language]); // تنفيذ الجلب عند تغيير نطاق الوقت أو اللغة

  // دالة للتبديل بين عرض القائمة المنسدلة للأفلام
  const toggleDropdown = (id, event) => {
    event.stopPropagation(); // منع أي حدث آخر من الحدوث
    setDropdownVisible(dropdownVisible === id ? null : id); // إظهار أو إخفاء القائمة المنسدلة بناءً على ID الفيلم
  };

  return (
    <div className="px-6 py-4 bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="flex justify-between items-center mb-4"> {/* جعل العنوان والأزرار في سطر واحد */}
        <h2 className="text-3xl font-bold">{i18n.t('Trending')}</h2> {/* عرض العنوان بترجمة */}

        {/* مكون الأزرار لتصفية الأفلام بين اليوم والأسبوع */}
        <div className="flex justify-end"> {/* جعل الأزرار على اليمين */}
          <FilterButtons
            filterOptions={['day', 'week']} // خيارات التصفية
            currentFilter={timeRange} // الفلتر الحالي
            setFilter={setTimeRange} // دالة لتغيير الفلتر
            i18n={i18n} // تمرير مكتبة الترجمة
          />
        </div>
      </div>

      {/* عرض قائمة الأفلام باستخدام مكون ScrollableMovieList مع تأثير انيميشن */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} // وضع البداية للأنيميشن
        animate={{ opacity: 1, y: 0 }} // الوضع النهائي
        transition={{ duration: 1.5, ease: "easeOut" }} // التحكم بسرعة الانيميشن
      >
        <ScrollableMovieList
          content={trendingMovies} // تمرير الأفلام المعروضة
          isLoggedIn={isLoggedIn} // تمرير حالة تسجيل الدخول
          toggleDropdown={toggleDropdown} // تمرير دالة التحكم بالقائمة المنسدلة
          dropdownVisible={dropdownVisible} // تمرير حالة ظهور القائمة المنسدلة
        />
      </motion.div>
    </div>
  );
};

export default Trending;
