/**
 * Labour Connect — NodeJS Web Application
 * Demonstrating Server-Side Validation, Modular Architecture & Routing
 */

const express = require("express");
const path = require("path");
const workerRoutes = require("./routes/workerRoutes");
const workerController = require("./controllers/workerController");

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================================
// Middleware Configuration
// ============================================================================

// Parse incoming JSON payloads
app.use(express.json());

// Parse incoming URL-encoded form data (traditional HTML form POST)
app.use(express.urlencoded({ extended: true }));

// Request logging middleware for academic demonstration
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// ============================================================================
// Application Routing
// ============================================================================

// Mount modular worker API routes
app.use("/api", workerRoutes);

// Direct POST route for worker registration (handles both HTML forms and AJAX)
app.post("/register", workerController.createWorker);

// Serve main web application interface
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "online",
    application: "Labour Connect",
    runtime: "Node.js",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// Error Handling Middleware
// ============================================================================

// 404 Not Found Handler
app.use((req, res) => {
  if (req.accepts("html")) {
    res.status(404).send(`
      <!DOCTYPE html>
      <html>
        <head><title>404 Not Found</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #0f172a; color: white;">
          <h1>404 - Page Not Found</h1>
          <p>The requested route does not exist on this server.</p>
          <a href="/" style="color: #60a5fa;">Return to Labour Connect Home</a>
        </body>
      </html>
    `);
  } else {
    res.status(404).json({
      success: false,
      message: `Route '${req.originalUrl}' not found.`
    });
  }
});

// Global Server Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "An internal server error occurred.",
    error: process.env.NODE_ENV === "production" ? undefined : err.message
  });
});

// ============================================================================
// Server Initialization
// ============================================================================

const server = app.listen(PORT, () => {
  console.log("============================================================");
  console.log("  Labour Connect — NodeJS Server-Side Validation Platform");
  console.log("============================================================");
  console.log(`  ✓ Server running on port: ${PORT}`);
  console.log(`  ✓ Web Interface:          http://localhost:${PORT}`);
  console.log(`  ✓ API Endpoint:           http://localhost:${PORT}/api/workers`);
  console.log(`  ✓ Health Check:           http://localhost:${PORT}/health`);
  console.log("============================================================");
});

module.exports = { app, server };
