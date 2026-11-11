// Meteorieten: vallende gevaarobjecten, visueel duidelijk anders dan taken
// (onregelmatige rotsvorm i.p.v. de vierkante taakkaartjes).

export const METEOR_RADIUS = 27; // 10% kleiner
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
    // Minimale zijwaartse afstand (px) tussen meteorieten die tegelijk vallen; door game.js gezet (0 = geen).
    gapPx: 0,
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
function pushMeteor(spawner, x, fallSpeed) {
  spawner.meteors.push({
    x,
    y: -METEOR_RADIUS,
    radius: METEOR_RADIUS,
    fallSpeed,
    rockShape: createRockShape(),
    spinOffset: Math.random() * Math.PI * 2
  });
}

export function spawnMeteor(spawner, fallSpeed, safeZoneOptions = null) {
  const zones = safeZoneOptions?.zones ?? [];
  const radius = safeZoneOptions?.radius ?? 0;
  const x = pickSafeMeteorX(spawner.canvasWidth, METEOR_RADIUS, zones, radius);
  pushMeteor(spawner, x, fallSpeed);
}

// Meteorieten vallen niet allemaal even snel: ±25% rond het levelTempo (de ene sneller, de andere trager).
const SPEED_VARIATION = 0.25;

// Probeert een meteoriet te laten vallen op een plek waar alle taken bereikbaar blijven (validate, zie
// reachability.js en game.js). Voorkeur voor plekken die ook ver genoeg van taken af zitten. Lukt dat niet,
// dan valt er nu geen meteoriet (true/false terug).
function trySpawnMeteor(spawner, baseSpeed, safeZoneOptions, validate) {
  if (!validate) {
    spawnMeteor(spawner, baseSpeed * (1 - SPEED_VARIATION + Math.random() * 2 * SPEED_VARIATION), safeZoneOptions);
    return true;
  }
  const zones = safeZoneOptions?.zones ?? [];
  const zoneRadius = safeZoneOptions?.radius ?? 0;
  const minX = METEOR_RADIUS;
  const maxX = spawner.canvasWidth - METEOR_RADIUS;

  const gap = spawner.gapPx ?? 0;
  const candidates = [];
  for (let i = 0; i < 24; i++) {
    const x = minX + Math.random() * (maxX - minX);
    const speed = baseSpeed * (1 - SPEED_VARIATION + Math.random() * 2 * SPEED_VARIATION);
    const farEnough = zoneRadius <= 0 || zones.every((zone) => Math.abs(x - zone.x) >= zoneRadius);
    const spaced = gap <= 0 || spawner.meteors.every((meteor) => Math.abs(x - meteor.x) >= gap);
    candidates.push({ x, speed, farEnough, spaced });
  }
  // Wil je meteorieten verder uit elkaar (gap > 0), dan komt er alleen een meteoriet op een plek die ver
  // genoeg van de andere meteorieten ligt; is die er niet, dan wacht hij even. Daarnaast voorkeur voor
  // plekken ver genoeg van taken.
  const usable = candidates.filter((candidate) => candidate.spaced);
  usable.sort((a, b) => Number(b.farEnough) - Number(a.farEnough));
  for (const candidate of usable) {
    if (validate(candidate.x, candidate.speed)) {
      pushMeteor(spawner, candidate.x, candidate.speed);
      return true;
    }
  }
  return false;
}

// enabled: of meteorieten deze level-mechanic vrijgespeeld is (levels.js). Als false
// spawnen er geen nieuwe, maar vallen bestaande (die zouden er dan niet moeten zijn
// dankzij de level-cleanup in game.js) gewoon door.
// speedMultiplier schaalt de beweging van ALLE meteorieten deze frame, zie objects.js.
export function updateMeteors(spawner, deltaSeconds, canvasHeight, spawnIntervalMs, fallSpeed, speedMultiplier, enabled, safeZoneOptions = null, validate = null) {
  spawner.spawnTimerMs += deltaSeconds * 1000;
  if (enabled && spawner.spawnTimerMs >= spawnIntervalMs) {
    // Lukt het niet (geen bereikbare plek), probeer het over een korte tijd opnieuw.
    spawner.spawnTimerMs = trySpawnMeteor(spawner, fallSpeed, safeZoneOptions, validate) ? 0 : Math.max(0, spawnIntervalMs - 300);
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
