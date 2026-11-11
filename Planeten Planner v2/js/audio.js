// Korte, procedureel gegenereerde geluidseffecten via de Web Audio API.
// Geen externe geluidsbestanden nodig (assets/sounds staat nog leeg) — dit
// zijn simpele piepjes, geschikt als 'lelijke eerste versie' van het geluid.

let audioContext = null;
let isMuted = false;

function getContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextClass();
  }
  return audioContext;
}

function beep({ frequency = 440, duration = 0.12, type = 'sine', volume = 0.15, delay = 0 }) {
  if (isMuted) return;

  const ctx = getContext();
  if (ctx.state === 'suspended') ctx.resume();

  const startTime = ctx.currentTime + delay;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

export function toggleMute() {
  isMuted = !isMuted;
  return isMuted;
}

export function getIsMuted() {
  return isMuted;
}

export const sounds = {
  catchSmall: () => beep({ frequency: 660, duration: 0.08 }),
  catchLarge: () => beep({ frequency: 520, duration: 0.12 }),
  planSmall: () => beep({ frequency: 880, duration: 0.1 }),
  planLarge: () => beep({ frequency: 700, duration: 0.14 }),
  meteorHit: () => beep({ frequency: 120, duration: 0.25, type: 'sawtooth', volume: 0.2 }),
  shield: () => beep({ frequency: 1000, duration: 0.15, type: 'square' }),
  lifeLost: () => beep({ frequency: 200, duration: 0.2, type: 'triangle' }),
  powerupCaught: () => beep({ frequency: 950, duration: 0.12, type: 'square' }),
  dayFull: () => beep({ frequency: 180, duration: 0.15, type: 'square', volume: 0.12 }),
  levelComplete: () => {
    beep({ frequency: 660, duration: 0.12 });
    beep({ frequency: 880, duration: 0.18, delay: 0.12 });
  },
  gameOver: () => {
    beep({ frequency: 300, duration: 0.2, type: 'sawtooth' });
    beep({ frequency: 180, duration: 0.3, type: 'sawtooth', delay: 0.18 });
  }
};
