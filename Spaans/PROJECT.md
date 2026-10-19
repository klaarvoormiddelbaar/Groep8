# Spaans leren

## Concept

Een interactieve woordjesleeromgeving voor de Spaanse woordenlijst uit
`Spaans_1000_woorden_A2_B1_Zuid_Amerika.xlsx` (1000 woorden, 50 categorieën
van 20 woorden). Werking vergelijkbaar met StudyGo: simpel, snel, en
volledig gericht op actief ophalen — de gebruiker typt zelf het antwoord,
geen multiple choice.

**Taal:** Nederlands (interface), Spaans (te leren taal)
**Route:** `/spaans/` → `Spaans/index.html` (redirect vanaf `/spaans` zonder
slash, zelfde patroon als `/Dashboard` en `/proef`)

**Offline werken:** alle assets in `Spaans/index.html` worden relatief
geladen (`style.css`, `app.js`, ...), niet als absoluut pad. Hierdoor kan
`Spaans/index.html` ook rechtstreeks (dubbelklikken, `file://`) geopend
worden zonder server of internetverbinding — de app heeft toch geen
backend-calls nodig (alle data staat in `data.js`/`verbs-data.js`,
voortgang in `localStorage`). Dit is de reden dat het pad met trailing
slash moet zijn: zonder slash resolven relatieve paden tegen de root van
de site in plaats van tegen de `Spaans`-map.

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
| `data2.js` | Tweede woordenset "Woorden 2" (zie hieronder) — eigen bestand, los van `data.js` |
| `matching.js` | Antwoord-classificatie (`correct` / `minor` / `wrong`), los van de UI, puur en testbaar |
| `storage.js` | Voortgang per woord in `localStorage`, categorie-voortgang, "foute woorden"-box — gedeeld tussen `data.js` en `data2.js` (werkt omdat de id-ranges niet overlappen, zie hieronder) |
| `category-overview.js` | CategoryOverview-component: categorieën, voortgang, richtingkeuze, mix-optie. Titel/subtitel/mix-tekst zijn optioneel overschrijfbaar (4e parameter) zodat hetzelfde component voor beide woordensets werkt |
| `word-list.js` | WoordLijst-component: toont alle woorden van een categorie vóór het oefenen |
| `study-session.js` | StudySession-component: herhaalqueue, WordCard/AnswerInput/AnswerFeedback/ProgressBar. Toont optioneel een voorbeeldzin (zie "Woorden 2") als het woord `exampleNl`/`exampleEs` heeft — anders ongewijzigd gedrag |
| `session-results.js` | SessionResults-component: eindscherm na een afgeronde sessie |
| `app.js` | Router die de drie modi (Woorden / Woorden 2 / Werkwoorden) en hun views aan elkaar knoopt |

## Woorden 2 (vervolgset, B1/B2, met voorbeeldzinnen)

Tweede, onafhankelijke woordenset naast de originele 1000 woorden — eigen
tabblad "📗 Woorden 2" naast "📚 Woorden", bereikbaar via dezelfde
modus-tabs in `app.js`. Gegenereerd uit
`~/Downloads/Spaans_1000_woorden_met_zinnen_in_tabel.xlsx` (blad
"1000 woorden") naar `Spaans/data2.js` (`SPAANS_WOORDEN_2`, 50 categorieën
× 20 woorden, niveau A2–B1/B1–B2, deels herhaling van moeilijke woorden uit
deel 1, deels nieuwe woorden).

**Ids 1001–2000** (bewust disjunct van de 1–1000 van `data.js`) zodat
`storage.js` zonder aanpassing hergebruikt kan worden — voortgang van beide
sets botst niet, al delen ze wel dezelfde globale oefenrichting-instelling.

**Voorbeeldzinnen:** elk woord heeft `exampleNl`/`exampleEs`. In
`study-session.js` staat de Nederlandse zin altijd open onder de kaart; een
duidelijk zichtbare knop ("👁️ Tik om de Spaanse zin te zien", gestippelde
rand) onthult de Spaanse zin pas na een tik/klik — bewust klik-gebaseerd in
plaats van hover (zoals bij de werkwoordkaart), omdat hover niet werkt op
telefoon. Reset bij elke nieuwe kaart.

**Let op bij het Excel-bestand:** de kolom "Geaccepteerd antwoord" bevatte
bij 32 van de 1000 rijen een overduidelijk corrupte waarde (Argentijns/
Latijns-Amerikaans jargon dat niet bij het woord hoort, bijv. "beschrijven"
→ "laburo" i.p.v. "describir"). Die kolom bleek sowieso overal identiek aan
de hoofdkolom "Spaans (antwoord)" op die 32 rijen na, dus `data2.js` gebruikt
uitsluitend de hoofdkolom en negeert "Geaccepteerd antwoord" volledig. Een
deel van de auto-gegenereerde voorbeeldzinnen is grammaticaal wat houterig
(bijv. lidwoord-/geslachtsfouten of een werkwoord zonder lijdend voorwerp in
een sjabloonzin) — niet gecorrigeerd, puur gebruikt zoals aangeleverd.
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
van bekende werkwoorden. Twee soorten oefeningen, allebei per werkwoordgroep
en met een "Gemengd"-optie:

- **Typen (productie):** presente, futuro, imperfecto, indefinido,
  **gebiedende wijs** — je ziet het werkwoord + persoon en typt zelf de
  Spaanse vervoegde vorm.
- **Herkennen (receptie, alleen Spaans → Nederlands):** pretérito perfecto,
  condicional, presente subjuntivo, presente continuo, pretérito
  pluscuamperfecto — je ziet een al-vervoegde Spaanse vorm en typt wat hij
  betekent in het Nederlands. Bewust de andere kant op dan de productie-
  oefeningen: deze 5 tijden zijn lastiger zelf te vervoegen maar minstens zo
  belangrijk om te herkennen bij lezen/luisteren.

Zelfde stijl, zelfde "typ het zelf"-aanpak, losse databron en losse
localStorage-namespace (gedeeld tussen productie- en herken-tijden, want de
item-key bevat de tijd zelf dus botst niets).

| Bestand | Rol |
|---|---|
| `verbs-data.js` | `SPAANS_WERKWOORDEN` (100 werkwoorden, handmatig samengesteld — géén Excel-bron), `SPAANS_PERSONEN`, `SPAANS_TIJDEN` (productie-tijden), `SPAANS_HERKEN_TIJDEN` (herken-tijden), `SPAANS_WERKWOORDGROEPEN` |
| `verb-storage.js` | Voortgang per item-key `"verbId:tijd:persoonIndex"`, groepvoortgang (houdt rekening met de ontbrekende yo-vorm bij `gebiedende_wijs`), "foute vormen"-box, onthouden gekozen tijd (`'gemengd'` en `'herken_gemengd'` zijn losse aggregaten) |
| `verb-overview.js` | VerbOverview-component: twee tijdselectors naast elkaar (productie + herkennen, visueel onderscheiden), werkwoordgroepen met voortgang, mix-optie. `bouwItems`/`bouwHerkenItems` bouwen de twee soorten sessie-items |
| `verb-list.js` | VerbList-component: toont de werkwoorden van de gekozen groep (infinitief + vertaling, vertaling standaard geblurd met een toon/verberg-knop) vóór het oefenen, zelfde functie als `word-list.js` bij de woordjestrainer |
| `verb-session.js` | VerbSession-component: zelfde herhaalqueue-logica als StudySession, maar werkt op resolved items (verb + tijd + persoon al vastgelegd door VerbOverview). Bij `item.mode === 'herkennen'` staat de Spaanse vorm groot, de infinitief als hint klein eronder (niet geblurd), en vraagt het invoerveld om de Nederlandse betekenis — bij de productie-tijden is het andersom. De persoonsvorm (yo/tú/...) staat als badge links van het invoerveld. Via een "ℹ️ Alle vervoegingen & tijden"-knop opent een modal met een volledige 10-koloms tabel (alle productie- én herken-tijden × alle personen) van het huidige werkwoord, met de actieve kolom/rij/cel gemarkeerd en `—` voor de niet-bestaande yo-vorm van de gebiedende wijs |
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
`conjugations.{presente,futuro,imperfecto,indefinido,gebiedende_wijs}` (elk
een array van 6 vormen in de vaste volgorde
yo/tú/él-ella-usted/nosotros/vosotros/ellos-ellas-ustedes — `gebiedende_wijs`
heeft op index 0 (yo) altijd `null`, want die vorm bestaat niet), plus
`herkennen.{perfecto,condicional,subjuntivo,continuo,pluscuamperfecto}`
(Spaanse vormen, 6 elk) en `herkennenNl` (zelfde vorm, Nederlandse vertaling).

**Gebiedende wijs — scope-keuzes:** alleen de **bevestigende** vorm (geen
ontkennende "¡No hables!", die gebruikt een ander patroon). `tú` = reguliere
presente 3e persoon enkelvoud, met 8 bekende uitzonderingen (decir→di,
hacer→haz, ir→ve, poner→pon, salir→sal, ser→sé, tener→ten, venir→ven).
`usted`/`nosotros`/`ustedes` = subjuntivo presente (met `ir`-nosotros als
colloquiale uitzondering "vamos" i.p.v. "vayamos"). `vosotros` = infinitief
met de laatste `r` vervangen door `d`, uitzonderingloos.

**Herkennen — waarom deze 5 tijden:** dit zijn (naar eigen inschatting) de
eerstvolgende belangrijkste tijden na de 5 hierboven — pretérito perfecto,
condicional, presente subjuntivo, presente continuo (estar + gerundio) en
pretérito pluscuamperfecto — gekozen omdat subjuntivo/perfecto/continuo
extreem vaak voorkomen in gesproken Spaans, ook al zijn ze lastiger zelf te
produceren dan de 5 productie-tijden.

**Nederlandse vertaalsjablonen (herkennenNl) — geen onderwerp in het
antwoord:** net als bij de productie-tijden (waar je ook alleen "hablas"
typt, niet "tú hablas") bevat het verwachte antwoord alleen de vervoegde
Nederlandse vorm, zonder "ik/jij/hij/wij/jullie/zij" ervoor — de persoon
staat al als badge bij de oefening, dus dat zou dubbelop zijn. Condicional
("zou + infinitief") en continuo ("ben/bent/is/zijn aan het + infinitief")
zijn 100% mechanisch en dus altijd correct Nederlands, ook bij werkwoorden
waar continu aspect ongebruikelijk is (bijv. "nodig hebben", "bestaan") —
net iets stijver Nederlands dan een native speaker zou kiezen, maar niet
fout. De subjuntivo-vertaling is gewoon de tegenwoordige tijd zonder "dat"-
inleiding (het Nederlands heeft toch geen levende aanvoegende wijs meer om
dat verschil te laten zien — de tijd-badge op de kaart maakt al duidelijk
dat het om de subjuntivo gaat). Perfecto/pluscuamperfecto gebruiken wél een
met de hand ingevulde Nederlandse voltooid deelwoord + het juiste
hulpwerkwoord (heb/ben, afhankelijk van het werkwoord) — dat kon niet
mechanisch afgeleid worden (Nederlandse sterke werkwoorden hebben
onregelmatige deelwoorden).

## Bekende beperkingen / vervolgstappen

- Voortgang staat in `localStorage` — per apparaat/browser, niet gesynchroniseerd
  tussen apparaten. Zodra dat gewenst is, kan `storage.js` vervangen worden
  door een Supabase-backend zonder de rest van de app aan te passen (de
  opslag-API is bewust smal en modulair gehouden).
- Geen spaced-repetition-planning (wanneer een woord weer moet terugkomen op
  een andere dag) — alleen de "3x goed = uit de foutenbox"-regel. De per-woord
  statistieken (`timesStudied`, `timesCorrect`, `timesMinor`, `timesWrong`,
  `lastStudied`) liggen al wel klaar om zo'n systeem later op te bouwen.
