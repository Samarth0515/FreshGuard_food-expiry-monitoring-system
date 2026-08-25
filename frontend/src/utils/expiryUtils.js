/**
 * Returns "green" | "yellow" | "red" based on how many days remain
 * until the given expiry date. Mirrors the logic from the original
 * scriptInventoryM.js (red = expired, yellow = within 7 days, green = safe).
 */
export function getExpiryStatus(expDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expDate);
  exp.setHours(0, 0, 0, 0);

  const daysToExpiry = Math.floor((exp - today) / (1000 * 60 * 60 * 24));

  if (daysToExpiry < 0) return "red";
  if (daysToExpiry <= 7) return "yellow";
  return "green";
}

export function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString();
}

export function sortByExpiry(products) {
  return [...products].sort((a, b) => new Date(a.expDate) - new Date(b.expDate));
}

export function summarize(products) {
  const summary = { total: products.length, green: 0, yellow: 0, red: 0 };
  products.forEach((p) => {
    summary[getExpiryStatus(p.expDate)] += 1;
  });
  return summary;
}
