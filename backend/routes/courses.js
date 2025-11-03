const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const User = require("../models/User"); // For linking teacher/student later

/**
 * 🧑‍💼 Create a new course (Admin only)
 */
router.post("/", async (req, res) => {
  try {
    let { courseId, title, department, description, duration, level, tags, teacher } = req.body;

    // ✅ Auto-generate courseId if not provided
    if (!courseId) {
      courseId = `C-${Date.now()}`; // Example: C-1730138042950
    }

    // ✅ Validate essential field
    if (!title) {
      return res.status(400).json({ message: "Course title is required." });
    }

    // ✅ Prevent duplicates
    const existing = await Course.findOne({ courseId });
    if (existing) {
      return res.status(400).json({ message: "Course with this ID already exists." });
    }

    // ✅ If teacher provided, verify existence
    let teacherDoc = null;
    if (teacher) {
      teacherDoc = await User.findById(teacher);
      if (!teacherDoc || teacherDoc.role !== "teacher") {
        return res.status(400).json({ message: "Invalid teacher ID." });
      }
    }

    // ✅ Create and save the course
    const course = new Course({
      courseId,
      title,
      department: department || "General",
      description: description || "",
      duration: duration || "Self-paced",
      level: level || "Beginner",
      tags: tags || [],
      teacher: teacherDoc ? teacherDoc._id : undefined,
    });

    const saved = await course.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error creating course:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 📋 Get all courses
 */
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("teacher", "name email")
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 🆔 Get a single course by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("teacher", "name email")
      .populate("students", "name email");
    if (!course) return res.status(404).json({ message: "Course not found." });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✏️ Update course by ID
 */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Course not found." });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * 🗑️ Delete course by ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Course not found." });
    res.json({ success: true, message: "Course deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/**
 * 👨‍🏫 Get all students enrolled in a specific course
 * Route: GET /api/courses/:courseId/students
 */
router.get("/:courseId/students", async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("students", "name email");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course.students || []);
  } catch (err) {
    console.error("❌ Error fetching course students:", err);
    res.status(500).json({ message: "Error fetching students", error: err.message });
  }
});

module.exports = router;
