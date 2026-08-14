// ── Voortgang per woord, blijvend opgeslagen in localStorage ────────────────
// Blijft bewaard tussen sessies (en tussen bezoeken) op dit apparaat, zodat
// het "foute woorden"-overzicht en de categorie-voortgang niet verloren gaan
// als je de pagina sluit.
(function () {
  const Portugees = (window.Portugees = window.Portugees || {});
  const OPSLAG_SLEUTEL = 'kvm_portugees_voortgang_v1';
  const RICHTING_SLEUTEL = 'kvm_portugees_richting_v1';

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

  function getStat(wordId) {
    const alles = laadAlles();
    return alles[wordId] ? Object.assign(leegStat(), alles[wordId]) : leegStat();
  }

  function getAlleStats() {
    return laadAlles();
  }

  /**
   * Verwerkt het resultaat van één beantwoording en werkt de langdurige
   * voortgang van dat woord bij (incl. de "foute woorden"-status).
   * @param {number|string} wordId
   * @param {'correct'|'minor'|'wrong'} result
   */
  function verwerkResultaat(wordId, result) {
    const alles = laadAlles();
    const stat = alles[wordId] ? Object.assign(leegStat(), alles[wordId]) : leegStat();

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

    alles[wordId] = stat;
    slaAllesOp(alles);
    return stat;
  }

  /**
   * @param {Array<{id:number}>} categorieWoorden
   * @returns {{ learned:number, total:number, percent:number, status:'nieuw'|'bezig'|'beheerst' }}
   */
  function getCategorieVoortgang(categorieWoorden) {
    const alles = laadAlles();
    const total = categorieWoorden.length;
    let learned = 0;
    for (const w of categorieWoorden) {
      if (alles[w.id] && alles[w.id].everCorrect) learned += 1;
    }
    const percent = total === 0 ? 0 : Math.round((learned / total) * 100);
    let status = 'nieuw';
    if (learned > 0 && learned < total) status = 'bezig';
    else if (learned === total && total > 0) status = 'beheerst';
    return { learned, total, percent, status };
  }

  /**
   * @param {Array<object>} alleWoorden - volledige woordenlijst
   * @returns {Array<object>} de woorden die nu in de "foute woorden"-box zitten
   */
  function getFouteWoorden(alleWoorden) {
    const alles = laadAlles();
    return alleWoorden.filter(w => alles[w.id] && alles[w.id].inMistakesBox);
  }

  function getRichting() {
    try {
      return localStorage.getItem(RICHTING_SLEUTEL) || 'nl-pt';
    } catch (e) {
      return 'nl-pt';
    }
  }

  function setRichting(richting) {
    try {
      localStorage.setItem(RICHTING_SLEUTEL, richting);
    } catch (e) {}
  }

  Portugees.Storage = {
    getStat,
    getAlleStats,
    verwerkResultaat,
    getCategorieVoortgang,
    getFouteWoorden,
    getRichting,
    setRichting
  };
})();
