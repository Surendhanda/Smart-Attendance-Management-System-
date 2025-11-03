// ✅ src/pages/Courses.jsx
import React from "react";
import { useCourses } from "../context/CourseContext";

export default function Courses() {
  const { courses } = useCourses();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
        Available Courses
      </h2>

      {courses.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
                <th className="py-3 px-4 font-semibold">Course Title</th>
                <th className="py-3 px-4 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr
                  key={course.id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 text-gray-900 font-medium">
                    {course.title}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{course.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 text-center">No courses available.</p>
      )}
    </div>
  );
}
