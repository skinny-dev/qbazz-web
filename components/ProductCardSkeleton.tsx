import React from "react";

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="h-full">
      <div
        className="relative bg-white border border-gray-200 rounded-2xl h-full shadow-sm"
      >
        <div className="overflow-hidden h-full flex flex-col rounded-2xl">
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