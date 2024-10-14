// src/components/Admin/UserTreatmentRecords.js

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../Layouts/AdminLayout";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Modal from "react-modal";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import proImg from "../../../../assets/images/9434619.jpg";
import { FaPlus, FaHospitalAlt } from "react-icons/fa";

Modal.setAppElement("#root");

const UserTreatmentRecords = () => {
  const [users, setUsers] = useState([]);
  const [treatmentRecords, setTreatmentRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [formData, setFormData] = useState({
    treatmentType: "",
    treatmentName: "",
    medicinePrescribed: "",
    beginDate: "",
    nextSession: "",
    currentStatus: "",
    progress: 0,
    endDate: "",
    frequency: "",
  });

  const [errors, setErrors] = useState({
    beginDate: "",
    endDate: "",
    nextSession: "",
  });

  const { user } = useAuthContext();
  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

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

  const fetchTreatmentRecords = async (userId) => {
    try {
      const result = await axios.get(
        `${serverUrl}/auth/gettreatment/${userId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setTreatmentRecords(result.data);
    } catch (err) {
      console.error("Error fetching treatment records:", err);
      Swal.fire("Error", "Failed to fetch treatment records.", "error");
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    fetchTreatmentRecords(user._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setTreatmentRecords([]);
    setCurrentRecord(null); // Reset the current record when closing the modal
  };

  // Handle delete record
  const handleDeleteRecord = async (recordId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the record.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${serverUrl}/auth/deletetreatment/${recordId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        Swal.fire("Deleted!", "Your record has been deleted.", "success");
        fetchTreatmentRecords(selectedUser._id); // Refresh treatment records after deletion
      } catch (err) {
        console.error("Error deleting record:", err);
        Swal.fire("Error", "Failed to delete record.", "error");
      }
    }
  };

  // Handle edit record
  const handleEditRecord = (record) => {
    setCurrentRecord(record); // Set the current record for editing
    setFormData({
      treatmentType: record.treatmentType,
      treatmentName: record.treatmentName,
      medicinePrescribed: record.medicinePrescribed,
      beginDate: new Date(record.beginDate).toISOString().split("T")[0], // Format date for input
      nextSession: record.nextSession
        ? new Date(record.nextSession).toISOString().split("T")[0]
        : "",
      currentStatus: record.currentStatus,
      progress: record.progress,
      endDate: record.endDate
        ? new Date(record.endDate).toISOString().split("T")[0]
        : "",
      frequency: record.frequency,
    });
    setEditModalOpen(true); // Open the edit modal
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle submit edit
  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({
      beginDate: "",
      endDate: "",
      nextSession: "",
    });

    // Date validation
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day for comparison
    const beginDate = new Date(formData.beginDate);
    const endDate = new Date(formData.endDate);
    const nextSession = new Date(formData.nextSession);

    // Check if the begin date is today or a future date
    if (beginDate < today) {
      newErrors.beginDate = "Begin date must be today or a future date.";
    }

    // Check if the end date is after the begin date
    if (endDate <= beginDate) {
      newErrors.endDate = "End date must be after the begin date.";
    }

    // Check if the next session is after the begin date
    if (nextSession <= beginDate) {
      newErrors.nextSession = "Next session must be after the begin date.";
    }

    // Check if the end date is after the next session
    if (endDate <= nextSession) {
      newErrors.endDate = "End date must be after the next session.";
    }

    if (Object.keys(newErrors).length) {
      // Display validation errors using SweetAlert
      let errorMessage = "";
      if (newErrors.beginDate) {
        errorMessage += `${newErrors.beginDate}\n`;
      }
      if (newErrors.endDate) {
        errorMessage += `${newErrors.endDate}\n`;
      }
      if (newErrors.nextSession) {
        errorMessage += `${newErrors.nextSession}\n`;
      }

      Swal.fire({
        title: "Validation Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Okay",
      });

      return; // Stop submission if there are errors
    }

    try {
      await axios.put(
        `${serverUrl}/auth/updatetreatment/${currentRecord._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      Swal.fire("Success!", "Record updated successfully.", "success");
      setEditModalOpen(false);
      fetchTreatmentRecords(selectedUser._id);
    } catch (err) {
      console.error("Error updating record:", err);
      Swal.fire("Error", "Failed to update record.", "error");
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow-md mx-1 my-2 h-full">
        {/* Header Section */}
        <h2 className="text-2xl font-semibold flex items-center">
          <FaHospitalAlt className="mr-2 text-blue-600" /> View Patient
          Treatment
        </h2>
        <p className="text-gray-600 mb-12">
          Manage your hospital patients' treatments
        </p>

        {/* Users Table */}
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
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-200 hover:bg-blue-50"
                >
                  <td className="py-3 px-6 text-left">
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
                      <FaEye className="mr-2" /> View Records
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="py-4 px-6 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal for displaying treatment records */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="View Treatment Records Modal"
          className="bg-white rounded-lg max-w-2xl mx-auto p-6 relative shadow-lg transform transition-all duration-300"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <h2 className="text-xl font-semibold mb-4">
            Treatment Records for {selectedUser?.username}
          </h2>
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-blue-100 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Type</th>
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {treatmentRecords.map((record) => (
                  <tr
                    key={record._id}
                    className="border-b border-gray-200 hover:bg-blue-50"
                  >
                    <td className="py-3 px-6 text-left">
                      {record.treatmentType}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {record.treatmentName}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {record.currentStatus}
                    </td>
                    <td className="py-3 px-6 text-center flex justify-center">
                      <button
                        onClick={() => handleEditRecord(record)}
                        className="mr-2 text-blue-500 hover:underline"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteRecord(record._id)}
                        className="text-red-500 hover:underline"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
                {treatmentRecords.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-4 px-6 text-center text-gray-500"
                    >
                      No treatment records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Modal>

        {/* Edit Modal for Treatment Record */}
        <Modal
          isOpen={editModalOpen}
          onRequestClose={() => setEditModalOpen(false)}
          contentLabel="Edit Treatment Record Modal"
          className="bg-white rounded-lg max-w-lg mx-auto p-6 relative shadow-lg transform transition-all duration-300"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <h2 className="text-xl font-semibold mb-4">Edit Treatment Record</h2>
          <button
            onClick={() => setEditModalOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
          <form onSubmit={handleSubmitEdit}>
            {/* Treatment Type and Treatment Name in one row */}
            <div className="flex mb-4 space-x-4">
              <div className="flex-1">
                <label className="block mb-1 font-medium">Treatment Type</label>
                <input
                  type="text"
                  name="treatmentType"
                  value={formData.treatmentType}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium">Treatment Name</label>
                <input
                  type="text"
                  name="treatmentName"
                  value={formData.treatmentName}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
              </div>
            </div>
            {/* Medicine Prescribed Field */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                Medicine Prescribed
              </label>
              <input
                type="text"
                name="medicinePrescribed"
                value={formData.medicinePrescribed}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded-md w-full"
              />
            </div>
            {/* Begin Date and Next Session in one row */}
            <div className="flex mb-4 space-x-4">
              <div className="flex-1">
                <label className="block mb-1 font-medium">Begin Date</label>
                <input
                  type="date"
                  name="beginDate"
                  value={formData.beginDate}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium">Next Session</label>
                <input
                  type="date"
                  name="nextSession"
                  value={formData.nextSession}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
              </div>
            </div>
            {/* Current Status Field */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Current Status</label>
              <select
                name="currentStatus"
                value={formData.currentStatus}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded-md w-full"
              >
                <option value="" disabled>
                  Select status
                </option>
                <option value="ongoing">Ongoing</option>
                <option value="end">End</option>
              </select>
            </div>
            {/* End Date and Frequency in one row */}
            <div className="flex mb-4 space-x-4">
              <div className="flex-1">
                <label className="block mb-1 font-medium">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium">Frequency</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-2 rounded-md w-full"
                >
                  <option value="" disabled>
                    Select frequency
                  </option>
                  <option value="once a day">Once a day</option>
                  <option value="once every two days">
                    Once every two days
                  </option>
                  <option value="once a week">Once a week</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
            >
              Update Record
            </button>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default UserTreatmentRecords;
