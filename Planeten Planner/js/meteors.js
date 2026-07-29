// Meteorieten: vallende gevaarobjecten, visueel duidelijk anders dan taken
// (onregelmatige rotsvorm i.p.v. de vierkante taakkaartjes).

const METEOR_RADIUS = 27; // 10% kleiner
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

// Kiest een x buiten alle 'veilige zones' rond huidige taken (eerlijke spawns: een
// meteoriet mag nooit vlak naast een taak verschijnen). Als er na een paar pogingen
// geen vrije plek is (zeldzaam, bijv. het speelveld zit vol taken), spawnt de
// meteoriet toch — de doorlopende afstoot-check hieronder duwt 'm daarna alsnog
// weg zodra dat weer kan.
function pickSafeMeteorX(canvasWidth, radius, safeZones, safeZoneRadius) {
  const minX = radius;
  const maxX = canvasWidth - radius;
  if (safeZoneRadius <= 0 || safeZones.length === 0) {
    return minX + Math.random() * (maxX - minX);
  }

  for (let attempt = 0; attempt < 8; attempt++) {
    const x = minX + Math.random() * (maxX - minX);
    const conflict = safeZones.some((zone) => Math.abs(x - zone.x) < safeZoneRadius);
    if (!conflict) return x;
  }
  return minX + Math.random() * (maxX - minX);
}

// safeZoneOptions: { zones: [{x, y}], radius } of null (geen taken/meteorieten-
// mechanic actief). zones = middens van huidige taken, alleen gebruikt bij spawn
// (pickSafeMeteorX hierboven) — eenmaal gespawnd valt een meteoriet recht naar
// beneden, zonder zijwaartse correcties, zodat de val voorspelbaar blijft.
export function spawnMeteor(spawner, fallSpeed, safeZoneOptions = null) {
  const zones = safeZoneOptions?.zones ?? [];
  const radius = safeZoneOptions?.radius ?? 0;
  const x = pickSafeMeteorX(spawner.canvasWidth, METEOR_RADIUS, zones, radius);
  spawner.meteors.push({
    x,
    y: -METEOR_RADIUS,
    radius: METEOR_RADIUS,
    fallSpeed,
    rockShape: createRockShape(),
    spinOffset: Math.random() * Math.PI * 2
  });
}

// enabled: of meteorieten deze level-mechanic vrijgespeeld is (levels.js). Als false
// spawnen er geen nieuwe, maar vallen bestaande (die zouden er dan niet moeten zijn
// dankzij de level-cleanup in game.js) gewoon door.
// speedMultiplier schaalt de beweging van ALLE meteorieten deze frame, zie objects.js.
export function updateMeteors(spawner, deltaSeconds, canvasHeight, spawnIntervalMs, fallSpeed, speedMultiplier, enabled, safeZoneOptions = null) {
  spawner.spawnTimerMs += deltaSeconds * 1000;
  if (enabled && spawner.spawnTimerMs >= spawnIntervalMs) {
    spawner.spawnTimerMs = 0;
    spawnMeteor(spawner, fallSpeed, safeZoneOptions);
  }

  for (const meteor of spawner.meteors) {
    meteor.y += meteor.fallSpeed * speedMultiplier * deltaSeconds;
  }

  spawner.meteors = spawner.meteors.filter((meteor) => meteor.y - meteor.radius <= canvasHeight);
}

export function renderMeteors(ctx, spawner, image = null) {
  for (const meteor of spawner.meteors) {
    const spin = meteor.spinOffset + meteor.y / 90; // trage rotatie tijdens het vallen

    if (image) {
      ctx.save();
      ctx.translate(meteor.x, meteor.y);
      ctx.rotate(spin);
      ctx.drawImage(image, -meteor.radius, -meteor.radius, meteor.radius * 2, meteor.radius * 2);
      ctx.restore();
      continue;
    }

    const pointCount = meteor.rockShape.length;
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
