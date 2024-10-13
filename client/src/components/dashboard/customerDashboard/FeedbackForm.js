// src/components/Admin/FeedbackForm.jsx

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
          console.log(result);
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

    // Validation rules
    let errors = {};
    if (!feedback.trim()) {
      errors.feedback = "Feedback is required";
    }

    // If there are no errors, proceed with form submission
    if (Object.keys(errors).length === 0) {
      if (!user || !user.token) {
        console.error("User not authenticated");
        return;
      }
      axios
        .post(
          `http://localhost:5000/auth/feedbacks/${user.email}`,
          {
            feedback,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`, // Pass JWT token in the Authorization header
            },
          }
        )
        .then((result) => {
          console.log(result);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Feedback submitted successfully!",
          });
          navigate(`/user/${user.email}`); // Navigate to the appropriate route after successful submission
        })
        .catch((error) => {
          console.error("Error submitting feedback:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to submit feedback. Please try again.",
          });
        });
    } else {
      // Display validation errors
      setErrors(errors);
    }
  };

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
        {/* Header Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Feedback</h2>
          <p className="text-gray-600">Share your thoughts and experiences.</p>
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
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </CustomerLayout>
  );
};

export default FeedbackForm;
