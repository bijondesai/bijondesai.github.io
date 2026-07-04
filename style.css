// --- Firebase Config ---
var FIREBASE_DB_URL = 'https://gender-guessing-default-rtdb.firebaseio.com';

// --- Encode/Decode ---
function encodeAnswer(answer) {
  return btoa(answer + '|genderreveal');
}

function decodeAnswer(hash) {
  try {
    var decoded = atob(hash);
    if (decoded.endsWith('|genderreveal')) return decoded.replace('|genderreveal', '');
  } catch (e) {}
  return null;
}

// --- Test & Stats Mode ---
var urlParams = new URLSearchParams(window.location.search);
var isTestMode = urlParams.has('test');
var isStatsMode = urlParams.has('stats');

// --- Page Routing ---
var hash = window.location.hash.substring(1);
var hiddenAnswer = decodeAnswer(hash);

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
  var key = guess.toLowerCase();
  try {
    var res = await fetch(FIREBASE_DB_URL + '/votes/' + key + '.json');
    var current = await res.json() || 0;
    await fetch(FIREBASE_DB_URL + '/votes/' + key + '.json', {
      method: 'PUT',
      body: JSON.stringify(current + 1)
    });
  } catch (e) {
    console.log('Vote recording failed:', e);
  }
}

async function getVotes() {
  try {
    var res = await fetch(FIREBASE_DB_URL + '/votes.json');
    var data = await res.json();
    return { boy: data && data.boy ? data.boy : 0, girl: data && data.girl ? data.girl : 0 };
  } catch (e) {
    return { boy: 0, girl: 0 };
  }
}

// --- Stats Page (secret) ---
async function showStatsPage() {
  var card = document.querySelector('.card');
  var votes = await getVotes();
  var total = votes.boy + votes.girl;
  var boyPct = total ? (votes.boy / total * 100) : 50;
  var girlPct = total ? (votes.girl / total * 100) : 50;

  card.innerHTML =
    '<h1 style="margin-bottom: 24px;">Vote Stats</h1>' +
    '<p class="subtitle">Secret stats page \u2014 only you know this exists!</p>' +
    '<div style="margin: 24px 0;">' +
      '<div style="display: flex; justify-content: space-between; margin-bottom: 12px;">' +
        '<span style="font-weight: 600; color: #3b82f6;">Boy: ' + votes.boy + '</span>' +
        '<span style="font-weight: 600; color: #ec4899;">Girl: ' + votes.girl + '</span>' +
      '</div>' +
      '<div style="height: 32px; background: #e5e7eb; border-radius: 16px; overflow: hidden; display: flex;">' +
        '<div style="width: ' + boyPct + '%; background: #60a5fa; transition: width 0.5s;"></div>' +
        '<div style="width: ' + girlPct + '%; background: #f472b6; transition: width 0.5s;"></div>' +
      '</div>' +
      '<p style="margin-top: 12px; color: #888; font-size: 0.9rem;">Total guesses: ' + total + '</p>' +
    '</div>' +
    '<div style="margin-top: 24px;">' +
      '<button class="btn" onclick="resetVotes()" style="background: #ef4444; color: white; padding: 12px 24px; font-size: 0.9rem;">Reset All Votes</button>' +
    '</div>' +
    '<p class="creator-note" style="margin-top: 16px;">Access this page anytime at ?stats</p>';
}

async function resetVotes() {
  if (confirm('Are you sure? This will reset all vote counts to 0.')) {
    await fetch(FIREBASE_DB_URL + '/votes.json', {
      method: 'PUT',
      body: JSON.stringify({ boy: 0, girl: 0 })
    });
    showStatsPage();
  }
}

// --- Floating Particles ---
function createParticles() {
  var container = document.getElementById('particles');
  var colors = ['#fbbf24', '#f472b6', '#60a5fa', '#a78bfa', '#34d399'];
  for (var i = 0; i < 20; i++) {
    var p = document.createElement('div');
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
var generatedLink = '';

function createReveal(gender) {
  var boys = document.querySelector('#creator-page .btn-boy');
  var girls = document.querySelector('#creator-page .btn-girl');
  if (gender === 'Boy') { boys.classList.add('selected'); girls.disabled = true; }
  else { girls.classList.add('selected'); boys.disabled = true; }

  var encoded = encodeAnswer(gender);
  var baseUrl = window.location.href.split('?')[0].split('#')[0];
  generatedLink = baseUrl + '#' + encoded;

  document.getElementById('share-link').value = generatedLink;
  document.getElementById('share-section').style.display = 'block';
}

function copyLink() {
  navigator.clipboard.writeText(generatedLink).then(function() {
    var btn = document.getElementById('copy-btn');
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(function() { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  });
}

var shareText = "Can you guess Baby Desai\'s gender? Make your prediction here:";

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
  navigator.clipboard.writeText(generatedLink).then(function() {
    alert('Link copied! Paste it in your Instagram story or DM.');
  });
}

// --- GUESSER MODE ---
function makeGuess(choice) {
  var boyBtn = document.getElementById('btn-boy');
  var girlBtn = document.getElementById('btn-girl');
  if (choice === 'Boy') { boyBtn.classList.add('selected'); girlBtn.disabled = true; }
  else { girlBtn.classList.add('selected'); boyBtn.disabled = true; }
  boyBtn.onclick = null;
  girlBtn.onclick = null;

  recordVote(choice);

  document.getElementById('message').textContent = 'You picked ' + choice + '! Revealing in...';
  document.getElementById('timer').style.display = 'block';

  launchPreRevealConfetti();

  var seconds = 5;
  document.getElementById('timer').textContent = seconds;

  var countdown = setInterval(async function() {
    seconds--;
    document.getElementById('timer').textContent = seconds;
    if (seconds <= 0) {
      clearInterval(countdown);
      document.getElementById('timer').style.display = 'none';
      document.getElementById('message').style.display = 'none';

      var answer = hiddenAnswer;
      var isCorrect = choice === answer;
      var answerClass = answer === 'Boy' ? '' : 'girl-answer';

      document.getElementById('guesser-emoji').textContent = answer === 'Boy' ? '\uD83D\uDC66' : '\uD83D\uDC67';

      var votes = await getVotes();
      var sameGuessCount = choice.toLowerCase() === 'boy' ? votes.boy : votes.girl;
      var othersCount = Math.max(0, sameGuessCount - 1);

      var funMessage = '';
      if (isCorrect) {
        if (othersCount === 0) funMessage = "You are the first to crack it! \uD83C\uDFC6";
        else funMessage = "Great minds think alike \u2014 " + othersCount + " other" + (othersCount === 1 ? '' : 's') + " got it too! \uD83C\uDF89";
      } else {
        if (othersCount === 0) funMessage = "First one to get tricked \u2014 brave pioneer! \uD83D\uDE04";
        else funMessage = "Don\'t worry, " + othersCount + " other" + (othersCount === 1 ? '' : 's') + " fell for it too! \uD83D\uDE04";
      }

      document.getElementById('reveal').style.display = 'block';
      document.getElementById('reveal').innerHTML =
        '<span class="answer-text ' + answerClass + '">It\'s a ' + answer + '!</span><br>' +
        '<span style="font-size:0.9rem;color:#666;margin-top:14px;display:block;font-weight:400;">' + funMessage + '</span>';

      launchRevealConfetti(answer === 'Boy' ? '#3b82f6' : '#ec4899');
    }
  }, 1000);
}

// --- PRE-REVEAL CONFETTI (equal blue + pink, gentle firecracker) ---
function launchPreRevealConfetti() {
  var cContainer = document.getElementById('confetti');
  var blueShades = ['#60a5fa', '#3b82f6', '#93c5fd'];
  var pinkShades = ['#f472b6', '#ec4899', '#f9a8d4'];

  var cx = window.innerWidth / 2;
  var cy = window.innerHeight / 2;

  for (var i = 0; i < 40; i++) {
    var isBlue = i % 2 === 0;
    var piece = document.createElement('div');
    piece.className = 'confetti-piece';
    var size = 5 + Math.random() * 8;
    var shades = isBlue ? blueShades : pinkShades;
    piece.style.background = shades[Math.floor(Math.random() * shades.length)];
    piece.style.width = size + 'px';
    piece.style.height = size + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.left = cx + 'px';
    piece.style.top = cy + 'px';

    var angle = Math.random() * 360;
    var distance = 150 + Math.random() * 250;
    var tx = Math.cos(angle * Math.PI / 180) * distance;
    var ty = Math.sin(angle * Math.PI / 180) * distance;
    var duration = 1.5 + Math.random() * 2;
    var rotation = 360 + Math.random() * 360;

    piece.animate([
      { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1 },
      { transform: 'translate(' + tx + 'px, ' + ty + 'px) rotate(' + rotation + 'deg) scale(0.3)', opacity: 0 }
    ], {
      duration: duration * 1000,
      easing: 'cubic-bezier(0, 0.5, 0.5, 1)',
      delay: Math.random() * 2000,
      fill: 'forwards'
    });

    cContainer.appendChild(piece);
  }

  setTimeout(function() { cContainer.innerHTML = ''; }, 5000);
}

// --- REVEAL CONFETTI (firecracker burst from behind card) ---
function launchRevealConfetti(accentColor) {
  var cContainer = document.getElementById('confetti');
  cContainer.innerHTML = '';

  var isBlue = accentColor === '#3b82f6';
  var mainColors = isBlue
    ? ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#2563eb']
    : ['#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8', '#db2777'];
  var extraColors = ['#fbbf24', '#a78bfa', '#34d399'];
  var allColors = mainColors.concat(mainColors).concat(extraColors);

  var cx = window.innerWidth / 2;
  var cy = window.innerHeight / 2;

  // First burst - big explosion
  for (var i = 0; i < 80; i++) {
    var piece = document.createElement('div');
    piece.className = 'confetti-piece';
    var size = 6 + Math.random() * 12;
    piece.style.background = allColors[Math.floor(Math.random() * allColors.length)];
    piece.style.width = size + 'px';
    piece.style.height = Math.random() > 0.3 ? size + 'px' : (size * 0.4) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.left = cx + 'px';
    piece.style.top = cy + 'px';

    var angle = Math.random() * 360;
    var distance = 200 + Math.random() * 400;
    var tx = Math.cos(angle * Math.PI / 180) * distance;
    var ty = Math.sin(angle * Math.PI / 180) * distance + (Math.random() * 100);
    var duration = 2 + Math.random() * 1.5;
    var rotation = 720 + Math.random() * 360;

    piece.animate([
      { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1 },
      { transform: 'translate(' + tx + 'px, ' + ty + 'px) rotate(' + rotation + 'deg) scale(0.2)', opacity: 0 }
    ], {
      duration: duration * 1000,
      easing: 'cubic-bezier(0.15, 0.8, 0.3, 1)',
      delay: Math.random() * 300,
      fill: 'forwards'
    });

    cContainer.appendChild(piece);
  }

  // Second burst - delayed smaller pop
  setTimeout(function() {
    for (var i = 0; i < 50; i++) {
      var piece = document.createElement('div');
      piece.className = 'confetti-piece';
      var size = 4 + Math.random() * 8;
      piece.style.background = allColors[Math.floor(Math.random() * allColors.length)];
      piece.style.width = size + 'px';
      piece.style.height = size + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.left = cx + 'px';
      piece.style.top = cy + 'px';

      var angle = Math.random() * 360;
      var distance = 100 + Math.random() * 300;
      var tx = Math.cos(angle * Math.PI / 180) * distance;
      var ty = Math.sin(angle * Math.PI / 180) * distance + 50;
      var duration = 1.5 + Math.random() * 1.5;
      var rotation = 360 + Math.random() * 360;

      piece.animate([
        { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1 },
        { transform: 'translate(' + tx + 'px, ' + ty + 'px) rotate(' + rotation + 'deg) scale(0.1)', opacity: 0 }
      ], {
        duration: duration * 1000,
        easing: 'cubic-bezier(0.15, 0.8, 0.3, 1)',
        fill: 'forwards'
      });

      cContainer.appendChild(piece);
    }
  }, 500);

  setTimeout(function() { cContainer.innerHTML = ''; }, 5000);
}
