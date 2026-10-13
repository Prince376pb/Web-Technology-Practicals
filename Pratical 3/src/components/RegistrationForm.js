import React, { useState } from "react";
import { SKILLS } from "../data/skillsData";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  skill: "",
  experience: "",
  location: ""
};

export default function RegistrationForm({ onRegister }) {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required.";
        if (value.trim().length < 3) return "Name must contain at least 3 characters.";
        return "";
      case "email":
        if (!value.trim()) return "Email address is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return "Please enter a valid email address (e.g. name@domain.com).";
        }
        return "";
      case "phone":
        const cleanPhone = value.replace(/\D/g, "");
        if (!value.trim()) return "Phone number is required.";
        if (cleanPhone.length !== 10) {
          return "Phone number must contain exactly 10 digits.";
        }
        return "";
      case "skill":
        if (!value) return "Skill selection is mandatory.";
        return "";
      case "experience":
        if (value === "" || value === null || value === undefined) {
          return "Experience in years is required.";
        }
        const expNum = Number(value);
        if (isNaN(expNum) || expNum < 0 || expNum > 50) {
          return "Experience must be a number between 0 and 50.";
        }
        return "";
      case "location":
        if (!value.trim()) return "Location is required.";
        if (value.trim().length < 2) return "Location must contain at least 2 characters.";
        return "";
      default:
        return "";
    }
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(form).forEach(field => {
      const err = validateField(field, form[field]);
      if (err) newErrors[field] = err;
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Real-time error clearing / re-validation when corrected
    if (errors[name]) {
      const errorMsg = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: errorMsg }));
    }

    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleReset = () => {
    setForm(initialFormState);
    setErrors({});
    setSuccessMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateAll();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSuccessMessage("");
      // Focus on first error element
      const firstErrorField = Object.keys(validationErrors)[0];
      const el = document.getElementById(firstErrorField);
      if (el) el.focus();
      return;
    }

    // Prevent duplicate submissions
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSuccessMessage("");

    // Simulate clean submission handling
    setTimeout(() => {
      const newWorker = {
        id: `worker-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.replace(/\D/g, ""),
        skill: form.skill,
        experience: Number(form.experience),
        location: form.location.trim(),
        createdAt: new Date().toISOString(),
        isDemo: false
      };

      onRegister(newWorker);
      setForm(initialFormState);
      setErrors({});
      setIsSubmitting(false);
      setSuccessMessage(`Worker profile for "${newWorker.name}" was registered successfully!`);
    }, 300);
  };

  return (
    <section className="section registration-section" id="register">
      <div className="container">
        <div className="section-header-centered">
          <span className="section-eyebrow">Worker Onboarding</span>
          <h2 className="section-title">Register as a Skilled Worker</h2>
          <p className="section-subtitle">
            Fill out your trade profile details below. Connect directly with clients in your locality.
          </p>
        </div>

        <div className="registration-card-wrapper">
          <div className="registration-info-side">
            <h3 className="side-title">Why Register on Labour Connect?</h3>
            <ul className="side-benefits-list">
              <li>
                <div className="benefit-icon">📱</div>
                <div>
                  <strong>Direct Customer Access</strong>
                  <p>Clients call or email you directly with no intermediaries taking commissions.</p>
                </div>
              </li>
              <li>
                <div className="benefit-icon">⭐</div>
                <div>
                  <strong>Showcase Practical Experience</strong>
                  <p>Highlight your verified years of experience and core trade skills.</p>
                </div>
              </li>
              <li>
                <div className="benefit-icon">📍</div>
                <div>
                  <strong>Local Area Reach</strong>
                  <p>Get discovered by residential and commercial clients right in your area.</p>
                </div>
              </li>
              <li>
                <div className="benefit-icon">⚡</div>
                <div>
                  <strong>Instant Directory Visibility</strong>
                  <p>Your profile is saved immediately and becomes searchable across all filters.</p>
                </div>
              </li>
            </ul>

            <div className="registration-note-badge">
              <span className="info-icon">ℹ️</span>
              <div>Your profile will be saved in your browser and displayed in the worker directory after successful registration. Make sure your details are accurate so customers can find and contact you easily.</div>
            </div>
          </div>

          <div className="form-box">
            <form onSubmit={handleSubmit} noValidate className="registration-form">
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">👤</span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Ramesh Sharma"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={`form-input ${errors.name ? "input-error" : form.name && !errors.name ? "input-valid" : ""}`}
                  />
                </div>
                {errors.name && (
                  <span className="error-message" id="name-error" role="alert">
                    ⚠️ {errors.name}
                  </span>
                )}
                <span className="input-hint">Minimum 3 characters required.</span>
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">✉️</span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. ramesh.sharma@example.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`form-input ${errors.email ? "input-error" : form.email && !errors.email ? "input-valid" : ""}`}
                  />
                </div>
                {errors.email && (
                  <span className="error-message" id="email-error" role="alert">
                    ⚠️ {errors.email}
                  </span>
                )}
                <span className="input-hint">Must be a valid email format.</span>
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number (10 Digits) <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">📞</span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    maxLength="10"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. 9876543210"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    className={`form-input ${errors.phone ? "input-error" : form.phone && !errors.phone ? "input-valid" : ""}`}
                  />
                </div>
                {errors.phone && (
                  <span className="error-message" id="phone-error" role="alert">
                    ⚠️ {errors.phone}
                  </span>
                )}
                <span className="input-hint">Must contain exactly 10 digits without country code.</span>
              </div>

              {/* Skill Selection */}
              <div className="form-group">
                <label htmlFor="skill" className="form-label">
                  Trade / Skill Selection <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">🛠️</span>
                  <select
                    id="skill"
                    name="skill"
                    value={form.skill}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(errors.skill)}
                    aria-describedby={errors.skill ? "skill-error" : undefined}
                    className={`form-input ${errors.skill ? "input-error" : form.skill ? "input-valid" : ""}`}
                  >
                    <option value="">-- Choose your primary trade skill --</option>
                    {SKILLS.map(skill => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.skill && (
                  <span className="error-message" id="skill-error" role="alert">
                    ⚠️ {errors.skill}
                  </span>
                )}
              </div>

              {/* Experience in Years */}
              <div className="form-group">
                <label htmlFor="experience" className="form-label">
                  Experience in Years (0 - 50) <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">🎖️</span>
                  <input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    max="50"
                    value={form.experience}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. 5"
                    aria-invalid={Boolean(errors.experience)}
                    aria-describedby={errors.experience ? "exp-error" : undefined}
                    className={`form-input ${errors.experience ? "input-error" : form.experience !== "" && !errors.experience ? "input-valid" : ""}`}
                  />
                </div>
                {errors.experience && (
                  <span className="error-message" id="exp-error" role="alert">
                    ⚠️ {errors.experience}
                  </span>
                )}
                <span className="input-hint">Must be between 0 and 50 years.</span>
              </div>

              {/* Location */}
              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  Location / Area / City <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">📍</span>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={form.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Mumbai - Andheri West"
                    aria-invalid={Boolean(errors.location)}
                    aria-describedby={errors.location ? "loc-error" : undefined}
                    className={`form-input ${errors.location ? "input-error" : form.location && !errors.location ? "input-valid" : ""}`}
                  />
                </div>
                {errors.location && (
                  <span className="error-message" id="loc-error" role="alert">
                    ⚠️ {errors.location}
                  </span>
                )}
                <span className="input-hint">Minimum 2 characters (e.g. city or neighborhood).</span>
              </div>

              {/* Form Actions */}
              <div className="form-button-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`submit-btn ${isSubmitting ? "btn-loading" : ""}`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border"></span> Registering Profile...
                    </>
                  ) : (
                    <>
                      <span>Register Worker Profile</span>
                      <span className="btn-arrow">→</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="reset-btn"
                  disabled={isSubmitting}
                >
                  Reset Form
                </button>
              </div>

              {/* Success Notification Banner */}
              {successMessage && (
                <div className="form-success-banner" role="status">
                  <div className="success-banner-content">
                    <span className="success-icon">✅</span>
                    <div>
                      <strong>Success!</strong>
                      <p>{successMessage}</p>
                    </div>
                  </div>
                  <a href="#workers" className="view-profile-link">
                    View in Directory →
                  </a>
                </div>
              )}

              {Object.values(errors).some(Boolean) && (
                <p className="form-validation-summary" role="alert">
                  Please review and resolve the highlighted errors above before proceeding.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
