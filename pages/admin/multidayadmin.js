import { useState, useEffect } from 'react';

const MultiDayTourAdmin = () => {
  const [tourName, setTourName] = useState(''); // Tour Name wird auch als Keyword genutzt
  const [tours, setTours] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('/api/getMultiDayTours');
        const data = await response.json();

        if (data.success) {
          setTours(data.data);
          console.log('Fetched tours:', data.data);
        } else {
          console.error('Failed to fetch tours:', data.message);
        }
      } catch (error) {
        console.error('Error fetching tours:', error);
      }
    };

    fetchTours();
  }, []);

  const handleAddTour = () => {
    if (tourName.trim() === '') {
      setStatusMessage('Tour name cannot be empty.');
      console.log('Tour name is empty');
      return;
    }

    const newTours = [...tours, { name: tourName, keyword: tourName, isNew: true }];
    setTours(newTours);
    setTourName('');
    setStatusMessage('Tour added successfully!');
    console.log('Tour added:', tourName);
  };

  const handleSaveTours = async () => {
    const newToursToSave = tours.filter((tour) => tour.isNew);

    if (newToursToSave.length === 0) {
      setStatusMessage('No new tours to save.');
      return;
    }

    console.log('Saving new tours:', newToursToSave);

    try {
      const response = await fetch('/api/saveMultiDayTours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tours: newToursToSave }),
      });

      const data = await response.json();
      if (data.success) {
        const updatedTours = tours.map((tour) => ({
          ...tour,
          isNew: false,
        }));
        setTours(updatedTours);

        setStatusMessage('Tours saved successfully!');
        console.log('Tours saved successfully');
      } else {
        setStatusMessage(data.message || 'Failed to save tours. Please try again.');
        console.error('Failed to save tours:', data.message);
      }
    } catch (error) {
      console.error('Error saving tours:', error);
      setStatusMessage('Failed to save tours. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Multi-Day Tour Admin</h1>
      <div className="mb-6">
        <label htmlFor="tourName" className="block text-lg font-medium text-gray-700 mb-2">
          Tour Name (Keyword):
        </label>
        <input
          type="text"
          id="tourName"
          value={tourName}
          onChange={(e) => setTourName(e.target.value)}
          placeholder="Enter a tour name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          onClick={handleAddTour}
          className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-300"
        >
          Add Tour
        </button>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Tour List</h2>
        <ul className="space-y-2">
          {tours.map((tour, index) => (
            <li
              key={index}
              className={`p-3 bg-white rounded-lg shadow-md ${
                tour.isNew ? 'border-l-4 border-green-500' : ''
              }`}
            >
              {tour.name} {tour.isNew && <span className="text-green-500">(New)</span>}
            </li>
          ))}
        </ul>
        <button
          onClick={handleSaveTours}
          className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Save All Tours
        </button>
      </div>
      {statusMessage && (
        <p className="mt-4 text-center text-sm text-gray-600 bg-gray-200 p-2 rounded-lg shadow-md">
          <strong>Status:</strong> {statusMessage}
        </p>
      )}
    </div>
  );
};

export default MultiDayTourAdmin;
