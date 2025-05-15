// src/pages/SearchPage.jsx
import React, { useState } from 'react';
import SearchFlights from '../../components/Search/SearchFlights'; // My new component
import SearchEvents from '../../components/Search/SearchEvents';   // My new component
import './SearchPage.css'; // Main styles for the SearchPage layout

const SearchPage = () => {
  // State for controlling which search component is active.
  const [activeSearch, setActiveSearch] = useState('flights'); // Default to 'flights'.

  return (
    <div className="search-page-container container"> {/* Using global .container */}
      <h1>Find Your Next Adventure</h1>
      <p>Search for budget-friendly flights and exciting local events for your trips.</p>

      <div className="search-type-selector">
        <button 
          onClick={() => setActiveSearch('flights')} 
          // Applying 'btn-primary' if active, 'btn-secondary-outline' otherwise for visual distinction.
          className={`btn ${activeSearch === 'flights' ? 'btn-primary' : 'btn-secondary-outline'}`}
        >
          Search Flights
        </button>
        <button 
          onClick={() => setActiveSearch('events')} 
          className={`btn ${activeSearch === 'events' ? 'btn-primary' : 'btn-secondary-outline'}`}
        >
          Search Events/Places
        </button>
      </div>

      {/* Conditionally rendering my specific search components. */}
      {activeSearch === 'flights' && <SearchFlights />}
      {activeSearch === 'events' && <SearchEvents />}
    </div>
  );
};

export default SearchPage;