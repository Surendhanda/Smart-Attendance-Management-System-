const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true, // e.g. “CSE101”, “MATH202”
  },
  title: { type: String, required: true, trim: true },
  department: { type: String, trim: true },
  description: { type: String, trim: true },
  duration: { type: String },
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
  tags: [String],

  // Relations
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // only teachers
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // enrolled students
    },
  ],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Course", CourseSchema);
