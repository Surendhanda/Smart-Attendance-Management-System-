// backend/models/Attendance.js
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },

  status: { type: String, enum: ["Present", "Absent"], required: true },
  date: { type: Date, default: Date.now },
});

// 🧠 Prevent duplicate entries for same student, course, and date
attendanceSchema.index({ studentId: 1, courseId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
