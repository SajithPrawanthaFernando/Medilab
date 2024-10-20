import React from "react";

const Card = ({ title, number, icon, subtext }) => {
  return (
    <div className="bg-white border border-1 border-b-[0_2px_12px_-4px_rgba(6,81,237,0.3)]  rounded-lg shadow-[0_2px_12px_-4px_rgba(6,81,237,0.3)] p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-gray-700">{number}</h2>
        <div className="bg-blue-500 text-white rounded-full flex items-center justify-center w-12 h-12">
          {icon}
        </div>
      </div>
      <h4 className="text-xl font-medium text-gray-800 mt-3">{title}</h4>
      <p className="text-gray-600">{subtext}</p>
    </div>
  );
};

export default Card;
