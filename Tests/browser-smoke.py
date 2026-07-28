from pathlib import Path
from playwright.sync_api import sync_playwright

root=Path('.')
html=(root/'index.html').read_text()
css=(root/'style.css').read_text()
html=html.replace('<link rel="stylesheet" href="style.css?v=030a1">', f'<style>{css}</style>')
for name in ['characters.js','levels.js','game.js','script.js']:
    src=(root/name).read_text()
    import re
    html=re.sub(rf'<script src="{re.escape(name)}[^\"]*"></script>', f'<script>{src}</script>', html)
html=html.replace('<link rel="manifest" href="manifest.webmanifest">','')

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    page=browser.new_page(viewport={"width":1366,"height":900})
    errors=[]
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.set_content(html, wait_until='load')
    assert page.locator('#modeLabel').inner_text() == 'READY'
    assert page.locator('#startBtn').is_enabled()
    assert page.locator('.crew-marker .marker-text').first.text_content() == '2'
    page.click('#startBtn')
    page.wait_for_timeout(1200)
    assert page.locator('#modeLabel').inner_text() == 'RUNNING'
    page.click('#pauseBtn')
    assert page.locator('#modeLabel').inner_text() == 'PAUSED'
    t1=page.locator('#clockLabel').inner_text()
    page.click('#stepBtn')
    t2=page.locator('#clockLabel').inner_text()
    assert t1 != t2
    page.click('#continueBtn')
    page.wait_for_selector('#eventDialog:not(.hidden)', timeout=15000)
    assert page.locator('#eventTitle').inner_text() == 'Zielpunkt erreicht'
    page.click('#eventContinueBtn')
    page.wait_for_function("document.querySelector('#modeLabel').textContent === 'FINISHED'", timeout=15000)
    protocol=page.locator('#protocol').inner_text()
    assert 'Mission erfolgreich beendet.' in protocol
    assert not errors, errors
    page.screenshot(path='/mnt/data/rebuild/browser-smoke.png', full_page=True)
    browser.close()
    print('PASS browser smoke')
