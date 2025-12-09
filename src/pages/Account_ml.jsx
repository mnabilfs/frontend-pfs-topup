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
    console.log("🔄 Account ID from URL:", accountId);

    if (accountId) {
      loadAccountDetail();
    } else {
      console.error("❌ No account ID provided");
      setLoading(false);
    }
  }, [accountId]);

  const loadAccountDetail = async () => {
    try {
      setLoading(true);
      console.log(`📡 Fetching: ${API_URL}/sold-accounts/${accountId}`);

      const response = await fetch(`${API_URL}/sold-accounts/${accountId}`);
      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error:", errorText);
        throw new Error(`HTTP ${response.status}: Akun tidak ditemukan`);
      }

      const data = await response.json();
      console.log("✅ Account data loaded:", data);

      setAccount(data);
      setSelectedImage(data.image_url);
      document.title = `${data.title} | PFS Store`;
    } catch (error) {
      console.error("❌ Error loading account:", error);
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

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-90">
        <div className="bat-loader-container">
          <div className="bat"></div>
        </div>
      </div>
    );
  }

  // Not found
  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-white bg-gray-900">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Akun Tidak Ditemukan</h1>
          <p className="mb-6 text-gray-400">
            Maaf, akun yang Anda cari tidak tersedia atau sudah terjual.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 font-semibold transition bg-purple-800 rounded-lg hover:bg-purple-700"
          >
            Kembali ke Home
          </a>
        </div>
      </div>
    );
  }

  const whatsappMessage = `Halo, saya tertarik dengan akun: *${
    account.title
  }* seharga *${formatPrice(account.price)}*`;
  const whatsappLink = `https://wa.me/${sellerPhoneNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  // Gallery images
  const galleryImages =
    account.gallery && Array.isArray(account.gallery) ? account.gallery : [];

  return (
    <div className="flex flex-col min-h-screen text-white bg-gray-900">
      {/* Main */}
      <main className="flex flex-col gap-8 p-4 lg:flex-row">
        {/* Left Side */}
        <div className="flex flex-col w-full lg:w-2/3">
          <img
            src={selectedImage}
            alt={account.title}
            className="rounded-xl w-full max-w-[600px] object-cover max-h-[350px] mx-auto"
          />

          {/* Gallery Thumbnails */}
          <div className="flex justify-center gap-2 mt-4">
            {/* Main image thumbnail */}
            <div
              onClick={() => setSelectedImage(account.image_url)}
              className={`w-16 h-16 rounded cursor-pointer ${
                selectedImage === account.image_url
                  ? "bg-gray-600"
                  : "bg-gray-700"
              }`}
            >
              <img
                src={account.image_url}
                alt="Main"
                className="object-cover w-full h-full rounded"
              />
            </div>

            {/* Gallery images thumbnails */}
            {galleryImages.map((img, i) => (
              <div
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 rounded cursor-pointer ${
                  selectedImage === img ? "bg-gray-600" : "bg-gray-700"
                }`}
              >
                <img
                  src={img}
                  alt={`Gallery ${i + 1}`}
                  className="object-cover w-full h-full rounded"
                />
              </div>
            ))}

            {/* Empty placeholders jika gallery kurang dari 3 */}
            {galleryImages.length < 3 &&
              [...Array(3 - galleryImages.length)].map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="w-16 h-16 bg-gray-700 rounded"
                />
              ))}
          </div>

          <h2 className="mt-4 text-lg font-bold text-center">
            Deskripsi Produk
          </h2>
          <p className="mt-2 text-sm text-center text-gray-300">
            {account.description || "Tidak ada deskripsi."}
          </p>
        </div>

        {/* Right Side */}
        <div className="flex flex-col w-full gap-4 lg:w-1/3">
          <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg shadow">
            <h1 className="text-xl font-semibold">{account.title}</h1>
            <p className="text-sm text-gray-400">
              {account.game_name || "Mobile Legends"}
            </p>
            <p className="mt-2 text-lg font-bold text-green-400">
              {formatPrice(account.price)} / Akun
            </p>
            <span className="inline-block px-3 py-1 mt-2 text-xs text-white bg-purple-800 rounded-full">
              Ditambahkan pada:{" "}
              {new Date(account.created_at).toLocaleDateString("id-ID")}
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
              className="block py-2 text-center text-white bg-purple-800 rounded-lg hover:bg-purple-700"
            >
              Hubungi Penjual
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <FooterUniversal />
      <CustomerService />
    </div>
  );
};

export default AccountDetail;