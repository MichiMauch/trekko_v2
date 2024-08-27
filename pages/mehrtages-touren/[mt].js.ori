import dbConnect from '../../lib/dbConnect';
import MultiDayTour from '../../models/MultiDayTour';
import dynamic from 'next/dynamic';

// Dynamischer Import der RouteMap-Komponente
const RouteMap = dynamic(() => import('../../src/components/RouteMap'), {
  ssr: false, // Server-side Rendering deaktivieren
});

// Funktion zum Formatieren des Datums in tt.mm.jjjj
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

// Funktion zum Formatieren der Zeit in hh:mm:ss
const formatTime = (seconds) => {
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${secs}`;
};

export default function MultiDayTourPage({ tour }) {
  if (!tour) {
    return <div>Tour not found</div>;
  }

  // Zeitraum formatieren
  const period = tour?.period ? JSON.parse(tour.period) : null;
  const formattedPeriod = period ? `${formatDate(period.start)} - ${formatDate(period.end)}` : 'N/A';

  // Bewegungszeit formatieren
  const formattedMovingTime = tour?.totalMovingTime ? formatTime(tour.totalMovingTime) : 'N/A';

  return (
    <div>
      <h1>{tour.name}</h1>
      <p>Period: {formattedPeriod}</p> {/* Zeitraum anzeigen */}
      <p>Total Distance: {tour.totalDistance} km</p>
      <p>Total Moving Time: {formattedMovingTime}</p>
      <p>Total Elevation Gain: {tour.totalElevationGain} m</p>
      <p>Total Elevation Loss: {tour.totalElevationLoss} m</p>
      <p>Number of Stages: {tour.numberOfStages}</p>
      
      {/* RouteMap mit allen Waypoints als separate Polylinien */}
      <div style={{ height: '500px', width: '100%', marginBottom: '20px' }}>
        <RouteMap stages={tour.stages} showZoomControls={true} interactive={true} />
      </div>

      <h2>Stages:</h2>
      <ul>
        {tour.stages.map((stage, index) => (
          <li key={index}>
            <h3>{stage.name} - {stage.distance} km</h3>
            {/* Individuelle Karte für jede Stage */}
            <div style={{ height: '300px', width: '100%', marginBottom: '20px' }}>
              <RouteMap waypoints={stage.waypoints} showZoomControls={true} interactive={true} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getStaticPaths() {
  await dbConnect();
  const tours = await MultiDayTour.find({});
  const paths = tours.map(tour => ({
    params: { mt: tour.keyword.toLowerCase() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  await dbConnect();
  const tour = await MultiDayTour.findOne({ keyword: params.mt }).populate('stages');

  if (!tour) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      tour: JSON.parse(JSON.stringify(tour)),
    },
  };
}
