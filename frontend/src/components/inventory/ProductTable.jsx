import React from "react";
import ProductRow from "./ProductRow.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ProductTable({ products, onRemove }) {
  const { isShopkeeper } = useAuth();
  const colSpan = isShopkeeper ? 7 : 8;

  return (
    <table>
      <thead>
        <tr>
          <th>Signal</th>
          <th>Product Name</th>
          <th>Category</th>
          <th>Storage Location</th>
          <th>Manufacturing Date</th>
          <th>Expiry Date</th>
          {!isShopkeeper && <th>Recipe Ideas</th>}
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {products.length === 0 ? (
          <tr>
            <td colSpan={colSpan} style={{ textAlign: "center", padding: "35px", color: "#64748b" }}>
              No products found in this view.
            </td>
          </tr>
        ) : (
          products.map((product) => (
            <ProductRow key={product.id} product={product} onRemove={onRemove} />
          ))
        )}
      </tbody>
    </table>
  );
}
