import React, { useState } from "react";
import Modal from "../common/Modal.jsx";

const STORAGE_OPTIONS = [
  { label: "Fridge", value: "FRIDGE" },
  { label: "Pantry", value: "PANTRY" },
  { label: "Freezer", value: "FREEZER" },
];

const initialState = {
  name: "",
  category: "",
  location: "FRIDGE",
  quantity: 1,
  quantityUnit: "pcs",
  mfgDate: "",
  expDate: "",
  notes: "",
  inputMethod: "MANUAL",
};

export default function AddProductModal({ onClose, onAdd }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice("Voice input is not supported in this browser.");
      setTimeout(() => setVoiceNotice(""), 3000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setListening(true);
      setVoiceNotice("Listening... Speak product name and expiry (e.g., 'Milk expires next week')");

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setListening(false);
        setVoiceNotice(`Heard: "${transcript}"`);
        setTimeout(() => setVoiceNotice(""), 3500);

        parseVoiceTranscript(transcript);
      };

      recognition.onerror = (event) => {
        setListening(false);
        setVoiceNotice(`Voice error: ${event.error}`);
        setTimeout(() => setVoiceNotice(""), 3000);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognition.start();
    } catch (err) {
      setListening(false);
      setVoiceNotice("Could not start voice recognition.");
    }
  };

  const parseVoiceTranscript = (text) => {
    let name = text.trim();
    let expDate = "";
    const lower = text.toLowerCase();

    // Look for "expires on ...", "expires ...", "expiry ..."
    const expMatch = lower.match(/(?:expires?|expiry|expiring|best before)\s+(?:on\s+)?(.+)/i);
    if (expMatch) {
      const datePhrase = expMatch[1].trim();
      name = text.slice(0, expMatch.index).trim();
      expDate = parseDatePhrase(datePhrase);
    }

    // Default expiry if none parsed
    if (!expDate) {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      expDate = d.toISOString().split("T")[0];
    }

    setForm((prev) => ({
      ...prev,
      name: name || prev.name,
      expDate: expDate || prev.expDate,
      inputMethod: "VOICE",
    }));
  };

  const parseDatePhrase = (phrase) => {
    const months = {
      january: 0, jan: 0,
      february: 1, feb: 1,
      march: 2, mar: 2,
      april: 3, apr: 3,
      may: 4,
      june: 5, jun: 5,
      july: 6, jul: 6,
      august: 7, aug: 7,
      september: 8, sep: 8, sept: 8,
      october: 9, oct: 9,
      november: 10, nov: 10,
      december: 11, dec: 11,
    };

    const today = new Date();

    if (phrase.includes("tomorrow")) {
      const d = new Date(today);
      d.setDate(d.getDate() + 1);
      return d.toISOString().split("T")[0];
    }
    if (phrase.includes("next week")) {
      const d = new Date(today);
      d.setDate(d.getDate() + 7);
      return d.toISOString().split("T")[0];
    }
    if (phrase.includes("next month")) {
      const d = new Date(today);
      d.setMonth(d.getMonth() + 1);
      return d.toISOString().split("T")[0];
    }

    // Match "15th august", "august 15", "15 august 2025"
    const words = phrase.toLowerCase().replace(/(st|nd|rd|th)/g, "").split(/\s+/);
    for (const [mName, mIdx] of Object.entries(months)) {
      const foundIdx = words.indexOf(mName);
      if (foundIdx !== -1) {
        let day = 1;
        let year = today.getFullYear();
        if (foundIdx > 0 && !isNaN(parseInt(words[foundIdx - 1], 10))) {
          day = parseInt(words[foundIdx - 1], 10);
        } else if (foundIdx + 1 < words.length && !isNaN(parseInt(words[foundIdx + 1], 10))) {
          day = parseInt(words[foundIdx + 1], 10);
        }
        const targetDate = new Date(year, mIdx, day);
        if (targetDate < today) targetDate.setFullYear(year + 1);
        return targetDate.toISOString().split("T")[0];
      }
    }

    return "";
  };

  const handleSubmit = () => {
    const { name, location, expDate } = form;
    if (!name || !location || !expDate) {
      setError("Please fill all required fields (Name, Location, Expiry Date)!");
      return;
    }
    onAdd({
      ...form,
      expiryDate: form.expDate,
    });
  };

  return (
    <Modal title="Add New Product" onClose={onClose}>
      {error && <p style={{ color: "#ef4444", margin: "0 0 10px" }}>{error}</p>}

      {voiceNotice && (
        <p
          style={{
            backgroundColor: listening ? "#fef3c7" : "#f0fdf4",
            color: listening ? "#92400e" : "#166534",
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: "0.85rem",
            margin: "0 0 10px",
          }}
        >
          {voiceNotice}
        </p>
      )}

      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px" }}>
        <input
          type="text"
          name="name"
          placeholder="Product Name (e.g. Greek Yogurt)"
          value={form.name}
          onChange={handleChange}
          required
          style={{ flex: 1, margin: 0 }}
        />
        <button
          type="button"
          onClick={handleVoiceInput}
          title="Voice input: Speak product name and date"
          style={{
            backgroundColor: listening ? "#ef4444" : "#f1f5f9",
            color: listening ? "white" : "#1e293b",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            padding: "10px 14px",
            cursor: "pointer",
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
        >
          🎙️
        </button>
      </div>

      <input
        type="text"
        name="category"
        placeholder="Category (e.g. Dairy, Snacks, Produce)"
        value={form.category}
        onChange={handleChange}
      />

      <select name="location" value={form.location} onChange={handleChange}>
        {STORAGE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="number"
          name="quantity"
          placeholder="Qty"
          min="1"
          step="0.1"
          value={form.quantity}
          onChange={handleChange}
          style={{ width: "40%" }}
        />
        <input
          type="text"
          name="quantityUnit"
          placeholder="Unit (pcs, kg, L)"
          value={form.quantityUnit}
          onChange={handleChange}
          style={{ width: "60%" }}
        />
      </div>

      <label style={{ fontSize: "0.85rem", color: "#64748b", display: "block", marginBottom: 2 }}>
        Manufacturing Date (Optional):
      </label>
      <input
        type="date"
        name="mfgDate"
        value={form.mfgDate}
        onChange={handleChange}
      />

      <label style={{ fontSize: "0.85rem", color: "#64748b", display: "block", marginBottom: 2 }}>
        Expiry Date (Required):
      </label>
      <input
        type="date"
        name="expDate"
        value={form.expDate}
        onChange={handleChange}
        required
      />

      <div className="modal-actions">
        <button className="primary" onClick={handleSubmit}>
          Add Product
        </button>
        <button className="secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
}
