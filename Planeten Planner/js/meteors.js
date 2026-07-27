// Meteorieten: vallende gevaarobjecten, visueel duidelijk anders dan taken
// (onregelmatige rotsvorm i.p.v. de vierkante taakkaartjes).

const METEOR_RADIUS = 40;
const METEOR_POINT_COUNT = 9;

// Genereert een vaste, onregelmatige veelhoek (per meteoriet één keer, niet elke frame).
function createRockShape() {
  const offsets = [];
  for (let i = 0; i < METEOR_POINT_COUNT; i++) {
    offsets.push(0.7 + Math.random() * 0.35);
  }
  return offsets;
}

export function createMeteorSpawner(canvasWidth) {
  return {
    meteors: [],
    spawnTimerMs: 0,
    canvasWidth
  };
}

export function spawnMeteor(spawner, fallSpeed) {
  const x = METEOR_RADIUS + Math.random() * (spawner.canvasWidth - METEOR_RADIUS * 2);
  spawner.meteors.push({
    x,
    y: -METEOR_RADIUS,
    radius: METEOR_RADIUS,
    fallSpeed,
    rockShape: createRockShape(),
    spinOffset: Math.random() * Math.PI * 2
  });
}

// speedMultiplier schaalt de beweging van ALLE meteorieten deze frame, zie objects.js.
export function updateMeteors(spawner, deltaSeconds, canvasHeight, spawnIntervalMs, fallSpeed, speedMultiplier) {
  spawner.spawnTimerMs += deltaSeconds * 1000;
  if (spawner.spawnTimerMs >= spawnIntervalMs) {
    spawner.spawnTimerMs = 0;
    spawnMeteor(spawner, fallSpeed);
  }

  for (const meteor of spawner.meteors) {
    meteor.y += meteor.fallSpeed * speedMultiplier * deltaSeconds;
  }

  spawner.meteors = spawner.meteors.filter((meteor) => meteor.y - meteor.radius <= canvasHeight);
}

export function renderMeteors(ctx, spawner) {
  for (const meteor of spawner.meteors) {
    const pointCount = meteor.rockShape.length;
    const spin = meteor.spinOffset + meteor.y / 90; // trage rotatie tijdens het vallen

    ctx.beginPath();
    for (let i = 0; i <= pointCount; i++) {
      const offset = meteor.rockShape[i % pointCount];
      const angle = spin + (i / pointCount) * Math.PI * 2;
      const px = meteor.x + Math.cos(angle) * meteor.radius * offset;
      const py = meteor.y + Math.sin(angle) * meteor.radius * offset;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();

    ctx.fillStyle = '#8a7f74';
    ctx.fill();
    ctx.strokeStyle = '#4a3f35';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Kraters voor extra textuur.
    ctx.fillStyle = 'rgba(74, 63, 53, 0.5)';
    ctx.beginPath();
    ctx.arc(meteor.x - meteor.radius * 0.25, meteor.y - meteor.radius * 0.15, meteor.radius * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(meteor.x + meteor.radius * 0.3, meteor.y + meteor.radius * 0.25, meteor.radius * 0.12, 0, Math.PI * 2);
    ctx.fill();
  }
}
