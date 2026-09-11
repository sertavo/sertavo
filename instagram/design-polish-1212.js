(() => {
  const POLISH_VERSION = '1.2.12';

  // Final pre-publish visual polish.
  // 1) WhatsApp mockups should read as a real mobile phone, not a square card.
  drawPhone = function(x, y, w, h, brandMsg, customerMsg) {
    const phoneW = Math.min(332, Math.round(w * 0.79));
    const phoneH = h;
    const px = x + (w - phoneW) / 2;
    const py = y;
    const frame = 11;
    const innerX = px + frame;
    const innerY = py + frame;
    const innerW = phoneW - frame * 2;
    const innerH = phoneH - frame * 2;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.22)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 9;
    rr(px, py, phoneW, phoneH, 46, '#0B0B0C');
    ctx.restore();

    rr(innerX, innerY, innerW, innerH, 36, '#E9F1EA');

    // Status / speaker area makes the silhouette read immediately as a phone.
    rr(innerX, innerY, innerW, 54, 34, '#FFFFFF');
    rr(px + phoneW / 2 - 34, py + 18, 68, 7, 4, '#17191B');
    ellipse(px + phoneW - 31, py + 22, 4, 4, '#17191B');

    // Chat header.
    rr(innerX, innerY + 47, innerW, 58, 0, '#F7FAF7');
    textBlock('Sertavo', px + phoneW / 2, py + 63, innerW - 50, 21, C.ink, 800, 1.2);
    line(innerX + 22, innerY + 104, innerX + innerW - 22, innerY + 104, 'rgba(23,40,58,.08)', 1);

    // Brand bubble.
    const bubbleX = innerX + 24;
    const bubbleW = innerW - 48;
    const bubbleY = innerY + 126;
    const bubbleH = 154;
    rr(bubbleX, bubbleY, bubbleW, bubbleH, 22, '#FFFFFF');
    textBlock(brandMsg, bubbleX + bubbleW - 18, bubbleY + 23, bubbleW - 36, 22, C.ink, 500, 1.38, 'right');

    // Customer bubble.
    const customerY = bubbleY + bubbleH + 30;
    rr(bubbleX + 18, customerY, bubbleW - 18, 60, 19, '#D8F8C8');
    textBlock(customerMsg, bubbleX + 35, customerY + 16, bubbleW - 62, 21, C.ink, 700, 1.2, 'left');

    // Home indicator.
    rr(px + phoneW / 2 - 42, py + phoneH - 23, 84, 5, 3, 'rgba(23,40,58,.25)');
  };

  // 2) Keep the actual-kit-photo requirement explicit in the editor.
  // The built-in kit illustration remains a QA placeholder only.
  const previousSetForm = setForm;
  setForm = function() {
    previousSetForm();
    const s = current();
    if (s.template === 'c3s4') {
      const hint = $('imageHint');
      if (hint) {
        hint.textContent = s.heroData
          ? 'צילום הערכה האמיתי פעיל בשקופית.'
          : 'חובה לפני פרסום: העלה צילום אמיתי של ערכת ההתנסות. האיור המובנה הוא placeholder ל-QA בלבד.';
      }
    }
  };

  // 3) Guard against accidentally exporting the kit placeholder as final creative.
  const needsRealKitPhoto = () => current()?.template === 'c3s4' && !current()?.heroData;
  const guardFinalKitExport = (ev) => {
    if (!needsRealKitPhoto()) return;
    const ok = window.confirm('בשקופית הזו עדיין מופיע איור placeholder של הערכה. לפרסום סופי מומלץ להעלות צילום אמיתי. להמשיך לייצוא בכל זאת?');
    if (!ok) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
    }
  };
  $('download')?.addEventListener('click', guardFinalKitExport, true);
  $('share')?.addEventListener('click', guardFinalKitExport, true);

  // Refresh after the overrides.
  try {
    setForm();
    refreshImages();
  } catch (e) {
    try { render(); } catch (_) {}
  }

  window.__sertavoDesignPolishVersion = POLISH_VERSION;
})();
