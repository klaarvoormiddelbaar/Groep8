// Bepaalt per level hoe moeilijk het spel is. Alle basis- en stapwaarden komen
// uit config.js, zodat balanceren (fase 19) hier geen code hoeft te wijzigen.
// Niet meerdere waarden tegelijk extreem verhogen: elke stap is klein en geleidelijk.

import { GAME_CONFIG } from './config.js';

export function getLevelSettings(level) {
  const levelsAboveFirst = level - 1;
  const speedIncrease = levelsAboveFirst * GAME_CONFIG.speedIncreasePerLevel;

  const taskFallSpeed = GAME_CONFIG.startingFallSpeed + speedIncrease;
  const taskSpawnInterval = Math.max(
    GAME_CONFIG.minimumSpawnInterval,
    GAME_CONFIG.startingSpawnInterval - levelsAboveFirst * GAME_CONFIG.spawnIntervalDecreasePerLevel
  );

  const meteorFallSpeed = GAME_CONFIG.meteorStartingFallSpeed + speedIncrease;
  const meteorSpawnInterval = Math.max(
    GAME_CONFIG.meteorMinimumSpawnInterval,
    GAME_CONFIG.meteorStartingSpawnInterval - levelsAboveFirst * GAME_CONFIG.meteorSpawnIntervalDecreasePerLevel
  );

  return {
    level,
    taskFallSpeed,
    taskSpawnInterval,
    meteorFallSpeed,
    meteorSpawnInterval,
    largeTasksEnabled: level >= 2 // level 1: alleen kleine taken
  };
}
