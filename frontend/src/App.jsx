import React from "react";
import Navbar from "./components/layout/Navbar.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <AppRoutes />
    </>
  );
}
