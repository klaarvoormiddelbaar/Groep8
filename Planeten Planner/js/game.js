// Planeten Planner — hoofd-gameloop.
// Fase 6: tijdelijke onkwetsbaarheid na meteorietschade toegevoegd.

import { GAME_CONFIG } from './config.js';
import { createPlayer, initPlayerInput, updatePlayer, renderPlayer } from './player.js';
import { createTaskSpawner, updateTasks, renderTasks } from './objects.js';
import { createMeteorSpawner, updateMeteors, renderMeteors } from './meteors.js';
import { rectsOverlap, circleRectOverlap } from './collision.js';

// Meteoorwaarden zijn in fase 5 nog vaste placeholders. Fase 13 (moeilijkheidsopbouw)
// koppelt dit aan het level, net als de taak-valsnelheid/spawnfrequentie uit config.js.
const METEOR_SPAWN_INTERVAL_MS = 3000;
const METEOR_FALL_SPEED = 110;

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = GAME_CONFIG.canvasWidth;
canvas.height = GAME_CONFIG.canvasHeight;

const player = createPlayer(canvas.width, canvas.height);
initPlayerInput();

const taskSpawner = createTaskSpawner(canvas.width);
const meteorSpawner = createMeteorSpawner(canvas.width);

let caughtCount = 0;
let lives = GAME_CONFIG.startingLives;
let isGameOver = false;
let invulnerableMs = 0;

let lastTimestampMs = 0;
let isRunning = true;

function loseLife() {
  if (isGameOver) return;
  lives = Math.max(0, lives - 1);
  if (lives === 0) {
    isGameOver = true;
  }
}

function update(deltaSeconds) {
  if (isGameOver) return;

  updatePlayer(player, deltaSeconds, canvas.width);

  updateTasks(
    taskSpawner,
    deltaSeconds,
    canvas.height,
    GAME_CONFIG.startingSpawnInterval,
    GAME_CONFIG.startingFallSpeed,
    loseLife // een gemiste taak kost 1 leven
  );

  updateMeteors(meteorSpawner, deltaSeconds, canvas.height, METEOR_SPAWN_INTERVAL_MS, METEOR_FALL_SPEED);

  if (invulnerableMs > 0) {
    invulnerableMs = Math.max(0, invulnerableMs - deltaSeconds * 1000);
  }

  taskSpawner.tasks = taskSpawner.tasks.filter((task) => {
    if (rectsOverlap(player, task)) {
      caughtCount += 1;
      return false;
    }
    return true;
  });

  // Botsingsdetectie met meteorieten wordt tijdelijk genegeerd tijdens onkwetsbaarheid,
  // zodat één botsing nooit meerdere levens tegelijk kan kosten.
  if (invulnerableMs <= 0) {
    meteorSpawner.meteors = meteorSpawner.meteors.filter((meteor) => {
      if (circleRectOverlap(meteor, player)) {
        loseLife(); // een meteoriet kost 1 leven
        if (!isGameOver) {
          invulnerableMs = GAME_CONFIG.invulnerabilityDuration;
        }
        return false;
      }
      return true;
    });
  }
}

function renderHud() {
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Fase 6: onkwetsbaarheid', canvas.width / 2, 20);
  ctx.fillText(`Gevangen: ${caughtCount}`, canvas.width / 2, 40);

  ctx.textAlign = 'left';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#f87171';
  ctx.fillText(`Levens: ${'❤'.repeat(lives)}${'♡'.repeat(GAME_CONFIG.maximumLives - lives)}`, 12, 20);
}

function renderGameOver() {
  ctx.fillStyle = 'rgba(5, 7, 13, 0.85)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 16);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '16px sans-serif';
  ctx.fillText(`Gevangen taken: ${caughtCount}`, canvas.width / 2, canvas.height / 2 + 16);
}

function render() {
  ctx.fillStyle = '#0b1220';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  renderTasks(ctx, taskSpawner);
  renderMeteors(ctx, meteorSpawner);
  renderPlayer(ctx, player, invulnerableMs > 0);
  renderHud();

  if (isGameOver) {
    renderGameOver();
  }
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
