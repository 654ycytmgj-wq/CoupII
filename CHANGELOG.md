# Änderungsprotokoll

## 0.2.2-RC2-core

- Neuaufbau auf Basis von 0.2.1.
- Bisherige zeitgesteuerte Aktionsliste durch eine zentrale Zustandsmaschine ersetzt.
- Automatik und Einzelschritt verwenden dieselbe Funktion `simulateOneSecond()`.
- Pause stoppt den zentralen Timer unmittelbar.
- Ereignisse halten die Simulation an und verlangen eine Bestätigung.
- Nach OK verbleibt die Simulation im pausierten Zustand.
- Rückkehr zur Planung erhält den aktuellen Plan.
- Missionserfolg ist im Kern deterministisch; Zufallswürfe wurden entfernt.
