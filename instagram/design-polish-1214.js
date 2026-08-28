(() => {
  const POLISH_VERSION = '1.2.14';

  // Premium mobile mockup polish: visually read as a modern iPhone-style device
  // without making the phone itself the hero of the slide.
  drawPhone = function(x, y, w, h, brandMsg, customerMsg) {
    const phoneH = Math.round(h + 28);
    const phoneW = Math.round(phoneH * 0.54);
    const px = x + (w - phoneW) / 2;
    const py = y - 10;
    const frame = 8;
    const innerX = px + frame;
    const innerY = py + frame;
    const innerW = phoneW - frame * 2;
    const innerH = phoneH - frame * 2;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.24)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 12;
    rr(px, py, phoneW, phoneH, 48, '#0A0A0B');
    ctx.restore();

    // Subtle side hardware cues.
    rr(px - 3, py + 112, 3, 58, 2, '#2C2D2F');
    rr(px - 3, py + 184, 3, 34, 2, '#2C2D2F');
    rr(px + phoneW, py + 145, 3, 72, 2, '#2C2D2F');

    // Screen.
    rr(innerX, innerY, innerW, innerH, 40, '#EAF2EC');

    // Status area with restrained premium-phone cues.
    rr(innerX, innerY, innerW, 44, 38, '#FFFFFF');
    rr(px + phoneW / 2 - 37, py + 14, 74, 22, 12, '#111214');
    ctx.save();
    ctx.direction = 'ltr';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = font(12, 700);
    ctx.fillStyle = '#202326';
    ctx.fillText('9:41', innerX + 15, innerY + 22);
    ctx.restore();
    // Tiny battery/signal suggestion.
    rr(innerX + innerW - 35, innerY + 17, 20, 10, 3, null, '#202326', 1.4);
    rr(innerX + innerW - 13, innerY + 20, 2, 4, 1, '#202326');
    ellipse(innerX + innerW - 54, innerY + 22, 2.4, 2.4, '#202326');
    ellipse(innerX + innerW - 62, innerY + 22, 2.4, 2.4, '#202326');

    // Chat header. Small avatar + name increases authenticity without adding noise.
    rr(innerX, innerY + 43, innerW, 64, 0, '#F7FAF7');
    ellipse(innerX + innerW - 31, innerY + 75, 14, 14, C.navy);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = font(13, 800, true);
    ctx.fillStyle = C.gold;
    ctx.fillText('S', innerX + innerW - 31, innerY + 75);
    ctx.restore();
    textBlock('Sertavo', innerX + innerW - 55, innerY + 61, innerW - 100, 18, C.ink, 800, 1.2, 'right');
    line(innerX + 14, innerY + 106, innerX + innerW - 14, innerY + 106, 'rgba(23,40,58,.08)', 1);

    // Brand message bubble.
    const bubbleX = innerX + 17;
    const bubbleW = innerW - 34;
    const bubbleY = innerY + 126;
    const bubbleH = 158;
    rr(bubbleX, bubbleY, bubbleW, bubbleH, 20, '#FFFFFF');
    textBlock(brandMsg, bubbleX + bubbleW - 14, bubbleY + 22, bubbleW - 28, 18, C.ink, 500, 1.36, 'right');

    // Customer response bubble.
    const customerY = bubbleY + bubbleH + 22;
    rr(bubbleX + 16, customerY, bubbleW - 16, 58, 18, '#D8F8C8');
    textBlock(customerMsg, bubbleX + 31, customerY + 15, bubbleW - 46, 18, C.ink, 700, 1.2, 'left');

    // Home indicator.
    rr(px + phoneW / 2 - 38, py + phoneH - 20, 76, 5, 3, 'rgba(23,40,58,.28)');
  };

  try { render(); } catch (_) {}
  window.__sertavoDesignPolishVersion = POLISH_VERSION;
})();
