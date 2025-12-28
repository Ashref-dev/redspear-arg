/**
 * audio.js - Procedural Horror Audio Engine
 * Uses Web Audio API to generate binaural drones and reacting static.
 */

let audioCtx;
let masterGain;
let droneOsc1, droneOsc2;
let noiseNode;
let isAudioStarted = false;

// Initialize on first interaction
function initAudio() {
  if (isAudioStarted) return;
  isAudioStarted = true;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.1; // Start quiet
    masterGain.connect(audioCtx.destination);

    // --- DRONE LAYER (Binaural Beats) ---
    // Oscillator 1 (Left-ish)
    droneOsc1 = audioCtx.createOscillator();
    droneOsc1.type = 'sawtooth';
    droneOsc1.frequency.value = 55; // Low hum
    const pan1 = audioCtx.createStereoPanner();
    pan1.pan.value = -0.5;
    const gain1 = audioCtx.createGain();
    gain1.gain.value = 0.5;

    // Lowpass filter to muffle it
    const filter1 = audioCtx.createBiquadFilter();
    filter1.type = 'lowpass';
    filter1.frequency.value = 200;

    droneOsc1.connect(filter1).connect(pan1).connect(gain1).connect(masterGain);
    droneOsc1.start();

    // Oscillator 2 (Right-ish, slightly detuned for beating)
    droneOsc2 = audioCtx.createOscillator();
    droneOsc2.type = 'sawtooth';
    droneOsc2.frequency.value = 53; // 2Hz beat frequency
    const pan2 = audioCtx.createStereoPanner();
    pan2.pan.value = 0.5;
    const gain2 = audioCtx.createGain();
    gain2.gain.value = 0.5;

    // Lowpass filter
    const filter2 = audioCtx.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.value = 210;

    droneOsc2.connect(filter2).connect(pan2).connect(gain2).connect(masterGain);
    droneOsc2.start();

    // --- STATIC LAYER (White Noise) ---
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(
      1,
      bufferSize,
      audioCtx.sampleRate
    );
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000; // Hiss

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.value = 0.02; // Very subtle default

    noiseNode.connect(noiseFilter).connect(noiseGain).connect(masterGain);
    noiseNode.start();

    // Expose control params
    window.audioParams = {
      droneFilter1: filter1,
      droneFilter2: filter2,
      noiseGain: noiseGain,
      masterGain: masterGain,
    };

    console.log('Audio System Online');
  } catch (e) {
    console.error('Audio Init Failed:', e);
  }
}

// Interaction Hooks
document.addEventListener('click', () => {
  initAudio();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
});

// Reactivity
document.addEventListener('mousemove', (e) => {
  if (!window.audioParams) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  // Mouse X controls drone filter (opens up)
  const normalizedX = e.clientX / w;
  window.audioParams.droneFilter1.frequency.setTargetAtTime(
    100 + normalizedX * 200,
    audioCtx.currentTime,
    0.1
  );
  window.audioParams.droneFilter2.frequency.setTargetAtTime(
    110 + normalizedX * 200,
    audioCtx.currentTime,
    0.1
  );

  // Mouse Y controls static volume (lower = louder/scarier)
  const normalizedY = e.clientY / h;
  const staticVol = 0.05 * (1 - normalizedY);
  window.audioParams.noiseGain.gain.setTargetAtTime(
    staticVol,
    audioCtx.currentTime,
    0.1
  );
});

// Chaos Mode trigger
function playScreech() {
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = 800 + Math.random() * 500;

  const gain = audioCtx.createGain();
  gain.gain.value = 0.1;

  osc.connect(gain).connect(masterGain);
  osc.start();

  // Slide down pitch
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.5);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

  osc.stop(audioCtx.currentTime + 0.6);
}
