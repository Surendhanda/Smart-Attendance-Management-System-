// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-24 px-6 max-w-4xl mx-auto">
      {/* Main Heading */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
        Welcome to{" "}
        <span className="text-yellow-500">Ascent Technical University</span>
      </h1>

      {/* Subheading */}
      <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-10">
        Explore our wide range of technical courses, gain industry-ready skills,
        and manage your academics with ease — all in one place.
      </p>

      {/* Primary Call-to-Action */}
      <Link
        to="/courses"
        className="px-6 py-3 bg-blue-600 text-white text-lg rounded-xl shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
      >
        Explore Courses
      </Link>
    </section>
  );
}
