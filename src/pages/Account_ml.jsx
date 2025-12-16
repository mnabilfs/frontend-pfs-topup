import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/NavBar"; 
import FooterUniversal from "../components/FooterUniversal";
import CustomerService from "../components/CustomerService";
import { API_BASE_URL } from "../services/api.js";

const API_URL = `${API_BASE_URL}/api`;

const AccountDetail = () => {
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get("id");

  const sellerPhoneNumber = "6289527400005";
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (accountId) {
      loadAccountDetail();
    } else {
      setLoading(false);
    }
  }, [accountId]);

  const loadAccountDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/sold-accounts/${accountId}`);
      if (!response.ok) throw new Error("Akun tidak ditemukan");

      const data = await response.json();
      setAccount(data);
      setSelectedImage(data.image_url);
      document.title = `${data.title} | PFS Store`;
    } catch (error) {
      console.error(error);
      setAccount(null);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-90 px-4">
        <div className="bat-loader-container max-w-xs w-full flex justify-center translate-x-7 -translate-y-3">
          <div className="bat"></div>
        </div>
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!account) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-white bg-gray-900 pb-32">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Akun Tidak Ditemukan</h1>
          <a href="/" className="inline-block px-6 py-3 font-semibold bg-purple-800 rounded-lg hover:bg-purple-700">
            Kembali ke Home
          </a>
        </div>
      </div>
    );
  }

  const whatsappMessage = `Halo, saya tertarik dengan akun: *${account.title}* seharga *${formatPrice(account.price)}*`;
  const whatsappLink = `https://wa.me/${sellerPhoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  
  const galleryImages = account.gallery && Array.isArray(account.gallery) ? account.gallery : [];

  // ================= MAIN UI =================
  return (
    <div className="flex flex-col min-h-screen text-white bg-gray-900">
      
      {/* Main Content */}
      <main className="flex flex-col flex-1 gap-8 p-4 lg:flex-row max-w-7xl mx-auto w-full">
        
        {/* LEFT SECTION (Images) */}
        <div className="flex flex-col w-full lg:w-2/3">
          
          {/* --- MAIN IMAGE CONTAINER (FIXED SIZE) --- */}
          {/* Menggunakan style inline untuk memaksa tinggi tetap 350px */}
          <div 
            className="mx-auto bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center relative border border-gray-700"
            style={{ 
              width: "100%", 
              maxWidth: "600px", 
              height: "350px" // UKURAN FIX
            }}
          >
            <img
              src={selectedImage}
              alt={account.title}
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: "contain" }} // Gambar menyesuaikan kotak tanpa terpotong/gepeng
            />
          </div>

          {/* --- THUMBNAIL GALLERY --- */}
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            {/* Main Image Thumbnail */}
            <div
              onClick={() => setSelectedImage(account.image_url)}
              style={{ width: "64px", height: "64px" }} // UKURAN FIX
              className={`rounded overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                selectedImage === account.image_url
                  ? "border-purple-500 opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={account.image_url}
                alt="Main"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Gallery Loop */}
            {galleryImages.map((img, i) => (
              <div
                key={i}
                onClick={() => setSelectedImage(img)}
                style={{ width: "64px", height: "64px" }} // UKURAN FIX
                className={`rounded overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                  selectedImage === img 
                    ? "border-purple-500 opacity-100" 
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

            {/* Empty Slots (Agar layout tidak geser jika gambar sedikit) */}
            {galleryImages.length < 3 &&
              [...Array(3 - galleryImages.length)].map((_, i) => (
                <div
                  key={`empty-${i}`}
                  style={{ width: "64px", height: "64px" }} // UKURAN FIX
                  className="bg-gray-800 rounded border-2 border-transparent"
                />
              ))}
          </div>

          <h2 className="mt-6 text-lg font-bold text-center">Deskripsi Produk</h2>
          <p className="mt-2 text-sm text-center text-gray-300 whitespace-pre-wrap">
            {account.description || "Tidak ada deskripsi."}
          </p>
        </div>

        {/* RIGHT SECTION (Details) */}
        <div className="flex flex-col w-full gap-4 lg:w-1/3">
          <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg shadow">
            <h1 className="text-xl font-semibold">{account.title}</h1>
            <p className="text-sm text-gray-400">{account.game_name || "Mobile Legends"}</p>
            <p className="mt-2 text-lg font-bold text-green-400">{formatPrice(account.price)} / Akun</p>
            <span className="inline-block px-3 py-1 mt-2 text-xs bg-purple-800 rounded-full">
              Ditambahkan: {new Date(account.created_at).toLocaleDateString("id-ID")}
            </span>
          </div>

          <div className="p-4 bg-gray-800 border border-purple-800 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold">Penjual</span>
              <span className="text-sm">PFS Store</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold">Harga</span>
              <span className="text-sm">{formatPrice(account.price)}</span>
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2 text-center bg-purple-800 rounded-lg hover:bg-purple-700 transition"
            >
              Hubungi Penjual
            </a>
          </div>
        </div>
      </main>

      {/* Footer Wrapper (Sticky Bottom) */}
      <div className="mt-auto w-full">
        <FooterUniversal />
        <CustomerService />
      </div>
    </div>
  );
};

export default AccountDetail;