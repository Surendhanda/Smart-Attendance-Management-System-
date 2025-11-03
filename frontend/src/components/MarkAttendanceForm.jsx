// ✅ src/components/MarkAttendanceForm.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function MarkAttendanceForm({ onSubmit }) {
  const { user } = useAuth(); // teacher info
  const [form, setForm] = useState({
    studentId: "",
    date: "",
    status: "Present",
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Load students for the teacher’s assigned course
  useEffect(() => {
    async function fetchStudents() {
      try {
        if (!user?.courseId) {
          setError("No course assigned to this teacher.");
          setLoading(false);
          return;
        }

        // ✅ Correct backend endpoint
        const res = await axios.get(
          `http://localhost:5000/api/users/course/${user.courseId}/students`
        );

        setStudents(res.data || []);
      } catch (err) {
        console.error("Error loading students:", err);
        setError("Failed to load students list.");
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Updated: include teacher info (markedBy)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.studentId || !form.date) return;

    const payload = {
      ...form,
      markedBy: user._id, // ✅ teacher’s ID sent to backend
    };

    onSubmit(payload);
    setForm({ studentId: "", date: "", status: "Present" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg p-4 shadow-sm bg-white space-y-4 max-w-md"
    >
      <h3 className="text-lg font-semibold text-gray-800">
        Mark Student Attendance
      </h3>

      {/* Student Dropdown */}
      {loading ? (
        <p>Loading students...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : students.length === 0 ? (
        <p className="text-gray-600">No students found for this course.</p>
      ) : (
        <select
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        >
          <option value="">Select Student</option>
          {students.map((stu) => (
            <option key={stu._id} value={stu._id}>
              {stu.name}
            </option>
          ))}
        </select>
      )}

      {/* Date Input */}
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
      />

      {/* Status Dropdown */}
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      >
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
      </select>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
