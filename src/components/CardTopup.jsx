import React from "react";
import { Card } from "flowbite-react";
import { numberToRupiah } from "../utils/number-to-rupiah";

// Default ikon jika user tidak mengisi URL Ikon
const FALLBACK_ICON_URL =
  "https://www.transparentpng.com/thumb/diamond/O3UOts-diamond-best-png.png";

const CardTopup = ({ products = [], selectedTopup, setSelectedTopup }) => {
  const handleSelect = (product) => {
    setSelectedTopup(product);
  };

  if (products.length === 0) {
    return (
      <div className="p-4 text-center text-white">
        <p>Belum ada produk untuk game ini.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mt-4 md:mt-6">
      {products.map((product) => {
        const isSelected = selectedTopup && selectedTopup.id === product.id;

        return (
          <Card
            key={product.id}
            onClick={() => handleSelect(product)}
            className={`cursor-pointer shadow-xl text-white transition-all duration-300 ${
              isSelected
                ? "!bg-purple-700 !border-purple-900"
                : "!bg-purple-900 !border-purple-900"
            }`}
          >
            <div className="flex items-center gap-1 md:gap-1">
              <img
                src={product.image_url || FALLBACK_ICON_URL}
                alt={product.name}
                className="h-[1.2rem] w-[1.2rem] md:h-[2rem] md:w-[2rem] object-contain"
                onError={(e) => (e.target.src = FALLBACK_ICON_URL)}
              />
              <h5 className="text-xs md:text-lg font-medium tracking-tight">
                {product.name}
              </h5>
            </div>
            <div className="-mt-2 flex items-center justify-between">
              <span className="ml-1 text-xs md:text-lg font-semibold">
                {numberToRupiah(product.price)}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default CardTopup;