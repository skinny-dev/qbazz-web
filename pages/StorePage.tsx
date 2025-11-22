import React, { useState, useMemo } from 'react';
import { Store, Product } from '../types';
import { Icon } from '../components/Icon';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

interface StorePageProps {
  store: Store;
  products: Product[];
  isLoading: boolean;
}

type SortOption = 'newest' | 'price-desc' | 'price-asc' | 'most-visited';

const sortOptions: { key: SortOption; label: string }[] = [
  { key: 'newest', label: 'جدیدترین' },
  { key: 'most-visited', label: 'پر بازدید ترین' },
  { key: 'price-desc', label: 'گران ترین' },
  { key: 'price-asc', label: 'ارزان ترین' },
];

const StorePageSkeleton: React.FC = () => {
    return (
        <div className="container mx-auto">
            {/* Store Profile Skeleton */}
            <div className="flex flex-col items-center text-center">
                <div className="w-28 h-28 shimmer-bg rounded-full"></div>
                <div className="mt-4 h-8 shimmer-bg rounded w-1/3"></div>
                <div className="mt-2 h-4 shimmer-bg rounded w-1/4"></div>
                <div className="mt-2 h-4 shimmer-bg rounded w-1/2"></div>
                <div className="mt-8 h-16 shimmer-bg rounded-full w-48"></div>
            </div>
            
            {/* Sorting UI Skeleton */}
            <div className="mt-12 mb-6 flex items-center justify-center space-x-6 space-x-reverse border-t pt-8">
                <div className="h-6 w-20 shimmer-bg rounded"></div>
                <div className="h-6 w-20 shimmer-bg rounded"></div>
                <div className="h-6 w-20 shimmer-bg rounded"></div>
                <div className="h-6 w-20 shimmer-bg rounded"></div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array(8).fill(0).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                ))}
            </div>
        </div>
    )
}

const StorePage: React.FC<StorePageProps> = ({ store, products, isLoading }) => {
  const [sortOrder, setSortOrder] = useState<SortOption>('newest');

  const sortedProducts = useMemo(() => {
    const productsToSort = [...products];
    switch (sortOrder) {
      case 'price-asc':
        return productsToSort.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return productsToSort.sort((a, b) => b.price - a.price);
      case 'most-visited':
        return productsToSort.sort((a, b) => b.views - a.views);
      case 'newest':
      default:
        return productsToSort;
    }
  }, [products, sortOrder]);

  if (isLoading) {
    return <StorePageSkeleton />;
  }

  return (
    <div className="container mx-auto">
      {/* Store Profile */}
      <div className="flex flex-col items-center text-center">
        <img src={store.logoUrl} alt={store.name} className="w-28 h-28 rounded-full shadow-lg border-4 border-white" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">{store.name}</h1>
        <p className="mt-1 text-gray-500">{store.category}</p>
        <div className="mt-2 flex items-center text-gray-500 text-sm">
          <Icon name="location" className="w-4 h-4 ml-1" />
          <span>{store.location}</span>
        </div>
        <div className="mt-8 flex items-center justify-center">
          <button className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold py-4 px-16 text-xl rounded-full shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-400">
            تماس
          </button>
        </div>
      </div>
      
      {/* Sorting UI */}
      <div className="mt-12 mb-6 flex items-center justify-center space-x-6 space-x-reverse text-gray-500 font-medium border-t pt-8">
        {sortOptions.map(({ key, label }) => (
          <button 
            key={key} 
            onClick={() => setSortOrder(key)}
            className={`pb-1 transition-colors ${
              sortOrder === key 
              ? 'border-b-2 border-gray-800 text-gray-800 font-bold' 
              : 'hover:text-gray-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div>
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Icon name="searchOff" className="w-20 h-20 mx-auto text-gray-300" />
            <h3 className="mt-4 text-xl font-bold text-gray-800">این فروشگاه هنوز محصولی ندارد</h3>
            <p className="mt-2 text-gray-500">به زودی محصولات جدیدی اضافه خواهد شد.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorePage;