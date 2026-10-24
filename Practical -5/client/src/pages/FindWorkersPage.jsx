import React, { useState } from 'react';
import WorkerCard from '../components/WorkerCard';

function FindWorkersPage({ workers, onHireWorker, setActiveTab }) {
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const skillsList = ['All', 'Plumber', 'Electrician', 'Carpenter', 'Painter', 'Mechanic', 'Appliance Repair'];

  // Filter workers based on skill, availability, and search text
  const filteredWorkers = workers.filter((worker) => {
    const matchesSkill = selectedSkill === 'All' || worker.skill.toLowerCase() === selectedSkill.toLowerCase();
    const matchesAvailability = selectedAvailability === 'All' || worker.availability === selectedAvailability;
    const matchesSearch =
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.skill.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSkill && matchesAvailability && matchesSearch;
  });

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <span className="text-primary fw-semibold small text-uppercase">VERIFIED WORKFORCE</span>
          <h2 className="fw-bold mb-1">Find Skilled Workers</h2>
          <p className="text-muted mb-0">
            Browse reliable tradespeople in your locality. Newly registered workers appear here automatically.
          </p>
        </div>
        <button
          className="btn btn-primary-custom d-flex align-items-center gap-2 align-self-start align-self-md-auto"
          onClick={() => setActiveTab('register-worker')}
        >
          <i className="bi bi-person-plus-fill"></i>
          <span>Register New Worker</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          {/* Search Input */}
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by worker name, location, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setSearchQuery('')}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>

          {/* Skill Filter Dropdown */}
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2">
              <label htmlFor="skillFilter" className="form-label mb-0 small text-nowrap fw-semibold">
                Filter Skill:
              </label>
              <select
                id="skillFilter"
                className="form-select"
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
              >
                {skillsList.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Availability Filter Dropdown */}
          <div className="col-md-3">
            <div className="d-flex align-items-center gap-2">
              <label htmlFor="availFilter" className="form-label mb-0 small text-nowrap fw-semibold">
                Status:
              </label>
              <select
                id="availFilter"
                className="form-select"
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Worker Cards Listing */}
      {filteredWorkers.length > 0 ? (
        <div className="row">
          {filteredWorkers.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              onHireClick={(w) => {
                onHireWorker(w);
                setActiveTab('request-service');
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-5 bg-white rounded-4 border p-4">
          <div className="mb-3 text-muted display-4">
            <i className="bi bi-person-x"></i>
          </div>
          <h5 className="fw-bold">No Workers Found</h5>
          <p className="text-muted small">
            No workers match your filter criteria. Try changing the skill filter or search query.
          </p>
          <button
            className="btn btn-outline-primary btn-sm mt-2"
            onClick={() => {
              setSelectedSkill('All');
              setSelectedAvailability('All');
              setSearchQuery('');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default FindWorkersPage;
