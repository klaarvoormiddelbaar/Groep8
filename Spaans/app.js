// ── App: koppelt CategoryOverview / StudySession / SessionResults aan elkaar ──
(function () {
  const Spaans = window.Spaans;
  const app = document.getElementById('app');

  function toonOverzicht() {
    Spaans.CategoryOverview.render(app, SPAANS_WOORDEN, {
      onStart(naam, woorden, alleWoorden) {
        toonWoordenlijst(naam, woorden, alleWoorden);
      }
    });
  }

  function toonWoordenlijst(naam, woorden, alleWoorden) {
    Spaans.WoordLijst.render(app, naam, woorden, {
      onTerug: toonOverzicht,
      onStart() { startSessie(naam, woorden, alleWoorden); }
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
