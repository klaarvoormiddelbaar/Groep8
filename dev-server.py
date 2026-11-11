#!/usr/bin/env python3
"""Lokale dev-server die alle Vercel-rewrites en -redirects uit vercel.json nabootst."""

import http.server
import urllib.parse
import os
import sys

PORT = 3000
ROOT = os.path.dirname(os.path.abspath(__file__))

# ── 302-redirects: browser-URL verandert (nodig wanneer JS window.location.search leest) ──
REDIRECTS = {
    "/Dashboard":          "/Dashboard/",
    "/proef":              "/proef/",
    "/proeflicentie":      "/proef/",
    "/spaans":             "/spaans/",
    "/les1/docent/quiz":   "/KvM%20Quiz/docent-sessie.html?les=les-1",
    "/les2/docent/quiz":   "/KvM%20Quiz/docent-sessie.html?les=les-2",
    "/les3/docent/quiz":   "/KvM%20Quiz/docent-sessie.html?les=les-3",
    "/les4/docent/quiz":   "/KvM%20Quiz/docent-sessie.html?les=les-4",
    "/les5/docent/quiz":   "/KvM%20Quiz/docent-sessie.html?les=les-5",
    "/les6/docent/quiz":   "/KvM%20Quiz/docent-sessie.html?les=les-6",
    "/les7/docent/quiz":   "/KvM%20Quiz/docent-sessie.html?les=les-7",
    "/les8/docent/quiz":   "/KvM%20Quiz/docent-sessie.html?les=les-8",
    "/les7/docent/open-boek-quiz": "/Open%20Boek%20Quiz/docent-quiz.html?les=les-7",
    "/les1/docent/poll":   "/Live%20poll/docent-poll.html?les=poll-les-1",
    "/les2/docent/poll":   "/Live%20poll/docent-poll.html?les=poll-les-2",
    "/les3/docent/poll":   "/Live%20poll/docent-poll.html?les=poll-les-3",
    "/les4/docent/poll":   "/Live%20poll/docent-poll.html?les=poll-les-4",
    "/les5/docent/poll":   "/Live%20poll/docent-poll.html?les=poll-les-5",
    "/les6/docent/poll":   "/Live%20poll/docent-poll.html?les=poll-les-6",
    "/les7/docent/poll":   "/Live%20poll/docent-poll.html?les=poll-les-7",
    "/les8/docent/poll":   "/Live%20poll/docent-poll.html?les=poll-les-8",
}

# ── Rewrites: server serveert ander bestand, browser-URL blijft hetzelfde ──
REWRITES = {
    "/":                  "/index.html",
    "/Dashboard/":        "/Dashboard/dashboard.html",
    "/les1":              "/Les/index.html",
    "/les1/":             "/Les/index.html",
    "/les2":              "/Les/index.html",
    "/les2/":             "/Les/index.html",
    "/les3":              "/Les/index.html",
    "/les3/":             "/Les/index.html",
    "/les4":              "/Les/index.html",
    "/les4/":             "/Les/index.html",
    "/les5":              "/Les/index.html",
    "/les5/":             "/Les/index.html",
    "/les6":              "/Les/index.html",
    "/les6/":             "/Les/index.html",
    "/les7":              "/Les/index.html",
    "/les7/":             "/Les/index.html",
    "/les8":              "/Les/index.html",
    "/les8/":             "/Les/index.html",
    "/les1/quiz":         "/KvM Quiz/join.html",
    "/les2/quiz":         "/KvM Quiz/join.html",
    "/les3/quiz":         "/KvM Quiz/join.html",
    "/les4/quiz":         "/KvM Quiz/join.html",
    "/les5/quiz":         "/KvM Quiz/join.html",
    "/les6/quiz":         "/KvM Quiz/join.html",
    "/les7/quiz":         "/KvM Quiz/join.html",
    "/les8/quiz":         "/KvM Quiz/join.html",
    "/les7/open-boek-quiz": "/Open Boek Quiz/join.html",
    "/les1/poll":         "/Live poll/join.html",
    "/les2/poll":         "/Live poll/join.html",
    "/les3/poll":         "/Live poll/join.html",
    "/les4/poll":         "/Live poll/join.html",
    "/les5/poll":         "/Live poll/join.html",
    "/les6/poll":         "/Live poll/join.html",
    "/les7/poll":         "/Live poll/join.html",
    "/les8/poll":         "/Live poll/join.html",
    "/les3/missie":       "/Missie Middelbaar/index.html",
    "/les3/docent/missie": "/Missie Middelbaar/docent.html",
    "/les3/docent/missie/uitleg": "/Missie Middelbaar/uitleg.html",
    "/les5/docent/voorspel": "/Voorspel de Klas/docent.html",
    "/les5/docent/woordwolk": "/Wordcloud/docent.html",
    "/Inlogpagina":        "/Inlogpagina/index.html",
    "/Inlogpagina/":       "/Inlogpagina/index.html",
    "/planeten-planner":   "/Planeten Planner v2/index.html",
    "/planeten-planner/":  "/Planeten Planner v2/index.html",
    "/pp":                 "/Planeten Planner v2/index.html",
    "/pp/":                "/Planeten Planner v2/index.html",
    "/proef/":             "/Proeflicentie/dashboard.html",
    "/proef/inloggen":     "/Proeflicentie/inlogpagina.html",
    "/spaans/":            "/Spaans/index.html",
    "/tips-en-tops/leerkracht":            "/Tips en Tops/leerkracht-deel-link.html",
    "/tips-en-tops/leerkracht/antwoorden": "/Tips en Tops/leerkracht-tips-en-tops.html",
}

MIME = {
    ".html": "text/html; charset=utf-8",
    ".css":  "text/css",
    ".js":   "application/javascript",
    ".json": "application/json",
    ".png":  "image/png",
    ".jpg":  "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg":  "image/svg+xml",
    ".ico":  "image/x-icon",
    ".woff2":"font/woff2",
    ".woff": "font/woff",
    ".ttf":  "font/ttf",
}


class Handler(http.server.BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f"  {self.command} {self.path}")

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path   = urllib.parse.unquote(parsed.path)
        query  = parsed.query

        # 1. Redirect (browser-URL verandert)
        if path in REDIRECTS:
            dest = REDIRECTS[path]
            if query:
                dest += ("&" if "?" in dest else "?") + query
            self.send_response(302)
            self.send_header("Location", dest)
            self.end_headers()
            return

        # 2a. Dynamische rewrite: /feedback/<code> -> Tips en Tops formulier
        # (de pagina leest de code zelf uit window.location.pathname, net als /les8 e.d.)
        if path.startswith("/feedback/") and path.count("/") == 2:
            serve_path = "/Tips en Tops/tips-en-tops.html"
        elif path.startswith("/missie/") and path.count("/") == 2:
            serve_path = "/Missie Middelbaar/index.html"
        elif path.startswith("/voorspel/") and path.count("/") == 2:
            serve_path = "/Voorspel de Klas/index.html"
        elif path.startswith("/woordwolk/") and path.count("/") == 2:
            serve_path = "/Wordcloud/index.html"
        elif path.startswith("/spaans/") and path != "/spaans/":
            # Vercel heeft hiervoor een losse wildcard-rewrite ("/spaans/:path*" ->
            # "/Spaans/:path*"); macOS' hoofdletterongevoelige bestandssysteem
            # verbergt anders dat dit expliciet moet, in tegenstelling tot Linux/Vercel.
            serve_path = "/Spaans/" + path[len("/spaans/"):]
        else:
            # 2b. Statische rewrite (bestand serveren, URL blijft)
            serve_path = REWRITES.get(path, path)

        # 3. Bestand zoeken op het filesystem
        fs_path = os.path.join(ROOT, serve_path.lstrip("/"))
        if not os.path.isfile(fs_path):
            if os.path.isdir(fs_path):
                fs_path = os.path.join(fs_path, "index.html")
            else:
                self._404(path)
                return

        ext  = os.path.splitext(fs_path)[1].lower()
        mime = MIME.get(ext, "application/octet-stream")

        try:
            with open(fs_path, "rb") as f:
                data = f.read()
        except OSError:
            self._404(path)
            return

        self.send_response(200)
        self.send_header("Content-Type", mime)
        self.send_header("Content-Length", str(len(data)))
        # Geen caching lokaal: zonder dit kan de browser een oud script vasthouden
        # na een bewerking, wat als een 'nep-regressie' oogt tijdens het testen.
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def _404(self, path):
        msg = f"404 — niet gevonden: {path}".encode()
        self.send_response(404)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(msg)))
        self.end_headers()
        self.wfile.write(msg)


if __name__ == "__main__":
    os.chdir(ROOT)
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    server = http.server.HTTPServer(("", port), Handler)
    print(f"Dev-server draait op  http://localhost:{port}")
    print(f"Handige links:")
    print(f"  Startpagina:       http://localhost:{port}/")
    print(f"  Inloggen:          http://localhost:{port}/Inlogpagina/")
    print(f"  Dashboard:         http://localhost:{port}/Dashboard/")
    print(f"  Les 1:             http://localhost:{port}/les1")
    print(f"  Les 1 quiz docent: http://localhost:{port}/les1/docent/quiz")
    print(f"  Les 1 poll docent: http://localhost:{port}/les1/docent/poll")
    print(f"  Les 1 quiz leerling: http://localhost:{port}/les1/quiz")
    print(f"  Proeflicentie inlog: http://localhost:{port}/proef/inloggen")
    print(f"  Proeflicentie dash:  http://localhost:{port}/proef/")
    print(f"\nStop met Ctrl+C\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer gestopt.")
