// Quotes Array (Spanish - Mix: Sweet, Inspirational, Motivational, Flirty, Spicy)
const quotes = [
    // Sweet romantic
    "Tu sonrisa ilumina mis mañanas más que el sol.",
    "Me encanta cómo brillan tus ojos cuando te ríes.",
    "Dos meses y ya eres mi pensamiento favorito.",
    "Gracias por cada risa y cada momento juntos.",
    "Eres la mejor parte de mi día, siempre.",
    "Cada día contigo es un nuevo motivo para sonreír.",
    "Contigo, todo es más bonito.",

    // Inspirational
    "Admiro tu fuerza y tu dulzura, Yessica.",
    "Eres prueba de que los sueños se hacen realidad.",
    "Tu energía positiva me inspira cada día.",

    // Motivational
    "Me haces querer ser mejor persona.",
    "Tu felicidad es mi prioridad y mi motivación.",
    "Juntos podemos con todo lo que venga.",

    // Cute flirty
    "Me encanta cuando me miras así.",
    "No puedo dejar de pensar en ti.",
    "Eres mi distracción favorita.",

    // Medium spicy
    "Eres mi debilidad favorita.",
    "Me vuelves loco de la mejor manera.",

    // Very spicy (classy)
    "Cada momento contigo es una tentación irresistible.",
    "Tu presencia me desarma completamente."
];

// DOM Elements
const body = document.body;
const quoteText = document.getElementById('quote-text');
const generateBtn = document.getElementById('generate-btn');
const shareBtn = document.getElementById('share-btn');
const musicBtn = document.getElementById('music-btn');
const musicIcon = musicBtn.querySelector('span');
const volumeControl = document.getElementById('volume-control');
const volumeSlider = document.getElementById('volume-slider');
const pupils = document.querySelectorAll('.pupil');
const greetingElement = document.getElementById('greeting');
const quoteHistoryContainer = document.getElementById('quote-history');
const dayCounterElement = document.getElementById('day-counter');
const bearContainer = document.querySelector('.bear-container');
const nightModeToggle = document.getElementById('night-mode-toggle');
const autoplayIndicator = document.getElementById('autoplay-indicator');

// State
let quoteHistory = [];
const MAX_HISTORY = 3;

// Start Date (September 21, 2025)
const START_DATE = new Date('2025-09-21');

// Time-Based Greeting
function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = "Hola";

    if (hour >= 5 && hour < 12) greeting = "Buenos días";
    else if (hour >= 12 && hour < 19) greeting = "Buenas tardes";
    else greeting = "Buenas noches";

    if (greetingElement) greetingElement.textContent = greeting;
}

// Day Counter
function updateDayCounter() {
    const today = new Date();
    const diffTime = Math.abs(today - START_DATE);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (dayCounterElement) {
        dayCounterElement.textContent = `✨ ${diffDays} días conociéndonos`;
    }
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

    // Effects - Handle both touch and click events
    let x, y;
    if (e.touches && e.touches[0]) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    } else {
        x = e.clientX || window.innerWidth / 2;
        y = e.clientY || window.innerHeight / 2;
    }
    createHeartExplosion(x, y);
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
    const now = Date.now();
    if (now - lastHeartTime > 100) {
        createFloatingHeart(touch.clientX, touch.clientY);
        lastHeartTime = now;
    }
    updateBearEyes(touch.clientX, touch.clientY);
});

document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    createFloatingHeart(touch.clientX, touch.clientY);
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
let isPlaying = false;

musicBtn.addEventListener('click', toggleMusic);

function toggleMusic() {
    // Toggle volume control visibility
    if (volumeControl.style.display === 'none' || !volumeControl.style.display) {
        volumeControl.style.display = 'block';
    } else {
        volumeControl.style.display = 'none';
    }

    // Toggle play/pause
    if (isPlaying) {
        audioPlayer.pause();
        musicIcon.textContent = '🔇';
    } else {
        audioPlayer.play().catch(e => console.log("Audio play failed:", e));
        musicIcon.textContent = '🔊';
    }
    isPlaying = !isPlaying;
}

// Smooth Scroll Animations
const cards = document.querySelectorAll('.card');
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

cards.forEach(card => cardObserver.observe(card));

// Share Quote Button
let currentQuote = '';

generateBtn.addEventListener('click', () => {
    if (quoteText.textContent !== '"Presiona el botón para una notita..."') {
        shareBtn.style.display = 'inline-block';
        currentQuote = quoteText.textContent;
    }
});

shareBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(currentQuote.replace(/^"|"$/g, ''));
        const originalText = shareBtn.textContent;
        shareBtn.textContent = '✓ ¡Copiado!';
        shareBtn.style.background = 'var(--accent-day)';
        shareBtn.style.color = 'white';
        setTimeout(() => {
            shareBtn.textContent = originalText;
            shareBtn.style.background = '';
            shareBtn.style.color = '';
        }, 2000);
    } catch (err) {
        console.log('Failed to copy:', err);
    }
});

// Bear Click Reaction
bearContainer.addEventListener('click', () => {
    bearContainer.classList.add('clicked');
    // Create heart burst
    for (let i = 0; i < 8; i++) {
        const rect = bearContainer.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        setTimeout(() => createFloatingHeart(x, y), i * 50);
    }
    setTimeout(() => {
        bearContainer.classList.remove('clicked');
    }, 600);
});

// Night Mode Toggle
let manualNightMode = null;

nightModeToggle.addEventListener('click', () => {
    const isNightMode = body.classList.contains('night-mode');

    if (isNightMode) {
        body.classList.remove('night-mode');
        nightModeToggle.textContent = '🌙';
        manualNightMode = false;
    } else {
        body.classList.add('night-mode');
        nightModeToggle.textContent = '☀️';
        generateStars();
        manualNightMode = true;
    }
});

// Volume Slider Control
volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    audioPlayer.volume = volume;

    // Update slider gradient
    const percent = e.target.value;
    e.target.style.background = `linear-gradient(to right, var(--accent-day) 0%, var(--accent-day) ${percent}%, #ddd ${percent}%, #ddd 100%)`;
});

// Simple Autoplay Logic
window.addEventListener('load', () => {
    // Try to play muted first
    audioPlayer.muted = true;
    audioPlayer.play().then(() => {
        console.log('Autoplay successful (muted)');
        // Show indicator to unmute
        autoplayIndicator.style.display = 'block';

        // Hide indicator when user clicks music button
        musicBtn.addEventListener('click', () => {
            audioPlayer.muted = false;
            audioPlayer.volume = 0.5;
            volumeSlider.value = 50;
            autoplayIndicator.style.display = 'none';
        }, { once: true });

    }).catch(() => {
        console.log('Autoplay blocked - showing indicator');
        autoplayIndicator.style.display = 'block';

        // Make indicator clickable
        autoplayIndicator.addEventListener('click', () => {
            audioPlayer.play().catch(e => console.log('Play failed:', e));
            audioPlayer.muted = false;
            audioPlayer.volume = 0.5;
            volumeSlider.value = 50;
            isPlaying = true;
            musicIcon.textContent = '🔊';
            autoplayIndicator.style.display = 'none';
        }, { once: true });
    });
});

// Update theme function to respect manual override
const originalUpdateTheme = updateTheme;
updateTheme = function() {
    if (manualNightMode === null) {
        originalUpdateTheme();
    }
    // If manual mode is set, don't auto-change
};

// Initialize
updateTheme();
updateDayCounter();
setInterval(updateTheme, 60000);
setInterval(updateDayCounter, 3600000); // Update every hour

