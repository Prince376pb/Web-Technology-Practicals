import React from "react";
import { SKILLS, SKILL_METADATA } from "../data/skillsData";

export default function Hero({ onSelectSkillFilter }) {
  return (
    <section className="hero-section">
      <div className="hero-background-glow"></div>
      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-pill-badge">
            <span className="badge-sparkle">✦</span>
            <span>Local Services Marketplace & Worker Registry</span>
          </div>

          <h1 className="hero-title">
            Connect With Trusted Local <span className="text-electric">Skilled Workers</span>
          </h1>

          <p className="hero-description">
            Labour Connect bridges neighborhood households, contractors, and businesses directly with
            certified plumbers, electricians, carpenters, mechanics, painters, and technicians.
            Zero commission, transparent experience records, and instant direct communication.
          </p>

          <div className="hero-actions">
            <a href="#workers" className="btn-hero-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Find Workers
            </a>
            <a href="#register" className="btn-hero-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              Register as Worker
            </a>
          </div>

          <div className="hero-trust-bar">
            <div className="trust-item">
              <span className="trust-check">✓</span> Direct Calls & Emails
            </div>
            <div className="trust-item">
              <span className="trust-check">✓</span> 0% Middleman Fees
            </div>
            <div className="trust-item">
              <span className="trust-check">✓</span> Verified Experience
            </div>
            <div className="trust-item">
              <span className="trust-check">✓</span> Instant Local Search
            </div>
          </div>
        </div>

        {/* Visual Hero Card / Quick Skill Selector */}
        <div className="hero-visual">
          <div className="hero-card-preview">
            <div className="preview-header">
              <div className="preview-badge-status">
                <span className="live-indicator"></span> Verified Tradespeople
              </div>
              <span className="preview-location-tag">Nationwide Coverage</span>
            </div>

            <h3 className="preview-card-title">Explore by Trade Category</h3>
            <p className="preview-card-desc">Click any category to filter the live directory:</p>

            <div className="preview-skills-grid">
              {SKILLS.map(skill => {
                const meta = SKILL_METADATA[skill] || {};
                return (
                  <a
                    key={skill}
                    href="#workers"
                    className="skill-quick-chip"
                    onClick={() => {
                      if (onSelectSkillFilter) onSelectSkillFilter(skill);
                    }}
                  >
                    <span className="skill-chip-icon">{meta.icon || "🔧"}</span>
                    <span className="skill-chip-label">{skill}</span>
                  </a>
                );
              })}
            </div>

            <div className="preview-footer-note">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>Instant direct contact via mobile phone & email</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
