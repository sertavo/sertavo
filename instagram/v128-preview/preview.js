(() => {
  const VERSION='1.2.8';
  const STORAGE='sertavoIGv128';
  const LEGACY='sertavoIGv125';

  function normalizeDash(v){return String(v||'').replace(/[\u2013\u2014\u2212]/g,'-')}
  function same(a,b){return normalizeDash(a).replace(/\r/g,'').trim()===normalizeDash(b).replace(/\r/g,'').trim()}

  try{
    const fresh=JSON.parse(localStorage.getItem(STORAGE)||'null');
    const legacy=JSON.parse(localStorage.getItem(LEGACY)||'null');
    if(fresh?.carousels) project=fresh;
    else if(legacy?.carousels) project=legacy;
  }catch(e){}

  save=function(){
    try{
      localStorage.setItem(STORAGE,JSON.stringify(project));
      $('status').textContent='נשמר אוטומטית במכשיר.';
    }catch(e){
      $('status').textContent='השמירה המקומית נכשלה.';
    }
  };

  // Brand typography is locked. Size remains adjustable through the controlled title/body scale fields.
  font=function(size,weight=500,serif=false){return `${weight} ${size}px ${serif?'Georgia':'Heebo, Arial, sans-serif'}`};

  // Final visual polish for Carousel 1 slides 2 and 3.
  function polishedC1S2(){
    const {s}=baseTitleBody(C.navy,C.cream2,C.cream2,52);
    textBlock(s.title,540,180+s.titleShift,850,70*s.titleScale/100,C.cream2,800,1.2);
    goldRule(330,120);
    const y=545+s.visualShift;
    if(heroImg){
      photoFrame(heroImg,160,390+s.visualShift,760,470,34);
    }else{
      ctx.save();
      const skin=ctx.createLinearGradient(230,y+30,850,y+150);
      skin.addColorStop(0,'#C99070');skin.addColorStop(.48,'#DFA987');skin.addColorStop(1,'#C78968');
      ctx.beginPath();ctx.moveTo(215,y+76);ctx.bezierCurveTo(350,y+35,700,y+28,865,y+72);ctx.bezierCurveTo(885,y+78,892,y+96,883,y+113);ctx.bezierCurveTo(740,y+142,370,y+151,220,y+126);ctx.bezierCurveTo(204,y+118,201,y+91,215,y+76);ctx.closePath();ctx.fillStyle=skin;ctx.fill();
      const shine=ctx.createLinearGradient(300,y+45,760,y+125);shine.addColorStop(0,'rgba(255,245,235,.10)');shine.addColorStop(.55,'rgba(255,245,235,.22)');shine.addColorStop(1,'rgba(255,245,235,0)');ctx.fillStyle=shine;ctx.fill();
      const px=548,py=y+78;const bloom=ctx.createRadialGradient(px,py,2,px,py,48);bloom.addColorStop(0,'rgba(255,250,242,.55)');bloom.addColorStop(.38,'rgba(190,145,88,.20)');bloom.addColorStop(1,'rgba(190,145,88,0)');ctx.fillStyle=bloom;ctx.beginPath();ctx.arc(px,py,48,0,Math.PI*2);ctx.fill();ellipse(px,py,6,6,'#FFF7ED');
      [[606,y-42,3.4,.60],[631,y-65,3,.50],[654,y-86,2.5,.42],[674,y-106,2,.34]].forEach(m=>ellipse(m[0],m[1],m[2],m[2],`rgba(246,239,229,${m[3]})`));
      ctx.lineCap='round';ctx.strokeStyle='rgba(246,239,229,.28)';ctx.lineWidth=1.25;ctx.beginPath();ctx.moveTo(px-9,py-9);ctx.bezierCurveTo(515,y+22,518,y-26,492,y-69);ctx.stroke();
      ctx.strokeStyle='rgba(190,145,88,.62)';ctx.lineWidth=1.55;ctx.beginPath();ctx.moveTo(px+9,py-9);ctx.bezierCurveTo(575,y+21,580,y-26,612,y-62);ctx.bezierCurveTo(630,y-82,644,y-98,662,y-112);ctx.stroke();
      ctx.restore();
    }
    textBlock(s.body,540,900,820,30*s.bodyScale/100,C.cream2,500,1.45);drawCounter();
  }

  function polishedC1S3(){
    const {s}=baseTitleBody(C.cream,C.ink,C.ink,52);
    textBlock(s.title,540,185+s.titleShift,880,64*s.titleScale/100,C.ink,800,1.2);
    const y=610+s.visualShift;ctx.save();
    ctx.strokeStyle='rgba(190,145,88,.56)';ctx.lineWidth=2.6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(825,y+8);ctx.bezierCurveTo(720,y-42,635,y+40,545,y);ctx.bezierCurveTo(450,y-36,360,y+30,255,y-12);ctx.stroke();
    const stages=[{x:805,yy:y+5,label:'פתיחה',r:34,a:.27},{x:545,yy:y,label:'מתפתח',r:66,a:.21},{x:275,yy:y-8,label:'נשאר',r:48,a:.16}];
    stages.forEach((st,i)=>{const rg=ctx.createRadialGradient(st.x,st.yy,1,st.x,st.yy,st.r*1.65);rg.addColorStop(0,`rgba(190,145,88,${st.a})`);rg.addColorStop(1,'rgba(190,145,88,0)');ctx.fillStyle=rg;ctx.beginPath();ctx.arc(st.x,st.yy,st.r*1.65,0,Math.PI*2);ctx.fill();ellipse(st.x,st.yy,i===1?7:6.5,i===1?7:6.5,C.gold);textBlock(st.label,st.x,st.yy+65,150,19,i===1?C.gold:C.muted,700,1.2)});
    ctx.restore();textBlock(s.body,540,835,820,30*s.bodyScale/100,C.ink,500,1.45);drawCounter();
  }
  templates.c1s2=polishedC1S2;
  templates.c1s3=polishedC1S3;

  const COPY={
    c1s1:{title:['לפני שקונים, בודקים.','בוחרים לפני שקונים.','פחות ניחוש לפני קנייה.'],body:['דרך חכמה יותר לבחור בושם שמתאים לך.','בוחרים מדויק יותר, לפני שקונים.','פחות ניחושים. יותר התאמה.'],support:[],cta:['בדיקת התאמה - לינק בביו','להתחלת בדיקת ההתאמה - לינק בביו','מתחילים בלינק שבביו']},
    c1s2:{title:['בושם משתנה על העור.','הריח משתנה על העור.','העור משנה את החוויה.'],body:['מה שמרשים בהתחלה, לא תמיד מרגיש נכון בהמשך.','הרושם הראשון לא מספר הכול.','מה שמרגיש נכון עכשיו יכול להשתנות בהמשך.'],support:['הרושם הראשון הוא רק חלק מהתמונה.','כדאי לתת לבושם זמן.','לא רק הפתיחה קובעת.'],cta:[]},
    c1s3:{title:['הריסוס הראשון הוא רק ההתחלה.','מה שמריחים בהתחלה הוא רק שלב אחד.','כדי להבין בושם, צריך לתת לו זמן.'],body:['העור, מזג האוויר והזמן משנים איך הבושם מתפתח.','הבושם משתנה לאורך היום.','מה שמריחים עכשיו יכול להרגיש אחרת בהמשך.'],support:['פתיחה. התפתחות. מה שנשאר.','לא רק הפתיחה קובעת.','מה שנשאר חשוב לא פחות.'],cta:[]},
    c1s4:{title:['רוצה לבדוק מה יכול להתאים לך?','רוצה כיוון מדויק יותר?','אפשר להתחיל מכאן.'],body:['מתחילים בכמה שאלות קצרות בוואטסאפ.','מתחילים בכמה שאלות קצרות.','כמה שאלות קצרות, ומקבלים כיוון.'],support:['בדיקת התאמה אישית לפני קנייה.','מתחילים קצר ומתקדמים רק אם רלוונטי.','פשוט, קצר וממוקד.'],cta:['בדיקת התאמה - לינק בביו','להתחלת בדיקת ההתאמה - לינק בביו','מתחילים בלינק שבביו']},
    c2s1:{title:['לא עוד "נראה לי".\nמקבלים כיוון ברור.','לא רק המלצה.\nגם הסבר למה.','פחות ניחוש.\nיותר בהירות.'],body:['לא רק המלצה. גם הסבר למה.','מקבלים כיוון, וגם את הסיבה.','לא מנחשים. מבינים למה.'],support:['הכיוון נשען על מה שסיפרת לנו.','ההמלצה מגיעה עם הסבר.','פחות ניחוש, יותר סינון.'],cta:[]},
    c2s2:{title:['כיוון מוביל שמתאים לך.','כיוון מוביל, ברור ומנומק.','מתחילים מהכיוון החזק ביותר.'],body:['כיוון שמתאים למה שסיפרת ולדרך שבה רצית שהבושם יורגש.','כיוון שמתאים למה שסיפרת.','הכיוון המוביל מבוסס על מה שסיפרת לנו.'],support:['הציון משקף עד כמה הכיוון מתאים למה שסיפרת לנו.','הציון משקף את ההתאמה למה שסיפרת.','ציון התאמה המבוסס על מה שסיפרת לנו.'],cta:[]},
    c2s3:{title:['כיוון נוסף להשוואה.','עוד כיוון, כדי להשוות נכון.','כיוון נוסף לבדיקת העדפה.'],body:['כיוון שונה מעט, כדי להבין מה מרגיש נכון יותר על העור.','כיוון נוסף להשוואה על העור.','משווים כיוון נוסף כדי לחדד העדפה.'],support:['הכיוון נועד להשוואה, לא דירוג או עדיפות.','להשוואה, לא לדירוג.','המטרה היא להשוות, לא לדרג.'],cta:[]},
    c2s4:{title:['לא רק מה מתאים לך.\nגם למה.','לא רק התוצאה.\nגם ההיגיון.','מבינים מה מתאים, וגם למה.'],body:['מה אהבת.\nאיך משתמשים בבושם.\nומה חשוב לך בבחירה.','מה אהבת.\nאיך משתמשים.\nמה חשוב לך.','ההמלצה מתחילה במה שסיפרת לנו.'],support:['כדי להבין מה שווה לנסות - ומה פחות.','כדי לדעת מה שווה לנסות.','פחות ניחוש, יותר סינון.'],cta:['בדיקת התאמה - לינק בביו','להתחלת בדיקת ההתאמה - לינק בביו','מתחילים בלינק שבביו']},
    c3s1:{title:['איך עובדת בדיקת ההתאמה?','איך זה עובד?','כך מתחילים.'],body:['פשוט יותר ממה שנדמה.','מתחילים בכמה שאלות קצרות.','כמה שאלות קצרות, וזה מתחיל.'],support:['כמה צעדים קצרים, ותמונה ברורה יותר.','קצר, פשוט וממוקד.','מתחילים מהעדפות שלך.'],cta:[]},
    c3s2:{title:['כמה שאלות קצרות.','מתחילים בכמה שאלות.','שלב ראשון: להבין מה חשוב לך.'],body:['מה אהבת.\nאיך משתמשים בבושם.\nומה חשוב לך בבחירה.','מה אהבת.\nאיך משתמשים.\nמה חשוב לך.','כמה שאלות שממקדות את הבחירה.'],support:['כדי להבין מה באמת שווה לנסות.','כדי למקד את הכיוון.','רק מה שרלוונטי לבחירה.'],cta:[]},
    c3s3:{title:['מקבלים כיוון ברור.','התוצאה: כיוון ברור.','פחות בלבול. יותר בהירות.'],body:['מה מתאים לך יותר.\nמה שווה להשוות.\nולמה.','מה מתאים.\nמה להשוות.\nולמה.','מקבלים כיוון ברור, לא רשימת אפשרויות.'],support:['לא רק תשובה. גם הסבר.','כיוון מוביל ועוד נקודת השוואה.','ממוקד במה ששווה לבדוק.'],cta:[]},
    c3s4:{title:['ואם רלוונטי - ערכת התנסות.','אם רלוונטי - ממשיכים להתנסות.','השלב הבא: לבדוק על העור.'],body:['כדי לבדוק את הכיוונים על העור ולאורך זמן, לפני שמחליטים על בקבוק מלא.','בודקים על העור לפני בקבוק מלא.','מתנסים קודם. מחליטים אחר כך.'],support:['התנסות אמיתית לפני החלטה.','בודקים לאורך זמן, לא רק בריסוס ראשון.','רק אם זה רלוונטי עבורך.'],cta:['בדיקת התאמה - לינק בביו','להתחלת בדיקת ההתאמה - לינק בביו','מתחילים בלינק שבביו']}
  };

  const ids={title:'title',body:'body',support:'support',cta:'cta'};
  const labels={title:'כותרת',body:'טקסט',support:'הבהרה',cta:'CTA'};
  const variants=['מומלץ','קצר','ישיר'];
  let activeField='body';

  const contentSection=[...document.querySelectorAll('.section')].find(s=>s.querySelector('h2')?.textContent.trim()==='תוכן');
  const studio=document.createElement('div');
  studio.className='copyStudioV128';studio.id='copyStudioV128';
  studio.innerHTML='<div class="copyStudioTopV128"><div class="copyStudioTitleV128">עוזר ניסוח</div><span class="copyHealthV128" id="copyHealthV128"></span></div><div class="copyStudioHintV128">בחר שדה, ואז בחר נוסח. לחיצה מחליפה רק את השדה שבחרת ומעדכנת מיד את השקופית.</div><div class="fieldTabsV128" id="fieldTabsV128"></div><div class="suggestionBtnsV128" id="suggestionBtnsV128"></div><div class="copyPreviewV128" id="copyPreviewV128"></div><div class="copyToastV128" id="copyToastV128"></div><div class="copyExampleV128" id="copyExampleV128" hidden></div><div class="copyRuleV128">הנוסחים הם הצעות עריכה. שום דבר לא משתנה בלי לחיצה שלך.</div>';
  contentSection?.appendChild(studio);

  const tabs=$('fieldTabsV128');
  const variantsBox=$('suggestionBtnsV128');
  Object.keys(ids).forEach(k=>{const b=document.createElement('button');b.type='button';b.textContent=labels[k];b.dataset.field=k;b.addEventListener('click',()=>{activeField=k;refreshStudio()});tabs.appendChild(b)});
  variants.forEach((label,i)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.i=i;b.addEventListener('click',()=>applySuggestion(i));variantsBox.appendChild(b)});

  function getSet(){return COPY[current().template]?.[activeField]||[]}
  function lineCount(value,field){if(!value)return 0;try{if(field==='title')return wrap(value,860,60*(current().titleScale/100),700).length;if(field==='body')return wrap(value,820,28*(current().bodyScale/100),500).length;return String(value).split('\n').length}catch(e){return String(value).split('\n').length}}
  function health(){const v=String(current()[activeField]||'');if(!v)return{ok:true,text:'השדה ריק'};if(activeField==='title'){const n=lineCount(v,'title');return{ok:n<=2,text:n<=2?'אורך תקין':`${n} שורות - מומלץ לקצר`}}if(activeField==='body'){const n=lineCount(v,'body'),max=['c2s2','c2s4','c3s2','c3s3'].includes(current().template)?3:2;return{ok:n<=max,text:n<=max?'אורך תקין':`${n} שורות - מומלץ לקצר`}}if(activeField==='support')return{ok:v.length<=75,text:v.length<=75?'אורך תקין':`${v.length} תווים - מומלץ לקצר`};return{ok:v.length<=36,text:v.length<=36?'אורך תקין':`${v.length} תווים - מומלץ לקצר`}}

  function applySuggestion(i){const val=getSet()[i];if(val==null)return;const clean=normalizeDash(val);current()[activeField]=clean;const el=$(ids[activeField]);if(el)el.value=clean;save();render();$('copyToastV128').textContent=`הנוסח הוחל על ${labels[activeField]}.`;refreshStudio();setTimeout(()=>{if($('copyToastV128'))$('copyToastV128').textContent=''},1200)}

  function refreshStudio(){
    if(!studio.isConnected)return;
    const set=getSet(),value=String(current()[activeField]||'');
    tabs.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.field===activeField));
    variantsBox.querySelectorAll('button').forEach((b,i)=>{const val=set[i];b.disabled=val==null;b.classList.toggle('active',val!=null&&same(value,val))});
    $('copyPreviewV128').textContent=set[0]?`הנוסח המומלץ לשדה הזה: ${normalizeDash(set[0]).replace(/\n/g,' / ')}`:'אין צורך להוסיף תוכן בשדה הזה בשקופית הנוכחית.';
    const h=health();$('copyHealthV128').textContent=h.text;$('copyHealthV128').classList.toggle('warn',!h.ok);
    const ex=$('copyExampleV128');if(['c2s2','c2s3'].includes(current().template)){ex.hidden=false;ex.textContent='הערה פנימית: תיאורי ריח כמו "מאסקי", "רענן" או "צלול" הם דוגמה בלבד. משתמשים בהם רק כשהם מתאימים למקרה שמוצג.'}else ex.hidden=true;
  }

  ['title','body','support','cta'].forEach(id=>{const el=$(id);if(!el)return;el.addEventListener('input',()=>setTimeout(refreshStudio,0));el.addEventListener('blur',()=>{const clean=normalizeDash(el.value);if(clean!==el.value){el.value=clean;current()[id]=clean;save();render()}refreshStudio()})});
  const originalSetForm=setForm;
  setForm=function(){originalSetForm();refreshStudio()};

  document.querySelector('.badge').textContent=`PREVIEW v${VERSION}`;
  document.querySelector('.sub').textContent='12 תבניות נעולות - Final UX + Copy QA';
  const warn=document.querySelector('.note.warn');if(warn)warn.innerHTML='<strong>v1.2.8:</strong> גרסה עצמאית ללא שכבות iframe. Heebo נעול כשפת המותג, עוזר הניסוח פעיל, מקפים מנורמלים ל- בלבד והשליטה בגודל נשארת מבוקרת.';
  document.title=`Sertavo Instagram Generator v${VERSION} Preview`;

  document.fonts?.ready?.then(()=>render());
  setForm();render();refreshStudio();
})();