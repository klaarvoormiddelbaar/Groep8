// Planeten Planner — hoofd-gameloop.
// Fase 1: alleen canvas + requestAnimationFrame-loop met delta time.
// Speler, vallende taken, meteorieten etc. komen in latere fases.

import { GAME_CONFIG } from './config.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = GAME_CONFIG.canvasWidth;
canvas.height = GAME_CONFIG.canvasHeight;

let lastTimestampMs = 0;
let isRunning = true;

function update(deltaSeconds) {
  // Nog geen spelstatus in fase 1.
}

function render() {
  ctx.fillStyle = '#0b1220';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#e2e8f0';
  ctx.textAlign = 'center';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('Planeten Planner', canvas.width / 2, canvas.height / 2 - 12);

  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Fase 1: game-loop draait', canvas.width / 2, canvas.height / 2 + 16);
}

function loop(timestampMs) {
  if (!isRunning) return;

  const deltaSeconds = lastTimestampMs ? (timestampMs - lastTimestampMs) / 1000 : 0;
  lastTimestampMs = timestampMs;

  update(deltaSeconds);
  render();

  requestAnimationFrame(loop);
}

document.addEventListener('visibilitychange', () => {
  isRunning = document.visibilityState === 'visible';
  if (isRunning) {
    lastTimestampMs = 0;
    requestAnimationFrame(loop);
  }
});

requestAnimationFrame(loop);
