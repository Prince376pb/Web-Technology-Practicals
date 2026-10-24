import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import FindWorkersPage from './pages/FindWorkersPage';
import FindJobsPage from './pages/FindJobsPage';
import RequestServicePage from './pages/RequestServicePage';
import RegisterWorkerPage from './pages/RegisterWorkerPage';
import RecordsPage from './pages/RecordsPage';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [apiOnline, setApiOnline] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [preselectedWorker, setPreselectedWorker] = useState(null);

  // Check API health status and load initial workers/jobs
  const checkHealthAndLoadData = async () => {
    try {
      const healthRes = await fetch('/api/workers');
      if (healthRes.ok) {
        setApiOnline(true);
        const workersData = await healthRes.json();
        setWorkers(workersData.data || []);
      } else {
        setApiOnline(false);
      }

      const jobsRes = await fetch('/api/jobs');
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData.data || []);
      }
    } catch (err) {
      console.warn("Backend not reachable yet:", err.message);
      setApiOnline(false);
    }
  };

  useEffect(() => {
    checkHealthAndLoadData();
    // Poll API status every 15 seconds
    const interval = setInterval(checkHealthAndLoadData, 15000);
    return () => clearInterval(interval);
  }, []);

  // Handler to refresh workers list after new worker registration
  const handleWorkerRegistered = () => {
    checkHealthAndLoadData();
  };

  return (
    <div className="d-flex flex-column min-vh-100 site-root">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Page Content */}
      <main className="flex-grow-1">
        {activeTab === 'home' && (
          <HomePage
            setActiveTab={setActiveTab}
            workers={workers}
            jobs={jobs}
            onSelectJob={(job) => {
              setSelectedJob(job);
              setActiveTab('jobs');
            }}
            onHireWorker={(worker) => {
              setPreselectedWorker(worker);
              setActiveTab('request-service');
            }}
          />
        )}

        {activeTab === 'workers' && (
          <FindWorkersPage
            workers={workers}
            setActiveTab={setActiveTab}
            onHireWorker={(worker) => {
              setPreselectedWorker(worker);
              setActiveTab('request-service');
            }}
          />
        )}

        {activeTab === 'jobs' && (
          <FindJobsPage
            jobs={jobs}
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
            onApplicationSuccess={checkHealthAndLoadData}
          />
        )}

        {activeTab === 'request-service' && (
          <RequestServicePage
            preselectedWorker={preselectedWorker}
            onServiceSuccess={checkHealthAndLoadData}
          />
        )}

        {activeTab === 'register-worker' && (
          <RegisterWorkerPage
            onWorkerRegistered={handleWorkerRegistered}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'records' && (
          <RecordsPage />
        )}
      </main>

      {/* Clean, Professional Footer */}
      <footer className="footer mt-auto">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-5">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="brand-badge" style={{ width: '36px', height: '36px' }}>
                  <i className="bi bi-hammer fs-6"></i>
                </div>
                <h5 className="text-white mb-0 fw-bold">Labour Connect</h5>
              </div>
              <p className="footer-desc pe-lg-4 mb-3">
                A modern platform connecting skilled trade workers with households, small businesses, and contractors for reliable everyday services and verified job opportunities.
              </p>
              <div className="d-flex align-items-center gap-3 text-white-50 small">
                <span><i className="bi bi-geo-alt me-1 text-primary-light"></i>Local Coverage</span>
                <span>•</span>
                <span><i className="bi bi-shield-check me-1 text-success"></i>Direct Connect</span>
                <span>•</span>
                <span><i className="bi bi-clock me-1 text-warning"></i>Prompt Response</span>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <h6 className="footer-title mb-3">Quick Links</h6>
              <ul className="list-unstyled footer-links d-flex flex-column gap-2 mb-0">
                <li>
                  <button className="footer-link-btn" onClick={() => setActiveTab('workers')}>
                    <i className="bi bi-chevron-right me-1"></i>Find Workers
                  </button>
                </li>
                <li>
                  <button className="footer-link-btn" onClick={() => setActiveTab('jobs')}>
                    <i className="bi bi-chevron-right me-1"></i>Find Jobs
                  </button>
                </li>
                <li>
                  <button className="footer-link-btn" onClick={() => setActiveTab('request-service')}>
                    <i className="bi bi-chevron-right me-1"></i>Request a Service
                  </button>
                </li>
                <li>
                  <button className="footer-link-btn" onClick={() => setActiveTab('register-worker')}>
                    <i className="bi bi-chevron-right me-1"></i>Register as Worker
                  </button>
                </li>
              </ul>
            </div>

            <div className="col-6 col-lg-4">
              <h6 className="footer-title mb-3">Popular Services</h6>
              <div className="footer-tags d-flex flex-wrap gap-2">
                <button className="footer-tag-btn" onClick={() => setActiveTab('request-service')}>Plumbing</button>
                <button className="footer-tag-btn" onClick={() => setActiveTab('request-service')}>Electrical Work</button>
                <button className="footer-tag-btn" onClick={() => setActiveTab('request-service')}>Carpentry</button>
                <button className="footer-tag-btn" onClick={() => setActiveTab('request-service')}>Painting</button>
                <button className="footer-tag-btn" onClick={() => setActiveTab('request-service')}>Mechanics</button>
                <button className="footer-tag-btn" onClick={() => setActiveTab('request-service')}>Appliance Repair</button>
              </div>
              <p className="footer-desc mt-3 small mb-0">
                Doorstep maintenance and repairs carried out by skilled local specialists.
              </p>
            </div>
          </div>

          <div className="footer-bottom mt-4 pt-3 d-flex flex-column flex-sm-row justify-content-between align-items-center">
            <div className="footer-copy">
              &copy; {new Date().getFullYear()} Labour Connect. All rights reserved.
            </div>
            <div className="footer-tagline mt-2 mt-sm-0">
              Connecting Skills with Opportunities
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
