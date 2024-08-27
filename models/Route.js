import mongoose from 'mongoose';

const RouteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true, // stellt sicher, dass jeder Slug einzigartig ist
  },
  date: {
    type: Number, // Unix-Timestamp für das Datum
    required: true,
  },
  startTime: {
    type: Number, // Unix-Timestamp
    required: true,
  },
  endTime: {
    type: Number, // Unix-Timestamp
    required: true,
  },
  duration: {
    type: Number, // in Sekunden
    required: true,
  },
  distance: {
    type: Number, // in Kilometern
    required: true,
  },
  movingTime: {
    type: Number, // in Sekunden
    required: true,
  },
  elevationGain: {
    type: Number, // in Metern
    required: true,
  },
  elevationLoss: {
    type: Number, // in Metern
    required: true,
  },
  startCoords: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  endCoords: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  startLocation: {
    city: { type: String, required: true },
    countryCode2: { type: String, required: true },
  },
  endLocation: {
    city: { type: String, required: true },
    countryCode2: { type: String, required: true },
  },
  waypoints: [
    {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
      ele: { type: Number },
      time: { type: String, required: true },
    },
  ],
  keyword: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
});

// Middleware, die vor dem Speichern des Dokuments den Slug generiert
RouteSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/ä/g, 'ae') // Ersetzt ä durch ae
      .replace(/ö/g, 'oe') // Ersetzt ö durch oe
      .replace(/ü/g, 'ue') // Ersetzt ü durch ue
      .replace(/ß/g, 'ss') // Ersetzt ß durch ss
      .replace(/[^a-z0-9]+/g, '-')  // Ersetzt nicht-alphanumerische Zeichen durch Bindestriche
      .replace(/(^-|-$)/g, '');     // Entfernt führende oder nachgestellte Bindestriche
  }
  next();
});


export default mongoose.models.Route || mongoose.model('Route', RouteSchema);
