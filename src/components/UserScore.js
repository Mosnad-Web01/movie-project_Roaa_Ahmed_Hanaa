import React, { useEffect, useState } from 'react';

export const UserScore = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  // حركة زيادة النسبة من 0 إلى القيمة الفعلية
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedScore(score);
    }, 100); // تأخير بسيط قبل البدء في الحركة
    return () => clearTimeout(timeout);
  }, [score]);

  const circleRadius = 20;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const progressOffset = circleCircumference - (animatedScore / 100) * circleCircumference;

  return (
    <div className="relative w-12 h-12">
      {/* خلفية سوداء بحجم الدائرة بالكامل */}
      <div className="absolute inset-0 bg-black rounded-full"></div>
      
      <svg className="transform -rotate-90 relative" width="48" height="48" viewBox="0 0 48 48">
        {/* الدائرة الخلفية */}
        <circle
          cx="24"
          cy="24"
          r={circleRadius}
          stroke="#000"
          strokeWidth="4"
          fill="transparent"
        />
        {/* الدائرة الخضراء مع الحركة */}
        <circle
          cx="24"
          cy="24"
          r={circleRadius}
          stroke="#21d07a"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circleCircumference}
          strokeDashoffset={progressOffset}
          style={{
            transition: 'stroke-dashoffset 1s ease-in-out',
          }}
        />
      </svg>
      {/* النص مع النسبة */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-sm">{animatedScore}%</span>
      </div>
    </div>
  );
};

export default UserScore;
