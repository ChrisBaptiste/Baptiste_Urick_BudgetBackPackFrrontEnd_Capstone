// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// My Component Imports - I need to make sure these paths are correct based on my file structure.
import Navbar from './components/Navbar/Navbar.jsx'; 
import Footer from './components/Footer/Footer.jsx'; 
import PrivateRoute from './components/routing/PrivateRoute.jsx';

// My Page Imports
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx'; 
import LoginPage from './pages/LoginPage/LoginPage.jsx'; 
import DashboardPage from './pages/Dashboard/DashboardPage.jsx'; 
import CreateTripPage from './pages/CreateTrip/CreateTripPage.jsx'; // Assuming this is directly in pages
import EditTripPage from './pages/EditTrip/EditTripPage.jsx';     // Assuming this is directly in pages
import TripDetailsPage from './pages/TripDetailsPage/TripDetailsPage.jsx'; // Assuming this is directly in pages
import SearchPage from './pages/Search/SearchPage.jsx'; // This is the updated import path for SearchPage.
import HomePage from './pages/Home/HomePage.jsx';

import './App.css'; // My global styles

// Placeholder components for any routes I haven't fully built out yet.
const HomePagePlaceholder = () => <div><h1>Welcome to BudgetBackpack!</h1><p>Your adventure starts here.</p></div>;
const NotFoundPlaceholder = () => <div><h2>404 Page Not Found</h2></div>;


function App() {
  // My main application structure with routing.
  return (
    <Router>
      <div className="app-container"> {/* Main container for layout styling */}
        <Navbar /> {/* My navigation bar, always visible. */}
        <main className="main-content"> {/* Main content area where pages will render. */}
          <Routes> {/* This component handles defining all my routes. */}
            
            {/* --- Public Routes --- */}
            {/* These routes are accessible to everyone, logged in or not. */}
            <Route path="/" element={<HomePage />} /> 
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* --- Protected Routes --- */}
            {/* I'm using my PrivateRoute component as a layout route. */}
            {/* Any route nested inside this will require the user to be authenticated. */}
            {/* If not authenticated, PrivateRoute will redirect them to /login. */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/search" element={<SearchPage />} /> {/* Using my actual SearchPage component. */}
              <Route path="/create-trip" element={<CreateTripPage />} />
              <Route path="/trip/:tripId" element={<TripDetailsPage />} />
              <Route path="/trip/:tripId/edit" element={<EditTripPage />} />
              {/* I can add more protected routes here later, like /profile. */}
            </Route>
            
            {/* Catch-all route for any paths not matched above. */}
            <Route path="*" element={<NotFoundPlaceholder />} />
          </Routes>
        </main>
        <Footer /> {/* My footer, always visible. */}
      </div>
    </Router>
  );
}

export default App;