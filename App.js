import React, { useState } from 'react';
import LocationSearch from './LocationSearch'; // Make sure this filename matches

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <div>
      <h1>Find Street Dog Services</h1>
      <LocationSearch onSelectLocation={setSelectedLocation} />
      {selectedLocation && (
        <div>
          <p><strong>Selected:</strong> {selectedLocation.display_name}</p>
          <p>Latitude: {selectedLocation.lat}</p>
          <p>Longitude: {selectedLocation.lon}</p>
        </div>
      )}
    </div>
  );
}

export default App;
