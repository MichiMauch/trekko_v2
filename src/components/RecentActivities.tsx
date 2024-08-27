"use client"
import React, { useEffect, useState } from 'react';
import { getIconForActivity } from './activityIcons';
import RouteMap from './RouteMap';
import { formatDate } from '../utils/dateUtils'; // Import der Funktion
import Link from 'next/link'

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

const RecentActivities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activities');
        const result = await response.json();

        if (result.success) {
          setActivities(result.data);
        } else {
          console.error('Failed to fetch activities');
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, []);

  const formatDistance = (distance: number) => {
    return distance.toFixed(2); // Distanz auf 2 Kommastellen runden
  };

  const formatElevationGain = (elevationGain: number) => {
    return Math.ceil(elevationGain); // Höhe aufrunden
  };

  const formatMovingTime = (movingTime: number) => {
    const hours = Math.floor(movingTime / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((movingTime % 3600) / 60).toString().padStart(2, '0');
    return `${hours}:${minutes} h`; // Formatierung hh:mm h
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
  <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4">
    {activities.slice(0, 5).map((activity) => (
      <div key={activity._id} className="card lg:card-side bg-base-100 shadow-xl border border-gray-300 relative">
        <Link href={`/touren/${activity.slug}`} className="w-full lg:w-1/2 h-64 m-0 p-0 block">
          <figure className="w-full h-full">
            <RouteMap waypoints={activity.waypoints} showZoomControls={false} showAttribution={false} />
          </figure>
        </Link>
        <div className="card-body w-full lg:w-1/2 p-6 pb-0 relative">
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
          <Link href={`/touren/${activity.slug}`} className="card-title font-bold block">
            {activity.name}
          </Link>
          <div className="flex gap-12 mt-4 justify-start">
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
    ))}
  </div>
</div>

  );
};

export default RecentActivities;
