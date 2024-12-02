const express = require('express');
const router = express.Router();
const TeaQuality = require('../models/TeaQuality');

// READ: Get specific fields for consumers
router.get('/', async (req, res) => {
    try {
        const consumerData = await TeaQuality.find({}, 'batchId flavor supplierName location');
        res.status(200).json(consumerData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
