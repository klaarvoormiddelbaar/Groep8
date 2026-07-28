// Laadruimte van de raket: een wachtrij (FIFO) van gevangen taken.
// De oudste gevangen taak staat vooraan en wordt als eerste ingepland (fase 8).

import { THEME } from './theme.js';
import { drawRoundedRect } from './canvasUtils.js';

export function createCargo(capacity) {
  return {
    capacity,
    queue: []
  };
}

export function usedSlots(cargo) {
  return cargo.queue.reduce((sum, task) => sum + task.slots, 0);
}

export function hasRoomFor(cargo, task) {
  return usedSlots(cargo) + task.slots <= cargo.capacity;
}

export function addToCargo(cargo, task) {
  cargo.queue.push(task);
}

export function peekNextTask(cargo) {
  return cargo.queue.length > 0 ? cargo.queue[0] : null;
}

export function removeNextTask(cargo) {
  return cargo.queue.shift();
}

// Toont de laadruimte als een eigen glazen kaartje met genummerde 'plekken' —
// dezelfde visuele taal als de dagvakken in de weekplanning: een grote taak neemt
// zichtbaar 2 aaneengesloten plekken in, een kleine taak 1. De voorste (oudste)
// taak in de wachtrij krijgt een blauwe rand + een tekstregel die met woorden
// zegt of de volgende in te plannen taak klein of groot is. Bij een volle
// laadruimte kleurt de hele kaart rood in plaats van alleen een los cijfertje.
// smallImage/largeImage: dezelfde taakplaatjes als de vallende taken (objects.js).
export function renderCargo(ctx, cargo, rightX, topY, smallImage = null, largeImage = null) {
  const used = usedSlots(cargo);
  const isFull = used >= cargo.capacity;
  const next = peekNextTask(cargo);

  const pipWidthUnit = 22;
  const pipHeight = 22;
  const pipGap = 3;
  const padding = 10;
  const contentWidth = cargo.capacity * pipWidthUnit + (cargo.capacity - 1) * pipGap;

  const headerFont = 'bold 12px \'Inria Sans\', sans-serif';
  // Vetgedrukt zodra de volgende taak groot is — een extra visuele waarschuwing
  // om vroeg genoeg 2 plekken vrij te houden.
  const isNextLarge = Boolean(next) && next.slots === 2;
  const nextFont = isNextLarge ? 'bold 11px \'Inria Sans\', sans-serif' : '11px \'Inria Sans\', sans-serif';
  const headerLabel = isFull ? 'LAADRUIMTE VOL' : `LAADRUIMTE ${used}/${cargo.capacity}`;
  const nextLabel = next
    ? next.slots === 2
      ? 'Volgende: groot (2 plekken)'
      : 'Volgende: klein (1 plek)'
    : 'Nog leeg';

  ctx.font = headerFont;
  const headerWidth = ctx.measureText(headerLabel).width;
  ctx.font = nextFont;
  const nextWidth = ctx.measureText(nextLabel).width;

  const cardWidth = Math.max(contentWidth, headerWidth, nextWidth) + padding * 2;
  const cardHeight = 80;
  const cardX = rightX - cardWidth;

  drawRoundedRect(ctx, cardX, topY, cardWidth, cardHeight, THEME.radius.md, {
    fill: THEME.color.surface,
    stroke: isFull ? THEME.color.accentRed : THEME.color.border,
    strokeWidth: isFull ? 1.5 : 1
  });

  ctx.textAlign = 'right';
  ctx.font = headerFont;
  ctx.fillStyle = isFull ? THEME.color.accentRed : THEME.color.textMuted;
  ctx.fillText(headerLabel, rightX - padding, topY + 18);

  const pipY = topY + 24;
  let cursorRightX = rightX - padding;

  for (let i = 0; i < cargo.queue.length; i++) {
    const task = cargo.queue[i];
    const isNext = i === 0;
    const isLarge = task.slots === 2;
    const chipWidth = isLarge ? pipWidthUnit * 2 + pipGap : pipWidthUnit;
    const chipX = cursorRightX - chipWidth;

    drawRoundedRect(ctx, chipX, pipY, chipWidth, pipHeight, THEME.radius.sm, {
      fill: isLarge ? THEME.color.taskLargeFill : THEME.color.taskSmallFill,
      stroke: isNext ? THEME.color.accentBlue : (isLarge ? THEME.color.taskLargeBorder : THEME.color.taskSmallBorder),
      strokeWidth: isNext ? 2 : 1.25
    });

    const image = isLarge ? largeImage : smallImage;
    if (image) {
      const iconSize = pipHeight - 4;
      ctx.drawImage(image, chipX + chipWidth / 2 - iconSize / 2, pipY + 2, iconSize, iconSize);
    }

    cursorRightX = chipX - pipGap;
  }

  let remainingSlots = cargo.capacity - used;
  while (remainingSlots > 0) {
    const chipX = cursorRightX - pipWidthUnit;
    drawRoundedRect(ctx, chipX, pipY, pipWidthUnit, pipHeight, THEME.radius.sm, {
      stroke: THEME.color.border,
      strokeWidth: 1
    });
    cursorRightX = chipX - pipGap;
    remainingSlots -= 1;
  }

  ctx.font = nextFont;
  ctx.fillStyle = next ? THEME.color.accentBlue : THEME.color.textMuted;
  ctx.fillText(nextLabel, rightX - padding, pipY + pipHeight + 16);
}
