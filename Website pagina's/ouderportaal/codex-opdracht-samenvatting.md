# Opdracht voor Codex: samenvatting-kaart in het ouderportaal

Bestand: `Website pagina's/ouderportaal/index.html`

## Wat moet er gebeuren

1. **Verwijder de kaart "Tip voor thuis"** (`<article class="card tip">...</article>`, nu aanwezig tussen `.content-grid` en de `.history`-kaart, gevuld met `l.tip`).
2. **Voeg een nieuwe kaart toe: "Samenvatting van de les"**. Deze kaart komt **direct onder de `.hero`** te staan, dus vóór `.content-grid` (en dus vóór de kaarten "Dit neemt je kind mee uit de les" en "Aan de keukentafel").
3. Deze nieuwe kaart toont per les een korte samenvatting van wat er in de les gebeurt (zie hieronder, veld `summary`). Gebruik hiervoor gewoon de bestaande `.card`-stijl (geen aparte CSS-klasse nodig, of hergebruik `.tip` als stijl maar dan boven de content-grid i.p.v. erna — maakt niet uit welke klasse, zolang de positie klopt).
4. In de `lessons`-array in het `<script>`-blok: verwijder het veld `tip` en voeg een veld `summary` toe per les, met de tekst hieronder. Vervang ook het veld `questions` door de definitieve vragen hieronder (dit zijn er nu 2 of 3 per les, in plaats van steeds 3).
5. Pas de template-string in `render()` aan zodat de volgorde wordt: `.hero` → nieuwe samenvatting-kaart (`l.summary`) → `.content-grid` (insights + keukentafel/vragen) → `.history`.

## Content per les

Gebruik letterlijk deze teksten voor `summary` en `questions` (vervang de huidige placeholder-teksten volledig, dit is de definitieve content):

### Les 1 — Klaar voor lancering!
**summary:** "De leerlingen maken kennis met het programma. Ze leren dat slim leren net zo belangrijk is als hard werken. In tweetallen spelen ze het kaartspel Kraak de Code: ze beantwoorden vragen en kraken samen een code. De winnaars krijgen stressballen. Aan het einde doen ze een quiz."

**questions:**
1. "Wat betekent 'slim leren' volgens jou?"
2. "Welke slim leren tips zijn je bijgebleven?"
3. "Heb je het spel Kraak de Code gewonnen, en met wie speelde je?"

### Les 2 — Middelbare schoolweek inplannen
**summary:** "De leerlingen leren het 'KvM Planning Stappenplan': vier stappen om goed te plannen. Daarmee plannen ze in tweetallen een hele schoolweek in hun werkboek. Wie klaar is, speelt het spel Planeten Planner."

**questions:**
1. "Wat zijn de tips die je hebt gekregen voor het maken van een goede planning op de middelbare?"
2. "Hoe vond je het om de middelbare schoolweek in te plannen?"

### Les 3 — Hulpmiddelen tijdens het leren
**summary:** "De leerlingen doen in tweetallen 'Missie Middelbaar': drie digitale opdrachten. Ze ontdekken welke hulpmiddelen je kunt gebruiken als je iets niet snapt, zoals uitlegvideo's, woordjes leren en AI."

**questions:**
1. "Weet je nog welke 3 missies je tijdens de les hebt gedaan?"
2. "Welk hulpmiddel denk je dat je het meest gaat gebruiken op de middelbare school?"
3. "Hoe zou jij AI gebruiken op de middelbare school, en wat zijn de gevaren daarvan?"

### Les 4 — Executieve functies
**summary:** "De leerlingen vullen een lijst met stellingen in en ontdekken zo hun sterkste en minst sterke executieve functie (zoals plannen of doorzetten). Daarna oefenen ze dit in groepjes van 4 met het bordspel KvM SterrenStrijd."

**questions:**
1. "Hoe vond je het spel KvM SterrenStrijd? Met wie zat je in het groepje?"
2. "Wat was je sterkste en je minst sterke executieve functie?"

### Les 5 — Omgaan met toetsen en stress
**summary:** "De leerlingen verzamelen tips voor het maken van een toets. Daarna maken ze de KvM Toets, met een addertje onder het gras bij de laatste vraag: je moet eerst de hele toets lezen. Ook beantwoorden ze anoniem vragen over stress bij KlasKompas. Dit vormt de basis voor een gesprek in de klas."

**questions:**
1. "Ik hoorde dat een groot deel van de klas in de maling was genomen tijdens de les — hoe ging de toets bij jou?"
2. "Hoe ging het klassengesprek over stress op de middelbare school?"
3. "Welke tips voor het maken van een toets en het omgaan met stress vond je zelf het belangrijkste van de les?"

### Les 6 — Drukke schoolweek inplannen
**summary:** "Dit is een herhaling van les 2. De leerlingen plannen nu zelfstandig een extra drukke schoolweek. Wie klaar is, speelt weer Planeten Planner. Het highscorebord van les 2 wordt aangevuld."

**questions:**
1. "Dit was je tweede keer plannen — merkte je dat het beter ging dan de vorige keer?"
2. "Sta jij al op het highscorebord van Planeten Planner?"

### Les 7 — Schriftelijke vaardigheden
**summary:** "De leerlingen schrijven een informele mail om naar een formele mail, aan een docent. Ook oefenen ze met het maken van aantekeningen tijdens een echte aardrijkskundeles."

**questions:**
1. "Hoe begin en eindig je een formele mail naar je docent?"
2. "Vind je het spannend om een mail te sturen naar een leerkracht? Waarom wel of niet?"
3. "Welke tips heb je onthouden voor het maken van aantekeningen?"

### Les 8 — Klaar voor de start!
**summary:** "Dit is de laatste les. De leerlingen spelen in groepjes het bordspel KvM RuimteRace. Ze vullen een enquête in met tips en tops over het programma. Tot slot krijgen ze een Survivalgids en een certificaat mee naar huis."

**questions:**
1. "Met wie speelde je KvM RuimteRace, en wie won er in jouw groepje?"
2. "Wat vond je van het Klaar voor Middelbaar-programma?"
3. "Heb je je Survivalgids en je certificaat al mee naar huis genomen?"

## Let op
- De velden `n`, `g1`, `g2`, `title`, `sub`, `date` en `insights` per les blijven ongewijzigd staan.
- Alleen `tip` wordt verwijderd, `summary` wordt toegevoegd, en `questions` wordt vervangen door de lijst hierboven (let op: niet meer steeds 3 vragen, soms 2).
- Check na het bouwen dat de kaart met de samenvatting visueel boven "Dit neemt je kind mee uit de les" en "Aan de keukentafel" staat, direct onder de hero-banner.
