// src/context/CourseContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const CourseContext = createContext();

// Provider component
export function CourseProvider({ children }) {
  // Initialize state from localStorage or default courses
  const [courses, setCourses] = useState(() => {
    const stored = localStorage.getItem("courses");
    return stored
      ? JSON.parse(stored)
      : [
          { id: 1, title: "Computer Science", desc: "Intro to CS" },
          { id: 2, title: "Data Structures", desc: "Learn algorithms and DS" },
          { id: 3, title: "Web Development", desc: "HTML, CSS, JS, React" },
          { id: 4, title: "Database Systems", desc: "SQL & NoSQL" },
          { id: 5, title: "Operating Systems", desc: "Process management, threads" },
          { id: 6, title: "Networking", desc: "Computer networks fundamentals" },
          { id: 7, title: "Artificial Intelligence", desc: "AI basics & ML" },
          { id: 8, title: "Machine Learning", desc: "Supervised & Unsupervised" },
          { id: 9, title: "Cyber Security", desc: "Protect systems & networks" },
          { id: 10, title: "Mobile App Development", desc: "Android & iOS apps" },
          { id: 11, title: "Cloud Computing", desc: "AWS, Azure, GCP" },
        ];
  });

  // Sync courses to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  return (
    <CourseContext.Provider value={{ courses, setCourses }}>
      {children}
    </CourseContext.Provider>
  );
}

// Custom hook for consuming context
export function useCourses() {
  return useContext(CourseContext);
}
