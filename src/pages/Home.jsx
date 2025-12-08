// frontend-pfs-topup\src\pages\Home.jsx
import React, { useState, useEffect } from "react";
import { HiOutlineUser } from "react-icons/hi";
import { Link } from "react-router-dom";
import FooterHome from "../components/FooterHome";
import BannerHome from "../components/BannerHome";

// Import images untuk section Akun saja
import akun1 from "../assets/akun1.jpg";
import akun2 from "../assets/akun2.jpg";
import akun3 from "../assets/akun3.jpg";
import akun4 from "../assets/akun4.jpg";
import akun5 from "../assets/akun5.jpg";

const API_URL = "http://127.0.0.1:8000/api";

const Home = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data game dari API
  useEffect(() => {
    loadGamesFromAPI();
  }, []);

  const loadGamesFromAPI = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/games`);
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error("Error loading games:", error);
      // Fallback ke localStorage jika API gagal
      const storedGames = JSON.parse(localStorage.getItem("db_games"));
      if (storedGames) {
        setGames(storedGames);
      }
    } finally {
      setLoading(false);
    }
  };

  const akunImages = [akun1, akun2, akun3, akun4, akun5];

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
                  <div className="game-card-wrapper relative h-37 md:h-50 w-28 md:w-40">
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

      {/* SECTION AKUN */}
      <div className="px-4 md:px-16 mt-11">
        <h2 className="flex items-center mb-4 text-xl font-semibold text-white">
          <HiOutlineUser className="w-6 h-6 mr-2 md:h-8 md:w-8" />
          Akun
        </h2>
        <div className="flex pb-24 overflow-x-auto gap-11 hide-scrollbar">
          {akunImages.map((src, idx) => (
            <div key={idx} className="flex-shrink-0 cursor-pointer">
              <Link to="/Account_ml">
                <img
                  src={src}
                  alt={`Akun ${idx + 1}`}
                  className="object-cover rounded-lg shadow-lg h-35 md:w-114 md:h-56 hover:scale-105 transition-transform"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
      <FooterHome />
    </div>
  );
};

export default Home;
