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

  document
