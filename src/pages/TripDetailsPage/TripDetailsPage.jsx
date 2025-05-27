
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
      const response = await axios.get(`/trips/${tripId}`);
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
        await axios.delete(`/trips/${tripId}`);
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
        endpoint = `/trips/${tripId}/flights/${itemId}/${itemDateTimestamp}`;
    } else if (itemType === 'accommodation') {
        endpoint = `/trips/${tripId}/accommodations/${itemId}/${itemDateTimestamp}`;
    } else {
        // Handle activities if needed
        console.warn("Removal for this item type not implemented yet.");
        return;
    }

    if (window.confirm(`Are you sure you want to remove this ${itemType} from your trip?`)) {
        try {
            const response = await axios.delete(endpoint);
            // Update trip state locally to reflect removal by refetching
            fetchTripDetails(); // Or update state manually: setTrip(prev => ({...prev, [`saved${itemType.charAt(0).toUpperCase() + itemType.slice(1)}s`]: response.data }))
            alert(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} removed successfully.`);
        } catch (err) {
            console.error(`Error removing ${itemType}:`, err);
            alert(err.response?.data?.msg || `Failed to remove ${itemType}.`);
        }
    }
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
          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
        </p>
      </header>

      <div className="trip-actions">
         <Link to={`/trip/${tripId}/edit`} className="btn btn-secondary">Edit Trip</Link>
         <button onClick={handleDeleteTrip} className="btn btn-danger" disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Trip'}
          </button>
      </div>
      {error && trip && <p className="form-error-message general-error text-center">{error}</p>}

      {trip.notes && (
        <section className="trip-content-section">
          <h2>My Notes</h2>
          <p className="notes-content">{trip.notes}</p>
        </section>
      )}

      <section className="trip-content-section">
        <h2>Saved Flights</h2>
        {trip.savedFlights && trip.savedFlights.length > 0 ? (
          <ul className="saved-items-list">
            {trip.savedFlights.map((flight) => (
              <li key={`${flight.flightApiId}-${new Date(flight.departureDate).getTime()}`} className="saved-item-card">
                <div className="saved-item-details">
                  <h4>{flight.origin} to {flight.destination}</h4>
                  <p>Departure: {new Date(flight.departureDate).toLocaleString()}</p>
                  <p>Price: {flight.price ? `$${flight.price.toFixed(2)}` : 'N/A'}</p>
                  {flight.details?.airlineName && <p>Airline: {flight.details.airlineName}</p>}
                  <button onClick={() => handleRemoveItem('flight', flight.flightApiId, flight.departureDate)} className="btn btn-danger btn-small">Remove</button>
                </div>
              </li>
            ))}
          </ul>
        ) : <p>No flights saved. <Link to="/search" state={{ activeSearch: 'flights' }} className="text-link">Search for flights!</Link></p>}
      </section>

      <section className="trip-content-section">
        <h2>Saved Accommodations</h2>
        {trip.savedAccommodations && trip.savedAccommodations.length > 0 ? (
          <ul className="saved-items-list">
            {trip.savedAccommodations.map((acc) => (
              <li key={`${acc.accommodationApiId}-${new Date(acc.checkInDate).getTime()}`} className="saved-item-card">
                {acc.imageUrl && <img src={acc.imageUrl} alt={acc.name} className="saved-item-image" />}
                <div className="saved-item-details">
                    <h4>{acc.name}</h4>
                    <p>Location: {acc.location}</p>
                    {acc.checkInDate && <p>Dates: {new Date(acc.checkInDate).toLocaleDateString()} - {acc.checkOutDate ? new Date(acc.checkOutDate).toLocaleDateString() : 'N/A'}</p>}
                    <p>Price: {acc.pricePerNight ? `$${acc.pricePerNight.toFixed(2)} ${acc.currency || ''}` : (acc.totalPrice ? `$${acc.totalPrice.toFixed(2)} ${acc.currency || ''}` : 'N/A')}</p>
                    {acc.bookingLink && <a href={acc.bookingLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary-outline btn-small" style={{marginRight:'5px'}}>View Deal</a>}
                    <button onClick={() => handleRemoveItem('accommodation', acc.accommodationApiId, acc.checkInDate)} className="btn btn-danger btn-small">Remove</button>
                </div>
              </li>
            ))}
          </ul>
        ) : <p>No accommodations saved. <Link to="/search" state={{ activeSearch: 'accommodations' }} className="text-link">Search for accommodations!</Link></p>}
      </section>
      
      <section className="trip-content-section">
        <h2>Saved Activities</h2>
        {trip.savedActivities && trip.savedActivities.length > 0 ? (
             <ul className="saved-items-list">
                {trip.savedActivities.map(activity => (
                     <li key={activity.activityApiId} className="saved-item-card">
                        <div className="saved-item-details">
                            <h4>{activity.name}</h4>
                            <p>Location: {activity.location}</p>
                            {activity.date && <p>Date: {new Date(activity.date).toLocaleDateString()}</p>}
                            {/* Add Remove button for activities similar to others */}
                        </div>
                     </li>
                ))}
             </ul>
        ) : <p>No activities saved. <Link to="/search" state={{ activeSearch: 'events' }} className="text-link">Search for activities!</Link></p>}
      </section>
      
      <div style={{ marginTop: '30px' }}>
        <Link to="/dashboard" className="btn">← Back to Dashboard</Link>
      </div>
    </div>
  );
};
export default TripDetailsPage;
