# GitHub-Anleitung für „Der große Coup“

Diese Anleitung beschreibt den gesamten Weg vom ZIP-Archiv bis zur installierten App auf dem iPad.

## 1. Projekt auf dem iPad vorbereiten

1. Das ZIP-Archiv herunterladen und in der App **Dateien** speichern.
2. In **Dateien** einmal auf das ZIP-Archiv tippen. iPadOS erzeugt automatisch einen Ordner `der-grosse-coup`.
3. Den Ordner öffnen und prüfen, ob darin direkt `index.html`, `README.md`, `assets` und `docs` liegen.

Wichtig: Nicht nur den übergeordneten Ordner hochladen. In GitHub müssen die Dateien im Stammverzeichnis des Repositorys liegen.

## 2. GitHub-Konto anlegen

1. In Safari `github.com` öffnen.
2. **Sign up** wählen.
3. E-Mail-Adresse, Passwort und Benutzername festlegen.
4. Die Bestätigungs-E-Mail von GitHub öffnen und das Konto bestätigen.

Das kostenlose Konto genügt.

## 3. Neues Repository erstellen

1. Nach der Anmeldung oben rechts auf das Pluszeichen tippen.
2. **New repository** auswählen.
3. Als Repository-Namen eingeben: `der-grosse-coup`.
4. **Public** auswählen. GitHub Pages funktioniert damit ohne weitere Einstellungen.
5. Die Optionen für README, `.gitignore` und Lizenz zunächst nicht aktivieren, weil diese Dateien bereits im Projekt enthalten sind.
6. **Create repository** wählen.

## 4. Dateien auf dem iPad hochladen

Die GitHub-Webseite kann auf dem iPad keine vollständigen Ordnerstrukturen zuverlässig in einem einzigen Schritt übernehmen. Daher ist die folgende Methode am sichersten.

### Stammdateien hochladen

1. Im leeren Repository auf **uploading an existing file** oder **Add file → Upload files** tippen.
2. **choose your files** wählen.
3. In der App **Dateien** den entpackten Projektordner öffnen.
4. Diese Dateien markieren:
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
5. Hochladen und unten **Commit changes** wählen.

### Unterordner anlegen und Dateien hochladen

GitHub legt einen Ordner an, sobald eine Datei mit entsprechendem Pfad erstellt wird.

#### Icons

1. **Add file → Create new file** wählen.
2. Als Dateinamen `assets/icons/.gitkeep` eingeben.
3. **Commit changes** wählen.
4. Den neu angelegten Ordner `assets/icons` öffnen.
5. **Add file → Upload files** wählen.
6. Die drei Dateien `icon-180.png`, `icon-192.png` und `icon-512.png` aus dem lokalen Ordner `assets/icons` hochladen.
7. **Commit changes** wählen.
8. Die Datei `.gitkeep` kann anschließend gelöscht werden, ist aber unschädlich.

#### Dokumentation

1. **Add file → Create new file** wählen.
2. Als Dateinamen `docs/GitHub-Anleitung.md` eingeben.
3. Den Inhalt aus der lokalen gleichnamigen Datei hineinkopieren oder die Datei anschließend im Ordner `docs` hochladen.
4. Zusätzlich `docs/Entwicklung.md` hochladen.

Die leeren Ordner `sprites`, `maps`, `sounds` und `levels` sind für spätere Ausbaustufen vorgesehen. GitHub speichert leere Ordner nicht. Das ist normal und beeinträchtigt die App nicht.

## 5. GitHub Pages einschalten

1. Im Repository auf **Settings** tippen.
2. In der linken Seitenleiste **Pages** auswählen. Auf dem iPad muss die Seitenleiste gegebenenfalls über das Menüsymbol geöffnet werden.
3. Unter **Build and deployment** bei **Source** den Eintrag **Deploy from a branch** auswählen.
4. Unter **Branch** `main` auswählen.
5. Daneben `/(root)` auswählen.
6. **Save** tippen.

Die Bereitstellung dauert meist ein bis fünf Minuten. Danach zeigt GitHub oben auf derselben Seite die Adresse der App an:

```text
https://DEIN-BENUTZERNAME.github.io/der-grosse-coup/
```

## 6. App auf dem iPad installieren

1. Die GitHub-Pages-Adresse ausdrücklich in **Safari** öffnen.
2. Prüfen, ob die Schaltfläche **Neues Spiel** reagiert.
3. In Safari auf das Teilen-Symbol tippen.
4. **Zum Home-Bildschirm** auswählen.
5. Den Namen `Der große Coup` bestätigen.
6. **Hinzufügen** tippen.

Danach erscheint die App mit eigenem Symbol auf dem Home-Bildschirm. Beim Start öffnet sie sich ohne die normale Safari-Adressleiste.

## 7. App aktualisieren

Bei einer neuen Version:

1. Im Repository die zu ersetzende Datei öffnen.
2. Über das Stiftsymbol bearbeiten oder über **Add file → Upload files** eine neue Version hochladen.
3. **Commit changes** wählen.
4. GitHub Pages veröffentlicht die Änderung automatisch.

Die App kann wegen des Offline-Caches zunächst noch die alte Fassung anzeigen. In diesem Fall:

1. App vollständig schließen.
2. Die GitHub-Pages-Adresse einmal in Safari neu laden.
3. Danach die App erneut vom Home-Bildschirm starten.

## 8. Häufige Fehler

### Die Schaltflächen reagieren nicht

Die Datei wurde wahrscheinlich in der Vorschau der App **Dateien** geöffnet. Sie muss über die GitHub-Pages-Adresse in Safari geladen werden.

### GitHub zeigt nur eine Dateiliste

`index.html` liegt nicht im Stammverzeichnis des Repositorys. Die Datei muss direkt auf der ersten Ebene liegen.

### Das App-Symbol fehlt

Prüfen, ob diese Pfade exakt vorhanden sind:

```text
assets/icons/icon-180.png
assets/icons/icon-192.png
assets/icons/icon-512.png
```

### Änderungen erscheinen nicht

Der Service Worker verwendet noch den alten Cache. Die Seite in Safari neu laden oder in `service-worker.js` den Wert von `CACHE_NAME` erhöhen.
