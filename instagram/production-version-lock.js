(() => {
  const VERSION = '1.2.13';
  const applyVersion = () => {
    const badge = document.querySelector('.badge');
    if (badge && badge.textContent !== `v${VERSION}`) badge.textContent = `v${VERSION}`;
    document.title = `Sertavo Instagram Generator v${VERSION}`;
    const warn = document.querySelector('.note.warn');
    if (warn && !warn.innerHTML.includes(`v${VERSION}`)) {
      warn.innerHTML = `<strong>v${VERSION}:</strong> הושלם QA לפני פרסום: מוקאפ הווטסאפ נראה כטלפון, רכיב הציון אחיד, קיימת אזהרה לפני ייצוא שקופית ערכה ללא צילום אמיתי, ובאייפון פעולות השמירה מסומנות לפי היעד בפועל.`;
    }
  };

  const loadIOSExportUX = () => {
    if (document.querySelector('script[data-ios-export-ux]')) return;
    const script = document.createElement('script');
    script.src = 'ios-export-ux-1213.js?v=1213-prod1';
    script.dataset.iosExportUx = '1';
    document.body.appendChild(script);
  };

  applyVersion();
  loadIOSExportUX();
  document.addEventListener('DOMContentLoaded', () => { applyVersion(); loadIOSExportUX(); });
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
