import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../dashboard/adminDashboard/Dashboard";

import Customers from "../dashboard/adminDashboard/customers/Customers";
import FeedbackManagement from "../dashboard/adminDashboard/customers/FeedbackManagement";
import PatientAddReport from "../dashboard/adminDashboard/customers/PatientAddReport";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Dashboard Overview */}
      <Route path="/" element={<Dashboard />} />

      {/* Customers Routes */}
      <Route path="/customers" element={<Customers />} />
      <Route path="/feedbackmanagement" element={<FeedbackManagement />} />
      <Route path="/patientaddreport" element={<PatientAddReport />} />
    </Routes>
  );
};

export default AdminRoutes;
