import React, { useEffect, useState } from "react";
import AdminLayout from "../../Layouts/AdminLayout";
import Card from "../../common/Card";
import PieChart from "../../charts/PieChart";
import BarChart from "../../charts/BarChart";
import DoughnutChart from "../../charts/DoughnutChart";
import axios from "axios";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [registrationData, setRegistrationData] = useState([]);
  const [dailyFeedbackCountData, setDailyFeedbackCountData] = useState([]);

  // Sample data for cards
  const totalUsers = users.length; // Count of users from API
  const totalProducts = 150; // Example static data
  const totalOrders = 300; // Example static data
  const totalEmployees = 20; // Example static data

  useEffect(() => {
    // Fetch users data for registration count
    axios
      .get("http://localhost:5000/auth/handlecustomer")
      .then((result) => {
        const filteredUsers = result.data.filter(
          (user) => user.role === "user"
        );
        setUsers(filteredUsers);

        const registrationDates = filteredUsers.map(
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
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    // Fetch feedback data
    axios
      .get("http://localhost:5000/auth/handlecustomer")
      .then((result) => {
        const filteredUsers = result.data.filter(
          (user) => user.role === "user" && user.feedback
        );

        // Debugging: Log the filtered users to see if we have data
        console.log("Filtered Users for Feedback:", filteredUsers);

        const sortedUsers = filteredUsers.sort((a, b) => {
          return new Date(b.updated) - new Date(a.updated); // Use 'updated' instead of 'date'
        });

        // Prepare data for daily feedback count chart
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

        // Debugging: Log the feedback data to check the structure
        console.log("Daily Feedback Count Data:", feedbackDataArray);

        setDailyFeedbackCountData(feedbackDataArray);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <AdminLayout>
      {/* Overview Section */}
      <div className="bg-white p-6 mx-1 my-2 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold">Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <Card
            title="Total Users"
            number={totalUsers}
            icon={<i className="bi bi-people-fill"></i>}
            subtext="Total registered users in the system"
          />
          <Card
            title="Total Products"
            number={totalProducts}
            icon={<i className="bi bi-box-fill"></i>}
            subtext="Total medical products available"
          />
          <Card
            title="Total Orders"
            number={totalOrders}
            icon={<i className="bi bi-cart-fill"></i>}
            subtext="Total orders processed this month"
          />
          <Card
            title="Total Employees"
            number={totalEmployees}
            icon={<i className="bi bi-person-fill"></i>}
            subtext="Total employees currently working"
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
