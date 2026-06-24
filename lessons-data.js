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
    emoji: 'school.png', title: 'Rustige schoolweek inplannen',
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
    emoji: 'notitieboek.png', title: 'Online hulpmiddelen tijdens het leren',
    sub: 'Handige digitale tools voor op school',
    duur: '60 min',
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
    emoji: 'envelop.png', title: 'Omgaan met toetsen en stress',
    sub: 'Zelfverzekerd naar een toets toewerken',
    duur: '50–60 min',
    url: '/les5',
    tip: 'De digitale les bevat een interactieve drag-and-drop opdracht. Plan vooraf toegang tot tablets of computers voor de hele klas.',
    doelen: [
      'Leerlingen begrijpen het verschil tussen formeel en informeel taalgebruik.',
      'Leerlingen kunnen een formele e-mail of brief schrijven.',
      'Leerlingen weten wanneer welke communicatiestijl gepast is.'
    ],
    tl: [
      { t: '0–10 min',  n: 'Voorbeelden vergelijken', d: 'Vergelijk een informeel appbericht met een formele e-mail aan een docent.' },
      { t: '10–28 min', n: 'Uitleg',                  d: 'Bespreek kenmerken van formeel taalgebruik via de digitale les.' },
      { t: '28–45 min', n: 'Schrijfopdracht',         d: 'Leerlingen herschrijven een informele boodschap als formele e-mail.' },
      { t: '45–55 min', n: 'Peerfeedback',            d: 'Wissel e-mails uit en geef kort feedback op elkaars werk.' }
    ],
    mat: ['Devices voor de digitale les', 'Werkblad e-mailschrijven (bijlage 6)', 'Voorbeeldmails (bijlage 7)']
  },
  {
    n: 6, g1: '#0c4a6e', g2: '#0284c7',
    emoji: 'brein.png', title: 'Drukke schoolweek inplannen',
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
    emoji: 'vraagteken.png', title: 'Schriftelijke vaardigheden',
    sub: 'Aantekeningen maken en mailen naar je docent',
    duur: '50–60 min',
    url: '/les7',
    tip: "Laat groepjes ook eigen scenario's bedenken. Dit verhoogt de betrokkenheid en zorgt voor herkenning.",
    doelen: [
      'Leerlingen oefenen met sociale situaties die ze tegenkomen op de middelbare.',
      'Leerlingen leren om hulp te vragen aan een docent of mentor.',
      'Leerlingen vergroten hun probleemoplossend vermogen.'
    ],
    tl: [
      { t: '0–5 min',   n: 'Introductie',   d: "Introduceer het concept van sociale scenario's en het belang ervan." },
      { t: '5–28 min',  n: 'Scenario-spel', d: 'Kleine groepen spelen scenario-kaarten na en bedenken oplossingen.' },
      { t: '28–45 min', n: 'Nabespreking',  d: 'Bespreek per scenario wat werkte en wat moeilijk was.' },
      { t: '45–55 min', n: 'Afsluiting',    d: 'Elke leerling kiest het scenario dat hij of zij het meest leerzaam vond.' }
    ],
    mat: ["Scenario-kaarten set 2 (bijlage 9)", 'Antwoordbladen', 'Toegang tot digitale les']
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
