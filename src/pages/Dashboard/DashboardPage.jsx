// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // I'll need this to fetch user's trips.
import { Link } from 'react-router-dom'; // For linking to create trip page or trip details.
import { useAuth } from '../../context/AuthContext'; // To potentially display user info.
import './DashboardPage.css'; // My specific styles for this page.

// I'll create these components in a bit.
// import CreateTripForm from '../components/Trips/CreateTripForm';
// import TripList from '../components/Trips/TripList';

const DashboardPage = () => {
  const { user } = useAuth(); // Getting user info (currently null, but for future use).
  const [trips, setTrips] = useState([]); // State to hold the list of user's trips.
  const [loadingTrips, setLoadingTrips] = useState(true); // Loading state for fetching trips.
  const [error, setError] = useState(''); // State for any errors during fetching.

  // This useEffect will run when the component mounts to fetch the user's trips.
  useEffect(() => {
    const fetchTrips = async () => {
      setLoadingTrips(true);
      setError('');
      try {
        // My API endpoint to get all trips for the logged-in user is '/api/trips'.
        // The AuthContext has already set the axios default header with the token.
        const response = await axios.get('/api/trips');
        setTrips(response.data); // Setting the fetched trips into state.
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError('Failed to load your trips. Please try again later.');
        // I might want to check if it's an auth error (e.g., token expired)
        // and trigger logout via AuthContext if needed. For now, a simple message.
      } finally {
        setLoadingTrips(false);
      }
    };

    fetchTrips();
  }, []); // Empty dependency array means this runs once on mount.

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>My Travel Dashboard</h1>
        {/* I could greet the user here if I had their username from the context */}
        {/* {user && <p>Welcome, {user.username || ' Traveler'}!</p>} */}
        <p>Here you can manage your upcoming adventures and plan new ones.</p>
      </header>

      <section className="dashboard-actions">
        {/* I'll add a link or button to a page/modal for creating a new trip */}
        <Link to="/create-trip" className="btn btn-primary">Plan a New Trip</Link>
        {/* We'll need to create the /create-trip route and page later. */}
      </section>

      <section className="trips-section">
        <h2>Your Trips</h2>
        {loadingTrips && <p>Loading your trips...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loadingTrips && !error && trips.length === 0 && (
          <p>You haven't planned any trips yet. Let's get started!</p>
        )}
        {!loadingTrips && !error && trips.length > 0 && (
          <ul className="trip-list">
            {/* I will map over the 'trips' array here to display each trip. */}
            {/* Each trip item could be a link to its details page. */}
            {trips.map(trip => (
              <li key={trip._id} className="trip-item">
                <Link to={`/trip/${trip._id}`}>
                  <h3>{trip.tripName}</h3>
                  <p>Destination: {trip.destinationCity}, {trip.destinationCountry}</p>
                  <p>Dates: {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
                </Link>
                {/* I might add edit/delete buttons here later */}
              </li>
            ))}
          </ul>
        )}
        {/* Later, I'll replace this direct rendering with <TripList trips={trips} /> */}
      </section>
    </div>
  );
};

export default DashboardPage;