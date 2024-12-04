import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AuthenticatedUserView = () => {
  const { batchId } = useParams(); // Get batchId from URL
  const [product, setProduct] = useState(null);
  const [dailyUpdates, setDailyUpdates] = useState([]);
  const [username, setUsername] = useState(""); // State to store username
  const [password, setPassword] = useState(""); // State to store password
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  const [authError, setAuthError] = useState(""); // Error message state

  // Dummy credentials
  const correctUsername = "admin"; // Dummy username
  const correctPassword = "password123"; // Dummy password

  // Fetch product details and daily data after successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      const fetchProductDetails = async () => {
        try {
          const productResponse = await axios.get(
            `http://192.168.1.3:5000/api/admin/${batchId}`
          );
          setProduct(productResponse.data);

          const dailyResponse = await axios.get(
            `http://192.168.1.3:5000/api/admin/daily/${batchId}`
          );
          setDailyUpdates(dailyResponse.data);
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      };
      fetchProductDetails();
    }
  }, [isAuthenticated, batchId]);

  // Handle form submit for authentication
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError(""); // Reset the error message

    if (username === correctUsername && password === correctPassword) {
      setIsAuthenticated(true); // Mark user as authenticated
    } else {
      setAuthError("Invalid username or password! Please try again.");
    }
  };

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div>
        <h2>Please login to view sensitive data</h2>
        <form onSubmit={handleAuthSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          {authError && <p style={{ color: "red" }}>{authError}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  // Once authenticated, show product and daily updates
  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-details-page">
      <h1>Product Details</h1>
      <div className="product-tiles">
        {/* Show sensitive data only after authentication */}
        <div className="product-tile">
          <h4>Batch ID (Sensitive Data)</h4>
          <p>{product.batchId}</p>
        </div>
        <div className="product-tile">
          <h4>Supplier Name (Sensitive Data)</h4>
          <p>{product.supplierName}</p>
        </div>

        {/* Display non-sensitive product data */}
        <div className="product-tile">
          <h4>Flavor</h4>
          <p>{product.flavor}</p>
        </div>
        <div className="product-tile">
          <h4>Location</h4>
          <p>{product.location}</p>
        </div>
        <div className="product-tile">
          <h4>Moisture Content</h4>
          <p>{product.moistureContent}%</p>
        </div>
        <div className="product-tile">
          <h4>Caffeine Content</h4>
          <p>{product.caffeineContent}%</p>
        </div>
      </div>

      {/* Display Daily Updates */}
      <h3>Daily Updates</h3>
      <ul>
        {dailyUpdates.map((data, index) => (
          <li key={index}>
            <p><strong>Date:</strong> {new Date(data.date).toLocaleDateString()}</p>
            <p><strong>Moisture Content:</strong> {data.moistureContent}%</p>
            <p><strong>Caffeine Content:</strong> {data.caffeineContent}%</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuthenticatedUserView;
