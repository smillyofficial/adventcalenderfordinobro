// --- Configuration and State Variables ---

// (Configuration, Rewards, and Local Storage Variables remain the same)
const START_DATE = new Date('2025-12-11T00:00:00'); 
const END_DATE = 25; 
const ADMIN_PASSWORD = 'nullandnoobius'; 
// ... (All other configs and initializations remain the same)

// --- DOM Elements ---
const calendarGrid = document.getElementById('calendar-grid');
const countdownElement = document.getElementById('countdown');
const adminPanel = document.getElementById('admin-panel'); 
// ... (All other DOM references remain the same)


// --- Admin Password Logic (Remains the same) ---
let passwordBuffer = ''; 
document.addEventListener('keydown', (e) => {
    // ... (Password logic remains the same)
});


// --- Utility Functions ---

function saveState() {
    // ... (Same logic)
}

/**
 * Shows a modal with a message, using 'flex' display for centering.
 * @param {string} message The message to display.
 * @param {boolean} isMystery If true, shows the mystery modal.
 */
function showModal(message, isMystery = false) {
    if (isMystery) {
        mysteryModal.style.display = 'flex'; // Use flex to center
    } else {
        modalMessage.innerHTML = message;
        rewardModal.style.display = 'flex'; // Use flex to center
    }
}

/**
 * Handles the click event on a calendar door.
 */
function handleDoorClick(day, reward) {
    // ... (All logic for checking live mode, claimed status, future days, cooldown remains the same)
    
    // ... (If claimed, locked, or cooldown active, call showModal)
    
    // SUCCESS: Claim the reward!
    // ... (Update state and door visuals)
    
    showModal(`🎁 **CONGRATULATIONS!** 🎁<br>You unlocked Day ${day}.<br>Your reward is: **${reward}**`);
}

// --- Snowfall and Sparkle Effects (Remain the same) ---
function createSnowflakes() {
    // ... (Same logic)
}
function triggerSparkles(targetElement) {
    // ... (Same logic)
}

// --- Main Calendar Functions (Remain the same) ---
function renderCalendar() {
    // ... (Same logic)
}
function updateCountdown() {
    // ... (Same logic)
}

// Start the countdown timer
const countdownInterval = setInterval(updateCountdown, 1000);

// --- Admin Panel Handlers (Remain the same) ---
function toggleLiveMode() {
    // ... (Same logic)
}
function updateAdminControls() {
    // ... (Same logic)
}
function unlockSpecialDays() {
    // ... (Same logic)
}


// --- Event Listeners and Initialization ---

// Modal closing events
document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', () => {
        // Set both back to none
        mysteryModal.style.display = 'none';
        rewardModal.style.display = 'none';
    });
});

window.addEventListener('click', (event) => {
    // Ensure clicking outside the modal closes it
    if (event.target == mysteryModal) {
        mysteryModal.style.display = 'none';
    }
    if (event.target == rewardModal) {
        rewardModal.style.display = 'none';
    }
});

// Admin panel listeners
toggleLiveButton.addEventListener('click', toggleLiveMode);
unlockSpecialButton.addEventListener('click', unlockSpecialDays);


function init() {
    createSnowflakes();
    updateCountdown();
    updateAdminControls();
    renderCalendar(); 
}

// Run the initialization
init();
