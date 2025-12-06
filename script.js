// --- Configuration and State Variables ---

const START_DATE = new Date('2025-12-11T00:00:00'); 
const END_DATE = 25; 
const ADMIN_PASSWORD = 'nullandnoobius'; 

// Rewards Map (same)
const REWARDS = {
    11: '400 XP',
    12: '800 XP',
    13: '1000 XP',
    14: 'Frost Walker Role',
    15: 'Custom Emoji of your own',
    16: '900 XP',
    17: '300 XP',
    18: 'Custom sticker request',
    19: '1100 XP (A round amount)',
    20: 'WINTER GOLEM role',
    21: 'Dino Elf Role',
    22: '2000 XP',
    23: 'LOCKED',
    24: 'LOCKED',
    25: 'LOCKED'
};

// Local storage keys and initial state (same)
const LS_PREFIX = 'advent_calendar_';
const LS_CLAIMED_KEY = LS_PREFIX + 'claimed_dates';
const LS_LAST_CLAIM_KEY = LS_PREFIX + 'last_claim_timestamp';
const LS_LIVE_MODE_KEY = LS_PREFIX + 'live_mode';
const LS_SPECIAL_UNLOCK_KEY = LS_PREFIX + 'special_unlocked';

let claimedDates = JSON.parse(localStorage.getItem(LS_CLAIMED_KEY)) || [];
let lastClaimTimestamp = parseInt(localStorage.getItem(LS_LAST_CLAIM_KEY) || '0');
let isLiveModeOn = localStorage.getItem(LS_LIVE_MODE_KEY) === 'true';
let areSpecialDaysUnlocked = localStorage.getItem(LS_SPECIAL_UNLOCK_KEY) === 'true';

const serverDate = new Date(); 
let todayDay = serverDate.getDate(); 

// --- DOM Elements ---
const calendarGrid = document.getElementById('calendar-grid');
const countdownElement = document.getElementById('countdown');
const adminPanel = document.getElementById('admin-panel'); 
const liveStatusElement = document.getElementById('live-status');
const toggleLiveButton = document.getElementById('toggle-live-mode');
const unlockSpecialButton = document.getElementById('unlock-special-days');
const mysteryModal = document.getElementById('mystery-modal');
const rewardModal = document.getElementById('reward-modal');
const modalMessage = document.getElementById('modal-message');

// --- Admin Password Logic (same) ---
let passwordBuffer = ''; 
document.addEventListener('keydown', (e) => {
    // ... (Password logic remains the same)
});


// --- Utility Functions ---

function saveState() {
    localStorage.setItem(LS_CLAIMED_KEY, JSON.stringify(claimedDates));
    localStorage.setItem(LS_LAST_CLAIM_KEY, lastClaimTimestamp);
    localStorage.setItem(LS_LIVE_MODE_KEY, isLiveModeOn);
    localStorage.setItem(LS_SPECIAL_UNLOCK_KEY, areSpecialDaysUnlocked);
    updateAdminControls();
}

/**
 * Shows a modal with a message, using 'flex' display for centering.
 * @param {string} message The message to display.
 * @param {boolean} isMystery If true, shows the mystery modal.
 * @param {string} mysteryText Custom text for the mystery modal.
 */
function showModal(message, isMystery = false, mysteryText = null) {
    if (isMystery) {
        // Update mystery modal text if provided
        if (mysteryText) {
            document.querySelector('#mystery-modal .mystery-text').textContent = mysteryText;
            document.querySelector('#mystery-modal .modal-content p:last-child').style.display = 'none'; // Hide the default secondary text
        } else {
             document.querySelector('#mystery-modal .modal-content p:last-child').style.display = 'block'; // Show default secondary text
        }
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
    if (!isLiveModeOn) {
         showModal("🛑 **Event Inactive!** 🛑<br>The calendar is not yet live. Check back on Dec 11th.");
         return;
    }

    if (claimedDates.includes(day)) {
        // --- CUSTOM MESSAGE 1: Already redeemed ---
        showModal("🎁 **You already got this present, claim the next gift!** 🎉");
        return;
    }

    if (reward === 'LOCKED' && !areSpecialDaysUnlocked) {
        // --- CUSTOM MESSAGE 3: Mystery Door Clicked ---
        triggerSparkles(document.querySelector(`.door[data-day="${day}"]`));
        showModal('', true, "A mystery awaits.... find the key and it will be unlocked.... all of them.."); 
        return;
    }

    if (day > todayDay) {
        // --- CUSTOM MESSAGE 2: Not on that date yet ---
        showModal("🛑 **Whoa whoa slow down,**<br>you aren't ready to open this gift yet, **open the one you are currently on!**");
        return;
    }
    
    // Check 24-hour cooldown
    const now = Date.now();
    const cooldownDuration = 24 * 60 * 60 * 1000; 
    
    if (lastClaimTimestamp > 0 && (now - lastClaimTimestamp) < cooldownDuration) {
        const remainingTime = lastClaimTimestamp + cooldownDuration - now;
        const hours = Math.floor(remainingTime / (60 * 60 * 1000));
        const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
        
        showModal(`⏳ **Slow Down! Cooldown Active.** ⏳<br>You must wait 24 hours between claims.<br>Try again in ${hours}h ${minutes}m.`);
        return;
    }

    // SUCCESS: Claim the reward!
    claimedDates.push(day);
    lastClaimTimestamp = now;
    saveState();
    
    const doorElement = document.querySelector(`.door[data-day="${day}"]`);
    doorElement.classList.remove('unlocked');
    doorElement.classList.add('claimed');

    showModal(`🎉 **YOU UNLOCKED DAY ${day}!** 🎉<br>Your reward is: **${reward}**`);
}

// --- Snowfall and Sparkle Effects (same) ---
function createSnowflakes() {
    // ... (Same logic)
}
function triggerSparkles(targetElement) {
    // ... (Same logic)
}

// --- Main Calendar Functions (renderCalendar ensures all dates 11-25 are present) ---

function renderCalendar() {
    calendarGrid.innerHTML = ''; 
    
    let maxUnlockDay = serverDate >= START_DATE ? Math.min(todayDay, END_DATE) : 0;
    
    for (let day = 11; day <= END_DATE; day++) { // Ensure all dates from 11 to 25 are rendered
        const door = document.createElement('div');
        const reward = REWARDS[day] || 'Surprise!';
        let isClaimed = claimedDates.includes(day);
        
        door.classList.add('door');
        door.dataset.day = day;
        door.innerHTML = `<span class="door-day-number">${day}</span>`;

        let isUnlockable = isLiveModeOn && day <= maxUnlockDay;

        if (isClaimed) {
            door.classList.add('claimed');
            door.innerHTML += '<span>✅ Claimed</span>';
        } else if (day >= 23 && day <= 25) {
            door.classList.add('mystery');
            door.innerHTML += '<span style="font-size:0.8em;">Mystery</span>';
            if (areSpecialDaysUnlocked && isLiveModeOn) {
                isUnlockable = true;
                door.classList.remove('mystery');
                door.classList.add('unlocked');
            }
        } else if (isUnlockable) {
            door.classList.add('unlocked');
            door.innerHTML += '<span style="font-size:0.8em;">OPEN</span>';
        } else {
             door.innerHTML += '<span style="font-size:0.8em;">LOCKED</span>';
        }

        door.addEventListener('click', () => handleDoorClick(day, reward));

        calendarGrid.appendChild(door);
    }
}

// --- Countdown, Admin Panel Handlers, and Initialization (same) ---
const countdownInterval = setInterval(updateCountdown, 1000);

function updateCountdown() {
    // ... (Same logic)
}
function toggleLiveMode() {
    // ... (Same logic)
}
function updateAdminControls() {
    // ... (Same logic)
}
function unlockSpecialDays() {
    // ... (Same logic)
}

// Modal closing events
document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', () => {
        mysteryModal.style.display = 'none';
        rewardModal.style.display = 'none';
    });
});

window.addEventListener('click', (event) => {
    if (event.target == mysteryModal) {
        mysteryModal.style.display = 'none';
    }
    if (event.target == rewardModal) {
        rewardModal.style.display = 'none';
    }
});

toggleLiveButton.addEventListener('click', toggleLiveMode);
unlockSpecialButton.addEventListener('click', unlockSpecialDays);


function init() {
    createSnowflakes();
    updateCountdown();
    updateAdminControls();
    renderCalendar(); 
}

init();
