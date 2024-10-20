import React, { useState, useEffect } from "react";
import CustomerLayout from "../../Layouts/CustomerLayout";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useLocation } from "react-router-dom";
import PaymentService from "../../../services/PaymentService";
import Swal from "sweetalert2";

const Payments = () => {
  const { user } = useAuthContext();
  const location = useLocation();

  const { appointmentData } = location.state || {};

  const hardcodedDate = appointmentData?.appointmentDate;
  const hardcodedTime = appointmentData?.appointmentTime;
  const predefinedHospitalCharges = 450.0;

  const [doctor, setDoctor] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [consultantFee, setConsultantFee] = useState("");
  const [totalFee, setTotalFee] = useState(0);
  const [paymentOption, setPaymentOption] = useState("card");
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const calculatedTotalFee =
      parseFloat(consultantFee) + predefinedHospitalCharges;
    setTotalFee(isNaN(calculatedTotalFee) ? 0 : calculatedTotalFee);
  }, [consultantFee]);

  useEffect(() => {
    if (appointmentData?.doctorId) {
      const fetchDoctorData = async () => {
        try {
          const paymentService = PaymentService.getInstance();
          const doctorData = await paymentService.fetchDoctorById(
            appointmentData.doctorId
          );

          console.log("Fetched doctor data:", doctorData);

          if (doctorData) {
            setDoctor(doctorData.name);
            setSpecialization(doctorData.specialization);
            setConsultantFee(doctorData.consultantFee);
          } else {
            console.error("Doctor data is undefined or null");
          }
        } catch (error) {
          console.error("Error fetching doctor data:", error);
        }
      };
      fetchDoctorData();
    }
  }, [appointmentData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentOption === "slip" && !paymentSlip) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "A payment slip is required for slip payments.",
      });
      return;
    }

    const formData = new FormData();

    formData.append("email", user.email);
    formData.append("doctor", doctor);
    formData.append("specialization", specialization);
    formData.append("appointmentDate", hardcodedDate);
    formData.append("appointmentTime", hardcodedTime);
    formData.append("consultantFee", parseFloat(consultantFee));
    formData.append("hospitalCharges", predefinedHospitalCharges);
    formData.append("totalFee", totalFee);
    formData.append("paymentOption", paymentOption);

    if (paymentOption === "slip" && paymentSlip) {
      formData.append("paymentSlip", paymentSlip);
    }

    try {
      const paymentService = PaymentService.getInstance();

      const result = await paymentService.submitPayment(formData);
      console.log("Payment submitted successfully:", result);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Payment submitted successfully!",
      }).then(() => {
        window.location.href = "/user/appoinment";
      });
    } catch (error) {
      console.log("Error submitting payment:");
    }
  };

  return (
    <CustomerLayout>
      <div className="flex justify-between items-center py-4 border-b">
        <h3 className="text-2xl font-semibold ml-5">Appointment Details</h3>
      </div>

      <div className="container mx-auto my-8 px-4">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label
                htmlFor="doctorName"
                className="block text-sm font-medium mb-1"
              >
                Doctor's Name*
              </label>
              <input
                id="doctorName"
                type="text"
                className="w-full p-2 border rounded-md"
                value={appointmentData?.doctorName}
                onChange={(e) => setDoctor(e.target.value)}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Specialty*
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Date*</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={hardcodedDate}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time*</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={hardcodedTime}
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Consultation Fee*
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={consultantFee}
              readOnly
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Hospital Charges (Predefined)*
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={predefinedHospitalCharges}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Total Fee*
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={totalFee}
                readOnly
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-center">
              Payment Option*
            </label>
            <div className="flex justify-center space-x-6">
              <label className="flex items-center justify-center w-1/3 cursor-pointer">
                <input
                  type="radio"
                  value="card"
                  checked={paymentOption === "card"}
                  onChange={() => setPaymentOption("card")}
                  className="form-radio text-blue-600 h-5 w-5 border-gray-300 rounded-full focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Pay with Card</span>
              </label>
              <label className="flex items-center justify-center w-1/3 cursor-pointer">
                <input
                  type="radio"
                  value="slip"
                  checked={paymentOption === "slip"}
                  onChange={() => setPaymentOption("slip")}
                  className="form-radio text-blue-600 h-5 w-5 border-gray-300 rounded-full focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Upload Payment Slip</span>
              </label>
              <label className="flex items-center justify-center w-1/3 cursor-pointer">
                <input
                  type="radio"
                  value="cash"
                  checked={paymentOption === "cash"}
                  onChange={() => setPaymentOption("cash")}
                  className="form-radio text-blue-600 h-5 w-5 border-gray-300 rounded-full focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">
                  Cash Payment at Center
                </span>
              </label>
            </div>
          </div>

          {paymentOption === "slip" && (
            <div className="flex justify-center">
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  Upload Payment Slip*
                </label>
                <input
                  type="file"
                  className="w-full p-2 border rounded-md"
                  onChange={(e) => setPaymentSlip(e.target.files[0])}
                />
              </div>
            </div>
          )}

          {paymentOption === "card" && (
            <div className="mt-6 p-6 bg-white rounded-lg shadow-md border border-gray-300">
              <h4 className="text-lg font-semibold mb-4">Card Details</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Card Number*
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Card Number*"
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Card Holder Name*
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                    placeholder="Card Holder Name*" // Ensure this matches
                    autoComplete="off"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Expiry Date*
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
                      autoComplete="cc-exp"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      CVV*
                    </label>
                    <input
                      type="password"
                      className="w-full p-2 border rounded-md"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="CVV"
                      autoComplete="cc-csc"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
            >
              Submit Payment
            </button>
          </div>
        </form>
      </div>
    </CustomerLayout>
  );
};

export default Payments;
