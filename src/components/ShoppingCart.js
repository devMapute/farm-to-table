import React, { useState, useEffect } from "react";
import "./Shop.css";

function ShoppingCart({ items, setItems }) {
  const [totalPrice, setTotalPrice] = useState(0);

  // Calculate total price whenever items change
  useEffect(() => {
    const updatedTotalPrice = items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
    setTotalPrice(updatedTotalPrice);
  }, [items]);

  // Function to handle removing an item from the cart
  const handleRemoveItem = (itemId) => {
    const updatedItems = [...items]; // Create a copy of the items array
    const itemIndex = updatedItems.findIndex((item) => item.id === itemId); // Find the index of the item to remove

    if (itemIndex !== -1) {
      if (updatedItems[itemIndex].quantity === 1) {
        // If the quantity of the item is 1, remove the item entirely
        updatedItems.splice(itemIndex, 1);
      } else {
        // Otherwise, decrement the quantity by 1
        updatedItems[itemIndex].quantity -= 1;
      }
      setItems(updatedItems); // Update the cart items
    }
  };

  return (
    <div className="shopping-cart-container">
      <h1>Shopping Cart</h1>
      <p className="total-price">Total Price: ${totalPrice}</p>
      <ul className="cart-items">
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - {item.quantity} x ${item.price} = $
            {item.quantity * item.price}
            <button
              className="remove-item-btn"
              onClick={() => handleRemoveItem(item.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShoppingCart;
