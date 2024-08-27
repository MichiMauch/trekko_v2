import React, { useState } from 'react';
import { translate } from '../utils/translate'; 
import { getIconForActivity } from './activityIcons'; // Importiere die getIconForActivity Funktion
import { LuTimer } from "react-icons/lu"; // Importiere das LuTimer-Icon
import { GiPathDistance } from "react-icons/gi";
import { FaArrowTrendUp } from "react-icons/fa6";



interface HeroPagesProps {
  title: string;
  date: string; 
  activityType: string;
  distance: number;
  elevationGain: number;
  duration: number;
  movingTime: number;
}

const HeroPages: React.FC<HeroPagesProps> = ({ title, date, activityType, distance, elevationGain, duration, movingTime }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const translatedActivityType = translate(activityType);

  const stats = [
    { id: 1, name: '', value: translatedActivityType, icon: getIconForActivity(activityType, 24) },
    { id: 2, name: '', value: `${distance.toFixed(2)} km`, icon: <GiPathDistance size={24} /> },
    { id: 3, name: '', value: `${elevationGain} m`, icon: <FaArrowTrendUp size={24} /> },
    { 
      id: 4, 
      name: '', 
      value: `${String(Math.floor(movingTime / 3600)).padStart(2, '0')}:${String(Math.floor((movingTime % 3600) / 60)).padStart(2, '0')}:${String(movingTime % 60).padStart(2, '0')}`, 
      icon: <LuTimer size={24} /> 
  },  ];

  return (
    <div className="bg-terziary py-12 px-4 text-center">
      <p className="pb-2 text-sm text-gray-600">{date}</p> 
      <h1 className="pb-4 text-2xl md:text-3xl font-bold text-gray-800">
        {title}
      </h1>
      
      <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5 overflow-hidden text-center">
        {stats.map((stat, index) => (
          <div 
            key={stat.id} 
            className={`flex flex-col bg-primary-opa hover:bg-terziary p-8 ${
              index === 0 ? 'rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none' : ''} ${
              index === stats.length - 1 ? 'rounded-b-2xl sm:rounded-r-2xl sm:rounded-bl-none' : ''
            }`}
          >
            <dd className="order-first text-3xl font-semibold tracking-tight text-gray-700">
              {stat.value}
            </dd>
            {stat.icon ? (
              <dt className="text-sm font-semibold leading-6 text-gray-700 flex justify-center items-center">
                {stat.icon}
              </dt>
            ) : (
              <dt className="text-sm font-semibold leading-6 text-gray-700">{stat.name}</dt>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
  
  
  
};

export default HeroPages;
