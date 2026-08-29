(() => {
  const originalPhotoFrame = typeof photoFrame === 'function' ? photoFrame : null;
  if (!originalPhotoFrame) return;

  photoFrame = function(im, x, y, w, h, r = 28) {
    if (!im) return;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.clip();
    coverImage(im, x, y, w, h, 100);
    ctx.restore();

    const isC1S2 = (() => {
      try { return current()?.template === 'c1s2'; } catch (_) { return false; }
    })();

    const stroke = isC1S2 ? 'rgba(190,145,88,.22)' : 'rgba(190,145,88,.4)';
    const width = isC1S2 ? 1.25 : 2;
    rr(x, y, w, h, r, null, stroke, width);
  };

  try { render(); } catch (_) {}
  window.__sertavoFramePolishVersion = '1.2.16';
})();
