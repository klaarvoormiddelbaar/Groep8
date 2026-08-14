# Portugees leren

## Concept

Een interactieve woordjesleeromgeving voor de Portugese reiswoordenlijst uit
`../Spaans/Portugees_200_reiswoorden_Brazilie.xlsx` (200 woorden, 10
categorieën van 20 woorden). Vrijwel identieke opzet als `Spaans/` — de
gebruiker typt zelf het antwoord, geen multiple choice.

**Taal:** Nederlands (interface), Portugees (te leren taal, Braziliaans)
**Route:** `/portugees` → `Portugees/index.html`

## Doel

Persoonlijk leerdoel, gericht op reizen naar Brazilië. Geen
klassikale/live-sessie-functionaliteit (geen docent/leerling-rollen, geen
Supabase) — dit is een individueel hulpmiddel, net als `Spaans/`.

## Verhouding tot Spaans/

Dit is een 1-op-1 fork van de `Spaans/`-module: dezelfde bestandsstructuur,
dezelfde `matching.js` (ongewijzigd, taalonafhankelijk), dezelfde
`storage.js`-opzet met een eigen localStorage-sleutel
(`kvm_portugees_voortgang_v1` / `kvm_portugees_richting_v1`, dus voortgang
staat volledig los van Spaans). Woordvelden heten `portuguese` i.p.v.
`spanish`; oefenrichtingen zijn `nl-pt` / `pt-nl` i.p.v. `nl-es` / `es-nl`.

## Databron

`Portugees/data.js` is gegenereerd uit het Excel-bestand (blad "200
Portugese woorden") via een eenmalig Python-script (niet bewaard in de
repo — bij een nieuwe versie van het Excel-bestand opnieuw genereren).

Elk woord heeft minimaal:
```js
{ id, category, dutch, portuguese, acceptedAnswers: [...], dutchAnswers: [...] }
```

## Bekende beperkingen / vervolgstappen

Zelfde als `Spaans/`: voortgang zit in `localStorage` (niet gesynchroniseerd
tussen apparaten), geen spaced-repetition-planning.
