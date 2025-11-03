// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Courses from "./pages/Courses";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./context/AuthContext";

// ✅ Newly added imports for Attendance Module
import StudentAttendance from "./pages/StudentAttendance";
import TeacherAttendance from "./pages/TeacherAttendance";

export default function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Layout wraps all main pages once */}
      <Route element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route
          path="signup"
          element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
        />
        <Route
          path="login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />

        {/* Protected routes */}
        <Route
          path="courses"
          element={isAuthenticated ? <Courses /> : <Navigate to="/login" />}
        />
        <Route
          path="admin"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* ✅ Attendance Module Routes */}
        <Route
          path="student/attendance"
          element={
            isAuthenticated && user?.role === "student" ? (
              <StudentAttendance />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="teacher/attendance"
          element={
            isAuthenticated && user?.role === "teacher" ? (
              <TeacherAttendance />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}
