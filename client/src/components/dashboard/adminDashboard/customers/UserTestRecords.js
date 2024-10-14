// src/components/Admin/UserTestRecords.js

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

const UserTestRecords = () => {
  const [users, setUsers] = useState([]);
  const [testRecords, setTestRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [formData, setFormData] = useState({
    testType: "",
    testName: "",
    result: "",
    date: "",
    comments: "",
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

  const fetchTestRecords = async (userId) => {
    try {
      const result = await axios.get(`${serverUrl}/auth/getrecord/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTestRecords(result.data);
    } catch (err) {
      console.error("Error fetching test records:", err);
      Swal.fire("Error", "Failed to fetch test records.", "error");
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    fetchTestRecords(user._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setTestRecords([]);
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
        await axios.delete(`${serverUrl}/auth/deleterecord/${recordId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        Swal.fire("Deleted!", "Your record has been deleted.", "success");
        fetchTestRecords(selectedUser._id); // Refresh test records after deletion
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
      testType: record.testType,
      testName: record.testName,
      result: record.result,
      date: new Date(record.date).toISOString().split("T")[0], // Format date for input
      comments: record.comments || "",
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
  // ... (imports and initial component code)

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    // Validate the form fields
    const { testType, testName, result, date } = formData;

    // Check if any field is empty
    if (!testType || !testName || !result || !date) {
      Swal.fire("Error", "All fields are required.", "error");
      return;
    }

    // Check if date is valid
    const selectedDate = new Date(date);
    const today = new Date();

    // Date validation
    if (selectedDate > today) {
      Swal.fire("Error", "The date cannot be in the future.", "error");
      return;
    }

    try {
      await axios.put(
        `${serverUrl}/auth/updaterecord/${currentRecord._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      Swal.fire("Success!", "Record updated successfully.", "success");
      setEditModalOpen(false);
      fetchTestRecords(selectedUser._id); // Refresh test records after update
    } catch (err) {
      console.error("Error updating record:", err);
      Swal.fire("Error", "Failed to update record.", "error");
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow-md mx-1 my-2 h-full">
        {/* Header Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold flex items-center">
            <FaHospitalAlt className="mr-2 text-blue-600" /> View Patient Report
          </h2>
          Manage your hospital patients' Reports
        </div>

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

        {/* Modal for displaying test records */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="View Test Records Modal"
          className="bg-white rounded-lg w-full max-w-4xl mx-auto p-6 relative shadow-lg transform transition-all duration-300"
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Test Records for {selectedUser?.username}
          </h2>

          {/* Test Records List */}
          <div>
            {testRecords.length > 0 ? (
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-100 text-gray-700 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Test Type</th>
                    <th className="py-3 px-6 text-left">Test Name</th>
                    <th className="py-3 px-6 text-left">Result</th>
                    <th className="py-3 px-6 text-left">Date</th>
                    <th className="py-3 px-6 text-left">Comments</th>
                    <th className="py-3 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {testRecords.map((record) => (
                    <tr
                      key={record._id}
                      className="border-b border-gray-200 hover:bg-blue-50"
                    >
                      <td className="py-3 px-6 text-left">{record.testType}</td>
                      <td className="py-3 px-6 text-left">{record.testName}</td>
                      <td className="py-3 px-6 text-left">{record.result}</td>
                      <td className="py-3 px-6 text-left">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {record.comments || "N/A"}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button
                          onClick={() => handleEditRecord(record)}
                          className="mr-2 text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(record._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">
                No test records found for this user.
              </p>
            )}
          </div>
        </Modal>

        {/* Modal for editing test record */}
        <Modal
          isOpen={editModalOpen}
          onRequestClose={() => setEditModalOpen(false)}
          contentLabel="Edit Test Record Modal"
          className="bg-white rounded-lg w-min-lg mx-auto p-6  px-5 relative shadow-lg transform transition-all duration-300"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <button
            onClick={() => setEditModalOpen(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none"
            aria-label="Close Modal"
          >
            &times;
          </button>

          <h2 className="text-2xl font-semibold mb-4">Edit Test Record</h2>

          <form onSubmit={handleSubmitEdit}>
            <div className="mb-4">
              <label htmlFor="testType" className="block text-gray-700">
                Test Type
              </label>
              <input
                type="text"
                id="testType"
                name="testType"
                value={formData.testType}
                onChange={handleChange}
                className="border rounded w-full py-2 px-3 text-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="testName" className="block text-gray-700">
                Test Name
              </label>
              <input
                type="text"
                id="testName"
                name="testName"
                value={formData.testName}
                onChange={handleChange}
                className="border rounded w-full py-2 px-3 text-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="result" className="block text-gray-700">
                Result
              </label>
              <input
                type="text"
                id="result"
                name="result"
                value={formData.result}
                onChange={handleChange}
                className="border rounded w-full py-2 px-3 text-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="date" className="block text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="border rounded w-full py-2 px-3 text-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="comments" className="block text-gray-700">
                Comments
              </label>
              <textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                className="border rounded w-full py-2 px-3 text-gray-700"
                rows="3"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Save Changes
            </button>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default UserTestRecords;
