// src/components/Customer/CustomerDigitalCard.js

import React, { useState, useEffect } from "react";
import Axios from "axios"; // Ensure Axios is imported
import { useAuthContext } from "../../../hooks/useAuthContext"; // Import your auth context hook
import proImg from "../../../assets/images/9434619.jpg"; // Default profile image
import qrCodeImg from "../../../assets/images/qr.png"; // Mock QR code image
import CustomerLayout from "../../Layouts/CustomerLayout";

const CustomerDigitalCard = () => {
  const { user } = useAuthContext(); // Get user info from auth context
  const [userr, setUser] = useState(null); // State to store user data
  const [imageData, setImageData] = useState(null); // State to store base64 image data
  const [loading, setLoading] = useState(true); // Loading state

  const Loading = () => (
    <div className="flex justify-center items-center mt-8">
      <svg
        className="animate-spin h-8 w-8 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <span className="ml-2 text-blue-500">Loading...</span>
    </div>
  );

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          setLoading(true); // Start loading
          const result = await Axios.get(
            `http://localhost:5000/auth/customer/${user.email}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

          setUser(result.data); // Set the fetched user data

          // Fetch the user's image if it exists
          const filename = result.data.filename;
          if (filename) {
            const imageResponse = await Axios.get(
              `http://localhost:5000/auth/images/${filename}`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
                responseType: "arraybuffer",
              }
            );
            const base64Image = arrayBufferToBase64(imageResponse.data);
            setImageData(base64Image); // Set the base64 image data
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        } finally {
          setLoading(false); // End loading
        }
      };

      fetchUserData();
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

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    const printContent = `
      <html>
        <head>
          <title>Print Card</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            .card {
              padding: 20px;
              border-radius: 10px;
              width: 300px;
              text-align: center;
              border: 1px solid #ccc;
              box-shadow: 0 2px 10px -3px rgba(6, 81, 237, 0.3);
            }
            .profile-img {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              object-fit: cover;
              border: 2px solid #1d4ed8;
            }
            h2, h3, h4 {
              color: #1d4ed8;
            }
            p {
              margin: 0.5em 0;
            }
            .qr-code {
              width: 80px;
              height: 80px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Customer Digital Card</h2>
            <img src="${
              imageData ? `data:image/jpeg;base64,${imageData}` : proImg
            }" alt="${userr ? userr.username : "User"}" class="profile-img" />
            <h3>${userr ? userr.username : "User"}</h3>
            <p>Email: ${userr ? userr.email : "N/A"}</p>
            <p>First Name: ${userr ? userr.firstname : "N/A"}</p>
            <p>Last Name: ${userr ? userr.lastname : "N/A"}</p>
            <p>Phone: ${userr ? userr.phone : "N/A"}</p>
            <p>Address: ${userr ? userr.address : "N/A"}</p>
            <p>Date: ${
              userr ? new Date(userr.updated).toLocaleDateString() : "N/A"
            }</p>
            <h4>QR Code:</h4>
            <img src="${qrCodeImg}" alt="QR Code" class="qr-code" />
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      printWindow.close(); // Close the print window after printing
    }, 500);
  };

  // Show a loading message while fetching user data
  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-screen">
          <Loading />
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8 relative">
        <button
          onClick={handlePrint}
          className="absolute top-4 right-4 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
        >
          Print Card
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Customer Digital Card
        </h2>
        <h3 className="text-gray-600 mb-2">
          Your personal digital card with important information.
        </h3>

        <div
          id="digitalCard"
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] border-1 border-b-[0_2px_10px_-3px_rgba(6,81,237,0.3)] max-w-md mx-auto mt-6"
        >
          <div className="flex flex-col items-center mb-4">
            <img
              src={imageData ? `data:image/jpeg;base64,${imageData}` : proImg}
              alt="Profile"
              className="w-32 h-32 rounded-full cursor-pointer border-2 border-blue-500"
            />
            <h3 className="text-xl font-semibold">{userr.username}</h3>
            <p className="text-gray-600">{userr.email}</p>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold">Details:</h4>
            <p>
              <strong>First Name:</strong> {userr.firstname}
            </p>
            <p>
              <strong>Last Name:</strong> {userr.lastname}
            </p>
            <p>
              <strong>Phone:</strong> {userr.phone}
            </p>
            <p>
              <strong>Address:</strong> {userr.address}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(userr.updated).toLocaleDateString()}
            </p>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-center">QR Code</h4>
            <img src={qrCodeImg} alt="QR Code" className="w-32 h-32" />
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerDigitalCard;
