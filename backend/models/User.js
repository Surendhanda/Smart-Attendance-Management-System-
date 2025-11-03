// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher", "admin"], required: true },

  // 🆕 Course association
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: function () {
      return this.role !== "admin"; // course mandatory for student/teacher only
    },
  },
  courseName: {
    type: String,
    required: function () {
      return this.role !== "admin";
    },
  },
});

module.exports = mongoose.model("User", userSchema);
