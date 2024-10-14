// src/components/Admin/PatientAddReport.js

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../Layouts/AdminLayout";
import axios from "axios";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { FaPlus, FaHospitalAlt } from "react-icons/fa";
import PieChart from "../../../charts/PieChart";
import proImg from "../../../../assets/images/9434619.jpg";
import Modal from "react-modal";
import { useAuthContext } from "../../../../hooks/useAuthContext";

// Set the app element for accessibility
Modal.setAppElement("#root");

const PatientAddReport = () => {
  // State variables
  const [users, setUsers] = useState([]);
  const [registrationData, setRegistrationData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reportData, setReportData] = useState({
    testType: "",
    testName: "",
    result: "",
    date: "",
    comments: "",
  });

  // Get user from auth context
  const { user } = useAuthContext();

  // Server URL
  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

  // Function to convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Fetch users and their profile images
  useEffect(() => {
    const fetchUsersWithImages = async () => {
      try {
        // Fetch customers with authorization
        const result = await axios.get(`${serverUrl}/auth/handlecustomer`, {
          headers: {
            Authorization: `Bearer ${user.token}`, // Include auth header
          },
        });

        // Filter users with role 'user'
        const filteredUsers = result.data.filter(
          (user) => user.role === "user"
        );

        // Fetch profile images concurrently
        const usersWithImages = await Promise.all(
          filteredUsers.map(async (user) => {
            if (user.filename) {
              try {
                const imageResponse = await axios.get(
                  `${serverUrl}/auth/images/${user.filename}`,
                  {
                    responseType: "arraybuffer",
                    headers: {
                      Authorization: `Bearer ${user.token}`, // Include auth header
                    },
                  }
                );
                const base64Image = arrayBufferToBase64(imageResponse.data);
                return { ...user, profileImageData: base64Image };
              } catch (err) {
                console.error(`Error fetching image for ${user.email}:`, err);
                return { ...user, profileImageData: null };
              }
            } else {
              return { ...user, profileImageData: null };
            }
          })
        );

        setUsers(usersWithImages);

        // Prepare registration data for charts
        const registrationDates = usersWithImages.map(
          (user) => user.updated.split("T")[0]
        );
        const registrationCounts = registrationDates.reduce((acc, date) => {
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
        const registrationDataArray = Object.entries(registrationCounts).map(
          ([date, count]) => ({
            date,
            count,
          })
        );
        setRegistrationData(registrationDataArray);
      } catch (err) {
        console.error("Error fetching customers:", err);
        Swal.fire("Error", "Failed to fetch customers.", "error");
      }
    };

    // Only fetch if user and token are available
    if (user && user.token) {
      fetchUsersWithImages();
    }
  }, [serverUrl, user]);

  // Function to export data to Excel
  const exportToExcel = () => {
    // Filtered array containing only specific fields
    const filteredUsers = users.map(
      ({
        _id,
        username,
        email,
        phone,
        updated,
        address,
        profileImagePath,
      }) => ({
        _id,
        username,
        email,
        phone,
        updated,
        address,
        profileImagePath,
      })
    );

    // Creating a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert filteredUsers array to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    // Generate an Excel file and trigger download
    XLSX.writeFile(workbook, "CustomerData.xlsx");
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle opening the modal
  const openModal = (user) => {
    setSelectedUser(user);
    setReportData({
      testType: "",
      testName: "",
      result: "",
      date: "",
      comments: "",
    });
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      Swal.fire("Error", "No user selected.", "error");
      return;
    }

    const { testType, testName, result, date } = reportData;

    if (!testType || !testName || !result || !date) {
      Swal.fire("Error", "Please fill in all required fields.", "error");
      return;
    }

    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    // Validate date - ensure it's today or a previous date
    if (date > today) {
      Swal.fire(
        "Error",
        "Please select today's date or a previous date.",
        "error"
      );
      return;
    }

    try {
      const payload = {
        userId: selectedUser._id,
        testType,
        testName,
        result,
        date,
        comments: reportData.comments, // Include comments, which can be optional
      };

      const response = await axios.post(
        `${serverUrl}/auth/addrecord`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        Swal.fire("Success", "Patient report added successfully!", "success");
        closeModal();
      } else {
        Swal.fire(
          "Error",
          "Failed to add the patient report. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error adding report:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to add the patient report.",
        "error"
      );
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow-md mx-1 my-2 h-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-semibold flex items-center">
              <FaHospitalAlt className="mr-2 text-blue-600" /> Add Patient
              Report
            </h2>
            <p className="text-gray-600">
              {" "}
              Manage your hospital patients' records
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by username"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                {/* Search Icon */}
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            {/* Export Button */}
            <button
              onClick={exportToExcel}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Export to Excel
            </button>
          </div>
        </div>

        {/* Customers Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-100 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Profile</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Register Date</th>
                <th className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-200 hover:bg-blue-50"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <span>{user._id}</span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <img
                      src={
                        user.profileImageData
                          ? `data:image/jpeg;base64,${user.profileImageData}`
                          : proImg
                      }
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop if fallback fails
                        e.target.src = "https://via.placeholder.com/40";
                      }}
                    />
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span className="font-medium">{user.username}</span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{user.email}</span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{user.phone}</span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{new Date(user.updated).toLocaleDateString()}</span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => openModal(user)}
                      className="flex items-center justify-center px-3 py-2 ml-[5.5rem] bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                      <FaPlus className="mr-2" /> Add Report
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="py-4 px-6 text-center text-gray-500"
                  >
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Add Report Modal"
          className="bg-white rounded-lg max-w-2xl w-full mx-auto p-6 relative shadow-lg transform transition-all duration-300"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none"
            aria-label="Close Modal"
          >
            &times;
          </button>

          {/* Modal Header */}
          <div className="flex items-center mb-4">
            <FaHospitalAlt className="text-blue-600 text-3xl mr-2" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Add Patient Report
            </h2>
          </div>

          {/* Modal Form */}
          <form onSubmit={handleSubmit}>
            {/* Test Type Field */}
            <div className="mb-4">
              <label
                htmlFor="testType"
                className="block text-gray-700 font-medium mb-2"
              >
                Test Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="testType"
                name="testType"
                value={reportData.testType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Blood Test"
              />
            </div>

            {/* Test Name Field */}
            <div className="mb-4">
              <label
                htmlFor="testName"
                className="block text-gray-700 font-medium mb-2"
              >
                Test Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="testName"
                name="testName"
                value={reportData.testName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Complete Blood Count"
              />
            </div>

            {/* Result Field */}
            <div className="mb-4">
              <label
                htmlFor="result"
                className="block text-gray-700 font-medium mb-2"
              >
                Result <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="result"
                name="result"
                value={reportData.result}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Normal"
              />
            </div>

            {/* Date Field */}
            <div className="mb-6">
              <label
                htmlFor="date"
                className="block text-gray-700 font-medium mb-2"
              >
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={reportData.date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Comments Field - Newly Added */}
            <div className="mb-4">
              <label
                htmlFor="comments"
                className="block text-gray-700 font-medium mb-2"
              >
                Comments (Optional)
              </label>
              <textarea
                id="comments"
                name="comments"
                value={reportData.comments}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any additional notes"
              />
            </div>

            {/* Form Buttons */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 mr-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center"
              >
                <FaPlus className="mr-2" /> Add Report
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default PatientAddReport;
