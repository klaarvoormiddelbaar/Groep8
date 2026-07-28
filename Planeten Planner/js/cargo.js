// Laadruimte van de raket: een wachtrij (FIFO) van gevangen taken.
// De oudste gevangen taak staat vooraan en wordt als eerste ingepland (fase 8).

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

// smallImage/largeImage: dezelfde taakplaatjes als de vallende taken (objects.js),
// zodat de wachtrij-iconen automatisch in stijl blijven. Zonder afbeeldingen valt
// dit terug op de oude gekleurde blokjes.
export function renderCargo(ctx, cargo, canvasWidth, smallImage = null, largeImage = null) {
  const used = usedSlots(cargo);

  ctx.textAlign = 'right';
  ctx.font = 'bold 14px \'Inria Sans\', sans-serif';
  ctx.fillStyle = used >= cargo.capacity ? '#f87171' : '#94a3b8';
  ctx.fillText(`Laadruimte: ${used}/${cargo.capacity}`, canvasWidth - 12, 20);

  const chipSize = 28;
  const gap = 4;
  let chipX = canvasWidth - 12 - chipSize;

  for (let i = 0; i < cargo.queue.length; i++) {
    const task = cargo.queue[i];
    const isNext = i === 0;
    const isLarge = task.slots === 2;
    const image = isLarge ? largeImage : smallImage;

    if (image) {
      ctx.drawImage(image, chipX, 30, chipSize, chipSize);
    } else {
      ctx.fillStyle = isLarge ? '#fb923c' : '#facc15';
      ctx.fillRect(chipX, 30, chipSize, chipSize);
    }

    if (isNext) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(chipX - 1, 29, chipSize + 2, chipSize + 2);
    }

    chipX -= chipSize + gap;
  }
}
