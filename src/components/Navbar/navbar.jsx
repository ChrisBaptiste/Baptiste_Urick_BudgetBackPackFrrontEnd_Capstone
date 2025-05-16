// src/components/Navbar/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx'; 
import './Navbar.css'; 

const Navbar = () => {
  const { isAuthenticated, logoutAction } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAction(); 
    navigate('/login'); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img 
            src="/Images/Logo_Image-removebg-preview.png" 
            alt="BudgetBackpack Logo" 
            className="logo-image" // I'll add hover effects to this class
          />
          BudgetBackpack {/* text infront of logo */}
        </Link>
        
        <ul className="nav-menu">
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-links">
                  Dashboard 
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/search" className="nav-links">
                  Search
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-links nav-button-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;