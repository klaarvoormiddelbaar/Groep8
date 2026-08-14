# Spaans leren

## Concept

Een interactieve woordjesleeromgeving voor de Spaanse woordenlijst uit
`Spaans_1000_woorden_A2_B1_Zuid_Amerika.xlsx` (1000 woorden, 50 categorieën
van 20 woorden). Werking vergelijkbaar met StudyGo: simpel, snel, en
volledig gericht op actief ophalen — de gebruiker typt zelf het antwoord,
geen multiple choice.

**Taal:** Nederlands (interface), Spaans (te leren taal)
**Route:** `/spaans` → `Spaans/index.html`

## Doel

Persoonlijk leerdoel: van A2/B1 naar praktisch spreekniveau richting
Zuid-Amerika. Geen klassikale/live-sessie-functionaliteit nodig (geen
docent/leerling-rollen, geen Supabase) — dit is een individueel hulpmiddel.

## Databron

`Spaans/data.js` is gegenereerd uit het Excel-bestand (blad "1000 woorden")
via een eenmalig Python-script. Categorieën worden dynamisch uit deze data
opgebouwd — niet handmatig in de frontend.

Elk woord heeft minimaal:
```js
{ id, category, spanish, dutch, acceptedAnswers: [...] }
```
`acceptedAnswers` ondersteunt meerdere geaccepteerde varianten, maar wordt
alleen gevuld met wat expliciet in de brondata staat (geen automatisch
gegenereerde synoniemen).

## Bestandsstructuur

| Bestand | Rol |
|---|---|
| `data.js` | De volledige woordenlijst (gegenereerd, niet handmatig bewerken — pas het Excel-bestand aan en genereer opnieuw) |
| `matching.js` | Antwoord-classificatie (`correct` / `minor` / `wrong`), los van de UI, puur en testbaar |
| `storage.js` | Voortgang per woord in `localStorage`, categorie-voortgang, "foute woorden"-box |
| `category-overview.js` | CategoryOverview-component: categorieën, voortgang, richtingkeuze, mix-optie |
| `word-list.js` | WoordLijst-component: toont alle woorden van een categorie vóór het oefenen |
| `study-session.js` | StudySession-component: herhaalqueue, WordCard/AnswerInput/AnswerFeedback/ProgressBar |
| `session-results.js` | SessionResults-component: eindscherm na een afgeronde sessie |
| `app.js` | Kleine router die de vier views aan elkaar knoopt (overzicht → woordenlijst → oefensessie → resultaat) |
| `style.css` | Styling, gebaseerd op de KvM8 StyleGuide-tokens |

## Herhaalalgoritme

- Fout beantwoord → terug de wachtrij in, 3–7 andere woorden eerst.
- Kleine spelfout of correct → telt als "beheerst" voor déze sessie, komt niet terug.
- Sessie is klaar zodra alle woorden minstens één keer correct (of met
  kleine spelfout) zijn beantwoord.

## "Mijn foute woorden" (blijvend, niet sessiegebonden)

Elk woord dat ooit **echt fout** wordt beantwoord krijgt `inMistakesBox: true`
in `localStorage` en verschijnt als aparte, dynamische categorie boven het
gewone overzicht. Pas na **3x achter elkaar correct** (over eender welke
sessie heen, ook op een andere dag) verdwijnt het woord weer uit die box.
Dit wordt bijgehouden in `storage.js` (`verwerkResultaat`), volledig los van
de sessie-state in `study-session.js`.

## Bekende beperkingen / vervolgstappen

- Voortgang staat in `localStorage` — per apparaat/browser, niet gesynchroniseerd
  tussen apparaten. Zodra dat gewenst is, kan `storage.js` vervangen worden
  door een Supabase-backend zonder de rest van de app aan te passen (de
  opslag-API is bewust smal en modulair gehouden).
- Geen spaced-repetition-planning (wanneer een woord weer moet terugkomen op
  een andere dag) — alleen de "3x goed = uit de foutenbox"-regel. De per-woord
  statistieken (`timesStudied`, `timesCorrect`, `timesMinor`, `timesWrong`,
  `lastStudied`) liggen al wel klaar om zo'n systeem later op te bouwen.
