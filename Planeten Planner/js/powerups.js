// De 6 power-ups: vallende objecten (spawn/val/render) plus de status van actieve effecten.
// Het TOEPASSEN van een effect (levens, laadruimte, score) gebeurt in game.js, omdat dat
// module andere systemen (cargo, score) al kent — hier staat alleen het power-up-object zelf.

export const POWERUP_TYPES = ['shield', 'extraCargo', 'magnet', 'slowMotion', 'extraLife', 'doubleScore'];

const POWERUP_SIZE = 45;

const POWERUP_STYLE = {
  shield: { color: '#38bdf8', label: 'Schild' },
  extraCargo: { color: '#a78bfa', label: '+Lading' },
  magnet: { color: '#f472b6', label: 'Magneet' },
  slowMotion: { color: '#22d3ee', label: 'Traag' },
  extraLife: { color: '#4ade80', label: '+Leven' },
  doubleScore: { color: '#facc15', label: 'x2' }
};

// Elk power-up-icoon heeft een eigen, herkenbare vorm (in wit) bovenop de gekleurde cirkel.
const POWERUP_ICONS = {
  shield(ctx, cx, cy, size) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    ctx.lineTo(cx + size * 0.75, cy - size * 0.45);
    ctx.lineTo(cx + size * 0.75, cy + size * 0.15);
    ctx.quadraticCurveTo(cx + size * 0.7, cy + size * 0.85, cx, cy + size);
    ctx.quadraticCurveTo(cx - size * 0.7, cy + size * 0.85, cx - size * 0.75, cy + size * 0.15);
    ctx.lineTo(cx - size * 0.75, cy - size * 0.45);
    ctx.closePath();
    ctx.fill();
  },
  extraCargo(ctx, cx, cy, size) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - size * 0.65, cy - size * 0.45, size * 1.3, size * 0.9);
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.65, cy - size * 0.05);
    ctx.lineTo(cx + size * 0.65, cy - size * 0.05);
    ctx.stroke();
  },
  magnet(ctx, cx, cy, size) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = size * 0.28;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy + size * 0.15, size * 0.5, Math.PI * 0.95, Math.PI * 2.05);
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(cx - size * 0.62, cy - size * 0.25, size * 0.24, size * 0.4);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(cx + size * 0.38, cy - size * 0.25, size * 0.24, size * 0.4);
  },
  slowMotion(ctx, cx, cy, size) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.65, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy - size * 0.45);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + size * 0.3, cy + size * 0.15);
    ctx.stroke();
  },
  extraLife(ctx, cx, cy, size) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + size * 0.55);
    ctx.bezierCurveTo(cx, cy + size * 0.2, cx - size * 0.75, cy + size * 0.1, cx - size * 0.75, cy - size * 0.25);
    ctx.bezierCurveTo(cx - size * 0.75, cy - size * 0.7, cx, cy - size * 0.6, cx, cy - size * 0.25);
    ctx.bezierCurveTo(cx, cy - size * 0.6, cx + size * 0.75, cy - size * 0.7, cx + size * 0.75, cy - size * 0.25);
    ctx.bezierCurveTo(cx + size * 0.75, cy + size * 0.1, cx, cy + size * 0.2, cx, cy + size * 0.55);
    ctx.closePath();
    ctx.fill();
  },
  doubleScore(ctx, cx, cy, size) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const outerAngle = -Math.PI / 2 + i * ((Math.PI * 2) / 5);
      const innerAngle = outerAngle + Math.PI / 5;
      const ox = cx + Math.cos(outerAngle) * size * 0.7;
      const oy = cy + Math.sin(outerAngle) * size * 0.7;
      const ix = cx + Math.cos(innerAngle) * size * 0.3;
      const iy = cy + Math.sin(innerAngle) * size * 0.3;
      if (i === 0) ctx.moveTo(ox, oy);
      else ctx.lineTo(ox, oy);
      ctx.lineTo(ix, iy);
    }
    ctx.closePath();
    ctx.fill();
  }
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
    const radius = item.width / 2;

    ctx.beginPath();
    ctx.fillStyle = style.color;
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    POWERUP_ICONS[item.type](ctx, cx, cy, radius * 0.7);
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
