// ── SessionResults: eindscherm na een afgeronde oefensessie ─────────────────
(function () {
  const Portugees = (window.Portugees = window.Portugees || {});

  function escapeHtml(t) {
    const d = document.createElement('div');
    d.textContent = String(t == null ? '' : t);
    return d.innerHTML;
  }

  /**
   * @param {HTMLElement} container
   * @param {object} resultaat - zie study-session.js bouwSessieResultaat()
   * @param {{ onNogEenKeer:function, onTerug:function }} callbacks
   */
  function render(container, resultaat, callbacks) {
    const { total, direct, minor, wrong, extraHerhalingen, struggleWoorden, categoryName } = resultaat;
    const directGekend = direct + minor;
    const score = total === 0 ? 0 : Math.round(((direct + minor * 0.85) / total) * 100);

    container.innerHTML = `
      <div class="resultaat-view">
        <div class="resultaat-hero">
          <div class="resultaat-emoji">🎉</div>
          <div class="resultaat-titel">Categorie afgerond!</div>
          <div class="resultaat-sub">${escapeHtml(categoryName)}</div>
        </div>

        <div class="resultaat-statgrid">
          <div class="resultaat-stat"><div class="rs-getal">${total}</div><div class="rs-label">woorden</div></div>
          <div class="resultaat-stat"><div class="rs-getal rs-goed">${direct}</div><div class="rs-label">direct correct</div></div>
          <div class="resultaat-stat"><div class="rs-getal rs-minor">${minor}</div><div class="rs-label">kleine spelfouten</div></div>
          <div class="resultaat-stat"><div class="rs-getal rs-fout">${wrong}</div><div class="rs-label">echte fouten</div></div>
          <div class="resultaat-stat"><div class="rs-getal">${extraHerhalingen}</div><div class="rs-label">extra herhalingen</div></div>
          <div class="resultaat-stat"><div class="rs-getal rs-score">${score}%</div><div class="rs-label">score</div></div>
        </div>

        <div class="resultaat-samenvatting">${directGekend} van de ${total} woorden kende je direct.</div>

        ${struggleWoorden.length ? `
        <div class="resultaat-moeite">
          <div class="rm-titel">Deze woorden kostten extra moeite:</div>
          <div class="rm-lijst">
            ${struggleWoorden.map(w => `
              <div class="rm-item">
                <span class="rm-nl">${escapeHtml(w.dutch)}</span>
                <span class="rm-pijl">→</span>
                <span class="rm-pt">${escapeHtml(w.portuguese)}</span>
              </div>`).join('')}
          </div>
        </div>` : ''}

        <div class="resultaat-acties">
          <button class="btn btn-ghost" id="res-terug" type="button">Terug naar categorieën</button>
          <button class="btn btn-blauw" id="res-nogmaals" type="button">Nog een keer</button>
        </div>
      </div>`;

    document.getElementById('res-terug').addEventListener('click', () => callbacks.onTerug());
    document.getElementById('res-nogmaals').addEventListener('click', () => callbacks.onNogEenKeer());
  }

  Portugees.SessionResults = { render };
})();
