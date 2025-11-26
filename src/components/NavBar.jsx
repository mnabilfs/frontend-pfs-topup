import React, { useState, useRef } from "react";
import Logo from "../assets/PFs Logo.png";
import { HiOutlineSearch } from "react-icons/hi";
import LoginRegisterModal from "./LoginRegisterModal"; // Import modal

const Navbar = ({ openModal }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef(null);

  const toggleSearch = () => {
    setSearchOpen((prev) => !prev);
    if (!searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  };

  return (
    <>
      <nav className="bg-purple-900 text-white">
        <div className="container mx-auto flex items-center justify-between h-10 md:h-14 px-4 md:px-8">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" aria-label="Go to Home">
              <img src={Logo} alt="PFs Store Logo" className="h-9 md:h-12 w-auto" />
            </a>
          </div>

          {/* Mobile & Tablet: Search */}
          <div className="flex items-center space-x-4 sm:hidden ml-auto">
            <button onClick={toggleSearch} className="p-2 focus:outline-none">
              <HiOutlineSearch className="text-white" size={24} />
            </button>
          </div>
          
          {/* Icons & Profile */}
          <div className="flex items-center space-x-6">
            <span className="sm:hidden h-6 border-l border-white ml-3" />
            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
              <img
                src="https://freesvg.org/img/abstract-user-flat-4.png"
                alt="User Profile"
                className="h-8 w-8 cursor-pointer"
              />
            </div>

            {/* Button to open Login/Register modal */}
            <button
              onClick={openModal} // Open modal when clicked
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Masuk
            </button>
          </div>
        </div>
      </nav>

      {/* Modal Login/Register */}
      {/* The modal is controlled by the parent component */}
    </>
  );
};

export default Navbar;
