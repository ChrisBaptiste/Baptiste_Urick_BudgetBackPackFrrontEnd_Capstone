// src/components/Search/SearchAccommodations.jsx


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './SearchAccommodations.css';

const SearchAccommodations = () => {
  const [searchData, setSearchData] = useState({
    destinationCity: '',
    checkInDate: '',
    checkOutDate: '',
    adults: '1',
    currency: 'USD',
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [userTrips, setUserTrips] = useState([]);
  const [showTripModal, setShowTripModal] = useState(false);
  const [selectedAccommodationForSave, setSelectedAccommodationForSave] = useState(null);
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

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);

    if (!searchData.destinationCity || !searchData.checkInDate || !searchData.checkOutDate) {
      setError('Please provide destination, check-in date, and check-out date.');
      setLoading(false);
      return;
    }
    if (new Date(searchData.checkInDate) >= new Date(searchData.checkOutDate)) {
      setError('Check-out date must be after check-in date.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('/api/search/accommodations', { params: searchData });
      console.log("Frontend: Received accommodation data:", response.data);
      setResults(response.data);
      if (response.data.length === 0) {
        setError('No accommodations found for your criteria. Try different dates or locations.');
      }
    } catch (err) {
      console.error("Accommodation search error:", err.response || err);
      setError(err.response?.data?.msg || 'Failed to fetch accommodation data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openSaveToTripModal = (accommodation) => {
    setSelectedAccommodationForSave(accommodation);
    setShowTripModal(true);
  };

  const handleSaveAccommodationToTrip = async (tripId) => {
    if (!selectedAccommodationForSave || !tripId) return;
    
    const accommodationToSave = {
      accommodationApiId: selectedAccommodationForSave.id,
      name: selectedAccommodationForSave.name,
      location: selectedAccommodationForSave.location,
      destinationCity: selectedAccommodationForSave.destinationCity,
      checkInDate: selectedAccommodationForSave.checkInDate,
      checkOutDate: selectedAccommodationForSave.checkOutDate,
      pricePerNight: selectedAccommodationForSave.pricePerNight,
      totalPrice: selectedAccommodationForSave.totalPrice,
      currency: selectedAccommodationForSave.currency,
      numberOfGuests: selectedAccommodationForSave.numberOfGuests,
      rating: selectedAccommodationForSave.rating,
      imageUrl: selectedAccommodationForSave.imageUrl,
      bookingLink: selectedAccommodationForSave.bookingLink,
      provider: selectedAccommodationForSave.provider,
      details: {
        description: selectedAccommodationForSave.description,
        images: selectedAccommodationForSave.images,
        reviewCount: selectedAccommodationForSave.reviewCount
      }
    };

    try {
      await axios.post(`/api/trips/${tripId}/accommodations`, accommodationToSave);
      alert(`${selectedAccommodationForSave.name} saved to selected trip!`);
      setShowTripModal(false);
      setSelectedAccommodationForSave(null);
    } catch (err) {
      console.error("Error saving accommodation to trip:", err.response);
      alert(err.response?.data?.msg || "Failed to save accommodation.");
    }
  };

  const renderAccommodationCard = (hotel) => {
    const hasPrice = hotel.pricePerNight && !isNaN(hotel.pricePerNight);
    const hasImage = hotel.imageUrl && hotel.imageUrl.trim() !== '';
    const hasRating = hotel.rating && !isNaN(hotel.rating);

    return (
      <div key={hotel.id} className="accommodation-card enhanced">
        <div className="accommodation-image-container">
          {hasImage ? (
            <img 
              src={hotel.imageUrl} 
              alt={hotel.name}
              className="accommodation-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="accommodation-image-placeholder" 
            style={{ display: hasImage ? 'none' : 'flex' }}
          >
            <span className="placeholder-icon">🏠</span>
            <p>No image available</p>
          </div>
        </div>
        
        <div className="accommodation-details">
          <div className="accommodation-header">
            <h4 className="accommodation-name">{hotel.name || 'Accommodation'}</h4>
            {hotel.provider && (
              <span className="provider-badge">{hotel.provider}</span>
            )}
          </div>
          
          <p className="accommodation-location">
            <span className="location-icon">📍</span>
            {hotel.location || 'Location not specified'}
          </p>
          
          {hasRating && (
            <div className="rating-display">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`star ${i < Math.floor(hotel.rating) ? 'filled' : ''}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-number">{hotel.rating.toFixed(1)}</span>
              {hotel.reviewCount && (
                <span className="review-count">({hotel.reviewCount.toLocaleString()} reviews)</span>
              )}
            </div>
          )}
          
          <div className="price-section">
            {hasPrice ? (
              <div className="price-display">
                <span className="price-amount">
                  ${hotel.pricePerNight.toFixed(2)}
                </span>
                <span className="price-period">/ night</span>
                {hotel.totalPrice && (
                  <div className="total-price">
                    Total: ${hotel.totalPrice.toFixed(2)} {hotel.currency}
                  </div>
                )}
              </div>
            ) : (
              <div className="price-unavailable">
                <span className="price-icon">💰</span>
                <span>Price available on booking site</span>
              </div>
            )}
          </div>
          
          <div className="accommodation-metadata">
            <span className="guest-info">
              👥 {hotel.numberOfGuests} guest{hotel.numberOfGuests > 1 ? 's' : ''}
            </span>
            <span className="date-info">
              📅 {new Date(hotel.checkInDate).toLocaleDateString()} - {new Date(hotel.checkOutDate).toLocaleDateString()}
            </span>
          </div>
          
          <div className="action-buttons">
            {hotel.bookingLink && (
              <a 
                href={hotel.bookingLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary view-details-btn"
              >
                <span className="btn-icon">🔗</span>
                View Details
              </a>
            )}
            {token && userTrips.length > 0 && (
              <button 
                onClick={() => openSaveToTripModal(hotel)} 
                className="btn btn-secondary save-btn"
              >
                <span className="btn-icon">💾</span>
                Save to Trip
              </button>
            )}
          </div>
        </div>
        
        {/* Data quality indicator for debugging */}
        {process.env.NODE_ENV === 'development' && hotel._debug && (
          <div className="debug-info">
            <small>
              Debug: Price: {hotel._debug.hasPrice ? '✅' : '❌'} | 
              Image: {hotel._debug.hasImage ? '✅' : '❌'} | 
              Rating: {hotel._debug.hasRating ? '✅' : '❌'}
            </small>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="search-form-container accommodation-search">
      <div className="search-header">
        <h2>🏠 Find Your Perfect Stay</h2>
        <p>Discover amazing accommodations for your next adventure</p>
      </div>

      <form onSubmit={handleSubmit} className="search-form enhanced">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="destinationCityAcc">
              <span className="label-icon">🎯</span>
              Destination
            </label>
            <input 
              type="text" 
              id="destinationCityAcc" 
              name="destinationCity" 
              value={searchData.destinationCity} 
              onChange={handleChange} 
              placeholder="e.g., Paris, Tokyo, New York" 
              required 
              className="location-input"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="checkInDateAcc">
              <span className="label-icon">📅</span>
              Check-in Date
            </label>
            <input 
              type="date" 
              id="checkInDateAcc" 
              name="checkInDate" 
              value={searchData.checkInDate} 
              onChange={handleChange} 
              required 
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="form-group">
            <label htmlFor="checkOutDateAcc">
              <span className="label-icon">📅</span>
              Check-out Date
            </label>
            <input 
              type="date" 
              id="checkOutDateAcc" 
              name="checkOutDate" 
              value={searchData.checkOutDate} 
              onChange={handleChange} 
              required 
              min={searchData.checkInDate || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="adultsAcc">
              <span className="label-icon">👥</span>
              Guests
            </label>
            <select 
              id="adultsAcc" 
              name="adults" 
              value={searchData.adults} 
              onChange={handleChange}
              className="guests-select"
            >
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4 Guests</option>
              <option value="5">5 Guests</option>
              <option value="6">6+ Guests</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="currencyAcc">
              <span className="label-icon">💱</span>
              Currency
            </label>
            <select 
              id="currencyAcc" 
              name="currency" 
              value={searchData.currency} 
              onChange={handleChange}
              className="currency-select"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD (C$)</option>
            </select>
          </div>
        </div>
        
        <button type="submit" className="search-btn enhanced" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Searching accommodations...
            </>
          ) : (
            <>
              <span className="search-icon">🔍</span>
              Search Accommodations
            </>
          )}
        </button>
        
        {error && results.length === 0 && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
      </form>

      {!loading && results.length > 0 && (
        <div className="results-container accommodation-results">
          <div className="results-header">
            <h3>🏠 Found {results.length} Accommodations</h3>
            <div className="results-summary">
              <span className="summary-item">
                💰 {results.filter(h => h.pricePerNight).length} with prices
              </span>
              <span className="summary-item">
                📸 {results.filter(h => h.imageUrl).length} with photos
              </span>
              <span className="summary-item">
                ⭐ {results.filter(h => h.rating).length} with ratings
              </span>
            </div>
          </div>
          
          <div className="accommodations-grid">
            {results.map(renderAccommodationCard)}
          </div>
        </div>
      )}

      {showTripModal && selectedAccommodationForSave && (
        <div className="modal-overlay">
          <div className="modal-content enhanced-modal">
            <div className="modal-header">
              <h3>Save to Trip</h3>
              <button 
                className="modal-close-btn"
                onClick={() => { 
                  setShowTripModal(false); 
                  setSelectedAccommodationForSave(null);
                }}
              >
                ✕
              </button>
            </div>
            
            <div className="accommodation-summary">
              <div className="summary-image">
                {selectedAccommodationForSave.imageUrl ? (
                  <img src={selectedAccommodationForSave.imageUrl} alt={selectedAccommodationForSave.name} />
                ) : (
                  <div className="summary-placeholder">🏠</div>
                )}
              </div>
              <div className="summary-details">
                <h4>{selectedAccommodationForSave.name}</h4>
                <p>{selectedAccommodationForSave.location}</p>
                {selectedAccommodationForSave.pricePerNight && (
                  <p className="summary-price">${selectedAccommodationForSave.pricePerNight.toFixed(2)}/night</p>
                )}
              </div>
            </div>
            
            {userTrips.length > 0 ? (
              <div className="trip-selection">
                <p>Choose a trip to save this accommodation:</p>
                <div className="trip-list">
                  {userTrips.map(trip => (
                    <div 
                      key={trip._id} 
                      className="trip-option"
                      onClick={() => handleSaveAccommodationToTrip(trip._id)}
                    >
                      <div className="trip-info">
                        <h5>{trip.tripName}</h5>
                        <p>{trip.destinationCity}, {trip.destinationCountry}</p>
                        <small>
                          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                        </small>
                      </div>
                      <span className="trip-arrow">→</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-trips-message">
                <p>You don't have any trips yet.</p>
                <p>Create your first trip to save accommodations!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAccommodations;