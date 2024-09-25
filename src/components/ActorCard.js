// src/components/ActorCard.js
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next'; // استيراد مكتبة i18next للترجمة

const ActorCard = ({ actor }) => {
  const { id, name, profile_path } = actor;
  const { t } = useTranslation(); // جلب دالة الترجمة
  const profilePath = profile_path ? `https://image.tmdb.org/t/p/w500${profile_path}` : '/path/to/placeholder.jpg';

  return (
    <div className="relative bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 w-60 h-80">
      <Link href={`/people/${id}`} passHref>
        <div className="block cursor-pointer">
          <Image
            src={profilePath}
            alt={name}
            width={240}
            height={360}
            className="w-full h-3/4 object-cover"
          />
          <h3 className="text-md font-semibold text-center mt-2">{t(name) || name}</h3> {/* استخدام الترجمة */}
        </div>
      </Link>
    </div>
  );
};

export default ActorCard;
