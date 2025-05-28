// src/pages/TripDetailsPage/TripDetailsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TripDetailsPage.css';

const TripDetailsPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTripDetails = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    setError('');
    try {
      // FIXED: Added /api prefix (this was the main issue)
      const response = await axios.get(`/api/trips/${tripId}`);
      setTrip(response.data);
    } catch (err) {
      console.error("Error fetching trip details:", err);
      if (err.response) {
        if (err.response.status === 404) setError('Trip not found.');
        else if (err.response.status === 401) setError('You are not authorized to view this trip.');
        else setError(`Failed to load trip details: ${err.response.data?.msg || err.response.statusText}`);
      } else {
        setError('Failed to load trip details. Network error or server down.');
      }
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchTripDetails();
  }, [fetchTripDetails]);

  const handleDeleteTrip = async () => {
    if (window.confirm(`Are you sure you want to delete the trip "${trip.tripName}"? This action cannot be undone.`)) {
      setIsDeleting(true);
      setError('');
      try {
        // FIXED: Added /api prefix
        await axios.delete(`/api/trips/${tripId}`);
        navigate('/dashboard');
      } catch (err) {
        console.error("Error deleting trip:", err);
        setError(err.response?.data?.msg || 'Failed to delete trip. Please try again.');
        setIsDeleting(false);
      }
    }
  };

  const handleRemoveItem = async (itemType, itemId, itemDate) => {
    if (!trip || !itemId) return;
    const itemDateTimestamp = new Date(itemDate).getTime();

    let endpoint = '';
    if (itemType === 'flight') {
        // FIXED: Added /api prefix
        endpoint = `/api/trips/${tripId}/flights/${itemId}/${itemDateTimestamp}`;
    } else if (itemType === 'accommodation') {
        // FIXED: Added /api prefix
        endpoint = `/api/trips/${tripId}/accommodations/${itemId}/${itemDateTimestamp}`;
    } else {
        console.warn("Removal for this item type not implemented yet.");
        return;
    }

    if (window.confirm(`Are you sure you want to remove this ${itemType} from your trip?`)) {
        try {
            await axios.delete(endpoint);
            fetchTripDetails(); // Refetch to update the display
            alert(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} removed successfully.`);
        } catch (err) {
            console.error(`Error removing ${itemType}:`, err);
            alert(err.response?.data?.msg || `Failed to remove ${itemType}.`);
        }
    }
  };

  // Helper functions to safely format dates and display data
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatPrice = (price, currency = '') => {
    if (!price || isNaN(price)) return 'N/A';
    return `$${parseFloat(price).toFixed(2)}${currency ? ' ' + currency : ''}`;
  };

  if (loading) return <div className="container text-center"><p>Loading trip details...</p></div>;
  if (error && !trip) return <div className="container text-center error-message"><p>{error}</p><Link to="/dashboard">Back to Dashboard</Link></div>;
  if (!trip) return <div className="container text-center"><p>Trip data not available.</p></div>;

  return (
    <div className="trip-details-container container">
      <header className="trip-details-header">
        <h1>{trip.tripName}</h1>
        <p className="trip-destination">{trip.destinationCity}, {trip.destinationCountry}</p>
        <p className="trip-dates">
          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
        </p>
      </header>

      <div className="trip-actions" style={{ textAlign: 'center', marginBottom: '30px' }}>
         <Link to={`/trip/${tripId}/edit`} className="btn btn-secondary" style={{ marginRight: '10px' }}>
           Edit Trip
         </Link>
         <button onClick={handleDeleteTrip} className="btn btn-danger" disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Trip'}
          </button>
      </div>
      
      {error && trip && <p className="form-error-message general-error text-center">{error}</p>}

      {trip.notes && (
        <section className="trip-content-section" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <h2>My Notes</h2>
          <p style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{trip.notes}</p>
        </section>
      )}

      <section className="trip-content-section" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2>Saved Flights ({trip.savedFlights ? trip.savedFlights.length : 0})</h2>
        {trip.savedFlights && trip.savedFlights.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {trip.savedFlights.map((flight) => (
              <li key={`${flight.flightApiId}-${new Date(flight.departureDate).getTime()}`} 
                  style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
                <div>
                  <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>
                    {flight.origin} to {flight.destination}
                  </h4>
                  <p><strong>Departure:</strong> {formatDateTime(flight.departureDate)}</p>
                  <p><strong>Price:</strong> {formatPrice(flight.price)}</p>
                  {flight.details?.airlineName && <p><strong>Airline:</strong> {flight.details.airlineName}</p>}
                  {flight.details?.flightNumber && <p><strong>Flight:</strong> {flight.details.flightNumber}</p>}
                  {flight.details?.durationFormatted && <p><strong>Duration:</strong> {flight.details.durationFormatted}</p>}
                  
                  <div style={{ marginTop: '10px' }}>
                    {flight.details?.bookingLink && (
                      <a href={flight.details.bookingLink} target="_blank" rel="noopener noreferrer" 
                         className="btn btn-secondary-outline btn-small" style={{ marginRight: '10px' }}>
                        View Booking
                      </a>
                    )}
                    <button 
                      onClick={() => handleRemoveItem('flight', flight.flightApiId, flight.departureDate)} 
                      className="btn btn-danger btn-small"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No flights saved. <Link to="/search" className="text-link">Search for flights!</Link></p>
        )}
      </section>

      <section className="trip-content-section" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2>Saved Accommodations ({trip.savedAccommodations ? trip.savedAccommodations.length : 0})</h2>
        {trip.savedAccommodations && trip.savedAccommodations.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {trip.savedAccommodations.map((acc) => (
              <li key={`${acc.accommodationApiId}-${new Date(acc.checkInDate).getTime()}`} 
                  style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', padding: '15px', marginBottom: '15px', display: 'flex', gap: '15px' }}>
                {acc.imageUrl && (
                  <img src={acc.imageUrl} alt={acc.name} 
                       style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                       onError={(e) => { e.target.style.display = 'none'; }} />
                )}
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{acc.name}</h4>
                  <p><strong>Location:</strong> {acc.location}</p>
                  {acc.checkInDate && (
                    <p><strong>Dates:</strong> {formatDate(acc.checkInDate)} - {acc.checkOutDate ? formatDate(acc.checkOutDate) : 'N/A'}</p>
                  )}
                  <p><strong>Price:</strong> {
                    acc.pricePerNight 
                      ? formatPrice(acc.pricePerNight, acc.currency) + '/night'
                      : acc.totalPrice 
                        ? formatPrice(acc.totalPrice, acc.currency) + ' total'
                        : 'N/A'
                  }</p>
                  {acc.rating && <p><strong>Rating:</strong> {acc.rating.toFixed(1)}/5</p>}
                  
                  <div style={{ marginTop: '10px' }}>
                    {acc.bookingLink && (
                      <a href={acc.bookingLink} target="_blank" rel="noopener noreferrer" 
                         className="btn btn-secondary-outline btn-small" style={{ marginRight: '10px' }}>
                        View on {acc.provider || 'Site'}
                      </a>
                    )}
                    <button 
                      onClick={() => handleRemoveItem('accommodation', acc.accommodationApiId, acc.checkInDate)} 
                      className="btn btn-danger btn-small"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No accommodations saved. <Link to="/search" className="text-link">Search for accommodations!</Link></p>
        )}
      </section>
      
      <section className="trip-content-section" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2>Saved Activities ({trip.savedActivities ? trip.savedActivities.length : 0})</h2>
        {trip.savedActivities && trip.savedActivities.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {trip.savedActivities.map((activity, index) => (
              <li key={activity.activityApiId || index} 
                  style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
                <div>
                  <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{activity.name}</h4>
                  <p><strong>Location:</strong> {activity.location}</p>
                  {activity.date && <p><strong>Date:</strong> {formatDate(activity.date)}</p>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No activities saved. <Link to="/search" className="text-link">Search for activities!</Link></p>
        )}
      </section>
      
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <Link to="/dashboard" className="btn btn-secondary">← Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default TripDetailsPage;
