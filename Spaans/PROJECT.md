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

## Werkwoordentrainer (vervoegingen)

Naast de woordjestrainer zit in dezelfde app (via een modus-schakelaar
"📚 Woorden" / "🔤 Werkwoorden" bovenaan) een tweede oefenvorm: vervoegingen
van bekende werkwoorden in vier tijden — **presente**, **futuro**,
**imperfecto**, **indefinido**. Zelfde stijl, zelfde "typ het zelf"-aanpak,
losse databron en losse localStorage-namespace.

| Bestand | Rol |
|---|---|
| `verbs-data.js` | `SPAANS_WERKWOORDEN` (49 werkwoorden, handmatig samengesteld — géén Excel-bron), `SPAANS_PERSONEN`, `SPAANS_TIJDEN`, `SPAANS_WERKWOORDGROEPEN` |
| `verb-storage.js` | Voortgang per item-key `"verbId:tijd:persoonIndex"`, groepvoortgang, "foute vormen"-box, onthouden gekozen tijd |
| `verb-overview.js` | VerbOverview-component: tijdkeuze (presente/futuro/imperfecto/indefinido/gemengd), werkwoordgroepen met voortgang, mix-optie |
| `verb-list.js` | VerbList-component: toont de werkwoorden van de gekozen groep (infinitief + vertaling, vertaling standaard geblurd met een toon/verberg-knop) vóór het oefenen, zelfde functie als `word-list.js` bij de woordjestrainer |
| `verb-session.js` | VerbSession-component: zelfde herhaalqueue-logica als StudySession, maar werkt op resolved items (verb + tijd + persoon al vastgelegd door VerbOverview). De persoonsvorm (yo/tú/...) staat als badge links van het invoerveld. Via een "ℹ️ Alle vervoegingen & tijden"-knop opent een modal met de volledige 4×6-tabel (alle tijden × alle personen) van het huidige werkwoord, met de actieve tijd-kolom, persoon-rij en cel gemarkeerd |
| `verb-results.js` | VerbResults-component: eindscherm, toont infinitief · tijd · persoon → correcte vorm bij gemiste items |

**Werkwoordgroepen:** `ar-regelmatig` (25), `er-regelmatig` (25), `ir-regelmatig`
(25), `onregelmatig` (25 — de belangrijkste onregelmatige/stamveranderende
werkwoorden: ser, estar, ir, tener, hacer, poder, decir, querer, saber,
poner, venir, salir, dar, ver, jugar, pedir, dormir, pensar, volver, empezar,
conocer, seguir, sentir, traer, conducir). Totaal 100 werkwoorden.

**Sessieopbouw:** één sessie = alle werkwoorden uit de gekozen groep × 6
personen. Bij tijd "Gemengd" krijgt elk item een willekeurige tijd
(presente/futuro/imperfecto/indefinido) toegewezen, maar wordt wél altijd
opgeslagen onder zijn eigen tijd-key — zo blijft groepvoortgang per tijd
correct meetbaar, ook als je meestal in "Gemengd" oefent. De "Willekeurige
mix" pakt 25 willekeurige werkwoorden uit alle groepen.

**Herhalen/fouten:** zelfde regels als bij woorden (3–7 andere items eerst
bij een fout antwoord, "foute vormen" verdwijnen pas na 3x achter elkaar
goed) — hergebruikt `Spaans.Matching` voor de correct/minor/wrong-classificatie,
met de overige persoonsvormen van hetzelfde werkwoord als veiligheidsnet
tegen het per ongeluk goedkeuren van een andere, echt bestaande vervoeging.

**Vertaling verbergen + omgekeerde richting:** elk item krijgt bij het
opbouwen van de sessie een vaste `omgekeerd`-vlag (50% kans, blijft
ongewijzigd zolang het item in de sessie zit). Normaal staat de infinitief
groot boven de kaart en de Nederlandse vertaling klein eronder; is
`omgekeerd` waar, dan staat de Nederlandse vertaling groot en moet je zelf
de Spaanse infinitief herkennen. Het kleine woord (welke taal dat ook is)
staat altijd geblurd (`.werkwoordkaart-vertaling`) en wordt pas scherp
zodra je er met de muis overheen gaat — zo test de kaart ook actieve
vertaalkennis, niet alleen de vervoeging.

Om een werkwoord toe te voegen: nieuw object in `SPAANS_WERKWOORDEN` met
`id` (volgend nummer), `infinitive`, `dutch`, `group`
(`ar-regelmatig`/`er-regelmatig`/`ir-regelmatig`/`onregelmatig`) en
`conjugations.{presente,futuro,imperfecto,indefinido}` (elk een array van
6 vormen in de vaste volgorde yo/tú/él-ella-usted/nosotros/vosotros/ellos-ellas-ustedes).

## Bekende beperkingen / vervolgstappen

- Voortgang staat in `localStorage` — per apparaat/browser, niet gesynchroniseerd
  tussen apparaten. Zodra dat gewenst is, kan `storage.js` vervangen worden
  door een Supabase-backend zonder de rest van de app aan te passen (de
  opslag-API is bewust smal en modulair gehouden).
- Geen spaced-repetition-planning (wanneer een woord weer moet terugkomen op
  een andere dag) — alleen de "3x goed = uit de foutenbox"-regel. De per-woord
  statistieken (`timesStudied`, `timesCorrect`, `timesMinor`, `timesWrong`,
  `lastStudied`) liggen al wel klaar om zo'n systeem later op te bouwen.
