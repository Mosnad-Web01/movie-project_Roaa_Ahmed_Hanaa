// src/components/FilterButtons.js

import React from 'react';
import { useSpring, animated } from 'react-spring'; // تأثيرات انيميشن

const FilterButtons = ({ filterOptions, currentFilter, setFilter, i18n }) => {
  const buttonSpring = useSpring({
    from: { transform: 'scale(0.9)', opacity: 0.7 },
    to: { transform: 'scale(1)', opacity: 1 },
  });

  return (
    <div className="flex flex-wrap gap-2 mt-4 sm:mt-0 justify-start"> {/* إضافة justify-start هنا */}
      {filterOptions.map(filterKey => (
        <animated.button
          key={filterKey}
          style={buttonSpring}
          onClick={() => setFilter(filterKey)}
          className={`px-4 py-2 rounded-full ${currentFilter === filterKey ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white' : 'bg-gray-700 border border-gray-700 text-gray-200'}`}
        >
          {i18n.t(filterKey)}
        </animated.button>
      ))}
    </div>
  );
};

export default FilterButtons;
