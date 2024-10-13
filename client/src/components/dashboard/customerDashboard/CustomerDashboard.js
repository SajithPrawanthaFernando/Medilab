import React, { useEffect, useState } from "react";
import CustomerLayout from "../../Layouts/CustomerLayout";
import proImg from "../../../assets/images/9434619.jpg";
import Axios from "axios";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CustomerDashboard = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  // User Details State
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhoneNumber] = useState("");

  // Initial Health Data State
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [medications, setMedications] = useState("");

  // Other States
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [profileImagePath, setProfileImagePath] = useState("");
  const [imageData, setImageData] = useState(null);

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    if (user) {
      Axios.get(`http://localhost:5000/auth/customer/${user.email}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((result) => {
          const data = result.data;
          setUserName(data.username);
          setEmail(data.email);
          setPhoneNumber(data.phone);
          setFirstName(data.firstname);
          setLastName(data.lastname);
          setAddress(data.address);
          setProfileImagePath(data.profileImagePath);

          if (data.initialHealthData) {
            setHeight(data.initialHealthData.height);
            setWeight(data.initialHealthData.weight);
            setBloodType(data.initialHealthData.bloodType);
            setAllergies(data.initialHealthData.allergies);
            setMedicalConditions(data.initialHealthData.medicalConditions);
            setMedications(data.initialHealthData.medications);
          }

          const filename = data.filename;
          if (filename) {
            Axios.get(`http://localhost:5000/auth/images/${filename}`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
              responseType: "arraybuffer",
            })
              .then((response) => {
                const base64Image = arrayBufferToBase64(response.data);
                setImageData(base64Image);
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
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

  // Handle Input Changes
  const handleFirstNameChange = (e) => setFirstName(e.target.value);
  const handleLastNameChange = (e) => setLastName(e.target.value);
  const handleUserNameChange = (e) => setUserName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleAddressChange = (e) => setAddress(e.target.value);
  const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);
  const handleHeightChange = (e) => setHeight(e.target.value);
  const handleWeightChange = (e) => setWeight(e.target.value);
  const handleBloodTypeChange = (e) => setBloodType(e.target.value);
  const handleAllergiesChange = (e) => setAllergies(e.target.value);
  const handleMedicalConditionsChange = (e) =>
    setMedicalConditions(e.target.value);
  const handleMedicationsChange = (e) => setMedications(e.target.value);

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    let validationErrors = {};

    if (!firstname.trim())
      validationErrors.firstname = "First Name is required";
    if (!lastname.trim()) validationErrors.lastname = "Last Name is required";
    if (!username.trim()) validationErrors.username = "User Name is required";
    if (!email.trim()) validationErrors.email = "Email is required";
    else if (!email.includes("@"))
      validationErrors.email = "Invalid email format";
    if (!address.trim()) validationErrors.address = "Address is required";
    if (!phone.toString().trim())
      validationErrors.phone = "Phone Number is required";
    else if (!/^(0\d{9})$/.test(phone))
      validationErrors.phone =
        "Invalid phone number format (must start with 0, followed by 9 digits)";
    if (!height.toString().trim())
      validationErrors.height = "Height is required";
    if (!weight.toString().trim())
      validationErrors.weight = "Weight is required";
    if (!bloodType.trim())
      validationErrors.bloodType = "Blood Type is required";
    // Allergies, medicalConditions, medications are optional, unless you want them to be required
    // if (!allergies.trim()) validationErrors.allergies = "Allergies are required";
    // if (!medicalConditions.trim()) validationErrors.medicalConditions = "Medical Conditions are required";
    // if (!medications.trim()) validationErrors.medications = "Medications are required";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // There are validation errors
      return;
    }

    if (!user || !user.token) {
      console.error("User not authenticated");
      return;
    }

    const formData = new FormData();

    // Only append the image data if it's not empty
    if (image) {
      formData.append("profileImage", image);
    }

    try {
      // Upload the image if selected
      if (image) {
        const uploadResponse = await Axios.post(
          `http://localhost:5000/auth/upload/${user.email}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Upload response:", uploadResponse.data);
      }

      // Update user details and initial health data
      const updateUserResponse = await Axios.put(
        `http://localhost:5000/auth/users/${user.email}`,
        {
          firstname,
          username,
          lastname,
          address,
          phone,
          initialHealthData: {
            height,
            weight,
            bloodType,
            allergies,
            medicalConditions,
            medications,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log("Update user response:", updateUserResponse.data);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile updated successfully!",
      });
      navigate("/"); // Navigate to the appropriate route after successful update
    } catch (error) {
      console.error("Error uploading image or updating user details:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update profile. Please try again.",
      });
    }
  };

  return (
    <CustomerLayout>
      {/* Header Section */}
      <div className="flex justify-between items-center py-4 border-b ">
        <h3 className="text-lg font-bold">Profile Settings</h3>
        {user && (
          <div className="flex items-center">
            <form className="ml-4" encType="multipart/form-data">
              <label
                htmlFor="uploadPhoto"
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
              >
                Upload New Photo
              </label>
              <input
                type="file"
                id="uploadPhoto"
                className="hidden"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </form>
          </div>
        )}
      </div>

      {/* Form Section */}
      <div className="container mx-auto my-8 px-4">
        <h4 className="text-xl font-semibold mb-4">Demographic Data</h4>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name*
              </label>
              <input
                type="text"
                className={`w-full p-2 border rounded-md ${
                  errors.firstname ? "border-red-500" : "border-gray-300"
                }`}
                value={firstname}
                onChange={handleFirstNameChange}
              />
              {errors.firstname && (
                <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name*
              </label>
              <input
                type="text"
                className={`w-full p-2 border rounded-md ${
                  errors.lastname ? "border-red-500" : "border-gray-300"
                }`}
                value={lastname}
                onChange={handleLastNameChange}
              />
              {errors.lastname && (
                <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>
              )}
            </div>

            {/* User Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                User Name*
              </label>
              <input
                type="text"
                className={`w-full p-2 border rounded-md ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
                value={username}
                onChange={handleUserNameChange}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email*</label>
              <input
                type="email"
                className={`w-full p-2 border rounded-md ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                value={email}
                readOnly
                onChange={handleEmailChange}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-1">Address*</label>
              <input
                type="text"
                className={`w-full p-2 border rounded-md ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
                value={address}
                onChange={handleAddressChange}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number*
              </label>
              <input
                type="text"
                className={`w-full p-2 border rounded-md ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                value={phone}
                onChange={handlePhoneNumberChange}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Initial Medical Data Section */}
          <div className="mt-8">
            <h4 className="text-xl font-semibold mb-4">Initial Medical Data</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Height */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Height (cm)*
                </label>
                <input
                  type="number"
                  className={`w-full p-2 border rounded-md ${
                    errors.height ? "border-red-500" : "border-gray-300"
                  }`}
                  value={height}
                  onChange={handleHeightChange}
                />
                {errors.height && (
                  <p className="text-red-500 text-xs mt-1">{errors.height}</p>
                )}
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Weight (kg)*
                </label>
                <input
                  type="number"
                  className={`w-full p-2 border rounded-md ${
                    errors.weight ? "border-red-500" : "border-gray-300"
                  }`}
                  value={weight}
                  onChange={handleWeightChange}
                />
                {errors.weight && (
                  <p className="text-red-500 text-xs mt-1">{errors.weight}</p>
                )}
              </div>

              {/* Blood Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Blood Type*
                </label>
                <select
                  className={`w-full p-2 border rounded-md ${
                    errors.bloodType ? "border-red-500" : "border-gray-300"
                  }`}
                  value={bloodType}
                  onChange={handleBloodTypeChange}
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                {errors.bloodType && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.bloodType}
                  </p>
                )}
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Allergies
                </label>
                <input
                  type="text"
                  className={`w-full p-2 border rounded-md ${
                    errors.allergies ? "border-red-500" : "border-gray-300"
                  }`}
                  value={allergies}
                  onChange={handleAllergiesChange}
                />
                {errors.allergies && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.allergies}
                  </p>
                )}
              </div>

              {/* Medical Conditions */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Medical Conditions
                </label>
                <input
                  type="text"
                  className={`w-full p-2 border rounded-md ${
                    errors.medicalConditions
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  value={medicalConditions}
                  onChange={handleMedicalConditionsChange}
                />
                {errors.medicalConditions && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.medicalConditions}
                  </p>
                )}
              </div>

              {/* Medications */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Medications
                </label>
                <input
                  type="text"
                  className={`w-full p-2 border rounded-md ${
                    errors.medications ? "border-red-500" : "border-gray-300"
                  }`}
                  value={medications}
                  onChange={handleMedicationsChange}
                />
                {errors.medications && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.medications}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-left">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </CustomerLayout>
  );
};

export default CustomerDashboard;
