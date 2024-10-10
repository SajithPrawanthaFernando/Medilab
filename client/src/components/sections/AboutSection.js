import React from "react";
import handshakeImage from "../../assets/images/handshake.jpg"; // Update with the correct path
import doctorImage from "../../assets/images/nurse.jpeg"; // Update with the correct path
import userImage1 from "../../assets/images/users.webp"; // Update with the correct path
import userImage2 from "../../assets/images/hand.jpg"; // Update with the correct path

const InfoSection = () => {
  return (
    <section className="container mx-auto px-4 py-12 bg-gray-50">
      <h1 className="text-4xl font-bold text-center mb-10">
        Our Commitment to <span className="text-blue-600">Excellence</span>
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Row */}
        <div className="flex justify-center items-center p-6 rounded-2xl shadow-md bg-white">
          <img
            src={handshakeImage}
            alt="Handshake"
            className="rounded-lg object-cover "
          />
        </div>
        <div className="flex justify-center items-center bg-blue-100 text-white rounded-2xl p-6 shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 mr-2" // Adjust size and margin as needed
            viewBox="0 0 24 24"
            fill="#172554" // This makes the color inherit from the parent
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <h1 className="text-4xl font-bold text-center">Medilab</h1>
        </div>

        <div className="flex justify-center items-center p-6 rounded-2xl shadow-md bg-white">
          <img
            src={doctorImage}
            alt="Doctor"
            className="rounded-lg object-cover"
          />
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col justify-center items-center bg-blue-100 rounded-lg p-6 col-span-2 shadow-md">
          <div className="flex items-center space-x-2 mb-2">
            <img
              src={userImage1}
              alt="User 1"
              className="w-12 h-12 rounded-full border-2 border-white"
            />
            <img
              src={userImage2}
              alt="User 2"
              className="w-12 h-12 rounded-full border-2 border-white"
            />
            <img
              src={userImage1}
              alt="User 1"
              className="w-12 h-12 rounded-full border-2 border-white"
            />
            <img
              src={userImage1}
              alt="User 1"
              className="w-12 h-12 rounded-full border-2 border-white"
            />
            <img
              src={userImage1}
              alt="User 1"
              className="w-12 h-12 rounded-full border-2 border-white"
            />
          </div>
          <div className="flex flex-col justify-center items-center bg-blue-100 rounded-lg p-6 shadow-md">
            <div className="flex flex-wrap justify-center items-center space-x-8">
              <div className="text-center">
                <p className="text-3xl font-semibold">7K+</p>
                <p className="text-gray-700">Satisfied Users</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold">3,000+</p>
                <p className="text-gray-700">Doctors and growing!</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold">5M+</p>
                <p className="text-gray-700">
                  Appointments/Records Handled Annually
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center p-6 rounded-2xl shadow-md bg-white">
          <img
            src={userImage2}
            alt="User"
            className="rounded-lg object-cover "
          />
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
