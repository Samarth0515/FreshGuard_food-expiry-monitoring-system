import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import NotificationBell from "../common/NotificationBell.jsx";
import profileIcon from "../../assets/profile.png";

export default function Navbar() {
  const { currentUser, logout, isShopkeeper, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => (location.pathname === path ? "active text-success fw-bold" : "");

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top" style={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
      <div className="container-fluid px-lg-4">
        <Link className="navbar-brand text-success fw-bold d-flex align-items-center gap-2" to="/">
          <span style={{ fontSize: "1.5rem" }}>🥗</span>
          <span style={{ letterSpacing: "-0.5px" }}>FreshGuard</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-1">
            <li className="nav-item">
              <Link className={`nav-link px-3 ${isActive("/")}`} to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link px-3 ${isActive("/inventory")}`} to="/inventory">
                {isShopkeeper ? "Store Inventory" : "Inventory"}
              </Link>
            </li>

            {/* Recipes link for Home Users & Guests */}
            {!isShopkeeper && (
              <li className="nav-item">
                <Link className={`nav-link px-3 ${isActive("/recipes")}`} to="/recipes">
                  Recipes
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link className={`nav-link px-3 ${isActive("/scanner")}`} to="/scanner">
                Scanner
              </Link>
            </li>

            {/* Admin Control Center Link for Admin accounts */}
            {isAdmin && (
              <li className="nav-item">
                <Link
                  className={`nav-link px-3 fw-bold text-danger ${isActive("/admin")}`}
                  to="/admin"
                >
                  🛡️ Admin Panel
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link className={`nav-link px-3 ${isActive("/about")}`} to="/about">
                About
              </Link>
            </li>

            {currentUser ? (
              <>
                <li className="nav-item d-flex align-items-center ms-lg-2">
                  <NotificationBell />
                </li>
                <li className="nav-item d-flex align-items-center mx-2">
                  <img
                    src={profileIcon}
                    alt="Profile"
                    width="32"
                    height="32"
                    className="rounded-circle me-2 border border-2 border-success"
                  />
                  <div className="d-flex flex-column">
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-dark fw-bold" style={{ fontSize: "0.9rem" }}>
                        {currentUser.name}
                      </span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          padding: "1px 7px",
                          borderRadius: "10px",
                          backgroundColor: isAdmin
                            ? "#fee2e2"
                            : isShopkeeper
                            ? "#fef3c7"
                            : "#e0f2fe",
                          color: isAdmin
                            ? "#991b1b"
                            : isShopkeeper
                            ? "#92400e"
                            : "#0369a1",
                          fontWeight: "700",
                        }}
                      >
                        {isAdmin ? "Admin" : isShopkeeper ? "Shopkeeper" : "Home User"}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                      ID: {currentUser.memberId}
                    </span>
                  </div>
                </li>
                <li className="nav-item">
                  <Link
                    to="/change-password"
                    className="btn btn-sm btn-outline-secondary ms-1"
                    title="Change Password"
                  >
                    🔑
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-sm btn-dark ms-2 px-3"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-success ms-2 px-3" to="/signup">
                    Sign Up
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn btn-success ms-2 px-3 text-white"
                    to="/login"
                  >
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
