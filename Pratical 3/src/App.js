import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StatsSection from "./components/StatsSection";
import RegistrationForm from "./components/RegistrationForm";
import WorkerDirectory from "./components/WorkerDirectory";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import ToastNotification from "./components/ToastNotification";
import AboutSection from "./components/AboutSection";
import Footer from "./components/Footer";
import { initialWorkers } from "./data/initialWorkers";
import "./App.css";

const STORAGE_KEY = "labourConnectWorkers_v2";

export default function App() {
  // Initialize worker state with localStorage fallback to seed workers
  const [workers, setWorkers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return initialWorkers;
    } catch (err) {
      console.warn("Could not read from localStorage, using demo workers:", err);
      return initialWorkers;
    }
  });

  // Search, filter, and sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("all");
  const [sortBy, setSortBy] = useState("exp-desc");

  // Worker deletion confirmation modal state
  const [workerToDelete, setWorkerToDelete] = useState(null);

  // Global toast notification state
  const [toast, setToast] = useState(null);

  // Sync to localStorage whenever workers change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workers));
    } catch (err) {
      console.warn("Could not write to localStorage:", err);
    }
  }, [workers]);

  // Handler to register a new worker
  const handleAddWorker = (newWorker) => {
    setWorkers(prev => [newWorker, ...prev]);
    setToast({
      type: "success",
      title: "Worker Profile Added",
      message: `${newWorker.name} (${newWorker.skill}) has been registered and is now listed in the directory.`
    });
  };

  // Handler to request deletion (opens modal)
  const handleRequestDelete = (worker) => {
    setWorkerToDelete(worker);
  };

  // Handler to confirm deletion
  const handleConfirmDelete = (id, name) => {
    setWorkers(prev => prev.filter(w => w.id !== id));
    setWorkerToDelete(null);
    setToast({
      type: "danger",
      title: "Worker Profile Deleted",
      message: `The profile for "${name}" was permanently removed from the directory.`
    });
  };

  // Handler to cancel deletion
  const handleCancelDelete = () => {
    setWorkerToDelete(null);
  };

  // Quick skill filter selection (from Hero or Footer)
  const handleSelectSkillFilter = (skill) => {
    setSelectedSkill(skill);
    const directorySection = document.getElementById("workers");
    if (directorySection) {
      directorySection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notification Alert */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      {/* Delete Confirmation Modal */}
      {workerToDelete && (
        <DeleteConfirmModal
          worker={workerToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {/* Header and Navbar */}
      <Navbar workerCount={workers.length} />

      <main>
        {/* Hero Section */}
        <Hero onSelectSkillFilter={handleSelectSkillFilter} />

        {/* Live Metrics / Statistics Section */}
        <StatsSection workers={workers} />

        {/* Worker Registration Form */}
        <RegistrationForm onRegister={handleAddWorker} />

        {/* Worker Directory with Search, Filter & Sort */}
        <WorkerDirectory
          workers={workers}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedSkill={selectedSkill}
          setSelectedSkill={setSelectedSkill}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onRequestDelete={handleRequestDelete}
        />

        {/* About & Practical 3 Architecture Section */}
        <AboutSection />
      </main>

      {/* Footer */}
      <Footer onSelectSkillFilter={handleSelectSkillFilter} />
    </div>
  );
}
