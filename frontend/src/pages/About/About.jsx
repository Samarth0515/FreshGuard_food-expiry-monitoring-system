import React from "react";
import "./About.css";

export default function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-header">
          <h1>FreshGuard: Smart Food Expiry Tracker System</h1>
          <p className="sub">
            B.Tech Computer Science and Engineering Project Report (2024–2025)
          </p>
        </div>

        <div className="about-card">
          <h2>Project Overview</h2>
          <p style={{ lineHeight: "1.6", color: "#334155" }}>
            The <strong>Smart Food Expiry Tracking System (FreshGuard)</strong> is an
            innovative, full-stack digital solution designed to combat household and commercial food waste.
            Featuring multi-modal input methods (Manual, Barcode Scan, Receipt OCR, and Voice Recognition),
            automated daily expiry status monitoring (Traffic Signal indicators: Fresh, Near-Expiry, Expired),
            timely notification alerts, and an intelligent near-expiry recipe suggestion engine.
          </p>
        </div>

        <div className="about-card">
          <h2>Project Team Members</h2>
          <div className="team-grid">
            <div className="team-member-card">
              <strong>Samarth Rahul Navale</strong>
              <span>PRN: 23UCS091</span>
            </div>
            <div className="team-member-card">
              <strong>Paras Shantisagar Patil</strong>
              <span>PRN: 23UCS096</span>
            </div>
            <div className="team-member-card">
              <strong>Pramila Siddhappa Patil</strong>
              <span>PRN: 23UCS097</span>
            </div>
            <div className="team-member-card">
              <strong>Isha Rajendra Marathe</strong>
              <span>PRN: 23UCS080</span>
            </div>
          </div>
        </div>

        <div className="about-card">
          <h2>Project Guides</h2>
          <div className="guides-list">
            <div className="guide-pill">
              <strong>Prof. K. S. Kadam</strong>
              <span>Project Guide & Assistant Professor</span>
            </div>
            <div className="guide-pill">
              <strong>Prof. (Dr.) V. V. Kheradkar</strong>
              <span>Project Guide & Professor</span>
            </div>
          </div>
        </div>

        <div className="about-card">
          <h2>Academic Affiliation & Institute</h2>
          <div style={{ lineHeight: "1.6", color: "#334155" }}>
            <p style={{ margin: "4px 0" }}>
              <strong>Department:</strong> Department of Computer Science & Engineering
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Institute:</strong> DKTE Society's Textile and Engineering Institute, Ichalkaranji
              <span style={{ color: "#64748b" }}> (An Empowered Autonomous Institute)</span>
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>University:</strong> Shivaji University, Kolhapur
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Academic Year:</strong> 2024–2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
