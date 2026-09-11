(() => {
  const POLISH_VERSION = '1.2.11';

  // 1) Score component: one format everywhere.
  // Conversion/readability decision: numeric score + explicit Hebrew denominator.
  scoreRing = function(cx, cy, r, score = 89, navy = false) {
    const safeScore = Math.max(0, Math.min(100, Number(score) || 0));
    const lw = Math.max(10, Math.round(r * 0.153));
    const scoreSize = Math.max(38, Math.round(r * 0.62));
    const denominatorSize = Math.max(14, Math.round(r * 0.16));
    const scoreY = cy - Math.round(r * 0.09);
    const denominatorY = cy + Math.round(r * 0.39);

    ctx.save();
    ctx.lineCap = 'round';

    ctx.strokeStyle = navy ? 'rgba(255,255,255,.20)' : '#E9DFD1';
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = C.gold;
    ctx.beginPath();
    ctx.arc(
      cx,
      cy,
      r,
      -Math.PI / 2,
      -Math.PI / 2 + Math.PI * 2 * safeScore / 100
    );
    ctx.stroke();

    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = navy ? C.cream2 : C.ink;
    ctx.font = font(scoreSize, 800);
    ctx.fillText(String(safeScore), cx, scoreY);

    ctx.font = font(denominatorSize, 700);
    ctx.fillText('מתוך 100', cx, denominatorY);
    ctx.restore();
  };

  // 2) Optical centering for the heart icon.
  // Other semantic icons keep the v1.2.10 implementation.
  const previousIconCircle = iconCircle;
  iconCircle = function(cx, cy, type) {
    if (type !== 'heart') return previousIconCircle(cx, cy, type);

    ellipse(cx, cy, 29, 29, null, C.gold, 2);
    ctx.save();
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 2.3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // The original heart was mathematically symmetric but sat visually high.
    // Shift the glyph down slightly for optical centering inside the circle.
    const hy = cy + 4;
    ctx.beginPath();
    ctx.moveTo(cx, hy + 13);
    ctx.bezierCurveTo(cx - 4, hy + 8, cx - 17, hy - 1, cx - 17, hy - 11);
    ctx.bezierCurveTo(cx - 17, hy - 20, cx - 6, hy - 23, cx, hy - 15);
    ctx.bezierCurveTo(cx + 6, hy - 23, cx + 17, hy - 20, cx + 17, hy - 11);
    ctx.bezierCurveTo(cx + 17, hy - 1, cx + 4, hy + 8, cx, hy + 13);
    ctx.stroke();
    ctx.restore();
  };

  // 3) Clean punctuation for short UI-style list slides.
  // Preserve the locked slogan and intentional sentence punctuation elsewhere.
  const copyMigrations = [
    {
      carousel: 2,
      slide: 1,
      fields: {
        title: ['כמה שאלות קצרות.', 'כמה שאלות קצרות'],
        body: ['מה אהבת.\nאיך משתמשים בבושם.\nומה חשוב לך בבחירה.', 'מה אהבת\nאיך משתמשים בבושם\nומה חשוב לך בבחירה']
      }
    },
    {
      carousel: 2,
      slide: 2,
      fields: {
        title: ['מקבלים כיוון ברור.', 'מקבלים כיוון ברור'],
        body: ['מה מתאים לך יותר.\nמה שווה להשוות.\nולמה.', 'מה מתאים לך יותר\nמה שווה להשוות\nולמה']
      }
    }
  ];

  let migrated = false;
  for (const item of copyMigrations) {
    const defSlide = DEFAULTS[item.carousel]?.slides?.[item.slide];
    const liveSlide = project.carousels?.[item.carousel]?.slides?.[item.slide];
    if (!defSlide) continue;

    for (const [field, pair] of Object.entries(item.fields)) {
      const [oldValue, newValue] = pair;
      if (defSlide[field] === oldValue) defSlide[field] = newValue;
      if (liveSlide && liveSlide[field] === oldValue) {
        liveSlide[field] = newValue;
        migrated = true;
      }
    }
  }

  if (migrated) save();

  // Re-render after component overrides and safe copy migration.
  try {
    setForm();
    refreshImages();
  } catch (e) {
    try { render(); } catch (_) {}
  }

  window.__sertavoDesignPolishVersion = POLISH_VERSION;
})();
