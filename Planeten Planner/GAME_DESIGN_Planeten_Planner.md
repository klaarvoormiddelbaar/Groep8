# Rocket Planner – Game Design Document

## 1. Concept

**Rocket Planner** is een korte, snelle arcadegame waarin leerlingen ongemerkt oefenen met het verdelen van schooltaken over een week.

De speler bestuurt een raket, vangt schooltaken, ontwijkt meteorieten en plant gevangen taken in op maandag tot en met vrijdag. Kleine taken nemen één taakplek in. Grote taken, zoals leren voor een toets, nemen twee taakplekken in.

Elk level staat voor één schoolweek. Zodra alle vijftien taakplekken van die week zijn gevuld, wordt het level afgerond en krijgt de speler een duidelijk weekoverzicht te zien.

---

## 2. Doel van het spel

De speler probeert:

- zoveel mogelijk schooltaken te vangen;
- meteorieten te ontwijken;
- taken slim over maandag tot en met vrijdag te verdelen;
- alle vijftien taakplekken van de week te vullen;
- zoveel mogelijk levels te voltooien;
- een zo hoog mogelijke score te behalen;
- drie levens zo lang mogelijk te behouden.

---

## 3. Doelgroep

- Leerlingen uit groep 8
- Geschikt als korte wachtactiviteit
- Speelduur: ongeveer 2 tot 5 minuten
- Moet zonder lange uitleg te begrijpen zijn
- Moet soepel werken op Chromebooks, Windows-laptops en MacBooks

---

## 4. Besturing

### Bewegen

De speler beweegt de raket horizontaal met:

- `Pijl links` of `A`
- `Pijl rechts` of `D`

De raket kan niet buiten het speelveld bewegen.

### Taken droppen

De speler plant de eerstvolgende taak uit de laadruimte in met:

- `1` = maandag
- `2` = dinsdag
- `3` = woensdag
- `4` = donderdag
- `5` = vrijdag

De cijfers 1 tot en met 5 moeten altijd duidelijk zichtbaar bij de dagen staan.

---

## 5. Speelveld

Op het speelveld vallen objecten van boven naar beneden.

Mogelijke objecten:

- kleine schooltaken;
- grote schooltaken;
- meteorieten;
- power-ups.

De raket bevindt zich onderaan het speelveld en kan alleen horizontaal bewegen.

Rechts of onder het speelveld staat de weekplanning met maandag tot en met vrijdag.

---

## 6. Schooltaken

### Kleine taak

Een kleine taak neemt **1 taakplek** in.

Voorbeelden:

- Engels
- Lezen
- Geschiedenis
- Biologie
- Wiskunde
- Huiswerk
- Woordjes leren

### Grote taak

Een grote taak neemt **2 taakplekken** in.

Voorbeelden:

- Leren voor een toets
- Presentatie voorbereiden
- Groot project
- Werkstuk maken

De grote taak moet visueel duidelijk groter of zwaarder ogen dan een kleine taak.

---

## 7. Laadruimte van de raket

De raket heeft standaard ruimte voor **5 taakplekken**.

Mogelijke combinaties zijn bijvoorbeeld:

- vijf kleine taken;
- drie kleine taken en één grote taak;
- twee grote taken en één kleine taak.

Een grote taak telt voor twee plekken.

Wanneer de laadruimte vol is, kan de speler geen nieuwe taak meer vangen totdat een taak is ingepland.

### Volgorde van droppen

De laadruimte werkt als een wachtrij:

- de oudste gevangen taak staat vooraan;
- de oudste taak wordt als eerste ingepland;
- de eerstvolgende taak moet visueel duidelijk herkenbaar zijn;
- de speler kiest alleen de dag, niet welke taak wordt gedropt.

Dit voorkomt extra bediening en houdt het spel snel en eenvoudig.

---

## 8. Weekplanning

Elke dag heeft maximaal **3 taakplekken**.

De week bestaat uit:

- maandag: 3 taakplekken;
- dinsdag: 3 taakplekken;
- woensdag: 3 taakplekken;
- donderdag: 3 taakplekken;
- vrijdag: 3 taakplekken.

In totaal heeft een week **15 taakplekken**.

### Plaatsing van taken

Een kleine taak vult één taakplek.

Een grote taak vult twee taakplekken.

Een grote taak kan alleen op een dag worden geplaatst wanneer daar minimaal twee vrije taakplekken zijn.

Wanneer een taak niet op de gekozen dag past:

- blijft de taak in de laadruimte;
- verschijnt duidelijke feedback;
- schudt of knippert de gekozen dag kort;
- hoort de speler eventueel een kort foutgeluid;
- verliest de speler geen leven.

### Visuele weergave

De weekplanning moet niet alleen lege vakjes tonen, maar ook de taaknamen.

Voorbeeld:

```text
Maandag
- Engels
- Lezen
- Wiskunde

Dinsdag
- Leren voor toets (2 plekken)
- Geschiedenis
```

Grote taken moeten visueel als één kaart worden weergegeven, maar wel twee taakplekken vullen.

---

## 9. Levens

De speler begint met **3 levens**.

Het maximum blijft altijd **3 levens**.

De speler verliest één leven wanneer:

- een schooltaak onderaan uit beeld valt;
- de raket een meteoriet raakt.

Bij nul levens eindigt het spel.

### Belangrijke regel

Eén botsing of één gemiste taak mag nooit meerdere levens tegelijk kosten.

---

## 10. Meteorieten

Meteorieten vallen tussen de taken naar beneden.

Wanneer een meteoriet de raket raakt:

- verliest de speler één leven;
- verdwijnt de meteoriet direct;
- speelt een korte botsingsanimatie;
- knippert de raket kort;
- ontstaat tijdelijke onkwetsbaarheid.

Meteorieten moeten visueel duidelijk verschillen van taken en power-ups.

---

## 11. Tijdelijke onkwetsbaarheid

Na schade wordt de speler tijdelijk onkwetsbaar.

### Duur

Aanbevolen duur:

- **1,25 seconde**

### Tijdens onkwetsbaarheid

- kan de speler geen extra leven verliezen door meteorieten;
- blijft de speler wel bestuurbaar;
- kan de speler nog steeds taken vangen;
- kan de speler nog steeds power-ups vangen;
- kan een gemiste taak nog steeds een leven kosten.

De onkwetsbaarheid geldt dus alleen voor botsingen met meteorieten.

### Visuele feedback

Tijdens onkwetsbaarheid:

- knippert de raket;
- of wordt de raket kort half transparant;
- of verschijnt een subtiele beschermingsring.

De speler moet direct zien dat er tijdelijk geen nieuwe botsingsschade mogelijk is.

### Technische aandachtspunten

- Een meteoriet die schade veroorzaakt, wordt meteen verwijderd.
- Botsingsdetectie met meteorieten wordt tijdelijk genegeerd.
- De timer mag niet per ongeluk meerdere keren tegelijk starten.
- Nieuwe schade na afloop van de timer moet weer normaal werken.
- Een actief ruimteschild wordt eerst gebruikt voordat een leven verloren gaat.
- Wanneer een schild schade opvangt, hoeft geen onkwetsbaarheid te starten, tenzij dit tijdens testen beter voelt.

---

## 12. Gemiste taken

Wanneer een taak onderaan het scherm verdwijnt zonder te zijn gevangen:

- verliest de speler één leven;
- verdwijnt de taak;
- verschijnt korte feedback, bijvoorbeeld `Taak gemist!`;
- speelt een kort foutgeluid.

Een gemiste taak mag precies één leven kosten.

Power-ups en meteorieten die uit beeld verdwijnen kosten geen leven.

---

## 13. Levels

Elk level staat voor één schoolweek.

Een level is voltooid zodra alle **15 taakplekken** zijn gevuld.

### Levelopbouw

Elke mechanic wordt één voor één vrijgespeeld, zodat spelers rustig kunnen wennen:

| Level | Kleine taken | Grote taken | Meteorieten | Power-ups |
|---|---|---|---|---|
| 1 | ✔ | — | — | — |
| 2 | ✔ | ✔ | — | — |
| 3 | ✔ | ✔ | ✔ | — |
| 4 | ✔ | ✔ | ✔ | ✔ |
| 5+ | ✔ | ✔ | ✔ | ✔ |

Vanaf level 5 zijn alle mechanics beschikbaar; vanaf daar wordt alleen nog de moeilijkheid opgevoerd.

### Moeilijkheid

Level 1 t/m 4 zijn qua snelheid/tempo **exact gelijk** — alleen welke mechanics
actief zijn verandert. Pas vanaf level 5 loopt de moeilijkheid op, via één
gedeelde vermenigvuldigingsfactor (+0,1 per level):

| Level | Factor |
|---|---|
| 1–4 | 1.0 |
| 5 | 1.1 |
| 6 | 1.2 |
| 7 | 1.3 |
| ... | ... |

Deze factor schaalt gelijktijdig: valsnelheid van taken/meteorieten, spawntempo,
de kans op grote taken (met een plafond) en hoe vaak meteorieten verschijnen.
De kans op power-ups daalt met deze factor mee, maar veel lichter gedempt (de
power-ups blijven relatief ruim beschikbaar).

### Spawnafstand tussen taken

Om te voorkomen dat spelers in de eerste levels constant van links naar rechts
moeten vliegen, mag een nieuwe taak maximaal een bepaald percentage van de
speelbreedte van de vorige taak vandaan spawnen:

| Level | Max. afstand (% speelbreedte) |
|---|---|
| 1–4 | 66% |
| 5 | 72% |
| 6 | 78% |
| 7 | 84% |
| 8+ | 100% (geen beperking) |

### Eerlijke spawns

Een taak mag nooit onmogelijk te pakken zijn door pech in de meteoriet-spawns:

- rond elke vallende taak bestaat een 'veilige zone' waarin geen meteoriet mag
  verschijnen;
- als een meteoriet toch (bijna) tegelijk naast een taak terechtkomt, duwt de
  meteoriet zichzelf opzij totdat het conflict voorbij is.

De speler mag een taak missen door een eigen fout (verkeerde keuze, te langzaam,
slecht gepland) — nooit doordat het spel een oneerlijke situatie veroorzaakt.

### Bij de start van een nieuw level

Levelvoltooiing = volledig nieuwe week. Zodra een level voltooid is:

- alle taken die nog in de lucht hangen worden direct verwijderd;
- alle meteorieten worden verwijderd;
- alle power-ups worden verwijderd;
- spawn-timers en spawnvolgorde beginnen weer bij nul;
- de weekplanning wordt geleegd;
- de laadruimte wordt geleegd;
- tijdelijke power-ups (magneet, tijdvertrager) worden beëindigd;
- level-power-ups (extra laadruimte, dubbele score) worden gereset;
- levens, score en behaalde voortgang blijven behouden;
- het levelnummer stijgt en de moeilijkheid wordt aangepast.

Er worden geen objecten uit het vorige level meegenomen naar het nieuwe level.

---

## 14. Weekoverzicht na ieder level

Na ieder voltooid level stopt de actie tijdelijk en verschijnt een duidelijk overzicht van de gemaakte planning.

### Inhoud van het overzicht

Het overzicht toont per dag:

- de naam van de dag;
- alle ingeplande taken;
- welke taak groot was;
- hoeveel van de drie taakplekken zijn gebruikt;
- eventueel het totaal aantal taken;
- de behaalde score van dat level;
- eventuele bonus door dubbele score.

### Voorbeeld

```text
WEEK 3 VOLTOOID

Maandag
- Engels
- Wiskunde
- Lezen

Dinsdag
- Leren voor toets (2 plekken)
- Geschiedenis

Woensdag
- Biologie
- Huiswerk
- Woordjes leren

Donderdag
- Presentatie voorbereiden (2 plekken)
- Engels

Vrijdag
- Wiskunde
- Lezen
- Geschiedenis
```

### Visuele eisen

- Gebruik vijf duidelijke dagkaarten of dagkolommen.
- Toon de taken in dezelfde volgorde waarin ze zijn ingepland.
- Grote taken moeten twee gekoppelde taakplekken innemen.
- Maak het overzicht rustig en goed leesbaar.
- Laat de planning ongeveer 4 tot 6 seconden automatisch zien.
- Voeg ook een knop toe: `Volgende week`.
- Eventueel kan een korte countdown starten wanneer de speler niet klikt.

### Doel van dit scherm

Dit scherm is belangrijk omdat leerlingen dan letterlijk terugzien hoe zij de week hebben gevuld.

Het moet voelen als een beloning en als een afgeronde planning, niet als een foutenanalyse.

---

## 15. Score

De speler verdient punten voor:

- het vangen van een taak;
- het succesvol inplannen van een taak;
- het voltooien van een level;
- eventueel een bonus voor resterende levens.

Aanbevolen basis:

- kleine taak vangen: 10 punten;
- grote taak vangen: 20 punten;
- kleine taak inplannen: 15 punten;
- grote taak inplannen: 30 punten;
- level voltooien: 250 punten;
- bonus per overgebleven leven: 50 punten.

De exacte waarden moeten centraal instelbaar zijn.

---

## 16. Power-ups

Er zijn precies zes power-ups.

### 16.1 Ruimteschild

Effect:

- beschermt tegen één meteoriet;
- verdwijnt na één botsing;
- voorkomt verlies van een leven;
- is zichtbaar als schild rond de raket.

Wanneer een schild actief is en de raket raakt een meteoriet:

- wordt het schild verbruikt;
- verdwijnt de meteoriet;
- verliest de speler geen leven;
- speelt een aparte schildanimatie.

### 16.2 Extra laadruimte

Effect:

- vergroot de laadruimte van 5 naar 6 taakplekken;
- geldt voor de rest van het huidige level;
- verdwijnt bij het volgende level.

### 16.3 Magneet

Effect:

- duurt 10 seconden;
- trekt taken die dichtbij komen naar de raket;
- trekt geen meteorieten aan;
- trekt ook geen power-ups aan, tenzij later bewust anders gekozen wordt.

### 16.4 Tijdvertrager

Effect:

- duurt 8 seconden;
- taken en meteorieten bewegen 30% langzamer;
- objecten die tijdens het effect verschijnen vallen ook langzamer;
- na afloop keren alle objecten terug naar hun normale snelheid.

### 16.5 Extra leven

Effect:

- geeft één extra leven;
- maximaal 3 levens;
- bij 3 levens krijgt de speler geen vierde leven.

Wanneer de speler al 3 levens heeft:

- mag de power-up wel worden gevangen;
- verschijnt bijvoorbeeld `Levens al vol`;
- kan eventueel een kleine scorebonus worden gegeven;
- het aantal levens blijft 3.

### 16.6 Dubbele score

Effect:

- geldt voor het hele huidige level;
- alle punten in dat level worden verdubbeld;
- stopt bij het volgende level;
- moet duidelijk zichtbaar actief zijn.

---

## 17. Actieve power-ups in de interface

Actieve effecten moeten duidelijk zichtbaar zijn.

Voorbeelden:

- schildicoon bij de levens;
- `Laadruimte: 6/6`;
- magneet met aflopende timer;
- tijdvertrager met aflopende timer;
- `x2 score` als badge;
- extra leven direct verwerkt in de levensweergave.

Tijdelijke power-ups moeten een visuele timer of aflopende balk hebben.

---

## 18. Game-over

Het spel eindigt wanneer de speler nul levens heeft.

Het game-overscherm toont:

- eindscore;
- hoogste behaalde level;
- aantal ingeplande taken;
- aantal voltooide weken;
- knop `Opnieuw spelen`.

Optioneel:

- beste score van deze sessie;
- korte motiverende tekst.

---

## 19. Startscherm

Het startscherm toont:

- titel van het spel;
- knop `Start`;
- zeer korte uitleg.

Aanbevolen uitleg:

```text
Beweeg met ← en →
Vang taken
Ontwijk meteorieten
Plan met 1 t/m 5
```

Geen lange handleiding vooraf.

### Hints tijdens level 1

Wanneer de speler voor het eerst een taak vangt:

`Druk op 1 t/m 5 om de taak op een dag te plannen.`

Wanneer een grote taak verschijnt:

`Grote taken gebruiken 2 plekken.`

Wanneer een dag vol is:

`Deze dag zit vol. Kies een andere dag.`

---

## 20. Pauzeren

De game moet kunnen pauzeren met:

- `Escape`;
- een pauzeknop in beeld.

De game pauzeert automatisch wanneer:

- het browsertabblad niet actief is;
- het venster de focus verliest.

Tijdens pauze:

- stoppen alle objecten;
- stoppen timers;
- stopt de spawnlogica;
- blijft de huidige status bewaard.

---

## 21. Geluid

Aanbevolen geluidseffecten:

- taak gevangen;
- taak ingepland;
- grote taak ingepland;
- meteoriet geraakt;
- schild geactiveerd;
- leven verloren;
- power-up gevangen;
- dag vol;
- level voltooid;
- game-over.

Er moet altijd een duidelijke knop zijn voor geluid aan of uit.

---

## 22. Gamegevoel en feedback

### Bij een gevangen taak

- korte vanganimatie;
- taak vliegt naar de laadruimte;
- klein geluid;
- korte puntenmelding.

### Bij het inplannen

- taak vliegt naar de gekozen dag;
- dagvak vult;
- taaknaam verschijnt;
- korte bevestigingsanimatie.

### Bij een volle dag

- dag schudt kort;
- korte foutmelding;
- taak blijft in de laadruimte.

### Bij schade

- scherm flitst subtiel;
- raket knippert;
- leven verdwijnt;
- onkwetsbaarheid start.

### Bij level voltooid

- gameplay stopt;
- korte feestelijke animatie;
- weekoverzicht verschijnt;
- score van het level wordt getoond.

---

## 23. Technische architectuur

Aanbevolen techniek:

- HTML
- CSS
- JavaScript
- Canvas
- `requestAnimationFrame`

Aanbevolen bestandenstructuur:

```text
rocket-planner/
├── index.html
├── GAME_DESIGN.md
├── PROJECT.md
├── STYLEGUIDE.md
├── css/
│   └── game.css
├── js/
│   ├── game.js
│   ├── config.js
│   ├── player.js
│   ├── objects.js
│   ├── collision.js
│   ├── cargo.js
│   ├── planner.js
│   ├── levels.js
│   ├── powerups.js
│   ├── score.js
│   ├── screens.js
│   ├── audio.js
│   └── ui.js
└── assets/
    ├── images/
    ├── sounds/
    └── fonts/
```

Houd de logica opgesplitst. Zet niet de hele game in één groot JavaScript-bestand.

---

## 24. Centrale configuratie

Alle instelbare waarden moeten in `config.js` staan.

Voorbeeld:

```js
export const GAME_CONFIG = {
  startingLives: 3,
  maximumLives: 3,

  cargoCapacity: 5,
  extraCargoCapacity: 6,

  numberOfDays: 5,
  slotsPerDay: 3,
  totalWeekSlots: 15,

  smallTaskSize: 1,
  largeTaskSize: 2,

  invulnerabilityDuration: 1250,
  magnetDuration: 10000,
  slowMotionDuration: 8000,
  slowMotionMultiplier: 0.7,

  startingFallSpeed: 120,
  speedIncreasePerLevel: 12,

  startingSpawnInterval: 1500,
  minimumSpawnInterval: 500,

  levelSummaryAutoContinueDelay: 6000
};
```

---

## 25. Belangrijke technische regels

- Gebruik `requestAnimationFrame`.
- Gebruik delta time voor beweging en timers.
- Verwijder objecten zodra ze uit beeld zijn.
- Een object mag maar één keer verwerkt worden.
- Een botsing mag maar één keer schade veroorzaken.
- Blokkeer browser-scroll bij pijltjestoetsen tijdens het spelen.
- Stop timers volledig tijdens pauze.
- Houd spelstatus en visuele weergave gescheiden.
- Zorg dat levelwissels niet dubbel kunnen starten.
- Zorg dat het weekoverzicht een kopie gebruikt van de voltooide planning voordat de nieuwe week wordt geleegd.
- Zorg dat scoremultipliers niet per ongeluk meerdere keren stapelen.
- Zorg dat tijdelijke effecten correct worden beëindigd bij game-over en levelwissel.
- Zorg dat grote taken nooit gedeeltelijk op een dag worden geplaatst.

---

## 26. Testgevallen

### Taken en laadruimte

- Kleine taak vult precies 1 plek.
- Grote taak vult precies 2 plekken.
- Laadruimte kan niet boven 5 komen.
- Met power-up kan laadruimte niet boven 6 komen.
- Grote taak wordt niet gevangen wanneer er maar 1 plek vrij is.
- De oudste taak wordt als eerste gedropt.

### Weekplanning

- Elke dag heeft maximaal 3 plekken.
- Kleine taak past in 1 vrij vak.
- Grote taak past alleen bij minimaal 2 vrije vakken.
- Een ongeldige plaatsing verandert niets.
- Level eindigt precies bij 15 gevulde taakplekken.

### Levens en schade

- Speler begint met 3 levens.
- Een gemiste taak kost precies 1 leven.
- Een meteoriet kost precies 1 leven.
- Onkwetsbaarheid voorkomt directe vervolgschade door meteorieten.
- Gemiste taken blijven tijdens onkwetsbaarheid wel schade geven.
- Schild wordt eerst verbruikt.
- Levens kunnen nooit boven 3 komen.

### Power-ups

- Schild werkt één keer.
- Extra laadruimte blijft tot einde level.
- Magneet stopt na 10 seconden.
- Tijdvertrager stopt na 8 seconden.
- Dubbele score stopt na einde level.
- Extra leven geeft nooit een vierde leven.

### Leveloverzicht

- Alle maandag-tot-en-met-vrijdagtaken worden juist getoond.
- Taken staan in de juiste volgorde.
- Grote taken vullen visueel twee plekken.
- Score van het level klopt.
- De planning wordt pas na het overzicht geleegd.
- De volgende week start met lege dagen.

---

## 27. Bouwvolgorde voor Claude Code

1. Maak projectstructuur en basis game-loop.
2. Bouw raketbesturing.
3. Voeg vallende kleine taken toe.
4. Voeg grote taken toe.
5. Voeg meteorieten en levens toe.
6. Voeg tijdelijke onkwetsbaarheid toe.
7. Voeg laadruimte en wachtrij toe.
8. Voeg droppen op 1 tot en met 5 toe.
9. Bouw de weekplanning.
10. Voeg levelvoltooiing toe.
11. Bouw het weekoverzicht na elk level.
12. Voeg score toe.
13. Voeg moeilijkheidsopbouw toe.
14. Voeg power-ups één voor één toe.
15. Voeg startscherm, pauze en game-over toe.
16. Voeg animaties en geluid toe.
17. Pas definitieve vormgeving toe.
18. Test op Chromebooks, Windows en Mac.
19. Balanceer snelheid, spawnfrequentie en score.
20. Maak een definitieve stabiele versie.

---

## 28. Ontwerpprincipes

- De game moet binnen enkele seconden te begrijpen zijn.
- De speler moet altijd weten welke taak als volgende wordt ingepland.
- De speler moet altijd zien hoeveel ruimte nog beschikbaar is.
- De weekplanning moet goed leesbaar blijven tijdens het spelen.
- Actie en planning moeten in balans blijven.
- Meteorieten zorgen voor spanning, maar mogen de planning niet overheersen.
- Het weekoverzicht moet als beloning voelen.
- Eerst moet de game goed werken, daarna pas mooi worden gemaakt.
- Houd `STYLEGUIDE.md` en `PROJECT.md` aan.
- Houd alles in het Nederlands en volg de bestaande styleguide.
