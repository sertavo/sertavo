(() => {
  const VERSION = '1.2.12';
  const applyVersion = () => {
    const badge = document.querySelector('.badge');
    if (badge && badge.textContent !== `v${VERSION}`) {
      badge.textContent = `v${VERSION}`;
    }
    document.title = `Sertavo Instagram Generator v${VERSION}`;
    const warn = document.querySelector('.note.warn');
    if (warn && !warn.innerHTML.includes(`v${VERSION}`)) {
      warn.innerHTML = `<strong>v${VERSION}:</strong> הושלם פוליש לפני פרסום: מוקאפ הווטסאפ קיבל פרופורציות של טלפון, רכיב הציון נשאר אחיד, והמחולל מזהיר לפני ייצוא שקופית ערכה ללא צילום אמיתי.`;
    }
  };

  applyVersion();
  document.addEventListener('DOMContentLoaded', applyVersion);
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
