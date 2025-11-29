import React, { useContext } from "react";
import { Product } from "../types";
import { AppContext } from "../context/AppContext";
import { Icon } from "./Icon";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const appContext = useContext(AppContext);

  const priceFormatted = new Intl.NumberFormat("en-US")
    .format(product.price)
    .replace(/,/g, ".");

  const handleClick = () => {
    appContext?.navigateTo({ name: "product", data: product });
  };

  return (
    <div className="h-full cursor-pointer group/card" onClick={handleClick}>
      <div
        className="relative bg-white border border-gray-200 rounded-2xl h-full transition-shadow shadow-sm group-hover/card:shadow-lg"
      >
        <div className="overflow-hidden h-full flex flex-col rounded-2xl">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-center object-cover group-hover/card:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
              <Icon name="eye" className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="p-4 flex-grow flex flex-col justify-end">
            <h3 className="text-md font-medium text-gray-800 truncate mb-3 text-right">
              {product.name}
            </h3>
            <div className="flex justify-between items-baseline">
              <p className="font-semibold text-gray-500 text-sm">
                {product.store.name}
              </p>
              <p className="text-lg font-bold text-gray-900 flex items-center gap-1">
                <span>{priceFormatted}</span>
                <span className="text-sm font-normal text-gray-500">ت</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
