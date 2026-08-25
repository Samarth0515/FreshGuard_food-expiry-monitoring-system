import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import "./SignUp.css";

export default function SignUp() {
  const [role, setRole] = useState("HOME_USER"); // HOME_USER | SHOPKEEPER
  const [name, setName] = useState("");
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { signUp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Password strength calculation
  const getStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10 || /[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 1 = Weak, 2 = Medium, 3 = Strong
  };

  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !memberId.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await signUp({
        name: name.trim(),
        memberId: memberId.trim(),
        password,
        confirmPassword,
        userType: role,
      });

      showToast("🎉 Account created successfully! Welcome to FreshGuard.", "success");
      navigate("/");
    } catch (err) {
      setError(err.message || "Signup failed. Please check your details.");
      showToast(err.message || "Signup failed.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card-container">
        {/* Left Side: Brand Visual & Value Proposition */}
        <div className="signup-brand-pane">
          <div>
            <div className="brand-header-badge">
              <span>🥗</span>
              <span>FreshGuard 2025</span>
            </div>
            <h1 className="brand-title">
              Keep Food Fresh, Cut Waste & Save Money.
            </h1>
            <p className="brand-desc">
              The all-in-one digital food lifecycle manager designed for homes and retail stores.
            </p>

            <div className="brand-feature-list">
              <div className="brand-feature-item">
                <div className="brand-feature-icon">🎙️</div>
                <div>
                  <strong>Multi-Modal Input</strong>
                  <div style={{ opacity: 0.85, fontSize: "0.82rem" }}>
                    Add groceries via Voice recognition, Receipt OCR, or Barcode scanning.
                  </div>
                </div>
              </div>

              <div className="brand-feature-item">
                <div className="brand-feature-icon">🚦</div>
                <div>
                  <strong>Traffic-Signal Status</strong>
                  <div style={{ opacity: 0.85, fontSize: "0.82rem" }}>
                    Automated daily 8 AM cron job classifies items as Safe, Expiring Soon, or Expired.
                  </div>
                </div>
              </div>

              <div className="brand-feature-item">
                <div className="brand-feature-icon">🍲</div>
                <div>
                  <strong>Waste Reduction Recipes</strong>
                  <div style={{ opacity: 0.85, fontSize: "0.82rem" }}>
                    Instant recipe recommendations tailored to ingredients expiring in your kitchen.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="brand-footer-quote">
            <span style={{ fontWeight: "700", display: "block" }}>DKTE B.Tech Computer Science Project</span>
            <span style={{ fontSize: "0.8rem", opacity: 0.85 }}>Autonomous Institute • Shivaji University</span>
          </div>
        </div>

        {/* Right Side: Modern Registration Form */}
        <div className="signup-form-pane">
          <div className="form-header">
            <h2>Create Your Account</h2>
            <p>Join FreshGuard to start tracking food expiry today</p>
          </div>

          {/* Account Role Selector */}
          <div className="role-segmented-control">
            <button
              type="button"
              className={`role-tab ${role === "HOME_USER" ? "active" : ""}`}
              onClick={() => setRole("HOME_USER")}
            >
              <span>🏡</span>
              <span>Household User</span>
            </button>
            <button
              type="button"
              className={`role-tab ${role === "SHOPKEEPER" ? "active" : ""}`}
              onClick={() => setRole("SHOPKEEPER")}
            >
              <span>🏪</span>
              <span>Shopkeeper</span>
            </button>
          </div>

          {/* Dynamic Role Notice */}
          <div className={`role-badge-notice ${role === "HOME_USER" ? "home" : "shop"}`}>
            <span>{role === "HOME_USER" ? "✨" : "📦"}</span>
            <span>
              {role === "HOME_USER"
                ? "Household mode: Includes Fridge/Pantry tracking and Smart Recipe recommendations."
                : "Shopkeeper mode: Tailored for high-volume store pantries and inventory tracking."}
            </span>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#991b1b",
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "0.85rem",
                marginBottom: "16px",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-group-modern">
              <label className="form-label-modern">Full Name</label>
              <div className="input-container-modern">
                <span className="input-icon-left">👤</span>
                <input
                  type="text"
                  className="input-modern"
                  placeholder="e.g. Samarth Navale"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Member ID / Store ID */}
            <div className="form-group-modern">
              <label className="form-label-modern">
                {role === "HOME_USER" ? "Member ID / Student PRN" : "Shopkeeper / Store ID"}
              </label>
              <div className="input-container-modern">
                <span className="input-icon-left">🆔</span>
                <input
                  type="text"
                  className="input-modern"
                  placeholder={role === "HOME_USER" ? "e.g. 23UCS091" : "e.g. SHOP_101"}
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group-modern">
              <label className="form-label-modern">Create Password</label>
              <div className="input-container-modern">
                <span className="input-icon-left">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-modern"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="strength-bar-container">
                  <div
                    className={`strength-bar-segment ${
                      strength >= 1
                        ? strength === 1
                          ? "active-weak"
                          : strength === 2
                          ? "active-med"
                          : "active-strong"
                        : ""
                    }`}
                  />
                  <div
                    className={`strength-bar-segment ${
                      strength >= 2
                        ? strength === 2
                          ? "active-med"
                          : "active-strong"
                        : ""
                    }`}
                  />
                  <div
                    className={`strength-bar-segment ${
                      strength >= 3 ? "active-strong" : ""
                    }`}
                  />
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group-modern">
              <label className="form-label-modern">Confirm Password</label>
              <div className="input-container-modern">
                <span className="input-icon-left">🛡️</span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-modern"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <span style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: 3, display: "block" }}>
                  Passwords do not match
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-signup-submit"
              disabled={submitting}
            >
              {submitting
                ? "Creating Your Account..."
                : `Sign Up as ${role === "HOME_USER" ? "Household User" : "Shopkeeper"}`}
            </button>
          </form>

          {/* Links */}
          <div className="signup-footer-links">
            Already have an account? <Link to="/login">Log in here →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
