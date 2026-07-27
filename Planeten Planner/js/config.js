// Centrale configuratie voor Planeten Planner.
// Alle instelbare spelwaarden staan hier, volgens GAME_DESIGN_Planeten_Planner.md §24.

export const GAME_CONFIG = {
  // 16:9 breedbeeld i.p.v. staand formaat. De bestaande CSS (max-width/max-height)
  // schaalt dit vanzelf netjes naar beneden op kleine Chromebook-schermen.
  canvasWidth: 960,
  canvasHeight: 540,

  startingLives: 3,
  maximumLives: 3,

  cargoCapacity: 5,
  extraCargoCapacity: 6,

  numberOfDays: 5,
  slotsPerDay: 3,
  totalWeekSlots: 15,

  smallTaskSize: 1,
  largeTaskSize: 2,

  invulnerabilityDuration: 1250,
  magnetDuration: 10000,
  slowMotionDuration: 8000,
  slowMotionMultiplier: 0.7,

  // Verlaagd t.o.v. het staande formaat: het speelveld is nu minder hoog, dus een
  // lagere valsnelheid houdt dezelfde reactietijd (val-tijd) aan als voorheen.
  startingFallSpeed: 86,
  speedIncreasePerLevel: 9,

  startingSpawnInterval: 1500,
  minimumSpawnInterval: 500,
  spawnIntervalDecreasePerLevel: 100,

  // Level 1 heeft alleen kleine taken en weinig, langzame meteorieten (zie levels.js).
  meteorStartingFallSpeed: 72,
  meteorStartingSpawnInterval: 3500,
  meteorSpawnIntervalDecreasePerLevel: 200,
  meteorMinimumSpawnInterval: 1000,

  levelSummaryAutoContinueDelay: 6000,

  scoreCatchSmallTask: 10,
  scoreCatchLargeTask: 20,
  scorePlanSmallTask: 15,
  scorePlanLargeTask: 30,
  scoreLevelComplete: 250,
  scoreBonusPerRemainingLife: 50,

  powerupSpawnInterval: 8000,
  powerupFallSpeed: 65,
  magnetRange: 320,
  magnetPullSpeed: 260
};
