import React from "react";
import QRScanner from "./QRScanner";
import { useNavigate } from "react-router-dom";

const ProductScanner = () => {
  const navigate = useNavigate();

  const handleScanSuccess = (decodedText) => {
    console.log("Scanned QR Code:", decodedText);
    // Redirect to the scanned URL or process the decodedText
    navigate(decodedText); // Assuming the QR code contains a valid path, e.g., /userview/:batchId
  };

  const handleScanFailure = (error) => {
    console.error("Scan failed:", error);
  };

  return (
    <div>
      <h1>Product Scanner</h1>
      <QRScanner onScanSuccess={handleScanSuccess} onScanFailure={handleScanFailure} />
    </div>
  );
};

export default ProductScanner;
