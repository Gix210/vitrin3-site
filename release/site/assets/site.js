(() => {
  'use strict';
  const root=document.documentElement;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const languageButton=document.querySelector('.lang-button');
  const menuButton=document.querySelector('.menu-button');
  const menu=document.querySelector('#mobile-menu');
  const motionButton=document.querySelector('.motion-button');
  const stage=document.querySelector('.hero-stage');
  let motionEnabled=!reduce.matches;
  function setLanguage(language) {
    const en=language==='en'; root.lang=en?'en':'fr'; root.classList.toggle('en',en);
    if(languageButton){languageButton.textContent=en?'FR':'EN';languageButton.setAttribute('aria-label',en?'Passer en français':'Switch to English');}
    document.querySelectorAll('option[data-fr-option]').forEach(o=>{o.textContent=o.dataset[en?'enOption':'frOption'];});
    const langField=document.querySelector('input[name="langue"]');if(langField)langField.value=root.lang;
    const close=document.querySelector('.dialog-close');if(close)close.setAttribute('aria-label',en?'Close video':'Fermer la vidéo');
    updateMotionButton();
    try{localStorage.setItem('vitrin3-language',root.lang);}catch{}
  }
  function updateMotionButton(){if(!motionButton)return;motionButton.setAttribute('aria-label',root.lang==='en'?(motionEnabled?'Pause motion':'Enable motion'):(motionEnabled?'Désactiver les mouvements':'Activer les mouvements'));motionButton.setAttribute('aria-pressed',String(!motionEnabled));motionButton.textContent=motionEnabled?'Ⅱ':'▷';root.classList.toggle('motion-off',!motionEnabled);}
  let initial='fr';try{initial=localStorage.getItem('vitrin3-language')||'fr';}catch{}if(document.body.classList.contains('article-page'))initial='fr';setLanguage(initial);
  languageButton?.addEventListener('click',()=>setLanguage(root.lang==='fr'?'en':'fr'));
  function closeMenu(){if(!menu)return;menu.hidden=true;menuButton.setAttribute('aria-expanded','false');}
  menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));menu.hidden=open;});
  menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu&&!menu.hidden){closeMenu();menuButton.focus();}});
  window.matchMedia('(min-width:761px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
  // Event-driven movement; no permanent render loop, no scroll interception.
  if(stage){stage.addEventListener('pointermove',e=>{if(!motionEnabled||reduce.matches||e.pointerType!=='mouse')return;const r=stage.getBoundingClientRect();stage.style.setProperty('--mx',((e.clientX-r.left)/r.width-.5)*-14+'px');stage.style.setProperty('--my',((e.clientY-r.top)/r.height-.5)*-10+'px');},{passive:true});stage.addEventListener('pointerleave',()=>{stage.style.setProperty('--mx','0px');stage.style.setProperty('--my','0px');});}
  motionButton?.addEventListener('click',()=>{motionEnabled=!motionEnabled;updateMotionButton();if(stage){stage.style.setProperty('--mx','0px');stage.style.setProperty('--my','0px');}});
  reduce.addEventListener('change',()=>{motionEnabled=!reduce.matches;updateMotionButton();});
  window.addEventListener('scroll',()=>root.classList.toggle('scrolled',window.scrollY>20),{passive:true});
  document.querySelectorAll('[data-plan]').forEach(a=>a.addEventListener('click',()=>{const select=document.querySelector('#f-plan');if(select){select.value=a.dataset.plan;select.dispatchEvent(new Event('change',{bubbles:true}));}}));
  const dialog=document.querySelector('#reel-dialog');const video=dialog?.querySelector('video');
  document.querySelectorAll('[data-open-reel]').forEach(trigger=>trigger.addEventListener('click',()=>{if(typeof dialog.showModal!=='function'){window.location.href='/assets/revered-product-film.mp4';return;}dialog.showModal();const source=video.querySelector('source');if(!source.src){source.src=source.dataset.src;video.load();}video.play().catch(()=>{});}));
  dialog?.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog?.addEventListener('close',()=>{video.pause();});
  // The production form submits natively to Web3Forms. Never simulate a received lead.
  const form=document.querySelector('#dem');
  form?.addEventListener('submit',event=>{
    if(['localhost','127.0.0.1',''].includes(location.hostname)){
      event.preventDefault();const message=form.querySelector('.form-error');message.hidden=false;message.textContent=root.lang==='en'?'Local preview: nothing was sent. This form connects to Web3Forms on the published site.':'Aperçu local : rien n’a été envoyé. Ce formulaire sera traité par Web3Forms sur le site publié.';return;
    }
    const captcha=form.querySelector('textarea[name="h-captcha-response"]');
    if(!captcha?.value){event.preventDefault();const message=form.querySelector('.form-error');message.hidden=false;message.textContent=root.lang==='en'?'Please complete the anti-spam check before sending.':'Veuillez compléter la vérification anti-pourriel avant l’envoi.';return;}
    const message=form.querySelector('.form-error');if(message)message.hidden=true;
  });
})();

