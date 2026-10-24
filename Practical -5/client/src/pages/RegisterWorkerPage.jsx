import React, { useState } from 'react';

function RegisterWorkerPage({ onWorkerRegistered, setActiveTab }) {
  const skillOptions = [
    'Plumber',
    'Electrician',
    'Carpenter',
    'Mechanic',
    'Painter',
    'Appliance Repair'
  ];

  const availabilityOptions = ['Available', 'Busy', 'Unavailable'];

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    skill: 'Plumber',
    experience: '',
    location: '',
    payment: '',
    availability: 'Available'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverFeedback, setServerFeedback] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerFeedback(null);

    try {
      const response = await fetch('/api/workers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.mobile,
          skill: formData.skill,
          experience: formData.experience,
          location: formData.location,
          payment: formData.payment,
          availability: formData.availability
        })
      });

      const data = await response.json();

      if (response.status === 201) {
        // Success (HTTP 201)
        setServerFeedback({
          type: 'success',
          status: response.status,
          message: data.message || "Worker registered successfully!",
          newWorker: data.data
        });

        // Reset form
        setFormData({
          name: '',
          mobile: '',
          skill: 'Plumber',
          experience: '',
          location: '',
          payment: '',
          availability: 'Available'
        });

        // Notify parent to refresh in-memory list
        if (onWorkerRegistered) {
          onWorkerRegistered();
        }
      } else {
        // Validation Error (HTTP 400) - Preserve entered values!
        setServerFeedback({
          type: 'error',
          status: response.status,
          message: data.error || "Please check your entered details and try again."
        });
      }
    } catch (err) {
      setServerFeedback({
        type: 'error',
        status: 500,
        message: "Network Error: Could not connect to the server. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-7">
          {/* Header */}
          <div className="text-center mb-4">
            <span className="badge bg-primary-subtle text-primary px-3 py-1 mb-2">
              WORKFORCE ONBOARDING
            </span>
            <h2 className="display-6 fw-bold text-dark">Register as a Skilled Worker</h2>
            <p className="text-muted">
              Join Labour Connect to find clients and discover employment opportunities in your locality.
            </p>
          </div>

          <div className="form-card shadow-lg border-0">
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
              <div>
                <h5 className="fw-bold mb-0 text-dark">Worker Registration Details</h5>
                <small className="text-muted">Get listed in the verified worker directory</small>
              </div>
              <span className="badge bg-primary px-3 py-2">
                <i className="bi bi-person-check-fill me-1"></i>Direct Onboarding
              </span>
            </div>

            {/* Server Feedback Alert */}
            {serverFeedback && (
              <div
                className={`alert ${
                  serverFeedback.type === 'success' ? 'alert-success border-success' : 'alert-danger border-danger'
                } alert-custom mb-4`}
                role="alert"
              >
                <i
                  className={`bi ${
                    serverFeedback.type === 'success'
                      ? 'bi-check-circle-fill text-success'
                      : 'bi-exclamation-triangle-fill text-danger'
                  } fs-4`}
                ></i>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center justify-content-between">
                    <strong>
                      {serverFeedback.type === 'success'
                        ? 'Profile Registered Successfully'
                        : 'Registration Details Error'}
                    </strong>
                  </div>
                  <div className="mt-1">{serverFeedback.message}</div>
                  {serverFeedback.type === 'success' && (
                    <div className="mt-2">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => setActiveTab('workers')}
                      >
                        <i className="bi bi-people-fill me-1"></i>
                        View in Worker Directory
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                {/* Full Name */}
                <div className="col-md-6">
                  <label htmlFor="workerName" className="form-label">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="workerName"
                    name="name"
                    className="form-control"
                    placeholder="e.g. Anand Deshmukh"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="form-help">Must contain at least 2 characters.</div>
                </div>

                {/* Mobile Number */}
                <div className="col-md-6">
                  <label htmlFor="workerMobile" className="form-label">
                    Mobile Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    id="workerMobile"
                    name="mobile"
                    className="form-control"
                    placeholder="10-digit mobile number"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    maxLength={10}
                    required
                  />
                  <div className="form-help">Must be exactly 10 digits for contact.</div>
                </div>

                {/* Skill / Profession */}
                <div className="col-md-6">
                  <label htmlFor="workerSkill" className="form-label">
                    Skill or Profession <span className="text-danger">*</span>
                  </label>
                  <select
                    id="workerSkill"
                    name="skill"
                    className="form-select"
                    value={formData.skill}
                    onChange={handleInputChange}
                    required
                  >
                    {skillOptions.map((sk) => (
                      <option key={sk} value={sk}>
                        {sk}
                      </option>
                    ))}
                  </select>
                  <div className="form-help">Select your core trade.</div>
                </div>

                {/* Experience in Years */}
                <div className="col-md-6">
                  <label htmlFor="workerExp" className="form-label">
                    Experience in Years <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    id="workerExp"
                    name="experience"
                    className="form-control"
                    placeholder="e.g. 5"
                    min="0"
                    step="0.5"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="form-help">Years of working experience in this skill.</div>
                </div>

                {/* Location */}
                <div className="col-md-6">
                  <label htmlFor="workerLocation" className="form-label">
                    Location / Area <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="workerLocation"
                    name="location"
                    className="form-control"
                    placeholder="e.g. Sadar, Nagpur"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="form-help">Area or city where you provide services.</div>
                </div>

                {/* Expected Payment */}
                <div className="col-md-6">
                  <label htmlFor="workerPayment" className="form-label">
                    Expected Daily Payment (₹) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    id="workerPayment"
                    name="payment"
                    className="form-control"
                    placeholder="e.g. 600"
                    min="1"
                    value={formData.payment}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="form-help">Your standard daily wage rate in Rupees.</div>
                </div>

                {/* Availability */}
                <div className="col-12">
                  <label htmlFor="workerAvailability" className="form-label">
                    Current Availability Status <span className="text-danger">*</span>
                  </label>
                  <select
                    id="workerAvailability"
                    name="availability"
                    className="form-select"
                    value={formData.availability}
                    onChange={handleInputChange}
                    required
                  >
                    {availabilityOptions.map((av) => (
                      <option key={av} value={av}>
                        {av}
                      </option>
                    ))}
                  </select>
                  <div className="form-help">Choose between Available, Busy, or Unavailable.</div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-4 pt-2">
                <button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-3 d-flex align-items-center justify-content-center gap-2 fs-6 shadow"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Registering Profile...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-check-fill"></i>
                      <span>Register Worker Profile</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-3 text-center">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Upon successful registration, your profile will immediately appear in the Find Workers directory.
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterWorkerPage;
