(() => {
  const VERSION = '1.2.23';
  const applyVersion = () => {
    const badge = document.querySelector('.badge');
    if (badge && badge.textContent !== `v${VERSION}`) badge.textContent = `v${VERSION}`;
    document.title = `Sertavo Instagram Generator v${VERSION}`;
    const warn = document.querySelector('.note.warn');
    if (warn && !warn.innerHTML.includes(`v${VERSION}`)) {
      warn.innerHTML = `<strong>v${VERSION}:</strong> C3S4 תוקן בעקבות QA אמיתי: הכותרת קוצרה ל-"רוצה לבדוק על העור?" וערכת ההתנסות הועברה לטקסט המשני, כדי לשמור על מסר ממיר בלי שבירת היררכיה או חפיפה.`;
    }
  };

  const loadScriptOnce = (src, dataKey, dataValue) => {
    if (document.querySelector(`script[${dataKey}]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.setAttribute(dataKey, dataValue || '1');
    document.body.appendChild(script);
  };

  const loadEnhancements = () => {
    loadScriptOnce('ios-export-ux-1213.js?v=1213-prod1', 'data-ios-export-ux', '1');
    loadScriptOnce('design-polish-1215.js?v=1215-prod1', 'data-phone-polish-1215', '1');
    loadScriptOnce('frame-polish-1216.js?v=1216-prod1', 'data-frame-polish-1216', '1');
    loadScriptOnce('title-rule-polish-1217.js?v=1217-prod1', 'data-title-rule-polish-1217', '1');
    loadScriptOnce('carousel2-polish-1218.js?v=1218-prod1', 'data-carousel2-polish-1218', '1');
    loadScriptOnce('c3s4-kit-1219.js?v=1219-prod1', 'data-c3s4-kit-1219', '1');
    loadScriptOnce('c3s4-polish-1220.js?v=1220-prod1', 'data-c3s4-polish-1220', '1');
    loadScriptOnce('media-controls-phone-1221.js?v=1221-prod1', 'data-media-phone-1221', '1');
    loadScriptOnce('c3s4-copy-1223.js?v=1223-prod1', 'data-c3s4-copy-1223', '1');
  };

  applyVersion();
  loadEnhancements();
  document.addEventListener('DOMContentLoaded', () => { applyVersion(); loadEnhancements(); });
  window.addEventListener('load', applyVersion);
  setTimeout(applyVersion, 0);
  setTimeout(applyVersion, 100);
  setTimeout(applyVersion, 500);
  setTimeout(applyVersion, 1200);

  const observeBadge = () => {
    const badge = document.querySelector('.badge');
    if (!badge) return;
    const observer = new MutationObserver(applyVersion);
    observer.observe(badge, { childList: true, subtree: true, characterData: true });
  };
  observeBadge();
  document.addEventListener('DOMContentLoaded', observeBadge);
})();