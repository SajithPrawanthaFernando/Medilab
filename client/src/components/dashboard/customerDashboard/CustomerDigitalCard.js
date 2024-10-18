import React, { useEffect, useState } from "react";
import Axios from "axios"; // Ensure Axios is imported
import { useAuthContext } from "../../../hooks/useAuthContext"; // Import your auth context hook
import proImg from "../../../assets/images/9434619.jpg"; // Default profile image
import qrCodeImg from "../../../assets/images/qr.png"; // Mock QR code image
import CustomerLayout from "../../Layouts/CustomerLayout";

const CustomerDigitalCard = () => {
  const { user } = useAuthContext(); // Get user info from auth context
  const [userr, setUser] = useState(null); // State to store user data
  const [imageData, setImageData] = useState(null); // State to store base64 image data

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
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
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Card</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            .card {
              border: 1px solid #ccc;
              padding: 20px;
              border-radius: 10px;
              width: 300px;
              text-align: center;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            .profile-img {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              object-fit: cover;
              border: 2px solid #007bff;
              margin-bottom: 10px;
            }
            .qr-code {
              width: 80px;
              height: 80px;
              margin-top: 10px;
            }
            h2 {
              color: #007bff;
            }
            strong {
              color: #333;
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
            <p>Updated: ${
              userr ? new Date(userr.updated).toLocaleDateString() : "N/A"
            }</p>
            <h4>QR Code:</h4>
            <img src="${qrCodeImg}" alt="QR Code" class="qr-code" />
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Show a loading message while fetching user data
  if (!userr) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-screen">
          <h2 className="text-xl">Loading...</h2>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div
        id="digitalCard"
        className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md max-w-md mx-auto my-4"
      >
        <h2 className="text-2xl font-bold text-blue-600 mb-4">
          Customer Digital Card
        </h2>
        <div className="flex flex-col items-center mb-4">
          <img
            src={imageData ? `data:image/jpeg;base64,${imageData}` : proImg}
            alt="Profile"
            className="w-32 h-32 rounded-full cursor-pointer border-2 border-blue-500 shadow-md mb-2"
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop if fallback fails
              e.target.src = proImg; // Fallback image
            }}
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
            <strong>Updated:</strong>{" "}
            {new Date(userr.updated).toLocaleDateString()}
          </p>
        </div>
        <div className="mb-4">
          <h4 className="text-lg font-semibold">QR Code:</h4>
          <img src={qrCodeImg} alt="QR Code" className="w-32 h-32" />
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Print Card
        </button>
      </div>
    </CustomerLayout>
  );
};

export default CustomerDigitalCard;
