import React from 'react';
import { GiPathDistance } from 'react-icons/gi';
import { MdLocationOn, MdAccessTime, MdDateRange } from 'react-icons/md';
import { FaFileDownload } from 'react-icons/fa';
import { LuTimer } from "react-icons/lu";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { CiLocationOn } from "react-icons/ci";

interface RightSidebarPagesProps {
  distance: number;
  movingTime: number;
  duration: number;
  startTime: number;
  endTime: number;
  elevationLoss: number;
  elevationGain: number;
  startLocationCity: string;
  endLocationCity: string;
  slug: string;
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const formatTimeHour = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const RightSidebarPages: React.FC<RightSidebarPagesProps> = ({ slug, endLocationCity, startLocationCity, distance, movingTime, duration, startTime, endTime, elevationGain, elevationLoss }) => {
  
  const downloadGPX = async () => {
    try {
      const response: Response = await fetch(`/api/download-gpx/${slug}`);
      if (!response.ok) {
        throw new Error('Fehler beim Download der GPX-Datei');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${slug}.gpx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('Unbekannter Fehler beim Download der GPX-Datei');
      }
    }
  };

  return (
    <div className="bg-terziary w-full lg:flex-grow mx-auto h-full flex flex-col space-y-px">
      {/* Erste Box: Nur oben links und rechts gerundete Ecken */}
      <div className="bg-primary-opa p-4 rounded-t-lg flex-grow flex items-center justify-center hover:bg-terziary">
        <p className="flex items-center">
          <MdDateRange size={16} className="mr-2" />
          {formatDate(startTime)}
        </p>
      </div>

      {/* Mittlere Boxen: Keine gerundeten Ecken */}
      <div className="bg-primary-opa p-4 flex-grow flex items-center justify-center hover:bg-terziary">
        <p className="flex items-center">
          <MdLocationOn size={16} className="mr-2" />
          {startLocationCity}: {formatTimeHour(startTime)} Uhr
        </p>
      </div>
      <div className="bg-primary-opa p-4 flex-grow flex items-center justify-center hover:bg-terziary">
        <p className="flex items-center">
          <CiLocationOn size={16} className="mr-2" />
          {endLocationCity}: {formatTimeHour(endTime)} Uhr
        </p>
      </div>
      <div className="bg-primary-opa p-4 flex-grow flex items-center justify-center hover:bg-terziary">
        <p className="flex items-center">
          <GiPathDistance size={16} className="mr-2" />
          {distance.toFixed(2)} km
        </p>
      </div>
      <div className="bg-primary-opa p-4 flex-grow flex items-center justify-center hover:bg-terziary">
        <p className="flex items-center">
          <LuTimer size={16} className="mr-2" />
          {formatTime(movingTime)}
        </p>
      </div>
      <div className="bg-primary-opa p-4 flex-grow flex items-center justify-center hover:bg-terziary">
        <p className="flex items-center">
          <MdAccessTime size={16} className="mr-2" />
          {formatTime(duration)}
        </p>
      </div>
      <div className="bg-primary-opa p-4 flex-grow flex items-center justify-center hover:bg-terziary">
        <p className="flex items-center">
          <FaArrowTrendUp size={16} className="mr-2" />
          {elevationGain} m
        </p>
      </div>
      <div className="bg-primary-opa p-4 flex-grow flex items-center justify-center hover:bg-terziary">
        <p className="flex items-center">
          <FaArrowTrendDown size={16} className="mr-2" />
          {elevationLoss} m
        </p>
      </div>
      {/* Letzte Box: Nur unten links und rechts gerundete Ecken */}
      <div className="bg-primary-opa p-4 rounded-b-lg flex-grow flex items-center justify-center hover:bg-terziary cursor-pointer" onClick={downloadGPX}>
        <p className="flex items-center">
          <FaFileDownload size={16} className="mr-2" />
          GPX Download
        </p>
      </div>
    </div>
  );
};

export default RightSidebarPages;
