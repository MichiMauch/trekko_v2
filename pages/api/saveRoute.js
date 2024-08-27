import dbConnect from '../../lib/dbConnect';
import Tour from '../../models/Route';
import MultiDayTour from '../../models/MultiDayTour';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const {
        name,
        date,
        startTime,
        endTime,
        duration,
        distance,
        movingTime,
        elevationGain,
        elevationLoss,
        startCoords,
        endCoords,
        startLocation,
        endLocation,
        waypoints,
        keyword,
        type,
      } = req.body;

      // Neue Tour speichern
      const newTour = new Tour({
        name,
        date,
        startTime,
        endTime,
        duration,
        distance,
        movingTime,
        elevationGain,
        elevationLoss,
        startCoords,
        endCoords,
        startLocation,
        endLocation,
        waypoints,
        keyword,
        type,
      });

      await newTour.save();

      // Überprüfen, ob eine Mehrtagestour mit demselben Keyword existiert
      const existingMultiDayTour = await MultiDayTour.findOne({ keyword });

      if (existingMultiDayTour) {
        // Alle Routen mit dem gleichen Keyword finden
        const matchingTours = await Tour.find({ keyword });

        // Summiere die Distanzen, Höhenmeter und Bewegungszeiten
        const totalDistance = matchingTours.reduce((acc, tour) => acc + tour.distance, 0);
        const totalElevationGain = matchingTours.reduce((acc, tour) => acc + tour.elevationGain, 0);
        const totalElevationLoss = matchingTours.reduce((acc, tour) => acc + tour.elevationLoss, 0);
        const totalMovingTime = matchingTours.reduce((acc, tour) => acc + tour.movingTime, 0);

        // Finde das früheste und späteste Datum
        const periodStart = Math.min(...matchingTours.map(tour => tour.date));
        const periodEnd = Math.max(...matchingTours.map(tour => tour.date));
        const period = JSON.stringify({ start: periodStart, end: periodEnd }); // period in String umwandeln

        // Aktualisiere die bestehende Mehrtagestour
        existingMultiDayTour.totalDistance = totalDistance;
        existingMultiDayTour.totalElevationGain = totalElevationGain;
        existingMultiDayTour.totalElevationLoss = totalElevationLoss;
        existingMultiDayTour.totalMovingTime = totalMovingTime;
        existingMultiDayTour.numberOfStages = matchingTours.length;
        existingMultiDayTour.stages = matchingTours.map(tour => tour._id);
        existingMultiDayTour.period = period;

        await existingMultiDayTour.save();
      } else {
        // Wenn keine Mehrtagestour existiert, erstelle eine neue
        const period = JSON.stringify({ start: date, end: date }); // period in String umwandeln
        const newMultiDayTour = new MultiDayTour({
          name: keyword, // Verwende das Keyword als Namen
          keyword,
          totalDistance: distance,
          totalElevationGain: elevationGain,
          totalElevationLoss: elevationLoss,
          totalMovingTime: movingTime,
          numberOfStages: 1,
          stages: [newTour._id],
          period, // period hinzufügen
        });

        await newMultiDayTour.save();
      }

      res.status(201).json({ success: true, message: 'Route saved and multi-day tour updated if necessary' });
    } catch (error) {
      console.error('Error saving route and updating multi-day tour:', error);
      res.status(500).json({ success: false, message: 'Error saving route and updating multi-day tour.' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
