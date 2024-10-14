import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import proImg from "../../assets/images/9434619.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "../../../src/hooks/useAuthContext.js";
import Axios from "axios";
import {
  faUser,
  faHistory,
  faHeart,
  faBell,
  faComments,
  faLock,
  faTrash,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const CustomerLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuthContext();
  const [users, setUsers] = useState([]);
  const { dispatch } = useAuthContext();
  const [imageData, setImageData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.token) {
      Axios.get(`http://localhost:5000/auth/customer/` + user.email, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Pass JWT token in the Authorization header
        },
      }).then((result) => {
        console.log(result);
        setUsers(result.data);
        const filename = result.data.filename;
        // Store filename in a variable
        console.log(filename);

        Axios.get(`http://localhost:5000/auth/images/` + filename, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          responseType: "arraybuffer",
        })
          .then((response) => {
            const base64Image = arrayBufferToBase64(response.data);
            setImageData(base64Image);
          })
          .catch((error) => {
            console.error("Error fetching profile picture:", error);
            console.log("Please add a profile picture");
          });
      });
    }
  }, [user]);

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const handleDeleteAccount = () => {
    if (!user || !user.token) {
      console.error("User not authenticated");
      return;
    }

    Axios.delete(`http://localhost:5000/auth/deleteacc/` + user.email, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => {
        handleLogout();
        localStorage.removeItem("token");
        dispatch({ type: "LOGOUT" });
        console.log(res);
        window.location.href = "/register";
      })
      .catch((err) => console.error(err));
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      dispatch({ type: "LOGOUT" });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <Header />

      <section className="pt-[85px]">
        <div className="container mx-auto">
          <div className="flex">
            {/* Sidebar */}
            <nav className="w-64 bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-lg h-120vh overflow-y-auto p-4">
              <div className="text-center mb-3 mt-2">
                <img
                  src={
                    imageData ? `data:image/jpeg;base64,${imageData}` : proImg
                  }
                  alt="Profile"
                  className="w-[80px] h-[80px] rounded-full mx-auto"
                />
              </div>
              {user && (
                <div className="text-center mb-6">
                  <div className="text-lg font-semibold">{users.username}</div>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
              )}

              {/* Navigation Menu */}
              <ul className="space-y-2">
                {user && (
                  <li>
                    <Link
                      to={`/user/${user.email}`}
                      className={`flex items-center p-2 text-gray-700 rounded hover:bg-gray-200 ${
                        location.pathname === "/user/:email"
                          ? "bg-gray-200"
                          : ""
                      }`}
                    >
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      Profile Settings
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    to="/user/customerrecords"
                    className={`flex items-center p-2 text-gray-700 rounded hover:bg-gray-200 ${
                      location.pathname === "/user/customerrecords"
                        ? "bg-gray-200"
                        : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={faHistory} className="mr-2" />
                    Medical Records
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/customertreatment"
                    className={`flex items-center p-2 text-gray-700 rounded hover:bg-gray-200 ${
                      location.pathname === "/user/customertreatment"
                        ? "bg-gray-200"
                        : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={faHeart} className="mr-2" />
                    Treatment History
                  </Link>
                </li>
                {user && (
                  <li>
                    <Link
                      to={`/user/notifi/${user.email}`}
                      className={`flex items-center p-2 text-gray-700 rounded hover:bg-gray-200 ${
                        location.pathname === "/user/notifications"
                          ? "bg-gray-200"
                          : ""
                      }`}
                    >
                      <FontAwesomeIcon icon={faBell} className="mr-2" />
                      Notifications
                    </Link>
                  </li>
                )}
                {user && (
                  <li>
                    <Link
                      to={`/user/feedback/${user.email}`}
                      className={`flex items-center p-2 text-gray-700 rounded hover:bg-gray-200 ${
                        location.pathname === "/user/feedback"
                          ? "bg-gray-200"
                          : ""
                      }`}
                    >
                      <FontAwesomeIcon icon={faComments} className="mr-2" />
                      Feedback & Support
                    </Link>
                  </li>
                )}
                {user && (
                  <li>
                    <Link
                      to={`/user/updatepassword/${user.email}`}
                      className={`flex items-center p-2 text-gray-700 rounded hover:bg-gray-200 ${
                        location.pathname === "/user/updatePassword"
                          ? "bg-gray-200"
                          : ""
                      }`}
                    >
                      <FontAwesomeIcon icon={faLock} className="mr-2" />
                      Update Password
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    to="/user/deleteaccount"
                    className={`flex items-center p-2 text-red-600 rounded hover:bg-red-200 ${
                      location.pathname === "/user/deleteaccount"
                        ? "bg-red-200"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteAccount(user.email);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    Delete Account
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/logout"
                    className={`flex items-center p-2 text-gray-700 rounded hover:bg-gray-200 ${
                      location.pathname === "/user/logout" ? "bg-gray-200" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Logout
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Dashboard Body */}
            <main className="flex-1 bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-lg ml-4 p-4">
              {children}
            </main>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
