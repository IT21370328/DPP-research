import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // For getting batchId from URL
import "./ProductDetails.css";

const ProductDetails = () => {
  const { batchId } = useParams(); // Get batchId from URL
  const [product, setProduct] = useState(null);
  const [dailyData, setDailyData] = useState({
    moistureContent: "",
    caffeineContent: "",
  });
  const [dailyUpdates, setDailyUpdates] = useState([]);
  const [editMode, setEditMode] = useState(false); // To manage edit state for product details
  const [productDetails, setProductDetails] = useState({
    flavor: "",
    supplierName: "",
    location: "",
    moistureContent: "",
    caffeineContent: "",
  });

  // Fetch product details and daily data
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productResponse = await axios.get(
          `http://192.168.1.3:5000/api/admin/${batchId}`
        );
        setProduct(productResponse.data);
        setProductDetails({
          flavor: productResponse.data.flavor,
          supplierName: productResponse.data.supplierName,
          location: productResponse.data.location,
          moistureContent: productResponse.data.moistureContent,
          caffeineContent: productResponse.data.caffeineContent,
        });

        const dailyResponse = await axios.get(
          `http://192.168.1.3:5000/api/admin/daily/${batchId}`
        );
        setDailyUpdates(dailyResponse.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProductDetails();
  }, [batchId]);

  // Handle daily data form input changes
  const handleDailyDataChange = (e) => {
    const { name, value } = e.target;
    setDailyData({ ...dailyData, [name]: value });
  };

  // Handle form submission for adding daily data
  const handleAddDailyData = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://192.168.1.3:5000/api/admin/add-daily/${batchId}`,
        dailyData
      );
      alert("Daily data added successfully!");
      setDailyData({
        moistureContent: "",
        caffeineContent: "",
      });

      // Re-fetch the daily data after adding a new entry
      const dailyResponse = await axios.get(
        `http://192.168.1.3:5000/api/admin/daily/${batchId}`
      );
      setDailyUpdates(dailyResponse.data);
    } catch (error) {
      console.error("Error adding daily data:", error);
    }
  };

  // Handle product details form input changes
  const handleProductDetailChange = (e) => {
    const { name, value } = e.target;
    setProductDetails({ ...productDetails, [name]: value });
  };

  // Handle update product details
  const handleUpdateProductDetails = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = await axios.put(
        `http://192.168.1.3:5000/api/admin/${batchId}`,
        productDetails
      );
      setProduct(updatedProduct.data); // Update the product details state with the response
      setEditMode(false); // Exit edit mode
      alert("Product details updated successfully!");
    } catch (error) {
      console.error("Error updating product details:", error);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-details-page">
      <h1>Product Details</h1>

      <div className="product-details">
        {/* Display product info, show form when in edit mode */}
        <center>
          {!editMode ? (
            <>
              <p>
                <strong>Batch ID:</strong> {product.batchId}
              </p>
              <p>
                <strong>Flavor:</strong> {product.flavor}
              </p>
              <p>
                <strong>Supplier Name:</strong> {product.supplierName}
              </p>
              <p>
                <strong>Location:</strong> {product.location}
              </p>
              <p>
                <strong>Moisture Content:</strong> {product.moistureContent}%
              </p>
              <p>
                <strong>Caffeine Content:</strong> {product.caffeineContent}%
              </p>
              <button onClick={() => setEditMode(true)}>Edit Product</button>
            </>
          ) : (
            <form onSubmit={handleUpdateProductDetails}>
              <input
                type="text"
                name="flavor"
                value={productDetails.flavor}
                onChange={handleProductDetailChange}
                placeholder="Flavor"
              />
              <input
                type="text"
                name="supplierName"
                value={productDetails.supplierName}
                onChange={handleProductDetailChange}
                placeholder="Supplier Name"
              />
              <input
                type="text"
                name="location"
                value={productDetails.location}
                onChange={handleProductDetailChange}
                placeholder="Location"
              />
              <input
                type="number"
                name="moistureContent"
                value={productDetails.moistureContent}
                onChange={handleProductDetailChange}
                placeholder="Moisture Content (%)"
              />
              <input
                type="number"
                name="caffeineContent"
                value={productDetails.caffeineContent}
                onChange={handleProductDetailChange}
                placeholder="Caffeine Content (%)"
              />
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </form>
          )}
        </center>

        <center>
          <h3>Daily Updates</h3>
        </center>
        <ul>
          {dailyUpdates.map((data, index) => (
            <li key={index}>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(data.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Moisture Content:</strong> {data.moistureContent}%
              </p>
              <p>
                <strong>Caffeine Content:</strong> {data.caffeineContent}%
              </p>
            </li>
          ))}
        </ul>

        {/* Form to Add Daily Data */}
        <h3>Add Daily Data</h3>
        <form onSubmit={handleAddDailyData}>
          <input
            type="number"
            name="moistureContent"
            value={dailyData.moistureContent}
            onChange={handleDailyDataChange}
            placeholder="Moisture Content (%)"
          />
          <input
            type="number"
            name="caffeineContent"
            value={dailyData.caffeineContent}
            onChange={handleDailyDataChange}
            placeholder="Caffeine Content (%)"
          />
          <button type="submit">Add Daily Data</button>
        </form>
      </div>
    </div>
  );
};

export default ProductDetails;
