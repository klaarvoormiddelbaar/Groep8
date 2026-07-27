// Planeten Planner — hoofd-gameloop.
// Fase 4: grote taken (2 taakplekken) toegevoegd.

import { GAME_CONFIG } from './config.js';
import { createPlayer, initPlayerInput, updatePlayer, renderPlayer } from './player.js';
import { createTaskSpawner, updateTasks, renderTasks } from './objects.js';
import { rectsOverlap } from './collision.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = GAME_CONFIG.canvasWidth;
canvas.height = GAME_CONFIG.canvasHeight;

const player = createPlayer(canvas.width, canvas.height);
initPlayerInput();

const spawner = createTaskSpawner(canvas.width);
let caughtCount = 0;
let missedCount = 0;

let lastTimestampMs = 0;
let isRunning = true;

function handleMissedTask() {
  missedCount += 1;
}

function update(deltaSeconds) {
  updatePlayer(player, deltaSeconds, canvas.width);

  updateTasks(
    spawner,
    deltaSeconds,
    canvas.height,
    GAME_CONFIG.startingSpawnInterval,
    GAME_CONFIG.startingFallSpeed,
    handleMissedTask
  );

  spawner.tasks = spawner.tasks.filter((task) => {
    if (rectsOverlap(player, task)) {
      caughtCount += 1;
      return false;
    }
    return true;
  });
}

function render() {
  ctx.fillStyle = '#0b1220';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  renderTasks(ctx, spawner);
  renderPlayer(ctx, player);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Fase 4: grote taken', canvas.width / 2, 20);
  ctx.fillText(`Gevangen: ${caughtCount}  Gemist: ${missedCount}`, canvas.width / 2, 40);
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
