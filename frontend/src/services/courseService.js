// ✅ src/services/courseService.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api/courses";

/**
 * Fetch all courses from backend
 */
export async function fetchCourses() {
  try {
    const res = await axios.get(API_BASE);
    return res.data || [];
  } catch (err) {
    console.error("❌ Error fetching courses:", err);
    throw err;
  }
}

/**
 * Add a new course (Admin only)
 */
export async function addCourse(courseData) {
  try {
    const res = await axios.post(API_BASE, courseData);
    return res.data;
  } catch (err) {
    console.error("❌ Error adding course:", err);
    throw err;
  }
}

/**
 * Delete a course by ID
 */
export async function deleteCourse(courseId) {
  try {
    const res = await axios.delete(`${API_BASE}/${courseId}`);
    return res.data;
  } catch (err) {
    console.error("❌ Error deleting course:", err);
    throw err;
  }
}

/**
 * Update course by ID (optional future use)
 */
export async function updateCourse(courseId, updatedData) {
  try {
    const res = await axios.put(`${API_BASE}/${courseId}`, updatedData);
    return res.data;
  } catch (err) {
    console.error("❌ Error updating course:", err);
    throw err;
  }
}

// ✅ Fix for AdminDashboard import
export { fetchCourses as getCourses };
