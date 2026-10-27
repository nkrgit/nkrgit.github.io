/* Progressive enhancement only. The page is complete without this file:
   1. carousel: buttons, thumbnails, mouse drag, keyboard, counter (the track itself
      is a native scroll-snap strip, so touch swiping works with JS off)
   2. reveal-on-scroll for .reveal blocks
   3. active nav link follows the section in view
   4. copy-email button
   Every block is wrapped so one failure never blanks the page. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Carousel.
  try {
    var track = document.getElementById('track');
    var slides = track ? Array.prototype.slice.call(track.querySelectorAll('.slide')) : [];
    var thumbs = Array.prototype.slice.call(document.querySelectorAll('#thumbs .thumb'));
    var prev = document.getElementById('prev');
    var next = document.getElementById('next');
    var counter = document.getElementById('counter');
    var n = slides.length;
    if (track && n) {
      var pad = function (i) { return (i < 9 ? '0' : '') + (i + 1); };
      var current = 0;
      var indexFromScroll = function () { return Math.max(0, Math.min(n - 1, Math.round(track.scrollLeft / track.clientWidth))); };
      var render = function (i) {
        current = i;
        thumbs.forEach(function (t, k) {
          t.classList.toggle('is-active', k === i);
          if (k === i) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
        });
        if (counter) counter.textContent = pad(i) + ' / ' + pad(n - 1);
        if (prev) prev.disabled = i === 0;
        if (next) next.disabled = i === n - 1;
      };
      var go = function (i) {
        i = Math.max(0, Math.min(n - 1, i));
        track.scrollTo({ left: i * track.clientWidth, behavior: reduced ? 'auto' : 'smooth' });
        render(i);
      };

      if (prev) prev.addEventListener('click', function () { go(current - 1); });
      if (next) next.addEventListener('click', function () { go(current + 1); });
      thumbs.forEach(function (t, k) {
        t.addEventListener('click', function (ev) { ev.preventDefault(); go(k); });
      });

      // Keep thumbnails and counter in step with native scrolling (touch swipe, trackpad).
      var ticking = false;
      track.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () { ticking = false; var i = indexFromScroll(); if (i !== current) render(i); });
      }, { passive: true });
      window.addEventListener('resize', function () { track.scrollLeft = current * track.clientWidth; });

      // Mouse drag. Touch devices already scroll natively.
      var down = false, startX = 0, startLeft = 0, moved = false;
      track.addEventListener('pointerdown', function (ev) {
        if (ev.pointerType !== 'mouse' || ev.button !== 0) return;
        down = true; moved = false; startX = ev.clientX; startLeft = track.scrollLeft;
        track.classList.add('dragging');
        try { track.setPointerCapture(ev.pointerId); } catch (e) { /* older browsers */ }
      });
      track.addEventListener('pointermove', function (ev) {
        if (!down) return;
        var dx = ev.clientX - startX;
        if (Math.abs(dx) > 5) moved = true;
        track.scrollLeft = startLeft - dx;
      });
      var release = function () {
        if (!down) return;
        down = false;
        track.classList.remove('dragging');
        var dx = track.scrollLeft - startLeft;
        var i = current;
        if (dx > track.clientWidth * 0.12) i = current + 1;
        else if (dx < -track.clientWidth * 0.12) i = current - 1;
        go(i);
      };
      track.addEventListener('pointerup', release);
      track.addEventListener('pointercancel', release);
      track.addEventListener('lostpointercapture', release);
      // A drag that ends on a link must not follow it.
      track.addEventListener('click', function (ev) { if (moved) { ev.preventDefault(); ev.stopPropagation(); moved = false; } }, true);
      track.addEventListener('dragstart', function (ev) { ev.preventDefault(); });

      // Arrow keys while the carousel has focus.
      var region = document.getElementById('carousel');
      if (region) {
        region.addEventListener('keydown', function (ev) {
          if (ev.key === 'ArrowRight') { ev.preventDefault(); go(current + 1); }
          if (ev.key === 'ArrowLeft') { ev.preventDefault(); go(current - 1); }
        });
      }
      render(indexFromScroll());
    }
  } catch (err) { console.error('[carousel]', err); }

  // 2. Reveal. The .js class is added only once we know we can observe.
  try {
    if ('IntersectionObserver' in window) {
      root.classList.add('js');
      var revealer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); revealer.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      document.querySelectorAll('.reveal').forEach(function (el) { revealer.observe(el); });
      // Safety net: if the observer is late (slow frame, background tab), anything already
      // on screen is shown anyway, and everything is shown after a few seconds regardless.
      var showVisible = function () {
        document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
        });
      };
      setTimeout(showVisible, 900);
      window.addEventListener('scroll', showVisible, { passive: true });
      setTimeout(function () { document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); }); }, 6000);
    }
  } catch (err) { root.classList.remove('js'); console.error('[reveal]', err); }

  // 3. Scroll-spy for the nav.
  try {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav a[data-tab]'));
    var sections = links.map(function (a) { return document.getElementById(a.getAttribute('data-tab')); }).filter(Boolean);
    if (links.length && 'IntersectionObserver' in window) {
      var active = null;
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) active = e.target.id; });
        if (!active) return;
        links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-tab') === active); });
      }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
      sections.forEach(function (s) { spy.observe(s); });
    }
  } catch (err) { console.error('[nav]', err); }

  // 4. Copy email. Falls back to selecting the text when the clipboard is refused.
  try {
    var btn = document.getElementById('copy-email');
    var email = document.getElementById('email');
    if (btn && email) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-copy') || email.textContent;
        var done = function () {
          btn.setAttribute('data-copied', 'true'); btn.textContent = 'Copied';
          setTimeout(function () { btn.removeAttribute('data-copied'); btn.textContent = 'Copy'; }, 1800);
        };
        var select = function () {
          try { var range = document.createRange(); range.selectNodeContents(email); var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range); } catch (e) { /* nothing to do */ }
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(done, select);
        } else { select(); }
      });
    }
  } catch (err) { console.error('[copy]', err); }
})();
