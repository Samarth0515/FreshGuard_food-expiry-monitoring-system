import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import adminService from "../../services/adminService";
import recipeService from "../../services/recipeService";
import Modal from "../../components/common/Modal.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [tab, setTab] = useState("overview"); // overview | users | recipes | barcodes
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState("");
  const [searchRecipe, setSearchRecipe] = useState("");
  const [triggeringJob, setTriggeringJob] = useState(false);

  // New Recipe Modal State
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeDesc, setRecipeDesc] = useState("");
  const [recipeCookTime, setRecipeCookTime] = useState("20 mins");
  const [recipeServings, setRecipeServings] = useState("4 servings");
  const [recipeDifficulty, setRecipeDifficulty] = useState("Easy");
  const [ingredientInput, setIngredientInput] = useState("");
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [stepInput, setStepInput] = useState("");
  const [recipeSteps, setRecipeSteps] = useState([]);
  const [savingRecipe, setSavingRecipe] = useState(false);

  // New Barcode Modal State
  const [showAddBarcodeModal, setShowAddBarcodeModal] = useState(false);
  const [barcodeNum, setBarcodeNum] = useState("");
  const [barcodeName, setBarcodeName] = useState("");
  const [barcodeBrand, setBarcodeBrand] = useState("");
  const [barcodeCategory, setBarcodeCategory] = useState("General");
  const [barcodeShelfDays, setBarcodeShelfDays] = useState(180);
  const [savingBarcode, setSavingBarcode] = useState(false);

  const { showToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [m, u, r] = await Promise.all([
        adminService.getSystemMetrics().catch(() => null),
        adminService.getAllUsers().catch(() => []),
        recipeService.suggest([]).catch(() => []),
      ]);
      if (m) setMetrics(m);
      if (Array.isArray(u)) setUsers(u);
      if (Array.isArray(r)) setRecipes(r);
    } catch (err) {
      showToast("Error loading admin data: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTriggerScheduler = async () => {
    setTriggeringJob(true);
    try {
      const res = await adminService.triggerExpiryCheck();
      showToast(res.message || "Daily expiry monitoring triggered successfully!", "success");
      // Reload metrics
      const m = await adminService.getSystemMetrics();
      setMetrics(m);
    } catch (err) {
      showToast("Failed to trigger job: " + err.message, "error");
    } finally {
      setTriggeringJob(false);
    }
  };

  const handleDeleteUser = async (userId, memberId) => {
    if (memberId === "admin") {
      showToast("Cannot delete primary admin account", "error");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete user "${memberId}" and all their inventory?`)) {
      return;
    }

    try {
      await adminService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast(`User ${memberId} deleted successfully`, "info");
      adminService.getSystemMetrics().then(setMetrics).catch(() => null);
    } catch (err) {
      showToast("Error deleting user: " + err.message, "error");
    }
  };

  const handleDeleteRecipe = async (recipeId, title) => {
    if (!window.confirm(`Delete recipe "${title}"?`)) return;
    try {
      await adminService.deleteRecipe(recipeId);
      setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
      showToast(`Recipe "${title}" deleted`, "info");
      adminService.getSystemMetrics().then(setMetrics).catch(() => null);
    } catch (err) {
      showToast("Failed to delete recipe: " + err.message, "error");
    }
  };

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (!ingredientInput.trim()) return;
    setRecipeIngredients((prev) => [...prev, ingredientInput.trim().toLowerCase()]);
    setIngredientInput("");
  };

  const handleAddStep = (e) => {
    e.preventDefault();
    if (!stepInput.trim()) return;
    setRecipeSteps((prev) => [...prev, stepInput.trim()]);
    setStepInput("");
  };

  const handleSaveRecipe = async () => {
    if (!recipeTitle.trim()) {
      showToast("Recipe title is required", "error");
      return;
    }
    if (recipeIngredients.length === 0) {
      showToast("Add at least one ingredient", "error");
      return;
    }
    if (recipeSteps.length === 0) {
      showToast("Add at least one instruction step", "error");
      return;
    }

    setSavingRecipe(true);
    try {
      const payload = {
        title: recipeTitle.trim(),
        description: recipeDesc.trim(),
        cookTime: recipeCookTime,
        servings: recipeServings,
        difficulty: recipeDifficulty,
        ingredients: recipeIngredients,
        steps: recipeSteps,
      };

      const created = await adminService.createRecipe(payload);
      setRecipes((prev) => [created, ...prev]);
      showToast(`Recipe "${created.title}" published!`, "success");
      setShowAddRecipeModal(false);

      // Reset form
      setRecipeTitle("");
      setRecipeDesc("");
      setRecipeIngredients([]);
      setRecipeSteps([]);
      adminService.getSystemMetrics().then(setMetrics).catch(() => null);
    } catch (err) {
      showToast("Failed to create recipe: " + err.message, "error");
    } finally {
      setSavingRecipe(false);
    }
  };

  const handleSaveBarcode = async () => {
    if (!barcodeNum.trim() || !barcodeName.trim()) {
      showToast("Barcode and Product Name are required", "error");
      return;
    }

    setSavingBarcode(true);
    try {
      const payload = {
        barcode: barcodeNum.trim(),
        productName: barcodeName.trim(),
        brand: barcodeBrand.trim(),
        category: barcodeCategory.trim(),
        defaultExpiryDays: parseInt(barcodeShelfDays, 10) || 180,
      };

      await adminService.createBarcode(payload);
      showToast(`Barcode ${payload.barcode} registered in catalog!`, "success");
      setShowAddBarcodeModal(false);
      setBarcodeNum("");
      setBarcodeName("");
      setBarcodeBrand("");
      adminService.getSystemMetrics().then(setMetrics).catch(() => null);
    } catch (err) {
      showToast(err.message || "Failed to register barcode", "error");
    } finally {
      setSavingBarcode(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchUser.toLowerCase();
    return (
      (u.name || "").toLowerCase().includes(q) ||
      (u.memberId || "").toLowerCase().includes(q) ||
      (u.userType || "").toLowerCase().includes(q)
    );
  });

  const filteredRecipes = recipes.filter((r) =>
    (r.title || "").toLowerCase().includes(searchRecipe.toLowerCase())
  );

  return (
    <div className="admin-dashboard-page">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1>🛡️ Administrator Control Center</h1>
            <p style={{ margin: "4px 0 0", color: "#64748b" }}>
              Global platform oversight, user management, recipe authoring & system health
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="btn btn-outline-success"
              onClick={handleTriggerScheduler}
              disabled={triggeringJob}
              style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <span>⚡</span>
              <span>{triggeringJob ? "Checking Expiry..." : "Run Expiry Scheduler Now"}</span>
            </button>
            <button className="btn btn-success" onClick={loadData}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${tab === "overview" ? "active" : ""}`}
            onClick={() => setTab("overview")}
          >
            📊 System Overview
          </button>
          <button
            className={`admin-tab-btn ${tab === "users" ? "active" : ""}`}
            onClick={() => setTab("users")}
          >
            👥 User Management ({users.length})
          </button>
          <button
            className={`admin-tab-btn ${tab === "recipes" ? "active" : ""}`}
            onClick={() => setTab("recipes")}
          >
            🍲 Recipe Hub ({recipes.length})
          </button>
          <button
            className={`admin-tab-btn ${tab === "barcodes" ? "active" : ""}`}
            onClick={() => setTab("barcodes")}
          >
            📦 Barcode Catalog
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
            <div className="spinner-border text-success" role="status" style={{ marginBottom: 12 }} />
            <p>Loading administration data...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: OVERVIEW */}
            {tab === "overview" && metrics && (
              <div>
                <div className="admin-metrics-grid">
                  <div className="metric-card">
                    <span className="metric-title">Total Registered Users</span>
                    <span className="metric-number">{metrics.totalUsers}</span>
                    <span style={{ fontSize: "0.8rem", color: "#64748b", marginTop: 4 }}>
                      {metrics.totalHomeUsers} Home • {metrics.totalShopkeepers} Shopkeepers
                    </span>
                  </div>

                  <div className="metric-card blue">
                    <span className="metric-title">Total Products in System</span>
                    <span className="metric-number">{metrics.totalProducts}</span>
                    <span style={{ fontSize: "0.8rem", color: "#64748b", marginTop: 4 }}>
                      Across all users & pantries
                    </span>
                  </div>

                  <div className="metric-card amber">
                    <span className="metric-title">Items Expiring Today / Soon</span>
                    <span className="metric-number">
                      {metrics.totalExpiringToday + metrics.totalNearExpiry}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "#64748b", marginTop: 4 }}>
                      {metrics.totalExpiringToday} today • {metrics.totalNearExpiry} near-expiry
                    </span>
                  </div>

                  <div className="metric-card green">
                    <span className="metric-title">Recipes & Barcodes Catalog</span>
                    <span className="metric-number">
                      {metrics.totalRecipes} / {metrics.totalBarcodes}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "#64748b", marginTop: 4 }}>
                      {metrics.totalRecipes} Recipes • {metrics.totalBarcodes} Barcodes
                    </span>
                  </div>
                </div>

                {/* Storage Distribution */}
                <div className="admin-card">
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: 15 }}>
                    🧊 System Storage Distribution
                  </h3>
                  <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "180px", background: "#f0f9ff", padding: 15, borderRadius: 8 }}>
                      <strong style={{ color: "#0369a1" }}>Fridge Storage</strong>
                      <div style={{ fontSize: "1.6rem", fontWeight: "800", color: "#0369a1", marginTop: 5 }}>
                        {metrics.storageDistribution?.FRIDGE ?? 0}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: "180px", background: "#fef3c7", padding: 15, borderRadius: 8 }}>
                      <strong style={{ color: "#92400e" }}>Pantry Storage</strong>
                      <div style={{ fontSize: "1.6rem", fontWeight: "800", color: "#92400e", marginTop: 5 }}>
                        {metrics.storageDistribution?.PANTRY ?? 0}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: "180px", background: "#ede9fe", padding: 15, borderRadius: 8 }}>
                      <strong style={{ color: "#6d28d9" }}>Freezer Storage</strong>
                      <div style={{ fontSize: "1.6rem", fontWeight: "800", color: "#6d28d9", marginTop: 5 }}>
                        {metrics.storageDistribution?.FREEZER ?? 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: USERS */}
            {tab === "users" && (
              <div className="admin-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                  <input
                    type="text"
                    placeholder="Search users by name, member ID, or role..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    style={{ maxWidth: "350px", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
                  />
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    Showing {filteredUsers.length} of {users.length} users
                  </span>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Member ID</th>
                        <th>Account Role</th>
                        <th>Inventory Items</th>
                        <th>Storage Units</th>
                        <th>Registered Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id}>
                          <td><strong>{u.name}</strong></td>
                          <td><code>{u.memberId}</code></td>
                          <td>
                            <span className={`badge-role ${(u.userType || "").toLowerCase()}`}>
                              {u.userType}
                            </span>
                          </td>
                          <td>{u.productCount} items</td>
                          <td>{u.storageLocationCount} locations</td>
                          <td>
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Active"}
                          </td>
                          <td>
                            {u.memberId !== "admin" && (
                              <button
                                className="btn-admin-action danger"
                                onClick={() => handleDeleteUser(u.id, u.memberId)}
                              >
                                Delete User
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: RECIPES */}
            {tab === "recipes" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                  <input
                    type="text"
                    placeholder="Search recipes by title..."
                    value={searchRecipe}
                    onChange={(e) => setSearchRecipe(e.target.value)}
                    style={{ maxWidth: "350px", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
                  />
                  <button className="btn btn-success" onClick={() => setShowAddRecipeModal(true)}>
                    + Add New Recipe
                  </button>
                </div>

                <div className="admin-card">
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Recipe Title</th>
                          <th>Difficulty</th>
                          <th>Cook Time</th>
                          <th>Servings</th>
                          <th>Ingredients Count</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecipes.map((r) => (
                          <tr key={r.id}>
                            <td><strong>{r.title}</strong></td>
                            <td>
                              <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#16a34a" }}>
                                {r.difficulty}
                              </span>
                            </td>
                            <td>{r.cookTime}</td>
                            <td>{r.servings}</td>
                            <td>{(r.ingredients || []).length} ingredients</td>
                            <td>
                              <button
                                className="btn-admin-action danger"
                                onClick={() => handleDeleteRecipe(r.id, r.title)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: BARCODES */}
            {tab === "barcodes" && (
              <div className="admin-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Barcode Product Registry</h3>
                    <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "0.85rem" }}>
                      Pre-seed barcodes to support instant offline lookup for mobile/web scanner
                    </p>
                  </div>
                  <button className="btn btn-success" onClick={() => setShowAddBarcodeModal(true)}>
                    + Register New Barcode
                  </button>
                </div>

                <div style={{ background: "#f8fafc", padding: 20, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                  <p style={{ color: "#475569", lineHeight: "1.6" }}>
                    The system contains <strong>{metrics?.totalBarcodes ?? 26}</strong> registered barcode items (Amul, Oreo, Coca-Cola, Kellogg's, Parle-G, Aashirvaad, Maggi, etc.).
                    Whenever a user scans a barcode, the backend first checks this database table; if absent, it calls the Open Food Facts API automatically.
                  </p>
                  <button
                    className="btn btn-outline-success"
                    onClick={() => setShowAddBarcodeModal(true)}
                  >
                    Add Custom Barcode Entry →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL: ADD NEW RECIPE */}
      {showAddRecipeModal && (
        <Modal title="Publish New Recipe to Catalog" onClose={() => setShowAddRecipeModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="text"
              placeholder="Recipe Title (e.g. Avocado Toast with Poached Egg)"
              value={recipeTitle}
              onChange={(e) => setRecipeTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Brief Description..."
              value={recipeDesc}
              onChange={(e) => setRecipeDesc(e.target.value)}
              rows="2"
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              <input
                type="text"
                placeholder="Cook Time (e.g. 20 mins)"
                value={recipeCookTime}
                onChange={(e) => setRecipeCookTime(e.target.value)}
              />
              <input
                type="text"
                placeholder="Servings (e.g. 2 servings)"
                value={recipeServings}
                onChange={(e) => setRecipeServings(e.target.value)}
              />
              <select
                value={recipeDifficulty}
                onChange={(e) => setRecipeDifficulty(e.target.value)}
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Ingredients builder */}
            <div style={{ marginTop: 6 }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#475569" }}>
                Ingredients ({recipeIngredients.length}):
              </label>
              <div style={{ display: "flex", gap: "6px", marginBottom: 6 }}>
                <input
                  type="text"
                  placeholder="Type ingredient (e.g. eggs, tomatoes) and press Add"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  style={{ flex: 1, margin: 0 }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddIngredient(e); }}
                />
                <button type="button" className="btn btn-sm btn-outline-success" onClick={handleAddIngredient}>
                  Add
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {recipeIngredients.map((ing, idx) => (
                  <span key={idx} className="recipe-pill-tag">
                    {ing}
                    <button type="button" onClick={() => setRecipeIngredients(recipeIngredients.filter((_, i) => i !== idx))}>
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Steps builder */}
            <div style={{ marginTop: 6 }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#475569" }}>
                Cooking Steps ({recipeSteps.length}):
              </label>
              <div style={{ display: "flex", gap: "6px", marginBottom: 6 }}>
                <input
                  type="text"
                  placeholder="Enter instruction step and click Add"
                  value={stepInput}
                  onChange={(e) => setStepInput(e.target.value)}
                  style={{ flex: 1, margin: 0 }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddStep(e); }}
                />
                <button type="button" className="btn btn-sm btn-outline-success" onClick={handleAddStep}>
                  Add Step
                </button>
              </div>
              <ol style={{ paddingLeft: 20, fontSize: "0.85rem", color: "#334155" }}>
                {recipeSteps.map((step, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>
                    {step}
                    <button
                      type="button"
                      onClick={() => setRecipeSteps(recipeSteps.filter((_, i) => i !== idx))}
                      style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", marginLeft: 6 }}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            <div className="modal-actions" style={{ marginTop: 15 }}>
              <button className="primary" onClick={handleSaveRecipe} disabled={savingRecipe}>
                {savingRecipe ? "Publishing..." : "Publish Recipe"}
              </button>
              <button className="secondary" onClick={() => setShowAddRecipeModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: ADD NEW BARCODE */}
      {showAddBarcodeModal && (
        <Modal title="Register Barcode in Catalog" onClose={() => setShowAddBarcodeModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="text"
              placeholder="Barcode Number (e.g. 8901030000010)"
              value={barcodeNum}
              onChange={(e) => setBarcodeNum(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Product Name (e.g. Amul Butter 500g)"
              value={barcodeName}
              onChange={(e) => setBarcodeName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Brand (e.g. Amul, Nestle)"
              value={barcodeBrand}
              onChange={(e) => setBarcodeBrand(e.target.value)}
            />
            <input
              type="text"
              placeholder="Category (e.g. Dairy, Snacks)"
              value={barcodeCategory}
              onChange={(e) => setBarcodeCategory(e.target.value)}
            />
            <label style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
              Default Shelf-Life (Days):
            </label>
            <input
              type="number"
              value={barcodeShelfDays}
              onChange={(e) => setBarcodeShelfDays(e.target.value)}
              min="1"
            />

            <div className="modal-actions" style={{ marginTop: 15 }}>
              <button className="primary" onClick={handleSaveBarcode} disabled={savingBarcode}>
                {savingBarcode ? "Saving..." : "Save Barcode"}
              </button>
              <button className="secondary" onClick={() => setShowAddBarcodeModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
