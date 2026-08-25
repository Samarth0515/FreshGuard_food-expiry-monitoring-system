import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminRoute({ children }) {
  const { currentUser, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px", color: "#64748b" }}>
        <div className="spinner-border text-success" role="status" style={{ marginBottom: 12 }} />
        <p>Verifying administrative privileges...</p>
      </div>
    );
  }

  if (!currentUser || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
