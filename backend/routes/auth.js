const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Course = require("../models/Course");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user (Student/Teacher/Admin)
 * @access  Public
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, courseId } = req.body;

    // ✅ Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Enforce course selection for students/teachers
    if ((role === "student" || role === "teacher") && !courseId) {
      return res.status(400).json({ message: "Course selection required" });
    }

    let courseName = null;
    let courseDoc = null;

    if (courseId) {
      courseDoc = await Course.findById(courseId);
      if (!courseDoc) {
        return res.status(404).json({ message: "Selected course not found" });
      }
      courseName = courseDoc.title;
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: ["student", "teacher", "admin"].includes(role) ? role : "student",
      courseId: courseId || null,
      courseName: courseName || null,
    });

    const savedUser = await user.save();

    // ✅ If user is a student → add to Course.students[]
    if (savedUser.role === "student" && courseDoc) {
      await Course.findByIdAndUpdate(
        courseDoc._id,
        { $addToSet: { students: savedUser._id } }, // avoid duplicates
        { new: true }
      );
    }

    // ✅ Return consistent structure with _id
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: savedUser._id, // ✅ consistent naming
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        courseId: savedUser.courseId,
        courseName: savedUser.courseName,
      },
    });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Create JWT token (include role)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );

    // ✅ Return consistent user object
    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id, // ✅ unified naming
        name: user.name,
        email: user.email,
        role: user.role,
        courseId: user.courseId,
        courseName: user.courseName,
      },
    });
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/auth/profile
 * @desc    Get logged-in user profile (protected)
 * @access  Private
 */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      _id: user._id, // ✅ unified key
      name: user.name,
      email: user.email,
      role: user.role,
      courseId: user.courseId,
      courseName: user.courseName,
    });
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
