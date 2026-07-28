# Update auf 0.2.2-RC2-core.1

## Grundlage
Dieses Korrekturpaket ersetzt **0.2.2-RC2-core**. Es erweitert noch nicht die Missionslogik, sondern stabilisiert ausschließlich den Simulationskern.

## In GitHub ersetzen
- `game.js`
- `script.js`
- `index.html`
- `style.css`
- `service-worker.js`
- `README.md`
- `CHANGELOG.md`
- Ordner `tests`

Neu:
- `docs/UPDATE-0.2.2-RC2-core.1.md`

## Commit-Text
`RC2 core.1: Tempo, Protokoll, Mehrpersonenmarker und Ereignisfortsetzung`

## Wichtig auf dem iPad
Nach Veröffentlichung durch GitHub Pages die installierte App vollständig schließen und neu öffnen. Bleibt die alte Versionsnummer sichtbar, die GitHub-Pages-Seite einmal direkt in Safari öffnen und neu laden. Der Cache wurde auf `der-grosse-coup-v0.2.2-rc2-core-1` angehoben.

## Abnahmetest
1. Neues Spiel → Tabakladen → Musterplan laden → Einsatz starten.
2. Vor dem Start müssen die drei Personen am Fluchtwagen gemeinsam als segmentierter Marker sichtbar sein.
3. Tempo steht standardmäßig auf **4×**.
4. Start drücken. Das Protokoll muss Bewegungsbeginn und Statuswechsel fortlaufend anzeigen.
5. Pause drücken. Die Zeit muss stehen bleiben.
6. `+1 Sekunde` drücken. Die Uhr muss exakt um eine Sekunde springen.
7. `Nächstes Ereignis` drücken. Die Simulation muss am nächsten Zielereignis stoppen.
8. `OK und fortsetzen` drücken. Der Ablauf muss automatisch weiterlaufen.
9. Beim nächsten Ereignis `OK – pausiert bleiben` wählen. Danach müssen Einzelschritt und Fortsetzen funktionieren.
10. Der Musterplan muss anschließend bis zum Ergebnisbildschirm laufen.
