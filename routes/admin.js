const express = require('express');
const router = express.Router();
const TeaQuality = require('../models/TeaQuality');
const QRCode = require('qrcode'); 
const { web3, contract } = require('../product-passport/src/utils/web3Setup'); 

// Middleware for admin authentication
/* Uncomment and configure if needed
router.use((req, res, next) => {
  const { username, password } = req.headers;
  if (username === 'admin' && password === 'password123') {
    next(); // Authorized access
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});
*/

// CREATE: Add new tea quality data with QR code generation and blockchain integration
router.post('/add', async (req, res) => {
  try {
    const { batchId, flavor, supplierName, location, caffeineContent, moistureContent } = req.body;

    // Generate a QR Code pointing to the UserView page with the batchId
    const qrUrl = `http://192.168.1.3:3000/userview/${batchId}`; // Update URL as per deployment
    const qrCode = await QRCode.toDataURL(qrUrl);

    // Save tea quality data to MongoDB
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

    // Send sensitive data to blockchain
    const sensitiveData = { batchId: savedData.batchId, supplierName: savedData.supplierName };
    const accounts = await web3.eth.getAccounts();
    const tx = contract.methods.addSensitiveData(sensitiveData.batchId, sensitiveData.supplierName);
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

    // Respond with MongoDB and blockchain details
    res.status(201).json({
      message: 'Product added successfully!',
      savedData,
      blockchainReceipt: receipt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ: Get all tea quality data
router.get('/', async (req, res) => {
  try {
    const teaData = await TeaQuality.find();
    res.status(200).json(teaData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ: Get product details by batchId
router.get('/:batchId', async (req, res) => {
  try {
    const product = await TeaQuality.findOne({ batchId: req.params.batchId });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Fetch product data from blockchain
router.get('/get-product/:batchId', async (req, res) => {
  try {
    const { batchId } = req.params;
    const product = await contract.methods.getProduct(batchId).call();
    res.status(200).json({
      batchId: product[0],
      supplierName: product[1],
      timestamp: product[2],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE: Update tea quality data
router.put('/:batchId', async (req, res) => {
  try {
    const updatedData = await TeaQuality.findOneAndUpdate(
      { batchId: req.params.batchId },
      req.body,
      { new: true }
    );
    if (!updatedData) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Delete a product by batchId
router.delete('/:batchId', async (req, res) => {
  try {
    const deletedProduct = await TeaQuality.findOneAndDelete({ batchId: req.params.batchId });
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD: Add daily updates for a product
router.post('/add-daily/:batchId', async (req, res) => {
  const { batchId } = req.params;
  const { moistureContent, caffeineContent } = req.body;

  try {
    const product = await TeaQuality.findOne({ batchId });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const dailyData = { moistureContent, caffeineContent };
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
    const product = await TeaQuality.findOne({ batchId }); // Fetch the product
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product.dailyData); // Return daily data
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Example route for authentication in your backend
router.post('/authenticate', (req, res) => {
  const { username, password } = req.body;

  const correctUsername = 'admin'; // Dummy username
  const correctPassword = 'password123'; // Dummy password

  if (username === correctUsername && password === correctPassword) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});


module.exports = router;
