// Laadt alle spel-afbeeldingen vooraf. Een ontbrekend of kapot bestand geeft geen
// fout — de bijbehorende renderfunctie valt dan terug op de canvas-getekende vorm,
// zodat het spel altijd blijft werken, ook zonder (volledige) assets.

const IMAGE_PATHS = {
  rocket: '/Planeten%20Planner/assets/images/rocket.png',
  taskSmall: '/Planeten%20Planner/assets/images/task-small.png',
  taskLarge: '/Planeten%20Planner/assets/images/task-large.png',
  meteor: '/Planeten%20Planner/assets/images/meteor.png',
  powerupShield: '/Planeten%20Planner/assets/images/powerup-shield.png',
  powerupExtraCargo: '/Planeten%20Planner/assets/images/powerup-cargo.png',
  powerupMagnet: '/Planeten%20Planner/assets/images/powerup-magnet.png',
  powerupSlowMotion: '/Planeten%20Planner/assets/images/powerup-slowmotion.png',
  powerupExtraLife: '/Planeten%20Planner/assets/images/powerup-life.png',
  powerupDoubleScore: '/Planeten%20Planner/assets/images/powerup-doublescore.png',
  background: '/Planeten%20Planner/assets/images/background.png',
  lifeFull: '/Planeten%20Planner/assets/images/life-full.png',
  lifeEmpty: '/Planeten%20Planner/assets/images/life-empty.png',
  planetMonday: '/Planeten%20Planner/assets/images/planet-monday.png',
  planetTuesday: '/Planeten%20Planner/assets/images/planet-tuesday.png',
  planetWednesday: '/Planeten%20Planner/assets/images/planet-wednesday.png',
  planetThursday: '/Planeten%20Planner/assets/images/planet-thursday.png',
  planetFriday: '/Planeten%20Planner/assets/images/planet-friday.png'
};

const images = {};

function loadImage(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); // ontbrekend bestand: gewoon fallback, geen crash
    img.src = path;
  });
}

export async function loadAssets() {
  const entries = Object.entries(IMAGE_PATHS);
  const loaded = await Promise.all(entries.map(([, path]) => loadImage(path)));
  entries.forEach(([key], i) => {
    images[key] = loaded[i];
  });
  return images;
}

export function getImage(key) {
  return images[key] || null;
}
