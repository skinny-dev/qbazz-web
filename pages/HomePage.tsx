import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import ProductCard from "../components/ProductCard";
import { Product } from "../types";
import { Icon } from "../components/Icon";
import CategoryCard from "../components/CategoryCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { fetchCategories, type Category } from "../services/api";

interface HomePageProps {
  products: Product[];
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

const HomePage: React.FC<HomePageProps> = ({ products, isLoading }) => {
  const [sortOrder, setSortOrder] = useState<SortOption>("newest");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadCategories();
  }, []);

  const trendingProducts = useMemo(() => products.slice(0, 8), [products]);

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

  const ProductCarousel: React.FC<{ products: Product[] }> = ({ products }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(true);

    const checkForScrollPosition = useCallback(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScrollLeft = scrollWidth - clientWidth;
        // In RTL, scrollLeft is 0 on the right and negative to the left.
        setCanScrollPrev(scrollLeft < 0);
        setCanScrollNext(scrollLeft > -maxScrollLeft + 1);
      }
    }, []);

    useEffect(() => {
      const currentRef = scrollRef.current;
      if (currentRef) {
        checkForScrollPosition();
        currentRef.addEventListener("scroll", checkForScrollPosition, {
          passive: true,
        });
        window.addEventListener("resize", checkForScrollPosition);
      }
      return () => {
        if (currentRef) {
          currentRef.removeEventListener("scroll", checkForScrollPosition);
        }
        window.removeEventListener("resize", checkForScrollPosition);
      };
    }, [products, checkForScrollPosition]);

    const scroll = (direction: "prev" | "next") => {
      if (scrollRef.current) {
        const scrollAmount = scrollRef.current.clientWidth * 0.8;
        // For RTL: 'prev' means scroll right (increase scrollLeft toward 0)
        // 'next' means scroll left (decrease scrollLeft)
        const newScroll =
          direction === "prev"
            ? scrollRef.current.scrollLeft + scrollAmount
            : scrollRef.current.scrollLeft - scrollAmount;

        scrollRef.current.scrollTo({
          left: newScroll,
          behavior: "smooth",
        });
      }
    };

    return (
      <div className="relative overflow-hidden">
        {canScrollPrev && (
          <button
            onClick={() => scroll("prev")}
            className="absolute top-1/2 -translate-y-1/2 right-0 z-10 bg-white/80 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:bg-white transition-colors"
            aria-label="محصولات قبلی"
          >
            <Icon name="chevronRight" className="w-6 h-6 text-gray-700" />
          </button>
        )}
        <div
          ref={scrollRef}
          className="flex space-x-6 space-x-reverse overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide"
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-64">
              <ProductCard product={product} isSpecial={true} />
            </div>
          ))}
        </div>
        {canScrollNext && (
          <button
            onClick={() => scroll("next")}
            className="absolute top-1/2 -translate-y-1/2 left-0 z-10 bg-white/80 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:bg-white transition-colors"
            aria-label="محصولات بعدی"
          >
            <Icon name="chevronLeft" className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>
    );
  };

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

          {categoriesLoading
            ? Array(6)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square w-full shimmer-bg rounded-2xl"
                  ></div>
                ))
            : categories.map((category) => (
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

      {/* Trending Products Carousel */}
      <ProductCarousel products={trendingProducts} />

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
