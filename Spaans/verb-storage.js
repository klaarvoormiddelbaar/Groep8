// ── Voortgang per werkwoordvorm, blijvend opgeslagen in localStorage ────────
// Los van storage.js (woorden), maar dezelfde aanpak: item-key = "verbId:tijd:persoonIndex".
(function () {
  const Spaans = (window.Spaans = window.Spaans || {});
  const OPSLAG_SLEUTEL = 'kvm_spaans_werkwoorden_voortgang_v1';
  const TIJD_SLEUTEL = 'kvm_spaans_werkwoorden_tijd_v1';
  const TIJDEN = Object.keys(SPAANS_TIJDEN);

  function itemKey(verbId, tense, personIdx) {
    return verbId + ':' + tense + ':' + personIdx;
  }

  function leegStat() {
    return {
      timesStudied: 0,
      timesCorrect: 0,
      timesMinor: 0,
      timesWrong: 0,
      everCorrect: false,
      lastStudied: null,
      inMistakesBox: false,
      mistakesStreak: 0
    };
  }

  function laadAlles() {
    try {
      const raw = localStorage.getItem(OPSLAG_SLEUTEL);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function slaAllesOp(alles) {
    try {
      localStorage.setItem(OPSLAG_SLEUTEL, JSON.stringify(alles));
    } catch (e) {
      // localStorage niet beschikbaar (bijv. privémodus) — voortgang gaat dan
      // niet verloren binnen de sessie, alleen niet bewaard tussen bezoeken.
    }
  }

  function getStat(key) {
    const alles = laadAlles();
    return alles[key] ? Object.assign(leegStat(), alles[key]) : leegStat();
  }

  function getAlleStats() {
    return laadAlles();
  }

  /**
   * @param {string} key - itemKey(verbId, tense, personIdx)
   * @param {'correct'|'minor'|'wrong'} result
   */
  function verwerkResultaat(key, result) {
    const alles = laadAlles();
    const stat = alles[key] ? Object.assign(leegStat(), alles[key]) : leegStat();

    stat.timesStudied += 1;
    stat.lastStudied = new Date().toISOString();

    if (result === 'correct') stat.timesCorrect += 1;
    else if (result === 'minor') stat.timesMinor += 1;
    else stat.timesWrong += 1;

    if (result === 'correct' || result === 'minor') {
      stat.everCorrect = true;
      if (stat.inMistakesBox) {
        stat.mistakesStreak += 1;
        if (stat.mistakesStreak >= 3) {
          stat.inMistakesBox = false;
          stat.mistakesStreak = 0;
        }
      }
    } else {
      stat.inMistakesBox = true;
      stat.mistakesStreak = 0;
    }

    alles[key] = stat;
    slaAllesOp(alles);
    return stat;
  }

  const HERKEN_TIJDEN = typeof SPAANS_HERKEN_TIJDEN !== 'undefined' ? Object.keys(SPAANS_HERKEN_TIJDEN) : [];

  /**
   * @param {Array<object>} verbs - werkwoorden uit een groep
   * @param {string} tenseFilter - één van SPAANS_TIJDEN, SPAANS_HERKEN_TIJDEN, 'gemengd' of 'herken_gemengd'
   * @returns {{ learned:number, total:number, percent:number, status:'nieuw'|'bezig'|'beheerst' }}
   */
  function getGroepVoortgang(verbs, tenseFilter) {
    const alles = laadAlles();
    const tijden = tenseFilter === 'gemengd' ? TIJDEN
      : tenseFilter === 'herken_gemengd' ? HERKEN_TIJDEN
      : [tenseFilter];
    let total = 0, learned = 0;
    for (const v of verbs) {
      for (const tijd of tijden) {
        for (let p = 0; p < SPAANS_PERSONEN.length; p++) {
          if (tijd === 'gebiedende_wijs' && p === 0) continue; // geen yo-vorm
          total += 1;
          const key = itemKey(v.id, tijd, p);
          if (alles[key] && alles[key].everCorrect) learned += 1;
        }
      }
    }
    const percent = total === 0 ? 0 : Math.round((learned / total) * 100);
    let status = 'nieuw';
    if (learned > 0 && learned < total) status = 'bezig';
    else if (learned === total && total > 0) status = 'beheerst';
    return { learned, total, percent, status };
  }

  /**
   * @param {Array<object>} alleWerkwoorden
   * @returns {Array<{verb:object, tense:string, personIdx:number}>}
   */
  function getFouteVormen(alleWerkwoorden) {
    const alles = laadAlles();
    const woordenById = Object.fromEntries(alleWerkwoorden.map(v => [String(v.id), v]));
    const resultaat = [];
    for (const key of Object.keys(alles)) {
      if (!alles[key].inMistakesBox) continue;
      const [verbId, tense, personIdxStr] = key.split(':');
      const verb = woordenById[verbId];
      if (!verb) continue;
      resultaat.push({ verb, tense, personIdx: Number(personIdxStr) });
    }
    return resultaat;
  }

  function getTijd() {
    try {
      const t = localStorage.getItem(TIJD_SLEUTEL);
      const geldig = t === 'gemengd' || t === 'herken_gemengd' || SPAANS_TIJDEN[t] || (typeof SPAANS_HERKEN_TIJDEN !== 'undefined' && SPAANS_HERKEN_TIJDEN[t]);
      return t && geldig ? t : 'presente';
    } catch (e) {
      return 'presente';
    }
  }

  function setTijd(tijd) {
    try {
      localStorage.setItem(TIJD_SLEUTEL, tijd);
    } catch (e) {}
  }

  Spaans.VerbStorage = {
    itemKey,
    getStat,
    getAlleStats,
    verwerkResultaat,
    getGroepVoortgang,
    getFouteVormen,
    getTijd,
    setTijd
  };
})();
