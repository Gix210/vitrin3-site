(() => {
 'use strict';
 const root=document.documentElement;
 const stage=document.querySelector('.future-window'),display=document.querySelector('.storefront-scene'),heading=document.querySelector('.future-heading');
 const enabled=true; // The storefront scroll entrance is the requested default experience.
 let pending=false,entrance=null,entranceFrame=0,hovered=false;
 const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
 const clamp=x=>Math.max(0,Math.min(1,x));const ease=x=>x*x*(3-2*x);
 function sync(){root.classList.toggle('scroll-motion',enabled);if(!enabled){root.style.removeProperty('--portfolio-opacity');if(stage){stage.removeAttribute('style');}}queue();}
 function render(){pending=false;const max=root.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?clamp(scrollY/max):0})`;if(!display||!heading)return;
 if(!enabled){stage.style.setProperty('--door-angle',hovered?'-65deg':'0deg');return;}
 const desktop=innerWidth>760&&innerHeight>=650;let p;
 if(desktop){const start=heading.getBoundingClientRect().bottom+scrollY+38-100;p=clamp((scrollY-start)/(innerHeight*.7));}
 else{const r=display.getBoundingClientRect();p=clamp((innerHeight*.65-r.top)/(r.height*.85));}
 if(entrance!==null)p=entrance;
 const door=Math.max(hovered ? .85 : 0,ease(clamp(p/.65)));const approach=ease(clamp((p-.3)/.7));
 stage.style.setProperty('--door-angle',`${-82*door}deg`);
 stage.style.setProperty('--approach-scale',String(1+approach*6.5));
 stage.style.setProperty('--approach-y',`${approach*-12}px`);
 stage.style.setProperty('--entrance-opacity',String(1-ease(clamp((p-.60)/.22))));
 stage.style.pointerEvents=p>.98?'none':'';
 root.style.setProperty('--portfolio-opacity',String(ease(clamp((p-.82)/.18))));
 stage.style.setProperty('--outside-opacity',String(1-ease(clamp((approach-.6)/.4))));
 stage.style.setProperty('--copy-column',`${42*(1-ease(clamp(approach*2)))}%`);
 stage.style.setProperty('--scene-inset',`${16*(1-approach)}px`);
 stage.style.setProperty('--copy-opacity',String(1-ease(clamp(approach*3))));
 }
 function queue(){if(!pending){pending=true;requestAnimationFrame(render);}}
 new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['lang']});
 function cancelEntrance(){cancelAnimationFrame(entranceFrame);entranceFrame=0;entrance=null;queue();}
 function enterProjects(event){
  event.preventDefault();cancelEntrance();
  const projects=document.querySelector('#projets');
  const mobile=innerWidth<=760;hovered=true;queue();
  if(!enabled){projects.setAttribute('tabindex','-1');projects.focus({preventScroll:true});projects.scrollIntoView({behavior:'instant'});history.replaceState(null,'','#projets');return;}
  const from=scrollY,to=projects.getBoundingClientRect().top+scrollY-(mobile?88:100),start=performance.now();
  function enter(now){const t=clamp((now-start-(mobile?180:0))/(mobile?720:1550));window.scrollTo({top:from+(to-from)*ease(t),behavior:'instant'});render();
   if(t<1){entranceFrame=requestAnimationFrame(enter);return;}
   entranceFrame=0;
   projects.setAttribute('tabindex','-1');projects.focus({preventScroll:true});
   history.replaceState(null,'','#projets');
  }
  entranceFrame=requestAnimationFrame(enter);
 }
 document.querySelectorAll('.enter-work,.door-entry').forEach(el=>el.addEventListener('click',enterProjects));
 const doorTarget=document.querySelector('.door-entry');
 doorTarget?.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovered=true;queue();}});
 doorTarget?.addEventListener('pointerleave',()=>{hovered=false;queue();});
 doorTarget?.addEventListener('focus',()=>{hovered=true;queue();});
 doorTarget?.addEventListener('blur',()=>{hovered=false;queue();});
 addEventListener('wheel',cancelEntrance,{passive:true});addEventListener('touchstart',cancelEntrance,{passive:true});
 addEventListener('keydown',e=>{if(['Escape','PageUp','PageDown','Home','End','ArrowUp','ArrowDown',' '].includes(e.key))cancelEntrance();});
 addEventListener('scroll',()=>{if(!entranceFrame&&entrance!==null&&scrollY<heading.getBoundingClientRect().bottom+scrollY)entrance=null;queue();},{passive:true});addEventListener('resize',queue,{passive:true});sync();
})();
