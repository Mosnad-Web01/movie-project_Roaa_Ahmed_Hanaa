// src/components/TranslationFilterButtons.js
"use client";
import React from 'react';

const TranslationFilterButtons = ({ filterOptions, currentFilter, setFilter, t }) => {
  return (
    <div className="flex space-x-2">
      {filterOptions.map((filterKey) => (
        <button
          key={filterKey}
          onClick={() => setFilter(filterKey)}
          className={`px-4 py-2 rounded-full ${currentFilter === filterKey ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
        >
          {t(filterKey)} {/* استخدام دالة الترجمة هنا */}
        </button>
      ))}
    </div>
  );
};

export default TranslationFilterButtons;
