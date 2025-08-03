import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md border-b border-secondary-200">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-primary-300">
            Health Plus
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-1">
          {Links.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`text-primary-400 hover:text-primary-200 transition-colors px-3 py-2 rounded-md ${
                  isActiveLink(link.path)
                    ? "bg-secondary-200 text-primary-200"
                    : ""
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <button className="btn-primary ml-4">Get Started</button>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md border border-primary-200 text-primary-400"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-secondary-200">
          <ul className="px-4 py-2">
            {Links.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="block px-4 py-2 hover:bg-secondary-200 transition-colors rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <button className="btn-primary w-full">Get Started</button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default NavBar;
