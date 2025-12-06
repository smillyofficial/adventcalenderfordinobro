// --- Configuration and State Variables ---

// The official start date and end date for the event (Dec 11th to Dec 25th)
const START_DATE = new Date('2025-12-11T00:00:00'); 
const END_DATE = 25; 
const ADMIN_PASSWORD = 'nullandnoobius'; // Secret password

// Rewards Map (same as before)
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

// Local storage keys and initial state (same as before)
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
const adminPanel = document.getElementById('admin-panel'); // Reference to the admin panel
const liveStatusElement = document.getElementById('live-status');
const toggleLiveButton = document.getElementById('toggle-live-mode');
const unlockSpecialButton = document.getElementById('unlock-special-days');
const mysteryModal = document.getElementById('mystery-modal');
const rewardModal = document.getElementById('reward-modal');
const modalMessage = document.getElementById('modal-message');

// --- Admin Password Logic ---
let passwordBuffer = ''; // Buffer to store typed keys

document.addEventListener('keydown', (e) => {
    // Append the last typed key (lowercase) to the buffer
    passwordBuffer += e.key.toLowerCase();
    
    // Check if the end of the buffer matches the password
    if (passwordBuffer.endsWith(ADMIN_PASSWORD)) {
        // Toggle visibility of the admin panel
        if (adminPanel.style.display === 'block') {
            adminPanel.style.display = 'none';
        } else {
            adminPanel.style.display = 'block';
        }
        
        // Reset the buffer after success
        passwordBuffer = '';
    } else if (passwordBuffer.length > ADMIN_PASSWORD.length) {
        // Keep the buffer length reasonable by truncating the start
        passwordBuffer = passwordBuffer.substring(passwordBuffer.length - ADMIN_PASSWORD.length);
    }
});


// --- Utility Functions (saveState, showModal, handleDoorClick - same logic as before) ---

function saveState() {
    localStorage.setItem(LS_CLAIMED_KEY, JSON.stringify(claimedDates));
    localStorage.setItem(LS_LAST_CLAIM_KEY, lastClaimTimestamp);
    localStorage.setItem(LS_LIVE_MODE_KEY, isLiveModeOn);
    localStorage.setItem(LS_SPECIAL_UNLOCK_KEY, areSpecialDaysUnlocked);
    updateAdminControls();
}

function showModal(message, isMystery = false) {
    if (isMystery) {
        mysteryModal.style.display = 'block';
    } else {
        modalMessage.innerHTML = message;
        rewardModal.style.display = 'block';
    }
}

function handleDoorClick(day, reward) {
    if (!isLiveModeOn) {
         showModal("🛑 **Event Inactive!** 🛑<br>The calendar is not yet live. Check back on Dec 11th.");
         return;
    }

    if (claimedDates.includes(day)) {
        showModal(`🎉 **Day ${day} Already Claimed!** 🎉<br>Reward: ${reward}`);
        return;
    }

    if (day > todayDay && !(day >= 23 && day <= 25 && areSpecialDaysUnlocked)) {
        showModal(`🚫 **Not Yet!** 🚫<br>Door ${day} will unlock on December ${day}.`);
        return;
    }

    if (reward === 'LOCKED' && !areSpecialDaysUnlocked) {
        triggerSparkles(document.querySelector(`.door[data-day="${day}"]`));
        showModal('', true); 
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

    showModal(`🎁 **CONGRATULATIONS!** 🎁<br>You unlocked Day ${day}.<br>Your reward is: **${reward}**`);
}


// --- Snowfall and Sparkle Effects ---

/**
 * Creates the snowflake falling effect in the background.
 */
function createSnowflakes() {
    const snowContainer = document.querySelector('.snowflakes');
    // Using simple snowflake emoji
    const snowflakeEmoji = ['❄️', '❅', '❆', '✨']; 
    const count = 50;

    for (let i = 0; i < count; i++) {
        const flake = document.createElement('span');
        flake.innerHTML = snowflakeEmoji[Math.floor(Math.random() * snowflakeEmoji.length)];
        flake.classList.add('flake');
        
        const size = Math.random() * 0.8 + 0.6; // Slightly larger for cartoon effect
        flake.style.fontSize = `${size}em`;
        flake.style.left = `${Math.random() * 100}vw`;
        flake.style.animationDuration = `${Math.random() * 8 + 12}s`; // 12-20s duration
        flake.style.animationDelay = `${Math.random() * 10}s`;
        flake.style.opacity = Math.random() * 0.4 + 0.5; // Fading
        
        snowContainer.appendChild(flake);
    }
}

function triggerSparkles(targetElement) {
    const sparkleEmojis = ['✨', '🌟', '💫'];
    const count = 5;

    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement('span');
        sparkle.innerHTML = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
        sparkle.classList.add('sparkle');
        
        const offsetX = (Math.random() - 0.5) * 100; 
        const offsetY = (Math.random() - 0.5) * 100;
        
        const rect = targetElement.getBoundingClientRect();
        
        // Use fixed positioning relative to viewport for the sparkles
        sparkle.style.position = 'fixed';
        sparkle.style.top = `${rect.top + rect.height / 2 + offsetY}px`;
        sparkle.style.left = `${rect.left + rect.width / 2 + offsetX}px`;
        
        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 1500);
    }
}


// --- Main Calendar Functions ---

/**
 * Generates and updates the calendar doors.
 */
function renderCalendar() {
    calendarGrid.innerHTML = ''; 
    
    // Determine the current unlockable day
    let maxUnlockDay = serverDate >= START_DATE ? Math.min(todayDay, END_DATE) : 0;
    
    for (let day = 11; day <= END_DATE; day++) {
        const door = document.createElement('div');
        const reward = REWARDS[day] || 'Surprise!';
        let isClaimed = claimedDates.includes(day);
        
        door.classList.add('door');
        door.dataset.day = day;
        door.innerHTML = `<span class="door-day-number">${day}</span>`;

        // Door status logic
        let isUnlockable = isLiveModeOn && day <= maxUnlockDay;

        if (isClaimed) {
            door.classList.add('claimed');
            door.innerHTML += '<span>✅ Claimed</span>';
        } else if (day >= 23 && day <= 25) {
            // Special Mystery Days
            door.classList.add('mystery');
            door.innerHTML += '<span style="font-size:0.8em;">Mystery</span>';
            // Unlock if admin has opened them
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

        // Add the click listener
        door.addEventListener('click', () => handleDoorClick(day, reward));

        calendarGrid.appendChild(door);
    }
}

/**
 * Updates the countdown timer until Dec 11th.
 */
function updateCountdown() {
    const now = Date.now();
    const distance = START_DATE.getTime() - now;

    if (distance <= 0) {
        // If the date is reached, check if live mode is ON
        if (isLiveModeOn) {
            countdownElement.textContent = "🎄 THE CALENDAR IS LIVE! 🎁";
            countdownElement.style.backgroundColor = 'var(--secondary-color)';
        } else {
            countdownElement.textContent = "⌛ OPENING SOON: Activate Live Mode! 🚀";
        }
        clearInterval(countdownInterval); 
        renderCalendar(); 
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElement.textContent = `Event Starts In: ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Start the countdown timer
const countdownInterval = setInterval(updateCountdown, 1000);


// --- Admin Panel Handlers (same logic as before) ---

function toggleLiveMode() {
    isLiveModeOn = !isLiveModeOn;
    saveState();
    updateCountdown(); // Update countdown text immediately
    renderCalendar(); 
}

function updateAdminControls() {
    liveStatusElement.textContent = isLiveModeOn ? 'ON' : 'OFF';
    liveStatusElement.style.color = isLiveModeOn ? 'var(--secondary-color)' : 'var(--primary-color)';

    unlockSpecialButton.disabled = !isLiveModeOn || areSpecialDaysUnlocked;
    if (areSpecialDaysUnlocked) {
        unlockSpecialButton.textContent = 'Mystery Days UNLOCKED 🔓';
        unlockSpecialButton.style.backgroundColor = 'var(--secondary-color)';
    } else {
        unlockSpecialButton.textContent = 'Unlock Mystery Days (23, 24, 25)';
        unlockSpecialButton.style.backgroundColor = 'var(--gold-color)';
    }
}

function unlockSpecialDays() {
    if (!isLiveModeOn || areSpecialDaysUnlocked) return;
    
    areSpecialDaysUnlocked = true;
    saveState();
    renderCalendar();
    alert("Days 23, 24, 25 have been globally unlocked! Refresh the page to see the new status if needed.");
}


// --- Event Listeners and Initialization ---

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

// Admin panel listeners
toggleLiveButton.addEventListener('click', toggleLiveMode);
unlockSpecialButton.addEventListener('click', unlockSpecialDays);


/**
 * Main function to initialize the application.
 */
function init() {
    createSnowflakes();
    updateCountdown();
    updateAdminControls();
    // Render the calendar to show all doors immediately
    renderCalendar(); 
}

// Run the initialization
init();
