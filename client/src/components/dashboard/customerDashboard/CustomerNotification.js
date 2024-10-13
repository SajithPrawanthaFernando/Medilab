// src/components/Customer/NotificationPage.jsx

import React, { useState, useEffect } from "react";
import CustomerLayout from "../../Layouts/CustomerLayout";
import axios from "axios";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleDeleteNotification = (index) => {
    const notificationContent = notifications[index];
    axios
      .delete(`http://localhost:5000/auth/deletenotification/${user.email}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        data: {
          notificationContent: notificationContent,
        },
      })
      .then((result) => {
        console.log("Notification deleted successfully");
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Notification deleted successfully!",
        });
        setNotifications((prevNotifications) =>
          prevNotifications.filter((_, i) => i !== index)
        );
      })
      .catch((error) => {
        console.error("Failed to delete notification:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete the notification.",
        });
      });
  };

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/auth/customer/${user.email}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((result) => {
          console.log(result);
          setNotifications(result.data.notification);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">
            Notifications
          </h3>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center"
              >
                <div>
                  <h5 className="text-lg font-medium text-gray-900">
                    Feedback Reply
                  </h5>
                  <p className="text-gray-700 mt-2">{notification}</p>
                </div>
                <button
                  onClick={() => handleDeleteNotification(index)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                  title="Delete Notification"
                >
                  {/* Trash Icon (SVG) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              No notifications found.
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
};

export default NotificationPage;
