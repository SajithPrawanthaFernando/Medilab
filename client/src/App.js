import "./App.css";
import { useAuthContext } from "../src/hooks/useAuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AdminRoutes from "./components/Routes/AdminRoutes";
import CustomerRoutes from "./components/Routes/CustomerRoutes";
import Register from "./pages/Register";
import TellUsMore from "./pages/TellUsMore";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Checkout from "./pages/Checkout";

function PublicLayout() {
  const { user } = useAuthContext();
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />

        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />

        <Route path="/tell-us-more" element={<TellUsMore />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  const { user } = useAuthContext();
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/*" element={<PublicLayout />} />

        {/* Admin Routes */}
        {user && user.role === "admin" && (
          <Route path="/admin/*" element={<AdminRoutes />} />
        )}

        {/* Customer Routes */}
        <Route path="/user/*" element={<CustomerRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
