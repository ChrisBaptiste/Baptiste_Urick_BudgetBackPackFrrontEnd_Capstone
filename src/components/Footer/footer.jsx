import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>© {new Date().getFullYear()} BudgetBackpack. All rights reserved.</p>
        {/* add more links here for footer in future */}
      </div>
    </footer>
  );
};

export default Footer;