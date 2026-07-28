// Centraal kleuren-/vormsysteem voor de moderne UI (panelen, knoppen, tekst).
// Losstaand van de illustraties (raket/taken/meteoriet/power-ups/planeten), die
// hun eigen stijl houden — dit bestand stuurt alleen wat we zelf met canvas tekenen.

export const THEME = {
  color: {
    bgDeep: '#070a14',

    // Glazen paneel-oppervlak: halfdoorzichtig, licht randje, geen harde kleurvlakken.
    surface: 'rgba(17, 22, 36, 0.74)',
    surfaceStrong: 'rgba(17, 22, 36, 0.92)',
    border: 'rgba(148, 163, 184, 0.16)',
    borderStrong: 'rgba(148, 163, 184, 0.30)',

    accentBlue: '#5b8def',
    accentBlueSoft: 'rgba(91, 141, 239, 0.16)',
    accentGreen: '#34d399',
    accentGreenSoft: 'rgba(52, 211, 153, 0.14)',
    accentAmber: '#f4b563',
    accentRed: '#f2777a',
    accentRedSoft: 'rgba(242, 119, 122, 0.16)',

    textPrimary: '#e8ecf5',
    textMuted: '#8b93a7',

    taskSmallFill: '#f6cf7d',
    taskSmallBorder: 'rgba(180, 130, 30, 0.55)',
    taskLargeFill: '#f0a95a',
    taskLargeBorder: 'rgba(150, 85, 20, 0.6)'
  },
  radius: {
    sm: 8,
    md: 14,
    lg: 20,
    pill: 999
  }
};
