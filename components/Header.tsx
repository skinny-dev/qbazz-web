import React, { useContext } from "react";
import { Icon } from "./Icon";
import { AppContext } from "../context/AppContext";
import { AppContextType } from "../types";

const Header: React.FC = () => {
  const appContext = useContext(AppContext) as AppContextType;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-16">
          {/* Left: Logo */}
          <div>
            <button
              onClick={() => appContext?.navigateTo({ name: "home" })}
              className="flex items-center gap-2"
            >
              <img src="/logo.png" alt="کیوباز" className="h-10 w-10" />
              <span className="text-2xl font-bold text-gray-800">کیوباز</span>
            </button>
          </div>

          {/* Center: Search Bar (Desktop) - Absolutely centered */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-full max-w-lg hidden md:block transition-opacity ${
              appContext?.searchModal.isOpen ? "opacity-0" : "opacity-100"
            }`}
          >
            <button
              onClick={() => appContext?.searchModal.open()}
              className="relative w-full text-right"
              aria-label="جستجو"
            >
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Icon name="search" className="h-5 w-5 text-gray-500" />
              </div>
              <div
                id="search-button"
                className="block w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pr-10 pl-3 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
              >
                جستجو در کیوبازار
              </div>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              disabled
              className="hidden md:flex items-center gap-2 bg-gray-400 cursor-not-allowed text-white text-sm font-semibold py-2 px-4 rounded-full opacity-50"
            >
              <Icon name="plus" className="w-5 h-5" />
              <span>ثبت فروشگاه</span>
            </button>
            <button
              onClick={() => appContext?.searchModal.open()}
              className={`md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors ${
                appContext?.searchModal.isOpen ? "opacity-0" : "opacity-100"
              }`}
              aria-label="Search"
            >
              <Icon name="search" className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
