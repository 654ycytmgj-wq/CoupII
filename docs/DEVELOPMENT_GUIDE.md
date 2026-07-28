# Entwicklungsplan

## Version 0.2.1 – umgesetzt

- SVG-Grundrisse für beide Missionen
- Touch-Wegpunkte
- individuelle Routen
- automatische Aktionszeiten
- synchronisierte Zeitleiste
- erste God-Prüfung
- animierte Planwiedergabe

## Version 0.2.2 – nächster Schritt

- Aktionen an jedem Wegpunkt manuell wählen
- Wartebefehle und Synchronisationspunkte
- Türen mit offen/geschlossenem Zustand
- Alarmanlage mit aktiv/deaktiviertem Zustand
- Beutegewicht und Traglast

## Version 0.2.3

- bewegliche Wachen
- drehende Kameras
- präzise Sichtkegel
- zeitabhängige Kollisionen
- God-Modus mit Schritt-für-Schritt-Diagnose

## Architektur

Die Karten werden datengetrieben in `levels.js` beschrieben. Räume, Knoten, Verbindungen, Ziele und Gefahren können dadurch später ohne Änderung der Kernlogik ergänzt werden.
