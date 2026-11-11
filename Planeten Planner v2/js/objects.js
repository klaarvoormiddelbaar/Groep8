// Vallende schooltaken.
// Fase 4: kleine taken (1 taakplek) en grote taken (2 taakplekken).

import { THEME } from './theme.js';
import { drawRoundedRect } from './canvasUtils.js';

// Alleen deze 9 vakken, altijd als afkorting, zodat in één oogopslag te zien is
// om welk vak het gaat: kleine taak = huiswerk, grote taak = een toets leren.
const SUBJECT_ABBREVIATIONS = {
  Nederlands: 'NE',
  Engels: 'EN',
  Wiskunde: 'WI',
  Biologie: 'BI',
  Geschiedenis: 'GS',
  Aardrijkskunde: 'AK',
  Muziek: 'MU',
  Techniek: 'TE',
  Mentorlesuur: 'ML'
};
const SUBJECTS = Object.values(SUBJECT_ABBREVIATIONS);

const SMALL_TASK_SIZE = 59; // 10% kleiner
const LARGE_TASK_SIZE = 86; // 10% kleiner

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Vakken komen uit een 'gehusselde stapel': alle 9 vakken komen eerst één keer langs, in
// willekeurige volgorde, daarna wordt er opnieuw gehusseld. Zo zie je niet steeds
// hetzelfde vak achter elkaar, en komt elk vak even vaak voor. Het eerste vak van een
// nieuwe stapel is nooit hetzelfde als het laatste van de vorige.
function shuffled(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function nextSubject(spawner) {
  if (!spawner.subjectBag || spawner.subjectBag.length === 0) {
    let bag = shuffled(SUBJECTS);
    if (bag[bag.length - 1] === spawner.lastSubject) {
      // we trekken van achteren: zorg dat de eerste trekking niet gelijk is aan de laatste van de vorige stapel
      [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
    }
    spawner.subjectBag = bag;
  }
  const subject = spawner.subjectBag.pop();
  spawner.lastSubject = subject;
  return subject;
}

export function createTaskSpawner(canvasWidth) {
  return {
    tasks: [],
    spawnTimerMs: 0,
    // Hoog begingetal zodat de allereerste grote taak niet onnodig wordt tegengehouden.
    timeSinceLastLargeMs: Infinity,
    // x van de laatst gespawnde taak — bepaalt hoever de volgende mag spawnen
    // (zie pickSpawnX). null = nog geen taak gehad deze week, geen beperking.
    lastSpawnX: null,
    // { xs: [middens van meteorieten], radius } — door game.js elke frame gezet.
    avoid: null,
    // (x, size, slots, fallSpeed) => boolean, door game.js gezet: blijft elke taak bereikbaar als hier een taak komt?
    validate: null,
    // Minimale zijwaartse afstand (px) tot de vorige taak; door game.js per level gezet.
    minDistancePx: 0,
    // Minimale zijwaartse afstand (px) tussen taken die tegelijk vallen; door game.js gezet (0 = geen).
    taskGapPx: 0,
    subjectBag: [],
    lastSubject: null,
    // 'random' (normaal) | 'blocked' (alleen kleine taken) | 'force' (eerstvolgende taak is groot).
    // Level 2 gebruikt dit om de eerste grote taak precies op het juiste moment te laten komen.
    largeMode: 'random',
    // true zodra er dit level een grote taak is gespawnd (reset in game.js per level).
    anyLargeSpawned: false,
    // Aantal grote taken dat dit level is gespawnd, en of de 'domme fout'-val al is gebruikt (zie game.js).
    largeSpawnCount: 0,
    trapDone: false,
    canvasWidth
  };
}

// Kiest een spawn-x die maximaal maxDistancePercent van de speelbreedte van de
// vorige taak vandaan ligt, zodat spelers in de eerste levels niet constant van
// links naar rechts hoeven te vliegen. maxDistancePercent >= 1 (of nog geen
// vorige taak) betekent: geen beperking, de volledige breedte is beschikbaar.
function pickSpawnX(spawner, size, maxDistancePercent, fallSpeed = 0, slots = 1) {
  const maxX = spawner.canvasWidth - size;
  let low = 0;
  let high = maxX;
  if (spawner.lastSpawnX !== null && maxDistancePercent < 1) {
    const maxDistance = spawner.canvasWidth * maxDistancePercent;
    low = Math.max(0, spawner.lastSpawnX - maxDistance);
    high = Math.min(maxX, spawner.lastSpawnX + maxDistance);
  }

  // Taken en meteorieten vallen allebei recht naar beneden, dus een vaste
  // horizontale afstand (avoid.radius) tussen hun middens houdt ze de hele val lang
  // uit elkaar. Zonder geldige plek: neem de plek met de meeste afstand.
  const avoid = spawner.avoid;
  const validate = spawner.validate; // (x, size, slots, fallSpeed) => kan de raket alles nog halen? (game.js)
  const isReachable = (x) => !validate || validate(x, size, slots, fallSpeed);
  const distanceToMeteors = (x) => (avoid && avoid.xs.length > 0 ? Math.min(...avoid.xs.map((ax) => Math.abs(x + size / 2 - ax))) : Infinity);
  const radius = avoid ? avoid.radius : 0;

  // Eerst binnen het toegestane gebied zoeken; lukt dat niet, dan over de volle breedte
  // (veiligheid voor meteorieten gaat voor de maximale spreiding tussen taken). Een plek moet ook
  // 'bereikbaar' zijn. Is er helemaal geen bereikbare plek, dan geeft dit null: er valt nu geen taak.
  // Eerst met de minimale afstand tot de vorige taak (zodat ze niet vlak boven elkaar vallen); lukt dat
  // niet, dan zonder, zodat er nooit zomaar niets valt.
  const minDistance = spawner.minDistancePx ?? 0;
  const farFromLast = (x) => spawner.lastSpawnX === null || minDistance <= 0 || Math.abs(x - spawner.lastSpawnX) >= minDistance;

  // Afstand tot de andere taken die nu vallen (zodat ze niet allemaal op één plek vallen).
  const gap = spawner.taskGapPx ?? 0;
  const spaced = (x) => gap <= 0 || spawner.tasks.every((task) => Math.abs(x + size / 2 - (task.x + task.width / 2)) >= gap);

  // Eerst alles eisen (afstand tot vorige én tot de andere taken); lukt dat niet, dan steeds iets minder.
  const passes = [];
  if (gap > 0 && minDistance > 0 && spawner.lastSpawnX !== null) passes.push({ min: true, gap: true });
  if (gap > 0) passes.push({ min: false, gap: true });
  if (minDistance > 0 && spawner.lastSpawnX !== null) passes.push({ min: true, gap: false });
  passes.push({ min: false, gap: false });

  for (const pass of passes) {
    let bestX = null;
    let bestDistance = -1;
    const ranges = [[low, high], [0, maxX]];
    for (const [rangeLow, rangeHigh] of ranges) {
      for (let attempt = 0; attempt < 10; attempt++) {
        const x = rangeLow + Math.random() * (rangeHigh - rangeLow);
        if (pass.min && !farFromLast(x)) continue;
        if (pass.gap && !spaced(x)) continue;
        const nearest = distanceToMeteors(x);
        if (nearest >= radius && isReachable(x)) return x;
        if (nearest > bestDistance && isReachable(x)) {
          bestDistance = nearest;
          bestX = x;
        }
      }
    }
    if (bestX !== null) return bestX;
  }
  return null;
}

export function spawnSmallTask(spawner, fallSpeed, maxSpawnDistancePercent = 1) {
  const x = pickSpawnX(spawner, SMALL_TASK_SIZE, maxSpawnDistancePercent, fallSpeed, 1);
  if (x === null) return false; // geen bereikbare plek: nu geen taak
  const subject = nextSubject(spawner);
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
  spawner.lastSpawnX = x;
  return true;
}

export function spawnLargeTask(spawner, fallSpeed, maxSpawnDistancePercent = 1) {
  const x = pickSpawnX(spawner, LARGE_TASK_SIZE, maxSpawnDistancePercent, fallSpeed, 2);
  if (x === null) return false;
  const subject = nextSubject(spawner);
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
  spawner.lastSpawnX = x;
  spawner.anyLargeSpawned = true;
  spawner.largeSpawnCount = (spawner.largeSpawnCount ?? 0) + 1;
  return true;
}

// minGapBetweenLargeMs voorkomt dat 2 grote taken vlak na elkaar spawnen — hoe voller
// de week, hoe groter die afkoelperiode (game.js koppelt dit aan het weekvulpercentage).
// largeTaskChance komt uit de moeilijkheidscurve (levels.js) en loopt op met het level.
export function spawnRandomTask(spawner, fallSpeed, largeTasksEnabled, minGapBetweenLargeMs, largeTaskChance, maxSpawnDistancePercent) {
  // Geeft true terug als er een taak is gevallen; false als er geen bereikbare plek was (dan later opnieuw).
  if (largeTasksEnabled && spawner.largeMode === 'force') {
    if (!spawnLargeTask(spawner, fallSpeed, maxSpawnDistancePercent)) return false;
    spawner.timeSinceLastLargeMs = 0;
    return true;
  }
  const canSpawnLarge = largeTasksEnabled && spawner.largeMode !== 'blocked' && spawner.timeSinceLastLargeMs >= minGapBetweenLargeMs;
  if (canSpawnLarge && Math.random() < largeTaskChance) {
    if (spawnLargeTask(spawner, fallSpeed, maxSpawnDistancePercent)) {
      spawner.timeSinceLastLargeMs = 0;
      return true;
    }
  }
  return spawnSmallTask(spawner, fallSpeed, maxSpawnDistancePercent);
}

// speedMultiplier schaalt de beweging van ALLE taken deze frame (ook al vallende),
// zodat de tijdvertrager-power-up direct effect heeft en er na afloop niets 'nasleept'.
export function updateTasks(
  spawner,
  deltaSeconds,
  canvasHeight,
  spawnIntervalMs,
  fallSpeed,
  largeTasksEnabled,
  minGapBetweenLargeMs,
  largeTaskChance,
  maxSpawnDistancePercent,
  speedMultiplier,
  onMissed
) {
  spawner.spawnTimerMs += deltaSeconds * 1000;
  spawner.timeSinceLastLargeMs += deltaSeconds * 1000;
  if (spawner.spawnTimerMs >= spawnIntervalMs) {
    const spawned = spawnRandomTask(spawner, fallSpeed, largeTasksEnabled, minGapBetweenLargeMs, largeTaskChance, maxSpawnDistancePercent);
    // Geen bereikbare plek (bijv. door een meteoriet): over een kort moment opnieuw proberen.
    spawner.spawnTimerMs = spawned ? 0 : Math.max(0, spawnIntervalMs - 250);
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
  const badgeHeight = 19;
  const paddingX = 6;

  ctx.font = 'bold 12px \'Inria Sans\', sans-serif';
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
  ctx.fillText(task.subject, task.x + task.width / 2, badgeY + badgeHeight / 2 + 4);
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
