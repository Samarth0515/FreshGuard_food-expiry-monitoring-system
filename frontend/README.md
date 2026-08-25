# Food Expiry Tracker — React Frontend

A modular React (Vite) conversion of your original HTML/CSS/JS frontend, ready
to connect to a Spring Boot + MySQL backend.

## Folder structure

```
src/
  assets/             # images, icons (move your /Images files here)
  components/
    layout/           # Navbar, Footer
    common/           # Modal, SignalBadge, ProtectedRoute, SignUpFormCard
    inventory/        # ProductTable, ProductRow, DashboardSummary, modals
    scanner/          # ProductInfoCard
  context/
    AuthContext.jsx   # logged-in user state, login/signup/logout actions
    ToastContext.jsx  # in-app toast notifications (replaces window.alert)
  services/
    authService.js      # <-- swap with real /api/auth/* calls
    productService.js   # <-- swap with real /api/products/* calls
    barcodeService.js   # Open Food Facts lookup (used by Scanner)
  utils/
    expiryUtils.js    # traffic-signal (green/yellow/red) logic, sorting, summary
  pages/
    Home/             # marketing landing page (from Index.html)
    Login/            # from Login.html
    SignUp/           # from SignUp.html (Home User / Shopkeeper)
    Inventory/        # from inventoryM.html — table + dashboard summary
    Scanner/          # from scanning.html — Quagga barcode scanner
    Recipes/          # optional recipe-suggestion module placeholder
    NotFound/
  routes/
    AppRoutes.jsx     # all <Route> definitions in one place
  App.jsx
  main.jsx
  index.css
```

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build     # production build into dist/
```

## Connecting to your Spring Boot backend

Everything currently runs on `localStorage` as a stand-in data layer so the
UI is fully functional out of the box. To wire it to your real backend,
you only need to edit **three files** — no component changes required:

1. **`src/services/authService.js`** — replace `loginUser`, `signUpUser`,
   `changePassword`, `logoutUser` with `fetch()` calls to your
   `/api/auth/...` endpoints. Keep the same function names/return shapes.
2. **`src/services/productService.js`** — replace `fetchProducts`,
   `createProduct`, `deleteProduct` with calls to `/api/products`.
3. **`vite.config.js`** — the dev server already proxies `/api/*` to
   `http://localhost:8080` (update the `target` if your backend runs
   elsewhere).

Each service file has comments showing the exact `fetch()` pattern to use.

## Notes on this conversion

- Replaced all `alert()` calls with a non-blocking toast system
  (`ToastContext`), styled and auto-dismissing.
- `Login`/`SignUp`/`Inventory` pages are now driven by React state instead
  of direct DOM manipulation (`document.getElementById`, etc.).
- `/inventory`, `/scanner`, and `/recipes` are wrapped in `ProtectedRoute`
  so unauthenticated users are redirected to `/login` (the original site
  had no such guard).
- The barcode scanner still uses QuaggaJS, loaded dynamically from the
  same CDN as before, but managed through a `useQuagga` hook instead of
  manual `document.addEventListener` wiring.
- Images referenced from external Unsplash URLs as placeholders — drop
  your own files into `src/assets/` and update the `<img src>` paths.
- The Recipes page is a placeholder UI; wire `SAMPLE_RECIPES` in
  `Recipes.jsx` to your backend's recipe-suggestion endpoint when ready.
