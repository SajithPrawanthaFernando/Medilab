// src/components/Admin/PatientAddTreatment.jsx

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../Layouts/AdminLayout"; // Ensure the path is correct
import axios from "axios";
import Swal from "sweetalert2";
import { FaPlus, FaHospitalAlt } from "react-icons/fa"; // Added hospital icon
import Modal from "react-modal";
import { useAuthContext } from "../../../../hooks/useAuthContext"; // Ensure this hook exists and provides the user context
import proImg from "../../../../assets/images/9434619.jpg";

// Set the app element for accessibility
Modal.setAppElement("#root"); // Ensure that your root element has the id 'root'

const AddTreatment = () => {
  // State variables
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [treatmentData, setTreatmentData] = useState({
    doctorName: "",
    treatmentType: "",
    treatmentName: "",
    medicinePrescribed: "",
    beginDate: "",
    nextSession: "",
    currentStatus: "ongoing", // Default value
    endDate: "",
    frequency: "once a day", // Default value
  });

  // Get user from auth context
  const { user } = useAuthContext(); // Ensure that `user` contains `token`

  // Server URL
  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Fetch users
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
                      Authorization: `Bearer ${user.token}`, // Include auth header if required
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

  // Handle opening the modal
  const openModal = (user) => {
    setSelectedUser(user);
    setTreatmentData({
      doctorName: "",
      treatmentType: "",
      treatmentName: "",
      medicinePrescribed: "",
      beginDate: "",
      nextSession: "",
      currentStatus: "ongoing", // Reset to default
      endDate: "",
      frequency: "once a day", // Reset to default
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
    setTreatmentData((prevData) => ({
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

    const {
      doctorName,
      treatmentType,
      treatmentName,
      medicinePrescribed,
      beginDate,
      nextSession,
      currentStatus,
      endDate,
      frequency,
    } = treatmentData;

    // Basic validation
    if (
      !doctorName ||
      !treatmentType ||
      !treatmentName ||
      !medicinePrescribed ||
      !beginDate
    ) {
      Swal.fire("Error", "Please fill in all required fields.", "error");
      return;
    }

    try {
      const payload = {
        userId: selectedUser._id, // Use selectedUser's _id
        doctorName,
        treatmentType,
        treatmentName,
        medicinePrescribed,
        beginDate,
        nextSession,
        currentStatus,
        endDate,
        frequency,
      };

      const response = await axios.post(
        `${serverUrl}/auth/addtreatment`, // Ensure this endpoint is correct
        payload,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        Swal.fire(
          "Success",
          "Patient treatment added successfully!",
          "success"
        );
        closeModal();
      } else {
        Swal.fire(
          "Error",
          "Failed to add the patient treatment. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error adding treatment:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to add the patient treatment.",
        "error"
      );
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-semibold flex items-center">
              <FaHospitalAlt className="mr-2 text-blue-600" /> Add Patient
              Treatment
            </h2>
            <p className="text-gray-600">
              Manage your hospital patients' treatments
            </p>
          </div>
        </div>

        {/* Patients Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-100 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Image</th>
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Register Date</th>
                <th className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-200 hover:bg-blue-50"
                >
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
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <span>{user._id}</span>
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
                      <FaPlus className="mr-2" /> Add Treatment
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="py-4 px-6 text-center text-gray-500"
                  >
                    No patients found.
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
          contentLabel="Add Treatment Modal"
          className="bg-white rounded-lg w-full max-w-3xl mx-auto p-6 relative shadow-lg transform transition-all duration-300"
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
            <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
              <img
                src={selectedUser?.imageUrl || "/path/to/default/image.jpg"}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Add Treatment for {selectedUser?.username}
            </h2>
          </div>

          {/* Modal Form */}
          <form onSubmit={handleSubmit}>
            {/* Doctor Name Field */}
            <div className="mb-4">
              <label
                htmlFor="doctorName"
                className="block text-gray-700 font-medium mb-2"
              >
                Doctor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="doctorName"
                name="doctorName"
                value={treatmentData.doctorName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Treatment Type Field */}
            <div className="mb-4">
              <label
                htmlFor="treatmentType"
                className="block text-gray-700 font-medium mb-2"
              >
                Treatment Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="treatmentType"
                name="treatmentType"
                value={treatmentData.treatmentType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Treatment Name Field */}
            <div className="mb-4">
              <label
                htmlFor="treatmentName"
                className="block text-gray-700 font-medium mb-2"
              >
                Treatment Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="treatmentName"
                name="treatmentName"
                value={treatmentData.treatmentName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Medicine Prescribed Field */}
            <div className="mb-4">
              <label
                htmlFor="medicinePrescribed"
                className="block text-gray-700 font-medium mb-2"
              >
                Medicine Prescribed <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="medicinePrescribed"
                name="medicinePrescribed"
                value={treatmentData.medicinePrescribed}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Begin Date Field */}
            <div className="mb-4">
              <label
                htmlFor="beginDate"
                className="block text-gray-700 font-medium mb-2"
              >
                Begin Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="beginDate"
                name="beginDate"
                value={treatmentData.beginDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Next Session Field */}
            <div className="mb-4">
              <label
                htmlFor="nextSession"
                className="block text-gray-700 font-medium mb-2"
              >
                Next Session
              </label>
              <input
                type="date"
                id="nextSession"
                name="nextSession"
                value={treatmentData.nextSession}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Current Status Field */}
            <div className="mb-4">
              <label
                htmlFor="currentStatus"
                className="block text-gray-700 font-medium mb-2"
              >
                Current Status <span className="text-red-500">*</span>
              </label>
              <select
                id="currentStatus"
                name="currentStatus"
                value={treatmentData.currentStatus}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              >
                <option value="ongoing">Ongoing</option>
                <option value="end">End</option>
              </select>
            </div>

            {/* End Date Field */}
            <div className="mb-4">
              <label
                htmlFor="endDate"
                className="block text-gray-700 font-medium mb-2"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={treatmentData.endDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Frequency Field */}
            <div className="mb-4">
              <label
                htmlFor="frequency"
                className="block text-gray-700 font-medium mb-2"
              >
                Frequency <span className="text-red-500">*</span>
              </label>
              <select
                id="frequency"
                name="frequency"
                value={treatmentData.frequency}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              >
                <option value="once a day">Once a Day</option>
                <option value="once every two days">Once Every Two Days</option>
                <option value="once a week">Once a Week</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Submit
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AddTreatment;
