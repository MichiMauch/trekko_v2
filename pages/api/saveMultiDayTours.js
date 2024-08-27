import dbConnect from '../../lib/dbConnect';
import MultiDayTour from '../../models/MultiDayTour';
import Route from '../../models/Route'; // Modell für die einzelnen Tagestouren

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const tours = req.body.tours;

      // Loop über jede Tour und erstelle die Mehrtagestour
      for (const tour of tours) {
        const { name } = tour;
        const keyword = name; // Verwende den Namen als Keyword

        // Suche nach allen Tagestouren mit dem gleichen Keyword
        const matchingTours = await Route.find({ keyword });

        if (!matchingTours.length) {
          return res.status(404).json({ success: false, message: `No tours found with the keyword ${keyword}.` });
        }

        // Berechne die Periode (Zeitraum)
        const dates = matchingTours.map(tour => tour.date);
        const startDate = new Date(Math.min(...dates) * 1000); // Kleinster Zeitstempel
        const endDate = new Date(Math.max(...dates) * 1000);   // Größter Zeitstempel
        const period = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

        // Berechne andere aggregierte Felder
        const totalDistance = matchingTours.reduce((acc, tour) => acc + tour.distance, 0);
        const totalElevationGain = matchingTours.reduce((acc, tour) => acc + tour.elevationGain, 0);
        const totalElevationLoss = matchingTours.reduce((acc, tour) => acc + tour.elevationLoss, 0);
        const totalMovingTime = matchingTours.reduce((acc, tour) => acc + tour.movingTime, 0);

        // Erstelle eine neue Mehrtagestour
        const multiDayTour = new MultiDayTour({
          name,
          keyword,
          totalDistance,
          totalElevationGain,
          totalElevationLoss,
          numberOfStages: matchingTours.length,
          totalMovingTime,
          period, // Speichere den berechneten Zeitraum
          stages: matchingTours.map(tour => tour._id),
        });

        await multiDayTour.save();
      }

      res.status(201).json({ success: true, message: 'Multi-day tours saved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error saving multi-day tours.' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
