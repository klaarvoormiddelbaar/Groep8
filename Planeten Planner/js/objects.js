// Vallende schooltaken.
// Fase 4: kleine taken (1 taakplek) en grote taken (2 taakplekken).

const SMALL_TASK_LABELS = ['Engels', 'Lezen', 'Geschiedenis', 'Biologie', 'Wiskunde', 'Huiswerk', 'Woordjes leren'];
const LARGE_TASK_LABELS = ['Leren voor toets', 'Presentatie voorbereiden', 'Groot project', 'Werkstuk maken'];

const SMALL_TASK_SIZE = 66;
const LARGE_TASK_SIZE = 96;
const LARGE_TASK_CHANCE = 0.25;

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function createTaskSpawner(canvasWidth) {
  return {
    tasks: [],
    spawnTimerMs: 0,
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

export function spawnRandomTask(spawner, fallSpeed, largeTasksEnabled) {
  if (largeTasksEnabled && Math.random() < LARGE_TASK_CHANCE) {
    spawnLargeTask(spawner, fallSpeed);
  } else {
    spawnSmallTask(spawner, fallSpeed);
  }
}

// speedMultiplier schaalt de beweging van ALLE taken deze frame (ook al vallende),
// zodat de tijdvertrager-power-up direct effect heeft en er na afloop niets 'nasleept'.
export function updateTasks(spawner, deltaSeconds, canvasHeight, spawnIntervalMs, fallSpeed, largeTasksEnabled, speedMultiplier, onMissed) {
  spawner.spawnTimerMs += deltaSeconds * 1000;
  if (spawner.spawnTimerMs >= spawnIntervalMs) {
    spawner.spawnTimerMs = 0;
    spawnRandomTask(spawner, fallSpeed, largeTasksEnabled);
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

export function renderTasks(ctx, spawner) {
  for (const task of spawner.tasks) {
    const isLarge = task.slots === 2;

    drawTaskCard(ctx, task, isLarge ? '#f59e0b' : '#fde68a', isLarge ? '#b45309' : '#ca8a04');

    ctx.fillStyle = '#1f2937';
    ctx.font = isLarge ? 'bold 10px \'Inria Sans\', sans-serif' : '10px \'Inria Sans\', sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(task.label, task.x + task.width / 2, task.y + task.height / 2 + 3, task.width - 6);
  }
}
