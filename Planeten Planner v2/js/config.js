// Centrale configuratie voor Planeten Planner.
// Alle instelbare spelwaarden staan hier, volgens GAME_DESIGN_Planeten_Planner.md §24.

export const GAME_CONFIG = {
  // 16:9 breedbeeld i.p.v. staand formaat. De bestaande CSS (max-width/max-height)
  // schaalt dit vanzelf netjes naar beneden op kleine Chromebook-schermen.
  canvasWidth: 960,
  canvasHeight: 540,
  maxPixelRatio: 1.5,

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

  // Dit zijn de basiswaarden voor level 1 t/m difficultyFlatLevels; zie de
  // moeilijkheidscurve hieronder voor hoe dit daarna oploopt. Verlaagd (was 86)
  // omdat de beginsnelheid te hoog aanvoelde: bij 385px speelveldhoogte gaf 86px/s
  // maar ~4,5s reactietijd om een taak te zien vallen én te vangen — 60px/s geeft
  // ~6,4s, ruimer voor beginnende spelers.
  startingFallSpeed: 50,
  startingSpawnInterval: 2500,
  minimumSpawnInterval: 500,

  // Mechanics worden één voor één vrijgespeeld (zie levels.js): grote taken vanaf
  // level 2, meteorieten vanaf level 3, power-ups vanaf level 4.
  meteorStartingFallSpeed: 42, // zelfde verhouding t.o.v. startingFallSpeed als voorheen
  meteorStartingSpawnInterval: 3500, // was 4500: iets vaker een meteoriet
  meteorMinimumSpawnInterval: 1000,

  // Moeilijkheidscurve: level 1 t/m difficultyFlatLevels zijn qua tempo exact
  // gelijk (alleen mechanics worden vrijgespeeld); pas daarna loopt de moeilijkheid
  // op via één gedeelde vermenigvuldigingsfactor (+difficultyStepPerLevel per level),
  // die valsnelheid, spawntempo, grote-taak-kans en meteoriet-frequentie samen stuurt.
  difficultyFlatLevels: 2, // was 4: de moeilijkheid begint al vanaf level 3 op te lopen
  difficultyStepPerLevel: 0.15, // was 0.1: iets grotere stap per level

  largeTaskBaseChance: 0.25,
  largeTaskChanceMax: 0.5,

  // Power-ups worden bij hogere moeilijkheid maar heel licht schaarser dan de rest
  // (damping < 1 = zwakkere uitwerking van dezelfde moeilijkheidsfactor).
  powerupDifficultyDamping: 0.3,

  // 'Eerlijke spawns': een meteoriet mag niet vlak naast een vallende taak
  // verschijnen (radius = horizontale veilige zone in px rond elke taak). Geldt
  // alleen op het moment van spawnen — daarna valt een meteoriet recht naar
  // beneden, zonder zijwaartse correcties.
  meteorSafeZoneRadius: 130,

  scoreCatchSmallTask: 10,
  scoreCatchLargeTask: 20,
  scorePlanSmallTask: 15,
  scorePlanLargeTask: 30,
  scoreLevelComplete: 250,
  scoreBonusPerRemainingLife: 50,

  powerupSpawnInterval: 18000, // was 8000 (toen 13000): power-ups zijn zeldzaam
  // Bij nog maar 1 leven komen power-ups sneller en is het vaker een hartje.
  lowLivesPowerupIntervalFactor: 0.5,
  lowLivesHeartChance: 0.6,
  powerupFallSpeed: 55,
  magnetRange: 320,
  magnetPullSpeed: 260,

  // Minimale tijd tussen twee grote taken: basiswaarde + extra naarmate de week voller
  // raakt, zodat je richting het einde van een level niet 2 grote taken snel na elkaar krijgt.
  largeTaskMinGapMs: 3000,
  largeTaskEndgameExtraGapMs: 5000
};
