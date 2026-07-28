# Testergebnisse 0.3.0-alpha.2

Bestanden am 28.07.2026:

- Syntaxprüfung von `game.js` und `script.js`
- deterministischer Engine-Test
- Referenzplan wird als `READY` geladen
- Haupteingang und Hintertür besitzen Öffnen-Aktionen
- Referenzplan enthält keine Tür- oder Engstellenkonflikte
- beide Türen wechseln während der Simulation auf `open`
- Beginn und Ende der Türaktionen erscheinen im Protokoll
- Kassenereignis hält die Simulation an
- Ereignisdialog enthält keinen redundanten Button `OK – pausiert bleiben`
- `OK und fortsetzen` führt bis zum Status `FINISHED`
- Browser-Smoke-Test in Chromium ohne JavaScript-Fehler

Referenzlauf: 103 Simulationssekunden, 41 Protokolleinträge.
