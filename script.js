// --- Firebase Config ---
const FIREBASE_DB_URL = 'https://gender-guessing-default-rtdb.firebaseio.com';

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

// --- Test & Stats Mode ---
const urlParams = new URLSearchParams(window.location.search);
const isTestMode = urlParams.has('test');
const isStatsMode = urlParams.has('stats');

// --- Page Routing ---
const hash = window.location.hash.substring(1);
const hiddenAnswer = decodeAnswer(hash);

if (isStatsMode) {
  showStatsPage();
} else if (hiddenAnswer) {
  document.getElementById('guesser-page').classList.add('active');
  createParticles();
} else {
  document.getElementById('creator-page').classList.add('active');
}

// --- Firebase Helpers ---
async function recordVote(guess) {
  if (isTestMode) return;
  const key = guess.toLowerCase();
  try {
    const res = await fetch(`${FIREBASE_DB_URL}/votes/${key}.json`);
    const current = await res.json() || 0;
    await fetch(`${FIREBASE_DB_URL}/votes/${key}.json`, {
      method: 'PUT',
      body: JSON.stringify(current + 1)
    });
  } catch (e) {
    console.log('Vote recording failed:', e);
  }
}

async function getVotes() {
  try {
    const res = await fetch(`${FIREBASE_DB_URL}/votes.json`);
    const data = await res.json();
    return { boy: data?.boy || 0, girl: data?.girl || 0 };
  } catch (e) {
    return { boy: 0, girl: 0 };
  }
}

// --- Stats Page (secret) ---
async function showStatsPage() {
  const card = document.querySelector('.card');
  const votes = await getVotes();
  const total = votes.boy + votes.girl;

  card.innerHTML = `
    <h1 style="margin-bottom: 24px;">Vote Stats</h1>
    <p class="subtitle">Secret stats page — only you know this exists!</p>
    <div style="margin: 24px 0; position: relative; z-index: 1;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
        <span style="font-weight: 600; color: #3b82f6;">Boy: ${votes.boy}</span>
        <span style="font-weight: 600; color: #ec4899;">Girl: ${votes.girl}</span>
      </div>
      <div style="height: 32px; background: #e5e7eb; border-radius: 16px; overflow: hidden; display: flex;">
        <div style="width: ${total ? (votes.boy / total * 100) : 50}%; background: #60a5fa; transition: width 0.5s;"></div>
        <div style="width: ${total ? (votes.girl / total * 100) : 50}%; background: #f472b6; transition: width 0.5s;"></div>
      </div>
      <p style="margin-top: 12px; color: #888; font-size: 0.9rem;">Total guesses: ${total}</p>
    </div>
    <div style="margin-top: 24px; position: relative; z-index: 1;">
      <button class="btn" onclick="resetVotes()" style="background: #ef4444; color: white; padding: 12px 24px; font-size: 0.9rem;">Reset All Votes</button>
    </div>
    <p class="creator-note" style="margin-top: 16px;">Access this page anytime at ?stats</p>
  `;
}

async function resetVotes() {
  if (confirm('Are you sure? This will reset all vote counts to 0.')) {
    await fetch(`${FIREBASE_DB_URL}/votes.json`, {
      method: 'PUT',
      body: JSON.stringify({ boy: 0, girl: 0 })
    });
    showStatsPage();
  }
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
  const baseUrl = window.location.href.split('?')[0].split('#')[0];
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

const shareText = "Can you guess Baby Desai's gender? Make your prediction here:";

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

  // Record vote
  recordVote(choice);

  document.getElementById('message').textContent = 'You picked ' + choice + '! Revealing in...';
  document.getElementById('timer').style.display = 'block';

  // Pre-reveal confetti: equal blue and pink
  launchPreRevealConfetti();

  let seconds = 5;
  document.getElementById('timer').textContent = seconds;

  const countdown = setInterval(async () => {
    seconds--;
    document.getElementById('timer').textContent = seconds;
    if (seconds <= 0) {
      clearInterval(countdown);
      document.getElementById('timer').style.display = 'none';
      document.getElementById('message').style.display = 'none';

      const answer = hiddenAnswer;
      const isCorrect = choice === answer;
      const answerClass = answer === 'Boy' ? '' : 'girl-answer';

      // Change emoji to match answer
      document.getElementById('guesser-emoji').textContent = answer === 'Boy' ? '👦' : '👧';

      // Get vote counts
      const votes = await getVotes();
      const sameGuessCount = choice.toLowerCase() === 'boy' ? votes.boy : votes.girl;
      const othersCount = Math.max(0, sameGuessCount - 1);

      let funMessage = '';
      if (isCorrect) {
        if (othersCount === 0) funMessage = "You're the first to crack it! 🏆";
        else funMessage = "Great minds think alike — " + othersCount + " other" + (othersCount === 1 ? '' : 's') + " got it too! 🎉";
      } else {
        if (othersCount === 0) funMessage = "First one to get tricked — brave pioneer! 😄";
        else funMessage = "Don't worry, " + othersCount + " other" + (othersCount === 1 ? '' : 's') + " fell for it too! 😄";
      }

      document.getElementById('reveal').style.display = 'block';
      document.getElementById('reveal').innerHTML =
        '<span class="answer-text ' + answerClass + '">It\'s a ' + answer + '!</span><br>' +
        '<span style="font-size:0.9rem;color:#666;margin-top:14px;display:block;font-weight:400;">' + funMessage + '</span>';

      // Post-reveal: heavy confetti in the answer's color
      launchRevealConfetti(answer === 'Boy' ? '#3b82f6' : '#ec4899');
    }
  }, 1000);
}

// --- PRE-REVEAL CONFETTI (equal blue + pink) ---
function launchPreRevealConfetti() {
  const cContainer = document.getElementById('confetti');
  const blueShades = ['#60a5fa', '#3b82f6', '#93c5fd'];
  const pinkShades = ['#f472b6', '#ec4899', '#f9a8d4'];

  for (let i = 0; i < 30; i++) {
    const blue = document.createElement('div');
    blue.className = 'confetti-piece';
    const size1 = 5 + Math.random() * 8;
    blue.style.left = Math.random() * 100 + '%';
    blue.style.background = blueShades[Math.floor(Math.random() * blueShades.length)];
    blue.style.width = size1 + 'px'; blue.style.height = size1 + 'px';
    blue.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    blue.style.animationDuration = (3 + Math.random() * 3) + 's';
    blue.style.animationDelay = Math.random() * 4 + 's';
    cContainer.appendChild(blue);

    const pink = document.createElement('div');
    pink.className = 'confetti-piece';
    const size2 = 5 + Math.random() * 8;
    pink.style.left = Math.random() * 100 + '%';
    pink.style.background = pinkShades[Math.floor(Math.random() * pinkShades.length)];
    pink.style.width = size2 + 'px'; pink.style.height = size2 + 'px';
    pink.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    pink.style.animationDuration = (3 + Math.random() * 3) + 's';
    pink.style.animationDelay = Math.random() * 4 + 's';
    cContainer.appendChild(pink);
  }
}

// --- REVEAL CONFETTI (heavy answer color, top-down only) ---
function launchRevealConfetti(accentColor) {
  const cContainer = document.getElementById('confetti');
  cContainer.innerHTML = '';

  const isBlue = accentColor === '#3b82f6';
  const mainColors = isBlue
    ? ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#2563eb']
    : ['#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8', '#db2777'];
  const accentColors = ['#fbbf24', '#a78bfa', '#34d399'];
  const allColors = [...mainColors, ...mainColors, ...accentColors];

  for (let i = 0; i < 100; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const size = 5 + Math.random() * 10;
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = allColors[Math.floor(Math.random() * allColors.length)];
    piece.style.animationDuration = (2.5 + Math.random() * 2.5) + 's';
    piece.style.animationDelay = Math.random() * 1 + 's';
    piece.style.borderRadius = Math.random() > 0.4 ? '50%' : '2px';
    piece.style.width = size + 'px'; piece.style.height = size + 'px';
    cContainer.appendChild(piece);
  }

  // Second wave
  setTimeout(() => {
    for (let i = 0; i < 50; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const size = 5 + Math.random() * 8;
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = allColors[Math.floor(Math.random() * allColors.length)];
      piece.style.width = size + 'px'; piece.style.height = size + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.animationDuration = (2 + Math.random() * 2) + 's';
      piece.style.animationDelay = '0s';
      cContainer.appendChild(piece);
    }
  }, 800);

  setTimeout(() => { cContainer.innerHTML = ''; }, 7000);
}
