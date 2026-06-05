/* ---------------------------------------------------------
   SCROLL.JS - Lenis smooth scroll + GSAP ScrollTrigger
   All scroll-linked animations live here.
--------------------------------------------------------- */

(function () {
  'use strict';

  /* If GSAP/ScrollTrigger never load (CDN blocked, network error),
     reveal all hidden elements after 4 s so the page isn't blank. */
  function revealFallback() {
    document.querySelectorAll('.stat-item, .process-item').forEach((el) => {
      el.classList.add('visible');
    });
    document.querySelectorAll('[data-char-blur], [data-line-reveal], [data-blur-label]').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
    });
    const strip3d = document.getElementById('viral-strip-3d');
    if (strip3d) { strip3d.style.opacity = '1'; strip3d.style.transform = 'none'; }
    document.querySelectorAll('.srv-panel-inner').forEach((el) => {
      el.style.transform = 'none';
    });
    document.querySelectorAll('.prod-panel .iphone-frame, .prod-panel .prod-step-num, .prod-panel .prod-spec-tag, .footer-logo-img').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  let retries = 0;
  const maxRetries = 50; // 50 × 80 ms = 4 s

  function init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      retries++;
      if (retries >= maxRetries) { revealFallback(); return; }
      setTimeout(init, 80);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* -- LENIS ----------------------------------------- */
    let lenis;
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      });

      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    /* -- CHAR BLUR REVEAL ------------------------------ */
    function splitAndBlur(el) {
      if (!el || el.dataset.blurDone) return;
      el.dataset.blurDone = '1';

      // Group chars per word so line-breaks never split inside a word
      function wrapTextNode(node) {
        const frag = document.createDocumentFragment();
        const words = node.textContent.split(' ');
        words.forEach((word, wi) => {
          if (wi > 0) frag.appendChild(document.createTextNode(' '));
          const wordWrap = document.createElement('span');
          wordWrap.style.cssText = 'display:inline;white-space:nowrap;';
          Array.from(word).forEach((c) => {
            if (c === '\n') {
              wordWrap.appendChild(document.createElement('br'));
            } else {
              const span = document.createElement('span');
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

      const chars = el.querySelectorAll('.char');
      if (!chars.length) return;

      gsap.to(chars, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.55,
        stagger: { each: 0.016, ease: 'power2.in' },
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 84%',
          once: true,
        },
      });
    }

    document.querySelectorAll('[data-char-blur]').forEach(splitAndBlur);

    /* -- LABEL REVEAL ---------------------------------- */
    document.querySelectorAll('[data-blur-label]').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }
      );
    });

    /* -- LINE REVEAL ----------------------------------- */
    document.querySelectorAll('[data-line-reveal]').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 22 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 87%', once: true },
        }
      );
    });

    /* -- STATS RULE ------------------------------------ */
    const statsRule = document.getElementById('stats-rule');
    if (statsRule) {
      ScrollTrigger.create({
        trigger: statsRule,
        start: 'top 80%',
        once: true,
        onEnter: () => statsRule.classList.add('visible'),
      });
    }

    /* -- STAT ITEMS ------------------------------------ */
    document.querySelectorAll('.stat-item').forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => el.classList.add('visible'),
      });
    });

    /* -- PROCESS ITEMS --------------------------------- */
    document.querySelectorAll('.process-item').forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => el.classList.add('visible'),
      });
    });

    /* -- FOOTER WORDMARK text -------------------------- */
    const footerGiant = document.getElementById('footer-giant');
    if (footerGiant) {
      ScrollTrigger.create({
        trigger: footerGiant,
        start: 'top 95%',
        once: true,
        onEnter: () => footerGiant.classList.add('visible'),
      });
    }

    /* -- INHOUSE reveal (Quanta About style) ----------- */
    const inhouseHeadlineCol = document.querySelector('.inhouse-headline-col');
    if (inhouseHeadlineCol) {
      gsap.fromTo(inhouseHeadlineCol,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '#inhouse', start: 'top 78%', once: true },
        }
      );
    }
    const inhouseRightCol = document.querySelector('.inhouse-right-col');
    if (inhouseRightCol) {
      gsap.fromTo(inhouseRightCol,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.12,
          scrollTrigger: { trigger: '#inhouse', start: 'top 78%', once: true },
        }
      );
    }
    const inhousePhoto = document.querySelector('.inhouse-photo-strip');
    if (inhousePhoto) {
      gsap.fromTo(inhousePhoto,
        { opacity: 0, y: 50, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.inhouse-photo-strip', start: 'top 85%', once: true },
        }
      );
    }

    /* -- SERVICES FLOW-ART (page-flip scroll animation) -- */
    /* Only runs on desktop — mobile uses normal stacked layout */
    (function () {
      if (window.innerWidth <= 900) return;

      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.matches) return;

      const panels = Array.from(document.querySelectorAll('.srv-panel'));
      if (!panels.length) return;

      panels.forEach((panel, i) => {
        gsap.set(panel, { zIndex: i + 1 });

        const inner = panel.querySelector('.srv-panel-inner');
        if (!inner) return;

        if (i > 0) {
          gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' });
          const st = ScrollTrigger.create({
            trigger: panel,
            start: 'top bottom',
            end: 'top 18%',
            scrub: true,
            animation: gsap.to(inner, { rotation: 0, ease: 'none' }),
          });
          /* Safety: if panel is already on screen when page loads, snap to 0 */
          const rect = panel.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.18) {
            gsap.set(inner, { rotation: 0 });
          }
        }
      });
    })();

    /* Weight cards are a scrolling marquee - no ScrollTrigger needed */

    /* -- VIRAL STRIP entrance -------------------------- */
    const strip3d = document.getElementById('viral-strip-3d');
    if (strip3d) {
      gsap.fromTo(strip3d,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '#viral', start: 'top 80%', once: true },
        }
      );
    }

    /* -- PRODUCTION PANEL animations -------------------
       Uses IntersectionObserver (not ScrollTrigger) because the panels
       are position:sticky — ScrollTrigger calculates from document
       position, which doesn't match the visual sticky position and
       causes triggers to fire at the wrong time. IntersectionObserver
       tracks actual viewport visibility and works correctly here.     */
    (function () {
      const panels = Array.from(document.querySelectorAll('.prod-panel'));
      if (!panels.length) return;

      panels.forEach((panel) => {
        const phones  = Array.from(panel.querySelectorAll('.iphone-frame'));
        const stepNum = panel.querySelector('.prod-step-num');
        const specs   = Array.from(panel.querySelectorAll('.prod-spec-tag'));

        /* Set initial hidden state via inline style so CSS can still override */
        phones.forEach((p) => {
          p.style.opacity   = '0';
          p.style.transform = 'translateY(50px) scale(0.92)';
          p.style.transition = 'opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)';
        });
        if (stepNum) {
          stepNum.style.opacity   = '0';
          stepNum.style.transform = 'translateX(-28px)';
          stepNum.style.transition = 'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)';
        }
        specs.forEach((s) => {
          s.style.opacity   = '0';
          s.style.transform = 'translateY(10px)';
          s.style.transition = 'opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)';
        });

        const obs = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            obs.unobserve(panel);

            /* Step number — first */
            if (stepNum) {
              stepNum.style.opacity   = '1';
              stepNum.style.transform = 'none';
            }

            /* Phones — staggered */
            phones.forEach((p, i) => {
              setTimeout(() => {
                p.style.opacity   = '1';
                p.style.transform = 'none';
              }, 80 + i * 130);
            });

            /* Spec tags — after phones */
            specs.forEach((s, i) => {
              setTimeout(() => {
                s.style.opacity   = '1';
                s.style.transform = 'none';
              }, 340 + i * 70);
            });
          });
        }, { threshold: 0.18 });

        obs.observe(panel);
      });
    })();

    ScrollTrigger.refresh();
    /* Second refresh after a short delay so any dynamically injected
       content (production panels, viral strip) is fully laid out. */
    setTimeout(() => ScrollTrigger.refresh(), 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
