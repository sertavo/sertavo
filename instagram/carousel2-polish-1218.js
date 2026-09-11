(() => {
  if (typeof templates !== 'object') return;

  templates.c2s3 = function() {
    const { s } = baseTitleBody(C.cream, C.ink, C.ink, 50);
    textBlock(s.title, 540, 175 + s.titleShift, 860, 64 * s.titleScale / 100, C.ink, 800, 1.2);

    const cy = 565 + s.visualShift;
    const leftX = 462;
    const rightX = 618;
    const r = 112;

    ctx.save();
    ctx.shadowColor = 'rgba(23,40,58,.10)';
    ctx.shadowBlur = 22;
    ellipse(leftX, cy, r, r, 'rgba(255,255,255,.60)', 'rgba(23,40,58,.48)', 3);
    ellipse(rightX, cy, r, r, 'rgba(255,246,225,.64)', 'rgba(190,145,88,.72)', 3);
    ctx.restore();

    ellipse(540, cy, 70, 112, 'rgba(190,145,88,.11)');

    textBlock('כיוון נוסף', leftX, cy + 132, 190, 20, C.muted, 650, 1.2);
    textBlock('כיוון מוביל', rightX, cy + 132, 190, 20, C.gold, 700, 1.2);

    textBlock(s.body, 540, 785, 770, 33 * s.bodyScale / 100, C.ink, 500, 1.5);
    textBlock(s.support, 540, 1040, 750, 23, C.muted, 500, 1.4);
    drawCounter();
  };

  templates.c2s4 = function() {
    const { s } = baseTitleBody(C.navy, C.cream2, C.cream2, 46);
    textBlock(s.title, 540, 170 + s.titleShift, 820, 68 * s.titleScale / 100, C.cream2, 800, 1.18);
    textBlock(s.body, 540, 470, 760, 32 * s.bodyScale / 100, C.cream2, 500, 1.55);
    goldRule(840, 380);
    textBlock(s.support, 540, 900, 760, 27, C.cream2, 650, 1.4);
    textBlock(s.cta, 540, 1120, 760, 27, C.gold, 800, 1.2);
    drawCounter();
  };

  try { render(); } catch (_) {}
  window.__sertavoCarousel2PolishVersion = '1.2.18';
})();
