// ✅ src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../context/CourseContext";
import {
  getCourses,
  addCourse,
  deleteCourse,
} from "../services/courseService"; // 🆕 optional layer

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { courses, setCourses } = useCourses();
  const [form, setForm] = useState({ title: "", desc: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🧠 Load all courses from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses");
      }
    })();
  }, [setCourses]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.desc.trim()) return;

    try {
      setLoading(true);
      const newCourse = await addCourse({
        title: form.title,
        description: form.desc,
      });
      setCourses((prev) => [newCourse, ...prev]);
      setForm({ title: "", desc: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to add course");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteCourse(id);
      setCourses(courses.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete course");
    }
  };

  const handleConfirm = (id) => {
    navigate(`/courses/${id}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* Add Course Form */}
      <form
        onSubmit={handleAdd}
        className="space-y-4 max-w-md mb-8 p-4 border rounded shadow-sm bg-gray-50"
      >
        <input
          name="title"
          placeholder="Course Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <input
          name="desc"
          placeholder="Course Description"
          value={form.desc}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {loading ? "Adding..." : "Add Course"}
        </button>
      </form>

      {/* Course List */}
      <div className="grid gap-4">
        {courses.map((c) => (
          <div
            key={c._id || c.id}
            className="border p-4 rounded bg-white shadow-sm flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-gray-600">{c.description || c.desc}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleConfirm(c._id || c.id)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                View
              </button>
              <button
                onClick={() => handleDelete(c._id || c.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
