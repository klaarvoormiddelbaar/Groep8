// Planeten Planner — hoofd-gameloop.
// Fase 19: balanceren (feedback-duur verlengd voor leesbaarheid).

import { GAME_CONFIG } from './config.js';
import { getLevelSettings } from './levels.js';
import { createPlayer, initPlayerInput, updatePlayer, renderPlayer } from './player.js';
import { createTaskSpawner, updateTasks, renderTasks, spawnSmallTask, spawnLargeTask } from './objects.js';
import { createMeteorSpawner, updateMeteors, renderMeteors, spawnMeteor, METEOR_RADIUS } from './meteors.js';
import { feasibleStarts } from './reachability.js';
import { createCargo, usedSlots, hasRoomFor, addToCargo, peekNextTask, removeNextTask, renderCargo } from './cargo.js';
import {
  createWeekPlanning,
  hasRoomInDay,
  usedSlotsInDay,
  placeTaskInDay,
  removeTaskFromDay,
  totalFilledSlots,
  canPlaceInAnyDay,
  renderWeekPlanning,
  renderWeekSummary
} from './planner.js';
import {
  createPowerupSpawner,
  updatePowerups,
  renderPowerups,
  createActiveEffects,
  tickActiveEffects,
  resetLevelScopedEffects
} from './powerups.js';
import { rectsOverlap, circleRectOverlap } from './collision.js';
import { sounds, toggleMute, getIsMuted } from './audio.js';
import { loadAssets, getImage } from './assets.js';
import { THEME } from './theme.js';
import { drawRoundedRect, drawPillButton, drawStatCard } from './canvasUtils.js';
import { createTutorial } from './tutorial.js';

// Onderin het scherm staat een vast weekplanning-paneel; het speelveld (vallende
// objecten + raket) gebruikt de resterende hoogte erboven. Iets hoger dan voorheen
// zodat de dagpanelen ruimte hebben voor het planeetje + naam in de moderne stijl.
const WEEKPLANNING_PANEL_HEIGHT = 155; // was 145, iets hoger voor de grotere dag-tekst

// Alle spellogica en tekencode werkt in deze vaste 'logische' resolutie. Het echte
// canvas-oppervlak (canvas.width/height) wordt hieronder groter gezet op basis van
// devicePixelRatio, zodat het scherp blijft op Retina/HiDPI schermen — zonder de
// devicePixelRatio-factor zou de browser het canvas wazig uitrekken naar zijn
// weergavegrootte, wat vooral bij kleine, gedetailleerde afbeeldingen (planeten,
// levens) opviel als een "onscherpe" look.
const LOGICAL_WIDTH = GAME_CONFIG.canvasWidth;
const LOGICAL_HEIGHT = GAME_CONFIG.canvasHeight;

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Alleen de canvas-attributen (het intrinsieke, tekenbare oppervlak) worden vergroot.
// De CSS (width/height: auto + max-width/max-height) bepaalt zelf de weergavegrootte
// op basis van die intrinsieke afmetingen, en behoudt daarbij automatisch de
// beeldverhouding — precies zoals bij een <img>. Zelf een CSS-breedte/hoogte zetten
// zou die aspect-ratio-berekening juist doorbreken.
// Maximaal 1,5x: op Retina-schermen (2x) is het canvas 4x zo groot om te tekenen,
// wat op Chromebooks en oudere laptops zichtbaar hapert. 1,5x blijft scherp genoeg.
const devicePixelRatioValue = Math.min(GAME_CONFIG.maxPixelRatio, Math.max(1, window.devicePixelRatio || 1));
canvas.width = LOGICAL_WIDTH * devicePixelRatioValue;
canvas.height = LOGICAL_HEIGHT * devicePixelRatioValue;
ctx.scale(devicePixelRatioValue, devicePixelRatioValue);
ctx.imageSmoothingQuality = 'high';

const playAreaHeight = LOGICAL_HEIGHT - WEEKPLANNING_PANEL_HEIGHT;

// Kaarten + hun knop worden hier samen gedefinieerd (knop-positie afgeleid van de
// kaart-onderkant) zodat lay-outwijzigingen aan één kant nooit de knop laten
// losraken van de kaart.
const START_CARD = { width: 440, height: 400, x: LOGICAL_WIDTH / 2 - 220, y: 60 };
const START_BUTTON = { x: LOGICAL_WIDTH / 2 - 100, y: START_CARD.y + START_CARD.height - 80, width: 200, height: 56 };

const PAUSE_CARD = { width: 320, height: 170, x: LOGICAL_WIDTH / 2 - 160, y: LOGICAL_HEIGHT / 2 - 95 };
// Keuzemenu achter het vraagteken-knopje: "Nog een keer de oefenronde spelen?" met Nee / Ja.
const ASK_CARD = { width: 440, height: 210, x: LOGICAL_WIDTH / 2 - 220, y: 150 };
const ASK_NO_BUTTON = { x: ASK_CARD.x + 36, y: ASK_CARD.y + ASK_CARD.height - 76, width: 170, height: 56 };
const ASK_YES_BUTTON = { x: ASK_CARD.x + ASK_CARD.width - 36 - 170, y: ASK_CARD.y + ASK_CARD.height - 76, width: 170, height: 56 };
let askPractice = false; // true: de pauzestand toont het keuzemenu i.p.v. 'Gepauzeerd'
const RESUME_BUTTON = { x: LOGICAL_WIDTH / 2 - 100, y: PAUSE_CARD.y + PAUSE_CARD.height - 74, width: 200, height: 56 };

const GAME_OVER_CARD = { width: 420, height: 380, x: LOGICAL_WIDTH / 2 - 210, y: LOGICAL_HEIGHT / 2 - 190 };
const RESTART_BUTTON = { x: LOGICAL_WIDTH / 2 - 100, y: GAME_OVER_CARD.y + GAME_OVER_CARD.height - 80, width: 200, height: 56 };

// Pauze + geluid staan nu als een net rijtje ONDER de levens (i.p.v. half ernaast,
// half eronder) zodat de linkerkolom van de HUD een nette rechte blok vormt in
// plaats van een trapje.
const PAUSE_ICON_BUTTON = { x: 20, y: 66, width: 64, height: 24 };
const MUTE_ICON_BUTTON = { x: 92, y: 66, width: 100, height: 24 };
const HELP_ICON_BUTTON = { x: 200, y: 66, width: 36, height: 24 };
const HUD_PANEL = { x: 8, y: 6, width: LOGICAL_WIDTH - 16, height: 102 };

// Vaste sterrenachtergrond (eenmalig gegenereerd, geen herberekening per frame).
const STARS = Array.from({ length: 100 }, () => ({
  x: Math.random() * GAME_CONFIG.canvasWidth,
  y: Math.random() * playAreaHeightFor(GAME_CONFIG.canvasHeight),
  radius: Math.random() < 0.15 ? 1.6 : 0.9,
  twinkleOffset: Math.random() * 1000
}));

function playAreaHeightFor(canvasHeight) {
  return canvasHeight - WEEKPLANNING_PANEL_HEIGHT;
}

// Tekent een afbeelding zodat hij het doelvlak volledig vult ('cover'), gecentreerd
// bijgesneden — net als CSS background-size: cover.
function drawImageCover(image, dx, dy, dw, dh) {
  const scale = Math.max(dw / image.width, dh / image.height);
  const sw = dw / scale;
  const sh = dh / scale;
  const sx = (image.width - sw) / 2;
  const sy = (image.height - sh) / 2;
  ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
}

function renderStarfield() {
  for (const star of STARS) {
    const twinkle = 0.5 + 0.5 * Math.sin((Date.now() + star.twinkleOffset) / 500);
    ctx.globalAlpha = 0.35 + twinkle * 0.5;
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

const player = createPlayer(LOGICAL_WIDTH, playAreaHeight);
initPlayerInput();

const taskSpawner = createTaskSpawner(LOGICAL_WIDTH);
const meteorSpawner = createMeteorSpawner(LOGICAL_WIDTH);
const powerupSpawner = createPowerupSpawner(LOGICAL_WIDTH);
const activeEffects = createActiveEffects();

// Rondleidingen: level 1 legt de volledige basis uit (5 stappen), level 2 t/m 4
// leggen telkens alleen de ene nieuwe mechanic uit die op dat level vrijkomt
// (grote taken / meteorieten / power-ups) — kort, want de rest kennen spelers dan
// al. Elke rondleiding start automatisch de eerste keer dat een speler dat level
// bereikt (zie resetGame/endLevelSummary), en is daarna via het lampje-knopje in
// de HUD altijd opnieuw op te vragen (getTutorialForLevel kiest welke).
const FALLING_AREA_REGION = { x: 0, y: HUD_PANEL.y + HUD_PANEL.height + 10, width: LOGICAL_WIDTH, height: 130 };
const CARGO_REGION = { x: LOGICAL_WIDTH - 200, y: HUD_PANEL.y, width: 190, height: HUD_PANEL.height };
const WEEKPLANNING_REGION = { x: 0, y: playAreaHeight, width: LOGICAL_WIDTH, height: WEEKPLANNING_PANEL_HEIGHT };

const LEVEL1_TUTORIAL_STEPS = [
  {
    label: 'Jouw raket',
    text: 'Dit is jouw raket. Beweeg hem met de pijltjestoetsen ← en → naar links en naar rechts.',
    region: { x: player.x - 20, y: player.y - 20, width: player.width + 40, height: player.height + 40 }
  },
  {
    label: 'Vallende taken',
    text: 'Taken (huiswerk) vallen vanaf boven naar beneden. Vlieg eronder om ze te vangen.',
    region: FALLING_AREA_REGION
  },
  {
    label: 'Je laadruimte',
    text: 'Gevangen taken komen hier terecht. Je hebt maar 5 plekken — plan op tijd, anders zit het vol!',
    region: CARGO_REGION
  },
  {
    label: 'Plan je week',
    text: 'Druk op 1 t/m 5 om je eerstvolgende taak in te plannen op maandag t/m vrijdag.',
    region: WEEKPLANNING_REGION
  },
  {
    label: 'Jouw doel',
    text: 'Vul alle 15 plekken van de week om het level te voltooien. Succes!',
    region: { x: LOGICAL_WIDTH / 2 - 120, y: HUD_PANEL.y, width: 240, height: HUD_PANEL.height }
  }
];

const LEVEL2_TUTORIAL_STEPS = [
  {
    label: 'Grote taken',
    text: 'Vanaf nu vallen er ook grote taken (oranje, bijv. "leren toets"). Die nemen 2 plekken in de week in plaats van 1 — plan er op tijd ruimte voor!',
    region: WEEKPLANNING_REGION
  }
];

const LEVEL3_TUTORIAL_STEPS = [
  {
    label: 'Meteorieten',
    text: 'Pas op: vanaf nu vallen er ook meteorieten. Raak je er eentje, dan verlies je een leven — vlieg opzij om ze te ontwijken.',
    region: FALLING_AREA_REGION
  }
];

const PU_ICON = (file) => `/Planeten%20Planner%20v2/assets/images/${file}`;
const LEVEL4_TUTORIAL_STEPS = [
  {
    label: 'Power-ups',
    text: 'Vanaf nu vallen er ook power-ups. Vang ze op voor een bonus. Er zijn er vijf: klik op Volgende om te zien wat elk doet.',
    region: null
  },
  {
    label: 'Schild',
    icon: PU_ICON('powerup-shield.png'),
    text: 'Vangt de volgende meteoriet op, dus je verliest geen leven. Je schild blijft bewaard tot je een meteoriet raakt, ook in het volgende level.',
    region: null
  },
  {
    label: 'Magneet',
    icon: PU_ICON('powerup-magnet.png'),
    text: 'Taken in de buurt worden 10 seconden lang naar je raket toe getrokken. Meteorieten niet.',
    region: null
  },
  {
    label: 'Tijdvertrager',
    icon: PU_ICON('powerup-slowmotion.png'),
    text: 'Alles valt 8 seconden lang langzamer, zodat je rustig kunt mikken.',
    region: null
  },
  {
    label: 'Extra leven',
    icon: PU_ICON('powerup-life.png'),
    text: 'Je krijgt een leven erbij, tot maximaal 3. Heb je nog maar 1 leven, dan komen er vaker hartjes.',
    region: null
  },
  {
    label: 'Dubbele score',
    icon: PU_ICON('powerup-doublescore.png'),
    text: 'Alle punten tellen dubbel tot het einde van dit level.',
    region: null
  }
];

const level1Tutorial = createTutorial(canvas, LOGICAL_WIDTH, LOGICAL_HEIGHT, LEVEL1_TUTORIAL_STEPS, 'kvm_pp2_tut_level1_v1');
const level2Tutorial = createTutorial(canvas, LOGICAL_WIDTH, LOGICAL_HEIGHT, LEVEL2_TUTORIAL_STEPS, 'kvm_pp2_tut_level2_v1');
const level3Tutorial = createTutorial(canvas, LOGICAL_WIDTH, LOGICAL_HEIGHT, LEVEL3_TUTORIAL_STEPS, 'kvm_pp2_tut_level3_v1');
const level4Tutorial = createTutorial(canvas, LOGICAL_WIDTH, LOGICAL_HEIGHT, LEVEL4_TUTORIAL_STEPS, 'kvm_pp2_tut_level4_v2');

// Laadruimte-vol-pauze: stopt het spel écht totdat de speler de laadruimte
// helemaal heeft leeggepland (niet zomaar een kaartje dat je meteen wegklikt,
// dismissible:false hieronder). De teller in de tekst telt live mee terug via
// refresh(), en het plannen met 1 t/m 5 blijft gewoon werken tijdens de pauze
// (zie anyBlockingTutorialOpen hieronder, dat deze twee bewust uitsluit).
// Level 1 krijgt de basisuitleg; vanaf level 2 (ongeacht of dat 2, 3 of 4 is,
// gewoon de eerste keer dat het gebeurt) komt er ook een waarschuwing bij over
// grote taken, en de aansporing om dit voortaan te voorkomen.
//
// Twee tekstwolken tegelijk (simultaneous:true, zie tutorial.js): de ene wijst
// naar de laadruimte zelf, de andere naar de dagen waar de speler moet klikken.
// Zo hoeft de speler niet eerst op 'volgende' te klikken om te zien wat hij moet
// doen, beide dingen staan meteen samen in beeld.
function cargoFullLevel1CargoText(remaining) {
  return (
    `Je laadruimte zit vol. Neem rustig de tijd om alles in te plannen. Nog ${remaining} te plannen. Probeer 'm ` +
    `voortaan niet meer helemaal vol te laten lopen!`
  );
}

function cargoFullDaysText() {
  return (
    `Druk op de toetsen 1 tot en met 5 om je volgende taak bij die dag in te plannen. De taken vallen pas weer ` +
    `verder zodra je laadruimte leeg is.`
  );
}

function cargoFullLevel2PlusCargoText(remaining) {
  return (
    `Je laadruimte zit weer vol. Neem rustig de tijd om alles in te plannen. Nog ${remaining} te plannen. Plan ` +
    `voortaan op tijd, dan gebeurt dit niet steeds weer!`
  );
}

function cargoFullLevel2PlusDaysText() {
  return (
    `Let op: grote taken nemen 2 plekken in bij een dag. Druk op de toetsen 1 tot en met 5 om in te plannen. De ` +
    `taken vallen pas weer verder zodra je laadruimte leeg is.`
  );
}

const CARGO_FULL_LEVEL1_STEPS = [
  { label: 'Laadruimte vol!', text: '', region: CARGO_REGION },
  { label: 'Plan hier je taken', text: '', region: WEEKPLANNING_REGION }
];
const CARGO_FULL_LEVEL2PLUS_STEPS = [
  { label: 'Laadruimte weer vol!', text: '', region: CARGO_REGION },
  { label: 'Let op grote taken', text: '', region: WEEKPLANNING_REGION }
];

const cargoFullLevel1Tutorial = createTutorial(
  canvas,
  LOGICAL_WIDTH,
  LOGICAL_HEIGHT,
  CARGO_FULL_LEVEL1_STEPS,
  'kvm_pp2_tut_cargofull_l1_v2',
  { variant: 'warning', simultaneous: true }
);
const cargoFullLevel2PlusTutorial = createTutorial(
  canvas,
  LOGICAL_WIDTH,
  LOGICAL_HEIGHT,
  CARGO_FULL_LEVEL2PLUS_STEPS,
  'kvm_pp2_tut_cargofull_l2plus_v2',
  { variant: 'warning', simultaneous: true }
);

// Noodrem tegen een vastgelopen planning: eerdere maatregelen voorkomen dat een
// grote taak wordt gevangen zonder dat er op dát moment nog plek is, maar een
// speler kan zichzelf daarna alsnog vastzetten door met kleinere taken precies
// alle 2-plekken-dagen dicht te plannen terwijl er nog een grote taak in de
// laadruimte zit. Deze inhoud is per redding dynamisch (dagnaam/vak), dus het
// stap-object wordt hergebruikt en telkens vóór open() bijgewerkt.
const RESCUE_STEPS = [{ label: '', text: '', region: null }];
const rescueTutorial = createTutorial(canvas, LOGICAL_WIDTH, LOGICAL_HEIGHT, RESCUE_STEPS, 'kvm_pp2_tut_rescue_v1', {
  variant: 'danger'
});

const ALL_TUTORIALS = [
  level1Tutorial,
  level2Tutorial,
  level3Tutorial,
  level4Tutorial,
  cargoFullLevel1Tutorial,
  cargoFullLevel2PlusTutorial,
  rescueTutorial
];

function anyTutorialOpen() {
  return ALL_TUTORIALS.some((t) => t.isOpen());
}

// De laadruimte-vol-pauze is bewust GEEN blokkerende rondleiding: de speler moet
// er juist mee kunnen blijven plannen (1 t/m 5) terwijl de kaart openstaat. Alle
// andere rondleidingen blokkeren dat wél (gewoon even lezen, niets anders).
// Extra rondleidingen die het spel pauzeren (power-up-uitleg, 'past niet'-herinnering); worden verderop gevuld.
const EXTRA_BLOCKING_TUTORIALS = [];

function anyBlockingTutorialOpen() {
  return EXTRA_BLOCKING_TUTORIALS.some((t) => t.isOpen()) || largeCaughtTutorial.isOpen() || level1Tutorial.isOpen() || level2Tutorial.isOpen() || level3Tutorial.isOpen() || level4Tutorial.isOpen() || rescueTutorial.isOpen();
}

// Toont, precies één keer, de laadruimte-vol-pauze zodra de laadruimte voor het
// eerst vol zit — welke van de twee hangt af van of dit op level 1 gebeurt of
// pas later. Sluit vanzelf weer via maybeUpdateCargoFullPause hieronder.
function maybeShowCargoFullTutorial() {
  const remaining = usedSlots(cargo);
  if (remaining < cargo.capacity) return;

  if (currentLevel === 1) {
    if (cargoFullLevel1Tutorial.hasBeenSeen()) return;
    CARGO_FULL_LEVEL1_STEPS[0].text = cargoFullLevel1CargoText(remaining);
    CARGO_FULL_LEVEL1_STEPS[1].text = cargoFullDaysText();
    cargoFullLevel1Tutorial.open();
  } else {
    if (cargoFullLevel2PlusTutorial.hasBeenSeen()) return;
    CARGO_FULL_LEVEL2PLUS_STEPS[0].text = cargoFullLevel2PlusCargoText(remaining);
    CARGO_FULL_LEVEL2PLUS_STEPS[1].text = cargoFullLevel2PlusDaysText();
    cargoFullLevel2PlusTutorial.open();
  }
}

// Wordt na elke geslaagde planningsactie aangeroepen: telt de kaart live mee
// terug, en sluit 'm pas zodra de laadruimte écht helemaal leeg is — dat was
// het hele punt van de pauze (rustig alles kwijt kunnen, niet maar 1 taakje).
function maybeUpdateCargoFullPause() {
  const remaining = usedSlots(cargo);

  if (cargoFullLevel1Tutorial.isOpen()) {
    if (remaining === 0) {
      cargoFullLevel1Tutorial.close();
    } else {
      CARGO_FULL_LEVEL1_STEPS[0].text = cargoFullLevel1CargoText(remaining);
      cargoFullLevel1Tutorial.refresh();
    }
  }

  if (cargoFullLevel2PlusTutorial.isOpen()) {
    if (remaining === 0) {
      cargoFullLevel2PlusTutorial.close();
    } else {
      CARGO_FULL_LEVEL2PLUS_STEPS[0].text = cargoFullLevel2PlusCargoText(remaining);
      cargoFullLevel2PlusTutorial.refresh();
    }
  }
}

// Eerste dag met precies 1 vrije plek waar minstens 2 kleine taken staan: in een
// vastgelopen situatie kan geen dag nog 2 vrije plekken hebben, dus 'nog vrij'
// betekent hier altijd exact 1 plek — het verwijderen van de 2e taak daar maakt
// precies genoeg ruimte (1 + 1 = 2) voor de vastzittende grote taak.
function findRescueDayIndex() {
  for (let dayIndex = 0; dayIndex < weekPlanning.days.length; dayIndex++) {
    const used = usedSlotsInDay(weekPlanning, dayIndex);
    if (used === GAME_CONFIG.slotsPerDay - 1 && weekPlanning.days[dayIndex].tasks.length >= 2) {
      return dayIndex;
    }
  }
  return -1;
}

function maybeRescueStuckLargeTask() {
  if (canPlaceInAnyDay(weekPlanning, { slots: 2 })) return; // geen probleem, niets te redden
  const stuckTask = cargo.queue.find((task) => task.slots === 2);
  if (!stuckTask) return; // geen grote taak in de laadruimte om vast te lopen

  const rescueDayIndex = findRescueDayIndex();
  if (rescueDayIndex === -1) return; // geen geldige dag gevonden, doe voor de zekerheid niets

  const displacedTask = removeTaskFromDay(weekPlanning, rescueDayIndex, 1);
  cargo.queue = cargo.queue.filter((task) => task !== stuckTask);
  placeTaskInDay(weekPlanning, rescueDayIndex, stuckTask);
  plannedCount += 1;

  loseLife();
  if (isGameOver) return; // was de laatste leven: game-over-scherm heeft nu voorrang

  // De redding zelf kan toevallig de allerlaatste plek van de week vullen (netto
  // +1 plek: -1 verdrongen taak, +2 voor de grote taak) — dan heeft het
  // weekoverzicht voorrang op het redding-bericht.
  if (totalFilledSlots(weekPlanning) >= GAME_CONFIG.totalWeekSlots) {
    completeLevel();
    return;
  }

  const dayName = weekPlanning.days[rescueDayIndex].name.toLowerCase(); // midden in een zin: kleine letter
  const dayWidth = WEEKPLANNING_REGION.width / weekPlanning.days.length;
  RESCUE_STEPS[0].label = 'Oei, dat past niet meer!';
  RESCUE_STEPS[0].text =
    `Je grote taak had nergens meer plek voor 2. We hebben 'm omgewisseld met ${displacedTask.label} op ${dayName}, ` +
    `die er weer uit moet. Dat kostte je 1 leven. Plan voortaan iets eerder ruimte vrij voor grote taken!`;
  RESCUE_STEPS[0].region = {
    x: WEEKPLANNING_REGION.x + rescueDayIndex * dayWidth,
    y: WEEKPLANNING_REGION.y,
    width: dayWidth,
    height: WEEKPLANNING_REGION.height
  };
  rescueTutorial.open();
}

// Welke rondleiding het lampje-knopje opent, en welke automatisch getoond wordt
// zodra een speler een level voor het eerst bereikt. Level 5+ heeft geen eigen
// nieuwe mechanic meer, dus valt terug op de laatst geïntroduceerde (power-ups).
function getTutorialForLevel(level) {
  if (level <= 1) return level1Tutorial;
  return level4Tutorial; // vanaf level 2: de power-ups-uitleg (grote taken/meteorieten komen in level 1)
}

// 'loading' | 'start' | 'playing' | 'paused' | 'gameOver'
let gameMode = 'loading';

let cargo;
let weekPlanning;
let currentLevel;
let levelSettings;

let isShowingLevelSummary;
let completedWeekSnapshot;
let completedLevelNumber;
let completedLevelScoreGain;
let completedWeeksCount;
let summaryStartedAtMs = 0; // tijdstip waarop het weekoverzicht verscheen
let livesLostThisGame; // voor het niveau van de speler (zie SKILL)
let gameClockMs; // speeltijd van dit potje in ms (pauzes en uitleg tellen niet mee)
let lastLifeLostClockMs; // op welk tijdstip (gameClockMs) het laatste leven verloren ging
let weekSummaryButtonRect;

let feedbackMessage;
let feedbackTimerMs;

let caughtCount;
let plannedCount;
let score;
let lives;
let isGameOver;
let invulnerableMs;

let damageFlashMs;
let shakeDayIndex;
let shakeTimerMs;
let scorePopups;
let noRoomLargeShown; // 'geen plek meer voor een grote taak'-kaartje al getoond in dit potje?
let largeBlockedShown; // is de 'past niet'-herinnering in dit potje al getoond? (reset per nieuw potje)

// Verwijdert alle vallende objecten en zet spawn-timers/-volgorde terug naar nul.
// Gebruikt bij zowel een verse start als bij elke levelovergang: een nieuw level
// is een volledig nieuwe week, er wordt niets uit het vorige level meegenomen.
function clearAllSpawners() {
  taskSpawner.tasks = [];
  taskSpawner.spawnTimerMs = 0;
  taskSpawner.timeSinceLastLargeMs = Infinity;
  taskSpawner.lastSpawnX = null;
  taskSpawner.largeMode = 'random';
  taskSpawner.anyLargeSpawned = false;
  taskSpawner.trapDone = false; // per level mag er één 'domme fout'-val komen
  taskSpawner.validate = null;
  taskSpawner.minDistancePx = 0;
  taskSpawner.taskGapPx = 0;
  meteorSpawner.gapPx = 0;
  meteorSpawner.meteors = [];
  // Een nieuw level/potje: de eerste meteoriet valt na ongeveer 5 seconden (je kunt eerst even vangen).
  meteorSpawner.spawnTimerMs = -2000;
  powerupSpawner.items = [];
  powerupSpawner.spawnTimerMs = 0;
}

// Zet alle spelstatus terug naar een verse start. Wordt gebruikt bij het eerste
// Start-klik én bij 'Opnieuw spelen' na een game-over.
function resetGame() {
  cargo = createCargo(GAME_CONFIG.cargoCapacity);
  weekPlanning = createWeekPlanning(GAME_CONFIG.numberOfDays, GAME_CONFIG.slotsPerDay);
  currentLevel = 1;
  levelSettings = getLevelSettings(currentLevel);

  clearAllSpawners();
  Object.assign(activeEffects, createActiveEffects());

  player.x = LOGICAL_WIDTH / 2 - player.width / 2;

  isShowingLevelSummary = false;
  completedWeekSnapshot = null;
  completedLevelNumber = 0;
  completedLevelScoreGain = 0;
  completedWeeksCount = 0;
  livesLostThisGame = 0;
  gameClockMs = 0;
  lastLifeLostClockMs = 0;
  weekSummaryButtonRect = null;

  feedbackMessage = '';
  feedbackTimerMs = 0;

  caughtCount = 0;
  plannedCount = 0;
  score = 0;
  lives = GAME_CONFIG.startingLives;
  isGameOver = false;
  invulnerableMs = 0;

  damageFlashMs = 0;
  shakeDayIndex = -1;
  shakeTimerMs = 0;
  scorePopups = [];
  largeBlockedShown = false;
  noRoomLargeShown = false;

  gameMode = 'playing';
}

function addScorePopup(x, y, text, color = '#facc15') {
  scorePopups.push({ x, y, text, color, ms: 700 });
}

resetGame();
gameMode = 'loading'; // toon eerst een laadscherm terwijl de afbeeldingen ophalen

loadAssets().then(() => {
  // Alleen naar het titelscherm als er niet ondertussen al iets anders gebeurde
  // (kan in theorie niet, maar voorkomt dat een trage lading een actieve sessie overschrijft).
  if (gameMode === 'loading') {
    gameMode = 'start';
  }
});

function completeLevel() {
  // Een nieuwe week begint met een lege laadruimte, dus een eventueel nog
  // openstaande laadruimte-vol-pauze van de VORIGE week slaat nergens meer op.
  // Zonder dit blijft die kaart hangen en kan de speler niet verder (anyTutorialOpen
  // in update() blokkeert dan de hele gameplay, inclusief het weekoverzicht).
  if (cargoFullLevel1Tutorial.isOpen()) cargoFullLevel1Tutorial.close();
  if (cargoFullLevel2PlusTutorial.isOpen()) cargoFullLevel2PlusTutorial.close();

  // Bewaar een referentie naar de voltooide planning vóórdat er een nieuwe,
  // lege planning voor in de plaats komt — zo blijft het overzicht correct
  // terwijl de speler alweer met een schone week kan beginnen.
  completedWeekSnapshot = weekPlanning;
  completedLevelNumber = currentLevel;
  completedLevelScoreGain = GAME_CONFIG.scoreLevelComplete + lives * GAME_CONFIG.scoreBonusPerRemainingLife;
  completedWeeksCount += 1;

  addScore(completedLevelScoreGain);

  currentLevel += 1;
  recordBestLevel(currentLevel); // voor Extreme mode (ontgrendelt bij level 8)
  levelSettings = getLevelSettings(currentLevel);
  weekPlanning = createWeekPlanning(GAME_CONFIG.numberOfDays, GAME_CONFIG.slotsPerDay);
  cargo = createCargo(GAME_CONFIG.cargoCapacity); // reset ook extra laadruimte automatisch
  resetLevelScopedEffects(activeEffects); // tijdelijke effecten eindigen, level-power-ups resetten

  // Nieuw level = volledig nieuwe week: alles wat nog in de lucht hangt uit het
  // vorige level verdwijnt direct, spawn-timers en -volgorde beginnen bij nul.
  clearAllSpawners();

  // Geen automatische timer meer: het weekoverzicht blijft staan tot de speler
  // zelf op 'Volgende week' klikt of spatie drukt.
  isShowingLevelSummary = true;
  summaryStartedAtMs = performance.now(); // voor de animaties in het weekoverzicht
  sounds.levelComplete();
}

function endLevelSummary() {
  isShowingLevelSummary = false;
  weekSummaryButtonRect = null;

  // Zodra een speler een level met een nieuwe mechanic voor het eerst bereikt
  // (2, 3 of 4), legt een korte rondleiding uit wat er verandert — maar alleen
  // de allereerste keer, en pas nadat het weekoverzicht is weggeklikt.
  if (currentLevel === 2) { // power-ups beginnen in level 2
    const mechanicTutorial = getTutorialForLevel(currentLevel);
    if (!mechanicTutorial.hasBeenSeen()) {
      mechanicTutorial.open();
    }
  }
}

function showFeedback(message) {
  feedbackMessage = message;
  feedbackTimerMs = 1600; // lang genoeg om ook langere meldingen ("... ingepland op donderdag.") te lezen
}

// Level 2 introduceert grote taken met een vaste les: de allereerste grote taak komt
// pas zodra er een dag is met nog maar 1 vrije plek (bijv. 2 taken op maandag), zodat
// de speler meteen ziet dat 'm daar NIET past. Tot die tijd vallen er alleen kleine
// taken. Komt die situatie niet voor (week al best vol), dan valt het terug op normaal.
// Vanaf level 3 gewoon willekeurig.
const LEVEL2_FALLBACK_FILLED_SLOTS = 9;

function daysWithOneFreeSlot() {
  const indexes = [];
  weekPlanning.days.forEach((_day, dayIndex) => {
    if (usedSlotsInDay(weekPlanning, dayIndex) === GAME_CONFIG.slotsPerDay - 1) indexes.push(dayIndex);
  });
  return indexes;
}

function pickLargeMode(canFitLargeTask) {
  if (currentLevel !== 1 || taskSpawner.anyLargeSpawned) return 'random';
  if (daysWithOneFreeSlot().length > 0 && canFitLargeTask) return 'force';
  if (totalFilledSlots(weekPlanning) >= LEVEL2_FALLBACK_FILLED_SLOTS) return 'random';
  return 'blocked';
}

// Uitleg bij het vangen van de eerste grote taak in level 2 (eenmalig): welke dag(en)
// kunnen 'm niet hebben omdat er nog maar 1 plek vrij is.
const LARGE_CAUGHT_STEPS = [{ label: 'Grote taak gevangen!', text: '', region: null, extraRegions: [CARGO_REGION] }];
const largeCaughtTutorial = createTutorial(
  canvas,
  LOGICAL_WIDTH,
  LOGICAL_HEIGHT,
  LARGE_CAUGHT_STEPS,
  'kvm_pp2_tut_largecaught_v1',
  { variant: 'warning' }
);
ALL_TUTORIALS.push(largeCaughtTutorial);

// Vanaf level 3: een grote taak valt ook als je week hem niet meer kan hebben. Mis je hem dan,
// dan kost dat een leven. Het kaartje komt één keer per potje, daarna alleen een korte melding.
const NO_ROOM_LARGE_STEPS = [
  {
    label: 'Geen plek meer!',
    text: 'Deze grote taak past nergens meer in je week. Daardoor verlies je een leven. Tip: houd dus altijd een dag over met twee plekken vrij voor onverwachte grote taken!',
    region: WEEKPLANNING_REGION
  }
];
const noRoomLargeTutorial = createTutorial(
  canvas,
  LOGICAL_WIDTH,
  LOGICAL_HEIGHT,
  NO_ROOM_LARGE_STEPS,
  'kvm_pp2_tut_noroomlarge_v1',
  { variant: 'warning' }
);
ALL_TUTORIALS.push(noRoomLargeTutorial);
EXTRA_BLOCKING_TUTORIALS.push(noRoomLargeTutorial);

function canFitLargeNow() {
  const daysWithRoom = weekPlanning.days.filter((_day, i) => hasRoomInDay(weekPlanning, i, { slots: 2 })).length;
  return daysWithRoom > cargo.queue.filter((task) => task.slots === 2).length;
}

// Een taak is onderaan het scherm verdwenen: kost altijd 1 leven. Was het een grote taak die
// toch nergens meer kon, dan leggen we uit waarom (kaartje 1x per potje).
function handleMissedTask(task) {
  if (task.slots === 2 && !canFitLargeNow()) {
    handleLargeNoRoom();
    return;
  }
  loseLife();
}

// Grote taak zonder plek (aangeraakt of beneden uit beeld): kost een leven + uitleg (kaartje 1x per potje).
function handleLargeNoRoom() {
  loseLife();
  if (isGameOver) return;
  if (!noRoomLargeShown) {
    noRoomLargeShown = true;
    noRoomLargeTutorial.open();
  } else {
    showFeedback('Geen plek voor die grote taak: je verliest een leven.');
  }
}

// Eenmalige herinnering als een grote taak op een volle dag wordt geprobeerd.
const LARGE_BLOCKED_STEPS = [{ label: 'Past niet!', text: '', region: null, extraRegions: [CARGO_REGION] }];
const largeBlockedTutorial = createTutorial(
  canvas,
  LOGICAL_WIDTH,
  LOGICAL_HEIGHT,
  LARGE_BLOCKED_STEPS,
  'kvm_pp2_tut_largeblocked_v1',
  { variant: 'warning' }
);
ALL_TUTORIALS.push(largeBlockedTutorial);
EXTRA_BLOCKING_TUTORIALS.push(largeBlockedTutorial);

function maybeShowLargeCaughtTutorial() {
  if (largeCaughtTutorial.hasBeenSeen() || largeCaughtTutorial.isOpen()) return;
  const tightDays = daysWithOneFreeSlot();
  if (tightDays.length === 0) return;

  const names = tightDays.map((i) => weekPlanning.days[i].name.toLowerCase());
  const nameText = names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} en ${names[names.length - 1]}`;
  LARGE_CAUGHT_STEPS[0].text =
    `Dit is een grote taak: hij neemt 2 plekken in en zit nu in je laadruimte (rechtsboven). Op ${nameText} kun je ` +
    `'m niet plannen, want daar is nog maar 1 plek vrij. Kies een dag met minstens 2 vrije plekken.`;
  const dayWidth = WEEKPLANNING_REGION.width / weekPlanning.days.length;
  LARGE_CAUGHT_STEPS[0].region = {
    x: WEEKPLANNING_REGION.x + tightDays[0] * dayWidth,
    y: WEEKPLANNING_REGION.y,
    width: dayWidth,
    height: WEEKPLANNING_REGION.height
  };
  largeCaughtTutorial.open();
}

function attemptPlanNextTask(dayIndex) {
  if (isGameOver || isShowingLevelSummary) return;

  const nextTask = peekNextTask(cargo);
  if (!nextTask) {
    showFeedback('Geen taak om in te plannen.');
    return;
  }

  if (!hasRoomInDay(weekPlanning, dayIndex, nextTask)) {
    // Eerste keer dat iemand een grote taak op een dag zet waar al (bijna) alles bezet is:
    // even pauzeren met een duidelijke herinnering, in plaats van alleen een korte melding.
    if (nextTask.slots === 2 && !largeBlockedShown && !largeBlockedTutorial.isOpen()) {
      largeBlockedShown = true;
      const used = usedSlotsInDay(weekPlanning, dayIndex);
      const dayWidth = WEEKPLANNING_REGION.width / weekPlanning.days.length;
      LARGE_BLOCKED_STEPS[0].text =
        `Op ${weekPlanning.days[dayIndex].name.toLowerCase()} zijn al ${used} plekken bezet. Rechtsboven zie je dat de grote taak ` +
        `nu aan de beurt is. Die kost 2 plekken en past hier dus niet. Kies een andere dag.`;
      LARGE_BLOCKED_STEPS[0].region = {
        x: WEEKPLANNING_REGION.x + dayIndex * dayWidth,
        y: WEEKPLANNING_REGION.y,
        width: dayWidth,
        height: WEEKPLANNING_REGION.height
      };
      shakeDayIndex = dayIndex;
      shakeTimerMs = 300;
      sounds.dayFull();
      largeBlockedTutorial.open();
      return;
    }
    showFeedback(`${weekPlanning.days[dayIndex].name} zit vol.`);
    shakeDayIndex = dayIndex;
    shakeTimerMs = 300;
    sounds.dayFull();
    return;
  }

  removeNextTask(cargo);
  placeTaskInDay(weekPlanning, dayIndex, nextTask);
  plannedCount += 1;
  const planPoints = nextTask.slots === 2 ? GAME_CONFIG.scorePlanLargeTask : GAME_CONFIG.scorePlanSmallTask;
  addScore(planPoints);
  (nextTask.slots === 2 ? sounds.planLarge : sounds.planSmall)();

  const dayColumnWidth = LOGICAL_WIDTH / GAME_CONFIG.numberOfDays;
  addScorePopup(dayColumnWidth * dayIndex + dayColumnWidth / 2, playAreaHeight - 6, `+${planPoints}`, '#38bdf8');

  // Vóór de level-check: als deze planningsactie de laadruimte leegmaakte, moet
  // de pauze-kaart al gesloten zijn voordat completeLevel() eventueel de
  // laadruimte alweer vervangt door een nieuwe (lege) voor de volgende week.
  maybeUpdateCargoFullPause();

  if (totalFilledSlots(weekPlanning) >= GAME_CONFIG.totalWeekSlots) {
    completeLevel();
  } else {
    showFeedback(`${nextTask.label} ingepland op ${weekPlanning.days[dayIndex].name.toLowerCase()}.`);
    maybeRescueStuckLargeTask(); // deze planningskeuze kan een grote taak in de laadruimte hebben vastgezet
  }
}

const DAY_KEYS = ['1', '2', '3', '4', '5'];

window.addEventListener('keydown', (event) => {
  if (event.repeat) return;

  // De laadruimte-vol-pauze is bewust geen blokkerende rondleiding: de speler
  // moet er juist mee door kunnen plannen (1 t/m 5), maar verder niets — geen
  // pauzeren, geen andere sneltoetsen, tot de laadruimte leeg is.
  if (!anyBlockingTutorialOpen() && (cargoFullLevel1Tutorial.isOpen() || cargoFullLevel2PlusTutorial.isOpen())) {
    if (gameMode === 'playing') {
      const dayIndex = DAY_KEYS.indexOf(event.key);
      if (dayIndex !== -1) attemptPlanNextTask(dayIndex);
    }
    return;
  }

  if (anyTutorialOpen()) return; // andere rondleidingen: even helemaal niets, gewoon lezen

  if (event.key === ' ') {
    event.preventDefault(); // voorkomt dat de spatiebalk de pagina laat scrollen
  }

  if (gameMode === 'practice') {
    handlePracticeKey(event);
    return;
  }
  if (gameMode === 'practiceChoice') {
    if (event.key === ' ' || event.key === 'Enter') startPractice();
    return;
  }

  if (event.key === 'Escape') {
    if (gameMode === 'playing') gameMode = 'paused';
    else if (gameMode === 'paused') { askPractice = false; gameMode = 'playing'; }
    return;
  }

  if (gameMode !== 'playing') return;

  if (isShowingLevelSummary) {
    if (event.key === ' ' || event.key === 'Enter') {
      endLevelSummary();
    }
    return;
  }

  const dayIndex = DAY_KEYS.indexOf(event.key);
  if (dayIndex !== -1) {
    attemptPlanNextTask(dayIndex);
  }
});

function hitTest(px, py, rect) {
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height;
}

// Welke knoppen zijn nu klikbaar? Voor de muisaanwijzer (handje) en de hover-gloed.
function clickableRectsNow() {
  const rects = [];
  if (gameMode === 'start') {
    rects.push(START_BUTTON);
    if (extremeUnlocked()) rects.push(EXTREME_BUTTON);
  } else if (gameMode === 'gameOver') {
    rects.push(RESTART_BUTTON);
    if (extremeUnlocked()) rects.push(EXTREME_BUTTON);
  } else if (gameMode === 'paused') {
    if (askPractice) rects.push(ASK_NO_BUTTON, ASK_YES_BUTTON);
    else rects.push(RESUME_BUTTON, MUTE_ICON_BUTTON);
  } else if (gameMode === 'practiceChoice') {
    rects.push(PRACTICE_PLAY_BUTTON, PRACTICE_SKIP_LINK);
  } else if (gameMode === 'practice' && practice) {
    rects.push(PRACTICE_SKIP_BUTTON);
    if (practice.step === 'done' || practice.step === 'weekDone') rects.push(PRACTICE_DONE_BUTTON);
    if (practice.step === 'rules') rects.push(PRACTICE_RULES_BUTTON);
    if (practice.step === 'powerupInfo') rects.push(PRACTICE_INFO_BUTTON);
    if (practice.step === 'cargoInfo') rects.push(PRACTICE_NEXT_BUTTON);
  } else if (gameMode === 'playing') {
    if (isShowingLevelSummary && weekSummaryButtonRect) rects.push(weekSummaryButtonRect);
    else rects.push(PAUSE_ICON_BUTTON, MUTE_ICON_BUTTON, HELP_ICON_BUTTON);
  }
  return rects;
}

canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  const px = (event.clientX - rect.left) * (LOGICAL_WIDTH / rect.width);
  const py = (event.clientY - rect.top) * (LOGICAL_HEIGHT / rect.height);
  const hovered = anyTutorialOpen() ? null : clickableRectsNow().find((r) => hitTest(px, py, r)) ?? null;
  canvas.style.cursor = hovered ? 'pointer' : 'default';
  hoveredExtreme = hovered === EXTREME_BUTTON;
});
canvas.addEventListener('mouseleave', () => {
  canvas.style.cursor = 'default';
  hoveredExtreme = false;
});

canvas.addEventListener('click', (event) => {
  if (anyTutorialOpen()) return; // klikken op de HUD erachter terwijl een rondleiding openstaat, telt niet

  const rect = canvas.getBoundingClientRect();
  const scaleX = LOGICAL_WIDTH / rect.width;
  const scaleY = LOGICAL_HEIGHT / rect.height;
  const px = (event.clientX - rect.left) * scaleX;
  const py = (event.clientY - rect.top) * scaleY;

  if ((gameMode === 'start' || gameMode === 'gameOver') && extremeUnlocked() && hitTest(px, py, EXTREME_BUTTON)) {
    startExtremeGame();
    return;
  }
  if (gameMode === 'start' && hitTest(px, py, START_BUTTON)) {
    gameMode = 'practiceChoice'; // elke keer eerst de keuze: oefenronde spelen of 'niet de eerste keer'
    return;
  }
  if (gameMode === 'practiceChoice') {
    if (hitTest(px, py, PRACTICE_PLAY_BUTTON)) startPractice();
    else if (hitTest(px, py, PRACTICE_SKIP_LINK)) leavePractice();
    return;
  }
  if (gameMode === 'practice') {
    if (practice.step === 'done' && hitTest(px, py, PRACTICE_DONE_BUTTON)) leavePractice();
    else if (practice.step === 'powerupInfo' && hitTest(px, py, PRACTICE_INFO_BUTTON)) setPracticeStep('fillWeek');
    else if (practice.step === 'weekDone' && hitTest(px, py, PRACTICE_DONE_BUTTON)) setPracticeStep('rules');
    else if (practice.step === 'rules' && hitTest(px, py, PRACTICE_RULES_BUTTON)) setPracticeStep('done');
    else if (practice.step === 'cargoInfo' && hitTest(px, py, PRACTICE_NEXT_BUTTON)) setPracticeStep('plan1');
    else if (hitTest(px, py, PRACTICE_SKIP_BUTTON)) leavePractice();
    return;
  }
  if (gameMode === 'start' && hitTest(px, py, START_BUTTON)) {
    beginGame();
    resetGame();
    if (!level1Tutorial.hasBeenSeen()) level1Tutorial.open(); // legt level 1 uit, maar alleen de allereerste keer
    return;
  }
  if (gameMode === 'paused' && askPractice) {
    if (hitTest(px, py, ASK_YES_BUTTON)) {
      askPractice = false;
      startPractice();
    } else if (hitTest(px, py, ASK_NO_BUTTON)) {
      askPractice = false;
      gameMode = 'playing';
    }
    return;
  }
  if (gameMode === 'paused' && hitTest(px, py, RESUME_BUTTON)) {
    gameMode = 'playing';
    return;
  }
  if (gameMode === 'gameOver' && hitTest(px, py, RESTART_BUTTON)) {
    beginGame();
    resetGame();
    if (!level1Tutorial.hasBeenSeen()) level1Tutorial.open();
    return;
  }
  if (gameMode === 'playing' && hitTest(px, py, HELP_ICON_BUTTON)) {
    askPractice = true; // vraagteken: de oefenronde nog een keer spelen? (het spel staat intussen stil)
    gameMode = 'paused';
    return;
  }
  if (gameMode === 'playing' && isShowingLevelSummary && weekSummaryButtonRect && hitTest(px, py, weekSummaryButtonRect)) {
    endLevelSummary();
    return;
  }
  if (gameMode === 'playing' && hitTest(px, py, PAUSE_ICON_BUTTON)) {
    gameMode = 'paused';
    return;
  }
  if (hitTest(px, py, MUTE_ICON_BUTTON)) {
    toggleMute();
  }
});

let lastTimestampMs = 0;
let isRunning = true;

function loseLife() {
  if (isGameOver) return;
  lives = Math.max(0, lives - 1);
  livesLostThisGame += 1;
  lastLifeLostClockMs = gameClockMs;
  damageFlashMs = 150;
  sounds.lifeLost();
  if (lives === 0) {
    isGameOver = true;
    gameMode = 'gameOver';
    sounds.gameOver();
    recordGameResult();
  }
}

function addScore(points) {
  score += activeEffects.doubleScore ? points * 2 : points;
}

// Taken vangen mag iets ruimer dan de raket zelf (meteorieten niet): zo voelt vangen eerlijker.
const CATCH_MARGIN_X = 14;
const CATCH_MARGIN_TOP = 10;
function CATCH_RECT(p) {
  return { x: p.x - CATCH_MARGIN_X, y: p.y - CATCH_MARGIN_TOP, width: p.width + CATCH_MARGIN_X * 2, height: p.height + CATCH_MARGIN_TOP };
}

function applyPowerup(type) {
  switch (type) {
    case 'shield':
      activeEffects.hasShield = true;
      showFeedback('Schild actief!');
      sounds.shield();
      break;
    case 'magnet':
      activeEffects.magnetMs = GAME_CONFIG.magnetDuration;
      showFeedback('Magneet actief!');
      sounds.powerupCaught();
      break;
    case 'slowMotion':
      activeEffects.slowMotionMs = GAME_CONFIG.slowMotionDuration;
      showFeedback('Tijdvertrager actief!');
      sounds.powerupCaught();
      break;
    case 'extraLife':
      if (lives < GAME_CONFIG.maximumLives) {
        lives += 1;
        showFeedback('Extra leven!');
      } else {
        showFeedback('Levens al vol.');
      }
      sounds.powerupCaught();
      break;
    case 'doubleScore':
      activeEffects.doubleScore = true;
      showFeedback('Dubbele score!');
      sounds.powerupCaught();
      break;
    default:
      break;
  }

}

// ── Oefenronde (eerste keer) ─────────────────────────────────────────────
// Korte, begeleide ronde: vliegen → 2 taken op maandag plannen → een grote taak die
// NIET op maandag past. Geen levens, geen score, niets valt terwijl je kiest. Wordt één
// keer aangeboden (met 'overslaan'); opnieuw proberen kan met ?oefenen in de URL.
const PRACTICE_DONE_KEY = 'kvm_pp2_practice_done_v1';
const LEVEL1_TUTORIAL_KEY = 'kvm_pp2_tut_level1_v1';
// Valsnelheid in de oefenronde: de losse vang-stappen zijn 50% sneller dan eerst (38 -> 57), maar bij het vol maken
// van de week valt het rustiger (een gemiste taak 'kost' dan een leven, en er vallen er meer na elkaar).
const PRACTICE_FALL_SPEED = 57;
const PRACTICE_FILL_WEEK_FALL_SPEED = 38;
const PRACTICE_DAYS = 3;
const PRACTICE_FORCED = new URLSearchParams(window.location.search).has('oefenen');

const PRACTICE_PLAY_BUTTON = { x: LOGICAL_WIDTH / 2 - 110, y: 275, width: 220, height: 56 };
const PRACTICE_SKIP_LINK = { x: LOGICAL_WIDTH / 2 - 90, y: 350, width: 180, height: 28 };
const PRACTICE_SKIP_BUTTON = { x: 20, y: 66, width: 92, height: 24 };
const PRACTICE_DONE_CARD = { width: 400, height: 200, x: LOGICAL_WIDTH / 2 - 200, y: 110 };
const PRACTICE_DONE_BUTTON = { x: LOGICAL_WIDTH / 2 - 100, y: PRACTICE_DONE_CARD.y + PRACTICE_DONE_CARD.height - 76, width: 200, height: 56 };

const PRACTICE_PROMPTS = {
  fly: ['Vlieg met de pijltjestoetsen ← en →', 'Of met de toetsen A en D. Probeer even links en rechts'],
  catch1: ['Vang de taak die naar beneden valt', 'Vlieg eronder'],
  cargoInfo: ['Dit is je laadruimte', 'Gevangen taken komen hier. Er zijn maximaal 5 plekken.'],
  plan1: ['Plan taken in, zo blijft je laadruimte leeg', 'Druk op de toets 1 op je toetsenbord: maandag'],
  catch2: ['Daar komt er nog één. Vang hem!', 'Vlieg eronder'],
  plan2: ['Je kunt zometeen elke dag kiezen,', 'maar kies voor deze uitleg weer even maandag (toets 1)'],
  catchLarge: ['Pas op: een grote taak! Vang hem', 'Een grote taak kost 2 plekken'],
  planLarge: ['Maandag heeft nog maar 1 plek vrij', 'Deze taak kost 2 plekken. Kies dinsdag of woensdag (2 of 3 op je toetsenbord)'],
  meteor: ['Pas op: een meteoriet!', 'Vlieg opzij, zodat je deze niet raakt!'],
  catchPowerup: ['Dit is een power-up: het schild', 'Vang hem voor een bonus'],
  fillWeek: ['Vul nu je hele week', 'Vang taken en plan ze in met de toetsen 1, 2 of 3']
};
const PRACTICE_RULES_CARD = { width: 680, height: 380, x: LOGICAL_WIDTH / 2 - 340, y: 50 };
const PRACTICE_RULES_BUTTON = { x: LOGICAL_WIDTH / 2 - 90, y: PRACTICE_RULES_CARD.y + PRACTICE_RULES_CARD.height - 62, width: 180, height: 44 };
const PRACTICE_INFO_CARD = { width: 640, height: 300, x: LOGICAL_WIDTH / 2 - 320, y: 70 };
const PRACTICE_INFO_BUTTON = { x: LOGICAL_WIDTH / 2 - 90, y: PRACTICE_INFO_CARD.y + PRACTICE_INFO_CARD.height - 66, width: 180, height: 48 };
const PRACTICE_METEOR_SPEED = 82; // was 55 (50% sneller)
// Uitlegkaart onder de laadruimte (met pijltje omhoog) voor de laadruimte-stap.
const PRACTICE_CARGO_CARD = { x: LOGICAL_WIDTH - 350, y: 138, width: 334, height: 140 };
const PRACTICE_NEXT_BUTTON = {
  x: PRACTICE_CARGO_CARD.x + PRACTICE_CARGO_CARD.width / 2 - 80,
  y: PRACTICE_CARGO_CARD.y + PRACTICE_CARGO_CARD.height - 54,
  width: 160,
  height: 40
};
const PRACTICE_POWERUP_ICONS = [
  ['powerupShield', 'Schild'],
  ['powerupMagnet', 'Magneet'],
  ['powerupSlowMotion', 'Tijdvertrager'],
  ['powerupExtraLife', 'Extra leven'],
  ['powerupDoubleScore', 'Dubbele score']
];

let practice = null; // { step, moved, lastX, hint, hintMs } zolang de oefenronde loopt

function isPracticeDone() {
  if (PRACTICE_FORCED) return false;
  try {
    return localStorage.getItem(PRACTICE_DONE_KEY) === '1';
  } catch {
    return false;
  }
}

// Zowel na afronden als na overslaan: de oefenronde vervangt de losse level 1-rondleiding.
function markPracticeDone() {
  try {
    localStorage.setItem(PRACTICE_DONE_KEY, '1');
    localStorage.setItem(LEVEL1_TUTORIAL_KEY, '1');
    localStorage.setItem('kvm_pp2_tut_level3_v1', '1'); // meteorieten ook: geen extra pauzekaartje meer
  } catch {
    // geen probleem: dan krijgt de speler het de volgende keer gewoon weer aangeboden
  }
}

function startPractice() {
  resetGame();
  weekPlanning = createWeekPlanning(PRACTICE_DAYS, GAME_CONFIG.slotsPerDay); // mini-week van 3 dagen
  practice = { step: 'fly', moved: 0, lastX: player.x, hint: '', hintMs: 0, meteorOut: false, spawnMs: 1800 };
  // Alleen voor testen: ?stap=meteor (of catchPowerup, powerupInfo, enz.) springt naar die stap.
  // ?oefenen springt nooit: de oefenronde begint dan altijd bij het vliegen.
  const jumpTo = new URLSearchParams(window.location.search).get('stap');
  if (jumpTo && (jumpTo in PRACTICE_PROMPTS || ['powerupInfo', 'weekDone', 'rules', 'done'].includes(jumpTo))) practice.step = jumpTo;
  if (['fillWeek', 'weekDone', 'rules'].includes(practice.step)) {
    // test-sprong: zet de week alvast in de stand na de grote taak (Maandag 2 kleine, Dinsdag 1 grote)
    for (let i = 0; i < 2; i++) {
      spawnSmallTask(taskSpawner, 0, 1);
      placeTaskInDay(weekPlanning, 0, taskSpawner.tasks.pop());
    }
    spawnLargeTask(taskSpawner, 0, 1);
    placeTaskInDay(weekPlanning, 1, taskSpawner.tasks.pop());
  }
  if (['cargoInfo', 'plan1', 'plan2'].includes(practice.step)) {
    spawnSmallTask(taskSpawner, 0, 1);
    addToCargo(cargo, taskSpawner.tasks.pop()); // test-sprong: zorg dat er iets in de laadruimte zit
  }
  if (['powerupInfo', 'fillWeek', 'weekDone', 'rules', 'done'].includes(practice.step)) activeEffects.hasShield = true;
  gameMode = 'practice';
}

function leavePractice() {
  markPracticeDone();
  practice = null;
  beginGame();
  resetGame(); // zet gameMode op 'playing': het echte spel begint
}

function setPracticeStep(step) {
  practice.step = step;
  practice.hint = '';
  practice.hintMs = 0;
  practice.spawnMs = 1800; // fillWeek: meteen een eerste taak
  if (step === 'done' || step === 'weekDone') sounds.levelComplete();
}

function practiceHint(message, dayIndex) {
  practice.hint = message;
  practice.hintMs = 2600;
  shakeDayIndex = dayIndex;
  shakeTimerMs = 300;
  sounds.dayFull();
}

// Een taak onderaan laten vallen (niet gevangen) kost in het echte spel een leven. In de oefenronde
// verlies je niets, maar je ziet en hoort wel hetzelfde als bij een meteoriet die je raakt.
function practiceMissed() {
  damageFlashMs = 150;
  sounds.lifeLost();
  practice.hint = 'Gemist! In het echte spel kost dit een leven. Probeer het nog eens.';
  practice.hintMs = 3200;
}

function spawnPracticeTask(isLarge, speed = PRACTICE_FALL_SPEED) {
  taskSpawner.lastSpawnX = player.x; // hou de taak dichtbij de raket: geen lange reis
  if (isLarge) spawnLargeTask(taskSpawner, speed, 0.3);
  else spawnSmallTask(taskSpawner, speed, 0.3);
}

function updatePractice(deltaSeconds) {
  taskSpawner.minDistancePx = 0;
  taskSpawner.validate = null; // oefenronde: geen bereikbaarheidscheck nodig, alles is bewust ingericht
  updatePlayer(player, deltaSeconds, LOGICAL_WIDTH);

  if (practice.hintMs > 0) practice.hintMs = Math.max(0, practice.hintMs - deltaSeconds * 1000);
  if (damageFlashMs > 0) damageFlashMs = Math.max(0, damageFlashMs - deltaSeconds * 1000);
  if (shakeTimerMs > 0) {
    shakeTimerMs = Math.max(0, shakeTimerMs - deltaSeconds * 1000);
    if (shakeTimerMs === 0) shakeDayIndex = -1;
  }
  for (const popup of scorePopups) {
    popup.y -= 40 * deltaSeconds;
    popup.ms -= deltaSeconds * 1000;
  }
  scorePopups = scorePopups.filter((popup) => popup.ms > 0);

  const step = practice.step;

  if (step === 'fly') {
    practice.moved += Math.abs(player.x - practice.lastX);
    practice.lastX = player.x;
    if (practice.moved >= 400) setPracticeStep('catch1');
    return;
  }

  if (step === 'catch1' || step === 'catch2' || step === 'catchLarge') {
    if (taskSpawner.tasks.length === 0) spawnPracticeTask(step === 'catchLarge'); // gemist? dan valt er gewoon weer een
    for (const task of taskSpawner.tasks) task.y += task.fallSpeed * deltaSeconds;
    const tasksBefore = taskSpawner.tasks.length;
    taskSpawner.tasks = taskSpawner.tasks.filter((task) => task.y <= playAreaHeight);
    if (taskSpawner.tasks.length < tasksBefore) practiceMissed(); // onderaan uit beeld gevallen

    const caught = taskSpawner.tasks.find((task) => rectsOverlap(CATCH_RECT(player), task));
    if (caught) {
      taskSpawner.tasks = [];
      addToCargo(cargo, caught);
      (caught.slots === 2 ? sounds.catchLarge : sounds.catchSmall)();
      addScorePopup(caught.x + caught.width / 2, caught.y, 'Gevangen!');
      setPracticeStep(step === 'catch1' ? 'cargoInfo' : step === 'catch2' ? 'plan2' : 'planLarge');
    }
  }
  if (step === 'meteor') {
    if (!practice.meteorOut) {
      spawnMeteor(meteorSpawner, PRACTICE_METEOR_SPEED, null);
      const meteor = meteorSpawner.meteors[meteorSpawner.meteors.length - 1];
      // vlak boven de raket, zodat je echt moet bewegen
      meteor.x = Math.max(40, Math.min(LOGICAL_WIDTH - 40, player.x + player.width / 2 + (Math.random() * 120 - 60)));
      practice.meteorOut = true;
    }
    for (const meteor of meteorSpawner.meteors) meteor.y += meteor.fallSpeed * deltaSeconds;

    if (meteorSpawner.meteors.some((meteor) => circleRectOverlap(meteor, player))) {
      meteorSpawner.meteors = [];
      practice.meteorOut = false; // raak: gewoon nog een keer proberen
      damageFlashMs = 150;
      sounds.meteorHit();
      practice.hint = 'Geraakt! In het echte spel kost dit een leven. Probeer het nog eens.';
      practice.hintMs = 3200;
    } else if (meteorSpawner.meteors.every((meteor) => meteor.y - meteor.radius > playAreaHeight)) {
      meteorSpawner.meteors = []; // ontweken!
      sounds.catchSmall();
      setPracticeStep('catchPowerup');
    }
    return;
  }

  if (step === 'catchPowerup') {
    if (powerupSpawner.items.length === 0) {
      powerupSpawner.items.push({
        type: 'shield',
        x: Math.max(0, Math.min(LOGICAL_WIDTH - 41, player.x + (Math.random() * 160 - 80))),
        y: -41,
        width: 41,
        height: 41,
        fallSpeed: 72 // was 48 (50% sneller)
      });
    }
    for (const item of powerupSpawner.items) item.y += item.fallSpeed * deltaSeconds;
    powerupSpawner.items = powerupSpawner.items.filter((item) => item.y <= playAreaHeight); // gemist? dan valt er weer een

    const caught = powerupSpawner.items.find((item) => rectsOverlap(CATCH_RECT(player), item));
    if (caught) {
      powerupSpawner.items = [];
      sounds.shield();
      activeEffects.hasShield = true; // het schild zit nu om de raket (tot het einde van de oefenronde)
      setPracticeStep('powerupInfo');
    }
  }
  if (step === 'fillWeek') {
    const totalSlots = PRACTICE_DAYS * GAME_CONFIG.slotsPerDay;
    const remaining = totalSlots - totalFilledSlots(weekPlanning);
    const inPlay = usedSlots(cargo) + taskSpawner.tasks.length;
    practice.spawnMs += deltaSeconds * 1000;
    if (remaining - inPlay > 0 && practice.spawnMs >= 1800) {
      practice.spawnMs = 0;
      spawnPracticeTask(false, PRACTICE_FILL_WEEK_FALL_SPEED); // de week vol maken: rustiger tempo
    }
    for (const task of taskSpawner.tasks) task.y += task.fallSpeed * deltaSeconds;
    const tasksBeforeFill = taskSpawner.tasks.length;
    taskSpawner.tasks = taskSpawner.tasks.filter((task) => task.y <= playAreaHeight); // gemist: komt vanzelf een nieuwe
    if (taskSpawner.tasks.length < tasksBeforeFill) practiceMissed();

    taskSpawner.tasks = taskSpawner.tasks.filter((task) => {
      if (!rectsOverlap(CATCH_RECT(player), task) || !hasRoomFor(cargo, task)) return true;
      addToCargo(cargo, task);
      sounds.catchSmall();
      addScorePopup(task.x + task.width / 2, task.y, 'Gevangen!');
      return false;
    });

    if (remaining <= 0) setPracticeStep('weekDone');
  }
  // plan-stappen en de infokaarten: er valt niets. De speler heeft alle tijd.
}

function placePracticeTask(dayIndex) {
  const task = removeNextTask(cargo);
  placeTaskInDay(weekPlanning, dayIndex, task);
  (task.slots === 2 ? sounds.planLarge : sounds.planSmall)();
  const columnWidth = LOGICAL_WIDTH / PRACTICE_DAYS;
  addScorePopup(columnWidth * dayIndex + columnWidth / 2, playAreaHeight - 6, 'Mooi!', '#38bdf8');
}

function handlePracticeKey(event) {
  const step = practice.step;
  if (step === 'done') {
    if (event.key === ' ' || event.key === 'Enter') leavePractice();
    return;
  }
  if (step === 'powerupInfo') {
    if (event.key === ' ' || event.key === 'Enter') setPracticeStep('fillWeek');
    return;
  }
  if (step === 'weekDone') {
    if (event.key === ' ' || event.key === 'Enter') setPracticeStep('rules');
    return;
  }
  if (step === 'rules') {
    if (event.key === ' ' || event.key === 'Enter') setPracticeStep('done');
    return;
  }
  if (step === 'cargoInfo') {
    if (event.key === ' ' || event.key === 'Enter') setPracticeStep('plan1');
    return;
  }
  if (step === 'fillWeek') {
    const dayIdx = DAY_KEYS.indexOf(event.key);
    if (dayIdx === -1 || dayIdx >= PRACTICE_DAYS) return;
    const nextTask = peekNextTask(cargo);
    if (!nextTask) {
      practiceHint('Vang eerst een taak, dan kun je hem inplannen.', -1);
      return;
    }
    if (!hasRoomInDay(weekPlanning, dayIdx, nextTask)) {
      practiceHint(`${weekPlanning.days[dayIdx].name} zit vol. Kies een andere dag.`, dayIdx);
      return;
    }
    placePracticeTask(dayIdx);
    return;
  }

  const dayIndex = DAY_KEYS.indexOf(event.key);
  if (dayIndex === -1 || dayIndex >= PRACTICE_DAYS) return;

  if (step === 'plan1' || step === 'plan2') {
    if (dayIndex !== 0) {
      practiceHint('Plan deze taak even op maandag: druk op de 1.', dayIndex);
      return;
    }
    placePracticeTask(0);
    setPracticeStep(step === 'plan1' ? 'catch2' : 'catchLarge');
  } else if (step === 'planLarge') {
    if (!hasRoomInDay(weekPlanning, dayIndex, peekNextTask(cargo))) {
      practiceHint('Dat past niet. Kies dinsdag of woensdag (2 of 3 op je toetsenbord).', dayIndex);
      return;
    }
    placePracticeTask(dayIndex);
    setPracticeStep('meteor');
  }
}

// Grote 'toetsjes' (1, 2, 3) in de hoek van elke dag tijdens het plannen: zo is meteen duidelijk
// dat je die cijfertoetsen op je toetsenbord gebruikt. Wie mag, licht amber op; de rest is gedimd.
const PRACTICE_KEYCAP_STEPS = ['plan1', 'plan2', 'planLarge', 'fillWeek'];
function renderPracticeKeycaps() {
  const highlight = getPracticeHighlight();
  const gap = 6;
  const dayWidth = (LOGICAL_WIDTH - gap * (PRACTICE_DAYS - 1)) / PRACTICE_DAYS;
  for (let i = 0; i < PRACTICE_DAYS; i++) {
    const active = !highlight || highlight.includes(i);
    const size = 32;
    const x = i * (dayWidth + gap) + 4;
    const y = playAreaHeight + 3;
    drawRoundedRect(ctx, x, y, size, size, 7, {
      fill: active ? '#f59e0b' : '#141d33', // ondoorzichtig, anders schijnt het kleine dagcijfer erdoorheen
      stroke: active ? '#fde68a' : THEME.color.border,
      strokeWidth: 2,
      shadow: active ? THEME.shadow.chip : undefined
    });
    ctx.textAlign = 'center';
    ctx.fillStyle = active ? '#1f1300' : THEME.color.textMuted;
    ctx.font = 'bold 18px \'Inria Sans\', sans-serif';
    ctx.fillText(String(i + 1), x + size / 2, y + size / 2 + 6.5);
  }
}

// Welke dagen oplichten: bij de eerste twee plan-stappen alleen Maandag, bij de grote taak
// alleen de dagen waar hij nog in past. Zo zie je meteen waar je moet zijn.
function getPracticeHighlight() {
  if (gameMode !== 'practice') return null;
  if (practice.step === 'plan1' || practice.step === 'plan2') return [0];
  if (practice.step === 'fillWeek') {
    const next = peekNextTask(cargo);
    return next ? weekPlanning.days.map((_d, i) => i).filter((i) => hasRoomInDay(weekPlanning, i, next)) : null;
  }
  if (practice.step === 'planLarge') {
    return weekPlanning.days.map((_d, i) => i).filter((i) => hasRoomInDay(weekPlanning, i, { slots: 2 }));
  }
  return null;
}

// Welke toetsen worden nu ingedrukt? Voor de grote ←/→-toetsen in de eerste oefenstap.
const heldKeys = new Set();
window.addEventListener('keydown', (event) => heldKeys.add(event.key.toLowerCase()));
window.addEventListener('keyup', (event) => heldKeys.delete(event.key.toLowerCase()));
window.addEventListener('blur', () => heldKeys.clear());

// Eerste oefenstap: twee grote glazen toetsen midden in beeld (in de stijl van het spel: donker glas, blauwe
// gloed, zelfgetekende pijlen), zodat meteen duidelijk is wat je moet doen. Ze lichten op als je ze indrukt.
function drawArrowGlyph(centerX, centerY, direction, size, color) {
  // Een afgeronde pijl (lijn met punt), direction = -1 (links) of 1 (rechts).
  const half = size / 2;
  const head = size * 0.38;
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(direction, 1);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = size * 0.16;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(-half, 0);
  ctx.lineTo(half, 0);
  ctx.moveTo(half - head, -head);
  ctx.lineTo(half, 0);
  ctx.lineTo(half - head, head);
  ctx.stroke();
  ctx.restore();
}

// Een glazen toets met gloed, glasglans en 'indrukken'. glyph(centerX, centerY) tekent wat erop staat.
// active=false: gedimd (de toets hoort er wel bij, maar is nu niet de bedoeling).
function drawGlassKey(x, baseY, size, { down = false, active = true, phase = 0, glyph }) {
  const t = Date.now();
  const pulse = 0.5 + 0.5 * Math.sin(t / 380);
  const bob = !active ? 0 : down ? 3 : Math.sin(t / 700 + phase) * 2.5; // zweeft rustig, zakt in als je drukt
  const y = baseY + bob;
  const glow = active ? 6 + pulse * 10 + (down ? 6 : 0) : 0;
  ctx.save();
  ctx.globalAlpha = active ? 1 : 0.38;

  if (active) {
    drawRoundedRect(ctx, x - glow, y - glow, size + glow * 2, size + glow * 2, 22 + glow, {
      fill: `rgba(114, 168, 249, ${down ? 0.34 : 0.07 + pulse * 0.1})`
    });
  }
  const fill = ctx.createLinearGradient(0, y, 0, y + size);
  if (down) {
    fill.addColorStop(0, 'rgba(160, 200, 255, 0.95)');
    fill.addColorStop(1, 'rgba(90, 140, 230, 0.95)');
  } else {
    fill.addColorStop(0, 'rgba(60, 86, 140, 0.92)');
    fill.addColorStop(1, 'rgba(20, 28, 52, 0.96)');
  }
  drawRoundedRect(ctx, x, y, size, size, 20, {
    fill,
    stroke: down ? '#ffffff' : `rgba(150, 190, 255, ${active ? 0.7 + pulse * 0.3 : 0.5})`,
    strokeWidth: down ? 3 : 2.5,
    shadow: active ? THEME.shadow.glowBlue : undefined
  });
  ctx.beginPath();
  ctx.strokeStyle = `rgba(255, 255, 255, ${down ? 0.7 : 0.28})`;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.moveTo(x + 22, y + 7);
  ctx.lineTo(x + size - 22, y + 7);
  ctx.stroke();

  glyph(x + size / 2, y + size / 2, down, t);
  ctx.restore();
}

// Kopje in een glazen pil, zoals de andere labels in het spel.
function drawGlassCaption(text, centerX, y) {
  const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 380);
  ctx.font = 'bold 14px \'Inria Sans\', sans-serif';
  const width = ctx.measureText(text).width + 36;
  drawRoundedRect(ctx, centerX - width / 2, y, width, 30, 15, {
    fill: THEME.color.surfaceStrong,
    stroke: `rgba(114, 168, 249, ${0.45 + pulse * 0.3})`,
    strokeWidth: 1.5,
    shadow: THEME.shadow.chip
  });
  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.accentBlue;
  ctx.fillText(text, centerX, y + 20);
}

// Klein glazen labeltje onder een toets.
function drawGlassChip(text, centerX, y, { active = true, down = false } = {}) {
  ctx.font = 'bold 13px \'Inria Sans\', sans-serif';
  const width = ctx.measureText(text).width + 22;
  ctx.save();
  ctx.globalAlpha = active ? 1 : 0.4;
  drawRoundedRect(ctx, centerX - width / 2, y, width, 24, 12, {
    fill: THEME.color.surfaceStrong,
    stroke: THEME.color.border,
    strokeWidth: 1.2
  });
  ctx.textAlign = 'center';
  ctx.fillStyle = down ? THEME.color.accentBlue : THEME.color.textMuted;
  ctx.fillText(text, centerX, y + 17);
  ctx.restore();
}

function renderPracticeFlyHint() {
  const cx = LOGICAL_WIDTH / 2;
  const keySize = 84;
  const gap = 140;
  const baseY = 168;
  const keys = [
    { x: cx - gap / 2 - keySize, dir: -1, letter: 'A', down: heldKeys.has('arrowleft') || heldKeys.has('a'), phase: 0 },
    { x: cx + gap / 2, dir: 1, letter: 'D', down: heldKeys.has('arrowright') || heldKeys.has('d'), phase: 1.4 }
  ];
  drawGlassCaption('Druk op de pijltjestoetsen op je toetsenbord', cx, baseY - 52);
  for (const key of keys) {
    drawGlassKey(key.x, baseY, keySize, {
      down: key.down,
      phase: key.phase,
      glyph: (gx, gy, down, t) => {
        const nudge = key.dir * Math.sin(t / 220 + key.phase) * 4; // de pijl wiebelt een beetje in zijn richting
        drawArrowGlyph(gx + nudge, gy, key.dir, 40, down ? '#0b1b3a' : '#e6f0ff');
      }
    });
    drawGlassChip(`of ${key.letter}`, key.x + keySize / 2, baseY + keySize + 14, { down: key.down });
  }
}

// Plan-stappen: de toetsen 1, 2 en 3 naast elkaar, als een stukje toetsenbord. De toets(en) die nu de bedoeling
// zijn gloeien en wiebelen; de rest is gedimd. Ze lichten op als je ze indrukt. Alleen als alles stilstaat.
const PRACTICE_NUMBER_STEPS = ['plan1', 'plan2', 'planLarge'];
function renderPracticeNumberHint() {
  const cx = LOGICAL_WIDTH / 2;
  const keySize = 84;
  const gap = 22;
  const baseY = 168;
  const totalWidth = PRACTICE_DAYS * keySize + (PRACTICE_DAYS - 1) * gap;
  const targets = getPracticeHighlight() ?? [];
  const captions = {
    plan1: 'Druk op de toets 1 op je toetsenbord',
    plan2: 'Druk weer op de toets 1',
    planLarge: 'Druk op de toets 2 of 3'
  };
  drawGlassCaption(captions[practice.step], cx, baseY - 52);

  for (let i = 0; i < PRACTICE_DAYS; i++) {
    const x = cx - totalWidth / 2 + i * (keySize + gap);
    const active = targets.includes(i);
    const down = heldKeys.has(String(i + 1));
    drawGlassKey(x, baseY, keySize, {
      down,
      active,
      phase: i * 0.9,
      glyph: (gx, gy, isDown) => {
        ctx.textAlign = 'center';
        ctx.fillStyle = isDown ? '#0b1b3a' : '#e6f0ff';
        ctx.font = 'bold 44px \'Inria Sans\', sans-serif';
        ctx.fillText(String(i + 1), gx, gy + 15);
      }
    });
    drawGlassChip(weekPlanning.days[i].name.toLowerCase(), x + keySize / 2, baseY + keySize + 14, { active, down });
  }
}

function renderPracticeHud() {
  ctx.textAlign = 'left';
  ctx.fillStyle = THEME.color.accentAmber;
  ctx.font = 'bold 13px \'Inria Sans\', sans-serif';
  ctx.fillText('OEFENRONDE', 22, 40);
  drawGhostButton(PRACTICE_SKIP_BUTTON, 'Overslaan');

  const prompt = practice.step === 'cargoInfo' ? null : PRACTICE_PROMPTS[practice.step]; // die stap heeft een eigen kaart
  if (prompt) {
    ctx.textAlign = 'center';
    const emphasize = practice.step === 'fly'; // eerste stap: groter en oranje, met een zacht pulserende gloed
    ctx.fillStyle = emphasize ? '#fbbf24' : THEME.color.textPrimary;
    ctx.font = `bold ${emphasize ? 22 : 19}px 'Inria Sans', sans-serif`;
    if (emphasize) {
      ctx.shadowColor = 'rgba(245, 158, 11, 0.9)';
      ctx.shadowBlur = 8 + 8 * (0.5 + 0.5 * Math.sin(Date.now() / 300));
    }
    ctx.fillText(prompt[0], LOGICAL_WIDTH / 2, HUD_PANEL.y + 42);
    ctx.shadowBlur = 0;
    ctx.fillStyle = THEME.color.textMuted;
    ctx.font = '14px \'Inria Sans\', sans-serif';
    const subText =
      practice.step === 'fillWeek'
        ? `Plan met de toetsen 1, 2 of 3. Nog ${PRACTICE_DAYS * GAME_CONFIG.slotsPerDay - totalFilledSlots(weekPlanning)} plekken te vullen`
        : prompt[1];
    ctx.fillText(subText, LOGICAL_WIDTH / 2, HUD_PANEL.y + 66);
  }
  if (practice.hintMs > 0) {
    ctx.fillStyle = THEME.color.accentAmber;
    ctx.font = 'bold 13px \'Inria Sans\', sans-serif';
    ctx.fillText(practice.hint, LOGICAL_WIDTH / 2, HUD_PANEL.y + 90);
  }

  renderCargo(ctx, cargo, LOGICAL_WIDTH - 16, 18, getImage('taskSmall'), getImage('taskLarge'), getImage('iconWarning'));

  if (practice.step === 'cargoInfo') {
    // Laadruimte uitlichten: ademende amber rand + knop om verder te gaan (alles staat stil).
    const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 260);
    const pad = 4 + pulse * 4;
    drawRoundedRect(ctx, CARGO_REGION.x - pad, CARGO_REGION.y - pad, CARGO_REGION.width + pad * 2, CARGO_REGION.height + pad * 2, THEME.radius.md + pad, {
      stroke: `rgba(245, 158, 11, ${0.6 + pulse * 0.4})`,
      strokeWidth: 2.5
    });

    // Uitlegkaart met pijltje omhoog naar de laadruimte, knop erin.
    const card = PRACTICE_CARGO_CARD;
    const arrowX = CARGO_REGION.x + CARGO_REGION.width / 2;
    drawRoundedRect(ctx, card.x, card.y, card.width, card.height, THEME.radius.md, {
      fill: THEME.color.surface,
      stroke: THEME.color.accentAmber,
      strokeWidth: 2,
      shadow: THEME.shadow.card
    });
    ctx.beginPath();
    ctx.moveTo(arrowX - 11, card.y + 1);
    ctx.lineTo(arrowX, card.y - 13);
    ctx.lineTo(arrowX + 11, card.y + 1);
    ctx.closePath();
    ctx.fillStyle = THEME.color.surface;
    ctx.fill();
    ctx.strokeStyle = THEME.color.accentAmber;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(arrowX - 11, card.y);
    ctx.lineTo(arrowX, card.y - 13);
    ctx.lineTo(arrowX + 11, card.y);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = THEME.color.accentAmber;
    ctx.font = 'bold 18px \'Inria Sans\', sans-serif';
    ctx.fillText('Dit is je laadruimte', card.x + card.width / 2, card.y + 34);
    ctx.fillStyle = THEME.color.textPrimary;
    ctx.font = '14px \'Inria Sans\', sans-serif';
    ctx.fillText('Gevangen taken komen hier terecht.', card.x + card.width / 2, card.y + 58);
    ctx.fillText('Er zijn maximaal 5 plekken.', card.x + card.width / 2, card.y + 78);
    drawButton(PRACTICE_NEXT_BUTTON, 'Doorgaan');
  }
}

function renderPracticeInfo() {
  ctx.fillStyle = 'rgba(5, 10, 26, 0.55)';
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
  const card = PRACTICE_INFO_CARD;
  drawRoundedRect(ctx, card.x, card.y, card.width, card.height, THEME.radius.lg, {
    fill: THEME.color.surface,
    stroke: THEME.color.border,
    strokeWidth: 1.5,
    shadow: THEME.shadow.card
  });
  const cx = LOGICAL_WIDTH / 2;
  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.accentAmber;
  ctx.font = 'bold 24px \'Inria Sans\', sans-serif';
  ctx.fillText('Je ving een power-up!', cx, card.y + 42);
  ctx.fillStyle = THEME.color.textPrimary;
  ctx.font = '15px \'Inria Sans\', sans-serif';
  ctx.fillText('Dit is het schild, het beschermt je tegen een meteoriet.', cx, card.y + 72);
  ctx.fillStyle = THEME.color.textMuted;
  ctx.fillText('De andere 4 power-ups leggen we later uit!', cx, card.y + 94);

  const slotWidth = 100;
  const startX = cx - (slotWidth * PRACTICE_POWERUP_ICONS.length) / 2;
  const iconSize = 46;
  PRACTICE_POWERUP_ICONS.forEach(([key, label], i) => {
    const slotCx = startX + slotWidth * i + slotWidth / 2;
    const image = getImage(key);
    if (i === 0) {
      ctx.beginPath();
      ctx.strokeStyle = THEME.color.accentAmber;
      ctx.lineWidth = 2.5;
      ctx.arc(slotCx, card.y + 164, iconSize / 2 + 8, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (image) ctx.drawImage(image, slotCx - iconSize / 2, card.y + 164 - iconSize / 2, iconSize, iconSize);
    ctx.fillStyle = i === 0 ? THEME.color.accentAmber : THEME.color.textMuted;
    ctx.font = '11px \'Inria Sans\', sans-serif';
    ctx.fillText(label, slotCx, card.y + 210);
  });

  drawButton(PRACTICE_INFO_BUTTON, 'Snap ik!');
}

// 'Week vol'-kaart: hergebruikt de afmetingen van de eindkaart.
function renderPracticeWeekDone() {
  ctx.fillStyle = 'rgba(5, 10, 26, 0.55)';
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
  drawRoundedRect(ctx, PRACTICE_DONE_CARD.x, PRACTICE_DONE_CARD.y, PRACTICE_DONE_CARD.width, PRACTICE_DONE_CARD.height, THEME.radius.lg, {
    fill: THEME.color.surface,
    stroke: THEME.color.border,
    strokeWidth: 1.5,
    shadow: THEME.shadow.card
  });
  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.accentGreen;
  ctx.font = 'bold 26px \'Inria Sans\', sans-serif';
  ctx.fillText('Week vol!', LOGICAL_WIDTH / 2, PRACTICE_DONE_CARD.y + 50);
  ctx.fillStyle = THEME.color.textMuted;
  ctx.font = '14px \'Inria Sans\', sans-serif';
  ctx.fillText('Zo speel je elk level: vul alle plekken van de week.', LOGICAL_WIDTH / 2, PRACTICE_DONE_CARD.y + 80);
  ctx.fillText('Is je week vol, dan ga je door naar de volgende week.', LOGICAL_WIDTH / 2, PRACTICE_DONE_CARD.y + 102);
  drawButton(PRACTICE_DONE_BUTTON, 'Doorgaan');
}

// Spelregels: levens, XP en highscore.
function renderPracticeRules() {
  ctx.fillStyle = 'rgba(5, 10, 26, 0.55)';
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
  const card = PRACTICE_RULES_CARD;
  drawRoundedRect(ctx, card.x, card.y, card.width, card.height, THEME.radius.lg, {
    fill: THEME.color.surface,
    stroke: THEME.color.border,
    strokeWidth: 1.5,
    shadow: THEME.shadow.card
  });
  const cx = LOGICAL_WIDTH / 2;
  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.accentAmber;
  ctx.font = 'bold 24px \'Inria Sans\', sans-serif';
  ctx.fillText('Nog 3 dingen om te weten', cx, card.y + 42);

  const rows = [
    {
      icon: 'lifeFull',
      count: 3,
      title: 'Je hebt 3 levens',
      text: ['Raakt een meteoriet je, of mis je een taak? Dan verlies je een leven.', 'Heb je geen levens meer? Dan ben je af (game over).']
    },
    {
      icon: 'iconSparkles',
      count: 1,
      title: 'Je verdient XP',
      text: ['Voor elke taak die je vangt en inplant krijg je punten.', 'Hoe meer XP, hoe hoger je score.']
    },
    {
      icon: 'iconTrophy',
      count: 1,
      title: 'Onthoud je highscore goed!',
      text: ['Zit je in de top 3? Dan kom je op de highscore-poster.', 'Onthoud dus goed hoeveel XP je had.']
    }
  ];
  rows.forEach((row, i) => {
    const rowY = card.y + 72 + i * 82;
    const image = getImage(row.icon);
    const size = row.count > 1 ? 30 : 48;
    const iconAreaX = card.x + 36;
    if (image) {
      for (let k = 0; k < row.count; k++) {
        const w = row.count > 1 ? size * (image.width / image.height) : size;
        ctx.drawImage(image, iconAreaX + k * 34, rowY + 18 - (row.count > 1 ? 0 : 4), row.count > 1 ? 30 : w, row.count > 1 ? 26 : size);
      }
    }
    ctx.textAlign = 'left';
    ctx.fillStyle = THEME.color.textPrimary;
    ctx.font = 'bold 17px \'Inria Sans\', sans-serif';
    ctx.fillText(row.title, card.x + 150, rowY + 24);
    ctx.fillStyle = THEME.color.textMuted;
    ctx.font = '14px \'Inria Sans\', sans-serif';
    row.text.forEach((line, k) => ctx.fillText(line, card.x + 150, rowY + 48 + k * 19));
  });

  drawButton(PRACTICE_RULES_BUTTON, 'Snap ik!');
}

function renderPracticeDone() {
  ctx.fillStyle = 'rgba(5, 10, 26, 0.55)';
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
  drawRoundedRect(ctx, PRACTICE_DONE_CARD.x, PRACTICE_DONE_CARD.y, PRACTICE_DONE_CARD.width, PRACTICE_DONE_CARD.height, THEME.radius.lg, {
    fill: THEME.color.surface,
    stroke: THEME.color.border,
    strokeWidth: 1.5,
    shadow: THEME.shadow.card
  });
  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.accentGreen;
  ctx.font = 'bold 26px \'Inria Sans\', sans-serif';
  ctx.fillText('Gelukt!', LOGICAL_WIDTH / 2, PRACTICE_DONE_CARD.y + 50);
  ctx.fillStyle = THEME.color.textMuted;
  ctx.font = '14px \'Inria Sans\', sans-serif';
  ctx.fillText('Je kent nu alles om te beginnen.', LOGICAL_WIDTH / 2, PRACTICE_DONE_CARD.y + 80);
  ctx.fillText('Klaar voor je eerste echte week?', LOGICAL_WIDTH / 2, PRACTICE_DONE_CARD.y + 102);
  drawButton(PRACTICE_DONE_BUTTON, 'Naar het spel');
}

function renderPracticeChoice() {
  ctx.fillStyle = THEME.color.bgDeep;
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
  drawRoundedRect(ctx, START_CARD.x, START_CARD.y, START_CARD.width, START_CARD.height, THEME.radius.lg, {
    fill: THEME.color.surface,
    stroke: THEME.color.border,
    strokeWidth: 1.5,
    shadow: THEME.shadow.card
  });
  const centerX = LOGICAL_WIDTH / 2;
  const rocketImage = getImage('rocket');
  const rocketWidth = 46;
  const rocketHeight = rocketImage ? Math.round(rocketWidth * (rocketImage.height / rocketImage.width)) : 60;
  const rocketTop = START_CARD.y + 24;
  if (rocketImage) ctx.drawImage(rocketImage, centerX - rocketWidth / 2, rocketTop, rocketWidth, rocketHeight);

  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.accentAmber;
  ctx.font = 'bold 26px \'Inria Sans\', sans-serif';
  ctx.fillText('Eerste keer?', centerX, rocketTop + rocketHeight + 30);
  ctx.fillStyle = THEME.color.textMuted;
  ctx.font = '14px \'Inria Sans\', sans-serif';
  ctx.fillText('Doe eerst een korte oefenronde,', centerX, rocketTop + rocketHeight + 62);
  ctx.fillText('dan snap je zo hoe het werkt (ongeveer 1 minuut).', centerX, rocketTop + rocketHeight + 84);

  drawButton(PRACTICE_PLAY_BUTTON, 'Oefenronde spelen');
  drawGhostButton(PRACTICE_SKIP_LINK, 'Niet de eerste keer');
}

// ── Bereikbaarheid ──────────────────────────────────────────────────────────────
// Een leerling moet elke taak altijd kunnen halen. Voor een nieuwe taak of meteoriet kijkt het spel
// of de raket dan nog overal bij kan zonder een meteoriet te raken (reachability.js). Zo niet, dan
// valt die taak/meteoriet er nu niet (of op een andere plek). Power-ups doen hier niet aan mee.
// ── Extreme mode ────────────────────────────────────────────────────────────────
// Wie ooit level 7 heeft uitgespeeld (dus level 8 heeft bereikt) mag in plaats van helemaal vooraan te
// beginnen starten bij level 8 met 4.000 XP. Beschikbaar op het startscherm en na game over. Het is
// verder gewoon het spel zoals het is (geen extra regels). Potjes tellen ook mee voor de standen.
// Leerlingen loggen niet in, dus het ontgrendelen geldt voor het apparaat. Testen: ?extreme in de link.
const BEST_LEVEL_KEY = 'kvm_pp2_best_level_v1';
const EXTREME_START_LEVEL = 8;
const EXTREME_START_XP = 4000;
const EXTREME_UNLOCK_LEVEL = 8; // level 8 bereikt = level 7 uitgespeeld
function readBestLevel() {
  try {
    return Number(localStorage.getItem(BEST_LEVEL_KEY)) || 0;
  } catch {
    return 0;
  }
}
function recordBestLevel(level) {
  if (level <= readBestLevel()) return;
  try {
    localStorage.setItem(BEST_LEVEL_KEY, String(level));
  } catch {
    // geen probleem
  }
}
function extremeUnlocked() {
  return readBestLevel() >= EXTREME_UNLOCK_LEVEL || new URLSearchParams(window.location.search).has('extreme');
}
// Onder de kaart van het startscherm en het game-over-scherm (beide eindigen op dezelfde hoogte).
const EXTREME_BUTTON = { x: LOGICAL_WIDTH / 2 - 150, y: START_CARD.y + START_CARD.height + 14, width: 300, height: 42 };
function startExtremeGame() {
  beginGame();
  resetGame();
  currentLevel = EXTREME_START_LEVEL;
  levelSettings = getLevelSettings(currentLevel);
  score = EXTREME_START_XP;
}
let hoveredExtreme = false; // staat de muis op de Extreme-knop?
function drawExtremeButton() {
  const rect = EXTREME_BUTTON;
  // Ademende oranje gloed (zelfde stijl als de dagen bij een volle laadruimte): trekt de aandacht.
  const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 260);
  const pad = 3 + pulse * 5 + (hoveredExtreme ? 3 : 0);
  drawRoundedRect(ctx, rect.x - pad, rect.y - pad, rect.width + pad * 2, rect.height + pad * 2, rect.height / 2 + pad, {
    fill: `rgba(245, 158, 11, ${0.1 + pulse * 0.18 + (hoveredExtreme ? 0.12 : 0)})`
  });
  drawRoundedRect(ctx, rect.x, rect.y, rect.width, rect.height, rect.height / 2, {
    fill: hoveredExtreme ? 'rgba(245, 158, 11, 0.28)' : 'rgba(245, 158, 11, 0.14)',
    stroke: `rgba(245, 158, 11, ${0.7 + pulse * 0.3})`,
    strokeWidth: 2 + pulse,
    shadow: THEME.shadow.chip
  });
  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.accentAmber;
  ctx.font = 'bold 15px \'Inria Sans\', sans-serif';
  ctx.fillText('Extreme mode', rect.x + rect.width / 2, rect.y + 18);
  ctx.fillStyle = THEME.color.textMuted;
  ctx.font = '11px \'Inria Sans\', sans-serif';
  ctx.fillText(`Begin bij level ${EXTREME_START_LEVEL} met ${EXTREME_START_XP.toLocaleString('nl-NL')} XP`, rect.x + rect.width / 2, rect.y + 34);
}

// ── Niveau van de speler (onzichtbaar) ──────────────────────────────────────────
// Leerlingen loggen niet in, dus dit wordt per apparaat/browser onthouden. Er zijn drie standen die alleen
// level 2 t/m 5 raken (meer of minder ruimte tussen meteorieten onderling en tussen taken onderling, op
// dezelfde snelheid):
//   0 Rustig      geen extra ruimte (zoals het begin)
//   1 Standaard   iets minder dan 'Uitdagend'
//   2 Uitdagend   de eerdere 'ervaren' versie
// Het eerste potje is altijd Rustig. Na elk potje onthoudt het spel of dat potje goed, gewoon of slecht
// was. Na het eerste potje: slecht -> Rustig blijven, anders Standaard. Daarna beslissen de laatste TWEE
// potjes: beide goed = één stand omhoog, beide slecht = één stand omlaag, anders blijft het zoals het is.
// Testen: ?nieuw, ?standaard of ?ervaren in de link forceert een stand (en onthoudt dan niets).
const SKILL_KEY = 'kvm_pp2_skill_v1';
// Wanneer is een potje goed of slecht? (hier bijstellen na proefrondes met leerlingen)
const SKILL = {
  goodMinLevel: 5, // minstens level 5 gehaald = goed
  goodAltLevel: 4, // of minstens level 4 gehaald...
  goodMaxLossPerWeek: 1, // ...met gemiddeld hooguit zoveel levens verloren per uitgespeelde week
  poorMaxLevel: 2, // game over in level 1 of 2 = slecht
  poorMaxSeconds: 90 // of game over binnen zoveel seconden na de start = slecht
};

function readSkill() {
  try {
    const raw = JSON.parse(localStorage.getItem(SKILL_KEY));
    if (raw && typeof raw === 'object') {
      return {
        games: Number(raw.games) || 0,
        finished: Number(raw.finished) || 0,
        tier: Math.max(0, Math.min(2, Number(raw.tier) || 0)),
        results: Array.isArray(raw.results) ? raw.results.slice(-2) : []
      };
    }
  } catch {
    // geen opgeslagen niveau: begin gewoon rustig
  }
  return { games: 0, finished: 0, tier: 0, results: [] };
}
function writeSkill(skill) {
  try {
    localStorage.setItem(SKILL_KEY, JSON.stringify(skill));
  } catch {
    // geen probleem
  }
}

let skillTier = 0; // stand voor het potje dat nu loopt
let skillForced = false; // via ?nieuw / ?standaard / ?ervaren: niets onthouden

function beginGame() {
  const params = new URLSearchParams(window.location.search);
  const forced = params.has('ervaren') ? 2 : params.has('standaard') ? 1 : params.has('nieuw') ? 0 : null;
  skillForced = forced !== null;
  const skill = readSkill();
  skillTier = skillForced ? forced : skill.tier;
  if (!skillForced) {
    skill.games += 1;
    writeSkill(skill);
  }
}

// Zet de uitkomst van een potje om in een nieuwe stand (zie bovenaan: de regels).
function applyGameResult(result) {
  if (skillForced) return;
  const skill = readSkill();
  skill.finished += 1;
  skill.results = [...skill.results, result].slice(-2);
  if (skill.finished === 1) {
    skill.tier = result === 'poor' ? 0 : 1;
  } else if (skill.results.length >= 2) {
    const before = skill.tier;
    if (skill.results.every((r) => r === 'good')) skill.tier = Math.min(2, skill.tier + 1);
    else if (skill.results.every((r) => r === 'poor')) skill.tier = Math.max(0, skill.tier - 1);
    // Na een wisseling begint het tellen opnieuw: weer twee nieuwe potjes nodig voor de volgende stap.
    if (skill.tier !== before) skill.results = [];
  }
  writeSkill(skill);
}

// Bij game over: was dit potje goed, gewoon of slecht?
function recordGameResult() {
  const seconds = gameClockMs / 1000;
  const lossPerWeek = livesLostThisGame / Math.max(1, completedWeeksCount);
  let result = 'neutral';
  if (currentLevel <= SKILL.poorMaxLevel || seconds < SKILL.poorMaxSeconds) {
    result = 'poor';
  } else if (currentLevel >= SKILL.goodMinLevel || (currentLevel >= SKILL.goodAltLevel && lossPerWeek <= SKILL.goodMaxLossPerWeek)) {
    result = 'good';
  }
  applyGameResult(result);
}

// Minimale zijwaartse afstand (px) tussen taken onderling en tussen meteorieten onderling, per stand en level.
const TIER_GAPS = {
  1: {
    2: { task: 100, meteor: 140 },
    3: { task: 115, meteor: 150 },
    4: { task: 125, meteor: 165 },
    5: { task: 140, meteor: 175 }
  },
  2: {
    2: { task: 170, meteor: 230 },
    3: { task: 190, meteor: 250 },
    4: { task: 210, meteor: 270 },
    5: { task: 230, meteor: 290 }
  }
};

// Vangnet binnen een potje (onzichtbaar, werkt in alle levels): na een verloren leven komen de meteorieten
// 20 seconden lang minder vaak; na een minuut zonder verloren leven iets vaker.
const EASE_AFTER_LOSS_MS = 20000;
const EASE_MULTIPLIER = 1.3; // meteoriet-interval x1,3 = ongeveer 30% minder meteorieten
const STREAK_MS = 60000;
const STREAK_MULTIPLIER = 0.9; // iets drukker (ongeveer 10% meer)

let reachabilityBaseline = null; // per frame één keer berekend: per beginpositie of alles nog haalbaar is

function reachabilityScenario(extraTask, extraMeteor) {
  const mustCatch = (task) => task.slots !== 2 || canFitLargeNow();
  const tasks = taskSpawner.tasks.filter(mustCatch);
  if (extraTask && mustCatch(extraTask)) tasks.push(extraTask);
  const meteors = extraMeteor ? [...meteorSpawner.meteors, extraMeteor] : meteorSpawner.meteors;
  const center = player.x + player.width / 2;
  const half = player.width / 2;
  return {
    player,
    canvasWidth: LOGICAL_WIDTH,
    // waar de raket nu staat, en wat links/rechts daarvan: het klopt ook als de speler nog een stukje opschuift
    startCenters: [0, -100, 100, -200, 200].map((offset) => Math.max(half, Math.min(LOGICAL_WIDTH - half, center + offset))),
    tasks,
    meteors
  };
}

// Regel: een nieuwe taak of meteoriet mag een situatie die haalbaar was nooit onhaalbaar maken
// (vanaf waar de raket staat en dichtbij). Is het vanaf de huidige plek al niet meer te halen, dan
// komt er geen nieuwe meteoriet bij (een extra taak mag wel).
function reachabilityOk(extraTask, extraMeteor) {
  if (reachabilityBaseline === null) reachabilityBaseline = feasibleStarts(reachabilityScenario(null, null));
  if (!reachabilityBaseline[0]) return !extraMeteor;
  const withExtra = feasibleStarts(reachabilityScenario(extraTask, extraMeteor));
  return reachabilityBaseline.every((wasOk, i) => !wasOk || withExtra[i]);
}

function meteorEaseFactor() {
  const sinceLoss = gameClockMs - lastLifeLostClockMs;
  if (sinceLoss < EASE_AFTER_LOSS_MS && livesLostThisGame > 0) return EASE_MULTIPLIER;
  if (sinceLoss >= STREAK_MS) return STREAK_MULTIPLIER;
  return 1;
}

function update(deltaSeconds) {
  if (gameMode === 'practice') {
    updatePractice(deltaSeconds);
    return;
  }
  if (gameMode !== 'playing') return;

  if (isShowingLevelSummary) {
    return; // gameplay staat stil; wacht op de speler (knop of spatie)
  }

  if (anyTutorialOpen()) {
    return; // gameplay staat stil zolang een rondleiding open staat, anders mis je taken tijdens het lezen
  }

  updatePlayer(player, deltaSeconds, LOGICAL_WIDTH);

  gameClockMs += deltaSeconds * 1000;
  reachabilityBaseline = null;
  taskSpawner.minDistancePx = levelSettings.minSpawnDistancePercent * LOGICAL_WIDTH;
  const experiencedGaps = skillTier > 0 ? TIER_GAPS[skillTier]?.[currentLevel] : undefined;
  taskSpawner.taskGapPx = experiencedGaps ? experiencedGaps.task : 0;
  meteorSpawner.gapPx = experiencedGaps ? experiencedGaps.meteor : 0;
  taskSpawner.validate = (x, size, slots, fallSpeed) =>
    reachabilityOk({ x, y: -size, width: size, height: size, slots, fallSpeed }, null);

  tickActiveEffects(activeEffects, deltaSeconds);
  const speedMultiplier = activeEffects.slowMotionMs > 0 ? GAME_CONFIG.slowMotionMultiplier : 1;

  // Een grote taak mag alleen spawnen (en hieronder: gevangen worden) als er nu
  // ergens in de week nog plek voor is — én die plek nog niet 'gereserveerd' is
  // door een grote taak die al in de laadruimte zit maar nog niet is ingepland.
  // Zonder die tweede check zou een 2e grote taak nog kunnen vallen terwijl er
  // nog maar 1 dag met 2 vrije plekken over is, wat alsnog tot een vastloper leidt.
  const daysWithRoomForLarge = weekPlanning.days.filter((_day, dayIndex) =>
    hasRoomInDay(weekPlanning, dayIndex, { slots: 2 })
  ).length;
  const queuedLargeTaskCount = cargo.queue.filter((task) => task.slots === 2).length;
  const canFitLargeTask = daysWithRoomForLarge > queuedLargeTaskCount;

  // ── Grote taken mogen nooit 'voor niks' bestaan ──────────────────────────────
  // Een grote taak (2 plekken) heeft een hele dag nodig met minstens 2 vrije plekken.
  // Er moet dus kloppen: (a) genoeg zulke dagen voor alle grote taken die al onderweg zijn
  // en (b) genoeg vrije plekken in totaal, ook voor de kleine taken die nog in je
  // laadruimte zitten of vallen. Zo kan een kleine taak nooit de laatste 2-plekken-dag
  // opeten terwijl er nog een grote taak aankomt.
  const slotsPerDay = GAME_CONFIG.slotsPerDay;
  const freePerDay = weekPlanning.days.map((_day, i) => slotsPerDay - usedSlotsInDay(weekPlanning, i));
  const daysFit2 = freePerDay.filter((free) => free >= 2).length;
  const totalFree = freePerDay.reduce((sum, free) => sum + free, 0);
  const cargoLargeCount = queuedLargeTaskCount;
  const cargoSmallSlots = usedSlots(cargo) - cargoLargeCount * 2;

  // Vallende grote taken die al niet meer kunnen kloppen (alleen wat zeker is: laadruimte +
  // week) verdwijnen meteen zonder dat het een leven kost. Dichtstbij beneden blijft het langst.
  // Vanaf level 3 vervalt deze bescherming: dan moet je zelf ruimte vrijhouden voor grote taken.
  const largeTaskProtection = currentLevel <= 2;
  let budgetDays = daysFit2 - cargoLargeCount;
  let budgetSlots = totalFree - cargoLargeCount * 2 - cargoSmallSlots;
  const fallingLarge = taskSpawner.tasks.filter((task) => task.slots === 2).sort((a, b) => b.y - a.y);
  const keptLarge = new Set();
  for (const task of fallingLarge) {
    // Level 1-2: alleen houden als hij ook echt ergens past. Vanaf level 3: ook houden als er in
    // totaal nog genoeg plekken zijn maar slecht verdeeld (een 'domme planningsfout' van de speler);
    // alleen weghalen als er in totaal niet eens 2 plekken over zijn: dan kon niemand er iets aan doen.
    const keepOk = largeTaskProtection ? budgetDays >= 1 && budgetSlots >= 2 : budgetSlots >= 2;
    if (keepOk) {
      keptLarge.add(task);
      budgetDays -= 1;
      budgetSlots -= 2;
    }
  }
  if (fallingLarge.length > keptLarge.size) {
    taskSpawner.tasks = taskSpawner.tasks.filter((task) => task.slots !== 2 || keptLarge.has(task));
    showFeedback('De grote taak is weg: er was geen plek meer voor.');
  }

  // Mag er een NIEUWE grote taak bijkomen? Ook de kleine taken die nog vallen tellen mee.
  const fallingSmallSlots = taskSpawner.tasks.filter((task) => task.slots === 1).length;
  const fairLargeTask =
    daysFit2 - cargoLargeCount - keptLarge.size >= 1 &&
    totalFree - 2 * (cargoLargeCount + keptLarge.size + 1) - cargoSmallSlots - fallingSmallSlots >= 0;

  // 'Domme fout'-val: vanaf level 3 gooien we één keer per level bewust een grote taak terwijl er geen
  // enkele dag meer met 2 vrije plekken is, maar er in totaal nog wél genoeg plekken zijn (bijv. op
  // meerdere dagen nog 1 plek vrij). Dan had de speler het kunnen voorkomen door slimmer te plannen.
  const trapAllowed =
    currentLevel >= 3 &&
    !taskSpawner.trapDone &&
    fallingLarge.length === 0 &&
    daysFit2 - cargoLargeCount <= 0 &&
    totalFree - 2 * cargoLargeCount - cargoSmallSlots >= 2 &&
    levelSettings.largeTasksEnabled;
  const canSpawnLargeTask = fairLargeTask || trapAllowed;

  // Hoe voller de week, hoe langer de verplichte afkoelperiode tussen grote taken —
  // richting het einde van een level dus geen 2 grote taken snel na elkaar.
  const weekFillRatio = totalFilledSlots(weekPlanning) / GAME_CONFIG.totalWeekSlots;
  const largeTaskMinGapMs = GAME_CONFIG.largeTaskMinGapMs + weekFillRatio * GAME_CONFIG.largeTaskEndgameExtraGapMs;

  taskSpawner.largeMode = trapAllowed ? 'force' : pickLargeMode(canSpawnLargeTask);
  const largeSpawnsBefore = taskSpawner.largeSpawnCount;
  taskSpawner.avoid = {
    xs: meteorSpawner.meteors.map((meteor) => meteor.x),
    radius: GAME_CONFIG.meteorSafeZoneRadius
  };

  updateTasks(
    taskSpawner,
    deltaSeconds,
    playAreaHeight,
    levelSettings.taskSpawnInterval,
    levelSettings.taskFallSpeed,
    levelSettings.largeTasksEnabled && canSpawnLargeTask,
    largeTaskMinGapMs,
    // Iets vaker een grote taak aan het begin van een week (eerste ~40%), daarna gewoon normaal.
    Math.min(0.6, levelSettings.largeTaskChance * (weekFillRatio < 0.4 ? 1.5 : 1)),
    levelSettings.maxSpawnDistancePercent,
    speedMultiplier,
    handleMissedTask // een gemiste taak kost 1 leven (zoals de oefenronde uitlegt)
  );
  if (trapAllowed && taskSpawner.largeSpawnCount > largeSpawnsBefore) taskSpawner.trapDone = true;

  // Eerlijke spawns: een meteoriet mag nooit vlak naast een taak (ver)schijnen,
  // anders wordt die taak feitelijk onbereikbaar. Middens van alle huidige taken
  // vormen de 'veilige zones' die meteors.js alleen bij spawn vermijdt — eenmaal
  // gespawnd valt een meteoriet daarna recht naar beneden, zonder correcties.
  const meteorSafeZoneOptions = {
    zones: taskSpawner.tasks.map((task) => ({ x: task.x + task.width / 2, y: task.y + task.height / 2 })),
    radius: GAME_CONFIG.meteorSafeZoneRadius
  };

  // Meteorieten vallen vanaf het begin van level 1 (de eerste pas na een paar seconden, zie clearAllSpawners).
  const meteorsAllowed = levelSettings.meteorsEnabled;

  updateMeteors(
    meteorSpawner,
    deltaSeconds,
    playAreaHeight,
    levelSettings.meteorSpawnInterval * meteorEaseFactor(),
    levelSettings.meteorFallSpeed,
    speedMultiplier,
    meteorsAllowed && meteorSpawner.meteors.length < levelSettings.maxMeteorsOnScreen,
    meteorSafeZoneOptions,
    (x, speed) => reachabilityOk(null, { x, y: -METEOR_RADIUS, radius: METEOR_RADIUS, fallSpeed: speed })
  );

  const onlyOneLifeLeft = lives === 1;
  if (meteorSpawner.meteors.length > 0 && !level3Tutorial.hasBeenSeen() && !level3Tutorial.isOpen()) {
    level3Tutorial.open(); // eerste meteoriet ooit: korte uitleg (spel pauzeert even)
  }

  updatePowerups(
    powerupSpawner,
    deltaSeconds,
    playAreaHeight,
    onlyOneLifeLeft
      ? levelSettings.powerupSpawnInterval * GAME_CONFIG.lowLivesPowerupIntervalFactor
      : levelSettings.powerupSpawnInterval,
    GAME_CONFIG.powerupFallSpeed,
    levelSettings.powerupsEnabled,
    {
      canGetHeart: lives < GAME_CONFIG.maximumLives,
      heartChance: onlyOneLifeLeft ? GAME_CONFIG.lowLivesHeartChance : 0,
      // De slak helpt het meest als de week al bijna vol is: alleen vanaf 65% gevuld.
      allowSlowMotion: totalFilledSlots(weekPlanning) / GAME_CONFIG.totalWeekSlots > 0.65,
      // Soorten die nu al actief zijn vallen niet (geen tweede schild terwijl je er al een hebt, enz.)
      activeTypes: [
        activeEffects.hasShield ? 'shield' : null,
        activeEffects.magnetMs > 0 ? 'magnet' : null,
        activeEffects.slowMotionMs > 0 ? 'slowMotion' : null,
        activeEffects.doubleScore ? 'doubleScore' : null
      ].filter(Boolean)
    }
  );

  // Magneet trekt alleen taken die dichtbij zijn naar de raket toe, geen meteorieten of power-ups.
  if (activeEffects.magnetMs > 0) {
    const playerCx = player.x + player.width / 2;
    const playerCy = player.y + player.height / 2;
    for (const task of taskSpawner.tasks) {
      const taskCx = task.x + task.width / 2;
      const taskCy = task.y + task.height / 2;
      const dx = playerCx - taskCx;
      const dy = playerCy - taskCy;
      const distance = Math.hypot(dx, dy);
      if (distance > 0 && distance <= GAME_CONFIG.magnetRange) {
        const pull = Math.min(distance, GAME_CONFIG.magnetPullSpeed * deltaSeconds);
        task.x += (dx / distance) * pull;
        task.y += (dy / distance) * pull;
      }
    }
  }

  if (invulnerableMs > 0) {
    invulnerableMs = Math.max(0, invulnerableMs - deltaSeconds * 1000);
  }

  if (feedbackTimerMs > 0) {
    feedbackTimerMs = Math.max(0, feedbackTimerMs - deltaSeconds * 1000);
  }

  if (damageFlashMs > 0) {
    damageFlashMs = Math.max(0, damageFlashMs - deltaSeconds * 1000);
  }

  if (shakeTimerMs > 0) {
    shakeTimerMs = Math.max(0, shakeTimerMs - deltaSeconds * 1000);
    if (shakeTimerMs === 0) shakeDayIndex = -1;
  }

  for (const popup of scorePopups) {
    popup.y -= 40 * deltaSeconds;
    popup.ms -= deltaSeconds * 1000;
  }
  scorePopups = scorePopups.filter((popup) => popup.ms > 0);

  taskSpawner.tasks = taskSpawner.tasks.filter((task) => {
    if (!rectsOverlap(CATCH_RECT(player), task)) return true;
    if (task.slots === 2 && !canFitLargeTask) {
      // De raket raakt een grote taak die nergens meer past: meteen het kaartje (niet pas als hij beneden is).
      handleLargeNoRoom();
      return false;
    }
    if (!hasRoomFor(cargo, task)) return true; // laadruimte vol: taak valt door, niet gevangen

    addToCargo(cargo, task);
    caughtCount += 1;
    const catchPoints = task.slots === 2 ? GAME_CONFIG.scoreCatchLargeTask : GAME_CONFIG.scoreCatchSmallTask;
    addScore(catchPoints);
    (task.slots === 2 ? sounds.catchLarge : sounds.catchSmall)();
    addScorePopup(task.x + task.width / 2, task.y, `+${catchPoints}`);
    if (task.slots === 2) maybeShowLargeCaughtTutorial();
    return false;
  });

  maybeShowCargoFullTutorial();

  powerupSpawner.items = powerupSpawner.items.filter((item) => {
    if (!rectsOverlap(player, item)) return true;
    applyPowerup(item.type);
    return false;
  });

  // Botsingsdetectie met meteorieten wordt tijdelijk genegeerd tijdens onkwetsbaarheid,
  // zodat één botsing nooit meerdere levens tegelijk kan kosten.
  if (invulnerableMs <= 0) {
    meteorSpawner.meteors = meteorSpawner.meteors.filter((meteor) => {
      if (!circleRectOverlap(meteor, player)) return true;

      if (activeEffects.hasShield) {
        // Een actief schild vangt de klap op vóórdat er een leven verloren gaat.
        activeEffects.hasShield = false;
        showFeedback('Schild opgevangen!');
        sounds.shield();
        return false;
      }

      sounds.meteorHit();
      loseLife(); // een meteoriet kost 1 leven
      if (!isGameOver) {
        invulnerableMs = GAME_CONFIG.invulnerabilityDuration;
      }
      return false;
    });
  }
}

function drawButton(rect, label) {
  drawPillButton(ctx, rect, label);
}

// Klein glazen "chip"-knopje voor pauze/geluid, zelfde afgeronde taal als de rest.
// icon: optionele asset-sleutel (iOS-emoji-pack) i.p.v. Unicode-emoji in het label.
function drawGhostButton(rect, label, { active = false, icon = null, font = null, textDy = 4 } = {}) {
  drawRoundedRect(ctx, rect.x, rect.y, rect.width, rect.height, rect.height / 2, {
    fill: active ? THEME.color.accentBlueSoft : THEME.color.surface,
    stroke: active ? THEME.color.accentBlue : THEME.color.border,
    strokeWidth: 1.5,
    shadow: THEME.shadow.chip
  });

  ctx.fillStyle = active ? THEME.color.accentBlue : THEME.color.textMuted;
  ctx.font = font || '11px \'Inria Sans\', sans-serif';

  const iconImage = icon ? getImage(icon) : null;
  if (iconImage) {
    const iconSize = 13;
    const textWidth = ctx.measureText(label).width;
    const groupWidth = iconSize + 5 + textWidth;
    const startX = rect.x + rect.width / 2 - groupWidth / 2;
    ctx.drawImage(iconImage, startX, rect.y + rect.height / 2 - iconSize / 2, iconSize, iconSize);
    ctx.textAlign = 'left';
    ctx.fillText(label, startX + iconSize + 5, rect.y + rect.height / 2 + 4);
  } else {
    ctx.textAlign = 'center';
    ctx.fillText(label, rect.x + rect.width / 2, rect.y + rect.height / 2 + textDy);
  }
}

function renderLoadingScreen() {
  ctx.fillStyle = THEME.color.bgDeep;
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.textMuted;
  ctx.font = '16px \'Inria Sans\', sans-serif';
  ctx.fillText('Laden...', LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2);
}

function renderStartScreen() {
  ctx.fillStyle = THEME.color.bgDeep;
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  drawRoundedRect(ctx, START_CARD.x, START_CARD.y, START_CARD.width, START_CARD.height, THEME.radius.lg, {
    fill: THEME.color.surface,
    stroke: THEME.color.border,
    strokeWidth: 1.5,
    shadow: THEME.shadow.card
  });

  const centerX = LOGICAL_WIDTH / 2;

  const rocketImage = getImage('rocket');
  const rocketWidth = 46;
  const rocketHeight = rocketImage ? Math.round(rocketWidth * (rocketImage.height / rocketImage.width)) : 60;
  const rocketTop = START_CARD.y + 24;
  if (rocketImage) {
    ctx.drawImage(rocketImage, centerX - rocketWidth / 2, rocketTop, rocketWidth, rocketHeight);
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.accentAmber;
  ctx.font = 'bold 26px \'Inria Sans\', sans-serif';
  ctx.fillText('Planeten Planner', centerX, rocketTop + rocketHeight + 30);

  ctx.fillStyle = THEME.color.textMuted;
  ctx.font = '13px \'Inria Sans\', sans-serif';
  ctx.fillText('Vang taken, plan je week en voltooi elk level.', centerX, rocketTop + rocketHeight + 52);

  // Instructierijen: icoon + tekst, links uitgelijnd binnen een vast blok zodat
  // het als een korte handleiding leest in plaats van een blok gecentreerde tekst.
  // Waar een echte asset bestaat (taak/meteoriet/planeet) tonen we die in plaats
  // van een emoji, zodat de speler de spullen herkent vóórdat hij ze in het spel
  // tegenkomt.
  const instructions = [
    { images: ['iconArrowLeft', 'iconArrowRight'], text: 'Beweeg de raket' },
    { images: ['taskSmall'], text: 'Vang taken die naar beneden vallen' },
    { images: ['meteor'], text: 'Ontwijk meteorieten' },
    { images: ['planetMonday'], text: 'Plan de volgende taak op een dag' }
  ];
  const instructionsWidth = 300;
  const instructionsX = centerX - instructionsWidth / 2;
  const iconSize = 20;
  let instructionY = rocketTop + rocketHeight + 84;

  for (const item of instructions) {
    let iconX = instructionsX;
    for (const key of item.images) {
      const iconImage = getImage(key);
      if (iconImage) {
        ctx.drawImage(iconImage, iconX, instructionY - iconSize + 5, iconSize, iconSize);
      }
      iconX += iconSize - 4; // lichte overlap tussen ⬅ en ➡ zodat het als één pictogram leest
    }

    ctx.textAlign = 'left';
    ctx.font = '13px \'Inria Sans\', sans-serif';
    ctx.fillStyle = THEME.color.textPrimary;
    ctx.fillText(item.text, instructionsX + 40, instructionY);

    instructionY += 28;
  }

  drawButton(START_BUTTON, 'Start');
  if (extremeUnlocked()) drawExtremeButton();
}

function renderPauseOverlay() {
  ctx.fillStyle = 'rgba(7, 10, 20, 0.55)';
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  drawRoundedRect(ctx, PAUSE_CARD.x, PAUSE_CARD.y, PAUSE_CARD.width, PAUSE_CARD.height, THEME.radius.lg, {
    fill: THEME.color.surfaceStrong,
    stroke: THEME.color.border,
    strokeWidth: 1.5,
    shadow: THEME.shadow.card
  });

  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.textPrimary;
  ctx.font = 'bold 20px \'Inria Sans\', sans-serif';
  ctx.fillText('Gepauzeerd', LOGICAL_WIDTH / 2, PAUSE_CARD.y + 50);

  drawButton(RESUME_BUTTON, 'Verder');
}

function renderPracticeAskOverlay() {
  ctx.fillStyle = 'rgba(7, 10, 20, 0.55)';
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  drawRoundedRect(ctx, ASK_CARD.x, ASK_CARD.y, ASK_CARD.width, ASK_CARD.height, THEME.radius.lg, {
    fill: THEME.color.surfaceStrong,
    stroke: THEME.color.border,
    strokeWidth: 1.5,
    shadow: THEME.shadow.card
  });

  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.textPrimary;
  ctx.font = 'bold 20px \'Inria Sans\', sans-serif';
  ctx.fillText('Nog een keer de oefenronde spelen?', LOGICAL_WIDTH / 2, ASK_CARD.y + 56);
  ctx.fillStyle = THEME.color.textMuted;
  ctx.font = '13px \'Inria Sans\', sans-serif';
  ctx.fillText('Je huidige spel stopt dan.', LOGICAL_WIDTH / 2, ASK_CARD.y + 84);

  drawGhostButton(ASK_NO_BUTTON, 'Nee', { font: 'bold 16px \'Inria Sans\', sans-serif', textDy: 6 });
  drawButton(ASK_YES_BUTTON, 'Ja');
}

// Kleine pil-badges met een echt icoon (i.p.v. Unicode-emoji) + tekst, gecentreerd
// op een rijtje — dezelfde pil-taal als de rest van de HUD.
function renderActiveEffects() {
  const badges = [];
  if (activeEffects.hasShield) badges.push({ icon: 'iconShield', text: 'Schild' });
  if (activeEffects.extraCargo) badges.push({ icon: 'iconPackage', text: '+Lading' });
  if (activeEffects.magnetMs > 0) badges.push({ icon: 'iconMagnet', text: `${Math.ceil(activeEffects.magnetMs / 1000)}s` });
  if (activeEffects.slowMotionMs > 0) badges.push({ icon: 'iconSnail', text: `${Math.ceil(activeEffects.slowMotionMs / 1000)}s` });
  if (activeEffects.doubleScore) badges.push({ icon: 'iconSparkles', text: 'x2 score' });

  if (badges.length === 0) return;

  const badgeHeight = 22;
  const iconSize = 13;
  const paddingX = 8;
  const gap = 8;

  ctx.font = 'bold 11px \'Inria Sans\', sans-serif';
  const widths = badges.map((badge) => paddingX * 2 + iconSize + 5 + ctx.measureText(badge.text).width);
  const totalWidth = widths.reduce((sum, width) => sum + width, 0) + gap * (badges.length - 1);

  let badgeX = LOGICAL_WIDTH / 2 - totalWidth / 2;
  const badgeY = 86;

  badges.forEach((badge, i) => {
    const width = widths[i];
    drawRoundedRect(ctx, badgeX, badgeY, width, badgeHeight, badgeHeight / 2, {
      fill: THEME.color.accentAmberSoft,
      stroke: THEME.color.accentAmber,
      strokeWidth: 1
    });

    const icon = getImage(badge.icon);
    if (icon) {
      ctx.drawImage(icon, badgeX + paddingX, badgeY + (badgeHeight - iconSize) / 2, iconSize, iconSize);
    }

    ctx.textAlign = 'left';
    ctx.fillStyle = THEME.color.accentAmber;
    ctx.fillText(badge.text, badgeX + paddingX + iconSize + 5, badgeY + badgeHeight / 2 + 4);

    badgeX += width + gap;
  });
}

function renderLives() {
  ctx.textAlign = 'left';
  ctx.font = 'bold 13px \'Inria Sans\', sans-serif';
  ctx.fillStyle = THEME.color.textMuted;
  ctx.fillText('LEVENS', 20, 32);

  const lifeFullImage = getImage('lifeFull');
  const lifeEmptyImage = getImage('lifeEmpty');
  const iconSize = 20;
  const gap = 3;
  let iconX = 20;
  const iconY = 40;

  for (let i = 0; i < GAME_CONFIG.maximumLives; i++) {
    const isFilled = i < lives;
    const image = isFilled ? lifeFullImage : lifeEmptyImage;

    if (image) {
      ctx.drawImage(image, iconX, iconY, iconSize, iconSize);
    } else {
      // Val terug op een simpel getekend rondje i.p.v. een emoji-teken als de
      // levens-afbeelding onverhoopt niet laadt.
      ctx.beginPath();
      ctx.arc(iconX + iconSize / 2, iconY + iconSize / 2, iconSize / 2 - 2, 0, Math.PI * 2);
      ctx.fillStyle = isFilled ? THEME.color.accentRed : 'transparent';
      ctx.fill();
      ctx.strokeStyle = THEME.color.accentRed;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    iconX += iconSize + gap;
  }
}

// ── Midden van de balk: level, XP en de week als gekleurde balk ──────────────────
// Speels: de XP loopt op naar de nieuwe stand en 'popt' even bij nieuwe punten; de balk toont de 15 plekken van
// de week, per dag in de kleur van zijn planeet, en elke nieuwe plek flitst even op.
const DAY_COLORS = ['#4ade80', '#38bdf8', '#fb923c', '#f87171', '#a78bfa'];
const hudFx = { shownScore: 0, lastScore: 0, popMs: 0, lastTime: 0, prevUsed: [], flashMs: [] };

function updateHudFx() {
  const now = performance.now();
  const dt = hudFx.lastTime ? Math.min(0.1, (now - hudFx.lastTime) / 1000) : 0;
  hudFx.lastTime = now;

  // XP: loopt vloeiend op; bij een grote sprong (nieuw potje, Extreme mode) meteen goed zetten.
  if (Math.abs(score - hudFx.shownScore) > 800 || score < hudFx.shownScore) {
    hudFx.shownScore = score;
  } else if (score > hudFx.shownScore) {
    const step = Math.max(60, (score - hudFx.shownScore) * 7) * dt;
    hudFx.shownScore = Math.min(score, hudFx.shownScore + step);
  }
  if (score > hudFx.lastScore) hudFx.popMs = 280;
  hudFx.lastScore = score;
  hudFx.popMs = Math.max(0, hudFx.popMs - dt * 1000);

  // Nieuwe plekken in de week laten oplichten.
  weekPlanning.days.forEach((_day, i) => {
    const used = usedSlotsInDay(weekPlanning, i);
    const before = hudFx.prevUsed[i] ?? used;
    if (used > before) hudFx.flashMs[i] = 520;
    if (used < before) hudFx.flashMs[i] = 0;
    hudFx.prevUsed[i] = used;
    hudFx.flashMs[i] = Math.max(0, (hudFx.flashMs[i] ?? 0) - dt * 1000);
  });
}

function renderHudCenter() {
  updateHudFx();
  const cx = LOGICAL_WIDTH / 2;
  const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 700);

  // 1) Level-pil met sterretje.
  ctx.font = 'bold 14px \'Inria Sans\', sans-serif';
  const levelText = `Level ${currentLevel}`;
  const starSize = 16;
  const pillWidth = ctx.measureText(levelText).width + starSize * 2 + 38;
  const pillHeight = 24;
  const pillX = cx - pillWidth / 2;
  const pillY = HUD_PANEL.y + 7;
  drawRoundedRect(ctx, pillX, pillY, pillWidth, pillHeight, pillHeight / 2, {
    fill: THEME.color.accentBlueSoft,
    stroke: THEME.color.accentBlue,
    strokeWidth: 1.5,
    shadow: THEME.shadow.chip
  });
  const star = getImage('iconStar');
  if (star) {
    const wobble = Math.sin(Date.now() / 500) * 1.2;
    ctx.drawImage(star, pillX + 10, pillY + (pillHeight - starSize) / 2 + wobble, starSize, starSize);
    ctx.drawImage(star, pillX + pillWidth - 10 - starSize, pillY + (pillHeight - starSize) / 2 - wobble, starSize, starSize);
  }
  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.accentBlue;
  ctx.fillText(levelText, cx, pillY + pillHeight / 2 + 5);

  // 2) XP: groot getal met glinsterend icoon en een kleine 'pop' bij nieuwe punten.
  const pop = hudFx.popMs / 280; // 1 -> 0
  const scale = 1 + 0.22 * Math.sin(pop * Math.PI);
  const numberText = Math.round(hudFx.shownScore).toLocaleString('nl-NL');
  const numberY = HUD_PANEL.y + 56;
  ctx.save();
  ctx.translate(cx, numberY);
  ctx.scale(scale, scale);
  ctx.font = 'bold 28px \'Inria Sans\', sans-serif';
  const numberWidth = ctx.measureText(numberText).width;
  ctx.font = 'bold 13px \'Inria Sans\', sans-serif';
  const xpWidth = ctx.measureText('XP').width;
  const iconSize = 24;
  const total = iconSize + 8 + numberWidth + 6 + xpWidth;
  let drawX = -total / 2;
  const sparkles = getImage('iconSparkles');
  if (sparkles) ctx.drawImage(sparkles, drawX, -iconSize + 3 + Math.sin(Date.now() / 420) * 1.5, iconSize, iconSize);
  drawX += iconSize + 8;
  ctx.textAlign = 'left';
  ctx.shadowColor = pop > 0 ? 'rgba(250, 204, 21, 0.9)' : 'rgba(250, 204, 21, 0.25)';
  ctx.shadowBlur = pop > 0 ? 14 : 6;
  ctx.fillStyle = pop > 0 ? '#fde68a' : '#f8fafc';
  ctx.font = 'bold 28px \'Inria Sans\', sans-serif';
  ctx.fillText(numberText, drawX, 0);
  ctx.shadowBlur = 0;
  ctx.fillStyle = THEME.color.accentAmber;
  ctx.font = 'bold 13px \'Inria Sans\', sans-serif';
  ctx.fillText('XP', drawX + numberWidth + 6, 0);
  ctx.restore();

  // 3) De week als balk van 15 segmenten: per dag 3, in de kleur van zijn planeet.
  const slots = GAME_CONFIG.slotsPerDay;
  const segW = 18;
  const segH = 9;
  const segGap = 3;
  const groupGap = 9;
  const days = weekPlanning.days.length;
  const barWidth = days * (slots * segW + (slots - 1) * segGap) + (days - 1) * groupGap;
  let segX = cx - barWidth / 2;
  const barY = HUD_PANEL.y + 66;
  weekPlanning.days.forEach((_day, d) => {
    const used = usedSlotsInDay(weekPlanning, d);
    const color = DAY_COLORS[d % DAY_COLORS.length];
    const flash = (hudFx.flashMs[d] ?? 0) / 520;
    for (let k = 0; k < slots; k++) {
      const filled = k < used;
      const isNewest = filled && k === used - 1 && flash > 0;
      if (isNewest) {
        drawRoundedRect(ctx, segX - 3, barY - 3, segW + 6, segH + 6, 5, { fill: `rgba(255, 255, 255, ${0.55 * flash})` });
      }
      drawRoundedRect(ctx, segX, barY, segW, segH, 3, {
        fill: filled ? color : 'rgba(148, 163, 184, 0.12)',
        stroke: filled ? 'rgba(255, 255, 255, 0.35)' : 'rgba(148, 163, 184, 0.22)',
        strokeWidth: 1
      });
      segX += segW + segGap;
    }
    segX += groupGap - segGap;
  });
  const filledTotal = totalFilledSlots(weekPlanning);
  ctx.textAlign = 'left';
  ctx.font = 'bold 11px \'Inria Sans\', sans-serif';
  ctx.fillStyle = filledTotal >= GAME_CONFIG.totalWeekSlots - 3 ? '#4ade80' : THEME.color.textMuted;
  ctx.fillText(`${filledTotal}/${GAME_CONFIG.totalWeekSlots}`, cx + barWidth / 2 + 8, barY + segH - 0.5);

  // 4) Korte meldingen (bijv. "Taak ingepland op dinsdag") onder de balk.
  if (feedbackTimerMs > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = THEME.color.accentBlue;
    ctx.font = '12px \'Inria Sans\', sans-serif';
    ctx.fillText(feedbackMessage, cx, HUD_PANEL.y + 97);
  }
}

// Het schild: een glazen, zacht pulserende bol om de raket heen (met een glansrandje dat meedraait).
function renderShieldBubble() {
  const cx = player.x + player.width / 2;
  const cy = player.y + player.height / 2;
  const radius = player.height / 2 + 12;
  const t = Date.now();
  const pulse = 0.5 + 0.5 * Math.sin(t / 350);
  ctx.save();
  // zachte vulling met een lichter midden
  const fill = ctx.createRadialGradient(cx, cy, radius * 0.25, cx, cy, radius);
  fill.addColorStop(0, 'rgba(56, 189, 248, 0.05)');
  fill.addColorStop(1, `rgba(56, 189, 248, ${0.16 + pulse * 0.1})`);
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  // gloeiende rand
  ctx.shadowColor = 'rgba(56, 189, 248, 0.9)';
  ctx.shadowBlur = 10 + pulse * 8;
  ctx.strokeStyle = `rgba(125, 211, 252, ${0.75 + pulse * 0.25})`;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  // glansstreepje dat langzaam rond gaat
  ctx.shadowBlur = 0;
  const spin = t / 900;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 4, spin, spin + 0.7);
  ctx.stroke();
  ctx.restore();
}

function renderHud() {
  drawRoundedRect(ctx, HUD_PANEL.x, HUD_PANEL.y, HUD_PANEL.width, HUD_PANEL.height, THEME.radius.md, {
    fill: THEME.color.surface,
    stroke: THEME.color.border,
    strokeWidth: 1.5,
    shadow: THEME.shadow.chip
  });

  if (gameMode === 'practice') {
    renderPracticeHud();
    return;
  }

  renderHudCenter();

  renderActiveEffects();
  renderCargo(ctx, cargo, LOGICAL_WIDTH - 16, 18, getImage('taskSmall'), getImage('taskLarge'), getImage('iconWarning'));

  renderLives();

  if (gameMode === 'playing') {
    drawGhostButton(PAUSE_ICON_BUTTON, 'Pauze', { icon: 'iconPause' });
  }

  drawGhostButton(MUTE_ICON_BUTTON, getIsMuted() ? 'Geluid: uit' : 'Geluid: aan', {
    active: !getIsMuted(),
    icon: 'iconSpeaker'
  });

  // Vraagteken: biedt op elk moment de oefenronde nog een keer aan.
  drawGhostButton(HELP_ICON_BUTTON, '?', { font: 'bold 15px \'Inria Sans\', sans-serif', textDy: 5 });
}

function renderScorePopups() {
  ctx.textAlign = 'center';
  ctx.font = 'bold 13px \'Inria Sans\', sans-serif';
  for (const popup of scorePopups) {
    ctx.globalAlpha = Math.max(0, popup.ms / 700);
    ctx.fillStyle = popup.color;
    ctx.fillText(popup.text, popup.x, popup.y);
  }
  ctx.globalAlpha = 1;
}

function renderGameOverScreen() {
  ctx.fillStyle = 'rgba(7, 10, 20, 0.6)';
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  drawRoundedRect(ctx, GAME_OVER_CARD.x, GAME_OVER_CARD.y, GAME_OVER_CARD.width, GAME_OVER_CARD.height, THEME.radius.lg, {
    fill: THEME.color.surfaceStrong,
    stroke: THEME.color.accentRedSoft,
    strokeWidth: 1.5,
    shadow: THEME.shadow.card
  });

  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.accentRed;
  ctx.font = 'bold 26px \'Inria Sans\', sans-serif';
  ctx.fillText('Game over', LOGICAL_WIDTH / 2, GAME_OVER_CARD.y + 50);

  ctx.fillStyle = THEME.color.textMuted;
  ctx.font = '13px \'Inria Sans\', sans-serif';
  ctx.fillText('Probeer het nog eens!', LOGICAL_WIDTH / 2, GAME_OVER_CARD.y + 74);

  // Cijfers als 2x2 stat-kaarten i.p.v. platte tekstregels, zodat ze in één
  // oogopslag opvallen.
  const stats = [
    ['Score', score],
    ['Hoogste level', currentLevel],
    ['Ingeplande taken', plannedCount],
    ['Voltooide weken', completedWeeksCount]
  ];
  const cardW = 170;
  const cardH = 64;
  const gap = 16;
  const gridX = LOGICAL_WIDTH / 2 - cardW - gap / 2;
  const gridY = GAME_OVER_CARD.y + 100;

  stats.forEach(([label, value], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    drawStatCard(ctx, gridX + col * (cardW + gap), gridY + row * (cardH + 14), cardW, cardH, label, value, {
      accent: THEME.color.accentRed
    });
  });

  drawButton(RESTART_BUTTON, 'Opnieuw spelen');
  if (extremeUnlocked()) drawExtremeButton();
}

function render() {
  if (gameMode === 'loading') {
    renderLoadingScreen();
    return;
  }

  if (gameMode === 'start') {
    renderStartScreen();
    return;
  }

  if (gameMode === 'practiceChoice') {
    renderPracticeChoice();
    return;
  }

  ctx.fillStyle = '#050a1a';
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  const backgroundImage = getImage('background');
  if (backgroundImage) {
    drawImageCover(backgroundImage, 0, 0, LOGICAL_WIDTH, playAreaHeight);
  } else {
    const spaceGradient = ctx.createLinearGradient(0, 0, 0, playAreaHeight);
    spaceGradient.addColorStop(0, '#0c1a3d');
    spaceGradient.addColorStop(1, '#050a1a');
    ctx.fillStyle = spaceGradient;
    ctx.fillRect(0, 0, LOGICAL_WIDTH, playAreaHeight);
    renderStarfield();
  }

  renderTasks(ctx, taskSpawner, getImage('taskSmall'), getImage('taskLarge'));
  renderMeteors(ctx, meteorSpawner, getImage('meteor'));
  renderPowerups(ctx, powerupSpawner, {
    shield: getImage('powerupShield'),
    extraCargo: getImage('powerupExtraCargo'),
    magnet: getImage('powerupMagnet'),
    slowMotion: getImage('powerupSlowMotion'),
    extraLife: getImage('powerupExtraLife'),
    doubleScore: getImage('powerupDoubleScore')
  });
  renderScorePopups();
  renderPlayer(ctx, player, invulnerableMs > 0, getImage('rocket'));
  if (activeEffects.hasShield) renderShieldBubble();
  renderHud();

  ctx.strokeStyle = THEME.color.border;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, playAreaHeight);
  ctx.lineTo(LOGICAL_WIDTH, playAreaHeight);
  ctx.stroke();

  const shakeOffsetX = shakeTimerMs > 0 ? Math.sin(shakeTimerMs / 20) * 5 : 0;
  const planetImages = [
    getImage('planetMonday'),
    getImage('planetTuesday'),
    getImage('planetWednesday'),
    getImage('planetThursday'),
    getImage('planetFriday')
  ];
  renderWeekPlanning(
    ctx,
    weekPlanning,
    0,
    playAreaHeight,
    LOGICAL_WIDTH,
    WEEKPLANNING_PANEL_HEIGHT,
    { dayIndex: shakeDayIndex, offsetX: shakeOffsetX },
    planetImages,
    getPracticeHighlight() ?? (cargoFullLevel1Tutorial.isOpen() || cargoFullLevel2PlusTutorial.isOpen())
  );

  if (gameMode === 'practice' && practice.step === 'fly') renderPracticeFlyHint();
  if (gameMode === 'practice' && PRACTICE_NUMBER_STEPS.includes(practice.step)) renderPracticeNumberHint();
  if (gameMode === 'practice' && PRACTICE_KEYCAP_STEPS.includes(practice.step)) renderPracticeKeycaps();
  if (gameMode === 'practice' && practice.step === 'powerupInfo') renderPracticeInfo();
  if (gameMode === 'practice' && practice.step === 'weekDone') renderPracticeWeekDone();
  if (gameMode === 'practice' && practice.step === 'rules') renderPracticeRules();
  if (gameMode === 'practice' && practice.step === 'done') renderPracticeDone();

  if (isShowingLevelSummary && completedWeekSnapshot) {
    weekSummaryButtonRect = renderWeekSummary(
      ctx,
      completedWeekSnapshot,
      completedLevelNumber,
      completedLevelScoreGain,
      lives,
      GAME_CONFIG.maximumLives,
      LOGICAL_WIDTH,
      LOGICAL_HEIGHT,
      planetImages,
      getImage('iconCheck'),
      {
        elapsedMs: performance.now() - summaryStartedAtMs,
        lifeFull: getImage('lifeFull'),
        lifeEmpty: getImage('lifeEmpty'),
        sparkles: getImage('iconSparkles'),
        party: getImage('iconPartyPopper'),
        lifeBonus: lives * GAME_CONFIG.scoreBonusPerRemainingLife
      }
    );
  }

  if (damageFlashMs > 0) {
    ctx.fillStyle = `rgba(242, 119, 122, ${(damageFlashMs / 150) * 0.22})`;
    ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
  }

  if (gameMode === 'paused') {
    if (askPractice) renderPracticeAskOverlay();
    else renderPauseOverlay();
  }

  if (gameMode === 'gameOver') {
    renderGameOverScreen();
  }
}

function loop(timestampMs) {
  if (!isRunning) return;

  const deltaSeconds = lastTimestampMs ? (timestampMs - lastTimestampMs) / 1000 : 0;
  lastTimestampMs = timestampMs;

  update(deltaSeconds);
  render();

  requestAnimationFrame(loop);
}

document.addEventListener('visibilitychange', () => {
  isRunning = document.visibilityState === 'visible';
  if (isRunning) {
    lastTimestampMs = 0;
    requestAnimationFrame(loop);
  }
});

requestAnimationFrame(loop);

// Alleen voor testen: ?debug zet een paar knoppen klaar in de console (window.__pp).
if (new URLSearchParams(window.location.search).has('debug')) {
  window.__pp = {
    start() {
      resetGame();
    },
    powerup(type) {
      applyPowerup(type);
    },
    // De eerste grote taak is gevangen terwijl maandag nog maar 1 plek vrij heeft: toont de uitleg.
    largeCaughtDemo() {
      resetGame();
      for (let i = 0; i < 2; i++) {
        spawnSmallTask(taskSpawner, 0, 1);
        placeTaskInDay(weekPlanning, 0, taskSpawner.tasks.pop());
      }
      spawnLargeTask(taskSpawner, 0, 1);
      addToCargo(cargo, taskSpawner.tasks.pop());
      maybeShowLargeCaughtTutorial();
    },
    // Jouw situatie: nog maar 2 vrije plekken in totaal (op maandag) en 1 kleine taak in je laadruimte.
    // Er valt ook al een grote taak: die hoort meteen te verdwijnen, en er mag er geen nieuwe komen.
    noRoomDemo() {
      resetGame();
      for (let day = 1; day < 5; day++) {
        for (let i = 0; i < 3; i++) {
          spawnSmallTask(taskSpawner, 0, 1);
          placeTaskInDay(weekPlanning, day, taskSpawner.tasks.pop());
        }
      }
      spawnSmallTask(taskSpawner, 0, 1);
      placeTaskInDay(weekPlanning, 0, taskSpawner.tasks.pop()); // maandag: 1 van 3 bezet = 2 vrij
      spawnSmallTask(taskSpawner, 0, 1);
      addToCargo(cargo, taskSpawner.tasks.pop());
      spawnLargeTask(taskSpawner, 40, 1);
      taskSpawner.tasks[0].y = 100;
    },
    // Controle: er is wel plek (maandag 2 kleine taken, rest leeg), dus een grote taak MAG komen.
    roomDemo() {
      resetGame();
      for (let i = 0; i < 2; i++) {
        spawnSmallTask(taskSpawner, 0, 1);
        placeTaskInDay(weekPlanning, 0, taskSpawner.tasks.pop());
      }
    },
    // Level 3-situatie: geen plek meer voor een grote taak, en er valt er toch een (bijna onderaan).
    noRoomLevel3() {
      this.noRoomDemo();
      spawnSmallTask(taskSpawner, 0, 1);
      placeTaskInDay(weekPlanning, 0, taskSpawner.tasks.pop()); // maandag: nu 2 bezet, 1 vrij: nergens meer plek voor 2
      currentLevel = 3;
      levelSettings = getLevelSettings(3);
      taskSpawner.tasks[0].y = 340;
      taskSpawner.tasks[0].x = 20; // ver van de raket: hij kan niet per ongeluk gevangen worden
    },
    // Nog een grote taak laten vallen in het huidige potje (voor het testen van 'tweede keer').
    dropLarge() {
      spawnLargeTask(taskSpawner, 40, 1);
      const task = taskSpawner.tasks[taskSpawner.tasks.length - 1];
      task.y = 340;
      task.x = 20;
    },
    // Level 3: maandag t/m donderdag hebben 2 taken (1 vrij), vrijdag is vol. Geen enkele dag met 2 vrij,
    // maar nog 4 plekken in totaal: de 'domme fout'-val moet één grote taak laten vallen.
    fragmentedDemo() {
      resetGame();
      for (let day = 0; day < 5; day++) {
        const count = day < 4 ? 2 : 3;
        for (let i = 0; i < count; i++) {
          spawnSmallTask(taskSpawner, 0, 1);
          placeTaskInDay(weekPlanning, day, taskSpawner.tasks.pop());
        }
      }
      currentLevel = 3;
      levelSettings = getLevelSettings(3);
    },
    // Een grote taak precies boven de raket (om 'aanraken' te testen).
    largeOnRocket() {
      spawnLargeTask(taskSpawner, 20, 1);
      const task = taskSpawner.tasks[taskSpawner.tasks.length - 1];
      task.x = player.x + player.width / 2 - task.width / 2;
      task.y = player.y - task.height + 10;
    },
    experienced() {
      return { tier: skillTier, forced: skillForced, taskGap: taskSpawner.taskGapPx, meteorGap: meteorSpawner.gapPx, stored: readSkill(), easeFactor: meteorEaseFactor(), clockSec: Math.round(gameClockMs / 1000), lost: livesLostThisGame };
    },
    result(r) {
      applyGameResult(r);
    },
    resetSkill() {
      localStorage.removeItem(SKILL_KEY);
    },
    addXp(n) {
      score += n; // alleen voor testen van de XP-teller
    },
    setLevel(n) {
      currentLevel = n;
      levelSettings = getLevelSettings(n);
    },
    completeNow() {
      completeLevel();
    },
    setLives(n) {
      lives = n; // alleen voor testen
    },
    state() {
      return {
        large: taskSpawner.tasks.filter((task) => task.slots === 2).length,
        small: taskSpawner.tasks.filter((task) => task.slots === 1).length,
        meteors: meteorSpawner.meteors.length,
        taskSpeed: taskSpawner.tasks[0]?.fallSpeed,
        level: currentLevel,
        score,
        lives,
        feedback: feedbackMessage,
        mode: gameMode
      };
    },
    // Dinsdag krijgt 2 kleine taken en er zit een grote taak in de laadruimte.
    blockedDemo() {
      resetGame();
      for (let i = 0; i < 2; i++) {
        spawnSmallTask(taskSpawner, 0, 1);
        placeTaskInDay(weekPlanning, 1, taskSpawner.tasks.pop());
      }
      spawnLargeTask(taskSpawner, 0, 1);
      addToCargo(cargo, taskSpawner.tasks.pop());
    }
  };
}
