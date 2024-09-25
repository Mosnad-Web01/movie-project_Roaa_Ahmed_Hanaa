// src/app/tv/[id]/recommendations/Recommendations.js
import React, { useEffect, useState } from 'react';
import { fetchFromTMDB } from '../../../../lib/tmdbClient';
import { useTranslation } from 'react-i18next'; // استيراد مكتبة i18next للترجمة
import ScrollableMovieList from '../../../../components/ScrollableMovieList'; // استيراد ScrollableMovieList

const Recommendations = ({ showId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation(); // جلب دالة الترجمة واللغة الحالية

  useEffect(() => {
    if (showId) {
      const fetchRecommendations = async () => {
        try {
          // جلب البيانات من TMDB مع تمرير اللغة
          const data = await fetchFromTMDB(`/tv/${showId}/recommendations`, i18n.language);
          if (data && data.results) {
            setRecommendations(data.results);
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to fetch recommendations:", error);
          setIsLoading(false);
        }
      };
      fetchRecommendations();
    }
  }, [showId, i18n.language]); // تأكد من إعادة تشغيل الفيتش عند تغيير اللغة

  if (isLoading) {
    return <div>{t('Loading recommendations...')}</div>; // استخدام الترجمة للعبارة
  }

  if (!recommendations.length) {
    return <div>{t('No recommendations available.')}</div>; // استخدام الترجمة للعبارة
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">{t('Recommended TV Shows')}</h2> {/* استخدام الترجمة للعنوان */}
      <ScrollableMovieList 
        content={recommendations} 
        isLoggedIn={false} // تمرير قيمة حالة تسجيل الدخول المناسبة
        toggleDropdown={() => {}} // تمرير دالة فارغة أو دالة مناسبة لإدارة قائمة dropdown
        dropdownVisible={null} // أو تمرير قيمة مناسبة حسب الحاجة
      />
    </div>
  );
};

export default Recommendations;
