// Centraal kleuren-/vormsysteem voor de moderne UI (panelen, knoppen, tekst).
// Losstaand van de illustraties (raket/taken/meteoriet/power-ups/planeten), die
// hun eigen stijl houden — dit bestand stuurt alleen wat we zelf met canvas tekenen.
//
// De accentkleuren zijn 1-op-1 overgenomen uit de KvM8 StyleGuide (merkblauw,
// -groen, -amber en -rood) zodat het spel zich echt als 'Klaar voor Middelbaar'
// voelt in plaats van een losse, zelfverzonnen dark-UI palette. De donkere
// ruimte-achtergrond zelf blijft bewust behouden (thema van het spel), maar
// alles wat wij zelf met canvas tekenen bovenop die achtergrond volgt het merk.

export const THEME = {
  color: {
    bgDeep: '#070a14',

    // Glazen paneel-oppervlak: halfdoorzichtig, licht randje, geen harde kleurvlakken.
    surface: 'rgba(17, 22, 36, 0.76)',
    surfaceStrong: 'rgba(15, 20, 32, 0.94)',
    border: 'rgba(148, 163, 184, 0.16)',
    borderStrong: 'rgba(148, 163, 184, 0.30)',

    // KvM-merkblauw (Primary, §2.2 StyleGuide).
    accentBlue: '#72a8f9',
    accentBlueSoft: 'rgba(114, 168, 249, 0.16)',
    // KvM-merkgroen (Action/Submit, §2.3 StyleGuide).
    accentGreen: '#10a37f',
    accentGreenSoft: 'rgba(16, 163, 127, 0.16)',
    // KvM-merkamber (Vrienden life area, §2.4 StyleGuide).
    accentAmber: '#f59e0b',
    accentAmberSoft: 'rgba(245, 158, 11, 0.16)',
    // KvM-merkrood (Liefde life area, §2.4 StyleGuide).
    accentRed: '#ef4444',
    accentRedSoft: 'rgba(239, 68, 68, 0.16)',

    textPrimary: '#f1f5f9',
    textMuted: '#a3abc0',

    // Zachte, doorschijnende tint i.p.v. een vol verzadigd blok — sluit aan bij de
    // glazen panelen in plaats van als los arcade-sticker bovenop te liggen.
    taskSmallFill: 'rgba(114, 168, 249, 0.18)',
    taskSmallBorder: 'rgba(114, 168, 249, 0.6)',
    taskLargeFill: 'rgba(245, 158, 11, 0.20)',
    taskLargeBorder: 'rgba(245, 158, 11, 0.7)'
  },
  radius: {
    sm: 8,
    md: 14,
    lg: 24,
    pill: 999
  },
  // De StyleGuide (§6) gebruikt donkere drop-shadows — logisch op een wit
  // canvas, maar een zwarte schaduw op onze bijna-zwarte ruimte-achtergrond is
  // onzichtbaar. Het achterliggende idee ('panelen zweven los i.p.v. plat op de
  // scene te liggen') vertalen we hier daarom naar een zachte, lichte/koele
  // gloed — dezelfde manier waarop de gekleurde knop-schaduwen (§7.7) al werken.
  shadow: {
    card: { color: 'rgba(148, 180, 230, 0.22)', blur: 32, offsetY: 10 },
    chip: { color: 'rgba(148, 180, 230, 0.16)', blur: 14, offsetY: 5 },
    glowGreen: { color: 'rgba(16, 163, 127, 0.55)', blur: 22, offsetY: 8 },
    glowBlue: { color: 'rgba(114, 168, 249, 0.5)', blur: 22, offsetY: 8 },
    glowRed: { color: 'rgba(239, 68, 68, 0.55)', blur: 22, offsetY: 8 }
  }
};
