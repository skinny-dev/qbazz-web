import React, { useMemo, useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { Category, Product } from "../types";
import { Icon } from "../components/Icon";
import CategoryCard from "../components/CategoryCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";

interface HomePageProps {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
}

type SortOption = "newest" | "price-desc" | "price-asc" | "most-visited";

const sortOptions: { key: SortOption; label: string }[] = [
  { key: "newest", label: "جدیدترین" },
  { key: "most-visited", label: "پر بازدید ترین" },
  { key: "price-desc", label: "گران ترین" },
  { key: "price-asc", label: "ارزان ترین" },
];

const HomePageSkeleton = () => {
  return (
    <div className="space-y-12">
      {/* Category Filters Skeleton */}
      <div className="space-y-6">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {Array(7)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="aspect-square w-full shimmer-bg rounded-2xl"
              ></div>
            ))}
        </div>
      </div>

      {/* Trending Products Banner Skeleton */}
      <div className="h-[128px] shimmer-bg rounded-2xl"></div>

      {/* Trending Products Carousel Skeleton */}
      <div className="relative">
        <div className="flex space-x-6 space-x-reverse overflow-hidden pb-4 -mx-4 px-4">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex-shrink-0 w-64">
                <ProductCardSkeleton isSpecial={true} />
              </div>
            ))}
        </div>
      </div>

      {/* Sorting Skeleton */}
      <div className="flex items-center justify-center space-x-6 space-x-reverse">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="h-6 w-20 shimmer-bg rounded"></div>
          ))}
      </div>

      {/* Products Skeleton */}
      <div>
        <div className="h-8 w-40 shimmer-bg rounded mx-auto mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(12)
            .fill(0)
            .map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
        </div>
      </div>
    </div>
  );
};

const HomePage: React.FC<HomePageProps> = ({
  products,
  categories,
  isLoading,
}) => {
  const [sortOrder, setSortOrder] = useState<SortOption>("newest");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const sortedProducts = useMemo(() => {
    const productsToSort = [...products];
    switch (sortOrder) {
      case "price-asc":
        return productsToSort.sort((a, b) => a.price - b.price);
      case "price-desc":
        return productsToSort.sort((a, b) => b.price - a.price);
      case "most-visited":
        return productsToSort.sort((a, b) => b.views - a.views);
      case "newest":
      default:
        return productsToSort.reverse();
    }
  }, [products, sortOrder]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") {
      return sortedProducts;
    }
    const selectedCategory = categories.find((c) => c.slug === activeCategory);
    if (!selectedCategory) return sortedProducts;

    return sortedProducts.filter(
      (p) =>
        p.category.includes(selectedCategory.title) ||
        p.category.includes(selectedCategory.slug)
    );
  }, [sortedProducts, activeCategory, categories]);

  if (isLoading) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="space-y-12">
      {/* Category Filters */}
      <div className="space-y-6">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {/* All category */}
          <CategoryCard
            key="all"
            name="همه"
            emoji="✨"
            isActive={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          />

          {categories.map((category) => (
            <CategoryCard
              key={category.slug}
              name={category.title}
              emoji={category.icon || "📦"}
              isActive={activeCategory === category.slug}
              onClick={() => setActiveCategory(category.slug)}
            />
          ))}
        </div>
      </div>
      {/* Trending Products Banner */}
      <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white text-center flex flex-col items-center justify-center h-32 overflow-hidden">
        <Icon
          name="sparkles"
          className="absolute top-4 left-4 w-8 h-8 opacity-30"
        />
        <Icon
          name="sparkles"
          className="absolute bottom-4 right-4 w-12 h-12 opacity-30"
        />
        <h3 className="text-2xl font-bold">محصولات ترند</h3>
        <p className="mt-2 text-indigo-100">
          جدیدترین‌های بازار بزرگ تهران، فقط در کیوبازار
        </p>
      </div>
      {/* Sorting */}
      <div className="mt-12 flex items-center justify-center space-x-6 space-x-reverse text-gray-500 font-medium border-t pt-8">
        {sortOptions.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSortOrder(key)}
            className={`pb-1 transition-colors ${
              sortOrder === key
                ? "border-b-2 border-gray-800 text-gray-800 font-bold"
                : "hover:text-gray-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* All Products Title */}
      <div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          همه محصولات
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <Icon
                name="searchOff"
                className="w-20 h-20 mx-auto text-gray-300"
              />
              <h3 className="mt-4 text-xl font-bold text-gray-800">
                محصولی در این دسته بندی یافت نشد
              </h3>
              <p className="mt-2 text-gray-500">
                دسته بندی دیگری را امتحان کنید.
              </p>
            </div>
          )}
        </div>
      </div>
      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default HomePage;
