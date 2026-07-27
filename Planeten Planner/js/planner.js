// Weekplanning: 5 dagen met elk een vast aantal taakplekken.
// Fase 8: alleen de plaatsingslogica. De echte dag-voor-dag UI komt in fase 9.

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
export function renderWeekPlanning(ctx, planning, x, y, width, height, shake = { dayIndex: -1, offsetX: 0 }) {
  const dayWidth = width / planning.days.length;
  const headerHeight = 26;
  const slotHeight = (height - headerHeight) / planning.slotsPerDay;

  ctx.textAlign = 'center';

  planning.days.forEach((day, dayIndex) => {
    const shakeX = dayIndex === shake.dayIndex ? shake.offsetX : 0;
    const dayX = x + dayIndex * dayWidth + shakeX;
    const isFull = usedSlotsInDay(planning, dayIndex) >= planning.slotsPerDay;

    // Kaartachtergrond ('dagpaneel').
    ctx.fillStyle = '#101a33';
    ctx.fillRect(dayX + 1, y, dayWidth - 3, height);

    // KvM-blauwe koptekst-balk met het dagcijfer, groen als de dag vol zit.
    ctx.fillStyle = isFull ? '#0f4d3c' : '#123a63';
    ctx.fillRect(dayX + 1, y, dayWidth - 3, headerHeight);

    ctx.fillStyle = isFull ? '#34d399' : '#72a8f9';
    ctx.font = 'bold 13px \'Inria Sans\', sans-serif';
    ctx.fillText(String(dayIndex + 1), dayX + dayWidth / 2, y + 14);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '9px \'Inria Sans\', sans-serif';
    ctx.fillText(day.name, dayX + dayWidth / 2, y + headerHeight - 2);

    let slotOffset = 0;
    for (const task of day.tasks) {
      const slotY = y + headerHeight + slotOffset * slotHeight;
      const chipHeight = slotHeight * task.slots - 2;
      const isLarge = task.slots === 2;

      ctx.fillStyle = isLarge ? '#f59e0b' : '#fde68a';
      ctx.fillRect(dayX + 3, slotY + 1, dayWidth - 8, chipHeight - 2);
      ctx.strokeStyle = isLarge ? '#b45309' : '#ca8a04';
      ctx.lineWidth = isLarge ? 2 : 1;
      ctx.strokeRect(dayX + 3, slotY + 1, dayWidth - 8, chipHeight - 2);

      ctx.fillStyle = '#1f2937';
      ctx.font = '8px \'Inria Sans\', sans-serif';
      ctx.fillText(task.label, dayX + dayWidth / 2, slotY + chipHeight / 2 + 3, dayWidth - 10);

      slotOffset += task.slots;
    }

    for (let slot = slotOffset; slot < planning.slotsPerDay; slot++) {
      const slotY = y + headerHeight + slot * slotHeight;
      ctx.strokeStyle = 'rgba(114, 168, 249, 0.18)';
      ctx.lineWidth = 1;
      ctx.strokeRect(dayX + 3, slotY + 1, dayWidth - 8, slotHeight - 4);
    }
  });
}

// Weekoverzicht na een voltooid level: rustig, leesbaar, voelt als beloning.
export function renderWeekSummary(ctx, planning, levelNumber, canvasWidth, canvasHeight) {
  ctx.fillStyle = 'rgba(5, 7, 13, 0.92)';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 22px \'Inria Sans\', sans-serif';
  ctx.fillText(`WEEK ${levelNumber} VOLTOOID`, canvasWidth / 2, 50);

  const columnWidth = canvasWidth / planning.days.length;
  const startY = 90;

  planning.days.forEach((day, dayIndex) => {
    const colX = dayIndex * columnWidth + columnWidth / 2;

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px \'Inria Sans\', sans-serif';
    ctx.fillText(day.name, colX, startY);

    ctx.font = '11px \'Inria Sans\', sans-serif';
    ctx.fillStyle = '#e2e8f0';
    let lineY = startY + 22;
    for (const task of day.tasks) {
      const label = task.slots === 2 ? `${task.label} (2 plekken)` : task.label;
      ctx.fillText(label, colX, lineY, columnWidth - 10);
      lineY += 20;
    }
  });

  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px \'Inria Sans\', sans-serif';
  ctx.fillText('Druk op spatie voor de volgende week...', canvasWidth / 2, canvasHeight - 30);
}
