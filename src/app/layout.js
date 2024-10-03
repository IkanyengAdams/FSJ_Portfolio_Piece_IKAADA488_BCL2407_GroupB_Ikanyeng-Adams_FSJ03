"use client";

import "../app/global.css";
import { FaHeart, FaShoppingCart, FaUser, FaBars } from "react-icons/fa";
import { useState } from "react";

/**
 * Layout component that wraps the main application layout, including navigation and children content.
 * @param {Object} props - The props object for the Layout component.
 * @param {JSX.Element} props.children - The child components passed into the Layout component.
 * @returns {JSX.Element} The Layout component with navigation and main content.
 */
export default function Layout({ children }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  /**
   * Toggles the navigation bar's open/closed state.
   */
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <html lang="en">
      <body>
        {/* Navigation Bar */}
        <nav className="bg-gray-800 p-4 fixed top-0 left-0 w-full z-50">
          <div className="flex items-center justify-between">
            {/* Logo and Site Title */}
            <a href="/" className="flex items-center">
              <img
                src="/online-shop.png"
                alt="Shop Logo"
                className="h-8 mr-2"
              />
              <h1 className="text-white text-2xl font-bold">SwiftCart</h1>
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={toggleNav}
              className="text-white text-2xl lg:hidden focus:outline-none"
            >
              <FaBars />
            </button>

            {/* Desktop Navigation Icons */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="flex items-center text-white cursor-pointer">
                <FaHeart className="text-xl mr-2" />
                <span>Wishlist</span>
              </div>
              <div className="flex items-center text-white cursor-pointer">
                <FaShoppingCart className="text-xl mr-2" />
                <span>Cart</span>
              </div>
              <div className="flex items-center text-white cursor-pointer">
                <FaUser className="text-xl mr-2" />
                <span>Login</span>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div
            className={`${
              isNavOpen ? "max-h-40" : "max-h-0"
            } overflow-hidden transition-all duration-500 ease-in-out lg:hidden`}
          >
            <div className="flex flex-col items-start space-y-4 mt-4">
              <div className="flex items-center text-white w-full cursor-pointer">
                <FaHeart className="text-xl mr-2" />
                <span>Wishlist</span>
              </div>
              <div className="flex items-center text-white w-full cursor-pointer">
                <FaShoppingCart className="text-xl mr-2" />
                <span>Cart</span>
              </div>
              <div className="flex items-center text-white w-full cursor-pointer">
                <FaUser className="text-xl mr-2" />
                <span>Login</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
