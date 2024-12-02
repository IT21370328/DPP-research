import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductDetails.css"

const ProductDetails = () => {
  const { batchId } = useParams(); // Get batchId from URL
  const [product, setProduct] = useState(null);
  const [dailyData, setDailyData] = useState({
    moistureContent: "",
    caffeineContent: "",
  });
  const [dailyUpdates, setDailyUpdates] = useState([]);

  // Fetch product details and daily data
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productResponse = await axios.get(
          `http://localhost:5000/api/admin/${batchId}`
        );
        setProduct(productResponse.data);

        const dailyResponse = await axios.get(
          `http://localhost:5000/api/admin/daily/${batchId}`
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
        `http://localhost:5000/api/admin/add-daily/${batchId}`,
        dailyData
      );
      alert("Daily data added successfully!");
      setDailyData({
        moistureContent: "",
        caffeineContent: "",
      });
      // Re-fetch the daily data after adding a new entry
      const dailyResponse = await axios.get(
        `http://localhost:5000/api/admin/daily/${batchId}`
      );
      setDailyUpdates(dailyResponse.data);
    } catch (error) {
      console.error("Error adding daily data:", error);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-details-page">
      <h1>Product Details</h1>
      <div className="product-tiles">
        {/* Batch ID Tile */}
        <div className="product-tile">
          <img
            src="https://via.placeholder.com/60?text=ID" // Placeholder for Batch ID image
            alt="Batch ID"
          />
          <h4>Batch ID</h4>
          <p>{product.batchId}</p>
        </div>

        {/* Flavor Tile */}
        <div className="product-tile">
          <img
            src="https://via.placeholder.com/60?text=Flavor" // Placeholder for Flavor image
            alt="Flavor"
          />
          <h4>Flavor</h4>
          <p>{product.flavor}</p>
        </div>

        {/* Supplier Name Tile */}
        <div className="product-tile">
          <img
            src="https://via.placeholder.com/60?text=Supplier" // Placeholder for Supplier image
            alt="Supplier Name"
          />
          <h4>Supplier</h4>
          <p>{product.supplierName}</p>
        </div>

        {/* Location Tile */}
        <div className="product-tile">
          <img
            src="https://via.placeholder.com/60?text=Location" // Placeholder for Location image
            alt="Location"
          />
          <h4>Location</h4>
          <p>{product.location}</p>
        </div>

        {/* Moisture Content Tile */}
        <div className="product-tile">
          <img
            src="https://via.placeholder.com/60?text=Moisture" // Placeholder for Moisture image
            alt="Moisture Content"
          />
          <h4>Moisture</h4>
          <p>{product.moistureContent}%</p>
        </div>

        {/* Caffeine Content Tile */}
        <div className="product-tile">
          <img
            src="https://via.placeholder.com/60?text=Caffeine" // Placeholder for Caffeine image
            alt="Caffeine Content"
          />
          <h4>Caffeine</h4>
          <p>{product.caffeineContent}%</p>
        </div>
      </div>

      {/* Display Daily Updates */}
      <h3>Daily Updates</h3>
      <ul>
        {dailyUpdates.map((data, index) => (
          <li key={index}>
            <p>
              <strong>Date:</strong> {new Date(data.date).toLocaleDateString()}
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
  );
};

export default ProductDetails;
