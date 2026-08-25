import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import authService from "../../services/authService";
import "./ChangePassword.css";

export default function ChangePassword() {
  const { currentUser } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMsg("Please fill all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long");
      return;
    }

    setSubmitting(true);
    try {
      await authService.changePassword({
        memberId: currentUser?.memberId || currentUser?.id,
        oldPassword,
        newPassword,
      });

      setSuccessMsg("✓ Password updated successfully! Your account is now secured with your new password.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setErrorMsg(err.message || "Failed to update password. Please check your current password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="change-password-page">
      <div className="change-password-card">
        <h2>Change Password</h2>
        <p>
          Logged in as <strong>{currentUser?.name}</strong> ({currentUser?.memberId})
        </p>

        {successMsg && <div className="alert-success-box">{successMsg}</div>}
        {errorMsg && <div className="alert-error-box">{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <label style={{ fontSize: "0.85rem", color: "#475569", fontWeight: "600", display: "block", marginBottom: 4 }}>
              Current Password
            </label>
            <input
              type="password"
              placeholder="Enter your current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", color: "#475569", fontWeight: "600", display: "block", marginBottom: 4 }}>
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password (min. 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", color: "#475569", fontWeight: "600", display: "block", marginBottom: 4 }}>
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? "Updating Password..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
