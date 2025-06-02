let mediaRecorder;
let recordedChunks = [];
let timer;
let seconds = 0;
let selectedTime = 1; // Default fake call time (1 min)

// Ensure script runs after DOM loads
document.addEventListener("DOMContentLoaded", function () {
    // UI Elements
    const recordBtn = document.getElementById("recordBtn");
    const playBtn = document.getElementById("playBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const stopBtn = document.getElementById("stopBtn");
    const timerDisplay = document.getElementById("timer");

    if (recordBtn) {
        // Start Recording
        recordBtn.addEventListener("click", async () => {
            recordedChunks = []; // Clear old recordings
            let stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            recordBtn.textContent = "🔴 Recording...";
            recordBtn.disabled = true;

            playBtn.classList.add("hidden");
            pauseBtn.classList.remove("hidden");
            stopBtn.classList.remove("hidden");

            mediaRecorder.ondataavailable = (event) => {
                recordedChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                let blob = new Blob(recordedChunks, { type: "audio/webm" });
                let url = URL.createObjectURL(blob);
                let audio = new Audio(url);
                audio.controls = true;
                document.body.appendChild(audio);
            };

            startTimer();
        });

        // Pause Recording
        pauseBtn.addEventListener("click", () => {
            if (mediaRecorder.state === "recording") {
                mediaRecorder.pause();
                pauseBtn.textContent = "▶️ Resume";
            } else {
                mediaRecorder.resume();
                pauseBtn.textContent = "⏸ Pause";
            }
        });

        // Stop Recording
        stopBtn.addEventListener("click", () => {
            mediaRecorder.stop();
            recordBtn.textContent = "🎤 Record";
            recordBtn.disabled = false;

            pauseBtn.classList.add("hidden");
            stopBtn.classList.add("hidden");
            playBtn.classList.remove("hidden");

            stopTimer();
        });
    }

    // Load Fake Call Details if on ss-fakecall.html
    if (window.location.pathname.includes("ss-fakecall.html")) {
        loadFakeCall();
    }
});

// Start Timer
function startTimer() {
    const timerDisplay = document.getElementById("timer");
    if (!timerDisplay) return; // Prevent errors if timer doesn't exist on the page

    timer = setInterval(() => {
        seconds++;
        timerDisplay.textContent = formatTime(seconds);
    }, 1000);
}

// Stop Timer
function stopTimer() {
    clearInterval(timer);
    seconds = 0;
}

// Format Time (MM:SS)
function formatTime(sec) {
    let min = Math.floor(sec / 60);
    let secRemain = sec % 60;
    return `${String(min).padStart(2, "0")}:${String(secRemain).padStart(2, "0")}`;
}

// Navigate to another page
function navigateTo(page) {
    window.location.href = page;
}

// Set time for fake call
function setTime(minutes) {
    selectedTime = minutes;
    console.log(`Selected time: ${selectedTime} minutes`);
}

// Save fake call details & navigate to ss-fakecall.html
function saveFakeCall() {
    const name = document.getElementById("callerName").value.trim();
    const number = document.getElementById("callerNumber").value.trim();

    if (!name || !number) {
        alert("Please enter a valid name and number!");
        return;
    }

    // Store in localStorage
    const callData = { name, number, time: selectedTime };
    localStorage.setItem("fakeCall", JSON.stringify(callData));

    console.log("Fake call saved:", callData);

    // Redirect to fake call page
    navigateTo("ss-fakecall.html");
}

// Load and start fake call
function loadFakeCall() {
    const fakeCall = JSON.parse(localStorage.getItem("fakeCall"));
    
    if (fakeCall) {
        const nameEl = document.getElementById("caller-name");
        const numberEl = document.getElementById("caller-number");
        const timerEl = document.getElementById("call-timer");

        if (nameEl) nameEl.innerText = fakeCall.name;
        if (numberEl) numberEl.innerText = "Mobile " + fakeCall.number;

        console.log("Fake call loaded:", fakeCall);

        let seconds = 0;
        let callTimer = setInterval(() => {
            seconds++;
            if (timerEl) timerEl.innerText = formatTime(seconds);

            if (seconds >= fakeCall.time * 60) {
                clearInterval(callTimer);
                endFakeCall();
            }
        }, 1000);
    } else {
        console.error("No fake call data found.");
    }
}

// End fake call & return
function endFakeCall() {
    alert("Fake call ended!");
    navigateTo("fake-call.html");
}

function goBack() {
    window.location.href = "index.html"; // Change this to the page you want
}

function goBackFakeCall() {
    window.location.href = "fake-call.html"; // Change this to the page you want
}

// Function to navigate between pages
function navigate(page) {
    window.location.href = page;
}

// Function to load the Tamil Nadu map
function loadMap() {
    // Check if map container exists
    if (!document.getElementById("map")) {
        console.error("Map container not found!");
        return;
    }

    // Initialize Leaflet map centered on Tamil Nadu
    var map = L.map('map').setView([11.1271, 78.6569], 7);

    // Load map tiles from OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Safe Area - Coimbatore
    L.circle([11.0168, 76.9558], {
        color: 'green',
        fillColor: '#0f0',
        fillOpacity: 0.5,
        radius: 10000
    }).addTo(map).bindPopup("✅ Safe Zone - Coimbatore");

    // Danger Area - Chennai
    L.circle([13.0827, 80.2707], {
        color: 'red',
        fillColor: '#f00',
        fillOpacity: 0.5,
        radius: 15000
    }).addTo(map).bindPopup("⚠ Danger Zone - Chennai");

    // Safe Area - Madurai
    L.circle([9.9252, 78.1198], {
        color: 'blue',
        fillColor: '#00f',
        fillOpacity: 0.5,
        radius: 12000
    }).addTo(map).bindPopup("✅ Safe Zone - Madurai");

    // Danger Area - Salem
    L.circle([11.6643, 78.1460], {
        color: 'orange',
        fillColor: '#f90',
        fillOpacity: 0.5,
        radius: 13000
    }).addTo(map).bindPopup("⚠ Danger Zone - Salem");

    console.log("Map loaded successfully!");
}

// Call loadMap when the page loads
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("map")) {
        loadMap();
    }
});



