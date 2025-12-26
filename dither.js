const bayerMap = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

// Mouse tracking
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Custom cursor
  const cursor = document.getElementById('cursor-dot');
  if (cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  }
});

// Living Wired Script - Chaotic behaviors
function startLivingWired() {
  // Create random text popups
  setInterval(() => {
    if (Math.random() > 0.9) {
      const el = document.createElement('div');
      el.className = 'chaos-text';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.top = Math.random() * 100 + 'vh';
      el.innerText =
        Math.random() > 0.5
          ? '0x' + Math.floor(Math.random() * 1000).toString(16)
          : '...';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2000);
    }
  }, 500);

  // Audio hum simulation (visual only unless we add audio file)
  // Maybe screenshake on specific events
}

function applyBayerDither(imageData, thresholdMap, intensity = 1.0) {
  const data = imageData.data;
  const w = imageData.width;
  const h = imageData.height;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const index = (y * w + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      let gray = (r + g + b) / 3;

      // Contrast stretch
      gray = (gray - 128) * 1.5 + 128;

      // Noise
      gray += (Math.random() - 0.5) * 50 * intensity;

      const mapValue = thresholdMap[y % 4][x % 4];
      const threshold = (mapValue + 0.5) * 16;

      // 1-bit Red/Black
      if (gray > threshold) {
        data[index] = 255;
        data[index + 1] = 0;
        data[index + 2] = 0;
        data[index + 3] = 255;
      } else {
        data[index] = 0;
        data[index + 1] = 0;
        data[index + 2] = 0;
        data[index + 3] = 255; // Opaque black
      }
    }
  }
}

function renderCanvasLoop(canvasId, drawFn) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  function loop() {
    drawFn(ctx, canvas.width, canvas.height);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    applyBayerDither(imgData, bayerMap);
    ctx.putImageData(imgData, 0, 0);
    requestAnimationFrame(loop);
  }
  loop();
}
