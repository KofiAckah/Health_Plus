import React, { useState } from "react";
import { Logo, CompanyName } from "./Default";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";

const Links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Contact Us", path: "/contact" },
];

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sticky top-0 shadow-lg block z-10 bg-white">
      <nav className="flex py-2 max-md:py-3 px-5 justify-between items-center">
        <Link to="/">
          <div className="flex items-center">
            <p className="md:text-3xl text-xl font-bold text-blue-600">
              {CompanyName}
            </p>
            <img src={Logo} alt="logo" className="md:w-10 w-7 ml-3" />
          </div>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center">
          {Links.map((link) => (
            <li key={link.name} className="inline-block mx-2">
              <Link
                to={link.path}
                className={`px-3 py-2 rounded-md transition-colors ${
                  isActiveLink(link.path)
                    ? "text-blue-600 bg-blue-50 font-medium"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li className="inline-block mx-2">
            <Link
              to="/get-started"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div
          className="md:hidden flex items-center border border-gray-300 p-2 rounded-md cursor-pointer"
          onClick={toggleMenu}
        >
          <FontAwesomeIcon
            icon={isMenuOpen ? faBars : faTimes}
            color={!isMenuOpen ? "#dc2626" : "#3b82f6"}
            className="text-lg"
          />
        </div>
      </nav>

      {/* Mobile Menu */}
      <ul
        className={`${
          isMenuOpen ? "hidden" : "block"
        } bg-white w-48 absolute right-0 text-gray-700 font-medium border border-gray-200 rounded-lg shadow-md overflow-hidden mr-2 md:hidden`}
      >
        {Links.map((link) => (
          <li key={link.name} className="block">
            <Link
              to={link.path}
              className={`block px-4 py-3 transition-colors ${
                isActiveLink(link.path)
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setIsMenuOpen(true)}
            >
              {link.name}
            </Link>
          </li>
        ))}
        <li className="block border-t border-gray-200">
          <Link
            to="/get-started"
            className="block px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            onClick={() => setIsMenuOpen(true)}
          >
            Get Started
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
