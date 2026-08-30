(() => {
  const FINAL_TITLE = 'רוצה לבדוק על העור?';
  const FINAL_BODY = 'אפשר להמשיך לערכת התנסות ולבדוק את הכיוונים על העור ולאורך זמן,\nלפני שמחליטים על בקבוק מלא.';
  const OLD_TITLES = new Set([
    'ואם רלוונטי - ערכת התנסות.',
    'רוצה לבדוק על העור? ערכת התנסות.',
    'רוצה לבדוק על העור?'
  ]);

  try {
    const defaultsSlide = DEFAULTS?.[2]?.slides?.[3];
    if (defaultsSlide) {
      defaultsSlide.title = FINAL_TITLE;
      defaultsSlide.body = FINAL_BODY;
    }

    const slide = project?.carousels?.[2]?.slides?.[3];
    if (slide && OLD_TITLES.has(String(slide.title || '').trim())) {
      slide.title = FINAL_TITLE;
      slide.body = FINAL_BODY;
      if (Number(slide.titleScale || 100) < 90 || Number(slide.titleScale || 100) > 110) slide.titleScale = 100;
      save();
    }

    if (typeof setForm === 'function') setForm();
    if (typeof refreshImages === 'function') refreshImages();
  } catch (_) {}
})();
