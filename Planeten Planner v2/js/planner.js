// Weekplanning: 5 dagen met elk een vast aantal taakplekken.

import { THEME } from './theme.js';
import { drawRoundedRect, drawPillButton, drawStatCard } from './canvasUtils.js';

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

// Haalt een al ingeplande taak weer weg (index in day.tasks) en geeft 'm terug —
// gebruikt door de 'vastgelopen grote taak'-redding in game.js, die een kleine
// taak moet verdringen om een grote taak alsnog een plek te geven.
export function removeTaskFromDay(planning, dayIndex, taskIndex) {
  return planning.days[dayIndex].tasks.splice(taskIndex, 1)[0];
}

export function totalFilledSlots(planning) {
  return planning.days.reduce((sum, _day, i) => sum + usedSlotsInDay(planning, i), 0);
}

// Tekent 5 dagkolommen met taaknamen. Grote taken vullen zichtbaar 2 gekoppelde plekken.
// shake = { dayIndex, offsetX } laat één kolom kort zijwaarts schudden (volle dag-feedback).
// planetImages = [ma, di, wo, do, vr] -> Image|null, elke dag zijn eigen planeetje.
// highlightDaysToPlan: true tijdens de laadruimte-vol-pauze — laat elke dag die nog
// plek heeft een ademende amber gloed/rand krijgen, zodat meteen duidelijk is wáár
// gepland kan worden (i.p.v. alleen een los kaartje ergens op het scherm).
export function renderWeekPlanning(
  ctx,
  planning,
  x,
  y,
  width,
  height,
  shake = { dayIndex: -1, offsetX: 0 },
  planetImages = [],
  highlightDaysToPlan = false
) {
  const dayGap = 6;
  const dayWidth = (width - dayGap * (planning.days.length - 1)) / planning.days.length;
  const headerHeight = 56;
  const slotHeight = (height - headerHeight - 6) / planning.slotsPerDay;
  // Eén gedeelde puls voor alle dagen tegelijk, zodat ze synchroon 'ademen'.
  const pulse = (Array.isArray(highlightDaysToPlan) ? highlightDaysToPlan.length > 0 : highlightDaysToPlan) ? 0.5 + 0.5 * Math.sin(Date.now() / 260) : 0;

  ctx.textAlign = 'center';

  planning.days.forEach((day, dayIndex) => {
    const shakeX = dayIndex === shake.dayIndex ? shake.offsetX : 0;
    const dayX = x + dayIndex * (dayWidth + dayGap) + shakeX;
    const isFull = usedSlotsInDay(planning, dayIndex) >= planning.slotsPerDay;
    const isHighlighted = Array.isArray(highlightDaysToPlan) ? highlightDaysToPlan.includes(dayIndex) : highlightDaysToPlan && !isFull;

    if (isHighlighted) {
      const glowPadding = 4 + pulse * 6;
      drawRoundedRect(
        ctx,
        dayX - glowPadding,
        y - glowPadding,
        dayWidth + glowPadding * 2,
        height + glowPadding * 2,
        THEME.radius.md + glowPadding,
        { fill: `rgba(245, 158, 11, ${0.14 + pulse * 0.2})` }
      );
    }

    // Glazen dagkaart: één afgerond paneel per dag, groene rand zodra hij vol zit,
    // ademend amber tijdens de laadruimte-vol-pauze zolang er nog plek is.
    // Zachte schaduw eronder zodat de kaart echt van de sterrenhemel af lijkt te
    // zweven i.p.v. er plat bovenop geplakt te zijn.
    drawRoundedRect(ctx, dayX, y, dayWidth, height, THEME.radius.md, {
      fill: THEME.color.surface,
      stroke: isHighlighted ? `rgba(245, 158, 11, ${0.55 + pulse * 0.45})` : isFull ? THEME.color.accentGreen : THEME.color.border,
      strokeWidth: isHighlighted ? 2 + pulse : isFull ? 1.5 : 1,
      shadow: THEME.shadow.chip
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
// Geen automatische timer meer — de speler klikt zelf op 'Volgende week' (of
// drukt spatie); de aangeroepen functie geeft de knop-rect terug zodat het
// klikbaar gemaakt kan worden in game.js.
export function renderWeekSummary(
  ctx,
  planning,
  levelNumber,
  scoreGained,
  livesRemaining,
  maxLives,
  canvasWidth,
  canvasHeight,
  planetImages = [],
  checkIcon = null,
  fx = {}
) {
  // fx: { elapsedMs, lifeFull, lifeEmpty, sparkles, party, lifeBonus } — voor de animaties.
  const elapsedMs = fx.elapsedMs ?? 10000;
  ctx.fillStyle = 'rgba(7, 10, 20, 0.72)';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const cardWidth = Math.min(canvasWidth - 60, 720);
  const cardHeight = 400;
  const cardX = (canvasWidth - cardWidth) / 2;
  const cardY = (canvasHeight - cardHeight) / 2;

  drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, THEME.radius.lg, {
    fill: THEME.color.surfaceStrong,
    stroke: THEME.color.accentGreenSoft,
    strokeWidth: 1.5,
    shadow: THEME.shadow.card
  });

  // ── Confetti bovenaan (de eerste 2,5 seconde) ───────────────────────────────
  const confettiColors = ['#4ade80', '#38bdf8', '#fb923c', '#f87171', '#a78bfa', '#facc15'];
  const confettiFade = Math.max(0, 1 - elapsedMs / 2600);
  if (confettiFade > 0) {
    for (let i = 0; i < 34; i++) {
      const seed = (i * 7919) % 1000;
      const px = cardX + 14 + ((seed * 13) % (cardWidth - 28));
      const fall = (elapsedMs * (0.05 + (seed % 7) * 0.012) + (seed % 90)) % 130;
      const py = cardY - 8 + fall;
      ctx.save();
      ctx.translate(px + Math.sin(elapsedMs / 300 + i) * 6, py);
      ctx.rotate(elapsedMs / 200 + i);
      ctx.globalAlpha = 0.85 * confettiFade;
      ctx.fillStyle = confettiColors[i % confettiColors.length];
      ctx.fillRect(-3, -2, 6, 4);
      ctx.restore();
    }
  }

  // ── Titel met feestmutsen en een kleine stuiter bij het verschijnen ─────────────
  const bounceT = Math.min(1, elapsedMs / 420);
  const titleScale = 1 + 0.3 * Math.exp(-bounceT * 5) * Math.cos(bounceT * 14);
  const title = `Week ${levelNumber} voltooid!`;
  ctx.save();
  ctx.translate(canvasWidth / 2, cardY + 38);
  ctx.scale(titleScale, titleScale);
  ctx.font = 'bold 24px \'Inria Sans\', sans-serif';
  const titleWidth = ctx.measureText(title).width;
  const partyIcon = fx.party ?? checkIcon;
  const iconSize = 24;
  if (partyIcon) {
    ctx.drawImage(partyIcon, -titleWidth / 2 - iconSize - 10, -iconSize + 5, iconSize, iconSize);
    ctx.save();
    ctx.translate(titleWidth / 2 + 10 + iconSize, 0);
    ctx.scale(-1, 1); // spiegelbeeld rechts, even ver van de titel als links
    ctx.drawImage(partyIcon, 0, -iconSize + 5, iconSize, iconSize);
    ctx.restore();
  }
  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.accentGreen;
  ctx.shadowColor = 'rgba(16, 163, 127, 0.55)';
  ctx.shadowBlur = 12;
  ctx.fillText(title, 0, 0);
  ctx.restore();

  // ── Twee kaartjes: XP deze week (telt op) en levens (hartjes verschijnen één voor één) ──
  const statWidth = 200;
  const statHeight = 74;
  const statGap = 16;
  const statsY = cardY + 58;
  const statsX = canvasWidth / 2 - statWidth - statGap / 2;

  // XP-kaart
  drawRoundedRect(ctx, statsX, statsY, statWidth, statHeight, THEME.radius.sm, {
    fill: THEME.color.surfaceStrong,
    stroke: 'rgba(245, 158, 11, 0.45)',
    strokeWidth: 1.5,
    shadow: THEME.shadow.chip
  });
  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.textMuted;
  ctx.font = '10px \'Inria Sans\', sans-serif';
  ctx.fillText('XP DEZE WEEK', statsX + statWidth / 2, statsY + 17);
  const countT = Math.min(1, Math.max(0, (elapsedMs - 250) / 1100));
  const eased = 1 - Math.pow(1 - countT, 3);
  const shownGain = Math.round(scoreGained * eased);
  const gainText = `+${shownGain.toLocaleString('nl-NL')}`;
  ctx.font = 'bold 30px \'Inria Sans\', sans-serif';
  const gainWidth = ctx.measureText(gainText).width;
  const sparkleSize = 26;
  const gainGroup = sparkleSize + 8 + gainWidth;
  const gainX = statsX + statWidth / 2 - gainGroup / 2;
  if (fx.sparkles) ctx.drawImage(fx.sparkles, gainX, statsY + statHeight - 14 - sparkleSize + 4 + Math.sin(elapsedMs / 300) * 1.5, sparkleSize, sparkleSize);
  ctx.textAlign = 'left';
  ctx.fillStyle = countT >= 1 ? '#fde68a' : '#f8fafc';
  ctx.shadowColor = 'rgba(250, 204, 21, 0.55)';
  ctx.shadowBlur = 10;
  ctx.fillText(gainText, gainX + sparkleSize + 8, statsY + statHeight - 14);
  ctx.shadowBlur = 0;

  // Levens-kaart
  const livesX = statsX + statWidth + statGap;
  drawRoundedRect(ctx, livesX, statsY, statWidth, statHeight, THEME.radius.sm, {
    fill: THEME.color.surfaceStrong,
    stroke: 'rgba(239, 68, 68, 0.4)',
    strokeWidth: 1.5,
    shadow: THEME.shadow.chip
  });
  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.textMuted;
  ctx.font = '10px \'Inria Sans\', sans-serif';
  ctx.fillText('LEVENS OVER', livesX + statWidth / 2, statsY + 17);
  const heartSize = 28;
  const heartGap = 8;
  const heartsWidth = maxLives * heartSize + (maxLives - 1) * heartGap;
  let heartX = livesX + statWidth / 2 - heartsWidth / 2;
  for (let h = 0; h < maxLives; h++) {
    const full = h < livesRemaining;
    const appearT = Math.min(1, Math.max(0, (elapsedMs - 500 - h * 160) / 260));
    const pop = appearT <= 0 ? 0 : 1 + 0.35 * Math.sin(appearT * Math.PI);
    const img = full ? fx.lifeFull : fx.lifeEmpty;
    if (img) {
      const w = heartSize * (img.width / img.height);
      ctx.save();
      ctx.translate(heartX + heartSize / 2, statsY + 42);
      ctx.scale(pop, pop);
      ctx.globalAlpha = appearT > 0 ? 1 : 0;
      ctx.drawImage(img, -w / 2, -heartSize / 2, w, heartSize);
      ctx.restore();
    }
    heartX += heartSize + heartGap;
  }
  if (livesRemaining > 0 && (fx.lifeBonus ?? 0) > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fca5a5';
    ctx.font = 'bold 11px \'Inria Sans\', sans-serif';
    ctx.fillText(`+${fx.lifeBonus} XP bonus`, livesX + statWidth / 2, statsY + statHeight - 6);
  }

  const columnWidth = cardWidth / planning.days.length;
  const planetSize = 32;
  const dayBlockTop = statsY + statHeight + 26;

  planning.days.forEach((day, dayIndex) => {
    const colX = cardX + dayIndex * columnWidth + columnWidth / 2;
    const planetImage = planetImages[dayIndex];

    if (planetImage) {
      ctx.drawImage(planetImage, colX - planetSize / 2, dayBlockTop, planetSize, planetSize);
    } else {
      ctx.beginPath();
      ctx.fillStyle = THEME.color.accentBlueSoft;
      ctx.arc(colX, dayBlockTop + planetSize / 2, planetSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    const nameY = dayBlockTop + planetSize + 18;
    ctx.fillStyle = THEME.color.accentBlue;
    ctx.font = 'bold 13px \'Inria Sans\', sans-serif';
    ctx.fillText(day.name, colX, nameY);

    // Taken als gekleurde chips (dezelfde blauw/amber taal als de weekplanning en de
    // vallende taken) i.p.v. kale tekstregels. Net als in de echte weekplanning vult
    // een grote taak zichtbaar 2 vakjes i.p.v. 1 even grote chip als een kleine taak.
    const chipWidth = columnWidth - 20;
    const slotAreaTop = nameY + 12;
    const slotUnit = 24;
    const slotGap = 4;

    if (day.tasks.length === 0) {
      ctx.font = '12px \'Inria Sans\', sans-serif';
      ctx.fillStyle = THEME.color.textMuted;
      ctx.fillText('Geen taken', colX, slotAreaTop + 12);
    } else {
      let slotOffset = 0;
      for (const task of day.tasks) {
        const isLarge = task.slots === 2;
        const chipY = slotAreaTop + slotOffset * slotUnit;
        const chipHeight = slotUnit * task.slots - slotGap;

        drawRoundedRect(ctx, colX - chipWidth / 2, chipY, chipWidth, chipHeight, THEME.radius.sm, {
          fill: isLarge ? THEME.color.taskLargeFill : THEME.color.taskSmallFill,
          stroke: isLarge ? THEME.color.taskLargeBorder : THEME.color.taskSmallBorder,
          strokeWidth: isLarge ? 1.5 : 1
        });

        ctx.font = '10px \'Inria Sans\', sans-serif';
        ctx.fillStyle = THEME.color.textPrimary;
        ctx.fillText(task.label, colX, chipY + chipHeight / 2 + 3.5, chipWidth - 8);

        slotOffset += task.slots;
      }
    }
  });

  const buttonWidth = 220;
  const buttonHeight = 52;
  const buttonRect = {
    x: canvasWidth / 2 - buttonWidth / 2,
    y: cardY + cardHeight - 80,
    width: buttonWidth,
    height: buttonHeight
  };
  drawPillButton(ctx, buttonRect, 'Volgende week');

  ctx.textAlign = 'center';
  ctx.fillStyle = THEME.color.textMuted;
  ctx.font = '11px \'Inria Sans\', sans-serif';
  ctx.fillText('of druk op spatie', canvasWidth / 2, buttonRect.y + buttonHeight + 18);

  return buttonRect;
}
