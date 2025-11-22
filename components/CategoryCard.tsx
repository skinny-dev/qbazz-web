
import React from 'react';

interface CategoryCardProps {
  name: string;
  emoji: string;
  isActive: boolean;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, emoji, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative group aspect-square w-full rounded-2xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-center p-2 text-center shadow-md hover:shadow-lg
      ${
        isActive
          ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white'
          : 'bg-white text-gray-800'
      }`}
    >
      <span className="text-4xl mb-2 transition-transform duration-300 group-hover:scale-110" role="img" aria-hidden="true">
        {emoji}
      </span>
      <span className="font-bold text-md">{name}</span>
    </button>
  );
};

export default CategoryCard;
