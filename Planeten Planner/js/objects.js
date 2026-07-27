// Vallende schooltaken.
// Fase 4: kleine taken (1 taakplek) en grote taken (2 taakplekken).

const SMALL_TASK_LABELS = ['Engels', 'Lezen', 'Geschiedenis', 'Biologie', 'Wiskunde', 'Huiswerk', 'Woordjes leren'];
const LARGE_TASK_LABELS = ['Leren voor toets', 'Presentatie voorbereiden', 'Groot project', 'Werkstuk maken'];

const SMALL_TASK_SIZE = 44;
const LARGE_TASK_SIZE = 64;
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

export function spawnRandomTask(spawner, fallSpeed) {
  if (Math.random() < LARGE_TASK_CHANCE) {
    spawnLargeTask(spawner, fallSpeed);
  } else {
    spawnSmallTask(spawner, fallSpeed);
  }
}

export function updateTasks(spawner, deltaSeconds, canvasHeight, spawnIntervalMs, fallSpeed, onMissed) {
  spawner.spawnTimerMs += deltaSeconds * 1000;
  if (spawner.spawnTimerMs >= spawnIntervalMs) {
    spawner.spawnTimerMs = 0;
    spawnRandomTask(spawner, fallSpeed);
  }

  for (const task of spawner.tasks) {
    task.y += task.fallSpeed * deltaSeconds;
  }

  spawner.tasks = spawner.tasks.filter((task) => {
    if (task.y > canvasHeight) {
      onMissed(task);
      return false;
    }
    return true;
  });
}

export function renderTasks(ctx, spawner) {
  for (const task of spawner.tasks) {
    const isLarge = task.slots === 2;

    ctx.fillStyle = isLarge ? '#fb923c' : '#facc15';
    ctx.fillRect(task.x, task.y, task.width, task.height);

    if (isLarge) {
      ctx.strokeStyle = '#7c2d12';
      ctx.lineWidth = 3;
      ctx.strokeRect(task.x, task.y, task.width, task.height);
    }

    ctx.fillStyle = '#1f2937';
    ctx.font = isLarge ? 'bold 10px sans-serif' : '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(task.label, task.x + task.width / 2, task.y + task.height / 2 + 3, task.width - 6);
  }
}
