import React, { useState, useEffect } from 'react';

function RequestServicePage({ preselectedWorker, onServiceSuccess }) {
  // Service categories specified in requirements
  const serviceCategories = [
    'Plumber',
    'Electrician',
    'Carpenter',
    'Mechanic',
    'Painter',
    'Appliance Repair'
  ];

  // Default to tomorrow's date for convenient testing
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    mobile: '',
    category: preselectedWorker ? preselectedWorker.skill : '',
    location: preselectedWorker ? preselectedWorker.location : '',
    preferredDate: getTomorrowDate(),
    description: ''
  });

  // Server feedback state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverFeedback, setServerFeedback] = useState(null);

  // Update when preselectedWorker changes
  useEffect(() => {
    if (preselectedWorker) {
      setFormData(prev => ({
        ...prev,
        category: preselectedWorker.skill,
        location: prev.location || preselectedWorker.location,
        description: prev.description || `Requesting service from ${preselectedWorker.name} (${preselectedWorker.skill})`
      }));
    }
  }, [preselectedWorker]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerFeedback(null);

    try {
      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          mobile: formData.mobile,
          category: formData.category,
          location: formData.location,
          preferredDate: formData.preferredDate,
          description: formData.description
        })
      });

      const data = await response.json();

      if (response.status === 201) {
        // Success (HTTP 201) - Clear the form
        setServerFeedback({
          type: 'success',
          status: response.status,
          message: data.message || "Service request accepted successfully!"
        });
        setFormData({
          customerName: '',
          mobile: '',
          category: '',
          location: '',
          preferredDate: getTomorrowDate(),
          description: ''
        });
        if (onServiceSuccess) onServiceSuccess();
      } else {
        // Error (HTTP 400) - Preserve entered values so user can fix them!
        setServerFeedback({
          type: 'error',
          status: response.status,
          message: data.error || "Please review your details and correct any errors."
        });
      }
    } catch (err) {
      setServerFeedback({
        type: 'error',
        status: 500,
        message: "Unable to reach the server. Please check your connection and try again."
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
            <span className="badge bg-success-subtle text-success px-3 py-1 mb-2">
              ON-DEMAND LOCAL SERVICE
            </span>
            <h2 className="display-6 fw-bold text-dark">Request a Skilled Service</h2>
            <p className="text-muted">
              Book certified plumbers, electricians, carpenters, mechanics, and technicians directly at your doorstep.
            </p>
          </div>

          {/* Form Card */}
          <div className="form-card shadow-lg border-0">
            {/* Header info */}
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
              <div>
                <h5 className="fw-bold mb-0 text-dark">Customer Service Booking</h5>
                <small className="text-muted">Doorstep service at transparent local rates</small>
              </div>
              <span className="badge bg-primary px-3 py-2">
                <i className="bi bi-shield-check me-1"></i>Verified Service
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
                        ? 'Service Request Received'
                        : 'Booking Submission Error'}
                    </strong>
                  </div>
                  <div className="mt-1">{serverFeedback.message}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                {/* Customer Name */}
                <div className="col-md-6">
                  <label htmlFor="customerName" className="form-label">
                    Customer Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    className="form-control"
                    placeholder="Enter your full name"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="form-help">Enter your primary contact name.</div>
                </div>

                {/* Mobile Number */}
                <div className="col-md-6">
                  <label htmlFor="customerMobile" className="form-label">
                    Mobile Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    id="customerMobile"
                    name="mobile"
                    className="form-control"
                    placeholder="10-digit mobile (e.g. 9876543210)"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    maxLength={10}
                    required
                  />
                  <div className="form-help">Exactly 10 digits required for technician contact.</div>
                </div>

                {/* Service Category */}
                <div className="col-md-6">
                  <label htmlFor="serviceCategory" className="form-label">
                    Service Category <span className="text-danger">*</span>
                  </label>
                  <select
                    id="serviceCategory"
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Select Service --</option>
                    {serviceCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="form-help">Choose the trade category you require.</div>
                </div>

                {/* Preferred Date */}
                <div className="col-md-6">
                  <label htmlFor="preferredDate" className="form-label">
                    Preferred Service Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    className="form-control"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="form-help">Select today or a convenient future date.</div>
                </div>

                {/* Service Location */}
                <div className="col-12">
                  <label htmlFor="serviceLocation" className="form-label">
                    Service Address / Location <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="serviceLocation"
                    name="location"
                    className="form-control"
                    placeholder="e.g. Flat 302, Green Valley Apts, Civil Lines, Nagpur"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="form-help">Full address where the service is needed.</div>
                </div>

                {/* Problem Description */}
                <div className="col-12">
                  <label htmlFor="problemDescription" className="form-label">
                    Problem Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="problemDescription"
                    name="description"
                    rows="3"
                    className="form-control"
                    placeholder="Describe the problem in detail (at least 10 characters)..."
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                  <div className="d-flex justify-content-between form-help">
                    <span>Explain symptoms, equipment, or work needed.</span>
                    <span className={formData.description.trim().length >= 10 ? 'text-success fw-bold' : 'text-muted'}>
                      {formData.description.trim().length} / 10 min chars
                    </span>
                  </div>
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
                      <span>Submitting Service Request...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-calendar-plus-fill"></i>
                      <span>Submit Service Request</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-3 text-center">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  All service bookings are confirmed directly with our verified local technicians.
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestServicePage;
