// ==============================================================================
// Labour Connect Express JS - ExpressJS Server with Server-Side Validation
// Assignment: Design, develop and deploy a web application to demonstrate server-side validation using ExpressJS.
// ==============================================================================

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------------------------------------------------------------------
// Middleware Configuration
// ------------------------------------------------------------------------------
// Enable CORS for cross-origin communication between React frontend and Express backend
app.use(cors());

// Parse incoming requests with JSON payloads (essential for Fetch API POST requests)
app.use(express.json());

// Parse URL-encoded bodies for form submissions
app.use(express.urlencoded({ extended: true }));

// ------------------------------------------------------------------------------
// In-Memory Data Storage (JavaScript Arrays)
// ------------------------------------------------------------------------------

// Predefined allowed service categories for validation and display
const ALLOWED_SERVICE_CATEGORIES = [
  'Plumber',
  'Electrician',
  'Carpenter',
  'Mechanic',
  'Painter',
  'Appliance Repair'
];

// Predefined worker availability statuses
const ALLOWED_AVAILABILITY = ['Available', 'Busy', 'Unavailable'];

// Sample Workers array (stores initial sample workers and newly registered workers)
let workers = [
  {
    id: "w-1",
    name: "Ramesh Sharma",
    mobile: "9876543210",
    skill: "Electrician",
    experience: 6,
    location: "Civil Lines, Nagpur",
    payment: 600,
    availability: "Available",
    registeredAt: "2026-10-10T09:30:00.000Z"
  },
  {
    id: "w-2",
    name: "Suresh Patil",
    mobile: "9823456781",
    skill: "Plumber",
    experience: 8,
    location: "Dharampeth, Nagpur",
    payment: 550,
    availability: "Available",
    registeredAt: "2026-10-11T11:00:00.000Z"
  },
  {
    id: "w-3",
    name: "Mohan Lal",
    mobile: "9765432109",
    skill: "Carpenter",
    experience: 5,
    location: "Sadar, Nagpur",
    payment: 700,
    availability: "Busy",
    registeredAt: "2026-10-11T14:15:00.000Z"
  },
  {
    id: "w-4",
    name: "Abdul Karim",
    mobile: "9890123456",
    skill: "Painter",
    experience: 4,
    location: "Sitabuldi, Nagpur",
    payment: 500,
    availability: "Available",
    registeredAt: "2026-10-12T10:00:00.000Z"
  },
  {
    id: "w-5",
    name: "Rajesh Verma",
    mobile: "9850678901",
    skill: "Mechanic",
    experience: 7,
    location: "MIDC Hingna, Nagpur",
    payment: 650,
    availability: "Available",
    registeredAt: "2026-10-12T16:45:00.000Z"
  },
  {
    id: "w-6",
    name: "Dinesh Kulkarni",
    mobile: "9812345670",
    skill: "Appliance Repair",
    experience: 9,
    location: "Pratap Nagar, Nagpur",
    payment: 750,
    availability: "Available",
    registeredAt: "2026-10-13T08:20:00.000Z"
  }
];

// Sample Available Jobs array
let jobs = [
  {
    id: "job-101",
    title: "Senior Residential Electrician",
    employer: "Om Sai Electricals & Contractors",
    skill: "Electrician",
    location: "Dharampeth, Nagpur",
    experience: 3,
    salary: "₹22,000 / month",
    type: "Full-time",
    description: "Looking for an experienced electrician for wiring and residential panel installations."
  },
  {
    id: "job-102",
    title: "Commercial Plumbing Technician",
    employer: "Shree Ganesh Plumbing Services",
    skill: "Plumber",
    location: "Sadar Bazaar, Nagpur",
    experience: 2,
    salary: "₹18,000 / month",
    type: "Full-time",
    description: "Urgent opening for sanitary fittings, PVC pipeline layout and leakage diagnosis."
  },
  {
    id: "job-103",
    title: "Modular Kitchen Furniture Carpenter",
    employer: "WoodCraft Interior Studio",
    skill: "Carpenter",
    location: "Wardha Road, Nagpur",
    experience: 4,
    salary: "₹850 / day",
    type: "Contract",
    description: "Need skilled carpenter experienced with plywood cutting, edge banding, and modular kitchen units."
  },
  {
    id: "job-104",
    title: "Two-Wheeler Senior Mechanic",
    employer: "Super Auto Works",
    skill: "Mechanic",
    location: "MIDC Industrial Area, Nagpur",
    experience: 3,
    salary: "₹20,000 / month",
    type: "Full-time",
    description: "Engine overhaul, brake service, and electrical troubleshooting for multi-brand two-wheelers."
  },
  {
    id: "job-105",
    title: "Wall Texture & Exterior Painter",
    employer: "Asian Decorators & Builders",
    skill: "Painter",
    location: "Manish Nagar, Nagpur",
    experience: 2,
    salary: "₹650 / day",
    type: "Part-time",
    description: "Exterior waterproofing, putty application, and luxury emulsion paint finishing."
  },
  {
    id: "job-106",
    title: "AC & Refrigerator Service Technician",
    employer: "Cool Tech Appliances",
    skill: "Appliance Repair",
    location: "Ramdaspeth, Nagpur",
    experience: 3,
    salary: "₹24,000 / month",
    type: "Full-time",
    description: "Gas charging, compressor replacement, inverter AC troubleshooting, and preventative maintenance."
  }
];

// In-memory array for job applications submitted during the session
let jobApplications = [];

// In-memory array for service requests submitted during the session
let serviceRequests = [];

// ------------------------------------------------------------------------------
// Express Router for Endpoints
// Using an Express Router allows identical routing locally and in Netlify Functions
// ------------------------------------------------------------------------------
const router = express.Router();

// ------------------------------------------------------------------------------
// 1. GET / - Root route to confirm API status
// ------------------------------------------------------------------------------
router.get('/', (req, res) => {
  res.status(200).json({
    message: "Labour Connect Express JS API is running successfully!",
    status: "active",
    environment: process.env.NETLIFY ? "Netlify Serverless Functions" : "Node.js Local Server",
    timestamp: new Date().toISOString()
  });
});

// ------------------------------------------------------------------------------
// 2. GET /workers - List all workers (sample + newly registered)
// ------------------------------------------------------------------------------
router.get('/workers', (req, res) => {
  res.status(200).json({
    success: true,
    count: workers.length,
    data: workers
  });
});

// ------------------------------------------------------------------------------
// 3. POST /workers - Register a new worker with strict Server-Side Validation
// ------------------------------------------------------------------------------
router.post('/workers', (req, res) => {
  const { name, mobile, skill, experience, location, payment, availability } = req.body;

  // Rule 1: Full name is required and must contain at least two characters
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: "Full name is required and must contain at least 2 characters."
    });
  }

  // Rule 2: Mobile number must contain exactly 10 digits
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobile || !mobileRegex.test(String(mobile).trim())) {
    return res.status(400).json({
      success: false,
      error: "Mobile number must contain exactly 10 digits."
    });
  }

  // Rule 3: Skill or profession is required
  if (!skill || typeof skill !== 'string' || skill.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "Skill or profession is required."
    });
  }

  // Rule 4: Experience must be a valid number greater than or equal to zero
  const expNum = Number(experience);
  if (experience === undefined || experience === null || experience === '' || isNaN(expNum) || expNum < 0) {
    return res.status(400).json({
      success: false,
      error: "Experience must be a valid number greater than or equal to 0."
    });
  }

  // Rule 5: Location is required
  if (!location || typeof location !== 'string' || location.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "Location is required."
    });
  }

  // Rule 6: Expected payment must be a valid positive number
  const paymentNum = Number(payment);
  if (payment === undefined || payment === null || payment === '' || isNaN(paymentNum) || paymentNum <= 0) {
    return res.status(400).json({
      success: false,
      error: "Expected payment must be a valid positive number."
    });
  }

  // Rule 7: Availability must be selected from predefined options
  if (!availability || !ALLOWED_AVAILABILITY.includes(String(availability).trim())) {
    return res.status(400).json({
      success: false,
      error: `Availability must be one of: ${ALLOWED_AVAILABILITY.join(', ')}.`
    });
  }

  // If all validation checks pass, create new worker record
  const newWorker = {
    id: "w-" + Date.now(),
    name: name.trim(),
    mobile: String(mobile).trim(),
    skill: skill.trim(),
    experience: expNum,
    location: location.trim(),
    payment: paymentNum,
    availability: String(availability).trim(),
    registeredAt: new Date().toISOString()
  };

  // Add to in-memory array (persists for current server session)
  workers.unshift(newWorker);

  // Return HTTP 201 Created with the saved worker object
  return res.status(201).json({
    success: true,
    message: "Worker registered successfully!",
    data: newWorker
  });
});

// ------------------------------------------------------------------------------
// 4. GET /jobs - List all available jobs
// ------------------------------------------------------------------------------
router.get('/jobs', (req, res) => {
  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs
  });
});

// ------------------------------------------------------------------------------
// 5. POST /applications - Accept job application with Server-Side Validation
// ------------------------------------------------------------------------------
router.post('/applications', (req, res) => {
  const { applicantName, mobile, jobId, applicantSkill } = req.body;

  // Rule 1: Applicant name is required
  if (!applicantName || typeof applicantName !== 'string' || applicantName.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "Applicant name is required."
    });
  }

  // Rule 2: Mobile number must contain exactly 10 digits
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobile || !mobileRegex.test(String(mobile).trim())) {
    return res.status(400).json({
      success: false,
      error: "Mobile number must contain exactly 10 digits."
    });
  }

  // Rule 3: Job ID is required and must correspond to an existing job
  if (!jobId) {
    return res.status(400).json({
      success: false,
      error: "Job ID is required."
    });
  }

  const targetJob = jobs.find(j => String(j.id) === String(jobId).trim());
  if (!targetJob) {
    return res.status(400).json({
      success: false,
      error: "Selected job ID does not exist in our records."
    });
  }

  // Rule 4: Applicant skill is required
  if (!applicantSkill || typeof applicantSkill !== 'string' || applicantSkill.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "Applicant skill is required."
    });
  }

  // Valid application - store record
  const newApplication = {
    id: "app-" + Date.now(),
    applicantName: applicantName.trim(),
    mobile: String(mobile).trim(),
    jobId: targetJob.id,
    jobTitle: targetJob.title,
    employer: targetJob.employer,
    applicantSkill: applicantSkill.trim(),
    appliedAt: new Date().toISOString()
  };

  jobApplications.unshift(newApplication);

  return res.status(201).json({
    success: true,
    message: `Application submitted successfully for "${targetJob.title}"!`,
    data: newApplication
  });
});

// ------------------------------------------------------------------------------
// 6. POST /service-requests - Accept customer service request with Server-Side Validation
// ------------------------------------------------------------------------------
router.post('/service-requests', (req, res) => {
  const { customerName, mobile, category, location, preferredDate, description } = req.body;

  // Rule 1: Customer name is required
  if (!customerName || typeof customerName !== 'string' || customerName.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "Customer name is required."
    });
  }

  // Rule 2: Mobile number must contain exactly 10 digits
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobile || !mobileRegex.test(String(mobile).trim())) {
    return res.status(400).json({
      success: false,
      error: "Mobile number must contain exactly 10 digits."
    });
  }

  // Rule 3: Service category must be one of the predefined categories
  if (!category || !ALLOWED_SERVICE_CATEGORIES.includes(String(category).trim())) {
    return res.status(400).json({
      success: false,
      error: `Service category must be one of: ${ALLOWED_SERVICE_CATEGORIES.join(', ')}.`
    });
  }

  // Rule 4: Service location is required
  if (!location || typeof location !== 'string' || location.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "Service location is required."
    });
  }

  // Rule 5: Preferred date must be present and must not be in the past (using server's current date)
  if (!preferredDate) {
    return res.status(400).json({
      success: false,
      error: "Preferred service date is required."
    });
  }

  // Normalize server date to start of day (midnight) for accurate comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse input preferred date (expected format YYYY-MM-DD or standard ISO)
  const reqDate = new Date(preferredDate + (preferredDate.length === 10 ? 'T00:00:00' : ''));

  if (isNaN(reqDate.getTime())) {
    return res.status(400).json({
      success: false,
      error: "Preferred service date is not a valid date format."
    });
  }

  if (reqDate < today) {
    return res.status(400).json({
      success: false,
      error: "Preferred service date cannot be in the past. Please select today or a future date."
    });
  }

  // Rule 6: Problem description is required and must contain at least 10 characters
  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    return res.status(400).json({
      success: false,
      error: "Problem description is required and must contain at least 10 characters."
    });
  }

  // Valid service request - store record
  const newRequest = {
    id: "req-" + Date.now(),
    customerName: customerName.trim(),
    mobile: String(mobile).trim(),
    category: category.trim(),
    location: location.trim(),
    preferredDate: preferredDate,
    description: description.trim(),
    requestedAt: new Date().toISOString()
  };

  serviceRequests.unshift(newRequest);

  return res.status(201).json({
    success: true,
    message: "Service request accepted successfully! A technician will be assigned shortly.",
    data: newRequest
  });
});

// ------------------------------------------------------------------------------
// 7. GET /service-requests - Return all service requests stored in current session
// ------------------------------------------------------------------------------
router.get('/service-requests', (req, res) => {
  res.status(200).json({
    success: true,
    count: serviceRequests.length,
    data: serviceRequests
  });
});

// ------------------------------------------------------------------------------
// 8. GET /applications - Return all job applications stored in current session
// ------------------------------------------------------------------------------
router.get('/applications', (req, res) => {
  res.status(200).json({
    success: true,
    count: jobApplications.length,
    data: jobApplications
  });
});

// ------------------------------------------------------------------------------
// Mount Routes on All Prefixes
// Ensures compatibility with:
// 1. Local standalone server (/api/*)
// 2. Netlify Functions (/.netlify/functions/api/*)
// 3. Root mount (/*)
// ------------------------------------------------------------------------------
app.use('/api', router);
app.use('/.netlify/functions/api', router);
app.use('/', router);

// ------------------------------------------------------------------------------
// 404 Handler for Unknown Routes
// ------------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.url} - Route not found on Labour Connect Express JS server.`
  });
});

// ------------------------------------------------------------------------------
// Global Error Handler
// ------------------------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal Server Error occurred on Labour Connect Express JS backend."
  });
});

// ------------------------------------------------------------------------------
// Export app for Netlify Serverless Functions and Testing
// ------------------------------------------------------------------------------
module.exports = app;

// ------------------------------------------------------------------------------
// Start Express Server only if executed directly
// ------------------------------------------------------------------------------
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Labour Connect Express JS Server running on http://localhost:${PORT}`);
    console.log(` Server-Side Validation Active for All POST Endpoints`);
    console.log(`====================================================`);
  });
}
