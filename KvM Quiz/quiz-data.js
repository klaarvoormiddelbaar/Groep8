// ── Quizvragen per les ───────────────────────────────────────────────────────
// Zelfde idee als de LESSONS-array in dashboard.html (doelen/tl/mat): de
// inhoud staat in code, klaar om als momentopname in een sessie te belanden.
// Voeg een nieuwe sleutel ('les-2', 'les-3', ...) toe om een andere les ook
// een live quiz te geven — zelfde structuur, andere vragen.

const SCHOOLTAS_ILLUSTRATIE = `
  <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M70 74 C70 46 92 28 120 28 C148 28 170 46 170 74"
          stroke="#1e4a8a" stroke-width="8" fill="none" stroke-linecap="round"/>
    <rect x="48" y="72" width="144" height="120" rx="34" fill="#72a8f9"/>
    <rect x="92" y="44" width="56" height="46" rx="18" fill="#1e4a8a"/>
    <rect x="106" y="110" width="28" height="60" rx="11" fill="#ffffff" fill-opacity="0.30"/>
    <circle cx="120" cy="182" r="9" fill="#fbbf24"/>
    <circle cx="84" cy="120" r="6" fill="#ffffff" fill-opacity="0.45"/>
    <circle cx="156" cy="120" r="6" fill="#ffffff" fill-opacity="0.45"/>
  </svg>`;

const QUIZZES = {
  'les-1': [
    {
      type: 'multiple_choice',
      vraag: 'Wat is het doel van het Klaar voor Middelbaar-programma?',
      opties: [
        'Leerlingen voorbereiden op de overstap naar de middelbare school',
        'Leerlingen helpen bij het kiezen van een middelbare school',
        'Leerlingen extra oefenen met rekenen en taal',
        'Leerlingen kennis laten maken met verschillende beroepen'
      ],
      goed_index: 0,
      tijdslimiet_seconden: 20
    },
    {
      type: 'multiple_choice',
      vraag: 'Wie neemt je elke les mee tijdens de lessen van Klaar voor Middelbaar?',
      opties: ['Finn', 'Jesse', 'Jay', 'Milan'],
      goed_index: 2,
      tijdslimiet_seconden: 15
    },
    {
      type: 'multiple_choice',
      vraag: 'Welke van deze onderwerpen behandelen we bij Klaar voor Middelbaar?',
      opties: [
        'Plannen',
        'Slim Leren',
        'Omgaan met toetsen en stress',
        'Alle antwoorden zijn juist'
      ],
      goed_index: 3,
      tijdslimiet_seconden: 20
    },
    {
      type: 'multiple_choice',
      vraag: 'Hoe heet de leerkracht die verantwoordelijk is voor jouw klas?',
      opties: ['Decaan', 'Tutor', 'Mentor', 'Rector'],
      goed_index: 2,
      tijdslimiet_seconden: 15
    },
    {
      type: 'multiple_choice',
      vraag: "Hoeveel 'Slim Leren' tips heb je van Jay gekregen?",
      opties: ['3', '4', '5', '6 of 7'],
      goed_index: 2,
      tijdslimiet_seconden: 15
    },
    {
      type: 'multiple_choice',
      vraag: 'Wat is GEEN tip om slimmer te leren?',
      opties: [
        'Vakken afwisselen',
        'Op verschillende momenten oefenen',
        'Alles vlak voor de toets leren',
        'Jezelf vragen stellen'
      ],
      goed_index: 2,
      tijdslimiet_seconden: 20
    },
    {
      type: 'true_false',
      vraag: 'Af en toe lange pauzes nemen is één van de tips die Jay heeft gegeven.',
      opties: ['Waar', 'Niet waar — korte pauzes (5–10 min) zijn de tip, niet lange!'],
      goed_index: 1,
      tijdslimiet_seconden: 15
    },
    {
      type: 'multiple_choice',
      vraag: 'Hoeveel middelbare scholieren zijn er op dit moment in Nederland?',
      opties: ['500.000', '1 miljoen', '3 miljoen', '5 miljoen'],
      goed_index: 1,
      tijdslimiet_seconden: 20
    }
  ]
};
