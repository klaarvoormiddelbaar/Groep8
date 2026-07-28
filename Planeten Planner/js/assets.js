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
  planetFriday: '/Planeten%20Planner/assets/images/planet-friday.png',

  // Iconen uit de gedeelde iOS-emoji-pack i.p.v. losse Unicode-emoji (StyleGuide-regel:
  // geen systeem-emoji in de interface). Bestaande, ongewijzigde assets — geen ChatGPT-content.
  iconWarning: '/Afbeeldingen/Emoji%20Pack%20iOS/warning_26a0-fe0f.png',
  iconCheck: '/Afbeeldingen/Emoji%20Pack%20iOS/check-mark-button_2705.png',
  iconShield: '/Afbeeldingen/Emoji%20Pack%20iOS/shield_1f6e1-fe0f.png',
  iconPackage: '/Afbeeldingen/Emoji%20Pack%20iOS/package_1f4e6.png',
  iconMagnet: '/Afbeeldingen/Emoji%20Pack%20iOS/magnet_1f9f2.png',
  iconSnail: '/Afbeeldingen/Emoji%20Pack%20iOS/snail_1f40c.png',
  iconPause: '/Afbeeldingen/Emoji%20Pack%20iOS/pause-button_23f8-fe0f.png',
  iconSpeaker: '/Afbeeldingen/Emoji%20Pack%20iOS/speaker-medium-volume_1f509.png',
  iconArrowLeft: '/Afbeeldingen/Emoji%20Pack%20iOS/left-arrow_2b05-fe0f.png',
  iconArrowRight: '/Afbeeldingen/Emoji%20Pack%20iOS/right-arrow_27a1-fe0f.png',
  iconSparkles: '/Afbeeldingen/Emoji%20Pack%20iOS/sparkles_2728.png',
  iconLightbulb: '/Afbeeldingen/Emoji%20Pack%20iOS/light-bulb_1f4a1.png'
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
