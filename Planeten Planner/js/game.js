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
import { loadAssets, getImage } from './assets.js';
import { THEME } from './theme.js';
import { drawRoundedRect, drawPillButton, drawStatCard } from './canvasUtils.js';

// Onderin het scherm staat een vast weekplanning-paneel; het speelveld (vallende
// objecten + raket) gebruikt de resterende hoogte erboven. Iets hoger dan voorheen
// zodat de dagpanelen ruimte hebben voor het planeetje + naam in de moderne stijl.
const WEEKPLANNING_PANEL_HEIGHT = 155; // was 145, iets hoger voor de grotere dag-tekst

// Alle spellogica en tekencode werkt in deze vaste 'logische' resolutie. Het echte
// canvas-oppervlak (canvas.width/height) wordt hieronder groter gezet op basis van
// devicePixelRatio, zodat het scherp blijft op Retina/HiDPI schermen — zonder de
// devicePixelRatio-factor zou de browser het canvas wazig uitrekken naar zijn
// weergavegrootte, wat vooral bij kleine, gedetailleerde afbeeldingen (planeten,
// levens) opviel als een "onscherpe" look.
const LOGICAL_WIDTH = GAME_CONFIG.canvasWidth;
const LOGICAL_HEIGHT = GAME_CONFIG.canvasHeight;

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Alleen de canvas-attributen (het intrinsieke, tekenbare oppervlak) worden vergroot.
// De CSS (width/height: auto + max-width/max-height) bepaalt zelf de weergavegrootte
// op basis van die intrinsieke afmetingen, en behoudt daarbij automatisch de
// beeldverhouding — precies zoals bij een <img>. Zelf een CSS-breedte/hoogte zetten
// zou die aspect-ratio-berekening juist doorbreken.
const devicePixelRatioValue = Math.max(1, window.devicePixelRatio || 1);
canvas.width = LOGICAL_WIDTH * devicePixelRatioValue;
canvas.height = LOGICAL_HEIGHT * devicePixelRatioValue;
ctx.scale(devicePixelRatioValue, devicePixelRatioValue);
ctx.imageSmoothingQuality = 'high';

const playAreaHeight = LOGICAL_HEIGHT - WEEKPLANNING_PANEL_HEIGHT;

// Kaarten + hun knop worden hier samen gedefinieerd (knop-positie afgeleid van de
// kaart-onderkant) zodat lay-outwijzigingen aan één kant nooit de knop laten
// losraken van de kaart.
const START_CARD = { width: 440, height: 400, x: LOGICAL_WIDTH / 2 - 220, y: 60 };
const START_BUTTON = { x: LOGICAL_WIDTH / 2 - 100, y: START_CARD.y + START_CARD.height - 80, width: 200, height: 56 };

const PAUSE_CARD = { width: 320, height: 170, x: LOGICAL_WIDTH / 2 - 160, y: LOGICAL_HEIGHT / 2 - 95 };
const RESUME_BUTTON = { x: LOGICAL_WIDTH / 2 - 100, y: PAUSE_CARD.y + PAUSE_CARD.height - 74, width: 200, height: 56 };

const GAME_OVER_CARD = { width: 420, height: 380, x: LOGICAL_WIDTH / 2 - 210, y: LOGICAL_HEIGHT / 2 - 190 };
const RESTART_BUTTON = { x: LOGICAL_WIDTH / 2 - 100, y: GAME_OVER_CARD.y + GAME_OVER_CARD.height - 80, width: 200, height: 56 };

// Pauze + geluid staan nu als een net rijtje ONDER de levens (i.p.v. half ernaast,
// half eronder) zodat de linkerkolom van de HUD een nette rechte blok vormt in
// plaats van een trapje.
const PAUSE_ICON_BUTTON = { x: 20, y: 58, width: 64, height: 24 };
const MUTE_ICON_BUTTON = { x: 92, y: 58, width: 100, height: 24 };
const HUD_PANEL = { x: 8, y: 6, width: LOGICAL_WIDTH - 16, height: 102 };

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

// Tekent een afbeelding zodat hij het doelvlak volledig vult ('cover'), gecentreerd
// bijgesneden — net als CSS background-size: cover.
function drawImageCover(image, dx, dy, dw, dh) {
  const scale = Math.max(dw / image.width, dh / image.height);
  const sw = dw / scale;
  const sh = dh / scale;
  const sx = (image.width - sw) / 2;
  const sy = (image.height - sh) / 2;
  ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
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

const player = createPlayer(LOGICAL_WIDTH, playAreaHeight);
initPlayerInput();

const taskSpawner = createTaskSpawner(LOGICAL_WIDTH);
const meteorSpawner = createMeteorSpawner(LOGICAL_WIDTH);
const powerupSpawner = createPowerupSpawner(LOGICAL_WIDTH);
const activeEffects = createActiveEffects();

// 'loading' | 'start' | 'playing' | 'paused' | 'gameOver'
let gameMode = 'loading';

let cargo;
let weekPlanning;
let currentLevel;
let levelSettings;

let isShowingLevelSummary;
let completedWeekSnapshot;
let completedLevelNumber;
let completedLevelScoreGain;
let completedWeeksCount;
let weekSummaryButtonRect;

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

  player.x = LOGICAL_WIDTH / 2 - player.width / 2;

  isShowingLevelSummary = false;
  completedWeekSnapshot = null;
  completedLevelNumber = 0;
  completedLevelScoreGain = 0;
  completedWeeksCount = 0;
  weekSummaryButtonRect = null;

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
gameMode = 'loading'; // toon eerst een laadscherm terwijl de afbeeldingen ophalen

loadAssets().then(() => {
  // Alleen naar het titelscherm als er niet ondertussen al iets anders gebeurde
  // (kan in theorie niet, maar voorkomt dat een trage lading een actieve sessie overschrijft).
  if (gameMode === 'loading') {
    gameMode = 'start';
  }
});

function completeLevel() {
  // Bewaar een referentie naar de voltooide planning vóórdat er een nieuwe,
  // lege planning voor in de plaats komt — zo blijft het overzicht correct
  // terwijl de speler alweer met een schone week kan beginnen.
  completedWeekSnapshot = weekPlanning;
  completedLevelNumber = currentLevel;
  completedLevelScoreGain = GAME_CONFIG.scoreLevelComplete + lives * GAME_CONFIG.scoreBonusPerRemainingLife;
  completedWeeksCount += 1;

  addScore(completedLevelScoreGain);

  currentLevel += 1;
  levelSettings = getLevelSettings(currentLevel);
  weekPlanning = createWeekPlanning(GAME_CONFIG.numberOfDays, GAME_CONFIG.slotsPerDay);
  cargo = createCargo(GAME_CONFIG.cargoCapacity); // reset ook extra laadruimte automatisch
  resetLevelScopedEffects(activeEffects); // tijdelijke effecten eindigen, level-power-ups resetten

  // Geen automatische timer meer: het weekoverzicht blijft staan tot de speler
  // zelf op 'Volgende week' klikt of spatie drukt.
  isShowingLevelSummary = true;
  sounds.levelComplete();
}

function endLevelSummary() {
  isShowingLevelSummary = false;
  weekSummaryButtonRect = null;
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

  const dayColumnWidth = LOGICAL_WIDTH / GAME_CONFIG.numberOfDays;
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
  const scaleX = LOGICAL_WIDTH / rect.width;
  const scaleY = LOGICAL_HEIGHT / rect.height;
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
  if (gameMode === 'playing' && isShowingLevelSummary && weekSummaryButtonRect && hitTest(px, py, weekSummaryButtonRect)) {
    endLevelSummary();
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
    return; // gameplay staat stil; wacht op de speler (knop of spatie)
  }

  updatePlayer(player, deltaSeconds, LOGICAL_WIDTH);

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
  drawPillButton(ctx, rect, label);
}

// Klein glazen "chip"-knopje voor pauze/geluid, zelfde afgeronde taal als de rest.
// icon: optionele asset-sleutel (iOS-emoji-pack) i.p.v. Unicode-emoji in het label.
function drawGhostButton(rect, label, { active = false, icon = null } = {}) {
  drawRoundedRect(ctx, rect.x, rect.y, rect.width, rect.height, rect.height / 2, {
    fill: active ? THEME.color.accentBlueSoft : THEME.color.surface,
    stroke: active ? THEME.color.accentBlue : THEME.color.border,
    strokeWidth: 1.5,
    shadow: THEME.shadow.chip
  });

  ctx.fillStyle = active ? THEME.color.accentBlue : THEME.color.textMuted;
  ctx.font = '11px \'Inria Sans\', sans-serif';

  const iconImage = icon ? getImage(icon) : null;
  if (iconImage) {
    const iconSize = 13;
    const textWidth = ctx.measureText(label).width;
    const groupWidth = iconSize + 5 + textWidth;
    const startX = rect.x + rect.width / 2 - groupWidth / 2;
    ctx.drawImage(iconImage, startX, rect.y + rect.height / 2 - iconSize / 2, iconSize, iconSize);
    ctx.textAlign = 'left';
    ctx.fillText(label, startX + iconSize + 5, rect.y + rect.height / 2 + 4);
  } else {
    ctx.textAlign = 'center';
    ctx.fillText(label, rect.x + rect.width / 2, rect.y + rect.height / 2 + 4);
  }
}

function renderLoadingScreen() {
  ctx.fillStyle = THEME.color.bgDeep;
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.textMuted;
  ctx.font = '16px \'Inria Sans\', sans-serif';
  ctx.fillText('Laden...', LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2);
}

function renderStartScreen() {
  ctx.fillStyle = THEME.color.bgDeep;
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  drawRoundedRect(ctx, START_CARD.x, START_CARD.y, START_CARD.width, START_CARD.height, THEME.radius.lg, {
    fill: THEME.color.surface,
    stroke: THEME.color.border,
    strokeWidth: 1.5,
    shadow: THEME.shadow.card
  });

  const centerX = LOGICAL_WIDTH / 2;

  const rocketImage = getImage('rocket');
  const rocketWidth = 46;
  const rocketHeight = rocketImage ? Math.round(rocketWidth * (rocketImage.height / rocketImage.width)) : 60;
  const rocketTop = START_CARD.y + 24;
  if (rocketImage) {
    ctx.drawImage(rocketImage, centerX - rocketWidth / 2, rocketTop, rocketWidth, rocketHeight);
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.accentAmber;
  ctx.font = 'bold 26px \'Inria Sans\', sans-serif';
  ctx.fillText('Planeten Planner', centerX, rocketTop + rocketHeight + 30);

  ctx.fillStyle = THEME.color.textMuted;
  ctx.font = '13px \'Inria Sans\', sans-serif';
  ctx.fillText('Vang taken, plan je week en voltooi elk level.', centerX, rocketTop + rocketHeight + 52);

  // Instructierijen: icoon + tekst, links uitgelijnd binnen een vast blok zodat
  // het als een korte handleiding leest in plaats van een blok gecentreerde tekst.
  // Waar een echte asset bestaat (taak/meteoriet/planeet) tonen we die in plaats
  // van een emoji, zodat de speler de spullen herkent vóórdat hij ze in het spel
  // tegenkomt.
  const instructions = [
    { images: ['iconArrowLeft', 'iconArrowRight'], text: 'Beweeg de raket' },
    { images: ['taskSmall'], text: 'Vang taken die naar beneden vallen' },
    { images: ['meteor'], text: 'Ontwijk meteorieten' },
    { images: ['planetMonday'], text: 'Plan de volgende taak op een dag' }
  ];
  const instructionsWidth = 300;
  const instructionsX = centerX - instructionsWidth / 2;
  const iconSize = 20;
  let instructionY = rocketTop + rocketHeight + 84;

  for (const item of instructions) {
    let iconX = instructionsX;
    for (const key of item.images) {
      const iconImage = getImage(key);
      if (iconImage) {
        ctx.drawImage(iconImage, iconX, instructionY - iconSize + 5, iconSize, iconSize);
      }
      iconX += iconSize - 4; // lichte overlap tussen ⬅ en ➡ zodat het als één pictogram leest
    }

    ctx.textAlign = 'left';
    ctx.font = '13px \'Inria Sans\', sans-serif';
    ctx.fillStyle = THEME.color.textPrimary;
    ctx.fillText(item.text, instructionsX + 40, instructionY);

    instructionY += 28;
  }

  drawButton(START_BUTTON, 'Start');
}

function renderPauseOverlay() {
  ctx.fillStyle = 'rgba(7, 10, 20, 0.55)';
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  drawRoundedRect(ctx, PAUSE_CARD.x, PAUSE_CARD.y, PAUSE_CARD.width, PAUSE_CARD.height, THEME.radius.lg, {
    fill: THEME.color.surfaceStrong,
    stroke: THEME.color.border,
    strokeWidth: 1.5,
    shadow: THEME.shadow.card
  });

  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.textPrimary;
  ctx.font = 'bold 20px \'Inria Sans\', sans-serif';
  ctx.fillText('Gepauzeerd', LOGICAL_WIDTH / 2, PAUSE_CARD.y + 50);

  drawButton(RESUME_BUTTON, 'Verder');
}

// Kleine pil-badges met een echt icoon (i.p.v. Unicode-emoji) + tekst, gecentreerd
// op een rijtje — dezelfde pil-taal als de rest van de HUD.
function renderActiveEffects() {
  const badges = [];
  if (activeEffects.hasShield) badges.push({ icon: 'iconShield', text: 'Schild' });
  if (activeEffects.extraCargo) badges.push({ icon: 'iconPackage', text: '+Lading' });
  if (activeEffects.magnetMs > 0) badges.push({ icon: 'iconMagnet', text: `${Math.ceil(activeEffects.magnetMs / 1000)}s` });
  if (activeEffects.slowMotionMs > 0) badges.push({ icon: 'iconSnail', text: `${Math.ceil(activeEffects.slowMotionMs / 1000)}s` });
  if (activeEffects.doubleScore) badges.push({ icon: 'iconSparkles', text: 'x2 score' });

  if (badges.length === 0) return;

  const badgeHeight = 22;
  const iconSize = 13;
  const paddingX = 8;
  const gap = 8;

  ctx.font = 'bold 11px \'Inria Sans\', sans-serif';
  const widths = badges.map((badge) => paddingX * 2 + iconSize + 5 + ctx.measureText(badge.text).width);
  const totalWidth = widths.reduce((sum, width) => sum + width, 0) + gap * (badges.length - 1);

  let badgeX = LOGICAL_WIDTH / 2 - totalWidth / 2;
  const badgeY = 80;

  badges.forEach((badge, i) => {
    const width = widths[i];
    drawRoundedRect(ctx, badgeX, badgeY, width, badgeHeight, badgeHeight / 2, {
      fill: THEME.color.accentAmberSoft,
      stroke: THEME.color.accentAmber,
      strokeWidth: 1
    });

    const icon = getImage(badge.icon);
    if (icon) {
      ctx.drawImage(icon, badgeX + paddingX, badgeY + (badgeHeight - iconSize) / 2, iconSize, iconSize);
    }

    ctx.textAlign = 'left';
    ctx.fillStyle = THEME.color.accentAmber;
    ctx.fillText(badge.text, badgeX + paddingX + iconSize + 5, badgeY + badgeHeight / 2 + 4);

    badgeX += width + gap;
  });
}

function renderLives() {
  ctx.textAlign = 'left';
  ctx.font = 'bold 13px \'Inria Sans\', sans-serif';
  ctx.fillStyle = THEME.color.textMuted;
  ctx.fillText('LEVENS', 20, 24);

  const lifeFullImage = getImage('lifeFull');
  const lifeEmptyImage = getImage('lifeEmpty');
  const iconSize = 20;
  const gap = 3;
  let iconX = 20;
  const iconY = 32;

  for (let i = 0; i < GAME_CONFIG.maximumLives; i++) {
    const isFilled = i < lives;
    const image = isFilled ? lifeFullImage : lifeEmptyImage;

    if (image) {
      ctx.drawImage(image, iconX, iconY, iconSize, iconSize);
    } else {
      // Val terug op een simpel getekend rondje i.p.v. een emoji-teken als de
      // levens-afbeelding onverhoopt niet laadt.
      ctx.beginPath();
      ctx.arc(iconX + iconSize / 2, iconY + iconSize / 2, iconSize / 2 - 2, 0, Math.PI * 2);
      ctx.fillStyle = isFilled ? THEME.color.accentRed : 'transparent';
      ctx.fill();
      ctx.strokeStyle = THEME.color.accentRed;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    iconX += iconSize + gap;
  }
}

function renderHud() {
  drawRoundedRect(ctx, HUD_PANEL.x, HUD_PANEL.y, HUD_PANEL.width, HUD_PANEL.height, THEME.radius.md, {
    fill: THEME.color.surface,
    stroke: THEME.color.border,
    strokeWidth: 1.5,
    shadow: THEME.shadow.chip
  });

  // Level-badge: een eigen pilletje i.p.v. kale tekst, zodat het als eerste
  // leesbare ding in de HUD opvalt.
  ctx.textAlign = 'center';
  ctx.font = 'bold 14px \'Inria Sans\', sans-serif';
  const levelText = `Level ${currentLevel}`;
  const levelPillWidth = ctx.measureText(levelText).width + 28;
  const levelPillHeight = 26;
  const levelPillX = LOGICAL_WIDTH / 2 - levelPillWidth / 2;
  const levelPillY = 8;

  drawRoundedRect(ctx, levelPillX, levelPillY, levelPillWidth, levelPillHeight, levelPillHeight / 2, {
    fill: THEME.color.accentBlueSoft,
    stroke: THEME.color.accentBlue,
    strokeWidth: 1.5,
    shadow: THEME.shadow.chip
  });
  ctx.fillStyle = THEME.color.accentBlue;
  ctx.fillText(levelText, LOGICAL_WIDTH / 2, levelPillY + levelPillHeight / 2 + 5);

  ctx.fillStyle = THEME.color.textMuted;
  ctx.font = '13px \'Inria Sans\', sans-serif';
  ctx.fillText(
    `Score ${score}  ·  Taak ${totalFilledSlots(weekPlanning)}/${GAME_CONFIG.totalWeekSlots}`,
    LOGICAL_WIDTH / 2,
    levelPillY + levelPillHeight + 20
  );

  if (feedbackTimerMs > 0) {
    ctx.fillStyle = THEME.color.accentBlue;
    ctx.font = '12px \'Inria Sans\', sans-serif';
    ctx.fillText(feedbackMessage, LOGICAL_WIDTH / 2, levelPillY + levelPillHeight + 40);
  }

  renderActiveEffects();
  renderCargo(ctx, cargo, LOGICAL_WIDTH - 16, 10, getImage('taskSmall'), getImage('taskLarge'), getImage('iconWarning'));

  renderLives();

  if (gameMode === 'playing') {
    drawGhostButton(PAUSE_ICON_BUTTON, 'Pauze', { icon: 'iconPause' });
  }

  drawGhostButton(MUTE_ICON_BUTTON, getIsMuted() ? 'Geluid: uit' : 'Geluid: aan', {
    active: !getIsMuted(),
    icon: 'iconSpeaker'
  });
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
  ctx.fillStyle = 'rgba(7, 10, 20, 0.6)';
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  drawRoundedRect(ctx, GAME_OVER_CARD.x, GAME_OVER_CARD.y, GAME_OVER_CARD.width, GAME_OVER_CARD.height, THEME.radius.lg, {
    fill: THEME.color.surfaceStrong,
    stroke: THEME.color.accentRedSoft,
    strokeWidth: 1.5,
    shadow: THEME.shadow.card
  });

  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.accentRed;
  ctx.font = 'bold 26px \'Inria Sans\', sans-serif';
  ctx.fillText('Game over', LOGICAL_WIDTH / 2, GAME_OVER_CARD.y + 50);

  ctx.fillStyle = THEME.color.textMuted;
  ctx.font = '13px \'Inria Sans\', sans-serif';
  ctx.fillText('Probeer het nog eens!', LOGICAL_WIDTH / 2, GAME_OVER_CARD.y + 74);

  // Cijfers als 2x2 stat-kaarten i.p.v. platte tekstregels, zodat ze in één
  // oogopslag opvallen.
  const stats = [
    ['Score', score],
    ['Hoogste level', currentLevel],
    ['Ingeplande taken', plannedCount],
    ['Voltooide weken', completedWeeksCount]
  ];
  const cardW = 170;
  const cardH = 64;
  const gap = 16;
  const gridX = LOGICAL_WIDTH / 2 - cardW - gap / 2;
  const gridY = GAME_OVER_CARD.y + 100;

  stats.forEach(([label, value], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    drawStatCard(ctx, gridX + col * (cardW + gap), gridY + row * (cardH + 14), cardW, cardH, label, value, {
      accent: THEME.color.accentRed
    });
  });

  drawButton(RESTART_BUTTON, 'Opnieuw spelen');
}

function render() {
  if (gameMode === 'loading') {
    renderLoadingScreen();
    return;
  }

  if (gameMode === 'start') {
    renderStartScreen();
    return;
  }

  ctx.fillStyle = '#050a1a';
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  const backgroundImage = getImage('background');
  if (backgroundImage) {
    drawImageCover(backgroundImage, 0, 0, LOGICAL_WIDTH, playAreaHeight);
  } else {
    const spaceGradient = ctx.createLinearGradient(0, 0, 0, playAreaHeight);
    spaceGradient.addColorStop(0, '#0c1a3d');
    spaceGradient.addColorStop(1, '#050a1a');
    ctx.fillStyle = spaceGradient;
    ctx.fillRect(0, 0, LOGICAL_WIDTH, playAreaHeight);
    renderStarfield();
  }

  renderTasks(ctx, taskSpawner, getImage('taskSmall'), getImage('taskLarge'));
  renderMeteors(ctx, meteorSpawner, getImage('meteor'));
  renderPowerups(ctx, powerupSpawner, {
    shield: getImage('powerupShield'),
    extraCargo: getImage('powerupExtraCargo'),
    magnet: getImage('powerupMagnet'),
    slowMotion: getImage('powerupSlowMotion'),
    extraLife: getImage('powerupExtraLife'),
    doubleScore: getImage('powerupDoubleScore')
  });
  renderScorePopups();
  renderPlayer(ctx, player, invulnerableMs > 0, getImage('rocket'));
  if (activeEffects.hasShield) {
    ctx.beginPath();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.arc(player.x + player.width / 2, player.y + player.height / 2, player.width / 2 + 8, 0, Math.PI * 2);
    ctx.stroke();
  }
  renderHud();

  ctx.strokeStyle = THEME.color.border;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, playAreaHeight);
  ctx.lineTo(LOGICAL_WIDTH, playAreaHeight);
  ctx.stroke();

  const shakeOffsetX = shakeTimerMs > 0 ? Math.sin(shakeTimerMs / 20) * 5 : 0;
  const planetImages = [
    getImage('planetMonday'),
    getImage('planetTuesday'),
    getImage('planetWednesday'),
    getImage('planetThursday'),
    getImage('planetFriday')
  ];
  renderWeekPlanning(
    ctx,
    weekPlanning,
    0,
    playAreaHeight,
    LOGICAL_WIDTH,
    WEEKPLANNING_PANEL_HEIGHT,
    { dayIndex: shakeDayIndex, offsetX: shakeOffsetX },
    planetImages
  );

  if (isShowingLevelSummary && completedWeekSnapshot) {
    weekSummaryButtonRect = renderWeekSummary(
      ctx,
      completedWeekSnapshot,
      completedLevelNumber,
      completedLevelScoreGain,
      lives,
      GAME_CONFIG.maximumLives,
      LOGICAL_WIDTH,
      LOGICAL_HEIGHT,
      planetImages,
      getImage('iconCheck')
    );
  }

  if (damageFlashMs > 0) {
    ctx.fillStyle = `rgba(242, 119, 122, ${(damageFlashMs / 150) * 0.22})`;
    ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
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
