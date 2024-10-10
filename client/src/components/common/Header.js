// src/components/Header.jsx
import Logo from "../../assets/images/logo.png";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import React, { useEffect, useState } from "react";
import Axios from "axios";
import proImg from "../../assets/images/9434619.jpg";

const Header = () => {
  const location = useLocation();
  const { user } = useAuthContext();
  const [imageData, setImageData] = useState(null);
  Axios.defaults.withCredentials = true;

  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "user")) {
      Axios.get(`http://localhost:5000/auth/customer/${user.email}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((result) => {
          const filename = result.data.filename;
          return Axios.get(`http://localhost:5000/auth/images/${filename}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            responseType: "arraybuffer",
          });
        })
        .then((response) => {
          const base64Image = arrayBufferToBase64(response.data);
          setImageData(base64Image);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const menu = [
    { name: "Home", link: "/" },
    { name: "Shop", link: "/shop" },
    { name: "Blog", link: "/blog" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-white py-3 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] font-sans z-50">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link to="/">
          <img src={Logo} alt="logo" className="w-16 h-auto" />
        </Link>

        {/* Navigation Menu */}
        <nav className="hidden md:flex space-x-6">
          {menu.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className={`text-gray-700 font-semibold hover:text-blue-500 ${
                location.pathname === item.link ? "text-blue-600" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        {user ? (
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-gray-700">{user.email}</span>
            <img
              src={imageData ? `data:image/jpeg;base64,${imageData}` : proImg}
              alt="Profile"
              onClick={() => (window.location.href = `/user/${user.email}`)}
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-500"
            />
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition duration-300">
                Sign In
              </button>
            </Link>
            <Link to="/register">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300">
                Sign Up
              </button>
            </Link>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          {/* Hamburger Icon */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuthContext();
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "user")) {
      Axios.get(`http://localhost:5000/auth/customer/${user.email}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((result) => {
          const filename = result.data.filename;
          return Axios.get(`http://localhost:5000/auth/images/${filename}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            responseType: "arraybuffer",
          });
        })
        .then((response) => {
          const base64Image = arrayBufferToBase64(response.data);
          setImageData(base64Image);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const menu = [
    { name: "Home", link: "/" },
    { name: "Shop", link: "/shop" },
    { name: "Blog", link: "/blog" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <div>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-gray-700 focus:outline-none"
      >
        {isMenuOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Close Icon */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Hamburger Icon */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md">
          <ul className="flex flex-col space-y-2 p-4">
            {menu.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.link}
                  className={`block text-gray-700 font-semibold hover:text-blue-500 ${
                    location.pathname === item.link ? "text-blue-600" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)} // Close menu on link click
                >
                  {item.name}
                </Link>
              </li>
            ))}
            {user ? (
              <>
                <li>
                  <span className="block text-gray-700">{user.email}</span>
                </li>
                <li>
                  <img
                    src={
                      imageData ? `data:image/jpeg;base64,${imageData}` : proImg
                    }
                    alt="Profile"
                    onClick={() => {
                      window.location.href = `/user/${user.email}`;
                      setIsMenuOpen(false);
                    }}
                    className="w-12 h-12 rounded-full cursor-pointer border-2 border-blue-500"
                  />
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <button className="w-full px-4 py-1 text-blue-600 border text-sm border-blue-600 rounded hover:bg-blue-600 hover:text-white transition duration-300">
                      Sign In
                    </button>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300">
                      Sign Up
                    </button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
