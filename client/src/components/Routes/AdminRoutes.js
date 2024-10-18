import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../dashboard/adminDashboard/Dashboard";

import Customers from "../dashboard/adminDashboard/customers/Customers";
import FeedbackManagement from "../dashboard/adminDashboard/customers/FeedbackManagement";
import PatientAddReport from "../dashboard/adminDashboard/customers/PatientAddReport";
import UserTestRecords from "../dashboard/adminDashboard/customers/UserTestRecords";
import AddTreatment from "../dashboard/adminDashboard/customers/AddTreatment";
import UserTreatmentRecords from "../dashboard/adminDashboard/customers/UserTreatmentRecords";
import GenerateReport from "../dashboard/adminDashboard/GenerateReport";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Dashboard Overview */}
      <Route path="/" element={<Dashboard />} />

      {/* Customers Routes */}
      <Route path="/customers" element={<Customers />} />
      <Route path="/feedbackmanagement" element={<FeedbackManagement />} />
      <Route path="/patientaddreport" element={<PatientAddReport />} />
      <Route path="/viewreport" element={<UserTestRecords />} />
      <Route path="/addtreatment" element={<AddTreatment />} />
      <Route path="/viewtreatment" element={<UserTreatmentRecords />} />
      <Route path="/GenerateReport" element={<GenerateReport />} />
    </Routes>
  );
};

export default AdminRoutes;
