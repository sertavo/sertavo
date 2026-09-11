const $ = id => document.getElementById(id);
const ids = ['kitMode','offerTitle','firstName','gender','personal','score','fitText','fragrance1','brand1','fragrance2','brand2','why1','why2','why3','sampleCount','sampleMl','price','cta','showFooter'];
const canvas = $('card');
const ctx = canvas.getContext('2d');
let logoImg = null;
const COLORS={navy:'#074686', navyDeep:'#063869', cream:'#F6F0E4', cream2:'#FFFDF8', gold:'#B89558', ink:'#17212B', muted:'#66717B', line:'#DDD2BF'};

function val(id){ return $(id).type==='checkbox' ? $(id).checked : $(id).value.trim(); }
function isComparison(){ return val('kitMode')==='comparison'; }
function genderText(male,female,neutral){const g=val('gender');return g==='MALE'?male:g==='FEMALE'?female:neutral;}
function validateBeforeExport(){const missing=[]; if(!val('firstName') || val('firstName')==='שם הלקוח') missing.push('שם לקוח'); if(!val('fragrance1') || val('fragrance1')==='FRAGRANCE ONE') missing.push('בושם 1'); if(isComparison() && (!val('fragrance2') || val('fragrance2')==='FRAGRANCE TWO')) missing.push('בושם 2'); if(!val('price')) missing.push('מחיר'); if(missing.length){alert('לפני יצוא חסר: '+missing.join(', ')); return false;} return true;}
function roundedPath(x,y,w,h,r){
  const rr=Math.max(0,Math.min(r,w/2,h/2));
  ctx.beginPath();
  ctx.moveTo(x+rr,y);
  ctx.lineTo(x+w-rr,y); ctx.quadraticCurveTo(x+w,y,x+w,y+rr);
  ctx.lineTo(x+w,y+h-rr); ctx.quadraticCurveTo(x+w,y+h,x+w-rr,y+h);
  ctx.lineTo(x+rr,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-rr);
  ctx.lineTo(x,y+rr); ctx.quadraticCurveTo(x,y,x+rr,y);
  ctx.closePath();
}
function roundRect(x,y,w,h,r,fill,stroke,width=2){roundedPath(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function line(x1,y1,x2,y2,color=COLORS.line,width=2){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()}
function circle(x,y,r,fill,stroke,width=2){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}

function wrapText(text, maxWidth, font){
  ctx.font=font;
  const paras=String(text||'').split(/\n+/);
  const out=[];
  paras.forEach(p=>{
    const words=p.split(/\s+/).filter(Boolean); let current='';
    words.forEach(word=>{
      const test=current? current+' '+word : word;
      if(ctx.measureText(test).width>maxWidth && current){out.push(current); current=word;} else current=test;
    });
    if(current) out.push(current);
  });
  return out.length?out:[''];
}
function drawWrapped(text,x,y,maxWidth,lineHeight,font,color,align='right',maxLines=4){
  ctx.font=font;ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='alphabetic';ctx.direction='rtl';
  let lines=wrapText(text,maxWidth,font);
  if(lines.length>maxLines){lines=lines.slice(0,maxLines);let last=lines[maxLines-1];while(ctx.measureText(last+'…').width>maxWidth&&last.length>1)last=last.slice(0,-1);lines[maxLines-1]=last+'…';}
  lines.forEach((ln,i)=>ctx.fillText(ln,x,y+i*lineHeight));
  return y+lines.length*lineHeight;
}
function fitFont(text, maxWidth, start, min, weight='700', family='Arial'){
  let s=start; while(s>min){ctx.font=`${weight} ${s}px ${family}`; if(ctx.measureText(text).width<=maxWidth)break; s-=2;} return `${weight} ${s}px ${family}`;
}
function drawLogo(y=62){
  if(logoImg){
    const maxW=260,maxH=90; const ratio=Math.min(maxW/logoImg.width,maxH/logoImg.height); const w=logoImg.width*ratio,h=logoImg.height*ratio;
    ctx.drawImage(logoImg,(1080-w)/2,y,w,h);
  } else {
    ctx.direction='ltr';ctx.textAlign='center';ctx.fillStyle=COLORS.gold;ctx.font='700 46px Georgia, serif';ctx.fillText('SERTAVO',540,y+48);ctx.direction='rtl';
  }
}

function syncModeUI(){
  const comparison=isComparison();
  $('fragrance2Wrap').classList.toggle('hidden', !comparison);
  $('whySectionTitle').textContent = comparison ? 'למה דווקא הם עבורך' : 'למה הוא מתאים לך';
  $('why3Label').textContent = comparison ? 'סיבה 3' : 'סיבה 3, אופציונלי';
  if(comparison){
    if(!$('offerTitle').value || $('offerTitle').value==='ערכת ניסיון אישית') $('offerTitle').value='ערכת ההתאמה האישית שלך';
    $('sampleCount').value = $('sampleCount').value==='' || $('sampleCount').value==='1' ? '2' : $('sampleCount').value;
    $('sampleMl').value = $('sampleMl').value==='' || $('sampleMl').value==='5' ? '2' : $('sampleMl').value;
    if(!$('why2').value) $('why2').value='הבחירה הראשונה בודקת את הצד האלגנטי והמדויק';
    if(!$('why3').value) $('why3').value='השנייה מאפשרת להשוות מול כיוון עם אופי מעט שונה';
  } else {
    if(!$('offerTitle').value || $('offerTitle').value==='ערכת ההתאמה האישית שלך') $('offerTitle').value='ערכת ניסיון אישית';
    $('sampleCount').value='1';
    $('sampleMl').value='5';
    if($('why3').value==='השנייה מאפשרת להשוות מול כיוון עם אופי מעט שונה') $('why3').value='מתאים לבדיקת התפתחות אמיתית על העור לאורך כמה שימושים.';
  }
}

function drawPerfumeCard(x,y,w,h,title,brand,label){
  roundRect(x,y,w,h,24,COLORS.cream2,COLORS.line,2);
  ctx.fillStyle=COLORS.gold;ctx.font='700 20px Arial';ctx.textAlign='center';ctx.fillText(label,x+w/2,y+34);
  ctx.direction='ltr';ctx.textAlign='center';
  ctx.fillStyle=COLORS.navy;ctx.font=fitFont(title,w-60,34,20,'700','Georgia');ctx.fillText(title,x+w/2,y+84);
  ctx.fillStyle=COLORS.gold;ctx.font=fitFont(brand,w-60,24,16,'700','Arial');ctx.fillText(brand,x+w/2,y+118);
  ctx.direction='rtl';
}

function render(){
  syncModeUI();
  ctx.clearRect(0,0,1080,1350);
  roundRect(2,2,1076,1346,28,COLORS.cream,COLORS.gold,2);
  ctx.fillStyle=COLORS.navyDeep;
  ctx.beginPath();
  ctx.moveTo(26,26); ctx.lineTo(1054,26); ctx.arcTo(1054,26,1054,52,26); ctx.lineTo(1054,500); ctx.lineTo(26,500); ctx.lineTo(26,52); ctx.arcTo(26,26,52,26,26); ctx.closePath(); ctx.fill();

  drawLogo(54);
  ctx.direction='rtl';ctx.textAlign='center';
  ctx.fillStyle='#fff';ctx.font='700 64px Arial';ctx.fillText(`היי ${val('firstName') || ''},`,540,210);
  drawWrapped(val('personal'),540,275,820,46,'400 29px Arial','rgba(255,255,255,0.96)','center',3);

  circle(540,470,96,COLORS.cream2,COLORS.gold,6);
  const score=val('score');
  if(score){
    ctx.fillStyle=COLORS.navy;ctx.font='700 56px Georgia, serif';ctx.textAlign='center';ctx.fillText(`${score}%`,540,456);
    ctx.fillStyle=COLORS.ink;ctx.font='400 21px Arial';ctx.fillText('התאמה',540,494);
    ctx.font='400 19px Arial';ctx.fillText('לפרופיל הריח שלך',540,522);
  } else {
    drawWrapped(val('fitText')||'התאמה גבוהה לפרופיל הריח שלך',540,454,150,27,'700 18px Arial',COLORS.navy,'center',3);
  }

  ctx.fillStyle=COLORS.navy;ctx.font='700 58px Georgia, serif';ctx.textAlign='center';ctx.direction='ltr';
  if(isComparison()){
    const comboTitle = `${val('fragrance1')}  •  ${val('fragrance2')}`;
    ctx.font=fitFont(comboTitle,780,40,24,'700','Georgia');
    ctx.fillText(comboTitle,540,610);
    ctx.fillStyle=COLORS.gold;ctx.font='700 28px Arial';ctx.fillText('ערכת ההתאמה האישית שלך',540,646);
    ctx.direction='rtl';ctx.fillStyle=COLORS.ink;ctx.font='400 22px Arial';ctx.textAlign='center';
    ctx.fillText(genderText('שני כיוונים קרובים למה שחיפשת, עם הבדל מספיק כדי להבין מה באמת עובד עליך.','שני כיוונים קרובים למה שחיפשת, עם הבדל מספיק כדי להבין מה באמת עובד עלייך.','שני כיוונים קרובים למה שעלה מהתשובות, עם הבדל מספיק כדי להבין מה עובד טוב יותר.'),540,684);
    drawPerfumeCard(105,720,400,140,val('fragrance2'),val('brand2'),'כיוון שני');
    drawPerfumeCard(575,720,400,140,val('fragrance1'),val('brand1'),'כיוון ראשון');
  } else {
    ctx.font=fitFont(val('fragrance1'),780,50,30,'700','Georgia');
    ctx.fillText(val('fragrance1'),540,610);
    ctx.fillStyle=COLORS.gold;ctx.font=fitFont(val('brand1'),780,30,18,'700','Arial');ctx.fillText(val('brand1'),540,648);
    ctx.direction='rtl';ctx.fillStyle=COLORS.ink;ctx.font='400 22px Arial';ctx.textAlign='center';
    ctx.fillText('זה הכיוון שעלה כאחד המתאימים ביותר למה שחיפשת.',540,688);
    drawPerfumeCard(240,730,600,150,val('fragrance1'),val('brand1'),'הכיוון שנבחר');
  }

  ctx.direction='rtl';ctx.textAlign='center';ctx.fillStyle=COLORS.navy;ctx.font='700 34px Arial';
  ctx.fillText(isComparison() ? 'למה דווקא הם עבורך' : 'למה הוא מתאים לך',540,950);
  line(355,970,725,970,COLORS.gold,2);
  const whys = [val('why1'),val('why2'),val('why3')].filter(Boolean);
  let y=1016;
  whys.slice(0,3).forEach(t=>{
    y=drawWrapped('• ' + t,830,y,760,34,'400 25px Arial',COLORS.ink,'center',2)+12;
  });

  roundRect(92,1192,896,114,24,COLORS.navy,null,0);
  ctx.textAlign='center';
  ctx.fillStyle=COLORS.gold;ctx.font='700 31px Arial';ctx.fillText(val('cta')||'רוצה שאכין לך את הערכה?',540,1242);
  const pricePart=val('price')?`${val('price')} ₪`:'מחיר טרם הוזן';
  const unitLine = isComparison() ? `${val('sampleCount')||2} דוגמיות × ${val('sampleMl')||2} מ״ל • ${pricePart}` : `דוגמית אחת × ${val('sampleMl')||5} מ״ל • ${pricePart}`;
  ctx.fillStyle='#fff';ctx.font='400 23px Arial';ctx.fillText(unitLine,540,1280);

  if(val('showFooter')){
    ctx.fillStyle=COLORS.muted;ctx.font='400 18px Arial';
    const footer = isComparison() ? 'המטרה היא להשוות בין שני כיוונים על העור לפני החלטה על בקבוק מלא.' : 'המטרה היא לבדוק את הכיוון על העור לאורך כמה שימושים לפני החלטה על בקבוק מלא.';
    ctx.fillText(footer,540,1328);
  }
  genderQA();
}

function genderQA(){
  const g=val('gender');
  const combined=[val('personal'),val('why1'),val('why2'),val('why3'),val('cta')].join(' ');
  const badMale=['כתבי','בחרי','נסי','תרצי','שלחי','ספרי','כתבו','בחרו','נסו','תרצו','שלחו'];
  const badFemale=['כתוב','בחר','נסה','תרצה','שלח','ספר','כתבו','בחרו','נסו','תרצו','שלחו'];
  const plural=['כתבו','בחרו','נסו','תרצו','שלחו','ספרו'];
  let bad=[];
  if(g==='MALE') bad=badMale.filter(w=>combined.includes(w));
  if(g==='FEMALE') bad=badFemale.filter(w=>combined.includes(w));
  if(g==='NEUTRAL') bad=plural.filter(w=>combined.includes(w));
  const qa=$('qa');
  if(bad.length){qa.className='status bad';qa.textContent=`Gender QA: נמצאו ניסוחים לבדיקה: ${[...new Set(bad)].join(', ')}`;}
  else {qa.className='status good';qa.textContent=`Gender QA: לא נמצאה חריגה ברורה עבור ${g}. עדיין מומלץ לקרוא פעם אחת לפני שליחה.`;}
}

function getData(){const o={version:'1.5'};ids.forEach(id=>o[id]=val(id));return o;}
function applyData(o){ids.forEach(id=>{if(!(id in o))return;if($(id).type==='checkbox')$(id).checked=!!o[id];else $(id).value=o[id];});render();}
function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}

ids.forEach(id=>$(id).addEventListener('input',render));
function pngDataUrl(){ render(); return canvas.toDataURL('image/png',1); }
function downloadDataUrl(dataUrl,name){const a=document.createElement('a');a.href=dataUrl;a.download=name;document.body.appendChild(a);a.click();a.remove();}
$('downloadPng').addEventListener('click',()=>{
  if(!validateBeforeExport()) return;
  try{downloadDataUrl(pngDataUrl(),`Sertavo_${(val('firstName')||'customer').replace(/\s+/g,'_')}_WhatsApp_Card.png`)}catch(err){alert('הדפדפן חסם את ההורדה. נסה את הכפתור “שתף / שמור תמונה”.');}
});
$('sharePng').addEventListener('click',async()=>{
  if(!validateBeforeExport()) return;
  render();
  try{
    const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('PNG export failed')),'image/png',1));
    const file=new File([blob],`Sertavo_${(val('firstName')||'customer').replace(/\s+/g,'_')}_WhatsApp_Card.png`,{type:'image/png'});
    if(navigator.share && (!navigator.canShare || navigator.canShare({files:[file]}))){
      await navigator.share({files:[file],title:'Sertavo - כרטיס התאמה'});
      return;
    }
    const url=URL.createObjectURL(blob); const w=window.open(url,'_blank');
    if(!w) alert('לא ניתן לפתוח את התמונה. נסה “הורד PNG”.');
    setTimeout(()=>URL.revokeObjectURL(url),60000);
  }catch(err){
    if(err && err.name==='AbortError') return;
    alert('לא הצלחתי לפתוח את חלון השיתוף. נסה “פתח PNG” ולחיצה ארוכה על התמונה לשמירה.');
  }
});
$('openPng').addEventListener('click',()=>{
  if(!validateBeforeExport()) return;
  try{const w=window.open(); if(!w){alert('הדפדפן חסם חלון חדש. אפשר חלונות קופצים ונסה שוב.');return;} w.document.write(`<title>Sertavo PNG</title><img src="${pngDataUrl()}" style="max-width:100%;height:auto;display:block;margin:auto">`); w.document.close();}
  catch(err){alert('לא ניתן לפתוח את התמונה. נסה את כפתור השיתוף.');}
});
$('saveJson').addEventListener('click',()=>downloadBlob(new Blob([JSON.stringify(getData(),null,2)],{type:'application/json'}),`Sertavo_${(val('firstName')||'customer').replace(/\s+/g,'_')}_card_data.json`));
$('jsonFile').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{applyData(JSON.parse(r.result));e.target.value='';}catch(err){alert('קובץ JSON לא תקין')}};r.readAsText(f);});
$('reset').addEventListener('click',()=>location.reload());
$('logoFile').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{logoImg=img;if($('rememberLogo').checked)localStorage.setItem('sertavoLogo',r.result);render()};img.src=r.result};r.readAsDataURL(f);});
$('rememberLogo').addEventListener('change',()=>{if(!$('rememberLogo').checked)localStorage.removeItem('sertavoLogo')});
$('kitMode').addEventListener('change',render);
$('runtimeStatus').className='status good'; $('runtimeStatus').innerHTML='<strong>מוכן:</strong> המחולל פעיל בדפדפן הזה.';
const stored=localStorage.getItem('sertavoLogo');
if(stored){const img=new Image();img.onload=()=>{logoImg=img;$('rememberLogo').checked=true;render()};img.src=stored}
else{const img=new Image();img.onload=()=>{logoImg=img;render()};img.onerror=()=>render();img.src='../logo.png';}
