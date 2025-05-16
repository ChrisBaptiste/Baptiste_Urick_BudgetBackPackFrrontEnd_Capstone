// src/components/Search/SearchFlights.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './SearchFlights.css'; // I'll create this CSS file.



const SearchFlights = () => {
  // State for Flight Search form and results.
  const [flightSearchData, setFlightSearchData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '', 
    adults: '1',
  });
  const [flightResults, setFlightResults] = useState([]);
  const [flightLoading, setFlightLoading] = useState(false);
  const [flightError, setFlightError] = useState('');

  const handleFlightChange = (e) => {
    setFlightSearchData({ ...flightSearchData, [e.target.name]: e.target.value });
    if (flightError) setFlightError('');
  };

  const handleFlightSearch = async (e) => {
    e.preventDefault();
    setFlightLoading(true);
    setFlightError('');
    setFlightResults([]);

    if (!flightSearchData.origin || !flightSearchData.destination || !flightSearchData.departureDate) {
        setFlightError('Please provide origin, destination, and departure date.');
        setFlightLoading(false);
        return;
    }
    // Client-side validation for dates
    if (flightSearchData.returnDate && new Date(flightSearchData.departureDate) > new Date(flightSearchData.returnDate)) {
        setFlightError('Return date cannot be before departure date.');
        setFlightLoading(false);
        return;
    }

    try {
      const response = await axios.get('/api/search/flights', { params: flightSearchData });
      setFlightResults(response.data);
      if (response.data.length === 0) {
        // If API returns empty array, I want to inform the user.
        setFlightError('No flights found for your criteria. Try different dates or locations.');
      }
    } catch (err) {
      console.error("Flight search error:", err.response);
      setFlightError(err.response?.data?.msg || 'Failed to fetch flight data. Please try again.');
    } finally {
      setFlightLoading(false);
    }
  };

  return (
    <div className="search-form-container flight-search"> {/* I can reuse this class or make it specific */}
      <h2>Flight Search</h2>
      <form onSubmit={handleFlightSearch} className="search-form">
        <div className="form-row">
            <div className="form-group">
                <label htmlFor="origin">Origin (Airport Code or City)</label>
                <input type="text" id="origin" name="origin" value={flightSearchData.origin} onChange={handleFlightChange} placeholder="e.g., JFK or New York" required />
            </div>
            <div className="form-group">
                <label htmlFor="destination">Destination (Airport Code or City)</label>
                <input type="text" id="destination" name="destination" value={flightSearchData.destination} onChange={handleFlightChange} placeholder="e.g., LAX or Los Angeles" required />
            </div>
        </div>
        <div className="form-row">
            <div className="form-group">
                <label htmlFor="departureDate">Departure Date</label>
                <input type="date" id="departureDate" name="departureDate" value={flightSearchData.departureDate} onChange={handleFlightChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="returnDate">Return Date (Optional for One-Way)</label>
                <input type="date" id="returnDate" name="returnDate" value={flightSearchData.returnDate} onChange={handleFlightChange} />
            </div>
        </div>
         <div className="form-group">
            <label htmlFor="adults">Adults (16+)</label>
            <input type="number" id="adults" name="adults" min="1" value={flightSearchData.adults} onChange={handleFlightChange} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={flightLoading}>
          {flightLoading ? 'Searching Flights...' : 'Search Flights'}
        </button>
        {/* Display error message if flightError is set AND there are no results */}
        {flightError && flightResults.length === 0 && <p className="form-error-message general-error" style={{marginTop: '10px'}}>{flightError}</p>}
      </form>

      {/* Flight Results Area - only show if not loading and there are results */}
      {!flightLoading && flightResults.length > 0 && (
        <div className="results-container flight-results">
          <h3>Flight Results ({flightResults.length})</h3>
          {flightResults.map((flight, index) => (
            <div key={flight.id || index} className="result-card flight-card">
              <h4>{flight.airlineName} ({flight.airlineCode} {flight.flightNumber})</h4>
              <p><strong>From:</strong> {flight.departureCity} ({flight.departureAirportCode}) at {new Date(flight.departureTimeLocal).toLocaleString()}</p>
              <p><strong>To:</strong> {flight.arrivalCity} ({flight.arrivalAirportCode}) at {new Date(flight.arrivalTimeLocal).toLocaleString()}</p>
              <p><strong>Duration:</strong> {flight.durationFormatted}</p>
              <p><strong>Price:</strong> {flight.price ? `$${flight.price.toFixed(2)} ${flight.currency}` : 'N/A'}</p>
              {flight.bookingLink && <a href={flight.bookingLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary-outline btn-small">Book Now via {flight.provider}</a>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchFlights;