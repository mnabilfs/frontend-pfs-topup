// frontend-pfs-topup\src\pages\Home.jsx
import React, { useState, useEffect } from "react";
import { HiOutlineUser } from "react-icons/hi";
import { Link } from "react-router-dom";
import FooterHome from "../components/FooterHome";
import BannerHome from "../components/BannerHome";

const API_URL = "http://127.0.0.1:8000/api";

const Home = () => {
  const [games, setGames] = useState([]);
  const [soldAccounts, setSoldAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FUNGSI DARI MODEL BARU (TETAP PAKAI INI)
  useEffect(() => {
    loadGames();
    loadSoldAccounts();
  }, []);

  const loadGames = async () => {
    try {
      const res = await fetch(`${API_URL}/games`);
      const data = await res.json();
      setGames(data);
    } catch (err) {
      console.error("Gagal load game:", err);
    }
  };

  const loadSoldAccounts = async () => {
    try {
      console.log('🔄 Fetching sold accounts...');
      const res = await fetch(`${API_URL}/sold-accounts`);
      
      console.log('📡 Response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('✅ Data received:', data);
        
        const activeAccounts = data.filter(acc => acc.is_active);
        console.log('📊 Active accounts:', activeAccounts.length);
        
        setSoldAccounts(activeAccounts);
      } else {
        console.error('❌ Failed to fetch:', res.status);
        setSoldAccounts([]);
      }
    } catch (err) {
      console.error("❌ Error loading sold accounts:", err);
      setSoldAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ JSX DARI MODEL LAMA (STYLING & STRUKTUR)
  return (
    <div className="flex flex-col min-h-screen bg-gray-800">
      {/* Banner Carousel Section - Load dari Database */}
      <BannerHome />

      {/* SECTION TOP UP GAME */}
      <div className="px-3 md:px-16 mt-9 md:mt-17">
        <h2 className="flex items-center mb-4 font-semibold text-white text-l md:text-xl">
          <img
            src="https://www.transparentpng.com/thumb/diamond/O3UOts-diamond-best-png.png"
            alt="Diamond"
            className="w-6 h-6 mr-1 md:h-8 md:w-8 md:mr-2"
          />
          Top Up Game
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 md:flex md:gap-10 md:overflow-x-auto md:pb-5">
            {games.length > 0 ? (
              games.map((game) => (
                <Link
                  to={`/topup/${game.id}`}
                  key={game.id}
                  className="flex justify-center col-span-1"
                >
                  <div className="game-card-wrapper relative h-37 md:h-55 w-28 md:w-45">
                    <div className="overflow-hidden bg-purple-900 rounded-lg cursor-pointer h-full w-full hover:scale-105 transition-transform relative z-10">
                      <img
                        src={game.image_url}
                        alt={game.name}
                        className="object-cover w-full h-auto"
                      />
                      <div className="px-2 py-2 text-center">
                        <span className="text-white text-[.70rem] md:text-sm font-semibold font-Poppins">
                          {game.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-white">Mohon Maaf, belum ada game tersedia.</p>
            )}
          </div>
        )}
      </div>

      {/* SECTION AKUN PREMIUM */}
      <div className="px-4 md:px-16 mt-11">
        <h2 className="flex items-center mb-4 text-xl font-semibold text-white">
          <HiOutlineUser className="w-6 h-6 mr-2 md:h-8 md:w-8" />
          Akun Premium
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : soldAccounts.length === 0 ? (
          <div className="text-center py-20">
            <HiOutlineUser className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-xl font-semibold">
              Belum ada akun dijual saat ini
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Admin dapat menambahkan akun melalui dashboard
            </p>
          </div>
        ) : (
          <div className="flex pb-24 overflow-x-auto gap-11 hide-scrollbar">
            {soldAccounts.map((acc) => (
              <div key={acc.id} className="flex-shrink-0 cursor-pointer">
                <Link to={`/account_ml?id=${acc.id}`}>
                  <img
                    src={acc.image_url}
                    alt={acc.title}
                    className="object-cover rounded-lg shadow-lg h-35 md:w-124 md:h-66 hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x320?text=No+Image';
                    }}
                  />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <FooterHome />
    </div>
  );
};

export default Home;