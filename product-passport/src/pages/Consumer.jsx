import React, { useState } from "react";
import axios from "axios";

const Consumer = () => {
  const [batchId, setBatchId] = useState("");
  const [product, setProduct] = useState(null);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/consumer/${batchId}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
      alert("Product not found.");
    }
  };

  return (
    <div className="container">
      <h1>Search Product Passport</h1>
      <input
        type="text"
        placeholder="Enter Batch ID"
        value={batchId}
        onChange={(e) => setBatchId(e.target.value)}
      />
      <button onClick={fetchProductDetails}>Search</button>
      {product && (
        <div className="product-details">
          <h2>Product Details</h2>
          <p><strong>Batch ID:</strong> {product.batchId}</p>
          <p><strong>Flavor:</strong> {product.flavor}</p>
          <p><strong>Supplier Name:</strong> {product.supplierName}</p>
          <p><strong>Location:</strong> {product.location}</p>
        </div>
      )}
    </div>
  );
};

export default Consumer;
