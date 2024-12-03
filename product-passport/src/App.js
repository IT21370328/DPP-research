import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/Admin"; 
import Consumer from "./pages/Consumer";
import AddProductForm from "./pages/AddProduct";
import ProductDetails from "./pages/ProductDetails";
import Navbar from "./components/Navbar";
import UserView from "./pages/UserView";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Consumer />} />
        <Route path="/admin" element={<AdminDashboard />} /> {/* Admin Dashboard */}
        <Route path="/add-product" element={<AddProductForm />} />
        <Route path="/product/:batchId" element={<ProductDetails />} /> {/* Product Details */}
        <Route path="/:batchId" element={<UserView/>} />

      </Routes>
    </Router>
  );
}

export default App;
