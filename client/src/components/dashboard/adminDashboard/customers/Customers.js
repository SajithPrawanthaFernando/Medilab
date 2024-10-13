// src/components/Admin/Customers.jsx

import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "../../../Layouts/AdminLayout";
import axios from "axios";
import Chart from "chart.js/auto";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import PieChart from "../../../charts/PieChart";
import proImg from "../../../../assets/images/9434619.jpg";

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [registrationData, setRegistrationData] = useState([]);
  const chartRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Use environment variable for server URL
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

  useEffect(() => {
    const fetchUsersWithImages = async () => {
      try {
        const result = await axios.get(`${serverUrl}/auth/handlecustomer`);
        // Filter users with role 'user'
        const filteredUsers = result.data.filter(
          (user) => user.role === "user"
        );

        // Fetch profile images for all users concurrently
        const usersWithImages = await Promise.all(
          filteredUsers.map(async (user) => {
            if (user.filename) {
              try {
                const imageResponse = await axios.get(
                  `http://localhost:5000/auth/images/${user.filename}`,
                  {
                    responseType: "arraybuffer",
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
      }
    };

    fetchUsersWithImages();
  }, [serverUrl]);

  const handleDeleteCustomer = (email) => {
    // SweetAlert confirmation modal
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${serverUrl}/auth/handledeleteaccount/${email}`)
          .then((res) => {
            console.log(res);
            // Remove deleted user from state without reloading
            setUsers(users.filter((user) => user.email !== email));
            Swal.fire("Deleted!", "The customer has been deleted.", "success");
          })
          .catch((err) => {
            console.error(err);
            Swal.fire("Error!", "Failed to delete the customer.", "error");
          });
      }
    });
  };

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

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-semibold">All Customers</h2>
            <p className="text-gray-600">Manage your hospital customers</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
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
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
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
                  className="border-b border-gray-200 hover:bg-gray-100"
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
                  <td className="py-3 px-6 text-left">
                    <button
                      onClick={() => handleDeleteCustomer(user.email)}
                      className="flex items-center justify-center px-3 py-2 ml-[4rem] bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      <FaTrash />
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
      </div>
    </AdminLayout>
  );
};

export default Customers;
