# Der große Coup

## Version 0.2.2-RC2-core

Dieser Release-Kandidat basiert auf **0.2.1** und ersetzt ausschließlich den bisherigen Simulationsablauf durch einen deterministischen Kern.

Enthalten:

- zentrale Simulationszustände
- Start, Pause und Fortsetzen
- Einzelschritt um exakt eine Simulationssekunde
- Sprung bis zum nächsten Ereignis
- Ereignisstopp mit bestätigungspflichtigem OK-Dialog
- Rückkehr zur Planung unter Erhalt des Plans
- kontinuierliche Positionsberechnung zwischen Wegpunkten
- deterministischer Abschluss ohne Zufallswurf

Bewusst noch nicht enthalten sind die für spätere Pakete vorgesehenen erweiterten Warte-, Tür-, Engstellen-, Alarm- und God-Modus-Funktionen.

Die GitHub-Aktualisierung steht in `docs/UPDATE-0.2.2-RC2-core.md`.
