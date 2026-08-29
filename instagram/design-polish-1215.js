(() => {
  const POLISH_VERSION = '1.2.15';

  // Final copy/spacing migration for the locked C1 direction.
  try {
    let changed = false;
    const c1s1 = project?.carousels?.[0]?.slides?.[0];
    const c1s2 = project?.carousels?.[0]?.slides?.[1];

    if (c1s1 && Number(c1s1.titleScale || 100) === 100) {
      c1s1.titleScale = 106;
      changed = true;
    }

    if (c1s2) {
      const oldTitle = String(c1s2.title || '').trim();
      if (oldTitle === 'העור משנה את החוויה.' || oldTitle === 'החוויה משתנה על העור.') {
        c1s2.title = 'בושם משתנה על העור.';
        changed = true;
      }
    }

    if (changed) save();
  } catch (_) {}

  // Clearer premium skin visual: unmistakably a forearm with fragrance developing on skin.
  drawSkinVisual = function() {
    const cy = 635 + (current().visualShift || 0);
    const x1 = 155, x2 = 925;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.16)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 14;
    const skin = ctx.createLinearGradient(x1, cy - 90, x2, cy + 100);
    skin.addColorStop(0, '#EDC0A0');
    skin.addColorStop(.48, '#DFA681');
    skin.addColorStop(1, '#C98B69');
    ctx.beginPath();
    ctx.moveTo(x1, cy + 68);
    ctx.bezierCurveTo(260, cy + 34, 380, cy + 18, 520, cy + 22);
    ctx.bezierCurveTo(680, cy + 26, 820, cy + 45, x2, cy + 76);
    ctx.bezierCurveTo(900, cy + 128, 720, cy + 145, 530, cy + 140);
    ctx.bezierCurveTo(350, cy + 136, 215, cy + 122, x1, cy + 104);
    ctx.bezierCurveTo(138, cy + 94, 140, cy + 80, x1, cy + 68);
    ctx.closePath();
    ctx.fillStyle = skin;
    ctx.fill();
    ctx.restore();

    // Very subtle skin texture so the shape does not read as a flat graphic slab.
    ctx.save();
    ctx.globalAlpha = .16;
    for (let i = 0; i < 26; i++) {
      const px = 220 + ((i * 71) % 620);
      const py = cy + 55 + ((i * 29) % 58);
      ellipse(px, py, 1.4 + (i % 2), 1.4 + (i % 2), '#8C624D');
    }
    ctx.restore();

    // Fragrance contact point and restrained evaporation trails.
    const sx = 545, sy = cy + 53;
    const glow = ctx.createRadialGradient(sx, sy, 2, sx, sy, 34);
    glow.addColorStop(0, 'rgba(255,255,255,.95)');
    glow.addColorStop(.28, 'rgba(246,239,229,.72)');
    glow.addColorStop(1, 'rgba(246,239,229,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(sx, sy, 34, 0, Math.PI * 2);
    ctx.fill();
    ellipse(sx, sy, 6, 6, '#FFFDFC');

    const trail = (dx, peak, color, lw) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(sx, sy - 2);
      ctx.bezierCurveTo(sx + dx * .15, sy - 80, sx + dx * .55, sy - peak * .68, sx + dx, sy - peak);
      ctx.stroke();
      ctx.restore();
    };
    trail(-92, 185, 'rgba(246,239,229,.38)', 2.2);
    trail(68, 220, 'rgba(190,145,88,.80)', 2.4);

    // Fine scent particles, deliberately sparse to avoid a "magic effect".
    const pts = [[72,-166],[92,-185],[112,-202],[133,-214],[153,-225]];
    pts.forEach(([dx,dy],i) => ellipse(sx + dx, sy + dy, 2.2 + i*.18, 2.2 + i*.18, i < 2 ? 'rgba(246,239,229,.48)' : 'rgba(190,145,88,.62)'));
  };

  // Modern iPhone-style mockup tuned for Hebrew phone UI:
  // time on the right, connectivity + full battery on the left.
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

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.25)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 12;
    rr(px, py, phoneW, phoneH, 49, '#090A0B');
    ctx.restore();

    // Hardware cues.
    rr(px - 3, py + 108, 3, 54, 2, '#2A2B2D');
    rr(px - 3, py + 174, 3, 34, 2, '#2A2B2D');
    rr(px + phoneW, py + 142, 3, 68, 2, '#2A2B2D');

    // Screen + top status area.
    rr(innerX, innerY, innerW, innerH, 41, '#EAF2EC');
    rr(innerX, innerY, innerW, 47, 38, '#FFFFFF');

    // Dynamic Island.
    rr(px + phoneW / 2 - 35, py + 14, 70, 21, 12, '#111214');

    // Hebrew UI status bar: time on the right.
    ctx.save();
    ctx.direction = 'ltr';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#202326';
    ctx.font = font(12, 750);
    ctx.textAlign = 'right';
    ctx.fillText('9:41', innerX + innerW - 14, innerY + 23);

    // Cellular signal on the left.
    ctx.fillStyle = '#202326';
    const bx = innerX + 16, by = innerY + 29;
    [5,8,11,14].forEach((hh,i) => rr(bx + i*5, by - hh, 3, hh, 1.5, '#202326'));

    // Wi-Fi icon.
    const wx = innerX + 48, wy = innerY + 23;
    ctx.strokeStyle = '#202326';
    ctx.lineWidth = 1.7;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(wx, wy + 4, 10, Math.PI*1.18, Math.PI*1.82); ctx.stroke();
    ctx.beginPath(); ctx.arc(wx, wy + 4, 6, Math.PI*1.18, Math.PI*1.82); ctx.stroke();
    ellipse(wx, wy + 5, 1.6, 1.6, '#202326');

    // Full battery icon.
    const batX = innerX + 68, batY = innerY + 17;
    rr(batX, batY, 22, 12, 3, null, '#202326', 1.4);
    rr(batX + 2, batY + 2, 18, 8, 2, '#202326');
    rr(batX + 23, batY + 4, 2, 4, 1, '#202326');
    ctx.restore();

    // Chat header.
    rr(innerX, innerY + 46, innerW, 66, 0, '#F7FAF7');
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

    // Incoming Sertavo bubble on the left side of the chat.
    const bubbleX = innerX + 16;
    const bubbleW = innerW - 44;
    const bubbleY = innerY + 132;
    const bubbleH = 158;
    rr(bubbleX, bubbleY, bubbleW, bubbleH, 20, '#FFFFFF');
    textBlock(brandMsg, bubbleX + bubbleW - 14, bubbleY + 22, bubbleW - 28, 18, C.ink, 500, 1.36, 'right');

    // User reply on the right, as in WhatsApp sent-message behavior.
    const customerW = bubbleW - 12;
    const customerX = innerX + innerW - customerW - 16;
    const customerY = bubbleY + bubbleH + 22;
    rr(customerX, customerY, customerW, 58, 18, '#D8F8C8');
    textBlock(customerMsg, customerX + customerW - 14, customerY + 15, customerW - 28, 18, C.ink, 700, 1.2, 'right');

    // Home indicator.
    rr(px + phoneW / 2 - 38, py + phoneH - 19, 76, 5, 3, 'rgba(23,40,58,.28)');
  };

  try {
    setForm();
    refreshImages();
  } catch (_) {
    try { render(); } catch (_) {}
  }

  window.__sertavoDesignPolishVersion = POLISH_VERSION;
})();
