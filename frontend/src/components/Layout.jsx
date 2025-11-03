// src/components/Layout.jsx
import React from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const commonLinks = [
    { to: "/", label: "Home" },
    { to: "/courses", label: "Courses" },
    { to: "/admin", label: "Admin" },
  ];

  const guestLinks = [
    { to: "/signup", label: "Sign Up" },
    { to: "/login", label: "Log In" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Accessibility Skip Link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                   bg-yellow-300 text-gray-900 px-3 py-2 rounded shadow-sm"
      >
        Skip to content
      </a>

      {/* Navbar */}
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <Link
          to="/"
          className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 
                     focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded"
        >
          Ascent Technical University
        </Link>

        <div className="flex items-center space-x-4">
          {/* Common Links */}
          {commonLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-md text-sm md:text-base font-medium transition-colors duration-150 ${
                location.pathname === link.to
                  ? "bg-yellow-400 text-gray-900"
                  : "hover:bg-gray-700 hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              }`}
              aria-current={location.pathname === link.to ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}

          {/* ✅ Attendance Links (newly added) */}
          {isAuthenticated && user?.role === "student" && (
            <Link
              to="/student/attendance"
              className={`px-3 py-2 rounded-md text-sm md:text-base font-medium transition-colors duration-150 ${
                location.pathname === "/student/attendance"
                  ? "bg-yellow-400 text-gray-900"
                  : "hover:bg-gray-700 hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              }`}
            >
              My Attendance
            </Link>
          )}

          {isAuthenticated && user?.role === "teacher" && (
            <Link
              to="/teacher/attendance"
              className={`px-3 py-2 rounded-md text-sm md:text-base font-medium transition-colors duration-150 ${
                location.pathname === "/teacher/attendance"
                  ? "bg-yellow-400 text-gray-900"
                  : "hover:bg-gray-700 hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              }`}
            >
              Mark Attendance
            </Link>
          )}

          {/* Auth Controls */}
          {!isAuthenticated ? (
            guestLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm md:text-base font-medium transition-colors duration-150 ${
                  location.pathname === link.to
                    ? "bg-yellow-400 text-gray-900"
                    : "hover:bg-gray-700 hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                }`}
              >
                {link.label}
              </Link>
            ))
          ) : (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-yellow-300 hidden sm:inline">
                Hi, {user?.name || "User"} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-yellow-400 text-gray-900 rounded-md text-sm font-medium 
                           hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main content outlet */}
      <main
        id="main"
        className="flex-grow p-6 md:p-8 max-w-6xl mx-auto w-full"
      >
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-4 text-gray-700 text-sm border-t border-gray-200">
        © {new Date().getFullYear()} Ascent Technical University
      </footer>
    </div>
  );
}
