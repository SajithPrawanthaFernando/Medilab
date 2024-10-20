import React, { useEffect, useState } from "react";
import CustomerLayout from "../../Layouts/CustomerLayout";
import { useAuthContext } from "../../../hooks/useAuthContext";
import axios from "axios";

const BookingMessages = () => {
  const [messages, setMessages] = useState([]);
  const { user } = useAuthContext();

  // Fetch messages for the current user
  const fetchMessages = async () => {
    try {
      if (user) {
        const response = await axios.get(
          `http://localhost:5000/api/bookingmessages?userId=${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setMessages(response.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user]);

  return (
    <CustomerLayout>
      <div className="container mx-auto p-4">
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h1 className="text-2xl font-semibold mb-4">
            Your Booking Notifications
          </h1>
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-5 text-left">Message</th>
                <th className="py-3 px-5 text-left">Date</th>
                <th className="py-3 px-5 text-left">Status</th>
                <th className="py-3 px-5 text-left">Reason (if canceled)</th>
              </tr>
            </thead>
            <tbody>
              {messages.length > 0 ? (
                messages.map((message) => (
                  <tr
                    key={message._id}
                    className={message.isCanceled ? "bg-red-100" : ""}
                  >
                    <td className="py-3 px-5">{message.message}</td>
                    <td className="py-3 px-5">
                      {new Date(message.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-5">
                      {message.isCanceled ? "Canceled" : "Active"}
                    </td>
                    <td className="py-3 px-5">
                      {message.isCanceled ? message.cancellationReason : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-3 px-5 text-center">
                    No booking notifications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default BookingMessages;
