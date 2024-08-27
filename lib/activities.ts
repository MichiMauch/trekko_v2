import dbConnect from './dbConnect';
import Route from '../models/Route';

interface Activity {
  duration: number;
  elevationLoss: number;
  endLocation: { city: string; countryCode2: string; };
  endTime: number;
  _id: string;
  name: string;
  type: string;
  date: number;
  startTime: number;
  startLocation: {
    city: string;
    countryCode2: string;
  };
  waypoints: { lat: number; lon: number; _id?: string }[]; // Wegpunkte, optionales _id-Feld
  distance: number;
  movingTime: number;
  elevationGain: number;
  slug: string; // Neu hinzugefügt für die Slug-Verwendung
}

// Funktion, um alle Slugs abzurufen
export async function getAllActivitySlugs(): Promise<string[]> {
  await dbConnect();
  const activities = await Route.find({}, 'slug').lean();

  // Erzwinge den Typ von 'activities' als Array von Objekten, die ein 'slug'-Feld enthalten
  return (activities as unknown as { slug: string }[]).map((activity) => activity.slug);
}

// Funktion, um eine Aktivität anhand des Slugs abzurufen
export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  await dbConnect();
  
  const activity = await Route.findOne({ slug }).lean() as Activity | null;
  if (!activity) return null;

  // Konvertiere das _id-Feld der Hauptaktivität in eine Zeichenkette
  activity._id = activity._id.toString();

  // Konvertiere _id-Felder in den Wegpunkten in Zeichenketten (oder entferne sie)
  activity.waypoints = activity.waypoints.map((waypoint: any) => {
    return {
      ...waypoint,
      _id: waypoint._id ? waypoint._id.toString() : undefined,
    };
  });

  return activity;
}
