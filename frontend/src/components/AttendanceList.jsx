// ✅ src/components/AttendanceList.jsx
import React from "react";

export default function AttendanceList({ records = [], showStudentInfo = false }) {
  if (!records || records.length === 0)
    return <p className="text-gray-600">No attendance records found.</p>;

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border border-gray-200 rounded-lg text-sm text-left shadow-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-700 font-semibold">
            {showStudentInfo && <th className="px-4 py-2">Student Name</th>}
            {showStudentInfo && <th className="px-4 py-2">Student Email / ID</th>}
            {showStudentInfo && <th className="px-4 py-2">Course</th>}
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {records.map((rec, idx) => {
            // ✅ Normalize for safety — covers both populated and flat data
            const student = rec.student || rec.studentId || {};
            const course = rec.course || rec.courseId || {};
            const studentName = student?.name || rec.studentName || "—";
            const studentEmail = student?.email || student?._id || rec.studentEmail || "—";
            const courseTitle = course?.title || "—";

            return (
              <tr key={rec._id || idx} className="hover:bg-gray-50 border-b">
                {/* 🧑 Student Info (Only visible for teacher view) */}
                {showStudentInfo && (
                  <>
                    <td className="px-4 py-2">{studentName}</td>
                    <td className="px-4 py-2 text-gray-600">{studentEmail}</td>
                    <td className="px-4 py-2">{courseTitle}</td>
                  </>
                )}

                {/* 📅 Date */}
                <td className="px-4 py-2">
                  {rec.date
                    ? new Date(rec.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </td>

                {/* ✅ Status */}
                <td
                  className={`px-4 py-2 font-semibold ${
                    rec.status === "Present"
                      ? "text-green-600"
                      : rec.status === "Absent"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {rec.status}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
