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
export function renderCargo(ctx, cargo, rightX, topY, smallImage = null, largeImage = null, warningIcon = null) {
  const used = usedSlots(cargo);
  const isFull = used >= cargo.capacity;
  const next = peekNextTask(cargo);

  const pipWidthUnit = 22;
  const pipHeight = 22;
  const pipGap = 3;
  const padding = 10;
  const contentWidth = cargo.capacity * pipWidthUnit + (cargo.capacity - 1) * pipGap;

  const isFullFont = 'bold 14px \'Inria Sans\', sans-serif';
  const headerFont = isFull ? isFullFont : 'bold 12px \'Inria Sans\', sans-serif';
  // Vetgedrukt zodra de volgende taak groot is — een extra visuele waarschuwing
  // om vroeg genoeg 2 plekken vrij te houden.
  const isNextLarge = Boolean(next) && next.slots === 2;
  const nextFont = isNextLarge ? 'bold 11px \'Inria Sans\', sans-serif' : '11px \'Inria Sans\', sans-serif';
  const headerText = isFull ? 'LAADRUIMTE VOL' : `LAADRUIMTE ${used}/${cargo.capacity}`;
  const headerIconSize = 14;
  const nextLabel = next
    ? next.slots === 2
      ? 'Volgende: groot (2 plekken)'
      : 'Volgende: klein (1 plek)'
    : 'Nog leeg';

  ctx.font = headerFont;
  const headerTextWidth = ctx.measureText(headerText).width;
  const headerWidth = isFull && warningIcon ? headerTextWidth + headerIconSize + 6 : headerTextWidth;
  ctx.font = nextFont;
  const nextWidth = ctx.measureText(nextLabel).width;

  const cardWidth = Math.max(contentWidth, headerWidth, nextWidth) + padding * 2;
  const cardHeight = isFull ? 84 : 80;
  const cardX = rightX - cardWidth;

  // Duidelijke puls (geen hard knipperlicht, maar wel een stevig contrast) die de
  // achtergrond, rand, gloed en tekst laat 'ademen' zolang de laadruimte vol is —
  // de hele kaart verandert van kleur, niet alleen een dun randje.
  const pulse = isFull ? 0.5 + 0.5 * Math.sin(Date.now() / 220) : 0;
  const pulseRed = `rgb(${Math.round(230 + 25 * pulse)}, ${Math.round(70 + 90 * pulse)}, ${Math.round(75 + 90 * pulse)})`;

  if (isFull) {
    const glowPadding = 6 + pulse * 10;
    drawRoundedRect(
      ctx,
      cardX - glowPadding,
      topY - glowPadding,
      cardWidth + glowPadding * 2,
      cardHeight + glowPadding * 2,
      THEME.radius.md + glowPadding,
      { fill: `rgba(242, 80, 85, ${0.18 + pulse * 0.32})` }
    );
  }

  drawRoundedRect(ctx, cardX, topY, cardWidth, cardHeight, THEME.radius.md, {
    fill: isFull ? `rgba(242, 80, 85, ${0.22 + pulse * 0.2})` : THEME.color.surface,
    stroke: isFull ? pulseRed : THEME.color.border,
    strokeWidth: isFull ? 2 + pulse * 1.5 : 1,
    shadow: isFull ? undefined : THEME.shadow.chip
  });

  const headerBaselineY = topY + (isFull ? 20 : 18);
  ctx.textAlign = 'right';
  ctx.font = headerFont;
  ctx.fillStyle = isFull ? '#fff5f5' : THEME.color.textMuted;
  ctx.fillText(headerText, rightX - padding, headerBaselineY);

  if (isFull && warningIcon) {
    const iconX = rightX - padding - headerTextWidth - headerIconSize - 6;
    ctx.drawImage(warningIcon, iconX, headerBaselineY - headerIconSize + 3, headerIconSize, headerIconSize);
  }

  const pipY = topY + (isFull ? 28 : 24);
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
