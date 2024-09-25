// src/components/ScrollableActorList.js
import React from 'react';
import ActorCard from './ActorCard'; // تأكد من وجود ActorCard

const ScrollableActorList = ({ actors }) => {
  return (
    <div className="relative">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300">
        <div className="flex flex-nowrap space-x-4" style={{ width: actors.length * 150 }}>
          {actors.map(actor => (
            <ActorCard
              key={actor.id}
              actor={actor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollableActorList;
