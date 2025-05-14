import React from 'react';
import './Navbar.css'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          BudgetBackpack
        </a>
        <ul className="nav-menu">
          <li className="nav-item">
            <a href="/" className="nav-links">Home</a>
          </li>
          <li className="nav-item">
            <a href="/login" className="nav-links">Login</a>
          </li>
          <li className="nav-item">
            <a href="/register" className="nav-links">Register</a>
          </li>
          {/*  more links will be added here later (e.g., Dashboard, Logout) */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;