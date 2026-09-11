// ── VerbSession: oefensessie voor werkwoordvervoegingen ─────────────────────
(function () {
  const Spaans = (window.Spaans = window.Spaans || {});
  const { classifyAnswer } = Spaans.Matching;
  const VerbStorage = Spaans.VerbStorage;

  let el = null;
  let onComplete = null;
  let opts_terugCallback = null;
  let state = null;

  function randOffset() {
    return 3 + Math.floor(Math.random() * 5); // 3..7
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /**
   * Start een nieuwe oefensessie.
   * @param {HTMLElement} container
   * @param {{ naam: string, items: Array<object>, onKlaar: function, onTerug: function }} opts
   */
  function start(container, opts) {
    el = container;
    onComplete = opts.onKlaar;
    opts_terugCallback = opts.onTerug || null;

    const items = opts.items;
    state = {
      categoryName: opts.naam,
      items,
      itemsById: Object.fromEntries(items.map(i => [i.id, i])),
      verbsById: Object.fromEntries((opts.alleWerkwoorden || []).map(v => [v.id, v])),
      queue: shuffle(items.map(i => i.id)),
      sessionMastered: new Set(),
      firstAttempt: {},
      attemptCount: {},
      currentItemId: null,
      awaitingNext: false,
      lastResult: null,
      lastUserAnswer: '',
      lastMatchedAnswer: '',
      toonInfo: false,
      finished: false
    };

    volgendeUitQueue();
    render();
  }

  function volgendeUitQueue() {
    state.currentItemId = state.queue.length ? state.queue.shift() : null;
    state.awaitingNext = false;
    state.lastResult = null;
    state.lastUserAnswer = '';
    state.lastMatchedAnswer = '';
    state.toonInfo = false;
  }

  function huidigItemAfgehandeld() {
    if (state.sessionMastered.size >= state.items.length) {
      state.finished = true;
      return true;
    }
    return false;
  }

  function checkAntwoord(ingevoerd) {
    const itemId = state.currentItemId;
    const item = state.itemsById[itemId];
    const acceptedAnswers = [item.correctForm];
    const others = item.alleVormen.filter(v => v !== item.correctForm);

    const classificatie = classifyAnswer(ingevoerd, acceptedAnswers, others);
    const result = classificatie.result;

    state.attemptCount[itemId] = (state.attemptCount[itemId] || 0) + 1;
    if (!state.firstAttempt[itemId]) state.firstAttempt[itemId] = result;

    VerbStorage.verwerkResultaat(itemId, result);

    state.lastResult = result;
    state.lastUserAnswer = ingevoerd;
    state.lastMatchedAnswer = item.correctForm;

    if (result === 'correct' || result === 'minor') {
      state.sessionMastered.add(itemId);
    } else {
      const pos = Math.min(state.queue.length, randOffset());
      state.queue.splice(pos, 0, itemId);
    }

    state.awaitingNext = true;
    render();

    if (result === 'correct') {
      window.setTimeout(() => {
        if (state && state.currentItemId === itemId && state.awaitingNext) gaNaarVolgende();
      }, 850);
    }
  }

  function gaNaarVolgende() {
    if (huidigItemAfgehandeld()) {
      render();
      window.setTimeout(() => {
        if (onComplete) onComplete(bouwSessieResultaat());
      }, 50);
      return;
    }
    volgendeUitQueue();
    render();
  }

  function bouwSessieResultaat() {
    const total = state.items.length;
    let direct = 0, minor = 0, wrong = 0, extraHerhalingen = 0;
    const struggleItems = [];
    for (const item of state.items) {
      const fa = state.firstAttempt[item.id];
      if (fa === 'correct') direct++;
      else if (fa === 'minor') minor++;
      else if (fa === 'wrong') { wrong++; struggleItems.push(item); }
      const pogingen = state.attemptCount[item.id] || 0;
      if (pogingen > 1) extraHerhalingen += pogingen - 1;
    }
    return {
      categoryName: state.categoryName,
      total, direct, minor, wrong, extraHerhalingen,
      struggleItems
    };
  }

  // ── Rendering ────────────────────────────────────────────────────────────
  function render() {
    if (!state) return;
    const beheerst = state.sessionMastered.size;
    const total = state.items.length;
    const pct = total === 0 ? 0 : Math.round((beheerst / total) * 100);

    let direct = 0, minor = 0, wrong = 0;
    Object.values(state.firstAttempt).forEach(r => {
      if (r === 'correct') direct++; else if (r === 'minor') minor++; else if (r === 'wrong') wrong++;
    });

    const huidigItem = state.finished ? null : state.itemsById[state.currentItemId];
    const tijdBadge = huidigItem ? SPAANS_TIJDEN[huidigItem.tense].label : '';

    el.innerHTML = `
      <div class="oefen-view">
        <div class="oefen-topbar">
          <button class="oefen-terug" id="oefen-terug" type="button">← Werkwoorden</button>
          <div class="oefen-titel">${escapeHtml(state.categoryName)}</div>
          <div class="oefen-richting-badge">${escapeHtml(tijdBadge)}</div>
        </div>

        <div class="voortgang-balk-wrap">
          <div class="voortgang-balk-track"><div class="voortgang-balk-fill" style="width:${pct}%"></div></div>
          <div class="voortgang-balk-tekst">${beheerst} / ${total} beheerst</div>
        </div>
        <div class="voortgang-iconen">
          <span class="vi vi-goed">✅ ${direct} direct goed</span>
          <span class="vi vi-minor">⚠️ ${minor} met kleine spelfout</span>
          <span class="vi vi-fout">❌ ${wrong} nog opnieuw oefenen</span>
        </div>

        ${state.finished ? '' : renderWerkwoordkaart()}
      </div>
      ${state.toonInfo && !state.finished ? renderVervoegingenModal() : ''}`;

    const terugKnop = document.getElementById('oefen-terug');
    if (terugKnop) terugKnop.addEventListener('click', () => { if (opts_terugCallback) opts_terugCallback(); });

    bindWerkwoordkaartEvents();
    bindVervoegingenModalEvents();
  }

  function renderWerkwoordkaart() {
    const item = state.itemsById[state.currentItemId];
    const tijdInfo = SPAANS_TIJDEN[item.tense];
    const persoon = SPAANS_PERSONEN[item.personIdx];
    const grootWoord = item.omgekeerd ? item.dutch : item.infinitive;
    const kleinWoord = item.omgekeerd ? item.infinitive : item.dutch;

    return `
      <div class="woordkaart">
        <div class="woordkaart-label">${escapeHtml(tijdInfo.label)} (${escapeHtml(tijdInfo.sub)})</div>
        <div class="woordkaart-prompt">${escapeHtml(grootWoord)}</div>
        <div class="werkwoordkaart-dutch werkwoordkaart-vertaling">${escapeHtml(kleinWoord)}</div>
        <button type="button" class="info-btn" id="info-btn">ℹ️ Alle vervoegingen &amp; tijden</button>
        <form id="antwoord-form" autocomplete="off">
          <div class="antwoord-invoer-rij">
            <div class="persoon-badge">${escapeHtml(persoon)}</div>
            <input id="antwoord-input" class="antwoord-input" type="text"
                   autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"
                   placeholder="Typ de vervoegde vorm…"
                   ${state.awaitingNext ? 'readonly' : ''}
                   value="${escapeHtml(state.awaitingNext ? state.lastUserAnswer : '')}">
          </div>
          <button type="submit" class="btn-controleren">${state.awaitingNext ? 'Volgende →' : 'Controleren'}</button>
        </form>
        <div class="antwoord-feedback${state.awaitingNext ? ' zichtbaar' : ''}${state.lastResult ? ' fb-' + state.lastResult : ''}">
          ${state.awaitingNext ? renderFeedback() : ''}
        </div>
      </div>`;
  }

  function renderFeedback() {
    if (state.lastResult === 'correct') {
      return `<div class="fb-titel">✅ Goed!</div>`;
    }
    if (state.lastResult === 'minor') {
      return `
        <div class="fb-titel">⚠️ Bijna goed</div>
        <div class="fb-rij"><span class="fb-label">Jouw antwoord</span><span class="fb-waarde fb-eigen">${escapeHtml(state.lastUserAnswer)}</span></div>
        <div class="fb-rij"><span class="fb-label">Correct</span><span class="fb-waarde fb-correct">${escapeHtml(state.lastMatchedAnswer)}</span></div>
        <div class="fb-hint">Kleine spelfout: let op het accent.</div>`;
    }
    return `
      <div class="fb-titel">❌ Niet goed</div>
      <div class="fb-rij"><span class="fb-label">Jouw antwoord</span><span class="fb-waarde fb-eigen">${escapeHtml(state.lastUserAnswer || '—')}</span></div>
      <div class="fb-rij"><span class="fb-label">Correct</span><span class="fb-waarde fb-correct">${escapeHtml(state.lastMatchedAnswer)}</span></div>`;
  }

  function bindWerkwoordkaartEvents() {
    const form = document.getElementById('antwoord-form');
    const input = document.getElementById('antwoord-input');
    if (!form || !input) return;

    input.focus();
    if (!state.awaitingNext) {
      const len = input.value.length;
      input.setSelectionRange(len, len);
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (state.awaitingNext) {
        gaNaarVolgende();
      } else {
        const waarde = input.value;
        if (!waarde.trim()) return;
        checkAntwoord(waarde);
      }
    });

    const infoBtn = document.getElementById('info-btn');
    if (infoBtn) {
      infoBtn.addEventListener('click', () => {
        state.toonInfo = true;
        render();
      });
    }
  }

  function renderVervoegingenModal() {
    const item = state.itemsById[state.currentItemId];
    const verb = state.verbsById[item.verbId];
    if (!verb) return '';
    const tijden = Object.keys(SPAANS_TIJDEN);

    return `
      <div class="vervoegingen-overlay" id="vervoegingen-overlay">
        <div class="vervoegingen-modal">
          <div class="vervoegingen-kop">
            <div>
              <div class="vervoegingen-titel">${escapeHtml(verb.infinitive)}</div>
              <div class="vervoegingen-sub">${escapeHtml(verb.dutch)}</div>
            </div>
            <button type="button" class="vervoegingen-sluit" id="vervoegingen-sluit" aria-label="Sluiten">✕</button>
          </div>
          <div class="vervoegingen-tabel-wrap">
            <table class="vervoegingen-tabel">
              <thead>
                <tr>
                  <th></th>
                  ${tijden.map(t => `<th class="${t === item.tense ? 'kol-actief' : ''}">${escapeHtml(SPAANS_TIJDEN[t].label)}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${SPAANS_PERSONEN.map((persoon, idx) => `
                  <tr class="${idx === item.personIdx ? 'rij-actief' : ''}">
                    <td class="vervoegingen-persoon">${escapeHtml(persoon)}</td>
                    ${tijden.map(t => `<td class="${t === item.tense && idx === item.personIdx ? 'cel-actief' : ''}">${escapeHtml(verb.conjugations[t][idx])}</td>`).join('')}
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>`;
  }

  function bindVervoegingenModalEvents() {
    const overlay = document.getElementById('vervoegingen-overlay');
    if (!overlay) return;
    const sluiten = () => { state.toonInfo = false; render(); };
    const sluitBtn = document.getElementById('vervoegingen-sluit');
    if (sluitBtn) sluitBtn.addEventListener('click', sluiten);
    overlay.addEventListener('click', e => { if (e.target === overlay) sluiten(); });
  }

  function escapeHtml(t) {
    const d = document.createElement('div');
    d.textContent = String(t == null ? '' : t);
    return d.innerHTML;
  }

  Spaans.VerbSession = { start };
})();
