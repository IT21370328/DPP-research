import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate("/add-product"); // Navigate to Add Product page
  };

  return (
    <nav className="navbar">
      <div className="navbar-title">
        <h1>Product Passport</h1>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/admin">Admin Dashboard</Link>
        </li>
        <li>
          <Link to="/check-quality">Check Quality</Link>
        </li>
        <li>
          <button onClick={handleAddProduct} className="add-product-btn">
            Add Product
          </button>
        </li>
      </ul>
      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search products..."
          onChange={(e) => console.log(e.target.value)} // Add search functionality if needed
        />
      </div>
    </nav>
  );
};

export default Navbar;
