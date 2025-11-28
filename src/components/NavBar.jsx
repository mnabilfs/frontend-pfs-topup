import React, { useState, useRef, useEffect } from "react";
import Logo from "../assets/PFs Logo.png";
import { HiOutlineSearch } from "react-icons/hi";
import { FiLogOut, FiUser, FiSettings } from "react-icons/fi";

const Navbar = ({ openModal }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef(null);

  // Ambil user dari localStorage
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  // 🔥 REFRESH USER SAAT LOCALSTORAGE BERUBAH
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("storage", handleStorageChange);

    // Custom event untuk refresh manual
    window.addEventListener("userUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userUpdated", handleStorageChange);
    };
  }, []);

  const toggleSearch = () => {
    setSearchOpen((prev) => !prev);
    if (!searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".dropdown-profile")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // 🔥 DEFAULT AVATAR
  const defaultAvatar = "https://freesvg.org/img/abstract-user-flat-4.png";

  return (
    <>
      <nav className="text-white bg-purple-900">
        <div className="container flex items-center justify-between h-10 px-4 mx-auto md:h-14 md:px-8">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" aria-label="Go to Home">
              <img
                src={Logo}
                alt="PFs Store Logo"
                className="w-auto h-9 md:h-12"
              />
            </a>
          </div>

          {/* Mobile Search */}
          <div className="flex items-center ml-auto space-x-4 sm:hidden">
            <button onClick={toggleSearch} className="p-2 focus:outline-none">
              <HiOutlineSearch className="text-white" size={24} />
            </button>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-6">
            <span className="h-6 ml-3 border-l border-white sm:hidden" />

            {/* 🔥 CASE 1 — BELUM LOGIN */}
            {!user && (
              <button
                onClick={openModal}
                className="px-4 py-2 text-white bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600"
              >
                Masuk
              </button>
            )}

            {/* 🔥 CASE 2 — SUDAH LOGIN */}
            {user && (
              <div className="relative dropdown-profile">
                {/* Avatar - TAMPILKAN DARI DATABASE */}
                <div
                  onClick={toggleDropdown}
                  className="flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-200 rounded-full cursor-pointer"
                >
                  <img
                    src={user.avatar || defaultAvatar}
                    alt="User Avatar"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.src = defaultAvatar;
                    }}
                  />
                </div>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 w-48 mt-2 text-gray-800 bg-white rounded-lg shadow-lg z-999">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <a
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <FiUser className="mr-2" /> Profil
                    </a>

                    {user.role === "admin" && (
                      <a
                        href="/admin/dashboard"
                        className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        <FiSettings className="mr-2" /> Admin Dashboard
                      </a>
                    )}

                    <button
                      onClick={onLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
