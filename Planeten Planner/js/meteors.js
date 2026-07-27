// Meteorieten: vallende gevaarobjecten, visueel duidelijk anders dan taken (cirkel i.p.v. vierkant).

const METEOR_RADIUS = 20;

export function createMeteorSpawner(canvasWidth) {
  return {
    meteors: [],
    spawnTimerMs: 0,
    canvasWidth
  };
}

export function spawnMeteor(spawner, fallSpeed) {
  const x = METEOR_RADIUS + Math.random() * (spawner.canvasWidth - METEOR_RADIUS * 2);
  spawner.meteors.push({
    x,
    y: -METEOR_RADIUS,
    radius: METEOR_RADIUS,
    fallSpeed
  });
}

// speedMultiplier schaalt de beweging van ALLE meteorieten deze frame, zie objects.js.
export function updateMeteors(spawner, deltaSeconds, canvasHeight, spawnIntervalMs, fallSpeed, speedMultiplier) {
  spawner.spawnTimerMs += deltaSeconds * 1000;
  if (spawner.spawnTimerMs >= spawnIntervalMs) {
    spawner.spawnTimerMs = 0;
    spawnMeteor(spawner, fallSpeed);
  }

  for (const meteor of spawner.meteors) {
    meteor.y += meteor.fallSpeed * speedMultiplier * deltaSeconds;
  }

  spawner.meteors = spawner.meteors.filter((meteor) => meteor.y - meteor.radius <= canvasHeight);
}

export function renderMeteors(ctx, spawner) {
  for (const meteor of spawner.meteors) {
    ctx.beginPath();
    ctx.fillStyle = '#78716c';
    ctx.arc(meteor.x, meteor.y, meteor.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#292524';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
