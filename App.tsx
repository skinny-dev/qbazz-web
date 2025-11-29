import React, { useState, useMemo, useEffect } from "react";
import { Product, Store, Page, AppContextType, Category } from "./types";
import { AppContext } from "./context/AppContext";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import StorePage from "./pages/StorePage";
import RegisterStorePage from "./pages/RegisterStorePage";
import SearchModal from "./components/SearchModal";
import Footer from "./components/Footer";
import { fetchCategories, fetchProducts } from "./services/api";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>({ name: "home" });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        const [productsList, categoriesList] = await Promise.all([
          fetchProducts(24),
          fetchCategories(),
        ]);
        if (!cancelled) {
          setProducts(productsList);
          setCategories(categoriesList);
        }
      } catch (e) {
        console.error("Failed to load initial data:", e);
        if (!cancelled) {
          setProducts([]);
          setCategories([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const appContextValue: AppContextType = useMemo(
    () => ({
      navigateTo,
      openSearch,
      categories,
      searchModal: {
        isOpen: isSearchOpen,
        open: openSearch,
        close: closeSearch,
      },
    }),
    [isSearchOpen, categories]
  );

  const renderPage = () => {
    switch (currentPage.name) {
      case "product":
        return (
          <ProductPage
            product={currentPage.data}
            products={products}
            isLoading={isLoading}
          />
        );
      case "store":
        return (
          <StorePage
            store={currentPage.data}
            products={products.filter(
              (p) => p.store.id === currentPage.data.id
            )}
            isLoading={isLoading}
          />
        );
      case "registerStore":
        return <RegisterStorePage />;
      case "home":
      default:
        return (
          <HomePage
            products={products}
            categories={categories}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <div className="bg-[#F8F9FA] min-h-screen flex flex-col">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
          {renderPage()}
        </main>
        {isSearchOpen && (
          <SearchModal allProducts={products} onClose={closeSearch} />
        )}
        <Footer />
      </div>
    </AppContext.Provider>
  );
};

export default App;
