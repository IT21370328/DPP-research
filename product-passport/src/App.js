import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/Admin"; 
import AddProductForm from "./pages/AddProduct";
import ProductDetails from "./pages/ProductDetails";
import Navbar from "./components/Navbar";
import UserView from "./pages/UserView";
import QRScanner from "./components/QRScanner";
import AuthenticatedUserView from "./pages/AuthenticatedUserView";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<QRScanner />} />
        <Route path="/admin" element={<AdminDashboard />} /> {/* Admin Dashboard */}
        <Route path="/add-product" element={<AddProductForm />} />
        <Route path="/product/:batchId" element={<ProductDetails />} /> {/* Product Details */}
        <Route path="/userview/:batchId" element={<UserView />} />
        <Route path="/authorized/:batchId" element={<AuthenticatedUserView />} />
        

      </Routes>
    </Router>
  );
}

export default App;
