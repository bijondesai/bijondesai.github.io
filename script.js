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
