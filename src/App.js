import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import PersonalDashboard from "./components/PersonalDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes with automatic redirection based on account type */}
      <Route
        path="/"
        element={<ProtectedRoute element={<Navigate to="/dashboard" />} />}
      />

      {/* Dashboard routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/personal" element={<PersonalDashboard />} />

      {/* ...existing code... */}
    </Routes>
  );
}

export default App;
