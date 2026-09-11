// ── VerbList: toont de werkwoorden van een groep vóór het oefenen ───────────
(function () {
  const Spaans = (window.Spaans = window.Spaans || {});

  function escapeHtml(t) {
    const d = document.createElement('div');
    d.textContent = String(t == null ? '' : t);
    return d.innerHTML;
  }

  /**
   * @param {HTMLElement} container
   * @param {string} naam
   * @param {Array<object>} verbs
   * @param {{ onTerug:function, onStart:function }} callbacks
   */
  function render(container, naam, verbs, callbacks) {
    container.innerHTML = `
      <div class="lijst-view">
        <div class="oefen-topbar">
          <button class="oefen-terug" id="verblijst-terug" type="button">← Werkwoorden</button>
          <div class="oefen-titel">${escapeHtml(naam)}</div>
          <div class="oefen-richting-badge">${verbs.length} ${verbs.length === 1 ? 'werkwoord' : 'werkwoorden'}</div>
        </div>

        <div class="woordenlijst-kaart" id="verblijst-kaart">
          <div class="verblijst-header">
            <div class="verblijst-telling">Weet je nog wat ze betekenen?</div>
            <button type="button" class="btn btn-ghost" id="verblijst-vertaling-toggle">👁️ Toon vertalingen</button>
          </div>
          <div class="woordenlijst-grid">
            ${verbs.map(v => `
              <div class="wl-rij">
                <span class="wl-es">${escapeHtml(v.infinitive)}</span>
                <span class="wl-pijl">→</span>
                <span class="wl-nl wl-vertaling">${escapeHtml(v.dutch)}</span>
              </div>`).join('')}
          </div>
        </div>

        <div class="lijst-acties">
          <button class="btn btn-blauw" id="verblijst-start" type="button">Start oefenen →</button>
        </div>
      </div>`;

    document.getElementById('verblijst-terug').addEventListener('click', () => callbacks.onTerug());
    document.getElementById('verblijst-start').addEventListener('click', () => callbacks.onStart());

    const kaart = document.getElementById('verblijst-kaart');
    const toggleBtn = document.getElementById('verblijst-vertaling-toggle');
    let zichtbaar = false;
    toggleBtn.addEventListener('click', () => {
      zichtbaar = !zichtbaar;
      kaart.classList.toggle('vertaling-zichtbaar', zichtbaar);
      toggleBtn.textContent = zichtbaar ? '🙈 Verberg vertalingen' : '👁️ Toon vertalingen';
    });
  }

  Spaans.VerbList = { render };
})();
