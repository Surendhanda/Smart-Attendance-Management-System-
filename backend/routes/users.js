// ✅ backend/routes/users.js
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Course = require("../models/Course");
const router = express.Router();

/**
 * 🧾 Register a new user (student / teacher / admin)
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, courseId, courseName } = req.body;

    // ✅ Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    // ✅ Prevent duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    // ✅ Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      courseId: role !== "admin" ? courseId : undefined,
      courseName: role !== "admin" ? courseName : undefined,
    });

    const savedUser = await user.save();

    // ✅ If student, link them to the course
    if (role === "student" && courseId) {
      await Course.findByIdAndUpdate(courseId, {
        $addToSet: { students: savedUser._id },
      });
    }

    // ✅ If teacher, assign them to the course
    if (role === "teacher" && courseId) {
      await Course.findByIdAndUpdate(courseId, {
        teacher: savedUser._id,
      });
    }

    res.status(201).json({ message: "User registered successfully", user: savedUser });
  } catch (err) {
    console.error("❌ Error registering user:", err);
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
});

/**
 * 👩‍🎓 Get all students for a specific course (Teacher’s view)
 */
router.get("/course/:courseId/students", async (req, res) => {
  try {
    const { courseId } = req.params;
    const students = await User.find({ courseId, role: "student" }).select("name _id email");
    res.json(students);
  } catch (err) {
    console.error("❌ Error fetching students:", err);
    res.status(500).json({ message: "Error fetching students", error: err.message });
  }
});

module.exports = router;
