// ── Oefensessie: herhaalqueue + WordCard / AnswerInput / AnswerFeedback / ProgressBar ──
(function () {
  const Portugees = (window.Portugees = window.Portugees || {});
  const { classifyAnswer } = Portugees.Matching;
  const Storage = Portugees.Storage;

  const RICHTING_LABEL = {
    'nl-pt': 'Nederlands → Portugees',
    'pt-nl': 'Portugees → Nederlands'
  };

  let el = null;
  let onComplete = null;
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

  function richtingVoorWoord(globaleRichting) {
    if (globaleRichting === 'gemengd') return Math.random() < 0.5 ? 'nl-pt' : 'pt-nl';
    return globaleRichting;
  }

  function promptEnAntwoord(woord, richting) {
    if (richting === 'pt-nl') {
      return { prompt: woord.portuguese, acceptedAnswers: woord.dutchAnswers || [woord.dutch] };
    }
    return { prompt: woord.dutch, acceptedAnswers: woord.acceptedAnswers };
  }

  function otherKnownWords(alleWoorden, richting, huidigWoordId, acceptedAnswers) {
    const eigenAntwoorden = new Set(
      acceptedAnswers.map(a => Portugees.Matching.stripAccents(Portugees.Matching.normalizeBasic(a)))
    );
    const set = new Set();
    for (const w of alleWoorden) {
      if (w.id === huidigWoordId) continue;
      const waarden = richting === 'pt-nl' ? (w.dutchAnswers || [w.dutch]) : [w.portuguese];
      for (const waarde of waarden) {
        // Sommige woorden komen in meerdere categorieën voor met exact dezelfde
        // vertaling (bijv. "quizás") — dat is dan geen ander, echt woord, dus
        // die mag niet als veiligheidsnet-uitsluiting meetellen.
        const plat = Portugees.Matching.stripAccents(Portugees.Matching.normalizeBasic(waarde));
        if (eigenAntwoorden.has(plat)) continue;
        set.add(waarde);
      }
    }
    return Array.from(set);
  }

  /**
   * Start een nieuwe oefensessie.
   * @param {HTMLElement} container
   * @param {{ naam: string, woorden: Array<object>, richting: string, onKlaar: function }} opts
   */
  function start(container, opts) {
    el = container;
    onComplete = opts.onKlaar;

    const woorden = opts.woorden;
    const richtingPerWoord = {};
    woorden.forEach(w => { richtingPerWoord[w.id] = richtingVoorWoord(opts.richting); });

    state = {
      categoryName: opts.naam,
      alleWoordenVoorVeiligheidsnet: opts.alleWoorden || woorden,
      words: woorden,
      wordsById: Object.fromEntries(woorden.map(w => [w.id, w])),
      richting: opts.richting,
      richtingPerWoord,
      queue: shuffle(woorden.map(w => w.id)),
      sessionMastered: new Set(),
      firstAttempt: {},
      attemptCount: {},
      strugglingWordIds: new Set(),
      currentWordId: null,
      awaitingNext: false,
      lastResult: null,
      lastUserAnswer: '',
      lastMatchedAnswer: '',
      finished: false
    };

    volgendeUitQueue();
    render();
  }

  function volgendeUitQueue() {
    state.currentWordId = state.queue.length ? state.queue.shift() : null;
    state.awaitingNext = false;
    state.lastResult = null;
    state.lastUserAnswer = '';
    state.lastMatchedAnswer = '';
  }

  function huidigWoordAfgehandeld() {
    if (state.sessionMastered.size >= state.words.length) {
      state.finished = true;
      return true;
    }
    return false;
  }

  function checkAntwoord(ingevoerd) {
    const wordId = state.currentWordId;
    const woord = state.wordsById[wordId];
    const richting = state.richtingPerWoord[wordId];
    const { acceptedAnswers } = promptEnAntwoord(woord, richting);
    const others = otherKnownWords(state.alleWoordenVoorVeiligheidsnet, richting, wordId, acceptedAnswers);

    const classificatie = classifyAnswer(ingevoerd, acceptedAnswers, others);
    const result = classificatie.result;

    state.attemptCount[wordId] = (state.attemptCount[wordId] || 0) + 1;
    if (!state.firstAttempt[wordId]) state.firstAttempt[wordId] = result;

    Storage.verwerkResultaat(wordId, result);

    state.lastResult = result;
    state.lastUserAnswer = ingevoerd;
    state.lastMatchedAnswer = classificatie.matchedAnswer || acceptedAnswers[0];

    if (result === 'correct' || result === 'minor') {
      state.sessionMastered.add(wordId);
    } else {
      state.strugglingWordIds.add(wordId);
      const pos = Math.min(state.queue.length, randOffset());
      state.queue.splice(pos, 0, wordId);
    }

    state.awaitingNext = true;
    render();

    if (result === 'correct') {
      // Snelle flow bij een volledig goed antwoord: automatisch door.
      window.setTimeout(() => {
        if (state && state.currentWordId === wordId && state.awaitingNext) gaNaarVolgende();
      }, 850);
    }
  }

  function gaNaarVolgende() {
    if (huidigWoordAfgehandeld()) {
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
    const total = state.words.length;
    let direct = 0, minor = 0, wrong = 0, extraHerhalingen = 0;
    const struggleWoorden = [];
    for (const w of state.words) {
      const fa = state.firstAttempt[w.id];
      if (fa === 'correct') direct++;
      else if (fa === 'minor') minor++;
      else if (fa === 'wrong') { wrong++; struggleWoorden.push(w); }
      const pogingen = state.attemptCount[w.id] || 0;
      if (pogingen > 1) extraHerhalingen += pogingen - 1;
    }
    return {
      categoryName: state.categoryName,
      total, direct, minor, wrong, extraHerhalingen,
      struggleWoorden
    };
  }

  // ── Rendering ────────────────────────────────────────────────────────────
  function render() {
    if (!state) return;
    const beheerst = state.sessionMastered.size;
    const total = state.words.length;
    const pct = total === 0 ? 0 : Math.round((beheerst / total) * 100);

    let direct = 0, minor = 0, wrong = 0;
    Object.values(state.firstAttempt).forEach(r => {
      if (r === 'correct') direct++; else if (r === 'minor') minor++; else if (r === 'wrong') wrong++;
    });

    el.innerHTML = `
      <div class="oefen-view">
        <div class="oefen-topbar">
          <button class="oefen-terug" id="oefen-terug" type="button">← Categorieën</button>
          <div class="oefen-titel">${escapeHtml(state.categoryName)}</div>
          <div class="oefen-richting-badge">${RICHTING_LABEL[state.richting] || 'Gemengd'}</div>
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

        ${state.finished ? '' : renderWoordkaart()}
      </div>`;

    const terugKnop = document.getElementById('oefen-terug');
    if (terugKnop) terugKnop.addEventListener('click', () => { if (opts_terugCallback) opts_terugCallback(); });

    bindWoordkaartEvents();
  }

  let opts_terugCallback = null;

  function renderWoordkaart() {
    const woord = state.wordsById[state.currentWordId];
    const richting = state.richtingPerWoord[state.currentWordId];
    const { prompt } = promptEnAntwoord(woord, richting);

    return `
      <div class="woordkaart">
        <div class="woordkaart-label">${richting === 'pt-nl' ? 'Wat betekent dit?' : 'Vertaal naar het Portugees'}</div>
        <div class="woordkaart-prompt">${escapeHtml(prompt)}</div>
        <form id="antwoord-form" autocomplete="off">
          <input id="antwoord-input" class="antwoord-input" type="text"
                 autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"
                 placeholder="${richting === 'pt-nl' ? 'Typ de Nederlandse betekenis…' : 'Typ het Portugese woord…'}"
                 ${state.awaitingNext ? 'readonly' : ''}
                 value="${escapeHtml(state.awaitingNext ? state.lastUserAnswer : '')}">
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
      const accentHint = '<div class="fb-hint">Kleine spelfout: let op het accent.</div>';
      return `
        <div class="fb-titel">⚠️ Bijna goed</div>
        <div class="fb-rij"><span class="fb-label">Jouw antwoord</span><span class="fb-waarde fb-eigen">${escapeHtml(state.lastUserAnswer)}</span></div>
        <div class="fb-rij"><span class="fb-label">Correct</span><span class="fb-waarde fb-correct">${escapeHtml(state.lastMatchedAnswer)}</span></div>
        ${accentHint}`;
    }
    return `
      <div class="fb-titel">❌ Niet goed</div>
      <div class="fb-rij"><span class="fb-label">Jouw antwoord</span><span class="fb-waarde fb-eigen">${escapeHtml(state.lastUserAnswer || '—')}</span></div>
      <div class="fb-rij"><span class="fb-label">Correct</span><span class="fb-waarde fb-correct">${escapeHtml(state.lastMatchedAnswer)}</span></div>`;
  }

  function bindWoordkaartEvents() {
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
  }

  function escapeHtml(t) {
    const d = document.createElement('div');
    d.textContent = String(t == null ? '' : t);
    return d.innerHTML;
  }

  Portugees.StudySession = {
    start(container, opts) {
      opts_terugCallback = opts.onTerug || null;
      start(container, opts);
    }
  };
})();
