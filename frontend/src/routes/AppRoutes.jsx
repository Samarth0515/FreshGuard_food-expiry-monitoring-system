import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home.jsx";
import Login from "../pages/Login/Login.jsx";
import SignUp from "../pages/SignUp/SignUp.jsx";
import Inventory from "../pages/Inventory/Inventory.jsx";
import Scanner from "../pages/Scanner/Scanner.jsx";
import Recipes from "../pages/Recipes/Recipes.jsx";
import ChangePassword from "../pages/Auth/ChangePassword.jsx";
import About from "../pages/About/About.jsx";
import AdminDashboard from "../pages/Admin/AdminDashboard.jsx";
import NotFound from "../pages/NotFound/NotFound.jsx";
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";
import AdminRoute from "../components/common/AdminRoute.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/about" element={<About />} />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <Inventory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scanner"
        element={
          <ProtectedRoute>
            <Scanner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recipes"
        element={
          <ProtectedRoute>
            <Recipes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
