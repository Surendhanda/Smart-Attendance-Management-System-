// src/pages/Signup.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchCourses } from "../services/courseService";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    courseId: "",
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const courseList = await fetchCourses();
        setCourses(courseList);
      } catch {
        setCourses([]);
      }
    })();
  }, []);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      if (res.status === 201) {
        setSuccess("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login", { replace: true }), 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
      {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
      {success && <div className="mb-3 text-green-600 text-sm">{success}</div>}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          <span className="text-sm">Name</span>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </label>

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

        <label className="block mb-2">
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

        <label className="block mb-4">
          <span className="text-sm">Role</span>
          <select
            name="role"
            value={form.role}
            onChange={onChange}
            className="mt-1 block w-full border rounded px-3 py-2 bg-white"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <label className="block mb-4">
          <span className="text-sm">Select Course</span>
          <select
            name="courseId"
            value={form.courseId}
            onChange={onChange}
            className="mt-1 block w-full border rounded px-3 py-2 bg-white"
            required={form.role !== "admin"}
          >
            <option value="">-- Select a Course --</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-600 transition"
        >
          {loading ? "Signing up…" : "Sign up"}
        </button>
      </form>
    </div>
  );
}
