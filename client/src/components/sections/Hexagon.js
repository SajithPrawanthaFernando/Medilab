// src/Hexagon.js
import React from "react";

const Hexagon = ({ icon, title, description }) => {
  return (
    <div className="relative transform transition-transform duration-300 hover:scale-105 ">
      <div className="hexagon bg-blue-200 text-center p-6 flex flex-col justify-center items-center h-80 w-80 m-3 shadow-lg">
        <img src={icon} alt={title} className="w-16 h-16 mb-2" />
        <h2 className="font-bold text-lg">{title}</h2>
        <p className="text-gray-700 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default Hexagon;
