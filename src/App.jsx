import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Home from "./pages/Website/home";
import HomeDemo from "./pages/home";
import Demo from "./pages/demo";
import Samplelms from "./pages/samplelms";
import Bookdemo from "./pages/Website/bookdemo";
import Privacy from "./pages/Website/privacy";
import Security from "./pages/Website/security";
import Trust from "./pages/Website/faq";
import Blogs from "./pages/Website/blogs";
import Article1 from "./pages/Website/Article1";
import Article2 from "./pages/Website/Article2";
import Pdf from "./components/reactpdf";
import ConsentModal from "./pages/Website/cokkiemodal";
import './pages/trackflow-nudge.js'
import LiveDashboard from "./pages/Dashboard";
import ModelDashboard from "./pages/Dashboard";
/* 🔐 import protected route */
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>

      <ConsentModal />

      <Routes>

        {/* Website */}
        <Route path="/" element={<Home />} />
        <Route path="/demohome" element={<HomeDemo />} />
        <Route path="/lms" element={<Samplelms />} />

        {/* Demo */}
        <Route path="/demo" element={<Demo />} />

        {/* Booking */}
        <Route path="/acessingdemo" element={<Bookdemo />} />

        {/* Policy */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/security" element={<Security />} />
        <Route path="/faq" element={<Trust />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/cpaas" element={<Article1 />} />
<Route path="/blogs/churn" element={<Article2 />} />
        {/* PDF */}
        <Route path="/pdf" element={<Pdf />} />

        {/* Normal Dashboard */}
<Route path="/Dashboard" element={<ModelDashboard />} />
       {/* 🔐 Password Protected Live Dashboard */}
<Route
  path="/Dashboard"
  element={
    <ProtectedRoute>
      <LiveDashboard />
    </ProtectedRoute>
  }
/>

      </Routes>

    </BrowserRouter>
  );
}