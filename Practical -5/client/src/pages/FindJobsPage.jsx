import React, { useState } from 'react';
import JobCard from '../components/JobCard';

function FindJobsPage({ jobs, selectedJob, setSelectedJob, onApplicationSuccess }) {
  // Form state
  const [formData, setFormData] = useState({
    applicantName: '',
    mobile: '',
    jobId: selectedJob ? selectedJob.id : (jobs[0] ? jobs[0].id : ''),
    applicantSkill: ''
  });

  // Server response state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverFeedback, setServerFeedback] = useState(null); // { type: 'success' | 'error', message: '', status: number }

  // Filter state
  const [typeFilter, setTypeFilter] = useState('All');
  const [skillFilter, setSkillFilter] = useState('All');

  // When selectedJob prop changes, update the form's jobId and scroll to form if needed
  React.useEffect(() => {
    if (selectedJob) {
      setFormData(prev => ({
        ...prev,
        jobId: selectedJob.id,
        applicantSkill: prev.applicantSkill || selectedJob.skill
      }));
    }
  }, [selectedJob]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit application to Express backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerFeedback(null);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          applicantName: formData.applicantName,
          mobile: formData.mobile,
          jobId: formData.jobId,
          applicantSkill: formData.applicantSkill
        })
      });

      const data = await response.json();

      if (response.status === 201) {
        // HTTP 201 Created - Clear form on success
        setServerFeedback({
          type: 'success',
          status: response.status,
          message: data.message || "Application accepted successfully!"
        });
        setFormData({
          applicantName: '',
          mobile: '',
          jobId: jobs[0] ? jobs[0].id : '',
          applicantSkill: ''
        });
        if (onApplicationSuccess) onApplicationSuccess();
      } else {
        // HTTP 400 or other error - Preserve entered values so user can fix them!
        setServerFeedback({
          type: 'error',
          status: response.status,
          message: data.error || "Submission failed. Please check your information."
        });
      }
    } catch (err) {
      setServerFeedback({
        type: 'error',
        status: 500,
        message: "Failed to connect to the server. Please check your connection and try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesType = typeFilter === 'All' || job.type === typeFilter;
    const matchesSkill = skillFilter === 'All' || job.skill.toLowerCase() === skillFilter.toLowerCase();
    return matchesType && matchesSkill;
  });

  const activeJobObject = jobs.find(j => String(j.id) === String(formData.jobId));

  return (
    <div className="container py-4">
      {/* Page Title */}
      <div className="mb-4">
        <span className="text-primary fw-semibold small text-uppercase">CAREER OPPORTUNITIES</span>
        <h2 className="fw-bold mb-1">Available Job Opportunities</h2>
        <p className="text-muted mb-0">
          Apply directly to local contractors and businesses. Discover employment opportunities tailored to your skills.
        </p>
      </div>

      <div className="row g-4">
        {/* Left Side: Job Application Form */}
        <div className="col-lg-5 order-lg-2">
          <div className="form-card sticky-top" style={{ top: '85px', zIndex: 10 }}>
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h4 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                <i className="bi bi-file-earmark-person-fill text-primary"></i>
                <span>Job Application Form</span>
              </h4>
              <span className="badge bg-primary-subtle text-primary small">
                <i className="bi bi-send me-1"></i>Direct Apply
              </span>
            </div>

            {/* Server Feedback Alert */}
            {serverFeedback && (
              <div 
                className={`alert ${
                  serverFeedback.type === 'success' ? 'alert-success border-success' : 'alert-danger border-danger'
                } alert-custom mb-3`}
                role="alert"
              >
                <i 
                  className={`bi ${
                    serverFeedback.type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger'
                  } fs-5`}
                ></i>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center justify-content-between">
                    <strong>
                      {serverFeedback.type === 'success' ? 'Application Submitted Successfully' : 'Application Submission Error'}
                    </strong>
                  </div>
                  <div className="mt-1 small">{serverFeedback.message}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Select Job */}
              <div className="mb-3">
                <label htmlFor="jobId" className="form-label">
                  Applying For Job <span className="text-danger">*</span>
                </label>
                <select
                  id="jobId"
                  name="jobId"
                  className="form-select"
                  value={formData.jobId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Select a Job --</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title} ({job.employer})
                    </option>
                  ))}
                </select>
                {activeJobObject && (
                  <div className="form-help text-primary fw-medium">
                    <i className="bi bi-info-circle me-1"></i>
                    Requires: {activeJobObject.skill} | Salary: {activeJobObject.salary}
                  </div>
                )}
              </div>

              {/* Applicant Name */}
              <div className="mb-3">
                <label htmlFor="applicantName" className="form-label">
                  Applicant Full Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="applicantName"
                  name="applicantName"
                  className="form-control"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.applicantName}
                  onChange={handleInputChange}
                  required
                />
                <div className="form-help">Enter your full name as per your identity details.</div>
              </div>

              {/* Mobile Number */}
              <div className="mb-3">
                <label htmlFor="applicantMobile" className="form-label">
                  Mobile Number <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  id="applicantMobile"
                  name="mobile"
                  className="form-control"
                  placeholder="10-digit mobile number (e.g. 9876543210)"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  maxLength={10}
                  required
                />
                <div className="form-help">Enter a valid 10-digit mobile number for employers to contact you.</div>
              </div>

              {/* Applicant Skill */}
              <div className="mb-4">
                <label htmlFor="applicantSkill" className="form-label">
                  Your Primary Skill / Trade <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="applicantSkill"
                  name="applicantSkill"
                  className="form-control"
                  placeholder="e.g. Electrician, Plumber, Mason, Painter"
                  value={formData.applicantSkill}
                  onChange={handleInputChange}
                  required
                />
                <div className="form-help">Your core trade or technical expertise.</div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary-custom w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-send-check"></i>
                    <span>Submit Job Application</span>
                  </>
                )}
              </button>

              <div className="text-center mt-3 text-muted small">
                <i className="bi bi-shield-check me-1 text-success"></i>
                Applications are delivered directly to the prospective employer.
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Available Jobs List */}
        <div className="col-lg-7 order-lg-1">
          {/* Filter Bar */}
          <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
            <div className="row g-2 align-items-center">
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2">
                  <label htmlFor="jobSkillFilter" className="form-label mb-0 small text-nowrap fw-semibold">
                    Skill:
                  </label>
                  <select
                    id="jobSkillFilter"
                    className="form-select form-select-sm"
                    value={skillFilter}
                    onChange={(e) => setSkillFilter(e.target.value)}
                  >
                    <option value="All">All Skills</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Mechanic">Mechanic</option>
                    <option value="Painter">Painter</option>
                    <option value="Appliance Repair">Appliance Repair</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2">
                  <label htmlFor="jobTypeFilter" className="form-label mb-0 small text-nowrap fw-semibold">
                    Type:
                  </label>
                  <select
                    id="jobTypeFilter"
                    className="form-select form-select-sm"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="All">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {filteredJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onApplyClick={(j) => {
                  setSelectedJob(j);
                  setFormData(prev => ({
                    ...prev,
                    jobId: j.id,
                    applicantSkill: prev.applicantSkill || j.skill
                  }));
                  // Scroll slightly towards form
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindJobsPage;
