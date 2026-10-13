/**
 * Worker Data Model & File Persistence
 * Demonstrates NodeJS filesystem (fs) module and data handling.
 */

const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data", "workers.json");
const INITIAL_FILE = path.join(__dirname, "..", "data", "initialWorkers.json");

/**
 * Reads all workers from the persistent JSON file.
 * Falls back to initialWorkers.json if missing or corrupted.
 */
function readWorkers() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error("Error reading workers.json, resetting to initial demo data:", err.message);
  }

  // Fallback to initial seed workers
  try {
    if (fs.existsSync(INITIAL_FILE)) {
      const content = fs.readFileSync(INITIAL_FILE, "utf-8");
      const parsed = JSON.parse(content);
      saveWorkers(parsed);
      return parsed;
    }
  } catch (err) {
    console.error("Error reading initialWorkers.json:", err.message);
  }

  return [];
}

/**
 * Saves workers array to data/workers.json.
 */
function saveWorkers(workers) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(workers, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error saving to workers.json:", err.message);
    return false;
  }
}

/**
 * Retrieves all workers with optional search, skill filtering, and sorting.
 */
function getAllWorkers(query = {}) {
  let list = readWorkers();

  // Filter by skill
  if (query.skill && query.skill !== "all") {
    list = list.filter(
      w => (w.skill || "").toLowerCase() === query.skill.toLowerCase()
    );
  }

  // Filter by search query (name, skill, or location)
  if (query.search && query.search.trim()) {
    const term = query.search.toLowerCase().trim();
    list = list.filter(w => {
      const nameMatch = (w.name || "").toLowerCase().includes(term);
      const skillMatch = (w.skill || "").toLowerCase().includes(term);
      const locMatch = (w.location || "").toLowerCase().includes(term);
      return nameMatch || skillMatch || locMatch;
    });
  }

  // Sort
  if (query.sort) {
    list.sort((a, b) => {
      if (query.sort === "exp-desc") {
        return (Number(b.experience) || 0) - (Number(a.experience) || 0);
      }
      if (query.sort === "exp-asc") {
        return (Number(a.experience) || 0) - (Number(b.experience) || 0);
      }
      if (query.sort === "name-asc") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (query.sort === "name-desc") {
        return (b.name || "").localeCompare(a.name || "");
      }
      if (query.sort === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      return 0;
    });
  }

  return list;
}

/**
 * Finds a single worker by ID.
 */
function getWorkerById(id) {
  const workers = readWorkers();
  return workers.find(w => w.id === id) || null;
}

/**
 * Adds a new worker after server-side validation.
 */
function addWorker(sanitizedData) {
  const workers = readWorkers();

  const newWorker = {
    id: `worker-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: sanitizedData.name,
    email: sanitizedData.email,
    phone: sanitizedData.phone,
    skill: sanitizedData.skill,
    experience: Number(sanitizedData.experience),
    location: sanitizedData.location,
    createdAt: new Date().toISOString(),
    isDemo: false
  };

  // Prepend new worker
  workers.unshift(newWorker);
  saveWorkers(workers);

  return newWorker;
}

/**
 * Deletes a worker by ID.
 */
function deleteWorker(id) {
  const workers = readWorkers();
  const index = workers.findIndex(w => w.id === id);

  if (index === -1) {
    return { success: false, message: "Worker not found on server." };
  }

  const removed = workers.splice(index, 1)[0];
  saveWorkers(workers);

  return { success: true, removedWorker: removed };
}

/**
 * Calculates live server-side statistics.
 */
function getStatistics() {
  const workers = readWorkers();
  const total = workers.length;

  const uniqueSkills = new Set(workers.map(w => w.skill).filter(Boolean)).size;
  const totalExp = workers.reduce((sum, w) => sum + (Number(w.experience) || 0), 0);
  const avgExp = total > 0 ? (totalExp / total).toFixed(1) : "0.0";
  const uniqueLocations = new Set(
    workers.map(w => (w.location || "").trim().toLowerCase()).filter(Boolean)
  ).size;

  return {
    totalWorkers: total,
    availableSkills: uniqueSkills,
    avgExperience: avgExp,
    uniqueLocations: uniqueLocations
  };
}

/**
 * Resets data to initial demo workers.
 */
function resetToDemo() {
  if (fs.existsSync(INITIAL_FILE)) {
    const content = fs.readFileSync(INITIAL_FILE, "utf-8");
    const parsed = JSON.parse(content);
    saveWorkers(parsed);
    return parsed;
  }
  return [];
}

module.exports = {
  getAllWorkers,
  getWorkerById,
  addWorker,
  deleteWorker,
  getStatistics,
  resetToDemo
};
