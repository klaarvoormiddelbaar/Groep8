// ── CategoryOverview: overzicht van alle categorieën + voortgang ────────────
(function () {
  const Spaans = (window.Spaans = window.Spaans || {});
  const Storage = Spaans.Storage;

  const STATUS_LABEL = { nieuw: 'Nog niet gestart', bezig: 'Bezig', beheerst: 'Volledig beheerst' };
  const RICHTING_OPTIES = [
    { value: 'nl-es', label: 'Nederlands → Spaans' },
    { value: 'es-nl', label: 'Spaans → Nederlands' },
    { value: 'gemengd', label: 'Gemengd' }
  ];

  function escapeHtml(t) {
    const d = document.createElement('div');
    d.textContent = String(t == null ? '' : t);
    return d.innerHTML;
  }

  /** Bouwt de categorielijst in de volgorde waarin ze in de dataset voorkomen. */
  function bouwCategorieen(alleWoorden) {
    const map = new Map();
    for (const w of alleWoorden) {
      if (!map.has(w.category)) map.set(w.category, []);
      map.get(w.category).push(w);
    }
    return Array.from(map.entries()).map(([naam, woorden]) => ({ naam, woorden }));
  }

  function categorieKaartHtml(cat, isSpeciaal) {
    const voortgang = Storage.getCategorieVoortgang(cat.woorden);
    const statusKlasse = 'status-' + voortgang.status;
    return `
      <div class="cat-kaart ${isSpeciaal ? 'cat-kaart--speciaal' : ''} ${statusKlasse}" data-categorie="${escapeHtml(cat.naam)}">
        <div class="cat-kop">
          <div class="cat-naam">${isSpeciaal ? '🔁 ' : ''}${escapeHtml(cat.naam)}</div>
          <div class="cat-status-badge ${statusKlasse}">${STATUS_LABEL[voortgang.status]}</div>
        </div>
        <div class="cat-telling">${cat.woorden.length} ${cat.woorden.length === 1 ? 'woord' : 'woorden'}</div>
        <div class="cat-balk-track"><div class="cat-balk-fill" style="width:${voortgang.percent}%"></div></div>
        <div class="cat-voortgang-tekst">${voortgang.learned} / ${voortgang.total} geleerd · ${voortgang.percent}%</div>
        <button class="btn btn-blauw cat-oefen-btn" type="button" ${cat.woorden.length === 0 ? 'disabled' : ''}>Oefenen →</button>
      </div>`;
  }

  /**
   * @param {HTMLElement} container
   * @param {Array<object>} alleWoorden
   * @param {{ onStart:function }} callbacks - onStart(naam, woorden, alleWoordenVoorVeiligheidsnet)
   */
  function render(container, alleWoorden, callbacks) {
    const categorieen = bouwCategorieen(alleWoorden);
    const fouteWoorden = Storage.getFouteWoorden(alleWoorden);
    const richting = Storage.getRichting();

    container.innerHTML = `
      <div class="overzicht-view">
        <div class="overzicht-hero">
          <div class="overzicht-eyebrow">Spaans leren</div>
          <div class="overzicht-titel">1000 woorden A2/B1 · Zuid-Amerika</div>
          <div class="overzicht-sub">Kies een categorie en typ steeds zelf het antwoord. Geen multiple choice — gewoon actief ophalen.</div>
        </div>

        <div class="richting-kaart">
          <div class="richting-label">Oefenrichting</div>
          <div class="richting-opties" id="richting-opties">
            ${RICHTING_OPTIES.map(r => `
              <button type="button" class="richting-btn ${r.value === richting ? 'actief' : ''}" data-richting="${r.value}">${r.label}</button>`).join('')}
          </div>
        </div>

        ${fouteWoorden.length ? categorieKaartHtml({ naam: 'Mijn foute woorden', woorden: fouteWoorden }, true) : ''}

        <div class="mix-kaart">
          <div class="mix-tekst">
            <div class="mix-titel">Willekeurige mix</div>
            <div class="mix-sub">20 willekeurige woorden uit alle categorieën, met voorrang voor woorden die je nog niet kent.</div>
          </div>
          <button class="btn btn-blauw" id="mix-oefen-btn" type="button">Mix oefenen →</button>
        </div>

        <div class="cat-grid">
          ${categorieen.map(c => categorieKaartHtml(c, false)).join('')}
        </div>
      </div>`;

    container.querySelectorAll('#richting-opties .richting-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        Storage.setRichting(btn.dataset.richting);
        render(container, alleWoorden, callbacks);
      });
    });

    container.querySelectorAll('.cat-kaart .cat-oefen-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const kaart = btn.closest('.cat-kaart');
        const naam = kaart.dataset.categorie;
        const woorden = naam === 'Mijn foute woorden' ? fouteWoorden : categorieen.find(c => c.naam === naam).woorden;
        callbacks.onStart(naam, woorden, alleWoorden);
      });
    });

    const mixBtn = document.getElementById('mix-oefen-btn');
    if (mixBtn) {
      mixBtn.addEventListener('click', () => {
        const mix = bouwMix(alleWoorden, 20);
        callbacks.onStart('Willekeurige mix', mix, alleWoorden);
      });
    }
  }

  function bouwMix(alleWoorden, aantal) {
    const stats = Storage.getAlleStats();
    const nogNiet = alleWoorden.filter(w => !stats[w.id] || !stats[w.id].everCorrect);
    const welGeleerd = alleWoorden.filter(w => stats[w.id] && stats[w.id].everCorrect);
    const geschud = shuffle(nogNiet).concat(shuffle(welGeleerd));
    return geschud.slice(0, Math.min(aantal, geschud.length));
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  Spaans.CategoryOverview = { render };
})();
