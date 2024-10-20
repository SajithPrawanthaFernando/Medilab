// client/src/dashboard/adminDashboard/Dashboard.js
import React, { useEffect, useState } from "react";
import AdminLayout from "../../Layouts/AdminLayout";
import Card from "../../common/Card";
import PieChart from "../../charts/PieChart";
import DoughnutChart from "../../charts/DoughnutChart";
import Apiservices from "../../../services/Apiservices"; // Import the singleton service
import { useAuthContext } from "../../../hooks/useAuthContext";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [registrationData, setRegistrationData] = useState([]);
  const [dailyFeedbackCountData, setDailyFeedbackCountData] = useState([]);
  const { user } = useAuthContext();
  // Sample data for cards
  const totalUsers = users.length; // Count of users from API
  const totalDoctors = doctors.length; // Count of doctors
  const totalAppointments = appointments.length; // Count of appointments

  useEffect(() => {
    // Fetch users data for registration count using the singleton
    const fetchUsersData = async () => {
      const usersData = await Apiservices.fetchUsers();
      setUsers(usersData);

      const DoctorData = await Apiservices.fetchDoctors(user);
      setDoctors(DoctorData);

      const AppoinmentData = await Apiservices.fetchAppointments(user);
      setAppointments(AppoinmentData);

      const registrationDates = usersData.map(
        (user) => user.updated.split("T")[0]
      );
      const registrationCounts = registrationDates.reduce((acc, date) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      const registrationDataArray = Object.entries(registrationCounts).map(
        ([date, count]) => ({ date, count })
      );
      setRegistrationData(registrationDataArray);
    };

    fetchUsersData();
  }, []);

  useEffect(() => {
    // Fetch doctors data using the singleton
    const fetchDoctorsData = async () => {
      const doctorsData = await Apiservices.fetchDoctors();
      setDoctors(doctorsData);
    };

    fetchDoctorsData();
  }, []);

  useEffect(() => {
    // Fetch appointments data using the singleton
    const fetchAppointmentsData = async () => {
      const appointmentsData = await Apiservices.fetchAppointments();
      setAppointments(appointmentsData);
    };

    fetchAppointmentsData();
  }, []);

  useEffect(() => {
    // Fetch feedback data using the singleton
    const fetchFeedbackData = async () => {
      const feedbackData = await Apiservices.fetchFeedback();
      const sortedUsers = feedbackData.sort((a, b) => {
        return new Date(b.updated) - new Date(a.updated); // Use 'updated' instead of 'date'
      });

      const feedbackDates = sortedUsers.map(
        (user) => user.updated.split("T")[0] // Use 'updated' for extracting date
      );
      const feedbackCounts = feedbackDates.reduce((acc, date) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      const feedbackDataArray = Object.entries(feedbackCounts).map(
        ([date, count]) => ({ date, count })
      );

      setDailyFeedbackCountData(feedbackDataArray);
    };

    fetchFeedbackData();
  }, []);

  return (
    <AdminLayout>
      {/* Overview Section */}
      <div className="bg-white p-6 mx-1 my-2 rounded-lg shadow-[0_2px_12px_-4px_rgba(6,81,237,0.3)]">
        <h3 className="text-xl font-semibold">Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <Card
            title="Total Users"
            number={totalUsers}
            icon={<i className="bi bi-people-fill"></i>}
            subtext="Total registered users in the system"
          />
          <Card
            title="Total Doctors"
            number={totalDoctors}
            icon={<i className="bi bi-person-fill"></i>}
            subtext="Total doctors available"
          />
          <Card
            title="Total Appointments"
            number={totalAppointments}
            icon={<i className="bi bi-calendar-fill"></i>}
            subtext="Total appointments scheduled"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="mx-1 my-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Daily Registration Count Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md w-full h-74">
          <h2 className="text-lg font-semibold">Daily Registration Count</h2>
          <PieChart data={registrationData} />
        </div>

        {/* Daily Feedback Count Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md w-full h-74">
          <h2 className="text-lg font-semibold">Daily Feedback Count</h2>
          <DoughnutChart
            dataCounts={dailyFeedbackCountData.map((item) => item.count)}
            labels={dailyFeedbackCountData.map((item) => item.date)}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
