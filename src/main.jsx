import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { DashboardProvider } from "./context/DashboardContext.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode><DashboardProvider><App /></DashboardProvider></React.StrictMode>
);
