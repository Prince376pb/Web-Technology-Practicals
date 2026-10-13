import React from "react";
import { SKILLS } from "../data/skillsData";

export default function Footer({ onSelectSkillFilter }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <div className="brand-icon small">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <span className="brand-name">
                Labour<span className="brand-accent">Connect</span>
              </span>
            </div>
            <p className="footer-description">
              Connecting skilled workers and local service experts directly with households, contractors,
              and businesses. Fast, transparent, and completely free of middleman commissions.
            </p>
           
          </div>

          {/* Quick Navigation Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links-list">
              <li><a href="#home">Home</a></li>
              <li><a href="#stats">Platform Statistics</a></li>
              <li><a href="#workers">Find Workers Directory</a></li>
              <li><a href="#register">Register as Worker</a></li>
              <li><a href="#about">About Platform</a></li>
            </ul>
          </div>

          {/* Trade Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Supported Trades</h4>
            <ul className="footer-links-list">
              {SKILLS.map(skill => (
                <li key={skill}>
                  <a
                    href="#workers"
                    onClick={() => {
                      if (onSelectSkillFilter) onSelectSkillFilter(skill);
                    }}
                  >
                    {skill}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Project Details */}
          <div className="footer-col">
            <h4 className="footer-heading">Project Information</h4>
            <div className="project-meta-box">
              <p><strong>Course:</strong> Web Technologies / ReactJS</p>
             
              <p><strong>Stack:</strong> React 19, JavaScript ES6+, CSS3</p>
              <p><strong>Storage:</strong> HTML5 Web Storage (localStorage)</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <p>© {currentYear} Labour Connect. All rights reserved.</p>
          <p className="footer-academic-disclaimer">
            Academic Project • Client-side Demonstration Application • ReactJS
          </p>
          <a href="#home" className="footer-back-to-top" title="Scroll back to top">
            Back to Top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
