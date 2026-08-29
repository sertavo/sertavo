(() => {
  const VERSION = '1.2.17';
  const applyVersion = () => {
    const badge = document.querySelector('.badge');
    if (badge && badge.textContent !== `v${VERSION}`) badge.textContent = `v${VERSION}`;
    document.title = `Sertavo Instagram Generator v${VERSION}`;
    const warn = document.querySelector('.note.warn');
    if (warn && !warn.innerHTML.includes(`v${VERSION}`)) {
      warn.innerHTML = `<strong>v${VERSION}:</strong> קרוסלה 1 ננעלה בשפה אחידה ונקייה יותר: הקווים הדקורטיביים מתחת לכותרות בשקפים 1 ו-2 הוסרו, בעוד הדגשות זהב פונקציונליות נשמרו.`;
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
