import React from 'react';

const ProductCardSkeleton: React.FC<{ isSpecial?: boolean }> = ({ isSpecial = false }) => {
  return (
    <div className="h-full">
      <div className={
        isSpecial
          ? "relative p-[2px] bg-gray-200 rounded-2xl h-full"
          : "relative bg-white border border-gray-200 rounded-2xl h-full shadow-sm"
      }>
        <div className={`overflow-hidden h-full flex flex-col ${isSpecial ? 'bg-gray-50 rounded-[14px]' : 'rounded-2xl'}`}>
          <div className="relative aspect-[4/5] w-full shimmer-bg"></div>
          <div className="p-4 flex-grow flex flex-col justify-end">
            <div className="h-4 rounded w-3/4 mb-4 shimmer-bg"></div>
            <div className="flex justify-between items-baseline">
              <div className="h-6 rounded w-1/3 shimmer-bg"></div>
              <div className="h-4 rounded w-1/4 shimmer-bg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;