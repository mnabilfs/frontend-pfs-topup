import React from "react";
// Impor helper numberToRupiah Anda (pastikan path-nya benar)
// import { numberToRupiah } from "../utils/number-to-rupiah";

// Helper format Rupiah (jika import di atas tidak ada)
const formatRupiah = (num) => {
  if (!num) return "Rp 0";
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
};

// Default ikon jika user tidak mengisi URL Ikon
const FALLBACK_ICON_URL = 'https://www.transparentpng.com/thumb/diamond/O3UOts-diamond-best-png.png';

const CardTopup = ({ products = [], selectedTopup, setSelectedTopup }) => {
  
  const handleSelect = (product) => {
    setSelectedTopup(product);
  };

  if (products.length === 0) {
    return (
      <div className="p-4 text-center text-white bg-purple-900 rounded-lg">
        Belum ada produk diamond untuk game ini. Silakan atur di Dashboard.
      </div>
    )
  }

  return (
    // --- PERBAIKAN DI SINI: Menambahkan 'mt-4 md:mt-6' ---
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 mt-4 md:mt-6">
      {products.map((product) => {
        const isSelected = selectedTopup && selectedTopup.id === product.id;

        return (
          <div
            key={product.id}
            className={`cursor-pointer rounded-xl border p-4 transition-all duration-300 ${
              isSelected
                ? "bg-purple-700 border-white shadow-lg ring-2 ring-white"
                : "bg-purple-900 border-purple-800 hover:bg-purple-800"
            }`}
            onClick={() => handleSelect(product)}
          >
            {/* Baris 1: Ikon + Nama */}
            <div className="flex items-center gap-2 md:gap-3">
              <img 
                src={product.image_url || FALLBACK_ICON_URL} 
                alt={product.name}
                className="w-6 h-6 md:w-8 md:h-8 object-contain flex-shrink-0"
                onError={(e) => e.target.src = FALLBACK_ICON_URL} 
              />
              <span className="text-sm font-semibold text-white md:text-base break-words">
                {product.name}
              </span>
            </div>
            
            {/* Baris 2: Harga */}
            <div className="mt-2">
              <span className="text-sm text-yellow-400 md:text-lg font-semibold">
                {formatRupiah(product.price)}
              </span>
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default CardTopup;