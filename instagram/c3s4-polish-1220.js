(() => {
  const apply = () => {
    try {
      if (typeof templates === 'undefined' || typeof baseTitleBody === 'undefined' || typeof textBlock === 'undefined') return false;
      templates.c3s4 = function(){
        const {s}=baseTitleBody(C.cream,C.ink,C.ink,48);
        textBlock(s.title,540,155+s.titleShift,880,62*s.titleScale/100,C.ink,800,1.2);
        textBlock(s.body,540,330,760,31*s.bodyScale/100,C.ink,500,1.48);
        if(heroImg) photoFrame(heroImg,215,525+s.visualShift,650,463,32);
        else drawKit(255,570+s.visualShift,570,390);
        textBlock(s.cta,540,1115,760,28,C.gold,800,1.2);
        drawCounter();
      };
      if (typeof render === 'function') render();
      return true;
    } catch (e) {
      return false;
    }
  };

  [0,100,300,700,1500,3000].forEach(ms => setTimeout(apply, ms));
  document.addEventListener('DOMContentLoaded', apply);
  window.addEventListener('load', apply);
})();
