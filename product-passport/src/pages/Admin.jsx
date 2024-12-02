import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Admin.css";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate(); 

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
      // Use the correct route `/api/admin/:batchId` without `/delete`
      await axios.delete(`http://localhost:5000/api/admin/${batchId}`);
      fetchProducts(); // Refresh the list after delete
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  

  const handleAddProduct = () => {
    navigate("/add-product"); // Navigate to the Add Product page
  };

  return (
    <div className="main-content">
      <h2>All Products</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <br></br>
      <br></br>

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
                src={product.qrCode} // Use the QR code URL from the product or fallback to placeholder
                alt="QR code"
                className="qr-code"
              />
              <div className="product-info">
                <h3>{product.batchId}</h3>
                <p>{product.flavor}</p>
                <p>{product.supplierName}</p>
                <div className="product-actions">
                  <button onClick={() => console.log("Update product")} className="update-btn">
                    <FontAwesomeIcon icon={faEdit} style={{ marginRight: "5px" }} />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent product click handler
                      handleDelete(product.batchId);
                    }}
                    className="delete-btn"
                  >
                    <FontAwesomeIcon icon={faTrash} style={{ marginRight: "5px" }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

    </div>
  );
};

export default AdminDashboard;
