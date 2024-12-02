const express = require('express');
const router = express.Router();
const TeaQuality = require('../models/TeaQuality');

// Middleware for admin authentication
const adminAuth = (req, res, next) => {
    const { username, password } = req.headers;
    if (username === 'admin' && password === 'password123') {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// Apply admin authentication middleware to all routes
router.use(adminAuth);

// CREATE: Add new tea quality data
router.post('/add', async (req, res) => {
    try {
        const newTeaQuality = new TeaQuality(req.body);
        const savedData = await newTeaQuality.save();
        res.status(201).json(savedData);
    } catch (error) {
        res.status(400).json({ error: error.message });
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

// UPDATE: Update tea quality data by batchId
router.put('/:batchId', async (req, res) => {
    try {
        const updatedData = await TeaQuality.findOneAndUpdate(
            { batchId: req.params.batchId },
            req.body,
            { new: true }
        );
        res.status(200).json(updatedData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE: Delete tea quality data by batchId
router.delete('/:batchId', async (req, res) => {
    try {
        await TeaQuality.findOneAndDelete({ batchId: req.params.batchId });
        res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
