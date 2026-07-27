// Planeten Planner — hoofd-gameloop.
// Fase 19: balanceren (feedback-duur verlengd voor leesbaarheid).

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
  canPlaceInAnyDay,
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
import { sounds, toggleMute, getIsMuted } from './audio.js';

// Onderin het scherm staat een vast weekplanning-paneel; het speelveld (vallende
// objecten + raket) gebruikt de resterende hoogte erboven.
const WEEKPLANNING_PANEL_HEIGHT = 130;

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = GAME_CONFIG.canvasWidth;
canvas.height = GAME_CONFIG.canvasHeight;

const playAreaHeight = canvas.height - WEEKPLANNING_PANEL_HEIGHT;

const START_BUTTON = { x: canvas.width / 2 - 100, y: 320, width: 200, height: 56 };
const RESUME_BUTTON = { x: canvas.width / 2 - 100, y: canvas.height / 2 - 28, width: 200, height: 56 };
const RESTART_BUTTON = { x: canvas.width / 2 - 100, y: canvas.height / 2 + 50, width: 200, height: 56 };
const PAUSE_ICON_BUTTON = { x: 12, y: 30, width: 60, height: 22 };
const MUTE_ICON_BUTTON = { x: 12, y: 56, width: 84, height: 22 };

// Vaste sterrenachtergrond (eenmalig gegenereerd, geen herberekening per frame).
const STARS = Array.from({ length: 100 }, () => ({
  x: Math.random() * GAME_CONFIG.canvasWidth,
  y: Math.random() * playAreaHeightFor(GAME_CONFIG.canvasHeight),
  radius: Math.random() < 0.15 ? 1.6 : 0.9,
  twinkleOffset: Math.random() * 1000
}));

function playAreaHeightFor(canvasHeight) {
  return canvasHeight - WEEKPLANNING_PANEL_HEIGHT;
}

function renderStarfield() {
  for (const star of STARS) {
    const twinkle = 0.5 + 0.5 * Math.sin((Date.now() + star.twinkleOffset) / 500);
    ctx.globalAlpha = 0.35 + twinkle * 0.5;
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

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

let damageFlashMs;
let shakeDayIndex;
let shakeTimerMs;
let scorePopups;

// Zet alle spelstatus terug naar een verse start. Wordt gebruikt bij het eerste
// Start-klik én bij 'Opnieuw spelen' na een game-over.
function resetGame() {
  cargo = createCargo(GAME_CONFIG.cargoCapacity);
  weekPlanning = createWeekPlanning(GAME_CONFIG.numberOfDays, GAME_CONFIG.slotsPerDay);
  currentLevel = 1;
  levelSettings = getLevelSettings(currentLevel);

  taskSpawner.tasks = [];
  taskSpawner.timeSinceLastLargeMs = Infinity;
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

  damageFlashMs = 0;
  shakeDayIndex = -1;
  shakeTimerMs = 0;
  scorePopups = [];

  gameMode = 'playing';
}

function addScorePopup(x, y, text, color = '#facc15') {
  scorePopups.push({ x, y, text, color, ms: 700 });
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
  sounds.levelComplete();
}

function endLevelSummary() {
  isShowingLevelSummary = false;
  summaryTimerMs = 0;
}

function showFeedback(message) {
  feedbackMessage = message;
  feedbackTimerMs = 1600; // lang genoeg om ook langere meldingen ("... ingepland op Donderdag.") te lezen
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
    shakeDayIndex = dayIndex;
    shakeTimerMs = 300;
    sounds.dayFull();
    return;
  }

  removeNextTask(cargo);
  placeTaskInDay(weekPlanning, dayIndex, nextTask);
  plannedCount += 1;
  const planPoints = nextTask.slots === 2 ? GAME_CONFIG.scorePlanLargeTask : GAME_CONFIG.scorePlanSmallTask;
  addScore(planPoints);
  (nextTask.slots === 2 ? sounds.planLarge : sounds.planSmall)();

  const dayColumnWidth = canvas.width / GAME_CONFIG.numberOfDays;
  addScorePopup(dayColumnWidth * dayIndex + dayColumnWidth / 2, playAreaHeight - 6, `+${planPoints}`, '#38bdf8');

  if (totalFilledSlots(weekPlanning) >= GAME_CONFIG.totalWeekSlots) {
    completeLevel();
  } else {
    showFeedback(`${nextTask.label} ingepland op ${weekPlanning.days[dayIndex].name}.`);
  }
}

const DAY_KEYS = ['1', '2', '3', '4', '5'];

window.addEventListener('keydown', (event) => {
  if (event.repeat) return;

  if (event.key === ' ') {
    event.preventDefault(); // voorkomt dat de spatiebalk de pagina laat scrollen
  }

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
    return;
  }
  if (hitTest(px, py, MUTE_ICON_BUTTON)) {
    toggleMute();
  }
});

let lastTimestampMs = 0;
let isRunning = true;

function loseLife() {
  if (isGameOver) return;
  lives = Math.max(0, lives - 1);
  damageFlashMs = 150;
  sounds.lifeLost();
  if (lives === 0) {
    isGameOver = true;
    gameMode = 'gameOver';
    sounds.gameOver();
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
      sounds.shield();
      break;
    case 'extraCargo':
      activeEffects.extraCargo = true;
      cargo.capacity = GAME_CONFIG.extraCargoCapacity;
      showFeedback('Extra laadruimte!');
      sounds.powerupCaught();
      break;
    case 'magnet':
      activeEffects.magnetMs = GAME_CONFIG.magnetDuration;
      showFeedback('Magneet actief!');
      sounds.powerupCaught();
      break;
    case 'slowMotion':
      activeEffects.slowMotionMs = GAME_CONFIG.slowMotionDuration;
      showFeedback('Tijdvertrager actief!');
      sounds.powerupCaught();
      break;
    case 'extraLife':
      if (lives < GAME_CONFIG.maximumLives) {
        lives += 1;
        showFeedback('Extra leven!');
      } else {
        showFeedback('Levens al vol.');
      }
      sounds.powerupCaught();
      break;
    case 'doubleScore':
      activeEffects.doubleScore = true;
      showFeedback('Dubbele score!');
      sounds.powerupCaught();
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

  // Een grote taak mag alleen spawnen (en hieronder: gevangen worden) als er nu
  // ergens in de week nog plek voor is. Zo kan de speler nooit vastlopen door pech
  // in de taakvolgorde — alleen nog door eigen planningskeuzes.
  const canFitLargeTask = canPlaceInAnyDay(weekPlanning, { slots: 2 });

  // Hoe voller de week, hoe langer de verplichte afkoelperiode tussen grote taken —
  // richting het einde van een level dus geen 2 grote taken snel na elkaar.
  const weekFillRatio = totalFilledSlots(weekPlanning) / GAME_CONFIG.totalWeekSlots;
  const largeTaskMinGapMs = GAME_CONFIG.largeTaskMinGapMs + weekFillRatio * GAME_CONFIG.largeTaskEndgameExtraGapMs;

  updateTasks(
    taskSpawner,
    deltaSeconds,
    playAreaHeight,
    levelSettings.taskSpawnInterval,
    levelSettings.taskFallSpeed,
    levelSettings.largeTasksEnabled && canFitLargeTask,
    largeTaskMinGapMs,
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

  if (damageFlashMs > 0) {
    damageFlashMs = Math.max(0, damageFlashMs - deltaSeconds * 1000);
  }

  if (shakeTimerMs > 0) {
    shakeTimerMs = Math.max(0, shakeTimerMs - deltaSeconds * 1000);
    if (shakeTimerMs === 0) shakeDayIndex = -1;
  }

  for (const popup of scorePopups) {
    popup.y -= 40 * deltaSeconds;
    popup.ms -= deltaSeconds * 1000;
  }
  scorePopups = scorePopups.filter((popup) => popup.ms > 0);

  taskSpawner.tasks = taskSpawner.tasks.filter((task) => {
    if (!rectsOverlap(player, task)) return true;
    if (!hasRoomFor(cargo, task)) return true; // laadruimte vol: taak valt door, niet gevangen
    if (task.slots === 2 && !canFitLargeTask) return true; // past nergens meer: niet vangen, geen straf

    addToCargo(cargo, task);
    caughtCount += 1;
    const catchPoints = task.slots === 2 ? GAME_CONFIG.scoreCatchLargeTask : GAME_CONFIG.scoreCatchSmallTask;
    addScore(catchPoints);
    (task.slots === 2 ? sounds.catchLarge : sounds.catchSmall)();
    addScorePopup(task.x + task.width / 2, task.y, `+${catchPoints}`);
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
        sounds.shield();
        return false;
      }

      sounds.meteorHit();
      loseLife(); // een meteoriet kost 1 leven
      if (!isGameOver) {
        invulnerableMs = GAME_CONFIG.invulnerabilityDuration;
      }
      return false;
    });
  }
}

function drawButton(rect, label) {
  ctx.fillStyle = '#10a37f';
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px \'Inria Sans\', sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, rect.x + rect.width / 2, rect.y + rect.height / 2 + 6);
}

function renderStartScreen() {
  ctx.fillStyle = '#0b1220';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 28px \'Inria Sans\', sans-serif';
  ctx.fillText('Planeten Planner', canvas.width / 2, 140);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '15px \'Inria Sans\', sans-serif';
  const lines = ['Beweeg met ← en →', 'Vang taken', 'Ontwijk meteorieten', 'Plan met 1 t/m 5'];
  lines.forEach((line, i) => ctx.fillText(line, canvas.width / 2, 190 + i * 22));

  drawButton(START_BUTTON, 'Start');
}

function renderPauseOverlay() {
  ctx.fillStyle = 'rgba(5, 7, 13, 0.85)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 26px \'Inria Sans\', sans-serif';
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
  ctx.font = 'bold 12px \'Inria Sans\', sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.fillText(badges.join('   '), canvas.width / 2, 80);
}

function renderHud() {
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px \'Inria Sans\', sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Fase 19: level ${currentLevel}`, canvas.width / 2, 20);
  ctx.fillText(`Score: ${score}  Week: ${totalFilledSlots(weekPlanning)}/${GAME_CONFIG.totalWeekSlots}`, canvas.width / 2, 40);

  if (feedbackTimerMs > 0) {
    ctx.fillStyle = '#38bdf8';
    ctx.font = '13px \'Inria Sans\', sans-serif';
    ctx.fillText(feedbackMessage, canvas.width / 2, 60);
  }

  renderActiveEffects();
  renderCargo(ctx, cargo, canvas.width);

  ctx.textAlign = 'left';
  ctx.font = 'bold 16px \'Inria Sans\', sans-serif';
  ctx.fillStyle = '#ef4444';
  ctx.fillText(`Levens: ${'❤'.repeat(lives)}${'♡'.repeat(GAME_CONFIG.maximumLives - lives)}`, 12, 20);

  if (gameMode === 'playing') {
    ctx.fillStyle = '#334155';
    ctx.fillRect(PAUSE_ICON_BUTTON.x, PAUSE_ICON_BUTTON.y, PAUSE_ICON_BUTTON.width, PAUSE_ICON_BUTTON.height);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px \'Inria Sans\', sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⏸ Pauze', PAUSE_ICON_BUTTON.x + PAUSE_ICON_BUTTON.width / 2, PAUSE_ICON_BUTTON.y + 15);
  }

  ctx.fillStyle = '#334155';
  ctx.fillRect(MUTE_ICON_BUTTON.x, MUTE_ICON_BUTTON.y, MUTE_ICON_BUTTON.width, MUTE_ICON_BUTTON.height);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '11px \'Inria Sans\', sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    getIsMuted() ? 'Geluid: uit' : 'Geluid: aan',
    MUTE_ICON_BUTTON.x + MUTE_ICON_BUTTON.width / 2,
    MUTE_ICON_BUTTON.y + 15
  );
}

function renderScorePopups() {
  ctx.textAlign = 'center';
  ctx.font = 'bold 13px \'Inria Sans\', sans-serif';
  for (const popup of scorePopups) {
    ctx.globalAlpha = Math.max(0, popup.ms / 700);
    ctx.fillStyle = popup.color;
    ctx.fillText(popup.text, popup.x, popup.y);
  }
  ctx.globalAlpha = 1;
}

function renderGameOverScreen() {
  ctx.fillStyle = 'rgba(5, 7, 13, 0.9)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 32px \'Inria Sans\', sans-serif';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 110);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '16px \'Inria Sans\', sans-serif';
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

  ctx.fillStyle = '#050a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const spaceGradient = ctx.createLinearGradient(0, 0, 0, playAreaHeight);
  spaceGradient.addColorStop(0, '#0c1a3d');
  spaceGradient.addColorStop(1, '#050a1a');
  ctx.fillStyle = spaceGradient;
  ctx.fillRect(0, 0, canvas.width, playAreaHeight);
  renderStarfield();

  renderTasks(ctx, taskSpawner);
  renderMeteors(ctx, meteorSpawner);
  renderPowerups(ctx, powerupSpawner);
  renderScorePopups();
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

  const shakeOffsetX = shakeTimerMs > 0 ? Math.sin(shakeTimerMs / 20) * 10 : 0;
  renderWeekPlanning(ctx, weekPlanning, 0, playAreaHeight, canvas.width, WEEKPLANNING_PANEL_HEIGHT, {
    dayIndex: shakeDayIndex,
    offsetX: shakeOffsetX
  });

  if (isShowingLevelSummary && completedWeekSnapshot) {
    renderWeekSummary(ctx, completedWeekSnapshot, completedLevelNumber, canvas.width, canvas.height);
  }

  if (damageFlashMs > 0) {
    ctx.fillStyle = `rgba(239, 68, 68, ${(damageFlashMs / 150) * 0.35})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
