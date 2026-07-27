// Planeten Planner — hoofd-gameloop.
// Fase 15: startscherm, pauze en game-over met herstart toegevoegd.

import { GAME_CONFIG } from './config.js';
import { getLevelSettings } from './levels.js';
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
import {
  createPowerupSpawner,
  updatePowerups,
  renderPowerups,
  createActiveEffects,
  tickActiveEffects,
  resetLevelScopedEffects
} from './powerups.js';
import { rectsOverlap, circleRectOverlap } from './collision.js';

// Onderin het scherm staat een vast weekplanning-paneel; het speelveld (vallende
// objecten + raket) gebruikt de resterende hoogte erboven.
const WEEKPLANNING_PANEL_HEIGHT = 150;

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = GAME_CONFIG.canvasWidth;
canvas.height = GAME_CONFIG.canvasHeight;

const playAreaHeight = canvas.height - WEEKPLANNING_PANEL_HEIGHT;

const START_BUTTON = { x: canvas.width / 2 - 100, y: 420, width: 200, height: 56 };
const RESUME_BUTTON = { x: canvas.width / 2 - 100, y: 400, width: 200, height: 56 };
const RESTART_BUTTON = { x: canvas.width / 2 - 100, y: canvas.height / 2 + 50, width: 200, height: 56 };
const PAUSE_ICON_BUTTON = { x: 12, y: 30, width: 60, height: 22 };

const player = createPlayer(canvas.width, playAreaHeight);
initPlayerInput();

const taskSpawner = createTaskSpawner(canvas.width);
const meteorSpawner = createMeteorSpawner(canvas.width);
const powerupSpawner = createPowerupSpawner(canvas.width);
const activeEffects = createActiveEffects();

// 'start' | 'playing' | 'paused' | 'gameOver'
let gameMode = 'start';

let cargo;
let weekPlanning;
let currentLevel;
let levelSettings;

let isShowingLevelSummary;
let summaryTimerMs;
let completedWeekSnapshot;
let completedLevelNumber;
let completedWeeksCount;

let feedbackMessage;
let feedbackTimerMs;

let caughtCount;
let plannedCount;
let score;
let lives;
let isGameOver;
let invulnerableMs;

// Zet alle spelstatus terug naar een verse start. Wordt gebruikt bij het eerste
// Start-klik én bij 'Opnieuw spelen' na een game-over.
function resetGame() {
  cargo = createCargo(GAME_CONFIG.cargoCapacity);
  weekPlanning = createWeekPlanning(GAME_CONFIG.numberOfDays, GAME_CONFIG.slotsPerDay);
  currentLevel = 1;
  levelSettings = getLevelSettings(currentLevel);

  taskSpawner.tasks = [];
  meteorSpawner.meteors = [];
  powerupSpawner.items = [];
  Object.assign(activeEffects, createActiveEffects());

  player.x = canvas.width / 2 - player.width / 2;

  isShowingLevelSummary = false;
  summaryTimerMs = 0;
  completedWeekSnapshot = null;
  completedLevelNumber = 0;
  completedWeeksCount = 0;

  feedbackMessage = '';
  feedbackTimerMs = 0;

  caughtCount = 0;
  plannedCount = 0;
  score = 0;
  lives = GAME_CONFIG.startingLives;
  isGameOver = false;
  invulnerableMs = 0;

  gameMode = 'playing';
}

resetGame();
gameMode = 'start'; // begin op het titelscherm, niet meteen spelend

function completeLevel() {
  // Bewaar een referentie naar de voltooide planning vóórdat er een nieuwe,
  // lege planning voor in de plaats komt — zo blijft het overzicht correct
  // terwijl de speler alweer met een schone week kan beginnen.
  completedWeekSnapshot = weekPlanning;
  completedLevelNumber = currentLevel;
  completedWeeksCount += 1;

  addScore(GAME_CONFIG.scoreLevelComplete + lives * GAME_CONFIG.scoreBonusPerRemainingLife);

  currentLevel += 1;
  levelSettings = getLevelSettings(currentLevel);
  weekPlanning = createWeekPlanning(GAME_CONFIG.numberOfDays, GAME_CONFIG.slotsPerDay);
  cargo = createCargo(GAME_CONFIG.cargoCapacity); // reset ook extra laadruimte automatisch
  resetLevelScopedEffects(activeEffects); // tijdelijke effecten eindigen, level-power-ups resetten

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
  plannedCount += 1;
  addScore(nextTask.slots === 2 ? GAME_CONFIG.scorePlanLargeTask : GAME_CONFIG.scorePlanSmallTask);

  if (totalFilledSlots(weekPlanning) >= GAME_CONFIG.totalWeekSlots) {
    completeLevel();
  } else {
    showFeedback(`${nextTask.label} ingepland op ${weekPlanning.days[dayIndex].name}.`);
  }
}

const DAY_KEYS = ['1', '2', '3', '4', '5'];

window.addEventListener('keydown', (event) => {
  if (event.repeat) return;

  if (event.key === 'Escape') {
    if (gameMode === 'playing') gameMode = 'paused';
    else if (gameMode === 'paused') gameMode = 'playing';
    return;
  }

  if (gameMode !== 'playing') return;

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

function hitTest(px, py, rect) {
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height;
}

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const px = (event.clientX - rect.left) * scaleX;
  const py = (event.clientY - rect.top) * scaleY;

  if (gameMode === 'start' && hitTest(px, py, START_BUTTON)) {
    resetGame();
    return;
  }
  if (gameMode === 'paused' && hitTest(px, py, RESUME_BUTTON)) {
    gameMode = 'playing';
    return;
  }
  if (gameMode === 'gameOver' && hitTest(px, py, RESTART_BUTTON)) {
    resetGame();
    return;
  }
  if (gameMode === 'playing' && hitTest(px, py, PAUSE_ICON_BUTTON)) {
    gameMode = 'paused';
  }
});

let lastTimestampMs = 0;
let isRunning = true;

function loseLife() {
  if (isGameOver) return;
  lives = Math.max(0, lives - 1);
  if (lives === 0) {
    isGameOver = true;
    gameMode = 'gameOver';
  }
}

function addScore(points) {
  score += activeEffects.doubleScore ? points * 2 : points;
}

function applyPowerup(type) {
  switch (type) {
    case 'shield':
      activeEffects.hasShield = true;
      showFeedback('Schild actief!');
      break;
    case 'extraCargo':
      activeEffects.extraCargo = true;
      cargo.capacity = GAME_CONFIG.extraCargoCapacity;
      showFeedback('Extra laadruimte!');
      break;
    case 'magnet':
      activeEffects.magnetMs = GAME_CONFIG.magnetDuration;
      showFeedback('Magneet actief!');
      break;
    case 'slowMotion':
      activeEffects.slowMotionMs = GAME_CONFIG.slowMotionDuration;
      showFeedback('Tijdvertrager actief!');
      break;
    case 'extraLife':
      if (lives < GAME_CONFIG.maximumLives) {
        lives += 1;
        showFeedback('Extra leven!');
      } else {
        showFeedback('Levens al vol.');
      }
      break;
    case 'doubleScore':
      activeEffects.doubleScore = true;
      showFeedback('Dubbele score!');
      break;
    default:
      break;
  }
}

function update(deltaSeconds) {
  if (gameMode !== 'playing') return;

  if (isShowingLevelSummary) {
    summaryTimerMs = Math.max(0, summaryTimerMs - deltaSeconds * 1000);
    if (summaryTimerMs === 0) {
      endLevelSummary();
    }
    return; // gameplay staat volledig stil tijdens het weekoverzicht
  }

  updatePlayer(player, deltaSeconds, canvas.width);

  tickActiveEffects(activeEffects, deltaSeconds);
  const speedMultiplier = activeEffects.slowMotionMs > 0 ? GAME_CONFIG.slowMotionMultiplier : 1;

  updateTasks(
    taskSpawner,
    deltaSeconds,
    playAreaHeight,
    levelSettings.taskSpawnInterval,
    levelSettings.taskFallSpeed,
    levelSettings.largeTasksEnabled,
    speedMultiplier,
    loseLife // een gemiste taak kost 1 leven
  );

  updateMeteors(
    meteorSpawner,
    deltaSeconds,
    playAreaHeight,
    levelSettings.meteorSpawnInterval,
    levelSettings.meteorFallSpeed,
    speedMultiplier
  );

  updatePowerups(powerupSpawner, deltaSeconds, playAreaHeight, GAME_CONFIG.powerupSpawnInterval, GAME_CONFIG.powerupFallSpeed);

  // Magneet trekt alleen taken die dichtbij zijn naar de raket toe, geen meteorieten of power-ups.
  if (activeEffects.magnetMs > 0) {
    const playerCx = player.x + player.width / 2;
    const playerCy = player.y + player.height / 2;
    for (const task of taskSpawner.tasks) {
      const taskCx = task.x + task.width / 2;
      const taskCy = task.y + task.height / 2;
      const dx = playerCx - taskCx;
      const dy = playerCy - taskCy;
      const distance = Math.hypot(dx, dy);
      if (distance > 0 && distance <= GAME_CONFIG.magnetRange) {
        const pull = Math.min(distance, GAME_CONFIG.magnetPullSpeed * deltaSeconds);
        task.x += (dx / distance) * pull;
        task.y += (dy / distance) * pull;
      }
    }
  }

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
    addScore(task.slots === 2 ? GAME_CONFIG.scoreCatchLargeTask : GAME_CONFIG.scoreCatchSmallTask);
    return false;
  });

  powerupSpawner.items = powerupSpawner.items.filter((item) => {
    if (!rectsOverlap(player, item)) return true;
    applyPowerup(item.type);
    return false;
  });

  // Botsingsdetectie met meteorieten wordt tijdelijk genegeerd tijdens onkwetsbaarheid,
  // zodat één botsing nooit meerdere levens tegelijk kan kosten.
  if (invulnerableMs <= 0) {
    meteorSpawner.meteors = meteorSpawner.meteors.filter((meteor) => {
      if (!circleRectOverlap(meteor, player)) return true;

      if (activeEffects.hasShield) {
        // Een actief schild vangt de klap op vóórdat er een leven verloren gaat.
        activeEffects.hasShield = false;
        showFeedback('Schild opgevangen!');
        return false;
      }

      loseLife(); // een meteoriet kost 1 leven
      if (!isGameOver) {
        invulnerableMs = GAME_CONFIG.invulnerabilityDuration;
      }
      return false;
    });
  }
}

function drawButton(rect, label) {
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

  ctx.fillStyle = '#0b1220';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, rect.x + rect.width / 2, rect.y + rect.height / 2 + 6);
}

function renderStartScreen() {
  ctx.fillStyle = '#0b1220';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('Planeten Planner', canvas.width / 2, 220);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '15px sans-serif';
  const lines = ['Beweeg met ← en →', 'Vang taken', 'Ontwijk meteorieten', 'Plan met 1 t/m 5'];
  lines.forEach((line, i) => ctx.fillText(line, canvas.width / 2, 280 + i * 26));

  drawButton(START_BUTTON, 'Start');
}

function renderPauseOverlay() {
  ctx.fillStyle = 'rgba(5, 7, 13, 0.85)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('Gepauzeerd', canvas.width / 2, canvas.height / 2 - 40);

  drawButton(RESUME_BUTTON, 'Verder');
}

function renderActiveEffects() {
  const badges = [];
  if (activeEffects.hasShield) badges.push('🛡 Schild');
  if (activeEffects.extraCargo) badges.push('📦 +Lading');
  if (activeEffects.magnetMs > 0) badges.push(`🧲 ${Math.ceil(activeEffects.magnetMs / 1000)}s`);
  if (activeEffects.slowMotionMs > 0) badges.push(`🐢 ${Math.ceil(activeEffects.slowMotionMs / 1000)}s`);
  if (activeEffects.doubleScore) badges.push('x2 score');

  if (badges.length === 0) return;

  ctx.textAlign = 'center';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.fillText(badges.join('   '), canvas.width / 2, 80);
}

function renderHud() {
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Fase 15: level ${currentLevel}`, canvas.width / 2, 20);
  ctx.fillText(`Score: ${score}  Week: ${totalFilledSlots(weekPlanning)}/${GAME_CONFIG.totalWeekSlots}`, canvas.width / 2, 40);

  if (feedbackTimerMs > 0) {
    ctx.fillStyle = '#38bdf8';
    ctx.font = '13px sans-serif';
    ctx.fillText(feedbackMessage, canvas.width / 2, 60);
  }

  renderActiveEffects();
  renderCargo(ctx, cargo, canvas.width);

  ctx.textAlign = 'left';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#f87171';
  ctx.fillText(`Levens: ${'❤'.repeat(lives)}${'♡'.repeat(GAME_CONFIG.maximumLives - lives)}`, 12, 20);

  if (gameMode === 'playing') {
    ctx.fillStyle = '#334155';
    ctx.fillRect(PAUSE_ICON_BUTTON.x, PAUSE_ICON_BUTTON.y, PAUSE_ICON_BUTTON.width, PAUSE_ICON_BUTTON.height);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⏸ Pauze', PAUSE_ICON_BUTTON.x + PAUSE_ICON_BUTTON.width / 2, PAUSE_ICON_BUTTON.y + 15);
  }
}

function renderGameOverScreen() {
  ctx.fillStyle = 'rgba(5, 7, 13, 0.9)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 110);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '16px sans-serif';
  const lines = [
    `Score: ${score}`,
    `Hoogste level: ${currentLevel}`,
    `Ingeplande taken: ${plannedCount}`,
    `Voltooide weken: ${completedWeeksCount}`
  ];
  lines.forEach((line, i) => ctx.fillText(line, canvas.width / 2, canvas.height / 2 - 60 + i * 24));

  drawButton(RESTART_BUTTON, 'Opnieuw spelen');
}

function render() {
  if (gameMode === 'start') {
    renderStartScreen();
    return;
  }

  ctx.fillStyle = '#0b1220';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  renderTasks(ctx, taskSpawner);
  renderMeteors(ctx, meteorSpawner);
  renderPowerups(ctx, powerupSpawner);
  renderPlayer(ctx, player, invulnerableMs > 0);
  if (activeEffects.hasShield) {
    ctx.beginPath();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.arc(player.x + player.width / 2, player.y + player.height / 2, player.width / 2 + 8, 0, Math.PI * 2);
    ctx.stroke();
  }
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

  if (gameMode === 'paused') {
    renderPauseOverlay();
  }

  if (gameMode === 'gameOver') {
    renderGameOverScreen();
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
