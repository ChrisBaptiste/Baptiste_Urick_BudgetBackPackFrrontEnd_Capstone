// src/pages/Home/HomePage.jsx (or your path)
import React, { useState, useEffect } from 'react'; // I need useEffect for the timer.
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import './HomePage.css';

// Array of my hero image paths (accessible from the public folder)
const heroImages = [
  '/Images/AdventurePhoto.jpg',
  '/Images/MuseumPhoto.jpg',
  '/Images/NightLifePhoto.jpg',
  '/Images/SandyBeach.jpg',
  '/Images/UrbanLandScapePhoto.jpg', // Corrected potential typo
];

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State for the current image.

  // This useEffect will handle the slideshow timer.
  useEffect(() => {
    // I want to change the image every 3 seconds.
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // 3000 milliseconds = 3 seconds

    // It's important to clear the interval when the component unmounts
    // to prevent memory leaks and errors.
    return () => clearInterval(timer);
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount.

  return (
    <div className="home-page">
      {/* My hero section will now have a dynamic background image. */}
      <header 
        className="home-hero" 
        // I'm setting the background image inline to easily change it with state.
        // The key prop helps React efficiently update the DOM when the background image changes by forcing a re-render of this specific element.
        key={heroImages[currentImageIndex]} 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImages[currentImageIndex]})`
        }}
      >
        <div className="hero-content container">
          <h1>BudgetBackpack</h1>
          <p className="subtitle">Your Smart Companion for Affordable Adventures!</p>
          <p className="hero-description">
            Plan your dream trips, discover budget-friendly flights, find exciting local events,
            and keep all your travel details organized in one place. Let's make your next journey unforgettable (and affordable!).
          </p>
          <div className="hero-cta-buttons">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to My Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary btn-lg" style={{ marginRight: '15px' }}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-secondary btn-lg">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="home-features container">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h3>📋 Plan Your Trips</h3>
            <p>Organize itineraries, destinations, dates, and personal notes for every adventure.</p>
          </div>
          <div className="feature-item">
            <h3>✈️ Flight Search</h3>
            <p>Find one-way flight options to kickstart your journey (Round-trip search coming soon!).</p>
          </div>
          <div className="feature-item">
            <h3>🎉 Event Discovery</h3>
            <p>Explore local events, attractions, and points of interest at your destination.</p>
          </div>
          <div className="feature-item">
            <h3>🔒 Secure & Personal</h3>
            <p>Your travel plans are saved securely to your account, accessible anytime.</p>
          </div>
        </div>
      </section>

      {!isAuthenticated && (
        <section className="home-final-cta container text-center">
          <h2>Ready to Start Planning?</h2>
          <p>Join BudgetBackpack today and turn your travel dreams into reality.</p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Sign Up Now - It's Free!
          </Link>
        </section>
      )}
    </div>
  );
};

export default HomePage;