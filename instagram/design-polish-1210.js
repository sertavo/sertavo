(() => {
  const POLISH_VERSION = '1.2.10';
  const NEW_BUILTIN_LOGO = 'data:image/png;base64,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';

  // 1) Brand logo becomes the built-in default.
  // Migrate once on this device, then allow normal custom-logo overrides.
  const logoMigrationKey = 'sertavoLogoBuiltin1210Applied';
  try {
    if (localStorage.getItem(logoMigrationKey) !== '1') {
      project.logoData = NEW_BUILTIN_LOGO;
      localStorage.setItem(logoMigrationKey, '1');
      save();
    }
  } catch (e) {
    project.logoData = NEW_BUILTIN_LOGO;
  }

  // Keep the uploaded/full wordmark visually consistent across all 12 slides.
  drawLogo = function(_y = 52, _w = 180) {
    if (!logoImg) return;
    const w = 180;
    const ratio = logoImg.height / logoImg.width;
    const h = w * ratio;
    const y = 52;
    ctx.drawImage(logoImg, (W - w) / 2, y, w, h);
  };

  // 2) Standard title-safe-zone. We preserve the user's manual titleShift,
  // but add a locked baseline so logo/title spacing is consistent.
  const titleBaselineOffset = {
    c1s1: 0,
    c1s2: 40,
    c1s3: 35,
    c1s4: 65,
    c2s1: 45,
    c2s2: 60,
    c2s3: 45,
    c2s4: 50,
    c3s1: 45,
    c3s2: 35,
    c3s3: 60,
    c3s4: 65
  };
  render = function() {
    const s = current();
    const originalShift = Number(s.titleShift || 0);
    const baseline = titleBaselineOffset[s.template] || 0;
    s.titleShift = originalShift + baseline;
    try {
      (templates[s.template] || template_c1s1)();
    } finally {
      s.titleShift = originalShift;
    }
  };

  // 3) One proportional score component everywhere.
  // Keeps 89 and /100 centered correctly at every ring size.
  scoreRing = function(cx, cy, r, score = 89, navy = false) {
    const lw = Math.max(10, Math.round(r * 0.153));
    const scoreSize = Math.max(40, Math.round(r * 0.644));
    const subSize = Math.max(13, Math.round(r * 0.203));
    const scoreY = cy - Math.round(r * 0.068);
    const subY = cy + Math.round(r * 0.424);

    ctx.save();
    ctx.lineCap = 'round';
    ctx.strokeStyle = navy ? 'rgba(255,255,255,.2)' : '#E9DFD1';
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = C.gold;
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(0, Math.min(100, score)) / 100);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = navy ? C.cream2 : C.ink;
    ctx.font = font(scoreSize, 800);
    ctx.fillText(score, cx, scoreY);
    ctx.font = font(subSize, 700);
    ctx.fillText('/100', cx, subY);
    ctx.restore();
  };

  // 4) More self-explanatory icons for C3S2.
  iconCircle = function(cx, cy, type) {
    ellipse(cx, cy, 29, 29, null, C.gold, 2);
    ctx.save();
    ctx.strokeStyle = C.ink;
    ctx.fillStyle = 'transparent';
    ctx.lineWidth = 2.3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    if (type === 'heart') {
      // Standard heart outline.
      ctx.moveTo(cx, cy + 13);
      ctx.bezierCurveTo(cx - 4, cy + 8, cx - 17, cy - 1, cx - 17, cy - 11);
      ctx.bezierCurveTo(cx - 17, cy - 20, cx - 6, cy - 23, cx, cy - 15);
      ctx.bezierCurveTo(cx + 6, cy - 23, cx + 17, cy - 20, cx + 17, cy - 11);
      ctx.bezierCurveTo(cx + 17, cy - 1, cx + 4, cy + 8, cx, cy + 13);
      ctx.stroke();
    } else if (type === 'spray') {
      // Generic atomizer/spray icon - communicates perfume use directly.
      ctx.strokeRect(cx - 9, cy - 7, 18, 20);
      ctx.moveTo(cx - 5, cy - 7);
      ctx.lineTo(cx - 5, cy - 13);
      ctx.lineTo(cx + 8, cy - 13);
      ctx.lineTo(cx + 8, cy - 9);
      ctx.moveTo(cx + 11, cy - 12);
      ctx.lineTo(cx + 17, cy - 15);
      ctx.moveTo(cx + 12, cy - 7);
      ctx.lineTo(cx + 19, cy - 7);
      ctx.moveTo(cx + 11, cy - 2);
      ctx.lineTo(cx + 17, cy + 1);
      ctx.stroke();
    } else if (type === 'checklist') {
      // Simple priority/checklist icon - clearer than abstract sliders.
      const y1 = cy - 10, y2 = cy, y3 = cy + 10;
      [[y1],[y2],[y3]].forEach(([yy]) => {
        ctx.moveTo(cx - 15, yy);
        ctx.lineTo(cx - 11, yy + 4);
        ctx.lineTo(cx - 6, yy - 4);
        ctx.moveTo(cx - 1, yy);
        ctx.lineTo(cx + 14, yy);
      });
      ctx.stroke();
    } else if (type === 'clock') {
      ctx.arc(cx, cy, 13, 0, Math.PI * 2);
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, cy - 8);
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 7, cy + 4);
      ctx.stroke();
    } else {
      ctx.moveTo(cx - 13, cy - 10);ctx.lineTo(cx + 13, cy - 10);
      ctx.moveTo(cx - 8, cy);ctx.lineTo(cx + 8, cy);
      ctx.moveTo(cx - 13, cy + 10);ctx.lineTo(cx + 13, cy + 10);
      ctx.stroke();
    }
    ctx.restore();
  };

  template_c3s2 = function() {
    const { s } = baseTitleBody(C.cream, C.ink, C.ink, 50);
    textBlock(s.title, 540, 185 + s.titleShift, 850, 66 * s.titleScale / 100, C.ink, 800, 1.2);
    const lines = String(s.body).split('\n');
    const ys = [470, 650, 830];
    const icons = ['heart', 'spray', 'checklist'];
    for (let i = 0; i < 3; i++) {
      rr(150, ys[i] - 48, 780, 96, 24, 'rgba(255,255,255,.62)', 'rgba(190,145,88,.28)', 2);
      iconCircle(858, ys[i], icons[i]);
      textBlock(lines[i] || '', 810, ys[i] - 22, 570, 34 * s.bodyScale / 100, C.ink, 600, 1.3, 'right');
    }
    drawCounter();
  };
  templates.c3s2 = template_c3s2;

  // 5) Punctuation rule: headlines may keep terminal punctuation;
  // list items do not use full stops.
  const oldC3S2 = 'מה אהבת.\nאיך משתמשים בבושם.\nומה חשוב לך בבחירה.';
  const newC3S2 = 'מה אהבת\nאיך משתמשים בבושם\nומה חשוב לך בבחירה';
  const oldC3S3 = 'מה מתאים לך יותר.\nמה שווה להשוות.\nולמה.';
  const newC3S3 = 'מה מתאים לך יותר\nמה שווה להשוות\nולמה';
  DEFAULTS[2].slides[1].body = newC3S2;
  DEFAULTS[2].slides[2].body = newC3S3;
  if (project.carousels?.[2]?.slides?.[1]?.body === oldC3S2) project.carousels[2].slides[1].body = newC3S2;
  if (project.carousels?.[2]?.slides?.[2]?.body === oldC3S3) project.carousels[2].slides[2].body = newC3S3;

  // 6) Production preference for C3S4: real kit photography is proof.
  const originalSetForm = setForm;
  setForm = function() {
    originalSetForm();
    const s = current();
    if (s.template === 'c3s4') {
      $('imageHint').textContent = 'לפרסום: מומלץ להשתמש בצילום אמיתי של ערכת ההתנסות. האיור המובנה הוא placeholder בלבד.';
    }
  };

  // Restore/reset must use the new built-in wordmark, not the legacy file.
  $('restoreLogo').onclick = () => {
    project.logoData = NEW_BUILTIN_LOGO;
    save();
    $('logoStatus').textContent = 'הלוגו המעודכן מובנה במחולל';
    refreshImages();
    $('status').textContent = 'הלוגו המובנה שוחזר.';
  };
  $('resetAll').onclick = () => {
    if (confirm('לאפס את כל 12 השקופיות?')) {
      project = { carousels: deepClone(DEFAULTS), logoData: NEW_BUILTIN_LOGO };
      save();
      setForm();
    }
  };

  // Re-save any migrated copy and refresh the canvas after all overrides are active.
  save();
  setForm();
  refreshImages();

  window.SERTAVO_POLISH_VERSION = POLISH_VERSION;
})();
