// Raket: horizontale beweging met pijltjestoetsen of A/D.

const PLAYER_WIDTH = 56;
const PLAYER_HEIGHT = 28;
const PLAYER_SPEED = 260; // pixels per seconde
const PLAYER_MARGIN_BOTTOM = 24;

const MOVE_KEYS = new Set(['arrowleft', 'arrowright', 'a', 'd']);
const pressedKeys = new Set();

function onKeyDown(event) {
  const key = event.key.toLowerCase();
  pressedKeys.add(key);
  if (MOVE_KEYS.has(key)) {
    event.preventDefault();
  }
}

function onKeyUp(event) {
  pressedKeys.delete(event.key.toLowerCase());
}

export function createPlayer(canvasWidth, canvasHeight) {
  return {
    x: canvasWidth / 2 - PLAYER_WIDTH / 2,
    y: canvasHeight - PLAYER_HEIGHT - PLAYER_MARGIN_BOTTOM,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT
  };
}

export function initPlayerInput() {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
}

export function updatePlayer(player, deltaSeconds, canvasWidth) {
  let direction = 0;
  if (pressedKeys.has('arrowleft') || pressedKeys.has('a')) direction -= 1;
  if (pressedKeys.has('arrowright') || pressedKeys.has('d')) direction += 1;

  player.x += direction * PLAYER_SPEED * deltaSeconds;
  player.x = Math.max(0, Math.min(canvasWidth - player.width, player.x));
}

export function renderPlayer(ctx, player) {
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}
