# Der große Coup

Ein installierbares Retro-Strategiespiel als Progressive Web App für iPad, Mac und andere moderne Browser.

## Aktueller Stand: Version 0.1

- zwei spielbare Missionen
- Team-, Werkzeug- und Fahrzeugauswahl
- automatische Einsatzdurchführung
- Alarm-, Fahndungs- und Kapitalsystem
- lokaler Spielstand
- Offline-Betrieb nach der ersten Installation
- touchoptimierte Bedienung

## Schnellstart über GitHub Pages

1. Dieses Projekt in ein öffentliches GitHub-Repository hochladen.
2. Unter **Settings → Pages** als Quelle **Deploy from a branch** wählen.
3. Branch **main** und Ordner **/(root)** auswählen.
4. Die von GitHub angezeigte Pages-Adresse in Safari öffnen.
5. Auf dem iPad: **Teilen → Zum Home-Bildschirm**.

Eine ausführliche Anleitung befindet sich unter [`docs/GitHub-Anleitung.md`](docs/GitHub-Anleitung.md).

## Projektstruktur

```text
der-grosse-coup/
├── index.html
├── style.css
├── script.js
├── game.js
├── levels.js
├── characters.js
├── equipment.js
├── manifest.webmanifest
├── service-worker.js
├── README.md
├── LICENSE
├── assets/
│   ├── icons/
│   ├── sprites/
│   ├── maps/
│   └── sounds/
├── levels/
└── docs/
```

## Lokaler Test auf einem Mac

Im Projektordner:

```bash
python3 -m http.server 8000
```

Danach im Browser öffnen:

```text
http://localhost:8000
```

## Geplante Ausbaustufen

- 0.2: Gebäudegrundrisse und sichtbare Bewegung
- 0.3: editierbare Zeitplanung und Wegpunkte
- 0.4: Stadtkarte, Händler, Fahrzeuge und Spezialisten
- 0.5: Fahndung und Polizeiermittlungen
- 1.0: vollständige Kampagne

## Lizenz

Der Programmcode steht unter der MIT-Lizenz. Spieltitel, Figuren, Texte und grafische Inhalte bleiben eigenständige Bestandteile dieses Projekts.
