(function(){
  var path=decodeURIComponent(window.location.pathname);
  var isBrugklas=/\/brugklas(?:\/index\.html|\/)?$/i.test(path);
  var isContact=/\/contact(?:\/index\.html|\/)?$/i.test(path);
  var isGroup8=/\/groep8\/?$/i.test(path);
  var base=(isBrugklas||isContact)?'../':'';
  function page(file){return base+file;}
  function homePage(){return window.location.protocol==='file:'?page('Homepagina.html'):'/';}
  function group8Page(hash){return window.location.protocol==='file:'?page('Homepagina-Groep8.html'+(hash||'')):'/groep8'+(hash||'');}
  function brugklasPage(){return window.location.protocol==='file:'?page('brugklas/index.html'):'/brugklas';}
  function contactPage(){return window.location.protocol==='file:'?page('contact/index.html'):'/contact';}
  function setupContactForms(){
    document.querySelectorAll('form[action^="https://formsubmit.co/"]').forEach(function(form){
      if(form.dataset.secureFormReady==='true')return;
      form.dataset.secureFormReady='true';
      form.addEventListener('submit',function(event){
        event.preventDefault();
        if(!form.reportValidity())return;
        var button=form.querySelector('button[type="submit"]');
        var originalLabel=button?button.textContent:'';
        var oldMessage=form.querySelector('.form-message');
        if(oldMessage)oldMessage.remove();
        if(button){button.disabled=true;button.textContent='Even versturen…'}
        fetch(form.action.replace('formsubmit.co/','formsubmit.co/ajax/'),{
          method:'POST',
          body:new FormData(form),
          headers:{Accept:'application/json'}
        }).then(function(response){
          if(!response.ok)throw new Error('Verzenden mislukt');
          return response.json();
        }).then(function(result){
          if(String(result.success).toLowerCase()!=='true')throw new Error(result.message||'Verzenden mislukt');
          form.innerHTML='<div class="form-success" role="status"><span class="form-success__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg></span><div><h3>Bedankt voor je bericht!</h3><p>We hebben je aanvraag goed ontvangen en nemen zo snel mogelijk contact met je op.</p></div></div>';
        }).catch(function(){
          var message=document.createElement('p');
          message.className='form-message';
          message.setAttribute('role','alert');
          message.textContent='Het versturen lukt op dit moment niet. Probeer het opnieuw of mail naar contact@klaarvoormiddelbaar.nl.';
          form.appendChild(message);
          if(button){button.disabled=false;button.textContent=originalLabel}
        });
      });
    });
  }
  function header(){return '<nav class="nav"><div class="nav-inner"><a class="nav-logo" href="'+homePage()+'"><img src="'+page('Dashboard/KvM%20logo%20no%20background.png')+'" alt="Klaar voor Middelbaar"></a><div class="nav-links"><a href="'+homePage()+'">Home</a><details class="nav-group"><summary data-href="'+group8Page()+'"><a class="nav-group-link" href="'+group8Page()+'">KvM Groep 8</a></summary><div class="nav-submenu"><a href="'+group8Page()+'">Programma</a><a href="'+page('Kernvaardigheden-Groep8.html')+'">Kernvaardigheden</a><a href="'+page('Materialen-Groep8.html')+'">Materialen</a><a href="'+page('Kerndoelen-Overzicht.html')+'">Kerndoelen</a><a href="'+page('Didactiek-Groep8.html')+'">Didactiek</a></div></details><a class="bridge-link" href="'+brugklasPage()+'">KvM Brugklas</a><a class="mobile-nav-cta" href="'+contactPage()+'">Maak kennis</a></div><a class="btn btn-primary nav-cta" href="'+contactPage()+'">Maak kennis</a><button class="nav-toggle" type="button" aria-expanded="false" aria-label="Menu openen"><span></span><span></span><span></span></button></div></nav>';}
  function footer(){return '<footer><div class="footer-inner"><div class="footer-col"><img class="footer-logo" src="'+page('Dashboard/KvM%20logo%20no%20background.png')+'" alt="Klaar voor Middelbaar"></div><div class="footer-col"><h4>Meer info</h4><a href="https://klaarvoormiddelbaar.nl/wp-content/uploads/2024/07/Privacyverklaring-Klaar-voor-Middelbaar.pdf" target="_blank" rel="noopener">Privacybeleid</a><a href="https://klaarvoormiddelbaar.nl/wp-content/uploads/2025/11/Algemene-Voorwaarden-Klaar-voor-Middelbaar-1.pdf" target="_blank" rel="noopener">Algemene voorwaarden</a></div><div class="footer-col"><h4>Contact</h4><a href="mailto:contact@klaarvoormiddelbaar.nl">contact@klaarvoormiddelbaar.nl</a><a href="tel:+31633382366">+31 6 33382366</a></div><div class="footer-col"><h4>Adres</h4><p>Haarlemmerweg 55-3<br>1051 KP Amsterdam</p></div></div><div class="footer-bottom">© 2026 Klaar voor Middelbaar. Alle rechten voorbehouden.</div></footer>';}
  function apply(){
    if(window.location.protocol!=='file:'){
      document.querySelectorAll('a[href$="brugklas/index.html"],a[href="/brugklas/"],a[href="/brugklas"]').forEach(function(link){link.setAttribute('href','/brugklas')});
      document.querySelectorAll('a[href*="Homepagina-Groep8.html"]').forEach(function(link){var hash=link.hash||'';link.setAttribute('href','/groep8'+hash)});
    }
    document.querySelectorAll('header.nav, nav.nav').forEach(function(el){el.remove()});
    document.querySelectorAll('footer').forEach(function(el){el.remove()});
    document.body.insertAdjacentHTML('afterbegin',header());
    document.body.insertAdjacentHTML('beforeend',footer());
    var currentPage=decodeURIComponent(window.location.pathname.split('/').pop()||'Homepagina.html');
    var homePages=['','Homepagina.html'];
    var group8Pages=['Homepagina-Groep8.html','Kernvaardigheden-Groep8.html','Materialen-Groep8.html','Kerndoelen-Overzicht.html','Didactiek-Groep8.html'];
    var homeLink=document.querySelector('.nav-links > a:first-child');
    var group8Link=document.querySelector('.nav-group > summary');
    var bridgeLink=document.querySelector('.nav-links > .bridge-link');
    if(homeLink&&!isBrugklas&&homePages.indexOf(currentPage)!==-1)homeLink.classList.add('active');
    if(group8Link&&(isGroup8||group8Pages.indexOf(currentPage)!==-1))group8Link.classList.add('active');
    if(bridgeLink&&isBrugklas)bridgeLink.classList.add('active');
    if(!document.getElementById('shared-chrome-runtime')){var s=document.createElement('style');s.id='shared-chrome-runtime';s.textContent='.nav .nav-inner{height:72px!important;padding:0 32px!important;max-width:1280px!important}.nav .nav-logo img{height:52px!important;width:auto!important}.nav .nav-links{font-size:14.5px!important;gap:28px!important}.nav .nav-cta{padding:12px 22px!important;border-radius:999px!important;font-size:16px!important;font-weight:700!important;line-height:1.2!important;text-decoration:none!important;background:#4e8ef3!important;color:#fff!important;border:2px solid #4e8ef3!important;box-shadow:0 10px 22px rgba(78,142,243,.25)!important}.nav.solid .nav-cta{background:transparent!important;color:#4e8ef3!important;border-color:rgba(78,142,243,.7)!important;box-shadow:none!important}.nav:not(.solid):not(.is-open) .nav-links > a,.nav:not(.solid):not(.is-open) .nav-group summary{color:rgba(255,255,255,.88)!important}.nav .nav-submenu{display:none!important;position:absolute!important;top:calc(100% + 10px)!important;left:50%!important;transform:translateX(-50%)!important;min-width:250px!important;padding:10px!important;gap:4px!important;background:rgba(248,251,255,.98)!important;border:1px solid rgba(78,142,243,.25)!important;border-radius:22px!important;box-shadow:0 18px 38px rgba(30,60,110,.22)!important;z-index:300!important}@media(min-width:820px){.nav .nav-group:hover .nav-submenu,.nav .nav-group:focus-within .nav-submenu{display:grid!important}}.nav .nav-group[open] .nav-submenu{display:grid!important}.nav .nav-group .nav-submenu a{position:relative!important;padding:12px 14px 12px 40px!important;border-radius:14px!important;color:#4e8ef3!important;background:transparent!important;font-size:17px!important;font-weight:700!important;text-decoration:none!important;white-space:nowrap!important}.nav .nav-group .nav-submenu a:before{content:""!important;position:absolute!important;left:16px!important;top:50%!important;width:9px!important;height:9px!important;border-radius:50%!important;background:#8bb7f8!important;transform:translateY(-50%)!important}.nav .nav-group .nav-submenu a:hover,.nav .nav-group .nav-submenu a:focus-visible{color:#fff!important;background:#4e8ef3!important}.nav .nav-group .nav-submenu a:hover:before,.nav .nav-group .nav-submenu a:focus-visible:before{background:#fff!important}';document.head.appendChild(s)}
    var buttonFix=document.createElement('style');buttonFix.textContent='.nav:not(.solid){background:transparent!important;background-color:transparent!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;border-bottom-color:transparent!important;box-shadow:none!important}.nav .nav-cta{background:transparent!important;color:#fff!important;font-weight:700!important;border:2px solid rgba(255,255,255,.78)!important;box-shadow:none!important}.nav.solid .nav-cta{background:#4e8ef3!important;color:#fff!important;font-weight:700!important;border-color:#4e8ef3!important;box-shadow:0 10px 22px rgba(78,142,243,.25)!important}';document.head.appendChild(buttonFix);
    var nav=document.querySelector('.nav');if(nav){var update=function(){nav.classList.toggle('solid',window.scrollY>60)};update();window.addEventListener('scroll',update,{passive:true});var closeGroups=function(){nav.querySelectorAll('.nav-group[open]').forEach(function(d){d.removeAttribute('open')})};var desktopNav=window.matchMedia('(min-width: 820px)');nav.querySelectorAll('.nav-group').forEach(function(details){var hoverTimer;details.addEventListener('mouseenter',function(){if(!desktopNav.matches)return;clearTimeout(hoverTimer);details.setAttribute('open','')});details.addEventListener('mouseleave',function(){if(!desktopNav.matches)return;clearTimeout(hoverTimer);hoverTimer=setTimeout(function(){details.removeAttribute('open')},120)})});var toggle=nav.querySelector('.nav-toggle');if(toggle){var closeMenu=function(){nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Menu openen');closeGroups()};toggle.addEventListener('click',function(e){e.stopPropagation();var open=nav.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Menu sluiten':'Menu openen');if(!open)closeGroups()});nav.querySelectorAll('.nav-links a').forEach(function(link){link.addEventListener('click',closeMenu)});document.addEventListener('click',function(e){if(!nav.contains(e.target))closeMenu()})}nav.querySelectorAll('.nav-group > summary').forEach(function(summary){summary.addEventListener('click',function(e){var groupLink=e.target.closest('.nav-group-link');e.preventDefault();e.stopPropagation();if(groupLink){window.location.href=groupLink.href;return}var details=summary.parentElement;var wasOpen=details.hasAttribute('open');nav.querySelectorAll('.nav-group[open]').forEach(function(d){if(d!==details)d.removeAttribute('open')});if(wasOpen){details.removeAttribute('open')}else{details.setAttribute('open','')}})})}
    var formStyles=document.createElement('style');formStyles.textContent='.form-success{grid-column:1/-1;display:flex;align-items:center;gap:20px;min-height:150px;padding:26px 28px;border:1px solid rgba(21,139,91,.2);border-radius:22px;background:linear-gradient(135deg,#f6fff9 0%,#e9f8f0 100%);box-shadow:inset 5px 0 0 #20a66a,0 16px 36px rgba(15,83,56,.14);color:#174c39}.form-success__icon{display:grid;place-items:center;flex:0 0 60px;width:60px;height:60px;border:1px solid rgba(255,255,255,.68);border-radius:50%;background:#20a66a;color:#fff;box-shadow:0 9px 22px rgba(24,139,90,.28)}.form-success__icon svg{width:31px;height:31px;fill:none;stroke:currentColor;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}.form-success h3{margin:0 0 7px;font:700 27px/1.2 Inria Sans,sans-serif;color:#12603f}.form-success p{margin:0!important;max-width:520px;font-size:17px;line-height:1.55;color:#365f50}.form-message{grid-column:1/-1;margin:0!important;padding:13px 16px;border-radius:13px;background:#fff1ed;color:#873d28;font-weight:700}.cta-form button:disabled,.contact-form button:disabled{cursor:wait;opacity:.72;transform:none!important}@media(max-width:540px){.form-success{align-items:flex-start;gap:15px;min-height:0;padding:21px 19px;border-radius:18px}.form-success__icon{flex-basis:49px;width:49px;height:49px}.form-success__icon svg{width:26px;height:26px}.form-success h3{font-size:23px}.form-success p{font-size:16px}}';document.head.appendChild(formStyles);
    setupContactForms();
    var demo=document.getElementById('lesopbouwDemoCta'),cta=document.querySelector('.floating-cta');if(demo&&cta&&'IntersectionObserver' in window)new IntersectionObserver(function(e){cta.classList.toggle('is-hidden',e[0].isIntersecting)},{threshold:.2}).observe(demo);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply); else apply();
})();
