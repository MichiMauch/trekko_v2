import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  Plugin,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { translate } from '../utils/translate'; // Importiere die translate-Funktion


ChartJS.register(LineElement, LinearScale, CategoryScale, PointElement, Tooltip, Legend, Filler);

const verticalLinePlugin: Plugin = {
  id: 'verticalLinePlugin',
  afterDraw: (chart) => {
    const chartArea = chart.chartArea;
    const ctx = chart.ctx;
    const tooltip = chart.tooltip;

    if (tooltip?._active?.length) {
      const activePoint = tooltip._active[0];
      const x = activePoint.element.x;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, chartArea.top);
      ctx.lineTo(x, chartArea.bottom);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.stroke();
      ctx.restore();
    }
  },
};

interface Waypoint {
  lat: number;
  lon: number;
  ele: number;
}

interface ElevationProfileProps {
  waypoints: Waypoint[];
  distance: number;
  onHoverPoint: (index: number | null) => void;
}

const ElevationProfile: React.FC<ElevationProfileProps> = ({ waypoints, distance, onHoverPoint }) => {
  const chartRef = useRef<any>(null);

  // Die Farben werden hier über getComputedStyle ermittelt
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || 'rgba(75,192,192,1)';
  const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim() || 'rgba(75,192,192,0.4)';

  useEffect(() => {
    const chart = chartRef.current;

    const handleMouseMove = (event: MouseEvent) => {
      const xScale = chart.scales.x;
      const xValue = xScale.getValueForPixel(event.offsetX);

      const closestIndex = waypoints.reduce((prevIndex, _, index) => {
        const currentDistance = (distance * index) / waypoints.length;
        const prevDistance = (distance * prevIndex) / waypoints.length;
        return Math.abs(currentDistance - xValue) < Math.abs(prevDistance - xValue) ? index : prevIndex;
      }, 0);

      onHoverPoint(closestIndex);

      const tooltip = chart.tooltip;
      tooltip.setActiveElements([{ datasetIndex: 0, index: closestIndex }], { x: event.offsetX, y: event.offsetY });
      tooltip.update(true);
      chart.update();
    };

    chart.canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      chart.canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [waypoints, distance, onHoverPoint]);

  const totalWaypoints = waypoints.length;

  const labels = waypoints.map((_, index) => {
    if (index === totalWaypoints - 1) return distance.toFixed(2);
    return (distance * (index / totalWaypoints)).toFixed(2);
  });

  const data = {
    labels: labels,
    datasets: [
      {
        label: '',
        data: waypoints.map((wp) => wp.ele),
        fill: 'start',
        backgroundColor: secondaryColor, // Nutze die CSS-Variable für den ausgefüllten Bereich
        borderColor: primaryColor, // Nutze die CSS-Variable für die Linienfarbe
        tension: 0.1,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false, // Deaktiviert das feste Höhe-Breite-Verhältnis
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: '',
        },
        min: 0,
        max: distance,
        ticks: {
          callback: function (value) {
            return `${value.toFixed(1)} km`; // Formatierung für Kilometer
          },
          stepSize: distance <= 15 ? 1 : distance <= 40 ? 2 : 5, // Dynamische Schrittgröße basierend auf der Gesamtdistanz
        },
        grid: {
          drawBorder: false,
          color: 'rgba(0,0,0,0.1)', // Farbe des Rasters
        },
      },
      y: {
        title: {
          display: true,
          text: '',
        },
        ticks: {
          callback: function (value) {
            return `${value.toFixed(0)} m`; // Formatierung für Meter
          },
        },
        grid: {
          drawBorder: false,
          color: 'rgba(0,0,0,0.1)', // Farbe des Rasters
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        intersect: false,
        callbacks: {
          label: function (tooltipItem) {
            const ele = tooltipItem.raw;
            const distance = tooltipItem.label;
            return `${translate('Distance')}: ${distance} km, ${translate('Elevation (m)')}: ${ele} m`;
          },
        },
      },
    },
  };
  
  return (
<div className="h-[200px] md:h-[300px]">
  <Line ref={chartRef} data={data} options={options} plugins={[verticalLinePlugin]} />
</div>
  );
};

export default ElevationProfile;
