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
      opties: ['Waar', 'Niet waar'],
      goed_index: 1,
      toelichting: 'Korte pauzes (5 tot 10 min) zijn de tip, geen lange pauzes.',
      tijdslimiet_seconden: 15
    },
    {
      type: 'multiple_choice',
      vraag: 'Hoeveel middelbare scholieren zijn er op dit moment in Nederland?',
      opties: ['500.000', '1 miljoen', '3 miljoen', '5 miljoen'],
      goed_index: 1,
      tijdslimiet_seconden: 20
    }
  ],
  'les-3': [
    {
      type: 'multiple_choice',
      vraag: 'Wat is een goed hulpmiddel als je de uitleg in je boek niet begrijpt?',
      opties: [
        'Meteen stoppen met leren',
        'Een uitlegvideo bekijken',
        'Wachten tot de volgende toets',
        'Het gewoon overslaan'
      ],
      goed_index: 1,
      tijdslimiet_seconden: 15
    },
    {
      type: 'multiple_choice',
      vraag: 'Waar ging de uitlegvideo in Missie 1 over?',
      opties: [
        'Rekenen met gelijksoortige termen',
        'Het ontstaan van de Tweede Wereldoorlog',
        'Een taalopdracht',
        'Aardrijkskundige kaarten lezen'
      ],
      goed_index: 0,
      tijdslimiet_seconden: 20
    },
    {
      type: 'true_false',
      vraag: 'Gelijksoortige termen, zoals 18b en 4b, mag je van elkaar aftrekken.',
      opties: ['Waar', 'Niet waar'],
      goed_index: 0,
      toelichting: 'Termen met dezelfde letter zijn gelijksoortig: je trekt de getallen van elkaar af en laat de letter staan.',
      tijdslimiet_seconden: 15
    },
    {
      type: 'multiple_choice',
      vraag: 'Hoe schrijf je 5x − 3y korter op?',
      opties: ['2x', '2y', '2xy', 'Dat kan niet, want x en y zijn verschillende letters'],
      goed_index: 3,
      tijdslimiet_seconden: 20
    },
    {
      type: 'multiple_choice',
      vraag: 'Wat doe je in Missie 2, "Ik wil extra oefenen"?',
      opties: [
        'Je onderzoekt vier oefenwebsites en vergelijkt ze',
        'Je maakt een weekplanning voor thuis',
        'Je bekijkt een film over de middelbare school',
        'Je stelt vragen aan je mentor'
      ],
      goed_index: 0,
      tijdslimiet_seconden: 20
    },
    {
      type: 'multiple_choice',
      vraag: 'Wat is GEEN kenmerk waar je op kunt letten bij een goede oefenwebsite?',
      opties: [
        'Duidelijke uitleg',
        'Direct feedback op je antwoorden',
        'Zo duur mogelijk',
        'Overzichtelijke website'
      ],
      goed_index: 2,
      tijdslimiet_seconden: 20
    },
    {
      type: 'multiple_choice',
      vraag: 'In Missie 3 gebruik je Jay I als jouw...?',
      opties: ['Persoonlijke leercoach', 'Weerbericht', 'Agenda-app', 'Videobewerker'],
      goed_index: 0,
      tijdslimiet_seconden: 15
    },
    {
      type: 'multiple_choice',
      vraag: 'Wat kan Jay I NIET voor je doen?',
      opties: [
        'Een samenvatting maken',
        'Een tijdlijn genereren',
        'Oefenvragen opstellen',
        'Je toets automatisch inleveren'
      ],
      goed_index: 3,
      tijdslimiet_seconden: 15
    }
  ],
  'les-5': [
    {
      type: 'multiple_choice',
      vraag: 'Wat kun je het beste doen als je tijdens een toets het antwoord op een vraag niet weet?',
      opties: [
        'Gelijk gokken wat het antwoord is en er daarna niet meer naar kijken.',
        'Lang bij de vraag blijven totdat je het zeker weet.',
        'Rustig blijven en later terugkomen bij de vraag.',
        'De toets inleveren zonder die vraag in te vullen.'
      ],
      goed_index: 2,
      tijdslimiet_seconden: 20
    },
    {
      type: 'multiple_choice',
      vraag: 'Waarom is terugkijken op een toets belangrijk?',
      opties: [
        'Dat is helemaal niet zo belangrijk.',
        'Dan krijg je bijna altijd een hoger cijfer van je docent.',
        'Dan hoef je nooit meer te leren.',
        'Dan leer je van je fouten.'
      ],
      goed_index: 3,
      tijdslimiet_seconden: 20
    },
    {
      type: 'multiple_choice',
      vraag: 'Een beetje stress...',
      opties: [
        'Is altijd slecht.',
        'Kan soms juist helpen om goed te presteren.',
        'Hebben alleen volwassenen.',
        'Daar kun je niets tegen doen.'
      ],
      goed_index: 1,
      tijdslimiet_seconden: 20
    },
    {
      type: 'multiple_choice',
      vraag: 'Zet de stappen in de juiste volgorde. Wat doe je als eerste wanneer je een toets krijgt? 1) Eerst alle vragen rustig doorlezen. 2) Beginnen met het beantwoorden van de vragen. 3) Je antwoorden controleren. 4) De toets inleveren.',
      opties: [
        '2 → 3 → 1 → 4',
        '2 → 1 → 3 → 4',
        '1 → 2 → 3 → 4',
        '1 → 3 → 2 → 4'
      ],
      goed_index: 2,
      tijdslimiet_seconden: 25
    },
    {
      type: 'multiple_choice',
      vraag: 'Wat helpt NIET tegen stress?',
      opties: [
        'Op tijd beginnen.',
        'Goed slapen.',
        'Alles op het laatste moment doen.',
        'Korte pauzes nemen.'
      ],
      goed_index: 2,
      tijdslimiet_seconden: 20
    },
    {
      type: 'multiple_choice',
      vraag: 'Welke twee gedachten helpen tijdens een toets? Stelling 1: Ik pak één vraag tegelijk aan. Stelling 2: Iedereen haalt vast een hoger cijfer dan ik. Stelling 3: Ik controleer mijn antwoorden als ik tijd over heb. Stelling 4: Dit gaat me gewoon niet lukken.',
      opties: [
        'Stelling 1 en 2',
        'Stelling 1 en 3',
        'Stelling 2 en 4',
        'Stelling 3 en 4'
      ],
      goed_index: 1,
      tijdslimiet_seconden: 25
    },
    {
      type: 'multiple_choice',
      vraag: 'Schattingsvraag: hoeveel toetsweken hebben leerlingen in de bovenbouw gemiddeld per jaar?',
      opties: ['Geen', '3 tot 4', '5 tot 6', '7 tot 8'],
      goed_index: 1,
      tijdslimiet_seconden: 20
    }
  ]
};

// Les 8 heeft voor nu nog geen eigen quizvragen. Begin als kopie van les 1
// (onafhankelijke kopie, dus aanpassingen hier raken les 1 niet), zonder de
// vragen die niet bij les 8 passen.
QUIZZES['les-8'] = JSON.parse(JSON.stringify(QUIZZES['les-1'])).filter(q => ![
  'Wie neemt je elke les mee tijdens de lessen van Klaar voor Middelbaar?',
  "Hoeveel 'Slim Leren' tips heb je van Jay gekregen?",
  'Af en toe lange pauzes nemen is één van de tips die Jay heeft gegeven.',
  'Hoeveel middelbare scholieren zijn er op dit moment in Nederland?'
].includes(q.vraag));

// Vraag 4 en 5 worden voor de overgebleven les-1-vragen (positie 4+) ingevoegd,
// die schuiven daardoor op naar achteren.
QUIZZES['les-8'].splice(3, 0,
  {
    type: 'multiple_choice',
    vraag: 'Wat kun je het beste doen als je een vraag tijdens een toets niet weet?',
    opties: [
      'Gelijk gokken wat het antwoord is en er daarna niet meer naar kijken.',
      'In paniek raken.',
      'De toets inleveren zonder die vraag in te vullen.',
      'Rustig blijven en later terugkomen bij de vraag.'
    ],
    goed_index: 3,
    tijdslimiet_seconden: 20
  },
  {
    type: 'true_false',
    vraag: 'Op elke middelbare school in Nederland spreek je je docent aan met zijn of haar achternaam.',
    opties: ['Waar', 'Niet waar'],
    goed_index: 1,
    tijdslimiet_seconden: 15
  }
);

QUIZZES['les-8'].push(
  {
    type: 'multiple_choice',
    vraag: 'Welke leerling maakt de slimste aantekeningen?',
    opties: [
      'Sam schrijft alles woord voor woord over.',
      'Emma noteert alleen de belangrijkste punten.',
      'Noah schrijft niets op.',
      'Sara maakt alleen tekeningen.'
    ],
    goed_index: 1,
    tijdslimiet_seconden: 20
  },
  {
    type: 'multiple_choice',
    vraag: 'Hoe oud is een gemiddelde docent op de middelbare school?',
    opties: ['35 jaar', '43 jaar', '52 jaar', '67 jaar'],
    goed_index: 1,
    tijdslimiet_seconden: 15
  }
);
