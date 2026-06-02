/* ---------------------------------------------------------
   SCROLL.JS - Lenis smooth scroll + GSAP ScrollTrigger
   All scroll-linked animations live here.
--------------------------------------------------------- */

(function () {
  'use strict';

  function init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
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
          gsap.to(inner, {
            rotation: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top bottom',
              end: 'top 18%',
              scrub: true,
            },
          });
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

    /* -- PRODUCTION PANEL animations ------------------- */
    document.querySelectorAll('.prod-panel').forEach((panel) => {
      const phones = panel.querySelectorAll('.iphone-frame');
      if (phones.length) {
        gsap.fromTo(phones,
          { opacity: 0, y: 60, scale: 0.9 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 60%',
              once: true,
            },
          }
        );
      }

      const stepNum = panel.querySelector('.prod-step-num');
      if (stepNum) {
        gsap.fromTo(stepNum,
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: panel, start: 'top 65%', once: true },
          }
        );
      }

      const specs = panel.querySelectorAll('.prod-spec-tag');
      if (specs.length) {
        gsap.fromTo(specs,
          { opacity: 0, y: 12 },
          {
            opacity: 1, y: 0, duration: 0.5, stagger: 0.07,
            ease: 'power2.out',
            scrollTrigger: { trigger: panel, start: 'top 50%', once: true },
          }
        );
      }
    });

    ScrollTrigger.refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
