// src/components/Admin/FeedbackManagement.jsx

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../Layouts/AdminLayout";
import axios from "axios";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import BarChart from "../../../charts/BarChart"; // Import the BarChart component
import PieChart from "../../../charts/PieChart"; // Import the PieChart component

const FeedbackManagement = () => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedCustomerFeedback, setSelectedCustomerFeedback] =
    useState(null);
  const [notification, setReplyMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dailyFeedbackCountData, setDailyFeedbackCountData] = useState([]); // State for daily feedback count data

  // Function to handle closing the feedback modal
  const handleFeedbackModalClose = () => {
    setShowFeedbackModal(false);
    setReplyMessage("");
    setSelectedCustomerFeedback(null);
  };

  // Function to handle viewing feedback
  const handleViewFeedback = (feedback) => {
    setSelectedCustomerFeedback(feedback);
    setShowFeedbackModal(true);
    setReplyMessage("");
  };

  // Function to handle reply message change
  const handleReplyMessageChange = (e) => {
    setReplyMessage(e.target.value);
  };

  // Function to send feedback reply
  const handleFeedbackSend = (e) => {
    e.preventDefault();

    if (!notification.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a valid reply message.",
      });
      return;
    }

    axios
      .post(
        `http://localhost:5000/auth/sendfeedback/${selectedCustomerFeedback.email}`,
        {
          notification,
        }
      )
      .then((result) => {
        console.log(result);
        handleFeedbackModalClose();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Notification sent successfully!",
        });
      })
      .catch((error) => {
        console.error("Error sending notification:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to send the notification. Please try again.",
        });
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/handlecustomer")
      .then((result) => {
        const filteredUsers = result.data.filter(
          (user) => user.role === "user" && user.feedback
        );

        // Sort the filtered users by feedback date in descending order
        const sortedUsers = filteredUsers.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

        setUsers(sortedUsers);

        // Prepare data for daily feedback count chart
        const feedbackDates = sortedUsers.map(
          (user) => user.date.split("T")[0]
        ); // Use 'date' instead of 'updated'
        const feedbackCounts = feedbackDates.reduce((acc, date) => {
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
        const feedbackDataArray = Object.entries(feedbackCounts).map(
          ([date, count]) => ({
            date,
            count,
          })
        );

        setDailyFeedbackCountData(feedbackDataArray);
      })
      .catch((err) => console.log(err));
  }, []);

  // Filtered users based on search query
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to export feedback data to Excel
  const exportToExcel = () => {
    const exportData = filteredUsers.map(
      ({ _id, username, email, phone, address, date, feedback }) => ({
        _id,
        username,
        email,
        phone,
        address,
        date,
        feedback,
      })
    );

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "FeedbackData");
    XLSX.writeFile(workbook, "FeedbackData.xlsx");
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-semibold text-gray-800">
              All Feedbacks
            </h2>
            <p className="text-gray-600">
              Manage customer feedback effectively
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Feedback Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Customer ID</th>
                <th className="py-3 px-6 text-left">Customer Name</th>
                <th className="py-3 px-6 text-left">Customer Email</th>
                <th className="py-3 px-6 text-left">Feedback Date</th>
                <th className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {filteredUsers.map((feedback) => (
                <tr
                  key={feedback._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <span>{feedback._id}</span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span className="font-medium">{feedback.username}</span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{feedback.email}</span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{new Date(feedback.date).toLocaleDateString()}</span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleViewFeedback(feedback)}
                      className="flex items-center justify-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                      View & Reply
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="py-4 px-6 text-center text-gray-500"
                  >
                    No feedbacks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Feedback Modal */}
        {selectedCustomerFeedback && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Feedback Details</h3>
                <button
                  onClick={handleFeedbackModalClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <div className="mb-4">
                <p>
                  <strong>Customer ID:</strong> {selectedCustomerFeedback._id}
                </p>
                <p>
                  <strong>Customer Email:</strong>{" "}
                  {selectedCustomerFeedback.email}
                </p>
                <p>
                  <strong>Feedback Date:</strong>{" "}
                  {new Date(selectedCustomerFeedback.date).toLocaleDateString()}
                </p>
                <hr className="my-4" />
                <p>
                  <strong>Feedback Message:</strong>
                </p>
                <p className="text-gray-700">
                  {selectedCustomerFeedback.feedback}
                </p>
              </div>
              <form onSubmit={handleFeedbackSend}>
                <div className="mb-4">
                  <label
                    htmlFor="replyMessage"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Reply Message:
                  </label>
                  <textarea
                    id="replyMessage"
                    rows="3"
                    value={notification}
                    onChange={handleReplyMessageChange}
                    className="w-full border border-gray-300 text-gray-700 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your reply message"
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleFeedbackModalClose}
                    className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  >
                    Send Reply
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Daily Feedback Count</h3>
            <BarChart data={dailyFeedbackCountData} />
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              Feedback Distribution
            </h3>
            <PieChart data={dailyFeedbackCountData} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FeedbackManagement;
