import React from "react";

export default function DashboardSummary({ summary = {}, activeFilter, onFilterChange }) {
  const total = summary.total ?? 0;
  const fresh = summary.fresh ?? summary.green ?? 0;
  const nearExpiry = summary.nearExpiry ?? summary.yellow ?? 0;
  const expired = summary.expired ?? summary.red ?? 0;

  return (
    <div className="summary-cards">
      <div
        className={`summary-card ${activeFilter === "ALL" ? "active" : ""}`}
        onClick={() => onFilterChange && onFilterChange("ALL")}
        style={{ cursor: "pointer" }}
        title="Show all items"
      >
        <span className="summary-value">{total}</span>
        <span className="summary-label">Total Items</span>
      </div>

      <div
        className={`summary-card green ${activeFilter === "FRESH" ? "active" : ""}`}
        onClick={() => onFilterChange && onFilterChange("FRESH")}
        style={{ cursor: "pointer" }}
        title="Filter by Fresh items"
      >
        <span className="summary-value">{fresh}</span>
        <span className="summary-label">Safe / Fresh</span>
      </div>

      <div
        className={`summary-card yellow ${activeFilter === "NEAR_EXPIRY" ? "active" : ""}`}
        onClick={() => onFilterChange && onFilterChange("NEAR_EXPIRY")}
        style={{ cursor: "pointer" }}
        title="Filter by Nearing Expiry (0-7 days)"
      >
        <span className="summary-value">{nearExpiry}</span>
        <span className="summary-label">Nearing Expiry</span>
      </div>

      <div
        className={`summary-card red ${activeFilter === "EXPIRED" ? "active" : ""}`}
        onClick={() => onFilterChange && onFilterChange("EXPIRED")}
        style={{ cursor: "pointer" }}
        title="Filter by Expired items"
      >
        <span className="summary-value">{expired}</span>
        <span className="summary-label">Expired</span>
      </div>
    </div>
  );
}
