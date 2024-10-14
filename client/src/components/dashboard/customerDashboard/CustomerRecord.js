// src/components/Customer/CustomerRecord.jsx

import React, { useState, useEffect } from "react";
import CustomerLayout from "../../Layouts/CustomerLayout";
import axios from "axios";
import { useAuthContext } from "../../../hooks/useAuthContext";
import Swal from "sweetalert2";
import Logo from "../../../assets/images/logo.png"; // Ensure the path and file name are correct
import {
  FaTint,
  FaXRay,
  FaHeartbeat,
  FaStethoscope,
  FaSearch,
} from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";

import { IoMdClose } from "react-icons/io";
import FocusLock from "react-focus-lock";
import { FaVial } from "react-icons/fa"; // Add this import

const CustomerRecord = () => {
  const [testRecords, setTestRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [testTypeCounts, setTestTypeCounts] = useState({});
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { user } = useAuthContext();

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Utility function to get the appropriate icon based on testType
  const getTestTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "blood test":
        return <FaTint className="text-blue-500 w-8 h-8" />;
      case "x-ray":
        return <FaXRay className="text-red-500 w-8 h-8" />;
      case "mri":
        return <GiCheckMark className="text-green-500 w-8 h-8" />;
      case "ultrasound":
        return <FaHeartbeat className="text-pink-500 w-8 h-8" />;
      case "general checkup":
        return <FaStethoscope className="text-indigo-500 w-8 h-8" />;
      case "urine test": // Add this case
        return <FaVial className="text-yellow-500 w-8 h-8" />; // Use a yellow color for urine test
      default:
        return <FaStethoscope className="text-indigo-500 w-8 h-8" />; // Default icon
    }
  };

  useEffect(() => {
    const fetchTestRecords = async () => {
      if (user && user.token) {
        // Ensure _id exists

        const responses = await axios.get(
          `http://localhost:5000/auth/customer/${user.email}`, // Use user._id
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        try {
          const response = await axios.get(
            `http://localhost:5000/auth/getrecord/${responses.data._id}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          console.log("Fetched Test Records:", response.data); // Debugging log
          setTestRecords(response.data);
          setFilteredRecords(response.data);
          setLoading(false);
          calculateTestTypeCounts(response.data);
        } catch (err) {
          console.error("Error fetching test records:", err);
          setError(
            err.response && err.response.data && err.response.data.message
              ? err.response.data.message
              : "Failed to fetch test records. Please try again later."
          );
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              err.response && err.response.data && err.response.data.message
                ? err.response.data.message
                : "Failed to fetch test records. Please try again later.",
          });
        }
      } else {
        console.warn("User information is incomplete:", user);
        setError("User information is incomplete. Please log in again.");
        setLoading(false);
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "User information is incomplete. Please log in again.",
        });
      }
    };

    fetchTestRecords();
  }, [user]);

  const calculateTestTypeCounts = (records) => {
    const counts = records.reduce((acc, record) => {
      acc[record.testType] = (acc[record.testType] || 0) + 1;
      return acc;
    }, {});
    console.log("Test Type Counts:", counts); // Debugging log
    setTestTypeCounts(counts);
  };

  const handleCardClick = (record) => {
    console.log("Selected Record:", record); // Debugging log
    setSelectedRecord(record);
  };

  const closeModal = () => {
    setSelectedRecord(null);
  };

  // Handle closing modal with Esc key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // Handle Search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRecords(testRecords);
    } else {
      const filtered = testRecords.filter((record) =>
        record.testName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecords(filtered);
      setCurrentPage(1); // Reset to first page on new search
    }
  }, [searchQuery, testRecords]);

  // Calculate records for the current page
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800">
            My Test Records
          </h2>
          <p className="text-gray-600 mt-2">
            View and manage your test records below.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex items-center max-w-md">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by Test Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Test Type Counts */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Object.entries(testTypeCounts).map(([type, count]) => (
            <div
              key={type}
              className="bg-white shadow-lg rounded-lg p-6 flex items-center"
            >
              <div className="flex-shrink-0">
                {/* Icon based on test type */}
                {getTestTypeIcon(type)}
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-800">{type}</h3>
                <p className="text-gray-600 mt-1">
                  {count} Record{count !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-gray-600 mb-4 font-bold text-lg">
          View your test records below.
        </p>
        {/* Test Records Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentRecords.map((record) => (
            <div
              key={record._id}
              className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-2xl transition duration-300 ease-in-out"
              onClick={() => handleCardClick(record)}
            >
              <div className="flex items-center">
                {/* Icon */}
                <div className="mr-4">{getTestTypeIcon(record.testType)}</div>
                {/* Test Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {record.testName}
                  </h3>
                  <p className="text-gray-600">
                    Date: {new Date(record.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {filteredRecords.length > recordsPerPage && (
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        )}

        {/* No Test Records Message */}
        {!loading && filteredRecords.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p>No test records found.</p>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center mt-8">
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span className="ml-2 text-blue-500">Loading...</span>
          </div>
        )}

        {/* Modal */}
        {selectedRecord && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <FocusLock>
              <div
                className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative overflow-y-auto max-h-full"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
              >
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
                  aria-label="Close Modal"
                >
                  <IoMdClose className="h-6 w-6" />
                </button>

                {/* Modal Header with Logo */}
                <div className="flex items-center mb-6">
                  <img
                    src={Logo}
                    alt="Hospital Logo"
                    className="h-16 w-16 mr-4 object-contain"
                  />
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-800">
                      Hospital Name
                    </h3>
                    <p className="text-gray-600">
                      123 Medical Street, City, Country
                    </p>
                    <p className="text-gray-600">Phone: (123) 456-7890</p>
                  </div>
                </div>

                {/* Modal Content Styled as Medical Report */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">
                    Medical Report
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <strong>Patient Name:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Test Type:</strong> {selectedRecord.testType}
                    </p>
                    <p>
                      <strong>Test Name:</strong> {selectedRecord.testName}
                    </p>
                    <p>
                      <strong>Result:</strong> {selectedRecord.result}
                    </p>
                    {selectedRecord.comments && (
                      <p>
                        <strong>Comments:</strong> {selectedRecord.comments}
                      </p>
                    )}
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(selectedRecord.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Footer with Close Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </FocusLock>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default CustomerRecord;
