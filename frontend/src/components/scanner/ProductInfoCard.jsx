import React from "react";

export default function ProductInfoCard({ product }) {
  if (!product) return null;

  return (
    <div className="product-info">
      <div className="product-header">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="product-image" />
        ) : (
          <div
            className="product-image"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}
          >
            No image
          </div>
        )}
        <div>
          <h2>{product.name}</h2>
          <p>{product.brand}</p>
          <p>Barcode: {product.barcode}</p>
        </div>
      </div>

      <div className="nutrition-info">
        <h3>Nutritional Information (per 100g)</h3>
        <div className="nutrition-facts">
          {Object.entries(product.nutrition).map(([key, value]) => (
            <div className="nutrition-item" key={key}>
              <h4>{key}</h4>
              <p>{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="ingredients">
        <h3>Ingredients</h3>
        <p>{product.ingredients}</p>
      </div>
    </div>
  );
}
