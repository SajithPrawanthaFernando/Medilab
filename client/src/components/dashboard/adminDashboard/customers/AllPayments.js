// src/components/Admin/Payments.js

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../Layouts/AdminLayout";
import PaymentService from "../../../../services/PaymentService";
import * as XLSX from "xlsx";
import { FaHospitalAlt } from "react-icons/fa";
import { FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";

const AllPayments = () => {
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState({});
  const [token, setToken] = useState("");
  const [paymentImages, setPaymentImages] = useState(new Map());

  const paymentService = PaymentService.getInstance();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const result = await paymentService.fetchPayments(token);
        setPayments(result);
        await fetchUsersForPayments(result);
      } catch (err) {
        console.error("Error fetching payments:", err);
      }
    };

    fetchPayments();
  }, [paymentService, token]);

  const fetchPaymentImages = async (payments) => {
    const imagePromises = payments.map(async (payment) => {
      if (payment.paymentSlipFilename) {
        try {
          const imageResponse = await axios.get(
            `http://localhost:5000/payment/images/${payment.paymentSlipFilename}`,
            { responseType: "arraybuffer" }
          );
          const base64Image = arrayBufferToBase64(imageResponse.data);
          return { paymentId: payment._id, imageData: base64Image };
        } catch (err) {
          console.error(
            `Error fetching image for payment ID ${payment._id}:`,
            err
          );
          return { paymentId: payment._id, imageData: null };
        }
      } else {
        return { paymentId: payment._id, imageData: null };
      }
    });

    const images = await Promise.all(imagePromises);
    const imageMap = {};
    images.forEach(({ paymentId, imageData }) => {
      imageMap[paymentId] = imageData;
    });

    setPaymentImages(imageMap);
  };
  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };
  const fetchUsersForPayments = async (payments) => {
    const emailSet = new Set(payments.map((payment) => payment.email));
    const userPromises = Array.from(emailSet).map((email) =>
      paymentService.fetchUserByEmail(email, token)
    );

    try {
      const users = await Promise.all(userPromises);
      const userMap = {};

      users.forEach((user) => {
        if (user && user.email) {
          userMap[user.email] = user;
        }
      });

      setUserData(userMap);
      await fetchPaymentImages(payments);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const fetchAllPayments = async () => {
    try {
      const result = await paymentService.fetchPayments(token);
      setPayments(result);
      await fetchUsersForPayments(result);
    } catch (error) {
      console.error("Error re-fetching payments:", error);
    }
  };

  const handleApprove = async (paymentId) => {
    try {
      await paymentService.updatePaymentStatusToApprove(paymentId, token);
      console.log("Approved payment with ID:", paymentId);
      await fetchAllPayments();
    } catch (error) {
      console.error("Error approving payment:", error);
    }
  };

  const handleReject = async (paymentId) => {
    try {
      await paymentService.updatePaymentStatusToReject(paymentId, token);
      console.log("Rejected payment with ID:", paymentId);
      await fetchAllPayments();
    } catch (error) {
      console.error("Error rejecting payment:", error);
    }
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(payments);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, "PaymentData.xlsx");
  };

  const filteredPayments = payments.filter((payment) => {
    const searchLower = searchQuery.toLowerCase();
    return payment.doctor.toLowerCase().includes(searchLower); // Filter based on doctor name only
  });

  const handleImageClick = (imageData) => {
    const newWindow = window.open();
    newWindow.document.write(
      `<img src="data:image/jpeg;base64,${imageData}" alt="Payment Slip" />`
    );
    newWindow.document.close();
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg my-2 mx-1 h-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] ">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-semibold flex items-center">
              <FaHospitalAlt className="mr-2 text-blue-600" /> All Payments
            </h2>
            <p className="text-gray-600">Manage all customer payments</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by doctor name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">User Name</th>
                <th className="py-3 px-6 text-left">Doctor</th>
                <th className="py-3 px-6 text-left">Date & Time</th>
                <th className="py-3 px-6 text-left">Total Fee</th>
                <th className="py-3 px-6 text-left">Payment Option</th>
                <th className="py-3 px-6 text-left">Payment Slip</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {filteredPayments.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">
                    <span>
                      {userData[payment.email]?.firstname || "Loading..."}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{payment.doctor}</span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{`${payment.appointmentDate} ${payment.appointmentTime}`}</span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>${payment.totalFee.toFixed(2)}</span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>
                      {payment.paymentOption === "slip" && "Bank Transaction"}
                      {payment.paymentOption === "cash" && "Cash Payment"}
                      {payment.paymentOption === "card" && "Card Payment"}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    {paymentImages[payment._id] ? (
                      <span
                        className="cursor-pointer"
                        onClick={() =>
                          handleImageClick(paymentImages[payment._id])
                        } // Use the new function here
                      >
                        <img
                          src={`data:image/jpeg;base64,${
                            paymentImages[payment._id]
                          }`}
                          alt="Payment Slip"
                          className="h-16 w-16 object-cover"
                        />
                      </span>
                    ) : (
                      <span
                        className="text-blue-500 cursor-pointer"
                        onClick={() => alert("No payment slip available")}
                      >
                        No Slip Available
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-left flex items-center">
                    {payment.status === "approved" && (
                      <span className="text-green-500 flex items-center">
                        <FaCheck className="mr-1" /> Approved
                      </span>
                    )}
                    {payment.status === "pending" && (
                      <div className="flex">
                        <button
                          onClick={() => handleApprove(payment._id)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleReject(payment._id)}
                          className="text-red-500 hover:text-red-700 ml-4"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    )}
                    {payment.status === "rejected" && (
                      <span className="text-red-500 flex items-center">
                        <FaTimes className="mr-1" /> Rejected
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AllPayments;
