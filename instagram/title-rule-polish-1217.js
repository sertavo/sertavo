(() => {
  const originalGoldRule = typeof goldRule === 'function' ? goldRule : null;
  if (!originalGoldRule) return;

  // Carousel 1 visual-language lock:
  // remove only the decorative gold rules directly under the titles of C1S1 and C1S2.
  // Keep functional gold accents elsewhere, including the emphasis inside C1S1 and CTA separators.
  goldRule = function(y, w = 160) {
    let template = '';
    try { template = current()?.template || ''; } catch (_) {}

    if (template === 'c1s1' && Number(w) === 116) return;
    if (template === 'c1s2' && Number(w) === 120) return;

    return originalGoldRule(y, w);
  };

  try { render(); } catch (_) {}
  window.__sertavoTitleRulePolishVersion = '1.2.17';
})();
