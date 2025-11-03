// ✅ backend/routes/attendanceRoutes.js
const express = require("express");
const Attendance = require("../models/Attendance");

const router = express.Router();

/**
 * 🧑‍🏫 Mark attendance (Teacher only)
 */
router.post("/mark", async (req, res) => {
  try {
    const { studentId, status, markedBy, courseId, date } = req.body;

    if (!studentId || !status || !markedBy || !courseId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // 🧠 Avoid duplicate entries for same student/course/date
    const existing = await Attendance.findOne({
      studentId,
      courseId,
      date: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Attendance already marked for this student today." });
    }

    // ✅ Create new record
    const record = await Attendance.create({
      studentId,
      status,
      markedBy,
      courseId,
      date: date || new Date(),
    });

    // ✅ Populate all relational fields for better frontend display
    const populatedRecord = await Attendance.findById(record._id)
      .populate("studentId", "name email")
      .populate("courseId", "title")
      .populate("markedBy", "name email");

    res.status(201).json({
      message: "Attendance marked successfully",
      record: populatedRecord,
    });
  } catch (err) {
    console.error("❌ Error saving attendance:", err.message);
    res.status(500).json({
      message: "Error marking attendance",
      error: err.message,
    });
  }
});

/**
 * 🎓 Get attendance for a specific student
 */
router.get("/student/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Populate student + course + teacher for full info on Student Dashboard
    const records = await Attendance.find({ studentId: id })
      .populate("studentId", "name email")
      .populate("courseId", "title")
      .populate("markedBy", "name email")
      .sort({ date: -1 });

    if (!records.length) {
      return res.status(404).json({ message: "No attendance records found." });
    }

    res.status(200).json(records);
  } catch (err) {
    console.error("❌ Error fetching attendance:", err.message);
    res.status(500).json({
      message: "Error fetching attendance",
      error: err.message,
    });
  }
});

module.exports = router;
