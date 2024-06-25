import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignIn.css";
import { jwtDecode } from "jwt-decode";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/signin", {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      const decodedToken = jwtDecode(token);

      setEmail("");
      setPassword("");
      fetchUsers();
      if (decodedToken.userId === "6650160f0b6714346b51519e") {
        navigate("/admin");
      } else {
        navigate("/shop");
      }
    } catch (error) {
      console.log(error);
      setError("Invalid email or password");
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from backend API
  const fetchUsers = () => {
    axios.get("http://localhost:3001/signup").then((res) => {
      console.log(res);
    });
  };

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(""); // Clear error message on typing
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(""); // Clear error message on typing
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Sign In</button>
      </form>
      <div className="signup-link">
        <p>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
