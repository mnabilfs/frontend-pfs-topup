// frontend-pfs-topup\src\pages\Home.jsx
import { Footer } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { HiChevronLeft, HiChevronRight, HiOutlineUser } from "react-icons/hi";
import { Link } from "react-router-dom";
import FooterHome from "../components/FooterHome";

// Import images from assets
import slide1 from "../assets/slide1.jpg";
import slide2 from "../assets/slide2.jpg";
import slide3 from "../assets/slide3.jpg";
import slide4 from "../assets/slide4.jpg";
import slide5 from "../assets/slide5.jpg";
import akun1 from "../assets/akun1.jpg";
import akun2 from "../assets/akun2.jpg";
import akun3 from "../assets/akun3.jpg";
import akun4 from "../assets/akun4.jpg";
import akun5 from "../assets/akun5.jpg";

const API_URL = 'http://127.0.0.1:8000/api';

const Home = () => {
  const [games, setGames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const slides = [slide1, slide2, slide3, slide4, slide5];

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
      console.error('Error loading games:', error);
      // Fallback ke localStorage jika API gagal
      const storedGames = JSON.parse(localStorage.getItem("db_games"));
      if (storedGames) {
        setGames(storedGames);
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto slide setiap 5 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const akunImages = [akun1, akun2, akun3, akun4, akun5];

  // Fungsi untuk mendapatkan index slide berikutnya
  const getNextSlideIndex = (offset) => {
    return (currentSlide + offset) % slides.length;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-800">
      {/* Carousel Section */}
      <div className="px-10 mt-6 md:px-16 md:mt-11">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-11">
          <div className="relative md:col-span-2 col-span-1">
            <div className="h-40 md:h-96 rounded-lg shadow-lg">
              <div className="relative w-full h-full overflow-hidden rounded-lg">
                {slides.map((src, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      idx === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`Slide ${idx + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute top-1/2 -translate-y-1/2 left-2 md:-left-6 p-1 md:p-2 transition-all duration-200 ease-in-out transform bg-white rounded-full shadow-lg cursor-pointer hover:bg-purple-700 hover:text-white hover:scale-110 active:bg-purple-800 pointer-events-auto"
            >
              <HiChevronLeft className="w-5 h-5 text-gray-800 md:w-7 md:h-7" />
            </button>

            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute top-1/2 -translate-y-1/2 right-2 md:-right-6 p-1 md:p-2 transition-all duration-200 ease-in-out transform bg-white rounded-full shadow-lg cursor-pointer hover:bg-purple-700 hover:text-white hover:scale-110 active:bg-purple-800 pointer-events-auto"
            >
              <HiChevronRight className="w-5 h-5 text-gray-800 md:w-7 md:h-7" />
            </button>

            <div className="absolute flex justify-center space-x-3 md:space-x-5 left-0 right-0 -bottom-4 md:-bottom-6">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`h-2 w-2 md:h-3 md:w-3 rounded-full transition-all cursor-pointer ${
                    idx === currentSlide
                      ? "bg-purple-600 scale-125"
                      : "bg-gray-300/20 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="flex-col hidden gap-4 sm:block">
            <div className="flex flex-col gap-4">
              <div className="relative w-full h-48 rounded-lg shadow-lg md:h-46 overflow-hidden">
                {slides.map((src, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      idx === getNextSlideIndex(1) ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img
                      src={src}
                      alt="Preview 1"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>

              <div className="relative w-full h-48 rounded-lg shadow-lg md:h-46 overflow-hidden">
                {slides.map((src, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      idx === getNextSlideIndex(2) ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img
                      src={src}
                      alt="Preview 2"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  <div className="overflow-hidden bg-purple-900 border-white rounded-lg cursor-pointer border-1 h-37 md:h-50 w-28 md:w-40 hover:scale-105 transition-transform">
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
                </Link>
              ))
            ) : (
              <p className="text-white">
                Belum ada game tersedia. Silakan tambahkan di Dashboard.
              </p>
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