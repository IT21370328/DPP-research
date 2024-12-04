import React, { useState } from "react";
import axios from "axios";
import "./AddProduct.css";

const AddProductForm = () => {
  const [authenticated, setAuthenticated] = useState(false); // Authentication status
  const [credentials, setCredentials] = useState({ username: "", password: "" }); // User credentials
  const [form, setForm] = useState({
    batchId: "",
    flavor: "",
    supplierName: "",
    location: "",
    moistureContent: "",
    caffeineContent: "",
  });

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://192.168.1.3:5000/api/admin/authenticate", credentials);
      if (response.data.success) {
        alert("Authentication successful!");
        setAuthenticated(true); // Grant access to the form
      } else {
        alert("Invalid credentials! Please try again.");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  // Handle product submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://192.168.1.3:5000/api/admin/add", form, {
        headers: {
          username: credentials.username,
          password: credentials.password,
        },
      });
      alert("Product added successfully!");
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setForm({
      batchId: "",
      flavor: "",
      supplierName: "",
      location: "",
      moistureContent: "",
      caffeineContent: "",
    });
  };

  return (
    <div className="container">
      <h1>{authenticated ? "Add New Product" : "Admin Login"}</h1>

      {!authenticated ? (
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Batch ID"
            value={form.batchId}
            onChange={(e) => setForm({ ...form, batchId: e.target.value })}
          />
          <input
            type="text"
            placeholder="Flavor"
            value={form.flavor}
            onChange={(e) => setForm({ ...form, flavor: e.target.value })}
          />
          <input
            type="text"
            placeholder="Supplier Name"
            value={form.supplierName}
            onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <input
            type="number"
            placeholder="Moisture Content (%)"
            value={form.moistureContent}
            onChange={(e) => setForm({ ...form, moistureContent: e.target.value })}
          />
          <input
            type="number"
            placeholder="Caffeine Content (%)"
            value={form.caffeineContent}
            onChange={(e) => setForm({ ...form, caffeineContent: e.target.value })}
          />
          <button type="submit">Add Product</button>
        </form>
      )}
    </div>
  );
};

export default AddProductForm;
