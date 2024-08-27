// models/MultiDayTour.js

import mongoose from 'mongoose';

const MultiDayTourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  keyword: { type: String, required: true, unique: true },
  totalDistance: { type: Number, default: 0 },
  totalElevationGain: { type: Number, default: 0 },
  totalElevationLoss: { type: Number, default: 0 },
  numberOfStages: { type: Number, default: 0 },
  totalMovingTime: { type: Number, default: 0 }, // Neues Feld hinzugefügt
  period: { type: String }, // Feld für den Zeitraum
  stages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route', // Bezug zu einzelnen Tagesetappen
    },
  ],
});

export default mongoose.models.MultiDayTour || mongoose.model('MultiDayTour', MultiDayTourSchema);
