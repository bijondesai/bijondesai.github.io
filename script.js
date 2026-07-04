// --- Encode/Decode ---
function encodeAnswer(answer) {
  return btoa(answer + '|genderreveal');
}

function decodeAnswer(hash) {
  try {
    const decoded = atob(hash);
    if (decoded.endsWith('|genderreveal')) return decoded.replace('|genderreveal', '');
  } catch (e) {}
  return null;
}

// --- Page Routing ---
const hash = window.location.hash.substring(1);
const hiddenAnswer = decodeAnswer(hash);

if (hiddenAnswer) {
  document.getElementById('guesser-page').classList.add('active');
  createParticles();
} else {
  document.getElementById('creator-page').classList.add('active');
}

// --- Floating Particles ---
function createParticles() {
  const container = document.getElementById('particles');
  const colors = ['#fbbf24', '#f472b6', '#60a5fa', '#a78bfa', '#34d399'];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.width = (4 + Math.random() * 8) + 'px';
    p.style.height = p.style.width;
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = Math.random() * 10 + 's';
    container.appendChild(p);
  }
}

// --- CREATOR MODE ---
let generatedLink = '';

function createReveal(gender) {
  const boys = document.querySelector('#creator-page .btn-boy');
  const girls = document.querySelector('#creator-page .btn-girl');
  if (gender === 'Boy') { boys.classList.add('selected'); girls.disabled = true; }
  else { girls.classList.add('selected'); boys.disabled = true; }

  const encoded = encodeAnswer(gender);
  const baseUrl = window.location.href.split('#')[0];
  generatedLink = baseUrl + '#' + encoded;

  document.getElementById('share-link').value = generatedLink;
  document.getElementById('share-section').style.display = 'block';
}

function copyLink() {
  navigator.clipboard.writeText(generatedLink).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  });
}

const shareText = "Can you guess the gender? Make your prediction here:";

function shareWhatsApp() {
  window.open('https://wa.me/?text=' + encodeURIComponent(shareText + ' ' + generatedLink), '_blank');
}
function shareFacebook() {
  window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(generatedLink) + '&quote=' + encodeURIComponent(shareText), '_blank');
}
function shareX() {
  window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText) + '&url=' + encodeURIComponent(generatedLink), '_blank');
}
function shareInstagram() {
  navigator.clipboard.writeText(generatedLink).then(() => {
    alert('Link copied! Paste it in your Instagram story or DM.');
  });
}

// --- GUESSER MODE ---
function makeGuess(choice) {
  const boyBtn = document.getElementById('btn-boy');
  const girlBtn = document.getElementById('btn-girl');
  if (choice === 'Boy') { boyBtn.classList.add('selected'); girlBtn.disabled = true; }
  else { girlBtn.classList.add('selected'); boyBtn.disabled = true; }
  boyBtn.onclick = null;
  girlBtn.onclick = null;

  document.getElementById('message').textContent = 'You picked ' + choice + '! Revealing in...';
  document.getElementById('timer').style.display = 'block';

  let seconds = 5;
  document.getElementById('timer').textContent = seconds;

  const countdown = setInterval(() => {
    seconds--;
    document.getElementById('timer').textContent = seconds;
    if (seconds <= 0) {
      clearInterval(countdown);
      document.getElementById('timer').style.display = 'none';
      document.getElementById('message').style.display = 'none';

      const answer = hiddenAnswer;
      const isCorrect = choice === answer;
      const color = answer === 'Boy' ? '#3b82f6' : '#ec4899';

      document.getElementById('reveal').style.display = 'block';
      document.getElementById('reveal').innerHTML =
        '<span class="answer-text" style="color:' + color + '">It\'s a ' + answer + '!</span><br>' +
        '<span style="font-size:1rem;color:' + (isCorrect ? '#22c55e' : '#ef4444') + ';margin-top:12px;display:block">' +
        (isCorrect ? 'You guessed right!' : 'Better luck next time!') + '</span>';

      launchConfetti(color);
    }
  }, 1000);
}

// --- CONFETTI ---
function launchConfetti(accentColor) {
  const container = document.getElementById('confetti');
  const colors = [accentColor, '#fbbf24', '#a78bfa', '#34d399', '#fb7185', '#60a5fa', '#f472b6', '#818cf8'];
  const shapes = ['circle', 'square', 'strip'];

  for (let i = 0; i < 100; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const size = 6 + Math.random() * 10;
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (2.5 + Math.random() * 2.5) + 's';
    piece.style.animationDelay = Math.random() * 1 + 's';

    if (shape === 'circle') {
      piece.style.width = size + 'px'; piece.style.height = size + 'px'; piece.style.borderRadius = '50%';
    } else if (shape === 'strip') {
      piece.style.width = (size * 0.4) + 'px'; piece.style.height = (size * 1.5) + 'px'; piece.style.borderRadius = '2px';
    } else {
      piece.style.width = size + 'px'; piece.style.height = size + 'px'; piece.style.borderRadius = '2px';
    }
    container.appendChild(piece);
  }

  // Second burst
  setTimeout(() => {
    for (let i = 0; i < 50; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const size = 5 + Math.random() * 8;
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = size + 'px'; piece.style.height = size + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.animationDuration = (2 + Math.random() * 2) + 's';
      piece.style.animationDelay = '0s';
      container.appendChild(piece);
    }
  }, 800);

  setTimeout(() => { container.innerHTML = ''; }, 6000);
}
