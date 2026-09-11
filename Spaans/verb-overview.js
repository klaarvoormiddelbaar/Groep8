// ── VerbOverview: tijdkeuze + werkwoordgroepen + voortgang ──────────────────
(function () {
  const Spaans = (window.Spaans = window.Spaans || {});
  const VerbStorage = Spaans.VerbStorage;

  const STATUS_LABEL = { nieuw: 'Nog niet gestart', bezig: 'Bezig', beheerst: 'Volledig beheerst' };
  const TIJD_OPTIES = [
    { value: 'presente', label: 'Presente' },
    { value: 'futuro', label: 'Futuro' },
    { value: 'imperfecto', label: 'Imperfecto' },
    { value: 'indefinido', label: 'Indefinido' },
    { value: 'gemengd', label: 'Gemengd' }
  ];
  const GROEP_VOLGORDE = ['ar-regelmatig', 'er-regelmatig', 'ir-regelmatig', 'onregelmatig'];

  function escapeHtml(t) {
    const d = document.createElement('div');
    d.textContent = String(t == null ? '' : t);
    return d.innerHTML;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function kiesTijdVoorItem(tijdFilter) {
    if (tijdFilter !== 'gemengd') return tijdFilter;
    const tijden = Object.keys(SPAANS_TIJDEN);
    return tijden[Math.floor(Math.random() * tijden.length)];
  }

  /** Bouwt een resolved item-lijst (verb × persoon) voor een sessie. */
  function bouwItems(verbs, tijdFilter) {
    const items = [];
    for (const verb of verbs) {
      for (let p = 0; p < SPAANS_PERSONEN.length; p++) {
        const tense = kiesTijdVoorItem(tijdFilter);
        items.push({
          id: VerbStorage.itemKey(verb.id, tense, p),
          verbId: verb.id,
          infinitive: verb.infinitive,
          dutch: verb.dutch,
          tense,
          personIdx: p,
          correctForm: verb.conjugations[tense][p],
          alleVormen: verb.conjugations[tense],
          omgekeerd: Math.random() < 0.5
        });
      }
    }
    return items;
  }

  function dedupeVerbs(verbs) {
    const seen = new Set();
    const result = [];
    for (const v of verbs) {
      if (!seen.has(v.id)) { seen.add(v.id); result.push(v); }
    }
    return result;
  }

  function bouwGroepen(alleWerkwoorden) {
    const map = new Map();
    for (const v of alleWerkwoorden) {
      if (!map.has(v.group)) map.set(v.group, []);
      map.get(v.group).push(v);
    }
    return GROEP_VOLGORDE.filter(g => map.has(g)).map(g => ({ naam: g, woorden: map.get(g) }));
  }

  function groepKaartHtml(groep, tijdFilter) {
    const voortgang = VerbStorage.getGroepVoortgang(groep.woorden, tijdFilter);
    const statusKlasse = 'status-' + voortgang.status;
    const label = SPAANS_WERKWOORDGROEPEN[groep.naam] || groep.naam;
    return `
      <div class="cat-kaart ${statusKlasse}" data-groep="${escapeHtml(groep.naam)}">
        <div class="cat-kop">
          <div class="cat-naam">${escapeHtml(label)}</div>
          <div class="cat-status-badge ${statusKlasse}">${STATUS_LABEL[voortgang.status]}</div>
        </div>
        <div class="cat-telling">${groep.woorden.length} werkwoorden</div>
        <div class="cat-balk-track"><div class="cat-balk-fill" style="width:${voortgang.percent}%"></div></div>
        <div class="cat-voortgang-tekst">${voortgang.learned} / ${voortgang.total} geleerd · ${voortgang.percent}%</div>
        <button class="btn btn-blauw cat-oefen-btn" type="button">Oefenen →</button>
      </div>`;
  }

  function fouteVormenKaartHtml(fouteVormen) {
    return `
      <div class="cat-kaart cat-kaart--speciaal" data-groep="__fouten__">
        <div class="cat-kop">
          <div class="cat-naam">🔁 Mijn foute werkwoordvormen</div>
          <div class="cat-status-badge status-bezig">Bezig</div>
        </div>
        <div class="cat-telling">${fouteVormen.length} ${fouteVormen.length === 1 ? 'vorm' : 'vormen'}</div>
        <div class="cat-balk-track"><div class="cat-balk-fill" style="width:0%"></div></div>
        <div class="cat-voortgang-tekst">Elke vorm moet 3x achter elkaar goed voor hij verdwijnt.</div>
        <button class="btn btn-blauw cat-oefen-btn" type="button">Oefenen →</button>
      </div>`;
  }

  /**
   * @param {HTMLElement} container
   * @param {Array<object>} alleWerkwoorden
   * @param {{ onStart:function }} callbacks - onStart(naam, verbs, items, alleWerkwoorden)
   */
  function render(container, alleWerkwoorden, callbacks) {
    const groepen = bouwGroepen(alleWerkwoorden);
    const tijdFilter = VerbStorage.getTijd();
    const fouteVormen = VerbStorage.getFouteVormen(alleWerkwoorden);

    container.innerHTML = `
      <div class="overzicht-view">
        <div class="overzicht-hero">
          <div class="overzicht-eyebrow">Werkwoorden oefenen</div>
          <div class="overzicht-titel">Vervoegingen: presente, futuro, imperfecto &amp; indefinido</div>
          <div class="overzicht-sub">Kies een tijd en een werkwoordgroep. Je krijgt steeds een werkwoord + persoon te zien en typt zelf de vervoegde vorm.</div>
        </div>

        <div class="richting-kaart">
          <div class="richting-label">Tijd</div>
          <div class="richting-opties" id="tijd-opties">
            ${TIJD_OPTIES.map(t => `
              <button type="button" class="richting-btn ${t.value === tijdFilter ? 'actief' : ''}" data-tijd="${t.value}">${t.label}</button>`).join('')}
          </div>
        </div>

        ${fouteVormen.length ? fouteVormenKaartHtml(fouteVormen) : ''}

        <div class="mix-kaart">
          <div class="mix-tekst">
            <div class="mix-titel">Willekeurige mix</div>
            <div class="mix-sub">25 willekeurige werkwoorden uit alle groepen, in de gekozen tijd.</div>
          </div>
          <button class="btn btn-blauw" id="verb-mix-btn" type="button">Mix oefenen →</button>
        </div>

        <div class="cat-grid">
          ${groepen.map(g => groepKaartHtml(g, tijdFilter)).join('')}
        </div>
      </div>`;

    container.querySelectorAll('#tijd-opties .richting-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        VerbStorage.setTijd(btn.dataset.tijd);
        render(container, alleWerkwoorden, callbacks);
      });
    });

    container.querySelectorAll('.cat-kaart .cat-oefen-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const kaart = btn.closest('.cat-kaart');
        const groepNaam = kaart.dataset.groep;
        if (groepNaam === '__fouten__') {
          const items = fouteVormen.map(f => ({
            id: VerbStorage.itemKey(f.verb.id, f.tense, f.personIdx),
            verbId: f.verb.id,
            infinitive: f.verb.infinitive,
            dutch: f.verb.dutch,
            tense: f.tense,
            personIdx: f.personIdx,
            correctForm: f.verb.conjugations[f.tense][f.personIdx],
            alleVormen: f.verb.conjugations[f.tense],
            omgekeerd: Math.random() < 0.5
          }));
          callbacks.onStart('Mijn foute werkwoordvormen', dedupeVerbs(fouteVormen.map(f => f.verb)), items, alleWerkwoorden);
          return;
        }
        const groep = groepen.find(g => g.naam === groepNaam);
        const items = bouwItems(groep.woorden, tijdFilter);
        callbacks.onStart(SPAANS_WERKWOORDGROEPEN[groepNaam] || groepNaam, groep.woorden, items, alleWerkwoorden);
      });
    });

    const mixBtn = document.getElementById('verb-mix-btn');
    if (mixBtn) {
      mixBtn.addEventListener('click', () => {
        const mixVerbs = shuffle(alleWerkwoorden).slice(0, Math.min(25, alleWerkwoorden.length));
        const items = bouwItems(mixVerbs, tijdFilter);
        callbacks.onStart('Willekeurige mix', mixVerbs, items, alleWerkwoorden);
      });
    }
  }

  Spaans.VerbOverview = { render };
})();
