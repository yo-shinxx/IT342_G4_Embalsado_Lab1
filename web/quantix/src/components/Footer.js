import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>System Perspective Quantix</h4>
          <p>Centralized Inventory Management System</p>
          <p>Cebu Institute of Technology - University</p>
        </div>
        
        <div className="footer-section">
          <h4>Assumptions & Dependencies</h4>
          <ul>
            <li>Valid CIT-U Microsoft accounts required</li>
            <li>Microsoft OAuth services operational</li>
            <li>Officially assigned personnel only</li>
            <li>CIT-U network connectivity</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact Support</h4>
          <p>For access issues or technical support:</p>
          <p>it-support@cit.edu</p>
          <p>© {currentYear} CIT-U. For internal use only.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;