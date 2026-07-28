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

// Maximale horizontale afstand (als percentage van de speelbreedte) tussen twee
// opeenvolgende taak-spawns. Laag in de eerste levels zodat spelers rustig de
// besturing leren zonder constant van links naar rechts te moeten vliegen,
// daarna geleidelijk breder tot volledig vrij vanaf level 8.
function getMaxSpawnDistancePercent(level) {
  if (level <= 4) return 0.66;
  if (level === 5) return 0.72;
  if (level === 6) return 0.78;
  if (level === 7) return 0.84;
  return 1; // vanaf level 8: geen beperking meer
}

export function getLevelSettings(level) {
  const multiplier = getDifficultyMultiplier(level);

  const taskFallSpeed = GAME_CONFIG.startingFallSpeed * multiplier;
  const taskSpawnInterval = Math.max(GAME_CONFIG.minimumSpawnInterval, GAME_CONFIG.startingSpawnInterval / multiplier);

  const meteorFallSpeed = GAME_CONFIG.meteorStartingFallSpeed * multiplier;
  const meteorSpawnInterval = Math.max(
    GAME_CONFIG.meteorMinimumSpawnInterval,
    GAME_CONFIG.meteorStartingSpawnInterval / multiplier
  );

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
    maxSpawnDistancePercent: getMaxSpawnDistancePercent(level),
    meteorFallSpeed,
    meteorSpawnInterval,
    powerupSpawnInterval,
    // Mechanics worden één voor één vrijgespeeld — zie GAME_DESIGN §Levelopbouw.
    largeTasksEnabled: level >= 2,
    meteorsEnabled: level >= 3,
    powerupsEnabled: level >= 4
  };
}
