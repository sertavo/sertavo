(() => {
  const measureCtx=document.createElement('canvas').getContext('2d');
  const FIELDS=['title','body','support','cta'];
  const RULES={
    c1s1:{title:[860,76,800,1,2],body:[760,34,500,1,2],support:[760,26,500,1,2],cta:[760,28,800,1,2]},
    c1s2:{title:[850,70,800,1,2],body:[820,30,500,1,2],support:[760,24,500,1,2],cta:[760,28,800,1,2]},
    c1s3:{title:[880,64,800,1,2],body:[820,30,500,1,2],support:[760,24,500,1,2],cta:[760,28,800,1,2]},
    c1s4:{title:[900,62,800,1,2],body:[780,32,500,1,2],support:[760,24,500,1,2],cta:[760,28,800,1,2]},
    c2s1:{title:[850,70,800,2,3],body:[650,34,550,2,3],support:[760,24,500,1,2],cta:[760,28,800,1,2]},
    c2s2:{title:[860,62,800,1,2],body:[820,31,500,3,4],support:[800,24,500,1,2],cta:[760,28,800,1,2]},
    c2s3:{title:[860,64,800,1,2],body:[770,33,500,2,3],support:[750,23,500,1,2],cta:[760,28,800,1,2]},
    c2s4:{title:[820,68,800,2,3],body:[760,32,500,3,4],support:[760,27,650,1,2],cta:[760,27,800,1,2]},
    c3s1:{title:[860,64,800,1,2],body:[760,32,550,1,2],support:[760,24,500,1,2],cta:[760,28,800,1,2]},
    c3s2:{title:[850,66,800,1,2],body:[570,34,600,3,4],support:[760,24,500,1,2],cta:[760,28,800,1,2]},
    c3s3:{title:[860,64,800,1,2],body:[540,34,650,3,4],support:[760,24,500,1,2],cta:[760,28,800,1,2]},
    c3s4:{title:[880,62,800,1,2],body:[760,31,500,2,3],support:[760,24,500,1,2],cta:[760,28,800,1,2]}
  };

  function renderedLines(text,maxWidth,size,weight){
    measureCtx.font=`${weight} ${size}px Heebo, Arial, sans-serif`;
    const out=[];
    for(const para of String(text||'').split('\n')){
      if(!para){out.push('');continue;}
      const words=para.trim().split(/\s+/).filter(Boolean);
      let line='';
      for(const word of words){
        const test=line?`${line} ${word}`:word;
        if(line && measureCtx.measureText(test).width>maxWidth){out.push(line);line=word;}else line=test;
      }
      if(line) out.push(line);
    }
    return out.length;
  }

  function ensureHint(el){
    let hint=el.nextElementSibling;
    if(!hint || !hint.classList.contains('copy-length-hint')){
      hint=document.createElement('div');
      hint.className='copy-length-hint';
      el.insertAdjacentElement('afterend',hint);
    }
    return hint;
  }

  function checkField(id){
    const el=document.getElementById(id); if(!el) return 'ok';
    const hint=ensureHint(el);
    el.classList.remove('length-warn','length-danger');
    hint.className='copy-length-hint';
    const value=el.value.trim();
    if(!value){hint.textContent='';return 'ok';}
    const s=current();
    const rule=(RULES[s.template]||{})[id];
    if(!rule){hint.textContent='';return 'ok';}
    const [width,baseSize,weight,recommended,hard]=rule;
    const scale=id==='title'?(Number(s.titleScale)||100):id==='body'?(Number(s.bodyScale)||100):100;
    const size=baseSize*scale/100;
    const lines=renderedLines(value,width,size,weight);
    if(lines>hard){
      el.classList.add('length-danger');
      hint.classList.add('danger');
      hint.innerHTML=`<strong>ארוך מדי לשקופית הזו.</strong> הטקסט צפוי להיפרס על ${lines} שורות. מומלץ עד ${recommended}. כדאי לקצר לפני ייצוא.`;
      return 'danger';
    }
    if(lines>recommended){
      el.classList.add('length-warn');
      hint.classList.add('warn');
      hint.innerHTML=`<strong>אורך פחות מומלץ.</strong> הטקסט צפוי להיפרס על ${lines} שורות. שפת המותג בשקופית הזו עובדת טוב יותר עד ${recommended}.`;
      return 'warn';
    }
    hint.textContent='';
    return 'ok';
  }

  function updateAll(){FIELDS.forEach(checkField);}

  FIELDS.forEach(id=>document.getElementById(id)?.addEventListener('input',()=>setTimeout(updateAll,0)));
  document.addEventListener('click',e=>{
    if(e.target.closest('#carouselTabs,#slideTabs') || e.target.closest('#copyAssist')) setTimeout(updateAll,30);
  });
  document.getElementById('titleScale')?.addEventListener('input',()=>setTimeout(updateAll,0));
  document.getElementById('bodyScale')?.addEventListener('input',()=>setTimeout(updateAll,0));
  setTimeout(updateAll,80);
})();