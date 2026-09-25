// Gedeelde opslaghulp voor missie-1/2/3:
//  • betrouwbaar opslaan: Supabase geeft een fout TERUG (gooit hem niet), dus we
//    controleren 'error' zelf en proberen het bij haperende wifi stil opnieuw;
//  • concept: open antwoorden worden direct op het apparaat bewaard, zodat ze na
//    per ongeluk sluiten/verversen terugkomen;
//  • waarschuwing bij sluiten zolang er iets is ingevuld maar de missie niet is afgerond.

async function metHerhaling(actie, pogingen = 3) {
  let laatsteFout = null;
  for (let i = 0; i < pogingen; i++) {
    try {
      const { data, error } = await actie();
      if (!error) return data;
      laatsteFout = error;
    } catch (e) {
      laatsteFout = e;
    }
    if (i < pogingen - 1) await new Promise(r => setTimeout(r, 800 * (i + 1)));
  }
  throw laatsteFout || new Error('Opslaan mislukt');
}

function toonOpslaanFout(knop, tekst) {
  let el = document.getElementById('opslaanFout');
  if (!el) {
    el = document.createElement('div');
    el.id = 'opslaanFout';
    el.setAttribute('role', 'alert');
    el.style.cssText = 'background:rgba(229,62,62,.08);border:1.5px solid rgba(229,62,62,.3);border-radius:16px;' +
      'padding:14px 18px;margin:0 0 14px;color:#b91c1c;font-weight:700;font-size:15px;line-height:1.45';
    knop.parentNode.insertBefore(el, knop);
  }
  el.textContent = tekst || 'Het opslaan is niet gelukt. Controleer of jullie internet hebben en klik nog een keer op "Missie afronden". Jullie antwoorden zijn niet kwijt.';
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function verbergOpslaanFout() {
  const el = document.getElementById('opslaanFout');
  if (el) el.style.display = 'none';
}

// ── Concept op het apparaat ──────────────────────────────────────────────────
let _conceptSleutel = null;
let _ietsIngevuld = false;
let _missieAfgerond = false;

function startConcept(groepId, missieNr) {
  _conceptSleutel = `missie_concept_${groepId}_${missieNr}`;
  const velden = () => document.querySelectorAll('textarea.open-tekst');

  try {
    const bewaard = JSON.parse(localStorage.getItem(_conceptSleutel) || '{}');
    velden().forEach(v => {
      if (bewaard[v.id] && !v.value) { v.value = bewaard[v.id]; _ietsIngevuld = true; }
    });
    if (_ietsIngevuld && typeof checkAfronden === 'function') checkAfronden();
  } catch (e) {}

  document.addEventListener('input', e => {
    if (!e.target.matches || !e.target.matches('textarea.open-tekst')) return;
    _ietsIngevuld = true;
    const data = {};
    velden().forEach(v => { if (v.value) data[v.id] = v.value; });
    try { localStorage.setItem(_conceptSleutel, JSON.stringify(data)); } catch (e) {}
  });

  // Klikken op antwoordknoppen telt ook als "iets ingevuld" (niet: rondleiding, links)
  document.addEventListener('click', e => {
    const doel = e.target.closest && e.target.closest('button, [onclick]');
    if (doel && !doel.closest('a, [id^="tut"], .tut-help-btn')) _ietsIngevuld = true;
  });

  window.addEventListener('beforeunload', e => {
    if (_ietsIngevuld && !_missieAfgerond) { e.preventDefault(); e.returnValue = ''; }
  });
}

function missieOpgeslagen() {
  _missieAfgerond = true;
  try { if (_conceptSleutel) localStorage.removeItem(_conceptSleutel); } catch (e) {}
}
