import React from 'react';

function WorkerCard({ worker, onHireClick }) {
  // Helpers for visual badge depending on availability
  const getAvailabilityBadge = (status) => {
    switch (status) {
      case 'Available':
        return <span className="badge badge-available px-2 py-1"><i className="bi bi-check-circle me-1"></i>Available</span>;
      case 'Busy':
        return <span className="badge badge-busy px-2 py-1"><i className="bi bi-clock-history me-1"></i>Busy</span>;
      case 'Unavailable':
        return <span className="badge badge-unavailable px-2 py-1"><i className="bi bi-x-circle me-1"></i>Unavailable</span>;
      default:
        return <span className="badge bg-secondary px-2 py-1">{status}</span>;
    }
  };

  // Get initial letters for avatar
  const getInitials = (name) => {
    if (!name) return 'W';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="item-card">
        {/* Header with Avatar and Availability */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-3">
            <div className="avatar-circle">
              {getInitials(worker.name)}
            </div>
            <div>
              <h5 className="mb-0 fw-bold text-dark">{worker.name}</h5>
              <span className="badge-skill">{worker.skill}</span>
            </div>
          </div>
          <div>
            {getAvailabilityBadge(worker.availability)}
          </div>
        </div>

        {/* Worker Details List */}
        <div className="text-secondary small my-2 flex-grow-1">
          <div className="d-flex align-items-center gap-2 mb-2">
            <i className="bi bi-briefcase text-primary"></i>
            <span><strong>Experience:</strong> {worker.experience} {worker.experience === 1 ? 'Year' : 'Years'}</span>
          </div>

          <div className="d-flex align-items-center gap-2 mb-2">
            <i className="bi bi-geo-alt text-danger"></i>
            <span className="text-truncate"><strong>Location:</strong> {worker.location}</span>
          </div>

          <div className="d-flex align-items-center gap-2 mb-2">
            <i className="bi bi-cash-stack text-success"></i>
            <span><strong>Expected Wage:</strong> ₹{worker.payment} / day</span>
          </div>

          <div className="d-flex align-items-center gap-2 mb-2">
            <i className="bi bi-telephone text-muted"></i>
            <span><strong>Contact:</strong> +91 {worker.mobile}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-top mt-2">
          <button
            className="btn btn-outline-primary w-100 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-semibold"
            onClick={() => onHireClick(worker)}
          >
            <i className="bi bi-calendar-check"></i>
            <span>Book Service Provider</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkerCard;
