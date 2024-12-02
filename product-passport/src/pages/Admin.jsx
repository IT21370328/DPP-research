import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "./Admin.css"

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

  // Fetch all records
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleProductClick = (batchId) => {
    navigate(`/product/${batchId}`); // Navigate to the Product Details page
  };

  const handleDelete = async (batchId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/delete/${batchId}`);
      fetchProducts(); // Refresh the list after delete
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleAddProduct = () => {
    navigate("/add-product"); // Navigate to the Add Product page
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <div className="sidebar-title">
          <h1>Product Passport</h1>
        </div>
        <ul className="sidebar-links">
          <li>
            <button onClick={handleAddProduct}>Add Product</button>
          </li>
          <li>
            <a href="/check-quality">Check Quality of Product</a>
          </li>
        </ul>
        <div className="sidebar-search">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="main-content">
        <h2>All Products</h2>

        <div className="product-grid">
          {products
            .filter((product) =>
              product.flavor.toLowerCase().includes(search.toLowerCase())
            )
            .map((product) => (
              <div
                key={product.batchId}
                className="product-tile"
                onClick={() => handleProductClick(product.batchId)} // Navigate to Product Details page
              >
                <img
                  src="https://via.placeholder.com/150" // Dummy QR code image
                  alt="QR code"
                  className="qr-code"
                />
                <div className="product-info">
                  <h3>{product.batchId}</h3>
                  <p>{product.flavor}</p>
                  <p>{product.supplierName}</p>
                  <div className="product-actions">
                    <button onClick={() => console.log("Update product")} className="update-btn">
                      Update
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent product click handler
                        handleDelete(product.batchId);
                      }}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
