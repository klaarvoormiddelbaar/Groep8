// De 6 power-ups: vallende objecten (spawn/val/render) plus de status van actieve effecten.
// Het TOEPASSEN van een effect (levens, laadruimte, score) gebeurt in game.js, omdat dat
// module andere systemen (cargo, score) al kent — hier staat alleen het power-up-object zelf.

export const POWERUP_TYPES = ['shield', 'extraCargo', 'magnet', 'slowMotion', 'extraLife', 'doubleScore'];

const POWERUP_SIZE = 30;

const POWERUP_STYLE = {
  shield: { color: '#38bdf8', label: 'Schild' },
  extraCargo: { color: '#a78bfa', label: '+Lading' },
  magnet: { color: '#f472b6', label: 'Magneet' },
  slowMotion: { color: '#22d3ee', label: 'Traag' },
  extraLife: { color: '#4ade80', label: '+Leven' },
  doubleScore: { color: '#facc15', label: 'x2' }
};

export function createPowerupSpawner(canvasWidth) {
  return { items: [], spawnTimerMs: 0, canvasWidth };
}

export function spawnRandomPowerup(spawner, fallSpeed) {
  const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
  const x = Math.random() * (spawner.canvasWidth - POWERUP_SIZE);
  spawner.items.push({
    type,
    x,
    y: -POWERUP_SIZE,
    width: POWERUP_SIZE,
    height: POWERUP_SIZE,
    fallSpeed
  });
}

export function updatePowerups(spawner, deltaSeconds, canvasHeight, spawnIntervalMs, fallSpeed) {
  spawner.spawnTimerMs += deltaSeconds * 1000;
  if (spawner.spawnTimerMs >= spawnIntervalMs) {
    spawner.spawnTimerMs = 0;
    spawnRandomPowerup(spawner, fallSpeed);
  }

  for (const item of spawner.items) {
    item.y += item.fallSpeed * deltaSeconds;
  }

  spawner.items = spawner.items.filter((item) => item.y <= canvasHeight);
}

export function renderPowerups(ctx, spawner) {
  for (const item of spawner.items) {
    const style = POWERUP_STYLE[item.type];
    const cx = item.x + item.width / 2;
    const cy = item.y + item.height / 2;

    ctx.beginPath();
    ctx.fillStyle = style.color;
    ctx.arc(cx, cy, item.width / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0b1220';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(style.label, cx, cy + 3);
  }
}

// ── Actieve effecten ─────────────────────────────────────────────────────

export function createActiveEffects() {
  return {
    hasShield: false, // blijft actief tot verbruikt, ook over levels heen
    extraCargo: false, // level-power-up: reset bij nieuw level
    magnetMs: 0, // tijdelijk: eindigt bij nieuw level
    slowMotionMs: 0, // tijdelijk: eindigt bij nieuw level
    doubleScore: false // level-power-up: reset bij nieuw level
  };
}

export function tickActiveEffects(effects, deltaSeconds) {
  if (effects.magnetMs > 0) {
    effects.magnetMs = Math.max(0, effects.magnetMs - deltaSeconds * 1000);
  }
  if (effects.slowMotionMs > 0) {
    effects.slowMotionMs = Math.max(0, effects.slowMotionMs - deltaSeconds * 1000);
  }
}

// Wordt aangeroepen bij levelvoltooiing: tijdelijke effecten eindigen, level-power-ups
// resetten. Het schild blijft ongemoeid (verdwijnt alleen door een botsing op te vangen).
export function resetLevelScopedEffects(effects) {
  effects.magnetMs = 0;
  effects.slowMotionMs = 0;
  effects.extraCargo = false;
  effects.doubleScore = false;
}
