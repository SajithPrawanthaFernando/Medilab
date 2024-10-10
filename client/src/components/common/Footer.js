import React from "react";
import Logo from "../../assets/images/logo.png";
import PaymentImg from "../../assets/images/payment.png";
import { useAuthContext } from "../../hooks/useAuthContext";

const Footer = () => {
  const { user } = useAuthContext();
  return (
    <footer className="bg-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start">
            <img src={Logo} alt="logo" className="w-40 mb-4" />
            <p className="text-gray-600">
              Welcome to Medilab, your trusted partner in healthcare management,
              providing innovative solutions for patient care, appointment
              management, and real-time data access.
            </p>
          </div>

          {/* Services Section */}
          <div className="flex flex-col">
            <h6 className="text-lg font-bold text-gray-800 mb-4">Services</h6>
            <a
              href="/services/appointments"
              className="text-gray-600 hover:text-blue-600 mb-2"
            >
              Appointment Scheduling
            </a>
            <a
              href="/services/consultation"
              className="text-gray-600 hover:text-blue-600 mb-2"
            >
              Online Consultation
            </a>
            <a
              href="/services/patient-records"
              className="text-gray-600 hover:text-blue-600 mb-2"
            >
              Patient Records Management
            </a>
            <a
              href="/services/telehealth"
              className="text-gray-600 hover:text-blue-600"
            >
              Telehealth Services
            </a>
          </div>

          {/* Resources Section */}
          <div className="flex flex-col">
            <h6 className="text-lg font-bold text-gray-800 mb-4">Resources</h6>
            <a href="/blog" className="text-gray-600 hover:text-blue-600 mb-2">
              Blog
            </a>
            <a href="/faq" className="text-gray-600 hover:text-blue-600 mb-2">
              FAQ
            </a>
            <a
              href="/contact"
              className="text-gray-600 hover:text-blue-600 mb-2"
            >
              Contact Us
            </a>
            <a href="/about" className="text-gray-600 hover:text-blue-600">
              About Us
            </a>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col">
            <h6 className="text-lg font-bold text-gray-800 mb-4">Contact</h6>
            <p className="text-gray-600">
              <i className="bi bi-envelope-fill"></i> info@medilab.com
            </p>
            <p className="text-gray-600">
              <i className="bi bi-telephone-fill"></i> +1 234 567 8901
            </p>
            <p className="text-gray-600">
              <i className="bi bi-house-door-fill"></i> 123 Health St, New York,
              NY 10001, US
            </p>
            <p className="text-gray-600">
              <i className="bi bi-printer-fill"></i> +1 234 567 8902
            </p>
          </div>
        </div>

        {/* Add employee login link here */}
        {user && user.role !== "admin" && user.role !== "user" && (
          <div className="text-center mt-3">
            <a href="/emplogin" className="text-gray-600 hover:text-blue-600">
              Employee Login
            </a>
          </div>
        )}

        <hr className="my-3" />
        <div className="pt-0">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left text-gray-600">
              © 2024 Medilab. All rights reserved.
            </div>
            <div className="text-center md:text-right mt-3 md:mt-0">
              <img
                src={PaymentImg}
                alt="Accepted payment methods"
                width="300"
                className="mx-auto md:mx-0"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
