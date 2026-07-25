window.GAME_MISSIONS = [
  {
    id:0,
    title:'Level 1: Der Tabakladen',
    desc:'Ein kleiner Laden in der Altstadt. Leere die Kasse und öffne den Bürosafe, bevor die Streife zurückkehrt.',
    reward:6500,
    minCrew:2,
    baseChance:68,
    rooms:['Seitenstraße','Hintertür','Verkaufsraum','Büro','Flucht'],
    phases:[
      ['Zugang','Hintertür öffnen','mittel'],
      ['Sicherung','Verkaufsraum prüfen','niedrig'],
      ['Beute','Kasse leeren','niedrig'],
      ['Tresor','Bürosafe öffnen','mittel'],
      ['Flucht','Vor Streife entkommen','mittel']
    ],
    events:[
      'Die Seitenstraße ist frei.',
      'Das Schloss an der Hintertür wird bearbeitet.',
      'Der Verkaufsraum bleibt dunkel.',
      'Die Kasse wird geleert.',
      'Der kleine Safe wird geöffnet.',
      'Die Bande erreicht das Fluchtfahrzeug.'
    ]
  },
  {
    id:1,
    title:'Level 2: Die Pfandleihe',
    desc:'Eine Pfandleihe mit Bewegungsmelder und verstärkter Hintertür. Schmuck, Uhren und Bargeld liegen im Büro.',
    reward:14500,
    minCrew:3,
    baseChance:52,
    rooms:['Gasse','Hintertür','Lager','Büro','Flucht'],
    phases:[
      ['Zugang','Verstärkte Tür öffnen','hoch'],
      ['Alarm','Bewegungsmelder umgehen','hoch'],
      ['Lager','Wertgegenstände sichern','mittel'],
      ['Tresor','Bürotresor öffnen','hoch'],
      ['Flucht','Vor Sicherheitsdienst entkommen','hoch']
    ],
    events:[
      'Die Gasse wird beobachtet.',
      'Die verstärkte Hintertür hält kurz stand.',
      'Der Bewegungsmelder wird analysiert.',
      'Uhren und Schmuck werden eingesammelt.',
      'Der Tresor wird bearbeitet.',
      'Ein Fahrzeug nähert sich in der Ferne.',
      'Die Bande zieht sich zum Fluchtfahrzeug zurück.'
    ]
  }
];
