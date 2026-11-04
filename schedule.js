(() => {
  'use strict';
  // November dates use German standard time (UTC+01:00).
  const stages = [
    { start: Date.parse('2026-11-10T06:00:00+01:00'), text: 'ganz viel Erfolg my love <3' },
    { start: Date.parse('2026-11-11T06:00:00+01:00'), text: 'du schaffst das my love <3' },
    { start: Date.parse('2026-11-11T18:00:00+01:00'), text: 'geschafft my love. bin stolz auf dich <3' }
  ];
  function update() {
    const now = Date.now();
    let stage = 0;
    stages.forEach((entry, i) => { if (now >= entry.start) stage = i; });
    if (window.flowerStage === stage) return;
    window.flowerStage = stage;
    document.querySelector('h1').textContent = stages[stage].text;
    document.title = stage === 2 ? 'Geschafft' : 'Viel Glück';
    const flowers = document.getElementById('screen');
    flowers.hidden = stage === 2;
    flowers.setAttribute('aria-label', stage === 1 ? 'Rosa Lilien blühen aus Schriftzeichen auf.' : 'Bunte Lilien blühen aus Schriftzeichen auf.');
    document.getElementById('cap').hidden = stage !== 2;
    document.querySelector('main').hidden = stage === 2;
    window.dispatchEvent(new Event('flower-stage'));
  }
  update();
  setInterval(update, 1000);
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pageshow', update);
})();
