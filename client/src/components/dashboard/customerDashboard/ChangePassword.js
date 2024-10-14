import React, { useEffect, useState } from "react";
import CustomerLayout from "../../Layouts/CustomerLayout";
import axios from "axios";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ChangePassword = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/auth/customer/${user.email}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((result) => {
          setUsername(result.data.username);
          setEmail(result.data.email);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    let validationErrors = {};
    if (!currentPassword.trim()) {
      validationErrors.currentPassword = "Current Password is required";
    }
    if (!newPassword.trim()) {
      validationErrors.newPassword = "New Password is required";
    } else if (!passwordRegex.test(newPassword)) {
      validationErrors.newPassword =
        "Password must contain at least 8 characters, including letters, numbers, and a special character";
    } else if (newPassword === currentPassword) {
      validationErrors.newPassword =
        "Please enter a different password from your current one";
    }
    if (!confirmNewPassword.trim()) {
      validationErrors.confirmNewPassword = "Confirm New Password is required";
    } else if (newPassword !== confirmNewPassword) {
      validationErrors.confirmNewPassword = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length === 0) {
      if (!user || !user.token) {
        console.error("User not authenticated");
        return;
      }

      axios
        .post(
          `http://localhost:5000/auth/changepassword/${user.email}`,
          {
            currentPassword,
            newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Password updated successfully!",
          });
          navigate(`/user/${user.email}`);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            console.error("Unauthorized: Wrong password");
            setErrors({ currentPassword: "Wrong password" });
          } else {
            console.error("Error:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to update password. Please try again.",
            });
          }
        });
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <CustomerLayout>
      <div className="max-w-full p-6 bg-white mt-8 ">
        <h2 className="text-3xl font-bold text-gray-800  mb-6">
          Update Password
        </h2>
        <p className="text-gray-600  mb-8">
          Secure your account by updating your password regularly. Please fill
          out the form below to change your password.
        </p>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-gray-700 font-medium mb-2"
                >
                  User Name:
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  readOnly
                  className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  readOnly
                  className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Current Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`w-full bg-white border ${
                    errors.currentPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-gray-700 font-medium mb-2"
                >
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full bg-white border ${
                    errors.newPassword ? "border-red-500" : "border-gray-300"
                  } text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmNewPassword"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Re-Enter New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className={`w-full bg-white border ${
                    errors.confirmNewPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.confirmNewPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmNewPassword}
                  </p>
                )}
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  type="submit"
                  className="w-1/4 bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/user/${user.email}`)}
                  className="w-1/4 bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <div className="w-full md:w-1/3 bg-gray-50 p-6 border border-1 border-b-[0_2px_12px_-4px_rgba(6,81,237,0.3)] rounded-xl shadow-[0_2px_12px_-4px_rgba(6,81,237,0.3)]">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Need Assistance?
            </h3>
            <p className="text-gray-600 mb-6">
              If you need help with changing your password or have any other
              inquiries, feel free to contact our support team. We're here to
              assist you!
            </p>

            {/* Contact Information */}
            <div className="space-y-4">
              {/* Phone */}
              <div className="flex items-center">
                {/* Phone Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.586a2 2 0 011.414.586l3.414 3.414a2 2 0 01.586 1.414V19a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
                  />
                </svg>
                <span className="text-gray-700 text-lg">+1 234 567 890</span>
              </div>

              {/* Email */}
              <div className="flex items-center">
                {/* Email Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12H8m0 0l4-4m-4 4l4 4"
                  />
                </svg>
                <span className="text-gray-700 text-lg">
                  support@hospital.com
                </span>
              </div>

              {/* Operating Hours */}
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Operating Hours:
                </h4>
                <p className="text-gray-600">
                  Monday - Friday: 8:00 AM - 6:00 PM
                  <br />
                  Saturday: 9:00 AM - 4:00 PM
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            {/* Contact Support Button */}
            <div className="mt-6">
              <button
                onClick={() => navigate("/contact")}
                className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default ChangePassword;
