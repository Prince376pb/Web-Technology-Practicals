/**
 * Worker Routes Module
 * Demonstrates NodeJS modular routing architecture.
 */

const express = require("express");
const router = express.Router();
const workerController = require("../controllers/workerController");

// Route: GET /api/workers - Retrieve workers list (supports query params: ?search, ?skill, ?sort)
router.get("/workers", workerController.getWorkers);

// Route: GET /api/stats - Retrieve dynamic platform metrics
router.get("/stats", workerController.getStats);

// Route: POST /api/workers - Register worker with server-side validation
router.post("/workers", workerController.createWorker);

// Route: DELETE /api/workers/:id - Remove worker profile
router.delete("/workers/:id", workerController.deleteWorker);

// Route: POST /api/reset - Reset records to default demonstration data
router.post("/reset", workerController.resetWorkers);

module.exports = router;
