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
          setNotifications(result.data.notification);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-6">
          <h3 className="text-3xl font-bold text-gray-800">Notifications</h3>
          <p className="text-gray-600 mt-2">
            View all your notifications related to your hospital management
            here.
          </p>
        </div>

        {/* Notifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div
                key={index}
                className="bg-white border border-1 border-b-[0_2px_12px_-4px_rgba(6,81,237,0.3)] shadow-[0_2px_12px_-4px_rgba(6,81,237,0.3)] rounded-lg p-6 flex justify-between items-center"
              >
                {/* Notification Icon */}
                <div className="flex-shrink-0 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 2a6 6 0 00-6 6v4H3.5a1.5 1.5 0 100 3h13a1.5 1.5 0 100-3H16v-4a6 6 0 00-6-6zM5 12V8a5 5 0 1110 0v4h1a.5.5 0 110 1h-12a.5.5 0 010-1h1z" />
                  </svg>
                </div>

                {/* Notification Content */}
                <div className="flex-1">
                  <h5 className="text-lg font-medium text-gray-900">
                    Feedback Reply
                  </h5>
                  <p className="text-gray-700 mt-2">{notification}</p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteNotification(index)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                  title="Delete Notification"
                >
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
