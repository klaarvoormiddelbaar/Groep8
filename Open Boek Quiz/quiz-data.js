// ── Open Boek Quiz-vragen per les ───────────────────────────────────────────
// Zelfde idee als QUIZZES in KvM Quiz/quiz-data.js: de inhoud staat in code en
// wordt bij het aanmaken van een sessie gekopieerd naar de database (incl. het
// goede antwoord, dat de leerling nooit rechtstreeks te zien krijgt).
// Voeg een nieuwe sleutel ('les-8', ...) toe voor een andere les.

const QUIZVRAGEN = {
  'les-7': [
    { vraag: 'Bij een formele e-mail begin je met "Beste meneer" of "Beste mevrouw" gevolgd door de achternaam.', goed: true },
    { vraag: 'In een formele e-mail spreek je iemand aan met "jij".', goed: false },
    { vraag: 'Aantekeningen maken helpt je om belangrijke informatie later snel terug te vinden.', goed: true },
    { vraag: 'Bij aantekeningen maken schrijf je het liefst alles woord voor woord op.', goed: false },
    { vraag: 'Een formele e-mail sluit je meestal af met "Met vriendelijke groet".', goed: true },
    { vraag: 'In een appje aan een vriend gebruik je dezelfde formele taal als in een e-mail aan je leerkracht.', goed: false },
    { vraag: 'Het is verstandig om een duidelijk onderwerp in te vullen bij een e-mail.', goed: true },
    { vraag: 'Een formele e-mail mag je afsluiten met "doei" of "later".', goed: false },
    { vraag: 'Als je hulp nodig hebt bij een vak, kun je dit per e-mail aan je leerkracht vragen.', goed: true },
    { vraag: 'Bij het maken van aantekeningen schrijf je vooral kernwoorden en korte zinnen op.', goed: true },
    { vraag: 'In informeel taalgebruik gebruik je vaak afkortingen, zoals "ff" of "wb".', goed: true },
    { vraag: 'Een formele e-mail mag spelfouten bevatten, dat vinden leerkrachten niet erg.', goed: false },
    { vraag: 'Op de middelbare school mail je je leerkracht vaak om iets te vragen of door te geven.', goed: true },
    { vraag: 'Het maakt niet uit of je "u" of "jij" gebruikt in een formele e-mail.', goed: false },
    { vraag: 'Een vraagteken hoort aan het einde van een vraagzin.', goed: true }
  ]
};
