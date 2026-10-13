import React, { useMemo } from "react";
import WorkerCard from "./WorkerCard";
import { SKILLS } from "../data/skillsData";

export default function WorkerDirectory({
  workers,
  searchQuery,
  setSearchQuery,
  selectedSkill,
  setSelectedSkill,
  sortBy,
  setSortBy,
  onRequestDelete
}) {
  // Filter and sort workers
  const filteredWorkers = useMemo(() => {
    let result = [...workers];

    // 1. Skill filter
    if (selectedSkill && selectedSkill !== "all") {
      result = result.filter(
        w => (w.skill || "").toLowerCase() === selectedSkill.toLowerCase()
      );
    }

    // 2. Search query (name, skill, or location)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(w => {
        const nameMatch = (w.name || "").toLowerCase().includes(q);
        const skillMatch = (w.skill || "").toLowerCase().includes(q);
        const locationMatch = (w.location || "").toLowerCase().includes(q);
        return nameMatch || skillMatch || locationMatch;
      });
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === "exp-desc") {
        return (Number(b.experience) || 0) - (Number(a.experience) || 0);
      }
      if (sortBy === "exp-asc") {
        return (Number(a.experience) || 0) - (Number(b.experience) || 0);
      }
      if (sortBy === "name-asc") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (sortBy === "name-desc") {
        return (b.name || "").localeCompare(a.name || "");
      }
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      return 0;
    });

    return result;
  }, [workers, searchQuery, selectedSkill, sortBy]);

  const hasActiveFilters = searchQuery.trim() !== "" || (selectedSkill && selectedSkill !== "all");

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedSkill("all");
    setSortBy("exp-desc");
  };

  return (
    <section className="section workers-section" id="workers">
      <div className="container">
        <div className="section-header-centered">
          <span className="section-eyebrow">Worker Directory</span>
          <h2 className="section-title">Verified Skilled Professionals</h2>
          <p className="section-subtitle">
            Search, filter by trade specialization, and connect with experienced technicians in your vicinity.
          </p>
        </div>

        {/* Search, Filter & Sort Controls Card */}
        <div className="directory-controls-card">
          <div className="controls-top-row">
            {/* Search Input */}
            <div className="search-bar-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by worker name, skill, or location..."
                className="directory-search-input"
                aria-label="Search workers by name, skill, or location"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search query"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="sort-dropdown-wrapper">
              <label htmlFor="sort-select" className="control-label">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="directory-select"
              >
                <option value="exp-desc">Experience: High to Low</option>
                <option value="exp-asc">Experience: Low to High</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="newest">Newest Registered</option>
              </select>
            </div>
          </div>

          {/* Skill Filter Pills */}
          <div className="skill-pills-row" role="tablist" aria-label="Filter workers by trade skill">
            <span className="filter-pill-label">Specialization:</span>
            <button
              type="button"
              className={`filter-pill ${selectedSkill === "all" ? "pill-active" : ""}`}
              onClick={() => setSelectedSkill("all")}
            >
              All Trades ({workers.length})
            </button>
            {SKILLS.map(skill => {
              const count = workers.filter(w => w.skill === skill).length;
              return (
                <button
                  key={skill}
                  type="button"
                  className={`filter-pill ${selectedSkill === skill ? "pill-active" : ""}`}
                  onClick={() => setSelectedSkill(skill)}
                >
                  {skill} ({count})
                </button>
              );
            })}
          </div>

          {/* Result Counts & Clear Filters Status */}
          <div className="directory-status-bar">
            <div className="status-counter">
              Showing <strong>{filteredWorkers.length}</strong> of <strong>{workers.length}</strong> registered workers
              {selectedSkill !== "all" && (
                <span className="active-tag">Skill: {selectedSkill}</span>
              )}
              {searchQuery && (
                <span className="active-tag">Keyword: "{searchQuery}"</span>
              )}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className="clear-filters-btn"
                onClick={handleClearFilters}
              >
                Clear All Filters ✕
              </button>
            )}
          </div>
        </div>

        {/* Worker Cards Grid or Empty State */}
        {filteredWorkers.length === 0 ? (
          <div className="empty-state-card" role="status">
            <div className="empty-icon-circle">
              {workers.length === 0 ? "📋" : "🔍"}
            </div>
            <h3 className="empty-state-title">
              {workers.length === 0
                ? "No Workers Registered Yet"
                : "No Workers Match Your Search Criteria"}
            </h3>
            <p className="empty-state-text">
              {workers.length === 0
                ? "Get started by registering the first skilled worker in the form above."
                : `We could not find any workers matching your current filters${
                    searchQuery ? ` ("${searchQuery}")` : ""
                  }. Try broadening your search or resetting filters.`}
            </p>

            <div className="empty-state-actions">
              {hasActiveFilters && (
                <button
                  type="button"
                  className="btn-empty-reset"
                  onClick={handleClearFilters}
                >
                  Reset All Filters
                </button>
              )}
              <a href="#register" className="btn-empty-register">
                + Register a New Worker
              </a>
            </div>
          </div>
        ) : (
          <div className="worker-list-grid">
            {filteredWorkers.map(worker => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                onRequestDelete={onRequestDelete}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
