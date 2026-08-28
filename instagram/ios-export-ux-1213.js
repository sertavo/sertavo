(() => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (!isIOS) return;

  const share = document.getElementById('share');
  const download = document.getElementById('download');
  const actions = document.querySelector('.actions');

  if (share) share.textContent = 'שמור / שתף PNG';
  if (download) download.textContent = 'שמור לקבצים';

  if (actions && !document.getElementById('iosSaveHint')) {
    const hint = document.createElement('div');
    hint.id = 'iosSaveHint';
    hint.className = 'status';
    hint.style.gridColumn = '1 / -1';
    hint.style.marginTop = '4px';
    hint.textContent = 'באייפון: לתמונות בחר "שמור / שתף PNG" ואז "שמור תמונה". "שמור לקבצים" נשמר באפליקציית קבצים, בדרך כלל בתיקיית Downloads.';
    actions.appendChild(hint);
  }
})();
