// ── App: koppelt CategoryOverview / StudySession / SessionResults aan elkaar ──
(function () {
  const Portugees = window.Portugees;
  const app = document.getElementById('app');

  function toonOverzicht() {
    Portugees.CategoryOverview.render(app, PORTUGEES_WOORDEN, {
      onStart(naam, woorden, alleWoorden) {
        toonWoordenlijst(naam, woorden, alleWoorden);
      }
    });
  }

  function toonWoordenlijst(naam, woorden, alleWoorden) {
    Portugees.WoordLijst.render(app, naam, woorden, {
      onTerug: toonOverzicht,
      onStart() { startSessie(naam, woorden, alleWoorden); }
    });
  }

  function startSessie(naam, woorden, alleWoorden) {
    Portugees.StudySession.start(app, {
      naam,
      woorden,
      alleWoorden,
      richting: Portugees.Storage.getRichting(),
      onTerug: toonOverzicht,
      onKlaar(resultaat) {
        Portugees.SessionResults.render(app, resultaat, {
          onTerug: toonOverzicht,
          onNogEenKeer() { startSessie(naam, woorden, alleWoorden); }
        });
      }
    });
  }

  toonOverzicht();
})();
