/* Enige bron voor alle lesdata — zowel het hoofd-dashboard als de proeflicentie laden dit bestand */
const LESSONS = [
  {
    n: 1, g1: '#1e4a8a', g2: '#72a8f9',
    emoji: 'raket.png', title: 'Klaar voor lancering!',
    sub: 'Kennismaking + Slim Leren',
    duur: '60 min',
    url: '/les1',
    tip: 'Neem iets mee uit je eigen middelbareschooltijd, zoals een agenda, schoolfoto of rapport. Leerlingen vinden het vaak leuk om hiernaar te kijken en het levert mooie gesprekken op.',
    doelen: [
      'De leerlingen weten wat zij kunnen verwachten van de brugklas.',
      'De leerlingen maken kennis met het Klaar voor Middelbaar-programma en weten wat zij de komende lessen gaan leren.',
      "De leerlingen weten dat 'Slim Leren' meer oplevert dan alleen hard werken."
    ],
    tl: [
      { t: '0–5 min',   n: 'Introductie',         d: 'Verwelkom de klas en introduceer het KvM-programma aan de hand van de poster.' },
      { t: '5–20 min',  n: 'Klassengesprek',      d: 'Bespreek wat leerlingen al weten over de middelbare school en wat ze spannend vinden.' },
      { t: '20–40 min', n: 'Kaartjesopdracht',    d: 'Leerlingen vullen "Ik kijk uit naar…" en "Ik ben benieuwd naar…" kaartjes in.' },
      { t: '40–55 min', n: 'Plenaire afsluiting', d: 'Bespreek de kaartjes plenair en maak samen een klassencloud op het bord.' }
    ],
    mat: ['Kaartjes voor elke leerling', 'KvM-poster (bijlage 1)', 'Stiften of potloden']
  },
  {
    n: 2, g1: '#065f46', g2: '#10a37f',
    emoji: 'lijst.png', title: 'Middelbare schoolweek inplannen',
    sub: "Kennismaken met het 'KvM Planning Stappenplan'",
    duur: '50–60 min',
    url: '/les2',
    tip: 'Nodig eventueel een oud-leerling uit om te vertellen over zijn of haar eerste weken. Dit maakt het concreet en herkenbaar voor de groep.',
    doelen: [
      'Leerlingen begrijpen de structuur van de middelbare school.',
      'Leerlingen weten wat er anders is dan op de basisschool.',
      'Leerlingen kennen begrippen als rooster, kluisje en mentor.'
    ],
    tl: [
      { t: '0–5 min',   n: 'Terugblik',          d: 'Korte herhaling van les 1: wat onthielden leerlingen?' },
      { t: '5–20 min',  n: 'Uitleg & video',     d: 'Toon en bespreek hoe een dag op de middelbare eruitziet.' },
      { t: '20–40 min', n: 'Quiz in tweetallen', d: 'Leerlingen beantwoorden vragen over de middelbare in koppels.' },
      { t: '40–55 min', n: 'Vragenronde',        d: 'Plenair: wat willen leerlingen nog meer weten?' }
    ],
    mat: ['Quiz-kaarten (bijlage 2)', 'Smartboard of beamer', 'Optioneel: video over een dag op de middelbare']
  },
  {
    n: 3, g1: '#92400e', g2: '#f59e0b',
    emoji: 'boeken.png', title: 'Hulpmiddelen tijdens het leren',
    sub: 'Handige digitale tools voor op school',
    duur: '50–60 min',
    url: '/les3',
    tip: 'Gebruik de checklist "Wat gaat er mee naar school?" als tastbaar hulpmiddel dat leerlingen ook thuis kunnen ophangen.',
    doelen: [
      'Leerlingen kunnen een agenda correct invullen.',
      'Leerlingen weten hoe ze huiswerk verspreiden over de week.',
      'Leerlingen leren hun schooltas planmatig inpakken.'
    ],
    tl: [
      { t: '0–5 min',   n: 'Instapvraag',         d: 'Hoe plan jij nu jouw werk? Leerlingen delen ervaringen.' },
      { t: '5–20 min',  n: 'Uitleg weekplanning', d: 'Toon een voorbeeld weekplanning voor de middelbare school.' },
      { t: '20–40 min', n: 'Oefening',            d: 'Leerlingen maken een weekplanning op basis van een fictief rooster.' },
      { t: '40–55 min', n: 'Bespreking',          d: 'Deel planningen in de klas en bespreek handige strategieën.' }
    ],
    mat: ['Werkblad weekplanning (bijlage 3)', 'Checklist schooltas (bijlage 4)', 'Voorbeeld rooster']
  },
  {
    n: 4, g1: '#4c1d95', g2: '#7c3aed',
    emoji: 'kinderen.png', title: 'Executieve functies',
    sub: 'Vaardigheden voor school en daarbuiten',
    duur: '60 min',
    url: '/les4',
    tip: 'Sommige leerlingen hebben wat meer tijd nodig om de stellingenlijst eerlijk in te vullen. Geef hen die ruimte. Leerlingen die eerder klaar zijn, kunnen alvast beginnen aan de puzzel achterin het werkboek.',
    doelen: [
      'Leerlingen weten wat executieve functies zijn.',
      'Leerlingen kennen hun sterkste en minst sterke executieve functies.',
      "Leerlingen hebben de executieve functies verbeterd met het spel: 'KvM Sterrenstrijd'."
    ],
    tl: [
      { t: '0–5 min',   n: 'Start en terugblik',                                 d: 'Open de les en blik terug op les 3.' },
      { t: '5–10 min',  n: 'Leerdoelen en kennisclip executieve functies',       d: 'Bespreek de leerdoelen van vandaag en bekijk samen de kennisclip over executieve functies.' },
      { t: '10–20 min', n: 'Stellingenlijst',                                    d: 'Leerlingen vullen een stellingenlijst in en ontdekken zo hun sterkste en minst sterke executieve functies.' },
      { t: '20–25 min', n: 'Uitleg werkblad van KvM Sterrenstrijd + uitleg spel', d: 'Leg het werkblad van KvM Sterrenstrijd uit en geef uitleg over hoe het spel werkt.' },
      { t: '25–50 min', n: "'KvM Sterrenstrijd' spelen",                         d: 'Leerlingen spelen KvM Sterrenstrijd en oefenen daarmee hun executieve functies.' },
      { t: '50–55 min', n: 'Het spel opruimen',                                  d: 'Ruim samen het spelmateriaal op.' },
      { t: '55–60 min', n: 'Bespreken KvM Sterrenstrijd werkblad + vooruitblikken', d: 'Bespreek het werkblad en blik vooruit naar de volgende les.' },
      { t: '60+ min',   n: 'Uitloop',                                              d: 'Als de leerlingen na een half uur nog vol enthousiasme aan het spelen zijn, kan het spel natuurlijk langer worden gespeeld en loopt de les iets uit.' }
    ],
    mat: ["Scenario-kaarten set 1 (bijlage 5)", 'Reflectiekaartjes', 'Optioneel: video over sociale situaties']
  },
  {
    n: 5, g1: '#7f1d1d', g2: '#e05545',
    emoji: 'rugzak.png', title: 'Omgaan met toetsen en stress',
    sub: 'Zelfverzekerd naar een toets toewerken',
    duur: '50–60 min',
    url: '/les5',
    tip: 'Benadruk dat de antwoorden bij KlasKompas volledig anoniem zijn. Moedig leerlingen aan om eerlijk antwoord te geven en hun zorgen of ervaringen rondom stress te delen. Dit levert vaak waardevolle gesprekken en herkenning in de klas op.',
    doelen: [
      'De leerlingen weten hoe zij zich goed kunnen voorbereiden op een toets, hoe zij een toets slim maken en hoe zij na afloop op een toets kunnen reflecteren.',
      'De leerlingen weten hoe zij op een gezonde manier met stress kunnen omgaan.',
      'De leerlingen gaan met elkaar in gesprek over stress en wisselen ervaringen en tips met elkaar uit.'
    ],
    tl: [
      { t: '0–2 min',   n: 'Start, terugblik en leerdoelen', d: 'Open de les, blik kort terug op les 4 en bespreek de leerdoelen van vandaag.' },
      { t: '2–10 min',  n: 'Woordwolk over toetsen',         d: 'Open de woordwolk in het docentenportaal. De leerlingen benoemen tips voor het voorbereiden, maken en terugkijken op een toets. Bespreek de resultaten vervolgens klassikaal.' },
      { t: '10–15 min', n: 'Bespreek de tips uit de presentatie', d: 'Bespreek kort de tips uit de presentatie die nog niet in de woordwolk zijn genoemd.' },
      { t: '15–25 min', n: 'KvM Toets maken',                d: 'Laat de leerlingen de KvM Toets maken. Bekijk als leerkracht vooraf de volledige toets goed door, met extra aandacht voor pagina 2.' },
      { t: '25–35 min', n: 'KlasKompas',                     d: 'Open KlasKompas in het docentenportaal. Leerlingen beantwoorden anoniem stellingen over stress en voorspellen hoe de klas zal antwoorden. De resultaten vormen de basis voor open klassengesprekken over stress en hoe je hiermee om kunt gaan.' },
      { t: '35–45 min', n: 'Quiz',                           d: 'Open de quiz in het docentenportaal en speel deze klassikaal.' },
      { t: '45–50 min', n: 'Afsluiting & vooruitblik',       d: 'Vat de belangrijkste inzichten van de les samen, blik kort vooruit op de volgende les en geef ruimte voor vragen of een korte uitloop.' }
    ],
    mat: ['Devices voor KlasKompas', 'Digibord om de sessie klassikaal te volgen']
  },
  {
    n: 6, g1: '#0c4a6e', g2: '#0284c7',
    emoji: 'notitieboek-groen.png', title: 'Drukke schoolweek inplannen',
    sub: "Een volle week inplannen met het 'KvM Planning Stappenplan'",
    duur: '50–60 min',
    url: '/les6',
    tip: 'Wees alert op leerlingen die significant angstig lijken. Spreek ze na de les apart aan en overleg zo nodig met de intern begeleider.',
    doelen: [
      'Leerlingen kunnen hun gevoelens over de overstap benoemen.',
      'Leerlingen kennen technieken om met spanning om te gaan.',
      'Leerlingen versterken hun zelfvertrouwen via positieve zelfreflectie.'
    ],
    tl: [
      { t: '0–10 min',  n: 'Check-in',           d: 'Thermometer-check: hoe voel jij je over de middelbare? Schaal 1-10.' },
      { t: '10–28 min', n: 'Gesprek',             d: 'Bespreek gevoelens van spanning en opwinding. Wat is het verschil?' },
      { t: '28–45 min', n: 'Kracht-kaarten',      d: 'Leerlingen schrijven 3 eigen kwaliteiten op en delen ze met de klas.' },
      { t: '45–55 min', n: 'Ademhalingsoefening', d: 'Oefen samen een korte ademhalingstechniek voor stressvolle momenten.' }
    ],
    mat: ['Kracht-kaarten (bijlage 8)', 'Thermometer-poster', 'QR-code naar ademhalingsvideo']
  },
  {
    n: 7, g1: '#831843', g2: '#db2777',
    emoji: 'vulpen.png', title: 'Schriftelijke vaardigheden',
    sub: 'Mailen naar je leerkracht en aantekeningen maken',
    duur: '50–60 min',
    url: '/les7',
    tip: 'Sta tijdens de tussenbespreking van de PlanetenPresentatie uitgebreid stil bij de tips voor aantekeningen maken, zodat leerlingen deze direct kunnen toepassen in het tweede deel van de presentatie.',
    doelen: [
      'Leerlingen begrijpen het verschil tussen informeel en formeel taalgebruik.',
      'Leerlingen kunnen een formele e-mail schrijven aan hun leerkracht.',
      'Leerlingen kunnen op een overzichtelijke manier aantekeningen maken tijdens de les.'
    ],
    tl: [
      { t: '0–10 min',  n: 'Introductie',            d: 'Bespreek waarom slim aantekeningen maken en een nette mail schrijven straks op de middelbare school belangrijk wordt.' },
      { t: '10–25 min', n: 'Aantekeningen maken',     d: 'Oefen samen met een voorbeeldtekst hoe je kort en overzichtelijk aantekeningen maakt.' },
      { t: '25–45 min', n: 'Opdracht formele mail',   d: 'Leerlingen herschrijven een informeel appje naar een formele e-mail met de digitale opdracht.' },
      { t: '45–55 min', n: 'Nabespreking',            d: 'Bespreek een paar ingeleverde mails klassikaal en wat een mail formeel maakt.' }
    ],
    mat: ['Devices voor de digitale opdracht', 'Werkblad aantekeningen maken (optioneel)', 'Toegang tot digitale les']
  },
  {
    n: 8, g1: '#134e4a', g2: '#0f766e',
    emoji: 'trofee.png', title: 'Klaar voor de start!',
    sub: 'Afsluiten, evalueren en certificaat in ontvangst nemen',
    duur: '60 min',
    url: '/les8',
    tip: 'Zijn er nog vijf minuten over tijdens het bordspel? Laat het team op plek 1 naar vakje 46 gaan en het team op plek 2 naar vakje 43, zodat het spel altijd kan worden afgerond.',
    doelen: [
      'De leerlingen testen alles wat ze hebben geleerd nog één keer met het KvM Bordspel.',
      'De leerlingen hebben tips en tops gegeven over het programma.',
      'De leerlingen ontvangen hun certificaat, zetten hun handtekening en zijn dan helemaal Klaar voor Middelbaar!'
    ],
    tl: [
      { t: '0–5 min',   n: 'Start, terugblik en leerdoelen',             d: 'Blik terug op les 7 en bespreek de leerdoelen van vandaag.' },
      { t: '5–10 min',  n: 'Uitleg KvM Bordspel',                        d: 'Leg de spelregels van het KvM Bordspel uit en verdeel de klas in groepjes van 4.' },
      { t: '10–40 min', n: 'Spelen KvM Bordspel + opruimen',             d: 'Leerlingen spelen het bordspel in hun groepjes en ruimen aan het einde samen op.' },
      { t: '40–50 min', n: 'Evaluatie',                                  d: 'Leerlingen vullen de Tips en Tops enquête in via de link van de leerkracht. Daarna worden de resultaten samen in de klas besproken.' },
      { t: '50–60 min', n: 'Uitdelen samenvattingen en certificaten',    d: 'Deel de samenvattingen en KvM-certificaten uit en sluit het programma feestelijk af.' },
      { t: '60+ min',   n: 'Uitloop',                                   d: 'Als de leerlingen na een half uur nog vol enthousiasme aan het spelen zijn, kan het spel natuurlijk langer worden gespeeld en loopt de les iets uit.' }
    ],
    mat: ['KvM Bordspel', 'KvM-certificaten (bijlage 10)', 'Samenvattingen voor leerlingen', 'Optioneel: diploma-muziek en slingers']
  }
];
