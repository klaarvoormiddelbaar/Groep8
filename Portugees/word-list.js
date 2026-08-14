// ── WoordLijst: toont alle woorden van een categorie vóór het oefenen ───────
(function () {
  const Portugees = (window.Portugees = window.Portugees || {});

  function escapeHtml(t) {
    const d = document.createElement('div');
    d.textContent = String(t == null ? '' : t);
    return d.innerHTML;
  }

  /**
   * @param {HTMLElement} container
   * @param {string} naam
   * @param {Array<object>} woorden
   * @param {{ onTerug:function, onStart:function }} callbacks
   */
  function render(container, naam, woorden, callbacks) {
    container.innerHTML = `
      <div class="lijst-view">
        <div class="oefen-topbar">
          <button class="oefen-terug" id="lijst-terug" type="button">← Categorieën</button>
          <div class="oefen-titel">${escapeHtml(naam)}</div>
          <div class="oefen-richting-badge">${woorden.length} ${woorden.length === 1 ? 'woord' : 'woorden'}</div>
        </div>

        <div class="woordenlijst-kaart">
          <div class="woordenlijst-grid">
            ${woorden.map(w => `
              <div class="wl-rij">
                <span class="wl-nl">${escapeHtml(w.dutch)}</span>
                <span class="wl-pijl">→</span>
                <span class="wl-pt">${escapeHtml(w.portuguese)}</span>
              </div>`).join('')}
          </div>
        </div>

        <div class="lijst-acties">
          <button class="btn btn-blauw" id="lijst-start" type="button">Start oefenen →</button>
        </div>
      </div>`;

    document.getElementById('lijst-terug').addEventListener('click', () => callbacks.onTerug());
    document.getElementById('lijst-start').addEventListener('click', () => callbacks.onStart());
  }

  Portugees.WoordLijst = { render };
})();
