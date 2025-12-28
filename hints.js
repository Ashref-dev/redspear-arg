/**
 * hints.js - Subtle interaction hints for The Living Wired
 */

// Track mouse for proximity effects
let hintMouseX = 0;
let hintMouseY = 0;

document.addEventListener('mousemove', (e) => {
  hintMouseX = e.clientX;
  hintMouseY = e.clientY;

  // Check all hint targets
  document.querySelectorAll('.hint-target').forEach((target) => {
    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dist = Math.hypot(hintMouseX - centerX, hintMouseY - centerY);
    const maxDist = 200; // Pixel radius for effect

    if (dist < maxDist) {
      // Calculate intensity (0 to 1)
      const intensity = 1 - dist / maxDist;

      // Apply effect based on type
      if (target.classList.contains('glitch-hint')) {
        // Random translate/skew based on intensity
        const jitter = intensity * 5;
        target.style.transform = `translate(${
          (Math.random() - 0.5) * jitter
        }px, ${(Math.random() - 0.5) * jitter}px)`;
        target.style.color = Math.random() > 1 - intensity * 0.1 ? 'red' : '';
      }

      if (target.classList.contains('cursor-hint')) {
        // Affect global cursor
        const cursor = document.getElementById('cursor-dot');
        if (cursor) {
          cursor.style.transform = `scale(${1 + intensity * 2})`;
          cursor.style.background = 'white';
          cursor.style.mixBlendMode = 'difference';
        }
      }
    } else {
      // Reset styles if out of range
      target.style.transform = '';
      target.style.color = '';
      const cursor = document.getElementById('cursor-dot');
      if (cursor && target.classList.contains('cursor-hint')) {
        cursor.style.transform = '';
        cursor.style.background = '';
      }
    }
  });
});

// Add specific classes to targets dynamically if needed,
// or we can add them in HTML.
function registerHint(elementId, type = 'glitch-hint') {
  const el = document.getElementById(elementId);
  if (el) {
    el.classList.add('hint-target');
    el.classList.add(type);
    if (type === 'cursor-hint') el.classList.add('cursor-hint');
  }
}
