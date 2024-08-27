// lib/geolocation.js
export const getLocationFromCoords = async (lat, lon) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      if (!response.ok) {
        throw new Error('Failed to fetch location');
      }
      const data = await response.json();
      const countryCode2 = data.address.country_code.toLowerCase();
      const city = data.address.city || data.address.town || data.address.village || 'Unknown location';
  
      return { city, countryCode2 };
    } catch (error) {
      console.error('Error fetching location:', error);
      return { city: 'Unknown location', countryCode2: 'Unknown' };
    }
  };
  