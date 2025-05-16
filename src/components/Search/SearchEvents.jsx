// src/components/Search/SearchEvents.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './SearchEvents.css'; 



const SearchEvents = () => {
  // State for Event/Place Search form and results.
  const [eventSearchData, setEventSearchData] = useState({
    destinationCity: '',
    searchTerm: '', 
  });
  const [eventResults, setEventResults] = useState([]);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventError, setEventError] = useState('');

  const handleEventChange = (e) => {
    setEventSearchData({ ...eventSearchData, [e.target.name]: e.target.value });
    if (eventError) setEventError('');
  };

  const handleEventSearch = async (e) => {
    e.preventDefault();
    setEventLoading(true);
    setEventError('');
    setEventResults([]);

    if (!eventSearchData.destinationCity) {
        setEventError('Please provide a destination city for event search.');
        setEventLoading(false);
        return;
    }

    try {
      const response = await axios.get('/api/search/events', { params: eventSearchData });
      setEventResults(response.data);
      if (response.data.length === 0) {
        // If API returns empty array, I want to inform the user.
        setEventError('No events or places found for your criteria.');
      }
    } catch (err) {
      console.error("Event search error:", err.response);
      setEventError(err.response?.data?.msg || 'Failed to fetch event data. Please try again.');
    } finally {
      setEventLoading(false);
    }
  };

  return (
    <div className="search-form-container event-search"> {/* I can reuse this class or make it specific */}
      <h2>Event/Place Search</h2>
      <form onSubmit={handleEventSearch} className="search-form">
        <div className="form-group">
          <label htmlFor="destinationCityEvent">Destination City</label> {/* Changed id to avoid conflict if rendered on same page */}
          <input type="text" id="destinationCityEvent" name="destinationCity" value={eventSearchData.destinationCity} onChange={handleEventChange} placeholder="e.g., Paris, London" required />
        </div>
        <div className="form-group">
          <label htmlFor="searchTerm">Search Term (e.g., museums, parks, restaurants - Optional)</label>
          <input type="text" id="searchTerm" name="searchTerm" value={eventSearchData.searchTerm} onChange={handleEventChange} placeholder="e.g., restaurants, historical sites" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={eventLoading}>
          {eventLoading ? 'Searching Events...' : 'Search Events'}
        </button>
        {/* Display error message if eventError is set AND there are no results */}
        {eventError && eventResults.length === 0 && <p className="form-error-message general-error" style={{marginTop: '10px'}}>{eventError}</p>}
      </form>

      {/* Event Results Area - only show if not loading and there are results */}
      {!eventLoading && eventResults.length > 0 && (
        <div className="results-container event-results">
          <h3>Event/Place Results ({eventResults.length})</h3>
          {eventResults.map((event, index) => (
            <div key={event.id || index} className="result-card event-card">
              <h4>{event.title}</h4>
              {event.iconUrl && <img src={event.iconUrl} alt="" style={{backgroundColor: event.iconBackgroundColor, padding: '2px', borderRadius: '4px', marginRight: '8px', verticalAlign: 'middle', width: '24px', height: '24px'}} />}
              {event.address && <p><strong>Address:</strong> {event.address}</p>}
              {event.rating && <p><strong>Rating:</strong> {event.rating} ({event.userRatingCount} reviews)</p>}
              {event.types && event.types.length > 0 && <p><strong>Type:</strong> {event.primaryType || event.types.join(', ')}</p>}
              {event.websiteUri && <p><a href={event.websiteUri} target="_blank" rel="noopener noreferrer">Website</a></p>}
              {event.googleMapsUri && <p><a href={event.googleMapsUri} target="_blank" rel="noopener noreferrer" className="btn btn-secondary-outline btn-small">View on Google Maps</a></p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchEvents;