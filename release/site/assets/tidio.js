(() => {
  'use strict';

  const widgetSource='https://code.tidio.co/9suaedkq9yly9dsnz59nzaoow7yazpm1.js';
  if(document.querySelector('.tidio-launcher'))return;

  const launcher=document.createElement('button');
  launcher.type='button';
  launcher.className='tidio-launcher';
  launcher.setAttribute('aria-haspopup','dialog');
  launcher.innerHTML='<span class="tidio-launcher-label"><span data-fr>Une question?</span><span data-en>Need help?</span></span><span class="tidio-launcher-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M5.5 4.5h13a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-6.2L8 21v-3.5H5.5a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3Z" fill="currentColor"/></svg></span>';
  document.body.append(launcher);

  let loading=false;
  let opened=false;
  let readyTimer;
  function openWidget(){
    if(opened||!window.tidioChatApi)return;
    clearTimeout(readyTimer);
    opened=true;
    window.tidioChatApi.show();
    window.tidioChatApi.open();
    launcher.remove();
  }
  function ready(){openWidget();}
  function resetAfterError(event){
    clearTimeout(readyTimer);
    document.removeEventListener('tidioChat-ready',ready);
    if(event&&event.currentTarget)event.currentTarget.remove();
    loading=false;
    launcher.disabled=false;
    launcher.classList.remove('is-loading');
    launcher.removeAttribute('aria-busy');
    const fr=launcher.querySelector('[data-fr]'),en=launcher.querySelector('[data-en]');
    if(fr)fr.textContent='Réessayer le clavardage';
    if(en)en.textContent='Retry chat';
  }

  launcher.addEventListener('click',()=>{
    if(loading)return;
    if(window.tidioChatApi){openWidget();return;}
    loading=true;
    launcher.disabled=true;
    launcher.classList.add('is-loading');
    launcher.setAttribute('aria-busy','true');
    document.tidioChatLang=document.documentElement.lang==='en'?'en':'fr';
    document.addEventListener('tidioChat-ready',ready,{once:true});
    const script=document.createElement('script');
    script.id='tidio-widget-script';
    script.src=widgetSource;
    script.async=true;
    script.addEventListener('error',resetAfterError,{once:true});
    document.body.append(script);
    readyTimer=setTimeout(()=>{
      if(!window.tidioChatApi)resetAfterError({currentTarget:script});
      else openWidget();
    },15000);
  });
})();
