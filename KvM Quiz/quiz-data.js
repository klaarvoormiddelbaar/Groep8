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
      vraag: 'Wat is het belangrijkste doel van het Klaar voor Middelbaar-programma?',
      opties: [
        'Zo snel mogelijk hoge cijfers halen',
        'Je rustig voorbereiden op de overstap naar de middelbare school',
        'Een nieuwe hobby kiezen',
        'Extra huiswerk oefenen voor de zomer'
      ],
      goed_index: 1,
      tijdslimiet_seconden: 20
    },
    {
      type: 'true_false',
      vraag: 'Op de middelbare school krijg je meestal les van meerdere docenten in plaats van één meester of juf.',
      opties: ['Waar', 'Niet waar'],
      goed_index: 0,
      tijdslimiet_seconden: 15
    },
    {
      type: 'image',
      vraag: 'Wat neem je het beste mee op je eerste schooldag, zodat je goed voorbereid bent?',
      afbeelding: SCHOOLTAS_ILLUSTRATIE,
      opties: [
        'Een schooltas met agenda en spullen',
        'Alleen je telefoon',
        'Een knuffel van thuis',
        'Niets, dat regelt de docent wel'
      ],
      goed_index: 0,
      tijdslimiet_seconden: 20
    },
    {
      type: 'poll',
      vraag: 'Waar heb jij nu het meeste zin in als je denkt aan de middelbare school?',
      opties: [
        'Nieuwe vakken ontdekken',
        'Nieuwe vrienden maken',
        'Een eigen rooster en kluisje',
        'Zelfstandiger worden'
      ],
      goed_index: null,
      tijdslimiet_seconden: 20
    },
    {
      type: 'multiple_choice',
      vraag: 'Je snapt iets niet tijdens de les op je nieuwe school. Wat doe je het beste?',
      opties: [
        'Het maar gewoon laten zitten',
        'Het opschrijven en het aan de docent vragen',
        'Een beetje boos worden',
        'Doen alsof je het wél snapt'
      ],
      goed_index: 1,
      tijdslimiet_seconden: 20
    }
  ],

  'les-2': [
    {
      type: 'multiple_choice',
      vraag: 'Wat doet een mentor op de middelbare school?',
      opties: [
        'Zorgt dat je op tijd naar school komt',
        'Is jouw vaste begeleider die je helpt bij vragen en problemen',
        'Geeft alleen gymles',
        'Deelt de kluisjes uit'
      ],
      goed_index: 1,
      tijdslimiet_seconden: 20
    },
    {
      type: 'true_false',
      vraag: 'Op de middelbare school krijg je voor elk vak een andere docent.',
      opties: ['Waar', 'Niet waar'],
      goed_index: 0,
      tijdslimiet_seconden: 15
    },
    {
      type: 'multiple_choice',
      vraag: 'Waarvoor gebruik je een kluisje op de middelbare school?',
      opties: [
        'Om je fiets in te bewaren',
        'Om boeken, spullen en je jas op te bergen',
        'Om je mobiel op te laden',
        'Om cadeaus van vrienden in op te slaan'
      ],
      goed_index: 1,
      tijdslimiet_seconden: 20
    },
    {
      type: 'poll',
      vraag: 'Wat lijkt jou het spannendste aan de middelbare school?',
      opties: [
        'Nieuwe docenten leren kennen',
        'De weg vinden op het schoolgebouw',
        'Nieuwe vrienden maken',
        'Jezelf voorstellen in een nieuwe klas'
      ],
      goed_index: null,
      tijdslimiet_seconden: 20
    },
    {
      type: 'multiple_choice',
      vraag: 'Waarvoor gebruik je een rooster op de middelbare school?',
      opties: [
        'Om te weten welk vak je wanneer hebt',
        'Om je pauze mee in te plannen',
        'Om huiswerk op te schrijven',
        'Om je klasgenoten te leren kennen'
      ],
      goed_index: 0,
      tijdslimiet_seconden: 20
    }
  ]
};
