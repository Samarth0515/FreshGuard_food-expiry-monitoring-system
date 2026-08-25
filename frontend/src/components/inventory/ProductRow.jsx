import React from "react";
import { useNavigate } from "react-router-dom";
import SignalBadge from "../common/SignalBadge.jsx";
import { formatDate, getExpiryStatus } from "../../utils/expiryUtils";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ProductRow({ product, onRemove }) {
  const navigate = useNavigate();
  const { isShopkeeper } = useAuth();
  const expDate = product.expiryDate || product.expDate;
  const status = product.expiryStatus || (getExpiryStatus(expDate) === "red" ? "EXPIRED" : getExpiryStatus(expDate) === "yellow" ? "NEAR_EXPIRY" : "FRESH");
  const isNearExpiry = status === "NEAR_EXPIRY" || getExpiryStatus(expDate) === "yellow";

  const handleSuggestRecipes = () => {
    const cleanName = (product.name || "").split(/[\(\[\,]/)[0].trim().toLowerCase();
    navigate("/recipes", { state: { ingredient: cleanName } });
  };

  return (
    <tr>
      <td>
        <SignalBadge expDate={expDate} />
      </td>
      <td>
        <strong>{product.name}</strong>
        {product.quantity && product.quantityUnit && (
          <span style={{ fontSize: "0.8rem", color: "#64748b", marginLeft: "6px" }}>
            ({product.quantity} {product.quantityUnit})
          </span>
        )}
      </td>
      <td>{product.category || "-"}</td>
      <td>
        <span
          style={{
            padding: "3px 8px",
            borderRadius: "4px",
            fontSize: "0.8rem",
            fontWeight: "600",
            backgroundColor:
              product.location === "FRIDGE"
                ? "#e0f2fe"
                : product.location === "FREEZER"
                ? "#ede9fe"
                : "#fef3c7",
            color:
              product.location === "FRIDGE"
                ? "#0369a1"
                : product.location === "FREEZER"
                ? "#6d28d9"
                : "#92400e",
          }}
        >
          {product.location}
        </span>
      </td>
      <td>{formatDate(product.mfgDate)}</td>
      <td>{formatDate(expDate)}</td>
      {/* Recipe ideas column only shown for Home Users */}
      {!isShopkeeper && (
        <td>
          {isNearExpiry ? (
            <button
              onClick={handleSuggestRecipes}
              style={{
                backgroundColor: "#f59e0b",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "0.75rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
              title="Find recipes using this item"
            >
              🍲 Recipe ideas
            </button>
          ) : (
            <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>-</span>
          )}
        </td>
      )}
      <td>
        <button className="remove-btn" onClick={() => onRemove(product.id)}>
          Remove
        </button>
      </td>
    </tr>
  );
}
