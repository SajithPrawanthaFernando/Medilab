import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import {
  FaTachometerAlt,
  FaUsers,
  FaComments,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [isCustomersOpen, setIsCustomersOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleCustomers = () => {
    setIsCustomersOpen(!isCustomersOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Helper function to determine if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Helper function to determine if any sub-route is active
  const isSubActive = (paths) => {
    return paths.some((path) => location.pathname.includes(path));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 ease-in-out bg-white w-64 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]  z-30`}
      >
        <Link to="/">
          <div className="flex items-center justify-center h-16 shadow-md cursor-pointer">
            <img src={Logo} alt="Logo" className="h-10 w-auto" />
          </div>
        </Link>
        <nav className="mt-10">
          <ul>
            {/* Dashboard */}
            <li>
              <Link
                to="/admin"
                className={`flex items-center py-2 px-6 text-gray-700 hover:bg-blue-100 rounded-lg transition duration-200 ${
                  isActive("/admin") ? "bg-blue-100 font-semibold" : ""
                }`}
              >
                <FaTachometerAlt className="mr-3 text-blue-600" />
                Dashboard
              </Link>
            </li>

            {/* Patients */}
            <li>
              <button
                onClick={toggleCustomers}
                className={`flex items-center justify-between w-full py-2 px-6 text-gray-700 hover:bg-blue-100 rounded-lg focus:outline-none transition duration-200 ${
                  isSubActive(["/admin/customers", "/admin/feedbackmanagement"])
                    ? "bg-blue-100 font-semibold"
                    : ""
                }`}
              >
                <div className="flex items-center">
                  <FaUsers className="mr-3 text-blue-600" />
                  Patients
                </div>
                {isCustomersOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {/* Submenu */}
              {isCustomersOpen && (
                <ul className="ml-4">
                  <li>
                    <Link
                      to="/admin/customers"
                      className={`block py-2 px-6 text-gray-600 hover:bg-blue-100 rounded-lg transition duration-200 ${
                        isActive("/admin/customers")
                          ? "bg-blue-100 font-semibold"
                          : ""
                      }`}
                    >
                      All Customers
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/feedbackmanagement"
                      className={`block py-2 px-6 text-gray-600 hover:bg-blue-100 rounded-lg transition duration-200 ${
                        isActive("/admin/feedbackmanagement")
                          ? "bg-blue-100 font-semibold"
                          : ""
                      }`}
                    >
                      Feedbacks
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/patientaddreport"
                      className={`block py-2 px-6 text-gray-600 hover:bg-blue-100 rounded-lg transition duration-200 ${
                        isActive("/admin/patientaddreport")
                          ? "bg-blue-100 font-semibold"
                          : ""
                      }`}
                    >
                      Add Patient Report
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/viewreport"
                      className={`block py-2 px-6 text-gray-600 hover:bg-blue-100 rounded-lg transition duration-200 ${
                        isActive("/admin/viewreport")
                          ? "bg-blue-100 font-semibold"
                          : ""
                      }`}
                    >
                      View Patient Report
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/addtreatment"
                      className={`block py-2 px-6 text-gray-600 hover:bg-blue-100 rounded-lg transition duration-200 ${
                        isActive("/admin/addtreatment")
                          ? "bg-blue-100 font-semibold"
                          : ""
                      }`}
                    >
                      Add Treatment Report
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/viewtreatment"
                      className={`block py-2 px-6 text-gray-600 hover:bg-blue-100 rounded-lg transition duration-200 ${
                        isActive("/admin/viewtreatment")
                          ? "bg-blue-100 font-semibold"
                          : ""
                      }`}
                    >
                      View Treatment Report
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Toggle Button for Mobile */}
      <div className="flex md:hidden items-center justify-between bg-white p-4 shadow-md z-20">
        <img src={Logo} alt="Logo" className="h-8 w-auto" />
        <button
          onClick={toggleSidebar}
          className="text-gray-700 focus:outline-none"
        >
          {/* Hamburger Icon */}
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            {isSidebarOpen ? (
              // Close Icon
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              // Hamburger Icon
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h16v2H4v-2z"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0  md:ml-64 h-full">
        {/* Content */}
        <main className="flex-1 px-2 overflow-auto  w-full h-full mt-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
