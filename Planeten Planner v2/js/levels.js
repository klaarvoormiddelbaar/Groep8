// Bepaalt per level welke mechanics actief zijn en hoe moeilijk het spel is.
// Alle basis- en stapwaarden komen uit config.js, zodat balanceren hier geen
// code hoeft te wijzigen. Zie GAME_DESIGN_Planeten_Planner.md voor het ontwerp.
//
// Twee aparte assen:
// 1. Mechanics worden één voor één vrijgespeeld (level 1-4): grote taken vanaf
//    level 2, meteorieten vanaf level 3, power-ups vanaf level 4.
// 2. Moeilijkheid (tempo/snelheid) blijft level 1 t/m 4 EXACT gelijk — pas
//    vanaf level 5 loopt één gedeelde vermenigvuldigingsfactor op (+0,1/level),
//    die valsnelheid, spawntempo, grote-taak-kans en meteoriet-frequentie
//    samen stuurt. Zo blijven de eerste levels rustig en leert de speler eerst
//    de besturing voordat het spel sneller/drukker wordt.

import { GAME_CONFIG } from './config.js';

function getDifficultyMultiplier(level) {
  const levelsAboveFlat = Math.max(0, level - GAME_CONFIG.difficultyFlatLevels);
  return 1 + levelsAboveFlat * GAME_CONFIG.difficultyStepPerLevel;
}

// Taken per level: elke rij is [tijd tussen taken in ms, minimale en maximale zijwaartse afstand tot de
// vorige taak als deel van de speelbreedte, valsnelheid]. Taken staan verder uit elkaar dan eerst (minimale
// afstand), en de snelheid stijgt rustiger; de eerlijkheidscheck in game.js zorgt dat elke taak altijd
// haalbaar blijft. De waarden zijn afgesteld op metingen van wat er echt in het spel gebeurt: het heen en
// weer vliegen (px per seconde) loopt zo geleidelijk op, zonder dal. Level 6, 7 en 8 zijn bewust
// ongewijzigd gelaten (zoals ze waren). Level 13+ gebruikt de laatste rij.
const TASK_TABLE = {
  1: [2600, 0.1, 0.3, 50],
  2: [2600, 0.1, 0.3, 50],
  3: [2500, 0.12, 0.32, 57],
  4: [2300, 0.13, 0.32, 65],
  5: [2100, 0.14, 0.34, 73],
  6: [1560, 0, 0.82, 80],
  7: [1430, 0, 1, 88],
  8: [1320, 0, 1, 95],
  9: [1320, 0, 0.8, 97],
  10: [1320, 0.04, 0.8, 99],
  11: [1320, 0.05, 0.85, 101],
  12: [1320, 0.08, 1, 103]
};

function getTaskRow(level) {
  if (TASK_TABLE[level]) return TASK_TABLE[level];
  const last = TASK_TABLE[12];
  const extra = level - 12;
  // Valsnelheid: tot en met level 12 (moeilijkheidsniveau 14) stijgt die met 2 per stap; daarna met 4 per level
  // (107 -> 111 -> 115 -> ...).
  const speed = last[3] + Math.min(extra, 2) * 2 + Math.max(0, extra - 2) * 4;
  return [Math.max(1100, last[0] - extra * 20), Math.min(0.4, last[1] + extra * 0.02), last[2], speed];
}

// Tijd tussen meteorieten in de eerste levels (ms): iets vaker dan eerst (was 3500, 3043, 2692, 2414).
// Vanaf level 6 geldt de gewone formule hieronder, onveranderd.
const EARLY_METEOR_INTERVAL = { 1: 2900, 2: 2900, 3: 2650, 4: 2400, 5: 2250 };

// Het spel moet kort zijn: vanaf level 7 gaat de moeilijkheid sneller omhoog. Level 7 en 8 zitten op het
// niveau dat eerst bij level 8 en 9 hoorde, level 9 op dat van eerst level 11, en vanaf level 10 loopt het
// twee levels voor op de oude curve (level 10 = het niveau van eerst level 12). Level 1 t/m 6 zijn
// ongewijzigd. De tabel(len) hieronder gaan over dit 'moeilijkheidsniveau', niet over het echte level.
export function getDifficultyLevel(level) {
  if (level <= 6) return level;
  if (level <= 8) return level + 1;
  return level + 2;
}

export function getLevelSettings(level) {
  const difficultyLevel = getDifficultyLevel(level);
  const multiplier = getDifficultyMultiplier(difficultyLevel);

  const [taskSpawnInterval, minSpawnDistancePercent, maxSpawnDistancePercent, taskFallSpeed] = getTaskRow(difficultyLevel);

  const meteorFallSpeed = GAME_CONFIG.meteorStartingFallSpeed * multiplier;
  const meteorSpawnInterval =
    EARLY_METEOR_INTERVAL[difficultyLevel] ??
    Math.max(GAME_CONFIG.meteorMinimumSpawnInterval, GAME_CONFIG.meteorStartingSpawnInterval / multiplier);

  // Power-ups worden bij hogere moeilijkheid maar heel licht schaarser (gedempte
  // versie van dezelfde factor), niet net zo hard als taken/meteorieten.
  const powerupMultiplier = 1 + (multiplier - 1) * GAME_CONFIG.powerupDifficultyDamping;
  const powerupSpawnInterval = GAME_CONFIG.powerupSpawnInterval * powerupMultiplier;

  const largeTaskChance = Math.min(GAME_CONFIG.largeTaskChanceMax, GAME_CONFIG.largeTaskBaseChance * multiplier);

  return {
    level,
    difficultyMultiplier: multiplier,
    taskFallSpeed,
    taskSpawnInterval,
    largeTaskChance,
    maxSpawnDistancePercent,
    minSpawnDistancePercent,
    meteorFallSpeed,
    meteorSpawnInterval,
    powerupSpawnInterval,
    // Mechanics worden één voor één vrijgespeeld — zie GAME_DESIGN §Levelopbouw.
    // NIEUW SYSTEEM: grote taken en meteorieten zitten in level 1 al in, maar komen
    // pas op een vast moment in de week (zie game.js: pickLargeMode / meteorsAllowed).
    // Power-ups beginnen vanaf level 2.
    largeTasksEnabled: true,
    meteorsEnabled: true,
    powerupsEnabled: level >= 2,
    maxMeteorsOnScreen: difficultyLevel <= 6 ? 3 : 4 // eerste levels: tot 3 tegelijk (was 2)
  };
}
