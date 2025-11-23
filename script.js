// Quotes Array (Spanish - Sincere & Sweet)
const quotes = [
    "Tu sonrisa ilumina mis mañanas más que el sol.",
    "Me encanta cómo brillan tus ojos cuando te ríes.",
    "Dos meses y ya eres mi pensamiento favorito.",
    "Gracias por cada risa y cada momento juntos.",
    "Eres la mejor parte de mi día, siempre.",
    "Admiro tu fuerza y tu dulzura, Yessica.",
    "Cada día contigo es un nuevo motivo para sonreír.",
    "Me haces querer ser mejor persona.",
    "Tu felicidad es mi prioridad.",
    "Contigo, todo es más bonito."
];

// DOM Elements
const body = document.body;
const quoteText = document.getElementById('quote-text');
const generateBtn = document.getElementById('generate-btn');
const musicBtn = document.getElementById('music-btn');
const musicIcon = musicBtn.querySelector('span');
const pupils = document.querySelectorAll('.pupil');
const greetingElement = document.getElementById('greeting');
const quoteHistoryContainer = document.getElementById('quote-history');

// State
let quoteHistory = [];
const MAX_HISTORY = 3;

// Time-Based Greeting
function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = "Hola";

    if (hour >= 5 && hour < 12) greeting = "Buenos días";
    else if (hour >= 12 && hour < 19) greeting = "Buenas tardes";
    else greeting = "Buenas noches";

    if (greetingElement) greetingElement.textContent = greeting;
}

// Quote Generator
generateBtn.addEventListener('click', (e) => {
    // Get random quote different from last one
    let newQuote;
    do {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        newQuote = quotes[randomIndex];
    } while (quoteHistory.length > 0 && newQuote === quoteHistory[0]);

    // Update UI
    quoteText.style.opacity = 0;
    setTimeout(() => {
        quoteText.textContent = `"${newQuote}"`;
        quoteText.style.opacity = 1;
    }, 300);

    // Update History
    addToHistory(newQuote);

    // Effects
    createHeartExplosion(e.clientX, e.clientY);
});

function addToHistory(quote) {
    quoteHistory.unshift(quote);
    if (quoteHistory.length > MAX_HISTORY) quoteHistory.pop();

    renderHistory();
}

function renderHistory() {
    quoteHistoryContainer.innerHTML = '';
    quoteHistory.forEach(q => {
        const div = document.createElement('div');
        div.classList.add('quote-history-item');
        div.textContent = q;
        quoteHistoryContainer.appendChild(div);
    });
}

// Heart Trail Effect
let lastHeartTime = 0;
document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastHeartTime > 100) { // Limit creation rate
        createFloatingHeart(e.clientX, e.clientY);
        lastHeartTime = now;
    }

    // Bear Tracking
    updateBearEyes(e.clientX, e.clientY);
});

document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    updateBearEyes(touch.clientX, touch.clientY);
});

document.addEventListener('click', (e) => {
    createFloatingHeart(e.clientX, e.clientY);
});

function createFloatingHeart(x, y) {
    const heart = document.createElement('div');
    heart.classList.add('heart-trail');
    heart.innerHTML = '❤️';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    // Random slight variation
    const randomScale = 0.5 + Math.random() * 0.5;
    heart.style.transform = `scale(${randomScale})`;

    document.body.appendChild(heart);

    // Cleanup
    setTimeout(() => {
        heart.remove();
    }, 1000);
}

function createHeartExplosion(x, y) {
    for (let i = 0; i < 12; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart-trail');
        heart.innerHTML = '❤️';
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;

        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        heart.animate([
            { transform: 'translate(-50%, -50%) scale(0.5)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).onfinish = () => heart.remove();

        document.body.appendChild(heart);
    }
}

// Teddy Bear Eye Tracking Logic
function updateBearEyes(mouseX, mouseY) {
    pupils.forEach(pupil => {
        const rect = pupil.getBoundingClientRect();
        const pupilX = rect.left + rect.width / 2;
        const pupilY = rect.top + rect.height / 2;

        const angle = Math.atan2(mouseY - pupilY, mouseX - pupilX);
        const distance = Math.min(6, Math.hypot(mouseX - pupilX, mouseY - pupilY) / 10);

        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        pupil.style.transform = `translate(${x}px, ${y}px)`;
    });
}

// Day/Night Theme Switcher
function updateTheme() {
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour >= 18;

    if (isNight) {
        body.classList.add('night-mode');
        generateStars();
    } else {
        body.classList.remove('night-mode');
    }

    updateGreeting(); // Also update greeting when checking theme
}

// Star Generator
function generateStars() {
    const starsContainer = document.querySelector('.stars');
    if (starsContainer.children.length > 0) return;

    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 3}px`;
        star.style.height = star.style.width;
        star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
        starsContainer.appendChild(star);
    }
}

// Audio Player Setup
const audioPlayer = document.getElementById('bg-music');
const soundOverlay = document.getElementById('sound-overlay');
const enableSoundBtn = document.getElementById('enable-sound-btn');
let isPlaying = false;

console.log('🎵 Audio player initialized:', audioPlayer);
console.log('🎵 Audio source:', audioPlayer?.src);
console.log('🎵 Audio muted:', audioPlayer?.muted);

// Try to play automatically (muted)
window.addEventListener('load', () => {
    console.log('🎵 Attempting autoplay (muted)...');
    audioPlayer.play().then(() => {
        console.log('✅ Autoplay successful (muted)');
        isPlaying = true;
        // Show sound overlay to let user enable sound
        if (soundOverlay) {
            soundOverlay.style.display = 'flex';
            console.log('🎵 Sound overlay displayed');
        }
    }).catch((error) => {
        console.error('❌ Autoplay failed:', error);
        isPlaying = false;
        // Still show overlay for manual play
        if (soundOverlay) {
            soundOverlay.style.display = 'flex';
        }
    });
});

// Handle "Enable Sound" click
if (enableSoundBtn) {
    enableSoundBtn.addEventListener('click', () => {
        console.log('🎵 User clicked "Enable Sound"');
        audioPlayer.muted = false;
        audioPlayer.volume = 0.5; // Start at 50% volume
        console.log('🎵 Audio unmuted, volume set to 0.5');
        audioPlayer.play().then(() => {
            console.log('✅ Audio playing with sound!');
            isPlaying = true;
            musicIcon.textContent = '🔊';
            // Fade out overlay
            soundOverlay.style.opacity = '0';
            setTimeout(() => {
                soundOverlay.style.display = 'none';
            }, 500);
        }).catch(e => {
            console.error("❌ Audio play failed:", e);
        });
    });
}

musicBtn.addEventListener('click', toggleMusic);

function toggleMusic() {
    console.log('🎵 Music button clicked. Current state:', isPlaying ? 'playing' : 'paused');
    if (!audioPlayer) {
        console.error('❌ Audio player not found!');
        return;
    }

    if (isPlaying) {
        console.log('🎵 Pausing audio...');
        audioPlayer.pause();
        if (musicIcon) musicIcon.textContent = '🔇';
        isPlaying = false;
    } else {
        console.log('🎵 Playing audio...');
        // Ensure audio is unmuted when user explicitly toggles sound on
        audioPlayer.muted = false;
        audioPlayer.volume = audioPlayer.volume || 0.5;
        console.log('🎵 Volume:', audioPlayer.volume, 'Muted:', audioPlayer.muted);
        audioPlayer.play().then(() => {
            console.log('✅ Audio playing');
            if (musicIcon) musicIcon.textContent = '🔊';
            isPlaying = true;
        }).catch(e => {
            console.error('❌ Play failed:', e);
        });
    }
}

// Initialize
updateTheme();
setInterval(updateTheme, 60000);

