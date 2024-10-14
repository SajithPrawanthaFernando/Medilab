import React, { useState, useEffect } from "react";
import CustomerLayout from "../../Layouts/CustomerLayout";
import axios from "axios";
import { useAuthContext } from "../../../hooks/useAuthContext";
import Swal from "sweetalert2";
import { FaFilter, FaHospitalAlt, FaTimes, FaSearch } from "react-icons/fa";
import FocusLock from "react-focus-lock";
import Logo from "../../../assets/images/logo.png";

const CustomerTreatment = () => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const { user } = useAuthContext();

  // Filter state
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTreatments = async () => {
      if (user && user.token) {
        const responses = await axios.get(
          `http://localhost:5000/auth/customer/${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        try {
          const response = await axios.get(
            `http://localhost:5000/auth/gettreatment/${responses.data._id}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          setTreatments(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching treatments:", error);
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch treatments. Please try again later.",
          });
        }
      }
    };

    fetchTreatments();
  }, [user]);

  const handleCardClick = (treatment) => {
    const progress = calculateProgress(
      treatment.beginDate,
      treatment.endDate,
      treatment.frequency
    );
    setSelectedTreatment({ ...treatment, progress }); // Include progress in selectedTreatment
  };

  const closeModal = () => {
    setSelectedTreatment(null);
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

  // Calculate progress
  const calculateProgress = (beginDate, endDate, frequency) => {
    const totalDuration = Math.abs(new Date(endDate) - new Date(beginDate));
    const currentDate = new Date();
    const elapsedDuration = Math.abs(currentDate - new Date(beginDate));

    let frequencyInDays;
    switch (frequency) {
      case "once a day":
        frequencyInDays = 1;
        break;
      case "twice a day":
        frequencyInDays = 0.5; // Every half day
        break;
      case "once a week":
        frequencyInDays = 7;
        break;
      default:
        frequencyInDays = 1; // Default to once a day
    }

    const totalIntervals =
      totalDuration / (frequencyInDays * 24 * 60 * 60 * 1000);
    const elapsedIntervals =
      elapsedDuration / (frequencyInDays * 24 * 60 * 60 * 1000);

    return Math.min(Math.round((elapsedIntervals / totalIntervals) * 100), 100);
  };

  // Filter treatments based on status and search term
  const filteredTreatments = treatments.filter((treatment) => {
    const matchesStatus =
      statusFilter === "all" || treatment.currentStatus === statusFilter;
    const matchesSearch = treatment.treatmentName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800">
            My Treatments
          </h2>
          <p className="text-gray-600 mt-2">
            View and manage your treatments below.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 flex items-center">
          <input
            type="text"
            placeholder="Search by Treatment Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 w-1/3 mr-2"
          />
          <FaSearch className="text-gray-400" />
          <label htmlFor="statusFilter" className="mr-2 text-gray-600 ml-4">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="all">All</option>
            <option value="ongoing">Ongoing</option>
            <option value="end">Ended</option>
          </select>
          <FaFilter className="text-gray-400 ml-2" />
        </div>

        {/* Treatments List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredTreatments.map((treatment) => (
            <div
              key={treatment._id}
              className="bg-white border border-1 border-b-[0_2px_12px_-4px_rgba(6,81,237,0.3)] rounded-lg shadow-[0_2px_12px_-4px_rgba(6,81,237,0.3)] p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => handleCardClick(treatment)}
            >
              <h3 className="text-lg font-semibold flex items-center">
                <FaHospitalAlt className="text-blue-500 mr-2 " />{" "}
                {/* Hospital management icon */}
                {treatment.treatmentName}
              </h3>
              <p className="text-gray-600 mt-2">
                <strong>Status:</strong> {treatment.currentStatus}
              </p>
              <p className="text-gray-600">
                <strong>Start Date:</strong>{" "}
                {new Date(treatment.beginDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <strong>End Date:</strong>{" "}
                {new Date(treatment.endDate).toLocaleDateString()}
              </p>
              <div className="mt-2">
                <div className="relative pt-1">
                  <div className="flex justify-between">
                    <div>
                      <span className="text-xs text-gray-600">Progress</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-600">
                        {calculateProgress(
                          treatment.beginDate,
                          treatment.endDate,
                          treatment.frequency
                        )}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="flex h-4">
                    <div
                      className="bg-blue-500"
                      style={{
                        height: "100%",
                        width: `${calculateProgress(
                          treatment.beginDate,
                          treatment.endDate,
                          treatment.frequency
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedTreatment && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <FocusLock>
              <div
                className="bg-white rounded-lg shadow-lg w-[130%] max-w-2xl p-10 relative overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
              >
                {/* Hospital Logo and Address */}
                <div className="text-center mb-4">
                  <img
                    src={Logo} // Replace with the path to your hospital logo
                    alt="Hospital Logo"
                    className="mx-auto h-12"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    123 Medical Street, City, Country
                  </p>
                  <p className="text-gray-600">Phone: (123) 456-7890</p>
                </div>

                {/* Modal Header */}
                <h4 className="text-2xl font-semibold text-gray-800 mb-4">
                  Treatment Report
                </h4>

                {/* Modal Content Styled as Treatment Report */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <p>
                    <strong>Patient Name:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Treatment Type:</strong>{" "}
                    {selectedTreatment.treatmentType}
                  </p>
                  <p>
                    <strong>Treatment Name:</strong>{" "}
                    {selectedTreatment.treatmentName}
                  </p>
                  <p>
                    <strong>Doctor Name:</strong> {selectedTreatment.doctorName}
                  </p>
                  <p>
                    <strong>Current Status:</strong>{" "}
                    {selectedTreatment.currentStatus}
                  </p>
                  <p>
                    <strong>Progress:</strong> {selectedTreatment.progress}%
                  </p>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {new Date(selectedTreatment.beginDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>End Date:</strong>{" "}
                    {new Date(selectedTreatment.endDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Frequency:</strong> {selectedTreatment.frequency}
                  </p>
                  <p>
                    <strong>Medicine Prescribed:</strong>{" "}
                    {selectedTreatment.medicinePrescribed}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 relative pt-1 mb-4">
                  <div className="flex justify-between">
                    <div>
                      <span className="text-xs text-gray-600">Progress</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-600">
                        {selectedTreatment.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="flex h-4 bg-gray-200 rounded">
                    <div
                      className="bg-blue-500 rounded"
                      style={{ width: `${selectedTreatment.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Additional Information */}
                <h5 className="text-lg font-semibold mb-2">
                  Additional Information
                </h5>
                <p className="text-gray-600 mb-2">
                  <strong>Next Session:</strong>{" "}
                  {selectedTreatment.nextSession || "N/A"}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Frequency:</strong> {selectedTreatment.frequency}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Progress:</strong> {selectedTreatment.progress}%
                </p>

                {/* Close Button at the Bottom */}
                <div className="mt-6">
                  <button
                    onClick={closeModal}
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </FocusLock>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-6">
            <span className="loader"></span>{" "}
          </div>
        )}

        {/* Error Handling */}
        {error && <div className="text-red-600 text-center mt-4">{error}</div>}
      </div>
    </CustomerLayout>
  );
};

export default CustomerTreatment;
