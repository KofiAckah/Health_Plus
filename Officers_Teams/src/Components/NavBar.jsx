import { useState, useContext } from "react";
import { Logo, CompanyName } from "./Default";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../Context/AuthContext"; // Import AuthContext

const Links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext); // Get auth state and logout
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/firehealth-login");
  };

  return (
    <div className="sticky top-0 shadow-lg block z-10 bg-white">
      <nav className="flex py-2 max-md:py-3 px-5 justify-between items-center">
        <Link to="/">
          <div className="flex items-center">
            <p className="md:text-3xl text-xl">{CompanyName}</p>
            <img src={Logo} alt="logo" className="md:w-10 w-7 ml-3" />
          </div>
        </Link>
        <ul className="hidden md:flex items-center">
          {Links.map((link) => (
            <li key={link.name} className="inline-block mx-2">
              <Link
                to={link.path}
                className="text-primary-400 hover:text-blue-500 transition-colors"
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li className="inline-block mx-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-primary-400 hover:text-blue-500 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/firehealth-login"
                className="text-primary-400 hover:text-blue-500 transition-colors"
              >
                Login
              </Link>
            )}
          </li>
        </ul>
        <div
          className="md:hidden flex items-center border border-primary-200 p-2 rounded-md"
          onClick={toggleMenu}
        >
          <FontAwesomeIcon
            icon={isMenuOpen ? faBars : faTimes}
            bounce={!isMenuOpen}
            color={!isMenuOpen ? "#ff4d4d" : "#11d6cd"}
          />
        </div>
      </nav>
      <ul
        className={`${
          isMenuOpen ? "hidden" : "block"
        } bg-white w-32 absolute right-0 text-primary-400 font-medium border border-red-400 rounded-lg shadow-md overflow-hidden mr-2 md:hidden`}
      >
        {Links.map((link) => (
          <li key={link.name} className="block">
            <Link
              to={link.path}
              className="block px-4 py-2 hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          </li>
        ))}
        <li className="block">
          {isAuthenticated ? (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="block px-4 py-2 hover:bg-gray-100 transition-colors w-full text-left"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/firehealth-login"
              className="block px-4 py-2 hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
