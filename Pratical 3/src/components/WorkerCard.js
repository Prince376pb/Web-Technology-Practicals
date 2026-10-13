import React from "react";
import { SKILL_METADATA } from "../data/skillsData";

export default function WorkerCard({ worker, onRequestDelete }) {
  const meta = SKILL_METADATA[worker.skill] || {
    color: "#2563eb",
    bgColor: "#eff6ff",
    borderColor: "#bfdbfe",
    icon: "🔧"
  };

  // Get initials for profile avatar
  const initials = worker.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join("");

  return (
    <article className="worker-card" aria-label={`Worker profile for ${worker.name}`}>
      <div className="worker-card-header">
        <div className="worker-avatar" style={{ background: `linear-gradient(135deg, ${meta.color}, #0f172a)` }}>
          {initials || "W"}
        </div>
        <div className="worker-meta">
          <h3 className="worker-name">{worker.name}</h3>
          <div className="worker-badges-row">
            <span
              className="skill-badge"
              style={{
                color: meta.color,
                backgroundColor: meta.bgColor,
                borderColor: meta.borderColor
              }}
            >
              <span className="badge-icon">{meta.icon}</span>
              {worker.skill}
            </span>
            {worker.isDemo && (
              <span className="demo-badge" title="Initial demonstration record">
                Demo
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="worker-card-body">
        <div className="worker-detail-row">
          <span className="detail-label">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            Experience
          </span>
          <span className="detail-value experience-value">
            {worker.experience} {worker.experience === 1 ? "year" : "years"}
          </span>
        </div>

        <div className="worker-detail-row">
          <span className="detail-label">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Location
          </span>
          <span className="detail-value location-value" title={worker.location}>
            {worker.location}
          </span>
        </div>

        <div className="worker-detail-row">
          <span className="detail-label">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            Phone
          </span>
          <a href={`tel:${worker.phone}`} className="contact-link phone-link">
            +91 {worker.phone}
          </a>
        </div>

        <div className="worker-detail-row">
          <span className="detail-label">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            Email
          </span>
          <a
            href={`mailto:${worker.email}`}
            className="contact-link email-link"
            title={worker.email}
          >
            {worker.email}
          </a>
        </div>
      </div>

      <div className="worker-card-footer">
        <div className="quick-contact-actions">
          <a href={`tel:${worker.phone}`} className="card-action-btn btn-call" title="Call Worker">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            Call
          </a>
          <a href={`mailto:${worker.email}`} className="card-action-btn btn-email" title="Send Email">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            Email
          </a>
        </div>

        <button
          type="button"
          className="delete-card-btn"
          onClick={() => onRequestDelete(worker)}
          title={`Delete ${worker.name}'s profile`}
          aria-label={`Delete ${worker.name}'s profile`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          Delete
        </button>
      </div>
    </article>
  );
}
