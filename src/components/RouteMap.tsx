import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Waypoint {
  lat: number;
  lon: number;
}

interface Stage {
  waypoints: Waypoint[];
}

interface RouteMapProps {
  waypoints?: Waypoint[];
  stages?: Stage[]; // Neue Prop für die Stages
  showZoomControls?: boolean;
  showAttribution?: boolean;
  hoveredIndex?: number | null;
  interactive?: boolean;
}

const RouteMap: React.FC<RouteMapProps> = ({ 
  waypoints = [], 
  stages = [], 
  showZoomControls = false, 
  showAttribution = false, 
  hoveredIndex = null, 
  interactive = false 
}) => {
  // Wenn "stages" vorhanden ist, dann werden die Polylinien separat für jede Stage gerendert
  const polylines = stages.length > 0 
    ? stages.map(stage => stage.waypoints.map(point => [point.lat, point.lon] as LatLngTuple))
    : [waypoints.map(point => [point.lat, point.lon] as LatLngTuple)];

  const [zoom, setZoom] = useState<number | null>(null);
  const [center, setCenter] = useState<LatLngTuple | null>(null);

  const MapWithBounds: React.FC = () => {
    const map = useMap();

    useEffect(() => {
      if (polylines.length > 0 && zoom === null && center === null) {
        const allPoints = polylines.flat();
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds); // Set the initial bounds to fit all routes
        setZoom(map.getZoom());
        setCenter(map.getCenter() as unknown as LatLngTuple);
      }

      map.on('zoomend', () => {
        setZoom(map.getZoom());
      });

      map.on('moveend', () => {
        setCenter(map.getCenter() as unknown as LatLngTuple);
      });

    }, [map]);

    return null;
  };

  return (
    <MapContainer
      center={center || [0, 0]}
      zoom={zoom || 13}
      scrollWheelZoom={interactive}
      zoomControl={showZoomControls}
      attributionControl={showAttribution}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
      />
      {polylines.map((polyline, idx) => (
        <Polyline key={idx} pathOptions={{ color: 'red' }} positions={polyline} />
      ))}
      {interactive && hoveredIndex !== null && (
        <CircleMarker
          center={polylines.flat()[hoveredIndex]}
          radius={6}
          fillColor="blue"
          color="blue"
        />
      )}
      <MapWithBounds />
    </MapContainer>
  );
};

export default RouteMap;
