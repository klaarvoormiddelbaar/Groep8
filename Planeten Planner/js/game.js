// Planeten Planner — hoofd-gameloop.
// Fase 12: score toegevoegd.

import { GAME_CONFIG } from './config.js';
import { createPlayer, initPlayerInput, updatePlayer, renderPlayer } from './player.js';
import { createTaskSpawner, updateTasks, renderTasks } from './objects.js';
import { createMeteorSpawner, updateMeteors, renderMeteors } from './meteors.js';
import { createCargo, hasRoomFor, addToCargo, peekNextTask, removeNextTask, renderCargo } from './cargo.js';
import {
  createWeekPlanning,
  hasRoomInDay,
  placeTaskInDay,
  totalFilledSlots,
  renderWeekPlanning,
  renderWeekSummary
} from './planner.js';
import { rectsOverlap, circleRectOverlap } from './collision.js';

// Meteoorwaarden zijn in fase 5 nog vaste placeholders. Fase 13 (moeilijkheidsopbouw)
// koppelt dit aan het level, net als de taak-valsnelheid/spawnfrequentie uit config.js.
const METEOR_SPAWN_INTERVAL_MS = 3000;
const METEOR_FALL_SPEED = 110;

// Onderin het scherm staat een vast weekplanning-paneel; het speelveld (vallende
// objecten + raket) gebruikt de resterende hoogte erboven.
const WEEKPLANNING_PANEL_HEIGHT = 150;

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = GAME_CONFIG.canvasWidth;
canvas.height = GAME_CONFIG.canvasHeight;

const playAreaHeight = canvas.height - WEEKPLANNING_PANEL_HEIGHT;

const player = createPlayer(canvas.width, playAreaHeight);
initPlayerInput();

const taskSpawner = createTaskSpawner(canvas.width);
const meteorSpawner = createMeteorSpawner(canvas.width);
let cargo = createCargo(GAME_CONFIG.cargoCapacity);
let weekPlanning = createWeekPlanning(GAME_CONFIG.numberOfDays, GAME_CONFIG.slotsPerDay);
let currentLevel = 1;

let isShowingLevelSummary = false;
let summaryTimerMs = 0;
let completedWeekSnapshot = null;
let completedLevelNumber = 0;

let feedbackMessage = '';
let feedbackTimerMs = 0;

function completeLevel() {
  // Bewaar een referentie naar de voltooide planning vóórdat er een nieuwe,
  // lege planning voor in de plaats komt — zo blijft het overzicht correct
  // terwijl de speler alweer met een schone week kan beginnen.
  completedWeekSnapshot = weekPlanning;
  completedLevelNumber = currentLevel;

  score += GAME_CONFIG.scoreLevelComplete + lives * GAME_CONFIG.scoreBonusPerRemainingLife;

  currentLevel += 1;
  weekPlanning = createWeekPlanning(GAME_CONFIG.numberOfDays, GAME_CONFIG.slotsPerDay);
  cargo = createCargo(GAME_CONFIG.cargoCapacity);
  // Tijdelijke en level-power-ups (fase 14) worden hier straks ook gereset.

  isShowingLevelSummary = true;
  summaryTimerMs = GAME_CONFIG.levelSummaryAutoContinueDelay;
}

function endLevelSummary() {
  isShowingLevelSummary = false;
  summaryTimerMs = 0;
}

function showFeedback(message) {
  feedbackMessage = message;
  feedbackTimerMs = 1200;
}

function attemptPlanNextTask(dayIndex) {
  if (isGameOver || isShowingLevelSummary) return;

  const nextTask = peekNextTask(cargo);
  if (!nextTask) {
    showFeedback('Geen taak om in te plannen.');
    return;
  }

  if (!hasRoomInDay(weekPlanning, dayIndex, nextTask)) {
    showFeedback(`${weekPlanning.days[dayIndex].name} zit vol.`);
    return;
  }

  removeNextTask(cargo);
  placeTaskInDay(weekPlanning, dayIndex, nextTask);
  score += nextTask.slots === 2 ? GAME_CONFIG.scorePlanLargeTask : GAME_CONFIG.scorePlanSmallTask;

  if (totalFilledSlots(weekPlanning) >= GAME_CONFIG.totalWeekSlots) {
    completeLevel();
  } else {
    showFeedback(`${nextTask.label} ingepland op ${weekPlanning.days[dayIndex].name}.`);
  }
}

const DAY_KEYS = ['1', '2', '3', '4', '5'];

window.addEventListener('keydown', (event) => {
  if (event.repeat) return;

  if (isShowingLevelSummary) {
    if (event.key === ' ' || event.key === 'Enter') {
      endLevelSummary();
    }
    return;
  }

  const dayIndex = DAY_KEYS.indexOf(event.key);
  if (dayIndex !== -1) {
    attemptPlanNextTask(dayIndex);
  }
});

let caughtCount = 0;
let score = 0;
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

  if (isShowingLevelSummary) {
    summaryTimerMs = Math.max(0, summaryTimerMs - deltaSeconds * 1000);
    if (summaryTimerMs === 0) {
      endLevelSummary();
    }
    return; // gameplay staat volledig stil tijdens het weekoverzicht
  }

  updatePlayer(player, deltaSeconds, canvas.width);

  updateTasks(
    taskSpawner,
    deltaSeconds,
    playAreaHeight,
    GAME_CONFIG.startingSpawnInterval,
    GAME_CONFIG.startingFallSpeed,
    loseLife // een gemiste taak kost 1 leven
  );

  updateMeteors(meteorSpawner, deltaSeconds, playAreaHeight, METEOR_SPAWN_INTERVAL_MS, METEOR_FALL_SPEED);

  if (invulnerableMs > 0) {
    invulnerableMs = Math.max(0, invulnerableMs - deltaSeconds * 1000);
  }

  if (feedbackTimerMs > 0) {
    feedbackTimerMs = Math.max(0, feedbackTimerMs - deltaSeconds * 1000);
  }

  taskSpawner.tasks = taskSpawner.tasks.filter((task) => {
    if (!rectsOverlap(player, task)) return true;
    if (!hasRoomFor(cargo, task)) return true; // laadruimte vol: taak valt door, niet gevangen

    addToCargo(cargo, task);
    caughtCount += 1;
    score += task.slots === 2 ? GAME_CONFIG.scoreCatchLargeTask : GAME_CONFIG.scoreCatchSmallTask;
    return false;
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
  ctx.fillText(`Fase 12: level ${currentLevel}`, canvas.width / 2, 20);
  ctx.fillText(`Score: ${score}  Week: ${totalFilledSlots(weekPlanning)}/${GAME_CONFIG.totalWeekSlots}`, canvas.width / 2, 40);

  if (feedbackTimerMs > 0) {
    ctx.fillStyle = '#38bdf8';
    ctx.font = '13px sans-serif';
    ctx.fillText(feedbackMessage, canvas.width / 2, 60);
  }

  renderCargo(ctx, cargo, canvas.width);

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
  ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 16);
  ctx.fillText(`Gevangen taken: ${caughtCount}`, canvas.width / 2, canvas.height / 2 + 38);
}

function render() {
  ctx.fillStyle = '#0b1220';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  renderTasks(ctx, taskSpawner);
  renderMeteors(ctx, meteorSpawner);
  renderPlayer(ctx, player, invulnerableMs > 0);
  renderHud();

  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, playAreaHeight);
  ctx.lineTo(canvas.width, playAreaHeight);
  ctx.stroke();

  renderWeekPlanning(ctx, weekPlanning, 0, playAreaHeight, canvas.width, WEEKPLANNING_PANEL_HEIGHT);

  if (isShowingLevelSummary && completedWeekSnapshot) {
    renderWeekSummary(ctx, completedWeekSnapshot, completedLevelNumber, canvas.width, canvas.height);
  }

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
