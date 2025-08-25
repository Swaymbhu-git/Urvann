import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = ({ isAdmin = false }) => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/" className="logo-link">
            <span className="logo-icon">🌱</span>
            <span className="logo-text">Urvann</span>
          </Link>
        </div>
        
        <nav className="nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Browse Plants
          </Link>
          {isAdmin && (
            <Link 
              to="/admin/add-plant" 
              className={`nav-link ${location.pathname === '/admin/add-plant' ? 'active' : ''}`}
            >
              Add Plant
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;