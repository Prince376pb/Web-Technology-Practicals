import React from 'react';

function JobCard({ job, onApplyClick }) {
  // Helpers for employment type badge
  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'Full-time':
        return 'bg-primary-subtle text-primary border border-primary-subtle';
      case 'Part-time':
        return 'bg-warning-subtle text-warning-emphasis border border-warning-subtle';
      case 'Contract':
        return 'bg-info-subtle text-info-emphasis border border-info-subtle';
      default:
        return 'bg-light text-dark';
    }
  };

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="item-card">
        {/* Header with Job Title & Type */}
        <div className="d-flex align-items-start justify-content-between mb-2">
          <div>
            <span className={`badge px-2 py-1 mb-2 rounded-2 ${getTypeBadgeClass(job.type)}`}>
              {job.type}
            </span>
            <h5 className="fw-bold mb-1 text-dark" style={{ minHeight: '2.4rem' }}>{job.title}</h5>
          </div>
        </div>

        {/* Employer Information */}
        <div className="d-flex align-items-center gap-2 mb-3 text-muted small">
          <i className="bi bi-building text-primary"></i>
          <span className="fw-semibold text-truncate">{job.employer}</span>
        </div>

        {/* Job Details */}
        <div className="text-secondary small mb-3 flex-grow-1">
          <div className="d-flex align-items-center gap-2 mb-2">
            <i className="bi bi-tools text-secondary"></i>
            <span><strong>Skill Needed:</strong> <span className="badge-skill py-0 px-2">{job.skill}</span></span>
          </div>

          <div className="d-flex align-items-center gap-2 mb-2">
            <i className="bi bi-geo-alt text-danger"></i>
            <span className="text-truncate"><strong>Location:</strong> {job.location}</span>
          </div>

          <div className="d-flex align-items-center gap-2 mb-2">
            <i className="bi bi-clock-history text-secondary"></i>
            <span><strong>Experience:</strong> {job.experience}+ years</span>
          </div>

          <div className="d-flex align-items-center gap-2 mb-2">
            <i className="bi bi-currency-rupee text-success"></i>
            <span className="text-success fw-bold"><strong>Salary:</strong> {job.salary}</span>
          </div>

          <p className="mt-2 text-muted fst-italic" style={{ fontSize: '0.82rem' }}>
            "{job.description}"
          </p>
        </div>

        {/* Apply Now Button */}
        <div className="pt-3 border-top mt-auto">
          <button
            className="btn btn-primary-custom w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={() => onApplyClick(job)}
          >
            <i className="bi bi-send-fill"></i>
            <span>Apply Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
