(() => {
  const FINAL_TITLE = 'רוצה לבדוק על העור? ערכת התנסות.';
  const OLD_TITLES = new Set([
    'ואם רלוונטי - ערכת התנסות.',
    'רוצה לבדוק על העור? ערכת התנסות.'
  ]);

  try {
    const defaultsSlide = DEFAULTS?.[2]?.slides?.[3];
    if (defaultsSlide) defaultsSlide.title = FINAL_TITLE;

    const slide = project?.carousels?.[2]?.slides?.[3];
    if (slide && OLD_TITLES.has(String(slide.title || '').trim())) {
      slide.title = FINAL_TITLE;
      save();
    }

    if (typeof setForm === 'function') setForm();
    if (typeof refreshImages === 'function') refreshImages();
  } catch (_) {}
})();
