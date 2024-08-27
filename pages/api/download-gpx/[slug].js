import { getActivityBySlug } from '../../../lib/activities';
import { generateGPXFile } from '../../../lib/generateGpx';

export default async function handler(req, res) {
  const { slug } = req.query;

  try {
    const activity = await getActivityBySlug(slug);
    if (!activity) {
      return res.status(404).json({ message: 'Aktivität nicht gefunden' });
    }

    const gpxString = generateGPXFile(activity);

    res.setHeader('Content-Disposition', `attachment; filename=${slug}.gpx`);
    res.setHeader('Content-Type', 'application/gpx+xml');
    res.status(200).send(gpxString);
  } catch (error) {
    console.error('Fehler beim Generieren der GPX-Datei:', error.message);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
}
