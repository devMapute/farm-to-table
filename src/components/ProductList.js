import React, { useState, useEffect } from "react";
import axios from "axios";
import ShoppingCart from "./ShoppingCart.js";
import OrderList from "./OrderList.js";
import NavBar from "./NavBar.js";
import { jwtDecode } from "jwt-decode";
import "./Shop.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderCounter, setOrderCounter] = useState(1);
  const [sortCriteria, setSortCriteria] = useState("productName");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch products data from backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Fetch orders data for the current user from backend API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("User token not found. Please log in.");
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const response = await axios.get(
          `http://localhost:3001/orders/${userId}`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Function to handle adding a product to the cart
  const handleAddToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product._id);
    if (existingItem) {
      const updatedItems = cartItems.map((item) =>
        item.id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartItems(updatedItems);
    } else {
      const newItem = {
        id: product._id,
        name: product.productName,
        price: product.productPrice,
        quantity: 1,
        status: "Pending",
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  // Calculate total items and total price in the cart
  const totalItemsInCart = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalPriceInCart = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Function to handle placing an order
  const handlePlaceOrder = async () => {
    if (cartItems.length > 0) {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User token not found. Please log in.");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const newOrder = {
        user: userId,
        products: cartItems.map((item) => ({
          product: item.id,
          quantity: item.quantity,
          productPrice: item.price,
        })),
        totalAmount: totalPriceInCart,
        status: "Pending",
        paymentMethod: "Cash on Delivery",
        confirmedByMerchant: false,
      };

      try {
        await axios.post("http://localhost:3001/add-order", newOrder);
        setOrders([...orders, newOrder]);
        setCartItems([]);
        setOrderCounter(orderCounter + 1);
        alert(
          "Your order has been placed. Please wait for confirmation from the merchant."
        );
        window.location.reload();
      } catch (error) {
        console.error("Error placing order:", error);
        alert("Error placing order. Please try again.");
      }
    } else {
      alert("Your cart is empty. Please add items before placing an order.");
    }
  };

  // Function to sort products based on criteria and order
  const sortProducts = (products, criteria, order) => {
    return products.slice().sort((a, b) => {
      const valueA = a[criteria];
      const valueB = b[criteria];

      if (valueA < valueB) {
        return order === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  // useEffect to re-sort products when sorting criteria or order changes
  useEffect(() => {
    if (products.length > 0) {
      const sortedProducts = sortProducts(products, sortCriteria, sortOrder);
      setProducts(sortedProducts);
    }
  }, [products, sortCriteria, sortOrder]);

  return (
    <div>
      <NavBar />
      <div className="sort-controls">
        <label>
          Sort by:
          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
          >
            <option value="productName">Name</option>
            <option value="productType">Type</option>
            <option value="productPrice">Price</option>
            <option value="quantity">Quantity</option>
          </select>
        </label>
        <label>
          Order:
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>
      <div className="container">
        <div className="product-list-container">
          <h1>Product Listings</h1>
          <div className="product-cards">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <div className="image-wrapper">
                  <img
                    src={product.imgURL}
                    alt={product.productName}
                    className="product-image"
                  />
                </div>
                <div className="product-details">
                  <div className="product-name">
                    {product.productName} - ${product.productPrice}
                  </div>
                  <div>{product.productDesc}</div>
                  <div>Type: {product.productType}</div>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="sidebar">
          <ShoppingCart
            items={cartItems}
            setItems={setCartItems}
            totalItems={totalItemsInCart}
            totalPrice={totalPriceInCart}
          />
          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
          <OrderList orders={orders} />
        </div>
      </div>
    </div>
  );
}

export default ProductList;
