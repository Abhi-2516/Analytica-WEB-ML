import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gray-950 bg-opacity-75 backdrop-blur-lg shadow-lg fixed w-full z-10 top-0 border-b border-gray-700/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-white text-2xl font-bold">Analytica</span>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <a
              href="#"
              className="text-gray-300 hover:text-indigo-400 transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center px-1 pt-1 text-sm font-medium"
            >
              Features
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-indigo-400 transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center px-1 pt-1 text-sm font-medium"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-indigo-400 transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center px-1 pt-1 text-sm font-medium"
            >
              Contact
            </a>
          </div>

          {/* Call to Action Button (Desktop) */}
          <div className="hidden sm:flex sm:items-center">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:scale-105 transform"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none transition-colors duration-300"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;