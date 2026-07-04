// typewriter role line
  const roles = ["SOFTWARE DEVELOPER", "PYTHON DEVELOPER", "UI/UX DESIGNER"];
  const roleEl = document.getElementById('roleLine');
  let ri = 0, ci = 0, deleting = false;
  function typeLoop(){
    const word = roles[ri];
    if(!deleting){
      ci++;
      roleEl.innerHTML = word.slice(0,ci) + '<span class="caret">&nbsp;</span>';
      if(ci === word.length){ deleting = true; setTimeout(typeLoop, 1200); return; }
    } else {
      ci--;
      roleEl.innerHTML = word.slice(0,ci) + '<span class="caret">&nbsp;</span>';
      if(ci === 0){ deleting = false; ri = (ri+1) % roles.length; }
    }
    setTimeout(typeLoop, deleting ? 45 : 85);
  }
  typeLoop();

  // nav active section highlight
  const links = document.querySelectorAll('.menu a');
  const sections = document.querySelectorAll('section[id]');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        links.forEach(l=>l.classList.remove('active'));
        const link = document.querySelector('.menu a[data-sec="'+e.target.id+'"]');
        if(link) link.classList.add('active');
      }
    });
  }, {rootMargin:'-45% 0px -45% 0px'});
  sections.forEach(s=>obs.observe(s));

  // mobile burger
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  burger.addEventListener('click', ()=> menu.classList.toggle('open'));
  links.forEach(l=>l.addEventListener('click', ()=> menu.classList.remove('open')));

  // about loading bar on scroll into view
  const loadFill = document.getElementById('loadFill');
  const loadPct = document.getElementById('loadPct');
  let loaded = false;
  const aboutObs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting && !loaded){
        loaded = true;
        loadFill.style.width = '100%';
        let p = 0;
        const t = setInterval(()=>{
          p += 4;
          if(p >= 100){ p = 100; clearInterval(t); }
          loadPct.textContent = p + '%';
        }, 45);
      }
    });
  }, {threshold:.4});
  aboutObs.observe(document.getElementById('aboutPanel'));

  // ---------- cartridge insert -> console playback ----------
  const carts = document.querySelectorAll('.cart');
  const consoleSlot = document.getElementById('consoleSlot');
  const slotLed = document.getElementById('slotLed');
  const consoleIdle = document.getElementById('consoleIdle');
  const consoleContent = document.getElementById('consoleContent');
  const consoleUnit = document.getElementById('consoleUnit');
  let busy = false;

  const projectData = {
    p1: {
      title: 'ResumeSeek — AI Resume Analyzer',
      meta: 'Python · FastAPI · Google Gemini 1.5 Flash · React.js — Live',
      bullets: [
        'Engineered a FastAPI backend to parse PDF resumes and return ATS scores plus job-role recommendations via the Gemini AI API.',
        'Designed and deployed the React.js frontend end-to-end on Vercel with a drag-and-drop upload experience.',
        'Implemented structured error handling, input validation, and production-grade API optimization.'
      ],
      link: 'https://resume-seek.vercel.app'
    },
    p2: {
      title: 'Campus Lost &amp; Found Portal',
      meta: 'React.js · FastAPI · MongoDB · JWT · Cloudinary — Full Stack, Ongoing',
      bullets: [
        'Built a complete full-stack portal with a React.js frontend, FastAPI backend, MongoDB, and a Cloudinary image pipeline.',
        'Implemented JWT-based Role-Based Access Control (RBAC) with secure upload validation.',
        'Designed the end-to-end UI in Figma — from wireframes to pixel-perfect production code.'
      ],
      link: null
    },
    p3: {
      title: 'DesiBites — Food Delivery SPA',
      meta: 'Vanilla JS (ES6+) · HTML5 · CSS3 · Vercel — Live',
      bullets: [
        'Built a framework-free single-page app with real-time cart state management and a multi-step checkout — no libraries.',
        'Delivered a fully responsive layout across all breakpoints with optimized asset loading.'
      ],
      link: 'https://food-delivery-desi-bites.vercel.app'
    },
    p4: {
      title: 'Rakshya AI — Disaster Response Platform',
      meta: 'React.js · Flask · Google Gemini AI · Firebase · Google Maps API — Google Solution Challenge 2026',
      bullets: [
        'Built an AI-powered volunteer coordination system for real-time disaster resource allocation.',
        'Integrated Gemini AI for smart volunteer-to-need matching and the Google Maps API for live routing.',
        'Submitted to the Google Solution Challenge 2026, Smart Resource Allocation track.'
      ],
      link: null
    }
  };

  function buildDetailHTML(d){
    const linkBtn = d.link ? `<a class="play-btn" href="${d.link}" target="_blank" rel="noopener">▸ PLAY LIVE</a>` : '';
    const bullets = d.bullets.map(b => `<li>${b}</li>`).join('');
    return `
      <div class="cd-head">
        <div>
          <div class="cd-tag">NOW PLAYING</div>
          <h3 class="cd-title">${d.title}</h3>
          <div class="cd-meta">${d.meta}</div>
        </div>
        <div class="cd-actions">
          ${linkBtn}
          <button class="close-detail" onclick="closeConsole()">EJECT ✕</button>
        </div>
      </div>
      <ul class="cd-list">${bullets}</ul>
    `;
  }

  function powerOnScreen(id){
    const data = projectData[id];
    if(!data) return;
    consoleIdle.style.display = 'none';
    consoleContent.innerHTML = buildDetailHTML(data);
    consoleContent.style.display = 'block';
    const kf = [
      { transform:'scaleY(0.02)', filter:'brightness(3)', opacity:0, offset:0 },
      { transform:'scaleY(1.03)', filter:'brightness(2.2)', opacity:1, offset:.28 },
      { transform:'scaleY(0.97)', filter:'brightness(.6)', opacity:1, offset:.5 },
      { transform:'scaleY(1)', filter:'brightness(1)', opacity:1, offset:1 }
    ];
    consoleContent.animate(kf, { duration:480, easing:'ease-out' });
    consoleUnit.scrollIntoView({ behavior:'smooth', block:'center' });
  }

  function closeConsole(){
    const kf = [
      { transform:'scaleY(1)', filter:'brightness(1)', opacity:1 },
      { transform:'scaleY(0.02)', filter:'brightness(3)', opacity:0 }
    ];
    const anim = consoleContent.animate(kf, { duration:220, easing:'ease-in', fill:'forwards' });
    anim.onfinish = () => {
      consoleContent.style.display = 'none';
      consoleContent.innerHTML = '';
      consoleIdle.style.display = 'flex';
      slotLed.classList.remove('lit');
    };
  }

  function insertCartridge(cartEl){
    if(busy) return;
    busy = true;
    const id = cartEl.getAttribute('data-id');
    const startRect = cartEl.getBoundingClientRect();
    const slotRect = consoleSlot.getBoundingClientRect();

    const clone = cartEl.cloneNode(true);
    clone.classList.add('cart-fly');
    clone.style.left = startRect.left + 'px';
    clone.style.top = startRect.top + 'px';
    clone.style.width = startRect.width + 'px';
    clone.style.height = startRect.height + 'px';
    clone.style.margin = '0';
    clone.style.zIndex = '600';
    document.body.appendChild(clone);

    const cx = startRect.left + startRect.width/2;
    const cy = startRect.top + startRect.height/2;
    const sx = slotRect.left + slotRect.width/2;
    const sy = slotRect.top + slotRect.height/2;
    const dx = sx - cx;
    const dy = sy - cy;

    const kf = [
      { transform:'translate(0px,0px) scale(1) rotate(0deg)', opacity:1, offset:0 },
      { transform:`translate(${dx}px, ${dy - 40}px) scale(0.55) rotate(-3deg)`, opacity:1, offset:.65 },
      { transform:`translate(${dx}px, ${dy}px) scale(0.2) rotate(0deg)`, opacity:0, offset:1 }
    ];
    const anim = clone.animate(kf, { duration:650, easing:'cubic-bezier(.5,0,.3,1)', fill:'forwards' });
    anim.onfinish = () => {
      clone.remove();
      consoleSlot.classList.remove('slot-flash');
      void consoleSlot.offsetWidth;
      consoleSlot.classList.add('slot-flash');
      slotLed.classList.add('lit');
      setTimeout(() => { powerOnScreen(id); busy = false; }, 160);
    };
  }

  carts.forEach(c => {
    c.addEventListener('click', () => insertCartridge(c));
  });

  // subtle cart tilt on mouse move (desktop only)
  if(window.matchMedia('(hover:hover)').matches){
    carts.forEach(c=>{
      c.addEventListener('mousemove', (e)=>{
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left)/r.width - .5;
        const y = (e.clientY - r.top)/r.height - .5;
        c.style.transform = `translateY(-10px) rotateX(${(-y*10)}deg) rotateY(${x*10}deg)`;
      });
      c.addEventListener('mouseleave', ()=> c.style.transform = '');
    });
  }
