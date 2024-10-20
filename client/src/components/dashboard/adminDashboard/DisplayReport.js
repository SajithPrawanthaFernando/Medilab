// client/src/components/dashboard/adminDashboard/DisplayReport.js
import React, { useState, useEffect } from "react";
import ApiService from "../../../services/ApiService"; // Import the singleton service
import { useAuthContext } from "../../../hooks/useAuthContext";
import DoughnutChart from "../../charts/DoughnutChart"; // Your DoughnutChart component
import PieChart from "../../charts/Piechartt"; // Your PieChart component
import AdminLayout from "../../Layouts/AdminLayout";

const DisplayReport = () => {
  const [peakAppointmentDates, setPeakAppointmentDates] = useState([]);
  const [doctorSpecializationData, setDoctorSpecializationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [appointmentData, specializationData] = await Promise.all([
          ApiService.fetchPeakAppointmentDates(user.token),
          ApiService.fetchDoctorSpecializationCount(user.token),
        ]);

        setPeakAppointmentDates(appointmentData);
        setDoctorSpecializationData(specializationData);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [user.token]);

  // Prepare data for the chart
  const peakAppointmentCounts = peakAppointmentDates.map(
    (record) => record.count
  );
  const peakAppointmentLabels = peakAppointmentDates.map(
    (record) => record._id
  );

  const specializationLabels = doctorSpecializationData.map(
    (entry) => entry.specialization
  );
  const specializationCounts = doctorSpecializationData.map(
    (entry) => entry.count
  );

  // Find the date with the highest number of appointments
  const peakAppointmentDate = peakAppointmentDates.reduce(
    (max, record) => (record.count > max.count ? record : max),
    { count: 0 }
  );

  // Find the specialization with the highest number of doctors
  const highestSpecialization = doctorSpecializationData.reduce(
    (max, record) => (record.count > max.count ? record : max),
    { count: 0 }
  );

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg my-2 mx-1 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
        {/* Header Section */}
        <div className="flex flex-col mb-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">
            Hospital Management System - Reports
          </h2>
          <p className="text-gray-600">
            View and analyze peak appointments records and doctor specialization
            data
          </p>
        </div>

        {loading ? (
          <div className="text-gray-700">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Peak Appointment Dates Section */}
            <div className="border p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                Peak Appointment Dates:
              </h3>
              <div className="text-gray-700 mb-2">
                Most peak date: {peakAppointmentDate._id} -{" "}
                {peakAppointmentDate.count} appointments
              </div>
              {peakAppointmentDates.length > 0 ? (
                <ul className="list-disc list-inside mb-4">
                  {peakAppointmentDates.map((record) => (
                    <li key={record._id} className="text-gray-700">
                      {record._id} - {record.count} appointments
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-700">
                  No peak appointment dates found.
                </div>
              )}

              {/* Render DoughnutChart Component */}
              <DoughnutChart
                dataCounts={peakAppointmentCounts}
                labels={peakAppointmentLabels}
              />
            </div>

            {/* Doctor Specialization Section */}
            <div className="border p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                Doctor Specialization Count:
              </h3>

              {/* Display the specialization with the most doctors */}
              {highestSpecialization.count > 0 && (
                <div className="mt-4 text-gray-700">
                  <h4 className="font-semibold">Most Common Specialization:</h4>
                  <p>
                    {highestSpecialization.specialization} -{" "}
                    {highestSpecialization.count} doctors
                  </p>
                </div>
              )}

              {doctorSpecializationData.length > 0 ? (
                <div>
                  {/* List all specializations and their counts */}
                  <ul className="list-disc list-inside mb-4 mt-2">
                    {doctorSpecializationData.map((entry) => (
                      <li key={entry.specialization} className="text-gray-700">
                        {entry.specialization} - {entry.count} doctors
                      </li>
                    ))}
                  </ul>

                  {/* Render PieChart after the list */}
                  <PieChart
                    labels={specializationLabels}
                    dataCounts={specializationCounts}
                  />
                </div>
              ) : (
                <div className="text-gray-700">
                  No doctor specialization data found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DisplayReport;
