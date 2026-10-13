import React, { useEffect } from "react";

export default function ToastNotification({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === "success" || !toast.type;
  const isDanger = toast.type === "danger";

  return (
    <div
      className={`toast-notification ${isSuccess ? "toast-success" : isDanger ? "toast-danger" : "toast-info"}`}
      role="status"
      aria-live="polite"
    >
      <div className="toast-icon">
        {isSuccess && "✅"}
        {isDanger && "🗑️"}
        {!isSuccess && !isDanger && "ℹ️"}
      </div>

      <div className="toast-content">
        <p className="toast-title">{toast.title || (isSuccess ? "Action Successful" : "Notification")}</p>
        <p className="toast-message">{toast.message}</p>
      </div>

      <button
        type="button"
        className="toast-close-btn"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}
