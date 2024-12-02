const mongoose = require("mongoose");

const DailyDataSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  moistureContent: { type: Number, required: true },
  caffeineContent: { type: Number, required: true },
});

const TeaQualitySchema = new mongoose.Schema({
  batchId: { type: String, required: true, unique: true },
  flavor: { type: String, required: true },
  supplierName: { type: String, required: true },
  location: { type: String, required: true },
  moistureContent: { type: Number, required: true },
  caffeineContent: { type: Number, required: true },
  chemicalComposition: { type: Object, required: false },
  timestamp: { type: Date, default: Date.now },
  dailyData: [DailyDataSchema],  // Array to store daily updates
});

module.exports = mongoose.model("TeaQuality", TeaQualitySchema);
