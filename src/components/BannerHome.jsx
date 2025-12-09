import React, { useState, useEffect } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { API_BASE_URL } from "../services/api.js";

const API_URL = `${API_BASE_URL}/api`;

const BannerHome = () => {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load banners dari API
  useEffect(() => {
    loadBannersFromAPI();
  }, []);

  const loadBannersFromAPI = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/banners`);
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error("Error loading banners:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto slide setiap 5 detik
  useEffect(() => {
    if (banners.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const getNextSlideIndex = (offset) => {
    return (currentSlide + offset) % banners.length;
  };

  if (loading) {
    return (
      <div className="px-10 mt-6 md:px-16 md:mt-11">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-11">
          <div className="h-40 col-span-1 bg-gray-700 rounded-lg md:col-span-2 md:h-96 animate-pulse"></div>
          <div className="flex-col hidden gap-4 sm:flex">
            <div className="h-48 bg-gray-700 rounded-lg md:h-46 animate-pulse"></div>
            <div className="h-48 bg-gray-700 rounded-lg md:h-46 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="px-10 mt-6 md:px-16 md:mt-11">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-11">
          <div className="flex items-center justify-center h-40 col-span-1 bg-gray-700 rounded-lg md:col-span-2 md:h-96">
            <p className="text-gray-400">Belum ada banner</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-10 mt-6 md:px-16 md:mt-11">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-11">
        <div className="relative col-span-1 md:col-span-2">
          <div className="h-40 rounded-lg shadow-lg md:h-96">
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              {banners.map((banner, idx) => (
                <div
                  key={banner.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    idx === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={banner.image_url}
                    alt={banner.title || `Banner ${idx + 1}`}
                    className="object-cover w-full h-full banner-image"
                    style={{
                      imageRendering: "-webkit-optimize-contrast",
                      "crisp-edges": "crisp-edges"
                    }}
                    loading="eager"
                    decoding="sync"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute p-1 transition-all duration-200 ease-in-out transform -translate-y-1/2 bg-white rounded-full shadow-lg cursor-pointer pointer-events-auto top-1/2 left-2 md:-left-6 md:p-2 hover:bg-purple-700 hover:text-white hover:scale-110 active:bg-purple-800"
          >
            <HiChevronLeft className="w-5 h-5 text-gray-800 md:w-7 md:h-7" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute p-1 transition-all duration-200 ease-in-out transform -translate-y-1/2 bg-white rounded-full shadow-lg cursor-pointer pointer-events-auto top-1/2 right-2 md:-right-6 md:p-2 hover:bg-purple-700 hover:text-white hover:scale-110 active:bg-purple-800"
          >
            <HiChevronRight className="w-5 h-5 text-gray-800 md:w-7 md:h-7" />
          </button>

          <div className="absolute left-0 right-0 flex justify-center space-x-3 md:space-x-5 -bottom-4 md:-bottom-6">
            {banners.map((_, idx) => (
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
            <div className="relative w-full h-48 overflow-hidden rounded-lg shadow-lg md:h-46">
              {banners.map((banner, idx) => (
                <div
                  key={banner.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    idx === getNextSlideIndex(1) ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={banner.image_url}
                    alt="Preview 1"
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>

            <div className="relative w-full h-48 overflow-hidden rounded-lg shadow-lg md:h-46">
              {banners.map((banner, idx) => (
                <div
                  key={banner.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    idx === getNextSlideIndex(2) ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={banner.image_url}
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
  );
};

export default BannerHome;