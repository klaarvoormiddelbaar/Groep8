// ── App: koppelt CategoryOverview / StudySession / SessionResults aan elkaar ──
(function () {
  const Spaans = window.Spaans;
  const app = document.getElementById('app');

  function toonOverzicht() {
    Spaans.CategoryOverview.render(app, SPAANS_WOORDEN, {
      onStart(naam, woorden, alleWoorden) {
        startSessie(naam, woorden, alleWoorden);
      }
    });
  }

  function startSessie(naam, woorden, alleWoorden) {
    Spaans.StudySession.start(app, {
      naam,
      woorden,
      alleWoorden,
      richting: Spaans.Storage.getRichting(),
      onTerug: toonOverzicht,
      onKlaar(resultaat) {
        Spaans.SessionResults.render(app, resultaat, {
          onTerug: toonOverzicht,
          onNogEenKeer() { startSessie(naam, woorden, alleWoorden); }
        });
      }
    });
  }

  toonOverzicht();
})();
