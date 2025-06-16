import React from 'react';

const LetterStats = ({ wordCount, charCount, readingTime, mode, className = '' }) => {
  const stats = [
    {
      value: wordCount,
      label: 'Mots',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      labelColor: 'text-blue-600'
    },
    {
      value: charCount,
      label: 'Caractères',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      labelColor: 'text-green-600'
    },
    {
      value: readingTime,
      label: 'Min. lecture',
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      labelColor: 'text-purple-600'
    },
    {
      value: mode,
      label: 'Mode',
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      labelColor: 'text-orange-600'
    }
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <div key={index} className={`p-3 ${stat.bgColor} rounded-md text-center`}>
          <div className={`text-lg font-bold ${stat.textColor}`}>
            {stat.value}
          </div>
          <div className={`text-xs ${stat.labelColor}`}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LetterStats;