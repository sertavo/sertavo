const W=1004,H=1004;
const SCALE=2; // 2008px / 85mm = ~600 DPI
const PRINT_DPI=600;
const BLEED_MM=3;
const BLEED_PAGE_MM=91;
const BLEED_PX=Math.round(BLEED_PAGE_MM/25.4*PRINT_DPI);
const BLEED_OFFSET_PX=Math.round(BLEED_MM/25.4*PRINT_DPI);
const COLORS={cream:"#F6F0E4",navy:"#074686",gold:"#B89558",ink:"#17212B",muted:"#66717B"};\nconst SUPABASE_URL="https://nyedulxukszcwmwsuuxw.supabase.co";\nconst SUPABASE_KEY="sb_publishable_mQNwiQoN56Zn_WQyqXzHcQ_g86AruZT";\nconst FEEDBACK_BASE="https://sertavo.co/feedback/index-no-credit.html";
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
function prepCanvas(ctx,canvas){
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.setTransform(SCALE,0,0,SCALE,0,0);
  ctx.imageSmoothingEnabled=true;
  ctx.imageSmoothingQuality="high";
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
  ctx.save();
  ctx.strokeStyle="#8D887F";
  ctx.lineWidth=1;
  ctx.beginPath();
  ctx.moveTo(452,158);
  ctx.lineTo(552,158);
  ctx.stroke();
  ctx.restore();
}
function drawFront(){
  prepCanvas(fctx,front);
  fctx.fillStyle=COLORS.cream;
  fctx.fillRect(0,0,W,H);
  drawLogo(fctx);

  text(fctx,"איך זה הרגיש לך?",502,278,52,700,COLORS.navy);
  text(fctx,"אחרי ההתנסות, נשמח לפידבק קצר",502,364,27,500,COLORS.navy);

  const qx=396,qy=444,qs=213;
  if(qrImage){
    fctx.save();
    fctx.imageSmoothingEnabled=false;
    fctx.drawImage(qrImage,qx,qy,qs,qs);
    fctx.restore();
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
  prepCanvas(bctx,back);
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
    img.onload=function(){
      logoImage=img;
      logoCrop=detectVisibleCrop(img);
      redraw();
      resolve();
    };
    img.onerror=function(){
      redraw();
      resolve();
    };
    img.src="logo-gold.png?v=20260921-print";
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
async function modelToTransparentQr(qr){
  const model=qr&&qr._oQRCode;
  if(!model||typeof model.getModuleCount!=="function"||typeof model.isDark!=="function")return null;
  const count=model.getModuleCount();
  const quiet=4;
  const cell=18;
  const total=(count+quiet*2)*cell;
  const c=document.createElement("canvas");
  c.width=total;
  c.height=total;
  const cx=c.getContext("2d");
  cx.clearRect(0,0,total,total);
  cx.fillStyle="#000000";
  for(let row=0;row<count;row++){
    for(let col=0;col<count;col++){
      if(model.isDark(row,col)){
        cx.fillRect((col+quiet)*cell,(row+quiet)*cell,cell,cell);
      }
    }
  }
  return dataUrlToImage(c.toDataURL("image/png"));
}
async function canvasToTransparentQr(source){
  const padRatio=0.08;
  const sw=source.width||700,sh=source.height||700;
  const side=Math.max(sw,sh);
  const pad=Math.max(20,Math.round(side*padRatio));
  const c=document.createElement("canvas");
  c.width=side+pad*2;
  c.height=side+pad*2;
  const cx=c.getContext("2d",{willReadFrequently:true});
  cx.clearRect(0,0,c.width,c.height);
  cx.drawImage(source,pad,pad,side,side);
  const image=cx.getImageData(0,0,c.width,c.height);
  const d=image.data;
  for(let i=0;i<d.length;i+=4){
    const lum=0.2126*d[i]+0.7152*d[i+1]+0.0722*d[i+2];
    if(lum<150){
      d[i]=0;d[i+1]=0;d[i+2]=0;d[i+3]=255;
    }else{
      d[i]=0;d[i+1]=0;d[i+2]=0;d[i+3]=0;
    }
  }
  cx.clearRect(0,0,c.width,c.height);
  cx.putImageData(image,0,0);
  return dataUrlToImage(c.toDataURL("image/png"));
}
function extractToken(raw){
  const v=(raw||"").trim();
  const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if(uuid.test(v))return v.toLowerCase();
  try{
    const u=new URL(v);
    const t=(u.searchParams.get("t")||u.searchParams.get("token")||"").trim();
    return uuid.test(t)?t.toLowerCase():null;
  }catch(e){return null;}
}
async function validateFeedbackToken(token){
  const response=await fetch(SUPABASE_URL+"/rest/v1/rpc/get_feedback_context_v1",{
    method:"POST",
    headers:{
      "apikey":SUPABASE_KEY,
      "Authorization":"Bearer "+SUPABASE_KEY,
      "Content-Type":"application/json"
    },
    body:JSON.stringify({p_token:token})
  });
  let data=null;
  try{data=await response.json();}catch(e){}
  if(!response.ok||!data||!data.ok){
    const err=(data&&data.error)||"invalid_token";
    throw new Error(err);
  }
  return data;
}
async function generateQr(){
  const token=extractToken(urlInput.value);
  if(!token){
    setStatus("יש להזין מזהה פידבק תקין או קישור שמכיל t=UUID.","bad");
    return;
  }
  setStatus("בודק שהמזהה משויך לערכה פעילה...");
  let ctx;
  try{
    ctx=await validateFeedbackToken(token);
  }catch(e){
    setStatus(e.message==="kit_not_assigned" ? "המזהה קיים אך עדיין לא שויך לערכה." : "המזהה אינו פעיל או לא נמצא.","bad");
    return;
  }
  const val=FEEDBACK_BASE+"?t="+encodeURIComponent(token);
  urlInput.value=val;
  if(!caseInput.value && ctx.kit_id)caseInput.value=ctx.kit_id;

  scratch.innerHTML="";
  const qr=new QRCode(scratch,{
    text:val,
    width:700,
    height:700,
    correctLevel:QRCode.CorrectLevel.M
  });
  await new Promise(function(r){setTimeout(r,100);});
  try{
    qrImage=await modelToTransparentQr(qr);
    if(!qrImage){
      const c=scratch.querySelector("canvas");
      if(!c)throw new Error("QR canvas missing");
      qrImage=await canvasToTransparentQr(c);
    }
    redraw();
    const perfumes=[ctx.perfume_a,ctx.perfume_b].filter(Boolean).join(" / ");
    setStatus("המזהה אומת מול Sertavo"+(ctx.kit_id?" · "+ctx.kit_id:"")+(perfumes?" · "+perfumes:"")+"; ה-QR מוכן.","good");
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
      const source=await dataUrlToImage(r.result);
      const c=document.createElement("canvas");
      c.width=source.naturalWidth||source.width;
      c.height=source.naturalHeight||source.height;
      const cx=c.getContext("2d");
      cx.drawImage(source,0,0,c.width,c.height);
      qrImage=await canvasToTransparentQr(c);
      redraw();
      setStatus("תמונת ה-QR נטענה, נוקתה לרקע שקוף ומוכנה לייצוא.","good");
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
function makeBleedCanvas(source){
  const c=document.createElement("canvas");
  c.width=BLEED_PX;
  c.height=BLEED_PX;
  const cx=c.getContext("2d");
  cx.fillStyle=COLORS.cream;
  cx.fillRect(0,0,c.width,c.height);
  cx.imageSmoothingEnabled=true;
  cx.imageSmoothingQuality="high";
  cx.drawImage(source,BLEED_OFFSET_PX,BLEED_OFFSET_PX,source.width,source.height);
  return c;
}
function addCropMarks(pdf){
  pdf.setDrawColor(110,110,110);
  pdf.setLineWidth(0.12);
  const a=0.7,b=2.5,t=3,r=88;
  pdf.line(a,t,b,t); pdf.line(t,a,t,b);
  pdf.line(BLEED_PAGE_MM-b,t,BLEED_PAGE_MM-a,t); pdf.line(r,a,r,b);
  pdf.line(a,r,b,r); pdf.line(t,BLEED_PAGE_MM-b,t,BLEED_PAGE_MM-a);
  pdf.line(BLEED_PAGE_MM-b,r,BLEED_PAGE_MM-a,r); pdf.line(r,BLEED_PAGE_MM-b,r,BLEED_PAGE_MM-a);
}
document.getElementById("downloadFront").addEventListener("click",function(){
  if(requireQr())downloadCanvas(front,fileBase()+"_חזית_600dpi.png");
});
document.getElementById("downloadBack").addEventListener("click",function(){
  if(requireQr())downloadCanvas(back,fileBase()+"_גב_600dpi.png");
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
  pdf.save(fileBase()+"_85x85_דו-צדדי.pdf");
  setStatus('נוצר PDF דו-צדדי 85×85 מ"מ ברזולוציית 600 DPI.',"good");
});
document.getElementById("downloadPrintPdf").addEventListener("click",function(){
  if(!requireQr())return;
  if(!window.jspdf||!window.jspdf.jsPDF){
    setStatus("רכיב ה-PDF לא נטען. נסה לרענן את העמוד.","bad");
    return;
  }
  const jsPDF=window.jspdf.jsPDF;
  const frontBleed=makeBleedCanvas(front);
  const backBleed=makeBleedCanvas(back);
  const pdf=new jsPDF({orientation:"portrait",unit:"mm",format:[BLEED_PAGE_MM,BLEED_PAGE_MM],compress:true});
  pdf.addImage(frontBleed.toDataURL("image/png"),"PNG",0,0,BLEED_PAGE_MM,BLEED_PAGE_MM,undefined,"FAST");
  addCropMarks(pdf);
  pdf.addPage([BLEED_PAGE_MM,BLEED_PAGE_MM],"portrait");
  pdf.addImage(backBleed.toDataURL("image/png"),"PNG",0,0,BLEED_PAGE_MM,BLEED_PAGE_MM,undefined,"FAST");
  addCropMarks(pdf);
  pdf.save(fileBase()+"_לדפוס_91x91_bleed3mm.pdf");
  setStatus('נוצר PDF לדפוס 91×91 מ"מ: Trim 85×85, Bleed של 3 מ"מ ו-Crop Marks.',"good");
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