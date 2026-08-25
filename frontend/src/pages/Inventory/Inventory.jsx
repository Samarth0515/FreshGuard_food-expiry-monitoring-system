import React, { useEffect, useMemo, useState } from "react";
import ProductTable from "../../components/inventory/ProductTable.jsx";
import DashboardSummary from "../../components/inventory/DashboardSummary.jsx";
import EntryMethodModal from "../../components/inventory/EntryMethodModal.jsx";
import AddProductModal from "../../components/inventory/AddProductModal.jsx";
import BillScanModal from "../../components/inventory/BillScanModal.jsx";
import productService from "../../services/productService";
import { sortByExpiry, getExpiryStatus } from "../../utils/expiryUtils";
import { useToast } from "../../context/ToastContext.jsx";
import "./Inventory.css";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [apiError, setApiError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | FRESH | NEAR_EXPIRY | EXPIRED
  const [storageFilter, setStorageFilter] = useState("ALL"); // ALL | FRIDGE | PANTRY | FREEZER
  const [expiringTodayOnly, setExpiringTodayOnly] = useState(false);

  const [summary, setSummary] = useState({
    total: 0,
    fresh: 0,
    nearExpiry: 0,
    expired: 0,
    expiringToday: 0,
    categories: 0,
    byStorage: { FRIDGE: 0, PANTRY: 0, FREEZER: 0 },
  });

  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBillScanModal, setShowBillScanModal] = useState(false);
  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoadingProducts(true);
      setApiError("");
      const [productList, summaryData] = await Promise.all([
        productService.getAll(),
        productService.getDashboardSummary(),
      ]);
      setProducts(Array.isArray(productList) ? productList : []);
      if (summaryData) setSummary(summaryData);
    } catch (err) {
      setApiError("Could not load your inventory. Please check backend connection.");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update summary when products list changes
  useEffect(() => {
    productService
      .getDashboardSummary()
      .then((res) => {
        if (res) setSummary(res);
      })
      .catch(() => null);
  }, [products]);

  const handleAddProduct = async (formData) => {
    try {
      const created = await productService.create(formData);
      setProducts((prev) => [...prev, created]);
      setShowAddModal(false);
      showToast(`"${created.name}" added to inventory`, "success");
    } catch (err) {
      showToast(err.message || "Failed to add product", "error");
    }
  };

  const handleRemove = async (id) => {
    try {
      await productService.remove(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast("Product removed", "info");
    } catch (err) {
      showToast(err.message || "Failed to remove product", "error");
    }
  };

  const handleBillItemsAdded = (newItems) => {
    if (Array.isArray(newItems) && newItems.length > 0) {
      setProducts((prev) => [...prev, ...newItems]);
    }
  };

  // Filtered products calculation
  const visibleProducts = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];

    let filtered = products.filter((p) => {
      const nameMatch = (p.name || "").toLowerCase().includes(search.toLowerCase());
      const catMatch = (p.category || "").toLowerCase().includes(search.toLowerCase());
      return nameMatch || catMatch;
    });

    if (expiringTodayOnly) {
      filtered = filtered.filter((p) => {
        const exp = p.expiryDate || p.expDate;
        return exp === todayStr;
      });
    } else {
      if (statusFilter !== "ALL") {
        filtered = filtered.filter((p) => {
          const exp = p.expiryDate || p.expDate;
          const currentStatus = p.expiryStatus || (getExpiryStatus(exp) === "red" ? "EXPIRED" : getExpiryStatus(exp) === "yellow" ? "NEAR_EXPIRY" : "FRESH");
          return currentStatus === statusFilter;
        });
      }

      if (storageFilter !== "ALL") {
        filtered = filtered.filter((p) => (p.location || "").toUpperCase() === storageFilter);
      }
    }

    return sortByExpiry(filtered);
  }, [products, search, statusFilter, storageFilter, expiringTodayOnly]);

  const clearAllFilters = () => {
    setStatusFilter("ALL");
    setStorageFilter("ALL");
    setExpiringTodayOnly(false);
    setSearch("");
  };

  return (
    <div className="inventory-page">
      <div className="inventory-container">
        <header>
          <h1>Inventory Management</h1>
          <div className="actions">
            <input
              type="text"
              placeholder="Search product or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="filter-btn" onClick={clearAllFilters}>
              {statusFilter !== "ALL" || storageFilter !== "ALL" || expiringTodayOnly
                ? "Reset Filters ✕"
                : "All Items"}
            </button>
            <button className="new-btn" onClick={() => setShowEntryModal(true)}>
              + Add Product
            </button>
          </div>
        </header>

        {/* Row 1: Summary Metric Cards */}
        <DashboardSummary
          summary={summary}
          activeFilter={expiringTodayOnly ? "TODAY" : statusFilter}
          onFilterChange={(filter) => {
            setExpiringTodayOnly(false);
            setStatusFilter(filter);
          }}
        />

        {/* Row 2: Expiring Today Alert Banner & Storage Breakdown */}
        <div style={{ margin: "18px 0", display: "flex", flexDirection: "column", gap: "12px" }}>
          {summary.expiringToday > 0 && (
            <div
              onClick={() => {
                setExpiringTodayOnly(!expiringTodayOnly);
                setStatusFilter("ALL");
                setStorageFilter("ALL");
              }}
              style={{
                backgroundColor: expiringTodayOnly ? "#f59e0b" : "#fef3c7",
                color: expiringTodayOnly ? "#ffffff" : "#92400e",
                border: "1px solid #fcd34d",
                borderRadius: "8px",
                padding: "12px 18px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
              }}
              title="Click to toggle viewing items expiring today"
            >
              <span>
                ⚠️ {summary.expiringToday} item(s) expire TODAY. Use them now or prepare recipes!
              </span>
              <span style={{ fontSize: "0.85rem", textDecoration: "underline" }}>
                {expiringTodayOnly ? "Showing today's items (Click to show all)" : "View items →"}
              </span>
            </div>
          )}

          {/* Storage Breakdown Filter Pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#475569" }}>
              Storage Breakdown:
            </span>
            {[
              { key: "FRIDGE", label: "🧊 Fridge", count: summary.byStorage?.FRIDGE ?? 0, bg: "#e0f2fe", text: "#0369a1" },
              { key: "PANTRY", label: "🥫 Pantry", count: summary.byStorage?.PANTRY ?? 0, bg: "#fef3c7", text: "#92400e" },
              { key: "FREEZER", label: "❄️ Freezer", count: summary.byStorage?.FREEZER ?? 0, bg: "#ede9fe", text: "#6d28d9" },
            ].map((st) => (
              <button
                key={st.key}
                onClick={() => {
                  setExpiringTodayOnly(false);
                  setStorageFilter(storageFilter === st.key ? "ALL" : st.key);
                }}
                style={{
                  backgroundColor: storageFilter === st.key ? st.text : st.bg,
                  color: storageFilter === st.key ? "#ffffff" : st.text,
                  border: `1px solid ${st.text}40`,
                  borderRadius: "20px",
                  padding: "6px 14px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>{st.label}:</span>
                <strong style={{ opacity: 0.9 }}>{st.count}</strong>
              </button>
            ))}
          </div>
        </div>

        {/* Loading / Error / Table view */}
        {loadingProducts ? (
          <div style={{ textAlign: "center", padding: "50px", color: "#64748b" }}>
            <div className="spinner-border text-success" role="status" style={{ marginBottom: 12 }} />
            <p>Loading your fresh inventory...</p>
          </div>
        ) : apiError ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              backgroundColor: "#fef2f2",
              borderRadius: "10px",
              color: "#991b1b",
              margin: "20px 0",
            }}
          >
            <p style={{ fontWeight: "600" }}>{apiError}</p>
            <button
              onClick={loadData}
              className="btn btn-outline-success"
              style={{ marginTop: "10px" }}
            >
              Retry
            </button>
          </div>
        ) : (
          <ProductTable products={visibleProducts} onRemove={handleRemove} />
        )}
      </div>

      {/* Entry Modal Picker */}
      {showEntryModal && (
        <EntryMethodModal
          onClose={() => setShowEntryModal(false)}
          onManualEntry={() => {
            setShowEntryModal(false);
            setShowAddModal(true);
          }}
          onBillScan={() => {
            setShowEntryModal(false);
            setShowBillScanModal(true);
          }}
        />
      )}

      {/* Manual & Voice Add Modal */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddProduct}
        />
      )}

      {/* Bill OCR Modal */}
      {showBillScanModal && (
        <BillScanModal
          onClose={() => setShowBillScanModal(false)}
          onItemsAdded={handleBillItemsAdded}
        />
      )}
    </div>
  );
}
