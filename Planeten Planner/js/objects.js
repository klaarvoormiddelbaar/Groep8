// Vallende schooltaken.
// Fase 4: kleine taken (1 taakplek) en grote taken (2 taakplekken).

import { THEME } from './theme.js';
import { drawRoundedRect } from './canvasUtils.js';

// Alleen deze 6 vakken, altijd als afkorting, zodat in één oogopslag te zien is
// om welk vak het gaat: kleine taak = huiswerk, grote taak = een toets leren.
const SUBJECT_ABBREVIATIONS = {
  Nederlands: 'NE',
  Engels: 'EN',
  Wiskunde: 'WI',
  Biologie: 'BI',
  Geschiedenis: 'GS',
  Aardrijkskunde: 'AK'
};
const SUBJECTS = Object.values(SUBJECT_ABBREVIATIONS);

const SMALL_TASK_SIZE = 59; // 10% kleiner
const LARGE_TASK_SIZE = 86; // 10% kleiner
const LARGE_TASK_CHANCE = 0.25;

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function createTaskSpawner(canvasWidth) {
  return {
    tasks: [],
    spawnTimerMs: 0,
    // Hoog begingetal zodat de allereerste grote taak niet onnodig wordt tegengehouden.
    timeSinceLastLargeMs: Infinity,
    canvasWidth
  };
}

export function spawnSmallTask(spawner, fallSpeed) {
  const x = Math.random() * (spawner.canvasWidth - SMALL_TASK_SIZE);
  const subject = randomFrom(SUBJECTS);
  spawner.tasks.push({
    x,
    y: -SMALL_TASK_SIZE,
    width: SMALL_TASK_SIZE,
    height: SMALL_TASK_SIZE,
    slots: 1,
    subject,
    label: `${subject} huiswerk`,
    fallSpeed
  });
}

export function spawnLargeTask(spawner, fallSpeed) {
  const x = Math.random() * (spawner.canvasWidth - LARGE_TASK_SIZE);
  const subject = randomFrom(SUBJECTS);
  spawner.tasks.push({
    x,
    y: -LARGE_TASK_SIZE,
    width: LARGE_TASK_SIZE,
    height: LARGE_TASK_SIZE,
    slots: 2,
    subject,
    label: `leren toets ${subject}`,
    fallSpeed
  });
}

// minGapBetweenLargeMs voorkomt dat 2 grote taken vlak na elkaar spawnen — hoe voller
// de week, hoe groter die afkoelperiode (game.js koppelt dit aan het weekvulpercentage).
export function spawnRandomTask(spawner, fallSpeed, largeTasksEnabled, minGapBetweenLargeMs) {
  const canSpawnLarge = largeTasksEnabled && spawner.timeSinceLastLargeMs >= minGapBetweenLargeMs;
  if (canSpawnLarge && Math.random() < LARGE_TASK_CHANCE) {
    spawnLargeTask(spawner, fallSpeed);
    spawner.timeSinceLastLargeMs = 0;
  } else {
    spawnSmallTask(spawner, fallSpeed);
  }
}

// speedMultiplier schaalt de beweging van ALLE taken deze frame (ook al vallende),
// zodat de tijdvertrager-power-up direct effect heeft en er na afloop niets 'nasleept'.
export function updateTasks(spawner, deltaSeconds, canvasHeight, spawnIntervalMs, fallSpeed, largeTasksEnabled, minGapBetweenLargeMs, speedMultiplier, onMissed) {
  spawner.spawnTimerMs += deltaSeconds * 1000;
  spawner.timeSinceLastLargeMs += deltaSeconds * 1000;
  if (spawner.spawnTimerMs >= spawnIntervalMs) {
    spawner.spawnTimerMs = 0;
    spawnRandomTask(spawner, fallSpeed, largeTasksEnabled, minGapBetweenLargeMs);
  }

  for (const task of spawner.tasks) {
    task.y += task.fallSpeed * speedMultiplier * deltaSeconds;
  }

  spawner.tasks = spawner.tasks.filter((task) => {
    if (task.y > canvasHeight) {
      onMissed(task);
      return false;
    }
    return true;
  });
}

// Afgeronde kaart, met een kleine 'oor' bovenaan zodat het als een opgaveblaadje oogt.
// Alleen nog nodig als de echte afbeelding niet laadt.
function drawTaskCard(ctx, task, fillColor, borderColor) {
  const { x, y, width, height } = task;
  const radius = 6;

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();

  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = task.slots === 2 ? 3 : 2;
  ctx.stroke();
}

// Klein vak-pilletje onderaan de taak — dezelfde badge-taal als de dag-tags in de
// weekplanning. Dit is de enige plek waar je tijdens het vallen kunt zien om welk
// vak het gaat, want de afbeelding zelf toont geen tekst.
function renderSubjectBadge(ctx, task, isLarge) {
  const badgeHeight = 15;
  const paddingX = 5;

  ctx.font = 'bold 9px \'Inria Sans\', sans-serif';
  const textWidth = ctx.measureText(task.subject).width;
  const badgeWidth = textWidth + paddingX * 2;
  const badgeX = task.x + task.width / 2 - badgeWidth / 2;
  const badgeY = task.y + task.height - badgeHeight + 4; // licht overlappend met de onderkant

  drawRoundedRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, badgeHeight / 2, {
    fill: isLarge ? THEME.color.accentAmber : THEME.color.accentBlue,
    stroke: 'rgba(7, 10, 20, 0.35)',
    strokeWidth: 1
  });

  ctx.textAlign = 'center';
  ctx.fillStyle = isLarge ? THEME.color.bgDeep : '#ffffff';
  ctx.fillText(task.subject, task.x + task.width / 2, badgeY + badgeHeight / 2 + 3);
}

export function renderTasks(ctx, spawner, smallImage = null, largeImage = null) {
  for (const task of spawner.tasks) {
    const isLarge = task.slots === 2;
    const image = isLarge ? largeImage : smallImage;

    if (image) {
      ctx.drawImage(image, task.x, task.y, task.width, task.height);
    } else {
      drawTaskCard(ctx, task, isLarge ? THEME.color.accentAmber : THEME.color.accentBlue, isLarge ? '#b45309' : '#2f5fc9');
    }

    renderSubjectBadge(ctx, task, isLarge);
  }
}
