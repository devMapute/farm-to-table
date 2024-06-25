import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Send POST request to signup endpoint with form data
    axios
      .post("http://localhost:3001/signup", {
        firstName,
        lastName,
        userType: "User", // Assuming default user type is "User"
        email,
        password,
      })
      .then(() => {
        alert("Success!"); // Alert user on successful registration
        // Clear input fields after successful registration
        setFirstName("");
        setLastName("");
        setUserType("");
        setEmail("");
        setPassword("");
        fetchUsers(); // Fetch updated user data
        navigate("/"); // Navigate to home page after successful registration
      })
      .catch((error) => {
        console.log("Unable to register"); // Log error if registration fails
      });
  };

  // Fetch users data
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    // Send GET request to retrieve user data
    axios.get("http://localhost:3001/signup").then((res) => {
      console.log(res); // Log response data
    });
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        {/* Input fields for first name, last name, email, and password */}
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <div className="signin-link">
        <p>
          Already have an account? <a href="/">Sign In</a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
