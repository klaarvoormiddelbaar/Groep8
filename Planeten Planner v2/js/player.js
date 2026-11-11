// Raket: horizontale beweging met pijltjestoetsen of A/D.

// Beeldverhouding van rocket.png (417x642, staand) i.p.v. de vorige brede
// placeholder-driehoek — de hoogte volgt daaruit.
const PLAYER_WIDTH = 58; // 20% kleiner
const PLAYER_HEIGHT = Math.round(PLAYER_WIDTH * (642 / 417));
const PLAYER_SPEED = 520; // pixels per seconde
const PLAYER_MARGIN_BOTTOM = 20;

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

export function renderPlayer(ctx, player, isInvulnerable = false, image = null) {
  // Tijdens onkwetsbaarheid knippert de raket (om en om 100ms zichtbaar/onzichtbaar).
  const isBlinkedOut = isInvulnerable && Math.floor(Date.now() / 100) % 2 === 0;
  if (isBlinkedOut) return;

  if (image) {
    ctx.drawImage(image, player.x, player.y, player.width, player.height);
    return;
  }

  const { x, y, width, height } = player;
  const cx = x + width / 2;
  const noseY = y;
  const tailY = y + height;

  // Romp: spits neusje boven, brede staart onder (KvM-blauw).
  ctx.beginPath();
  ctx.moveTo(cx, noseY);
  ctx.lineTo(x + width * 0.78, tailY);
  ctx.lineTo(x + width * 0.22, tailY);
  ctx.closePath();
  ctx.fillStyle = '#72a8f9';
  ctx.fill();
  ctx.strokeStyle = '#1e4a8a';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Vinnen.
  ctx.beginPath();
  ctx.moveTo(x + width * 0.22, tailY);
  ctx.lineTo(x, tailY + height * 0.35);
  ctx.lineTo(x + width * 0.3, tailY - height * 0.15);
  ctx.closePath();
  ctx.moveTo(x + width * 0.78, tailY);
  ctx.lineTo(x + width, tailY + height * 0.35);
  ctx.lineTo(x + width * 0.7, tailY - height * 0.15);
  ctx.closePath();
  ctx.fillStyle = '#f59e0b';
  ctx.fill();

  // Raampje.
  ctx.beginPath();
  ctx.arc(cx, y + height * 0.42, width * 0.14, 0, Math.PI * 2);
  ctx.fillStyle = '#e2e8f0';
  ctx.fill();
  ctx.strokeStyle = '#1e4a8a';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Stuwvlam.
  ctx.beginPath();
  ctx.moveTo(x + width * 0.35, tailY);
  ctx.lineTo(cx, tailY + height * 0.6);
  ctx.lineTo(x + width * 0.65, tailY);
  ctx.closePath();
  ctx.fillStyle = '#fbbf24';
  ctx.fill();
}
