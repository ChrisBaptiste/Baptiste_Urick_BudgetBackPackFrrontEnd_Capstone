
// src/pages/Search/SearchPage.jsx
import React, { useState } from 'react';
import SearchFlights from '../../components/Search/SearchFlights';
import SearchEvents from '../../components/Search/SearchEvents';
import SearchAccommodations from '../../components/Search/SearchAccommodations'; // Import new component
import ApiTester from '../../components/Debug/ApiTester';
import './SearchPage.css';

const SearchPage = () => {
  const [activeSearch, setActiveSearch] = useState('flights');

  return (
    <div className="search-page-container container">
      <ApiTester />
      <h1>Find Your Next Adventure</h1>
      <p>Search for budget-friendly flights, accommodations, and exciting local events for your trips.</p>

      <div className="search-type-selector">
        <button
          onClick={() => setActiveSearch('flights')}
          className={`btn ${activeSearch === 'flights' ? 'btn-primary' : 'btn-secondary-outline'}`}
        >
          Search Flights
        </button>
        <button // New button for accommodations
          onClick={() => setActiveSearch('accommodations')}
          className={`btn ${activeSearch === 'accommodations' ? 'btn-primary' : 'btn-secondary-outline'}`}
        >
          Search Accommodations
        </button>
        <button
          onClick={() => setActiveSearch('events')}
          className={`btn ${activeSearch === 'events' ? 'btn-primary' : 'btn-secondary-outline'}`}
        >
          Search Events/Places
        </button>
      </div>

      {activeSearch === 'flights' && <SearchFlights />}
      {activeSearch === 'accommodations' && <SearchAccommodations />} {/* Render new component */}
      {activeSearch === 'events' && <SearchEvents />}
    </div>
  );
};

export default SearchPage;
