// Bereikbaarheidscheck: kan de raket nog ELKE taak vangen zonder een meteoriet te raken?
//
// Taken en meteorieten vallen recht naar beneden, dus hun tijdstip + plek op de hoogte van de raket is
// vooraf uit te rekenen. Deze module speelt in gedachten na wat de raket kan doen:
// - de raket beweegt zijwaarts met een (ruim genomen) snelheid;
// - tijdens het 'venster' waarin een meteoriet op raakhoogte is, is zijn kolom verboden terrein;
// - elke taak moet binnen zijn eigen vangvenster worden aangeraakt, in volgorde van aankomst.
// Daarmee wordt een situatie als "raket links van de meteoriet, taak rechts ervan, allebei op hetzelfde
// moment" herkend en voorkomen. We rekenen met een lagere raketsnelheid dan echt (marge voor
// reactietijd), en vanuit meerdere beginposities (nu, uiterst links, uiterst rechts), zodat het ook
// klopt als de speler ondertussen ergens anders gaat staan.

const MAX_TIME = 30; // seconden vooruit rekenen (genoeg voor elke taak)
const DT = 0.04; // seconden per rekenstap
const ROCKET_SPEED = 400; // px/s: bewust lager dan de echte 520 voor reactietijd en een gemakkelijke marge
const CELL = ROCKET_SPEED * DT; // één stap = één cel zijwaarts (16 px)
const SAFETY = 10; // extra px/seconde-marge rond een meteoriet
const TIME_PAD = 0.15; // seconden extra rond het venster van een meteoriet
const CATCH_MARGIN_TOP = 10; // zelfde als de vangmarge in game.js
const CATCH_MARGIN_X = 14;

function clamp(value, low, high) {
  return Math.max(low, Math.min(high, value));
}

// player: { y, width, height }, canvasWidth: speelbreedte.
// tasks: [{ x, y, width, height, fallSpeed }] (x = linkerrand), meteors: [{ x, y, radius, fallSpeed }] (x = midden).
// startCenters: middens (px) waar de raket nu of straks kan staan.
// feasibleStarts geeft per beginpositie true/false: kunnen vanaf daar alle taken nog worden gevangen?
// canCatchAll geeft true als dat voor ELKE opgegeven positie zo is.
export function canCatchAll(scenario) {
  return feasibleStarts(scenario).every(Boolean);
}

export function feasibleStarts({ player, canvasWidth, startCenters, tasks, meteors }) {
  const pw = player.width;
  const py = player.y;
  const ph = player.height;
  const minC = pw / 2;
  const maxC = canvasWidth - pw / 2;
  const cellCount = Math.floor((maxC - minC) / CELL) + 1;
  const toCell = (center) => clamp(Math.round((center - minC) / CELL), 0, cellCount - 1);

  const taskInfo = tasks
    .filter((task) => task.fallSpeed > 0) // stilstaande objecten (testhulpjes) tellen niet
    .map((task) => {
      const speed = task.fallSpeed;
      const arrive = Math.max(0, (py - CATCH_MARGIN_TOP - task.height - task.y) / speed);
      const leave = (py + ph - task.y) / speed;
      const center = task.x + task.width / 2;
      const tolerance = task.width / 2 + pw / 2 + CATCH_MARGIN_X - 4;
      return {
        arrive,
        leave,
        lo: clamp(Math.ceil((center - tolerance - minC) / CELL), 0, cellCount - 1),
        hi: clamp(Math.floor((center + tolerance - minC) / CELL), 0, cellCount - 1)
      };
    })
    .filter((task) => task.leave > 0)
    .sort((a, b) => a.arrive - b.arrive);

  if (taskInfo.length === 0) return startCenters.map(() => true);

  const meteorInfo = meteors
    .filter((meteor) => meteor.fallSpeed > 0)
    .map((meteor) => {
      const speed = meteor.fallSpeed;
      const reach = pw / 2 + meteor.radius + SAFETY;
      return {
        from: Math.max(0, (py - meteor.radius - SAFETY - meteor.y) / speed - TIME_PAD),
        to: (py + ph + meteor.radius + SAFETY - meteor.y) / speed + TIME_PAD,
        lo: Math.max(0, Math.floor((meteor.x - reach - minC) / CELL) + 1),
        hi: Math.min(cellCount - 1, Math.ceil((meteor.x + reach - minC) / CELL) - 1)
      };
    })
    .filter((meteor) => meteor.to > 0 && meteor.lo <= meteor.hi);

  function runFrom(startCenter) {
    let reach = new Uint8Array(cellCount);
    let next = new Uint8Array(cellCount);
    const startCell = toCell(startCenter);

    // Staat deze beginpositie nu al in een actieve meteorietkolom? Dan is dat geen echte situatie: overslaan.
    for (const meteor of meteorInfo) {
      if (meteor.from <= 0 && startCell >= meteor.lo && startCell <= meteor.hi) return true;
    }
    reach[startCell] = 1;

    let time = 0;
    for (const task of taskInfo) {
      let caught = false;
      while (time <= task.leave) {
        if (time > MAX_TIME) return true; // veiligheid: nooit eindeloos doorrekenen
        next.fill(0);
        for (let k = 0; k < cellCount; k++) {
          if (!reach[k]) continue;
          next[k] = 1;
          if (k > 0) next[k - 1] = 1;
          if (k < cellCount - 1) next[k + 1] = 1;
        }
        for (const meteor of meteorInfo) {
          if (time >= meteor.from && time <= meteor.to) {
            for (let k = meteor.lo; k <= meteor.hi; k++) next[k] = 0;
          }
        }
        const swap = reach;
        reach = next;
        next = swap;
        time += DT;

        let any = false;
        for (let k = 0; k < cellCount; k++) {
          if (reach[k]) {
            any = true;
            break;
          }
        }
        if (!any) return false; // overal tegen een meteoriet aangelopen

        if (time >= task.arrive) {
          let touches = false;
          for (let k = task.lo; k <= task.hi; k++) {
            if (reach[k]) {
              touches = true;
              break;
            }
          }
          if (touches) {
            // De raket zit nu bij deze taak: alleen die posities blijven over voor de volgende.
            for (let k = 0; k < cellCount; k++) {
              if (k < task.lo || k > task.hi) reach[k] = 0;
            }
            caught = true;
            break;
          }
        }
      }
      if (!caught) return false;
    }
    return true;
  }

  return startCenters.map(runFrom);
}
