const LAMB_ASCII = `
              .---.
             /     \\
            | () () |
             \\  ^  /
              |||||
              |||||
         ...  |||||  ...
      .      \\|||||/      .
     /        |||||        \\
    |   |     |||||     |   |
    |   |     |||||     |   |
     \\  |     |||||     |  /
      ' .     |||||     . '
         '''  |||||  '''
              |||||
              |||||
              |||||
             /     \\
            /       \\
           /         \\
`;

const DISTORTED_FIGURE = `
     .--------.
    /          \\
   /            \\
  |    X    X    |
  |      --      |
   \\    ____    /
    '----------'
       /    \\
      /      \\
     /        \\
    /          \\
   /            \\
  /              \\
 /                \\
`;

function renderAscii(containerId, art) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.textContent = art;
}

function corruptText(element) {
  const original = element.textContent;
  const chars = '01!@#$%^&*()_+=-[]{};\':",./<>?|\\';

  setInterval(() => {
    if (Math.random() > 0.95) {
      const index = Math.floor(Math.random() * original.length);
      const char = chars[Math.floor(Math.random() * chars.length)];
      const arr = element.textContent.split('');
      arr[index] = char;
      element.textContent = arr.join('');

      setTimeout(() => {
        element.textContent = original;
      }, 100);
    }
  }, 50);
}

document.addEventListener('DOMContentLoaded', () => {
  // Check which page we are on
  const entryBtn = document.getElementById('entry-button');
  const mainContent = document.getElementById('main-content');
  const splash = document.getElementById('splash');

  if (entryBtn) {
    entryBtn.addEventListener('click', () => {
      splash.style.display = 'none';
      mainContent.style.display = 'flex';
      renderAscii('lamb-ascii', LAMB_ASCII);
      const glitchText = document.querySelector('.glitch');
      if (glitchText) corruptText(glitchText);
    });
  }

  // For safe.html
  const safeFigure = document.getElementById('safe-figure');
  if (safeFigure) {
    renderAscii('safe-figure', DISTORTED_FIGURE);
    corruptText(document.querySelector('.glitch'));
  }
});
