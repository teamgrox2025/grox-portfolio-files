/* ─────────────────────────────────────────────────────
   MAIN.JS — Cursor, Nav, Hero, Viral Strip builder,
   Production builder, Testimonials builder,
   Weights marquee, Gradient bars, Counter animation,
   Process accordion (hover), Cursor tilt
───────────────────────────────────────────────────── */

(function () {
  'use strict';

  const R2 = 'https://pub-549d705112f846b7ab510068faa4035a.r2.dev';

  const VIRAL_VIDEOS = [
    { src: R2 + '/viral/vp1.mp4', views: '3M' },
    { src: R2 + '/viral/vp2.mp4', views: '2.9M' },
    { src: R2 + '/viral/vp3.mp4', views: '849K' },
    { src: R2 + '/viral/vp4.mp4', views: '759K' },
    { src: R2 + '/viral/vp5.mp4', views: '549K' },
    { src: R2 + '/viral/vp6.mp4', views: '1.1M' },
  ];

  /* ── PRODUCTION DATA ─────────────────────────────── */
  const PROD_DATA = [
    {
      num: '01',
      label: 'Podcast Production',
      title: 'Podcast\nProduction',
      tag: 'Audio-first storytelling for founders',
      specs: ['Multi-cam setup', '4K resolution', 'Professional audio', 'Short-form cuts'],
      phones: 3,
      videos: [R2 + '/podcast/podcast1.mp4', R2 + '/podcast/podcast2.mp4', R2 + '/podcast/podcast3.mp4'],
    },
    {
      num: '02',
      label: 'Restaurant Production',
      title: 'Restaurant\nProduction',
      tag: 'Food & ambience that makes people book',
      specs: ['Cinematic colour grade', 'Overhead & macro', 'Reel-first format', 'Same-day delivery'],
      phones: 3,
      videos: [R2 + '/restaurant/restaurant1.mp4', R2 + '/restaurant/restaurant2.mp4', R2 + '/restaurant/restaurant3.mp4'],
    },
    {
      num: '03',
      label: 'Healthcare Production',
      title: 'Healthcare\nProduction',
      tag: 'Trust-building content for clinics',
      specs: ['Clinical-grade lighting', 'Doctor framing', 'Compliance-safe scripts', 'Education-first cuts'],
      phones: 3,
      videos: [R2 + '/healthcare/healthcare1.mp4', R2 + '/healthcare/healthcare2.mp4', R2 + '/healthcare/healthcare3.mp4'],
    },
    {
      num: '04',
      label: 'Farmhouse Production',
      title: 'Farmhouse\nProduction',
      tag: 'Luxury properties shot to make people visit',
      specs: ['Aerial shots', 'Golden hour lighting', 'Walk-through edits', 'Property reels'],
      phones: 3,
      videos: [R2 + '/farmhouse/farmhouse1.mp4', R2 + '/farmhouse/farmhouse2.mp4', R2 + '/farmhouse/farmhouse3.mp4'],
    },
    {
      num: '05',
      label: 'Trainers/Coaches',
      title: 'Trainers/\nCoaches',
      tag: 'Real-world documentation that converts',
      specs: ['Field & studio mix', 'Authentic narrative', 'Transformation edits', 'Long-form + reels'],
      phones: 3,
      videos: [R2 + '/trainers/trainers1.mp4', R2 + '/trainers/trainers2.mp4', R2 + '/trainers/trainers3.mp4'],
    },
    {
      phones: 3,
      continuation: true,
      videos: [R2 + '/trainers/trainers4.mp4', R2 + '/trainers/trainers5.mp4', R2 + '/trainers/trainers6.mp4'],
    },
  ];

  /* ── CLIENT WEIGHTS DATA ─────────────────────────── */
  const WEIGHT_DATA = [
    { label: 'Content Volume',  img: 'Photos/weight-1.jpeg', alt: 'Starter' },
    { label: 'Time Investment', img: 'Photos/weight-2.jpeg', alt: 'Growth' },
    { label: 'Turnaround',      img: 'Photos/weight-3.jpeg', alt: 'Scale' },
    { label: 'Output Format',   img: 'Photos/weight-4.jpeg', alt: 'Custom' },
  ];

  /* ══════════════════════════════════════════════════
     GRADIENT BARS — Hero + CTA background
  ══════════════════════════════════════════════════ */
  function buildGradientBars(container, numBars, color) {
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < numBars; i++) {
      const position = i / (numBars - 1 || 1);
      const dist = Math.abs(position - 0.5);
      const scale = 0.28 + 0.72 * Math.pow(dist * 2, 1.15);
      const bar = document.createElement('div');
      bar.className = 'gradient-bar';
      bar.style.flex = '1';
      bar.style.height = '100%';
      bar.style.background = `linear-gradient(to top, ${color}, transparent)`;
      bar.style.transformOrigin = 'bottom';
      bar.style.setProperty('--bar-scale', scale.toFixed(3));
      bar.style.transform = `scaleY(${scale.toFixed(3)})`;
      bar.style.animation = `pulseBar 2.2s ease-in-out infinite alternate`;
      bar.style.animationDelay = `${(i * 0.1).toFixed(1)}s`;
      container.appendChild(bar);
    }
  }

  /* ══════════════════════════════════════════════════
     IPHONE FRAME BUILDER
  ══════════════════════════════════════════════════ */
  function buildIphoneFrame(sizeClass, videoSrc, muted, extraClasses) {
    const frame = document.createElement('div');
    frame.className = `iphone-frame ${sizeClass}${extraClasses ? ' ' + extraClasses : ''}`;

    frame.innerHTML = `
      <div class="iphone-notch"></div>
      <div class="iphone-screen">
        <video
          class="hls-video"
          data-src="${videoSrc || ''}"
          preload="metadata"
          playsinline
          ${muted !== false ? 'muted' : ''}
          loop
        ></video>
        <div class="iphone-controls">
          <div class="iphone-progress-track">
            <div class="iphone-progress-fill"></div>
          </div>
          <div class="iphone-ctrl-row">
            <button class="iphone-play-btn" aria-label="Play/Pause">▶</button>
            <span class="iphone-time-display">0:00</span>
            <button class="iphone-mute-btn" aria-label="Mute">${muted !== false ? '🔇' : '🔊'}</button>
          </div>
        </div>
      </div>
      <div class="iphone-home"></div>
    `;

    requestAnimationFrame(() => {
      const video   = frame.querySelector('video');
      const playBtn = frame.querySelector('.iphone-play-btn');
      const muteBtn = frame.querySelector('.iphone-mute-btn');
      const fill    = frame.querySelector('.iphone-progress-fill');
      const timeEl  = frame.querySelector('.iphone-time-display');

      if (window.GroX) {
        window.GroX.wirePlayBtn(video, playBtn);
        window.GroX.wireMuteBtn(video, muteBtn);
        window.GroX.wireProgress(video, fill);
      }

      video.addEventListener('timeupdate', () => {
        if (!video.duration) return;
        const s = Math.floor(video.currentTime % 60);
        const m = Math.floor(video.currentTime / 60);
        timeEl.textContent = m + ':' + String(s).padStart(2, '0');
      });
    });

    return frame;
  }

  /* ══════════════════════════════════════════════════
     CUSTOM CURSOR
  ══════════════════════════════════════════════════ */
  function initCursor() {
    const dot = document.getElementById('cursor-dot');
    if (!dot) return;

    let mx = -100, my = -100;
    let cx = -100, cy = -100;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    function loop() {
      cx += (mx - cx) * 0.14;
      cy += (my - cy) * 0.14;
      dot.style.left = cx + 'px';
      dot.style.top  = cy + 'px';
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, [data-tilt], .viral-item, .weight-card')) {
        dot.classList.add('expanded');
      }
    });
    document.addEventListener('mouseout', (e) => {
      const el = e.target.closest('a, button, [data-tilt], .viral-item, .weight-card');
      if (el && !el.contains(e.relatedTarget)) {
        dot.classList.remove('expanded');
      }
    });

  }

  /* ══════════════════════════════════════════════════
     NAV
  ══════════════════════════════════════════════════ */
  function initNav() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    setTimeout(() => nav.classList.add('loaded'), 200);

    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════
     HERO — word-split reveal
  ══════════════════════════════════════════════════ */
  function initHero() {
    const headline = document.getElementById('hero-headline');
    if (headline) {
      const rawHTML = headline.innerHTML;
      const parts = rawHTML.split(/(<br\s*\/?>)/i);
      let newHTML = '';
      parts.forEach((part) => {
        if (/^<br/i.test(part)) {
          newHTML += part;
        } else {
          part.split(' ').forEach((word) => {
            if (!word) return;
            newHTML += `<span class="word"><span class="word-inner">${word}</span></span>`;
          });
        }
      });
      headline.innerHTML = newHTML;

      setTimeout(() => {
        headline.querySelectorAll('.word-inner').forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 80);
        });
      }, 300);
    }

    setTimeout(() => {
      const tagline = document.getElementById('hero-tagline');
      if (tagline) tagline.classList.add('visible');
    }, 150);

    setTimeout(() => {
      const sub = document.getElementById('hero-sub');
      if (sub) sub.classList.add('visible');
    }, 650);

    setTimeout(() => {
      const cta = document.getElementById('hero-cta');
      if (cta) cta.classList.add('visible');
      const hint = document.getElementById('hero-scroll');
      if (hint) hint.classList.add('visible');
    }, 900);
  }

  /* ══════════════════════════════════════════════════
     VIRAL STRIP — build 16 iPhones (lg, red, no-status)
  ══════════════════════════════════════════════════ */
  function buildViralStrip() {
    const track = document.getElementById('viral-track');
    if (!track) return;

    for (let set = 0; set < 2; set++) {
      for (let i = 0; i < VIRAL_VIDEOS.length; i++) {
        const { src, views } = VIRAL_VIDEOS[i];
        const item = document.createElement('div');
        item.className = 'viral-item';
        item.dataset.views = views;

        const frame = buildIphoneFrame('iphone-lg', src, true, 'iphone-red iphone-no-status');
        item.appendChild(frame);

        const badge = document.createElement('div');
        badge.className = 'viral-views-badge';
        badge.textContent = views + ' views';
        item.appendChild(badge);

        item.addEventListener('click', () => {
          if (window.GroX && window.GroX.openModal) {
            window.GroX.openModal(views, src);
          }
        });

        track.appendChild(item);
      }
    }

    // JS-driven marquee — replaces CSS animation so nav buttons work
    track.style.animation = 'none';
    var jOffset = 0, jTarget = 0, jAuto = true, jTimer = null;
    var J_SPEED = 0.5;
    var J_STEP = 300;

    function getTrackHalf() { return track.scrollWidth / 2; }

    function jMarquee() {
      if (jAuto) jTarget -= J_SPEED;
      var half = getTrackHalf();
      if (half > 0) {
        jOffset += (jTarget - jOffset) * 0.08;
        if (jOffset <= -half) { jOffset += half; jTarget += half; }
        if (jOffset > 0) { jOffset -= half; jTarget -= half; }
        track.style.transform = 'translateX(' + jOffset + 'px)';
      }
      requestAnimationFrame(jMarquee);
    }
    setTimeout(function() {
      var firstItem = track.querySelector('.viral-item');
      if (firstItem) J_STEP = firstItem.offsetWidth + 28;
      requestAnimationFrame(jMarquee);
    }, 150);

    track.addEventListener('mouseenter', function() { jAuto = false; clearTimeout(jTimer); });
    track.addEventListener('mouseleave', function() {
      jTimer = setTimeout(function() { jAuto = true; }, 300);
    });

    var viralPrevBtn = document.querySelector('.viral-prev-btn');
    var viralNextBtn = document.querySelector('.viral-next-btn');
    function viralShift(delta) {
      jAuto = false;
      jTarget += delta;
      clearTimeout(jTimer);
      jTimer = setTimeout(function() { jAuto = true; }, 3000);
    }
    if (viralPrevBtn) viralPrevBtn.addEventListener('click', function() { viralShift(J_STEP); });
    if (viralNextBtn) viralNextBtn.addEventListener('click', function() { viralShift(-J_STEP); });

    // Only play max 3 videos at once — check actual visual position via getBoundingClientRect
    let rafId = null;
    function managePlayback() {
      const vw = window.innerWidth;
      let playing = 0;
      track.querySelectorAll('.viral-item').forEach((item) => {
        const rect = item.getBoundingClientRect();
        const visible = rect.left < vw && rect.right > 0;
        const video = item.querySelector('video');
        if (!video) return;
        if (visible && playing < 3) {
          playing++;
          if (!video._hlsInit) window.GroX.initHLSVideo(video);
          else if (video.paused) video.play().catch(() => {});
        } else {
          if (!video.paused) video.pause();
        }
      });
      rafId = requestAnimationFrame(managePlayback);
    }

    // Start/stop rAF loop only when viral section is on screen
    const section = document.getElementById('viral');
    if (section) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(managePlayback);
          } else {
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
            track.querySelectorAll('video').forEach((v) => v.pause());
          }
        });
      }, { threshold: 0.1 });
      obs.observe(section);
    }
  }

  /* ══════════════════════════════════════════════════
     PRODUCTION PANELS — 4 sticky panels, 3 iPhones each
  ══════════════════════════════════════════════════ */
  function buildProductionPanels() {
    const wrap = document.getElementById('prod-panels');
    if (!wrap) return;

    const src = wrap.dataset.video || '';

    PROD_DATA.forEach((data, idx) => {
      const panel = document.createElement('div');
      panel.className = 'prod-panel';
      panel.style.zIndex = idx + 1;

      if (data.continuation) {
        panel.classList.add('prod-panel--continuation');
        panel.innerHTML = `<div class="prod-phones" id="prod-phones-${idx}"></div>`;
      } else {
        const titleLines = data.title.split('\n').join('<br>');
        panel.innerHTML = `
          <div class="prod-panel-top">
            <div class="prod-step-num">${data.num}</div>
            <div class="prod-panel-info">
              <div class="prod-panel-label">[ ${data.label} ]</div>
              <div class="prod-panel-title">${titleLines}</div>
              <div class="prod-panel-tag">${data.tag}</div>
            </div>
          </div>
          <div class="prod-phones" id="prod-phones-${idx}"></div>
          <div class="prod-specs">
            ${data.specs.map((s) => `<span class="prod-spec-tag">${s}</span>`).join('')}
          </div>
        `;
      }

      wrap.appendChild(panel);

      const phonesRow = panel.querySelector(`#prod-phones-${idx}`);
      const phoneCount = data.phones || 3;
      for (let v = 0; v < phoneCount; v++) {
        const w = document.createElement('div');
        w.className = 'prod-phone-wrap';
        const frameVariant = (v % 3 === 1) ? 'iphone-bone iphone-no-status' : 'iphone-red iphone-no-status';
        const videoSrc = (data.videos && data.videos[v]) ? data.videos[v] : src;
        const frame = buildIphoneFrame('iphone-xl', videoSrc, true, frameVariant);
        w.appendChild(frame);
        w.addEventListener('click', () => {
          if (window.GroX && window.GroX.openModal) window.GroX.openModal('500K+', videoSrc);
        });
        phonesRow.appendChild(w);
      }
    });

    if (window.GroX) window.GroX.lazyInitVideos();
  }

  /* ══════════════════════════════════════════════════
     CLIENT WEIGHTS MARQUEE — poster cards auto-scroll
  ══════════════════════════════════════════════════ */
  function buildWeightsMarquee() {
    const track = document.getElementById('weights-track');
    if (!track) return;

    for (let set = 0; set < 2; set++) {
      WEIGHT_DATA.forEach((data, idx) => {
        const card = document.createElement('div');
        card.className = 'weight-card';
        card.dataset.tilt = '';
        card.dataset.viewsLabel = data.label;
        card.dataset.weightIdx = idx;
        card.innerHTML = `
          <div class="weight-card-img">
            <img src="${data.img}" alt="${data.alt}">
          </div>
        `;

        card.addEventListener('click', function() {
          if (window.GroX && window.GroX.openWeightsLightbox) {
            window.GroX.openWeightsLightbox(idx);
          }
        });

        track.appendChild(card);
      });
    }
  }

  /* ══════════════════════════════════════════════════
     TESTIMONIALS — 3-col animated slider with videos
  ══════════════════════════════════════════════════ */
  const TESTIMONIAL_DATA = [
    {
      name: '[Client Name]',
      affiliation: '[Company]',
      initial: 'N',
      quote: 'We\'ve worked with three agencies before GroX. This is the first team that understood the brand before suggesting anything.',
      videoSrc: R2 + '/viral/vp1.mp4',
    },
    {
      name: '[Client Name]',
      affiliation: '[Company]',
      initial: 'S',
      quote: 'Our founder had been camera-shy for two years. GroX got them on video in a way that finally felt natural. Within two months, inbound enquiries had doubled.',
      videoSrc: R2 + '/viral/vp2.mp4',
    },
    {
      name: '[Client Name]',
      affiliation: '[Company]',
      initial: 'R',
      quote: 'Honest team. Sharp work. No theatre.',
      videoSrc: R2 + '/viral/vp3.mp4',
    },
  ];

  function buildTestimonialsSlider() {
    const container = document.getElementById('ts-slider');
    if (!container) return;

    let current = 0;
    let animating = false;
    let autoTimer = null;

    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }
    function startAuto() {
      stopAuto();
      autoTimer = setInterval(() => {
        if (!animating) goTo((current + 1) % TESTIMONIAL_DATA.length);
      }, 7000);
    }

    container.innerHTML = `
      <div class="ts-grid">
        <div class="ts-center">
          <div class="ts-video-outer" id="ts-video-outer"></div>
        </div>
        <div class="ts-right">
          <div class="ts-text-wrap">
            <p class="ts-affil" id="ts-affil"></p>
            <h3 class="ts-name" id="ts-name"></h3>
            <blockquote class="ts-quote" id="ts-quote"></blockquote>
          </div>
          <div class="ts-nav">
            <button class="ts-prev-btn" id="ts-prev" aria-label="Previous">&#8592;</button>
            <button class="ts-next-btn" id="ts-next" aria-label="Next">&#8594;</button>
          </div>
        </div>
      </div>
    `;

    function buildVideoFrame(data) {
      const outer = document.getElementById('ts-video-outer');
      if (!outer) return;
      const oldVideo = outer.querySelector('video');
      if (oldVideo && window.GroX) window.GroX.destroyHLS(oldVideo);
      outer.innerHTML = '';
      const frame = buildIphoneFrame('iphone-lg', data.videoSrc, true, 'iphone-red iphone-no-status');
      outer.appendChild(frame);
      if (window.GroX) window.GroX.lazyInitVideos();

      const tsVideo = frame.querySelector('video');
      if (tsVideo) {
        tsVideo.addEventListener('volumechange', () => {
          if (!tsVideo.muted) stopAuto();
          else startAuto();
        });
      }
    }

    function updateText(idx, dir) {
      const els = ['ts-affil', 'ts-name', 'ts-quote'].map(id => document.getElementById(id));
      const data = TESTIMONIAL_DATA[idx];
      const xOut = dir === 'next' ? '-30px' : '30px';
      const xIn  = dir === 'next' ? '30px' : '-30px';

      els.forEach(el => {
        if (!el) return;
        el.style.transition = 'opacity 0.25s, transform 0.25s';
        el.style.opacity = '0';
        el.style.transform = `translateX(${xOut})`;
      });

      setTimeout(() => {
        const affilEl = document.getElementById('ts-affil');
        const nameEl  = document.getElementById('ts-name');
        const quoteEl = document.getElementById('ts-quote');
        const ctr     = document.getElementById('ts-counter');

        if (affilEl) affilEl.textContent = data.affiliation;
        if (nameEl)  nameEl.textContent  = data.name;
        if (quoteEl) quoteEl.textContent = `"${data.quote}"`;
        if (ctr)     ctr.textContent     = String(idx + 1).padStart(2, '0') + ' / ' + String(TESTIMONIAL_DATA.length).padStart(2, '0');

        [affilEl, nameEl, quoteEl].forEach(el => {
          if (!el) return;
          el.style.transition = 'none';
          el.style.transform = `translateX(${xIn})`;
          requestAnimationFrame(() => {
            el.style.transition = 'opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1)';
            el.style.opacity = '1';
            el.style.transform = 'translateX(0)';
          });
        });
      }, 260);
    }

    function goTo(idx) {
      if (idx === current || animating) return;
      animating = true;
      const dir = idx > current ? 'next' : 'prev';
      const yOut = dir === 'next' ? '-50px' : '50px';
      const yIn  = dir === 'next' ?  '50px' : '-50px';

      // Animate video out
      const outer = document.getElementById('ts-video-outer');
      if (outer) {
        outer.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.35s';
        outer.style.transform = `translateY(${yOut})`;
        outer.style.opacity = '0';
      }

      updateText(idx, dir);

      setTimeout(() => {
        current = idx;
        buildVideoFrame(TESTIMONIAL_DATA[idx]);

        const newOuter = document.getElementById('ts-video-outer');
        if (newOuter) {
          newOuter.style.transition = 'none';
          newOuter.style.transform = `translateY(${yIn})`;
          newOuter.style.opacity = '0';
          requestAnimationFrame(() => {
            newOuter.style.transition = 'transform 0.65s cubic-bezier(0.4,0,0.2,1), opacity 0.65s';
            newOuter.style.transform = 'translateY(0)';
            newOuter.style.opacity = '1';
            setTimeout(() => { animating = false; }, 650);
          });
        } else {
          animating = false;
        }
      }, 380);
    }

    // Initial render
    buildVideoFrame(TESTIMONIAL_DATA[0]);
    const affilEl = document.getElementById('ts-affil');
    const nameEl  = document.getElementById('ts-name');
    const quoteEl = document.getElementById('ts-quote');
    const ctr     = document.getElementById('ts-counter');
    if (affilEl) affilEl.textContent = TESTIMONIAL_DATA[0].affiliation;
    if (nameEl)  nameEl.textContent  = TESTIMONIAL_DATA[0].name;
    if (quoteEl) quoteEl.textContent = `"${TESTIMONIAL_DATA[0].quote}"`;

    // Buttons
    document.getElementById('ts-prev').addEventListener('click', () => {
      if (!animating) goTo((current - 1 + TESTIMONIAL_DATA.length) % TESTIMONIAL_DATA.length);
    });
    document.getElementById('ts-next').addEventListener('click', () => {
      if (!animating) goTo((current + 1) % TESTIMONIAL_DATA.length);
    });

    // Auto-advance — pauses when video unmuted, resumes when muted
    startAuto();
  }

  /* ══════════════════════════════════════════════════
     ANIMATED COUNTERS
  ══════════════════════════════════════════════════ */
  function initCounters() {
    const items = document.querySelectorAll('.stat-item[data-target]');
    if (!items.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);

        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const valEl = el.querySelector('.stat-val');
        if (!valEl) return;

        const duration = 1800;
        const start = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(2, -10 * progress);
          valEl.textContent = Math.round(eased * target).toLocaleString();
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });

    items.forEach((el) => obs.observe(el));
  }

  /* initTestimonials removed — replaced by buildTestimonialsSlider */

  /* ══════════════════════════════════════════════════
     PROCESS ACCORDION — click to open/close
  ══════════════════════════════════════════════════ */
  function initProcess() {
    document.querySelectorAll('.process-item').forEach((item) => {
      const header = item.querySelector('.process-item-header');
      if (!header) return;
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.process-item.open').forEach((o) => o.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ══════════════════════════════════════════════════
     3D CURSOR TILT — Weight cards + any [data-tilt]
  ══════════════════════════════════════════════════ */
  function initTiltCards() {
    function applyTilt(card) {
      card.style.transformStyle = 'preserve-3d';

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;

        if (typeof gsap !== 'undefined') {
          gsap.to(card, {
            rotateY: x * 22,
            rotateX: -y * 22,
            transformPerspective: 900,
            duration: 0.25,
            ease: 'power2.out',
          });
        } else {
          card.style.transform = `perspective(900px) rotateX(${-y * 22}deg) rotateY(${x * 22}deg)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power2.out' });
        } else {
          card.style.transform = 'none';
        }
      });
    }

    // Apply to static [data-tilt] elements
    document.querySelectorAll('[data-tilt]').forEach(applyTilt);

    // Also observe future weight cards added dynamically
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.dataset && node.dataset.tilt !== undefined) {
            applyTilt(node);
          }
        });
      });
    });
    const track = document.getElementById('weights-track');
    if (track) observer.observe(track, { childList: true });
  }

  /* ══════════════════════════════════════════════════
     SCROLL TRIGGER for weight cards (re-init tilt)
  ══════════════════════════════════════════════════ */
  function initWeightsTilt() {
    document.querySelectorAll('.weight-card[data-tilt]').forEach((card) => {
      card.style.transformStyle = 'preserve-3d';

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        if (typeof gsap !== 'undefined') {
          gsap.to(card, { rotateY: x * 22, rotateX: -y * 22, transformPerspective: 900, duration: 0.25, ease: 'power2.out' });
        }
      });
      card.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power2.out' });
        }
      });
    });
  }

  /* ══════════════════════════════════════════════════
     WEIGHTS LIGHTBOX
  ══════════════════════════════════════════════════ */
  function initWeightsLightbox() {
    const lb = document.getElementById('weights-lightbox');
    if (!lb) return;

    let currentIdx = 0;

    function updateImage() {
      const data = WEIGHT_DATA[currentIdx];
      const img = document.getElementById('weights-lb-img');
      const label = document.getElementById('weights-lb-label');
      if (img) { img.src = data.img; img.alt = data.alt; }
      if (label) label.textContent = data.label;
    }

    function open(idx) {
      currentIdx = ((idx % WEIGHT_DATA.length) + WEIGHT_DATA.length) % WEIGHT_DATA.length;
      updateImage();
      lb.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lb.classList.remove('active');
      document.body.style.overflow = '';
    }

    function goNext() {
      currentIdx = (currentIdx + 1) % WEIGHT_DATA.length;
      updateImage();
    }

    function goPrev() {
      currentIdx = (currentIdx - 1 + WEIGHT_DATA.length) % WEIGHT_DATA.length;
      updateImage();
    }

    const closeBtn = document.getElementById('weights-lb-close');
    const overlay = document.getElementById('weights-lb-overlay');
    const prevBtn = document.getElementById('weights-lb-prev');
    const nextBtn = document.getElementById('weights-lb-next');

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);
    if (prevBtn) prevBtn.addEventListener('click', goPrev);
    if (nextBtn) nextBtn.addEventListener('click', goNext);

    document.addEventListener('keydown', function(e) {
      if (!lb.classList.contains('active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    });

    window.GroX = window.GroX || {};
    window.GroX.openWeightsLightbox = open;
  }

  /* ══════════════════════════════════════════════════
     MOBILE NAV (hamburger)
  ══════════════════════════════════════════════════ */
  function initMobileNav() {
    const btn   = document.getElementById('nav-hamburger');
    const links = document.getElementById('nav-links');
    if (!btn || !links) return;

    btn.addEventListener('click', () => {
      const open = links.classList.toggle('mobile-open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        links.classList.remove('mobile-open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ══════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════ */
  function boot() {
    initNav();
    initHero();
    initMobileNav();
    initCursor();
    initCounters();
    initProcess();


    // Build gradient bars
    buildGradientBars(document.getElementById('hero-bars'), 18, 'rgba(225,29,42,0.55)');
    buildGradientBars(document.getElementById('cta-bars'), 18, 'rgba(225,29,42,0.55)');

    buildViralStrip();
    buildProductionPanels();
    buildWeightsMarquee();
    buildTestimonialsSlider();
    initWeightsLightbox();

    // Init tilt after weights are built
    setTimeout(() => {
      initWeightsTilt();
    }, 50);

    setTimeout(() => {
      if (window.GroX) window.GroX.lazyInitVideos();
    }, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
