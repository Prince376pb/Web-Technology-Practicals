/**
 * Labour Connect — Frontend Client Controller
 * Communicates with the NodeJS backend API, handles server-side validation responses,
 * updates the DOM, and manages interactive directory filtering.
 */

// Skill metadata dictionary for badges and icons
const SKILL_METADATA = {
  Plumber: {
    color: "#0284c7",
    bgColor: "#e0f2fe",
    borderColor: "#bae6fd",
    icon: "🔧"
  },
  Electrician: {
    color: "#d97706",
    bgColor: "#fef3c7",
    borderColor: "#fde68a",
    icon: "⚡"
  },
  Carpenter: {
    color: "#b45309",
    bgColor: "#ffedd5",
    borderColor: "#fed7aa",
    icon: "🪚"
  },
  Mechanic: {
    color: "#475569",
    bgColor: "#f1f5f9",
    borderColor: "#e2e8f0",
    icon: "🔩"
  },
  Painter: {
    color: "#7c3aed",
    bgColor: "#ede9fe",
    borderColor: "#ddd6fe",
    icon: "🎨"
  },
  "Appliance Repair": {
    color: "#059669",
    bgColor: "#d1fae5",
    borderColor: "#a7f3d0",
    icon: "🛠️"
  }
};

// Application State
const state = {
  workers: [],
  allWorkers: [],
  selectedSkill: "all",
  searchQuery: "",
  sortBy: "exp-desc",
  workerPendingDelete: null,
  toastTimeout: null
};

// DOM Element References
const elements = {
  // Navigation & Stats
  navWorkerCountText: document.getElementById("navWorkerCountText"),
  mobileMenuBtn: document.getElementById("mobileMenuBtn"),
  mobileDrawer: document.getElementById("mobileDrawer"),
  statTotalWorkers: document.getElementById("statTotalWorkers"),
  statAvailableSkills: document.getElementById("statAvailableSkills"),
  statAvgExperience: document.getElementById("statAvgExperience"),
  statLocations: document.getElementById("statLocations"),

  // Registration Form
  form: document.getElementById("workerRegistrationForm"),
  inputName: document.getElementById("name"),
  inputEmail: document.getElementById("email"),
  inputPhone: document.getElementById("phone"),
  inputSkill: document.getElementById("skill"),
  inputExperience: document.getElementById("experience"),
  inputLocation: document.getElementById("location"),
  submitBtn: document.getElementById("submitBtn"),
  submitBtnText: document.getElementById("submitBtnText"),
  submitBtnSpinner: document.getElementById("submitBtnSpinner"),
  resetBtn: document.getElementById("resetBtn"),
  formSuccessBanner: document.getElementById("formSuccessBanner"),
  formSuccessMessage: document.getElementById("formSuccessMessage"),
  formValidationSummary: document.getElementById("formValidationSummary"),

  // Directory Controls
  directorySearchInput: document.getElementById("directorySearchInput"),
  searchClearBtn: document.getElementById("searchClearBtn"),
  sortSelect: document.getElementById("sortSelect"),
  skillPillsContainer: document.getElementById("skillPillsContainer"),
  statusCounter: document.getElementById("statusCounter"),
  clearFiltersBtn: document.getElementById("clearFiltersBtn"),
  workerListGrid: document.getElementById("workerListGrid"),
  emptyStateCard: document.getElementById("emptyStateCard"),
  emptyStateTitle: document.getElementById("emptyStateTitle"),
  emptyStateText: document.getElementById("emptyStateText"),
  btnEmptyReset: document.getElementById("btnEmptyReset"),

  // Modal
  deleteModal: document.getElementById("deleteModal"),
  modalTitle: document.getElementById("modalTitle"),
  modalMessage: document.getElementById("modalMessage"),
  modalSummary: document.getElementById("modalSummary"),
  btnCancelDelete: document.getElementById("btnCancelDelete"),
  btnConfirmDelete: document.getElementById("btnConfirmDelete"),

  // Toast
  toast: document.getElementById("toastNotification"),
  toastIcon: document.getElementById("toastIcon"),
  toastTitle: document.getElementById("toastTitle"),
  toastMessage: document.getElementById("toastMessage"),
  toastCloseBtn: document.getElementById("toastCloseBtn")
};

// Field IDs list for validation mapping
const formFieldNames = ["name", "email", "phone", "skill", "experience", "location"];

// ============================================================================
// API Calls to NodeJS Backend
// ============================================================================

/**
 * Fetches workers from GET /api/workers with optional query parameters.
 */
async function fetchWorkers() {
  try {
    const params = new URLSearchParams();
    if (state.selectedSkill && state.selectedSkill !== "all") {
      params.append("skill", state.selectedSkill);
    }
    if (state.searchQuery.trim()) {
      params.append("search", state.searchQuery.trim());
    }
    if (state.sortBy) {
      params.append("sort", state.sortBy);
    }

    const response = await fetch(`/api/workers?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch workers: HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.success) {
      state.workers = data.workers || [];
      state.totalCount = data.total || 0;
      renderWorkerGrid();
      updateStatusCounter();
    }
  } catch (err) {
    console.error("Error loading workers:", err);
    showToast("Server Connection Error", "Could not load workers from the NodeJS server.", "danger");
  }
}

/**
 * Fetches dynamic platform statistics from GET /api/stats.
 */
async function fetchStats() {
  try {
    const response = await fetch("/api/stats");
    if (!response.ok) return;

    const data = await response.json();
    if (data.success && data.stats) {
      elements.statTotalWorkers.textContent = data.stats.totalWorkers;
      elements.statAvailableSkills.textContent = data.stats.availableSkills;
      elements.statAvgExperience.textContent = `${data.stats.avgExperience} yrs`;
      elements.statLocations.textContent = data.stats.uniqueLocations;

      // Update navbar count
      elements.navWorkerCountText.textContent = `${data.stats.totalWorkers} Workers Available`;

      // Update skill pill badges count
      updateSkillPillCounts();
    }
  } catch (err) {
    console.error("Error loading statistics:", err);
  }
}

/**
 * Fetches all workers without filters to keep pill counts accurate.
 */
async function fetchAllWorkersForCounts() {
  try {
    const response = await fetch("/api/workers");
    if (!response.ok) return;
    const data = await response.json();
    if (data.success) {
      state.allWorkers = data.workers || [];
      updateSkillPillCounts();
    }
  } catch (err) {
    console.error("Error fetching all workers:", err);
  }
}

/**
 * Sends a registration request to POST /api/workers.
 */
async function submitWorkerRegistration(payload) {
  setSubmittingState(true);
  clearValidationErrors();

  try {
    const response = await fetch("/api/workers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.status === 201 && data.success) {
      // 201 Created: Server-side validation succeeded!
      handleRegistrationSuccess(data);
    } else if (response.status === 400 && data.errors) {
      // 400 Bad Request: Server-side validation failed!
      handleValidationErrors(data.errors, data.message);
    } else {
      showToast("Registration Error", data.message || "Server rejected registration.", "danger");
    }
  } catch (err) {
    console.error("Registration request error:", err);
    showToast("Network Error", "Could not connect to the NodeJS backend.", "danger");
  } finally {
    setSubmittingState(false);
  }
}

/**
 * Sends a delete request to DELETE /api/workers/:id.
 */
async function deleteWorkerOnServer(workerId, workerName) {
  try {
    const response = await fetch(`/api/workers/${encodeURIComponent(workerId)}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showToast("Worker Profile Deleted", `Removed profile for "${workerName}".`, "danger");
      closeDeleteModal();
      refreshAll();
    } else {
      showToast("Deletion Error", data.message || "Failed to remove worker.", "danger");
    }
  } catch (err) {
    console.error("Error deleting worker:", err);
    showToast("Network Error", "Could not contact NodeJS server to delete worker.", "danger");
  }
}

// ============================================================================
// UI Handlers & Validation Display
// ============================================================================

/**
 * Maps server-side validation error messages onto the form fields.
 */
function handleValidationErrors(errors, serverMessage) {
  elements.formValidationSummary.textContent = serverMessage || "Server-side validation failed. Please check the errors below.";
  elements.formValidationSummary.classList.add("visible");
  elements.formSuccessBanner.classList.remove("visible");

  let firstErrorField = null;

  formFieldNames.forEach(field => {
    const errorEl = document.getElementById(`${field}-error`);
    const inputEl = document.getElementById(field);

    if (errors[field]) {
      if (!firstErrorField) firstErrorField = inputEl;

      if (errorEl) {
        errorEl.textContent = `⚠️ ${errors[field]}`;
        errorEl.classList.add("visible");
      }
      if (inputEl) {
        inputEl.classList.add("input-error");
        inputEl.classList.remove("input-valid");
      }
    } else {
      if (errorEl) {
        errorEl.textContent = "";
        errorEl.classList.remove("visible");
      }
      if (inputEl && inputEl.value.trim()) {
        inputEl.classList.remove("input-error");
        inputEl.classList.add("input-valid");
      }
    }
  });

  if (firstErrorField) {
    firstErrorField.focus();
  }

  showToast("Server Validation Failed", "The NodeJS server rejected one or more fields. Review the form.", "danger");
}

/**
 * Handles successful worker registration.
 */
function handleRegistrationSuccess(data) {
  elements.form.reset();
  clearValidationErrors();

  elements.formSuccessMessage.textContent = data.message;
  elements.formSuccessBanner.classList.add("visible");
  elements.formValidationSummary.classList.remove("visible");

  showToast(
    "Worker Profile Registered",
    `${data.worker.name} (${data.worker.skill}) has been validated on the server and added to the directory.`,
    "success"
  );

  refreshAll();
}

/**
 * Clears error displays and invalid highlights.
 */
function clearValidationErrors() {
  formFieldNames.forEach(field => {
    const errorEl = document.getElementById(`${field}-error`);
    const inputEl = document.getElementById(field);
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.classList.remove("visible");
    }
    if (inputEl) {
      inputEl.classList.remove("input-error");
    }
  });

  elements.formValidationSummary.classList.remove("visible");
}

/**
 * Toggles submitting button loading state.
 */
function setSubmittingState(isSubmitting) {
  elements.submitBtn.disabled = isSubmitting;
  elements.resetBtn.disabled = isSubmitting;

  if (isSubmitting) {
    elements.submitBtnText.textContent = "Validating on Server...";
    elements.submitBtnSpinner.style.display = "inline-block";
    elements.submitBtn.classList.add("btn-loading");
  } else {
    elements.submitBtnText.textContent = "Register Worker Profile";
    elements.submitBtnSpinner.style.display = "none";
    elements.submitBtn.classList.remove("btn-loading");
  }
}

// ============================================================================
// Directory Rendering
// ============================================================================

/**
 * Renders the worker cards grid or toggles the empty state.
 */
function renderWorkerGrid() {
  const container = elements.workerListGrid;
  const workers = state.workers;

  if (workers.length === 0) {
    container.innerHTML = "";
    elements.emptyStateCard.classList.add("visible");

    if (state.searchQuery || state.selectedSkill !== "all") {
      elements.emptyStateTitle.textContent = "No Workers Match Your Search Criteria";
      elements.emptyStateText.textContent = `We could not find any workers matching "${state.searchQuery || state.selectedSkill}". Try clearing filters.`;
      elements.btnEmptyReset.style.display = "inline-block";
    } else {
      elements.emptyStateTitle.textContent = "No Workers Registered Yet";
      elements.emptyStateText.textContent = "Get started by registering the first worker profile using the form above.";
      elements.btnEmptyReset.style.display = "none";
    }
    return;
  }

  elements.emptyStateCard.classList.remove("visible");

  const cardsHtml = workers.map(worker => {
    const meta = SKILL_METADATA[worker.skill] || {
      color: "#2563eb",
      bgColor: "#eff6ff",
      borderColor: "#bfdbfe",
      icon: "🔧"
    };

    const initials = (worker.name || "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join("") || "W";

    return `
      <article class="worker-card" aria-label="Worker profile for ${escapeHtml(worker.name)}">
        <div class="worker-card-header">
          <div class="worker-avatar" style="background: linear-gradient(135deg, ${meta.color}, #0f172a)">
            ${escapeHtml(initials)}
          </div>
          <div class="worker-meta">
            <h3 class="worker-name">${escapeHtml(worker.name)}</h3>
            <div class="worker-badges-row">
              <span class="skill-badge" style="color: ${meta.color}; background-color: ${meta.bgColor}; border-color: ${meta.borderColor};">
                <span class="badge-icon">${meta.icon}</span>
                ${escapeHtml(worker.skill)}
              </span>
              ${worker.isDemo ? '<span class="demo-badge">Demo</span>' : '<span class="server-badge">NodeJS Verified</span>'}
            </div>
          </div>
        </div>

        <div class="worker-card-body">
          <div class="worker-detail-row">
            <span class="detail-label">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              Experience
            </span>
            <span class="detail-value experience-value">
              ${Number(worker.experience)} ${Number(worker.experience) === 1 ? "year" : "years"}
            </span>
          </div>

          <div class="worker-detail-row">
            <span class="detail-label">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Location
            </span>
            <span class="detail-value location-value" title="${escapeHtml(worker.location)}">
              ${escapeHtml(worker.location)}
            </span>
          </div>

          <div class="worker-detail-row">
            <span class="detail-label">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Phone
            </span>
            <a href="tel:${escapeHtml(worker.phone)}" class="contact-link phone-link">
              +91 ${escapeHtml(worker.phone)}
            </a>
          </div>

          <div class="worker-detail-row">
            <span class="detail-label">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Email
            </span>
            <a href="mailto:${escapeHtml(worker.email)}" class="contact-link email-link" title="${escapeHtml(worker.email)}">
              ${escapeHtml(worker.email)}
            </a>
          </div>
        </div>

        <div class="worker-card-footer">
          <div class="quick-contact-actions">
            <a href="tel:${escapeHtml(worker.phone)}" class="card-action-btn btn-call" title="Call Worker">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Call
            </a>
            <a href="mailto:${escapeHtml(worker.email)}" class="card-action-btn btn-email" title="Send Email">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Email
            </a>
          </div>

          <button
            type="button"
            class="delete-card-btn"
            data-id="${escapeHtml(worker.id)}"
            data-name="${escapeHtml(worker.name)}"
            data-skill="${escapeHtml(worker.skill)}"
            data-phone="${escapeHtml(worker.phone)}"
            data-location="${escapeHtml(worker.location)}"
            data-experience="${escapeHtml(String(worker.experience))}"
            title="Delete profile"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Delete
          </button>
        </div>
      </article>
    `;
  }).join("");

  container.innerHTML = cardsHtml;

  // Attach delete buttons listeners
  container.querySelectorAll(".delete-card-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const worker = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        skill: btn.dataset.skill,
        phone: btn.dataset.phone,
        location: btn.dataset.location,
        experience: btn.dataset.experience
      };
      openDeleteModal(worker);
    });
  });
}

/**
 * Updates status bar with current count and active filter tags.
 */
function updateStatusCounter() {
  const showing = state.workers.length;
  const total = state.totalCount || 0;
  const hasFilters = state.searchQuery.trim() !== "" || state.selectedSkill !== "all";

  let tagsHtml = "";
  if (state.selectedSkill !== "all") {
    tagsHtml += `<span class="active-tag">Skill: ${escapeHtml(state.selectedSkill)}</span>`;
  }
  if (state.searchQuery.trim()) {
    tagsHtml += `<span class="active-tag">Keyword: "${escapeHtml(state.searchQuery)}"</span>`;
  }

  elements.statusCounter.innerHTML = `Showing <strong>${showing}</strong> of <strong>${total}</strong> registered workers ${tagsHtml}`;

  if (hasFilters) {
    elements.clearFiltersBtn.classList.add("visible");
  } else {
    elements.clearFiltersBtn.classList.remove("visible");
  }
}

/**
 * Updates the numbers on the skill filter pills.
 */
function updateSkillPillCounts() {
  const allList = state.allWorkers;
  const countAll = document.getElementById("count-all");
  if (countAll) countAll.textContent = allList.length;

  Object.keys(SKILL_METADATA).forEach(skill => {
    const el = document.getElementById(`count-${skill}`);
    if (el) {
      const count = allList.filter(w => w.skill === skill).length;
      el.textContent = count;
    }
  });
}

// ============================================================================
// Modal & Toast Controls
// ============================================================================

function openDeleteModal(worker) {
  state.workerPendingDelete = worker;
  elements.modalSummary.innerHTML = `
    <div><strong>Worker:</strong> ${escapeHtml(worker.name)} (${escapeHtml(worker.skill)})</div>
    <div><strong>Location:</strong> ${escapeHtml(worker.location)}</div>
    <div><strong>Experience:</strong> ${escapeHtml(worker.experience)} years</div>
    <div><strong>Phone:</strong> ${escapeHtml(worker.phone)}</div>
  `;
  elements.deleteModal.classList.add("open");
}

function closeDeleteModal() {
  state.workerPendingDelete = null;
  elements.deleteModal.classList.remove("open");
}

function showToast(title, message, type = "success") {
  if (state.toastTimeout) clearTimeout(state.toastTimeout);

  elements.toastTitle.textContent = title;
  elements.toastMessage.textContent = message;

  elements.toast.classList.remove("toast-success", "toast-danger");
  if (type === "danger") {
    elements.toast.classList.add("toast-danger");
    elements.toastIcon.textContent = "🗑️";
  } else {
    elements.toast.classList.add("toast-success");
    elements.toastIcon.textContent = "✅";
  }

  elements.toast.classList.add("visible");

  state.toastTimeout = setTimeout(() => {
    elements.toast.classList.remove("visible");
  }, 4500);
}

// ============================================================================
// Event Listeners Initialization
// ============================================================================

function setupEventListeners() {
  // 1. Form Submission (triggers server-side validation)
  elements.form.addEventListener("submit", e => {
    e.preventDefault();

    const payload = {
      name: elements.inputName.value,
      email: elements.inputEmail.value,
      phone: elements.inputPhone.value,
      skill: elements.inputSkill.value,
      experience: elements.inputExperience.value,
      location: elements.inputLocation.value
    };

    submitWorkerRegistration(payload);
  });

  // 2. Real-time error clearing when user edits an input
  formFieldNames.forEach(field => {
    const inputEl = document.getElementById(field);
    const errorEl = document.getElementById(`${field}-error`);
    if (inputEl) {
      inputEl.addEventListener("input", () => {
        if (inputEl.classList.contains("input-error")) {
          inputEl.classList.remove("input-error");
          if (errorEl) {
            errorEl.textContent = "";
            errorEl.classList.remove("visible");
          }
        }
        elements.formSuccessBanner.classList.remove("visible");
      });
    }
  });

  // 3. Form Reset Button
  elements.resetBtn.addEventListener("click", () => {
    elements.form.reset();
    clearValidationErrors();
    elements.formSuccessBanner.classList.remove("visible");
    showToast("Form Reset", "All input fields and error messages have been cleared.", "success");
  });

  // 4. Search Input & Clear Search Button
  let searchDebounce = null;
  elements.directorySearchInput.addEventListener("input", e => {
    const val = e.target.value;
    state.searchQuery = val;

    if (val.trim()) {
      elements.searchClearBtn.classList.add("visible");
    } else {
      elements.searchClearBtn.classList.remove("visible");
    }

    if (searchDebounce) clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      fetchWorkers();
    }, 250);
  });

  elements.searchClearBtn.addEventListener("click", () => {
    elements.directorySearchInput.value = "";
    state.searchQuery = "";
    elements.searchClearBtn.classList.remove("visible");
    fetchWorkers();
  });

  // 5. Sort Select
  elements.sortSelect.addEventListener("change", e => {
    state.sortBy = e.target.value;
    fetchWorkers();
  });

  // 6. Skill Filter Pills
  elements.skillPillsContainer.addEventListener("click", e => {
    const pill = e.target.closest(".filter-pill");
    if (!pill) return;

    elements.skillPillsContainer.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("pill-active"));
    pill.classList.add("pill-active");

    state.selectedSkill = pill.dataset.skill;
    fetchWorkers();
  });

  // 7. Clear All Filters Buttons
  const handleClearFilters = () => {
    state.searchQuery = "";
    state.selectedSkill = "all";
    state.sortBy = "exp-desc";

    elements.directorySearchInput.value = "";
    elements.searchClearBtn.classList.remove("visible");
    elements.sortSelect.value = "exp-desc";

    elements.skillPillsContainer.querySelectorAll(".filter-pill").forEach(p => {
      p.classList.toggle("pill-active", p.dataset.skill === "all");
    });

    fetchWorkers();
  };

  elements.clearFiltersBtn.addEventListener("click", handleClearFilters);
  elements.btnEmptyReset.addEventListener("click", handleClearFilters);

  // 8. Delete Modal Buttons
  elements.btnCancelDelete.addEventListener("click", closeDeleteModal);
  elements.deleteModal.addEventListener("click", e => {
    if (e.target === elements.deleteModal) closeDeleteModal();
  });

  elements.btnConfirmDelete.addEventListener("click", () => {
    if (state.workerPendingDelete) {
      deleteWorkerOnServer(state.workerPendingDelete.id, state.workerPendingDelete.name);
    }
  });

  window.addEventListener("keydown", e => {
    if (e.key === "Escape" && state.workerPendingDelete) {
      closeDeleteModal();
    }
  });

  // 9. Toast Close
  elements.toastCloseBtn.addEventListener("click", () => {
    elements.toast.classList.remove("visible");
  });

  // 10. Mobile Menu Drawer Toggle
  elements.mobileMenuBtn.addEventListener("click", () => {
    const isOpen = elements.mobileDrawer.classList.toggle("open");
    elements.mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  elements.mobileDrawer.querySelectorAll(".mobile-nav-link").forEach(link => {
    link.addEventListener("click", () => {
      elements.mobileDrawer.classList.remove("open");
      elements.mobileMenuBtn.setAttribute("aria-expanded", "false");
    });
  });

  // 11. Quick Category Chips (Hero & Footer)
  document.querySelectorAll(".skill-quick-chip, .footer-trade-link").forEach(chip => {
    chip.addEventListener("click", e => {
      const skill = chip.dataset.skill;
      if (!skill) return;

      state.selectedSkill = skill;
      elements.skillPillsContainer.querySelectorAll(".filter-pill").forEach(p => {
        p.classList.toggle("pill-active", p.dataset.skill === skill);
      });

      fetchWorkers();

      const workersSection = document.getElementById("workers");
      if (workersSection) {
        workersSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// Utility: HTML Escape for safe rendering
function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Refreshes data across directory, stats, and pill counts
function refreshAll() {
  fetchWorkers();
  fetchStats();
  fetchAllWorkersForCounts();
}

// Application Bootstrap
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  refreshAll();
});
