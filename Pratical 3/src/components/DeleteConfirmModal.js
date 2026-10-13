import React, { useEffect } from "react";

export default function DeleteConfirmModal({ worker, onConfirm, onCancel }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  if (!worker) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-icon-badge">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>

        <h3 className="modal-title" id="modal-title">
          Confirm Worker Removal
        </h3>

        <p className="modal-message">
          Are you sure you want to remove <strong>{worker.name}</strong> ({worker.skill})?
          This action will immediately delete this profile from the local directory and storage.
        </p>

        <div className="modal-worker-summary">
          <div><strong>Location:</strong> {worker.location}</div>
          <div><strong>Experience:</strong> {worker.experience} years</div>
          <div><strong>Phone:</strong> {worker.phone}</div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn-modal-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-modal-confirm"
            onClick={() => onConfirm(worker.id, worker.name)}
          >
            Yes, Delete Profile
          </button>
        </div>
      </div>
    </div>
  );
}
