// components/ActivityFilter.tsx
import React from 'react';

const ActivityFilter: React.FC = () => {
  return (
<div className="w-full">
  {/* Flex-Container für das Suchfeld */}
  <div className="w-full flex justify-center mb-4">
    <input 
      type="text" 
      placeholder="Nach Name suchen" 
      className="input input-bordered w-full max-w-lg lg:max-w-full lg:flex-grow" 
    />
  </div>
  {/* Flex-Container für die Dropdown-Felder und den Button */}
  <div className="flex flex-col lg:flex-row gap-4 w-full justify-center lg:justify-start">
    <div className="w-full lg:w-auto lg:flex-grow flex justify-between gap-4">
    <select 
  className="select select-bordered w-full lg:flex-grow"
  defaultValue=""
>
  <option value="" disabled>Who shot first?</option>
  <option value="Han Solo">Han Solo</option>
  <option value="Greedo">Greedo</option>
</select>

<select 
  className="select select-bordered w-full lg:flex-grow"
  defaultValue=""
>
  <option value="" disabled>Who shot first?</option>
  <option value="Han Solo">Han Solo</option>
  <option value="Greedo">Greedo</option>
</select>

    </div>
    <button className="btn btn-primary w-full lg:w-auto lg:flex-grow">Filter anwenden</button>
  </div>
</div>




  );
};

export default ActivityFilter;
