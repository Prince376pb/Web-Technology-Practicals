let workers = [];

const workerForm = document.getElementById("workerForm");
const workerList = document.getElementById("workerList");

workerForm.addEventListener("submit", function(event) {
    event.preventDefault();

    clearErrors();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const skill = document.getElementById("skill").value;
    const experience = document.getElementById("experience").value.trim();
    const location = document.getElementById("location").value.trim();

    let isValid = true;

    if (name.length < 3) {
        document.getElementById("nameError").textContent = "Please enter a valid name.";
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        document.getElementById("emailError").textContent = "Please enter a valid email.";
        isValid = false;
    }

    const phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(phone)) {
        document.getElementById("phoneError").textContent = "Phone number must contain 10 digits.";
        isValid = false;
    }

    if (skill === "") {
        document.getElementById("skillError").textContent = "Please select a skill.";
        isValid = false;
    }

    if (experience === "" || Number(experience) < 0 || Number(experience) > 50) {
        document.getElementById("experienceError").textContent = "Enter experience between 0 and 50 years.";
        isValid = false;
    }

    if (location.length < 2) {
        document.getElementById("locationError").textContent = "Please enter your location.";
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const worker = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        skill: skill,
        experience: Number(experience),
        location: location
    };

    workers.push(worker);

    const workerJSON = JSON.stringify(workers);
    console.log(workerJSON);

    displayWorkers();

    workerForm.reset();

    document.getElementById("successMessage").textContent = "Worker registered successfully.";

    setTimeout(function() {
        document.getElementById("successMessage").textContent = "";
    }, 3000);
});

function clearErrors() {
    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("phoneError").textContent = "";
    document.getElementById("skillError").textContent = "";
    document.getElementById("experienceError").textContent = "";
    document.getElementById("locationError").textContent = "";
}

function displayWorkers() {
    workerList.innerHTML = "";

    if (workers.length === 0) {
        workerList.innerHTML = '<p class="empty-message">No workers registered yet.</p>';
        return;
    }

    workers.forEach(function(worker, index) {
        const card = document.createElement("div");

        card.className = "worker-card";

        card.innerHTML = `
            <h3>${worker.name}</h3>
            <p><strong>Email:</strong> ${worker.email}</p>
            <p><strong>Phone:</strong> ${worker.phone}</p>
            <p><strong>Skill:</strong> ${worker.skill}</p>
            <p><strong>Experience:</strong> ${worker.experience} years</p>
            <p><strong>Location:</strong> ${worker.location}</p>
            <button class="delete-btn" onclick="deleteWorker(${index})">Delete</button>
        `;

        workerList.appendChild(card);
    });
}

function deleteWorker(index) {
    workers.splice(index, 1);
    displayWorkers();
}
