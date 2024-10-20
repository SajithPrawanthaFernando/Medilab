// client/src/components/dashboard/adminDashboard/PeakHour.js
import React, { useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import AdminLayout from "../../Layouts/AdminLayout";
import peakHourImage from "../../../assets/images/peak-hour.png"; // Import an image
import getAxiosInstance from "../../../utils/axiosInstance"; // Import the Singleton instance

const PeakHour = () => {
  const [date, setDate] = useState("");
  const [peakHour, setPeakHour] = useState(null);
  const [error, setError] = useState("");
  const { user } = useAuthContext();

  const axiosInstance = getAxiosInstance(); // Get the singleton axios instance

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPeakHour(null);

    try {
      const response = await axiosInstance.get(`/auth/peak-hour/${date}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (response.data.length === 0) {
        setError("No appointments found for the selected date.");
      } else {
        setPeakHour(response.data[0]);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("No appointments found for the selected date.");
      } else {
        setError("An error occurred while fetching the data.");
      }
    }
  };

  return (
    <AdminLayout>
      {/* Flex Container to divide the screen */}
      <div className="flex min-h-screen">
        {/* Left Side - Form Section */}
        <div className="flex flex-col items-center justify-center w-1/2 p-8 bg-gradient-to-b from-blue-200 to-white border border-gray-300 shadow-2xl rounded-lg">
          <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">
            Find Peak Appointment Hour
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <label htmlFor="dateInput" className="sr-only">
              Date
            </label>
            <input
              id="dateInput"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded-lg p-4 w-full mb-4 focus:outline-none focus:ring focus:ring-blue-400 transition duration-300 shadow-md"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 text-lg shadow-md transform hover:scale-105"
            >
              Get Peak Hour
            </button>
          </form>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          {peakHour && (
            <div className="mt-6 text-center">
              <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                <h2 className="text-2xl font-semibold text-blue-600">
                  Peak Hour: {peakHour._id}:00
                </h2>
                <div className="mt-4 bg-blue-100 p-4 rounded-lg shadow-md">
                  <p className="text-lg text-gray-700">
                    Number of Appointments:{" "}
                    <span className="font-bold">{peakHour.count}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Image Section */}
        <div
          className="w-1/2 bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url(${peakHourImage})` }} // Adding background image
        ></div>
      </div>
    </AdminLayout>
  );
};

export default PeakHour;
