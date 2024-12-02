import React from "react";
import { Link } from "react-router-dom"; // For navigation
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css"; // Assuming your styles are in Navbar.css

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>Product Passport</h2>
      </div>

      <div className="navbar-links">
        <ul>
          <li>
            <Link to="/" className="navbar-link">
              <FontAwesomeIcon icon={faHome} /> Home
            </Link>
          </li>
          <li>
            <Link to="/add-product" className="navbar-link">
              <FontAwesomeIcon icon={faPlus} /> Add Product
            </Link>
          </li>
          <li>
            <Link to="/check-quality" className="navbar-link">
              <FontAwesomeIcon icon={faSearch} /> Check Quality
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
