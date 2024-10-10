// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import RegisterImg from "../assets/images/login.png"; // Adjust the path if necessary

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!username.trim()) {
      errors.username = "Username is required";
    }
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Invalid email format";
    }
    if (!phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^(0\d{9})$/.test(phone)) {
      errors.phone =
        "Invalid phone number format (starts with 0, followed by 9 digits)";
    }
    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (
      !/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        password
      )
    ) {
      errors.password =
        "Password must contain at least 8 characters, one letter, one number, and one special character";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (validateForm()) {
      // Check if email starts with "print"
      const isAdmin = email.toLowerCase().startsWith("admin");

      axios
        .post("http://localhost:5000/auth/register", {
          username,
          email,
          phone,
          password,
          role: isAdmin ? "admin" : "user", // Assign role based on email
        })
        .then((response) => {
          // Reset form fields after successful submission
          setUsername("");
          setEmail("");
          setPhone("");
          setPassword("");
          setSubmitted(false); // Reset submitted state

          // Dispatch login action after successful registration
          dispatch({ type: "LOGIN", payload: response.data });

          // Navigate to login page
          navigate("/login");
        })
        .catch((err) => {
          console.log(err);
          // Handle error here (e.g., set a general error message)
          setErrors({
            general: "Registration failed. Please try again later.",
          });
        });
    }
  };

  return (
    <div className="font-sans bg-white pt-[5rem] pb-10">
      {" "}
      {/* Offset fixed header */}
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="grid md:grid-cols-2 items-center gap-8 max-w-6xl w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
          {/* Registration Form */}
          <div className="bg-white p-8 ">
            <form onSubmit={handleSubmit}>
              <div className="mb-12">
                <h3 className="text-gray-800 text-3xl font-extrabold">
                  Register
                </h3>
                <p className="text-sm mt-4 text-gray-800">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
                  >
                    Sign in here
                  </a>
                </p>
              </div>

              {/* Username Field */}
              <div
                className={`mb-4 ${
                  submitted && errors.username ? "has-error" : ""
                }`}
              >
                <label
                  className="text-gray-800 text-xs block mb-2"
                  htmlFor="username"
                >
                  Username
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full text-gray-800 text-sm border-b ${
                      submitted && errors.username
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:border-blue-600 px-2 py-3 outline-none`}
                    placeholder="Enter username"
                  />
                </div>
                {submitted && errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              {/* Email Field */}
              <div
                className={`mb-4 ${
                  submitted && errors.email ? "has-error" : ""
                }`}
              >
                <label
                  className="text-gray-800 text-xs block mb-2"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full text-gray-800 text-sm border-b ${
                      submitted && errors.email
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:border-blue-600 px-2 py-3 outline-none`}
                    placeholder="Enter your email"
                  />
                </div>
                {submitted && errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone Field */}
              <div
                className={`mb-4 ${
                  submitted && errors.phone ? "has-error" : ""
                }`}
              >
                <label
                  className="text-gray-800 text-xs block mb-2"
                  htmlFor="phone"
                >
                  Phone Number
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full text-gray-800 text-sm border-b ${
                      submitted && errors.phone
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:border-blue-600 px-2 py-3 outline-none`}
                    placeholder="Enter your phone number"
                  />
                </div>
                {submitted && errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Password Field */}
              <div
                className={`mb-4 ${
                  submitted && errors.password ? "has-error" : ""
                }`}
              >
                <label
                  className="text-gray-800 text-xs block mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full text-gray-800 text-sm border-b ${
                      submitted && errors.password
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:border-blue-600 px-2 py-3 outline-none`}
                    placeholder="Enter your password"
                  />
                </div>
                {submitted && errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* General Error Message */}
              {submitted && errors.general && (
                <p className="text-red-500 text-sm mb-4">{errors.general}</p>
              )}

              {/* Remember Me and Forgot Password */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm text-gray-800"
                  >
                    Remember me
                  </label>
                </div>
                <div>
                  <a
                    href="/forgotpassword"
                    className="text-blue-600 font-semibold text-sm hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
              </div>

              {/* Sign Up Button */}
              <div className="mt-12">
                <button
                  type="submit"
                  className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Sign Up
                </button>
              </div>

              {/* Social Login Buttons */}
              <div className="space-x-6 flex justify-center mt-6">
                {/* Google */}
                <button type="button" className="border-none outline-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32px"
                    className="inline"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#4285F4"
                      d="M244.8 107.2c69.6 0 120 50.4 120 120s-50.4 120-120 120c-34.4 0-65.6-13.6-89.6-36.8l-70.4 70.4c43.2 43.2 99.2 70.4 159.2 70.4C415.2 377.6 480 322.4 480 240S415.2 102.4 244.8 102.4z"
                    />
                    <path
                      fill="#34A853"
                      d="M244.8 102.4c-72 0-133.6 43.2-165.6 106.4l74.4 56c19.2-28 45.6-46.4 91.2-46.4 36 0 67.2 12.8 92.8 33.6l69.6-69.6C371.2 130.4 307.2 102.4 244.8 102.4z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M244.8 443.2c-72-0.8-133.6-43.2-165.6-106.4l-74.4 56c48 94.4 142.4 160 240 160 70.4 0 131.2-27.2 178.4-72.8l-69.6-69.6c-25.6 20-58.4 33.6-107.2 33.6z"
                    />
                    <path
                      fill="#EA4335"
                      d="M480 240c0-15.2-1.6-30.4-4.8-45.6l-74.4-56c-14.4 28-34.4 52-60 68.8l69.6 69.6C486.4 269.6 480 254.4 480 240z"
                    />
                  </svg>
                </button>

                {/* GitHub */}
                <button type="button" className="border-none outline-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32px"
                    fill="#000"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .5C5.648.5.5 5.648.5 12c0 5.084 3.292 9.42 7.864 10.958.575.106.792-.25.792-.556 0-.275-.01-1.184-.016-2.07-3.2.696-3.88-1.544-3.88-1.544-.528-1.344-1.288-1.704-1.288-1.704-1.056-.72.08-.705.08-.705 1.168.082 1.784 1.2 1.784 1.2 1.04 1.776 2.728 1.264 3.396.968.106-.75.408-1.264.744-1.552-2.56-.29-5.24-1.28-5.24-5.696 0-1.264.45-2.304 1.184-3.11-.12-.29-.512-1.464.112-3.056 0 0 .968-.312 3.176 1.184A11.05 11.05 0 0112 6.896c.976.005 1.952.132 2.864.388 2.208-1.496 3.176-1.184 3.176-1.184.624 1.592.232 2.766.112 3.056.744.806 1.184 1.846 1.184 3.11 0 4.424-2.688 5.4-5.256 5.688.42.36.792 1.08.792 2.184 0 1.576-.014 2.84-.014 3.22 0 .306.216.668.8.556A11.52 11.52 0 0023.5 12C23.5 5.648 18.352.5 12 .5z" />
                  </svg>
                </button>

                {/* Facebook */}
                <button type="button" className="border-none outline-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32px"
                    fill="#1877F2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.31h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Registration Image */}
          <div className="md:h-full bg-[#000842] rounded-xl lg:p-12 p-8 hidden md:block">
            <img
              src={RegisterImg}
              className="w-full h-full object-contain rounded-lg shadow-md"
              alt="Register"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
