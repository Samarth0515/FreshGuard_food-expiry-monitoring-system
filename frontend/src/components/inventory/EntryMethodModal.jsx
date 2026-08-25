import React from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../common/Modal.jsx";

export default function EntryMethodModal({ onClose, onManualEntry, onBillScan }) {
  const navigate = useNavigate();

  return (
    <Modal title="Select Entry Method" onClose={onClose}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "10px",
        }}
      >
        <button
          className="primary"
          style={{ padding: "12px", fontSize: "1rem" }}
          onClick={onManualEntry}
        >
          ✍️ Manual Entry (with Voice 🎙️)
        </button>

        <button
          className="danger"
          style={{
            padding: "12px",
            fontSize: "1rem",
            backgroundColor: "#2563eb",
          }}
          onClick={() => {
            onClose();
            navigate("/scanner");
          }}
        >
          📷 Barcode Scanner
        </button>

        <button
          style={{
            padding: "12px",
            fontSize: "1rem",
            backgroundColor: "#059669",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
          onClick={() => {
            onClose();
            if (onBillScan) onBillScan();
          }}
        >
          🧾 Scan a Bill / Receipt (OCR)
        </button>
      </div>
    </Modal>
  );
}
