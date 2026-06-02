/* ─────────────────────────────────────────────────────
   MODAL.JS — Viral video click → iPhone modal
───────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* VIDEO_SRC removed — modal always receives src from the clicked item */

  let modalVideo = null;
  let isOpen = false;

  function buildModalIphone() {
    const wrap = document.getElementById('modal-iphone-wrap');
    if (!wrap || wrap.querySelector('.iphone-frame')) return;

    const frame = document.createElement('div');
    frame.className = 'iphone-frame iphone-lg modal-iphone iphone-red iphone-no-status';
    frame.innerHTML = `
      <div class="iphone-notch"></div>
      <div class="iphone-screen">
        <video class="hls-video modal-video" playsinline muted loop></video>
        <div class="iphone-controls">
          <div class="iphone-progress-track">
            <div class="iphone-progress-fill" id="modal-progress"></div>
          </div>
          <div class="iphone-ctrl-row">
            <button class="iphone-play-btn" id="modal-play-btn">⏸</button>
            <span class="iphone-time-display" id="modal-time">0:00</span>
            <button class="iphone-mute-btn" id="modal-mute-btn">🔊</button>
          </div>
        </div>
      </div>
      <div class="iphone-home"></div>
    `;

    wrap.appendChild(frame);

    modalVideo = frame.querySelector('video');

    // Wire controls
    const playBtn = frame.querySelector('#modal-play-btn');
    const muteBtn = frame.querySelector('#modal-mute-btn');
    const progress = frame.querySelector('#modal-progress');
    const timeEl = frame.querySelector('#modal-time');

    if (window.GroX) {
      window.GroX.wirePlayBtn(modalVideo, playBtn);
      window.GroX.wireMuteBtn(modalVideo, muteBtn);
      window.GroX.wireProgress(modalVideo, progress);
    }

    modalVideo.addEventListener('timeupdate', () => {
      if (!modalVideo.duration) return;
      const s = Math.floor(modalVideo.currentTime % 60);
      const m = Math.floor(modalVideo.currentTime / 60);
      timeEl.textContent = m + ':' + String(s).padStart(2, '0');
    });
  }

  function openModal(viewsText, videoSrc) {
    if (isOpen) return;
    isOpen = true;

    buildModalIphone();

    const modal = document.getElementById('video-modal');
    const src = videoSrc || '';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Animate first, then load video so click feels instant
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(modal.querySelector('.modal-overlay'),
        { opacity: 0 }, { opacity: 1, duration: 0.3 }
      );
      gsap.fromTo(modal.querySelector('.modal-iphone'),
        { scale: 0.75, y: 50, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: 'power3.out', delay: 0.05,
          onComplete: () => {
            if (modalVideo) {
              if (window.GroX) window.GroX.destroyHLS(modalVideo);
              modalVideo._hlsInit = false;
              modalVideo.muted = false;
              if (window.GroX) window.GroX.initHLSVideo(modalVideo, src, false);
              const muteBtn = document.getElementById('modal-mute-btn');
              if (muteBtn) muteBtn.textContent = '🔊';
            }
          }
        }
      );
    } else if (modalVideo) {
      if (window.GroX) window.GroX.destroyHLS(modalVideo);
      modalVideo._hlsInit = false;
      modalVideo.muted = false;
      if (window.GroX) window.GroX.initHLSVideo(modalVideo, src, false);
      const muteBtn = document.getElementById('modal-mute-btn');
      if (muteBtn) muteBtn.textContent = '🔊';
    }
  }

  function closeModal() {
    if (!isOpen) return;
    const modal = document.getElementById('video-modal');

    const done = () => {
      isOpen = false;
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (modalVideo) {
        modalVideo.pause();
        modalVideo.muted = true;
        if (window.GroX) window.GroX.destroyHLS(modalVideo);
      }
    };

    if (typeof gsap !== 'undefined') {
      gsap.to(modal.querySelector('.modal-iphone'), {
        scale: 0.8, opacity: 0, y: 30, duration: 0.3, ease: 'power2.in'
      });
      gsap.to(modal.querySelector('.modal-overlay'), {
        opacity: 0, duration: 0.3, delay: 0.05, onComplete: done
      });
    } else {
      done();
    }
  }

  // Expose globally so main.js can call openModal
  window.GroX = window.GroX || {};
  window.GroX.openModal = openModal;
  window.GroX.closeModal = closeModal;

  document.addEventListener('DOMContentLoaded', () => {
    // Close on overlay click
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.addEventListener('click', closeModal);

    // Close button
    const closeBtn = document.getElementById('modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  });
})();
