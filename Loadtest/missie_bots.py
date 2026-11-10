#!/usr/bin/env python3
"""Belastingtest Missie Middelbaar: nep-groepjes doorlopen missie 1-3 (incl. Jay I)
via exact dezelfde Supabase-calls als index/overzicht/missie-1/2/3.html.

Gebruik: python3 missie_bots.py <linknummer> [tijdfactor]
  tijdfactor 1.0 = standaard ingekorte les (~5 min), 2.0 = twee keer zo lang.
Elke groep draait in een eigen thread met eigen verbindingen (zoals een eigen apparaat).
"""
import json, random, sys, threading, time, urllib.request, urllib.error

URL = 'https://cqcncausbclwvoomqdpy.supabase.co'
K = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxY25jYXVzYmNsd3Zvb21xZHB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MjE3MDYsImV4cCI6MjA5NjI5NzcwNn0.Yh-5xrjxPW36OOufxbgu8CGiemDofFQ4R59Mmeomlwo'
H = {'apikey': K, 'Authorization': 'Bearer ' + K, 'Content-Type': 'application/json'}

VAKKEN = ['Wiskunde', 'Nederlands', 'Engels', 'Frans', 'Biologie', 'Aardrijkskunde', 'Geschiedenis']
CRITERIA = ['Duidelijke uitleg', 'Veel oefeningen', 'Makkelijk zoeken', 'Mooie vormgeving', 'Direct feedback op mijn antwoorden', 'Overzichtelijke website', 'Werkt snel', 'Gratis te gebruiken']
STELLING = ['Helemaal mee eens', 'Mee eens', 'Neutraal', 'Mee oneens', 'Helemaal mee oneens']
WEBSITES = ['CambiumNed', 'Leer Snel Engels', 'Wiskunde.eu', 'Biologiepagina']
AI_GEBRUIK = ['Iets laten uitleggen', 'Een samenvatting maken', 'Oefenvragen maken', 'Mijzelf overhoren', 'Huiswerk controleren', 'Ik zou AI niet gebruiken']
HULPMIDDEL = ['Uitlegvideo', 'Oefenwebsite', 'AI', 'Je docent', 'Je boek']
JAY_VRAGEN = ['Wat was het Verdrag van Versailles?', 'Waarom kreeg Hitler zoveel steun?', 'Wat is Lebensraum?',
              'Wanneer begon de Tweede Wereldoorlog?', 'Wat gebeurde er op 10 mei 1940?', 'Wat is inflatie?',
              'Waarom verklaarden Engeland en Frankrijk de oorlog?', 'Wat deed Hitler met het Rijnland?',
              'Wat is een dictatuur?', 'Wat was de NSDAP?', 'Waarom was er zoveel werkloosheid in Duitsland?',
              'Kun je dat makkelijker uitleggen?', 'Wat betekent schadevergoeding?']

TEST_NAMEN = ['Sem','Noah','Liam','Daan','Finn','Luuk','Milan','Levi','Bram','Jesse',
  'Thomas','Lucas','Max','Thijs','Ties','Julia','Emma','Mila','Tess','Sophie',
  'Noor','Lotte','Zoë','Fleur','Sara','Anna','Nina','Evi','Liv','Lauren',
  'Yara','Saar','Fenna','Bo','Puck','Vera','Jasmijn','Lina','Esmee','Nova']

T0 = time.time()
LOCK = threading.Lock()
STATS = {'db': [], 'jay': [], 'fouten': [], 'jay_fout': 0, 'klaar': 0}


def log(tekst):
    with LOCK:
        print(f'[{time.time() - T0:6.1f}s] {tekst}', flush=True)


def call(method, pad, body=None, extra=None, timeout=30):
    h = dict(H, **(extra or {}))
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(URL + pad, data=data, headers=h, method=method)
    t = time.time()
    raw = urllib.request.urlopen(r, timeout=timeout).read()
    return (json.loads(raw) if raw else None), time.time() - t


class Groep(threading.Thread):
    def __init__(self, nr, grootte, linknr, factor, offset):
        super().__init__()
        self.nr, self.linknr, self.f = nr, linknr, factor
        self.namen = [TEST_NAMEN[(offset + i) % len(TEST_NAMEN)] for i in range(grootte)]
        self.naam = ' & '.join(self.namen)

    def db(self, waar, method, pad, body=None, extra=None):
        try:
            d, dt = call(method, pad, body, extra)
            STATS['db'].append(dt)
            return d
        except urllib.error.HTTPError as e:
            fout = f'{self.naam} – {waar}: HTTP {e.code} {e.read()[:150]}'
        except Exception as e:
            fout = f'{self.naam} – {waar}: {e}'
        STATS['fouten'].append(fout); log('FOUT ' + fout)
        return None

    def wacht(self, lo, hi):
        time.sleep(random.uniform(lo, hi) * self.f)

    def overzicht(self):
        self.db('overzicht laden', 'POST', '/rest/v1/rpc/missie_groep_lezen', {'p_id': self.id})

    def run(self):
        self.wacht(0, 20)  # namen intypen
        link = self.db('link openen', 'POST', '/rest/v1/rpc/resolve_missie_link', {'p_volgnummer': self.linknr})
        if not link:
            return log(f'{self.naam}: link niet gevonden, stopt')
        d = self.db('aanmelden', 'POST', '/rest/v1/rpc/missie_groep_aanmaken', {'p_link_id': link, 'p_namen': self.namen})
        if not d:
            return
        self.id = d
        log(f'{self.naam} ({len(self.namen)} lln) aangemeld')
        self.overzicht()

        # Missie 1
        self.wacht(30, 75)
        fouten = {f'vraag{i}': random.randint(0, 2) for i in range(1, 5)}
        fouten['totaal'] = sum(fouten.values())
        antwoorden = {'missie1': {'v1_sterren': random.randint(2, 5), 'v2_vakken': random.sample(VAKKEN, 3),
                                  'v3_voordeel': 'Je kunt het terugkijken (testantwoord)', 'wiskunde_fouten': fouten}}
        if self.db('missie 1 opslaan', 'POST', '/rest/v1/rpc/missie_afronden',
                   {'p_id': self.id, 'p_missie': 1, 'p_antwoorden': antwoorden['missie1']}) is not True:
            STATS['fouten'].append(f'{self.naam} – missie 1: groepje niet gevonden')
        log(f'{self.naam}: missie 1 klaar')
        self.overzicht()

        # Missie 2
        self.wacht(30, 75)
        antwoorden = {}
        # Nieuwe Missie 2 (woordjes leren): zelfde velden als missie-2.html opstuurt
        cijfer = random.choice([7, 7.5, 8, 8.5, 9, 9.5, 10])
        lastig = random.sample([('kluisje', 'locker'), ('toets', 'test'), ('buurman', 'neighbour'), ('rooster', 'timetable')], random.randint(0, 3))
        antwoorden['missie2'] = {'type': 'woordjes', 'aantal_woorden': 10, 'min_cijfer': 7, 'cijfer': cijfer,
                                 'cijfers': ([random.choice([5, 6, 6.5])] if cijfer < 10 and random.random() < .4 else []) + [cijfer],
                                 'aantal_toetsen': 1, 'punten': cijfer, 'leertijd_sec': random.randint(60, 300),
                                 'tijd_sec': random.randint(90, 240),
                                 'moeilijkste_woorden': [{'nl': nl, 'en': en, 'fouten': 1, 'bijna': 0} for nl, en in lastig],
                                 'v3_thuis_leren': 'Ik schrijf ze op (testantwoord)',
                                 'v2_stelling': str(random.randint(1, 5)), 'v4_fout_terug': str(random.randint(1, 5)),
                                 'v5_middelbaar_online': str(random.randint(1, 5)),
                                 'v6_leervorm': random.choice(['papier', 'online', 'hardop', 'mix'])}
        antwoorden['missie2']['aantal_toetsen'] = len(antwoorden['missie2']['cijfers'])
        if self.db('missie 2 opslaan', 'POST', '/rest/v1/rpc/missie_afronden',
                   {'p_id': self.id, 'p_missie': 2, 'p_antwoorden': antwoorden['missie2']}) is not True:
            STATS['fouten'].append(f'{self.naam} – missie 2: groepje niet gevonden')
        log(f'{self.naam}: missie 2 klaar')
        self.overzicht()

        # Missie 3: vragen aan Jay I (hele chatgeschiedenis gaat mee, zoals in missie-3.html)
        geschiedenis = []
        for vraag in random.sample(JAY_VRAGEN, random.randint(2, 4)):
            self.wacht(8, 25)
            geschiedenis.append({'role': 'user', 'content': vraag})
            try:
                d, dt = call('POST', '/functions/v1/Jay-I-Chat', {'messages': geschiedenis},
                             {'Origin': 'https://groep8.klaarvoormiddelbaar.nl'}, timeout=60)
                if 'text' not in d:
                    raise Exception(str(d)[:150])
                geschiedenis.append({'role': 'assistant', 'content': d['text']})
                STATS['jay'].append(dt)
                log(f'{self.naam}: Jay I antwoordde in {dt:.1f}s')
            except urllib.error.HTTPError as e:
                geschiedenis.pop(); STATS['jay_fout'] += 1
                STATS['fouten'].append(f'{self.naam} – Jay I: HTTP {e.code} {e.read()[:150]}')
                log(f'FOUT {self.naam}: Jay I HTTP {e.code} (leerling ziet "Er ging iets mis")')
            except Exception as e:
                geschiedenis.pop(); STATS['jay_fout'] += 1
                STATS['fouten'].append(f'{self.naam} – Jay I: {e}')
                log(f'FOUT {self.naam}: Jay I {e} (leerling ziet "Er ging iets mis")')
        self.wacht(10, 30)
        antwoorden = {}
        antwoorden['missie3'] = {'quiz_score': random.randint(3, 6), 'checklist_compleet': True,
                                 'v1_ai_gebruik': random.sample(AI_GEBRUIK, 2),
                                 'v2_voordeel': 'Snel uitleg krijgen (testantwoord)',
                                 'v3_nadeel': 'Het kan fout zijn (testantwoord)',
                                 'v4_stelling': random.choice(STELLING), 'v5_hulpmiddel': random.choice(HULPMIDDEL)}
        if self.db('missie 3 opslaan', 'POST', '/rest/v1/rpc/missie_afronden',
                   {'p_id': self.id, 'p_missie': 3, 'p_antwoorden': antwoorden['missie3']}) is not True:
            STATS['fouten'].append(f'{self.naam} – missie 3: groepje niet gevonden')
        log(f'{self.naam}: missie 3 klaar — alles af')
        STATS['klaar'] += 1
        self.overzicht()


def now():
    return time.strftime('%Y-%m-%dT%H:%M:%S', time.gmtime()) + 'Z'


if __name__ == '__main__':
    linknr = int(sys.argv[1])
    factor = float(sys.argv[2]) if len(sys.argv) > 2 else 1.0
    groottes = [2] * 11 + [3]  # klas van 25: 11 tweetallen + 1 drietal
    offsets = []
    lopend_totaal = 0
    for g in groottes:
        offsets.append(lopend_totaal)
        lopend_totaal += g
    groepen = [Groep(i + 1, g, linknr, factor, offsets[i]) for i, g in enumerate(groottes)]
    log(f'{len(groepen)} groepjes ({sum(groottes)} leerlingen) starten op missie-link {linknr}')
    for g in groepen:
        g.start()
    for g in groepen:
        g.join()
    db, jay = sorted(STATS['db']), sorted(STATS['jay'])
    pct = lambda a, p: a[min(len(a) - 1, int(len(a) * p))] if a else 0
    print('\n=== SAMENVATTING ===')
    print(f'Groepjes helemaal klaar: {STATS["klaar"]}/{len(groepen)}')
    print(f'Database-acties: {len(db)} gelukt, gem {sum(db)/max(1,len(db)):.2f}s, 95% binnen {pct(db,.95):.2f}s, traagst {max(db or [0]):.2f}s')
    print(f'Jay I: {len(jay)} antwoorden, {STATS["jay_fout"]} mislukt, gem {sum(jay)/max(1,len(jay)):.1f}s, traagst {max(jay or [0]):.1f}s')
    print(f'Technische fouten: {len(STATS["fouten"])}')
    for f in STATS['fouten']:
        print('  -', f)
