import React from "react";
import heroImage from "../../assets/images/hosp.jpg"; // Update with the correct path
import logo from "../../assets/images/logo.png";

const HeroSection = () => {
  return (
    <section className="bg-white pt-24">
      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center justify-between">
        {/* Left Section: Text */}
        <div className="lg:w-2/3 pl-10 pr-10">
          <div className="flex items-center mb-6">
            <div className="w-32 h-auto flex justify-center items-center">
              <img src={logo} alt="Medilab Logo" className="w-full h-auto" />
            </div>
          </div>

          <h1 className="text-3xl font-bold  mb-4">
            Welcome to <span className="text-blue-600">Medilab</span>
          </h1>
          <p className="text-lg text-gray-600">
            Designed to help healthcare professionals by providing real-time
            patient data, easy-to-understand visuals, and smooth integration,
            making patient care more efficient and effective.
          </p>
          <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
            Learn More
          </button>
        </div>

        {/* Right Section: Image */}
        <div className="lg:w-1/2 mt-8 lg:mt-0 flex justify-center">
          <img
            src={heroImage}
            alt="Healthcare Hero"
            className="rounded-2xl shadow-lg transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
