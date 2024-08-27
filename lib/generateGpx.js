const { buildGPX, GarminBuilder } = require('gpx-builder');
const { Point } = GarminBuilder.MODELS;

export const generateGPXFile = (activity) => {
  try {
    const gpxData = new GarminBuilder();

    const points = activity.waypoints.map(waypoint => {
      const date = new Date(waypoint.time); // Verwende direkt den ISO 8601-String

      if (isNaN(date.getTime())) {
        console.error('Ungültiger Zeitwert:', waypoint.time);
        throw new Error(`Ungültiger Zeitwert: ${waypoint.time}`);
      }

      return new Point(waypoint.lat, waypoint.lon, {
        ele: waypoint.ele,
        time: date,
      });
    });

    gpxData.setSegmentPoints(points);

    return buildGPX(gpxData.toObject());
  } catch (error) {
    console.error('Fehler beim Erstellen der GPX-Datei:', error.message);
    throw new Error('GPX-Datei konnte nicht generiert werden');
  }
};
