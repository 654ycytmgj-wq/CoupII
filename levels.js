window.GAME_MISSIONS=[
{
 id:0,title:'Level 1: Der Tabakladen',shortTitle:'Der Tabakladen',desc:'Kasse und Bürosafe leeren, anschließend unbemerkt zum Fluchtfahrzeug zurückkehren.',reward:6500,minCrew:2,baseChance:72,objectiveNodes:['cash','safe'],requiredBonuses:['locks'],entryNode:'car',exitNode:'car',
 intel:{Beute:'6.500 €',Streife:'alle 8 Minuten',Alarm:'kein Direktalarm',Grundriss:'vollständig'},
 rooms:[
  {id:'street',x:30,y:505,w:940,h:90,label:'SEITENSTRASSE',outside:true},{id:'shop',x:130,y:250,w:470,h:240,label:'VERKAUFSRAUM'},{id:'office',x:600,y:250,w:260,h:240,label:'BÜRO'},{id:'yard',x:130,y:70,w:730,h:160,label:'HINTERHOF',outside:true}
 ],
 nodes:[
  {id:'car',x:90,y:550,label:'Fluchtwagen',type:'exit',duration:0},{id:'front',x:320,y:490,label:'Haupteingang',type:'entry',duration:20,action:'Tür öffnen'},{id:'shopCenter',x:360,y:370,label:'Verkaufsraum',type:'normal',duration:18,action:'Raum betreten'},{id:'cash',x:225,y:355,label:'Kasse',type:'objective',duration:30,action:'Kasse leeren',objective:true},{id:'officeDoor',x:600,y:365,label:'Bürotür',type:'normal',duration:30,action:'Schloss knacken',requires:'locks'},{id:'safe',x:735,y:370,label:'Safe',type:'objective',duration:65,action:'Safe öffnen',objective:true,requires:'locks'},{id:'backDoor',x:735,y:230,label:'Hintertür',type:'entry',duration:25,action:'Tür öffnen'},{id:'yard',x:500,y:150,label:'Hinterhof',type:'normal',duration:20,action:'Hof queren'}
 ],
 edges:[['car','front'],['front','shopCenter'],['shopCenter','cash'],['shopCenter','officeDoor'],['officeDoor','safe'],['safe','backDoor'],['backDoor','yard'],['yard','front'],['yard','car']],
 hazards:[{id:'patrol',kind:'patrol',label:'Polizeistreife',x:20,y:500,w:960,h:100,start:430,end:500,risk:35}],
 recommended:{emil:['car','front','shopCenter','officeDoor','safe','backDoor','yard','car'],bruno:['car','front','shopCenter','cash','shopCenter','front','car'],rudi:['car']}
},
{
 id:1,title:'Level 2: Die Pfandleihe',shortTitle:'Die Pfandleihe',desc:'Bewegungsmelder deaktivieren, Lager und Tresor sichern und vor dem Sicherheitsdienst fliehen.',reward:14500,minCrew:3,baseChance:58,objectiveNodes:['display','vault'],requiredBonuses:['locks','alarm'],entryNode:'car',exitNode:'car',
 intel:{Beute:'14.500 €',Wachen:'1 Nachtwächter',Alarm:'Bewegungsmelder',Grundriss:'92 %'},
 rooms:[
  {id:'street',x:20,y:505,w:960,h:95,label:'SEITENGASSE',outside:true},{id:'sales',x:90,y:280,w:420,h:205,label:'VERKAUFSRAUM'},{id:'store',x:90,y:70,w:420,h:190,label:'LAGER'},{id:'office',x:510,y:70,w:370,h:190,label:'BÜRO'},{id:'vaultRoom',x:510,y:280,w:370,h:205,label:'TRESORRAUM'}
 ],
 nodes:[
  {id:'car',x:930,y:550,label:'Fluchtwagen',type:'exit',duration:0},{id:'sideDoor',x:880,y:390,label:'Seitentür',type:'entry',duration:35,action:'Verstärkte Tür öffnen',requires:'locks'},{id:'vault',x:700,y:390,label:'Tresor',type:'objective',duration:105,action:'Tresor öffnen',objective:true,requires:'locks'},{id:'hall',x:500,y:380,label:'Flur',type:'normal',duration:20,action:'Flur queren'},{id:'display',x:295,y:390,label:'Auslagen',type:'objective',duration:45,action:'Wertgegenstände sichern',objective:true},{id:'storeDoor',x:295,y:270,label:'Lagertür',type:'normal',duration:20,action:'Tür öffnen'},{id:'store',x:295,y:165,label:'Lager',type:'normal',duration:25,action:'Lager durchsuchen'},{id:'officeDoor',x:510,y:165,label:'Bürotür',type:'normal',duration:22,action:'Büro betreten'},{id:'alarm',x:730,y:150,label:'Alarmzentrale',type:'hazard',duration:55,action:'Alarm deaktivieren',requires:'alarm'},{id:'rear',x:90,y:165,label:'Hinterhof',type:'entry',duration:30,action:'Hintereingang öffnen'}
 ],
 edges:[['car','sideDoor'],['sideDoor','vault'],['vault','hall'],['hall','display'],['display','storeDoor'],['storeDoor','store'],['store','officeDoor'],['officeDoor','alarm'],['store','rear'],['rear','car'],['alarm','vault'],['officeDoor','hall']],
 hazards:[{id:'motion',kind:'sensor',label:'Bewegungsmelder',x:470,y:250,w:430,h:250,risk:45,disabledBy:'alarm'},{id:'guard',kind:'guard',label:'Nachtwächter',x:160,y:95,w:300,h:150,start:120,end:250,risk:40}],
 recommended:{emil:['car','sideDoor','vault','hall','display','storeDoor','store','rear','car'],klara:['car','sideDoor','vault','alarm','officeDoor','store','rear','car'],bruno:['car','sideDoor','vault','hall','display','storeDoor','store','rear','car'],rudi:['car']}
}
];
