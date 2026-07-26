# Update auf Version 0.2.1 – iPad und GitHub

## Was dieses Update ersetzt

Diese Version ersetzt die bisherige Version 0.1 vollständig. Die Dateien im ZIP-Archiv bilden das komplette Repository. Alte Dateien mit denselben Namen sollen überschrieben werden.

## Sicherung des bisherigen Standes

1. Das GitHub-Repository öffnen.
2. **Code** antippen.
3. **Download ZIP** wählen.
4. Die ZIP-Datei in der App **Dateien** aufbewahren.

GitHub speichert den früheren Stand zusätzlich automatisch in der Commit-Historie.

## Einfachste Aktualisierung über den Mac

1. Das neue ZIP-Archiv entpacken.
2. Den Ordner `der-grosse-coup` öffnen.
3. Im bestehenden GitHub-Repository **Add file → Upload files** auswählen.
4. Sämtliche Dateien und Ordner aus dem neuen Projektordner in das Upload-Feld ziehen.
5. Als Beschreibung `Update auf Version 0.2.1` eintragen.
6. **Commit changes** wählen.

## Aktualisierung ausschließlich auf dem iPad

GitHub verarbeitet Ordner auf dem iPad nicht immer zuverlässig. Daher in drei Blöcken hochladen.

### Block 1 – Stammdateien

Unter **Add file → Upload files** diese Dateien auswählen:

- `index.html`
- `style.css`
- `script.js`
- `game.js`
- `levels.js`
- `characters.js`
- `equipment.js`
- `manifest.webmanifest`
- `service-worker.js`
- `README.md`
- `LICENSE`

Danach **Commit changes**.

### Block 2 – Symbole

Im Repository den Ordner `assets/icons` öffnen und dort über **Add file → Upload files** hochladen:

- `icon-180.png`
- `icon-192.png`
- `icon-512.png`

Danach **Commit changes**.

### Block 3 – Dokumentation

Im Ordner `docs` diese Dateien hochladen:

- `UPDATE-0.2.1.md`
- `GitHub-Anleitung.md`
- `Entwicklung.md`

Danach **Commit changes**.

## GitHub Pages prüfen

1. Repository → **Settings → Pages**.
2. Quelle muss `Deploy from a branch` sein.
3. Branch muss `main` sein.
4. Ordner muss `/(root)` sein.
5. Die GitHub-Pages-Adresse öffnen.

## Alte Version wird weiterhin angezeigt

Die App besitzt einen Offline-Cache. Version 0.2.1 verwendet einen neuen Cache-Namen, dennoch kann Safari kurzzeitig die alte Fassung anzeigen.

1. App vom Home-Bildschirm vollständig schließen.
2. GitHub-Pages-Adresse in Safari öffnen.
3. Seite neu laden.
4. Prüfen, ob auf dem Startbildschirm `Version 0.2.1` steht.
5. App erneut vom Home-Bildschirm starten.

Falls weiterhin Version 0.1 erscheint:

1. iPad **Einstellungen → Apps → Safari → Erweitert → Websitedaten**.
2. Nach `github.io` beziehungsweise dem GitHub-Benutzernamen suchen.
3. Nur diesen Eintrag löschen.
4. GitHub-Pages-Adresse erneut in Safari öffnen.
5. App wieder zum Home-Bildschirm hinzufügen.

## Erster Funktionstest

1. **Neues Spiel** wählen.
2. **Der Tabakladen** öffnen.
3. **Musterplan laden** wählen.
4. **Entwickleranzeige aktivieren** einschalten.
5. **Plan prüfen** wählen.
6. Es muss ein God-Bericht mit Erfolgschance und Gesamtdauer erscheinen.
7. **Einsatz starten** wählen.
8. Die Figuren müssen auf dem Grundriss ihren geplanten Weg ablaufen.
