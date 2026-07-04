'use strict';

/*
 * Vikas Kumar Prajapati — Game Portfolio
 * Each feature below is initialized independently inside safeInit(), so a
 * failure in one (missing element, unsupported API, etc.) can never stop
 * the others from running. This was the root cause of the earlier bug
 * where the cartridge console would silently stop responding.
 */

function safeInit(name, fn) {
  try {
    fn();
  } catch (err) {
    console.error('[portfolio] "' + name + '" failed to initialize:', err);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  safeInit('typewriter', initTypewriter);
  safeInit('start-button', initStartButton);
  safeInit('nav-highlight', initNavHighlight);
  safeInit('mobile-menu', initMobileMenu);
  safeInit('about-loader', initAboutLoader);
  safeInit('scramble-text', initScrambleText);
  safeInit('console-cartridges', initConsole);
});

var PREFERS_REDUCED_MOTION =
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- typewriter role line ---------------- */
function initTypewriter() {
  var roles = ['SOFTWARE DEVELOPER', 'PYTHON DEVELOPER', 'UI/UX DESIGNER'];
  var roleEl = document.getElementById('roleLine');
  if (!roleEl) return;

  if (PREFERS_REDUCED_MOTION) {
    roleEl.textContent = roles[0];
    return;
  }

  var ri = 0, ci = 0, deleting = false;
  function typeLoop() {
    var word = roles[ri];
    if (!deleting) {
      ci++;
      roleEl.innerHTML = word.slice(0, ci) + '<span class="caret">&nbsp;</span>';
      if (ci === word.length) {
        deleting = true;
        setTimeout(typeLoop, 1200);
        return;
      }
    } else {
      ci--;
      roleEl.innerHTML = word.slice(0, ci) + '<span class="caret">&nbsp;</span>';
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 45 : 85);
  }
  typeLoop();
}

/* ---------------- hero start button ---------------- */
function initStartButton() {
  var btn = document.getElementById('startBtn');
  var about = document.getElementById('about');
  if (!btn || !about) return;
  btn.addEventListener('click', function () {
    about.scrollIntoView({ behavior: PREFERS_REDUCED_MOTION ? 'auto' : 'smooth' });
  });
}

/* ---------------- nav active-section highlight ---------------- */
function initNavHighlight() {
  var links = document.querySelectorAll('.menu a[data-sec]');
  var sections = document.querySelectorAll('section[id]');
  if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        links.forEach(function (l) { l.classList.remove('active'); });
        var link = document.querySelector('.menu a[data-sec="' + entry.target.id + '"]');
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(function (s) { obs.observe(s); });
}

/* ---------------- mobile hamburger menu ---------------- */
function initMobileMenu() {
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  if (!burger || !menu) return;

  burger.addEventListener('click', function () { menu.classList.toggle('open'); });
  menu.querySelectorAll('a').forEach(function (l) {
    l.addEventListener('click', function () { menu.classList.remove('open'); });
  });
}

/* ---------------- about loading bar ---------------- */
function initAboutLoader() {
  var panel = document.getElementById('aboutPanel');
  var loadFill = document.getElementById('loadFill');
  var loadPct = document.getElementById('loadPct');
  if (!panel || !loadFill || !loadPct || !('IntersectionObserver' in window)) return;

  var loaded = false;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !loaded) {
        loaded = true;
        loadFill.style.width = '100%';
        var p = 0;
        var t = setInterval(function () {
          p += 4;
          if (p >= 100) { p = 100; clearInterval(t); }
          loadPct.textContent = p + '%';
        }, 45);
      }
    });
  }, { threshold: 0.4 });

  obs.observe(panel);
}

/* ---------------- gibberish-to-text scramble reveal ---------------- */
function initScrambleText() {
  var targets = document.querySelectorAll('.scramble-text');
  if (!targets.length) return;
  if (!('IntersectionObserver' in window)) return; // real text stays put, nothing to break

  var CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%*+=/\\<>';

  function randomChar() {
    return CHARSET[(Math.random() * CHARSET.length) | 0];
  }

  function scrambleOnce(finalText) {
    var out = '';
    for (var i = 0; i < finalText.length; i++) {
      var ch = finalText[i];
      out += (ch === ' ' || ch === '\n') ? ch : randomChar();
    }
    return out;
  }

  function revealText(el) {
    var finalText = el.textContent;
    if (PREFERS_REDUCED_MOTION) {
      el.textContent = finalText;
      return;
    }

    var frameInterval = 28;
    var duration = 1200 + Math.min(600, finalText.length * 2);
    var totalFrames = Math.max(1, Math.round(duration / frameInterval));
    var perFrame = Math.max(1, Math.ceil(finalText.length / totalFrames));
    var revealed = 0;

    el.classList.add('is-scrambling');

    var timer = setInterval(function () {
      revealed = Math.min(finalText.length, revealed + perFrame);
      var out = '';
      for (var i = 0; i < finalText.length; i++) {
        var ch = finalText[i];
        if (ch === ' ' || ch === '\n' || i < revealed) {
          out += ch;
        } else {
          out += randomChar();
        }
      }
      el.textContent = out;

      if (revealed >= finalText.length) {
        clearInterval(timer);
        el.textContent = finalText;
        el.classList.remove('is-scrambling');
      }
    }, frameInterval);
  }

  // Pre-scramble immediately (before the section is likely visible) so
  // nobody sees the real sentence flash before the decode animation runs.
  targets.forEach(function (el) {
    if (!PREFERS_REDUCED_MOTION) {
      el.dataset.final = el.textContent;
      el.textContent = scrambleOnce(el.textContent);
    }
  });

  var revealedSet = new WeakSet();
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !revealedSet.has(entry.target)) {
        revealedSet.add(entry.target);
        if (entry.target.dataset.final) {
          entry.target.textContent = entry.target.dataset.final;
        }
        revealText(entry.target);
      }
    });
  }, { threshold: 0.35 });

  targets.forEach(function (el) { obs.observe(el); });
}

/* ---------------- cartridge insert -> console playback ---------------- */
var PROJECT_DATA = {
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

function initConsole() {
  var carts = document.querySelectorAll('.cart');
  var consoleSlot = document.getElementById('consoleSlot');
  var slotLed = document.getElementById('slotLed');
  var slotChip = document.getElementById('slotChip');
  var consoleIdle = document.getElementById('consoleIdle');
  var consoleContent = document.getElementById('consoleContent');
  var consoleUnit = document.getElementById('consoleUnit');

  if (!carts.length || !consoleSlot || !consoleIdle || !consoleContent || !consoleUnit) return;

  var canAnimate = typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';
  var busy = false;

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function buildDetailHTML(d) {
    var linkBtn = d.link
      ? '<a class="play-btn" href="' + d.link + '" target="_blank" rel="noopener noreferrer">▸ PLAY LIVE</a>'
      : '';
    var bullets = d.bullets.map(function (b) { return '<li>' + escapeHTML(b) + '</li>'; }).join('');
    return (
      '<div class="cd-head">' +
        '<div>' +
          '<div class="cd-tag">NOW PLAYING</div>' +
          '<h3 class="cd-title">' + d.title + '</h3>' +
          '<div class="cd-meta">' + escapeHTML(d.meta) + '</div>' +
        '</div>' +
        '<div class="cd-actions">' +
          linkBtn +
          '<button type="button" class="close-detail" data-action="eject">EJECT ✕</button>' +
        '</div>' +
      '</div>' +
      '<ul class="cd-list">' + bullets + '</ul>'
    );
  }

  function setChip(cartEl) {
    if (!slotChip) return;
    var color = cartEl.style.getPropertyValue('--cart-color');
    if (color) slotChip.style.setProperty('--chip-color', color);
    slotChip.classList.add('active');
  }

  function clearChip() {
    if (slotChip) slotChip.classList.remove('active');
  }

  function renderContent(id) {
    var data = PROJECT_DATA[id];
    if (!data) { busy = false; return; }

    consoleIdle.style.display = 'none';
    consoleContent.innerHTML = buildDetailHTML(data);
    consoleContent.style.display = 'block';

    if (canAnimate && !PREFERS_REDUCED_MOTION) {
      consoleContent.getAnimations().forEach(function (a) { a.cancel(); });
      consoleContent.animate(
        [
          { transform: 'scaleY(0.02)', filter: 'brightness(3)', opacity: 0, offset: 0 },
          { transform: 'scaleY(1.03)', filter: 'brightness(2.2)', opacity: 1, offset: 0.28 },
          { transform: 'scaleY(0.97)', filter: 'brightness(.6)', opacity: 1, offset: 0.5 },
          { transform: 'scaleY(1)', filter: 'brightness(1)', opacity: 1, offset: 1 }
        ],
        { duration: 480, easing: 'ease-out' }
      );
    }

    consoleUnit.scrollIntoView({ behavior: PREFERS_REDUCED_MOTION ? 'auto' : 'smooth', block: 'center' });
    busy = false;
  }

  function closeConsole() {
    clearChip();
    if (slotLed) slotLed.classList.remove('lit');

    function reset() {
      consoleContent.style.display = 'none';
      consoleContent.innerHTML = '';
      consoleIdle.style.display = 'flex';
    }

    if (!canAnimate || PREFERS_REDUCED_MOTION) { reset(); return; }

    consoleContent.getAnimations().forEach(function (a) { a.cancel(); });
    var anim = consoleContent.animate(
      [
        { transform: 'scaleY(1)', filter: 'brightness(1)', opacity: 1 },
        { transform: 'scaleY(0.02)', filter: 'brightness(3)', opacity: 0 }
      ],
      { duration: 220, easing: 'ease-in', fill: 'forwards' }
    );

    var done = false;
    var finish = function () { if (!done) { done = true; reset(); } };
    if (anim.finished && typeof anim.finished.then === 'function') {
      anim.finished.then(finish, finish);
    } else {
      anim.onfinish = finish;
    }
    setTimeout(finish, 500); // safety net if the finish event never fires
  }

  function finishInsert(cartEl, id) {
    consoleSlot.classList.remove('slot-flash');
    void consoleSlot.offsetWidth; // force reflow so repeated inserts re-flash
    consoleSlot.classList.add('slot-flash');
    if (slotLed) slotLed.classList.add('lit');
    setChip(cartEl);
    renderContent(id);
  }

  function insertCartridge(cartEl) {
    if (busy) return;
    var id = cartEl.getAttribute('data-id');
    if (!id) return;
    busy = true;

    if (!canAnimate || PREFERS_REDUCED_MOTION) {
      finishInsert(cartEl, id);
      return;
    }

    var startRect, slotRect, clone;
    try {
      startRect = cartEl.getBoundingClientRect();
      slotRect = consoleSlot.getBoundingClientRect();
      clone = cartEl.cloneNode(true);
    } catch (err) {
      finishInsert(cartEl, id);
      return;
    }

    clone.classList.add('cart-fly');
    clone.removeAttribute('tabindex');
    clone.style.position = 'fixed';
    clone.style.left = startRect.left + 'px';
    clone.style.top = startRect.top + 'px';
    clone.style.width = startRect.width + 'px';
    clone.style.height = startRect.height + 'px';
    clone.style.margin = '0';
    document.body.appendChild(clone);

    var dx = (slotRect.left + slotRect.width / 2) - (startRect.left + startRect.width / 2);
    var dy = (slotRect.top + slotRect.height / 2) - (startRect.top + startRect.height / 2);

    var anim;
    try {
      anim = clone.animate(
        [
          { transform: 'translate(0px,0px) scale(1) rotate(0deg)', opacity: 1, offset: 0 },
          { transform: 'translate(' + dx + 'px, ' + (dy - 40) + 'px) scale(0.55) rotate(-3deg)', opacity: 1, offset: 0.65 },
          { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(0.2) rotate(0deg)', opacity: 0, offset: 1 }
        ],
        { duration: 650, easing: 'cubic-bezier(.5,0,.3,1)', fill: 'forwards' }
      );
    } catch (err) {
      clone.remove();
      finishInsert(cartEl, id);
      return;
    }

    var wrapped = false;
    function wrapUp() {
      if (wrapped) return;
      wrapped = true;
      clone.remove();
      finishInsert(cartEl, id);
    }

    // Safety net: guarantees the UI can never get permanently stuck even
    // if a browser fails to fire the animation-finished event.
    var safetyTimer = setTimeout(wrapUp, 900);

    if (anim.finished && typeof anim.finished.then === 'function') {
      anim.finished.then(
        function () { clearTimeout(safetyTimer); wrapUp(); },
        function () { clearTimeout(safetyTimer); wrapUp(); }
      );
    } else {
      anim.onfinish = function () { clearTimeout(safetyTimer); wrapUp(); };
    }
  }

  carts.forEach(function (c) {
    c.setAttribute('tabindex', '0');
    c.setAttribute('role', 'button');
    c.setAttribute('aria-label', 'Insert cartridge ' + (c.getAttribute('data-id') || ''));

    c.addEventListener('click', function () { insertCartridge(c); });
    c.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        insertCartridge(c);
      }
    });
  });

  // event delegation for the EJECT button — no inline handlers, CSP-friendly
  consoleContent.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-action="eject"]') : null;
    if (btn) closeConsole();
  });

  // subtle hover tilt, desktop pointer devices only
  if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
    carts.forEach(function (c) {
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = 'translateY(-10px) rotateX(' + (-y * 10) + 'deg) rotateY(' + (x * 10) + 'deg)';
      });
      c.addEventListener('mouseleave', function () { c.style.transform = ''; });
    });
  }
}
