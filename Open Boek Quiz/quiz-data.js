// ── Open Boek Quiz-vragen per les ────────────────────────────────────────────
// Zelfde idee als QUIZZES in KvM Quiz/quiz-data.js: de inhoud staat in code en
// wordt bij het aanmaken van een sessie gekopieerd naar de database (incl. het
// goede antwoord en de toelichting, die de leerling nooit rechtstreeks te zien
// krijgt totdat de leerkracht de resultaten opent).
// Voeg een nieuwe sleutel ('les-8', ...) toe voor een andere les.

const QUIZVRAGEN = {
  'les-7': [
    {
      vraag: 'De aarde ontstond ongeveer 4,6 miljard jaar geleden.',
      goed: true,
      toelichting: 'De aarde ontstond ongeveer 4,6 miljard jaar geleden uit een grote wolk van gas en stof.'
    },
    {
      vraag: 'De overgang van leven in zee naar leven op het land duurde een paar duizend jaar.',
      goed: false,
      toelichting: 'Deze overgang duurde honderden miljoenen jaren, niet slechts een paar duizend jaar.'
    },
    {
      vraag: "Er waren tussen 230 miljoen en 6 miljoen jaar geleden dino's op aarde.",
      goed: false,
      toelichting: 'Dinosaurussen leefden van ongeveer 230 miljoen tot 66 miljoen jaar geleden.'
    },
    {
      vraag: "Dino's en zoogdieren hebben een tijd samen op aarde geleefd.",
      goed: true,
      toelichting: 'De eerste zoogdieren leefden al toen de dinosaurussen nog bestonden. Pas na de meteorietinslag kregen zij meer ruimte om zich te ontwikkelen.'
    },
    {
      vraag: 'De dinosaurussen stierven uit door een vulkaanuitbarsting.',
      goed: false,
      toelichting: 'De dinosaurussen stierven uit door een meteorietinslag.'
    },
    {
      vraag: 'De eerste mensen leefden ongeveer 300.000 jaar geleden.',
      goed: true,
      toelichting: 'De eerste moderne mensen verschenen ongeveer 300.000 jaar geleden op aarde.'
    },
    {
      vraag: 'De ijstijd begon ongeveer 12.000 jaar geleden.',
      goed: false,
      toelichting: 'De laatste ijstijd begon ongeveer 115.000 jaar geleden en eindigde rond 12.000 jaar geleden.'
    },
    {
      vraag: 'Er leven tegenwoordig ruim 8 miljard mensen op aarde.',
      goed: true,
      toelichting: 'Op dit moment wonen er meer dan 8 miljard mensen op aarde.'
    },
    {
      vraag: 'Als iets niet dikgedrukt is, kan het nooit belangrijk zijn.',
      goed: false,
      toelichting: 'Ook informatie die niet dikgedrukt is, kan belangrijk zijn. Let daarom ook goed op wat de leerkracht extra benadrukt.'
    },
    {
      vraag: 'Het is slim om belangrijke getallen en feiten te markeren.',
      goed: true,
      toelichting: 'Door belangrijke getallen en feiten te markeren, kun je ze later sneller terugvinden in je aantekeningen.'
    }
  ]
};
