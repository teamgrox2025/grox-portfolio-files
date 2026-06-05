/* ---------------------------------------------------------
   SCROLL.JS - Lenis smooth scroll + GSAP ScrollTrigger
   All scroll-linked animations live here.
--------------------------------------------------------- */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════
     PART 1 — CRITICAL REVEALS (zero GSAP dependency)
     Runs immediately. Sections 3, 4, 5 always animate.
  ══════════════════════════════════════════════════════ */
  (function criticalReveals() {

    /* Helper — one-shot IntersectionObserver */
    function once(threshold, fn) {
      return new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          obs.unobserve(entry.target);
          fn(entry.target);
        });
      }, { threshold: threshold });
    }

    /* ── SECTION 3: STATS ──────────────────────────────
       stat-items start opacity:0 in CSS, revealed here  */
    var statObs = once(0.25, function (el) { el.classList.add('visible'); });
    document.querySelectorAll('.stat-item').forEach(function (el) {
      statObs.observe(el);
    });
    var ruleEl = document.getElementById('stats-rule');
    if (ruleEl) once(0.1, function (el) { el.classList.add('visible'); }).observe(ruleEl);

    /* ── SECTION 4: PRODUCTION PANELS ─────────────────
       position:sticky panels need scroll-position math,
       NOT IntersectionObserver.

       Root cause: clip-path on an observed element makes
       the browser report intersectionRatio=0 even when the
       element's layout box is inside the viewport — so IO
       never fires. We fall back to a passive scroll listener
       that compares window.scrollY against each panel's
       natural offsetTop (stable, unaffected by sticky).

       Two-layer animation per panel (idx > 0):
       1. Panel itself: clip-path inset wipe (overlay effect)
       2. Phones / step-num / spec-tags: stagger reveal       */
    function observeProductionPanels() {
      var panels = Array.from(document.querySelectorAll('.prod-panel'));
      if (!panels.length) { requestAnimationFrame(observeProductionPanels); return; }

      /* ── Initial state setup ── */
      panels.forEach(function (panel, idx) {
        if (idx > 0) {
          panel.style.clipPath  = 'inset(100% 0 0 0)';
          panel.style.transition = 'clip-path 0.65s cubic-bezier(0.22,1,0.36,1)';
        }
        var phones  = Array.from(panel.querySelectorAll('.iphone-frame'));
        var stepNum = panel.querySelector('.prod-step-num');
        var specs   = Array.from(panel.querySelectorAll('.prod-spec-tag'));

        phones.forEach(function (p) {
          p.style.opacity    = '0';
          p.style.transform  = 'translateY(50px) scale(0.92)';
          p.style.transition = 'opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)';
        });
        if (stepNum) {
          stepNum.style.opacity    = '0';
          stepNum.style.transform  = 'translateX(-28px)';
          stepNum.style.transition = 'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)';
        }
        specs.forEach(function (s) {
          s.style.opacity    = '0';
          s.style.transform  = 'translateY(10px)';
          s.style.transition = 'opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)';
        });
      });

      /* ── Natural document-top via offsetTop chain (stable for sticky) ── */
      function getDocTop(el) {
        var top = 0;
        var cur = el;
        while (cur && cur !== document.body) {
          top += cur.offsetTop || 0;
          cur = cur.offsetParent;
        }
        return top;
      }
      var panelTops = panels.map(getDocTop);
      var triggered = panels.map(function () { return false; });
      var vh = window.innerHeight;

      function animatePanel(idx) {
        var panel   = panels[idx];
        var phones  = Array.from(panel.querySelectorAll('.iphone-frame'));
        var stepNum = panel.querySelector('.prod-step-num');
        var specs   = Array.from(panel.querySelectorAll('.prod-spec-tag'));

        if (idx > 0) panel.style.clipPath = 'inset(0% 0 0 0)';
        if (stepNum) { stepNum.style.opacity = '1'; stepNum.style.transform = 'none'; }
        phones.forEach(function (p, i) {
          setTimeout(function () { p.style.opacity = '1'; p.style.transform = 'none'; }, 100 + i * 130);
        });
        specs.forEach(function (s, i) {
          setTimeout(function () { s.style.opacity = '1'; s.style.transform = 'none'; }, 360 + i * 70);
        });
      }

      /* Trigger when 12% of panel is visible from below.
         All panels go through the same handler — panel 0 skips clip-path. */
      function onScroll() {
        var sy = window.scrollY;
        var allDone = true;
        for (var i = 0; i < panels.length; i++) {
          if (!triggered[i]) {
            allDone = false;
            if (sy >= panelTops[i] - vh * 0.88) {
              triggered[i] = true;
              animatePanel(i);
            }
          }
        }
        if (allDone) window.removeEventListener('scroll', onScroll);
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); /* in case page loads already scrolled */
    }
    observeProductionPanels();

    /* ── SECTION 5: SERVICES PANELS OVERLAY ROTATION ──
       Each panel's inner content starts rotated 30°
       and flips flat as it slides into view.
       No GSAP required — CSS transition does the work.  */
    (function () {
      if (window.innerWidth <= 900) return;   /* mobile shows flat stacked layout */
      var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.matches) return;

      var panels = Array.from(document.querySelectorAll('.srv-panel'));
      if (!panels.length) return;

      panels.forEach(function (panel, i) {
        if (i === 0) return;   /* first panel always sits flat */

        var inner = panel.querySelector('.srv-panel-inner');
        if (!inner) return;

        /* Set starting rotation */
        inner.style.transform       = 'rotate(30deg)';
        inner.style.transformOrigin = 'bottom left';
        inner.style.transition      = 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)';

        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            obs.unobserve(panel);
            inner.style.transform = 'rotate(0deg)';
          });
        }, { threshold: 0.18 });

        obs.observe(panel);
      });
    })();

    /* ── PROCESS ITEMS (section 9) --------------------- */
    var procObs = once(0.15, function (el) { el.classList.add('visible'); });
    document.querySelectorAll('.process-item').forEach(function (el) { procObs.observe(el); });

    /* ── FOOTER LOGO ------------------------------------ */
    var logoEl = document.getElementById('footer-giant');
    if (logoEl) once(0.1, function (el) { el.classList.add('visible'); }).observe(logoEl);

  })(); /* end criticalReveals */


  /* ══════════════════════════════════════════════════════
     PART 2 — GSAP enhanced animations (nice-to-have)
     If GSAP fails to load, revealFallback shows content.
  ══════════════════════════════════════════════════════ */
  function revealFallback() {
    document.querySelectorAll('[data-char-blur], [data-line-reveal], [data-blur-label]').forEach(function (el) {
      el.style.opacity = '1'; el.style.transform = 'none'; el.style.filter = 'none';
    });
    var strip3d = document.getElementById('viral-strip-3d');
    if (strip3d) { strip3d.style.opacity = '1'; strip3d.style.transform = 'none'; }
    /* Ensure service panel inners are flat if GSAP scrub never ran */
    document.querySelectorAll('.srv-panel-inner').forEach(function (el) {
      el.style.transform = 'none';
    });
  }

  var retries = 0;
  var maxRetries = 50;

  function init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      retries++;
      if (retries >= maxRetries) { revealFallback(); return; }
      setTimeout(init, 80);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* -- LENIS ----------------------------------------- */
    if (typeof Lenis !== 'undefined') {
      var lenis = new Lenis({
        duration: 1.2,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    /* -- CHAR BLUR REVEAL ------------------------------ */
    function splitAndBlur(el) {
      if (!el || el.dataset.blurDone) return;
      el.dataset.blurDone = '1';

      function wrapTextNode(node) {
        var frag = document.createDocumentFragment();
        node.textContent.split(' ').forEach(function (word, wi) {
          if (wi > 0) frag.appendChild(document.createTextNode(' '));
          var wrap = document.createElement('span');
          wrap.style.cssText = 'display:inline;white-space:nowrap;';
          Array.from(word).forEach(function (c) {
            if (c === '\n') { wrap.appendChild(document.createElement('br')); return; }
            var s = document.createElement('span');
            s.className = 'char';
            s.textContent = c;
            s.style.cssText = 'display:inline-block;opacity:0;filter:blur(8px);transform:translateY(6px);will-change:filter,opacity,transform;';
            wrap.appendChild(s);
          });
          frag.appendChild(wrap);
        });
        node.parentNode.replaceChild(frag, node);
      }

      function walk(node) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) { wrapTextNode(node); }
        else if (node.nodeType === Node.ELEMENT_NODE) { Array.from(node.childNodes).forEach(walk); }
      }
      walk(el);

      var chars = el.querySelectorAll('.char');
      if (!chars.length) return;
      gsap.to(chars, {
        opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.55,
        stagger: { each: 0.016, ease: 'power2.in' }, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 84%', once: true },
      });
    }
    document.querySelectorAll('[data-char-blur]').forEach(splitAndBlur);

    /* -- LABEL REVEAL ---------------------------------- */
    document.querySelectorAll('[data-blur-label]').forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    /* -- LINE REVEAL ----------------------------------- */
    document.querySelectorAll('[data-line-reveal]').forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 87%', once: true } });
    });

    /* -- INHOUSE photo reveal -------------------------- */
    var inhousePhoto = document.querySelector('.inhouse-photo-strip');
    if (inhousePhoto) {
      gsap.fromTo(inhousePhoto, { opacity: 0, y: 50, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.inhouse-photo-strip', start: 'top 85%', once: true } });
    }

    /* -- VIRAL STRIP entrance -------------------------- */
    var strip3d = document.getElementById('viral-strip-3d');
    if (strip3d) {
      gsap.fromTo(strip3d, { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '#viral', start: 'top 80%', once: true } });
    }

    ScrollTrigger.refresh();
    setTimeout(function () { ScrollTrigger.refresh(); }, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
