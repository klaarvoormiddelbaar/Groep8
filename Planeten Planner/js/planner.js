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
