# Update auf Version 0.2.2-RC1

Diese Fassung ersetzt die fehlerhafte Version 0.2.2 vollständig und baut auf 0.2.1 auf.

## Installation über GitHub

1. Repository als Sicherung herunterladen.
2. Alle Dateien aus diesem Ordner in das bestehende Repository kopieren und vorhandene Dateien ersetzen.
3. Commit-Nachricht: `Neuimplementierung 0.2.2-RC1`.
4. GitHub Pages abwarten.
5. Die Seite in Safari neu laden. Bei einer installierten PWA die App vollständig schließen und erneut öffnen.

## Abnahmetest

### God-Modus
1. Mission öffnen.
2. `Entwickleranzeige aktivieren` einschalten.
3. `Team empfehlen` drücken. Die Teamwahl und eine Begründung müssen erscheinen.
4. `Musterplan laden` drücken.
5. `Plan prüfen` drücken.

### Warten und Türkonflikt
1. Zwei Personen auf dieselbe Route zu einer Tür setzen.
2. `Plan prüfen`: Ein Stau muss gemeldet werden.
3. Bei einer Person vor der Tür eine Wartezeit einfügen.
4. Erneut prüfen: Der Konflikt muss verschwinden, sobald sich die Belegungszeiten nicht mehr überschneiden.

### Simulation
1. Einsatz starten.
2. `Pause` drücken: Uhr und Figuren müssen stehen bleiben.
3. `+1 Sekunde` mehrfach drücken: Die Uhr muss exakt je eine Sekunde fortschreiten.
4. `Nächstes Ereignis` drücken: Die Simulation springt zum nächsten Aktionsende.
5. Bei einem Planfehler muss die Simulation anhalten und einen Dialog mit `OK`, `Zur Planung` und `Abbrechen` zeigen.
6. Nach `OK` bleibt die Simulation pausiert und kann kontrolliert fortgesetzt werden.

### Mehrpersonenmarker
Wenn mehrere Personen denselben Kartenpunkt erreichen, erscheint ein segmentierter Marker mit der Anzahl der Personen. Keine Person wird durch eine andere verdeckt.
