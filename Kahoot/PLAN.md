# Live Klasquiz — Technisch & UX Plan
### Kahoot-stijl klassikale activiteit voor "Klaar voor Middelbaar"

Status: **planning — nog niet bouwen**

---

## 1. Uitgangspunten uit PROJECT.md en de style guide

**Uit PROJECT.md:**
- Sectie "6. Oefenen" noemt al expliciet *"interactieve quizzes, drag-and-drop taken, memory games of kleine uitdagingen"*. Een live klasquiz is de natuurlijke, sociale uitbreiding daarvan: hetzelfde oefenmateriaal, maar gedeeld en gelijktijdig — wat direct aansluit bij doel #3, *"sociale en emotionele paraatheid"* (samen oefenen en samen fouten mogen maken, in een veilige klassikale setting).
- Docenten zijn een "additional"-doelgroep naast leerlingen en ouders. De live-sessie hoort dus te voelen als een hulpmiddel ván de docent binnen het bestaande portaal — niet als los product ernaast.
- Toon: vriendelijk, gestructureerd, vertrouwen-opbouwend. Geen overdreven "game show"-energie — de speelse elementen (medailles, scores, klassementen) bestaan al in een getemperde vorm in de guide.

**Uit de style guide (`KVM-Style-Guide-Aangepaste-Kleuren.md`):**
Opvallend: bijna alle bouwstenen voor een Kahoot-achtige flow staan er al in, alsof er met quizzen rekening is gehouden:
- **Medaille-badges** (goud/zilver/brons, §7.9) → kant-en-klaar voor een klassement
- **Score chip** "Score: X / Y" (§7.8) → live scoreweergave voor leerlingen
- **Voortgangsstepper** (§7.3) → ideaal voor "Vraag 3 van 8"
- **Pie chart-stijl** (§7.13) → antwoordverdelingen/statistieken voor de docent
- **Pil-knoppen** in blauw ("Start", §7.7) en groen ("indienen/opslaan") → exact de twee acties die deze flow nodig heeft
- **Karakterbubbel/Sander-mascotte** (§7.10) → kan de quiz "presenteren" en instructies geven
- **Tip box, kaart-shell met 40px radius, gradient hero's** → al gebruikt in `dashboard.html`, rechtstreeks herbruikbaar

Conclusie: we **hergebruiken bestaande componenten** in plaats van nieuwe te verzinnen. Dat houdt de functie visueel "thuis" in het platform — precies de eis dat het niet als apart product mag aanvoelen.

---

## 2. Architectuurvoorstel

> **Aanbeveling:** blijf bij de bestaande aanpak — losse statische HTML/CSS/JS-pagina's zonder framework of build-stap — en voeg **Firebase Realtime Database + Anonymous Auth** toe als lichte real-time laag.

**Waarom dit en geen eigen server (bv. Node + Socket.io):**
- De site heeft nu helemaal geen backend; alles draait client-side. Een eigen WebSocket-server zou voor het eerst een te *beheren* backend introduceren — hosting, deploys, herstarts, monitoring. Dat is een grote operationele sprong voor wat in essentie één klasfunctie is.
- Firebase levert real-time sync "as a service": je voegt één `<script>`-tag toe (CDN SDK), exact hetzelfde patroon als de rest van de site al volgt (zie de Google Fonts `<link>` in `dashboard.html`). Geen server om te onderhouden, alleen frontend-code.
- De gratis laag (Spark plan) is ruimschoots voldoende voor klassikaal gebruik: 100 gelijktijdige verbindingen, 1 GB opslag, 10 GB/maand verkeer. Eén klas ≈ 30 verbindingen tegelijk — zelfs meerdere klassen tegelijk passen comfortabel.
- **Anonymous Auth** geeft elke leerling een stabiele, unieke sessie-ID zonder account of wachtwoord — past precies bij de flow "vul je naam in en doe mee".

**Waarom Realtime Database (en niet Firestore):**
- Geoptimaliseerd voor veel kleine, frequente schrijfacties — exact wat live deelnemerstellers en antwoordstatistieken nodig hebben.
- `onDisconnect()`-hooks maken *presence* (wie is er nog online) triviaal — cruciaal voor een betrouwbaar live deelnemersaantal als een leerling zijn laptop dichtklapt.
- Het kostenmodel past beter bij korte, drukke pieken (één lesuur) dan Firestore's per-document-leeskosten bij veel gelijktijdige listeners.

**Overwogen alternatief — Supabase (Postgres + Realtime):** ook een prima moderne keuze met vergelijkbare gratis laag. Firebase RTDB + `onDisconnect()` is echter de meest beproefde combinatie specifiek voor "live presence + sync"-patronen zoals dit — minder kans op verrassingen tijdens de bouw.

**Belangrijke randvoorwaarde — hosting:** real-time sync tussen meerdere apparaten werkt niet met lokaal geopende bestanden (`file://...`, dubbelklikken). De site moet op een echte URL staan die zowel de docent als alle leerlingen op hun eigen laptop kunnen bereiken. **Firebase Hosting** ligt voor de hand: zelfde project als de database, één deploy-commando, gratis laag ruim voldoende. Zie open vraag §8.1.

---

## 3. Hoe sessies werken

**Sessiecode**
- Willekeurige 6-cijferige numerieke code (100000–999999), gegenereerd zodra de docent op **"Start live sessie"** klikt.
- Uniciteit wordt afgedwongen met een Firebase-transactie op `/sessions/{code}`: bestaat de code al én is die sessie nog actief, dan genereert de client een nieuwe code en probeert opnieuw. (Bij ~900.000 mogelijke codes is een botsing in de praktijk zeldzaam.)

**Levenscyclus**
1. **Aanmaken** — Docent opent een les → klikt "Start live sessie" → app genereert een code en maakt `/sessions/{code}` aan met status `lobby`, gekoppeld aan de les en een **momentopname** van de quizvragen (zo verstoren latere wijzigingen aan de lesinhoud een lopende sessie niet).
2. **Wachtkamer (docent)** — Docent ziet de code groot in beeld (eventueel met QR-code) en een live bijwerkende lijst van binnenkomende leerlingen.
3. **Deelnemen** — Leerlingen openen de join-pagina, vullen code + voornaam in. De app controleert of de code bestaat en de sessie nog niet is afgelopen, registreert de leerling onder `/sessions/{code}/participants/{spelerId}` en zet `onDisconnect()` klaar zodat de docent altijd een kloppend live-aantal ziet.
4. **Starten** — Docent klikt "Start sessie" → status wordt `active`, `huidigeVraagIndex` wordt `0`. Alle leerlingschermen reageren onmiddellijk.
5. **Vraag voor vraag** — Docent klikt "Volgende vraag" → `huidigeVraagIndex` wordt verhoogd → alle leerlingschermen springen automatisch mee (dit ís de gevraagde "automatisch doorschakelen", zonder enige actie van de leerling).
6. **Afronden** — Na de laatste vraag, of op elk moment via "Sessie beëindigen", wordt status `ended`; beide kanten zien een eindscherm met (optioneel) klassement.
7. **Opruimen** — Sessies krijgen een `verlooptOp`-tijdstempel. Voor de MVP: handmatige/incidentele opruiming via de Firebase-console; geautomatiseerde opruiming via een geplande Cloud Function is een latere optimalisatie (zie §8.5).

**Datamodel (schets)**
```
/sessions/{code}
    lesId               "les-3"
    docentNaam          "Linda"
    status              "lobby" | "active" | "ended"
    huidigeVraagIndex   0
    quiz                [ ...momentopname van vragen, zie §5... ]
    aangemaaktOp        <timestamp>

/sessions/{code}/participants/{spelerId}
    naam                "Sem"
    score               0
    aanwezig            true        ← beheerd via onDisconnect()

/sessions/{code}/antwoorden/{vraagIndex}/{spelerId}
    optieIndex          2
    tijdInMs            4200
    punten              850
```

---

## 4. Hoe de real-time communicatie werkt

Firebase Realtime Database werkt met **listeners**, niet met polling: elke client abonneert zich op een pad (`onValue(ref, callback)`) en ontvangt automatisch een update zodra de waarde ergens anders verandert — meestal binnen ~100–300 ms, zonder ooit handmatig te hoeven verversen.

| Interactie | Wie schrijft | Wie luistert | Resultaat |
|---|---|---|---|
| Leerling meldt zich aan | Leerling → `participants/{id}` | Docent ← `participants` | Naam/teller verschijnt direct in de docent-wachtkamer |
| Docent start sessie / volgende vraag | Docent → `status`, `huidigeVraagIndex` | Alle leerlingen ← die twee velden | Leerlingschermen springen gelijktijdig mee — dé "automatische doorschakeling" |
| Leerling dient antwoord in | Leerling → `antwoorden/{vraagIndex}/{id}` | Docent ← `antwoorden/{huidigeVraagIndex}` | Docent ziet teller ("12 van 18 hebben geantwoord") en verdeling per optie live oplopen |
| Verbinding valt weg | Firebase (vooraf ingestelde `onDisconnect()`) → `aanwezig: false` | Docent ← `participants` | Live aantal blijft kloppen, ook bij weggevallen laptops |

Het gevolg: **geen eigen WebSocket-code, geen polling-timers, geen server** — die "magie" zit al in de Firebase-clientbibliotheek. Wij bouwen alleen de schermen eromheen en koppelen ze aan deze paden.

---

## 5. Vraagtypen & gedeeld datamodel

In plaats van vier losse componenten voor multiple choice / waar-niet waar / beeldvraag / poll, gebruiken we **één gedeeld vraagschema** waar elk type een specifieke invulling van is — dat scheelt aanzienlijk in bouw- én onderhoudswerk:

```js
{
  type: 'multiple_choice' | 'true_false' | 'image' | 'poll',
  vraag: 'Wat doe je het beste het eerst op je nieuwe school?',
  afbeelding: null,            // optionele asset-URL — gevuld bij type 'image'
  opties: ['Mijn rooster bekijken', 'Een vriend zoeken', '...'],
  goedIndex: 0,                // null bij 'poll' → geen score, alleen verdeling tonen
  tijdslimietSec: 20
}
```

- **Waar/niet waar** = `multiple_choice` met twee vaste opties ("Waar" / "Niet waar").
- **Beeldvraag** = `multiple_choice` of `poll` met gevuld `afbeelding`-veld; afbeeldingen zijn vooraf aangeleverde, statische assets — geen uploadfunctie (zie §8.6).
- **Poll** = `multiple_choice` met `goedIndex: null`: geen score, alleen de verdeling wordt getoond ("8 van 20 koos B").

Eén component (`<vraag-kaart>`) rendert dus alle vier de typen. Vragen worden per les opgeslagen, naar het patroon van de bestaande `LESSONS`-array (`doelen`, `tl`, `mat`): elke les krijgt een nieuw veld `quiz: [...]` met 5–10 vragen. Geen aparte "vraag-editor" nodig voor de MVP (zie §8.2).

---

## 6. Benodigde pagina's & schermen

**Docentkant** — binnen het bestaande docentenportaal, met dezelfde header/breadcrumb/avatar/stijl:

1. **Lesdetailpagina** *(bestaand, uit te breiden)* — nieuwe knop **"Start live sessie"** naast de bestaande "Ga naar de les", in dezelfde pil-knop-taal (blauw, zoals de "Start"-knop uit §7.7 van de guide).
2. **Wachtkamer / Lobby** — grote, goed afleesbare sessiecode (eventueel + QR-code), live binnenkomende namenlijst, deelnemersteller, knop "Start sessie".
3. **Presentatiescherm** — huidige vraag groot in beeld, voortgangsstepper "Vraag 3 van 8" (bestaand stepper-component), live antwoordteller, knoppen "Volgende vraag" en "Sessie beëindigen".
4. **Statistiekweergave** — verdeling per antwoordoptie als staafjes/percentages (in de visuele stijl van de pie-chart-component, §7.13), met het juiste antwoord uitgelicht; als overlay op het presentatiescherm of als kort tussenscherm na elke vraag.
5. **Eindscherm / klasoverzicht** — samenvatting (gemiddelde score, aantal deelnemers), optioneel klassement met de bestaande medaille-badges (goud/zilver/brons), knop "Terug naar les".

**Leerlingkant** — nieuwe, publieke flow (geen inlog/portaalnavigatie), lichte variant van dezelfde visuele stijl:

6. **Deelnamepagina ("Doe mee")** — invoer voor sessiecode + voornaam, met duidelijke validatie/foutmeldingen ("Deze code bestaat niet" / "Deze sessie is al afgelopen").
7. **Wachtkamer (leerling)** — bevestiging "Je doet mee als {naam}!", deelnemersteller, rustige wachtanimatie tot de docent start.
8. **Vraagscherm** — vraag + antwoordopties (of afbeelding), aftelbalk, duidelijke selectie-feedback, en na indienen een geruststellende status "Antwoord verzonden — wacht op de docent".
9. **Resultaat per vraag** *(optioneel, kort getoond)* — "Goed zo!" / "Helaas, het juiste antwoord was B", plus bijgewerkte score (bestaande score-chip-stijl: "Score: 850").
10. **Eindscherm (leerling)** — eindscore, eventueel klasseringspositie, vriendelijke afsluiting "Bedankt voor het meedoen!".

In totaal **5 docentschermen + 5 leerlingschermen** — de meeste zijn hergebruikte/aangepaste varianten van bestaande stijlpatronen, geen volledig nieuwe visuele taal.

---

## 7. Gefaseerd implementatieplan

| Fase | Inhoud |
|---|---|
| **0 — Fundament** | Firebase-project opzetten (Realtime Database + Anonymous Auth), databaseschema en security rules vastleggen, SDK via CDN toevoegen (zelfde "voeg een script-tag toe"-patroon als de rest van de site), hostingkeuze bevestigen (§8.1) |
| **1 — Docent: sessie aanmaken & lobby** | Knop "Start live sessie" op de lesdetailpagina, codegeneratie + sessie aanmaken in de database, wachtkamerscherm met live (aanvankelijk lege) deelnemerslijst |
| **2 — Leerling: deelnemen** | Deelnamepagina (code + naam, validatie), leerling-wachtkamer, en de eerste echte real-time koppeling: de docent ziet namen live binnenkomen |
| **3 — Vraag-synchronisatie** | Docent doorloopt vragen; leerlingschermen volgen automatisch via `huidigeVraagIndex`. Eerst alleen `multiple_choice` — de overige typen liften later mee op dezelfde component |
| **4 — Antwoorden & live statistiek** | Leerlingen dienen antwoorden in; docent ziet teller én verdeling per optie live oplopen; onthulling van het juiste antwoord na elke vraag |
| **5 — Overige vraagtypen** | Waar/niet waar, beeldvraag en poll toevoegen, bovenop de in fase 3–4 gevalideerde gedeelde component |
| **6 — Score & klassement** | Puntentelling (bv. basispunten + snelheidsbonus, vergelijkbaar met Kahoot), lopende score zichtbaar voor de leerling, eindklassement met medaille-badges voor beide kanten |
| **7 — Afwerking & robuustheid** | Verbinding-verlies/herverbinding, laat aansluitende leerlingen, lege/foutstaten, sessie-opruiming, micro-animaties die aansluiten bij de bestaande "motion"-taal (spring-bounce hover, staggered reveals), volledige NL-tekstcontrole, test met meerdere apparaten tegelijk in een echte klassikale situatie |

---

## 8. Open vragen & aannames *(graag bevestigen vóór/tijdens de bouw)*

1. **Hosting** — waar komt de site (en dus deze functie) live te staan? Lokale bestanden werken niet voor real-time sync over meerdere apparaten. Firebase Hosting ligt het meest voor de hand (zelfde project als de database, gratis laag, één deploy-commando) — is er al een andere hostingkeuze gemaakt?
2. **Vraaginhoud** — aanname: quizvragen worden, net als `doelen`/`tl`/`mat`, in de broncode per les vastgelegd (geen vraag-editor in deze fase). Een "stel zelf je quiz samen"-functie voor docenten zou een mooie, maar aanzienlijk grotere, vervolgstap zijn.
3. **Docentidentiteit** — er is nu geen echt inlogsysteem ("Linda" staat hardcoded in `dashboard.html`); voor deze functie is dat geen probleem (alleen een naam nodig om te tonen), maar we kunnen niet op een bestaand auth-systeem leunen.
4. **Scoreregels** — voorstel: een eenvoudig Kahoot-achtig systeem (basispunten + snelheidsbonus). Dit is volledig aanpasbaar en zou ook simpelweg "goed = 1 punt" kunnen zijn als dat beter past bij de rustige, ingetogen toon van het platform.
5. **Sessie-opruiming** — voor de MVP is handmatige opruiming via de Firebase-console prima; geautomatiseerde opruiming is een latere optimalisatie, geen blokkade voor livegang.
6. **Afbeeldingen bij beeldvragen** — aanname: vooraf aangeleverde, statische afbeeldingen (zoals de illustraties die nu al in de lessen worden gebruikt), geen uploadfunctionaliteit voor docenten.

---

*Dit document beschrijft de aanpak; er wordt nog niet gebouwd. Reageer met aanpassingen/akkoord per sectie, dan werken we per fase uit §7 verder.*
