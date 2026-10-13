import React, { useState } from "react";

export default function Navbar({ workerCount }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-header" id="home">
      <div className="container nav-container">
        <a href="#home" className="nav-brand" onClick={closeMobileMenu}>
          <div className="brand-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <div className="brand-text-group">
            <span className="brand-name">
              Labour<span className="brand-accent">Connect</span>
            </span>
            <span className="brand-tagline">Skilled Trades & Services</span>
          </div>
        </a>

        {/* Live worker count badge */}
        <div className="nav-badge-pill">
          <span className="pulse-dot"></span>
          <span>{workerCount} Workers Available</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-links desktop-nav" aria-label="Main Navigation">
          <a href="#home">Home</a>
          <a href="#stats">Overview</a>
          <a href="#workers">Find Workers</a>
          <a href="#register">Register</a>
          <a href="#about">About</a>
          <a href="#register" className="nav-cta-btn">
            + Join as Worker
          </a>
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="mobile-toggle-btn"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" role="navigation" aria-label="Mobile Navigation">
          <a href="#home" onClick={closeMobileMenu}>Home</a>
          <a href="#stats" onClick={closeMobileMenu}>Overview</a>
          <a href="#workers" onClick={closeMobileMenu}>Find Workers</a>
          <a href="#register" onClick={closeMobileMenu}>Register Profile</a>
          <a href="#about" onClick={closeMobileMenu}>About Platform</a>
          <a href="#register" className="mobile-cta-btn" onClick={closeMobileMenu}>
            + Join as Worker
          </a>
        </div>
      )}
    </header>
  );
}
