import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-gray-700/60 mt-24 sm:mt-32">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 lg:px-8">
        <nav
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
          aria-label="Footer"
        >
          <div className="pb-6">
            <a
              href="#"
              className="text-sm leading-6 text-gray-400 hover:text-white"
            >
              Features
            </a>
          </div>
          <div className="pb-6">
            <a
              href="#"
              className="text-sm leading-6 text-gray-400 hover:text-white"
            >
              About
            </a>
          </div>
          <div className="pb-6">
            <a
              href="#"
              className="text-sm leading-6 text-gray-400 hover:text-white"
            >
              Contact
            </a>
          </div>
          <div className="pb-6">
            <a
              href="#"
              className="text-sm leading-6 text-gray-400 hover:text-white"
            >
              Privacy Policy
            </a>
          </div>
        </nav>
        <p className="mt-10 text-center text-xs leading-5 text-gray-500">
          &copy; {new Date().getFullYear()} Analytica, Inc. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;