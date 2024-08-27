import React from 'react';
import ActivityFilter from './ActivityFilter';

const Hero: React.FC = () => {
  return (
    <div 
  style={{
    background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1684487747385-442d674962f2) no-repeat center',
    backgroundSize: 'cover'
  }}
  className="py-36 px-1 md:px-8 text-center relative text-white font-bold text-2xl md:text-3xl overflow-auto"
>
  <h1 className="pb-4">Nach Aktivitäten suchen</h1>
  <div className="w-11/12 md:w-3/4 lg:max-w-3xl m-auto">
    <div className="relative z-30 text-base text-black">
      <ActivityFilter />
    </div>
  </div>

  {/* Welle als SVG */}
  <div className="absolute inset-x-0 bottom-0 z-20">
    <svg viewBox="0 0 1440 200"> {/* Höhe im ViewBox reduziert */}
      <path fill="#ffffff" fillOpacity="1" d="M0,192L80,181.3C160,171,320,149,480,149.3C640,149,800,171,960,181.3C1120,192,1280,192,1360,192L1440,192L1440,240L1360,240C1280,240,1120,240,960,240C800,240,640,240,480,240C320,240,160,240,80,240L0,240Z"></path>
    </svg>
  </div>
</div>


  );
};

export default Hero;
