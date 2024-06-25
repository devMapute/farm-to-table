import React, { useState } from "react";
import './ProductTable.css';

function ProductTableRow({ product, onEditProduct }) {
  const [newQuantity, setNewQuantity] = useState(product.quantity);
  const [newPrice, setNewPrice] = useState(product.productPrice);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const parsedQuantity = parseInt(newQuantity, 10);
    const parsedPrice = parseFloat(newPrice);

    if (!isNaN(parsedQuantity) && !isNaN(parsedPrice)) {
      onEditProduct(product._id, {
        quantity: parsedQuantity,
        productPrice: parsedPrice // Ensure correct field name
      });
      setIsEditing(false);
    } else {
      alert("Please enter valid values for quantity and price.");
    }
  };

  const handleQuantityChange = (event) => {
    setNewQuantity(event.target.value);
  };

  const handlePriceChange = (event) => {
    setNewPrice(event.target.value);
  };

  return (
    <tr>
      <td>{product.productName}</td>
      <td>{product.productType}</td>
      <td>
        {isEditing ? (
          <input
            type="number"
            step="0.01"
            value={newPrice}
            onChange={handlePriceChange}
          />
        ) : (
          product.productPrice
        )}
      </td>
      <td>{product.productDesc}</td>
      <td>
        {isEditing ? (
          <input
            type="number"
            value={newQuantity}
            onChange={handleQuantityChange}
          />
        ) : (
          product.quantity
        )}
      </td>
      <td>
        {isEditing ? (
          <button className="productlisting-button" onClick={handleSave}>Save</button>
        ) : (
          <button className="productlisting-button" onClick={handleEdit}>Edit</button>
        )}
      </td>
    </tr>
  );
}

export default ProductTableRow;
