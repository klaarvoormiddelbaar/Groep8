// Laadt alle spel-afbeeldingen vooraf. Een ontbrekend of kapot bestand geeft geen
// fout — de bijbehorende renderfunctie valt dan terug op de canvas-getekende vorm,
// zodat het spel altijd blijft werken, ook zonder (volledige) assets.

const IMAGE_PATHS = {
  rocket: '/Planeten%20Planner%20v2/assets/images/rocket.png',
  taskSmall: '/Planeten%20Planner%20v2/assets/images/task-small.png',
  taskLarge: '/Planeten%20Planner%20v2/assets/images/task-large.png',
  meteor: '/Planeten%20Planner%20v2/assets/images/meteor.png',
  powerupShield: '/Planeten%20Planner%20v2/assets/images/powerup-shield.png',
  powerupExtraCargo: '/Planeten%20Planner%20v2/assets/images/powerup-cargo.png',
  powerupMagnet: '/Planeten%20Planner%20v2/assets/images/powerup-magnet.png',
  powerupSlowMotion: '/Planeten%20Planner%20v2/assets/images/powerup-slowmotion.png',
  powerupExtraLife: '/Planeten%20Planner%20v2/assets/images/powerup-life.png',
  powerupDoubleScore: '/Planeten%20Planner%20v2/assets/images/powerup-doublescore.png',
  background: '/Planeten%20Planner%20v2/assets/images/background.jpg',
  lifeFull: '/Planeten%20Planner%20v2/assets/images/life-full.png',
  lifeEmpty: '/Planeten%20Planner%20v2/assets/images/life-empty.png',
  planetMonday: '/Planeten%20Planner%20v2/assets/images/planet-monday.png',
  planetTuesday: '/Planeten%20Planner%20v2/assets/images/planet-tuesday.png',
  planetWednesday: '/Planeten%20Planner%20v2/assets/images/planet-wednesday.png',
  planetThursday: '/Planeten%20Planner%20v2/assets/images/planet-thursday.png',
  planetFriday: '/Planeten%20Planner%20v2/assets/images/planet-friday.png',

  // Iconen uit de gedeelde iOS-emoji-pack i.p.v. losse Unicode-emoji (StyleGuide-regel:
  // geen systeem-emoji in de interface). Bestaande, ongewijzigde assets — geen ChatGPT-content.
  iconWarning: '/Afbeeldingen/EMOJI%20PACK%20IOS/warning_26a0-fe0f.png',
  iconCheck: '/Afbeeldingen/EMOJI%20PACK%20IOS/check-mark-button_2705.png',
  iconShield: '/Afbeeldingen/EMOJI%20PACK%20IOS/shield_1f6e1-fe0f.png',
  iconPackage: '/Afbeeldingen/EMOJI%20PACK%20IOS/package_1f4e6.png',
  iconMagnet: '/Afbeeldingen/EMOJI%20PACK%20IOS/magnet_1f9f2.png',
  iconSnail: '/Afbeeldingen/EMOJI%20PACK%20IOS/snail_1f40c.png',
  iconPause: '/Afbeeldingen/EMOJI%20PACK%20IOS/pause-button_23f8-fe0f.png',
  iconSpeaker: '/Afbeeldingen/EMOJI%20PACK%20IOS/speaker-medium-volume_1f509.png',
  iconArrowLeft: '/Afbeeldingen/EMOJI%20PACK%20IOS/left-arrow_2b05-fe0f.png',
  iconArrowRight: '/Afbeeldingen/EMOJI%20PACK%20IOS/right-arrow_27a1-fe0f.png',
  iconSparkles: '/Afbeeldingen/EMOJI%20PACK%20IOS/sparkles_2728.png',
  iconLightbulb: '/Afbeeldingen/EMOJI%20PACK%20IOS/light-bulb_1f4a1.png',
  iconTrophy: '/Afbeeldingen/EMOJI%20PACK%20IOS/trophy_1f3c6.png',
  iconStar: '/Afbeeldingen/EMOJI%20PACK%20IOS/star_2b50.png',
  iconSkull: '/Afbeeldingen/EMOJI%20PACK%20IOS/skull_1f480.png',
  iconPartyPopper: '/Afbeeldingen/EMOJI%20PACK%20IOS/party-popper_1f389.png'
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
