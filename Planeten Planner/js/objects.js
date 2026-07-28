// Vallende schooltaken.
// Fase 4: kleine taken (1 taakplek) en grote taken (2 taakplekken).

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
const SMALL_TASK_LABELS = SUBJECTS.map((abbr) => `${abbr} huiswerk`);
const LARGE_TASK_LABELS = SUBJECTS.map((abbr) => `leren toets ${abbr}`);

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
  spawner.tasks.push({
    x,
    y: -SMALL_TASK_SIZE,
    width: SMALL_TASK_SIZE,
    height: SMALL_TASK_SIZE,
    slots: 1,
    label: randomFrom(SMALL_TASK_LABELS),
    fallSpeed
  });
}

export function spawnLargeTask(spawner, fallSpeed) {
  const x = Math.random() * (spawner.canvasWidth - LARGE_TASK_SIZE);
  spawner.tasks.push({
    x,
    y: -LARGE_TASK_SIZE,
    width: LARGE_TASK_SIZE,
    height: LARGE_TASK_SIZE,
    slots: 2,
    label: randomFrom(LARGE_TASK_LABELS),
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

export function renderTasks(ctx, spawner, smallImage = null, largeImage = null) {
  for (const task of spawner.tasks) {
    const isLarge = task.slots === 2;
    const image = isLarge ? largeImage : smallImage;

    if (image) {
      ctx.drawImage(image, task.x, task.y, task.width, task.height);
      continue;
    }

    drawTaskCard(ctx, task, isLarge ? '#f59e0b' : '#fde68a', isLarge ? '#b45309' : '#ca8a04');

    ctx.fillStyle = '#1f2937';
    ctx.font = isLarge ? 'bold 10px \'Inria Sans\', sans-serif' : '10px \'Inria Sans\', sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(task.label, task.x + task.width / 2, task.y + task.height / 2 + 3, task.width - 6);
  }
}
