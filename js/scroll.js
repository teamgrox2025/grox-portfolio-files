/* ---------------------------------------------------------
   SCROLL.JS - Lenis smooth scroll + GSAP ScrollTrigger
   All scroll-linked animations live here.
--------------------------------------------------------- */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════
     PART 1 — CRITICAL REVEALS (zero GSAP dependency)
     These run immediately so sections 3 and 4 always work
     regardless of whether GSAP / Lenis load successfully.
  ══════════════════════════════════════════════════════ */
  (function criticalReveals() {

    /* Helper — create an IntersectionObserver that fires once */
    function once(threshold, fn) {
      return new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          obs.unobserve(entry.target);
          fn(entry.target);
        });
      }, { threshold: threshold });
    }

    /* -- STAT ITEMS (section 3) ------------------------ */
    var statObs = once(0.25, function (el) { el.classList.add('visible'); });
    document.querySelectorAll('.stat-item').forEach(function (el) {
      statObs.observe(el);
    });

    /* -- STATS RULE line (section 3) ------------------- */
    var ruleEl = document.getElementById('stats-rule');
    if (ruleEl) {
      once(0.1, function (el) { el.classList.add('visible'); }).observe(ruleEl);
    }

    /* -- PROCESS ITEMS (section 9) --------------------- */
    var procObs = once(0.15, function (el) { el.classList.add('visible'); });
    document.querySelectorAll('.process-item').forEach(function (el) {
      procObs.observe(el);
    });

    /* -- FOOTER LOGO ------------------------------------ */
    var logoEl = document.getElementById('footer-giant');
    if (logoEl) {
      once(0.1, function (el) { el.classList.add('visible'); }).observe(logoEl);
    }

    /* -- PRODUCTION PANELS (section 4) -----------------
       position:sticky panels need IntersectionObserver
       (ScrollTrigger uses document position, not visual
       sticky position, so it fires at the wrong time).  */
    /* Wait for main.js to inject panels before observing */
    function observeProductionPanels() {
      var panels = Array.from(document.querySelectorAll('.prod-panel'));
      if (!panels.length) {
        /* panels not yet in DOM — retry on next frame */
        requestAnimationFrame(observeProductionPanels);
        return;
      }

      panels.forEach(function (panel) {
        var phones  = Array.from(panel.querySelectorAll('.iphone-frame'));
        var stepNum = panel.querySelector('.prod-step-num');
        var specs   = Array.from(panel.querySelectorAll('.prod-spec-tag'));

        /* Set initial hidden state */
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

        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            obs.unobserve(panel);

            if (stepNum) {
              stepNum.style.opacity  = '1';
              stepNum.style.transform = 'none';
            }
            phones.forEach(function (p, i) {
              setTimeout(function () {
                p.style.opacity  = '1';
                p.style.transform = 'none';
              }, 80 + i * 130);
            });
            specs.forEach(function (s, i) {
              setTimeout(function () {
                s.style.opacity  = '1';
                s.style.transform = 'none';
              }, 340 + i * 70);
            });
          });
        }, { threshold: 0.15 });

        obs.observe(panel);
      });
    }

    observeProductionPanels();

  })(); /* end criticalReveals */


  /* ══════════════════════════════════════════════════════
     PART 2 — GSAP / ScrollTrigger enhanced animations
     Nice-to-have. Gracefully skipped if GSAP fails.
  ══════════════════════════════════════════════════════ */

  /* Fallback: if GSAP never loads, reveal any remaining hidden elements */
  function revealFallback() {
    document.querySelectorAll('[data-char-blur], [data-line-reveal], [data-blur-label]').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
    });
    var strip3d = document.getElementById('viral-strip-3d');
    if (strip3d) { strip3d.style.opacity = '1'; strip3d.style.transform = 'none'; }
    document.querySelectorAll('.srv-panel-inner').forEach(function (el) {
      el.style.transform = 'none';
    });
  }

  var retries = 0;
  var maxRetries = 50; /* 50 × 80 ms = 4 s */

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

      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    /* -- CHAR BLUR REVEAL ------------------------------ */
    function splitAndBlur(el) {
      if (!el || el.dataset.blurDone) return;
      el.dataset.blurDone = '1';

      function wrapTextNode(node) {
        var frag = document.createDocumentFragment();
        var words = node.textContent.split(' ');
        words.forEach(function (word, wi) {
          if (wi > 0) frag.appendChild(document.createTextNode(' '));
          var wordWrap = document.createElement('span');
          wordWrap.style.cssText = 'display:inline;white-space:nowrap;';
          Array.from(word).forEach(function (c) {
            if (c === '\n') {
              wordWrap.appendChild(document.createElement('br'));
            } else {
              var span = document.createElement('span');
              span.className = 'char';
              span.textContent = c;
              span.style.cssText = 'display:inline-block;opacity:0;filter:blur(8px);transform:translateY(6px);will-change:filter,opacity,transform;';
              wordWrap.appendChild(span);
            }
          });
          frag.appendChild(wordWrap);
        });
        node.parentNode.replaceChild(frag, node);
      }

      function walkNode(node) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          wrapTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          Array.from(node.childNodes).forEach(walkNode);
        }
      }

      walkNode(el);

      var chars = el.querySelectorAll('.char');
      if (!chars.length) return;

      gsap.to(chars, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.55,
        stagger: { each: 0.016, ease: 'power2.in' },
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 84%', once: true },
      });
    }

    document.querySelectorAll('[data-char-blur]').forEach(splitAndBlur);

    /* -- LABEL REVEAL ---------------------------------- */
    document.querySelectorAll('[data-blur-label]').forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
      );
    });

    /* -- LINE REVEAL ----------------------------------- */
    document.querySelectorAll('[data-line-reveal]').forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 87%', once: true } }
      );
    });

    /* -- INHOUSE photo reveal -------------------------- */
    var inhousePhoto = document.querySelector('.inhouse-photo-strip');
    if (inhousePhoto) {
      gsap.fromTo(inhousePhoto,
        { opacity: 0, y: 50, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.inhouse-photo-strip', start: 'top 85%', once: true } }
      );
    }

    /* -- SERVICES FLOW-ART (desktop only) -------------- */
    (function () {
      if (window.innerWidth <= 900) return;
      var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.matches) return;

      var panels = Array.from(document.querySelectorAll('.srv-panel'));
      if (!panels.length) return;

      panels.forEach(function (panel, i) {
        gsap.set(panel, { zIndex: i + 1 });
        var inner = panel.querySelector('.srv-panel-inner');
        if (!inner || i === 0) return;

        gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' });
        ScrollTrigger.create({
          trigger: panel,
          start: 'top bottom',
          end: 'top 18%',
          scrub: true,
          animation: gsap.to(inner, { rotation: 0, ease: 'none' }),
        });
        /* Snap to 0 if panel is already on screen when page loads */
        var rect = panel.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.18) {
          gsap.set(inner, { rotation: 0 });
        }
      });
    })();

    /* -- VIRAL STRIP entrance -------------------------- */
    var strip3d = document.getElementById('viral-strip-3d');
    if (strip3d) {
      gsap.fromTo(strip3d,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '#viral', start: 'top 80%', once: true } }
      );
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
