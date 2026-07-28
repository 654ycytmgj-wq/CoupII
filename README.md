# Der große Coup

Aktueller Entwicklungsstand: **0.3.0-alpha.2**.

Dieser Stand konzentriert sich auf eine strukturierte Planung auf der Karte und einen deterministischen Simulationskern. Neu sind bearbeitbare Aktionslisten, frei wählbare Wartezeiten, echte Türzustände, eine erste Engstellenprüfung und eine klarere Anzeige der laufenden Aktion.

## Test

```bash
node --check game.js
node --check script.js
node tests/engine-alpha2-check.js
python tests/browser-smoke.py
```

Die GitHub-Anleitung steht unter `docs/UPDATE-0.3.0-alpha.2.md`.
