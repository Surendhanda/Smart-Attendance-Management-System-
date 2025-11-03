// ✅ src/pages/StudentAttendance.jsx
import React, { useEffect, useState } from "react";
import AttendanceList from "../components/AttendanceList";
import { getStudentAttendance } from "../services/attendanceService";
import { useAuth } from "../context/AuthContext";

export default function StudentAttendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAttendance() {
  if (!user?._id) return;

  try {
    const res = await getStudentAttendance(user._id);
    console.log("🎓 Student Attendance:", res); // Debug check
    setRecords(res || []); // ✅ Fix
  } catch (err) {
    console.error("Error fetching attendance:", err);
    setError("Unable to load attendance records. Please try again later.");
  } finally {
    setLoading(false);
  }
}

    fetchAttendance();
  }, [user]);

  if (loading)
    return <p className="text-gray-600 text-center mt-4">Loading attendance...</p>;
  if (error)
    return <p className="text-red-600 text-center mt-4">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
        {user?.name ? `${user.name}’s Attendance Record` : "Attendance Record"}
      </h2>

      {records.length > 0 ? (
        <AttendanceList records={records} />
      ) : (
        <p className="text-gray-600 text-center">
          No attendance records available yet.
        </p>
      )}
    </div>
  );
}
