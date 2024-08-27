import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getIconForActivity } from './activityIcons';
import RouteMap from './RouteMap';
import Pagination from './Pagination'; // Importiere die Pagination-Komponente
import Link from 'next/link';


interface Activity {
  slug: any;
  _id: string;
  name: string;
  type: string;
  date: number;
  startTime: number;
  startLocation: {
    city: string;
    countryCode2: string;
  };
  waypoints: { lat: number; lon: number }[];
  distance: number;
  movingTime: number;
  elevationGain: number;
  // Weitere Felder, falls nötig
}

const OverviewActivities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0); // Gesamtanzahl der Einträge in der DB
  const itemsPerPage = 9; // Anzahl der Aktivitäten pro Seite
  const [totalPages, setTotalPages] = useState(0);

  const router = useRouter();
  
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activities');
        const result = await response.json();

        if (result.success) {
          setActivities(result.data);
          setTotalEntries(result.data.length); // Gesamtanzahl der Einträge setzen
          setTotalPages(Math.ceil(result.data.length / itemsPerPage)); // Total Pages berechnen
        } else {
          console.error('Failed to fetch activities');
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    const pageFromUrl = router.query.page ? parseInt(router.query.page as string) : 1;
    setCurrentPage(pageFromUrl);
  }, [router.query.page]);

  const currentActivities = activities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1) {
      page = 1;
    } else if (page > totalPages) {
      page = totalPages;
    }
    
    setCurrentPage(page);
    router.push(`?page=${page}`, undefined, { shallow: true }); // Aktualisiere die URL, ohne die Seite neu zu laden
  };

  const formatDistance = (distance: number) => {
    return distance.toFixed(2);
  };

  const formatElevationGain = (elevationGain: number) => {
    return Math.ceil(elevationGain);
  };

  const formatMovingTime = (movingTime: number) => {
    const hours = Math.floor(movingTime / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((movingTime % 3600) / 60).toString().padStart(2, '0');
    return `${hours}:${minutes} h`;
  };

  const formatDetailedDate = (timestamp: number, city: string, countryCode: string, startTime: number) => {
    const now = new Date();
    const date = new Date(timestamp * 1000);
    const time = new Date(startTime * 1000).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
  
    const formattedDate = isToday
      ? `Heute um ${time}`
      : isYesterday
      ? `Gestern um ${time}`
      : `Am ${date.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })} um ${time}`;
    
    return `${formattedDate} in ${city}, ${countryCode.toUpperCase()}`;
  };

  return (
    <div className="max-w-screen-xl mx-auto mb-4 sm:mb-0 px-0 sm:px-4 lg:px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentActivities.map((activity) => (
          <div key={activity._id} className="card bg-base-100 shadow-xl border border-gray-300 relative">
            <Link href={`/touren/${activity.slug}`} passHref>
              <figure className="w-full h-64 m-0 p-0 cursor-pointer">
                <RouteMap waypoints={activity.waypoints} showZoomControls={false} showAttribution={false} />
              </figure>
            </Link>
            <div className="card-body w-full p-6 pb-0 relative flex flex-col justify-between">
              <div>
                <span className="absolute top-3 right-3" style={{ color: 'var(--primary-color)' }}>
                  {getIconForActivity(activity.type)}
                </span>
                <span className="text-gray-500 text-sm">
                  {formatDetailedDate(
                    activity.date,
                    activity.startLocation.city,
                    activity.startLocation.countryCode2,
                    activity.startTime
                  )}
                </span>
                <Link href={`/touren/${activity.slug}`} passHref>
                  <h2 className="card-title font-bold mt-2 cursor-pointer">{activity.name}</h2>
                </Link>
              </div>
              <div className="mt-auto">
                <div className="flex gap-12 mb-4 mt-4 justify-start">
                  <div className="text-left w-auto flex-shrink-0">
                    <p className="text-sm text-gray-500">Distanz</p>
                    <p className="text-lg font-semibold">
                      {formatDistance(activity.distance)} km
                    </p>
                  </div>
                  <div className="text-left w-auto flex-shrink-0">
                    <p className="text-sm text-gray-500">Höhenmeter</p>
                    <p className="text-lg font-semibold">
                      {formatElevationGain(activity.elevationGain)} m
                    </p>
                  </div>
                  <div className="text-left w-auto flex-shrink-0">
                    <p className="text-sm text-gray-500">Zeit</p>
                    <p className="text-lg font-semibold">
                      {formatMovingTime(activity.movingTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center items-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default OverviewActivities;