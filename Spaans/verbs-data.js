// ── Werkwoordendata: handmatig samengesteld (geen Excel-bron) ───────────────
// Persoonvolgorde is altijd: yo, tú, él/ella/usted, nosotros, vosotros, ellos/ellas/ustedes
const SPAANS_PERSONEN = ['yo', 'tú', 'él/ella/usted', 'nosotros', 'vosotros', 'ellos/ellas/ustedes'];

const SPAANS_TIJDEN = {
  presente: { label: 'Presente', sub: 'tegenwoordige tijd' },
  futuro: { label: 'Futuro', sub: 'toekomende tijd' },
  imperfecto: { label: 'Imperfecto', sub: 'onvoltooid verleden tijd' },
  indefinido: { label: 'Indefinido', sub: 'voltooid verleden tijd' }
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
      indefinido: ['hablé', 'hablaste', 'habló', 'hablamos', 'hablasteis', 'hablaron']
    }
  },
  {
    id: 2, infinitive: 'trabajar', dutch: 'werken', group: 'ar-regelmatig',
    conjugations: {
      presente: ['trabajo', 'trabajas', 'trabaja', 'trabajamos', 'trabajáis', 'trabajan'],
      futuro: ['trabajaré', 'trabajarás', 'trabajará', 'trabajaremos', 'trabajaréis', 'trabajarán'],
      imperfecto: ['trabajaba', 'trabajabas', 'trabajaba', 'trabajábamos', 'trabajabais', 'trabajaban'],
      indefinido: ['trabajé', 'trabajaste', 'trabajó', 'trabajamos', 'trabajasteis', 'trabajaron']
    }
  },
  {
    id: 3, infinitive: 'estudiar', dutch: 'studeren', group: 'ar-regelmatig',
    conjugations: {
      presente: ['estudio', 'estudias', 'estudia', 'estudiamos', 'estudiáis', 'estudian'],
      futuro: ['estudiaré', 'estudiarás', 'estudiará', 'estudiaremos', 'estudiaréis', 'estudiarán'],
      imperfecto: ['estudiaba', 'estudiabas', 'estudiaba', 'estudiábamos', 'estudiabais', 'estudiaban'],
      indefinido: ['estudié', 'estudiaste', 'estudió', 'estudiamos', 'estudiasteis', 'estudiaron']
    }
  },
  {
    id: 4, infinitive: 'comprar', dutch: 'kopen', group: 'ar-regelmatig',
    conjugations: {
      presente: ['compro', 'compras', 'compra', 'compramos', 'compráis', 'compran'],
      futuro: ['compraré', 'comprarás', 'comprará', 'compraremos', 'compraréis', 'comprarán'],
      imperfecto: ['compraba', 'comprabas', 'compraba', 'comprábamos', 'comprabais', 'compraban'],
      indefinido: ['compré', 'compraste', 'compró', 'compramos', 'comprasteis', 'compraron']
    }
  },
  {
    id: 5, infinitive: 'escuchar', dutch: 'luisteren', group: 'ar-regelmatig',
    conjugations: {
      presente: ['escucho', 'escuchas', 'escucha', 'escuchamos', 'escucháis', 'escuchan'],
      futuro: ['escucharé', 'escucharás', 'escuchará', 'escucharemos', 'escucharéis', 'escucharán'],
      imperfecto: ['escuchaba', 'escuchabas', 'escuchaba', 'escuchábamos', 'escuchabais', 'escuchaban'],
      indefinido: ['escuché', 'escuchaste', 'escuchó', 'escuchamos', 'escuchasteis', 'escucharon']
    }
  },
  {
    id: 6, infinitive: 'mirar', dutch: 'kijken', group: 'ar-regelmatig',
    conjugations: {
      presente: ['miro', 'miras', 'mira', 'miramos', 'miráis', 'miran'],
      futuro: ['miraré', 'mirarás', 'mirará', 'miraremos', 'miraréis', 'mirarán'],
      imperfecto: ['miraba', 'mirabas', 'miraba', 'mirábamos', 'mirabais', 'miraban'],
      indefinido: ['miré', 'miraste', 'miró', 'miramos', 'mirasteis', 'miraron']
    }
  },
  {
    id: 7, infinitive: 'necesitar', dutch: 'nodig hebben', group: 'ar-regelmatig',
    conjugations: {
      presente: ['necesito', 'necesitas', 'necesita', 'necesitamos', 'necesitáis', 'necesitan'],
      futuro: ['necesitaré', 'necesitarás', 'necesitará', 'necesitaremos', 'necesitaréis', 'necesitarán'],
      imperfecto: ['necesitaba', 'necesitabas', 'necesitaba', 'necesitábamos', 'necesitabais', 'necesitaban'],
      indefinido: ['necesité', 'necesitaste', 'necesitó', 'necesitamos', 'necesitasteis', 'necesitaron']
    }
  },
  {
    id: 8, infinitive: 'llegar', dutch: 'aankomen', group: 'ar-regelmatig',
    conjugations: {
      presente: ['llego', 'llegas', 'llega', 'llegamos', 'llegáis', 'llegan'],
      futuro: ['llegaré', 'llegarás', 'llegará', 'llegaremos', 'llegaréis', 'llegarán'],
      imperfecto: ['llegaba', 'llegabas', 'llegaba', 'llegábamos', 'llegabais', 'llegaban'],
      indefinido: ['llegué', 'llegaste', 'llegó', 'llegamos', 'llegasteis', 'llegaron']
    }
  },

  // ── Regelmatige -er werkwoorden ──
  {
    id: 9, infinitive: 'comer', dutch: 'eten', group: 'er-regelmatig',
    conjugations: {
      presente: ['como', 'comes', 'come', 'comemos', 'coméis', 'comen'],
      futuro: ['comeré', 'comerás', 'comerá', 'comeremos', 'comeréis', 'comerán'],
      imperfecto: ['comía', 'comías', 'comía', 'comíamos', 'comíais', 'comían'],
      indefinido: ['comí', 'comiste', 'comió', 'comimos', 'comisteis', 'comieron']
    }
  },
  {
    id: 10, infinitive: 'beber', dutch: 'drinken', group: 'er-regelmatig',
    conjugations: {
      presente: ['bebo', 'bebes', 'bebe', 'bebemos', 'bebéis', 'beben'],
      futuro: ['beberé', 'beberás', 'beberá', 'beberemos', 'beberéis', 'beberán'],
      imperfecto: ['bebía', 'bebías', 'bebía', 'bebíamos', 'bebíais', 'bebían'],
      indefinido: ['bebí', 'bebiste', 'bebió', 'bebimos', 'bebisteis', 'bebieron']
    }
  },
  {
    id: 11, infinitive: 'aprender', dutch: 'leren', group: 'er-regelmatig',
    conjugations: {
      presente: ['aprendo', 'aprendes', 'aprende', 'aprendemos', 'aprendéis', 'aprenden'],
      futuro: ['aprenderé', 'aprenderás', 'aprenderá', 'aprenderemos', 'aprenderéis', 'aprenderán'],
      imperfecto: ['aprendía', 'aprendías', 'aprendía', 'aprendíamos', 'aprendíais', 'aprendían'],
      indefinido: ['aprendí', 'aprendiste', 'aprendió', 'aprendimos', 'aprendisteis', 'aprendieron']
    }
  },
  {
    id: 12, infinitive: 'correr', dutch: 'rennen', group: 'er-regelmatig',
    conjugations: {
      presente: ['corro', 'corres', 'corre', 'corremos', 'corréis', 'corren'],
      futuro: ['correré', 'correrás', 'correrá', 'correremos', 'correréis', 'correrán'],
      imperfecto: ['corría', 'corrías', 'corría', 'corríamos', 'corríais', 'corrían'],
      indefinido: ['corrí', 'corriste', 'corrió', 'corrimos', 'corristeis', 'corrieron']
    }
  },
  {
    id: 13, infinitive: 'comprender', dutch: 'begrijpen', group: 'er-regelmatig',
    conjugations: {
      presente: ['comprendo', 'comprendes', 'comprende', 'comprendemos', 'comprendéis', 'comprenden'],
      futuro: ['comprenderé', 'comprenderás', 'comprenderá', 'comprenderemos', 'comprenderéis', 'comprenderán'],
      imperfecto: ['comprendía', 'comprendías', 'comprendía', 'comprendíamos', 'comprendíais', 'comprendían'],
      indefinido: ['comprendí', 'comprendiste', 'comprendió', 'comprendimos', 'comprendisteis', 'comprendieron']
    }
  },
  {
    id: 14, infinitive: 'vender', dutch: 'verkopen', group: 'er-regelmatig',
    conjugations: {
      presente: ['vendo', 'vendes', 'vende', 'vendemos', 'vendéis', 'venden'],
      futuro: ['venderé', 'venderás', 'venderá', 'venderemos', 'venderéis', 'venderán'],
      imperfecto: ['vendía', 'vendías', 'vendía', 'vendíamos', 'vendíais', 'vendían'],
      indefinido: ['vendí', 'vendiste', 'vendió', 'vendimos', 'vendisteis', 'vendieron']
    }
  },

  // ── Regelmatige -ir werkwoorden ──
  {
    id: 15, infinitive: 'vivir', dutch: 'leven, wonen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['vivo', 'vives', 'vive', 'vivimos', 'vivís', 'viven'],
      futuro: ['viviré', 'vivirás', 'vivirá', 'viviremos', 'viviréis', 'vivirán'],
      imperfecto: ['vivía', 'vivías', 'vivía', 'vivíamos', 'vivíais', 'vivían'],
      indefinido: ['viví', 'viviste', 'vivió', 'vivimos', 'vivisteis', 'vivieron']
    }
  },
  {
    id: 16, infinitive: 'escribir', dutch: 'schrijven', group: 'ir-regelmatig',
    conjugations: {
      presente: ['escribo', 'escribes', 'escribe', 'escribimos', 'escribís', 'escriben'],
      futuro: ['escribiré', 'escribirás', 'escribirá', 'escribiremos', 'escribiréis', 'escribirán'],
      imperfecto: ['escribía', 'escribías', 'escribía', 'escribíamos', 'escribíais', 'escribían'],
      indefinido: ['escribí', 'escribiste', 'escribió', 'escribimos', 'escribisteis', 'escribieron']
    }
  },
  {
    id: 17, infinitive: 'abrir', dutch: 'openen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['abro', 'abres', 'abre', 'abrimos', 'abrís', 'abren'],
      futuro: ['abriré', 'abrirás', 'abrirá', 'abriremos', 'abriréis', 'abrirán'],
      imperfecto: ['abría', 'abrías', 'abría', 'abríamos', 'abríais', 'abrían'],
      indefinido: ['abrí', 'abriste', 'abrió', 'abrimos', 'abristeis', 'abrieron']
    }
  },
  {
    id: 18, infinitive: 'decidir', dutch: 'beslissen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['decido', 'decides', 'decide', 'decidimos', 'decidís', 'deciden'],
      futuro: ['decidiré', 'decidirás', 'decidirá', 'decidiremos', 'decidiréis', 'decidirán'],
      imperfecto: ['decidía', 'decidías', 'decidía', 'decidíamos', 'decidíais', 'decidían'],
      indefinido: ['decidí', 'decidiste', 'decidió', 'decidimos', 'decidisteis', 'decidieron']
    }
  },
  {
    id: 19, infinitive: 'compartir', dutch: 'delen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['comparto', 'compartes', 'comparte', 'compartimos', 'compartís', 'comparten'],
      futuro: ['compartiré', 'compartirás', 'compartirá', 'compartiremos', 'compartiréis', 'compartirán'],
      imperfecto: ['compartía', 'compartías', 'compartía', 'compartíamos', 'compartíais', 'compartían'],
      indefinido: ['compartí', 'compartiste', 'compartió', 'compartimos', 'compartisteis', 'compartieron']
    }
  },
  {
    id: 20, infinitive: 'recibir', dutch: 'ontvangen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['recibo', 'recibes', 'recibe', 'recibimos', 'recibís', 'reciben'],
      futuro: ['recibiré', 'recibirás', 'recibirá', 'recibiremos', 'recibiréis', 'recibirán'],
      imperfecto: ['recibía', 'recibías', 'recibía', 'recibíamos', 'recibíais', 'recibían'],
      indefinido: ['recibí', 'recibiste', 'recibió', 'recibimos', 'recibisteis', 'recibieron']
    }
  },

  // ── Onregelmatige werkwoorden (belangrijkste) ──
  {
    id: 21, infinitive: 'ser', dutch: 'zijn (identiteit)', group: 'onregelmatig',
    conjugations: {
      presente: ['soy', 'eres', 'es', 'somos', 'sois', 'son'],
      futuro: ['seré', 'serás', 'será', 'seremos', 'seréis', 'serán'],
      imperfecto: ['era', 'eras', 'era', 'éramos', 'erais', 'eran'],
      indefinido: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron']
    }
  },
  {
    id: 22, infinitive: 'estar', dutch: 'zijn (toestand/plaats)', group: 'onregelmatig',
    conjugations: {
      presente: ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'],
      futuro: ['estaré', 'estarás', 'estará', 'estaremos', 'estaréis', 'estarán'],
      imperfecto: ['estaba', 'estabas', 'estaba', 'estábamos', 'estabais', 'estaban'],
      indefinido: ['estuve', 'estuviste', 'estuvo', 'estuvimos', 'estuvisteis', 'estuvieron']
    }
  },
  {
    id: 23, infinitive: 'ir', dutch: 'gaan', group: 'onregelmatig',
    conjugations: {
      presente: ['voy', 'vas', 'va', 'vamos', 'vais', 'van'],
      futuro: ['iré', 'irás', 'irá', 'iremos', 'iréis', 'irán'],
      imperfecto: ['iba', 'ibas', 'iba', 'íbamos', 'ibais', 'iban'],
      indefinido: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron']
    }
  },
  {
    id: 24, infinitive: 'tener', dutch: 'hebben', group: 'onregelmatig',
    conjugations: {
      presente: ['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen'],
      futuro: ['tendré', 'tendrás', 'tendrá', 'tendremos', 'tendréis', 'tendrán'],
      imperfecto: ['tenía', 'tenías', 'tenía', 'teníamos', 'teníais', 'tenían'],
      indefinido: ['tuve', 'tuviste', 'tuvo', 'tuvimos', 'tuvisteis', 'tuvieron']
    }
  },
  {
    id: 25, infinitive: 'hacer', dutch: 'doen, maken', group: 'onregelmatig',
    conjugations: {
      presente: ['hago', 'haces', 'hace', 'hacemos', 'hacéis', 'hacen'],
      futuro: ['haré', 'harás', 'hará', 'haremos', 'haréis', 'harán'],
      imperfecto: ['hacía', 'hacías', 'hacía', 'hacíamos', 'hacíais', 'hacían'],
      indefinido: ['hice', 'hiciste', 'hizo', 'hicimos', 'hicisteis', 'hicieron']
    }
  },
  {
    id: 26, infinitive: 'poder', dutch: 'kunnen', group: 'onregelmatig',
    conjugations: {
      presente: ['puedo', 'puedes', 'puede', 'podemos', 'podéis', 'pueden'],
      futuro: ['podré', 'podrás', 'podrá', 'podremos', 'podréis', 'podrán'],
      imperfecto: ['podía', 'podías', 'podía', 'podíamos', 'podíais', 'podían'],
      indefinido: ['pude', 'pudiste', 'pudo', 'pudimos', 'pudisteis', 'pudieron']
    }
  },
  {
    id: 27, infinitive: 'decir', dutch: 'zeggen', group: 'onregelmatig',
    conjugations: {
      presente: ['digo', 'dices', 'dice', 'decimos', 'decís', 'dicen'],
      futuro: ['diré', 'dirás', 'dirá', 'diremos', 'diréis', 'dirán'],
      imperfecto: ['decía', 'decías', 'decía', 'decíamos', 'decíais', 'decían'],
      indefinido: ['dije', 'dijiste', 'dijo', 'dijimos', 'dijisteis', 'dijeron']
    }
  },
  {
    id: 28, infinitive: 'querer', dutch: 'willen, houden van', group: 'onregelmatig',
    conjugations: {
      presente: ['quiero', 'quieres', 'quiere', 'queremos', 'queréis', 'quieren'],
      futuro: ['querré', 'querrás', 'querrá', 'querremos', 'querréis', 'querrán'],
      imperfecto: ['quería', 'querías', 'quería', 'queríamos', 'queríais', 'querían'],
      indefinido: ['quise', 'quisiste', 'quiso', 'quisimos', 'quisisteis', 'quisieron']
    }
  },
  {
    id: 29, infinitive: 'saber', dutch: 'weten', group: 'onregelmatig',
    conjugations: {
      presente: ['sé', 'sabes', 'sabe', 'sabemos', 'sabéis', 'saben'],
      futuro: ['sabré', 'sabrás', 'sabrá', 'sabremos', 'sabréis', 'sabrán'],
      imperfecto: ['sabía', 'sabías', 'sabía', 'sabíamos', 'sabíais', 'sabían'],
      indefinido: ['supe', 'supiste', 'supo', 'supimos', 'supisteis', 'supieron']
    }
  },
  {
    id: 30, infinitive: 'poner', dutch: 'zetten, leggen', group: 'onregelmatig',
    conjugations: {
      presente: ['pongo', 'pones', 'pone', 'ponemos', 'ponéis', 'ponen'],
      futuro: ['pondré', 'pondrás', 'pondrá', 'pondremos', 'pondréis', 'pondrán'],
      imperfecto: ['ponía', 'ponías', 'ponía', 'poníamos', 'poníais', 'ponían'],
      indefinido: ['puse', 'pusiste', 'puso', 'pusimos', 'pusisteis', 'pusieron']
    }
  },
  {
    id: 31, infinitive: 'venir', dutch: 'komen', group: 'onregelmatig',
    conjugations: {
      presente: ['vengo', 'vienes', 'viene', 'venimos', 'venís', 'vienen'],
      futuro: ['vendré', 'vendrás', 'vendrá', 'vendremos', 'vendréis', 'vendrán'],
      imperfecto: ['venía', 'venías', 'venía', 'veníamos', 'veníais', 'venían'],
      indefinido: ['vine', 'viniste', 'vino', 'vinimos', 'vinisteis', 'vinieron']
    }
  },
  {
    id: 32, infinitive: 'salir', dutch: 'weggaan, uitgaan', group: 'onregelmatig',
    conjugations: {
      presente: ['salgo', 'sales', 'sale', 'salimos', 'salís', 'salen'],
      futuro: ['saldré', 'saldrás', 'saldrá', 'saldremos', 'saldréis', 'saldrán'],
      imperfecto: ['salía', 'salías', 'salía', 'salíamos', 'salíais', 'salían'],
      indefinido: ['salí', 'saliste', 'salió', 'salimos', 'salisteis', 'salieron']
    }
  },
  {
    id: 33, infinitive: 'dar', dutch: 'geven', group: 'onregelmatig',
    conjugations: {
      presente: ['doy', 'das', 'da', 'damos', 'dais', 'dan'],
      futuro: ['daré', 'darás', 'dará', 'daremos', 'daréis', 'darán'],
      imperfecto: ['daba', 'dabas', 'daba', 'dábamos', 'dabais', 'daban'],
      indefinido: ['di', 'diste', 'dio', 'dimos', 'disteis', 'dieron']
    }
  },
  {
    id: 34, infinitive: 'ver', dutch: 'zien', group: 'onregelmatig',
    conjugations: {
      presente: ['veo', 'ves', 've', 'vemos', 'veis', 'ven'],
      futuro: ['veré', 'verás', 'verá', 'veremos', 'veréis', 'verán'],
      imperfecto: ['veía', 'veías', 'veía', 'veíamos', 'veíais', 'veían'],
      indefinido: ['vi', 'viste', 'vio', 'vimos', 'visteis', 'vieron']
    }
  },
  {
    id: 35, infinitive: 'jugar', dutch: 'spelen', group: 'onregelmatig',
    conjugations: {
      presente: ['juego', 'juegas', 'juega', 'jugamos', 'jugáis', 'juegan'],
      futuro: ['jugaré', 'jugarás', 'jugará', 'jugaremos', 'jugaréis', 'jugarán'],
      imperfecto: ['jugaba', 'jugabas', 'jugaba', 'jugábamos', 'jugabais', 'jugaban'],
      indefinido: ['jugué', 'jugaste', 'jugó', 'jugamos', 'jugasteis', 'jugaron']
    }
  },
  {
    id: 36, infinitive: 'pedir', dutch: 'vragen om', group: 'onregelmatig',
    conjugations: {
      presente: ['pido', 'pides', 'pide', 'pedimos', 'pedís', 'piden'],
      futuro: ['pediré', 'pedirás', 'pedirá', 'pediremos', 'pediréis', 'pedirán'],
      imperfecto: ['pedía', 'pedías', 'pedía', 'pedíamos', 'pedíais', 'pedían'],
      indefinido: ['pedí', 'pediste', 'pidió', 'pedimos', 'pedisteis', 'pidieron']
    }
  },
  {
    id: 37, infinitive: 'dormir', dutch: 'slapen', group: 'onregelmatig',
    conjugations: {
      presente: ['duermo', 'duermes', 'duerme', 'dormimos', 'dormís', 'duermen'],
      futuro: ['dormiré', 'dormirás', 'dormirá', 'dormiremos', 'dormiréis', 'dormirán'],
      imperfecto: ['dormía', 'dormías', 'dormía', 'dormíamos', 'dormíais', 'dormían'],
      indefinido: ['dormí', 'dormiste', 'durmió', 'dormimos', 'dormisteis', 'durmieron']
    }
  },
  {
    id: 38, infinitive: 'pensar', dutch: 'denken', group: 'onregelmatig',
    conjugations: {
      presente: ['pienso', 'piensas', 'piensa', 'pensamos', 'pensáis', 'piensan'],
      futuro: ['pensaré', 'pensarás', 'pensará', 'pensaremos', 'pensaréis', 'pensarán'],
      imperfecto: ['pensaba', 'pensabas', 'pensaba', 'pensábamos', 'pensabais', 'pensaban'],
      indefinido: ['pensé', 'pensaste', 'pensó', 'pensamos', 'pensasteis', 'pensaron']
    }
  },
  {
    id: 39, infinitive: 'volver', dutch: 'terugkeren', group: 'onregelmatig',
    conjugations: {
      presente: ['vuelvo', 'vuelves', 'vuelve', 'volvemos', 'volvéis', 'vuelven'],
      futuro: ['volveré', 'volverás', 'volverá', 'volveremos', 'volveréis', 'volverán'],
      imperfecto: ['volvía', 'volvías', 'volvía', 'volvíamos', 'volvíais', 'volvían'],
      indefinido: ['volví', 'volviste', 'volvió', 'volvimos', 'volvisteis', 'volvieron']
    }
  },
  {
    id: 40, infinitive: 'empezar', dutch: 'beginnen', group: 'onregelmatig',
    conjugations: {
      presente: ['empiezo', 'empiezas', 'empieza', 'empezamos', 'empezáis', 'empiezan'],
      futuro: ['empezaré', 'empezarás', 'empezará', 'empezaremos', 'empezaréis', 'empezarán'],
      imperfecto: ['empezaba', 'empezabas', 'empezaba', 'empezábamos', 'empezabais', 'empezaban'],
      indefinido: ['empecé', 'empezaste', 'empezó', 'empezamos', 'empezasteis', 'empezaron']
    }
  },

  // ── Extra regelmatige -ar werkwoorden ──
  {
    id: 41, infinitive: 'tomar', dutch: 'nemen, drinken', group: 'ar-regelmatig',
    conjugations: {
      presente: ['tomo', 'tomas', 'toma', 'tomamos', 'tomáis', 'toman'],
      futuro: ['tomaré', 'tomarás', 'tomará', 'tomaremos', 'tomaréis', 'tomarán'],
      imperfecto: ['tomaba', 'tomabas', 'tomaba', 'tomábamos', 'tomabais', 'tomaban'],
      indefinido: ['tomé', 'tomaste', 'tomó', 'tomamos', 'tomasteis', 'tomaron']
    }
  },
  {
    id: 42, infinitive: 'llamar', dutch: 'noemen, bellen', group: 'ar-regelmatig',
    conjugations: {
      presente: ['llamo', 'llamas', 'llama', 'llamamos', 'llamáis', 'llaman'],
      futuro: ['llamaré', 'llamarás', 'llamará', 'llamaremos', 'llamaréis', 'llamarán'],
      imperfecto: ['llamaba', 'llamabas', 'llamaba', 'llamábamos', 'llamabais', 'llamaban'],
      indefinido: ['llamé', 'llamaste', 'llamó', 'llamamos', 'llamasteis', 'llamaron']
    }
  },
  {
    id: 43, infinitive: 'ayudar', dutch: 'helpen', group: 'ar-regelmatig',
    conjugations: {
      presente: ['ayudo', 'ayudas', 'ayuda', 'ayudamos', 'ayudáis', 'ayudan'],
      futuro: ['ayudaré', 'ayudarás', 'ayudará', 'ayudaremos', 'ayudaréis', 'ayudarán'],
      imperfecto: ['ayudaba', 'ayudabas', 'ayudaba', 'ayudábamos', 'ayudabais', 'ayudaban'],
      indefinido: ['ayudé', 'ayudaste', 'ayudó', 'ayudamos', 'ayudasteis', 'ayudaron']
    }
  },

  // ── Extra regelmatige -er werkwoorden ──
  {
    id: 44, infinitive: 'romper', dutch: 'breken', group: 'er-regelmatig',
    conjugations: {
      presente: ['rompo', 'rompes', 'rompe', 'rompemos', 'rompéis', 'rompen'],
      futuro: ['romperé', 'romperás', 'romperá', 'romperemos', 'romperéis', 'romperán'],
      imperfecto: ['rompía', 'rompías', 'rompía', 'rompíamos', 'rompíais', 'rompían'],
      indefinido: ['rompí', 'rompiste', 'rompió', 'rompimos', 'rompisteis', 'rompieron']
    }
  },
  {
    id: 45, infinitive: 'meter', dutch: 'erin stoppen', group: 'er-regelmatig',
    conjugations: {
      presente: ['meto', 'metes', 'mete', 'metemos', 'metéis', 'meten'],
      futuro: ['meteré', 'meterás', 'meterá', 'meteremos', 'meteréis', 'meterán'],
      imperfecto: ['metía', 'metías', 'metía', 'metíamos', 'metíais', 'metían'],
      indefinido: ['metí', 'metiste', 'metió', 'metimos', 'metisteis', 'metieron']
    }
  },
  {
    id: 46, infinitive: 'responder', dutch: 'antwoorden', group: 'er-regelmatig',
    conjugations: {
      presente: ['respondo', 'respondes', 'responde', 'respondemos', 'respondéis', 'responden'],
      futuro: ['responderé', 'responderás', 'responderá', 'responderemos', 'responderéis', 'responderán'],
      imperfecto: ['respondía', 'respondías', 'respondía', 'respondíamos', 'respondíais', 'respondían'],
      indefinido: ['respondí', 'respondiste', 'respondió', 'respondimos', 'respondisteis', 'respondieron']
    }
  },

  // ── Extra regelmatige -ir werkwoorden ──
  {
    id: 47, infinitive: 'subir', dutch: 'omhoog gaan, instappen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['subo', 'subes', 'sube', 'subimos', 'subís', 'suben'],
      futuro: ['subiré', 'subirás', 'subirá', 'subiremos', 'subiréis', 'subirán'],
      imperfecto: ['subía', 'subías', 'subía', 'subíamos', 'subíais', 'subían'],
      indefinido: ['subí', 'subiste', 'subió', 'subimos', 'subisteis', 'subieron']
    }
  },
  {
    id: 48, infinitive: 'permitir', dutch: 'toestaan', group: 'ir-regelmatig',
    conjugations: {
      presente: ['permito', 'permites', 'permite', 'permitimos', 'permitís', 'permiten'],
      futuro: ['permitiré', 'permitirás', 'permitirá', 'permitiremos', 'permitiréis', 'permitirán'],
      imperfecto: ['permitía', 'permitías', 'permitía', 'permitíamos', 'permitíais', 'permitían'],
      indefinido: ['permití', 'permitiste', 'permitió', 'permitimos', 'permitisteis', 'permitieron']
    }
  },
  {
    id: 49, infinitive: 'asistir', dutch: 'aanwezig zijn, bijwonen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['asisto', 'asistes', 'asiste', 'asistimos', 'asistís', 'asisten'],
      futuro: ['asistiré', 'asistirás', 'asistirá', 'asistiremos', 'asistiréis', 'asistirán'],
      imperfecto: ['asistía', 'asistías', 'asistía', 'asistíamos', 'asistíais', 'asistían'],
      indefinido: ['asistí', 'asististe', 'asistió', 'asistimos', 'asististeis', 'asistieron']
    }
  },

  // ── Nog meer regelmatige -ar werkwoorden ──
  {
    id: 50, infinitive: 'viajar', dutch: 'reizen', group: 'ar-regelmatig',
    conjugations: {
      presente: ['viajo', 'viajas', 'viaja', 'viajamos', 'viajáis', 'viajan'],
      futuro: ['viajaré', 'viajarás', 'viajará', 'viajaremos', 'viajaréis', 'viajarán'],
      imperfecto: ['viajaba', 'viajabas', 'viajaba', 'viajábamos', 'viajabais', 'viajaban'],
      indefinido: ['viajé', 'viajaste', 'viajó', 'viajamos', 'viajasteis', 'viajaron']
    }
  },
  {
    id: 51, infinitive: 'bailar', dutch: 'dansen', group: 'ar-regelmatig',
    conjugations: {
      presente: ['bailo', 'bailas', 'baila', 'bailamos', 'bailáis', 'bailan'],
      futuro: ['bailaré', 'bailarás', 'bailará', 'bailaremos', 'bailaréis', 'bailarán'],
      imperfecto: ['bailaba', 'bailabas', 'bailaba', 'bailábamos', 'bailabais', 'bailaban'],
      indefinido: ['bailé', 'bailaste', 'bailó', 'bailamos', 'bailasteis', 'bailaron']
    }
  },
  {
    id: 52, infinitive: 'cocinar', dutch: 'koken', group: 'ar-regelmatig',
    conjugations: {
      presente: ['cocino', 'cocinas', 'cocina', 'cocinamos', 'cocináis', 'cocinan'],
      futuro: ['cocinaré', 'cocinarás', 'cocinará', 'cocinaremos', 'cocinaréis', 'cocinarán'],
      imperfecto: ['cocinaba', 'cocinabas', 'cocinaba', 'cocinábamos', 'cocinabais', 'cocinaban'],
      indefinido: ['cociné', 'cocinaste', 'cocinó', 'cocinamos', 'cocinasteis', 'cocinaron']
    }
  },
  {
    id: 53, infinitive: 'limpiar', dutch: 'schoonmaken', group: 'ar-regelmatig',
    conjugations: {
      presente: ['limpio', 'limpias', 'limpia', 'limpiamos', 'limpiáis', 'limpian'],
      futuro: ['limpiaré', 'limpiarás', 'limpiará', 'limpiaremos', 'limpiaréis', 'limpiarán'],
      imperfecto: ['limpiaba', 'limpiabas', 'limpiaba', 'limpiábamos', 'limpiabais', 'limpiaban'],
      indefinido: ['limpié', 'limpiaste', 'limpió', 'limpiamos', 'limpiasteis', 'limpiaron']
    }
  },
  {
    id: 54, infinitive: 'lavar', dutch: 'wassen', group: 'ar-regelmatig',
    conjugations: {
      presente: ['lavo', 'lavas', 'lava', 'lavamos', 'laváis', 'lavan'],
      futuro: ['lavaré', 'lavarás', 'lavará', 'lavaremos', 'lavaréis', 'lavarán'],
      imperfecto: ['lavaba', 'lavabas', 'lavaba', 'lavábamos', 'lavabais', 'lavaban'],
      indefinido: ['lavé', 'lavaste', 'lavó', 'lavamos', 'lavasteis', 'lavaron']
    }
  },
  {
    id: 55, infinitive: 'pintar', dutch: 'schilderen, verven', group: 'ar-regelmatig',
    conjugations: {
      presente: ['pinto', 'pintas', 'pinta', 'pintamos', 'pintáis', 'pintan'],
      futuro: ['pintaré', 'pintarás', 'pintará', 'pintaremos', 'pintaréis', 'pintarán'],
      imperfecto: ['pintaba', 'pintabas', 'pintaba', 'pintábamos', 'pintabais', 'pintaban'],
      indefinido: ['pinté', 'pintaste', 'pintó', 'pintamos', 'pintasteis', 'pintaron']
    }
  },
  {
    id: 56, infinitive: 'cantar', dutch: 'zingen', group: 'ar-regelmatig',
    conjugations: {
      presente: ['canto', 'cantas', 'canta', 'cantamos', 'cantáis', 'cantan'],
      futuro: ['cantaré', 'cantarás', 'cantará', 'cantaremos', 'cantaréis', 'cantarán'],
      imperfecto: ['cantaba', 'cantabas', 'cantaba', 'cantábamos', 'cantabais', 'cantaban'],
      indefinido: ['canté', 'cantaste', 'cantó', 'cantamos', 'cantasteis', 'cantaron']
    }
  },
  {
    id: 57, infinitive: 'caminar', dutch: 'lopen, wandelen', group: 'ar-regelmatig',
    conjugations: {
      presente: ['camino', 'caminas', 'camina', 'caminamos', 'camináis', 'caminan'],
      futuro: ['caminaré', 'caminarás', 'caminará', 'caminaremos', 'caminaréis', 'caminarán'],
      imperfecto: ['caminaba', 'caminabas', 'caminaba', 'caminábamos', 'caminabais', 'caminaban'],
      indefinido: ['caminé', 'caminaste', 'caminó', 'caminamos', 'caminasteis', 'caminaron']
    }
  },
  {
    id: 58, infinitive: 'terminar', dutch: 'beëindigen, klaar zijn', group: 'ar-regelmatig',
    conjugations: {
      presente: ['termino', 'terminas', 'termina', 'terminamos', 'termináis', 'terminan'],
      futuro: ['terminaré', 'terminarás', 'terminará', 'terminaremos', 'terminaréis', 'terminarán'],
      imperfecto: ['terminaba', 'terminabas', 'terminaba', 'terminábamos', 'terminabais', 'terminaban'],
      indefinido: ['terminé', 'terminaste', 'terminó', 'terminamos', 'terminasteis', 'terminaron']
    }
  },
  {
    id: 59, infinitive: 'explicar', dutch: 'uitleggen', group: 'ar-regelmatig',
    conjugations: {
      presente: ['explico', 'explicas', 'explica', 'explicamos', 'explicáis', 'explican'],
      futuro: ['explicaré', 'explicarás', 'explicará', 'explicaremos', 'explicaréis', 'explicarán'],
      imperfecto: ['explicaba', 'explicabas', 'explicaba', 'explicábamos', 'explicabais', 'explicaban'],
      indefinido: ['expliqué', 'explicaste', 'explicó', 'explicamos', 'explicasteis', 'explicaron']
    }
  },
  {
    id: 60, infinitive: 'buscar', dutch: 'zoeken', group: 'ar-regelmatig',
    conjugations: {
      presente: ['busco', 'buscas', 'busca', 'buscamos', 'buscáis', 'buscan'],
      futuro: ['buscaré', 'buscarás', 'buscará', 'buscaremos', 'buscaréis', 'buscarán'],
      imperfecto: ['buscaba', 'buscabas', 'buscaba', 'buscábamos', 'buscabais', 'buscaban'],
      indefinido: ['busqué', 'buscaste', 'buscó', 'buscamos', 'buscasteis', 'buscaron']
    }
  },
  {
    id: 61, infinitive: 'pagar', dutch: 'betalen', group: 'ar-regelmatig',
    conjugations: {
      presente: ['pago', 'pagas', 'paga', 'pagamos', 'pagáis', 'pagan'],
      futuro: ['pagaré', 'pagarás', 'pagará', 'pagaremos', 'pagaréis', 'pagarán'],
      imperfecto: ['pagaba', 'pagabas', 'pagaba', 'pagábamos', 'pagabais', 'pagaban'],
      indefinido: ['pagué', 'pagaste', 'pagó', 'pagamos', 'pagasteis', 'pagaron']
    }
  },
  {
    id: 62, infinitive: 'entregar', dutch: 'afleveren, inleveren', group: 'ar-regelmatig',
    conjugations: {
      presente: ['entrego', 'entregas', 'entrega', 'entregamos', 'entregáis', 'entregan'],
      futuro: ['entregaré', 'entregarás', 'entregará', 'entregaremos', 'entregaréis', 'entregarán'],
      imperfecto: ['entregaba', 'entregabas', 'entregaba', 'entregábamos', 'entregabais', 'entregaban'],
      indefinido: ['entregué', 'entregaste', 'entregó', 'entregamos', 'entregasteis', 'entregaron']
    }
  },
  {
    id: 63, infinitive: 'organizar', dutch: 'organiseren', group: 'ar-regelmatig',
    conjugations: {
      presente: ['organizo', 'organizas', 'organiza', 'organizamos', 'organizáis', 'organizan'],
      futuro: ['organizaré', 'organizarás', 'organizará', 'organizaremos', 'organizaréis', 'organizarán'],
      imperfecto: ['organizaba', 'organizabas', 'organizaba', 'organizábamos', 'organizabais', 'organizaban'],
      indefinido: ['organicé', 'organizaste', 'organizó', 'organizamos', 'organizasteis', 'organizaron']
    }
  },

  // ── Nog meer regelmatige -er werkwoorden ──
  {
    id: 64, infinitive: 'deber', dutch: 'moeten, verschuldigd zijn', group: 'er-regelmatig',
    conjugations: {
      presente: ['debo', 'debes', 'debe', 'debemos', 'debéis', 'deben'],
      futuro: ['deberé', 'deberás', 'deberá', 'deberemos', 'deberéis', 'deberán'],
      imperfecto: ['debía', 'debías', 'debía', 'debíamos', 'debíais', 'debían'],
      indefinido: ['debí', 'debiste', 'debió', 'debimos', 'debisteis', 'debieron']
    }
  },
  {
    id: 65, infinitive: 'temer', dutch: 'vrezen, bang zijn voor', group: 'er-regelmatig',
    conjugations: {
      presente: ['temo', 'temes', 'teme', 'tememos', 'teméis', 'temen'],
      futuro: ['temeré', 'temerás', 'temerá', 'temeremos', 'temeréis', 'temerán'],
      imperfecto: ['temía', 'temías', 'temía', 'temíamos', 'temíais', 'temían'],
      indefinido: ['temí', 'temiste', 'temió', 'temimos', 'temisteis', 'temieron']
    }
  },
  {
    id: 66, infinitive: 'toser', dutch: 'hoesten', group: 'er-regelmatig',
    conjugations: {
      presente: ['toso', 'toses', 'tose', 'tosemos', 'toséis', 'tosen'],
      futuro: ['toseré', 'toserás', 'toserá', 'toseremos', 'toseréis', 'toserán'],
      imperfecto: ['tosía', 'tosías', 'tosía', 'tosíamos', 'tosíais', 'tosían'],
      indefinido: ['tosí', 'tosiste', 'tosió', 'tosimos', 'tosisteis', 'tosieron']
    }
  },
  {
    id: 67, infinitive: 'barrer', dutch: 'vegen', group: 'er-regelmatig',
    conjugations: {
      presente: ['barro', 'barres', 'barre', 'barremos', 'barréis', 'barren'],
      futuro: ['barreré', 'barrerás', 'barrerá', 'barreremos', 'barreréis', 'barrerán'],
      imperfecto: ['barría', 'barrías', 'barría', 'barríamos', 'barríais', 'barrían'],
      indefinido: ['barrí', 'barriste', 'barrió', 'barrimos', 'barristeis', 'barrieron']
    }
  },
  {
    id: 68, infinitive: 'depender', dutch: 'afhangen (van)', group: 'er-regelmatig',
    conjugations: {
      presente: ['dependo', 'dependes', 'depende', 'dependemos', 'dependéis', 'dependen'],
      futuro: ['dependeré', 'dependerás', 'dependerá', 'dependeremos', 'dependeréis', 'dependerán'],
      imperfecto: ['dependía', 'dependías', 'dependía', 'dependíamos', 'dependíais', 'dependían'],
      indefinido: ['dependí', 'dependiste', 'dependió', 'dependimos', 'dependisteis', 'dependieron']
    }
  },
  {
    id: 69, infinitive: 'suceder', dutch: 'gebeuren', group: 'er-regelmatig',
    conjugations: {
      presente: ['sucedo', 'sucedes', 'sucede', 'sucedemos', 'sucedéis', 'suceden'],
      futuro: ['sucederé', 'sucederás', 'sucederá', 'sucederemos', 'sucederéis', 'sucederán'],
      imperfecto: ['sucedía', 'sucedías', 'sucedía', 'sucedíamos', 'sucedíais', 'sucedían'],
      indefinido: ['sucedí', 'sucediste', 'sucedió', 'sucedimos', 'sucedisteis', 'sucedieron']
    }
  },
  {
    id: 70, infinitive: 'prometer', dutch: 'beloven', group: 'er-regelmatig',
    conjugations: {
      presente: ['prometo', 'prometes', 'promete', 'prometemos', 'prometéis', 'prometen'],
      futuro: ['prometeré', 'prometerás', 'prometerá', 'prometeremos', 'prometeréis', 'prometerán'],
      imperfecto: ['prometía', 'prometías', 'prometía', 'prometíamos', 'prometíais', 'prometían'],
      indefinido: ['prometí', 'prometiste', 'prometió', 'prometimos', 'prometisteis', 'prometieron']
    }
  },
  {
    id: 71, infinitive: 'sorprender', dutch: 'verrassen', group: 'er-regelmatig',
    conjugations: {
      presente: ['sorprendo', 'sorprendes', 'sorprende', 'sorprendemos', 'sorprendéis', 'sorprenden'],
      futuro: ['sorprenderé', 'sorprenderás', 'sorprenderá', 'sorprenderemos', 'sorprenderéis', 'sorprenderán'],
      imperfecto: ['sorprendía', 'sorprendías', 'sorprendía', 'sorprendíamos', 'sorprendíais', 'sorprendían'],
      indefinido: ['sorprendí', 'sorprendiste', 'sorprendió', 'sorprendimos', 'sorprendisteis', 'sorprendieron']
    }
  },
  {
    id: 72, infinitive: 'esconder', dutch: 'verstoppen', group: 'er-regelmatig',
    conjugations: {
      presente: ['escondo', 'escondes', 'esconde', 'escondemos', 'escondéis', 'esconden'],
      futuro: ['esconderé', 'esconderás', 'esconderá', 'esconderemos', 'esconderéis', 'esconderán'],
      imperfecto: ['escondía', 'escondías', 'escondía', 'escondíamos', 'escondíais', 'escondían'],
      indefinido: ['escondí', 'escondiste', 'escondió', 'escondimos', 'escondisteis', 'escondieron']
    }
  },
  {
    id: 73, infinitive: 'proceder', dutch: 'te werk gaan, voortkomen', group: 'er-regelmatig',
    conjugations: {
      presente: ['procedo', 'procedes', 'procede', 'procedemos', 'procedéis', 'proceden'],
      futuro: ['procederé', 'procederás', 'procederá', 'procederemos', 'procederéis', 'procederán'],
      imperfecto: ['procedía', 'procedías', 'procedía', 'procedíamos', 'procedíais', 'procedían'],
      indefinido: ['procedí', 'procediste', 'procedió', 'procedimos', 'procedisteis', 'procedieron']
    }
  },
  {
    id: 74, infinitive: 'ceder', dutch: 'toegeven, afstaan', group: 'er-regelmatig',
    conjugations: {
      presente: ['cedo', 'cedes', 'cede', 'cedemos', 'cedéis', 'ceden'],
      futuro: ['cederé', 'cederás', 'cederá', 'cederemos', 'cederéis', 'cederán'],
      imperfecto: ['cedía', 'cedías', 'cedía', 'cedíamos', 'cedíais', 'cedían'],
      indefinido: ['cedí', 'cediste', 'cedió', 'cedimos', 'cedisteis', 'cedieron']
    }
  },
  {
    id: 75, infinitive: 'absorber', dutch: 'opnemen, absorberen', group: 'er-regelmatig',
    conjugations: {
      presente: ['absorbo', 'absorbes', 'absorbe', 'absorbemos', 'absorbéis', 'absorben'],
      futuro: ['absorberé', 'absorberás', 'absorberá', 'absorberemos', 'absorberéis', 'absorberán'],
      imperfecto: ['absorbía', 'absorbías', 'absorbía', 'absorbíamos', 'absorbíais', 'absorbían'],
      indefinido: ['absorbí', 'absorbiste', 'absorbió', 'absorbimos', 'absorbisteis', 'absorbieron']
    }
  },
  {
    id: 76, infinitive: 'exceder', dutch: 'overschrijden', group: 'er-regelmatig',
    conjugations: {
      presente: ['excedo', 'excedes', 'excede', 'excedemos', 'excedéis', 'exceden'],
      futuro: ['excederé', 'excederás', 'excederá', 'excederemos', 'excederéis', 'excederán'],
      imperfecto: ['excedía', 'excedías', 'excedía', 'excedíamos', 'excedíais', 'excedían'],
      indefinido: ['excedí', 'excediste', 'excedió', 'excedimos', 'excedisteis', 'excedieron']
    }
  },
  {
    id: 77, infinitive: 'recorrer', dutch: 'afleggen, doorkruisen', group: 'er-regelmatig',
    conjugations: {
      presente: ['recorro', 'recorres', 'recorre', 'recorremos', 'recorréis', 'recorren'],
      futuro: ['recorreré', 'recorrerás', 'recorrerá', 'recorreremos', 'recorreréis', 'recorrerán'],
      imperfecto: ['recorría', 'recorrías', 'recorría', 'recorríamos', 'recorríais', 'recorrían'],
      indefinido: ['recorrí', 'recorriste', 'recorrió', 'recorrimos', 'recorristeis', 'recorrieron']
    }
  },
  {
    id: 78, infinitive: 'prender', dutch: 'aanzetten, aansteken', group: 'er-regelmatig',
    conjugations: {
      presente: ['prendo', 'prendes', 'prende', 'prendemos', 'prendéis', 'prenden'],
      futuro: ['prenderé', 'prenderás', 'prenderá', 'prenderemos', 'prenderéis', 'prenderán'],
      imperfecto: ['prendía', 'prendías', 'prendía', 'prendíamos', 'prendíais', 'prendían'],
      indefinido: ['prendí', 'prendiste', 'prendió', 'prendimos', 'prendisteis', 'prendieron']
    }
  },
  {
    id: 79, infinitive: 'coser', dutch: 'naaien', group: 'er-regelmatig',
    conjugations: {
      presente: ['coso', 'coses', 'cose', 'cosemos', 'coséis', 'cosen'],
      futuro: ['coseré', 'coserás', 'coserá', 'coseremos', 'coseréis', 'coserán'],
      imperfecto: ['cosía', 'cosías', 'cosía', 'cosíamos', 'cosíais', 'cosían'],
      indefinido: ['cosí', 'cosiste', 'cosió', 'cosimos', 'cosisteis', 'cosieron']
    }
  },

  // ── Nog meer regelmatige -ir werkwoorden ──
  {
    id: 80, infinitive: 'discutir', dutch: 'discussiëren, ruziën', group: 'ir-regelmatig',
    conjugations: {
      presente: ['discuto', 'discutes', 'discute', 'discutimos', 'discutís', 'discuten'],
      futuro: ['discutiré', 'discutirás', 'discutirá', 'discutiremos', 'discutiréis', 'discutirán'],
      imperfecto: ['discutía', 'discutías', 'discutía', 'discutíamos', 'discutíais', 'discutían'],
      indefinido: ['discutí', 'discutiste', 'discutió', 'discutimos', 'discutisteis', 'discutieron']
    }
  },
  {
    id: 81, infinitive: 'insistir', dutch: 'aandringen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['insisto', 'insistes', 'insiste', 'insistimos', 'insistís', 'insisten'],
      futuro: ['insistiré', 'insistirás', 'insistirá', 'insistiremos', 'insistiréis', 'insistirán'],
      imperfecto: ['insistía', 'insistías', 'insistía', 'insistíamos', 'insistíais', 'insistían'],
      indefinido: ['insistí', 'insististe', 'insistió', 'insistimos', 'insististeis', 'insistieron']
    }
  },
  {
    id: 82, infinitive: 'existir', dutch: 'bestaan', group: 'ir-regelmatig',
    conjugations: {
      presente: ['existo', 'existes', 'existe', 'existimos', 'existís', 'existen'],
      futuro: ['existiré', 'existirás', 'existirá', 'existiremos', 'existiréis', 'existirán'],
      imperfecto: ['existía', 'existías', 'existía', 'existíamos', 'existíais', 'existían'],
      indefinido: ['existí', 'exististe', 'existió', 'existimos', 'exististeis', 'existieron']
    }
  },
  {
    id: 83, infinitive: 'resistir', dutch: 'weerstaan', group: 'ir-regelmatig',
    conjugations: {
      presente: ['resisto', 'resistes', 'resiste', 'resistimos', 'resistís', 'resisten'],
      futuro: ['resistiré', 'resistirás', 'resistirá', 'resistiremos', 'resistiréis', 'resistirán'],
      imperfecto: ['resistía', 'resistías', 'resistía', 'resistíamos', 'resistíais', 'resistían'],
      indefinido: ['resistí', 'resististe', 'resistió', 'resistimos', 'resististeis', 'resistieron']
    }
  },
  {
    id: 84, infinitive: 'persistir', dutch: 'volharden', group: 'ir-regelmatig',
    conjugations: {
      presente: ['persisto', 'persistes', 'persiste', 'persistimos', 'persistís', 'persisten'],
      futuro: ['persistiré', 'persistirás', 'persistirá', 'persistiremos', 'persistiréis', 'persistirán'],
      imperfecto: ['persistía', 'persistías', 'persistía', 'persistíamos', 'persistíais', 'persistían'],
      indefinido: ['persistí', 'persististe', 'persistió', 'persistimos', 'persististeis', 'persistieron']
    }
  },
  {
    id: 85, infinitive: 'consistir', dutch: 'bestaan uit', group: 'ir-regelmatig',
    conjugations: {
      presente: ['consisto', 'consistes', 'consiste', 'consistimos', 'consistís', 'consisten'],
      futuro: ['consistiré', 'consistirás', 'consistirá', 'consistiremos', 'consistiréis', 'consistirán'],
      imperfecto: ['consistía', 'consistías', 'consistía', 'consistíamos', 'consistíais', 'consistían'],
      indefinido: ['consistí', 'consististe', 'consistió', 'consistimos', 'consististeis', 'consistieron']
    }
  },
  {
    id: 86, infinitive: 'añadir', dutch: 'toevoegen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['añado', 'añades', 'añade', 'añadimos', 'añadís', 'añaden'],
      futuro: ['añadiré', 'añadirás', 'añadirá', 'añadiremos', 'añadiréis', 'añadirán'],
      imperfecto: ['añadía', 'añadías', 'añadía', 'añadíamos', 'añadíais', 'añadían'],
      indefinido: ['añadí', 'añadiste', 'añadió', 'añadimos', 'añadisteis', 'añadieron']
    }
  },
  {
    id: 87, infinitive: 'imprimir', dutch: 'printen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['imprimo', 'imprimes', 'imprime', 'imprimimos', 'imprimís', 'imprimen'],
      futuro: ['imprimiré', 'imprimirás', 'imprimirá', 'imprimiremos', 'imprimiréis', 'imprimirán'],
      imperfecto: ['imprimía', 'imprimías', 'imprimía', 'imprimíamos', 'imprimíais', 'imprimían'],
      indefinido: ['imprimí', 'imprimiste', 'imprimió', 'imprimimos', 'imprimisteis', 'imprimieron']
    }
  },
  {
    id: 88, infinitive: 'cumplir', dutch: 'vervullen, nakomen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['cumplo', 'cumples', 'cumple', 'cumplimos', 'cumplís', 'cumplen'],
      futuro: ['cumpliré', 'cumplirás', 'cumplirá', 'cumpliremos', 'cumpliréis', 'cumplirán'],
      imperfecto: ['cumplía', 'cumplías', 'cumplía', 'cumplíamos', 'cumplíais', 'cumplían'],
      indefinido: ['cumplí', 'cumpliste', 'cumplió', 'cumplimos', 'cumplisteis', 'cumplieron']
    }
  },
  {
    id: 89, infinitive: 'describir', dutch: 'beschrijven', group: 'ir-regelmatig',
    conjugations: {
      presente: ['describo', 'describes', 'describe', 'describimos', 'describís', 'describen'],
      futuro: ['describiré', 'describirás', 'describirá', 'describiremos', 'describiréis', 'describirán'],
      imperfecto: ['describía', 'describías', 'describía', 'describíamos', 'describíais', 'describían'],
      indefinido: ['describí', 'describiste', 'describió', 'describimos', 'describisteis', 'describieron']
    }
  },
  {
    id: 90, infinitive: 'definir', dutch: 'definiëren', group: 'ir-regelmatig',
    conjugations: {
      presente: ['defino', 'defines', 'define', 'definimos', 'definís', 'definen'],
      futuro: ['definiré', 'definirás', 'definirá', 'definiremos', 'definiréis', 'definirán'],
      imperfecto: ['definía', 'definías', 'definía', 'definíamos', 'definíais', 'definían'],
      indefinido: ['definí', 'definiste', 'definió', 'definimos', 'definisteis', 'definieron']
    }
  },
  {
    id: 91, infinitive: 'unir', dutch: 'verenigen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['uno', 'unes', 'une', 'unimos', 'unís', 'unen'],
      futuro: ['uniré', 'unirás', 'unirá', 'uniremos', 'uniréis', 'unirán'],
      imperfecto: ['unía', 'unías', 'unía', 'uníamos', 'uníais', 'unían'],
      indefinido: ['uní', 'uniste', 'unió', 'unimos', 'unisteis', 'unieron']
    }
  },
  {
    id: 92, infinitive: 'partir', dutch: 'vertrekken, verdelen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['parto', 'partes', 'parte', 'partimos', 'partís', 'parten'],
      futuro: ['partiré', 'partirás', 'partirá', 'partiremos', 'partiréis', 'partirán'],
      imperfecto: ['partía', 'partías', 'partía', 'partíamos', 'partíais', 'partían'],
      indefinido: ['partí', 'partiste', 'partió', 'partimos', 'partisteis', 'partieron']
    }
  },
  {
    id: 93, infinitive: 'sufrir', dutch: 'lijden', group: 'ir-regelmatig',
    conjugations: {
      presente: ['sufro', 'sufres', 'sufre', 'sufrimos', 'sufrís', 'sufren'],
      futuro: ['sufriré', 'sufrirás', 'sufrirá', 'sufriremos', 'sufriréis', 'sufrirán'],
      imperfecto: ['sufría', 'sufrías', 'sufría', 'sufríamos', 'sufríais', 'sufrían'],
      indefinido: ['sufrí', 'sufriste', 'sufrió', 'sufrimos', 'sufristeis', 'sufrieron']
    }
  },
  {
    id: 94, infinitive: 'cubrir', dutch: 'bedekken', group: 'ir-regelmatig',
    conjugations: {
      presente: ['cubro', 'cubres', 'cubre', 'cubrimos', 'cubrís', 'cubren'],
      futuro: ['cubriré', 'cubrirás', 'cubrirá', 'cubriremos', 'cubriréis', 'cubrirán'],
      imperfecto: ['cubría', 'cubrías', 'cubría', 'cubríamos', 'cubríais', 'cubrían'],
      indefinido: ['cubrí', 'cubriste', 'cubrió', 'cubrimos', 'cubristeis', 'cubrieron']
    }
  },
  {
    id: 95, infinitive: 'dividir', dutch: 'verdelen', group: 'ir-regelmatig',
    conjugations: {
      presente: ['divido', 'divides', 'divide', 'dividimos', 'dividís', 'dividen'],
      futuro: ['dividiré', 'dividirás', 'dividirá', 'dividiremos', 'dividiréis', 'dividirán'],
      imperfecto: ['dividía', 'dividías', 'dividía', 'dividíamos', 'dividíais', 'dividían'],
      indefinido: ['dividí', 'dividiste', 'dividió', 'dividimos', 'dividisteis', 'dividieron']
    }
  },

  // ── Nog meer onregelmatige werkwoorden ──
  {
    id: 96, infinitive: 'conocer', dutch: 'kennen', group: 'onregelmatig',
    conjugations: {
      presente: ['conozco', 'conoces', 'conoce', 'conocemos', 'conocéis', 'conocen'],
      futuro: ['conoceré', 'conocerás', 'conocerá', 'conoceremos', 'conoceréis', 'conocerán'],
      imperfecto: ['conocía', 'conocías', 'conocía', 'conocíamos', 'conocíais', 'conocían'],
      indefinido: ['conocí', 'conociste', 'conoció', 'conocimos', 'conocisteis', 'conocieron']
    }
  },
  {
    id: 97, infinitive: 'seguir', dutch: 'volgen, doorgaan', group: 'onregelmatig',
    conjugations: {
      presente: ['sigo', 'sigues', 'sigue', 'seguimos', 'seguís', 'siguen'],
      futuro: ['seguiré', 'seguirás', 'seguirá', 'seguiremos', 'seguiréis', 'seguirán'],
      imperfecto: ['seguía', 'seguías', 'seguía', 'seguíamos', 'seguíais', 'seguían'],
      indefinido: ['seguí', 'seguiste', 'siguió', 'seguimos', 'seguisteis', 'siguieron']
    }
  },
  {
    id: 98, infinitive: 'sentir', dutch: 'voelen', group: 'onregelmatig',
    conjugations: {
      presente: ['siento', 'sientes', 'siente', 'sentimos', 'sentís', 'sienten'],
      futuro: ['sentiré', 'sentirás', 'sentirá', 'sentiremos', 'sentiréis', 'sentirán'],
      imperfecto: ['sentía', 'sentías', 'sentía', 'sentíamos', 'sentíais', 'sentían'],
      indefinido: ['sentí', 'sentiste', 'sintió', 'sentimos', 'sentisteis', 'sintieron']
    }
  },
  {
    id: 99, infinitive: 'traer', dutch: 'brengen, meenemen', group: 'onregelmatig',
    conjugations: {
      presente: ['traigo', 'traes', 'trae', 'traemos', 'traéis', 'traen'],
      futuro: ['traeré', 'traerás', 'traerá', 'traeremos', 'traeréis', 'traerán'],
      imperfecto: ['traía', 'traías', 'traía', 'traíamos', 'traíais', 'traían'],
      indefinido: ['traje', 'trajiste', 'trajo', 'trajimos', 'trajisteis', 'trajeron']
    }
  },
  {
    id: 100, infinitive: 'conducir', dutch: 'rijden, besturen', group: 'onregelmatig',
    conjugations: {
      presente: ['conduzco', 'conduces', 'conduce', 'conducimos', 'conducís', 'conducen'],
      futuro: ['conduciré', 'conducirás', 'conducirá', 'conduciremos', 'conduciréis', 'conducirán'],
      imperfecto: ['conducía', 'conducías', 'conducía', 'conducíamos', 'conducíais', 'conducían'],
      indefinido: ['conduje', 'condujiste', 'condujo', 'condujimos', 'condujisteis', 'condujeron']
    }
  }
];
