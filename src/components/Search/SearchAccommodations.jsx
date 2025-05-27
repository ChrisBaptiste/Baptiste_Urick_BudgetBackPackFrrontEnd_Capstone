// src/components/Search/SearchAccommodations.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './SearchAccommodations.css'; // Make sure this is imported

const SearchAccommodations = () => {
  const [searchData, setSearchData] = useState({
    destinationCity: '',
    checkInDate: '', // Ensure your date inputs provide YYYY-MM-DD
    checkOutDate: '', // Ensure your date inputs provide YYYY-MM-DD
    adults: '1',
    currency: 'USD', // Optional: add UI for this
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

    // The backend expects YYYY-MM-DD, ensure your date pickers provide this
    // or format it here if needed. HTML5 date input type="date" does this.

    try {
      const response = await axios.get('/api/search/accommodations', { params: searchData });
      console.log("Frontend: Received raw data from backend:", response.data); // Log raw data
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
    
    // Data structure based on our backend's SavedAccommodationSchema and the transformed data
    const accommodationToSave = {
        accommodationApiId: selectedAccommodationForSave.id,
        name: selectedAccommodationForSave.name,
        location: selectedAccommodationForSave.location, // City or more specific
        destinationCity: selectedAccommodationForSave.destinationCity, // The city used for search or from listing
        checkInDate: selectedAccommodationForSave.checkInDate, // from search params
        checkOutDate: selectedAccommodationForSave.checkOutDate, // from search params
        pricePerNight: selectedAccommodationForSave.pricePerNight,
        totalPrice: selectedAccommodationForSave.totalPrice, // If available
        currency: selectedAccommodationForSave.currency,
        numberOfGuests: selectedAccommodationForSave.numberOfGuests, // from search params
        rating: selectedAccommodationForSave.rating,
        imageUrl: selectedAccommodationForSave.imageUrl,
        bookingLink: selectedAccommodationForSave.bookingLink,
        provider: selectedAccommodationForSave.provider, // Should be 'Airbnb'
        details: {
            // You can add more raw details from selectedAccommodationForSave if needed
            legacyName: selectedAccommodationForSave.description, // Example
            images: selectedAccommodationForSave.images, // Save all images
        }
    };

    try {
      await axios.post(`/trips/${tripId}/accommodations`, accommodationToSave);
      alert(`${selectedAccommodationForSave.name} saved to selected trip!`);
      setShowTripModal(false);
      setSelectedAccommodationForSave(null);
    } catch (err) {
      console.error("Error saving accommodation to trip:", err.response);
      alert(err.response?.data?.msg || "Failed to save accommodation.");
    }
  };

  return (
    <div className="search-form-container accommodation-search">
      <h2>Accommodation Search (Airbnb)</h2>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-group">
          <label htmlFor="destinationCityAcc">Destination (City or Area)</label>
          <input type="text" id="destinationCityAcc" name="destinationCity" value={searchData.destinationCity} onChange={handleChange} placeholder="e.g., Paris, France" required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="checkInDateAcc">Check-in Date</label> {/* Changed ID */}
            <input type="date" id="checkInDateAcc" name="checkInDate" value={searchData.checkInDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="checkOutDateAcc">Check-out Date</label> {/* Changed ID */}
            <input type="date" id="checkOutDateAcc" name="checkOutDate" value={searchData.checkOutDate} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="adultsAcc">Adults</label>
          <input type="number" id="adultsAcc" name="adults" min="1" value={searchData.adults} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching Airbnb...' : 'Search Airbnb'}
        </button>
        {error && results.length === 0 && <p className="form-error-message general-error" style={{ marginTop: '10px' }}>{error}</p>}
      </form>

     {!loading && results.length > 0 && (
  <div className="results-container accommodation-results">
    <h3>Airbnb Results ({results.length})</h3>
    {results.map((hotel) => {
      console.log("Frontend: Processing hotel object for display:", hotel); // move inside a block
      return (
        <div key={hotel.id} className="result-card accommodation-card">
          {hotel.imageUrl && <img src={hotel.imageUrl} alt={hotel.name} className="accommodation-image" />}
          <div className="accommodation-details">
            <h4>{hotel.name}</h4>
            <p><strong>Location:</strong> {hotel.location}</p>
            {hotel.rating && (
              <p>
                <strong>Rating:</strong> {hotel.rating.toFixed(2)} {hotel.reviewCount ? `(${hotel.reviewCount} reviews)` : ''}
              </p>
            )}
            <p>
              <strong>Price:</strong>
              {hotel.pricePerNight ? ` ${hotel.pricePerNight.toFixed(2)} ${hotel.currency} / night` : 'N/A'}
              {hotel.totalPrice && ` (Total: ${hotel.totalPrice.toFixed(2)} ${hotel.currency})`}
            </p>
            {hotel.bookingLink && (
              <a href={hotel.bookingLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary-outline btn-small" style={{ marginRight: '10px' }}>
                View on {hotel.provider}
              </a>
            )}
            {token && userTrips.length > 0 && (
              <button onClick={() => openSaveToTripModal(hotel)} className="btn btn-primary btn-small">Save to Trip</button>
            )}
          </div>
        </div>
      );
    })}
  </div>
)}


      {showTripModal && selectedAccommodationForSave && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Save "{selectedAccommodationForSave.name}" to a Trip</h3>
            {userTrips.length > 0 ? (
              <ul className="trip-selection-list">
                {userTrips.map(trip => (
                  <li key={trip._id} onClick={() => handleSaveAccommodationToTrip(trip._id)}>
                    {trip.tripName} ({trip.destinationCity})
                  </li>
                ))}
              </ul>
            ) : <p>You have no trips. Create one first!</p>}
            <button onClick={() => { setShowTripModal(false); setSelectedAccommodationForSave(null);}} className="btn btn-secondary">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAccommodations;
