const eventDate = new Date('2026-08-01T00:00:00');

function updateCountdown() {
  const now = new Date();
  const diff = eventDate - now;

  if (diff <= 0) {
    document.getElementById('countdown').innerHTML = '<div class="event-live">¡El gran día llegó!</div>';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

function coinBurst(x, y) {
  for (let i = 0; i < 18; i++) {
    const coin = document.createElement('div');
    coin.className = 'coin-burst';
    coin.textContent = '●';
    coin.style.left = `${x}px`;
    coin.style.top = `${y}px`;
    coin.style.setProperty('--x', `${Math.random() * 240 - 120}px`);
    coin.style.setProperty('--y', `${Math.random() * 240 - 120}px`);
    document.body.appendChild(coin);
    setTimeout(() => coin.remove(), 900);
  }
}

document.addEventListener('click', (event) => {
  if (event.target.closest('.btn')) coinBurst(event.clientX, event.clientY);
});

const form = document.getElementById('rsvpForm');
const success = document.getElementById('successMessage');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = {
    nombre: document.getElementById('guestName').value,
    asistentes: document.getElementById('guestCount').value,
    asistencia: document.getElementById('attendance').value,
    restricciones: document.getElementById('food').value,
    comentarios: document.getElementById('comments').value,
    fechaRegistro: new Date().toISOString()
  };

  const confirmations = JSON.parse(localStorage.getItem('confirmacionesDario') || '[]');
  confirmations.push(data);
  localStorage.setItem('confirmacionesDario', JSON.stringify(confirmations));

  success.style.display = 'block';
  coinBurst(window.innerWidth / 2, window.innerHeight / 2);
  form.reset();
});

const musicBtn = document.getElementById('musicBtn');
let audioContext;
let musicEnabled = false;
let intervalId;

function playRetroTone(freq, duration) {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'square';
  oscillator.frequency.value = freq;
  gain.gain.value = 0.035;
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

musicBtn.addEventListener('click', () => {
  musicEnabled = !musicEnabled;
  musicBtn.textContent = musicEnabled ? '♫' : '♪';
  if (musicEnabled) {
    const notes = [523, 659, 784, 659];
    let i = 0;
    intervalId = setInterval(() => {
      playRetroTone(notes[i % notes.length], 0.12);
      i++;
    }, 430);
  } else {
    clearInterval(intervalId);
  }
});
