import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScanner = ({ onScanSuccess, onScanFailure }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-scanner",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    // Callback for successful scan
    const handleScanSuccess = (decodedText) => {
      console.log("Scanned QR Code:", decodedText);
      onScanSuccess(decodedText);
      scanner.clear();
    };

    // Callback for scan failure
    const handleScanFailure = (error) => {
      if (onScanFailure) {
        onScanFailure(error);
      }
    };

    scanner.render(handleScanSuccess, handleScanFailure);

    // Cleanup scanner on unmount
    return () => {
      scanner.clear();
    };
  }, [onScanSuccess, onScanFailure]);

  return (
    <div>
      <h2>Scan QR Code</h2>
      <div id="qr-scanner" style={{ width: "100%" }}></div>
    </div>
  );
};

export default QRScanner;
