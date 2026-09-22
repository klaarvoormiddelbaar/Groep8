import json, os, pathlib, re, urllib.error, urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[2]
BASE = 'https://www.klaarvoormiddelbaar.nl'
PORTAL = 'https://groep8.klaarvoormiddelbaar.nl'
urls = [BASE + p for p in ('/', '/groep8', '/brugklas', '/contact')]
urls += [PORTAL + p for p in ('/Inlogpagina/', '/Dashboard/')]
urls += [f'{PORTAL}/les{i}' for i in range(1, 9)]

def get(url):
    headers = {}
    secret = os.environ.get('VERCEL_AUTOMATION_BYPASS_SECRET')
    if secret and urllib.request.urlparse(url).hostname in {'klaarvoormiddelbaar.nl', 'www.klaarvoormiddelbaar.nl'}:
        headers['x-vercel-protection-bypass'] = secret
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=25) as response:
            body = response.read(3000000).decode(errors='replace')
            title = re.search(r'<title[^>]*>(.*?)</title>', body, re.I | re.S)
            return response.status, title.group(1).strip() if title else '', body
    except Exception as exc:
        return 0, type(exc).__name__, ''

results = []
for url in urls:
    status, title, body = get(url)
    results.append({'url': url, 'status': status, 'title': title, 'checkpoint': 'Vercel Security Checkpoint' in body})

problems = [r for r in results if r['status'] != 200 or r['checkpoint']]
report = {'results': results, 'problems': problems}
pathlib.Path('monitor-result.json').write_text(json.dumps(report, indent=2, ensure_ascii=False))

if problems:
    subject = 'FOUTMELDING – Klaar voor Middelbaar'
    lines = ['Er is een probleem gevonden tijdens de automatische controle.', '']
    for item in problems:
        lines += [item['url'], f"Status: {item['status']} | Titel: {item['title']}", '']
else:
    subject = 'CONTROLE GESLAAGD – Klaar voor Middelbaar'
    lines = [f'Automatische controle geslaagd voor {len(results)} basispagina’s.', '', 'Gecontroleerd:', *[r['url'] for r in results]]

api_key = os.environ.get('RESEND_API_KEY')
if not api_key:
    raise SystemExit('RESEND_API_KEY ontbreekt als GitHub Secret; mail niet verzonden.')
payload = json.dumps({'from': 'Klaar voor Middelbaar <contact@klaarvoormiddelbaar.nl>', 'to': [os.environ['MONITOR_EMAIL']], 'subject': subject, 'text': '\n'.join(lines)}).encode()
request = urllib.request.Request('https://api.resend.com/emails', data=payload, headers={'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'}, method='POST')
with urllib.request.urlopen(request, timeout=25) as response:
    if response.status >= 300:
        raise SystemExit(f'Mailservice gaf HTTP {response.status}')
