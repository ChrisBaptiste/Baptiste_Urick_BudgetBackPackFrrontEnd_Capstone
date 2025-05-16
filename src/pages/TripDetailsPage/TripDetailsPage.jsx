// src/pages/TripDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Added useNavigate for redirection after delete.
import axios from 'axios';
import './TripDetailsPage.css'; // Assuming I have this for styles.

const TripDetailsPage = () => {
  const { tripId } = useParams(); 
  const navigate = useNavigate(); // Hook for programmatic navigation.
  
  const [trip, setTrip] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(''); 
  const [isDeleting, setIsDeleting] = useState(false); // State for delete operation loading.

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!tripId) return; 

      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`/api/trips/${tripId}`);
        setTrip(response.data); 
      } catch (err) {
        console.error("Error fetching trip details:", err);
        if (err.response && err.response.status === 404) {
          setError('Trip not found.');
        } else if (err.response && err.response.status === 401) {
          setError('You are not authorized to view this trip.');
        } else {
          setError('Failed to load trip details.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTripDetails();
  }, [tripId]); 

  // This function will handle the deletion of the trip.
  const handleDeleteTrip = async () => {
    // It's very important to confirm deletion with the user!
    if (window.confirm(`Are you sure you want to delete the trip "${trip.tripName}"? This action cannot be undone.`)) {
      setIsDeleting(true); // Indicate deletion is in progress.
      setError(''); // Clear previous errors.
      try {
        // My API endpoint for deleting a trip.
        await axios.delete(`/api/trips/${tripId}`);
        console.log('Trip deleted successfully'); // My debug message.
        // After successful deletion, I'll redirect the user to the dashboard.
        navigate('/dashboard');
      } catch (err) {
        console.error("Error deleting trip:", err);
        setError('Failed to delete trip. Please try again.');
        setIsDeleting(false); // Reset deletion state on error.
      }
      // setIsDeleting(false); // This should ideally be in a finally block if not navigating away.
      // Since navigate() happens, this component will unmount, so explicit reset might not be strictly needed here.
    }
  };

  if (loading) {
    return <div className="container text-center"><p>Loading trip details...</p></div>;
  }

  if (error && !trip) { // Show error prominently if trip couldn't be loaded
    return (
      <div className="container text-center error-message">
        <p>{error}</p>
        <Link to="/dashboard">Go back to Dashboard</Link>
      </div>
    );
  }
  
  if (!trip) { // Fallback if trip is null after loading and no specific error was set to block rendering
    return <div className="container text-center"><p>Trip data not available or an error occurred.</p></div>;
  }

  return (
    <div className="trip-details-container container"> 
      <header className="trip-details-header">
        <h1>{trip.tripName}</h1>
        <p className="trip-destination">
          {trip.destinationCity}, {trip.destinationCountry}
        </p>
        <p className="trip-dates">
          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
        </p>
      </header>

      <div className="trip-actions" style={{ marginBottom: '20px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
         <Link to={`/trip/${tripId}/edit`} className="btn btn-secondary">Edit Trip</Link>
         {/* My new Delete Trip button */}
         <button 
            onClick={handleDeleteTrip} 
            className="btn btn-danger" // I'll need a .btn-danger style.
            disabled={isDeleting} // Disable button while deletion is in progress.
          >
            {isDeleting ? 'Deleting...' : 'Delete Trip'}
          </button>
      </div>
      {/* Displaying an error specific to delete operation if it occurs */}
      {error && trip && <p className="form-error-message general-error" style={{textAlign: 'center'}}>{error}</p>}


      {trip.notes && (
        <section className="trip-notes-section">
          <h2>My Notes</h2>
          <p>{trip.notes}</p>
        </section>
      )}

      <section className="trip-saved-items">
        <h2>Saved Items</h2>
        <p><em>(Functionality for saved items coming soon!)</em></p>
      </section>
      
      <div style={{ marginTop: '30px' }}>
        <Link to="/dashboard" className="btn">← Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default TripDetailsPage;