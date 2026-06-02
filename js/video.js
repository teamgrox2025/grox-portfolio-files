/* ─────────────────────────────────────────────────────
   VIDEO.JS — HLS.js setup, lazy init, muted autoplay
───────────────────────────────────────────────────── */

const VIDEO_SRC = 'https://stream.files-vault.com/3b6e26e5-c34e-445c-9b33-c7ded0467404/playlist.m3u8';

window.GroX = window.GroX || {};

/**
 * Initialize HLS.js on a <video> element.
 * Stores the hls instance on el._hls for later cleanup.
 * @param {HTMLVideoElement} el
 * @param {string} [src] — defaults to VIDEO_SRC
 * @param {boolean} [muted]
 */
window.GroX.initHLSVideo = function (el, src, muted = true) {
  if (!el || el._hlsInit) return;
  el._hlsInit = true;

  const source = src || el.dataset.src || VIDEO_SRC;

  el.muted = muted;
  el.loop = true;
  el.playsInline = true;

  // MP4 files play directly — no HLS needed
  if (source.endsWith('.mp4')) {
    el.src = source;
    el.play().catch(() => {});
    return;
  }

  if (typeof Hls === 'undefined') {
    el.src = source;
    el.play().catch(() => {});
    return;
  }

  if (Hls.isSupported()) {
    const hls = new Hls({
      maxBufferLength: 8,
      maxMaxBufferLength: 16,
      lowLatencyMode: false,
      enableWorker: true,
    });
    hls.loadSource(source);
    hls.attachMedia(el);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      el.play().catch(() => {});
    });
    hls.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) {
        hls.destroy();
        el._hls = null;
        el._hlsInit = false;
      }
    });
    el._hls = hls;
  } else if (el.canPlayType('application/vnd.apple.mpegurl')) {
    // Safari native HLS support
    el.src = source;
    el.play().catch(() => {});
  }
};

/**
 * Destroy an HLS instance on a video element.
 */
window.GroX.destroyHLS = function (el) {
  if (el && el._hls) {
    el._hls.destroy();
    el._hls = null;
    el._hlsInit = false;
  }
};

window.GroX._lazyObserver = null;
window.GroX._preloadObserver = null;

// Silently fetch the first chunk of a video into browser cache
window.GroX.prefetchVideo = function (url) {
  if (!url || url._prefetched) return;
  url._prefetched = true;
  fetch(url, { headers: { Range: 'bytes=0-800000' } }).catch(() => {});
};

// Preload a list of video URLs immediately (used for above-the-fold videos)
window.GroX.prefetchAll = function (urls) {
  if (!Array.isArray(urls)) return;
  // Stagger fetches so they don't all hit at once
  urls.forEach((url, i) => {
    setTimeout(() => window.GroX.prefetchVideo(url), i * 300);
  });
};

window.GroX.lazyInitVideos = function () {
  // Preload observer — fires 600px before video enters view
  if (!window.GroX._preloadObserver) {
    window.GroX._preloadObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const video = entry.target;
            const src = video.dataset.src;
            if (src) window.GroX.prefetchVideo(src);
          }
        });
      },
      { rootMargin: '600px' }
    );
  }

  // Play observer — fires when video is actually on screen
  if (!window.GroX._lazyObserver) {
    window.GroX._lazyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            if (!video._hlsInit) {
              window.GroX.initHLSVideo(video);
            } else if (video.paused && video.muted) {
              video.play().catch(() => {});
            }
          } else {
            if (video._hlsInit && !video.paused) {
              video.pause();
            }
          }
        });
      },
      { threshold: 0.05, rootMargin: '50px' }
    );
  }

  document.querySelectorAll('video.hls-video:not(.modal-video)').forEach((v) => {
    if (!v._lazyObserved) {
      v._lazyObserved = true;
      window.GroX._lazyObserver.observe(v);
      window.GroX._preloadObserver.observe(v);
    }
  });
};

/**
 * Wire progress bar to a video element.
 * Updates the fill width every 500ms.
 */
window.GroX.wireProgress = function (videoEl, progressFill) {
  if (!videoEl || !progressFill) return;
  videoEl.addEventListener('timeupdate', () => {
    if (!videoEl.duration) return;
    const pct = (videoEl.currentTime / videoEl.duration) * 100;
    progressFill.style.width = pct + '%';
  });
};

/**
 * Wire play/pause button to a video element.
 */
window.GroX.wirePlayBtn = function (videoEl, btn) {
  if (!videoEl || !btn) return;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (videoEl.paused) {
      videoEl.play().catch(() => {});
      btn.textContent = '⏸';
      btn.classList.add('playing');
    } else {
      videoEl.pause();
      btn.textContent = '▶';
      btn.classList.remove('playing');
    }
  });
};

/**
 * Wire mute button to a video element.
 */
window.GroX.wireMuteBtn = function (videoEl, btn) {
  if (!videoEl || !btn) return;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    videoEl.muted = !videoEl.muted;
    btn.textContent = videoEl.muted ? '🔇' : '🔊';
  });
};
