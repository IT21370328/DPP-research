const express = require('express');
const router = express.Router();
const TeaQuality = require('../models/TeaQuality');

// Middleware for admin authentication
// You can uncomment this section to use authentication.
/*const adminAuth = (req, res, next) => {
  const { username, password } = req.headers;
  if (username === 'admin' && password === 'password123') {
    next(); // User is authorized, continue to the next middleware
  } else {
    res.status(401).json({ message: 'Unauthorized' }); // Unauthorized access
  }
};

router.use(adminAuth);*/

// CREATE: Add new tea quality data
router.post('/add', async (req, res) => {
  try {
    const newTeaQuality = new TeaQuality(req.body);
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
    const deletedProduct = await TeaQuality.findOneAndDelete({ batchId: req.params.batchId }); // Delete by batchId
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' }); // If product not found
    }
    res.status(200).json({ message: 'Record deleted successfully' }); // Successfully deleted
  } catch (error) {
    res.status(500).json({ error: error.message }); // Error handling
  }
});

// Endpoint to add daily data for a product (by batchId)
router.post("/add-daily/:batchId", async (req, res) => {
  const { batchId } = req.params;
  const { moistureContent, caffeineContent } = req.body;

  try {
    const product = await TeaQuality.findOne({ batchId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
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
router.get("/daily/:batchId", async (req, res) => {
  const { batchId } = req.params;

  try {
    const product = await TeaQuality.findOne({ batchId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product.dailyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
