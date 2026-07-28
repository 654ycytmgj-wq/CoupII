# GitHub-Update auf 0.3.0-alpha.1

## Ausgangspunkt

Dieses Update ersetzt die fehlerhaften RC2-Stände. Es wurde neu auf Basis von Version 0.2.1 aufgebaut.

## Einfachste Installation

1. Das vollständige ZIP entpacken.
2. Im GitHub-Repository `Add file` → `Upload files` wählen.
3. Den Inhalt des Ordners `der-grosse-coup` hochladen.
4. Vorhandene Dateien mit identischem Namen ersetzen.
5. Commit-Text verwenden:

   `0.3.0-alpha.1: neuer Kern mit Aktionslisten`

6. Unter `Actions` auf einen grünen Haken bei `pages build and deployment` warten.
7. Die GitHub-Pages-Seite in Safari neu laden.

## Geänderte Dateien

- `index.html`
- `style.css`
- `script.js`
- `game.js`
- `levels.js`
- `characters.js`
- `service-worker.js`
- `manifest.webmanifest`
- `README.md`

## Neue Dateien

- `CHANGELOG.md`
- `docs/UPDATE-0.3.0-alpha.1.md`
- `tests/engine-check.js`

## iPad-Abnahmetest

1. Seite öffnen. Version `0.3.0-alpha.1` muss sichtbar sein.
2. Der Referenzplan ist automatisch geladen.
3. `Plan prüfen` drücken: grüne Erfolgsmeldung erwartet.
4. `Start` drücken.
5. Nach einigen Sekunden `Pause` drücken: Uhr und Figuren müssen stoppen.
6. `+1 Sekunde` mehrfach drücken: Uhr steigt jeweils exakt um eine Sekunde.
7. `Fortsetzen` drücken.
8. Beim Erreichen der Kasse muss der Ereignisdialog erscheinen.
9. `OK und fortsetzen` drücken: Dialog verschwindet und Simulation läuft weiter.
10. Beide Figuren müssen am Fluchtwagen enden; Status `FINISHED`.
11. Im Protokoll müssen Bewegungsbeginn, Wegpunkte, Warten, Ereignis und Abschluss erscheinen.
12. Beim gemeinsamen Start und bei gemeinsamer Rückkehr muss ein geteilter Marker mit der Zahl `2` sichtbar sein.
