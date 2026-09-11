// ── App: koppelt CategoryOverview / StudySession / SessionResults en de
// werkwoorden-equivalenten aan elkaar, met een modus-schakelaar tussen beide ──
(function () {
  const Spaans = window.Spaans;
  const app = document.getElementById('app');

  function renderModusTabs(actief) {
    return `
      <div class="modus-tabs">
        <button type="button" class="modus-tab ${actief === 'woorden' ? 'actief' : ''}" data-modus="woorden">📚 Woorden</button>
        <button type="button" class="modus-tab ${actief === 'werkwoorden' ? 'actief' : ''}" data-modus="werkwoorden">🔤 Werkwoorden</button>
      </div>`;
  }

  function bindModusTabs(container) {
    container.querySelectorAll('.modus-tabs .modus-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.modus === 'woorden') toonOverzicht();
        else toonWerkwoordOverzicht();
      });
    });
  }

  // ── Woorden ────────────────────────────────────────────────────────────
  function toonOverzicht() {
    app.innerHTML = renderModusTabs('woorden') + '<div id="modus-inhoud"></div>';
    bindModusTabs(app);
    Spaans.CategoryOverview.render(document.getElementById('modus-inhoud'), SPAANS_WOORDEN, {
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

  // ── Werkwoorden ────────────────────────────────────────────────────────
  function toonWerkwoordOverzicht() {
    app.innerHTML = renderModusTabs('werkwoorden') + '<div id="modus-inhoud"></div>';
    bindModusTabs(app);
    Spaans.VerbOverview.render(document.getElementById('modus-inhoud'), SPAANS_WERKWOORDEN, {
      onStart(naam, verbs, items, alleWerkwoorden) {
        toonWerkwoordLijst(naam, verbs, items, alleWerkwoorden);
      }
    });
  }

  function toonWerkwoordLijst(naam, verbs, items, alleWerkwoorden) {
    Spaans.VerbList.render(app, naam, verbs, {
      onTerug: toonWerkwoordOverzicht,
      onStart() { startWerkwoordSessie(naam, items, alleWerkwoorden); }
    });
  }

  function startWerkwoordSessie(naam, items, alleWerkwoorden) {
    Spaans.VerbSession.start(app, {
      naam,
      items,
      alleWerkwoorden,
      onTerug: toonWerkwoordOverzicht,
      onKlaar(resultaat) {
        Spaans.VerbResults.render(app, resultaat, {
          onTerug: toonWerkwoordOverzicht,
          onNogEenKeer() { startWerkwoordSessie(naam, items, alleWerkwoorden); }
        });
      }
    });
  }

  toonOverzicht();
})();
