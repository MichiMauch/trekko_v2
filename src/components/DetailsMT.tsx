import React, { useState } from 'react';
import dynamic from 'next/dynamic';

interface Waypoint {
  lat: number;
  lon: number;
  ele: number;
}

const RouteMap = dynamic(() => import('./RouteMap'), {
  ssr: false, // Deaktiviert Server-Side Rendering für Leaflet
});

const ElevationProfile = dynamic(() => import('./ElevationProfile'), {
  ssr: false, // Deaktiviert Server-Side Rendering für Leaflet
});

interface DetailsActivitiesProps {
  waypoints: Waypoint[];
  distance: number; // Füge die tatsächliche Distanz hier hinzu
}

const DetailsActivities: React.FC<DetailsActivitiesProps> = ({ waypoints, distance }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleHoverPoint = (index: number | null) => {
    setHoveredIndex(index);
  };

  return (
    <div className="w-full mx-auto flex flex-col">
      {/* Container für die Karte */}
      <div className="h-[400px] md:h-[400px] lg:h-[400px] mb-2"> {/* Feste Höhe für Desktop und Mobile */}
        <RouteMap
          waypoints={waypoints}
          showZoomControls={true}
          showAttribution={true}
          hoveredIndex={hoveredIndex}
          interactive={true}
        />
      </div>
      {/* Container für das Höhenprofil */}
      <div className="h-[200px] md:h-[300px] lg:h-[300px]"> {/* Feste Höhe für Desktop und Mobile */}
        <ElevationProfile
          waypoints={waypoints}
          distance={distance}
          onHoverPoint={handleHoverPoint}
        />
      </div>
    </div>
  );
};

export default DetailsActivities;
