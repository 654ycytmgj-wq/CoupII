window.GAME_MISSION = {
  id: 'tobacco-alpha2',
  title: 'Der Tabakladen',
  startNode: 'car',
  objectiveNode: 'cash',
  nodes: [
    { id: 'car', x: 85, y: 548, label: 'Fluchtwagen', kind: 'start' },
    { id: 'front', x: 285, y: 480, label: 'Haupteingang', kind: 'door', doorDuration: 4 },
    { id: 'shop', x: 380, y: 350, label: 'Verkaufsraum', kind: 'node' },
    { id: 'cash', x: 220, y: 330, label: 'Kasse', kind: 'objective' },
    { id: 'office', x: 620, y: 350, label: 'Büro', kind: 'node' },
    { id: 'rear', x: 735, y: 235, label: 'Hintertür', kind: 'door', doorDuration: 5 },
    { id: 'yard', x: 495, y: 145, label: 'Hinterhof', kind: 'node' }
  ],
  edges: [
    ['car', 'front'], ['front', 'shop'], ['shop', 'cash'], ['shop', 'office'],
    ['office', 'rear'], ['rear', 'yard'], ['yard', 'front'], ['yard', 'car']
  ],
  rooms: [
    { x: 35, y: 505, w: 930, h: 92, label: 'SEITENSTRASSE', outside: true },
    { x: 135, y: 245, w: 430, h: 240, label: 'VERKAUFSRAUM' },
    { x: 565, y: 245, w: 290, h: 240, label: 'BÜRO' },
    { x: 135, y: 65, w: 720, h: 160, label: 'HINTERHOF', outside: true }
  ]
};
