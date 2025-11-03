// backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const attendanceRoutes = require("./routes/attendanceRoutes");
const coursesRouter = require("./routes/courses");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/university_app";

// ✅ Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", coursesRouter);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/users", userRoutes);

// ✅ Root route
app.get("/", (req, res) => res.json({ msg: "University API is running..." }));

// ✅ Start server (after routes)
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
