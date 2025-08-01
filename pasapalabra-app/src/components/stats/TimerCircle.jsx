// src/components/TimerCircle.jsx
import React from 'react';

export const TimerCircle = ({ timeLeft, maxTime }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / maxTime;
  const dashOffset = circumference * (1 - progress);

  return (
    <svg width="100" height="100">
      <circle
        cx="50" cy="50" r={radius}
        stroke="#ddd" strokeWidth="5" fill="none"
      />
      <circle
        cx="50" cy="50" r={radius}
        stroke="#f00" strokeWidth="5" fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        style={{ transition: 'stroke-dashoffset 0.3s linear' }}
      />
      <text x="50" y="55" textAnchor="middle" fontSize="18">
        {timeLeft}s
      </text>
    </svg>
  );
};
