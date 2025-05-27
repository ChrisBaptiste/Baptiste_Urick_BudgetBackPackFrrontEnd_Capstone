
// src/components/Search/SearchFlights.jsx
import React, { useState, useEffect } from 'react'; // Added useEffect
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // For user trips and token
import './SearchFlights.css';

const SearchFlights = () => {
  // ... (existing state: flightSearchData, flightResults, flightLoading, flightError)
  const [flightSearchData, setFlightSearchData] = useState({ /* ... */ });
  const [flightResults, setFlightResults] = useState([]);
  const [flightLoading, setFlightLoading] = useState(false);
  const [flightError, setFlightError] = useState('');

  const [userTrips, setUserTrips] = useState([]);
  const [showTripModal, setShowTripModal] = useState(false);
  const [selectedFlightForSave, setSelectedFlightForSave] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchTrips = async () => {
      if (!token) return;
      try {
        const res = await axios.get('/api/trips');
        setUserTrips(res.data);
      } catch (err) {
        console.error("Failed to fetch user trips", err);
      }
    };
    fetchTrips();
  }, [token]);


  const handleFlightChange = (e) => { /* ... existing ... */ };
  const handleFlightSearch = async (e) => { /* ... existing ... */ };

  const openSaveToTripModal = (flight) => {
    setSelectedFlightForSave(flight);
    setShowTripModal(true);
  };

  const handleSaveFlightToTrip = async (tripId) => {
    if (!selectedFlightForSave || !tripId) return;
    
    // Prepare data according to SavedFlightSchema
    const flightToSave = {
        flightApiId: selectedFlightForSave.id, // From API response
        origin: selectedFlightForSave.departureAirportCode, // Or city
        destination: selectedFlightForSave.arrivalAirportCode, // Or city
        departureDate: selectedFlightForSave.departureTimeUTC, // Or local, ensure it's a valid Date
        price: selectedFlightForSave.price,
        details: { // Store some key details for display
            airlineName: selectedFlightForSave.airlineName,
            flightNumber: selectedFlightForSave.flightNumber,
            departureCity: selectedFlightForSave.departureCity,
            arrivalCity: selectedFlightForSave.arrivalCity,
            durationFormatted: selectedFlightForSave.durationFormatted,
            bookingLink: selectedFlightForSave.bookingLink, // Good to save this
            provider: selectedFlightForSave.provider
        }
    };

    try {
      await axios.post(`/api/trips/${tripId}/flights`, flightToSave);
      alert(`${selectedFlightForSave.airlineName} flight to ${selectedFlightForSave.arrivalCity} saved!`);
      setShowTripModal(false);
      setSelectedFlightForSave(null);
    } catch (err) {
      console.error("Error saving flight to trip:", err.response);
      alert(err.response?.data?.msg || "Failed to save flight.");
    }
  };


  return (
    <div className="search-form-container flight-search">
      <h2>Flight Search</h2>
      <form onSubmit={handleFlightSearch} className="search-form">
        {/* ... existing form fields ... */}
        <button type="submit" className="btn btn-primary" disabled={flightLoading}>
          {flightLoading ? 'Searching Flights...' : 'Search Flights'}
        </button>
        {flightError && flightResults.length === 0 && <p className="form-error-message general-error" style={{marginTop: '10px'}}>{flightError}</p>}
      </form>

      {!flightLoading && flightResults.length > 0 && (
        <div className="results-container flight-results">
          <h3>Flight Results ({flightResults.length})</h3>
          {flightResults.map((flight) => ( // Removed index as key if flight.id is reliable
            <div key={flight.id} className="result-card flight-card">
              <h4>{flight.airlineName} ({flight.airlineCode} {flight.flightNumber})</h4>
              <p><strong>From:</strong> {flight.departureCity} ({flight.departureAirportCode}) at {new Date(flight.departureTimeLocal).toLocaleString()}</p>
              <p><strong>To:</strong> {flight.arrivalCity} ({flight.arrivalAirportCode}) at {new Date(flight.arrivalTimeLocal).toLocaleString()}</p>
              <p><strong>Duration:</strong> {flight.durationFormatted}</p>
              <p><strong>Price:</strong> {flight.price ? `$${flight.price.toFixed(2)} ${flight.currency}` : 'N/A'}</p>
              {flight.bookingLink && <a href={flight.bookingLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary-outline btn-small" style={{marginRight: '10px'}}>Book Now via {flight.provider}</a>}
              {token && userTrips.length > 0 && (
                  <button onClick={() => openSaveToTripModal(flight)} className="btn btn-primary btn-small">Save to Trip</button>
              )}
            </div>
          ))}
        </div>
      )}

      {showTripModal && selectedFlightForSave && (
        <div className="modal-overlay"> {/* You can reuse modal CSS from SearchAccommodations.css or move to App.css */}
          <div className="modal-content">
            <h3>Save Flight ({selectedFlightForSave.airlineName} to {selectedFlightForSave.arrivalCity}) to a Trip</h3>
            {userTrips.length > 0 ? (
              <ul className="trip-selection-list">
                {userTrips.map(trip => (
                  <li key={trip._id} onClick={() => handleSaveFlightToTrip(trip._id)}>
                    {trip.tripName} ({trip.destinationCity})
                  </li>
                ))}
              </ul>
            ) : <p>You have no trips. Create one first!</p>}
            <button onClick={() => { setShowTripModal(false); setSelectedFlightForSave(null);}} className="btn btn-secondary">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFlights;
