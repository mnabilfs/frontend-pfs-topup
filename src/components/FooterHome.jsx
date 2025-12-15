import React, { useState, useEffect } from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import Banner from "../assets/BannerPfsStore.png";
import { API_BASE_URL } from "../services/api.js";

const API_URL = `${API_BASE_URL}/api`;

const FooterHome = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const res = await fetch(`${API_URL}/payment-methods/active`);
      if (res.ok) {
        const data = await res.json();
        setPaymentMethods(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <footer className="text-gray-300 bg-gray-800 border-t border-gray-700 pt-14">
      <div className="container grid grid-cols-1 gap-8 px-6 mx-auto md:grid-cols-3">
        <div>
          <div className="mb-10">
            <h3 className="mb-2 text-base font-semibold text-white">Bantuan</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Pusat Bantuan
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-base font-semibold text-white">
              PFs TopUp
            </h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Tentang PFs Store
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  PFs Store Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Identitas Brand
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Hubungi Kami
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Aturan Penggunaan
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Kebijakan Pengembalian Dana
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Karir
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-base font-semibold text-white">
            Metode Pembayaran
          </h3>
          <div className="px-4 mt-6 md:px-0">
            <div className="grid grid-cols-2 gap-4 justify-items-center md:w-80 md:grid-cols-3 lg:grid-cols-3 sm:items-center sm:justify-between">
              {loading ? (
                <div className="text-center text-gray-400 col-span-full">
                  Loading...
                </div>
              ) : paymentMethods.length > 0 ? (
                paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex flex-col items-center justify-center w-full p-3 bg-white border border-gray-300 rounded-lg h-18"
                  >
                    <div className="flex items-center justify-center w-full h-8 overflow-hidden">
                      <img
                        src={method.image_url}
                        alt={method.name}
                        className="object-contain w-auto h-full max-w-full"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/100x50?text=No+Image";
                        }}
                      />
                    </div>
                    <span className="mt-1 text-xs font-semibold text-center text-gray-800 truncate max-w-full">
                      {method.name}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 col-span-full">
                  Metode pembayaran belum tersedia
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-base font-semibold text-white">
            Ikuti PFs TopUp
          </h3>
          <div className="flex items-center gap-4 mb-18">
            <a href="#" className="hover:text-white">
              <FaFacebookF size={24} />
            </a>
            <a href="#" className="hover:text-white">
              <FaInstagram size={24} />
            </a>
            <a href="#" className="hover:text-white">
              <FaYoutube size={24} />
            </a>
            <a href="#" className="hover:text-white">
              <FaTiktok size={24} />
            </a>
          </div>
          <img
            src={Banner}
            alt="Banner Mobile Legends"
            className="object-cover object-center w-full h-auto md:h-[150px] rounded-md"
          />
        </div>
      </div>

      <div className="pt-4 pb-4 mt-10 text-xs text-center text-white bg-purple-900">
        pfstore v1.0 © 2025 PT. PFs Company All Rights Reserved.
        <br />
        All other trademarks belong to their respective owners.
      </div>
    </footer>
  );
};

export default FooterHome;
