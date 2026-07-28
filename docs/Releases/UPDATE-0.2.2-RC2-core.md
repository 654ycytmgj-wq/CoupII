# GitHub-Update auf 0.2.2-RC2-core

## Ausgangsbasis

Dieses Paket basiert auf **Version 0.2.1**. Die Versionen 0.2.2 und 0.2.2-RC1 dürfen nicht als Grundlage verwendet werden.

## Vor dem Update

Erstelle auf GitHub möglichst ein Release oder einen Tag mit dem Namen:

```text
v0.2.1-stable
```

Damit bleibt der bisherige funktionierende Stand wiederherstellbar.

## Einfachste Aktualisierung

1. Das ZIP entpacken.
2. Im GitHub-Repository **Add file → Upload files** wählen.
3. Den gesamten Inhalt des Ordners `der-grosse-coup` hochladen.
4. Vorhandene Dateien gleichen Namens ersetzen lassen.
5. Commit-Text verwenden:

```text
RC2 core: deterministische Simulationssteuerung
```

## Geänderte Dateien

- `game.js`
- `script.js`
- `index.html`
- `style.css`
- `service-worker.js`
- `README.md`

## Neue Dateien

- `CHANGELOG.md`
- `docs/UPDATE-0.2.2-RC2-core.md`
- `tests/static-check.js`

## Nach dem Upload

1. Warten, bis GitHub Pages den neuen Stand veröffentlicht hat.
2. Die Seite zunächst direkt in Safari öffnen.
3. Einmal neu laden. Bei hartnäckigem alten Stand Safari-Website-Daten der GitHub-Pages-Seite löschen oder die installierte Home-Bildschirm-App schließen und erneut öffnen.
4. Auf dem Titelbildschirm muss `0.2.2-RC2-core` stehen.

## Abnahmetest auf dem iPad

1. Neues Spiel öffnen.
2. Tabakladen wählen.
3. Musterplan laden.
4. Einsatz starten. Die Durchführung öffnet sich zunächst im Zustand `READY`.
5. **Start** drücken. Figuren und Uhr müssen laufen.
6. **Pause** drücken. Uhr und Figuren müssen sofort stehen bleiben.
7. **+1 Sekunde** mehrfach drücken. Die Uhr darf pro Druck exakt eine Sekunde weiterlaufen.
8. **Nächstes Ereignis** drücken. Die Simulation muss bis zum nächsten Zielpunkt laufen und dort mit einem Dialog stoppen.
9. **OK** drücken. Der Dialog schließt; die Simulation bleibt pausiert.
10. **Fortsetzen** drücken. Der Ablauf läuft weiter.
11. Während einer Pause **Zur Planung** drücken. Der zuvor geladene Plan muss erhalten bleiben.

## Bewusste Begrenzung dieses Pakets

Dieser Kern prüft noch keine Türstaus, Wartebedingungen, Alarmreihenfolgen oder erweiterten God-Modus-Diagnosen. Diese Funktionen werden erst nach Abnahme des Simulationskerns einzeln ergänzt.
