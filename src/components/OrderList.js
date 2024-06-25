import React from "react";
import axios from "axios";

function OrderList({ orders }) {
  // Function to handle canceling an order
  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();

      alert("Order cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Error cancelling order. Please try again.");
    }
  };

  // Render loading message if orders are not yet loaded
  if (!orders) {
    return (
      <div>
        <br></br>
        <br></br>Loading...
      </div>
    );
  }

  // Render nothing if there are no orders
  if (orders.length === 0) {
    return <div></div>;
  }

  return (
    <div className="order-list">
      <h2>Orders</h2>
      <ul>
        <h2>Number of Orders: {orders.length}</h2>
        {orders.map((order) => (
          <li key={order.id}>
            <div className="order-info">
              <h3>Order {order._id}</h3>
              <p>Status: {order.status}</p>
              <ul>
                {order.products.map((item) => (
                  <li key={item.product._id}>
                    {item.product.productName} - ${item.product.productPrice} x{" "}
                    {item.quantity}
                  </li>
                ))}
              </ul>
              {order.status === "Pending" && (
                <button
                  className="cancel-order-btn"
                  onClick={() => handleCancelOrder(order._id)}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderList;
