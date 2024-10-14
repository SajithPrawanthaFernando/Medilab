import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerDashboard from "../dashboard/customerDashboard/CustomerDashboard";
import ChangePassword from "../dashboard/customerDashboard/ChangePassword";
import CustomerNotification from "../dashboard/customerDashboard/CustomerNotification";
import FeedbackForm from "../dashboard/customerDashboard/FeedbackForm";
import CustomerRecord from "../dashboard/customerDashboard/CustomerRecord";
import CustomerTreatment from "../dashboard/customerDashboard/CustomerTreatment";

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route path="/:email" element={<CustomerDashboard />} />
      <Route path="/customerrecords" element={<CustomerRecord />} />
      <Route path="/customertreatment" element={<CustomerTreatment />} />
      <Route path="/updatepassword/:email" element={<ChangePassword />} />
      <Route path="/notifi/:email" element={<CustomerNotification />} />
      <Route path="/feedback/:email" element={<FeedbackForm />} />
    </Routes>
  );
};

export default CustomerRoutes;
