// Planeten Planner — hoofd-gameloop.
// Fase 2: raketbesturing toegevoegd.

import { GAME_CONFIG } from './config.js';
import { createPlayer, initPlayerInput, updatePlayer, renderPlayer } from './player.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = GAME_CONFIG.canvasWidth;
canvas.height = GAME_CONFIG.canvasHeight;

const player = createPlayer(canvas.width, canvas.height);
initPlayerInput();

let lastTimestampMs = 0;
let isRunning = true;

function update(deltaSeconds) {
  updatePlayer(player, deltaSeconds, canvas.width);
}

function render() {
  ctx.fillStyle = '#0b1220';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  renderPlayer(ctx, player);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Fase 2: raketbesturing', canvas.width / 2, 24);
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
