import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // For accessing the batchId from the URL
import axios from "axios";
import "./ProductDetails.css"

const ProductDetails = () => {
  const { batchId } = useParams(); // Extract batchId from the URL
  const [product, setProduct] = useState(null); // State for product details
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode

  // Fetch product details based on batchId
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/${batchId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [batchId]); // Re-fetch product when batchId changes

  // Handle form changes
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Handle form submission to update the product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/admin/${batchId}`, product);
      setIsEditing(false); // Exit edit mode after saving
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Display loading state if the product data hasn't been fetched yet
  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-details-page">
      <h1>Product Details</h1>
      <div className="product-details">
        {/* Display product details */}
        <p><strong>Batch ID:</strong> {product.batchId}</p>
        <p><strong>Flavor:</strong> {product.flavor}</p>
        <p><strong>Supplier Name:</strong> {product.supplierName}</p>
        <p><strong>Location:</strong> {product.location}</p>
        <p><strong>Moisture Content:</strong> {product.moistureContent}%</p>
        <p><strong>Caffeine Content:</strong> {product.caffeineContent}%</p>

        {/* Show update form when editing */}
        {isEditing && (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="flavor"
              value={product.flavor}
              onChange={handleChange}
              placeholder="Update Flavor"
            />
            <input
              type="text"
              name="supplierName"
              value={product.supplierName}
              onChange={handleChange}
              placeholder="Update Supplier Name"
            />
            <input
              type="text"
              name="location"
              value={product.location}
              onChange={handleChange}
              placeholder="Update Location"
            />
            <input
              type="number"
              name="moistureContent"
              value={product.moistureContent}
              onChange={handleChange}
              placeholder="Update Moisture Content"
            />
            <input
              type="number"
              name="caffeineContent"
              value={product.caffeineContent}
              onChange={handleChange}
              placeholder="Update Caffeine Content"
            />
            <button type="submit">Update Product</button>
          </form>
        )}

        {/* Show the Edit button when not in edit mode */}
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="edit-btn">
            Edit Product
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
