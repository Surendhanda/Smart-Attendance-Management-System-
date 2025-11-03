// ✅ src/services/attendanceService.js
import api from "./api";

/**
 * 🧑‍🏫 Mark attendance (Teacher only)
 * @param {Object} data - { studentId, date, status, markedBy, courseId }
 */
export const markAttendance = async (data) => {
  try {
    // ✅ Validation before hitting backend
    const requiredFields = ["studentId", "status", "date", "markedBy", "courseId"];
    for (const field of requiredFields) {
      if (!data[field]) throw new Error(`Missing required field: ${field}`);
    }

    console.log("📤 Sending attendance data to backend:", data);

    const response = await api.post("/attendance/mark", data);

    console.log("✅ Attendance successfully saved:", response.data);
    // { message, record }
    return response.data;
  } catch (err) {
    console.error("❌ Error marking attendance:", err.response?.data || err.message);
    throw err.response?.data || { message: "Failed to mark attendance" };
  }
};

/**
 * 🎓 Fetch attendance records for a specific student
 * @param {string} studentId
 */
export const getStudentAttendance = async (studentId) => {
  try {
    if (!studentId) throw new Error("Student ID is required");

    const response = await api.get(`/attendance/student/${studentId}`);
    return response.data;
  } catch (err) {
    console.error("❌ Error fetching student attendance:", err.response?.data || err.message);
    throw err.response?.data || { message: "Failed to load attendance" };
  }
};

/**
 * 📋 Fetch all students for a given course (for teacher dropdown)
 * @param {string} courseId
 */
export const getStudentsByCourse = async (courseId) => {
  try {
    if (!courseId) throw new Error("Course ID is required");

    const response = await api.get(`/students/by-course/${courseId}`);
    return response.data; // Expected: [{ _id, name, email }]
  } catch (err) {
    console.error("❌ Error fetching students by course:", err.response?.data || err.message);
    throw err.response?.data || { message: "Failed to fetch student list" };
  }
};
