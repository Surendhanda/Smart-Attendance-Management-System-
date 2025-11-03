// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CourseProvider } from "./context/CourseContext";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CourseProvider>
          <App />
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
