import React, { useEffect, useState } from "react";
import CustomerLayout from "../../Layouts/CustomerLayout";
import axios from "axios";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const FeedbackForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState({});
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/auth/customer/${user.email}`, {
          headers: {
            Authorization: `Bearer ${user.token}`, // Pass JWT token in the Authorization header
          },
        })
        .then((result) => {
          setUsername(result.data.username);
          setEmail(result.data.email);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let errors = {};
    if (!feedback.trim()) {
      errors.feedback = "Feedback is required";
    }

    if (Object.keys(errors).length === 0) {
      if (!user || !user.token) {
        console.error("User not authenticated");
        return;
      }
      axios
        .post(
          `http://localhost:5000/auth/feedbacks/${user.email}`,
          { feedback },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((result) => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Feedback submitted successfully!",
          });
          navigate(`/user/${user.email}`);
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to submit feedback. Please try again.",
          });
        });
    } else {
      setErrors(errors);
    }
  };

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto p-6 bg-white flex flex-col md:flex-row gap-6">
        {/* Feedback Form Section */}
        <div className="w-full md:w-2/3 bg-white p-6 ">
          {/* Header Section */}
          <div className="mb-6">
            <h2 className=" text-gray-800 mb-2 font-bold text-3xl">Feedback</h2>
            <p className="text-gray-600">
              We value your feedback! Please share your thoughts and experiences
              to help us improve our hospital services.
            </p>
          </div>

          {/* Feedback Form */}
          <form onSubmit={handleSubmit}>
            {/* User Name */}
            <div className="mb-4">
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
                className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
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
                className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Feedback */}
            <div className="mb-4">
              <label
                htmlFor="feedback"
                className="block text-gray-700 font-medium mb-2"
              >
                Feedback:
              </label>
              <textarea
                id="feedback"
                rows="5"
                placeholder="Enter your feedback"
                value={feedback}
                onChange={handleFeedbackChange}
                className={`w-full border ${
                  errors.feedback ? "border-red-500" : "border-gray-300"
                } text-gray-700 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
              ></textarea>
              {errors.feedback && (
                <p className="text-red-500 text-sm mt-1">{errors.feedback}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-start">
              <button
                type="submit"
                className="bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-600 transition"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        </div>

        {/* Right Sidebar Section */}
        <div className="w-full h-1/2 mt-12 md:w-1/3 bg-gray-50 p-6 border border-1 border-b-[0_2px_12px_-4px_rgba(6,81,237,0.3)] rounded-xl shadow-[0_2px_12px_-4px_rgba(6,81,237,0.3)]">
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
    </CustomerLayout>
  );
};

export default FeedbackForm;
