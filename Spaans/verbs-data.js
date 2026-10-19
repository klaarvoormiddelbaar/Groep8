// ── Werkwoordendata: handmatig samengesteld (geen Excel-bron) ───────────────
// Persoonvolgorde is altijd: yo, tú, él/ella/usted, nosotros, vosotros, ellos/ellas/ustedes
const SPAANS_PERSONEN = ['yo', 'tú', 'él/ella/usted', 'nosotros', 'vosotros', 'ellos/ellas/ustedes'];

const SPAANS_TIJDEN = {
  presente: { label: 'Presente', sub: 'tegenwoordige tijd' },
  futuro: { label: 'Futuro', sub: 'toekomende tijd' },
  imperfecto: { label: 'Imperfecto', sub: 'onvoltooid verleden tijd' },
  indefinido: { label: 'Indefinido', sub: 'voltooid verleden tijd' },
  gebiedende_wijs: { label: 'Gebiedende wijs', sub: 'bevel, verzoek (geen yo-vorm)' }
};

// Herkenningsoefening: alleen Spaans → Nederlands, geen zelf vervoegen.
// Dit zijn de 5 bekendste nog niet geoefende tijden na de 5 hierboven.
const SPAANS_HERKEN_TIJDEN = {
  perfecto: { label: 'Pretérito perfecto', sub: 'voltooid tegenwoordige tijd' },
  condicional: { label: 'Condicional', sub: 'zou + werkwoord' },
  subjuntivo: { label: 'Presente subjuntivo', sub: 'aanvoegende wijs' },
  continuo: { label: 'Presente continuo', sub: 'bezig met...' },
  pluscuamperfecto: { label: 'Pretérito pluscuamperfecto', sub: 'voltooid verleden tijd' }
};

const SPAANS_WERKWOORDGROEPEN = {
  'ar-regelmatig': 'Regelmatige -ar werkwoorden',
  'er-regelmatig': 'Regelmatige -er werkwoorden',
  'ir-regelmatig': 'Regelmatige -ir werkwoorden',
  onregelmatig: 'Onregelmatige werkwoorden'
};

const SPAANS_WERKWOORDEN = [
  // ── Regelmatige -ar werkwoorden ──
  {
    id: 1, infinitive: 'hablar', dutch: 'praten, spreken', group: 'ar-regelmatig',
    conjugations: {
      presente: ['hablo', 'hablas', 'habla', 'hablamos', 'habláis', 'hablan'],
      futuro: ['hablaré', 'hablarás', 'hablará', 'hablaremos', 'hablaréis', 'hablarán'],
      imperfecto: ['hablaba', 'hablabas', 'hablaba', 'hablábamos', 'hablabais', 'hablaban'],
      indefinido: ['hablé', 'hablaste', 'habló', 'hablamos', 'hablasteis', 'hablaron'],
      gebiedende_wijs: [null, 'habla', 'hable', 'hablemos', 'hablad', 'hablen']
    },
    herkennen: {
      perfecto: ['he hablado', 'has hablado', 'ha hablado', 'hemos hablado', 'habéis hablado', 'han hablado'],
      condicional: ['hablaría', 'hablarías', 'hablaría', 'hablaríamos', 'hablaríais', 'hablarían'],
      subjuntivo: ['hable', 'hables', 'hable', 'hablemos', 'habléis', 'hablen'],
      continuo: ['estoy hablando', 'estás hablando', 'está hablando', 'estamos hablando', 'estáis hablando', 'están hablando'],
      pluscuamperfecto: ['había hablado', 'habías hablado', 'había hablado', 'habíamos hablado', 'habíais hablado', 'habían hablado']
    },
    herkennenNl: {
      perfecto: ['heb gepraat', 'hebt gepraat', 'heeft gepraat', 'hebben gepraat', 'hebben gepraat', 'hebben gepraat'],
      condicional: ['zou praten', 'zou praten', 'zou praten', 'zouden praten', 'zouden praten', 'zouden praten'],
      subjuntivo: ['praat', 'praat', 'praat', 'praten', 'praten', 'praten'],
      continuo: ['ben aan het praten', 'bent aan het praten', 'is aan het praten', 'zijn aan het praten', 'zijn aan het praten', 'zijn aan het praten'],
      pluscuamperfecto: ['had gepraat', 'had gepraat', 'had gepraat', 'hadden gepraat', 'hadden gepraat', 'hadden gepraat']
    }
  },
  {
    id: 2, infinitive: 'trabajar', dutch: 'werken', group: 'ar-regelmatig',
    conjugations: {
      presente: ['trabajo', 'trabajas', 'trabaja', 'trabajamos', 'trabajáis', 'trabajan'],
      futuro: ['trabajaré', 'trabajarás', 'trabajará', 'trabajaremos', 'trabajaréis', 'trabajarán'],
      imperfecto: ['trabajaba', 'trabajabas', 'trabajaba', 'trabajábamos', 'trabajabais', 'trabajaban'],
      indefinido: ['trabajé', 'trabajaste', 'trabajó', 'trabajamos', 'trabajasteis', 'trabajaron'],
      gebiedende_wijs: [null, 'trabaja', 'trabaje', 'trabajemos', 'trabajad', 'trabajen']
    },
    herkennen: {
      perfecto: ['he trabajado', 'has trabajado', 'ha trabajado', 'hemos trabajado', 'habéis trabajado', 'han trabajado'],
      condicional: ['trabajaría', 'trabajarías', 'trabajaría', 'trabajaríamos', 'trabajaríais', 'trabajarían'],
      subjuntivo: ['trabaje', 'trabajes', 'trabaje', 'trabajemos', 'trabajéis', 'trabajen'],
      continuo: ['estoy trabajando', 'estás trabajando', 'está trabajando', 'estamos trabajando', 'estáis trabajando', 'están trabajando'],
      pluscuamperfecto: ['había trabajado', 'habías trabajado', 'había trabajado', 'habíamos trabajado', 'habíais trabajado', 'habían trabajado']
    },
    herkennenNl: {
      perfecto: ['heb gewerkt', 'hebt gewerkt', 'heeft gewerkt', 'hebben gewerkt', 'hebben gewerkt', 'hebben gewerkt'],
      condicional: ['zou werken', 'zou werken', 'zou werken', 'zouden werken', 'zouden werken', 'zouden werken'],
      subjuntivo: ['werk', 'werkt', 'werkt', 'werken', 'werken', 'werken'],
      continuo: ['ben aan het werken', 'bent aan het werken', 'is aan het werken', 'zijn aan het werken', 'zijn aan het werken', 'zijn aan het werken'],
      pluscuamperfecto: ['had gewerkt', 'had gewerkt', 'had gewerkt', 'hadden gewerkt', 'hadden gewerkt', 'hadden gewerkt']
    }
  },
  {
    id: 3, infinitive: 'estudiar', dutch: 'studeren', group: 'ar-regelmatig',
    conjugations: {
      presente: ['estudio', 'estudias', 'estudia', 'estudiamos', 'estudiáis', 'estudian'],
      futuro: ['estudiaré', 'estudiarás', 'estudiará', 'estudiaremos', 'estudiaréis', 'estudiarán'],
      imperfecto: ['estudiaba', 'estudiabas', 'estudiaba', 'estudiábamos', 'estudiabais', 'estudiaban'],
      indefinido: ['estudié', 'estudiaste', 'estudió', 'estudiamos', 'estudiasteis', 'estudiaron'],
      gebiedende_wijs: [null, 'estudia', 'estudie', 'estudiemos', 'estudiad', 'estudien']
    },
    herkennen: {
      perfecto: ['he estudiado', 'has estudiado', 'ha estudiado', 'hemos estudiado', 'habéis estudiado', 'han estudiado'],
      condicional: ['estudiaría', 'estudiarías', 'estudiaría', 'estudiaríamos', 'estudiaríais', 'estudiarían'],
      subjuntivo: ['estudie', 'estudies', 'estudie', 'estudiemos', 'estudiéis', 'estudien'],
      continuo: ['estoy estudiando', 'estás estudiando', 'está estudiando', 'estamos estudiando', 'estáis estudiando', 'están estudiando'],
      pluscuamperfecto: ['había estudiado', 'habías estudiado', 'había estudiado', 'habíamos estudiado', 'habíais estudiado', 'habían estudiado']
    },
    herkennenNl: {
      perfecto: ['heb gestudeerd', 'hebt gestudeerd', 'heeft gestudeerd', 'hebben gestudeerd', 'hebben gestudeerd', 'hebben gestudeerd'],
      condicional: ['zou studeren', 'zou studeren', 'zou studeren', 'zouden studeren', 'zouden studeren', 'zouden studeren'],
      subjuntivo: ['studeer', 'studeert', 'studeert', 'studeren', 'studeren', 'studeren'],
      continuo: ['ben aan het studeren', 'bent aan het studeren', 'is aan het studeren', 'zijn aan het studeren', 'zijn aan het studeren', 'zijn aan het studeren'],
      pluscuamperfecto: ['had gestudeerd', 'had gestudeerd', 'had gestudeerd', 'hadden gestudeerd', 'hadden gestudeerd', 'hadden gestudeerd']
    }
  },
  {
    id: 4, infinitive: 'comprar', dutch: 'kopen', group: 'ar-regelmatig',
    conjugations: {
      presente: ['compro', 'compras', 'compra', 'compramos', 'compráis', 'compran'],
      futuro: ['compraré', 'comprarás', 'comprará', 'compraremos', 'compraréis', 'comprarán'],
      imperfecto: ['compraba', 'comprabas', 'compraba', 'comprábamos', 'comprabais', 'compraban'],
      indefinido: ['compré', 'compraste', 'compró', 'compramos', 'comprasteis', 'compraron'],
      gebiedende_wijs: [null, 'compra', 'compre', 'compremos', 'comprad', 'compren']
    },
    herkennen: {
      perfecto: ['he comprado', 'has comprado', 'ha comprado', 'hemos comprado', 'habéis comprado', 'han comprado'],
      condicional: ['compraría', 'comprarías', 'compraría', 'compraríamos', 'compraríais', 'comprarían'],
      subjuntivo: ['compre', 'compres', 'compre', 'compremos', 'compréis', 'compren'],
      continuo: ['estoy comprando', 'estás comprando', 'está comprando', 'estamos comprando', 'estáis comprando', 'están comprando'],
      pluscuamperfecto: ['había comprado', 'habías comprado', 'había comprado', 'habíamos comprado', 'habíais comprado', 'habían comprado']
    },
    herkennenNl: {
      perfecto: ['heb gekocht', 'hebt gekocht', 'heeft gekocht', 'hebben gekocht', 'hebben gekocht', 'hebben gekocht'],
      condicional: ['zou kopen', 'zou kopen', 'zou kopen', 'zouden kopen', 'zouden kopen', 'zouden kopen'],
      subjuntivo: ['koop', 'koopt', 'koopt', 'kopen', 'kopen', 'kopen'],
      continuo: ['ben aan het kopen', 'bent aan het kopen', 'is aan het kopen', 'zijn aan het kopen', 'zijn aan het kopen', 'zijn aan het kopen'],
      pluscuamperfecto: ['had gekocht', 'had gekocht', 'had gekocht', 'hadden gekocht', 'hadden gekocht', 'hadden gekocht']
    }
  },
  {
    id: 5, infinitive: 'escuchar', dutch: 'luisteren', group: 'ar-regelmatig',
    conjugations: {
      presente: ['escucho', 'escuchas', 'escucha', 'escuchamos', 'escucháis', 'escuchan'],
      futuro: ['escucharé', 'escucharás', 'escuchará', 'escucharemos', 'escucharéis', 'escucharán'],
      imperfecto: ['escuchaba', 'escuchabas', 'escuchaba', 'escuchábamos', 'escuchabais', 'escuchaban'],
      indefinido: ['escuché', 'escuchaste', 'escuchó', 'escuchamos', 'escuchasteis', 'escucharon'],
      gebiedende_wijs: [null, 'escucha', 'escuche', 'escuchemos', 'escuchad', 'escuchen']
    },
    herkennen: {
      perfecto: ['he escuchado', 'has escuchado', 'ha escuchado', 'hemos escuchado', 'habéis escuchado', 'han escuchado'],
      condicional: ['escucharía', 'escucharías', 'escucharía', 'escucharíamos', 'escucharíais', 'escucharían'],
      subjuntivo: ['escuche', 'escuches', 'escuche', 'escuchemos', 'escuchéis', 'escuchen'],
      continuo: ['estoy escuchando', 'estás escuchando', 'está escuchando', 'estamos escuchando', 'estáis escuchando', 'están escuchando'],
      pluscuamperfecto: ['había escuchado', 'habías escuchado', 'había escuchado', 'habíamos escuchado', 'habíais escuchado', 'habían escuchado']
    },
    herkennenNl: {
      perfecto: ['heb geluisterd', 'hebt geluisterd', 'heeft geluisterd', 'hebben geluisterd', 'hebben geluisterd', 'hebben geluisterd'],
      condicional: ['zou luisteren', 'zou luisteren', 'zou luisteren', 'zouden luisteren', 'zouden luisteren', 'zouden luisteren'],
      subjuntivo: ['luister', 'luistert', 'luistert', 'luisteren', 'luisteren', 'luisteren'],
      continuo: ['ben aan het luisteren', 'bent aan het luisteren', 'is aan het luisteren', 'zijn aan het luisteren', 'zijn aan het luisteren', 'zijn aan het luisteren'],
      pluscuamperfecto: ['had geluisterd', 'had geluisterd', 'had geluisterd', 'hadden geluisterd', 'hadden geluisterd', 'hadden geluisterd']
    }
  },
  {
    id: 6, infinitive: 'mirar', dutch: 'kijken', group: 'ar-regelmatig',
    conjugations: {
      presente: ['miro', 'miras', 'mira', 'miramos', 'miráis', 'miran'],
      futuro: ['miraré', 'mirarás', 'mirará', 'miraremos', 'miraréis', 'mirarán'],
      imperfecto: ['miraba', 'mirabas', 'miraba', 'mirábamos', 'mirabais', 'miraban'],
      indefinido: ['miré', 'miraste', 'miró', 'miramos', 'mirasteis', 'miraron'],
      gebiedende_wijs: [null, 'mira', 'mire', 'miremos', 'mirad', 'miren']
    },
    herkennen: {
      perfecto: ['he mirado', 'has mirado', 'ha mirado', 'hemos mirado', 'habéis mirado', 'han mirado'],
      condicional: ['miraría', 'mirarías', 'miraría', 'miraríamos', 'miraríais', 'mirarían'],
      subjuntivo: ['mire', 'mires', 'mire', 'miremos', 'miréis', 'miren'],
      continuo: ['estoy mirando', 'estás mirando', 'está mirando', 'estamos mirando', 'estáis mirando', 'están mirando'],
      pluscuamperfecto: ['había mirado', 'habías mirado', 'había mirado', 'habíamos mirado', 'habíais mirado', 'habían mirado']
    },
    herkennenNl: {
      perfecto: ['heb gekeken', 'hebt gekeken', 'heeft gekeken', 'hebben gekeken', 'hebben gekeken', 'hebben gekeken'],
      condicional: ['zou kijken', 'zou kijken', 'zou kijken', 'zouden kijken', 'zouden kijken', 'zouden kijken'],
      subjuntivo: ['kijk', 'kijkt', 'kijkt', 'kijken', 'kijken', 'kijken'],
      continuo: ['ben aan het kijken', 'bent aan het kijken', 'is aan het kijken', 'zijn aan het kijken', 'zijn aan het kijken', 'zijn aan het kijken'],
      pluscuamperfecto: ['had gekeken', 'had gekeken', 'had gekeken', 'hadden gekeken', 'hadden gekeken', 'hadden gekeken']
    }
  },
  {
    id: 7, infinitive: 'necesitar', dutch: 'nodig hebben', group: 'ar-regelmatig',
    conjugations: {
      presente: ['necesito', 'necesitas', 'necesita', 'necesitamos', 'necesitáis', 'necesitan'],
      futuro: ['necesitaré', 'necesitarás', 'necesitará', 'necesitaremos', 'necesitaréis', 'necesitarán'],
      imperfecto: ['necesitaba', 'necesitabas', 'necesitaba', 'necesitábamos', 'necesitabais', 'necesitaban'],
      indefinido: ['necesité', 'necesitaste', 'necesitó', 'necesitamos', 'necesitasteis', 'necesitaron'],
      gebiedende_wijs: [null, 'necesita', 'necesite', 'necesitemos', 'necesitad', 'necesiten']
    },
    herkennen: {
      perfecto: ['he necesitado', 'has necesitado', 'ha necesitado', 'hemos necesitado', 'habéis necesitado', 'han necesitado'],
      condicional: ['necesitaría', 'necesitarías', 'necesitaría', 'necesitaríamos', 'necesitaríais', 'necesitarían'],
      subjuntivo: ['necesite', 'necesites', 'necesite', 'necesitemos', 'necesitéis', 'necesiten'],
      continuo: ['estoy necesitando', 'estás necesitando', 'está necesitando', 'estamos necesitando', 'estáis necesitando', 'están necesitando'],
      pluscuamperfecto: ['había necesitado', 'habías necesitado', 'había necesitado', 'habíamos necesitado', 'habíais necesitado', 'habían necesitado']
    },
    herkennenNl: {
      perfecto: ['heb nodig gehad', 'hebt nodig gehad', 'heeft nodig gehad', 'hebben nodig gehad', 'hebben nodig gehad', 'hebben nodig gehad'],
      condicional: ['zou nodig hebben', 'zou nodig hebben', 'zou nodig hebben', 'zouden nodig hebben', 'zouden nodig hebben', 'zouden nodig hebben'],
      subjuntivo: ['heb nodig', 'heeft nodig', 'heeft nodig', 'nodig hebben', 'nodig hebben', 'nodig hebben'],
      continuo: ['ben aan het nodig hebben', 'bent aan het nodig hebben', 'is aan het nodig hebben', 'zijn aan het nodig hebben', 'zijn aan het nodig hebben', 'zijn aan het nodig hebben'],
      pluscuamperfecto: ['had nodig gehad', 'had nodig gehad', 'had nodig gehad', 'hadden nodig gehad', 'hadden nodig gehad', 'hadden nodig gehad']
    }
  },
  {
    id: 8, infinitive: 'llegar', dutch: 'aankomen', group: 'ar-regelmatig',
    conjugations: {
      presente: ['llego', 'llegas', 'llega', 'llegamos', 'llegáis', 'llegan'],
      futuro: ['llegaré', 'llegarás', 'llegará', 'llegaremos', 'llegaréis', 'llegarán'],
      imperfecto: ['llegaba', 'llegabas', 'llegaba', 'llegábamos', 'llegabais', 'llegaban'],
      indefinido: ['llegué', 'llegaste', 'llegó', 'llegamos', 'llegasteis', 'llegaron'],
      gebiedende_wijs: [null, 'llega', 'llegue', 'lleguemos', 'llegad', 'lleguen']
    },
    herkennen: {
      perfecto: ['he llegado', 'has llegado', 'ha llegado', 'hemos llegado', 'habéis llegado', 'han llegado'],
      condicional: ['llegaría', 'llegarías', 'llegaría', 'llegaríamos', 'llegaríais', 'llegarían'],
      subjuntivo: ['llegue', 'llegues', 'llegue', 'lleguemos', 'lleguéis', 'lleguen'],
      continuo: ['estoy llegando', 'estás llegando', 'está llegando', 'estamos llegando', 'estáis llegando', 'están llegando'],
      pluscuamperfecto: ['había llegado', 'habías llegado', 'había llegado', 'habíamos llegado', 'habíais llegado', 'habían llegado']
    },
    herkennenNl: {
      perfecto: ['ben aangekomen', 'bent aangekomen', 'is aangekomen', 'zijn aangekomen', 'zijn aangekomen', 'zijn aangekomen'],
      condicional: ['zou aankomen', 'zou aankomen', 'zou aankomen', 'zouden aankomen', 'zouden aankomen', 'zouden aankomen'],
      subjuntivo: ['kom aan', 'komt aan', 'komt aan', 'aankomen', 'aankomen', 'aankomen'],
      continuo: ['ben aan het aankomen', 'bent aan het aankomen', 'is aan het aankomen', 'zijn aan het aankomen', 'zijn aan het aankomen', 'zijn aan het aankomen'],
      pluscuamperfecto: ['was aangekomen', 'was aangekomen', 'was aangekomen', 'waren aangekomen', 'waren aangekomen', 'waren aangekomen']
    }
  },

  // ── Regelmatige -er werkwoorden ──
  {
    id: 9, infinitive: 'comer', dutch: 'eten', group: 'er-regelmatig',
    conjugations: {
      presente: ['como', 'comes', 'come', 'comemos', 'coméis', 'comen'],
      futuro: ['comeré', 'comerás', 'comerá', 'comeremos', 'comeréis', 'comerán'],
      imperfecto: ['comía', 'comías', 'comía', 'comíamos', 'comíais', 'comían'],
      indefinido: ['comí', 'comiste', 'comió', 'comimos', 'comisteis', 'comieron'],
      gebiedende_wijs: [null, 'come', 'coma', 'comamos', 'comed', 'coman']
    },
    herkennen: {
      perfecto: ['he comido', 'has comido', 'ha comido', 'hemos comido', 'habéis comido', 'han comido'],
      condicional: ['comería', 'comerías', 'comería', 'comeríamos', 'comeríais', 'comerían'],
      subjuntivo: ['coma', 'comas', 'coma', 'comamos', 'comáis', 'coman'],
      continuo: ['estoy comiendo', 'estás comiendo', 'está comiendo', 'estamos comiendo', 'estáis comiendo', 'están comiendo'],
      pluscuamperfecto: ['había comido', 'habías comido', 'había comido', 'habíamos comido', 'habíais comido', 'habían comido']
    },
    herkennenNl: {
      perfecto: ['heb gegeten', 'hebt gegeten', 'heeft gegeten', 'hebben gegeten', 'hebben gegeten', 'hebben gegeten'],
      condicional: ['zou eten', 'zou eten', 'zou eten', 'zouden eten', 'zouden eten', 'zouden eten'],
      subjuntivo: ['eet', 'eet', 'eet', 'eten', 'eten', 'eten'],
      continuo: ['ben aan het eten', 'bent aan het eten', 'is aan het eten', 'zijn aan het eten', 'zijn aan het eten', 'zijn aan het eten'],
      pluscuamperfecto: ['had gegeten', 'had gegeten', 'had gegeten', 'hadden gegeten', 'hadden gegeten', 'hadden gegeten']
    }
  },
  {
    id: 10, infinitive: 'beber', dutch: 'drinken', group: 'er-regelmatig',
    conjugations: {
      presente: ['bebo', 'bebes', 'bebe', 'bebemos', 'bebéis', 'beben'],
      futuro: ['beberé', 'beberás', 'beberá', 'beberemos', 'beberéis', 'beberán'],
      imperfecto: ['bebía', 'bebías', 'bebía', 'bebíamos', 'bebíais', 'bebían'],
      indefinido: ['bebí', 'bebiste', 'bebió', 'bebimos', 'bebisteis', 'bebieron'],
      gebiedende_wijs: [null, 'bebe', 'beba', 'bebamos', 'bebed', 'beban']
    },
    herkennen: {
      perfecto: ['he bebido', 'has bebido', 'ha bebido', 'hemos bebido', 'habéis bebido', 'han bebido'],
      condicional: ['bebería', 'beberías', 'bebería', 'beberíamos', 'beberíais', 'beberían'],
      subjuntivo: ['beba', 'bebas', 'beba', 'bebamos', 'bebáis', 'beban'],
      continuo: ['estoy bebiendo', 'estás bebiendo', 'está bebiendo', 'estamos bebiendo', 'estáis bebiendo', 'están bebiendo'],
      pluscuamperfecto: ['había bebido', 'habías bebido', 'había bebido', 'habíamos bebido', 'habíais bebido', 'habían bebido']
    },
    herkennenNl: {
      perfecto: ['heb gedronken', 'hebt gedronken', 'heeft gedronken', 'hebben gedronken', 'hebben gedronken', 'hebben gedronken'],
      condicional: ['zou drinken', 'zou drinken', 'zou drinken', 'zouden drinken', 'zouden drinken', 'zouden drinken'],
      subjuntivo: ['drink', 'drinkt', 'drinkt', 'drinken', 'drinken', 'drinken'],
      continuo: ['ben aan het drinken', 'bent aan het drinken', 'is aan het drinken', 'zijn aan het drinken', 'zijn aan het drinken', 'zijn aan het drinken'],
      pluscuamperfecto: ['had gedronken', 'had gedronken', 'had gedronken', 'hadden gedronken', 'hadden gedronken', 'hadden gedronken']
    }
  },
  {
    id: 11, infinitive: 'aprender', dutch: 'leren', group: 'er-regelmatig',
    conjugations: {
      presente: ['aprendo', 'aprendes', 'aprende', 'aprendemos', 'aprendéis', 'aprenden'],
      futuro: ['aprenderé', 'aprenderás', 'aprenderá', 'aprenderemos', 'aprenderéis', 'aprenderán'],
      imperfecto: ['aprendía', 'aprendías', 'aprendía', 'aprendíamos', 'aprendíais', 'aprendían'],
      indefinido: ['aprendí', 'aprendiste', 'aprendió', 'aprendimos', 'aprendisteis', 'aprendieron'],
      gebiedende_wijs: [null, 'aprende', 'aprenda', 'aprendamos', 'aprended', 'aprendan']
    },
    herkennen: {
      perfecto: ['he aprendido', 'has aprendido', 'ha aprendido', 'hemos aprendido', 'habéis aprendido', 'han aprendido'],
      condicional: ['aprendería', 'aprenderías', 'aprendería', 'aprenderíamos', 'aprenderíais', 'aprenderían'],
      subjuntivo: ['aprenda', 'aprendas', 'aprenda', 'aprendamos', 'aprendáis', 'aprendan'],
      continuo: ['estoy aprendiendo', 'estás aprendiendo', 'está aprendiendo', 'estamos aprendiendo', 'estáis aprendiendo', 'están aprendiendo'],
      pluscuamperfecto: ['había aprendido', 'habías aprendido', 'había aprendido', 'habíamos aprendido', 'habíais aprendido', 'habían aprendido']
    },
    herkennenNl: {
      perfecto: ['heb geleerd', 'hebt geleerd', 'heeft geleerd', 'hebben geleerd', 'hebben geleerd', 'hebben geleerd'],
      condicional: ['zou leren', 'zou leren', 'zou leren', 'zouden leren', 'zouden leren', 'zouden leren'],
      subjuntivo: ['leer', 'leert', 'leert', 'leren', 'leren', 'leren'],
      continuo: ['ben aan het leren', 'bent aan het leren', 'is aan het leren', 'zijn aan het leren', 'zijn aan het leren', 'zijn aan het leren'],
      pluscuamperfecto: ['had geleerd', 'had geleerd', 'had geleerd', 'hadden geleerd', 'hadden geleerd', 'hadden geleerd']
    }
  },
  {
    id: 12, infinitive: 'correr', dutch: 'rennen', group: 'er-regelmatig',
    conjugations: {
      presente: ['corro', 'corres', 'corre', 'corremos', 'corréis', 'corren'],
      futuro: ['correré', 'correrás', 'correrá', 'correremos', 'correréis', 'correrán'],
      imperfecto: ['corría', 'corrías', 'corría', 'corríamos', 'corríais', 'corrían'],
      indefinido: ['corrí', 'corriste', 'corrió', 'corrimos', 'corristeis', 'corrieron'],
      gebiedende_wijs: [null, 'corre', 'corra', 'corramos', 'corred', 'corran']
    },
    herkennen: {
      perfecto: ['he corrido', 'has corrido', 'ha corrido', 'hemos corrido', 'habéis corrido', 'han corrido'],
      condicional: ['correría', 'correrías', 'correría', 'correríamos', 'correríais', 'correrían'],
      subjuntivo: ['corra', 'corras', 'corra', 'corramos', 'corráis', 'corran'],
      continuo: ['estoy corriendo', 'estás corriendo', 'está corriendo', 'estamos corriendo', 'estáis corriendo', 'están corriendo'],
      pluscuamperfecto: ['había corrido', 'habías corrido', 'había corrido', 'habíamos corrido', 'habíais corrido', 'habían corrido']
    },
    herkennenNl: {
      perfecto: ['heb gerend', 'hebt gerend', 'heeft gerend', 'hebben gerend', 'hebben gerend', 'hebben gerend'],
      condicional: ['zou rennen', 'zou rennen', 'zou rennen', 'zouden rennen', 'zouden rennen', 'zouden rennen'],
      subjuntivo: ['ren', 'rent', 'rent', 'rennen', 'rennen', 'rennen'],
      continuo: ['ben aan het rennen', 'bent aan het rennen', 'is aan het rennen', 'zijn aan het rennen', 'zijn aan het rennen', 'zijn aan het rennen'],
      pluscuamperfecto: ['had gerend', 'had gerend', 'had gerend', 'hadden gerend', 'hadden gerend', 'hadden gerend']
    }
  },
  {
    id: 13, infinitive: 'comprender', dutch: 'begrijpen', group: 'er-regelmatig',
    conjugations: {
      presente: ['comprendo', 'comprendes', 'comprende', 'comprendemos', 'comprendéis', 'comprenden'],
      futuro: ['comprenderé', 'comprenderás', 'comprenderá', 'comprenderemos', 'comprenderéis', 'comprenderán'],
      imperfecto: ['comprendía', 'comprendías', 'comprendía', 'comprendíamos', 'comprendíais', 'comprendían'],
      indefinido: ['comprendí', 'comprendiste', 'comprendió', 'comprendimos', 'comprendisteis', 'comprendieron'],
      gebiedende_wijs: [null, 'comprende', 'comprenda', 'comprendamos', 'comprended', 'comprendan']
    },
    herkennen: {
      perfecto: ['he comprendido', 'has comprendido', 'ha comprendido', 'hemos comprendido', 'habéis comprendido', 'han comprendido'],
      condicional: ['comprendería', 'comprenderías', 'comprendería', 'comprenderíamos', 'comprenderíais', 'comprenderían'],
      subjuntivo: ['comprenda', 'comprendas', 'comprenda', 'comprendamos', 'comprendáis', 'comprendan'],
      continuo: ['estoy comprendiendo', 'estás comprendiendo', 'está comprendiendo', 'estamos comprendiendo', 'estáis comprendiendo', 'están comprendiendo'],
      pluscuamperfecto: ['había comprendido', 'habías comprendido', 'había comprendido', 'habíamos comprendido', 'habíais comprendido', 'habían comprendido']
    },
    herkennenNl: {
      perfecto: ['heb begrepen', 'hebt begrepen', 'heeft begrepen', 'hebben begrepen', 'hebben begrepen', 'hebben begrepen'],
      condicional: ['zou begrijpen', 'zou begrijpen', 'zou begrijpen', 'zouden begrijpen', 'zouden begrijpen', 'zouden begrijpen'],
      subjuntivo: ['begrijp', 'begrijpt', 'begrijpt', 'begrijpen', 'begrijpen', 'begrijpen'],
      continuo: ['ben aan het begrijpen', 'bent aan het begrijpen', 'is aan het begrijpen', 'zijn aan het begrijpen', 'zijn aan het begrijpen', 'zijn aan het begrijpen'],
      pluscuamperfecto: ['had begrepen', 'had begrepen', 'had begrepen', 'hadden begrepen', 'hadden begrepen', 'hadden begrepen']
    }
  },
  {
    id: 14, infinitive: 'vender', dutch: 'verkopen', group: 'er-regelmatig',
    conjugations: {
      presente: ['vendo', 'vendes', 'vende', 'vendemos', 'vendéis', 'venden'],
      futuro: ['venderé', 'venderás', 'venderá', 'venderemos', 'venderéis', 'venderán'],
      imperfecto: ['vendía', 'vendías', 'vendía', 'vendíamos', 'vendíais', 'vendían'],
      indefinido: ['vendí', 'vendiste', 'vendió', 'vendimos', 'vendisteis', 'vendieron'],
      gebiedende_wijs: [null, 'vende', 'venda', 'vendamos', 'vended', 'vendan']
    },
    herkennen: {
      perfecto: ['he vendido', 'has vendido', 'ha vendido', 'hemos vendido', 'habéis vendido', 'han vendido'],
      condicional: ['vendería', 'venderías', 'vendería', 'venderíamos', 'venderíais', 'venderían'],
      subjuntivo: ['venda', 'vendas', 'venda', 'vendamos', 'vendáis', 'vendan'],
      continuo: ['estoy vendiendo', 'estás vendiendo', 'está vendiendo', 'estamos vendiendo', 'estáis vendiendo', 'están vendiendo'],
      pluscuamperfecto: ['había vendido', 'habías vendido', 'había vendido', 'habíamos vendido', 'habíais vendido', 'habían vendido']
    },
    herkennenNl: {
      perfecto: ['heb verkocht', 'hebt verkocht', 'heeft verkocht', 'hebben verkocht', 'hebben verkocht', 'hebben verkocht'],
      condicional: ['zou verkopen', 'zou verkopen', 'zou verkopen', 'zouden verkopen', 'zouden verkopen', 'zouden verkopen'],
      subjuntivo: ['verkoop', 'verkoopt', 'verkoopt', 'verkopen', 'verkopen', 'verkopen'],
      continuo: ['ben aan het verkopen', 'bent aan het verkopen', 'is aan het verkopen', 'zijn aan het verkopen', 'zijn aan het verkopen', 'zijn aan het verkopen'],
      pluscuamperfecto: ['had verkocht', 'had verkocht', 'had verkocht', 'hadden verkocht', 'hadden verkocht', 'hadden verkocht']
    }
  },

  // ── Regelmatige -ir werkwoorden ──
  {
    id: 15, infinitive: 'vivir', dutch: 'leven, wonen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['vivo', 'vives', 'vive', 'vivimos', 'vivís', 'viven'],
      futuro: ['viviré', 'vivirás', 'vivirá', 'viviremos', 'viviréis', 'vivirán'],
      imperfecto: ['vivía', 'vivías', 'vivía', 'vivíamos', 'vivíais', 'vivían'],
      indefinido: ['viví', 'viviste', 'vivió', 'vivimos', 'vivisteis', 'vivieron'],
      gebiedende_wijs: [null, 'vive', 'viva', 'vivamos', 'vivid', 'vivan']
    },
    herkennen: {
      perfecto: ['he vivido', 'has vivido', 'ha vivido', 'hemos vivido', 'habéis vivido', 'han vivido'],
      condicional: ['viviría', 'vivirías', 'viviría', 'viviríamos', 'viviríais', 'vivirían'],
      subjuntivo: ['viva', 'vivas', 'viva', 'vivamos', 'viváis', 'vivan'],
      continuo: ['estoy viviendo', 'estás viviendo', 'está viviendo', 'estamos viviendo', 'estáis viviendo', 'están viviendo'],
      pluscuamperfecto: ['había vivido', 'habías vivido', 'había vivido', 'habíamos vivido', 'habíais vivido', 'habían vivido']
    },
    herkennenNl: {
      perfecto: ['heb geleefd', 'hebt geleefd', 'heeft geleefd', 'hebben geleefd', 'hebben geleefd', 'hebben geleefd'],
      condicional: ['zou leven', 'zou leven', 'zou leven', 'zouden leven', 'zouden leven', 'zouden leven'],
      subjuntivo: ['leef', 'leeft', 'leeft', 'leven', 'leven', 'leven'],
      continuo: ['ben aan het leven', 'bent aan het leven', 'is aan het leven', 'zijn aan het leven', 'zijn aan het leven', 'zijn aan het leven'],
      pluscuamperfecto: ['had geleefd', 'had geleefd', 'had geleefd', 'hadden geleefd', 'hadden geleefd', 'hadden geleefd']
    }
  },
  {
    id: 16, infinitive: 'escribir', dutch: 'schrijven', group: 'ir-regelmatig',
    conjugations: {
      presente: ['escribo', 'escribes', 'escribe', 'escribimos', 'escribís', 'escriben'],
      futuro: ['escribiré', 'escribirás', 'escribirá', 'escribiremos', 'escribiréis', 'escribirán'],
      imperfecto: ['escribía', 'escribías', 'escribía', 'escribíamos', 'escribíais', 'escribían'],
      indefinido: ['escribí', 'escribiste', 'escribió', 'escribimos', 'escribisteis', 'escribieron'],
      gebiedende_wijs: [null, 'escribe', 'escriba', 'escribamos', 'escribid', 'escriban']
    },
    herkennen: {
      perfecto: ['he escrito', 'has escrito', 'ha escrito', 'hemos escrito', 'habéis escrito', 'han escrito'],
      condicional: ['escribiría', 'escribirías', 'escribiría', 'escribiríamos', 'escribiríais', 'escribirían'],
      subjuntivo: ['escriba', 'escribas', 'escriba', 'escribamos', 'escribáis', 'escriban'],
      continuo: ['estoy escribiendo', 'estás escribiendo', 'está escribiendo', 'estamos escribiendo', 'estáis escribiendo', 'están escribiendo'],
      pluscuamperfecto: ['había escrito', 'habías escrito', 'había escrito', 'habíamos escrito', 'habíais escrito', 'habían escrito']
    },
    herkennenNl: {
      perfecto: ['heb geschreven', 'hebt geschreven', 'heeft geschreven', 'hebben geschreven', 'hebben geschreven', 'hebben geschreven'],
      condicional: ['zou schrijven', 'zou schrijven', 'zou schrijven', 'zouden schrijven', 'zouden schrijven', 'zouden schrijven'],
      subjuntivo: ['schrijf', 'schrijft', 'schrijft', 'schrijven', 'schrijven', 'schrijven'],
      continuo: ['ben aan het schrijven', 'bent aan het schrijven', 'is aan het schrijven', 'zijn aan het schrijven', 'zijn aan het schrijven', 'zijn aan het schrijven'],
      pluscuamperfecto: ['had geschreven', 'had geschreven', 'had geschreven', 'hadden geschreven', 'hadden geschreven', 'hadden geschreven']
    }
  },
  {
    id: 17, infinitive: 'abrir', dutch: 'openen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['abro', 'abres', 'abre', 'abrimos', 'abrís', 'abren'],
      futuro: ['abriré', 'abrirás', 'abrirá', 'abriremos', 'abriréis', 'abrirán'],
      imperfecto: ['abría', 'abrías', 'abría', 'abríamos', 'abríais', 'abrían'],
      indefinido: ['abrí', 'abriste', 'abrió', 'abrimos', 'abristeis', 'abrieron'],
      gebiedende_wijs: [null, 'abre', 'abra', 'abramos', 'abrid', 'abran']
    },
    herkennen: {
      perfecto: ['he abierto', 'has abierto', 'ha abierto', 'hemos abierto', 'habéis abierto', 'han abierto'],
      condicional: ['abriría', 'abrirías', 'abriría', 'abriríamos', 'abriríais', 'abrirían'],
      subjuntivo: ['abra', 'abras', 'abra', 'abramos', 'abráis', 'abran'],
      continuo: ['estoy abriendo', 'estás abriendo', 'está abriendo', 'estamos abriendo', 'estáis abriendo', 'están abriendo'],
      pluscuamperfecto: ['había abierto', 'habías abierto', 'había abierto', 'habíamos abierto', 'habíais abierto', 'habían abierto']
    },
    herkennenNl: {
      perfecto: ['heb geopend', 'hebt geopend', 'heeft geopend', 'hebben geopend', 'hebben geopend', 'hebben geopend'],
      condicional: ['zou openen', 'zou openen', 'zou openen', 'zouden openen', 'zouden openen', 'zouden openen'],
      subjuntivo: ['open', 'opent', 'opent', 'openen', 'openen', 'openen'],
      continuo: ['ben aan het openen', 'bent aan het openen', 'is aan het openen', 'zijn aan het openen', 'zijn aan het openen', 'zijn aan het openen'],
      pluscuamperfecto: ['had geopend', 'had geopend', 'had geopend', 'hadden geopend', 'hadden geopend', 'hadden geopend']
    }
  },
  {
    id: 18, infinitive: 'decidir', dutch: 'beslissen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['decido', 'decides', 'decide', 'decidimos', 'decidís', 'deciden'],
      futuro: ['decidiré', 'decidirás', 'decidirá', 'decidiremos', 'decidiréis', 'decidirán'],
      imperfecto: ['decidía', 'decidías', 'decidía', 'decidíamos', 'decidíais', 'decidían'],
      indefinido: ['decidí', 'decidiste', 'decidió', 'decidimos', 'decidisteis', 'decidieron'],
      gebiedende_wijs: [null, 'decide', 'decida', 'decidamos', 'decidid', 'decidan']
    },
    herkennen: {
      perfecto: ['he decidido', 'has decidido', 'ha decidido', 'hemos decidido', 'habéis decidido', 'han decidido'],
      condicional: ['decidiría', 'decidirías', 'decidiría', 'decidiríamos', 'decidiríais', 'decidirían'],
      subjuntivo: ['decida', 'decidas', 'decida', 'decidamos', 'decidáis', 'decidan'],
      continuo: ['estoy decidiendo', 'estás decidiendo', 'está decidiendo', 'estamos decidiendo', 'estáis decidiendo', 'están decidiendo'],
      pluscuamperfecto: ['había decidido', 'habías decidido', 'había decidido', 'habíamos decidido', 'habíais decidido', 'habían decidido']
    },
    herkennenNl: {
      perfecto: ['heb beslist', 'hebt beslist', 'heeft beslist', 'hebben beslist', 'hebben beslist', 'hebben beslist'],
      condicional: ['zou beslissen', 'zou beslissen', 'zou beslissen', 'zouden beslissen', 'zouden beslissen', 'zouden beslissen'],
      subjuntivo: ['beslis', 'beslist', 'beslist', 'beslissen', 'beslissen', 'beslissen'],
      continuo: ['ben aan het beslissen', 'bent aan het beslissen', 'is aan het beslissen', 'zijn aan het beslissen', 'zijn aan het beslissen', 'zijn aan het beslissen'],
      pluscuamperfecto: ['had beslist', 'had beslist', 'had beslist', 'hadden beslist', 'hadden beslist', 'hadden beslist']
    }
  },
  {
    id: 19, infinitive: 'compartir', dutch: 'delen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['comparto', 'compartes', 'comparte', 'compartimos', 'compartís', 'comparten'],
      futuro: ['compartiré', 'compartirás', 'compartirá', 'compartiremos', 'compartiréis', 'compartirán'],
      imperfecto: ['compartía', 'compartías', 'compartía', 'compartíamos', 'compartíais', 'compartían'],
      indefinido: ['compartí', 'compartiste', 'compartió', 'compartimos', 'compartisteis', 'compartieron'],
      gebiedende_wijs: [null, 'comparte', 'comparta', 'compartamos', 'compartid', 'compartan']
    },
    herkennen: {
      perfecto: ['he compartido', 'has compartido', 'ha compartido', 'hemos compartido', 'habéis compartido', 'han compartido'],
      condicional: ['compartiría', 'compartirías', 'compartiría', 'compartiríamos', 'compartiríais', 'compartirían'],
      subjuntivo: ['comparta', 'compartas', 'comparta', 'compartamos', 'compartáis', 'compartan'],
      continuo: ['estoy compartiendo', 'estás compartiendo', 'está compartiendo', 'estamos compartiendo', 'estáis compartiendo', 'están compartiendo'],
      pluscuamperfecto: ['había compartido', 'habías compartido', 'había compartido', 'habíamos compartido', 'habíais compartido', 'habían compartido']
    },
    herkennenNl: {
      perfecto: ['heb gedeeld', 'hebt gedeeld', 'heeft gedeeld', 'hebben gedeeld', 'hebben gedeeld', 'hebben gedeeld'],
      condicional: ['zou delen', 'zou delen', 'zou delen', 'zouden delen', 'zouden delen', 'zouden delen'],
      subjuntivo: ['deel', 'deelt', 'deelt', 'delen', 'delen', 'delen'],
      continuo: ['ben aan het delen', 'bent aan het delen', 'is aan het delen', 'zijn aan het delen', 'zijn aan het delen', 'zijn aan het delen'],
      pluscuamperfecto: ['had gedeeld', 'had gedeeld', 'had gedeeld', 'hadden gedeeld', 'hadden gedeeld', 'hadden gedeeld']
    }
  },
  {
    id: 20, infinitive: 'recibir', dutch: 'ontvangen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['recibo', 'recibes', 'recibe', 'recibimos', 'recibís', 'reciben'],
      futuro: ['recibiré', 'recibirás', 'recibirá', 'recibiremos', 'recibiréis', 'recibirán'],
      imperfecto: ['recibía', 'recibías', 'recibía', 'recibíamos', 'recibíais', 'recibían'],
      indefinido: ['recibí', 'recibiste', 'recibió', 'recibimos', 'recibisteis', 'recibieron'],
      gebiedende_wijs: [null, 'recibe', 'reciba', 'recibamos', 'recibid', 'reciban']
    },
    herkennen: {
      perfecto: ['he recibido', 'has recibido', 'ha recibido', 'hemos recibido', 'habéis recibido', 'han recibido'],
      condicional: ['recibiría', 'recibirías', 'recibiría', 'recibiríamos', 'recibiríais', 'recibirían'],
      subjuntivo: ['reciba', 'recibas', 'reciba', 'recibamos', 'recibáis', 'reciban'],
      continuo: ['estoy recibiendo', 'estás recibiendo', 'está recibiendo', 'estamos recibiendo', 'estáis recibiendo', 'están recibiendo'],
      pluscuamperfecto: ['había recibido', 'habías recibido', 'había recibido', 'habíamos recibido', 'habíais recibido', 'habían recibido']
    },
    herkennenNl: {
      perfecto: ['heb ontvangen', 'hebt ontvangen', 'heeft ontvangen', 'hebben ontvangen', 'hebben ontvangen', 'hebben ontvangen'],
      condicional: ['zou ontvangen', 'zou ontvangen', 'zou ontvangen', 'zouden ontvangen', 'zouden ontvangen', 'zouden ontvangen'],
      subjuntivo: ['ontvang', 'ontvangt', 'ontvangt', 'ontvangen', 'ontvangen', 'ontvangen'],
      continuo: ['ben aan het ontvangen', 'bent aan het ontvangen', 'is aan het ontvangen', 'zijn aan het ontvangen', 'zijn aan het ontvangen', 'zijn aan het ontvangen'],
      pluscuamperfecto: ['had ontvangen', 'had ontvangen', 'had ontvangen', 'hadden ontvangen', 'hadden ontvangen', 'hadden ontvangen']
    }
  },

  // ── Onregelmatige werkwoorden (belangrijkste) ──
  {
    id: 21, infinitive: 'ser', dutch: 'zijn (identiteit)', group: 'onregelmatig',
    conjugations: {
      presente: ['soy', 'eres', 'es', 'somos', 'sois', 'son'],
      futuro: ['seré', 'serás', 'será', 'seremos', 'seréis', 'serán'],
      imperfecto: ['era', 'eras', 'era', 'éramos', 'erais', 'eran'],
      indefinido: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'],
      gebiedende_wijs: [null, 'sé', 'sea', 'seamos', 'sed', 'sean']
    },
    herkennen: {
      perfecto: ['he sido', 'has sido', 'ha sido', 'hemos sido', 'habéis sido', 'han sido'],
      condicional: ['sería', 'serías', 'sería', 'seríamos', 'seríais', 'serían'],
      subjuntivo: ['sea', 'seas', 'sea', 'seamos', 'seáis', 'sean'],
      continuo: ['estoy siendo', 'estás siendo', 'está siendo', 'estamos siendo', 'estáis siendo', 'están siendo'],
      pluscuamperfecto: ['había sido', 'habías sido', 'había sido', 'habíamos sido', 'habíais sido', 'habían sido']
    },
    herkennenNl: {
      perfecto: ['ben geweest', 'bent geweest', 'is geweest', 'zijn geweest', 'zijn geweest', 'zijn geweest'],
      condicional: ['zou zijn', 'zou zijn', 'zou zijn', 'zouden zijn', 'zouden zijn', 'zouden zijn'],
      subjuntivo: ['ben', 'is', 'is', 'zijn', 'zijn', 'zijn'],
      continuo: ['ben aan het zijn', 'bent aan het zijn', 'is aan het zijn', 'zijn aan het zijn', 'zijn aan het zijn', 'zijn aan het zijn'],
      pluscuamperfecto: ['was geweest', 'was geweest', 'was geweest', 'waren geweest', 'waren geweest', 'waren geweest']
    }
  },
  {
    id: 22, infinitive: 'estar', dutch: 'zijn (toestand/plaats)', group: 'onregelmatig',
    conjugations: {
      presente: ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'],
      futuro: ['estaré', 'estarás', 'estará', 'estaremos', 'estaréis', 'estarán'],
      imperfecto: ['estaba', 'estabas', 'estaba', 'estábamos', 'estabais', 'estaban'],
      indefinido: ['estuve', 'estuviste', 'estuvo', 'estuvimos', 'estuvisteis', 'estuvieron'],
      gebiedende_wijs: [null, 'está', 'esté', 'estemos', 'estad', 'estén']
    },
    herkennen: {
      perfecto: ['he estado', 'has estado', 'ha estado', 'hemos estado', 'habéis estado', 'han estado'],
      condicional: ['estaría', 'estarías', 'estaría', 'estaríamos', 'estaríais', 'estarían'],
      subjuntivo: ['esté', 'estés', 'esté', 'estemos', 'estéis', 'estén'],
      continuo: ['estoy estando', 'estás estando', 'está estando', 'estamos estando', 'estáis estando', 'están estando'],
      pluscuamperfecto: ['había estado', 'habías estado', 'había estado', 'habíamos estado', 'habíais estado', 'habían estado']
    },
    herkennenNl: {
      perfecto: ['ben geweest', 'bent geweest', 'is geweest', 'zijn geweest', 'zijn geweest', 'zijn geweest'],
      condicional: ['zou zijn', 'zou zijn', 'zou zijn', 'zouden zijn', 'zouden zijn', 'zouden zijn'],
      subjuntivo: ['ben', 'is', 'is', 'zijn', 'zijn', 'zijn'],
      continuo: ['ben aan het zijn', 'bent aan het zijn', 'is aan het zijn', 'zijn aan het zijn', 'zijn aan het zijn', 'zijn aan het zijn'],
      pluscuamperfecto: ['was geweest', 'was geweest', 'was geweest', 'waren geweest', 'waren geweest', 'waren geweest']
    }
  },
  {
    id: 23, infinitive: 'ir', dutch: 'gaan', group: 'onregelmatig',
    conjugations: {
      presente: ['voy', 'vas', 'va', 'vamos', 'vais', 'van'],
      futuro: ['iré', 'irás', 'irá', 'iremos', 'iréis', 'irán'],
      imperfecto: ['iba', 'ibas', 'iba', 'íbamos', 'ibais', 'iban'],
      indefinido: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'],
      gebiedende_wijs: [null, 've', 'vaya', 'vamos', 'id', 'vayan']
    },
    herkennen: {
      perfecto: ['he ido', 'has ido', 'ha ido', 'hemos ido', 'habéis ido', 'han ido'],
      condicional: ['iría', 'irías', 'iría', 'iríamos', 'iríais', 'irían'],
      subjuntivo: ['vaya', 'vayas', 'vaya', 'vayamos', 'vayáis', 'vayan'],
      continuo: ['estoy yendo', 'estás yendo', 'está yendo', 'estamos yendo', 'estáis yendo', 'están yendo'],
      pluscuamperfecto: ['había ido', 'habías ido', 'había ido', 'habíamos ido', 'habíais ido', 'habían ido']
    },
    herkennenNl: {
      perfecto: ['ben gegaan', 'bent gegaan', 'is gegaan', 'zijn gegaan', 'zijn gegaan', 'zijn gegaan'],
      condicional: ['zou gaan', 'zou gaan', 'zou gaan', 'zouden gaan', 'zouden gaan', 'zouden gaan'],
      subjuntivo: ['ga', 'gaat', 'gaat', 'gaan', 'gaan', 'gaan'],
      continuo: ['ben aan het gaan', 'bent aan het gaan', 'is aan het gaan', 'zijn aan het gaan', 'zijn aan het gaan', 'zijn aan het gaan'],
      pluscuamperfecto: ['was gegaan', 'was gegaan', 'was gegaan', 'waren gegaan', 'waren gegaan', 'waren gegaan']
    }
  },
  {
    id: 24, infinitive: 'tener', dutch: 'hebben', group: 'onregelmatig',
    conjugations: {
      presente: ['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen'],
      futuro: ['tendré', 'tendrás', 'tendrá', 'tendremos', 'tendréis', 'tendrán'],
      imperfecto: ['tenía', 'tenías', 'tenía', 'teníamos', 'teníais', 'tenían'],
      indefinido: ['tuve', 'tuviste', 'tuvo', 'tuvimos', 'tuvisteis', 'tuvieron'],
      gebiedende_wijs: [null, 'ten', 'tenga', 'tengamos', 'tened', 'tengan']
    },
    herkennen: {
      perfecto: ['he tenido', 'has tenido', 'ha tenido', 'hemos tenido', 'habéis tenido', 'han tenido'],
      condicional: ['tendría', 'tendrías', 'tendría', 'tendríamos', 'tendríais', 'tendrían'],
      subjuntivo: ['tenga', 'tengas', 'tenga', 'tengamos', 'tengáis', 'tengan'],
      continuo: ['estoy teniendo', 'estás teniendo', 'está teniendo', 'estamos teniendo', 'estáis teniendo', 'están teniendo'],
      pluscuamperfecto: ['había tenido', 'habías tenido', 'había tenido', 'habíamos tenido', 'habíais tenido', 'habían tenido']
    },
    herkennenNl: {
      perfecto: ['heb gehad', 'hebt gehad', 'heeft gehad', 'hebben gehad', 'hebben gehad', 'hebben gehad'],
      condicional: ['zou hebben', 'zou hebben', 'zou hebben', 'zouden hebben', 'zouden hebben', 'zouden hebben'],
      subjuntivo: ['heb', 'heeft', 'heeft', 'hebben', 'hebben', 'hebben'],
      continuo: ['ben aan het hebben', 'bent aan het hebben', 'is aan het hebben', 'zijn aan het hebben', 'zijn aan het hebben', 'zijn aan het hebben'],
      pluscuamperfecto: ['had gehad', 'had gehad', 'had gehad', 'hadden gehad', 'hadden gehad', 'hadden gehad']
    }
  },
  {
    id: 25, infinitive: 'hacer', dutch: 'doen, maken', group: 'onregelmatig',
    conjugations: {
      presente: ['hago', 'haces', 'hace', 'hacemos', 'hacéis', 'hacen'],
      futuro: ['haré', 'harás', 'hará', 'haremos', 'haréis', 'harán'],
      imperfecto: ['hacía', 'hacías', 'hacía', 'hacíamos', 'hacíais', 'hacían'],
      indefinido: ['hice', 'hiciste', 'hizo', 'hicimos', 'hicisteis', 'hicieron'],
      gebiedende_wijs: [null, 'haz', 'haga', 'hagamos', 'haced', 'hagan']
    },
    herkennen: {
      perfecto: ['he hecho', 'has hecho', 'ha hecho', 'hemos hecho', 'habéis hecho', 'han hecho'],
      condicional: ['haría', 'harías', 'haría', 'haríamos', 'haríais', 'harían'],
      subjuntivo: ['haga', 'hagas', 'haga', 'hagamos', 'hagáis', 'hagan'],
      continuo: ['estoy haciendo', 'estás haciendo', 'está haciendo', 'estamos haciendo', 'estáis haciendo', 'están haciendo'],
      pluscuamperfecto: ['había hecho', 'habías hecho', 'había hecho', 'habíamos hecho', 'habíais hecho', 'habían hecho']
    },
    herkennenNl: {
      perfecto: ['heb gedaan', 'hebt gedaan', 'heeft gedaan', 'hebben gedaan', 'hebben gedaan', 'hebben gedaan'],
      condicional: ['zou doen', 'zou doen', 'zou doen', 'zouden doen', 'zouden doen', 'zouden doen'],
      subjuntivo: ['doe', 'doet', 'doet', 'doen', 'doen', 'doen'],
      continuo: ['ben aan het doen', 'bent aan het doen', 'is aan het doen', 'zijn aan het doen', 'zijn aan het doen', 'zijn aan het doen'],
      pluscuamperfecto: ['had gedaan', 'had gedaan', 'had gedaan', 'hadden gedaan', 'hadden gedaan', 'hadden gedaan']
    }
  },
  {
    id: 26, infinitive: 'poder', dutch: 'kunnen', group: 'onregelmatig',
    conjugations: {
      presente: ['puedo', 'puedes', 'puede', 'podemos', 'podéis', 'pueden'],
      futuro: ['podré', 'podrás', 'podrá', 'podremos', 'podréis', 'podrán'],
      imperfecto: ['podía', 'podías', 'podía', 'podíamos', 'podíais', 'podían'],
      indefinido: ['pude', 'pudiste', 'pudo', 'pudimos', 'pudisteis', 'pudieron'],
      gebiedende_wijs: [null, 'puede', 'pueda', 'podamos', 'poded', 'puedan']
    },
    herkennen: {
      perfecto: ['he podido', 'has podido', 'ha podido', 'hemos podido', 'habéis podido', 'han podido'],
      condicional: ['podría', 'podrías', 'podría', 'podríamos', 'podríais', 'podrían'],
      subjuntivo: ['pueda', 'puedas', 'pueda', 'podamos', 'podáis', 'puedan'],
      continuo: ['estoy pudiendo', 'estás pudiendo', 'está pudiendo', 'estamos pudiendo', 'estáis pudiendo', 'están pudiendo'],
      pluscuamperfecto: ['había podido', 'habías podido', 'había podido', 'habíamos podido', 'habíais podido', 'habían podido']
    },
    herkennenNl: {
      perfecto: ['heb gekund', 'hebt gekund', 'heeft gekund', 'hebben gekund', 'hebben gekund', 'hebben gekund'],
      condicional: ['zou kunnen', 'zou kunnen', 'zou kunnen', 'zouden kunnen', 'zouden kunnen', 'zouden kunnen'],
      subjuntivo: ['kan', 'kan', 'kan', 'kunnen', 'kunnen', 'kunnen'],
      continuo: ['ben aan het kunnen', 'bent aan het kunnen', 'is aan het kunnen', 'zijn aan het kunnen', 'zijn aan het kunnen', 'zijn aan het kunnen'],
      pluscuamperfecto: ['had gekund', 'had gekund', 'had gekund', 'hadden gekund', 'hadden gekund', 'hadden gekund']
    }
  },
  {
    id: 27, infinitive: 'decir', dutch: 'zeggen', group: 'onregelmatig',
    conjugations: {
      presente: ['digo', 'dices', 'dice', 'decimos', 'decís', 'dicen'],
      futuro: ['diré', 'dirás', 'dirá', 'diremos', 'diréis', 'dirán'],
      imperfecto: ['decía', 'decías', 'decía', 'decíamos', 'decíais', 'decían'],
      indefinido: ['dije', 'dijiste', 'dijo', 'dijimos', 'dijisteis', 'dijeron'],
      gebiedende_wijs: [null, 'di', 'diga', 'digamos', 'decid', 'digan']
    },
    herkennen: {
      perfecto: ['he dicho', 'has dicho', 'ha dicho', 'hemos dicho', 'habéis dicho', 'han dicho'],
      condicional: ['diría', 'dirías', 'diría', 'diríamos', 'diríais', 'dirían'],
      subjuntivo: ['diga', 'digas', 'diga', 'digamos', 'digáis', 'digan'],
      continuo: ['estoy diciendo', 'estás diciendo', 'está diciendo', 'estamos diciendo', 'estáis diciendo', 'están diciendo'],
      pluscuamperfecto: ['había dicho', 'habías dicho', 'había dicho', 'habíamos dicho', 'habíais dicho', 'habían dicho']
    },
    herkennenNl: {
      perfecto: ['heb gezegd', 'hebt gezegd', 'heeft gezegd', 'hebben gezegd', 'hebben gezegd', 'hebben gezegd'],
      condicional: ['zou zeggen', 'zou zeggen', 'zou zeggen', 'zouden zeggen', 'zouden zeggen', 'zouden zeggen'],
      subjuntivo: ['zeg', 'zegt', 'zegt', 'zeggen', 'zeggen', 'zeggen'],
      continuo: ['ben aan het zeggen', 'bent aan het zeggen', 'is aan het zeggen', 'zijn aan het zeggen', 'zijn aan het zeggen', 'zijn aan het zeggen'],
      pluscuamperfecto: ['had gezegd', 'had gezegd', 'had gezegd', 'hadden gezegd', 'hadden gezegd', 'hadden gezegd']
    }
  },
  {
    id: 28, infinitive: 'querer', dutch: 'willen, houden van', group: 'onregelmatig',
    conjugations: {
      presente: ['quiero', 'quieres', 'quiere', 'queremos', 'queréis', 'quieren'],
      futuro: ['querré', 'querrás', 'querrá', 'querremos', 'querréis', 'querrán'],
      imperfecto: ['quería', 'querías', 'quería', 'queríamos', 'queríais', 'querían'],
      indefinido: ['quise', 'quisiste', 'quiso', 'quisimos', 'quisisteis', 'quisieron'],
      gebiedende_wijs: [null, 'quiere', 'quiera', 'queramos', 'quered', 'quieran']
    },
    herkennen: {
      perfecto: ['he querido', 'has querido', 'ha querido', 'hemos querido', 'habéis querido', 'han querido'],
      condicional: ['querría', 'querrías', 'querría', 'querríamos', 'querríais', 'querrían'],
      subjuntivo: ['quiera', 'quieras', 'quiera', 'queramos', 'queráis', 'quieran'],
      continuo: ['estoy queriendo', 'estás queriendo', 'está queriendo', 'estamos queriendo', 'estáis queriendo', 'están queriendo'],
      pluscuamperfecto: ['había querido', 'habías querido', 'había querido', 'habíamos querido', 'habíais querido', 'habían querido']
    },
    herkennenNl: {
      perfecto: ['heb gewild', 'hebt gewild', 'heeft gewild', 'hebben gewild', 'hebben gewild', 'hebben gewild'],
      condicional: ['zou willen', 'zou willen', 'zou willen', 'zouden willen', 'zouden willen', 'zouden willen'],
      subjuntivo: ['wil', 'wil', 'wil', 'willen', 'willen', 'willen'],
      continuo: ['ben aan het willen', 'bent aan het willen', 'is aan het willen', 'zijn aan het willen', 'zijn aan het willen', 'zijn aan het willen'],
      pluscuamperfecto: ['had gewild', 'had gewild', 'had gewild', 'hadden gewild', 'hadden gewild', 'hadden gewild']
    }
  },
  {
    id: 29, infinitive: 'saber', dutch: 'weten', group: 'onregelmatig',
    conjugations: {
      presente: ['sé', 'sabes', 'sabe', 'sabemos', 'sabéis', 'saben'],
      futuro: ['sabré', 'sabrás', 'sabrá', 'sabremos', 'sabréis', 'sabrán'],
      imperfecto: ['sabía', 'sabías', 'sabía', 'sabíamos', 'sabíais', 'sabían'],
      indefinido: ['supe', 'supiste', 'supo', 'supimos', 'supisteis', 'supieron'],
      gebiedende_wijs: [null, 'sabe', 'sepa', 'sepamos', 'sabed', 'sepan']
    },
    herkennen: {
      perfecto: ['he sabido', 'has sabido', 'ha sabido', 'hemos sabido', 'habéis sabido', 'han sabido'],
      condicional: ['sabría', 'sabrías', 'sabría', 'sabríamos', 'sabríais', 'sabrían'],
      subjuntivo: ['sepa', 'sepas', 'sepa', 'sepamos', 'sepáis', 'sepan'],
      continuo: ['estoy sabiendo', 'estás sabiendo', 'está sabiendo', 'estamos sabiendo', 'estáis sabiendo', 'están sabiendo'],
      pluscuamperfecto: ['había sabido', 'habías sabido', 'había sabido', 'habíamos sabido', 'habíais sabido', 'habían sabido']
    },
    herkennenNl: {
      perfecto: ['heb geweten', 'hebt geweten', 'heeft geweten', 'hebben geweten', 'hebben geweten', 'hebben geweten'],
      condicional: ['zou weten', 'zou weten', 'zou weten', 'zouden weten', 'zouden weten', 'zouden weten'],
      subjuntivo: ['weet', 'weet', 'weet', 'weten', 'weten', 'weten'],
      continuo: ['ben aan het weten', 'bent aan het weten', 'is aan het weten', 'zijn aan het weten', 'zijn aan het weten', 'zijn aan het weten'],
      pluscuamperfecto: ['had geweten', 'had geweten', 'had geweten', 'hadden geweten', 'hadden geweten', 'hadden geweten']
    }
  },
  {
    id: 30, infinitive: 'poner', dutch: 'zetten, leggen', group: 'onregelmatig',
    conjugations: {
      presente: ['pongo', 'pones', 'pone', 'ponemos', 'ponéis', 'ponen'],
      futuro: ['pondré', 'pondrás', 'pondrá', 'pondremos', 'pondréis', 'pondrán'],
      imperfecto: ['ponía', 'ponías', 'ponía', 'poníamos', 'poníais', 'ponían'],
      indefinido: ['puse', 'pusiste', 'puso', 'pusimos', 'pusisteis', 'pusieron'],
      gebiedende_wijs: [null, 'pon', 'ponga', 'pongamos', 'poned', 'pongan']
    },
    herkennen: {
      perfecto: ['he puesto', 'has puesto', 'ha puesto', 'hemos puesto', 'habéis puesto', 'han puesto'],
      condicional: ['pondría', 'pondrías', 'pondría', 'pondríamos', 'pondríais', 'pondrían'],
      subjuntivo: ['ponga', 'pongas', 'ponga', 'pongamos', 'pongáis', 'pongan'],
      continuo: ['estoy poniendo', 'estás poniendo', 'está poniendo', 'estamos poniendo', 'estáis poniendo', 'están poniendo'],
      pluscuamperfecto: ['había puesto', 'habías puesto', 'había puesto', 'habíamos puesto', 'habíais puesto', 'habían puesto']
    },
    herkennenNl: {
      perfecto: ['heb gezet', 'hebt gezet', 'heeft gezet', 'hebben gezet', 'hebben gezet', 'hebben gezet'],
      condicional: ['zou zetten', 'zou zetten', 'zou zetten', 'zouden zetten', 'zouden zetten', 'zouden zetten'],
      subjuntivo: ['zet', 'zet', 'zet', 'zetten', 'zetten', 'zetten'],
      continuo: ['ben aan het zetten', 'bent aan het zetten', 'is aan het zetten', 'zijn aan het zetten', 'zijn aan het zetten', 'zijn aan het zetten'],
      pluscuamperfecto: ['had gezet', 'had gezet', 'had gezet', 'hadden gezet', 'hadden gezet', 'hadden gezet']
    }
  },
  {
    id: 31, infinitive: 'venir', dutch: 'komen', group: 'onregelmatig',
    conjugations: {
      presente: ['vengo', 'vienes', 'viene', 'venimos', 'venís', 'vienen'],
      futuro: ['vendré', 'vendrás', 'vendrá', 'vendremos', 'vendréis', 'vendrán'],
      imperfecto: ['venía', 'venías', 'venía', 'veníamos', 'veníais', 'venían'],
      indefinido: ['vine', 'viniste', 'vino', 'vinimos', 'vinisteis', 'vinieron'],
      gebiedende_wijs: [null, 'ven', 'venga', 'vengamos', 'venid', 'vengan']
    },
    herkennen: {
      perfecto: ['he venido', 'has venido', 'ha venido', 'hemos venido', 'habéis venido', 'han venido'],
      condicional: ['vendría', 'vendrías', 'vendría', 'vendríamos', 'vendríais', 'vendrían'],
      subjuntivo: ['venga', 'vengas', 'venga', 'vengamos', 'vengáis', 'vengan'],
      continuo: ['estoy viniendo', 'estás viniendo', 'está viniendo', 'estamos viniendo', 'estáis viniendo', 'están viniendo'],
      pluscuamperfecto: ['había venido', 'habías venido', 'había venido', 'habíamos venido', 'habíais venido', 'habían venido']
    },
    herkennenNl: {
      perfecto: ['ben gekomen', 'bent gekomen', 'is gekomen', 'zijn gekomen', 'zijn gekomen', 'zijn gekomen'],
      condicional: ['zou komen', 'zou komen', 'zou komen', 'zouden komen', 'zouden komen', 'zouden komen'],
      subjuntivo: ['kom', 'komt', 'komt', 'komen', 'komen', 'komen'],
      continuo: ['ben aan het komen', 'bent aan het komen', 'is aan het komen', 'zijn aan het komen', 'zijn aan het komen', 'zijn aan het komen'],
      pluscuamperfecto: ['was gekomen', 'was gekomen', 'was gekomen', 'waren gekomen', 'waren gekomen', 'waren gekomen']
    }
  },
  {
    id: 32, infinitive: 'salir', dutch: 'weggaan, uitgaan', group: 'onregelmatig',
    conjugations: {
      presente: ['salgo', 'sales', 'sale', 'salimos', 'salís', 'salen'],
      futuro: ['saldré', 'saldrás', 'saldrá', 'saldremos', 'saldréis', 'saldrán'],
      imperfecto: ['salía', 'salías', 'salía', 'salíamos', 'salíais', 'salían'],
      indefinido: ['salí', 'saliste', 'salió', 'salimos', 'salisteis', 'salieron'],
      gebiedende_wijs: [null, 'sal', 'salga', 'salgamos', 'salid', 'salgan']
    },
    herkennen: {
      perfecto: ['he salido', 'has salido', 'ha salido', 'hemos salido', 'habéis salido', 'han salido'],
      condicional: ['saldría', 'saldrías', 'saldría', 'saldríamos', 'saldríais', 'saldrían'],
      subjuntivo: ['salga', 'salgas', 'salga', 'salgamos', 'salgáis', 'salgan'],
      continuo: ['estoy saliendo', 'estás saliendo', 'está saliendo', 'estamos saliendo', 'estáis saliendo', 'están saliendo'],
      pluscuamperfecto: ['había salido', 'habías salido', 'había salido', 'habíamos salido', 'habíais salido', 'habían salido']
    },
    herkennenNl: {
      perfecto: ['ben weggegaan', 'bent weggegaan', 'is weggegaan', 'zijn weggegaan', 'zijn weggegaan', 'zijn weggegaan'],
      condicional: ['zou weggaan', 'zou weggaan', 'zou weggaan', 'zouden weggaan', 'zouden weggaan', 'zouden weggaan'],
      subjuntivo: ['ga weg', 'gaat weg', 'gaat weg', 'weggaan', 'weggaan', 'weggaan'],
      continuo: ['ben aan het weggaan', 'bent aan het weggaan', 'is aan het weggaan', 'zijn aan het weggaan', 'zijn aan het weggaan', 'zijn aan het weggaan'],
      pluscuamperfecto: ['was weggegaan', 'was weggegaan', 'was weggegaan', 'waren weggegaan', 'waren weggegaan', 'waren weggegaan']
    }
  },
  {
    id: 33, infinitive: 'dar', dutch: 'geven', group: 'onregelmatig',
    conjugations: {
      presente: ['doy', 'das', 'da', 'damos', 'dais', 'dan'],
      futuro: ['daré', 'darás', 'dará', 'daremos', 'daréis', 'darán'],
      imperfecto: ['daba', 'dabas', 'daba', 'dábamos', 'dabais', 'daban'],
      indefinido: ['di', 'diste', 'dio', 'dimos', 'disteis', 'dieron'],
      gebiedende_wijs: [null, 'da', 'dé', 'demos', 'dad', 'den']
    },
    herkennen: {
      perfecto: ['he dado', 'has dado', 'ha dado', 'hemos dado', 'habéis dado', 'han dado'],
      condicional: ['daría', 'darías', 'daría', 'daríamos', 'daríais', 'darían'],
      subjuntivo: ['dé', 'des', 'dé', 'demos', 'deis', 'den'],
      continuo: ['estoy dando', 'estás dando', 'está dando', 'estamos dando', 'estáis dando', 'están dando'],
      pluscuamperfecto: ['había dado', 'habías dado', 'había dado', 'habíamos dado', 'habíais dado', 'habían dado']
    },
    herkennenNl: {
      perfecto: ['heb gegeven', 'hebt gegeven', 'heeft gegeven', 'hebben gegeven', 'hebben gegeven', 'hebben gegeven'],
      condicional: ['zou geven', 'zou geven', 'zou geven', 'zouden geven', 'zouden geven', 'zouden geven'],
      subjuntivo: ['geef', 'geeft', 'geeft', 'geven', 'geven', 'geven'],
      continuo: ['ben aan het geven', 'bent aan het geven', 'is aan het geven', 'zijn aan het geven', 'zijn aan het geven', 'zijn aan het geven'],
      pluscuamperfecto: ['had gegeven', 'had gegeven', 'had gegeven', 'hadden gegeven', 'hadden gegeven', 'hadden gegeven']
    }
  },
  {
    id: 34, infinitive: 'ver', dutch: 'zien', group: 'onregelmatig',
    conjugations: {
      presente: ['veo', 'ves', 've', 'vemos', 'veis', 'ven'],
      futuro: ['veré', 'verás', 'verá', 'veremos', 'veréis', 'verán'],
      imperfecto: ['veía', 'veías', 'veía', 'veíamos', 'veíais', 'veían'],
      indefinido: ['vi', 'viste', 'vio', 'vimos', 'visteis', 'vieron'],
      gebiedende_wijs: [null, 've', 'vea', 'veamos', 'ved', 'vean']
    },
    herkennen: {
      perfecto: ['he visto', 'has visto', 'ha visto', 'hemos visto', 'habéis visto', 'han visto'],
      condicional: ['vería', 'verías', 'vería', 'veríamos', 'veríais', 'verían'],
      subjuntivo: ['vea', 'veas', 'vea', 'veamos', 'veáis', 'vean'],
      continuo: ['estoy viendo', 'estás viendo', 'está viendo', 'estamos viendo', 'estáis viendo', 'están viendo'],
      pluscuamperfecto: ['había visto', 'habías visto', 'había visto', 'habíamos visto', 'habíais visto', 'habían visto']
    },
    herkennenNl: {
      perfecto: ['heb gezien', 'hebt gezien', 'heeft gezien', 'hebben gezien', 'hebben gezien', 'hebben gezien'],
      condicional: ['zou zien', 'zou zien', 'zou zien', 'zouden zien', 'zouden zien', 'zouden zien'],
      subjuntivo: ['zie', 'ziet', 'ziet', 'zien', 'zien', 'zien'],
      continuo: ['ben aan het zien', 'bent aan het zien', 'is aan het zien', 'zijn aan het zien', 'zijn aan het zien', 'zijn aan het zien'],
      pluscuamperfecto: ['had gezien', 'had gezien', 'had gezien', 'hadden gezien', 'hadden gezien', 'hadden gezien']
    }
  },
  {
    id: 35, infinitive: 'jugar', dutch: 'spelen', group: 'onregelmatig',
    conjugations: {
      presente: ['juego', 'juegas', 'juega', 'jugamos', 'jugáis', 'juegan'],
      futuro: ['jugaré', 'jugarás', 'jugará', 'jugaremos', 'jugaréis', 'jugarán'],
      imperfecto: ['jugaba', 'jugabas', 'jugaba', 'jugábamos', 'jugabais', 'jugaban'],
      indefinido: ['jugué', 'jugaste', 'jugó', 'jugamos', 'jugasteis', 'jugaron'],
      gebiedende_wijs: [null, 'juega', 'juegue', 'juguemos', 'jugad', 'jueguen']
    },
    herkennen: {
      perfecto: ['he jugado', 'has jugado', 'ha jugado', 'hemos jugado', 'habéis jugado', 'han jugado'],
      condicional: ['jugaría', 'jugarías', 'jugaría', 'jugaríamos', 'jugaríais', 'jugarían'],
      subjuntivo: ['juegue', 'juegues', 'juegue', 'juguemos', 'juguéis', 'jueguen'],
      continuo: ['estoy jugando', 'estás jugando', 'está jugando', 'estamos jugando', 'estáis jugando', 'están jugando'],
      pluscuamperfecto: ['había jugado', 'habías jugado', 'había jugado', 'habíamos jugado', 'habíais jugado', 'habían jugado']
    },
    herkennenNl: {
      perfecto: ['heb gespeeld', 'hebt gespeeld', 'heeft gespeeld', 'hebben gespeeld', 'hebben gespeeld', 'hebben gespeeld'],
      condicional: ['zou spelen', 'zou spelen', 'zou spelen', 'zouden spelen', 'zouden spelen', 'zouden spelen'],
      subjuntivo: ['speel', 'speelt', 'speelt', 'spelen', 'spelen', 'spelen'],
      continuo: ['ben aan het spelen', 'bent aan het spelen', 'is aan het spelen', 'zijn aan het spelen', 'zijn aan het spelen', 'zijn aan het spelen'],
      pluscuamperfecto: ['had gespeeld', 'had gespeeld', 'had gespeeld', 'hadden gespeeld', 'hadden gespeeld', 'hadden gespeeld']
    }
  },
  {
    id: 36, infinitive: 'pedir', dutch: 'vragen om', group: 'onregelmatig',
    conjugations: {
      presente: ['pido', 'pides', 'pide', 'pedimos', 'pedís', 'piden'],
      futuro: ['pediré', 'pedirás', 'pedirá', 'pediremos', 'pediréis', 'pedirán'],
      imperfecto: ['pedía', 'pedías', 'pedía', 'pedíamos', 'pedíais', 'pedían'],
      indefinido: ['pedí', 'pediste', 'pidió', 'pedimos', 'pedisteis', 'pidieron'],
      gebiedende_wijs: [null, 'pide', 'pida', 'pidamos', 'pedid', 'pidan']
    },
    herkennen: {
      perfecto: ['he pedido', 'has pedido', 'ha pedido', 'hemos pedido', 'habéis pedido', 'han pedido'],
      condicional: ['pediría', 'pedirías', 'pediría', 'pediríamos', 'pediríais', 'pedirían'],
      subjuntivo: ['pida', 'pidas', 'pida', 'pidamos', 'pidáis', 'pidan'],
      continuo: ['estoy pidiendo', 'estás pidiendo', 'está pidiendo', 'estamos pidiendo', 'estáis pidiendo', 'están pidiendo'],
      pluscuamperfecto: ['había pedido', 'habías pedido', 'había pedido', 'habíamos pedido', 'habíais pedido', 'habían pedido']
    },
    herkennenNl: {
      perfecto: ['heb gevraagd om', 'hebt gevraagd om', 'heeft gevraagd om', 'hebben gevraagd om', 'hebben gevraagd om', 'hebben gevraagd om'],
      condicional: ['zou vragen om', 'zou vragen om', 'zou vragen om', 'zouden vragen om', 'zouden vragen om', 'zouden vragen om'],
      subjuntivo: ['vraag om', 'vraagt om', 'vraagt om', 'vragen om', 'vragen om', 'vragen om'],
      continuo: ['ben aan het vragen om', 'bent aan het vragen om', 'is aan het vragen om', 'zijn aan het vragen om', 'zijn aan het vragen om', 'zijn aan het vragen om'],
      pluscuamperfecto: ['had gevraagd om', 'had gevraagd om', 'had gevraagd om', 'hadden gevraagd om', 'hadden gevraagd om', 'hadden gevraagd om']
    }
  },
  {
    id: 37, infinitive: 'dormir', dutch: 'slapen', group: 'onregelmatig',
    conjugations: {
      presente: ['duermo', 'duermes', 'duerme', 'dormimos', 'dormís', 'duermen'],
      futuro: ['dormiré', 'dormirás', 'dormirá', 'dormiremos', 'dormiréis', 'dormirán'],
      imperfecto: ['dormía', 'dormías', 'dormía', 'dormíamos', 'dormíais', 'dormían'],
      indefinido: ['dormí', 'dormiste', 'durmió', 'dormimos', 'dormisteis', 'durmieron'],
      gebiedende_wijs: [null, 'duerme', 'duerma', 'durmamos', 'dormid', 'duerman']
    },
    herkennen: {
      perfecto: ['he dormido', 'has dormido', 'ha dormido', 'hemos dormido', 'habéis dormido', 'han dormido'],
      condicional: ['dormiría', 'dormirías', 'dormiría', 'dormiríamos', 'dormiríais', 'dormirían'],
      subjuntivo: ['duerma', 'duermas', 'duerma', 'durmamos', 'durmáis', 'duerman'],
      continuo: ['estoy durmiendo', 'estás durmiendo', 'está durmiendo', 'estamos durmiendo', 'estáis durmiendo', 'están durmiendo'],
      pluscuamperfecto: ['había dormido', 'habías dormido', 'había dormido', 'habíamos dormido', 'habíais dormido', 'habían dormido']
    },
    herkennenNl: {
      perfecto: ['heb geslapen', 'hebt geslapen', 'heeft geslapen', 'hebben geslapen', 'hebben geslapen', 'hebben geslapen'],
      condicional: ['zou slapen', 'zou slapen', 'zou slapen', 'zouden slapen', 'zouden slapen', 'zouden slapen'],
      subjuntivo: ['slaap', 'slaapt', 'slaapt', 'slapen', 'slapen', 'slapen'],
      continuo: ['ben aan het slapen', 'bent aan het slapen', 'is aan het slapen', 'zijn aan het slapen', 'zijn aan het slapen', 'zijn aan het slapen'],
      pluscuamperfecto: ['had geslapen', 'had geslapen', 'had geslapen', 'hadden geslapen', 'hadden geslapen', 'hadden geslapen']
    }
  },
  {
    id: 38, infinitive: 'pensar', dutch: 'denken', group: 'onregelmatig',
    conjugations: {
      presente: ['pienso', 'piensas', 'piensa', 'pensamos', 'pensáis', 'piensan'],
      futuro: ['pensaré', 'pensarás', 'pensará', 'pensaremos', 'pensaréis', 'pensarán'],
      imperfecto: ['pensaba', 'pensabas', 'pensaba', 'pensábamos', 'pensabais', 'pensaban'],
      indefinido: ['pensé', 'pensaste', 'pensó', 'pensamos', 'pensasteis', 'pensaron'],
      gebiedende_wijs: [null, 'piensa', 'piense', 'pensemos', 'pensad', 'piensen']
    },
    herkennen: {
      perfecto: ['he pensado', 'has pensado', 'ha pensado', 'hemos pensado', 'habéis pensado', 'han pensado'],
      condicional: ['pensaría', 'pensarías', 'pensaría', 'pensaríamos', 'pensaríais', 'pensarían'],
      subjuntivo: ['piense', 'pienses', 'piense', 'pensemos', 'penséis', 'piensen'],
      continuo: ['estoy pensando', 'estás pensando', 'está pensando', 'estamos pensando', 'estáis pensando', 'están pensando'],
      pluscuamperfecto: ['había pensado', 'habías pensado', 'había pensado', 'habíamos pensado', 'habíais pensado', 'habían pensado']
    },
    herkennenNl: {
      perfecto: ['heb gedacht', 'hebt gedacht', 'heeft gedacht', 'hebben gedacht', 'hebben gedacht', 'hebben gedacht'],
      condicional: ['zou denken', 'zou denken', 'zou denken', 'zouden denken', 'zouden denken', 'zouden denken'],
      subjuntivo: ['denk', 'denkt', 'denkt', 'denken', 'denken', 'denken'],
      continuo: ['ben aan het denken', 'bent aan het denken', 'is aan het denken', 'zijn aan het denken', 'zijn aan het denken', 'zijn aan het denken'],
      pluscuamperfecto: ['had gedacht', 'had gedacht', 'had gedacht', 'hadden gedacht', 'hadden gedacht', 'hadden gedacht']
    }
  },
  {
    id: 39, infinitive: 'volver', dutch: 'terugkeren', group: 'onregelmatig',
    conjugations: {
      presente: ['vuelvo', 'vuelves', 'vuelve', 'volvemos', 'volvéis', 'vuelven'],
      futuro: ['volveré', 'volverás', 'volverá', 'volveremos', 'volveréis', 'volverán'],
      imperfecto: ['volvía', 'volvías', 'volvía', 'volvíamos', 'volvíais', 'volvían'],
      indefinido: ['volví', 'volviste', 'volvió', 'volvimos', 'volvisteis', 'volvieron'],
      gebiedende_wijs: [null, 'vuelve', 'vuelva', 'volvamos', 'volved', 'vuelvan']
    },
    herkennen: {
      perfecto: ['he vuelto', 'has vuelto', 'ha vuelto', 'hemos vuelto', 'habéis vuelto', 'han vuelto'],
      condicional: ['volvería', 'volverías', 'volvería', 'volveríamos', 'volveríais', 'volverían'],
      subjuntivo: ['vuelva', 'vuelvas', 'vuelva', 'volvamos', 'volváis', 'vuelvan'],
      continuo: ['estoy volviendo', 'estás volviendo', 'está volviendo', 'estamos volviendo', 'estáis volviendo', 'están volviendo'],
      pluscuamperfecto: ['había vuelto', 'habías vuelto', 'había vuelto', 'habíamos vuelto', 'habíais vuelto', 'habían vuelto']
    },
    herkennenNl: {
      perfecto: ['ben teruggekeerd', 'bent teruggekeerd', 'is teruggekeerd', 'zijn teruggekeerd', 'zijn teruggekeerd', 'zijn teruggekeerd'],
      condicional: ['zou terugkeren', 'zou terugkeren', 'zou terugkeren', 'zouden terugkeren', 'zouden terugkeren', 'zouden terugkeren'],
      subjuntivo: ['keer terug', 'keert terug', 'keert terug', 'terugkeren', 'terugkeren', 'terugkeren'],
      continuo: ['ben aan het terugkeren', 'bent aan het terugkeren', 'is aan het terugkeren', 'zijn aan het terugkeren', 'zijn aan het terugkeren', 'zijn aan het terugkeren'],
      pluscuamperfecto: ['was teruggekeerd', 'was teruggekeerd', 'was teruggekeerd', 'waren teruggekeerd', 'waren teruggekeerd', 'waren teruggekeerd']
    }
  },
  {
    id: 40, infinitive: 'empezar', dutch: 'beginnen', group: 'onregelmatig',
    conjugations: {
      presente: ['empiezo', 'empiezas', 'empieza', 'empezamos', 'empezáis', 'empiezan'],
      futuro: ['empezaré', 'empezarás', 'empezará', 'empezaremos', 'empezaréis', 'empezarán'],
      imperfecto: ['empezaba', 'empezabas', 'empezaba', 'empezábamos', 'empezabais', 'empezaban'],
      indefinido: ['empecé', 'empezaste', 'empezó', 'empezamos', 'empezasteis', 'empezaron'],
      gebiedende_wijs: [null, 'empieza', 'empiece', 'empecemos', 'empezad', 'empiecen']
    },
    herkennen: {
      perfecto: ['he empezado', 'has empezado', 'ha empezado', 'hemos empezado', 'habéis empezado', 'han empezado'],
      condicional: ['empezaría', 'empezarías', 'empezaría', 'empezaríamos', 'empezaríais', 'empezarían'],
      subjuntivo: ['empiece', 'empieces', 'empiece', 'empecemos', 'empecéis', 'empiecen'],
      continuo: ['estoy empezando', 'estás empezando', 'está empezando', 'estamos empezando', 'estáis empezando', 'están empezando'],
      pluscuamperfecto: ['había empezado', 'habías empezado', 'había empezado', 'habíamos empezado', 'habíais empezado', 'habían empezado']
    },
    herkennenNl: {
      perfecto: ['ben begonnen', 'bent begonnen', 'is begonnen', 'zijn begonnen', 'zijn begonnen', 'zijn begonnen'],
      condicional: ['zou beginnen', 'zou beginnen', 'zou beginnen', 'zouden beginnen', 'zouden beginnen', 'zouden beginnen'],
      subjuntivo: ['begin', 'begint', 'begint', 'beginnen', 'beginnen', 'beginnen'],
      continuo: ['ben aan het beginnen', 'bent aan het beginnen', 'is aan het beginnen', 'zijn aan het beginnen', 'zijn aan het beginnen', 'zijn aan het beginnen'],
      pluscuamperfecto: ['was begonnen', 'was begonnen', 'was begonnen', 'waren begonnen', 'waren begonnen', 'waren begonnen']
    }
  },

  // ── Extra regelmatige -ar werkwoorden ──
  {
    id: 41, infinitive: 'tomar', dutch: 'nemen, drinken', group: 'ar-regelmatig',
    conjugations: {
      presente: ['tomo', 'tomas', 'toma', 'tomamos', 'tomáis', 'toman'],
      futuro: ['tomaré', 'tomarás', 'tomará', 'tomaremos', 'tomaréis', 'tomarán'],
      imperfecto: ['tomaba', 'tomabas', 'tomaba', 'tomábamos', 'tomabais', 'tomaban'],
      indefinido: ['tomé', 'tomaste', 'tomó', 'tomamos', 'tomasteis', 'tomaron'],
      gebiedende_wijs: [null, 'toma', 'tome', 'tomemos', 'tomad', 'tomen']
    },
    herkennen: {
      perfecto: ['he tomado', 'has tomado', 'ha tomado', 'hemos tomado', 'habéis tomado', 'han tomado'],
      condicional: ['tomaría', 'tomarías', 'tomaría', 'tomaríamos', 'tomaríais', 'tomarían'],
      subjuntivo: ['tome', 'tomes', 'tome', 'tomemos', 'toméis', 'tomen'],
      continuo: ['estoy tomando', 'estás tomando', 'está tomando', 'estamos tomando', 'estáis tomando', 'están tomando'],
      pluscuamperfecto: ['había tomado', 'habías tomado', 'había tomado', 'habíamos tomado', 'habíais tomado', 'habían tomado']
    },
    herkennenNl: {
      perfecto: ['heb genomen', 'hebt genomen', 'heeft genomen', 'hebben genomen', 'hebben genomen', 'hebben genomen'],
      condicional: ['zou nemen', 'zou nemen', 'zou nemen', 'zouden nemen', 'zouden nemen', 'zouden nemen'],
      subjuntivo: ['neem', 'neemt', 'neemt', 'nemen', 'nemen', 'nemen'],
      continuo: ['ben aan het nemen', 'bent aan het nemen', 'is aan het nemen', 'zijn aan het nemen', 'zijn aan het nemen', 'zijn aan het nemen'],
      pluscuamperfecto: ['had genomen', 'had genomen', 'had genomen', 'hadden genomen', 'hadden genomen', 'hadden genomen']
    }
  },
  {
    id: 42, infinitive: 'llamar', dutch: 'noemen, bellen', group: 'ar-regelmatig',
    conjugations: {
      presente: ['llamo', 'llamas', 'llama', 'llamamos', 'llamáis', 'llaman'],
      futuro: ['llamaré', 'llamarás', 'llamará', 'llamaremos', 'llamaréis', 'llamarán'],
      imperfecto: ['llamaba', 'llamabas', 'llamaba', 'llamábamos', 'llamabais', 'llamaban'],
      indefinido: ['llamé', 'llamaste', 'llamó', 'llamamos', 'llamasteis', 'llamaron'],
      gebiedende_wijs: [null, 'llama', 'llame', 'llamemos', 'llamad', 'llamen']
    },
    herkennen: {
      perfecto: ['he llamado', 'has llamado', 'ha llamado', 'hemos llamado', 'habéis llamado', 'han llamado'],
      condicional: ['llamaría', 'llamarías', 'llamaría', 'llamaríamos', 'llamaríais', 'llamarían'],
      subjuntivo: ['llame', 'llames', 'llame', 'llamemos', 'llaméis', 'llamen'],
      continuo: ['estoy llamando', 'estás llamando', 'está llamando', 'estamos llamando', 'estáis llamando', 'están llamando'],
      pluscuamperfecto: ['había llamado', 'habías llamado', 'había llamado', 'habíamos llamado', 'habíais llamado', 'habían llamado']
    },
    herkennenNl: {
      perfecto: ['heb genoemd', 'hebt genoemd', 'heeft genoemd', 'hebben genoemd', 'hebben genoemd', 'hebben genoemd'],
      condicional: ['zou noemen', 'zou noemen', 'zou noemen', 'zouden noemen', 'zouden noemen', 'zouden noemen'],
      subjuntivo: ['noem', 'noemt', 'noemt', 'noemen', 'noemen', 'noemen'],
      continuo: ['ben aan het noemen', 'bent aan het noemen', 'is aan het noemen', 'zijn aan het noemen', 'zijn aan het noemen', 'zijn aan het noemen'],
      pluscuamperfecto: ['had genoemd', 'had genoemd', 'had genoemd', 'hadden genoemd', 'hadden genoemd', 'hadden genoemd']
    }
  },
  {
    id: 43, infinitive: 'ayudar', dutch: 'helpen', group: 'ar-regelmatig',
    conjugations: {
      presente: ['ayudo', 'ayudas', 'ayuda', 'ayudamos', 'ayudáis', 'ayudan'],
      futuro: ['ayudaré', 'ayudarás', 'ayudará', 'ayudaremos', 'ayudaréis', 'ayudarán'],
      imperfecto: ['ayudaba', 'ayudabas', 'ayudaba', 'ayudábamos', 'ayudabais', 'ayudaban'],
      indefinido: ['ayudé', 'ayudaste', 'ayudó', 'ayudamos', 'ayudasteis', 'ayudaron'],
      gebiedende_wijs: [null, 'ayuda', 'ayude', 'ayudemos', 'ayudad', 'ayuden']
    },
    herkennen: {
      perfecto: ['he ayudado', 'has ayudado', 'ha ayudado', 'hemos ayudado', 'habéis ayudado', 'han ayudado'],
      condicional: ['ayudaría', 'ayudarías', 'ayudaría', 'ayudaríamos', 'ayudaríais', 'ayudarían'],
      subjuntivo: ['ayude', 'ayudes', 'ayude', 'ayudemos', 'ayudéis', 'ayuden'],
      continuo: ['estoy ayudando', 'estás ayudando', 'está ayudando', 'estamos ayudando', 'estáis ayudando', 'están ayudando'],
      pluscuamperfecto: ['había ayudado', 'habías ayudado', 'había ayudado', 'habíamos ayudado', 'habíais ayudado', 'habían ayudado']
    },
    herkennenNl: {
      perfecto: ['heb geholpen', 'hebt geholpen', 'heeft geholpen', 'hebben geholpen', 'hebben geholpen', 'hebben geholpen'],
      condicional: ['zou helpen', 'zou helpen', 'zou helpen', 'zouden helpen', 'zouden helpen', 'zouden helpen'],
      subjuntivo: ['help', 'helpt', 'helpt', 'helpen', 'helpen', 'helpen'],
      continuo: ['ben aan het helpen', 'bent aan het helpen', 'is aan het helpen', 'zijn aan het helpen', 'zijn aan het helpen', 'zijn aan het helpen'],
      pluscuamperfecto: ['had geholpen', 'had geholpen', 'had geholpen', 'hadden geholpen', 'hadden geholpen', 'hadden geholpen']
    }
  },

  // ── Extra regelmatige -er werkwoorden ──
  {
    id: 44, infinitive: 'romper', dutch: 'breken', group: 'er-regelmatig',
    conjugations: {
      presente: ['rompo', 'rompes', 'rompe', 'rompemos', 'rompéis', 'rompen'],
      futuro: ['romperé', 'romperás', 'romperá', 'romperemos', 'romperéis', 'romperán'],
      imperfecto: ['rompía', 'rompías', 'rompía', 'rompíamos', 'rompíais', 'rompían'],
      indefinido: ['rompí', 'rompiste', 'rompió', 'rompimos', 'rompisteis', 'rompieron'],
      gebiedende_wijs: [null, 'rompe', 'rompa', 'rompamos', 'romped', 'rompan']
    },
    herkennen: {
      perfecto: ['he roto', 'has roto', 'ha roto', 'hemos roto', 'habéis roto', 'han roto'],
      condicional: ['rompería', 'romperías', 'rompería', 'romperíamos', 'romperíais', 'romperían'],
      subjuntivo: ['rompa', 'rompas', 'rompa', 'rompamos', 'rompáis', 'rompan'],
      continuo: ['estoy rompiendo', 'estás rompiendo', 'está rompiendo', 'estamos rompiendo', 'estáis rompiendo', 'están rompiendo'],
      pluscuamperfecto: ['había roto', 'habías roto', 'había roto', 'habíamos roto', 'habíais roto', 'habían roto']
    },
    herkennenNl: {
      perfecto: ['heb gebroken', 'hebt gebroken', 'heeft gebroken', 'hebben gebroken', 'hebben gebroken', 'hebben gebroken'],
      condicional: ['zou breken', 'zou breken', 'zou breken', 'zouden breken', 'zouden breken', 'zouden breken'],
      subjuntivo: ['breek', 'breekt', 'breekt', 'breken', 'breken', 'breken'],
      continuo: ['ben aan het breken', 'bent aan het breken', 'is aan het breken', 'zijn aan het breken', 'zijn aan het breken', 'zijn aan het breken'],
      pluscuamperfecto: ['had gebroken', 'had gebroken', 'had gebroken', 'hadden gebroken', 'hadden gebroken', 'hadden gebroken']
    }
  },
  {
    id: 45, infinitive: 'meter', dutch: 'erin stoppen', group: 'er-regelmatig',
    conjugations: {
      presente: ['meto', 'metes', 'mete', 'metemos', 'metéis', 'meten'],
      futuro: ['meteré', 'meterás', 'meterá', 'meteremos', 'meteréis', 'meterán'],
      imperfecto: ['metía', 'metías', 'metía', 'metíamos', 'metíais', 'metían'],
      indefinido: ['metí', 'metiste', 'metió', 'metimos', 'metisteis', 'metieron'],
      gebiedende_wijs: [null, 'mete', 'meta', 'metamos', 'meted', 'metan']
    },
    herkennen: {
      perfecto: ['he metido', 'has metido', 'ha metido', 'hemos metido', 'habéis metido', 'han metido'],
      condicional: ['metería', 'meterías', 'metería', 'meteríamos', 'meteríais', 'meterían'],
      subjuntivo: ['meta', 'metas', 'meta', 'metamos', 'metáis', 'metan'],
      continuo: ['estoy metiendo', 'estás metiendo', 'está metiendo', 'estamos metiendo', 'estáis metiendo', 'están metiendo'],
      pluscuamperfecto: ['había metido', 'habías metido', 'había metido', 'habíamos metido', 'habíais metido', 'habían metido']
    },
    herkennenNl: {
      perfecto: ['heb erin gestopt', 'hebt erin gestopt', 'heeft erin gestopt', 'hebben erin gestopt', 'hebben erin gestopt', 'hebben erin gestopt'],
      condicional: ['zou erin stoppen', 'zou erin stoppen', 'zou erin stoppen', 'zouden erin stoppen', 'zouden erin stoppen', 'zouden erin stoppen'],
      subjuntivo: ['stop erin', 'stopt erin', 'stopt erin', 'erin stoppen', 'erin stoppen', 'erin stoppen'],
      continuo: ['ben aan het erin stoppen', 'bent aan het erin stoppen', 'is aan het erin stoppen', 'zijn aan het erin stoppen', 'zijn aan het erin stoppen', 'zijn aan het erin stoppen'],
      pluscuamperfecto: ['had erin gestopt', 'had erin gestopt', 'had erin gestopt', 'hadden erin gestopt', 'hadden erin gestopt', 'hadden erin gestopt']
    }
  },
  {
    id: 46, infinitive: 'responder', dutch: 'antwoorden', group: 'er-regelmatig',
    conjugations: {
      presente: ['respondo', 'respondes', 'responde', 'respondemos', 'respondéis', 'responden'],
      futuro: ['responderé', 'responderás', 'responderá', 'responderemos', 'responderéis', 'responderán'],
      imperfecto: ['respondía', 'respondías', 'respondía', 'respondíamos', 'respondíais', 'respondían'],
      indefinido: ['respondí', 'respondiste', 'respondió', 'respondimos', 'respondisteis', 'respondieron'],
      gebiedende_wijs: [null, 'responde', 'responda', 'respondamos', 'responded', 'respondan']
    },
    herkennen: {
      perfecto: ['he respondido', 'has respondido', 'ha respondido', 'hemos respondido', 'habéis respondido', 'han respondido'],
      condicional: ['respondería', 'responderías', 'respondería', 'responderíamos', 'responderíais', 'responderían'],
      subjuntivo: ['responda', 'respondas', 'responda', 'respondamos', 'respondáis', 'respondan'],
      continuo: ['estoy respondiendo', 'estás respondiendo', 'está respondiendo', 'estamos respondiendo', 'estáis respondiendo', 'están respondiendo'],
      pluscuamperfecto: ['había respondido', 'habías respondido', 'había respondido', 'habíamos respondido', 'habíais respondido', 'habían respondido']
    },
    herkennenNl: {
      perfecto: ['heb geantwoord', 'hebt geantwoord', 'heeft geantwoord', 'hebben geantwoord', 'hebben geantwoord', 'hebben geantwoord'],
      condicional: ['zou antwoorden', 'zou antwoorden', 'zou antwoorden', 'zouden antwoorden', 'zouden antwoorden', 'zouden antwoorden'],
      subjuntivo: ['antwoord', 'antwoordt', 'antwoordt', 'antwoorden', 'antwoorden', 'antwoorden'],
      continuo: ['ben aan het antwoorden', 'bent aan het antwoorden', 'is aan het antwoorden', 'zijn aan het antwoorden', 'zijn aan het antwoorden', 'zijn aan het antwoorden'],
      pluscuamperfecto: ['had geantwoord', 'had geantwoord', 'had geantwoord', 'hadden geantwoord', 'hadden geantwoord', 'hadden geantwoord']
    }
  },

  // ── Extra regelmatige -ir werkwoorden ──
  {
    id: 47, infinitive: 'subir', dutch: 'omhoog gaan, instappen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['subo', 'subes', 'sube', 'subimos', 'subís', 'suben'],
      futuro: ['subiré', 'subirás', 'subirá', 'subiremos', 'subiréis', 'subirán'],
      imperfecto: ['subía', 'subías', 'subía', 'subíamos', 'subíais', 'subían'],
      indefinido: ['subí', 'subiste', 'subió', 'subimos', 'subisteis', 'subieron'],
      gebiedende_wijs: [null, 'sube', 'suba', 'subamos', 'subid', 'suban']
    },
    herkennen: {
      perfecto: ['he subido', 'has subido', 'ha subido', 'hemos subido', 'habéis subido', 'han subido'],
      condicional: ['subiría', 'subirías', 'subiría', 'subiríamos', 'subiríais', 'subirían'],
      subjuntivo: ['suba', 'subas', 'suba', 'subamos', 'subáis', 'suban'],
      continuo: ['estoy subiendo', 'estás subiendo', 'está subiendo', 'estamos subiendo', 'estáis subiendo', 'están subiendo'],
      pluscuamperfecto: ['había subido', 'habías subido', 'había subido', 'habíamos subido', 'habíais subido', 'habían subido']
    },
    herkennenNl: {
      perfecto: ['ben omhoog gegaan', 'bent omhoog gegaan', 'is omhoog gegaan', 'zijn omhoog gegaan', 'zijn omhoog gegaan', 'zijn omhoog gegaan'],
      condicional: ['zou omhoog gaan', 'zou omhoog gaan', 'zou omhoog gaan', 'zouden omhoog gaan', 'zouden omhoog gaan', 'zouden omhoog gaan'],
      subjuntivo: ['ga omhoog', 'gaat omhoog', 'gaat omhoog', 'omhoog gaan', 'omhoog gaan', 'omhoog gaan'],
      continuo: ['ben aan het omhoog gaan', 'bent aan het omhoog gaan', 'is aan het omhoog gaan', 'zijn aan het omhoog gaan', 'zijn aan het omhoog gaan', 'zijn aan het omhoog gaan'],
      pluscuamperfecto: ['was omhoog gegaan', 'was omhoog gegaan', 'was omhoog gegaan', 'waren omhoog gegaan', 'waren omhoog gegaan', 'waren omhoog gegaan']
    }
  },
  {
    id: 48, infinitive: 'permitir', dutch: 'toestaan', group: 'ir-regelmatig',
    conjugations: {
      presente: ['permito', 'permites', 'permite', 'permitimos', 'permitís', 'permiten'],
      futuro: ['permitiré', 'permitirás', 'permitirá', 'permitiremos', 'permitiréis', 'permitirán'],
      imperfecto: ['permitía', 'permitías', 'permitía', 'permitíamos', 'permitíais', 'permitían'],
      indefinido: ['permití', 'permitiste', 'permitió', 'permitimos', 'permitisteis', 'permitieron'],
      gebiedende_wijs: [null, 'permite', 'permita', 'permitamos', 'permitid', 'permitan']
    },
    herkennen: {
      perfecto: ['he permitido', 'has permitido', 'ha permitido', 'hemos permitido', 'habéis permitido', 'han permitido'],
      condicional: ['permitiría', 'permitirías', 'permitiría', 'permitiríamos', 'permitiríais', 'permitirían'],
      subjuntivo: ['permita', 'permitas', 'permita', 'permitamos', 'permitáis', 'permitan'],
      continuo: ['estoy permitiendo', 'estás permitiendo', 'está permitiendo', 'estamos permitiendo', 'estáis permitiendo', 'están permitiendo'],
      pluscuamperfecto: ['había permitido', 'habías permitido', 'había permitido', 'habíamos permitido', 'habíais permitido', 'habían permitido']
    },
    herkennenNl: {
      perfecto: ['heb toegestaan', 'hebt toegestaan', 'heeft toegestaan', 'hebben toegestaan', 'hebben toegestaan', 'hebben toegestaan'],
      condicional: ['zou toestaan', 'zou toestaan', 'zou toestaan', 'zouden toestaan', 'zouden toestaan', 'zouden toestaan'],
      subjuntivo: ['sta toe', 'staat toe', 'staat toe', 'toestaan', 'toestaan', 'toestaan'],
      continuo: ['ben aan het toestaan', 'bent aan het toestaan', 'is aan het toestaan', 'zijn aan het toestaan', 'zijn aan het toestaan', 'zijn aan het toestaan'],
      pluscuamperfecto: ['had toegestaan', 'had toegestaan', 'had toegestaan', 'hadden toegestaan', 'hadden toegestaan', 'hadden toegestaan']
    }
  },
  {
    id: 49, infinitive: 'asistir', dutch: 'aanwezig zijn, bijwonen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['asisto', 'asistes', 'asiste', 'asistimos', 'asistís', 'asisten'],
      futuro: ['asistiré', 'asistirás', 'asistirá', 'asistiremos', 'asistiréis', 'asistirán'],
      imperfecto: ['asistía', 'asistías', 'asistía', 'asistíamos', 'asistíais', 'asistían'],
      indefinido: ['asistí', 'asististe', 'asistió', 'asistimos', 'asististeis', 'asistieron'],
      gebiedende_wijs: [null, 'asiste', 'asista', 'asistamos', 'asistid', 'asistan']
    },
    herkennen: {
      perfecto: ['he asistido', 'has asistido', 'ha asistido', 'hemos asistido', 'habéis asistido', 'han asistido'],
      condicional: ['asistiría', 'asistirías', 'asistiría', 'asistiríamos', 'asistiríais', 'asistirían'],
      subjuntivo: ['asista', 'asistas', 'asista', 'asistamos', 'asistáis', 'asistan'],
      continuo: ['estoy asistiendo', 'estás asistiendo', 'está asistiendo', 'estamos asistiendo', 'estáis asistiendo', 'están asistiendo'],
      pluscuamperfecto: ['había asistido', 'habías asistido', 'había asistido', 'habíamos asistido', 'habíais asistido', 'habían asistido']
    },
    herkennenNl: {
      perfecto: ['ben aanwezig geweest', 'bent aanwezig geweest', 'is aanwezig geweest', 'zijn aanwezig geweest', 'zijn aanwezig geweest', 'zijn aanwezig geweest'],
      condicional: ['zou aanwezig zijn', 'zou aanwezig zijn', 'zou aanwezig zijn', 'zouden aanwezig zijn', 'zouden aanwezig zijn', 'zouden aanwezig zijn'],
      subjuntivo: ['ben aanwezig', 'is aanwezig', 'is aanwezig', 'aanwezig zijn', 'aanwezig zijn', 'aanwezig zijn'],
      continuo: ['ben aan het aanwezig zijn', 'bent aan het aanwezig zijn', 'is aan het aanwezig zijn', 'zijn aan het aanwezig zijn', 'zijn aan het aanwezig zijn', 'zijn aan het aanwezig zijn'],
      pluscuamperfecto: ['was aanwezig geweest', 'was aanwezig geweest', 'was aanwezig geweest', 'waren aanwezig geweest', 'waren aanwezig geweest', 'waren aanwezig geweest']
    }
  },

  // ── Nog meer regelmatige -ar werkwoorden ──
  {
    id: 50, infinitive: 'viajar', dutch: 'reizen', group: 'ar-regelmatig',
    conjugations: {
      presente: ['viajo', 'viajas', 'viaja', 'viajamos', 'viajáis', 'viajan'],
      futuro: ['viajaré', 'viajarás', 'viajará', 'viajaremos', 'viajaréis', 'viajarán'],
      imperfecto: ['viajaba', 'viajabas', 'viajaba', 'viajábamos', 'viajabais', 'viajaban'],
      indefinido: ['viajé', 'viajaste', 'viajó', 'viajamos', 'viajasteis', 'viajaron'],
      gebiedende_wijs: [null, 'viaja', 'viaje', 'viajemos', 'viajad', 'viajen']
    },
    herkennen: {
      perfecto: ['he viajado', 'has viajado', 'ha viajado', 'hemos viajado', 'habéis viajado', 'han viajado'],
      condicional: ['viajaría', 'viajarías', 'viajaría', 'viajaríamos', 'viajaríais', 'viajarían'],
      subjuntivo: ['viaje', 'viajes', 'viaje', 'viajemos', 'viajéis', 'viajen'],
      continuo: ['estoy viajando', 'estás viajando', 'está viajando', 'estamos viajando', 'estáis viajando', 'están viajando'],
      pluscuamperfecto: ['había viajado', 'habías viajado', 'había viajado', 'habíamos viajado', 'habíais viajado', 'habían viajado']
    },
    herkennenNl: {
      perfecto: ['heb gereisd', 'hebt gereisd', 'heeft gereisd', 'hebben gereisd', 'hebben gereisd', 'hebben gereisd'],
      condicional: ['zou reizen', 'zou reizen', 'zou reizen', 'zouden reizen', 'zouden reizen', 'zouden reizen'],
      subjuntivo: ['reis', 'reist', 'reist', 'reizen', 'reizen', 'reizen'],
      continuo: ['ben aan het reizen', 'bent aan het reizen', 'is aan het reizen', 'zijn aan het reizen', 'zijn aan het reizen', 'zijn aan het reizen'],
      pluscuamperfecto: ['had gereisd', 'had gereisd', 'had gereisd', 'hadden gereisd', 'hadden gereisd', 'hadden gereisd']
    }
  },
  {
    id: 51, infinitive: 'bailar', dutch: 'dansen', group: 'ar-regelmatig',
    conjugations: {
      presente: ['bailo', 'bailas', 'baila', 'bailamos', 'bailáis', 'bailan'],
      futuro: ['bailaré', 'bailarás', 'bailará', 'bailaremos', 'bailaréis', 'bailarán'],
      imperfecto: ['bailaba', 'bailabas', 'bailaba', 'bailábamos', 'bailabais', 'bailaban'],
      indefinido: ['bailé', 'bailaste', 'bailó', 'bailamos', 'bailasteis', 'bailaron'],
      gebiedende_wijs: [null, 'baila', 'baile', 'bailemos', 'bailad', 'bailen']
    },
    herkennen: {
      perfecto: ['he bailado', 'has bailado', 'ha bailado', 'hemos bailado', 'habéis bailado', 'han bailado'],
      condicional: ['bailaría', 'bailarías', 'bailaría', 'bailaríamos', 'bailaríais', 'bailarían'],
      subjuntivo: ['baile', 'bailes', 'baile', 'bailemos', 'bailéis', 'bailen'],
      continuo: ['estoy bailando', 'estás bailando', 'está bailando', 'estamos bailando', 'estáis bailando', 'están bailando'],
      pluscuamperfecto: ['había bailado', 'habías bailado', 'había bailado', 'habíamos bailado', 'habíais bailado', 'habían bailado']
    },
    herkennenNl: {
      perfecto: ['heb gedanst', 'hebt gedanst', 'heeft gedanst', 'hebben gedanst', 'hebben gedanst', 'hebben gedanst'],
      condicional: ['zou dansen', 'zou dansen', 'zou dansen', 'zouden dansen', 'zouden dansen', 'zouden dansen'],
      subjuntivo: ['dans', 'danst', 'danst', 'dansen', 'dansen', 'dansen'],
      continuo: ['ben aan het dansen', 'bent aan het dansen', 'is aan het dansen', 'zijn aan het dansen', 'zijn aan het dansen', 'zijn aan het dansen'],
      pluscuamperfecto: ['had gedanst', 'had gedanst', 'had gedanst', 'hadden gedanst', 'hadden gedanst', 'hadden gedanst']
    }
  },
  {
    id: 52, infinitive: 'cocinar', dutch: 'koken', group: 'ar-regelmatig',
    conjugations: {
      presente: ['cocino', 'cocinas', 'cocina', 'cocinamos', 'cocináis', 'cocinan'],
      futuro: ['cocinaré', 'cocinarás', 'cocinará', 'cocinaremos', 'cocinaréis', 'cocinarán'],
      imperfecto: ['cocinaba', 'cocinabas', 'cocinaba', 'cocinábamos', 'cocinabais', 'cocinaban'],
      indefinido: ['cociné', 'cocinaste', 'cocinó', 'cocinamos', 'cocinasteis', 'cocinaron'],
      gebiedende_wijs: [null, 'cocina', 'cocine', 'cocinemos', 'cocinad', 'cocinen']
    },
    herkennen: {
      perfecto: ['he cocinado', 'has cocinado', 'ha cocinado', 'hemos cocinado', 'habéis cocinado', 'han cocinado'],
      condicional: ['cocinaría', 'cocinarías', 'cocinaría', 'cocinaríamos', 'cocinaríais', 'cocinarían'],
      subjuntivo: ['cocine', 'cocines', 'cocine', 'cocinemos', 'cocinéis', 'cocinen'],
      continuo: ['estoy cocinando', 'estás cocinando', 'está cocinando', 'estamos cocinando', 'estáis cocinando', 'están cocinando'],
      pluscuamperfecto: ['había cocinado', 'habías cocinado', 'había cocinado', 'habíamos cocinado', 'habíais cocinado', 'habían cocinado']
    },
    herkennenNl: {
      perfecto: ['heb gekookt', 'hebt gekookt', 'heeft gekookt', 'hebben gekookt', 'hebben gekookt', 'hebben gekookt'],
      condicional: ['zou koken', 'zou koken', 'zou koken', 'zouden koken', 'zouden koken', 'zouden koken'],
      subjuntivo: ['kook', 'kookt', 'kookt', 'koken', 'koken', 'koken'],
      continuo: ['ben aan het koken', 'bent aan het koken', 'is aan het koken', 'zijn aan het koken', 'zijn aan het koken', 'zijn aan het koken'],
      pluscuamperfecto: ['had gekookt', 'had gekookt', 'had gekookt', 'hadden gekookt', 'hadden gekookt', 'hadden gekookt']
    }
  },
  {
    id: 53, infinitive: 'limpiar', dutch: 'schoonmaken', group: 'ar-regelmatig',
    conjugations: {
      presente: ['limpio', 'limpias', 'limpia', 'limpiamos', 'limpiáis', 'limpian'],
      futuro: ['limpiaré', 'limpiarás', 'limpiará', 'limpiaremos', 'limpiaréis', 'limpiarán'],
      imperfecto: ['limpiaba', 'limpiabas', 'limpiaba', 'limpiábamos', 'limpiabais', 'limpiaban'],
      indefinido: ['limpié', 'limpiaste', 'limpió', 'limpiamos', 'limpiasteis', 'limpiaron'],
      gebiedende_wijs: [null, 'limpia', 'limpie', 'limpiemos', 'limpiad', 'limpien']
    },
    herkennen: {
      perfecto: ['he limpiado', 'has limpiado', 'ha limpiado', 'hemos limpiado', 'habéis limpiado', 'han limpiado'],
      condicional: ['limpiaría', 'limpiarías', 'limpiaría', 'limpiaríamos', 'limpiaríais', 'limpiarían'],
      subjuntivo: ['limpie', 'limpies', 'limpie', 'limpiemos', 'limpiéis', 'limpien'],
      continuo: ['estoy limpiando', 'estás limpiando', 'está limpiando', 'estamos limpiando', 'estáis limpiando', 'están limpiando'],
      pluscuamperfecto: ['había limpiado', 'habías limpiado', 'había limpiado', 'habíamos limpiado', 'habíais limpiado', 'habían limpiado']
    },
    herkennenNl: {
      perfecto: ['heb schoongemaakt', 'hebt schoongemaakt', 'heeft schoongemaakt', 'hebben schoongemaakt', 'hebben schoongemaakt', 'hebben schoongemaakt'],
      condicional: ['zou schoonmaken', 'zou schoonmaken', 'zou schoonmaken', 'zouden schoonmaken', 'zouden schoonmaken', 'zouden schoonmaken'],
      subjuntivo: ['maak schoon', 'maakt schoon', 'maakt schoon', 'schoonmaken', 'schoonmaken', 'schoonmaken'],
      continuo: ['ben aan het schoonmaken', 'bent aan het schoonmaken', 'is aan het schoonmaken', 'zijn aan het schoonmaken', 'zijn aan het schoonmaken', 'zijn aan het schoonmaken'],
      pluscuamperfecto: ['had schoongemaakt', 'had schoongemaakt', 'had schoongemaakt', 'hadden schoongemaakt', 'hadden schoongemaakt', 'hadden schoongemaakt']
    }
  },
  {
    id: 54, infinitive: 'lavar', dutch: 'wassen', group: 'ar-regelmatig',
    conjugations: {
      presente: ['lavo', 'lavas', 'lava', 'lavamos', 'laváis', 'lavan'],
      futuro: ['lavaré', 'lavarás', 'lavará', 'lavaremos', 'lavaréis', 'lavarán'],
      imperfecto: ['lavaba', 'lavabas', 'lavaba', 'lavábamos', 'lavabais', 'lavaban'],
      indefinido: ['lavé', 'lavaste', 'lavó', 'lavamos', 'lavasteis', 'lavaron'],
      gebiedende_wijs: [null, 'lava', 'lave', 'lavemos', 'lavad', 'laven']
    },
    herkennen: {
      perfecto: ['he lavado', 'has lavado', 'ha lavado', 'hemos lavado', 'habéis lavado', 'han lavado'],
      condicional: ['lavaría', 'lavarías', 'lavaría', 'lavaríamos', 'lavaríais', 'lavarían'],
      subjuntivo: ['lave', 'laves', 'lave', 'lavemos', 'lavéis', 'laven'],
      continuo: ['estoy lavando', 'estás lavando', 'está lavando', 'estamos lavando', 'estáis lavando', 'están lavando'],
      pluscuamperfecto: ['había lavado', 'habías lavado', 'había lavado', 'habíamos lavado', 'habíais lavado', 'habían lavado']
    },
    herkennenNl: {
      perfecto: ['heb gewassen', 'hebt gewassen', 'heeft gewassen', 'hebben gewassen', 'hebben gewassen', 'hebben gewassen'],
      condicional: ['zou wassen', 'zou wassen', 'zou wassen', 'zouden wassen', 'zouden wassen', 'zouden wassen'],
      subjuntivo: ['was', 'wast', 'wast', 'wassen', 'wassen', 'wassen'],
      continuo: ['ben aan het wassen', 'bent aan het wassen', 'is aan het wassen', 'zijn aan het wassen', 'zijn aan het wassen', 'zijn aan het wassen'],
      pluscuamperfecto: ['had gewassen', 'had gewassen', 'had gewassen', 'hadden gewassen', 'hadden gewassen', 'hadden gewassen']
    }
  },
  {
    id: 55, infinitive: 'pintar', dutch: 'schilderen, verven', group: 'ar-regelmatig',
    conjugations: {
      presente: ['pinto', 'pintas', 'pinta', 'pintamos', 'pintáis', 'pintan'],
      futuro: ['pintaré', 'pintarás', 'pintará', 'pintaremos', 'pintaréis', 'pintarán'],
      imperfecto: ['pintaba', 'pintabas', 'pintaba', 'pintábamos', 'pintabais', 'pintaban'],
      indefinido: ['pinté', 'pintaste', 'pintó', 'pintamos', 'pintasteis', 'pintaron'],
      gebiedende_wijs: [null, 'pinta', 'pinte', 'pintemos', 'pintad', 'pinten']
    },
    herkennen: {
      perfecto: ['he pintado', 'has pintado', 'ha pintado', 'hemos pintado', 'habéis pintado', 'han pintado'],
      condicional: ['pintaría', 'pintarías', 'pintaría', 'pintaríamos', 'pintaríais', 'pintarían'],
      subjuntivo: ['pinte', 'pintes', 'pinte', 'pintemos', 'pintéis', 'pinten'],
      continuo: ['estoy pintando', 'estás pintando', 'está pintando', 'estamos pintando', 'estáis pintando', 'están pintando'],
      pluscuamperfecto: ['había pintado', 'habías pintado', 'había pintado', 'habíamos pintado', 'habíais pintado', 'habían pintado']
    },
    herkennenNl: {
      perfecto: ['heb geschilderd', 'hebt geschilderd', 'heeft geschilderd', 'hebben geschilderd', 'hebben geschilderd', 'hebben geschilderd'],
      condicional: ['zou schilderen', 'zou schilderen', 'zou schilderen', 'zouden schilderen', 'zouden schilderen', 'zouden schilderen'],
      subjuntivo: ['schilder', 'schildert', 'schildert', 'schilderen', 'schilderen', 'schilderen'],
      continuo: ['ben aan het schilderen', 'bent aan het schilderen', 'is aan het schilderen', 'zijn aan het schilderen', 'zijn aan het schilderen', 'zijn aan het schilderen'],
      pluscuamperfecto: ['had geschilderd', 'had geschilderd', 'had geschilderd', 'hadden geschilderd', 'hadden geschilderd', 'hadden geschilderd']
    }
  },
  {
    id: 56, infinitive: 'cantar', dutch: 'zingen', group: 'ar-regelmatig',
    conjugations: {
      presente: ['canto', 'cantas', 'canta', 'cantamos', 'cantáis', 'cantan'],
      futuro: ['cantaré', 'cantarás', 'cantará', 'cantaremos', 'cantaréis', 'cantarán'],
      imperfecto: ['cantaba', 'cantabas', 'cantaba', 'cantábamos', 'cantabais', 'cantaban'],
      indefinido: ['canté', 'cantaste', 'cantó', 'cantamos', 'cantasteis', 'cantaron'],
      gebiedende_wijs: [null, 'canta', 'cante', 'cantemos', 'cantad', 'canten']
    },
    herkennen: {
      perfecto: ['he cantado', 'has cantado', 'ha cantado', 'hemos cantado', 'habéis cantado', 'han cantado'],
      condicional: ['cantaría', 'cantarías', 'cantaría', 'cantaríamos', 'cantaríais', 'cantarían'],
      subjuntivo: ['cante', 'cantes', 'cante', 'cantemos', 'cantéis', 'canten'],
      continuo: ['estoy cantando', 'estás cantando', 'está cantando', 'estamos cantando', 'estáis cantando', 'están cantando'],
      pluscuamperfecto: ['había cantado', 'habías cantado', 'había cantado', 'habíamos cantado', 'habíais cantado', 'habían cantado']
    },
    herkennenNl: {
      perfecto: ['heb gezongen', 'hebt gezongen', 'heeft gezongen', 'hebben gezongen', 'hebben gezongen', 'hebben gezongen'],
      condicional: ['zou zingen', 'zou zingen', 'zou zingen', 'zouden zingen', 'zouden zingen', 'zouden zingen'],
      subjuntivo: ['zing', 'zingt', 'zingt', 'zingen', 'zingen', 'zingen'],
      continuo: ['ben aan het zingen', 'bent aan het zingen', 'is aan het zingen', 'zijn aan het zingen', 'zijn aan het zingen', 'zijn aan het zingen'],
      pluscuamperfecto: ['had gezongen', 'had gezongen', 'had gezongen', 'hadden gezongen', 'hadden gezongen', 'hadden gezongen']
    }
  },
  {
    id: 57, infinitive: 'caminar', dutch: 'lopen, wandelen', group: 'ar-regelmatig',
    conjugations: {
      presente: ['camino', 'caminas', 'camina', 'caminamos', 'camináis', 'caminan'],
      futuro: ['caminaré', 'caminarás', 'caminará', 'caminaremos', 'caminaréis', 'caminarán'],
      imperfecto: ['caminaba', 'caminabas', 'caminaba', 'caminábamos', 'caminabais', 'caminaban'],
      indefinido: ['caminé', 'caminaste', 'caminó', 'caminamos', 'caminasteis', 'caminaron'],
      gebiedende_wijs: [null, 'camina', 'camine', 'caminemos', 'caminad', 'caminen']
    },
    herkennen: {
      perfecto: ['he caminado', 'has caminado', 'ha caminado', 'hemos caminado', 'habéis caminado', 'han caminado'],
      condicional: ['caminaría', 'caminarías', 'caminaría', 'caminaríamos', 'caminaríais', 'caminarían'],
      subjuntivo: ['camine', 'camines', 'camine', 'caminemos', 'caminéis', 'caminen'],
      continuo: ['estoy caminando', 'estás caminando', 'está caminando', 'estamos caminando', 'estáis caminando', 'están caminando'],
      pluscuamperfecto: ['había caminado', 'habías caminado', 'había caminado', 'habíamos caminado', 'habíais caminado', 'habían caminado']
    },
    herkennenNl: {
      perfecto: ['heb gelopen', 'hebt gelopen', 'heeft gelopen', 'hebben gelopen', 'hebben gelopen', 'hebben gelopen'],
      condicional: ['zou lopen', 'zou lopen', 'zou lopen', 'zouden lopen', 'zouden lopen', 'zouden lopen'],
      subjuntivo: ['loop', 'loopt', 'loopt', 'lopen', 'lopen', 'lopen'],
      continuo: ['ben aan het lopen', 'bent aan het lopen', 'is aan het lopen', 'zijn aan het lopen', 'zijn aan het lopen', 'zijn aan het lopen'],
      pluscuamperfecto: ['had gelopen', 'had gelopen', 'had gelopen', 'hadden gelopen', 'hadden gelopen', 'hadden gelopen']
    }
  },
  {
    id: 58, infinitive: 'terminar', dutch: 'beëindigen, klaar zijn', group: 'ar-regelmatig',
    conjugations: {
      presente: ['termino', 'terminas', 'termina', 'terminamos', 'termináis', 'terminan'],
      futuro: ['terminaré', 'terminarás', 'terminará', 'terminaremos', 'terminaréis', 'terminarán'],
      imperfecto: ['terminaba', 'terminabas', 'terminaba', 'terminábamos', 'terminabais', 'terminaban'],
      indefinido: ['terminé', 'terminaste', 'terminó', 'terminamos', 'terminasteis', 'terminaron'],
      gebiedende_wijs: [null, 'termina', 'termine', 'terminemos', 'terminad', 'terminen']
    },
    herkennen: {
      perfecto: ['he terminado', 'has terminado', 'ha terminado', 'hemos terminado', 'habéis terminado', 'han terminado'],
      condicional: ['terminaría', 'terminarías', 'terminaría', 'terminaríamos', 'terminaríais', 'terminarían'],
      subjuntivo: ['termine', 'termines', 'termine', 'terminemos', 'terminéis', 'terminen'],
      continuo: ['estoy terminando', 'estás terminando', 'está terminando', 'estamos terminando', 'estáis terminando', 'están terminando'],
      pluscuamperfecto: ['había terminado', 'habías terminado', 'había terminado', 'habíamos terminado', 'habíais terminado', 'habían terminado']
    },
    herkennenNl: {
      perfecto: ['heb beëindigd', 'hebt beëindigd', 'heeft beëindigd', 'hebben beëindigd', 'hebben beëindigd', 'hebben beëindigd'],
      condicional: ['zou beëindigen', 'zou beëindigen', 'zou beëindigen', 'zouden beëindigen', 'zouden beëindigen', 'zouden beëindigen'],
      subjuntivo: ['beëindig', 'beëindigt', 'beëindigt', 'beëindigen', 'beëindigen', 'beëindigen'],
      continuo: ['ben aan het beëindigen', 'bent aan het beëindigen', 'is aan het beëindigen', 'zijn aan het beëindigen', 'zijn aan het beëindigen', 'zijn aan het beëindigen'],
      pluscuamperfecto: ['had beëindigd', 'had beëindigd', 'had beëindigd', 'hadden beëindigd', 'hadden beëindigd', 'hadden beëindigd']
    }
  },
  {
    id: 59, infinitive: 'explicar', dutch: 'uitleggen', group: 'ar-regelmatig',
    conjugations: {
      presente: ['explico', 'explicas', 'explica', 'explicamos', 'explicáis', 'explican'],
      futuro: ['explicaré', 'explicarás', 'explicará', 'explicaremos', 'explicaréis', 'explicarán'],
      imperfecto: ['explicaba', 'explicabas', 'explicaba', 'explicábamos', 'explicabais', 'explicaban'],
      indefinido: ['expliqué', 'explicaste', 'explicó', 'explicamos', 'explicasteis', 'explicaron'],
      gebiedende_wijs: [null, 'explica', 'explique', 'expliquemos', 'explicad', 'expliquen']
    },
    herkennen: {
      perfecto: ['he explicado', 'has explicado', 'ha explicado', 'hemos explicado', 'habéis explicado', 'han explicado'],
      condicional: ['explicaría', 'explicarías', 'explicaría', 'explicaríamos', 'explicaríais', 'explicarían'],
      subjuntivo: ['explique', 'expliques', 'explique', 'expliquemos', 'expliquéis', 'expliquen'],
      continuo: ['estoy explicando', 'estás explicando', 'está explicando', 'estamos explicando', 'estáis explicando', 'están explicando'],
      pluscuamperfecto: ['había explicado', 'habías explicado', 'había explicado', 'habíamos explicado', 'habíais explicado', 'habían explicado']
    },
    herkennenNl: {
      perfecto: ['heb uitgelegd', 'hebt uitgelegd', 'heeft uitgelegd', 'hebben uitgelegd', 'hebben uitgelegd', 'hebben uitgelegd'],
      condicional: ['zou uitleggen', 'zou uitleggen', 'zou uitleggen', 'zouden uitleggen', 'zouden uitleggen', 'zouden uitleggen'],
      subjuntivo: ['leg uit', 'legt uit', 'legt uit', 'uitleggen', 'uitleggen', 'uitleggen'],
      continuo: ['ben aan het uitleggen', 'bent aan het uitleggen', 'is aan het uitleggen', 'zijn aan het uitleggen', 'zijn aan het uitleggen', 'zijn aan het uitleggen'],
      pluscuamperfecto: ['had uitgelegd', 'had uitgelegd', 'had uitgelegd', 'hadden uitgelegd', 'hadden uitgelegd', 'hadden uitgelegd']
    }
  },
  {
    id: 60, infinitive: 'buscar', dutch: 'zoeken', group: 'ar-regelmatig',
    conjugations: {
      presente: ['busco', 'buscas', 'busca', 'buscamos', 'buscáis', 'buscan'],
      futuro: ['buscaré', 'buscarás', 'buscará', 'buscaremos', 'buscaréis', 'buscarán'],
      imperfecto: ['buscaba', 'buscabas', 'buscaba', 'buscábamos', 'buscabais', 'buscaban'],
      indefinido: ['busqué', 'buscaste', 'buscó', 'buscamos', 'buscasteis', 'buscaron'],
      gebiedende_wijs: [null, 'busca', 'busque', 'busquemos', 'buscad', 'busquen']
    },
    herkennen: {
      perfecto: ['he buscado', 'has buscado', 'ha buscado', 'hemos buscado', 'habéis buscado', 'han buscado'],
      condicional: ['buscaría', 'buscarías', 'buscaría', 'buscaríamos', 'buscaríais', 'buscarían'],
      subjuntivo: ['busque', 'busques', 'busque', 'busquemos', 'busquéis', 'busquen'],
      continuo: ['estoy buscando', 'estás buscando', 'está buscando', 'estamos buscando', 'estáis buscando', 'están buscando'],
      pluscuamperfecto: ['había buscado', 'habías buscado', 'había buscado', 'habíamos buscado', 'habíais buscado', 'habían buscado']
    },
    herkennenNl: {
      perfecto: ['heb gezocht', 'hebt gezocht', 'heeft gezocht', 'hebben gezocht', 'hebben gezocht', 'hebben gezocht'],
      condicional: ['zou zoeken', 'zou zoeken', 'zou zoeken', 'zouden zoeken', 'zouden zoeken', 'zouden zoeken'],
      subjuntivo: ['zoek', 'zoekt', 'zoekt', 'zoeken', 'zoeken', 'zoeken'],
      continuo: ['ben aan het zoeken', 'bent aan het zoeken', 'is aan het zoeken', 'zijn aan het zoeken', 'zijn aan het zoeken', 'zijn aan het zoeken'],
      pluscuamperfecto: ['had gezocht', 'had gezocht', 'had gezocht', 'hadden gezocht', 'hadden gezocht', 'hadden gezocht']
    }
  },
  {
    id: 61, infinitive: 'pagar', dutch: 'betalen', group: 'ar-regelmatig',
    conjugations: {
      presente: ['pago', 'pagas', 'paga', 'pagamos', 'pagáis', 'pagan'],
      futuro: ['pagaré', 'pagarás', 'pagará', 'pagaremos', 'pagaréis', 'pagarán'],
      imperfecto: ['pagaba', 'pagabas', 'pagaba', 'pagábamos', 'pagabais', 'pagaban'],
      indefinido: ['pagué', 'pagaste', 'pagó', 'pagamos', 'pagasteis', 'pagaron'],
      gebiedende_wijs: [null, 'paga', 'pague', 'paguemos', 'pagad', 'paguen']
    },
    herkennen: {
      perfecto: ['he pagado', 'has pagado', 'ha pagado', 'hemos pagado', 'habéis pagado', 'han pagado'],
      condicional: ['pagaría', 'pagarías', 'pagaría', 'pagaríamos', 'pagaríais', 'pagarían'],
      subjuntivo: ['pague', 'pagues', 'pague', 'paguemos', 'paguéis', 'paguen'],
      continuo: ['estoy pagando', 'estás pagando', 'está pagando', 'estamos pagando', 'estáis pagando', 'están pagando'],
      pluscuamperfecto: ['había pagado', 'habías pagado', 'había pagado', 'habíamos pagado', 'habíais pagado', 'habían pagado']
    },
    herkennenNl: {
      perfecto: ['heb betaald', 'hebt betaald', 'heeft betaald', 'hebben betaald', 'hebben betaald', 'hebben betaald'],
      condicional: ['zou betalen', 'zou betalen', 'zou betalen', 'zouden betalen', 'zouden betalen', 'zouden betalen'],
      subjuntivo: ['betaal', 'betaalt', 'betaalt', 'betalen', 'betalen', 'betalen'],
      continuo: ['ben aan het betalen', 'bent aan het betalen', 'is aan het betalen', 'zijn aan het betalen', 'zijn aan het betalen', 'zijn aan het betalen'],
      pluscuamperfecto: ['had betaald', 'had betaald', 'had betaald', 'hadden betaald', 'hadden betaald', 'hadden betaald']
    }
  },
  {
    id: 62, infinitive: 'entregar', dutch: 'afleveren, inleveren', group: 'ar-regelmatig',
    conjugations: {
      presente: ['entrego', 'entregas', 'entrega', 'entregamos', 'entregáis', 'entregan'],
      futuro: ['entregaré', 'entregarás', 'entregará', 'entregaremos', 'entregaréis', 'entregarán'],
      imperfecto: ['entregaba', 'entregabas', 'entregaba', 'entregábamos', 'entregabais', 'entregaban'],
      indefinido: ['entregué', 'entregaste', 'entregó', 'entregamos', 'entregasteis', 'entregaron'],
      gebiedende_wijs: [null, 'entrega', 'entregue', 'entreguemos', 'entregad', 'entreguen']
    },
    herkennen: {
      perfecto: ['he entregado', 'has entregado', 'ha entregado', 'hemos entregado', 'habéis entregado', 'han entregado'],
      condicional: ['entregaría', 'entregarías', 'entregaría', 'entregaríamos', 'entregaríais', 'entregarían'],
      subjuntivo: ['entregue', 'entregues', 'entregue', 'entreguemos', 'entreguéis', 'entreguen'],
      continuo: ['estoy entregando', 'estás entregando', 'está entregando', 'estamos entregando', 'estáis entregando', 'están entregando'],
      pluscuamperfecto: ['había entregado', 'habías entregado', 'había entregado', 'habíamos entregado', 'habíais entregado', 'habían entregado']
    },
    herkennenNl: {
      perfecto: ['heb afgeleverd', 'hebt afgeleverd', 'heeft afgeleverd', 'hebben afgeleverd', 'hebben afgeleverd', 'hebben afgeleverd'],
      condicional: ['zou afleveren', 'zou afleveren', 'zou afleveren', 'zouden afleveren', 'zouden afleveren', 'zouden afleveren'],
      subjuntivo: ['lever af', 'levert af', 'levert af', 'afleveren', 'afleveren', 'afleveren'],
      continuo: ['ben aan het afleveren', 'bent aan het afleveren', 'is aan het afleveren', 'zijn aan het afleveren', 'zijn aan het afleveren', 'zijn aan het afleveren'],
      pluscuamperfecto: ['had afgeleverd', 'had afgeleverd', 'had afgeleverd', 'hadden afgeleverd', 'hadden afgeleverd', 'hadden afgeleverd']
    }
  },
  {
    id: 63, infinitive: 'organizar', dutch: 'organiseren', group: 'ar-regelmatig',
    conjugations: {
      presente: ['organizo', 'organizas', 'organiza', 'organizamos', 'organizáis', 'organizan'],
      futuro: ['organizaré', 'organizarás', 'organizará', 'organizaremos', 'organizaréis', 'organizarán'],
      imperfecto: ['organizaba', 'organizabas', 'organizaba', 'organizábamos', 'organizabais', 'organizaban'],
      indefinido: ['organicé', 'organizaste', 'organizó', 'organizamos', 'organizasteis', 'organizaron'],
      gebiedende_wijs: [null, 'organiza', 'organice', 'organicemos', 'organizad', 'organicen']
    },
    herkennen: {
      perfecto: ['he organizado', 'has organizado', 'ha organizado', 'hemos organizado', 'habéis organizado', 'han organizado'],
      condicional: ['organizaría', 'organizarías', 'organizaría', 'organizaríamos', 'organizaríais', 'organizarían'],
      subjuntivo: ['organice', 'organices', 'organice', 'organicemos', 'organicéis', 'organicen'],
      continuo: ['estoy organizando', 'estás organizando', 'está organizando', 'estamos organizando', 'estáis organizando', 'están organizando'],
      pluscuamperfecto: ['había organizado', 'habías organizado', 'había organizado', 'habíamos organizado', 'habíais organizado', 'habían organizado']
    },
    herkennenNl: {
      perfecto: ['heb georganiseerd', 'hebt georganiseerd', 'heeft georganiseerd', 'hebben georganiseerd', 'hebben georganiseerd', 'hebben georganiseerd'],
      condicional: ['zou organiseren', 'zou organiseren', 'zou organiseren', 'zouden organiseren', 'zouden organiseren', 'zouden organiseren'],
      subjuntivo: ['organiseer', 'organiseert', 'organiseert', 'organiseren', 'organiseren', 'organiseren'],
      continuo: ['ben aan het organiseren', 'bent aan het organiseren', 'is aan het organiseren', 'zijn aan het organiseren', 'zijn aan het organiseren', 'zijn aan het organiseren'],
      pluscuamperfecto: ['had georganiseerd', 'had georganiseerd', 'had georganiseerd', 'hadden georganiseerd', 'hadden georganiseerd', 'hadden georganiseerd']
    }
  },

  // ── Nog meer regelmatige -er werkwoorden ──
  {
    id: 64, infinitive: 'deber', dutch: 'moeten, verschuldigd zijn', group: 'er-regelmatig',
    conjugations: {
      presente: ['debo', 'debes', 'debe', 'debemos', 'debéis', 'deben'],
      futuro: ['deberé', 'deberás', 'deberá', 'deberemos', 'deberéis', 'deberán'],
      imperfecto: ['debía', 'debías', 'debía', 'debíamos', 'debíais', 'debían'],
      indefinido: ['debí', 'debiste', 'debió', 'debimos', 'debisteis', 'debieron'],
      gebiedende_wijs: [null, 'debe', 'deba', 'debamos', 'debed', 'deban']
    },
    herkennen: {
      perfecto: ['he debido', 'has debido', 'ha debido', 'hemos debido', 'habéis debido', 'han debido'],
      condicional: ['debería', 'deberías', 'debería', 'deberíamos', 'deberíais', 'deberían'],
      subjuntivo: ['deba', 'debas', 'deba', 'debamos', 'debáis', 'deban'],
      continuo: ['estoy debiendo', 'estás debiendo', 'está debiendo', 'estamos debiendo', 'estáis debiendo', 'están debiendo'],
      pluscuamperfecto: ['había debido', 'habías debido', 'había debido', 'habíamos debido', 'habíais debido', 'habían debido']
    },
    herkennenNl: {
      perfecto: ['heb gemoeten', 'hebt gemoeten', 'heeft gemoeten', 'hebben gemoeten', 'hebben gemoeten', 'hebben gemoeten'],
      condicional: ['zou moeten', 'zou moeten', 'zou moeten', 'zouden moeten', 'zouden moeten', 'zouden moeten'],
      subjuntivo: ['moet', 'moet', 'moet', 'moeten', 'moeten', 'moeten'],
      continuo: ['ben aan het moeten', 'bent aan het moeten', 'is aan het moeten', 'zijn aan het moeten', 'zijn aan het moeten', 'zijn aan het moeten'],
      pluscuamperfecto: ['had gemoeten', 'had gemoeten', 'had gemoeten', 'hadden gemoeten', 'hadden gemoeten', 'hadden gemoeten']
    }
  },
  {
    id: 65, infinitive: 'temer', dutch: 'vrezen, bang zijn voor', group: 'er-regelmatig',
    conjugations: {
      presente: ['temo', 'temes', 'teme', 'tememos', 'teméis', 'temen'],
      futuro: ['temeré', 'temerás', 'temerá', 'temeremos', 'temeréis', 'temerán'],
      imperfecto: ['temía', 'temías', 'temía', 'temíamos', 'temíais', 'temían'],
      indefinido: ['temí', 'temiste', 'temió', 'temimos', 'temisteis', 'temieron'],
      gebiedende_wijs: [null, 'teme', 'tema', 'temamos', 'temed', 'teman']
    },
    herkennen: {
      perfecto: ['he temido', 'has temido', 'ha temido', 'hemos temido', 'habéis temido', 'han temido'],
      condicional: ['temería', 'temerías', 'temería', 'temeríamos', 'temeríais', 'temerían'],
      subjuntivo: ['tema', 'temas', 'tema', 'temamos', 'temáis', 'teman'],
      continuo: ['estoy temiendo', 'estás temiendo', 'está temiendo', 'estamos temiendo', 'estáis temiendo', 'están temiendo'],
      pluscuamperfecto: ['había temido', 'habías temido', 'había temido', 'habíamos temido', 'habíais temido', 'habían temido']
    },
    herkennenNl: {
      perfecto: ['heb gevreesd', 'hebt gevreesd', 'heeft gevreesd', 'hebben gevreesd', 'hebben gevreesd', 'hebben gevreesd'],
      condicional: ['zou vrezen', 'zou vrezen', 'zou vrezen', 'zouden vrezen', 'zouden vrezen', 'zouden vrezen'],
      subjuntivo: ['vrees', 'vreest', 'vreest', 'vrezen', 'vrezen', 'vrezen'],
      continuo: ['ben aan het vrezen', 'bent aan het vrezen', 'is aan het vrezen', 'zijn aan het vrezen', 'zijn aan het vrezen', 'zijn aan het vrezen'],
      pluscuamperfecto: ['had gevreesd', 'had gevreesd', 'had gevreesd', 'hadden gevreesd', 'hadden gevreesd', 'hadden gevreesd']
    }
  },
  {
    id: 66, infinitive: 'toser', dutch: 'hoesten', group: 'er-regelmatig',
    conjugations: {
      presente: ['toso', 'toses', 'tose', 'tosemos', 'toséis', 'tosen'],
      futuro: ['toseré', 'toserás', 'toserá', 'toseremos', 'toseréis', 'toserán'],
      imperfecto: ['tosía', 'tosías', 'tosía', 'tosíamos', 'tosíais', 'tosían'],
      indefinido: ['tosí', 'tosiste', 'tosió', 'tosimos', 'tosisteis', 'tosieron'],
      gebiedende_wijs: [null, 'tose', 'tosa', 'tosamos', 'tosed', 'tosan']
    },
    herkennen: {
      perfecto: ['he tosido', 'has tosido', 'ha tosido', 'hemos tosido', 'habéis tosido', 'han tosido'],
      condicional: ['tosería', 'toserías', 'tosería', 'toseríamos', 'toseríais', 'toserían'],
      subjuntivo: ['tosa', 'tosas', 'tosa', 'tosamos', 'tosáis', 'tosan'],
      continuo: ['estoy tosiendo', 'estás tosiendo', 'está tosiendo', 'estamos tosiendo', 'estáis tosiendo', 'están tosiendo'],
      pluscuamperfecto: ['había tosido', 'habías tosido', 'había tosido', 'habíamos tosido', 'habíais tosido', 'habían tosido']
    },
    herkennenNl: {
      perfecto: ['heb gehoest', 'hebt gehoest', 'heeft gehoest', 'hebben gehoest', 'hebben gehoest', 'hebben gehoest'],
      condicional: ['zou hoesten', 'zou hoesten', 'zou hoesten', 'zouden hoesten', 'zouden hoesten', 'zouden hoesten'],
      subjuntivo: ['hoest', 'hoest', 'hoest', 'hoesten', 'hoesten', 'hoesten'],
      continuo: ['ben aan het hoesten', 'bent aan het hoesten', 'is aan het hoesten', 'zijn aan het hoesten', 'zijn aan het hoesten', 'zijn aan het hoesten'],
      pluscuamperfecto: ['had gehoest', 'had gehoest', 'had gehoest', 'hadden gehoest', 'hadden gehoest', 'hadden gehoest']
    }
  },
  {
    id: 67, infinitive: 'barrer', dutch: 'vegen', group: 'er-regelmatig',
    conjugations: {
      presente: ['barro', 'barres', 'barre', 'barremos', 'barréis', 'barren'],
      futuro: ['barreré', 'barrerás', 'barrerá', 'barreremos', 'barreréis', 'barrerán'],
      imperfecto: ['barría', 'barrías', 'barría', 'barríamos', 'barríais', 'barrían'],
      indefinido: ['barrí', 'barriste', 'barrió', 'barrimos', 'barristeis', 'barrieron'],
      gebiedende_wijs: [null, 'barre', 'barra', 'barramos', 'barred', 'barran']
    },
    herkennen: {
      perfecto: ['he barrido', 'has barrido', 'ha barrido', 'hemos barrido', 'habéis barrido', 'han barrido'],
      condicional: ['barrería', 'barrerías', 'barrería', 'barreríamos', 'barreríais', 'barrerían'],
      subjuntivo: ['barra', 'barras', 'barra', 'barramos', 'barráis', 'barran'],
      continuo: ['estoy barriendo', 'estás barriendo', 'está barriendo', 'estamos barriendo', 'estáis barriendo', 'están barriendo'],
      pluscuamperfecto: ['había barrido', 'habías barrido', 'había barrido', 'habíamos barrido', 'habíais barrido', 'habían barrido']
    },
    herkennenNl: {
      perfecto: ['heb geveegd', 'hebt geveegd', 'heeft geveegd', 'hebben geveegd', 'hebben geveegd', 'hebben geveegd'],
      condicional: ['zou vegen', 'zou vegen', 'zou vegen', 'zouden vegen', 'zouden vegen', 'zouden vegen'],
      subjuntivo: ['veeg', 'veegt', 'veegt', 'vegen', 'vegen', 'vegen'],
      continuo: ['ben aan het vegen', 'bent aan het vegen', 'is aan het vegen', 'zijn aan het vegen', 'zijn aan het vegen', 'zijn aan het vegen'],
      pluscuamperfecto: ['had geveegd', 'had geveegd', 'had geveegd', 'hadden geveegd', 'hadden geveegd', 'hadden geveegd']
    }
  },
  {
    id: 68, infinitive: 'depender', dutch: 'afhangen (van)', group: 'er-regelmatig',
    conjugations: {
      presente: ['dependo', 'dependes', 'depende', 'dependemos', 'dependéis', 'dependen'],
      futuro: ['dependeré', 'dependerás', 'dependerá', 'dependeremos', 'dependeréis', 'dependerán'],
      imperfecto: ['dependía', 'dependías', 'dependía', 'dependíamos', 'dependíais', 'dependían'],
      indefinido: ['dependí', 'dependiste', 'dependió', 'dependimos', 'dependisteis', 'dependieron'],
      gebiedende_wijs: [null, 'depende', 'dependa', 'dependamos', 'depended', 'dependan']
    },
    herkennen: {
      perfecto: ['he dependido', 'has dependido', 'ha dependido', 'hemos dependido', 'habéis dependido', 'han dependido'],
      condicional: ['dependería', 'dependerías', 'dependería', 'dependeríamos', 'dependeríais', 'dependerían'],
      subjuntivo: ['dependa', 'dependas', 'dependa', 'dependamos', 'dependáis', 'dependan'],
      continuo: ['estoy dependiendo', 'estás dependiendo', 'está dependiendo', 'estamos dependiendo', 'estáis dependiendo', 'están dependiendo'],
      pluscuamperfecto: ['había dependido', 'habías dependido', 'había dependido', 'habíamos dependido', 'habíais dependido', 'habían dependido']
    },
    herkennenNl: {
      perfecto: ['heb afgehangen van', 'hebt afgehangen van', 'heeft afgehangen van', 'hebben afgehangen van', 'hebben afgehangen van', 'hebben afgehangen van'],
      condicional: ['zou afhangen van', 'zou afhangen van', 'zou afhangen van', 'zouden afhangen van', 'zouden afhangen van', 'zouden afhangen van'],
      subjuntivo: ['hang af van', 'hangt af van', 'hangt af van', 'afhangen van', 'afhangen van', 'afhangen van'],
      continuo: ['ben aan het afhangen van', 'bent aan het afhangen van', 'is aan het afhangen van', 'zijn aan het afhangen van', 'zijn aan het afhangen van', 'zijn aan het afhangen van'],
      pluscuamperfecto: ['had afgehangen van', 'had afgehangen van', 'had afgehangen van', 'hadden afgehangen van', 'hadden afgehangen van', 'hadden afgehangen van']
    }
  },
  {
    id: 69, infinitive: 'suceder', dutch: 'gebeuren', group: 'er-regelmatig',
    conjugations: {
      presente: ['sucedo', 'sucedes', 'sucede', 'sucedemos', 'sucedéis', 'suceden'],
      futuro: ['sucederé', 'sucederás', 'sucederá', 'sucederemos', 'sucederéis', 'sucederán'],
      imperfecto: ['sucedía', 'sucedías', 'sucedía', 'sucedíamos', 'sucedíais', 'sucedían'],
      indefinido: ['sucedí', 'sucediste', 'sucedió', 'sucedimos', 'sucedisteis', 'sucedieron'],
      gebiedende_wijs: [null, 'sucede', 'suceda', 'sucedamos', 'suceded', 'sucedan']
    },
    herkennen: {
      perfecto: ['he sucedido', 'has sucedido', 'ha sucedido', 'hemos sucedido', 'habéis sucedido', 'han sucedido'],
      condicional: ['sucedería', 'sucederías', 'sucedería', 'sucederíamos', 'sucederíais', 'sucederían'],
      subjuntivo: ['suceda', 'sucedas', 'suceda', 'sucedamos', 'sucedáis', 'sucedan'],
      continuo: ['estoy sucediendo', 'estás sucediendo', 'está sucediendo', 'estamos sucediendo', 'estáis sucediendo', 'están sucediendo'],
      pluscuamperfecto: ['había sucedido', 'habías sucedido', 'había sucedido', 'habíamos sucedido', 'habíais sucedido', 'habían sucedido']
    },
    herkennenNl: {
      perfecto: ['ben gebeurd', 'bent gebeurd', 'is gebeurd', 'zijn gebeurd', 'zijn gebeurd', 'zijn gebeurd'],
      condicional: ['zou gebeuren', 'zou gebeuren', 'zou gebeuren', 'zouden gebeuren', 'zouden gebeuren', 'zouden gebeuren'],
      subjuntivo: ['gebeur', 'gebeurt', 'gebeurt', 'gebeuren', 'gebeuren', 'gebeuren'],
      continuo: ['ben aan het gebeuren', 'bent aan het gebeuren', 'is aan het gebeuren', 'zijn aan het gebeuren', 'zijn aan het gebeuren', 'zijn aan het gebeuren'],
      pluscuamperfecto: ['was gebeurd', 'was gebeurd', 'was gebeurd', 'waren gebeurd', 'waren gebeurd', 'waren gebeurd']
    }
  },
  {
    id: 70, infinitive: 'prometer', dutch: 'beloven', group: 'er-regelmatig',
    conjugations: {
      presente: ['prometo', 'prometes', 'promete', 'prometemos', 'prometéis', 'prometen'],
      futuro: ['prometeré', 'prometerás', 'prometerá', 'prometeremos', 'prometeréis', 'prometerán'],
      imperfecto: ['prometía', 'prometías', 'prometía', 'prometíamos', 'prometíais', 'prometían'],
      indefinido: ['prometí', 'prometiste', 'prometió', 'prometimos', 'prometisteis', 'prometieron'],
      gebiedende_wijs: [null, 'promete', 'prometa', 'prometamos', 'prometed', 'prometan']
    },
    herkennen: {
      perfecto: ['he prometido', 'has prometido', 'ha prometido', 'hemos prometido', 'habéis prometido', 'han prometido'],
      condicional: ['prometería', 'prometerías', 'prometería', 'prometeríamos', 'prometeríais', 'prometerían'],
      subjuntivo: ['prometa', 'prometas', 'prometa', 'prometamos', 'prometáis', 'prometan'],
      continuo: ['estoy prometiendo', 'estás prometiendo', 'está prometiendo', 'estamos prometiendo', 'estáis prometiendo', 'están prometiendo'],
      pluscuamperfecto: ['había prometido', 'habías prometido', 'había prometido', 'habíamos prometido', 'habíais prometido', 'habían prometido']
    },
    herkennenNl: {
      perfecto: ['heb beloofd', 'hebt beloofd', 'heeft beloofd', 'hebben beloofd', 'hebben beloofd', 'hebben beloofd'],
      condicional: ['zou beloven', 'zou beloven', 'zou beloven', 'zouden beloven', 'zouden beloven', 'zouden beloven'],
      subjuntivo: ['beloof', 'belooft', 'belooft', 'beloven', 'beloven', 'beloven'],
      continuo: ['ben aan het beloven', 'bent aan het beloven', 'is aan het beloven', 'zijn aan het beloven', 'zijn aan het beloven', 'zijn aan het beloven'],
      pluscuamperfecto: ['had beloofd', 'had beloofd', 'had beloofd', 'hadden beloofd', 'hadden beloofd', 'hadden beloofd']
    }
  },
  {
    id: 71, infinitive: 'sorprender', dutch: 'verrassen', group: 'er-regelmatig',
    conjugations: {
      presente: ['sorprendo', 'sorprendes', 'sorprende', 'sorprendemos', 'sorprendéis', 'sorprenden'],
      futuro: ['sorprenderé', 'sorprenderás', 'sorprenderá', 'sorprenderemos', 'sorprenderéis', 'sorprenderán'],
      imperfecto: ['sorprendía', 'sorprendías', 'sorprendía', 'sorprendíamos', 'sorprendíais', 'sorprendían'],
      indefinido: ['sorprendí', 'sorprendiste', 'sorprendió', 'sorprendimos', 'sorprendisteis', 'sorprendieron'],
      gebiedende_wijs: [null, 'sorprende', 'sorprenda', 'sorprendamos', 'sorprended', 'sorprendan']
    },
    herkennen: {
      perfecto: ['he sorprendido', 'has sorprendido', 'ha sorprendido', 'hemos sorprendido', 'habéis sorprendido', 'han sorprendido'],
      condicional: ['sorprendería', 'sorprenderías', 'sorprendería', 'sorprenderíamos', 'sorprenderíais', 'sorprenderían'],
      subjuntivo: ['sorprenda', 'sorprendas', 'sorprenda', 'sorprendamos', 'sorprendáis', 'sorprendan'],
      continuo: ['estoy sorprendiendo', 'estás sorprendiendo', 'está sorprendiendo', 'estamos sorprendiendo', 'estáis sorprendiendo', 'están sorprendiendo'],
      pluscuamperfecto: ['había sorprendido', 'habías sorprendido', 'había sorprendido', 'habíamos sorprendido', 'habíais sorprendido', 'habían sorprendido']
    },
    herkennenNl: {
      perfecto: ['heb verrast', 'hebt verrast', 'heeft verrast', 'hebben verrast', 'hebben verrast', 'hebben verrast'],
      condicional: ['zou verrassen', 'zou verrassen', 'zou verrassen', 'zouden verrassen', 'zouden verrassen', 'zouden verrassen'],
      subjuntivo: ['verras', 'verrast', 'verrast', 'verrassen', 'verrassen', 'verrassen'],
      continuo: ['ben aan het verrassen', 'bent aan het verrassen', 'is aan het verrassen', 'zijn aan het verrassen', 'zijn aan het verrassen', 'zijn aan het verrassen'],
      pluscuamperfecto: ['had verrast', 'had verrast', 'had verrast', 'hadden verrast', 'hadden verrast', 'hadden verrast']
    }
  },
  {
    id: 72, infinitive: 'esconder', dutch: 'verstoppen', group: 'er-regelmatig',
    conjugations: {
      presente: ['escondo', 'escondes', 'esconde', 'escondemos', 'escondéis', 'esconden'],
      futuro: ['esconderé', 'esconderás', 'esconderá', 'esconderemos', 'esconderéis', 'esconderán'],
      imperfecto: ['escondía', 'escondías', 'escondía', 'escondíamos', 'escondíais', 'escondían'],
      indefinido: ['escondí', 'escondiste', 'escondió', 'escondimos', 'escondisteis', 'escondieron'],
      gebiedende_wijs: [null, 'esconde', 'esconda', 'escondamos', 'esconded', 'escondan']
    },
    herkennen: {
      perfecto: ['he escondido', 'has escondido', 'ha escondido', 'hemos escondido', 'habéis escondido', 'han escondido'],
      condicional: ['escondería', 'esconderías', 'escondería', 'esconderíamos', 'esconderíais', 'esconderían'],
      subjuntivo: ['esconda', 'escondas', 'esconda', 'escondamos', 'escondáis', 'escondan'],
      continuo: ['estoy escondiendo', 'estás escondiendo', 'está escondiendo', 'estamos escondiendo', 'estáis escondiendo', 'están escondiendo'],
      pluscuamperfecto: ['había escondido', 'habías escondido', 'había escondido', 'habíamos escondido', 'habíais escondido', 'habían escondido']
    },
    herkennenNl: {
      perfecto: ['heb verstopt', 'hebt verstopt', 'heeft verstopt', 'hebben verstopt', 'hebben verstopt', 'hebben verstopt'],
      condicional: ['zou verstoppen', 'zou verstoppen', 'zou verstoppen', 'zouden verstoppen', 'zouden verstoppen', 'zouden verstoppen'],
      subjuntivo: ['verstop', 'verstopt', 'verstopt', 'verstoppen', 'verstoppen', 'verstoppen'],
      continuo: ['ben aan het verstoppen', 'bent aan het verstoppen', 'is aan het verstoppen', 'zijn aan het verstoppen', 'zijn aan het verstoppen', 'zijn aan het verstoppen'],
      pluscuamperfecto: ['had verstopt', 'had verstopt', 'had verstopt', 'hadden verstopt', 'hadden verstopt', 'hadden verstopt']
    }
  },
  {
    id: 73, infinitive: 'proceder', dutch: 'te werk gaan, voortkomen', group: 'er-regelmatig',
    conjugations: {
      presente: ['procedo', 'procedes', 'procede', 'procedemos', 'procedéis', 'proceden'],
      futuro: ['procederé', 'procederás', 'procederá', 'procederemos', 'procederéis', 'procederán'],
      imperfecto: ['procedía', 'procedías', 'procedía', 'procedíamos', 'procedíais', 'procedían'],
      indefinido: ['procedí', 'procediste', 'procedió', 'procedimos', 'procedisteis', 'procedieron'],
      gebiedende_wijs: [null, 'procede', 'proceda', 'procedamos', 'proceded', 'procedan']
    },
    herkennen: {
      perfecto: ['he procedido', 'has procedido', 'ha procedido', 'hemos procedido', 'habéis procedido', 'han procedido'],
      condicional: ['procedería', 'procederías', 'procedería', 'procederíamos', 'procederíais', 'procederían'],
      subjuntivo: ['proceda', 'procedas', 'proceda', 'procedamos', 'procedáis', 'procedan'],
      continuo: ['estoy procediendo', 'estás procediendo', 'está procediendo', 'estamos procediendo', 'estáis procediendo', 'están procediendo'],
      pluscuamperfecto: ['había procedido', 'habías procedido', 'había procedido', 'habíamos procedido', 'habíais procedido', 'habían procedido']
    },
    herkennenNl: {
      perfecto: ['ben te werk gegaan', 'bent te werk gegaan', 'is te werk gegaan', 'zijn te werk gegaan', 'zijn te werk gegaan', 'zijn te werk gegaan'],
      condicional: ['zou te werk gaan', 'zou te werk gaan', 'zou te werk gaan', 'zouden te werk gaan', 'zouden te werk gaan', 'zouden te werk gaan'],
      subjuntivo: ['ga te werk', 'gaat te werk', 'gaat te werk', 'te werk gaan', 'te werk gaan', 'te werk gaan'],
      continuo: ['ben aan het te werk gaan', 'bent aan het te werk gaan', 'is aan het te werk gaan', 'zijn aan het te werk gaan', 'zijn aan het te werk gaan', 'zijn aan het te werk gaan'],
      pluscuamperfecto: ['was te werk gegaan', 'was te werk gegaan', 'was te werk gegaan', 'waren te werk gegaan', 'waren te werk gegaan', 'waren te werk gegaan']
    }
  },
  {
    id: 74, infinitive: 'ceder', dutch: 'toegeven, afstaan', group: 'er-regelmatig',
    conjugations: {
      presente: ['cedo', 'cedes', 'cede', 'cedemos', 'cedéis', 'ceden'],
      futuro: ['cederé', 'cederás', 'cederá', 'cederemos', 'cederéis', 'cederán'],
      imperfecto: ['cedía', 'cedías', 'cedía', 'cedíamos', 'cedíais', 'cedían'],
      indefinido: ['cedí', 'cediste', 'cedió', 'cedimos', 'cedisteis', 'cedieron'],
      gebiedende_wijs: [null, 'cede', 'ceda', 'cedamos', 'ceded', 'cedan']
    },
    herkennen: {
      perfecto: ['he cedido', 'has cedido', 'ha cedido', 'hemos cedido', 'habéis cedido', 'han cedido'],
      condicional: ['cedería', 'cederías', 'cedería', 'cederíamos', 'cederíais', 'cederían'],
      subjuntivo: ['ceda', 'cedas', 'ceda', 'cedamos', 'cedáis', 'cedan'],
      continuo: ['estoy cediendo', 'estás cediendo', 'está cediendo', 'estamos cediendo', 'estáis cediendo', 'están cediendo'],
      pluscuamperfecto: ['había cedido', 'habías cedido', 'había cedido', 'habíamos cedido', 'habíais cedido', 'habían cedido']
    },
    herkennenNl: {
      perfecto: ['heb toegegeven', 'hebt toegegeven', 'heeft toegegeven', 'hebben toegegeven', 'hebben toegegeven', 'hebben toegegeven'],
      condicional: ['zou toegeven', 'zou toegeven', 'zou toegeven', 'zouden toegeven', 'zouden toegeven', 'zouden toegeven'],
      subjuntivo: ['geef toe', 'geeft toe', 'geeft toe', 'toegeven', 'toegeven', 'toegeven'],
      continuo: ['ben aan het toegeven', 'bent aan het toegeven', 'is aan het toegeven', 'zijn aan het toegeven', 'zijn aan het toegeven', 'zijn aan het toegeven'],
      pluscuamperfecto: ['had toegegeven', 'had toegegeven', 'had toegegeven', 'hadden toegegeven', 'hadden toegegeven', 'hadden toegegeven']
    }
  },
  {
    id: 75, infinitive: 'absorber', dutch: 'opnemen, absorberen', group: 'er-regelmatig',
    conjugations: {
      presente: ['absorbo', 'absorbes', 'absorbe', 'absorbemos', 'absorbéis', 'absorben'],
      futuro: ['absorberé', 'absorberás', 'absorberá', 'absorberemos', 'absorberéis', 'absorberán'],
      imperfecto: ['absorbía', 'absorbías', 'absorbía', 'absorbíamos', 'absorbíais', 'absorbían'],
      indefinido: ['absorbí', 'absorbiste', 'absorbió', 'absorbimos', 'absorbisteis', 'absorbieron'],
      gebiedende_wijs: [null, 'absorbe', 'absorba', 'absorbamos', 'absorbed', 'absorban']
    },
    herkennen: {
      perfecto: ['he absorbido', 'has absorbido', 'ha absorbido', 'hemos absorbido', 'habéis absorbido', 'han absorbido'],
      condicional: ['absorbería', 'absorberías', 'absorbería', 'absorberíamos', 'absorberíais', 'absorberían'],
      subjuntivo: ['absorba', 'absorbas', 'absorba', 'absorbamos', 'absorbáis', 'absorban'],
      continuo: ['estoy absorbiendo', 'estás absorbiendo', 'está absorbiendo', 'estamos absorbiendo', 'estáis absorbiendo', 'están absorbiendo'],
      pluscuamperfecto: ['había absorbido', 'habías absorbido', 'había absorbido', 'habíamos absorbido', 'habíais absorbido', 'habían absorbido']
    },
    herkennenNl: {
      perfecto: ['heb opgenomen', 'hebt opgenomen', 'heeft opgenomen', 'hebben opgenomen', 'hebben opgenomen', 'hebben opgenomen'],
      condicional: ['zou opnemen', 'zou opnemen', 'zou opnemen', 'zouden opnemen', 'zouden opnemen', 'zouden opnemen'],
      subjuntivo: ['neem op', 'neemt op', 'neemt op', 'opnemen', 'opnemen', 'opnemen'],
      continuo: ['ben aan het opnemen', 'bent aan het opnemen', 'is aan het opnemen', 'zijn aan het opnemen', 'zijn aan het opnemen', 'zijn aan het opnemen'],
      pluscuamperfecto: ['had opgenomen', 'had opgenomen', 'had opgenomen', 'hadden opgenomen', 'hadden opgenomen', 'hadden opgenomen']
    }
  },
  {
    id: 76, infinitive: 'exceder', dutch: 'overschrijden', group: 'er-regelmatig',
    conjugations: {
      presente: ['excedo', 'excedes', 'excede', 'excedemos', 'excedéis', 'exceden'],
      futuro: ['excederé', 'excederás', 'excederá', 'excederemos', 'excederéis', 'excederán'],
      imperfecto: ['excedía', 'excedías', 'excedía', 'excedíamos', 'excedíais', 'excedían'],
      indefinido: ['excedí', 'excediste', 'excedió', 'excedimos', 'excedisteis', 'excedieron'],
      gebiedende_wijs: [null, 'excede', 'exceda', 'excedamos', 'exceded', 'excedan']
    },
    herkennen: {
      perfecto: ['he excedido', 'has excedido', 'ha excedido', 'hemos excedido', 'habéis excedido', 'han excedido'],
      condicional: ['excedería', 'excederías', 'excedería', 'excederíamos', 'excederíais', 'excederían'],
      subjuntivo: ['exceda', 'excedas', 'exceda', 'excedamos', 'excedáis', 'excedan'],
      continuo: ['estoy excediendo', 'estás excediendo', 'está excediendo', 'estamos excediendo', 'estáis excediendo', 'están excediendo'],
      pluscuamperfecto: ['había excedido', 'habías excedido', 'había excedido', 'habíamos excedido', 'habíais excedido', 'habían excedido']
    },
    herkennenNl: {
      perfecto: ['heb overschreden', 'hebt overschreden', 'heeft overschreden', 'hebben overschreden', 'hebben overschreden', 'hebben overschreden'],
      condicional: ['zou overschrijden', 'zou overschrijden', 'zou overschrijden', 'zouden overschrijden', 'zouden overschrijden', 'zouden overschrijden'],
      subjuntivo: ['overschrijd', 'overschrijdt', 'overschrijdt', 'overschrijden', 'overschrijden', 'overschrijden'],
      continuo: ['ben aan het overschrijden', 'bent aan het overschrijden', 'is aan het overschrijden', 'zijn aan het overschrijden', 'zijn aan het overschrijden', 'zijn aan het overschrijden'],
      pluscuamperfecto: ['had overschreden', 'had overschreden', 'had overschreden', 'hadden overschreden', 'hadden overschreden', 'hadden overschreden']
    }
  },
  {
    id: 77, infinitive: 'recorrer', dutch: 'afleggen, doorkruisen', group: 'er-regelmatig',
    conjugations: {
      presente: ['recorro', 'recorres', 'recorre', 'recorremos', 'recorréis', 'recorren'],
      futuro: ['recorreré', 'recorrerás', 'recorrerá', 'recorreremos', 'recorreréis', 'recorrerán'],
      imperfecto: ['recorría', 'recorrías', 'recorría', 'recorríamos', 'recorríais', 'recorrían'],
      indefinido: ['recorrí', 'recorriste', 'recorrió', 'recorrimos', 'recorristeis', 'recorrieron'],
      gebiedende_wijs: [null, 'recorre', 'recorra', 'recorramos', 'recorred', 'recorran']
    },
    herkennen: {
      perfecto: ['he recorrido', 'has recorrido', 'ha recorrido', 'hemos recorrido', 'habéis recorrido', 'han recorrido'],
      condicional: ['recorrería', 'recorrerías', 'recorrería', 'recorreríamos', 'recorreríais', 'recorrerían'],
      subjuntivo: ['recorra', 'recorras', 'recorra', 'recorramos', 'recorráis', 'recorran'],
      continuo: ['estoy recorriendo', 'estás recorriendo', 'está recorriendo', 'estamos recorriendo', 'estáis recorriendo', 'están recorriendo'],
      pluscuamperfecto: ['había recorrido', 'habías recorrido', 'había recorrido', 'habíamos recorrido', 'habíais recorrido', 'habían recorrido']
    },
    herkennenNl: {
      perfecto: ['heb afgelegd', 'hebt afgelegd', 'heeft afgelegd', 'hebben afgelegd', 'hebben afgelegd', 'hebben afgelegd'],
      condicional: ['zou afleggen', 'zou afleggen', 'zou afleggen', 'zouden afleggen', 'zouden afleggen', 'zouden afleggen'],
      subjuntivo: ['leg af', 'legt af', 'legt af', 'afleggen', 'afleggen', 'afleggen'],
      continuo: ['ben aan het afleggen', 'bent aan het afleggen', 'is aan het afleggen', 'zijn aan het afleggen', 'zijn aan het afleggen', 'zijn aan het afleggen'],
      pluscuamperfecto: ['had afgelegd', 'had afgelegd', 'had afgelegd', 'hadden afgelegd', 'hadden afgelegd', 'hadden afgelegd']
    }
  },
  {
    id: 78, infinitive: 'prender', dutch: 'aanzetten, aansteken', group: 'er-regelmatig',
    conjugations: {
      presente: ['prendo', 'prendes', 'prende', 'prendemos', 'prendéis', 'prenden'],
      futuro: ['prenderé', 'prenderás', 'prenderá', 'prenderemos', 'prenderéis', 'prenderán'],
      imperfecto: ['prendía', 'prendías', 'prendía', 'prendíamos', 'prendíais', 'prendían'],
      indefinido: ['prendí', 'prendiste', 'prendió', 'prendimos', 'prendisteis', 'prendieron'],
      gebiedende_wijs: [null, 'prende', 'prenda', 'prendamos', 'prended', 'prendan']
    },
    herkennen: {
      perfecto: ['he prendido', 'has prendido', 'ha prendido', 'hemos prendido', 'habéis prendido', 'han prendido'],
      condicional: ['prendería', 'prenderías', 'prendería', 'prenderíamos', 'prenderíais', 'prenderían'],
      subjuntivo: ['prenda', 'prendas', 'prenda', 'prendamos', 'prendáis', 'prendan'],
      continuo: ['estoy prendiendo', 'estás prendiendo', 'está prendiendo', 'estamos prendiendo', 'estáis prendiendo', 'están prendiendo'],
      pluscuamperfecto: ['había prendido', 'habías prendido', 'había prendido', 'habíamos prendido', 'habíais prendido', 'habían prendido']
    },
    herkennenNl: {
      perfecto: ['heb aangezet', 'hebt aangezet', 'heeft aangezet', 'hebben aangezet', 'hebben aangezet', 'hebben aangezet'],
      condicional: ['zou aanzetten', 'zou aanzetten', 'zou aanzetten', 'zouden aanzetten', 'zouden aanzetten', 'zouden aanzetten'],
      subjuntivo: ['zet aan', 'zet aan', 'zet aan', 'aanzetten', 'aanzetten', 'aanzetten'],
      continuo: ['ben aan het aanzetten', 'bent aan het aanzetten', 'is aan het aanzetten', 'zijn aan het aanzetten', 'zijn aan het aanzetten', 'zijn aan het aanzetten'],
      pluscuamperfecto: ['had aangezet', 'had aangezet', 'had aangezet', 'hadden aangezet', 'hadden aangezet', 'hadden aangezet']
    }
  },
  {
    id: 79, infinitive: 'coser', dutch: 'naaien', group: 'er-regelmatig',
    conjugations: {
      presente: ['coso', 'coses', 'cose', 'cosemos', 'coséis', 'cosen'],
      futuro: ['coseré', 'coserás', 'coserá', 'coseremos', 'coseréis', 'coserán'],
      imperfecto: ['cosía', 'cosías', 'cosía', 'cosíamos', 'cosíais', 'cosían'],
      indefinido: ['cosí', 'cosiste', 'cosió', 'cosimos', 'cosisteis', 'cosieron'],
      gebiedende_wijs: [null, 'cose', 'cosa', 'cosamos', 'cosed', 'cosan']
    },
    herkennen: {
      perfecto: ['he cosido', 'has cosido', 'ha cosido', 'hemos cosido', 'habéis cosido', 'han cosido'],
      condicional: ['cosería', 'coserías', 'cosería', 'coseríamos', 'coseríais', 'coserían'],
      subjuntivo: ['cosa', 'cosas', 'cosa', 'cosamos', 'cosáis', 'cosan'],
      continuo: ['estoy cosiendo', 'estás cosiendo', 'está cosiendo', 'estamos cosiendo', 'estáis cosiendo', 'están cosiendo'],
      pluscuamperfecto: ['había cosido', 'habías cosido', 'había cosido', 'habíamos cosido', 'habíais cosido', 'habían cosido']
    },
    herkennenNl: {
      perfecto: ['heb genaaid', 'hebt genaaid', 'heeft genaaid', 'hebben genaaid', 'hebben genaaid', 'hebben genaaid'],
      condicional: ['zou naaien', 'zou naaien', 'zou naaien', 'zouden naaien', 'zouden naaien', 'zouden naaien'],
      subjuntivo: ['naai', 'naait', 'naait', 'naaien', 'naaien', 'naaien'],
      continuo: ['ben aan het naaien', 'bent aan het naaien', 'is aan het naaien', 'zijn aan het naaien', 'zijn aan het naaien', 'zijn aan het naaien'],
      pluscuamperfecto: ['had genaaid', 'had genaaid', 'had genaaid', 'hadden genaaid', 'hadden genaaid', 'hadden genaaid']
    }
  },

  // ── Nog meer regelmatige -ir werkwoorden ──
  {
    id: 80, infinitive: 'discutir', dutch: 'discussiëren, ruziën', group: 'ir-regelmatig',
    conjugations: {
      presente: ['discuto', 'discutes', 'discute', 'discutimos', 'discutís', 'discuten'],
      futuro: ['discutiré', 'discutirás', 'discutirá', 'discutiremos', 'discutiréis', 'discutirán'],
      imperfecto: ['discutía', 'discutías', 'discutía', 'discutíamos', 'discutíais', 'discutían'],
      indefinido: ['discutí', 'discutiste', 'discutió', 'discutimos', 'discutisteis', 'discutieron'],
      gebiedende_wijs: [null, 'discute', 'discuta', 'discutamos', 'discutid', 'discutan']
    },
    herkennen: {
      perfecto: ['he discutido', 'has discutido', 'ha discutido', 'hemos discutido', 'habéis discutido', 'han discutido'],
      condicional: ['discutiría', 'discutirías', 'discutiría', 'discutiríamos', 'discutiríais', 'discutirían'],
      subjuntivo: ['discuta', 'discutas', 'discuta', 'discutamos', 'discutáis', 'discutan'],
      continuo: ['estoy discutiendo', 'estás discutiendo', 'está discutiendo', 'estamos discutiendo', 'estáis discutiendo', 'están discutiendo'],
      pluscuamperfecto: ['había discutido', 'habías discutido', 'había discutido', 'habíamos discutido', 'habíais discutido', 'habían discutido']
    },
    herkennenNl: {
      perfecto: ['heb gediscussieerd', 'hebt gediscussieerd', 'heeft gediscussieerd', 'hebben gediscussieerd', 'hebben gediscussieerd', 'hebben gediscussieerd'],
      condicional: ['zou discussiëren', 'zou discussiëren', 'zou discussiëren', 'zouden discussiëren', 'zouden discussiëren', 'zouden discussiëren'],
      subjuntivo: ['discussieer', 'discussieert', 'discussieert', 'discussiëren', 'discussiëren', 'discussiëren'],
      continuo: ['ben aan het discussiëren', 'bent aan het discussiëren', 'is aan het discussiëren', 'zijn aan het discussiëren', 'zijn aan het discussiëren', 'zijn aan het discussiëren'],
      pluscuamperfecto: ['had gediscussieerd', 'had gediscussieerd', 'had gediscussieerd', 'hadden gediscussieerd', 'hadden gediscussieerd', 'hadden gediscussieerd']
    }
  },
  {
    id: 81, infinitive: 'insistir', dutch: 'aandringen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['insisto', 'insistes', 'insiste', 'insistimos', 'insistís', 'insisten'],
      futuro: ['insistiré', 'insistirás', 'insistirá', 'insistiremos', 'insistiréis', 'insistirán'],
      imperfecto: ['insistía', 'insistías', 'insistía', 'insistíamos', 'insistíais', 'insistían'],
      indefinido: ['insistí', 'insististe', 'insistió', 'insistimos', 'insististeis', 'insistieron'],
      gebiedende_wijs: [null, 'insiste', 'insista', 'insistamos', 'insistid', 'insistan']
    },
    herkennen: {
      perfecto: ['he insistido', 'has insistido', 'ha insistido', 'hemos insistido', 'habéis insistido', 'han insistido'],
      condicional: ['insistiría', 'insistirías', 'insistiría', 'insistiríamos', 'insistiríais', 'insistirían'],
      subjuntivo: ['insista', 'insistas', 'insista', 'insistamos', 'insistáis', 'insistan'],
      continuo: ['estoy insistiendo', 'estás insistiendo', 'está insistiendo', 'estamos insistiendo', 'estáis insistiendo', 'están insistiendo'],
      pluscuamperfecto: ['había insistido', 'habías insistido', 'había insistido', 'habíamos insistido', 'habíais insistido', 'habían insistido']
    },
    herkennenNl: {
      perfecto: ['heb aangedrongen', 'hebt aangedrongen', 'heeft aangedrongen', 'hebben aangedrongen', 'hebben aangedrongen', 'hebben aangedrongen'],
      condicional: ['zou aandringen', 'zou aandringen', 'zou aandringen', 'zouden aandringen', 'zouden aandringen', 'zouden aandringen'],
      subjuntivo: ['dring aan', 'dringt aan', 'dringt aan', 'aandringen', 'aandringen', 'aandringen'],
      continuo: ['ben aan het aandringen', 'bent aan het aandringen', 'is aan het aandringen', 'zijn aan het aandringen', 'zijn aan het aandringen', 'zijn aan het aandringen'],
      pluscuamperfecto: ['had aangedrongen', 'had aangedrongen', 'had aangedrongen', 'hadden aangedrongen', 'hadden aangedrongen', 'hadden aangedrongen']
    }
  },
  {
    id: 82, infinitive: 'existir', dutch: 'bestaan', group: 'ir-regelmatig',
    conjugations: {
      presente: ['existo', 'existes', 'existe', 'existimos', 'existís', 'existen'],
      futuro: ['existiré', 'existirás', 'existirá', 'existiremos', 'existiréis', 'existirán'],
      imperfecto: ['existía', 'existías', 'existía', 'existíamos', 'existíais', 'existían'],
      indefinido: ['existí', 'exististe', 'existió', 'existimos', 'exististeis', 'existieron'],
      gebiedende_wijs: [null, 'existe', 'exista', 'existamos', 'existid', 'existan']
    },
    herkennen: {
      perfecto: ['he existido', 'has existido', 'ha existido', 'hemos existido', 'habéis existido', 'han existido'],
      condicional: ['existiría', 'existirías', 'existiría', 'existiríamos', 'existiríais', 'existirían'],
      subjuntivo: ['exista', 'existas', 'exista', 'existamos', 'existáis', 'existan'],
      continuo: ['estoy existiendo', 'estás existiendo', 'está existiendo', 'estamos existiendo', 'estáis existiendo', 'están existiendo'],
      pluscuamperfecto: ['había existido', 'habías existido', 'había existido', 'habíamos existido', 'habíais existido', 'habían existido']
    },
    herkennenNl: {
      perfecto: ['heb bestaan', 'hebt bestaan', 'heeft bestaan', 'hebben bestaan', 'hebben bestaan', 'hebben bestaan'],
      condicional: ['zou bestaan', 'zou bestaan', 'zou bestaan', 'zouden bestaan', 'zouden bestaan', 'zouden bestaan'],
      subjuntivo: ['besta', 'bestaat', 'bestaat', 'bestaan', 'bestaan', 'bestaan'],
      continuo: ['ben aan het bestaan', 'bent aan het bestaan', 'is aan het bestaan', 'zijn aan het bestaan', 'zijn aan het bestaan', 'zijn aan het bestaan'],
      pluscuamperfecto: ['had bestaan', 'had bestaan', 'had bestaan', 'hadden bestaan', 'hadden bestaan', 'hadden bestaan']
    }
  },
  {
    id: 83, infinitive: 'resistir', dutch: 'weerstaan', group: 'ir-regelmatig',
    conjugations: {
      presente: ['resisto', 'resistes', 'resiste', 'resistimos', 'resistís', 'resisten'],
      futuro: ['resistiré', 'resistirás', 'resistirá', 'resistiremos', 'resistiréis', 'resistirán'],
      imperfecto: ['resistía', 'resistías', 'resistía', 'resistíamos', 'resistíais', 'resistían'],
      indefinido: ['resistí', 'resististe', 'resistió', 'resistimos', 'resististeis', 'resistieron'],
      gebiedende_wijs: [null, 'resiste', 'resista', 'resistamos', 'resistid', 'resistan']
    },
    herkennen: {
      perfecto: ['he resistido', 'has resistido', 'ha resistido', 'hemos resistido', 'habéis resistido', 'han resistido'],
      condicional: ['resistiría', 'resistirías', 'resistiría', 'resistiríamos', 'resistiríais', 'resistirían'],
      subjuntivo: ['resista', 'resistas', 'resista', 'resistamos', 'resistáis', 'resistan'],
      continuo: ['estoy resistiendo', 'estás resistiendo', 'está resistiendo', 'estamos resistiendo', 'estáis resistiendo', 'están resistiendo'],
      pluscuamperfecto: ['había resistido', 'habías resistido', 'había resistido', 'habíamos resistido', 'habíais resistido', 'habían resistido']
    },
    herkennenNl: {
      perfecto: ['heb weerstaan', 'hebt weerstaan', 'heeft weerstaan', 'hebben weerstaan', 'hebben weerstaan', 'hebben weerstaan'],
      condicional: ['zou weerstaan', 'zou weerstaan', 'zou weerstaan', 'zouden weerstaan', 'zouden weerstaan', 'zouden weerstaan'],
      subjuntivo: ['weersta', 'weerstaat', 'weerstaat', 'weerstaan', 'weerstaan', 'weerstaan'],
      continuo: ['ben aan het weerstaan', 'bent aan het weerstaan', 'is aan het weerstaan', 'zijn aan het weerstaan', 'zijn aan het weerstaan', 'zijn aan het weerstaan'],
      pluscuamperfecto: ['had weerstaan', 'had weerstaan', 'had weerstaan', 'hadden weerstaan', 'hadden weerstaan', 'hadden weerstaan']
    }
  },
  {
    id: 84, infinitive: 'persistir', dutch: 'volharden', group: 'ir-regelmatig',
    conjugations: {
      presente: ['persisto', 'persistes', 'persiste', 'persistimos', 'persistís', 'persisten'],
      futuro: ['persistiré', 'persistirás', 'persistirá', 'persistiremos', 'persistiréis', 'persistirán'],
      imperfecto: ['persistía', 'persistías', 'persistía', 'persistíamos', 'persistíais', 'persistían'],
      indefinido: ['persistí', 'persististe', 'persistió', 'persistimos', 'persististeis', 'persistieron'],
      gebiedende_wijs: [null, 'persiste', 'persista', 'persistamos', 'persistid', 'persistan']
    },
    herkennen: {
      perfecto: ['he persistido', 'has persistido', 'ha persistido', 'hemos persistido', 'habéis persistido', 'han persistido'],
      condicional: ['persistiría', 'persistirías', 'persistiría', 'persistiríamos', 'persistiríais', 'persistirían'],
      subjuntivo: ['persista', 'persistas', 'persista', 'persistamos', 'persistáis', 'persistan'],
      continuo: ['estoy persistiendo', 'estás persistiendo', 'está persistiendo', 'estamos persistiendo', 'estáis persistiendo', 'están persistiendo'],
      pluscuamperfecto: ['había persistido', 'habías persistido', 'había persistido', 'habíamos persistido', 'habíais persistido', 'habían persistido']
    },
    herkennenNl: {
      perfecto: ['heb volhard', 'hebt volhard', 'heeft volhard', 'hebben volhard', 'hebben volhard', 'hebben volhard'],
      condicional: ['zou volharden', 'zou volharden', 'zou volharden', 'zouden volharden', 'zouden volharden', 'zouden volharden'],
      subjuntivo: ['volhard', 'volhardt', 'volhardt', 'volharden', 'volharden', 'volharden'],
      continuo: ['ben aan het volharden', 'bent aan het volharden', 'is aan het volharden', 'zijn aan het volharden', 'zijn aan het volharden', 'zijn aan het volharden'],
      pluscuamperfecto: ['had volhard', 'had volhard', 'had volhard', 'hadden volhard', 'hadden volhard', 'hadden volhard']
    }
  },
  {
    id: 85, infinitive: 'consistir', dutch: 'bestaan uit', group: 'ir-regelmatig',
    conjugations: {
      presente: ['consisto', 'consistes', 'consiste', 'consistimos', 'consistís', 'consisten'],
      futuro: ['consistiré', 'consistirás', 'consistirá', 'consistiremos', 'consistiréis', 'consistirán'],
      imperfecto: ['consistía', 'consistías', 'consistía', 'consistíamos', 'consistíais', 'consistían'],
      indefinido: ['consistí', 'consististe', 'consistió', 'consistimos', 'consististeis', 'consistieron'],
      gebiedende_wijs: [null, 'consiste', 'consista', 'consistamos', 'consistid', 'consistan']
    },
    herkennen: {
      perfecto: ['he consistido', 'has consistido', 'ha consistido', 'hemos consistido', 'habéis consistido', 'han consistido'],
      condicional: ['consistiría', 'consistirías', 'consistiría', 'consistiríamos', 'consistiríais', 'consistirían'],
      subjuntivo: ['consista', 'consistas', 'consista', 'consistamos', 'consistáis', 'consistan'],
      continuo: ['estoy consistiendo', 'estás consistiendo', 'está consistiendo', 'estamos consistiendo', 'estáis consistiendo', 'están consistiendo'],
      pluscuamperfecto: ['había consistido', 'habías consistido', 'había consistido', 'habíamos consistido', 'habíais consistido', 'habían consistido']
    },
    herkennenNl: {
      perfecto: ['heb bestaan uit', 'hebt bestaan uit', 'heeft bestaan uit', 'hebben bestaan uit', 'hebben bestaan uit', 'hebben bestaan uit'],
      condicional: ['zou bestaan uit', 'zou bestaan uit', 'zou bestaan uit', 'zouden bestaan uit', 'zouden bestaan uit', 'zouden bestaan uit'],
      subjuntivo: ['besta uit', 'bestaat uit', 'bestaat uit', 'bestaan uit', 'bestaan uit', 'bestaan uit'],
      continuo: ['ben aan het bestaan uit', 'bent aan het bestaan uit', 'is aan het bestaan uit', 'zijn aan het bestaan uit', 'zijn aan het bestaan uit', 'zijn aan het bestaan uit'],
      pluscuamperfecto: ['had bestaan uit', 'had bestaan uit', 'had bestaan uit', 'hadden bestaan uit', 'hadden bestaan uit', 'hadden bestaan uit']
    }
  },
  {
    id: 86, infinitive: 'añadir', dutch: 'toevoegen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['añado', 'añades', 'añade', 'añadimos', 'añadís', 'añaden'],
      futuro: ['añadiré', 'añadirás', 'añadirá', 'añadiremos', 'añadiréis', 'añadirán'],
      imperfecto: ['añadía', 'añadías', 'añadía', 'añadíamos', 'añadíais', 'añadían'],
      indefinido: ['añadí', 'añadiste', 'añadió', 'añadimos', 'añadisteis', 'añadieron'],
      gebiedende_wijs: [null, 'añade', 'añada', 'añadamos', 'añadid', 'añadan']
    },
    herkennen: {
      perfecto: ['he añadido', 'has añadido', 'ha añadido', 'hemos añadido', 'habéis añadido', 'han añadido'],
      condicional: ['añadiría', 'añadirías', 'añadiría', 'añadiríamos', 'añadiríais', 'añadirían'],
      subjuntivo: ['añada', 'añadas', 'añada', 'añadamos', 'añadáis', 'añadan'],
      continuo: ['estoy añadiendo', 'estás añadiendo', 'está añadiendo', 'estamos añadiendo', 'estáis añadiendo', 'están añadiendo'],
      pluscuamperfecto: ['había añadido', 'habías añadido', 'había añadido', 'habíamos añadido', 'habíais añadido', 'habían añadido']
    },
    herkennenNl: {
      perfecto: ['heb toegevoegd', 'hebt toegevoegd', 'heeft toegevoegd', 'hebben toegevoegd', 'hebben toegevoegd', 'hebben toegevoegd'],
      condicional: ['zou toevoegen', 'zou toevoegen', 'zou toevoegen', 'zouden toevoegen', 'zouden toevoegen', 'zouden toevoegen'],
      subjuntivo: ['voeg toe', 'voegt toe', 'voegt toe', 'toevoegen', 'toevoegen', 'toevoegen'],
      continuo: ['ben aan het toevoegen', 'bent aan het toevoegen', 'is aan het toevoegen', 'zijn aan het toevoegen', 'zijn aan het toevoegen', 'zijn aan het toevoegen'],
      pluscuamperfecto: ['had toegevoegd', 'had toegevoegd', 'had toegevoegd', 'hadden toegevoegd', 'hadden toegevoegd', 'hadden toegevoegd']
    }
  },
  {
    id: 87, infinitive: 'imprimir', dutch: 'printen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['imprimo', 'imprimes', 'imprime', 'imprimimos', 'imprimís', 'imprimen'],
      futuro: ['imprimiré', 'imprimirás', 'imprimirá', 'imprimiremos', 'imprimiréis', 'imprimirán'],
      imperfecto: ['imprimía', 'imprimías', 'imprimía', 'imprimíamos', 'imprimíais', 'imprimían'],
      indefinido: ['imprimí', 'imprimiste', 'imprimió', 'imprimimos', 'imprimisteis', 'imprimieron'],
      gebiedende_wijs: [null, 'imprime', 'imprima', 'imprimamos', 'imprimid', 'impriman']
    },
    herkennen: {
      perfecto: ['he impreso', 'has impreso', 'ha impreso', 'hemos impreso', 'habéis impreso', 'han impreso'],
      condicional: ['imprimiría', 'imprimirías', 'imprimiría', 'imprimiríamos', 'imprimiríais', 'imprimirían'],
      subjuntivo: ['imprima', 'imprimas', 'imprima', 'imprimamos', 'imprimáis', 'impriman'],
      continuo: ['estoy imprimiendo', 'estás imprimiendo', 'está imprimiendo', 'estamos imprimiendo', 'estáis imprimiendo', 'están imprimiendo'],
      pluscuamperfecto: ['había impreso', 'habías impreso', 'había impreso', 'habíamos impreso', 'habíais impreso', 'habían impreso']
    },
    herkennenNl: {
      perfecto: ['heb geprint', 'hebt geprint', 'heeft geprint', 'hebben geprint', 'hebben geprint', 'hebben geprint'],
      condicional: ['zou printen', 'zou printen', 'zou printen', 'zouden printen', 'zouden printen', 'zouden printen'],
      subjuntivo: ['print', 'print', 'print', 'printen', 'printen', 'printen'],
      continuo: ['ben aan het printen', 'bent aan het printen', 'is aan het printen', 'zijn aan het printen', 'zijn aan het printen', 'zijn aan het printen'],
      pluscuamperfecto: ['had geprint', 'had geprint', 'had geprint', 'hadden geprint', 'hadden geprint', 'hadden geprint']
    }
  },
  {
    id: 88, infinitive: 'cumplir', dutch: 'vervullen, nakomen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['cumplo', 'cumples', 'cumple', 'cumplimos', 'cumplís', 'cumplen'],
      futuro: ['cumpliré', 'cumplirás', 'cumplirá', 'cumpliremos', 'cumpliréis', 'cumplirán'],
      imperfecto: ['cumplía', 'cumplías', 'cumplía', 'cumplíamos', 'cumplíais', 'cumplían'],
      indefinido: ['cumplí', 'cumpliste', 'cumplió', 'cumplimos', 'cumplisteis', 'cumplieron'],
      gebiedende_wijs: [null, 'cumple', 'cumpla', 'cumplamos', 'cumplid', 'cumplan']
    },
    herkennen: {
      perfecto: ['he cumplido', 'has cumplido', 'ha cumplido', 'hemos cumplido', 'habéis cumplido', 'han cumplido'],
      condicional: ['cumpliría', 'cumplirías', 'cumpliría', 'cumpliríamos', 'cumpliríais', 'cumplirían'],
      subjuntivo: ['cumpla', 'cumplas', 'cumpla', 'cumplamos', 'cumpláis', 'cumplan'],
      continuo: ['estoy cumpliendo', 'estás cumpliendo', 'está cumpliendo', 'estamos cumpliendo', 'estáis cumpliendo', 'están cumpliendo'],
      pluscuamperfecto: ['había cumplido', 'habías cumplido', 'había cumplido', 'habíamos cumplido', 'habíais cumplido', 'habían cumplido']
    },
    herkennenNl: {
      perfecto: ['heb vervuld', 'hebt vervuld', 'heeft vervuld', 'hebben vervuld', 'hebben vervuld', 'hebben vervuld'],
      condicional: ['zou vervullen', 'zou vervullen', 'zou vervullen', 'zouden vervullen', 'zouden vervullen', 'zouden vervullen'],
      subjuntivo: ['vervul', 'vervult', 'vervult', 'vervullen', 'vervullen', 'vervullen'],
      continuo: ['ben aan het vervullen', 'bent aan het vervullen', 'is aan het vervullen', 'zijn aan het vervullen', 'zijn aan het vervullen', 'zijn aan het vervullen'],
      pluscuamperfecto: ['had vervuld', 'had vervuld', 'had vervuld', 'hadden vervuld', 'hadden vervuld', 'hadden vervuld']
    }
  },
  {
    id: 89, infinitive: 'describir', dutch: 'beschrijven', group: 'ir-regelmatig',
    conjugations: {
      presente: ['describo', 'describes', 'describe', 'describimos', 'describís', 'describen'],
      futuro: ['describiré', 'describirás', 'describirá', 'describiremos', 'describiréis', 'describirán'],
      imperfecto: ['describía', 'describías', 'describía', 'describíamos', 'describíais', 'describían'],
      indefinido: ['describí', 'describiste', 'describió', 'describimos', 'describisteis', 'describieron'],
      gebiedende_wijs: [null, 'describe', 'describa', 'describamos', 'describid', 'describan']
    },
    herkennen: {
      perfecto: ['he descrito', 'has descrito', 'ha descrito', 'hemos descrito', 'habéis descrito', 'han descrito'],
      condicional: ['describiría', 'describirías', 'describiría', 'describiríamos', 'describiríais', 'describirían'],
      subjuntivo: ['describa', 'describas', 'describa', 'describamos', 'describáis', 'describan'],
      continuo: ['estoy describiendo', 'estás describiendo', 'está describiendo', 'estamos describiendo', 'estáis describiendo', 'están describiendo'],
      pluscuamperfecto: ['había descrito', 'habías descrito', 'había descrito', 'habíamos descrito', 'habíais descrito', 'habían descrito']
    },
    herkennenNl: {
      perfecto: ['heb beschreven', 'hebt beschreven', 'heeft beschreven', 'hebben beschreven', 'hebben beschreven', 'hebben beschreven'],
      condicional: ['zou beschrijven', 'zou beschrijven', 'zou beschrijven', 'zouden beschrijven', 'zouden beschrijven', 'zouden beschrijven'],
      subjuntivo: ['beschrijf', 'beschrijft', 'beschrijft', 'beschrijven', 'beschrijven', 'beschrijven'],
      continuo: ['ben aan het beschrijven', 'bent aan het beschrijven', 'is aan het beschrijven', 'zijn aan het beschrijven', 'zijn aan het beschrijven', 'zijn aan het beschrijven'],
      pluscuamperfecto: ['had beschreven', 'had beschreven', 'had beschreven', 'hadden beschreven', 'hadden beschreven', 'hadden beschreven']
    }
  },
  {
    id: 90, infinitive: 'definir', dutch: 'definiëren', group: 'ir-regelmatig',
    conjugations: {
      presente: ['defino', 'defines', 'define', 'definimos', 'definís', 'definen'],
      futuro: ['definiré', 'definirás', 'definirá', 'definiremos', 'definiréis', 'definirán'],
      imperfecto: ['definía', 'definías', 'definía', 'definíamos', 'definíais', 'definían'],
      indefinido: ['definí', 'definiste', 'definió', 'definimos', 'definisteis', 'definieron'],
      gebiedende_wijs: [null, 'define', 'defina', 'definamos', 'definid', 'definan']
    },
    herkennen: {
      perfecto: ['he definido', 'has definido', 'ha definido', 'hemos definido', 'habéis definido', 'han definido'],
      condicional: ['definiría', 'definirías', 'definiría', 'definiríamos', 'definiríais', 'definirían'],
      subjuntivo: ['defina', 'definas', 'defina', 'definamos', 'defináis', 'definan'],
      continuo: ['estoy definiendo', 'estás definiendo', 'está definiendo', 'estamos definiendo', 'estáis definiendo', 'están definiendo'],
      pluscuamperfecto: ['había definido', 'habías definido', 'había definido', 'habíamos definido', 'habíais definido', 'habían definido']
    },
    herkennenNl: {
      perfecto: ['heb gedefinieerd', 'hebt gedefinieerd', 'heeft gedefinieerd', 'hebben gedefinieerd', 'hebben gedefinieerd', 'hebben gedefinieerd'],
      condicional: ['zou definiëren', 'zou definiëren', 'zou definiëren', 'zouden definiëren', 'zouden definiëren', 'zouden definiëren'],
      subjuntivo: ['definieer', 'definieert', 'definieert', 'definiëren', 'definiëren', 'definiëren'],
      continuo: ['ben aan het definiëren', 'bent aan het definiëren', 'is aan het definiëren', 'zijn aan het definiëren', 'zijn aan het definiëren', 'zijn aan het definiëren'],
      pluscuamperfecto: ['had gedefinieerd', 'had gedefinieerd', 'had gedefinieerd', 'hadden gedefinieerd', 'hadden gedefinieerd', 'hadden gedefinieerd']
    }
  },
  {
    id: 91, infinitive: 'unir', dutch: 'verenigen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['uno', 'unes', 'une', 'unimos', 'unís', 'unen'],
      futuro: ['uniré', 'unirás', 'unirá', 'uniremos', 'uniréis', 'unirán'],
      imperfecto: ['unía', 'unías', 'unía', 'uníamos', 'uníais', 'unían'],
      indefinido: ['uní', 'uniste', 'unió', 'unimos', 'unisteis', 'unieron'],
      gebiedende_wijs: [null, 'une', 'una', 'unamos', 'unid', 'unan']
    },
    herkennen: {
      perfecto: ['he unido', 'has unido', 'ha unido', 'hemos unido', 'habéis unido', 'han unido'],
      condicional: ['uniría', 'unirías', 'uniría', 'uniríamos', 'uniríais', 'unirían'],
      subjuntivo: ['una', 'unas', 'una', 'unamos', 'unáis', 'unan'],
      continuo: ['estoy uniendo', 'estás uniendo', 'está uniendo', 'estamos uniendo', 'estáis uniendo', 'están uniendo'],
      pluscuamperfecto: ['había unido', 'habías unido', 'había unido', 'habíamos unido', 'habíais unido', 'habían unido']
    },
    herkennenNl: {
      perfecto: ['heb verenigd', 'hebt verenigd', 'heeft verenigd', 'hebben verenigd', 'hebben verenigd', 'hebben verenigd'],
      condicional: ['zou verenigen', 'zou verenigen', 'zou verenigen', 'zouden verenigen', 'zouden verenigen', 'zouden verenigen'],
      subjuntivo: ['verenig', 'verenigt', 'verenigt', 'verenigen', 'verenigen', 'verenigen'],
      continuo: ['ben aan het verenigen', 'bent aan het verenigen', 'is aan het verenigen', 'zijn aan het verenigen', 'zijn aan het verenigen', 'zijn aan het verenigen'],
      pluscuamperfecto: ['had verenigd', 'had verenigd', 'had verenigd', 'hadden verenigd', 'hadden verenigd', 'hadden verenigd']
    }
  },
  {
    id: 92, infinitive: 'partir', dutch: 'vertrekken, verdelen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['parto', 'partes', 'parte', 'partimos', 'partís', 'parten'],
      futuro: ['partiré', 'partirás', 'partirá', 'partiremos', 'partiréis', 'partirán'],
      imperfecto: ['partía', 'partías', 'partía', 'partíamos', 'partíais', 'partían'],
      indefinido: ['partí', 'partiste', 'partió', 'partimos', 'partisteis', 'partieron'],
      gebiedende_wijs: [null, 'parte', 'parta', 'partamos', 'partid', 'partan']
    },
    herkennen: {
      perfecto: ['he partido', 'has partido', 'ha partido', 'hemos partido', 'habéis partido', 'han partido'],
      condicional: ['partiría', 'partirías', 'partiría', 'partiríamos', 'partiríais', 'partirían'],
      subjuntivo: ['parta', 'partas', 'parta', 'partamos', 'partáis', 'partan'],
      continuo: ['estoy partiendo', 'estás partiendo', 'está partiendo', 'estamos partiendo', 'estáis partiendo', 'están partiendo'],
      pluscuamperfecto: ['había partido', 'habías partido', 'había partido', 'habíamos partido', 'habíais partido', 'habían partido']
    },
    herkennenNl: {
      perfecto: ['ben vertrokken', 'bent vertrokken', 'is vertrokken', 'zijn vertrokken', 'zijn vertrokken', 'zijn vertrokken'],
      condicional: ['zou vertrekken', 'zou vertrekken', 'zou vertrekken', 'zouden vertrekken', 'zouden vertrekken', 'zouden vertrekken'],
      subjuntivo: ['vertrek', 'vertrekt', 'vertrekt', 'vertrekken', 'vertrekken', 'vertrekken'],
      continuo: ['ben aan het vertrekken', 'bent aan het vertrekken', 'is aan het vertrekken', 'zijn aan het vertrekken', 'zijn aan het vertrekken', 'zijn aan het vertrekken'],
      pluscuamperfecto: ['was vertrokken', 'was vertrokken', 'was vertrokken', 'waren vertrokken', 'waren vertrokken', 'waren vertrokken']
    }
  },
  {
    id: 93, infinitive: 'sufrir', dutch: 'lijden', group: 'ir-regelmatig',
    conjugations: {
      presente: ['sufro', 'sufres', 'sufre', 'sufrimos', 'sufrís', 'sufren'],
      futuro: ['sufriré', 'sufrirás', 'sufrirá', 'sufriremos', 'sufriréis', 'sufrirán'],
      imperfecto: ['sufría', 'sufrías', 'sufría', 'sufríamos', 'sufríais', 'sufrían'],
      indefinido: ['sufrí', 'sufriste', 'sufrió', 'sufrimos', 'sufristeis', 'sufrieron'],
      gebiedende_wijs: [null, 'sufre', 'sufra', 'suframos', 'sufrid', 'sufran']
    },
    herkennen: {
      perfecto: ['he sufrido', 'has sufrido', 'ha sufrido', 'hemos sufrido', 'habéis sufrido', 'han sufrido'],
      condicional: ['sufriría', 'sufrirías', 'sufriría', 'sufriríamos', 'sufriríais', 'sufrirían'],
      subjuntivo: ['sufra', 'sufras', 'sufra', 'suframos', 'sufráis', 'sufran'],
      continuo: ['estoy sufriendo', 'estás sufriendo', 'está sufriendo', 'estamos sufriendo', 'estáis sufriendo', 'están sufriendo'],
      pluscuamperfecto: ['había sufrido', 'habías sufrido', 'había sufrido', 'habíamos sufrido', 'habíais sufrido', 'habían sufrido']
    },
    herkennenNl: {
      perfecto: ['heb geleden', 'hebt geleden', 'heeft geleden', 'hebben geleden', 'hebben geleden', 'hebben geleden'],
      condicional: ['zou lijden', 'zou lijden', 'zou lijden', 'zouden lijden', 'zouden lijden', 'zouden lijden'],
      subjuntivo: ['lijd', 'lijdt', 'lijdt', 'lijden', 'lijden', 'lijden'],
      continuo: ['ben aan het lijden', 'bent aan het lijden', 'is aan het lijden', 'zijn aan het lijden', 'zijn aan het lijden', 'zijn aan het lijden'],
      pluscuamperfecto: ['had geleden', 'had geleden', 'had geleden', 'hadden geleden', 'hadden geleden', 'hadden geleden']
    }
  },
  {
    id: 94, infinitive: 'cubrir', dutch: 'bedekken', group: 'ir-regelmatig',
    conjugations: {
      presente: ['cubro', 'cubres', 'cubre', 'cubrimos', 'cubrís', 'cubren'],
      futuro: ['cubriré', 'cubrirás', 'cubrirá', 'cubriremos', 'cubriréis', 'cubrirán'],
      imperfecto: ['cubría', 'cubrías', 'cubría', 'cubríamos', 'cubríais', 'cubrían'],
      indefinido: ['cubrí', 'cubriste', 'cubrió', 'cubrimos', 'cubristeis', 'cubrieron'],
      gebiedende_wijs: [null, 'cubre', 'cubra', 'cubramos', 'cubrid', 'cubran']
    },
    herkennen: {
      perfecto: ['he cubierto', 'has cubierto', 'ha cubierto', 'hemos cubierto', 'habéis cubierto', 'han cubierto'],
      condicional: ['cubriría', 'cubrirías', 'cubriría', 'cubriríamos', 'cubriríais', 'cubrirían'],
      subjuntivo: ['cubra', 'cubras', 'cubra', 'cubramos', 'cubráis', 'cubran'],
      continuo: ['estoy cubriendo', 'estás cubriendo', 'está cubriendo', 'estamos cubriendo', 'estáis cubriendo', 'están cubriendo'],
      pluscuamperfecto: ['había cubierto', 'habías cubierto', 'había cubierto', 'habíamos cubierto', 'habíais cubierto', 'habían cubierto']
    },
    herkennenNl: {
      perfecto: ['heb bedekt', 'hebt bedekt', 'heeft bedekt', 'hebben bedekt', 'hebben bedekt', 'hebben bedekt'],
      condicional: ['zou bedekken', 'zou bedekken', 'zou bedekken', 'zouden bedekken', 'zouden bedekken', 'zouden bedekken'],
      subjuntivo: ['bedek', 'bedekt', 'bedekt', 'bedekken', 'bedekken', 'bedekken'],
      continuo: ['ben aan het bedekken', 'bent aan het bedekken', 'is aan het bedekken', 'zijn aan het bedekken', 'zijn aan het bedekken', 'zijn aan het bedekken'],
      pluscuamperfecto: ['had bedekt', 'had bedekt', 'had bedekt', 'hadden bedekt', 'hadden bedekt', 'hadden bedekt']
    }
  },
  {
    id: 95, infinitive: 'dividir', dutch: 'verdelen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['divido', 'divides', 'divide', 'dividimos', 'dividís', 'dividen'],
      futuro: ['dividiré', 'dividirás', 'dividirá', 'dividiremos', 'dividiréis', 'dividirán'],
      imperfecto: ['dividía', 'dividías', 'dividía', 'dividíamos', 'dividíais', 'dividían'],
      indefinido: ['dividí', 'dividiste', 'dividió', 'dividimos', 'dividisteis', 'dividieron'],
      gebiedende_wijs: [null, 'divide', 'divida', 'dividamos', 'dividid', 'dividan']
    },
    herkennen: {
      perfecto: ['he dividido', 'has dividido', 'ha dividido', 'hemos dividido', 'habéis dividido', 'han dividido'],
      condicional: ['dividiría', 'dividirías', 'dividiría', 'dividiríamos', 'dividiríais', 'dividirían'],
      subjuntivo: ['divida', 'dividas', 'divida', 'dividamos', 'dividáis', 'dividan'],
      continuo: ['estoy dividiendo', 'estás dividiendo', 'está dividiendo', 'estamos dividiendo', 'estáis dividiendo', 'están dividiendo'],
      pluscuamperfecto: ['había dividido', 'habías dividido', 'había dividido', 'habíamos dividido', 'habíais dividido', 'habían dividido']
    },
    herkennenNl: {
      perfecto: ['heb verdeeld', 'hebt verdeeld', 'heeft verdeeld', 'hebben verdeeld', 'hebben verdeeld', 'hebben verdeeld'],
      condicional: ['zou verdelen', 'zou verdelen', 'zou verdelen', 'zouden verdelen', 'zouden verdelen', 'zouden verdelen'],
      subjuntivo: ['verdeel', 'verdeelt', 'verdeelt', 'verdelen', 'verdelen', 'verdelen'],
      continuo: ['ben aan het verdelen', 'bent aan het verdelen', 'is aan het verdelen', 'zijn aan het verdelen', 'zijn aan het verdelen', 'zijn aan het verdelen'],
      pluscuamperfecto: ['had verdeeld', 'had verdeeld', 'had verdeeld', 'hadden verdeeld', 'hadden verdeeld', 'hadden verdeeld']
    }
  },

  // ── Nog meer onregelmatige werkwoorden ──
  {
    id: 96, infinitive: 'conocer', dutch: 'kennen', group: 'onregelmatig',
    conjugations: {
      presente: ['conozco', 'conoces', 'conoce', 'conocemos', 'conocéis', 'conocen'],
      futuro: ['conoceré', 'conocerás', 'conocerá', 'conoceremos', 'conoceréis', 'conocerán'],
      imperfecto: ['conocía', 'conocías', 'conocía', 'conocíamos', 'conocíais', 'conocían'],
      indefinido: ['conocí', 'conociste', 'conoció', 'conocimos', 'conocisteis', 'conocieron'],
      gebiedende_wijs: [null, 'conoce', 'conozca', 'conozcamos', 'conoced', 'conozcan']
    },
    herkennen: {
      perfecto: ['he conocido', 'has conocido', 'ha conocido', 'hemos conocido', 'habéis conocido', 'han conocido'],
      condicional: ['conocería', 'conocerías', 'conocería', 'conoceríamos', 'conoceríais', 'conocerían'],
      subjuntivo: ['conozca', 'conozcas', 'conozca', 'conozcamos', 'conozcáis', 'conozcan'],
      continuo: ['estoy conociendo', 'estás conociendo', 'está conociendo', 'estamos conociendo', 'estáis conociendo', 'están conociendo'],
      pluscuamperfecto: ['había conocido', 'habías conocido', 'había conocido', 'habíamos conocido', 'habíais conocido', 'habían conocido']
    },
    herkennenNl: {
      perfecto: ['heb gekend', 'hebt gekend', 'heeft gekend', 'hebben gekend', 'hebben gekend', 'hebben gekend'],
      condicional: ['zou kennen', 'zou kennen', 'zou kennen', 'zouden kennen', 'zouden kennen', 'zouden kennen'],
      subjuntivo: ['ken', 'kent', 'kent', 'kennen', 'kennen', 'kennen'],
      continuo: ['ben aan het kennen', 'bent aan het kennen', 'is aan het kennen', 'zijn aan het kennen', 'zijn aan het kennen', 'zijn aan het kennen'],
      pluscuamperfecto: ['had gekend', 'had gekend', 'had gekend', 'hadden gekend', 'hadden gekend', 'hadden gekend']
    }
  },
  {
    id: 97, infinitive: 'seguir', dutch: 'volgen, doorgaan', group: 'onregelmatig',
    conjugations: {
      presente: ['sigo', 'sigues', 'sigue', 'seguimos', 'seguís', 'siguen'],
      futuro: ['seguiré', 'seguirás', 'seguirá', 'seguiremos', 'seguiréis', 'seguirán'],
      imperfecto: ['seguía', 'seguías', 'seguía', 'seguíamos', 'seguíais', 'seguían'],
      indefinido: ['seguí', 'seguiste', 'siguió', 'seguimos', 'seguisteis', 'siguieron'],
      gebiedende_wijs: [null, 'sigue', 'siga', 'sigamos', 'seguid', 'sigan']
    },
    herkennen: {
      perfecto: ['he seguido', 'has seguido', 'ha seguido', 'hemos seguido', 'habéis seguido', 'han seguido'],
      condicional: ['seguiría', 'seguirías', 'seguiría', 'seguiríamos', 'seguiríais', 'seguirían'],
      subjuntivo: ['siga', 'sigas', 'siga', 'sigamos', 'sigáis', 'sigan'],
      continuo: ['estoy siguiendo', 'estás siguiendo', 'está siguiendo', 'estamos siguiendo', 'estáis siguiendo', 'están siguiendo'],
      pluscuamperfecto: ['había seguido', 'habías seguido', 'había seguido', 'habíamos seguido', 'habíais seguido', 'habían seguido']
    },
    herkennenNl: {
      perfecto: ['heb gevolgd', 'hebt gevolgd', 'heeft gevolgd', 'hebben gevolgd', 'hebben gevolgd', 'hebben gevolgd'],
      condicional: ['zou volgen', 'zou volgen', 'zou volgen', 'zouden volgen', 'zouden volgen', 'zouden volgen'],
      subjuntivo: ['volg', 'volgt', 'volgt', 'volgen', 'volgen', 'volgen'],
      continuo: ['ben aan het volgen', 'bent aan het volgen', 'is aan het volgen', 'zijn aan het volgen', 'zijn aan het volgen', 'zijn aan het volgen'],
      pluscuamperfecto: ['had gevolgd', 'had gevolgd', 'had gevolgd', 'hadden gevolgd', 'hadden gevolgd', 'hadden gevolgd']
    }
  },
  {
    id: 98, infinitive: 'sentir', dutch: 'voelen', group: 'onregelmatig',
    conjugations: {
      presente: ['siento', 'sientes', 'siente', 'sentimos', 'sentís', 'sienten'],
      futuro: ['sentiré', 'sentirás', 'sentirá', 'sentiremos', 'sentiréis', 'sentirán'],
      imperfecto: ['sentía', 'sentías', 'sentía', 'sentíamos', 'sentíais', 'sentían'],
      indefinido: ['sentí', 'sentiste', 'sintió', 'sentimos', 'sentisteis', 'sintieron'],
      gebiedende_wijs: [null, 'siente', 'sienta', 'sintamos', 'sentid', 'sientan']
    },
    herkennen: {
      perfecto: ['he sentido', 'has sentido', 'ha sentido', 'hemos sentido', 'habéis sentido', 'han sentido'],
      condicional: ['sentiría', 'sentirías', 'sentiría', 'sentiríamos', 'sentiríais', 'sentirían'],
      subjuntivo: ['sienta', 'sientas', 'sienta', 'sintamos', 'sintáis', 'sientan'],
      continuo: ['estoy sintiendo', 'estás sintiendo', 'está sintiendo', 'estamos sintiendo', 'estáis sintiendo', 'están sintiendo'],
      pluscuamperfecto: ['había sentido', 'habías sentido', 'había sentido', 'habíamos sentido', 'habíais sentido', 'habían sentido']
    },
    herkennenNl: {
      perfecto: ['heb gevoeld', 'hebt gevoeld', 'heeft gevoeld', 'hebben gevoeld', 'hebben gevoeld', 'hebben gevoeld'],
      condicional: ['zou voelen', 'zou voelen', 'zou voelen', 'zouden voelen', 'zouden voelen', 'zouden voelen'],
      subjuntivo: ['voel', 'voelt', 'voelt', 'voelen', 'voelen', 'voelen'],
      continuo: ['ben aan het voelen', 'bent aan het voelen', 'is aan het voelen', 'zijn aan het voelen', 'zijn aan het voelen', 'zijn aan het voelen'],
      pluscuamperfecto: ['had gevoeld', 'had gevoeld', 'had gevoeld', 'hadden gevoeld', 'hadden gevoeld', 'hadden gevoeld']
    }
  },
  {
    id: 99, infinitive: 'traer', dutch: 'brengen, meenemen', group: 'onregelmatig',
    conjugations: {
      presente: ['traigo', 'traes', 'trae', 'traemos', 'traéis', 'traen'],
      futuro: ['traeré', 'traerás', 'traerá', 'traeremos', 'traeréis', 'traerán'],
      imperfecto: ['traía', 'traías', 'traía', 'traíamos', 'traíais', 'traían'],
      indefinido: ['traje', 'trajiste', 'trajo', 'trajimos', 'trajisteis', 'trajeron'],
      gebiedende_wijs: [null, 'trae', 'traiga', 'traigamos', 'traed', 'traigan']
    },
    herkennen: {
      perfecto: ['he traído', 'has traído', 'ha traído', 'hemos traído', 'habéis traído', 'han traído'],
      condicional: ['traería', 'traerías', 'traería', 'traeríamos', 'traeríais', 'traerían'],
      subjuntivo: ['traiga', 'traigas', 'traiga', 'traigamos', 'traigáis', 'traigan'],
      continuo: ['estoy trayendo', 'estás trayendo', 'está trayendo', 'estamos trayendo', 'estáis trayendo', 'están trayendo'],
      pluscuamperfecto: ['había traído', 'habías traído', 'había traído', 'habíamos traído', 'habíais traído', 'habían traído']
    },
    herkennenNl: {
      perfecto: ['heb gebracht', 'hebt gebracht', 'heeft gebracht', 'hebben gebracht', 'hebben gebracht', 'hebben gebracht'],
      condicional: ['zou brengen', 'zou brengen', 'zou brengen', 'zouden brengen', 'zouden brengen', 'zouden brengen'],
      subjuntivo: ['breng', 'brengt', 'brengt', 'brengen', 'brengen', 'brengen'],
      continuo: ['ben aan het brengen', 'bent aan het brengen', 'is aan het brengen', 'zijn aan het brengen', 'zijn aan het brengen', 'zijn aan het brengen'],
      pluscuamperfecto: ['had gebracht', 'had gebracht', 'had gebracht', 'hadden gebracht', 'hadden gebracht', 'hadden gebracht']
    }
  },
  {
    id: 100, infinitive: 'conducir', dutch: 'rijden, besturen', group: 'onregelmatig',
    conjugations: {
      presente: ['conduzco', 'conduces', 'conduce', 'conducimos', 'conducís', 'conducen'],
      futuro: ['conduciré', 'conducirás', 'conducirá', 'conduciremos', 'conduciréis', 'conducirán'],
      imperfecto: ['conducía', 'conducías', 'conducía', 'conducíamos', 'conducíais', 'conducían'],
      indefinido: ['conduje', 'condujiste', 'condujo', 'condujimos', 'condujisteis', 'condujeron'],
      gebiedende_wijs: [null, 'conduce', 'conduzca', 'conduzcamos', 'conducid', 'conduzcan']
    },
    herkennen: {
      perfecto: ['he conducido', 'has conducido', 'ha conducido', 'hemos conducido', 'habéis conducido', 'han conducido'],
      condicional: ['conduciría', 'conducirías', 'conduciría', 'conduciríamos', 'conduciríais', 'conducirían'],
      subjuntivo: ['conduzca', 'conduzcas', 'conduzca', 'conduzcamos', 'conduzcáis', 'conduzcan'],
      continuo: ['estoy conduciendo', 'estás conduciendo', 'está conduciendo', 'estamos conduciendo', 'estáis conduciendo', 'están conduciendo'],
      pluscuamperfecto: ['había conducido', 'habías conducido', 'había conducido', 'habíamos conducido', 'habíais conducido', 'habían conducido']
    },
    herkennenNl: {
      perfecto: ['heb gereden', 'hebt gereden', 'heeft gereden', 'hebben gereden', 'hebben gereden', 'hebben gereden'],
      condicional: ['zou rijden', 'zou rijden', 'zou rijden', 'zouden rijden', 'zouden rijden', 'zouden rijden'],
      subjuntivo: ['rijd', 'rijdt', 'rijdt', 'rijden', 'rijden', 'rijden'],
      continuo: ['ben aan het rijden', 'bent aan het rijden', 'is aan het rijden', 'zijn aan het rijden', 'zijn aan het rijden', 'zijn aan het rijden'],
      pluscuamperfecto: ['had gereden', 'had gereden', 'had gereden', 'hadden gereden', 'hadden gereden', 'hadden gereden']
    }
  }
];
