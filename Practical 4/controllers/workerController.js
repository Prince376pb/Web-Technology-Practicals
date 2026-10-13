/**
 * Worker Controller
 * Demonstrates NodeJS request/response handling, routing logic,
 * HTTP status codes, and server-side validation integration.
 */

const { validateWorker } = require("../validators/workerValidator");
const workerModel = require("../models/workerModel");

/**
 * GET /api/workers
 * Retrieves all registered workers with optional search, skill filter, and sorting.
 */
function getWorkers(req, res) {
  try {
    const { search, skill, sort } = req.query;
    const workers = workerModel.getAllWorkers({ search, skill, sort });
    const allWorkers = workerModel.getAllWorkers();

    res.status(200).json({
      success: true,
      count: workers.length,
      total: allWorkers.length,
      workers: workers
    });
  } catch (err) {
    console.error("Error in getWorkers:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching workers."
    });
  }
}

/**
 * GET /api/stats
 * Retrieves dynamically computed platform metrics.
 */
function getStats(req, res) {
  try {
    const stats = workerModel.getStatistics();
    res.status(200).json({
      success: true,
      stats: stats
    });
  } catch (err) {
    console.error("Error in getStats:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error while computing metrics."
    });
  }
}

/**
 * POST /api/workers or POST /register
 * Performs server-side validation and creates a new worker profile.
 */
function createWorker(req, res) {
  try {
    const rawData = req.body;

    // Execute server-side validation
    const validationResult = validateWorker(rawData);

    // If server-side validation fails, return HTTP 400 Bad Request with field-specific errors
    if (!validationResult.isValid) {
      return res.status(400).json({
        success: false,
        message: "Server-side validation failed. Please review the errors below.",
        errors: validationResult.errors,
        received: {
          name: rawData.name || "",
          email: rawData.email || "",
          phone: rawData.phone || "",
          skill: rawData.skill || "",
          experience: rawData.experience || "",
          location: rawData.location || ""
        }
      });
    }

    // Validation passed: create and persist worker on server
    const createdWorker = workerModel.addWorker(validationResult.sanitized);

    // Return HTTP 201 Created with success response
    return res.status(201).json({
      success: true,
      message: `Worker profile for "${createdWorker.name}" was successfully registered and validated on the server!`,
      worker: createdWorker
    });
  } catch (err) {
    console.error("Error in createWorker:", err);
    return res.status(500).json({
      success: false,
      message: "An unexpected server error occurred during registration."
    });
  }
}

/**
 * DELETE /api/workers/:id
 * Removes a worker record on the server.
 */
function deleteWorker(req, res) {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Worker ID parameter is required for deletion."
      });
    }

    const result = workerModel.deleteWorker(id);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message
      });
    }

    return res.status(200).json({
      success: true,
      message: `Worker profile for "${result.removedWorker.name}" was permanently removed from the server.`,
      removedWorker: result.removedWorker
    });
  } catch (err) {
    console.error("Error in deleteWorker:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting worker profile."
    });
  }
}

/**
 * POST /api/reset
 * Resets worker directory to initial demo data.
 */
function resetWorkers(req, res) {
  try {
    const resetList = workerModel.resetToDemo();
    return res.status(200).json({
      success: true,
      message: "Directory successfully reset to initial demonstration records.",
      count: resetList.length
    });
  } catch (err) {
    console.error("Error in resetWorkers:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while resetting records."
    });
  }
}

module.exports = {
  getWorkers,
  getStats,
  createWorker,
  deleteWorker,
  resetWorkers
};
