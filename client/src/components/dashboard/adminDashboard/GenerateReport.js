import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../../../hooks/useAuthContext";
import DoughnutChart from "../../charts/DoughnutChart"; // Import your DoughnutChart component
import AdminLayout from "../../Layouts/AdminLayout";

const GenerateReport = () => {
  const [peakTestDates, setPeakTestDates] = useState([]);
  const [peakTreatmentDates, setPeakTreatmentDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  const serverUrl =
    process.env.REACT_APP_SERVER_URL || "http://localhost:5000/auth";

  // Fetch peak test record dates for all users
  const fetchPeakTestDates = async () => {
    try {
      const response = await axios.get(`${serverUrl}/peaktestdates`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPeakTestDates(response.data);
    } catch (error) {
      console.error("Error fetching peak test dates:", error);
    }
  };

  // Fetch peak treatment record dates for all users
  const fetchPeakTreatmentDates = async () => {
    try {
      const response = await axios.get(`${serverUrl}/peaktreatmentdates`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPeakTreatmentDates(response.data);
    } catch (error) {
      console.error("Error fetching peak treatment dates:", error);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchPeakTestDates(), fetchPeakTreatmentDates()]);
      setLoading(false);
    };

    fetchData();
  }, [user.token]); // Re-fetch if user token changes

  // Prepare data for the chart
  const peakTestCounts = peakTestDates.map((record) => record.count);
  const peakTestLabels = peakTestDates.map((record) => record._id);

  const peakTreatmentCounts = peakTreatmentDates.map((record) => record.count);
  const peakTreatmentLabels = peakTreatmentDates.map((record) => record._id);

  // Find the most peak test and treatment dates
  const peakTestDate = peakTestDates.reduce(
    (max, record) => (record.count > max.count ? record : max),
    { count: 0 }
  );

  const peakTreatmentDate = peakTreatmentDates.reduce(
    (max, record) => (record.count > max.count ? record : max),
    { count: 0 }
  );

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg my-2 mx-1  shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
        {/* Header Section */}
        <div className="flex flex-col mb-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">
            Hospital Management System - Reports
          </h2>
          <p className="text-gray-600">
            View and analyze peak test and treatment records
          </p>
        </div>

        {loading ? (
          <div className="text-gray-700">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Peak Test Dates Section */}
            <div className="border p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                Peak Test Dates:
              </h3>
              <div className="text-gray-700 mb-2">
                Most peak date: {peakTestDate._id} - {peakTestDate.count} tests
              </div>
              {peakTestDates.length > 0 ? (
                <ul className="list-disc list-inside mb-4">
                  {peakTestDates.map((record) => (
                    <li key={record._id} className="text-gray-700">
                      {record._id} - {record.count} tests
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-700">No peak test dates found.</div>
              )}
              <DoughnutChart
                dataCounts={peakTestCounts}
                labels={peakTestLabels}
              />
            </div>

            {/* Peak Treatment Dates Section */}
            <div className="border p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                Peak Treatment Dates:
              </h3>
              <div className="text-gray-700 mb-2">
                Most peak date: {peakTreatmentDate._id} -{" "}
                {peakTreatmentDate.count} treatments
              </div>
              {peakTreatmentDates.length > 0 ? (
                <ul className="list-disc list-inside mb-4">
                  {peakTreatmentDates.map((record) => (
                    <li key={record._id} className="text-gray-700">
                      {record._id} - {record.count} treatments
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-700">
                  No peak treatment dates found.
                </div>
              )}
              <DoughnutChart
                dataCounts={peakTreatmentCounts}
                labels={peakTreatmentLabels}
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default GenerateReport;
