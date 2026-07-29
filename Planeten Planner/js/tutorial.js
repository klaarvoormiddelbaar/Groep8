// Stap-voor-stap uitleg ('rondleiding') voor beginnende spelers, zelfde patroon
// als de rondleiding bij Missie Middelbaar: een spotlight + kaartje dat door een
// paar stappen loopt en steeds naar een deel van het scherm wijst.
//
// Verschil met Missie Middelbaar: daar wijst elke stap naar een echt DOM-element
// (via getElementById). Hier staat alles op één <canvas>, dus wijst elke stap
// naar een vast gebied in de LOGISCHE canvas-coördinaten (960x540), dat hier
// wordt omgezet naar echte schermpixels op basis van hoe het canvas is geschaald.

export function hasSeenTutorial(storageKey) {
  try {
    return localStorage.getItem(storageKey) === '1';
  } catch {
    return false; // bijv. privé-browsen: rondleiding start dan gewoon elke keer opnieuw
  }
}

function markTutorialSeen(storageKey) {
  try {
    localStorage.setItem(storageKey, '1');
  } catch {
    // niets aan te doen, geen probleem voor de werking van het spel
  }
}

// Zet een gebied in logische canvas-coördinaten om naar echte schermpixels
// (met een kleine marge eromheen), zodat zowel de spotlight als de kaart
// daarop kunnen positioneren.
function computeScreenRect(canvas, logicalWidth, region) {
  const canvasRect = canvas.getBoundingClientRect();
  const scale = canvasRect.width / logicalWidth;
  const pad = 8;
  return {
    left: canvasRect.left + region.x * scale - pad,
    top: canvasRect.top + region.y * scale - pad,
    width: region.width * scale + pad * 2,
    height: region.height * scale + pad * 2
  };
}

// Plaatst het kaartje t.o.v. een uitgelicht schermgebied: eronder als daar
// ruimte voor is, anders erboven, en houdt het altijd binnen het scherm.
function positionCard(screenRect, card) {
  const cardWidth = 300;
  const estimatedCardHeight = 190;
  const spaceBelow = window.innerHeight - (screenRect.top + screenRect.height);
  const placeBelow = spaceBelow > estimatedCardHeight + 16 || screenRect.top < estimatedCardHeight + 16;

  const cardTop = placeBelow ? screenRect.top + screenRect.height + 14 : screenRect.top - estimatedCardHeight - 14;

  let cardLeft = screenRect.left + screenRect.width / 2 - cardWidth / 2;
  cardLeft = Math.max(16, Math.min(window.innerWidth - cardWidth - 16, cardLeft));

  card.style.top = `${Math.max(16, cardTop)}px`;
  card.style.left = `${cardLeft}px`;
  card.classList.toggle('tut-arrow-top', placeBelow);
  card.classList.toggle('tut-arrow-bottom', !placeBelow);

  const arrowX = screenRect.left + screenRect.width / 2 - cardLeft - 8;
  card.style.setProperty('--tut-ax', `${Math.max(16, Math.min(cardWidth - 32, arrowX))}px`);
}

// Positioneert één spotlight (met eigen verduisterende box-shadow-cutout) +
// bijbehorend kaartje. Gebruikt door de gewone (1 kaartje per keer) rondleiding
// hieronder, waar er altijd maar 1 spotlight tegelijk in beeld is.
function positionBubble(canvas, logicalWidth, region, spotlight, card) {
  if (!region) {
    spotlight.style.opacity = '0';
    const canvasRect = canvas.getBoundingClientRect();
    card.style.top = `${canvasRect.top + canvasRect.height / 2 - 95}px`;
    card.style.left = `${canvasRect.left + canvasRect.width / 2 - 150}px`;
    card.classList.remove('tut-arrow-top', 'tut-arrow-bottom');
    return;
  }

  const rect = computeScreenRect(canvas, logicalWidth, region);
  spotlight.style.opacity = '1';
  spotlight.style.left = `${rect.left}px`;
  spotlight.style.top = `${rect.top}px`;
  spotlight.style.width = `${rect.width}px`;
  spotlight.style.height = `${rect.height}px`;

  positionCard(rect, card);
}

// canvas: het spel-canvas waar de stappen relatief aan positioneren.
// logicalWidth/logicalHeight: de vaste 960x540 spellogica-resolutie (game.js).
// steps: [{ label, text, region: {x,y,width,height} | null }] — region in
// logische coördinaten; null = kaart gecentreerd tonen zonder spotlight.
// storageKey: eigen localStorage-sleutel per rondleiding, zodat bijv. de level 1-
// en level 3-uitleg onafhankelijk van elkaar 'gezien' worden onthouden.
// variant: 'info' (rustig blauw, standaard), 'warning' (amber) of 'danger' (rood)
// — voor momenten die om extra aandacht vragen of een speler iets kosten.
// dismissible: true (standaard) toont een kruisje + knoppen om zelf te sluiten.
// false = geen enkele manier om 'm zelf weg te klikken.
// simultaneous: true toont ALLE steps als losse kaartjes tegelijk (elk met zijn
// eigen uitgelichte gebied, geen 'volgende' nodig) i.p.v. één voor één
// doorklikken — gebruikt voor de laadruimte-vol-pauze, die zowel naar de
// laadruimte als naar de dagen tegelijk moet wijzen. Impliceert altijd
// dismissible:false: bij meerdere kaartjes tegelijk is er toch geen ruimte voor
// losse sluit-knopjes per kaartje.
export function createTutorial(
  canvas,
  logicalWidth,
  logicalHeight,
  steps,
  storageKey,
  { variant = 'info', dismissible = true, simultaneous = false } = {}
) {
  if (simultaneous) {
    return createSimultaneousTutorial(canvas, logicalWidth, logicalHeight, steps, storageKey, variant);
  }

  const overlay = document.createElement('div');
  overlay.className = `tut-overlay tut-variant-${variant}`;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Uitleg');

  const spotlight = document.createElement('div');
  spotlight.className = 'tut-spotlight';

  const card = document.createElement('div');
  card.className = 'tut-card';
  card.innerHTML = `
    <button class="tut-close" type="button" aria-label="Uitleg sluiten">✕</button>
    <div class="tut-label"></div>
    <div class="tut-body"></div>
    <div class="tut-footer">
      <div class="tut-dots"></div>
      <div class="tut-nav">
        <button class="tut-prev" type="button">Vorige</button>
        <button class="tut-next" type="button">Volgende →</button>
      </div>
    </div>
  `;

  if (!dismissible) {
    card.classList.add('tut-non-dismissible');
  }

  overlay.appendChild(spotlight);
  overlay.appendChild(card);

  const dotsEl = card.querySelector('.tut-dots');
  const labelEl = card.querySelector('.tut-label');
  const bodyEl = card.querySelector('.tut-body');
  const prevBtn = card.querySelector('.tut-prev');
  const nextBtn = card.querySelector('.tut-next');
  const closeBtn = card.querySelector('.tut-close');

  steps.forEach(() => {
    const dot = document.createElement('span');
    dot.className = 'tut-dot';
    dotsEl.appendChild(dot);
  });
  const dotEls = [...dotsEl.children];
  // Bij een uitleg van maar 1 stap (bijv. 'er zijn nu meteorieten') zeggen
  // voortgangsstipjes niets — dan is er niets om doorheen te bladeren.
  dotsEl.style.display = steps.length > 1 ? 'flex' : 'none';

  let currentIndex = 0;
  let isOpen = false;

  function render(index) {
    currentIndex = index;
    const step = steps[index];

    labelEl.textContent = step.label;
    bodyEl.textContent = step.text;
    dotEls.forEach((dot, i) => dot.classList.toggle('tut-dot-active', i === index));
    prevBtn.disabled = index === 0;
    nextBtn.textContent = index === steps.length - 1 ? 'Snap ik! ✓' : 'Volgende →';

    positionBubble(canvas, logicalWidth, step.region, spotlight, card);
  }

  function handleResize() {
    if (isOpen) render(currentIndex);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove('tut-visible');
    window.removeEventListener('resize', handleResize);
    setTimeout(() => overlay.remove(), 200); // wacht de fade-out af
    markTutorialSeen(storageKey);
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    document.body.appendChild(overlay);
    render(0);
    requestAnimationFrame(() => overlay.classList.add('tut-visible'));
    window.addEventListener('resize', handleResize);
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) render(currentIndex - 1);
  });
  nextBtn.addEventListener('click', () => {
    if (currentIndex < steps.length - 1) render(currentIndex + 1);
    else close();
  });
  closeBtn.addEventListener('click', close);

  return {
    open,
    close,
    isOpen: () => isOpen,
    hasBeenSeen: () => hasSeenTutorial(storageKey),
    // Herrendert de huidige stap nadat de aanroeper steps[currentIndex] direct
    // heeft aangepast (bijv. een live aftellend aantal in de tekst) — no-op als
    // de rondleiding niet open is.
    refresh: () => {
      if (isOpen) render(currentIndex);
    }
  };
}

// Bouwt een clip-path die één gedeelde verduisterende achtergrond een gat geeft
// op elke plek uit `rects` (evenodd-regel: buitenste rechthoek = het hele
// scherm, elke rects-rechthoek erna ponst er een gat in). Nodig omdat losse
// box-shadow-cutouts (zoals de gewone 1-op-1 spotlight hierboven) elkaars gat
// juist weer zouden verduisteren zodra er 2 tegelijk in beeld staan.
function buildHoleyClipPath(rects) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  let d = `M0 0 H${w} V${h} H0 Z`;
  for (const rect of rects) {
    const { left, top, width, height } = rect;
    d += ` M${left} ${top} H${left + width} V${top + height} H${left} Z`;
  }
  return `path(evenodd, "${d}")`;
}

// Toont elke step als een eigen los kaartje (met eigen uitgelicht gebied),
// allemaal tegelijk zichtbaar. Geen kruisje, geen 'volgende' — die zouden
// alleen maar verwarrend zijn met meerdere kaartjes tegelijk in beeld.
function createSimultaneousTutorial(canvas, logicalWidth, logicalHeight, steps, storageKey, variant) {
  const overlay = document.createElement('div');
  overlay.className = `tut-overlay tut-variant-${variant}`;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Uitleg');

  // Eén gedeelde dimlaag i.p.v. losse box-shadow-cutouts per spotlight — zie
  // buildHoleyClipPath hierboven voor waarom dat nodig is.
  const backdrop = document.createElement('div');
  backdrop.className = 'tut-backdrop';
  overlay.appendChild(backdrop);

  const bubbles = steps.map(() => {
    const spotlight = document.createElement('div');
    spotlight.className = 'tut-spotlight-outline';

    const card = document.createElement('div');
    card.className = 'tut-card tut-non-dismissible';
    card.innerHTML = `
      <div class="tut-label"></div>
      <div class="tut-body"></div>
    `;

    overlay.appendChild(spotlight);
    overlay.appendChild(card);

    return { spotlight, card, labelEl: card.querySelector('.tut-label'), bodyEl: card.querySelector('.tut-body') };
  });

  let isOpen = false;

  function renderAll() {
    const rects = [];

    steps.forEach((step, i) => {
      const bubble = bubbles[i];
      bubble.labelEl.textContent = step.label;
      bubble.bodyEl.textContent = step.text;

      if (!step.region) {
        bubble.spotlight.style.opacity = '0';
        return;
      }

      const rect = computeScreenRect(canvas, logicalWidth, step.region);
      rects.push(rect);

      bubble.spotlight.style.opacity = '1';
      bubble.spotlight.style.left = `${rect.left}px`;
      bubble.spotlight.style.top = `${rect.top}px`;
      bubble.spotlight.style.width = `${rect.width}px`;
      bubble.spotlight.style.height = `${rect.height}px`;

      positionCard(rect, bubble.card);
    });

    backdrop.style.clipPath = buildHoleyClipPath(rects);
  }

  function handleResize() {
    if (isOpen) renderAll();
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove('tut-visible');
    window.removeEventListener('resize', handleResize);
    setTimeout(() => overlay.remove(), 200);
    markTutorialSeen(storageKey);
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    document.body.appendChild(overlay);
    renderAll();
    requestAnimationFrame(() => overlay.classList.add('tut-visible'));
    window.addEventListener('resize', handleResize);
  }

  return {
    open,
    close,
    isOpen: () => isOpen,
    hasBeenSeen: () => hasSeenTutorial(storageKey),
    refresh: () => {
      if (isOpen) renderAll();
    }
  };
}
