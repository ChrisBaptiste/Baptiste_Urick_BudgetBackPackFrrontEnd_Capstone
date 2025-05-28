// src/components/Search/SearchFlights.jsx

// src/components/Search/SearchFlights.jsx
// REPLACE YOUR ENTIRE SearchFlights.jsx FILE WITH THIS USER-FRIENDLY VERSION

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './SearchFlights.css';

// Popular airports data
const POPULAR_AIRPORTS = [
  // US Major Cities
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy International', country: 'United States' },
  { code: 'LAX', city: 'Los Angeles', name: 'Los Angeles International', country: 'United States' },
  { code: 'ORD', city: 'Chicago', name: "O'Hare International", country: 'United States' },
  { code: 'MIA', city: 'Miami', name: 'Miami International', country: 'United States' },
  { code: 'LAS', city: 'Las Vegas', name: 'McCarran International', country: 'United States' },
  { code: 'SFO', city: 'San Francisco', name: 'San Francisco International', country: 'United States' },
  { code: 'SEA', city: 'Seattle', name: 'Seattle-Tacoma International', country: 'United States' },
  { code: 'DEN', city: 'Denver', name: 'Denver International', country: 'United States' },
  { code: 'ATL', city: 'Atlanta', name: 'Hartsfield-Jackson Atlanta International', country: 'United States' },
  
  // Europe
  { code: 'LHR', city: 'London', name: 'Heathrow', country: 'United Kingdom' },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle', country: 'France' },
  { code: 'FRA', city: 'Frankfurt', name: 'Frankfurt am Main', country: 'Germany' },
  { code: 'AMS', city: 'Amsterdam', name: 'Amsterdam Schiphol', country: 'Netherlands' },
  { code: 'FCO', city: 'Rome', name: 'Leonardo da Vinci-Fiumicino', country: 'Italy' },
  { code: 'MAD', city: 'Madrid', name: 'Adolfo Suárez Madrid–Barajas', country: 'Spain' },
  { code: 'BCN', city: 'Barcelona', name: 'Barcelona-El Prat', country: 'Spain' },
  { code: 'MUC', city: 'Munich', name: 'Munich', country: 'Germany' },
  
  // Asia Pacific
  { code: 'NRT', city: 'Tokyo', name: 'Narita International', country: 'Japan' },
  { code: 'ICN', city: 'Seoul', name: 'Incheon International', country: 'South Korea' },
  { code: 'SIN', city: 'Singapore', name: 'Singapore Changi', country: 'Singapore' },
  { code: 'HKG', city: 'Hong Kong', name: 'Hong Kong International', country: 'Hong Kong' },
  { code: 'SYD', city: 'Sydney', name: 'Kingsford Smith', country: 'Australia' },
  { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi', country: 'Thailand' },
  
  // Other Popular
  { code: 'YYZ', city: 'Toronto', name: 'Pearson International', country: 'Canada' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai International', country: 'UAE' },
  { code: 'DOH', city: 'Doha', name: 'Hamad International', country: 'Qatar' },
];

// Airport Picker Component
const AirportPicker = ({ value, onChange, placeholder, label, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [filteredAirports, setFilteredAirports] = useState(POPULAR_AIRPORTS);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setIsOpen(true);
    
    if (term.length === 0) {
      setFilteredAirports(POPULAR_AIRPORTS);
    } else {
      const filtered = POPULAR_AIRPORTS.filter(airport => 
        airport.code.toLowerCase().includes(term.toLowerCase()) ||
        airport.city.toLowerCase().includes(term.toLowerCase()) ||
        airport.name.toLowerCase().includes(term.toLowerCase()) ||
        airport.country.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredAirports(filtered);
    }
    
    onChange({ target: { name, value: term.toUpperCase() } });
  };

  const handleAirportSelect = (airport) => {
    setSearchTerm(`${airport.code} - ${airport.city}`);
    setIsOpen(false);
    onChange({ target: { name, value: airport.code } });
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setFilteredAirports(POPULAR_AIRPORTS);
  };

  return (
    <div className="airport-picker" ref={dropdownRef}>
      <label htmlFor={name}>{label}</label>
      <div className="airport-input-container">
        <input
          type="text"
          id={name}
          name={name}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="airport-input"
          autoComplete="off"
        />
        <span className="airport-input-icon">✈️</span>
      </div>
      
      {isOpen && (
        <div className="airport-dropdown">
          <div className="airport-dropdown-header">
            <span>Popular Destinations</span>
          </div>
          <div className="airport-list">
            {filteredAirports.slice(0, 8).map((airport) => (
              <div
                key={airport.code}
                className="airport-option"
                onClick={() => handleAirportSelect(airport)}
              >
                <div className="airport-option-main">
                  <span className="airport-code">{airport.code}</span>
                  <span className="airport-city">{airport.city}</span>
                </div>
                <div className="airport-option-details">
                  <span className="airport-name">{airport.name}</span>
                  <span className="airport-country">{airport.country}</span>
                </div>
              </div>
            ))}
            {filteredAirports.length === 0 && (
              <div className="airport-option-empty">
                <span>No airports found. Try typing an airport code like "JFK" or city name.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const SearchFlights = () => {
  const [flightSearchData, setFlightSearchData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    adults: '1',
    children: '0',
    infants: '0',
    maxStopovers: '',
    sortBy: 'PRICE'
  });
  
  const [flightResults, setFlightResults] = useState([]);
  const [flightLoading, setFlightLoading] = useState(false);
  const [flightError, setFlightError] = useState('');
  const [userTrips, setUserTrips] = useState([]);
  const [showTripModal, setShowTripModal] = useState(false);
  const [selectedFlightForSave, setSelectedFlightForSave] = useState(null);
  const [isRoundTrip, setIsRoundTrip] = useState(false); // FIXED: Separate state for trip type
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

  const handleFlightChange = (e) => {
    let value = e.target.value;
    
    if (e.target.name === 'origin' || e.target.name === 'destination') {
      if (value.includes(' - ')) {
        value = value.split(' - ')[0];
      }
      value = value.toUpperCase().trim();
    }
    
    setFlightSearchData({ ...flightSearchData, [e.target.name]: value });
    if (flightError) setFlightError('');
  };

  // FIXED: Better flight type handling
  const handleFlightTypeChange = (type) => {
    setIsRoundTrip(type === 'roundtrip');
    if (type === 'oneway') {
      setFlightSearchData({ ...flightSearchData, returnDate: '' });
    }
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

    // FIXED: Only require return date if round-trip is selected AND user tries to search
    if (isRoundTrip && !flightSearchData.returnDate) {
      setFlightError('Please select a return date for round-trip flights.');
      setFlightLoading(false);
      return;
    }

    try {
      // Build search params based on flight type
      const searchParams = { ...flightSearchData };
      if (!isRoundTrip) {
        searchParams.returnDate = ''; // Ensure no return date for one-way
      }

      const response = await axios.get('/api/search/flights', { params: searchParams });
      console.log("Frontend: Received flight data from backend:", response.data);
      setFlightResults(response.data);
      if (response.data.length === 0) {
        setFlightError('No flights found for your criteria. Try different dates or destinations.');
      }
    } catch (err) {
      console.error("Flight search error:", err.response);
      setFlightError(err.response?.data?.msg || 'Failed to fetch flight data. Please try again.');
    } finally {
      setFlightLoading(false);
    }
  };

  const openSaveToTripModal = (flight) => {
    setSelectedFlightForSave(flight);
    setShowTripModal(true);
  };

  const handleSaveFlightToTrip = async (tripId) => {
    if (!selectedFlightForSave || !tripId) return;
    
    const flightToSave = {
      flightApiId: selectedFlightForSave.id,
      origin: selectedFlightForSave.departureAirportCode,
      destination: selectedFlightForSave.arrivalAirportCode,
      departureDate: selectedFlightForSave.departureTimeUTC || selectedFlightForSave.departureTimeLocal,
      price: selectedFlightForSave.price,
      details: {
        airlineName: selectedFlightForSave.airlineName,
        flightNumber: selectedFlightForSave.flightNumber,
        departureCity: selectedFlightForSave.departureCity,
        arrivalCity: selectedFlightForSave.arrivalCity,
        durationFormatted: selectedFlightForSave.durationFormatted,
        bookingLink: selectedFlightForSave.bookingLink,
        provider: selectedFlightForSave.provider,
        isRoundTrip: selectedFlightForSave.isRoundTrip,
        returnInfo: selectedFlightForSave.returnInfo,
      }
    };

    try {
      await axios.post(`/api/trips/${tripId}/flights`, flightToSave);
      alert(`Flight to ${selectedFlightForSave.arrivalCity} saved to your trip!`);
      setShowTripModal(false);
      setSelectedFlightForSave(null);
    } catch (err) {
      console.error("Error saving flight to trip:", err.response);
      alert(err.response?.data?.msg || "Failed to save flight.");
    }
  };

  // Helper functions for better data display
  const formatTime = (dateString) => {
    if (!dateString) return 'Times vary';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
    } catch (error) {
      return 'Times vary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Flexible dates';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Flexible dates';
    }
  };

  const formatPrice = (price, currency = 'USD') => {
    if (!price || isNaN(price)) return 'See pricing';
    return `$${parseFloat(price).toFixed(2)} ${currency}`;
  };

  const getAirportInfo = (code) => {
    const airport = POPULAR_AIRPORTS.find(a => a.code === code);
    return airport ? `${airport.city} (${airport.code})` : code || 'Unknown';
  };

  const getFlightDuration = (flight) => {
    if (flight.durationFormatted && flight.durationFormatted !== 'Duration not available') {
      return flight.durationFormatted;
    }
    
    // Try to calculate duration from departure/arrival times
    if (flight.departureTimeLocal && flight.arrivalTimeLocal) {
      try {
        const departure = new Date(flight.departureTimeLocal);
        const arrival = new Date(flight.arrivalTimeLocal);
        const diffMs = arrival - departure;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffHours > 0 && diffMinutes >= 0) {
          return `${diffHours}h ${diffMinutes}m`;
        }
      } catch (error) {
        console.warn('Error calculating flight duration:', error);
      }
    }
    
    return 'Duration varies';
  };

  const getStopsInfo = (flight) => {
    // Simple heuristic based on duration or use API data if available
    const duration = getFlightDuration(flight);
    if (duration.includes('Duration') || !duration || duration === 'Duration varies') {
      return 'Stops vary';
    }
    
    const hours = parseInt(duration.match(/(\d+)h/)?.[1] || '0');
    if (hours > 8) return '1-2 stops';
    if (hours > 4) return '0-1 stops';
    return 'Direct or 1 stop';
  };

  return (
    <div className="flight-search-container">
      <div className="search-header">
        <h2>✈️ Find Your Perfect Flight</h2>
        <p>Compare prices from hundreds of airlines and travel sites</p>
      </div>
      
      {/* IMPROVED: Professional flexible search notice */}
      <div className="search-benefits">
        <div className="benefit-item">
          <span className="benefit-icon">📅</span>
          <span>Flexible dates for best prices</span>
        </div>
        <div className="benefit-item">
          <span className="benefit-icon">💰</span>
          <span>Best deals guaranteed</span>
        </div>
        <div className="benefit-item">
          <span className="benefit-icon">⚡</span>
          <span>Instant search results</span>
        </div>
      </div>
      
      <form onSubmit={handleFlightSearch} className="enhanced-search-form">
        {/* FIXED: Better flight type selector */}
        <div className="flight-type-selector">
          <label className={`flight-type-option ${!isRoundTrip ? 'active' : ''}`}>
            <input 
              type="radio" 
              name="flightType" 
              value="oneway" 
              checked={!isRoundTrip} 
              onChange={() => handleFlightTypeChange('oneway')} 
            />
            <span>One-way</span>
          </label>
          <label className={`flight-type-option ${isRoundTrip ? 'active' : ''}`}>
            <input 
              type="radio" 
              name="flightType" 
              value="roundtrip" 
              checked={isRoundTrip} 
              onChange={() => handleFlightTypeChange('roundtrip')} 
            />
            <span>Round-trip</span>
          </label>
        </div>

        <div className="form-main-row">
          <AirportPicker
            name="origin"
            label="From"
            placeholder="Departure city or airport"
            value={flightSearchData.origin}
            onChange={handleFlightChange}
          />
          
          <div className="swap-button-container">
            <button 
              type="button" 
              className="swap-button"
              onClick={() => {
                setFlightSearchData({
                  ...flightSearchData,
                  origin: flightSearchData.destination,
                  destination: flightSearchData.origin
                });
              }}
              title="Swap departure and destination"
            >
              ⇄
            </button>
          </div>
          
          <AirportPicker
            name="destination"
            label="To"
            placeholder="Destination city or airport"
            value={flightSearchData.destination}
            onChange={handleFlightChange}
          />
        </div>

        <div className="form-date-row">
          <div className="form-group">
            <label htmlFor="departureDate">Departure</label>
            <input 
              type="date" 
              id="departureDate" 
              name="departureDate" 
              value={flightSearchData.departureDate} 
              onChange={handleFlightChange} 
              required 
              className="date-input"
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="returnDate">
              Return {isRoundTrip ? '' : '(Optional)'}
            </label>
            <input 
              type="date" 
              id="returnDate" 
              name="returnDate" 
              value={flightSearchData.returnDate} 
              onChange={handleFlightChange} 
              className="date-input"
              min={flightSearchData.departureDate || new Date().toISOString().split('T')[0]}
              disabled={!isRoundTrip} // FIXED: Disable when one-way selected
            />
          </div>
        </div>

        <div className="form-options-row">
          <div className="form-group">
            <label htmlFor="adults">Passengers</label>
            <select 
              id="adults" 
              name="adults" 
              value={flightSearchData.adults} 
              onChange={handleFlightChange}
              className="select-input"
            >
              <option value="1">1 Adult</option>
              <option value="2">2 Adults</option>
              <option value="3">3 Adults</option>
              <option value="4">4 Adults</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="maxStopovers">Stops</label>
            <select 
              id="maxStopovers" 
              name="maxStopovers" 
              value={flightSearchData.maxStopovers} 
              onChange={handleFlightChange}
              className="select-input"
            >
              <option value="">Any stops</option>
              <option value="0">Direct only</option>
              <option value="1">Up to 1 stop</option>
              <option value="2">Up to 2 stops</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="sortBy">Sort by</label>
            <select 
              id="sortBy" 
              name="sortBy" 
              value={flightSearchData.sortBy} 
              onChange={handleFlightChange}
              className="select-input"
            >
              <option value="PRICE">Best Price</option>
              <option value="DURATION">Shortest</option>
              <option value="QUALITY">Best Value</option>
            </select>
          </div>
        </div>

        <button type="submit" className="search-flights-btn" disabled={flightLoading}>
          {flightLoading ? (
            <>
              <span className="loading-spinner"></span>
              Searching flights...
            </>
          ) : (
            <>
              <span>🔍</span>
              Search Flights
            </>
          )}
        </button>
        
        {flightError && flightResults.length === 0 && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {flightError}
          </div>
        )}
      </form>

      {!flightLoading && flightResults.length > 0 && (
        <div className="flight-results-container">
          <div className="results-header">
            <h3>✈️ Flight Results ({flightResults.length})</h3>
            <span className="results-subtext">Ready to book • Best prices available</span>
          </div>
          
          {flightResults.map((flight) => (
            <div key={flight.id} className={`flight-result-card ${flight.isRoundTrip ? 'round-trip' : 'one-way'}`}>
              <div className="flight-type-badge">
                {flight.isRoundTrip ? '🔄 Round-Trip' : '➡️ One-Way'}
              </div>
              
              <div className="flight-main-info">
                <div className="airline-info">
                  <h4>
                    {flight.airlineName && flight.airlineName !== 'Unknown Airline' && flight.airlineName !== 'N/A'
                      ? flight.airlineName 
                      : 'Multiple Airlines'}
                  </h4>
                  {flight.flightNumber && flight.flightNumber !== 'N/A' && (
                    <span className="flight-number">{flight.flightNumber}</span>
                  )}
                </div>
                
                <div className="route-info">
                  <div className="departure-info">
                    <div className="time">{formatTime(flight.departureTimeLocal || flight.departureTimeUTC)}</div>
                    <div className="date">{formatDate(flight.departureTimeLocal || flight.departureTimeUTC)}</div>
                    <div className="airport">{getAirportInfo(flight.departureAirportCode)}</div>
                  </div>
                  
                  <div className="flight-path">
                    <div className="duration">{getFlightDuration(flight)}</div>
                    <div className="flight-line">
                      <div className="line"></div>
                      <div className="plane-icon-container">
                        <span className="plane-icon">✈️</span>
                      </div>
                    </div>
                    <div className="stops">{getStopsInfo(flight)}</div>
                  </div>
                  
                  <div className="arrival-info">
                    <div className="time">{formatTime(flight.arrivalTimeLocal || flight.arrivalTimeUTC)}</div>
                    <div className="date">{formatDate(flight.arrivalTimeLocal || flight.arrivalTimeUTC)}</div>
                    <div className="airport">{getAirportInfo(flight.arrivalAirportCode)}</div>
                  </div>
                </div>
              </div>

              {flight.isRoundTrip && flight.returnInfo && (
                <div className="return-flight-info">
                  <div className="return-header">🔄 Return Flight</div>
                  <div className="return-details">
                    <span>
                      {formatDate(flight.returnInfo.departureTime)} • 
                      {flight.returnInfo.departureCity} → {flight.returnInfo.arrivalCity}
                    </span>
                  </div>
                </div>
              )}

              <div className="flight-actions">
                <div className="price-info">
                  <div className="price">{formatPrice(flight.price, flight.currency)}</div>
                  <div className="price-type">{flight.isRoundTrip ? 'round-trip' : 'one-way'}</div>
                </div>
                
                <div className="action-buttons">
                  {flight.bookingLink && (
                    <a 
                      href={flight.bookingLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="book-button"
                    >
                      Book Now
                    </a>
                  )}
                  {token && userTrips.length > 0 && (
                    <button 
                      onClick={() => openSaveToTripModal(flight)} 
                      className="save-button"
                    >
                      Save to Trip
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showTripModal && selectedFlightForSave && (
        <div className="modal-overlay">
          <div className="modal-content enhanced-modal">
            <h3>Save Flight to Trip</h3>
            <div className="flight-summary">
              Save this flight to one of your planned trips
            </div>
            {userTrips.length > 0 ? (
              <div className="trip-selection">
                {userTrips.map(trip => (
                  <div 
                    key={trip._id} 
                    className="trip-option"
                    onClick={() => handleSaveFlightToTrip(trip._id)}
                  >
                    <div className="trip-name">{trip.tripName}</div>
                    <div className="trip-destination">{trip.destinationCity}, {trip.destinationCountry}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Create your first trip to save flights!</p>
            )}
            <button 
              onClick={() => { 
                setShowTripModal(false); 
                setSelectedFlightForSave(null);
              }} 
              className="modal-close-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFlights;