import React from "react";
import BgImg from "../../assets/images/background.jpg";
import { Link } from "react-router-dom";

const PageTopBanner = ({ title }) => {
  return (
    <div
      className="flex flex-col justify-center items-center py-20 h-64"
      style={{
        backgroundImage: `url(${BgImg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h2 className="text-black text-4xl font-bold mb-2 pt-20">{title}</h2>
      <nav aria-label="breadcrumb">
        <ol className="flex space-x-2 text-black">
          <li>
            <Link
              to="/"
              className="hover:text-blue-300 transition duration-300"
            >
              Home
            </Link>
          </li>
          <li className="text-gray-300">/</li>
          <li className="font-medium">{title}</li>
        </ol>
      </nav>
    </div>
  );
};

export default PageTopBanner;
