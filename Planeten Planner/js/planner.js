// Weekplanning: 5 dagen met elk een vast aantal taakplekken.

import { THEME } from './theme.js';
import { drawRoundedRect } from './canvasUtils.js';

const DAY_NAMES = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'];

export function createWeekPlanning(numberOfDays, slotsPerDay) {
  const days = [];
  for (let i = 0; i < numberOfDays; i++) {
    days.push({ name: DAY_NAMES[i] ?? `Dag ${i + 1}`, tasks: [], slotsPerDay });
  }
  return { days, slotsPerDay };
}

export function usedSlotsInDay(planning, dayIndex) {
  return planning.days[dayIndex].tasks.reduce((sum, task) => sum + task.slots, 0);
}

export function hasRoomInDay(planning, dayIndex, task) {
  return usedSlotsInDay(planning, dayIndex) + task.slots <= planning.slotsPerDay;
}

// Voorkomt een oneerlijke impasse: een grote taak mag alleen ontstaan (spawnen) of
// gevangen worden als er op dit moment ergens nog plek voor is. Zo kan een speler
// nooit vastlopen door pech in de taakvolgorde — alleen nog door eigen planningskeuzes.
export function canPlaceInAnyDay(planning, task) {
  return planning.days.some((_day, dayIndex) => hasRoomInDay(planning, dayIndex, task));
}

export function placeTaskInDay(planning, dayIndex, task) {
  planning.days[dayIndex].tasks.push(task);
}

export function totalFilledSlots(planning) {
  return planning.days.reduce((sum, _day, i) => sum + usedSlotsInDay(planning, i), 0);
}

// Tekent 5 dagkolommen met taaknamen. Grote taken vullen zichtbaar 2 gekoppelde plekken.
// shake = { dayIndex, offsetX } laat één kolom kort zijwaarts schudden (volle dag-feedback).
// planetImages = [ma, di, wo, do, vr] -> Image|null, elke dag zijn eigen planeetje.
export function renderWeekPlanning(ctx, planning, x, y, width, height, shake = { dayIndex: -1, offsetX: 0 }, planetImages = []) {
  const dayGap = 6;
  const dayWidth = (width - dayGap * (planning.days.length - 1)) / planning.days.length;
  const headerHeight = 56;
  const slotHeight = (height - headerHeight - 6) / planning.slotsPerDay;

  ctx.textAlign = 'center';

  planning.days.forEach((day, dayIndex) => {
    const shakeX = dayIndex === shake.dayIndex ? shake.offsetX : 0;
    const dayX = x + dayIndex * (dayWidth + dayGap) + shakeX;
    const isFull = usedSlotsInDay(planning, dayIndex) >= planning.slotsPerDay;

    // Glazen dagkaart: één afgerond paneel per dag, groene rand zodra hij vol zit.
    drawRoundedRect(ctx, dayX, y, dayWidth, height, THEME.radius.md, {
      fill: THEME.color.surface,
      stroke: isFull ? THEME.color.accentGreen : THEME.color.border,
      strokeWidth: isFull ? 1.5 : 1
    });

    // Dagnummer als los, klein label in de hoek — staat los van de planeet, geen
    // overlap meer, en leest als een rustige tag in plaats van een sticker-badge.
    const tagSize = 18;
    drawRoundedRect(ctx, dayX + 6, y + 6, tagSize, tagSize, THEME.radius.sm, {
      fill: isFull ? THEME.color.accentGreenSoft : THEME.color.accentBlueSoft,
      stroke: isFull ? THEME.color.accentGreen : THEME.color.accentBlue,
      strokeWidth: 1
    });
    ctx.fillStyle = isFull ? THEME.color.accentGreen : THEME.color.accentBlue;
    ctx.font = 'bold 10px \'Inria Sans\', sans-serif';
    ctx.fillText(String(dayIndex + 1), dayX + 6 + tagSize / 2, y + 6 + tagSize / 2 + 3.5);

    const centerX = dayX + dayWidth / 2;
    const planetSize = 28;
    const planetY = y + 8;
    const planetImage = planetImages[dayIndex];

    if (planetImage) {
      ctx.drawImage(planetImage, centerX - planetSize / 2, planetY, planetSize, planetSize);
    } else {
      ctx.beginPath();
      ctx.fillStyle = THEME.color.accentBlueSoft;
      ctx.arc(centerX, planetY + planetSize / 2, planetSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Dagnaam: groter en helder (textPrimary i.p.v. textMuted) zodat het op
    // afstand goed leesbaar blijft.
    ctx.fillStyle = THEME.color.textPrimary;
    ctx.font = 'bold 12px \'Inria Sans\', sans-serif';
    ctx.fillText(day.name, centerX, planetY + planetSize + 16);

    ctx.strokeStyle = THEME.color.border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(dayX + 8, y + headerHeight);
    ctx.lineTo(dayX + dayWidth - 8, y + headerHeight);
    ctx.stroke();

    let slotOffset = 0;
    for (const task of day.tasks) {
      const slotY = y + headerHeight + slotOffset * slotHeight;
      const chipHeight = slotHeight * task.slots - 3;
      const isLarge = task.slots === 2;

      drawRoundedRect(ctx, dayX + 4, slotY + 2, dayWidth - 8, chipHeight - 2, THEME.radius.sm, {
        fill: isLarge ? THEME.color.taskLargeFill : THEME.color.taskSmallFill,
        stroke: isLarge ? THEME.color.taskLargeBorder : THEME.color.taskSmallBorder,
        strokeWidth: isLarge ? 1.5 : 1
      });

      ctx.fillStyle = THEME.color.textPrimary;
      ctx.font = '10px \'Inria Sans\', sans-serif';
      ctx.fillText(task.label, centerX, slotY + chipHeight / 2 + 3.5, dayWidth - 12);

      slotOffset += task.slots;
    }

    for (let slot = slotOffset; slot < planning.slotsPerDay; slot++) {
      const slotY = y + headerHeight + slot * slotHeight;
      drawRoundedRect(ctx, dayX + 4, slotY + 2, dayWidth - 8, slotHeight - 4, THEME.radius.sm, {
        stroke: THEME.color.border,
        strokeWidth: 1
      });
    }
  });
}

// Weekoverzicht na een voltooid level: rustig, leesbaar, voelt als beloning.
export function renderWeekSummary(ctx, planning, levelNumber, canvasWidth, canvasHeight) {
  ctx.fillStyle = 'rgba(7, 10, 20, 0.7)';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const cardWidth = Math.min(canvasWidth - 60, 720);
  const cardHeight = canvasHeight - 80;
  const cardX = (canvasWidth - cardWidth) / 2;
  const cardY = 40;

  drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, THEME.radius.lg, {
    fill: THEME.color.surfaceStrong,
    stroke: THEME.color.border,
    strokeWidth: 1.5
  });

  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.accentAmber;
  ctx.font = 'bold 20px \'Inria Sans\', sans-serif';
  ctx.fillText(`Week ${levelNumber} voltooid`, canvasWidth / 2, cardY + 40);

  const columnWidth = cardWidth / planning.days.length;
  const startY = cardY + 75;

  planning.days.forEach((day, dayIndex) => {
    const colX = cardX + dayIndex * columnWidth + columnWidth / 2;

    ctx.fillStyle = THEME.color.accentBlue;
    ctx.font = 'bold 13px \'Inria Sans\', sans-serif';
    ctx.fillText(day.name, colX, startY);

    ctx.font = '11px \'Inria Sans\', sans-serif';
    ctx.fillStyle = THEME.color.textPrimary;
    let lineY = startY + 22;
    for (const task of day.tasks) {
      const label = task.slots === 2 ? `${task.label} (2 plekken)` : task.label;
      ctx.fillText(label, colX, lineY, columnWidth - 10);
      lineY += 20;
    }
  });

  ctx.fillStyle = THEME.color.textMuted;
  ctx.font = '13px \'Inria Sans\', sans-serif';
  ctx.fillText('Druk op spatie voor de volgende week...', canvasWidth / 2, cardY + cardHeight - 20);
}
