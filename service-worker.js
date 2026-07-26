const CACHE_NAME='der-grosse-coup-v0.2.1';
const APP_FILES=['./','./index.html','./style.css','./script.js','./game.js','./levels.js','./characters.js','./equipment.js','./manifest.webmanifest','./assets/icons/icon-180.png','./assets/icons/icon-192.png','./assets/icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)))})
