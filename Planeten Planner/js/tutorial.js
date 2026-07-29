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

// canvas: het spel-canvas waar de stappen relatief aan positioneren.
// logicalWidth/logicalHeight: de vaste 960x540 spellogica-resolutie (game.js).
// steps: [{ label, html, region: {x,y,width,height} | null }] — region in
// logische coördinaten; null = kaart gecentreerd tonen zonder spotlight.
// storageKey: eigen localStorage-sleutel per rondleiding, zodat bijv. de level 1-
// en level 3-uitleg onafhankelijk van elkaar 'gezien' worden onthouden.
// variant: 'info' (rustig blauw, standaard) of 'warning' (amber) — voor momenten
// die om extra aandacht vragen, zoals 'je laadruimte zit vol'.
export function createTutorial(canvas, logicalWidth, logicalHeight, steps, storageKey, { variant = 'info' } = {}) {
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

  function positionStep(step) {
    const canvasRect = canvas.getBoundingClientRect();
    const scale = canvasRect.width / logicalWidth;

    if (!step.region) {
      spotlight.style.opacity = '0';
      card.style.top = `${canvasRect.top + canvasRect.height / 2 - 95}px`;
      card.style.left = `${canvasRect.left + canvasRect.width / 2 - 150}px`;
      card.classList.remove('tut-arrow-top', 'tut-arrow-bottom');
      return;
    }

    const region = step.region;
    const pad = 8;
    const screenX = canvasRect.left + region.x * scale - pad;
    const screenY = canvasRect.top + region.y * scale - pad;
    const screenWidth = region.width * scale + pad * 2;
    const screenHeight = region.height * scale + pad * 2;

    spotlight.style.opacity = '1';
    spotlight.style.left = `${screenX}px`;
    spotlight.style.top = `${screenY}px`;
    spotlight.style.width = `${screenWidth}px`;
    spotlight.style.height = `${screenHeight}px`;

    const cardWidth = 300;
    const estimatedCardHeight = 190;
    const spaceBelow = window.innerHeight - (screenY + screenHeight);
    const placeBelow = spaceBelow > estimatedCardHeight + 16 || screenY < estimatedCardHeight + 16;

    const cardTop = placeBelow ? screenY + screenHeight + 14 : screenY - estimatedCardHeight - 14;

    let cardLeft = screenX + screenWidth / 2 - cardWidth / 2;
    cardLeft = Math.max(16, Math.min(window.innerWidth - cardWidth - 16, cardLeft));

    card.style.top = `${Math.max(16, cardTop)}px`;
    card.style.left = `${cardLeft}px`;
    card.classList.toggle('tut-arrow-top', placeBelow);
    card.classList.toggle('tut-arrow-bottom', !placeBelow);

    const arrowX = screenX + screenWidth / 2 - cardLeft - 8;
    card.style.setProperty('--tut-ax', `${Math.max(16, Math.min(cardWidth - 32, arrowX))}px`);
  }

  function render(index) {
    currentIndex = index;
    const step = steps[index];

    labelEl.textContent = step.label;
    bodyEl.textContent = step.text;
    dotEls.forEach((dot, i) => dot.classList.toggle('tut-dot-active', i === index));
    prevBtn.disabled = index === 0;
    nextBtn.textContent = index === steps.length - 1 ? 'Snap ik! ✓' : 'Volgende →';

    positionStep(step);
  }

  function handleResize() {
    if (isOpen) positionStep(steps[currentIndex]);
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

  return { open, close, isOpen: () => isOpen, hasBeenSeen: () => hasSeenTutorial(storageKey) };
}
