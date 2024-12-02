const mongoose = require('mongoose');

const TeaQualitySchema = new mongoose.Schema({
    batchId: { type: String, required: true, unique: true },
    flavor: { type: String, required: true },
    supplierName: { type: String, required: true },
    location: { type: String, required: true },
    moistureContent: { type: Number, required: true },
    caffeineContent: { type: Number, required: true },
    chemicalComposition: { type: Object, required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TeaQuality', TeaQualitySchema);
