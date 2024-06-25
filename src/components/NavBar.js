import React from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./NavBar.css";

function NavBar() {
  const isUserSignedIn = !!localStorage.getItem("token");
  const token = localStorage.getItem("token");
  let isAdmin = false;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      isAdmin = decodedToken.userId === "6650160f0b6714346b51519e";
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  const navigate = useNavigate();

  const handleSignout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <img src="/ftb.png" alt="Farm-to-table Logo" className="navbar-logo" />
      <ul className="navbar-links">
        {isUserSignedIn ? (
          <>
            {isAdmin && (
              <li>
                <a href="#manage-users">Manage Users</a>
                <a href="#product-listing">Product List</a>
                <a href="#manage-orders">Manage Orders</a>
                <a href="#sales-report">Sales Report</a>
              </li>
            )}
            <li>
              <button className="signout-button" onClick={handleSignout}>
                Sign out
              </button>
            </li>
          </>
        ) : (
          <></>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;