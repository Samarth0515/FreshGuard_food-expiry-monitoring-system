import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import "./Login.css";

export default function Login() {
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!memberId.trim() || !password) {
      setError("Please enter your Member ID and Password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(memberId.trim(), password.trim());
      showToast("🎉 Welcome back! Login successful.", "success");
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid Member ID or Password.");
      showToast(err.message || "Invalid credentials.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card-container">
        {/* Left Side: Brand Accent */}
        <div className="login-brand-pane">
          <div>
            <div className="brand-header-badge">
              <span>🥗</span>
              <span>FreshGuard Access</span>
            </div>
            <h1 className="brand-title">Welcome Back.</h1>
            <p className="brand-desc">
              Log in to access your real-time inventory, near-expiry alerts, and smart recipe recommendations.
            </p>
          </div>

          <div className="brand-footer-quote">
            <span style={{ fontWeight: "700", display: "block" }}>Admin Demo Login:</span>
            <span style={{ fontSize: "0.8rem", opacity: 0.85 }}>ID: <code>admin</code> • Pass: <code>Admin@123</code></span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="login-form-pane">
          <h2>Sign In to FreshGuard</h2>
          <p className="sub">Enter your credentials to continue</p>

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
            <div className="form-group-modern">
              <label className="form-label-modern">Member ID / Store ID / Admin</label>
              <div className="input-container-modern">
                <span className="input-icon-left">🆔</span>
                <input
                  type="text"
                  className="input-modern"
                  placeholder="e.g. 23UCS091, SHOP_101, or admin"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group-modern">
              <label className="form-label-modern">Password</label>
              <div className="input-container-modern">
                <span className="input-icon-left">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-modern"
                  placeholder="Enter your password"
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
            </div>

            <button type="submit" className="btn-login-submit" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div className="login-footer-links">
            Don't have an account yet? <Link to="/signup">Create an account →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
