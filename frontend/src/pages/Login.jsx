import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, login, user } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // ✅ If already logged in, redirect automatically
  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role;
      if (role === "student") navigate("/courses", { replace: true });
      else if (role === "teacher") navigate("/teacher/attendance", { replace: true });
      else if (role === "admin") navigate("/admin/dashboard", { replace: true });
      else navigate("/", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  function onChange(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      console.log("✅ Backend login response:", res.data); // ✅ Debug log added here

      if (res.data.token) {
        // ✅ Call context login to sync global state
        login(res.data.user, res.data.token);

        const role = res.data.user.role;
        if (role === "student") navigate("/courses", { replace: true });
        else if (role === "teacher") navigate("/teacher/attendance", { replace: true });
        else if (role === "admin") navigate("/admin/dashboard", { replace: true });
        else navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Log In</h2>
      {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-600 transition"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="text-sm text-center mt-4 text-gray-700">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-yellow-600 font-medium hover:underline">
          Sign up here
        </Link>
      </p>
    </div>
  );
}
