import React, { useRef, useState } from "react";
import { useQuagga } from "./useQuagga";
import productService from "../../services/productService";
import ProductInfoCard from "../../components/scanner/ProductInfoCard.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import "./Scanner.css";

const STORAGE_OPTIONS = [
  { label: "Fridge", value: "FRIDGE" },
  { label: "Pantry", value: "PANTRY" },
  { label: "Freezer", value: "FREEZER" },
];

export default function Scanner() {
  const viewportRef = useRef(null);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [location, setLocation] = useState("FRIDGE");
  const [mfgDate, setMfgDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const { showToast } = useToast();

  const handleDetected = (code) => {
    setBarcodeInput(code);
    lookupBarcode(code);
  };

  const { active, error: scannerError, start, stop } = useQuagga(viewportRef, handleDetected);

  const lookupBarcode = async (code) => {
    if (!code) {
      setError("Please enter a barcode");
      return;
    }
    setLoading(true);
    setError("");
    setProduct(null);

    try {
      const result = await productService.lookupByBarcode(code);
      setProduct(result);

      // Pre-calculate default expiry date if available
      const today = new Date();
      const defaultDays = result.defaultExpiryDays || 180;
      const targetExp = new Date(today);
      targetExp.setDate(today.getDate() + defaultDays);
      setExpiryDate(targetExp.toISOString().split("T")[0]);
      setMfgDate(today.toISOString().split("T")[0]);
      showToast(`Found: ${result.name}`, "success");
    } catch (err) {
      setError(err.message || "Failed to fetch product information. Please check barcode.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = () => lookupBarcode(barcodeInput.trim());

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearchClick();
  };

  const handleAddToInventory = async () => {
    if (!product) return;
    if (!expiryDate) {
      setError("Please specify an expiry date");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: product.name || product.productName,
        category: product.category || "Packaged Food",
        location: location,
        quantity: 1,
        quantityUnit: "pcs",
        mfgDate: mfgDate || null,
        expiryDate: expiryDate,
        inputMethod: "BARCODE",
        barcode: product.barcode || barcodeInput,
      };

      await productService.create(payload);
      showToast(`"${payload.name}" added to your inventory!`, "success");
      setProduct(null);
      setBarcodeInput("");
    } catch (err) {
      setError(err.message || "Failed to save product to inventory.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="scanner-page">
      <div className="scanner-container-wrapper">
        <h1>Food Barcode Scanner</h1>
        <p style={{ textAlign: "center", color: "#64748b" }}>
          Scan the barcode on any packaged grocery item or enter code manually
        </p>

        <div className="scanner-area">
          <div id="scanner-viewport" ref={viewportRef} className={active ? "active" : ""} />
          <button onClick={start} disabled={active}>
            {active ? "Scanning..." : "Start Camera Scanner"}
          </button>
          <button onClick={stop} disabled={!active}>
            Stop Scanner
          </button>
        </div>

        <div className="manual-input">
          <input
            type="text"
            placeholder="Or enter barcode number (e.g. 074901700609, 8901030000010)"
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSearchClick} disabled={loading}>
            {loading ? "Searching..." : "Search Barcode"}
          </button>
        </div>

        {(error || scannerError) && (
          <div className="error-message">{error || scannerError}</div>
        )}

        {/* Product Details & Add to Inventory Section */}
        {product && (
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "20px",
              marginTop: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 15 }}>
              <div>
                <h3 style={{ margin: 0, color: "#1e293b" }}>{product.name}</h3>
                <p style={{ margin: "4px 0 0", color: "#64748b" }}>
                  Brand: {product.brand || "N/A"} | Category: {product.category || "General"}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: "0.85rem", color: "#94a3b8" }}>
                  Barcode: <code>{product.barcode}</code>
                </p>
              </div>
            </div>

            {/* Save to Inventory Options */}
            <div
              style={{
                backgroundColor: "#f8fafc",
                padding: "15px",
                borderRadius: "8px",
                margin: "15px 0",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "12px",
              }}
            >
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#475569", display: "block", marginBottom: 4 }}>
                  Storage Location:
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                >
                  {STORAGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#475569", display: "block", marginBottom: 4 }}>
                  Manufacturing Date:
                </label>
                <input
                  type="date"
                  value={mfgDate}
                  onChange={(e) => setMfgDate(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#475569", display: "block", marginBottom: 4 }}>
                  Expiry Date:
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  required
                />
              </div>
            </div>

            <button
              onClick={handleAddToInventory}
              disabled={saving}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {saving ? "Saving to Inventory..." : "✓ Add to My Inventory"}
            </button>
          </div>
        )}

        {/* Nutritional Information Card if available */}
        {product && product.nutrition && <ProductInfoCard product={product} />}
      </div>
    </div>
  );
}
