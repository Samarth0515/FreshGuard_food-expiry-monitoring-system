import React, { useState } from "react";
import Modal from "../common/Modal.jsx";
import { createProduct } from "../../services/productService";
import { useToast } from "../../context/ToastContext.jsx";
import "./BillScanModal.css";

const TESSERACT_CDN = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.esm.min.js";

const CATEGORIES = ["Dairy", "Produce", "Bakery", "Beverages", "Snacks", "Meat", "Pantry", "Other"];
const LOCATIONS = ["FRIDGE", "PANTRY", "FREEZER"];

export default function BillScanModal({ onClose, onItemsAdded }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | processing | reviewing | saving
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [extractedItems, setExtractedItems] = useState([]);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      processOCR(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const processOCR = async (image) => {
    setStatus("processing");
    setProgress(10);
    setProgressText("Loading OCR Engine (Tesseract.js)...");

    try {
      // Dynamic ESM import of Tesseract.js
      const TesseractModule = await import(/* @vite-ignore */ TESSERACT_CDN);
      const { createWorker } = TesseractModule.default || TesseractModule;

      const worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            const pct = Math.round((m.progress || 0) * 100);
            setProgress(pct);
            setProgressText(`Scanning text: ${pct}%`);
          } else {
            setProgressText(m.status || "Initializing...");
          }
        },
      });

      const ret = await worker.recognize(image);
      await worker.terminate();

      const text = ret.data.text || "";
      const parsedItems = parseReceiptLines(text);

      if (parsedItems.length === 0) {
        // Fallback default candidate item from text
        parsedItems.push({
          name: "Grocery Item",
          category: "Pantry",
          location: "PANTRY",
          expiryDate: getDefaultExpiryDate(7),
          quantity: 1,
        });
      }

      setExtractedItems(parsedItems);
      setStatus("reviewing");
    } catch (err) {
      console.warn("Tesseract OCR load/execution error:", err);
      // Fallback manual review mode
      setError("OCR parsing encountered an issue. You can manually enter receipt items below.");
      setExtractedItems([
        {
          name: "Fresh Milk",
          category: "Dairy",
          location: "FRIDGE",
          expiryDate: getDefaultExpiryDate(5),
          quantity: 1,
        },
        {
          name: "Whole Wheat Bread",
          category: "Bakery",
          location: "PANTRY",
          expiryDate: getDefaultExpiryDate(6),
          quantity: 1,
        },
      ]);
      setStatus("reviewing");
    }
  };

  const parseReceiptLines = (rawText) => {
    const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);
    const results = [];
    const dateRegex = /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/;

    for (const line of lines) {
      // Ignore very short noise lines
      if (line.length < 3 || /total|tax|subtotal|change|cash|card|thank|invoice|receipt/i.test(line)) {
        continue;
      }

      const dateMatch = line.match(dateRegex);
      let expiryDate = getDefaultExpiryDate(7);
      let name = line;

      if (dateMatch) {
        try {
          const parts = dateMatch[0].split(/[\/\-\.]/);
          let day, month, year;
          if (parts[2].length === 4) {
            day = parseInt(parts[0], 10);
            month = parseInt(parts[1], 10);
            year = parseInt(parts[2], 10);
          } else {
            day = parseInt(parts[0], 10);
            month = parseInt(parts[1], 10);
            year = 2000 + parseInt(parts[2], 10);
          }
          if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            expiryDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          }
        } catch {
          // keep default
        }
        name = line.replace(dateMatch[0], "").trim();
      }

      // Clean item name from price numbers at end
      name = name.replace(/\$?\s*\d+(\.\d{2})?\s*$/, "").replace(/[^a-zA-Z0-9\s]/g, "").trim();

      if (name.length >= 2) {
        // Auto categorize
        let category = "Pantry";
        let location = "PANTRY";
        const lower = name.toLowerCase();
        if (/milk|cheese|butter|paneer|yogurt|curd|dahi|cream/i.test(lower)) {
          category = "Dairy";
          location = "FRIDGE";
        } else if (/apple|banana|tomato|potato|onion|spinach|carrot|vegetable|fruit/i.test(lower)) {
          category = "Produce";
          location = "FRIDGE";
        } else if (/bread|cake|cookie|biscuit|bun|toast/i.test(lower)) {
          category = "Bakery";
          location = "PANTRY";
        } else if (/coke|pepsi|juice|water|tea|coffee|soda/i.test(lower)) {
          category = "Beverages";
          location = "FRIDGE";
        }

        results.push({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          category,
          location,
          expiryDate,
          quantity: 1,
        });
      }
    }

    return results;
  };

  const getDefaultExpiryDate = (daysAhead) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split("T")[0];
  };

  const handleItemChange = (index, field, value) => {
    setExtractedItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveItem = (index) => {
    setExtractedItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddItem = () => {
    setExtractedItems((prev) => [
      ...prev,
      {
        name: "",
        category: "Pantry",
        location: "PANTRY",
        expiryDate: getDefaultExpiryDate(7),
        quantity: 1,
      },
    ]);
  };

  const handleSaveAll = async () => {
    const validItems = extractedItems.filter((i) => i.name && i.name.trim().length > 0);
    if (validItems.length === 0) {
      setError("Please include at least one valid product name.");
      return;
    }

    setStatus("saving");
    setError("");
    const createdList = [];

    try {
      for (const item of validItems) {
        const payload = {
          name: item.name.trim(),
          category: item.category,
          location: item.location,
          quantity: item.quantity || 1,
          quantityUnit: "pcs",
          expiryDate: item.expiryDate,
          inputMethod: "BILL_SCAN",
        };
        const created = await createProduct(payload);
        createdList.push(created);
      }

      showToast(`Successfully added ${createdList.length} items from receipt!`, "success");
      if (onItemsAdded) onItemsAdded(createdList);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save some products. Please try again.");
      setStatus("reviewing");
    }
  };

  return (
    <Modal title="Scan Grocery Bill / Receipt" onClose={onClose}>
      <div className="bill-scan-modal">
        {error && <p style={{ color: "#ef4444", fontSize: "0.85rem", margin: "0 0 10px" }}>{error}</p>}

        {status === "idle" && (
          <div>
            <label className="bill-upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              <span className="bill-upload-icon">🧾</span>
              <strong>Click to upload grocery receipt</strong>
              <p style={{ margin: "5px 0 0", color: "#64748b", fontSize: "0.85rem" }}>
                Supports JPG, PNG images. OCR extracts product names and expiry dates.
              </p>
            </label>
          </div>
        )}

        {status === "processing" && (
          <div className="bill-progress-container">
            {imageSrc && <img src={imageSrc} alt="Bill Preview" className="bill-preview-img" />}
            <div className="bill-progress-bar">
              <div className="bill-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="bill-progress-text">{progressText}</div>
          </div>
        )}

        {(status === "reviewing" || status === "saving") && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <strong style={{ fontSize: "0.95rem" }}>Review Extracted Items ({extractedItems.length})</strong>
              <button
                type="button"
                onClick={handleAddItem}
                style={{
                  background: "#e2e8f0",
                  border: "none",
                  borderRadius: 4,
                  padding: "3px 8px",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                + Add Item
              </button>
            </div>

            <div className="bill-items-list">
              {extractedItems.map((item, idx) => (
                <div className="bill-item-row" key={idx}>
                  <input
                    type="text"
                    placeholder="Product name"
                    value={item.name}
                    onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                  />
                  <select
                    value={item.category}
                    onChange={(e) => handleItemChange(idx, "category", e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <select
                    value={item.location}
                    onChange={(e) => handleItemChange(idx, "location", e.target.value)}
                  >
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={item.expiryDate}
                    onChange={(e) => handleItemChange(idx, "expiryDate", e.target.value)}
                  />
                  <button
                    type="button"
                    className="bill-remove-item"
                    onClick={() => handleRemoveItem(idx)}
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="modal-actions" style={{ marginTop: 15 }}>
              <button
                className="primary"
                onClick={handleSaveAll}
                disabled={status === "saving"}
              >
                {status === "saving" ? "Saving..." : `Add All to Inventory`}
              </button>
              <button className="secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
