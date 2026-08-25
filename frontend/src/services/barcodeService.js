/**
 * barcodeService.js
 * ----------------------------------------------------------------------
 * Wraps the Open Food Facts public API (same one used in the original
 * scanning.html). You can later route this through your own backend
 * (e.g. /api/products/barcode/{code}) so the server can also persist
 * looked-up items, merge with your internal product DB, etc.
 * ----------------------------------------------------------------------
 */

export async function fetchProductByBarcode(barcode) {
  const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
  if (!response.ok) {
    throw new Error("Failed to fetch product information. Please try again.");
  }
  const data = await response.json();

  if (data.status === 0) {
    throw new Error("Product not found in database. Please try another barcode.");
  }

  return normalizeProduct(data.product);
}

function normalizeProduct(product) {
  const n = product.nutriments || {};
  return {
    name: product.product_name || "Unknown product",
    brand: product.brands || "Unknown brand",
    barcode: product.code,
    imageUrl: product.image_url || "",
    ingredients: product.ingredients_text || "No ingredients information available",
    nutrition: {
      Energy: `${n.energy_100g ?? "?"} ${n.energy_unit ?? "kcal"}`,
      Fat: `${n.fat_100g ?? "?"}g`,
      "Saturated Fat": `${n["saturated-fat_100g"] ?? "?"}g`,
      Carbohydrates: `${n.carbohydrates_100g ?? "?"}g`,
      Sugars: `${n.sugars_100g ?? "?"}g`,
      Fiber: `${n.fiber_100g ?? "?"}g`,
      Proteins: `${n.proteins_100g ?? "?"}g`,
      Salt: `${n.salt_100g ?? "?"}g`,
    },
  };
}
