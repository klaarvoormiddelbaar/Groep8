#!/usr/bin/env python3
"""Maakt voor elk Engels woord in missie-2.html een audiobestand (Britse stem, audio/<woord>.m4a).
Gebruik (op een Mac):  python3 maak-audio.py
Voeg je woorden toe aan THEMAS? Draai dit script opnieuw en zet de nieuwe audio-map mee online."""
import re, subprocess, pathlib, tempfile
hier = pathlib.Path(__file__).parent
html = (hier.parent / 'missie-2.html').read_text(encoding='utf-8')
woorden = re.findall(r'en: \["([^"]+)"', html)
uit = hier; uit.mkdir(exist_ok=True)
for w in woorden:
    bestand = uit / (re.sub(r'[^a-z0-9]+', '-', w.lower()).strip('-') + '.m4a')
    with tempfile.TemporaryDirectory() as t:
        aiff = pathlib.Path(t) / 'x.aiff'
        subprocess.run(['say', '-v', 'Daniel', '-r', '140', '-o', str(aiff), w], check=True)
        subprocess.run(['afconvert', '-f', 'm4af', '-d', 'aac', '-b', '64000', str(aiff), str(bestand)], check=True)
    print('ok', w, '->', bestand.name)
