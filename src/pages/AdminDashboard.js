import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import UserList from "../components/UserList.js";
import OrderList from "../components/AdminOrdersList.js";
import SalesReport from "../components/SalesReport.js";
import ProductTableRow from "../components/ProductTable.js";
import AddProductModal from "../components/AddProductModal.js";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("productName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3001/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3001/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchProducts();
    fetchUsers();
  }, []);

  const sortProducts = (products, criteria, order) => {
    return [...products].sort((a, b) => {
      const valueA = a[criteria];
      const valueB = b[criteria];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return order === "asc" ? valueA - valueB : valueB - valueA;
      }
    });
  };

  const sortedProducts = sortProducts(products, sortCriteria, sortOrder);

  const handleEditProduct = async (productId, newProductData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3001/products/${productId}`,
        newProductData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update the local state with the new product data
        const updatedProducts = products.map((product) => {
          if (product._id === productId) {
            return { ...product, ...newProductData };
          }
          return product;
        });
        setProducts(updatedProducts);
      } else {
        console.error("Error updating product:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleAddProduct = async (newProduct) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/products",
        newProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the local state with the new product
      setProducts([...products, response.data]);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1 id="manage-users">Admin Dashboard</h1>
      <div className="section-name">
        <h2>Manage Users</h2>
        <p>Total registered users: {users.length}</p>
        <UserList />
      </div>
      <br id="product-listing"></br>
      <div className="section-name">
        <h2>Product Listings</h2>

        <div className="sort-controls" id="admin-sort-product">
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
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Price</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => (
              <ProductTableRow
                key={product._id}
                product={product}
                onEditProduct={handleEditProduct}
              />
            ))}
          </tbody>
        </table>
        <br></br>
        <button
          className="productlisting-button"
          id="addproduct"
          onClick={() => setIsModalOpen(true)}
        >
          Add Product
        </button>
      </div>
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
      <br id="manage-orders"></br>
      <div className="section-name">
        <h2>Manage Orders</h2>
        <OrderList />
      </div>
      <br id="sales-report"></br>
      <div className="section-name">
        <h2>Sales Report</h2>
        <SalesReport />
      </div>
    </div>
  );
}

export default AdminDashboard;
