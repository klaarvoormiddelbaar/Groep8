// Vallende schooltaken.
// Fase 3: alleen kleine taken (1 taakplek). Grote taken volgen in fase 4.

const TASK_LABELS = ['Engels', 'Lezen', 'Geschiedenis', 'Biologie', 'Wiskunde', 'Huiswerk', 'Woordjes leren'];
const SMALL_TASK_SIZE = 44;

function randomLabel() {
  return TASK_LABELS[Math.floor(Math.random() * TASK_LABELS.length)];
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
    label: randomLabel(),
    fallSpeed
  });
}

export function updateTasks(spawner, deltaSeconds, canvasHeight, spawnIntervalMs, fallSpeed, onMissed) {
  spawner.spawnTimerMs += deltaSeconds * 1000;
  if (spawner.spawnTimerMs >= spawnIntervalMs) {
    spawner.spawnTimerMs = 0;
    spawnSmallTask(spawner, fallSpeed);
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
    ctx.fillStyle = '#facc15';
    ctx.fillRect(task.x, task.y, task.width, task.height);

    ctx.fillStyle = '#1f2937';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(task.label, task.x + task.width / 2, task.y + task.height / 2 + 3);
  }
}
