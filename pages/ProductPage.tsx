// FIX: `useMemo` was not imported from 'react'.
import React, { useState, useContext, useEffect, useMemo } from "react";
import { Product } from "../types";
import { AppContext } from "../context/AppContext";
import { Icon } from "../components/Icon";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";

interface ProductPageProps {
  product: Product;
  products: Product[];
  isLoading: boolean;
}

const ManagedImage: React.FC<{
  src: string;
  alt: string;
  className: string;
}> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  return (
    <div className="relative w-full h-full bg-gray-100">
      {!isLoaded && <div className="absolute inset-0 shimmer-bg" />}
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
      />
    </div>
  );
};

const ProductPageSkeleton: React.FC = () => {
  return (
    <div>
      <div className="lg:grid lg:grid-cols-5 lg:gap-x-12 lg:items-start">
        {/* Image gallery skeleton */}
        <div className="lg:col-span-3">
          <div className="w-full aspect-square shimmer-bg rounded-2xl"></div>
        </div>

        {/* Product info skeleton */}
        <div className="lg:col-span-2 mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <div className="h-4 w-2/5 shimmer-bg rounded mb-2"></div>
          <div className="mt-4 h-9 w-4/5 shimmer-bg rounded"></div>
          <div className="mt-6 space-y-3">
            <div className="h-4 shimmer-bg rounded"></div>
            <div className="h-4 shimmer-bg rounded"></div>
            <div className="h-4 shimmer-bg rounded w-5/6"></div>
          </div>
          <div className="mt-8 h-9 w-2/5 shimmer-bg rounded"></div>

          <div className="mt-8 flex flex-col gap-3">
            <div className="h-12 shimmer-bg rounded-full w-full"></div>
          </div>

          <div className="my-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full shimmer-bg"></div>
              <div className="space-y-2">
                <div className="h-5 w-24 shimmer-bg rounded"></div>
                <div className="h-4 w-32 shimmer-bg rounded"></div>
              </div>
            </div>
            <div className="h-12 w-44 shimmer-bg rounded-full"></div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="h-5 w-1/3 shimmer-bg rounded mb-4"></div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-1/4 shimmer-bg rounded"></div>
                <div className="h-4 w-1/3 shimmer-bg rounded"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-1/5 shimmer-bg rounded"></div>
                <div className="h-4 w-1/4 shimmer-bg rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Related products skeleton */}
      <div className="mt-24">
        <div className="h-8 w-1/3 shimmer-bg rounded mb-6"></div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      </div>
    </div>
  );
};

const ProductPage: React.FC<ProductPageProps> = ({
  product,
  products,
  isLoading,
}) => {
  const appContext = useContext(AppContext);
  const [mobileImageIndex, setMobileImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (product) {
      setMobileImageIndex(0);
    }
  }, [product]);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevLightboxImage = () => {
    setLightboxIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  if (isLoading || !product) {
    return <ProductPageSkeleton />;
  }

  const priceFormatted = new Intl.NumberFormat("fa-IR").format(product.price);

  const relatedProducts = useMemo(() => {
    if (!product || !products) return [];
    const fromSameStore = products.filter(
      (p) => p.store.id === product.store.id && p.id !== product.id
    );
    if (fromSameStore.length > 3) {
      return fromSameStore.slice(0, 4);
    }
    const otherProducts = products
      .filter((p) => p.id !== product.id)
      .slice(0, 4 - fromSameStore.length);
    return [...fromSameStore, ...otherProducts];
  }, [product, products]);

  const handleStoreClick = () => {
    appContext?.navigateTo({ name: "store", data: product.store });
  };

  const nextImage = () => {
    setMobileImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setMobileImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  const DesktopImageGallery = () => {
    if (!product.images || product.images.length === 0) return null;

    const displayImages = product.images.slice(0, 3);

    if (displayImages.length === 1) {
      return (
        <div
          className="w-full aspect-square rounded-2xl overflow-hidden border border-gray-200 cursor-pointer"
          onClick={() => openLightbox(0)}
        >
          <ManagedImage
            src={displayImages[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    if (displayImages.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-4">
          <div
            className="aspect-[4/5] rounded-2xl overflow-hidden border border-gray-200 cursor-pointer"
            onClick={() => openLightbox(0)}
          >
            <ManagedImage
              src={displayImages[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="aspect-[4/5] rounded-2xl overflow-hidden border border-gray-200 cursor-pointer"
            onClick={() => openLightbox(1)}
          >
            <ManagedImage
              src={displayImages[1]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      );
    }

    return (
      <div
        className="grid grid-cols-2 grid-rows-2 gap-4"
        style={{ height: "clamp(400px, 80vh, 650px)" }}
      >
        <div
          className="col-span-1 row-span-2 rounded-2xl overflow-hidden border border-gray-200 cursor-pointer"
          onClick={() => openLightbox(0)}
        >
          <ManagedImage
            src={displayImages[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="col-span-1 row-span-1 rounded-2xl overflow-hidden border border-gray-200 cursor-pointer"
          onClick={() => openLightbox(1)}
        >
          <ManagedImage
            src={displayImages[1]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="col-span-1 row-span-1 rounded-2xl overflow-hidden border border-gray-200 cursor-pointer relative"
          onClick={() => openLightbox(2)}
        >
          <ManagedImage
            src={displayImages[2]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.images.length > 3 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                +{product.images.length - 3}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const MobileImageGallery = () => (
    <div className="relative">
      <div
        className="w-full aspect-square overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 cursor-pointer"
        onClick={() => openLightbox(mobileImageIndex)}
      >
        <ManagedImage
          src={product.images[mobileImageIndex]}
          alt={product.name}
          className="w-full h-full object-center object-cover"
        />
      </div>
      {product.images.length > 1 && (
        <>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {mobileImageIndex + 1} / {product.images.length}
          </div>
          <button
            onClick={prevImage}
            className="absolute top-1/2 -translate-y-1/2 right-3 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
          >
            <Icon name="chevronRight" className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={nextImage}
            className="absolute top-1/2 -translate-y-1/2 left-3 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
          >
            <Icon name="chevronLeft" className="w-6 h-6 text-gray-700" />
          </button>
        </>
      )}
    </div>
  );

  const Lightbox = () => {
    if (!lightboxOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
        onClick={closeLightbox}
      >
        <button
          onClick={closeLightbox}
          className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors z-10"
        >
          <Icon name="close" className="w-6 h-6" />
        </button>

        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm font-semibold px-4 py-2 rounded-full z-10">
          {lightboxIndex + 1} / {product.images.length}
        </div>

        <div
          className="relative w-full h-full flex items-center justify-center px-16"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={product.images[lightboxIndex]}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
          />

          {product.images.length > 1 && (
            <>
              <button
                onClick={prevLightboxImage}
                className="absolute top-1/2 -translate-y-1/2 right-4 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition-colors"
              >
                <Icon name="chevronRight" className="w-8 h-8" />
              </button>
              <button
                onClick={nextLightboxImage}
                className="absolute top-1/2 -translate-y-1/2 left-4 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition-colors"
              >
                <Icon name="chevronLeft" className="w-8 h-8" />
              </button>
            </>
          )}
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-4">
          {product.images.map((img, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(idx);
              }}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                idx === lightboxIndex
                  ? "border-white scale-110"
                  : "border-transparent opacity-50 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="lg:grid lg:grid-cols-5 lg:gap-x-12 lg:items-start">
        {/* Image gallery */}
        <div className="lg:col-span-3">
          <div className="lg:hidden">
            <MobileImageGallery />
          </div>
          <div className="hidden lg:block">
            <DesktopImageGallery />
          </div>
        </div>

        {/* Product info */}
        <div className="mt-10 lg:mt-0 lg:col-span-2">
          <div className="text-sm text-gray-500 mb-2">
            <button
              onClick={() => appContext?.navigateTo({ name: "home" })}
              className="hover:underline"
            >
              خانه
            </button>
            <span className="mx-2">/</span>
            <span>پوشاک زنانه</span>
            <span className="mx-2">/</span>
            <span className="text-gray-800">تی شرت</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {product.name}
          </h1>

          <div
            className="mt-4 text-base text-gray-700 space-y-4"
            dangerouslySetInnerHTML={{
              __html: product.description.replace(/\n/g, "<br />"),
            }}
          />

          <div className="mt-6">
            <p className="text-3xl text-gray-900 flex items-baseline gap-2">
              <span>{priceFormatted}</span>
              <span className="text-xl font-medium text-gray-500">تومان</span>
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button className="w-full bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold py-3 px-8 rounded-full shadow-md transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-400">
              تماس با فروشنده
            </button>
          </div>

          <div className="my-10 flex items-center justify-between">
            <div
              onClick={handleStoreClick}
              className="flex items-center gap-4 cursor-pointer group"
            >
              <img
                src={product.store.logoUrl}
                alt={product.store.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="text-right">
                <p className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {product.store.name}
                </p>
                <p className="text-sm text-gray-500">
                  {product.store.category}
                </p>
              </div>
            </div>

            <button
              onClick={handleStoreClick}
              className="px-6 py-3 border border-gray-300 rounded-full text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              مشاهده محصولات ({product.store.productCount})
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-md font-bold text-gray-900">جزئیات محصول</h3>
            <div className="mt-4 text-gray-600 space-y-3">
              {product.details.map((detail) => (
                <div
                  key={detail.label}
                  className="flex justify-between text-sm"
                >
                  <span className="font-medium text-gray-500">
                    {detail.label}
                  </span>
                  <span className="font-semibold text-gray-800">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      <div className="mt-24">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            محصولات مشابه
          </h2>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
