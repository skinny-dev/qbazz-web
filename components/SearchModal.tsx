import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { Product } from '../types';
import { AppContext } from '../context/AppContext';
import { Icon } from './Icon';

interface SearchModalProps {
  allProducts: Product[];
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ allProducts, onClose }) => {
  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const appContext = useContext(AppContext);

  // Load search history from local storage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('qbazzSearchHistory');
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse search history from localStorage", error);
    }
  }, []);

  // Save search history to local storage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('qbazzSearchHistory', JSON.stringify(searchHistory));
    } catch (error) {
      console.error("Failed to save search history to localStorage", error);
    }
  }, [searchHistory]);


  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Focus input on open
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery && !searchHistory.includes(trimmedQuery)) {
      // Add to history and keep the list at a max of 5
      setSearchHistory(prev => [trimmedQuery, ...prev.slice(0, 4)]);
    }
  };
  
  const handleClearQuery = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const filteredProducts = useMemo(() => {
    if (!query.trim()) {
      return [];
    }
    const lowercasedQuery = query.toLowerCase();
    return allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercasedQuery) ||
        product.description.toLowerCase().includes(lowercasedQuery) ||
        product.store.name.toLowerCase().includes(lowercasedQuery)
    );
  }, [query, allProducts]);

  const handleProductClick = (product: Product) => {
    appContext?.navigateTo({ name: 'product', data: product });
    onClose();
  };

  const handleHistoryItemClick = (item: string) => {
    setQuery(item);
  };
  
  const handleRemoveHistoryItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    setSearchHistory(prev => prev.filter(h => h !== item));
  };
  
  const handleClearHistory = () => {
    setSearchHistory([]);
  }

  const renderContent = () => {
    if (query.trim()) {
      if (filteredProducts.length > 0) {
        // Search results
        return (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 px-4 mb-3">نتایج جستجو</h3>
            <ul className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <li
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500 truncate">{product.store.name}</p>
                  </div>
                   <Icon name="chevronLeft" className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </li>
              ))}
            </ul>
          </div>
        );
      } else {
        // No results
        return (
          <div className="text-center py-20 px-4">
             <Icon name="searchOff" className="w-20 h-20 mx-auto text-gray-300" />
            <h3 className="mt-4 text-xl font-bold text-gray-800">نتیجه‌ای یافت نشد</h3>
            <p className="mt-2 text-gray-500">برای عبارت "{query}" محصولی پیدا نکردیم.</p>
          </div>
        );
      }
    }

    if (searchHistory.length > 0) {
      // Search History
      return (
        <div>
          <div className="flex justify-between items-center px-4 mb-3">
             <h3 className="text-sm font-semibold text-gray-500">جستجوهای اخیر</h3>
             <button onClick={handleClearHistory} className="text-sm text-red-500 hover:text-red-700 font-semibold">حذف همه</button>
          </div>
          <ul className="divide-y divide-gray-100">
            {searchHistory.map((item) => (
              <li
                key={item}
                onClick={() => handleHistoryItemClick(item)}
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors group"
              >
                 <Icon name="history" className="w-5 h-5 text-gray-400" />
                 <span className="flex-grow text-gray-700">{item}</span>
                 <button onClick={(e) => handleRemoveHistoryItem(e, item)} className="opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`حذف ${item} از تاریخچه`}>
                    <Icon name="close" className="w-5 h-5 text-gray-500 hover:text-gray-800" />
                 </button>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    
    // Initial State
    return (
      <div className="text-center py-20 px-4">
        <Icon name="search" className="w-24 h-24 mx-auto text-gray-200" />
        <h3 className="mt-4 text-xl font-bold text-gray-800">شروع به جستجو کنید</h3>
        <p className="mt-2 text-gray-500">محصولات مورد نظر خود را پیدا کنید.</p>
      </div>
    );
  };


  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-start pt-16 md:pt-24"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all animate-fade-in-down"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <form onSubmit={handleFormSubmit} role="search">
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Icon name="search" className="h-6 w-6 text-gray-400" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="جستجو در محصولات، فروشگاه‌ها..."
                aria-label="جستجو در محصولات، فروشگاه‌ها"
                className="w-full bg-transparent text-lg text-gray-800 py-3 pr-14 pl-12 border-none focus:ring-0 placeholder:text-gray-500"
              />
              {query && (
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                  <button type="button" onClick={handleClearQuery} className="text-gray-400 hover:text-gray-600" aria-label="پاک کردن جستجو">
                    <Icon name="close" className="h-6 w-6" />
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
        
        {/* Search Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {renderContent()}
        </div>
      </div>
       <style>{`
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default SearchModal;