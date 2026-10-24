import React, { useState, useEffect } from 'react';

function RecordsPage() {
  const [activeSubTab, setActiveSubTab] = useState('testbench'); // 'testbench' | 'requests' | 'applications'
  const [serviceRequests, setServiceRequests] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Test bench state for live demo
  const [testResult, setTestResult] = useState(null);
  const [testRunning, setTestRunning] = useState(false);

  // Fetch live session records from Express API
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const [reqRes, appRes] = await fetchAllRecords();
      setServiceRequests(reqRes);
      setJobApplications(appRes);
    } catch (err) {
      console.error("Error fetching session records:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRecords = async () => {
    const [res1, res2] = await Promise.all([
      fetch('/api/service-requests').then(r => r.json()),
      fetch('/api/applications').then(r => r.json())
    ]);
    return [res1.data || [], res2.data || []];
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Pre-configured Test Cases from Assignment Spec
  const testScenarios = [
    {
      category: 'Worker Registration Tests',
      tests: [
        {
          name: 'Valid Worker Registration',
          endpoint: 'POST /api/workers',
          payload: {
            name: 'Kailash Yadav',
            mobile: '9822114455',
            skill: 'Electrician',
            experience: 4,
            location: 'Civil Lines, Nagpur',
            payment: 650,
            availability: 'Available'
          },
          expectedStatus: 201,
          description: 'All fields valid -> HTTP 201 Created'
        },
        {
          name: 'Empty Worker Name',
          endpoint: 'POST /api/workers',
          payload: {
            name: '',
            mobile: '9822114455',
            skill: 'Electrician',
            experience: 4,
            location: 'Civil Lines, Nagpur',
            payment: 650,
            availability: 'Available'
          },
          expectedStatus: 400,
          description: 'Name is empty -> HTTP 400 Bad Request'
        },
        {
          name: 'Invalid Mobile (5 digits)',
          endpoint: 'POST /api/workers',
          payload: {
            name: 'Kailash Yadav',
            mobile: '12345',
            skill: 'Electrician',
            experience: 4,
            location: 'Civil Lines, Nagpur',
            payment: 650,
            availability: 'Available'
          },
          expectedStatus: 400,
          description: 'Fewer than 10 digits -> HTTP 400 Bad Request'
        },
        {
          name: 'Negative Experience (-2)',
          endpoint: 'POST /api/workers',
          payload: {
            name: 'Kailash Yadav',
            mobile: '9822114455',
            skill: 'Electrician',
            experience: -2,
            location: 'Civil Lines, Nagpur',
            payment: 650,
            availability: 'Available'
          },
          expectedStatus: 400,
          description: 'Negative number -> HTTP 400 Bad Request'
        },
        {
          name: 'Invalid Payment (0)',
          endpoint: 'POST /api/workers',
          payload: {
            name: 'Kailash Yadav',
            mobile: '9822114455',
            skill: 'Electrician',
            experience: 4,
            location: 'Civil Lines, Nagpur',
            payment: 0,
            availability: 'Available'
          },
          expectedStatus: 400,
          description: 'Payment must be > 0 -> HTTP 400 Bad Request'
        },
        {
          name: 'Missing Location',
          endpoint: 'POST /api/workers',
          payload: {
            name: 'Kailash Yadav',
            mobile: '9822114455',
            skill: 'Electrician',
            experience: 4,
            location: '   ',
            payment: 650,
            availability: 'Available'
          },
          expectedStatus: 400,
          description: 'Location whitespace only -> HTTP 400 Bad Request'
        }
      ]
    },
    {
      category: 'Service Request Tests',
      tests: [
        {
          name: 'Valid Service Request',
          endpoint: 'POST /api/service-requests',
          payload: {
            customerName: 'Pooja Verma',
            mobile: '9890123456',
            category: 'Plumber',
            location: 'Dharampeth, Nagpur',
            preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            description: 'Bathroom shower leaking continuously.'
          },
          expectedStatus: 201,
          description: 'Future date + 10-char desc -> HTTP 201 Created'
        },
        {
          name: 'Invalid Mobile Number',
          endpoint: 'POST /api/service-requests',
          payload: {
            customerName: 'Pooja Verma',
            mobile: '98901',
            category: 'Plumber',
            location: 'Dharampeth, Nagpur',
            preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            description: 'Shower leaking continuously.'
          },
          expectedStatus: 400,
          description: '5 digits only -> HTTP 400 Bad Request'
        },
        {
          name: 'Missing Service Category',
          endpoint: 'POST /api/service-requests',
          payload: {
            customerName: 'Pooja Verma',
            mobile: '9890123456',
            category: '',
            location: 'Dharampeth, Nagpur',
            preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            description: 'Shower leaking continuously.'
          },
          expectedStatus: 400,
          description: 'Category missing -> HTTP 400 Bad Request'
        },
        {
          name: 'Past Service Date (2020-01-01)',
          endpoint: 'POST /api/service-requests',
          payload: {
            customerName: 'Pooja Verma',
            mobile: '9890123456',
            category: 'Plumber',
            location: 'Dharampeth, Nagpur',
            preferredDate: '2020-01-01',
            description: 'Shower leaking continuously.'
          },
          expectedStatus: 400,
          description: 'Date in past -> HTTP 400 Bad Request'
        },
        {
          name: 'Short Problem Description (< 10 chars)',
          endpoint: 'POST /api/service-requests',
          payload: {
            customerName: 'Pooja Verma',
            mobile: '9890123456',
            category: 'Plumber',
            location: 'Dharampeth, Nagpur',
            preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            description: 'Leak'
          },
          expectedStatus: 400,
          description: 'Fewer than 10 characters -> HTTP 400 Bad Request'
        }
      ]
    },
    {
      category: 'Job Application Tests',
      tests: [
        {
          name: 'Valid Job Application',
          endpoint: 'POST /api/applications',
          payload: {
            applicantName: 'Vikram Joshi',
            mobile: '9876501234',
            jobId: 'job-101',
            applicantSkill: 'Electrician'
          },
          expectedStatus: 201,
          description: 'Valid applicant and job ID -> HTTP 201 Created'
        },
        {
          name: 'Missing Applicant Name',
          endpoint: 'POST /api/applications',
          payload: {
            applicantName: '',
            mobile: '9876501234',
            jobId: 'job-101',
            applicantSkill: 'Electrician'
          },
          expectedStatus: 400,
          description: 'Name blank -> HTTP 400 Bad Request'
        },
        {
          name: 'Invalid Mobile Number',
          endpoint: 'POST /api/applications',
          payload: {
            applicantName: 'Vikram Joshi',
            mobile: 'abc1234',
            jobId: 'job-101',
            applicantSkill: 'Electrician'
          },
          expectedStatus: 400,
          description: 'Non-numeric chars -> HTTP 400 Bad Request'
        },
        {
          name: 'Unknown / Nonexistent Job ID',
          endpoint: 'POST /api/applications',
          payload: {
            applicantName: 'Vikram Joshi',
            mobile: '9876501234',
            jobId: 'job-9999',
            applicantSkill: 'Electrician'
          },
          expectedStatus: 400,
          description: 'job-9999 does not exist -> HTTP 400 Bad Request'
        }
      ]
    }
  ];

  // Execute a test case against the Express backend
  const executeTestCase = async (test) => {
    setTestRunning(true);
    setTestResult(null);

    const [method, path] = test.endpoint.split(' ');

    try {
      const startTime = performance.now();
      const res = await fetch(path, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test.payload)
      });
      const responseTime = Math.round(performance.now() - startTime);
      const data = await res.json();

      setTestResult({
        testName: test.name,
        endpoint: test.endpoint,
        sentPayload: test.payload,
        actualStatus: res.status,
        expectedStatus: test.expectedStatus,
        passed: res.status === test.expectedStatus,
        responseBody: data,
        responseTime: responseTime
      });

      // Refresh records after valid creation
      if (res.status === 201) {
        fetchRecords();
      }
    } catch (err) {
      setTestResult({
        testName: test.name,
        endpoint: test.endpoint,
        sentPayload: test.payload,
        actualStatus: 'Error',
        expectedStatus: test.expectedStatus,
        passed: false,
        responseBody: { error: err.message },
        responseTime: 0
      });
    } finally {
      setTestRunning(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <span className="badge bg-dark text-white px-3 py-1 mb-1">PRACTICAL DEMONSTRATION & VIVA</span>
          <h2 className="fw-bold mb-1">Live Server Records & Test Bench</h2>
          <p className="text-muted mb-0">
            Real-time inspection of in-memory arrays and one-click test bench to demonstrate ExpressJS server-side validation to examiners.
          </p>
        </div>
        <button
          className="btn btn-outline-secondary d-flex align-items-center gap-2 align-self-start"
          onClick={fetchRecords}
          disabled={loading}
        >
          <i className={`bi bi-arrow-clockwise ${loading ? 'spin' : ''}`}></i>
          <span>Refresh Server Data</span>
        </button>
      </div>

      {/* Tabs */}
      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button
            className={`nav-link ${activeSubTab === 'testbench' ? 'active bg-primary' : 'bg-white text-dark border'}`}
            onClick={() => setActiveSubTab('testbench')}
          >
            <i className="bi bi-play-circle-fill me-2"></i>
            Interactive Validation Test Bench
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeSubTab === 'requests' ? 'active bg-primary' : 'bg-white text-dark border'}`}
            onClick={() => setActiveSubTab('requests')}
          >
            <i className="bi bi-tools me-2"></i>
            Service Requests (GET /api/service-requests) ({serviceRequests.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeSubTab === 'applications' ? 'active bg-primary' : 'bg-white text-dark border'}`}
            onClick={() => setActiveSubTab('applications')}
          >
            <i className="bi bi-briefcase-fill me-2"></i>
            Job Applications (GET /api/applications) ({jobApplications.length})
          </button>
        </li>
      </ul>

      {/* TAB 1: Interactive Test Bench */}
      {activeSubTab === 'testbench' && (
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-check2-square text-primary"></i>
                <span>Select a Specification Test Case</span>
              </h5>
              <p className="text-muted small">
                Click any test case button below. It will send an actual HTTP request to the Express backend and display the real response code and body.
              </p>

              <div className="accordion" id="testCasesAccordion">
                {testScenarios.map((group, gIdx) => (
                  <div className="mb-3" key={gIdx}>
                    <h6 className="fw-bold text-secondary text-uppercase small mb-2 border-bottom pb-1">
                      {group.category}
                    </h6>
                    <div className="d-flex flex-column gap-2">
                      {group.tests.map((test, tIdx) => (
                        <div
                          key={tIdx}
                          className="d-flex align-items-center justify-content-between p-2 rounded-3 border bg-light"
                        >
                          <div>
                            <div className="fw-semibold text-dark small">{test.name}</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                              Expected: <span className="badge bg-secondary">{test.expectedStatus}</span> — {test.description}
                            </div>
                          </div>
                          <button
                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 text-nowrap"
                            onClick={() => executeTestCase(test)}
                            disabled={testRunning}
                          >
                            <i className="bi bi-send-fill" style={{ fontSize: '0.75rem' }}></i>
                            <span>Test</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Test Results Output Console */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <h5 className="fw-bold mb-3 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-terminal text-dark"></i>
                  <span>Live HTTP Response Inspector</span>
                </div>
                {testResult && (
                  <span className={`badge ${testResult.passed ? 'bg-success' : 'bg-danger'}`}>
                    {testResult.passed ? 'VERIFIED MATCH' : 'MISMATCH'}
                  </span>
                )}
              </h5>

              {testResult ? (
                <div>
                  <div className="alert alert-secondary p-3 rounded-3 mb-3 small">
                    <div className="d-flex justify-content-between mb-1">
                      <strong>Test Name:</strong>
                      <span>{testResult.testName}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <strong>Endpoint:</strong>
                      <code>{testResult.endpoint}</code>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <strong>HTTP Status:</strong>
                      <span className={`badge ${testResult.actualStatus === 201 ? 'bg-success' : 'bg-danger'}`}>
                        HTTP {testResult.actualStatus} {testResult.actualStatus === 201 ? 'Created' : 'Bad Request'}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <strong>Latency:</strong>
                      <span>{testResult.responseTime} ms</span>
                    </div>
                  </div>

                  <h6 className="fw-bold text-secondary small text-uppercase mb-2">Sent JSON Payload:</h6>
                  <pre className="p-3 bg-dark text-info rounded-3 small" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                    {JSON.stringify(testResult.sentPayload, null, 2)}
                  </pre>

                  <h6 className="fw-bold text-secondary small text-uppercase mb-2">Express Server JSON Response:</h6>
                  <pre
                    className={`p-3 rounded-3 small ${testResult.actualStatus === 201 ? 'bg-success-subtle text-dark border border-success' : 'bg-danger-subtle text-danger border border-danger'}`}
                    style={{ maxHeight: '160px', overflowY: 'auto' }}
                  >
                    {JSON.stringify(testResult.responseBody, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-arrow-left-circle display-4 d-block mb-3 text-secondary"></i>
                  <h6>No Test Executed Yet</h6>
                  <p className="small">Click any "Test" button on the left to fire a live HTTP request to Express.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Service Requests Records */}
      {activeSubTab === 'requests' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">In-Memory Service Requests ({serviceRequests.length})</h5>
            <span className="badge bg-primary-subtle text-primary">Route: GET /api/service-requests</span>
          </div>

          {serviceRequests.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Request ID</th>
                    <th>Customer Name</th>
                    <th>Mobile</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Preferred Date</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceRequests.map((req) => (
                    <tr key={req.id}>
                      <td><code>{req.id}</code></td>
                      <td className="fw-semibold">{req.customerName}</td>
                      <td>+91 {req.mobile}</td>
                      <td><span className="badge badge-skill">{req.category}</span></td>
                      <td className="text-truncate" style={{ maxWidth: '160px' }}>{req.location}</td>
                      <td><span className="badge bg-light text-dark border">{req.preferredDate}</span></td>
                      <td className="text-truncate" style={{ maxWidth: '200px' }} title={req.description}>
                        {req.description}
                      </td>
                      <td><span className="badge bg-success-subtle text-success">Validated & Accepted</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-muted">
              <i className="bi bi-inbox fs-2 d-block mb-2"></i>
              No service requests submitted in this server session yet. Submit one from the "Request Service" tab!
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Job Applications Records */}
      {activeSubTab === 'applications' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">In-Memory Job Applications ({jobApplications.length})</h5>
            <span className="badge bg-primary-subtle text-primary">Route: GET /api/applications</span>
          </div>

          {jobApplications.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>App ID</th>
                    <th>Applicant Name</th>
                    <th>Mobile</th>
                    <th>Applied Job</th>
                    <th>Employer</th>
                    <th>Applicant Skill</th>
                    <th>Applied At</th>
                    <th>Server Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobApplications.map((app) => (
                    <tr key={app.id}>
                      <td><code>{app.id}</code></td>
                      <td className="fw-semibold">{app.applicantName}</td>
                      <td>+91 {app.mobile}</td>
                      <td className="fw-medium text-dark">{app.jobTitle}</td>
                      <td className="text-muted">{app.employer}</td>
                      <td><span className="badge badge-skill">{app.applicantSkill}</span></td>
                      <td className="small text-muted">{new Date(app.appliedAt).toLocaleTimeString()}</td>
                      <td><span className="badge bg-success-subtle text-success">Validated & Stored</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-muted">
              <i className="bi bi-inbox fs-2 d-block mb-2"></i>
              No job applications submitted in this server session yet. Submit one from the "Find Jobs" tab!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RecordsPage;
