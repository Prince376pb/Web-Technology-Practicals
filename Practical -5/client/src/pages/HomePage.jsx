import React from 'react';
import WorkerCard from '../components/WorkerCard';
import JobCard from '../components/JobCard';

function HomePage({ setActiveTab, workers, jobs, onSelectJob, onHireWorker }) {
  // Show top 3 workers and top 3 jobs as preview
  const featuredWorkers = workers.slice(0, 3);
  const featuredJobs = jobs.slice(0, 3);

  const popularServices = [
    {
      id: 'Plumber',
      title: 'Plumbing',
      icon: 'bi-droplet-half',
      description: 'Leak fixes, pipe fittings, tap installations, and drainage solutions.',
      color: '#0284c7'
    },
    {
      id: 'Electrician',
      title: 'Electrical Work',
      icon: 'bi-lightning-charge',
      description: 'Wiring, circuit repairs, fixture installation, and power troubleshooting.',
      color: '#d97706'
    },
    {
      id: 'Carpenter',
      title: 'Carpentry',
      icon: 'bi-hammer',
      description: 'Furniture repairs, door installations, woodwork, and lock replacements.',
      color: '#92400e'
    },
    {
      id: 'Painter',
      title: 'Painting',
      icon: 'bi-paint-bucket',
      description: 'Interior and exterior painting, surface touch-ups, and wall finishes.',
      color: '#7c3aed'
    },
    {
      id: 'Mechanic',
      title: 'Mechanics',
      icon: 'bi-gear-wide-connected',
      description: 'Automotive repairs, vehicle servicing, and equipment maintenance.',
      color: '#dc2626'
    },
    {
      id: 'Appliance Repair',
      title: 'Appliance Repair',
      icon: 'bi-wrench-adjustable',
      description: 'Service and repairs for refrigerators, washing machines, and AC units.',
      color: '#059669'
    }
  ];

  return (
    <div className="homepage-wrapper">
      {/* Hero Section */}
      <section className="hero-wrapper">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <div className="hero-tagline-badge mb-3">
                <i className="bi bi-people-fill text-primary-emphasis"></i>
                <span>Trusted Local Workforce Marketplace</span>
              </div>
              <h1 className="hero-title">
                Connecting Skills with Opportunities
              </h1>
              <p className="hero-subtitle">
                Find skilled workers for your business, discover employment opportunities, or hire trusted local professionals for your everyday service needs.
              </p>

              <div className="hero-cta-group d-flex flex-wrap gap-2 gap-sm-3">
                <button
                  className="btn btn-primary-custom btn-lg d-flex align-items-center justify-content-center gap-2"
                  onClick={() => setActiveTab('request-service')}
                >
                  <i className="bi bi-tools"></i>
                  <span>Hire Skilled Services</span>
                </button>
                <button
                  className="btn btn-outline-light btn-lg d-flex align-items-center justify-content-center gap-2"
                  onClick={() => setActiveTab('jobs')}
                >
                  <i className="bi bi-briefcase"></i>
                  <span>Explore Jobs</span>
                </button>
                <button
                  className="btn btn-outline-light btn-lg d-flex align-items-center justify-content-center gap-2"
                  onClick={() => setActiveTab('register-worker')}
                >
                  <i className="bi bi-person-plus"></i>
                  <span>Register as Worker</span>
                </button>
              </div>

              {/* Quick Platform Metrics */}
              <div className="hero-stats-row mt-4 pt-3 border-top border-white border-opacity-10 d-flex flex-wrap gap-4 text-white-50">
                <div>
                  <div className="h4 fw-bold text-white mb-0">{workers.length}+</div>
                  <small>Active Workers</small>
                </div>
                <div>
                  <div className="h4 fw-bold text-white mb-0">{jobs.length}+</div>
                  <small>Open Positions</small>
                </div>
                <div>
                  <div className="h4 fw-bold text-white mb-0">6+</div>
                  <small>Key Trades</small>
                </div>
                <div>
                  <div className="h4 fw-bold text-white mb-0">Direct</div>
                  <small>Hiring &amp; Connect</small>
                </div>
              </div>
            </div>

            {/* Platform Feature Highlight Card */}
            <div className="col-lg-5">
              <div className="hero-feature-card p-4 rounded-4 shadow-lg text-white">
                <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-white border-opacity-15">
                  <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <i className="bi bi-shield-check text-info"></i>
                    <span>Marketplace Highlights</span>
                  </h5>
                  <span className="badge bg-info-subtle text-info-emphasis px-2 py-1">Direct Connect</span>
                </div>
                
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-start gap-3">
                    <div className="hero-card-icon-box bg-primary-subtle text-primary">
                      <i className="bi bi-person-badge-fill fs-5"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1 text-white">Find Skilled Tradespeople</h6>
                      <p className="text-white-50 small mb-0">
                        Search local electricians, plumbers, carpenters, and technicians with clear wage transparency.
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3">
                    <div className="hero-card-icon-box bg-success-subtle text-success">
                      <i className="bi bi-briefcase-fill fs-5"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1 text-white">Direct Job Applications</h6>
                      <p className="text-white-50 small mb-0">
                        Contractors and businesses post openings so trade workers can apply directly without friction.
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3">
                    <div className="hero-card-icon-box bg-warning-subtle text-warning">
                      <i className="bi bi-house-door-fill fs-5"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1 text-white">On-Demand Doorstep Help</h6>
                      <p className="text-white-50 small mb-0">
                        Schedule reliable maintenance and repair visits to your home or commercial facility.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-top border-white border-opacity-15 d-flex align-items-center justify-content-between">
                  <span className="text-white-50 small">Ready to explore?</span>
                  <button 
                    className="btn btn-sm btn-light fw-semibold px-3"
                    onClick={() => setActiveTab('workers')}
                  >
                    View Directory
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-5 bg-white border-bottom">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-primary fw-bold text-uppercase small" style={{ letterSpacing: '0.1em' }}>
              OUR SERVICES
            </span>
            <h2 className="display-6 fw-bold mt-1">Popular Everyday Services</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '640px' }}>
              From immediate home repairs to scheduled commercial maintenance, book trusted local specialists for your exact service needs.
            </p>
          </div>

          <div className="row g-4">
            {popularServices.map((service) => (
              <div className="col-12 col-md-6 col-lg-4" key={service.id}>
                <div className="service-card p-4 rounded-4 h-100 border d-flex flex-column">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div 
                      className="service-icon-box"
                      style={{ backgroundColor: `${service.color}15`, color: service.color }}
                    >
                      <i className={`bi ${service.icon} fs-4`}></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-0 text-dark">{service.title}</h5>
                      <small className="text-muted">On-Demand &amp; Contract</small>
                    </div>
                  </div>
                  <p className="text-secondary small flex-grow-1 mb-4">
                    {service.description}
                  </p>
                  <div className="d-flex gap-2 mt-auto">
                    <button
                      className="btn btn-outline-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                      onClick={() => setActiveTab('request-service')}
                    >
                      <i className="bi bi-tools"></i>
                      <span>Book Service</span>
                    </button>
                    <button
                      className="btn btn-light btn-sm px-3 text-secondary"
                      title={`View ${service.title} Workers`}
                      onClick={() => setActiveTab('workers')}
                    >
                      <i className="bi bi-search"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Labour Connect Works Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-primary fw-bold text-uppercase small" style={{ letterSpacing: '0.1em' }}>
              SIMPLE &amp; TRANSPARENT
            </span>
            <h2 className="display-6 fw-bold mt-1">How Labour Connect Works</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '640px' }}>
              Whether you are hiring trusted tradespeople for everyday tasks or seeking reliable employment, our platform connects you directly.
            </p>
          </div>

          <div className="row g-4">
            {/* For Customers */}
            <div className="col-lg-6">
              <div className="workflow-card p-4 p-md-5 rounded-4 bg-white border h-100 d-flex flex-column">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="workflow-badge bg-primary text-white">
                    <i className="bi bi-house-check-fill fs-4"></i>
                  </div>
                  <div>
                    <span className="text-primary fw-bold small text-uppercase">FOR HOUSEHOLDS &amp; BUSINESSES</span>
                    <h3 className="h4 fw-bold mb-0 text-dark">How to Hire Workers</h3>
                  </div>
                </div>

                <div className="d-flex flex-column gap-3 mb-4 flex-grow-1">
                  <div className="d-flex gap-3 align-items-start">
                    <span className="step-number">1</span>
                    <div>
                      <h6 className="fw-bold mb-1">Browse Workers or Select a Service</h6>
                      <p className="text-muted small mb-0">
                        Explore worker profiles by trade, experience, and daily wage, or choose from our list of popular services.
                      </p>
                    </div>
                  </div>

                  <div className="d-flex gap-3 align-items-start">
                    <span className="step-number">2</span>
                    <div>
                      <h6 className="fw-bold mb-1">Submit Your Service Request</h6>
                      <p className="text-muted small mb-0">
                        Provide your service address, preferred booking date, and a description of the work needed.
                      </p>
                    </div>
                  </div>

                  <div className="d-flex gap-3 align-items-start">
                    <span className="step-number">3</span>
                    <div>
                      <h6 className="fw-bold mb-1">Receive Prompt Doorstep Service</h6>
                      <p className="text-muted small mb-0">
                        Connect with the technician, agree on the requirements, and have your tasks completed professionally.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2 pt-3 border-top mt-auto">
                  <button
                    className="btn btn-primary-custom d-flex align-items-center gap-2"
                    onClick={() => setActiveTab('request-service')}
                  >
                    <span>Request a Service</span>
                    <i className="bi bi-arrow-right"></i>
                  </button>
                  <button
                    className="btn btn-outline-custom d-flex align-items-center gap-2"
                    onClick={() => setActiveTab('workers')}
                  >
                    <span>Browse Workers</span>
                  </button>
                </div>
              </div>
            </div>

            {/* For Workers */}
            <div className="col-lg-6">
              <div className="workflow-card p-4 p-md-5 rounded-4 bg-white border h-100 d-flex flex-column">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="workflow-badge bg-success text-white">
                    <i className="bi bi-person-workspace fs-4"></i>
                  </div>
                  <div>
                    <span className="text-success fw-bold small text-uppercase">FOR SKILLED TRADESPEOPLE</span>
                    <h3 className="h4 fw-bold mb-0 text-dark">How to Find Jobs</h3>
                  </div>
                </div>

                <div className="d-flex flex-column gap-3 mb-4 flex-grow-1">
                  <div className="d-flex gap-3 align-items-start">
                    <span className="step-number step-number-success">1</span>
                    <div>
                      <h6 className="fw-bold mb-1">Register Your Professional Profile</h6>
                      <p className="text-muted small mb-0">
                        List your core trade, years of experience, operating location, and expected daily payment rate.
                      </p>
                    </div>
                  </div>

                  <div className="d-flex gap-3 align-items-start">
                    <span className="step-number step-number-success">2</span>
                    <div>
                      <h6 className="fw-bold mb-1">Explore Open Job Vacancies</h6>
                      <p className="text-muted small mb-0">
                        Browse active job listings from local businesses and contractors offering full-time, part-time, or contract roles.
                      </p>
                    </div>
                  </div>

                  <div className="d-flex gap-3 align-items-start">
                    <span className="step-number step-number-success">3</span>
                    <div>
                      <h6 className="fw-bold mb-1">Apply &amp; Connect with Hirers</h6>
                      <p className="text-muted small mb-0">
                        Submit your application directly to prospective employers and receive job opportunities.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2 pt-3 border-top mt-auto">
                  <button
                    className="btn btn-success text-white fw-semibold d-flex align-items-center gap-2 px-4 py-2 rounded-3 shadow-sm"
                    onClick={() => setActiveTab('register-worker')}
                  >
                    <span>Register as Worker</span>
                    <i className="bi bi-arrow-right"></i>
                  </button>
                  <button
                    className="btn btn-outline-custom d-flex align-items-center gap-2"
                    onClick={() => setActiveTab('jobs')}
                  >
                    <span>Browse Open Jobs</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Service Providers Preview */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
            <div>
              <span className="badge bg-primary-subtle text-primary mb-1">LOCAL EXPERTS</span>
              <h3 className="fw-bold mb-0">Featured Skilled Workers</h3>
            </div>
            <button
              className="btn btn-outline-primary mt-2 mt-md-0 fw-semibold d-flex align-items-center gap-2 align-self-start align-self-md-auto"
              onClick={() => setActiveTab('workers')}
            >
              <span>View All Workers ({workers.length})</span>
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>

          <div className="row">
            {featuredWorkers.map((worker) => (
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
        </div>
      </section>

      {/* Featured Jobs Preview */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
            <div>
              <span className="badge bg-warning-subtle text-warning-emphasis mb-1">EMPLOYMENT OPPORTUNITIES</span>
              <h3 className="fw-bold mb-0">Latest Available Jobs</h3>
            </div>
            <button
              className="btn btn-outline-primary mt-2 mt-md-0 fw-semibold d-flex align-items-center gap-2 align-self-start align-self-md-auto"
              onClick={() => setActiveTab('jobs')}
            >
              <span>View All Jobs ({jobs.length})</span>
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>

          <div className="row">
            {featuredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApplyClick={(j) => {
                  onSelectJob(j);
                  setActiveTab('jobs');
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Platform Call to Action Banner */}
      <section className="py-5 bg-white border-top">
        <div className="container">
          <div className="cta-banner p-4 p-md-5 rounded-4 text-center">
            <h2 className="fw-bold mb-2">Ready to Get Started with Labour Connect?</h2>
            <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '600px' }}>
              Whether you need skilled help for home repairs today or want to register your trade to discover new employment, we are here to help.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <button
                className="btn btn-primary-custom btn-lg d-flex align-items-center gap-2"
                onClick={() => setActiveTab('request-service')}
              >
                <i className="bi bi-tools"></i>
                <span>Hire Skilled Services</span>
              </button>
              <button
                className="btn btn-outline-custom btn-lg d-flex align-items-center gap-2"
                onClick={() => setActiveTab('register-worker')}
              >
                <i className="bi bi-person-plus"></i>
                <span>Register as Worker</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
