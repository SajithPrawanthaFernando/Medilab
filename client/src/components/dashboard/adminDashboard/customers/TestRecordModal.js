import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const TestRecordModal = ({ isOpen, onClose }) => {
  const [userId, setPatientId] = useState("");
  const [testName, setTestName] = useState("");
  const [result, setResult] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/auth/add", {
        userId,
        testName,
        result,
        date,
      });

      Swal.fire("Success", "Patient report added successfully!", "success");
      onClose(); // Close modal after successful submission
    } catch (error) {
      console.error("Error adding report:", error);
      Swal.fire("Error", "Failed to add the patient report.", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add Patient Report</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="patientId"
            >
              Patient ID
            </label>
            <input
              type="text"
              id="patientId"
              value={userId}
              onChange={(e) => setPatientId(e.target.value)}
              className="border rounded-md w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="testName"
            >
              Test Name
            </label>
            <input
              type="text"
              id="testName"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="border rounded-md w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="result">
              Result
            </label>
            <input
              type="text"
              id="result"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="border rounded-md w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-md w-full p-2"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-400 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Add Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestRecordModal;
