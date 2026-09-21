const W=1004,H=1004;
const COLORS={cream:"#F6F0E4",navy:"#074686",gold:"#B89558",ink:"#17212B",muted:"#66717B"};
const front=document.getElementById("front");
const back=document.getElementById("back");
const fctx=front.getContext("2d");
const bctx=back.getContext("2d");
const urlInput=document.getElementById("feedbackUrl");
const fileInput=document.getElementById("qrFile");
const caseInput=document.getElementById("caseId");
const statusEl=document.getElementById("status");
const scratch=document.getElementById("qrScratch");
let qrImage=null;
let logoImage=null;
let logoCrop=null;

function setStatus(msg,type){
  statusEl.textContent=msg;
  statusEl.className="status"+(type?" "+type:"");
}
function cleanName(s){
  return (s||"").trim().replace(/[^a-zA-Z0-9א-ת_-]+/g,"_").replace(/^_+|_+$/g,"");
}
function fileBase(){
  const c=cleanName(caseInput.value);
  return c?("כרטיס_משוב_"+c):"כרטיס_משוב";
}
function font(weight,size){
  return String(weight)+" "+String(size)+'px "Heebo", Arial, sans-serif';
}
function fitImage(ctx,img,x,y,w,h){
  const r=Math.min(w/img.width,h/img.height);
  const dw=img.width*r,dh=img.height*r;
  ctx.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,dw,dh);
}
function detectVisibleCrop(img){
  try{
    const c=document.createElement("canvas");
    c.width=img.naturalWidth||img.width;
    c.height=img.naturalHeight||img.height;
    const cx=c.getContext("2d",{willReadFrequently:true});
    cx.drawImage(img,0,0);
    const data=cx.getImageData(0,0,c.width,c.height).data;
    let minX=c.width,minY=c.height,maxX=-1,maxY=-1;
    for(let y=0;y<c.height;y++){
      for(let x=0;x<c.width;x++){
        const a=data[(y*c.width+x)*4+3];
        if(a>18){
          if(x<minX)minX=x;if(x>maxX)maxX=x;
          if(y<minY)minY=y;if(y>maxY)maxY=y;
        }
      }
    }
    if(maxX<minX||maxY<minY)return null;
    return {x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1};
  }catch(e){return null;}
}
function fitVisibleImage(ctx,img,crop,x,y,w,h){
  if(!crop){fitImage(ctx,img,x,y,w,h);return;}
  const r=Math.min(w/crop.w,h/crop.h);
  const dw=crop.w*r,dh=crop.h*r;
  ctx.drawImage(img,crop.x,crop.y,crop.w,crop.h,x+(w-dw)/2,y+(h-dh)/2,dw,dh);
}
function text(ctx,txt,x,y,size,weight,color,align){
  ctx.save();
  ctx.fillStyle=color||COLORS.navy;
  ctx.font=font(weight||500,size);
  ctx.textAlign=align||"center";
  ctx.textBaseline="top";
  ctx.direction="rtl";
  ctx.fillText(txt,x,y);
  ctx.restore();
}
function multiline(ctx,lines,x,y,size,lh,weight,color){
  lines.forEach(function(t,i){text(ctx,t,x,y+i*lh,size,weight||400,color||COLORS.navy);});
}
function drawLogo(ctx){
  if(logoImage){
    fitVisibleImage(ctx,logoImage,logoCrop,423,49,158,103);
  }else{
    text(ctx,"SERTAVO",502,75,34,600,COLORS.gold);
  }
}
function drawFront(){
  fctx.clearRect(0,0,W,H);
  fctx.fillStyle=COLORS.cream;
  fctx.fillRect(0,0,W,H);
  drawLogo(fctx);

  text(fctx,"איך זה הרגיש לך?",502,278,52,700,COLORS.navy);
  text(fctx,"אחרי ההתנסות, נשמח לפידבק קצר",502,364,27,500,COLORS.navy);

  const qx=396,qy=444,qs=213;
  fctx.fillStyle="#fff";
  fctx.fillRect(qx-10,qy-10,qs+20,qs+20);
  if(qrImage){
    fctx.drawImage(qrImage,qx,qy,qs,qs);
  }else{
    fctx.strokeStyle="#C7BBA6";
    fctx.lineWidth=3;
    fctx.strokeRect(qx,qy,qs,qs);
    text(fctx,"QR אישי",502,526,26,600,"#9A8E79");
  }

  multiline(fctx,[
    "סריקת ה-QR פותחת את הפידבק האישי של הערכה",
    "כמה שאלות קצרות, וזהו"
  ],502,688,25,36,400,COLORS.navy);

  text(fctx,"הפידבק שלך עוזר לנו להשלים את המלצת הקנייה",502,835,20,500,COLORS.navy);
}
function drawBack(){
  bctx.clearRect(0,0,W,H);
  bctx.fillStyle=COLORS.cream;
  bctx.fillRect(0,0,W,H);
  drawLogo(bctx);

  text(bctx,"מה משך אותך יותר?",502,300,46,700,COLORS.navy);
  multiline(bctx,[
    "מה הרגיש לך נכון לאורך היום",
    "ומה פחות עבד בפועל"
  ],502,405,30,42,500,COLORS.navy);
}
function redraw(){
  drawFront();
  drawBack();
}
async function loadLogo(){
  return new Promise(function(resolve){
    const img=new Image();
    img.onload=function(){logoImage=img;logoCrop=detectVisibleCrop(img);redraw();resolve();};
    img.onerror=function(){redraw();resolve();};
    img.src="../logo.png";
  });
}
function dataUrlToImage(src){
  return new Promise(function(resolve,reject){
    const img=new Image();
    img.onload=function(){resolve(img);};
    img.onerror=reject;
    img.src=src;
  });
}
async function generateQr(){
  const val=urlInput.value.trim();
  if(!/^https:\/\//i.test(val)){
    setStatus("יש להזין קישור שמתחיל ב-https://","bad");
    return;
  }
  scratch.innerHTML="";
  new QRCode(scratch,{text:val,width:700,height:700,correctLevel:QRCode.CorrectLevel.H});
  await new Promise(function(r){setTimeout(r,100);});
  const c=scratch.querySelector("canvas");
  const img=scratch.querySelector("img");
  try{
    const src=c?c.toDataURL("image/png"):img.src;
    qrImage=await dataUrlToImage(src);
    redraw();
    setStatus("ה-QR נוצר ומוכן לייצוא.","good");
  }catch(e){
    setStatus("לא הצלחתי ליצור את ה-QR.","bad");
  }
}
fileInput.addEventListener("change",function(){
  const f=fileInput.files&&fileInput.files[0];
  if(!f)return;
  const r=new FileReader();
  r.onload=async function(){
    try{
      qrImage=await dataUrlToImage(r.result);
      redraw();
      setStatus("תמונת ה-QR נטענה ומוכנה לייצוא.","good");
    }catch(e){
      setStatus("לא הצלחתי לקרוא את תמונת ה-QR.","bad");
    }
  };
  r.readAsDataURL(f);
});
document.getElementById("makeQr").addEventListener("click",generateQr);

function requireQr(){
  if(!qrImage){
    setStatus("צריך להוסיף QR אישי לפני הייצוא.","bad");
    return false;
  }
  return true;
}
function downloadCanvas(canvas,name){
  const a=document.createElement("a");
  a.download=name;
  a.href=canvas.toDataURL("image/png");
  a.click();
}
document.getElementById("downloadFront").addEventListener("click",function(){
  if(requireQr())downloadCanvas(front,fileBase()+"_חזית.png");
});
document.getElementById("downloadBack").addEventListener("click",function(){
  if(requireQr())downloadCanvas(back,fileBase()+"_גב.png");
});
document.getElementById("downloadPdf").addEventListener("click",function(){
  if(!requireQr())return;
  if(!window.jspdf||!window.jspdf.jsPDF){
    setStatus("רכיב ה-PDF לא נטען. נסה לרענן את העמוד.","bad");
    return;
  }
  const jsPDF=window.jspdf.jsPDF;
  const pdf=new jsPDF({orientation:"portrait",unit:"mm",format:[85,85],compress:true});
  pdf.addImage(front.toDataURL("image/png"),"PNG",0,0,85,85,undefined,"FAST");
  pdf.addPage([85,85],"portrait");
  pdf.addImage(back.toDataURL("image/png"),"PNG",0,0,85,85,undefined,"FAST");
  pdf.save(fileBase()+"_דו-צדדי.pdf");
  setStatus('ה-PDF הדו-צדדי נוצר בגודל 85×85 מ"מ.',"good");
});
document.getElementById("reset").addEventListener("click",function(){
  urlInput.value="";
  caseInput.value="";
  fileInput.value="";
  qrImage=null;
  scratch.innerHTML="";
  redraw();
  setStatus("מחכה ל-QR אישי.");
});
window.addEventListener("load",async function(){
  if(document.fonts&&document.fonts.ready)await document.fonts.ready;
  await loadLogo();
  redraw();
});
