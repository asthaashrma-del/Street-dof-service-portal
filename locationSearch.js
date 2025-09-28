import React, { useState } from 'react';
import axios from 'axios';

function LocationSearch({ onSelectLocation }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`);
      setSuggestions(res.data);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (location) => {
    setQuery(location.display_name);
    setSuggestions([]);
    onSelectLocation(location); // pass the selected location to parent
  };

  return (
    <div className="location-search">
      <input
        type="text"
        placeholder="Search location..."
        value={query}
        onChange={handleSearch}
      />
      <ul className="suggestions">
        {suggestions.map((loc) => (
          <li key={loc.place_id} onClick={() => handleSelect(loc)}>
            {loc.display_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LocationSearch;
