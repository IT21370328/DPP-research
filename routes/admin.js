const express = require('express');
const router = express.Router();
const TeaQuality = require('../models/TeaQuality');
const QRCode = require('qrcode'); // Import QR code generation library
const { web3, contract } = require('../product-passport/src/utils/web3Setup'); // Ensure correct import path for web3Setup


// Middleware for admin authentication
// Uncomment if needed.
/*const adminAuth = (req, res, next) => {
  const { username, password } = req.headers;
  if (username === 'admin' && password === 'password123') {
    next(); // User is authorized, continue to the next middleware
  } else {
    res.status(401).json({ message: 'Unauthorized' }); // Unauthorized access
  }
};

router.use(adminAuth);*/

//Add new tea quality data with QR code generation and sending sensitive data to blockchain
router.post('/add', async (req, res) => {
  try {
    const { batchId, flavor, supplierName, location, caffeineContent, moistureContent } = req.body;

    //Generate QR Code
    const qrData = `Batch ID: ${batchId}\nName: ${flavor}\nSupplier: ${supplierName}`;
    const qrCode = await QRCode.toDataURL(qrData); // Generate Base64 QR code

    //Save tea quality data to MongoDB
    const newTeaQuality = new TeaQuality({
      batchId,
      flavor,
      supplierName,
      location,
      caffeineContent,
      moistureContent,
      qrCode, // Save the QR code in the database
    });

    const savedData = await newTeaQuality.save();

    //Send sensitive data to blockchain (only batchId and supplierName)
    const sensitiveData = {
      batchId: savedData.batchId,
      supplierName: savedData.supplierName,
    };

    //Get the account to send the transaction from
    const accounts = await web3.eth.getAccounts();

    //Send the sensitive data to blockchain
    const tx = contract.methods.addSensitiveData(
      sensitiveData.batchId,
      sensitiveData.supplierName
    );
    const gas = await tx.estimateGas({ from: accounts[0] });
    const gasPrice = await web3.eth.getGasPrice();

    const txData = {
      from: accounts[0],
      to: process.env.CONTRACT_ADDRESS,
      data: tx.encodeABI(),
      gas,
      gasPrice,
    };

    const signedTx = await web3.eth.accounts.signTransaction(txData, process.env.PRIVATE_KEY);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    // Step 4: Send response to client with both MongoDB and blockchain details
    res.status(201).json({
      message: 'Product added successfully!',
      savedData,
      blockchainReceipt: receipt, // Include blockchain transaction receipt for logging
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// In your admin.js or route handler file:
router.get('/get-product/:batchId', async (req, res) => {
  try {
    const { batchId } = req.params;

    // Retrieve product from the blockchain using getProduct
    const product = await contract.methods.getProduct(batchId).call();

    res.status(200).json({
      batchId: product[0],
      supplierName: product[1],
      timestamp: product[2]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//Add new tea quality data with QR code generation
router.post('/add', async (req, res) => {
  try {
    const { batchId, flavor, supplierName, location, caffeineContent, moistureContent } = req.body;

    //Generate QR Code
    const qrData = `Batch ID: ${batchId}\nName: ${flavor}\nSupplier: ${supplierName}`;
    const qrCode = await QRCode.toDataURL(qrData); // Generate Base64 QR code

    //Create a new tea quality record
    const newTeaQuality = new TeaQuality({
      batchId,
      flavor,
      supplierName,
      location,
      caffeineContent,
      moistureContent,
      qrCode, // Save the QR code in the database
    });

    const savedData = await newTeaQuality.save();
    res.status(201).json(savedData); // Return the saved data
  } catch (error) {
    res.status(400).json({ error: error.message }); // Error handling for invalid data
  }
});

// READ: Get all tea quality data
router.get('/', async (req, res) => {
  try {
    const teaData = await TeaQuality.find(); // Retrieve all tea quality records
    res.status(200).json(teaData); // Return the data as JSON
  } catch (error) {
    res.status(500).json({ error: error.message }); // Error handling if data retrieval fails
  }
});

// READ: Get tea quality data by batchId (for ProductDetails page)
router.get('/:batchId', async (req, res) => {
  try {
    const product = await TeaQuality.findOne({ batchId: req.params.batchId }); // Find product by batchId
    if (!product) {
      return res.status(404).json({ message: 'Product not found' }); // Product not found
    }
    res.status(200).json(product); // Return the product details as JSON
  } catch (error) {
    res.status(500).json({ error: error.message }); // Error handling
  }
});

// UPDATE: Update tea quality data by batchId
router.put('/:batchId', async (req, res) => {
  try {
    const updatedData = await TeaQuality.findOneAndUpdate(
      { batchId: req.params.batchId }, // Search by batchId
      req.body, // Update with the new data
      { new: true } // Return the updated document
    );
    if (!updatedData) {
      return res.status(404).json({ message: 'Product not found' }); // If product not found
    }
    res.status(200).json(updatedData); // Return updated product data
  } catch (error) {
    res.status(400).json({ error: error.message }); // Error handling
  }
});

// DELETE: Delete tea quality data by batchId
router.delete('/:batchId', async (req, res) => {
  try {
    // Find and delete the product by batchId
    const deletedProduct = await TeaQuality.findOneAndDelete({ batchId: req.params.batchId });
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' }); // If product not found
    }
    res.status(200).json({ message: 'Record deleted successfully' }); // Successfully deleted
  } catch (error) {
    res.status(500).json({ error: error.message }); // Error handling
  }
});


// Endpoint to add daily data for a product (by batchId)
router.post('/add-daily/:batchId', async (req, res) => {
  const { batchId } = req.params;
  const { moistureContent, caffeineContent } = req.body;

  try {
    const product = await TeaQuality.findOne({ batchId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const dailyData = { moistureContent, caffeineContent };

    // Add new daily data to the product
    product.dailyData.push(dailyData);
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to fetch daily data for a product (by batchId)
router.get('/daily/:batchId', async (req, res) => {
  const { batchId } = req.params;

  try {
    const product = await TeaQuality.findOne({ batchId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product.dailyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
