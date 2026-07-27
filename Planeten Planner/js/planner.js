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

export function placeTaskInDay(planning, dayIndex, task) {
  planning.days[dayIndex].tasks.push(task);
}

export function totalFilledSlots(planning) {
  return planning.days.reduce((sum, _day, i) => sum + usedSlotsInDay(planning, i), 0);
}

// Tekent 5 dagkolommen met taaknamen. Grote taken vullen zichtbaar 2 gekoppelde plekken.
export function renderWeekPlanning(ctx, planning, x, y, width, height) {
  const dayWidth = width / planning.days.length;
  const headerHeight = 26;
  const slotHeight = (height - headerHeight) / planning.slotsPerDay;

  ctx.textAlign = 'center';

  planning.days.forEach((day, dayIndex) => {
    const dayX = x + dayIndex * dayWidth;

    ctx.fillStyle = '#111827';
    ctx.fillRect(dayX, y, dayWidth - 2, height);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(String(dayIndex + 1), dayX + dayWidth / 2, y + 14);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px sans-serif';
    ctx.fillText(day.name, dayX + dayWidth / 2, y + headerHeight - 2);

    let slotOffset = 0;
    for (const task of day.tasks) {
      const slotY = y + headerHeight + slotOffset * slotHeight;
      const chipHeight = slotHeight * task.slots - 2;

      ctx.fillStyle = task.slots === 2 ? '#fb923c' : '#facc15';
      ctx.fillRect(dayX + 2, slotY, dayWidth - 6, chipHeight);

      ctx.fillStyle = '#1f2937';
      ctx.font = '8px sans-serif';
      ctx.fillText(task.label, dayX + dayWidth / 2, slotY + chipHeight / 2 + 3, dayWidth - 8);

      slotOffset += task.slots;
    }

    for (let slot = slotOffset; slot < planning.slotsPerDay; slot++) {
      const slotY = y + headerHeight + slot * slotHeight;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.strokeRect(dayX + 2, slotY, dayWidth - 6, slotHeight - 2);
    }
  });
}
