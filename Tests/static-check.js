'use strict';
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const script=fs.readFileSync(path.join(root,'script.js'),'utf8');
const game=fs.readFileSync(path.join(root,'game.js'),'utf8');
const requiredIds=['execStartBtn','execPauseBtn','execContinueBtn','execStepBtn','execNextEventBtn','backToPlanningBtn','eventDialog','eventOkBtn','eventPlanningBtn','eventAbortBtn','execStatus'];
const requiredExports=['beginExecution','pauseExecution','continueExecution','stepExecution','nextEventExecution','acknowledgeEvent','returnToPlanning'];
let failed=false;
for(const id of requiredIds){if(!html.includes(`id="${id}"`)){console.error(`FEHLT IM HTML: ${id}`);failed=true}if(id.endsWith('Btn')&&!script.includes(`'${id}'`)){console.error(`NICHT GEBUNDEN: ${id}`);failed=true}}
for(const fn of requiredExports){if(!game.includes(fn)){console.error(`FEHLT IM SPIELKERN: ${fn}`);failed=true}}
if(!game.includes('simulateOneSecond')){console.error('Zentraler Einzelschritt fehlt');failed=true}
if(game.includes('Math.random')){console.error('Zufallswurf ist im Kern noch vorhanden');failed=true}
if(failed)process.exit(1);
console.log('Static check passed.');
