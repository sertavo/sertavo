(() => {
  const VERSION = '1.2.21';

  const ensureMediaSettings = () => {
    try {
      const s = current();
      if (!s) return;
      if (!s.heroFit) s.heroFit = 'cover';
      if (!Number.isFinite(Number(s.heroZoom))) s.heroZoom = 100;
      if (!Number.isFinite(Number(s.heroX))) s.heroX = 0;
      if (!Number.isFinite(Number(s.heroY))) s.heroY = 0;

      // C3S4: the current product image includes generous cream margins.
      // Use a restrained default crop while keeping the whole box readable.
      if (s.template === 'c3s4' && !s.__media1221Migrated) {
        s.heroFit = 'cover';
        s.heroZoom = 112;
        s.heroX = 0;
        s.heroY = 18;
        s.__media1221Migrated = true;
        try { save(); } catch (_) {}
      }
    } catch (_) {}
  };

  const drawFittedImage = (im, x, y, w, h, fit = 'cover', zoom = 100, panX = 0, panY = 0) => {
    if (!im) return;
    const iw = im.naturalWidth || im.width;
    const ih = im.naturalHeight || im.height;
    if (!iw || !ih) return;
    const baseScale = fit === 'contain' ? Math.min(w / iw, h / ih) : Math.max(w / iw, h / ih);
    const scale = baseScale * (Math.max(50, Math.min(250, Number(zoom) || 100)) / 100);
    const dw = iw * scale;
    const dh = ih * scale;
    ctx.drawImage(im, x + (w - dw) / 2 + (Number(panX) || 0), y + (h - dh) / 2 + (Number(panY) || 0), dw, dh);
  };

  // Replace the fixed cover behavior with reusable per-image fitting.
  photoFrame = function(im, x, y, w, h, r = 28) {
    const s = current();
    const fit = s?.heroFit || 'cover';
    const zoom = Number(s?.heroZoom ?? 100);
    const panX = Number(s?.heroX ?? 0);
    const panY = Number(s?.heroY ?? 0);

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.clip();
    ctx.fillStyle = C.cream;
    ctx.fillRect(x, y, w, h);
    drawFittedImage(im, x, y, w, h, fit, zoom, panX, panY);
    ctx.restore();
    rr(x, y, w, h, r, null, 'rgba(190,145,88,.28)', 1.25);
  };

  const injectMediaControls = () => {
    try {
      const heroInput = document.getElementById('heroFile');
      const section = heroInput?.closest('.section');
      if (!section || document.getElementById('heroMediaControls')) return;

      const box = document.createElement('div');
      box.id = 'heroMediaControls';
      box.innerHTML = `
        <div class="tiny" style="margin-top:12px;margin-bottom:8px">התאמת התמונה בתוך המסגרת</div>
        <div class="row">
          <div>
            <label>מצב התאמה</label>
            <select id="heroFit" style="width:100%;min-height:42px;border:1px solid #d7dbe0;border-radius:10px;padding:8px;background:#fff">
              <option value="cover">מילוי המסגרת</option>
              <option value="contain">הצג את כל התמונה</option>
            </select>
          </div>
          <div>
            <label>זום תמונה %</label>
            <input id="heroZoom" type="number" min="50" max="250" step="1">
          </div>
        </div>
        <div class="row">
          <div><label>הזזה אופקית</label><input id="heroX" type="number" min="-300" max="300" step="1"></div>
          <div><label>הזזה אנכית</label><input id="heroY" type="number" min="-300" max="300" step="1"></div>
        </div>
        <div class="miniBtns"><button id="resetHeroFit" type="button">אפס התאמת תמונה</button></div>
      `;
      section.appendChild(box);

      const commit = (key, value) => {
        ensureMediaSettings();
        const s = current();
        s[key] = value;
        try { save(); } catch (_) {}
        try { render(); } catch (_) {}
      };

      document.getElementById('heroFit').addEventListener('change', e => commit('heroFit', e.target.value));
      ['heroZoom','heroX','heroY'].forEach(id => {
        document.getElementById(id).addEventListener('input', e => commit(id, Number(e.target.value)));
      });
      document.getElementById('resetHeroFit').addEventListener('click', () => {
        const s = current();
        s.heroFit = 'cover';
        s.heroZoom = 100;
        s.heroX = 0;
        s.heroY = 0;
        s.__media1221Migrated = true;
        try { save(); } catch (_) {}
        syncMediaControls();
        try { render(); } catch (_) {}
      });
    } catch (_) {}
  };

  const syncMediaControls = () => {
    try {
      ensureMediaSettings();
      injectMediaControls();
      const s = current();
      const fit = document.getElementById('heroFit');
      const zoom = document.getElementById('heroZoom');
      const x = document.getElementById('heroX');
      const y = document.getElementById('heroY');
      if (fit) fit.value = s.heroFit || 'cover';
      if (zoom) zoom.value = Number(s.heroZoom ?? 100);
      if (x) x.value = Number(s.heroX ?? 0);
      if (y) y.value = Number(s.heroY ?? 0);
    } catch (_) {}
  };

  // Keep the phone bezel identical on all four sides. The old status-area
  // rounded rectangle created small top-corner protrusions that looked like a case.
  drawPhone = function(x, y, w, h, brandMsg, customerMsg) {
    const phoneH = Math.round(h + 34);
    const phoneW = Math.round(phoneH * 0.515);
    const px = x + (w - phoneW) / 2;
    const py = y - 8;
    const frame = 7;
    const innerX = px + frame;
    const innerY = py + frame;
    const innerW = phoneW - frame * 2;
    const innerH = phoneH - frame * 2;
    const outerR = 49;
    const innerR = 42;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.24)';
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 11;
    rr(px, py, phoneW, phoneH, outerR, '#090A0B');
    ctx.restore();

    // Side buttons stay fully below the curved top corners.
    rr(px - 3, py + 118, 3, 52, 2, '#2A2B2D');
    rr(px - 3, py + 182, 3, 34, 2, '#2A2B2D');
    rr(px + phoneW, py + 150, 3, 66, 2, '#2A2B2D');

    // One continuous clipped screen. This makes the top bezel match the bottom bezel.
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(innerX, innerY, innerW, innerH, innerR);
    ctx.clip();
    ctx.fillStyle = '#EAF2EC';
    ctx.fillRect(innerX, innerY, innerW, innerH);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(innerX, innerY, innerW, 48);
    ctx.fillStyle = '#F7FAF7';
    ctx.fillRect(innerX, innerY + 46, innerW, 66);
    ctx.restore();

    // Thin inner edge gives the same physical depth at top, sides and bottom.
    rr(innerX, innerY, innerW, innerH, innerR, null, 'rgba(255,255,255,.18)', 1.2);

    // Dynamic Island.
    rr(px + phoneW / 2 - 35, py + 14, 70, 21, 12, '#111214');

    // Status bar.
    ctx.save();
    ctx.direction = 'ltr';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#202326';
    ctx.font = font(12, 750);
    ctx.textAlign = 'right';
    ctx.fillText('9:41', innerX + innerW - 14, innerY + 23);

    const bx = innerX + 16, by = innerY + 29;
    [5,8,11,14].forEach((hh,i) => rr(bx + i*5, by - hh, 3, hh, 1.5, '#202326'));

    const wx = innerX + 48, wy = innerY + 23;
    ctx.strokeStyle = '#202326';
    ctx.lineWidth = 1.7;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(wx, wy + 4, 10, Math.PI*1.18, Math.PI*1.82); ctx.stroke();
    ctx.beginPath(); ctx.arc(wx, wy + 4, 6, Math.PI*1.18, Math.PI*1.82); ctx.stroke();
    ellipse(wx, wy + 5, 1.6, 1.6, '#202326');

    const batX = innerX + 68, batY = innerY + 17;
    rr(batX, batY, 22, 12, 3, null, '#202326', 1.4);
    rr(batX + 2, batY + 2, 18, 8, 2, '#202326');
    rr(batX + 23, batY + 4, 2, 4, 1, '#202326');
    ctx.restore();

    // Chat header.
    ellipse(innerX + innerW - 29, innerY + 79, 14, 14, C.navy);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = font(13, 800, true);
    ctx.fillStyle = C.gold;
    ctx.fillText('S', innerX + innerW - 29, innerY + 79);
    ctx.restore();
    textBlock('Sertavo', innerX + innerW - 53, innerY + 65, innerW - 96, 18, C.ink, 800, 1.2, 'right');
    line(innerX + 14, innerY + 111, innerX + innerW - 14, innerY + 111, 'rgba(23,40,58,.08)', 1);

    const bubbleX = innerX + 16;
    const bubbleW = innerW - 44;
    const bubbleY = innerY + 132;
    const bubbleH = 158;
    rr(bubbleX, bubbleY, bubbleW, bubbleH, 20, '#FFFFFF');
    textBlock(brandMsg, bubbleX + bubbleW - 14, bubbleY + 22, bubbleW - 28, 18, C.ink, 500, 1.36, 'right');

    const customerW = bubbleW - 12;
    const customerX = innerX + innerW - customerW - 16;
    const customerY = bubbleY + bubbleH + 22;
    rr(customerX, customerY, customerW, 58, 18, '#D8F8C8');
    textBlock(customerMsg, customerX + customerW - 14, customerY + 15, customerW - 28, 18, C.ink, 700, 1.2, 'right');

    rr(px + phoneW / 2 - 38, py + phoneH - 19, 76, 5, 3, 'rgba(23,40,58,.28)');
  };

  // Keep media controls synced when the user switches carousel/slide.
  try {
    const originalSetForm = setForm;
    setForm = function() {
      const result = originalSetForm.apply(this, arguments);
      setTimeout(syncMediaControls, 0);
      return result;
    };
  } catch (_) {}

  const boot = () => {
    ensureMediaSettings();
    injectMediaControls();
    syncMediaControls();
    try { render(); } catch (_) {}
  };

  [0,100,300,700,1500].forEach(ms => setTimeout(boot, ms));
  document.addEventListener('DOMContentLoaded', boot);
  window.addEventListener('load', boot);
  window.__sertavoMediaPhoneVersion = VERSION;
})();