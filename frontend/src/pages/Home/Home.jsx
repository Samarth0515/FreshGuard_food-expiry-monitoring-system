import React from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/layout/Footer.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Home.css";

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <>
      {/* Modern Hero Section */}
      <section className="home-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="hero-badge">
                <span>🌱</span>
                <span>Smart Food Management • Reduce Food Waste</span>
              </div>
              <h1 className="hero-title">
                Never Let Your Food Go To <span>Waste Again</span>
              </h1>
              <p className="hero-subtitle">
                Automated expiry tracking, multi-modal inventory management (Voice, Barcode & OCR Receipts), and intelligent near-expiry recipe recommendations.
              </p>
              <div className="hero-buttons">
                {currentUser ? (
                  <Link to="/inventory" className="btn btn-success btn-lg px-4 shadow-sm">
                    Go to Your Inventory →
                  </Link>
                ) : (
                  <>
                    <Link to="/signup" className="btn btn-success btn-lg px-4 shadow-sm">
                      Get Started Free
                    </Link>
                    <Link to="/login" className="btn btn-outline-dark btn-lg px-4">
                      Log In
                    </Link>
                  </>
                )}
              </div>
              <div className="d-flex align-items-center gap-3 text-muted" style={{ fontSize: "0.85rem" }}>
                <span>✓ Multi-Modal Input</span>
                <span>•</span>
                <span>✓ 24/7 Expiry Alerts</span>
                <span>•</span>
                <span>✓ Recipe AI Engine</span>
              </div>
            </div>

            {/* Interactive Live Traffic-Signal Demo Preview Card */}
            <div className="col-lg-6">
              <div className="hero-preview-card">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <strong style={{ fontSize: "1.1rem", color: "#0f172a" }}>
                    Live Inventory Status
                  </strong>
                  <span className="badge bg-success" style={{ padding: "6px 10px", fontSize: "0.75rem" }}>
                    Active Tracking
                  </span>
                </div>

                <div className="list-group list-group-flush">
                  {/* Fresh Item */}
                  <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <span className="signal signal-green" />
                      <div>
                        <strong style={{ color: "#1e293b", display: "block" }}>Amul Butter 500g</strong>
                        <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Fridge • 180 days left</span>
                      </div>
                    </div>
                    <span className="badge bg-light text-success border border-success" style={{ fontSize: "0.75rem" }}>
                      Safe / Fresh
                    </span>
                  </div>

                  {/* Near Expiry Item */}
                  <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 bg-light rounded my-1">
                    <div className="d-flex align-items-center gap-3 ps-2">
                      <span className="signal signal-yellow" />
                      <div>
                        <strong style={{ color: "#1e293b", display: "block" }}>Greek Yogurt</strong>
                        <span style={{ fontSize: "0.8rem", color: "#d97706" }}>Fridge • Expires in 2 days</span>
                      </div>
                    </div>
                    <span className="badge bg-warning text-dark me-2" style={{ fontSize: "0.75rem" }}>
                      Expiring Soon
                    </span>
                  </div>

                  {/* Expired Item */}
                  <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <span className="signal signal-red" />
                      <div>
                        <strong style={{ color: "#1e293b", display: "block" }}>Whole Milk</strong>
                        <span style={{ fontSize: "0.8rem", color: "#dc2626" }}>Fridge • Expired yesterday</span>
                      </div>
                    </div>
                    <span className="badge bg-danger text-white" style={{ fontSize: "0.75rem" }}>
                      Expired
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center" style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  <span>Automated Traffic Indicators</span>
                  <Link to="/inventory" className="text-success fw-bold text-decoration-none">
                    View Live Inventory →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <span className="stat-number">4 Modes</span>
                <span className="stat-label">Voice, Barcode, OCR & Manual</span>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Automated Expiry Scheduler</span>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <span className="stat-number">10+</span>
                <span className="stat-label">Smart Waste-Reduction Recipes</span>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <span className="stat-number">0%</span>
                <span className="stat-label">Household Food Waste</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-tag">Powerful Capabilities</span>
            <h2 style={{ fontSize: "2.2rem", fontWeight: "800", color: "#0f172a" }}>
              Built for Households & Retail Pantries
            </h2>
            <p style={{ color: "#64748b", maxWidth: "600px", margin: "10px auto 0" }}>
              Everything you need to effortlessly catalog groceries, prevent expiry dates from passing unnoticed, and utilize food before it spoils.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card-modern">
                <div className="feature-icon-box">🎙️</div>
                <h4 style={{ fontSize: "1.2rem", fontWeight: "700" }}>Voice Input & Recognition</h4>
                <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                  Speak directly into your device: "Milk expires next Friday". Our NLP parser automatically extracts product names and schedules expiry.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card-modern">
                <div className="feature-icon-box">🧾</div>
                <h4 style={{ fontSize: "1.2rem", fontWeight: "700" }}>Receipt & Bill OCR Scanning</h4>
                <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                  Snap a photo of your supermarket grocery bill. Tesseract OCR instantly extracts items, classifies categories, and populates your inventory.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card-modern">
                <div className="feature-icon-box">📷</div>
                <h4 style={{ fontSize: "1.2rem", fontWeight: "700" }}>Barcode Catalog Scanner</h4>
                <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                  Scan product barcodes with your webcam or phone camera. Lookups connect to our internal catalog and Open Food Facts worldwide database.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card-modern">
                <div className="feature-icon-box">🔔</div>
                <h4 style={{ fontSize: "1.2rem", fontWeight: "700" }}>Daily Expiry Alerts</h4>
                <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                  Our automated backend cron job runs daily at 8:00 AM, categorizing items by traffic signals (Green, Yellow, Red) and sending proactive alerts.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card-modern">
                <div className="feature-icon-box">🍲</div>
                <h4 style={{ fontSize: "1.2rem", fontWeight: "700" }}>Recipe Recommendation Engine</h4>
                <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                  Got tomatoes, onions, or chicken expiring soon? One click reveals tailored step-by-step recipes to transform ingredients into delicious meals.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card-modern">
                <div className="feature-icon-box">🛡️</div>
                <h4 style={{ fontSize: "1.2rem", fontWeight: "700" }}>Central Admin Control</h4>
                <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                  Complete administrative control center to author new recipes, register barcodes, monitor platform users, and inspect real-time system metrics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-tag">Simple 4-Step Workflow</span>
            <h2 style={{ fontSize: "2.2rem", fontWeight: "800", color: "#0f172a" }}>
              How FreshGuard Works
            </h2>
          </div>

          <div className="row g-4">
            <div className="col-md-3">
              <div className="step-card">
                <div className="step-number">1</div>
                <h5 style={{ fontWeight: "700" }}>Catalog Items</h5>
                <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                  Add products via voice command, receipt photo, barcode scan, or quick form.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="step-card">
                <div className="step-number">2</div>
                <h5 style={{ fontWeight: "700" }}>Track Storage</h5>
                <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                  Categorize items across Fridge, Pantry, and Freezer storage locations.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="step-card">
                <div className="step-number">3</div>
                <h5 style={{ fontWeight: "700" }}>Receive Alerts</h5>
                <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                  Get traffic-signal alerts (Safe, Near Expiry, Expired) before items spoil.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="step-card">
                <div className="step-number">4</div>
                <h5 style={{ fontWeight: "700" }}>Cook with AI</h5>
                <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                  Get instant recipe suggestions for ingredients nearing their expiration date.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <div className="container">
        <div className="cta-banner">
          <h2 style={{ fontSize: "2.3rem", fontWeight: "800", color: "#ffffff", marginBottom: 15 }}>
            Start Managing Your Kitchen Smarter Today
          </h2>
          <p style={{ fontSize: "1.1rem", opacity: 0.9, maxWidth: "600px", margin: "0 auto 30px" }}>
            Join users saving money, cutting groceries wastage, and eating fresher every day.
          </p>
          <Link to="/signup" className="btn btn-light btn-lg px-5 py-3 fw-bold" style={{ color: "#047857", borderRadius: "10px" }}>
            Create Your Free Account →
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
