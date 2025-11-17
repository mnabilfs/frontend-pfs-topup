import React from "react";
import { Card } from "flowbite-react";
import { numberToRupiah } from "../utils/number-to-rupiah"; // Kita tetap pakai utility Anda agar format uangnya rapi

const CardTopup = ({ products = [], selectedTopup, setSelectedTopup }) => {
  
  // Jika data produk kosong (belum diisi di Dashboard)
  if (!products || products.length === 0) {
    return (
      <div className="mt-5 p-4 text-center text-white bg-purple-900/50 border border-purple-700 rounded-lg">
        <p>Belum ada daftar harga untuk game ini.</p>
        <p className="text-xs text-gray-300 mt-1">Silakan tambahkan data melalui halaman /dashboard</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mt-4 md:mt-6">
      {products.map((product, index) => {
        // Cek apakah item ini sedang dipilih
        const isSelected = selectedTopup && selectedTopup.id === product.id;

        return (
          <Card
            key={index}
            onClick={() => setSelectedTopup(product)}
            className={`cursor-pointer shadow-xl text-white transition-all duration-300 ${
              isSelected
                ? "!bg-purple-700 !border-white ring-2 ring-white scale-105" // Style saat dipilih (sedikit lebih menonjol)
                : "!bg-purple-900 !border-purple-900 hover:!bg-purple-800"
            }`}
          >
            <div className="flex items-center gap-1 md:gap-3">
              <img
                src={"https://www.transparentpng.com/thumb/diamond/O3UOts-diamond-best-png.png"}
                alt="diamond"
                className="h-[1.2rem] w-[1.2rem] md:h-[2rem] md:w-[2rem]"
              />
              {/* Di Dashboard kita simpan sebagai 'name', misal: "86 Diamonds" */}
              <h5 className="text-xs md:text-sm font-medium tracking-tight">
                {product.name}
              </h5>
            </div>
            <div className="-mt-2 flex items-center justify-between">
              <span className="ml-4 text-xs md:text-lg font-semibold text-yellow-400">
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