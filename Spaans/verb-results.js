// ── VerbResults: eindscherm na een afgeronde werkwoord-oefensessie ──────────
(function () {
  const Spaans = (window.Spaans = window.Spaans || {});

  function escapeHtml(t) {
    const d = document.createElement('div');
    d.textContent = String(t == null ? '' : t);
    return d.innerHTML;
  }

  /**
   * @param {HTMLElement} container
   * @param {object} resultaat - zie verb-session.js bouwSessieResultaat()
   * @param {{ onNogEenKeer:function, onTerug:function }} callbacks
   */
  function render(container, resultaat, callbacks) {
    const { total, direct, minor, wrong, extraHerhalingen, struggleItems, categoryName } = resultaat;
    const directGekend = direct + minor;
    const score = total === 0 ? 0 : Math.round(((direct + minor * 0.85) / total) * 100);

    container.innerHTML = `
      <div class="resultaat-view">
        <div class="resultaat-hero">
          <div class="resultaat-emoji">🎉</div>
          <div class="resultaat-titel">Groep afgerond!</div>
          <div class="resultaat-sub">${escapeHtml(categoryName)}</div>
        </div>

        <div class="resultaat-statgrid">
          <div class="resultaat-stat"><div class="rs-getal">${total}</div><div class="rs-label">vervoegingen</div></div>
          <div class="resultaat-stat"><div class="rs-getal rs-goed">${direct}</div><div class="rs-label">direct correct</div></div>
          <div class="resultaat-stat"><div class="rs-getal rs-minor">${minor}</div><div class="rs-label">kleine spelfouten</div></div>
          <div class="resultaat-stat"><div class="rs-getal rs-fout">${wrong}</div><div class="rs-label">echte fouten</div></div>
          <div class="resultaat-stat"><div class="rs-getal">${extraHerhalingen}</div><div class="rs-label">extra herhalingen</div></div>
          <div class="resultaat-stat"><div class="rs-getal rs-score">${score}%</div><div class="rs-label">score</div></div>
        </div>

        <div class="resultaat-samenvatting">${directGekend} van de ${total} vervoegingen kende je direct.</div>

        ${struggleItems.length ? `
        <div class="resultaat-moeite">
          <div class="rm-titel">Deze vervoegingen kostten extra moeite:</div>
          <div class="rm-lijst">
            ${struggleItems.map(item => `
              <div class="rm-item">
                <span class="rm-nl">${escapeHtml(item.infinitive)} · ${escapeHtml(SPAANS_TIJDEN[item.tense].label)} · ${escapeHtml(SPAANS_PERSONEN[item.personIdx])}</span>
                <span class="rm-pijl">→</span>
                <span class="rm-es">${escapeHtml(item.correctForm)}</span>
              </div>`).join('')}
          </div>
        </div>` : ''}

        <div class="resultaat-acties">
          <button class="btn btn-ghost" id="res-terug" type="button">Terug naar werkwoorden</button>
          <button class="btn btn-blauw" id="res-nogmaals" type="button">Nog een keer</button>
        </div>
      </div>`;

    document.getElementById('res-terug').addEventListener('click', () => callbacks.onTerug());
    document.getElementById('res-nogmaals').addEventListener('click', () => callbacks.onNogEenKeer());
  }

  Spaans.VerbResults = { render };
})();
