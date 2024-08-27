import { useState, useEffect } from 'react';
import { getLocationFromCoords } from '../../lib/geolocation';

const AdminPage = () => {
  // State-Variablen
  const [name, setName] = useState('');
  const [type, setType] = useState(''); // State für den Type
  const [date, setDate] = useState(null); // Unix-Timestamp für das Datum
  const [duration, setDuration] = useState(0); // in Sekunden
  const [startTime, setStartTime] = useState(null); // Unix-Timestamp für Startzeit
  const [endTime, setEndTime] = useState(null); // Unix-Timestamp für Endzeit
  const [distance, setDistance] = useState(0);
  const [movingTime, setMovingTime] = useState(0); // in Sekunden
  const [elevationGain, setElevationGain] = useState(0);
  const [elevationLoss, setElevationLoss] = useState(0);
  const [startCoords, setStartCoords] = useState({ latitude: null, longitude: null });
  const [endCoords, setEndCoords] = useState({ latitude: null, longitude: null });
  const [startLocation, setStartLocation] = useState({ city: '', countryCode2: '' });
  const [endLocation, setEndLocation] = useState({ city: '', countryCode2: '' });
  const [statusMessage, setStatusMessage] = useState(''); // Status-Text initial leer
  const [waypoints, setWaypoints] = useState([]);
  const [originalStartTime, setOriginalStartTime] = useState(''); // Original-Startzeit
  const [originalEndTime, setOriginalEndTime] = useState(''); // Original-Endzeit
  const [originalDuration, setOriginalDuration] = useState(''); // Original-Dauer
  const [isLocationFetched, setIsLocationFetched] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Status der Speicherung
  const [keyword, setKeyword] = useState(''); // State für das Stichwort

  const handleFileUpload = async (event) => {
    setStatusMessage(''); // Status-Text zurücksetzen, wenn ein neues File hochgeladen wird
    const file = event.target.files[0];
    if (file) {
      const text = await file.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'application/xml');

      const trackName = xmlDoc.getElementsByTagName('name')[0]?.textContent || 'No Name';
      setName(trackName);

      const trackType = xmlDoc.getElementsByTagName('type')[0]?.textContent || 'unknown';
      setType(trackType); // Setzt den ausgelesenen Typ

      const trackPoints = xmlDoc.getElementsByTagName('trkpt');
      let startDateTime, endDateTime;
      let totalDistance = 0;
      let totalMovingTime = 0;
      let totalElevationGain = 0;
      let totalElevationLoss = 0;
      let prevLat, prevLon, prevTime, prevEle;
      let startLat, startLon, endLat, endLon;
      const collectedWaypoints = [];

      for (let i = 0; i < trackPoints.length; i += 10) {
        const timeElement = trackPoints[i].getElementsByTagName('time')[0];
        const lat = parseFloat(trackPoints[i].getAttribute('lat'));
        const lon = parseFloat(trackPoints[i].getAttribute('lon'));
        const eleElement = trackPoints[i].getElementsByTagName('ele')[0];
        const ele = eleElement ? parseFloat(eleElement.textContent) : null;

        if (timeElement) {
          const time = new Date(timeElement.textContent);
          if (!startDateTime) {
            startDateTime = time;
            setStartTime(Math.floor(startDateTime.getTime() / 1000));
            setDate(Math.floor(new Date(timeElement.textContent).setHours(0, 0, 0, 0) / 1000));
            setStartCoords({ latitude: lat, longitude: lon });
            startLat = lat;
            startLon = lon;
            setOriginalStartTime(timeElement.textContent);
          }
          endDateTime = time;
          setEndCoords({ latitude: lat, longitude: lon });
          setEndTime(Math.floor(endDateTime.getTime() / 1000));
          endLat = lat;
          endLon = lon;
          setOriginalEndTime(timeElement.textContent);

          collectedWaypoints.push({
            lat,
            lon,
            ele,
            time: time.toISOString(),
          });

          if (prevLat !== undefined && prevLon !== undefined && prevTime !== undefined) {
            const distance = calculateDistance(prevLat, prevLon, lat, lon);
            const timeDiff = (time - prevTime) / 1000;

            if (distance > 0.001) {
              totalDistance += distance;
              const speed = distance / (timeDiff / 3600);

              if (speed > 1) {
                totalMovingTime += timeDiff;
              }
            }

            if (prevEle !== null && ele !== null) {
              const elevationDiff = ele - prevEle;
              if (elevationDiff > 0) {
                totalElevationGain += elevationDiff;
              } else {
                totalElevationLoss -= elevationDiff;
              }
            }
          }

          prevLat = lat;
          prevLon = lon;
          prevTime = time;
          prevEle = ele;
        }
      }

      setWaypoints(collectedWaypoints);

      if (startDateTime && endDateTime) {
        const durationInSeconds = (endDateTime - startDateTime) / 1000;
        setDuration(durationInSeconds);

        if (originalStartTime && originalEndTime) {
          const startDate = new Date(originalStartTime);
          const endDate = new Date(originalEndTime);

          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            const diffInMs = endDate - startDate;
            const diffHours = Math.floor(diffInMs / (1000 * 60 * 60));
            const diffMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
            const diffSeconds = Math.floor((diffInMs % (1000 * 60)) / 1000);
            setOriginalDuration(`${diffHours}h ${diffMinutes}m ${diffSeconds}s`);
          } else {
            setOriginalDuration('Invalid date');
          }
        } else {
          setOriginalDuration('Invalid date');
        }
      } else {
        setDuration(0);
        setOriginalDuration('Invalid date');
      }

      setMovingTime(totalMovingTime);
      setDistance(totalDistance.toFixed(2));
      setElevationGain(totalElevationGain.toFixed(2));
      setElevationLoss(totalElevationLoss.toFixed(2));

      if (startLat && startLon) {
        setStartCoords({ latitude: startLat, longitude: startLon });
      }
      if (endLat && endLon) {
        setEndCoords({ latitude: endLat, longitude: endLon });
      }

      try {
        const [startLocationInfo, endLocationInfo] = await Promise.all([
          getLocationFromCoords(startLat, startLon),
          getLocationFromCoords(endLat, endLon),
        ]);
        setStartLocation(startLocationInfo);
        setEndLocation(endLocationInfo);
        setIsLocationFetched(true);
      } catch (error) {
        console.error('Error fetching location data:', error);
        setIsLocationFetched(false);
      }
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius der Erde in Kilometern
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1); // Korrigiert: Die Differenz der Längengrade wird korrekt berechnet
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Die Entfernung in Kilometern
  };

  const toRad = (value) => value * Math.PI / 180;

  const saveRoute = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/saveRoute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          date,
          startTime,
          endTime,
          duration,
          distance: parseFloat(distance),
          movingTime,
          elevationGain: parseFloat(elevationGain),
          elevationLoss: parseFloat(elevationLoss),
          startCoords,
          endCoords,
          startLocation,
          endLocation,
          waypoints,
          keyword,
          type,
        }),
      });
  
      const data = await response.json();
      if (data.success) {
        setStatusMessage('Route successfully saved!');
      } else {
        setStatusMessage(data.message || 'Failed to save route. Please try again.');
      }
    } catch (error) {
      console.error('Error saving route:', error);
      setStatusMessage('Failed to save route. Please try again.');
    }
    setIsSaving(false);
  };
  

  return (
    <div>
      <h1>Upload GPX File</h1>
      <input type="file" accept=".gpx" onChange={handleFileUpload} />
      <div>
        <h2>Track Details</h2>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Type:</strong> {type}</p>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Start Time:</strong> {startTime}</p>
        <p><strong>End Time:</strong> {endTime}</p>
        <p><strong>Distance:</strong> {distance} km</p>
        <p><strong>Duration:</strong> {duration} seconds</p>
        <p><strong>Moving Time:</strong> {movingTime} seconds</p>
        <p><strong>Elevation Gain:</strong> {elevationGain} m</p>
        <p><strong>Elevation Loss:</strong> {elevationLoss} m</p>
        <p>
          <strong>Start Coordinates:</strong> {startCoords.latitude}, {startCoords.longitude}
        </p>
        <p>
          <strong>End Coordinates:</strong> {endCoords.latitude}, {endCoords.longitude}
        </p>
        <p><strong>Start Location:</strong> {startLocation.city}</p>
        <p><strong>End Location:</strong> {endLocation.city}</p>
        <p><strong>Start Country:</strong> {startLocation.countryCode2}</p>
        <p><strong>End Country:</strong> {endLocation.countryCode2}</p>
        <p><strong>Original Start Time:</strong> {originalStartTime}</p>
        <p><strong>Original End Time:</strong> {originalEndTime}</p>
        <p><strong>Duration Difference:</strong> {originalDuration}</p>
        <div>
          <label htmlFor="keyword">Keyword:</label>
          <input
            type="text"
            id="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter a keyword"
          />
        </div>
        {statusMessage && <p><strong>Status:</strong> {statusMessage}</p>} {/* Status wird nur angezeigt, wenn nicht leer */}
        <button onClick={saveRoute} disabled={isSaving || !isLocationFetched}>
          Save Route
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
