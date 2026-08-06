// ── Antwoord-classificatie (los van de UI, puur & testbaar) ─────────────────
// Vergelijkt een getypt antwoord met één of meer geaccepteerde antwoorden en
// geeft terug: 'correct' | 'minor' (kleine spelfout) | 'wrong'.
(function () {
  const Spaans = (window.Spaans = window.Spaans || {});

  function normalizeBasic(s) {
    return String(s == null ? '' : s).trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function stripAccents(s) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  // Standaard Levenshtein-afstand (aantal invoegen/verwijderen/vervangen).
  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    let prev = new Array(n + 1);
    let curr = new Array(n + 1);
    for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) {
      curr[0] = i;
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      }
      const tmp = prev; prev = curr; curr = tmp;
    }
    return prev[n];
  }

  // Hoeveel afwijking staan we toe, afhankelijk van de woordlengte? Bij korte
  // woorden is 1 letter verschil vaak al een ander woord, dus dan geen
  // coulance; bij langere woorden mag een enkele typefout best.
  function maxAllowedDistance(len) {
    if (len <= 3) return 0;
    if (len <= 9) return 1;
    return 2;
  }

  function classifyAgainstOne(userAnswer, accepted) {
    const u = normalizeBasic(userAnswer);
    const a = normalizeBasic(accepted);
    if (!u) return { result: 'wrong' };
    if (u === a) return { result: 'correct' };

    const uPlain = stripAccents(u);
    const aPlain = stripAccents(a);
    if (uPlain === aPlain) return { result: 'minor', reason: 'accent' };

    const dist = levenshtein(uPlain, aPlain);
    const allowed = maxAllowedDistance(aPlain.length);
    if (dist > 0 && dist <= allowed && dist / aPlain.length <= 0.3) {
      return { result: 'minor', reason: 'typo', distance: dist };
    }
    return { result: 'wrong' };
  }

  /**
   * @param {string} userAnswer
   * @param {string[]} acceptedAnswers - alle geaccepteerde varianten voor dit woord
   * @param {string[]} [otherKnownWords] - overige woorden uit de dataset (veiligheidsnet
   *   tegen het per ongeluk goedkeuren van een ander, écht bestaand woord)
   */
  function classifyAnswer(userAnswer, acceptedAnswers, otherKnownWords) {
    otherKnownWords = otherKnownWords || [];
    const uPlain = stripAccents(normalizeBasic(userAnswer));
    const otherPlainSet = new Set(otherKnownWords.map(w => stripAccents(normalizeBasic(w))));

    let best = { result: 'wrong' };
    for (const accepted of acceptedAnswers) {
      const r = classifyAgainstOne(userAnswer, accepted);
      if (r.result === 'correct') return { result: 'correct', matchedAnswer: accepted };
      if (r.result === 'minor' && best.result !== 'minor') {
        best = Object.assign({ matchedAnswer: accepted }, r);
      }
    }

    // Een ander, écht bestaand woord uit de dataset mag nooit als "bijna
    // goed" doorglippen, ook niet als de Levenshtein-afstand toevallig klein is.
    if (best.result === 'minor' && uPlain && otherPlainSet.has(uPlain)) {
      return { result: 'wrong' };
    }

    return best;
  }

  Spaans.Matching = { normalizeBasic, stripAccents, levenshtein, classifyAnswer };
})();
