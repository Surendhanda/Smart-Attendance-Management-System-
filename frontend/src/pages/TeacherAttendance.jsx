// ✅ src/pages/TeacherAttendance.jsx
import React, { useState, useEffect } from "react";
import MarkAttendanceForm from "../components/MarkAttendanceForm";
import AttendanceList from "../components/AttendanceList";
import { markAttendance } from "../services/attendanceService";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function TeacherAttendance() {
  const { user } = useAuth(); // logged-in teacher info
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch students belonging to the teacher’s course
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        if (!user || user.role !== "teacher" || !user.courseId) return;

        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/courses/${user.courseId}/students`
        );
        setStudents(res.data || []);
        console.log("✅ Students fetched:", res.data);
      } catch (err) {
        console.error("❌ Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user]);

  // 🔹 Handle attendance marking
  const handleMark = async (data) => {
    try {
      const payload = {
        ...data,
        markedBy: user?._id,
        courseId: user?.courseId,
      };

      console.log("📦 Sending payload:", payload);

      const res = await markAttendance(payload);
      const newRecord = res?.record; // ✅ fixed - res is already data

      if (!newRecord) throw new Error("Attendance record missing in response");

      console.log("✅ Attendance saved:", newRecord);

      setAttendanceRecords((prev) => [newRecord, ...prev]);
      alert("✅ Attendance marked successfully!");
    } catch (err) {
      console.error("❌ Error marking attendance:", err);
      alert(err?.message || "Failed to mark attendance.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">
        Teacher Attendance Panel
      </h2>

      {loading ? (
        <p className="text-gray-600">Loading students…</p>
      ) : (
        <>
          <MarkAttendanceForm students={students} onSubmit={handleMark} />

          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Recent Attendance Records
            </h3>

            {attendanceRecords.length > 0 ? (
              // ✅ showStudentInfo ensures student names appear
              <AttendanceList records={attendanceRecords} showStudentInfo={true} />
            ) : (
              <p className="text-gray-600">No attendance records found.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
