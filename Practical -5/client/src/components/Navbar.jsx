import React, { useState } from 'react';

function Navbar({ activeTab, setActiveTab }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: 'bi-house-door' },
    { id: 'workers', label: 'Find Workers', icon: 'bi-people' },
    { id: 'jobs', label: 'Find Jobs', icon: 'bi-briefcase' },
    { id: 'request-service', label: 'Request Service', icon: 'bi-tools' },
    { id: 'register-worker', label: 'Register as Worker', icon: 'bi-person-badge' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setIsNavOpen(false);
  };

  return (
    <header className="site-header sticky-top">
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container">
          {/* Brand Logo & Name */}
          <button 
            className="btn btn-link navbar-brand d-flex align-items-center gap-2 p-0 text-decoration-none"
            onClick={() => handleNavClick('home')}
            aria-label="Labour Connect Home"
          >
            <div className="brand-badge">
              <i className="bi bi-hammer fs-5"></i>
            </div>
            <div className="d-flex flex-column text-start">
              <span className="brand-text lh-1">Labour Connect</span>
              <small className="brand-subtext">
                SKILLED WORKERS &amp; SERVICES
              </small>
            </div>
          </button>

          {/* Mobile Toggle Button */}
          <button
            className={`navbar-toggler border-0 ${!isNavOpen ? 'collapsed' : ''}`}
            type="button"
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-controls="navbarContent"
            aria-expanded={isNavOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation Links */}
          <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="navbarContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1 py-2 py-lg-0">
              {navItems.map((item) => (
                <li className="nav-item" key={item.id}>
                  <button
                    className={`nav-link nav-link-custom d-flex align-items-center gap-2 border-0 bg-transparent w-100 ${
                      activeTab === item.id ? 'active' : ''
                    }`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <i className={`bi ${item.icon}`}></i>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>

            {/* Quick Action Button */}
            <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0 pt-2 pt-lg-0 border-top border-lg-0 border-light-subtle">
              <button
                className="btn btn-primary-custom btn-sm px-3 py-2 d-flex align-items-center gap-2 w-100 justify-content-center"
                onClick={() => handleNavClick('request-service')}
              >
                <i className="bi bi-tools"></i>
                <span>Book a Service</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
