// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/navbar.jsx';
import Footer from './components/Footer/footer.jsx';
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx'; // I've imported my new RegisterPage.
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import DashboardPage from './pages/DashboardPage';
// import TripDetailsPage from './pages/TripDetailsPage';
// import SearchPage from './pages/SearchPage';

import './App.css'; // My global styles

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Placeholder for HomePage */}
            <Route path="/" element={<div><h1>Welcome to BudgetBackpack!</h1><p>Your adventure starts here.</p></div>} />
            
            <Route path="/register" element={<RegisterPage />} /> {/* I've added the route for my register page. */}

            {/*
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/trip/:tripId" element={<TripDetailsPage />} />
            <Route path="/search" element={<SearchPage />} />
            */}
            <Route path="*" element={<div><h2>404 Page Not Found</h2></div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
