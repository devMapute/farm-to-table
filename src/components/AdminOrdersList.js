import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminOrdersList.css"; // Import the CSS file

function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3001/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleConfirmOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:3001/orders/${orderId}`; // Verify that this URL is correct
      console.log("PUT request URL:", url);
      await axios.put(
        url,
        {
          confirmedByMerchant: true,
          status: "Delivered",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the orders state to reflect the changes
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order._id === orderId) {
            return { ...order, confirmedByMerchant: true, status: "Delivered" };
          }
          return order;
        })
      );
      window.location.reload();
      console.log("Order confirmed successfully!");
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  return (
    <div className="table-container">
      <h2>Order List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Products</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Payment Method</th>
            <th>Confirmed By Merchant</th>
            <th>Order Date</th>
            <th>Actions</th> {/* New column for actions */}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{`${order.user.firstName} ${order.user.lastName} (${order.user.email})`}</td>
              <td>
                <ul>
                  {order.products.map((product) => (
                    <li key={product.product}>
                      {`${product.product.productName}- ${product.quantity} - $${product.productPrice}`}
                    </li>
                  ))}
                </ul>
              </td>
              <td>${order.totalAmount.toFixed(2)}</td>
              <td>{order.status}</td>
              <td>{order.paymentMethod}</td>
              <td>{order.confirmedByMerchant ? "Yes" : "No"}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>
                {!order.confirmedByMerchant && (
                  <button onClick={() => handleConfirmOrder(order._id)}>
                    Confirm Order
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;
