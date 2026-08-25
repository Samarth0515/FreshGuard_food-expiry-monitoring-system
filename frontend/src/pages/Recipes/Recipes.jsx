import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { recipeService } from "../../services/productService";
import { productService } from "../../services/productService";
import { getExpiryStatus } from "../../utils/expiryUtils";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Recipes.css";

export default function Recipes() {
  const routerLocation = useLocation();
  const { isShopkeeper } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [ingredients, setIngredients] = useState("");
  const [nearExpiryItems, setNearExpiryItems] = useState([]);
  const [searched, setSearched] = useState(false);

  // Initial load: check location state or inventory near-expiry items
  useEffect(() => {
    if (isShopkeeper) return; // Shopkeepers manage pantry inventory, not recipes

    let prefilledIngredient = routerLocation.state?.ingredient;

    if (prefilledIngredient) {
      setIngredients(prefilledIngredient);
      fetchSuggestions([prefilledIngredient]);
    } else {
      // Find near-expiry items from inventory
      productService
        .getAll()
        .then((products) => {
          if (Array.isArray(products)) {
            const soon = products.filter((p) => {
              const exp = p.expiryDate || p.expDate;
              const status = getExpiryStatus(exp);
              return status === "yellow" || status === "red" || p.expiryStatus === "NEAR_EXPIRY";
            });
            setNearExpiryItems(soon);

            if (soon.length > 0) {
              const autoIngredients = soon
                .map((p) => p.name.split(/[\(\[\,]/)[0].trim().toLowerCase())
                .filter(Boolean);
              const uniqueList = [...new Set(autoIngredients)];
              setIngredients(uniqueList.slice(0, 3).join(", "));
              fetchSuggestions(uniqueList.slice(0, 3));
            } else {
              fetchSuggestions([]);
            }
          }
        })
        .catch(() => {
          fetchSuggestions([]);
        });
    }
  }, [routerLocation.state, isShopkeeper]);

  const fetchSuggestions = async (ingredientList) => {
    setLoadingRecipes(true);
    setSearched(true);
    try {
      const results = await recipeService.suggest(ingredientList);
      setRecipes(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setRecipes([]);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const handleFind = (e) => {
    e.preventDefault();
    const list = ingredients
      .toLowerCase()
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
    fetchSuggestions(list);
  };

  const handleQuickAddIngredient = (name) => {
    const clean = name.split(/[\(\[\,]/)[0].trim().toLowerCase();
    const currentList = ingredients
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
    if (!currentList.includes(clean)) {
      const updated = [...currentList, clean].join(", ");
      setIngredients(updated);
      fetchSuggestions([...currentList, clean]);
    }
  };

  // If user is a shopkeeper, display a clean guidance notice
  if (isShopkeeper) {
    return (
      <div className="recipes-page" style={{ textAlign: "center", padding: "60px 20px" }}>
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            border: "1px solid #e2e8f0",
          }}
        >
          <span style={{ fontSize: "3rem", display: "block", marginBottom: 15 }}>🏪</span>
          <h2>Shopkeeper Account Notice</h2>
          <p style={{ color: "#64748b", lineHeight: "1.6", margin: "15px 0 25px" }}>
            The <strong>Recipe Suggestions</strong> feature is designed for Home Users to help use up leftover household food items.
            As a <strong>Shopkeeper</strong>, your account is configured for commercial pantry and store inventory tracking.
          </p>
          <Link to="/inventory" className="btn btn-success btn-lg">
            Go to Store Inventory →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="recipes-page">
      <h1>Smart Recipe Suggestions</h1>
      <p className="lead">
        Turn your near-expiry ingredients into delicious meals and reduce food waste.
      </p>

      {/* Near-Expiry Quick Suggestions Bar */}
      {nearExpiryItems.length > 0 && (
        <div
          style={{
            backgroundColor: "#fef3c7",
            border: "1px solid #fde68a",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "20px",
            fontSize: "0.9rem",
          }}
        >
          <strong style={{ color: "#92400e" }}>Items Expiring Soon in Your Kitchen:</strong>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
            {nearExpiryItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleQuickAddIngredient(item.name)}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #d97706",
                  color: "#b45309",
                  borderRadius: "16px",
                  padding: "3px 10px",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                title="Click to search recipes with this ingredient"
              >
                + {item.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Form */}
      <form onSubmit={handleFind} style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
        <input
          type="text"
          placeholder="Enter ingredients (e.g. tomatoes, chicken breast, onions)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          style={{ flex: 1, margin: 0 }}
        />
        <button
          type="submit"
          className="btn btn-success"
          disabled={loadingRecipes}
          style={{ minWidth: "130px", fontWeight: "600" }}
        >
          {loadingRecipes ? "Finding..." : "Find Recipes"}
        </button>
      </form>

      <h3>Suggested Recipes ({recipes.length})</h3>

      {loadingRecipes ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
          <div className="spinner-border text-success" role="status" style={{ marginBottom: 10 }} />
          <p>Looking up delicious recipe ideas...</p>
        </div>
      ) : recipes.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "#f8fafc",
            borderRadius: "10px",
            color: "#64748b",
          }}
        >
          <p>No recipes found matching all specified ingredients.</p>
          <button
            onClick={() => {
              setIngredients("");
              fetchSuggestions([]);
            }}
            className="btn btn-outline-success"
            style={{ marginTop: 8 }}
          >
            Show All Recipes
          </button>
        </div>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <div className="recipe-card" key={recipe.id || recipe.title}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 8,
                }}
              >
                <h3 style={{ margin: 0 }}>{recipe.title}</h3>
                {recipe.difficulty && (
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      backgroundColor:
                        recipe.difficulty === "Easy"
                          ? "#dcfce7"
                          : recipe.difficulty === "Medium"
                          ? "#fef3c7"
                          : "#fee2e2",
                      color:
                        recipe.difficulty === "Easy"
                          ? "#166534"
                          : recipe.difficulty === "Medium"
                          ? "#92400e"
                          : "#991b1b",
                    }}
                  >
                    {recipe.difficulty}
                  </span>
                )}
              </div>

              <p style={{ color: "#475569", fontSize: "0.9rem", marginBottom: 12 }}>
                {recipe.description || recipe.desc}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  fontSize: "0.8rem",
                  color: "#64748b",
                  marginBottom: 12,
                }}
              >
                {recipe.cookTime && <span>⏱️ {recipe.cookTime}</span>}
                {recipe.servings && <span>🍽️ {recipe.servings}</span>}
              </div>

              {/* Ingredients Tags */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: 15 }}>
                {(recipe.ingredients || recipe.tags || []).map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: "#f1f5f9",
                      color: "#334155",
                      fontSize: "0.75rem",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Steps Instructions Accordion */}
              {Array.isArray(recipe.steps) && recipe.steps.length > 0 && (
                <details style={{ marginTop: "10px", fontSize: "0.85rem", color: "#334155" }}>
                  <summary style={{ cursor: "pointer", fontWeight: "600", color: "#16a34a" }}>
                    View Step-by-Step Instructions ({recipe.steps.length} steps)
                  </summary>
                  <ol style={{ paddingLeft: "18px", marginTop: "8px", lineHeight: "1.4" }}>
                    {recipe.steps.map((step, sIdx) => (
                      <li key={sIdx} style={{ marginBottom: "6px" }}>
                        {step}
                      </li>
                    ))}
                  </ol>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
