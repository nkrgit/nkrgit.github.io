/* Progressive enhancement only. The page is complete without this file:
   1. reveal-on-scroll for .reveal blocks
   2. active tab in the top bar follows the section in view
   3. pointer tilt on the featured book (desktop, fine pointer, motion allowed)
   4. copy-email button
   Every block is wrapped so one failure never blanks the page. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Reveal. The .js class is added only once we know we can observe.
  try {
    if ('IntersectionObserver' in window) {
      root.classList.add('js');
      var revealer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); revealer.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      document.querySelectorAll('.reveal').forEach(function (el) { revealer.observe(el); });
    }
  } catch (err) { root.classList.remove('js'); console.error('[reveal]', err); }

  // 2. Scroll-spy for the tabs.
  try {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs a[data-tab]'));
    var sections = tabs.map(function (a) { return document.getElementById(a.getAttribute('data-tab')); }).filter(Boolean);
    if (tabs.length && 'IntersectionObserver' in window) {
      var current = null;
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) current = e.target.id; });
        if (!current) return;
        tabs.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-tab') === current); });
      }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
      sections.forEach(function (s) { spy.observe(s); });
    }
  } catch (err) { console.error('[tabs]', err); }

  // 3. Tilt. Pointer position over the stage drives rotateY/rotateX within ±14°.
  try {
    var stage = document.getElementById('book-stage');
    var book = document.getElementById('hero-book');
    var fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    if (stage && book && fine && !reduced) {
      var raf = null, rx = 0, ry = 0;
      var paint = function () { book.style.transform = 'rotateY(' + ry.toFixed(2) + 'deg) rotateX(' + rx.toFixed(2) + 'deg)'; raf = null; };
      stage.addEventListener('pointermove', function (ev) {
        var r = stage.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width - 0.5;   // -0.5 … 0.5
        var py = (ev.clientY - r.top) / r.height - 0.5;
        ry = -22 + px * 28;                                 // rest at -22°, swing ±14°
        rx = 3 - py * 16;
        stage.classList.add('is-tilting');
        if (!raf) raf = requestAnimationFrame(paint);
      });
      stage.addEventListener('pointerleave', function () {
        stage.classList.remove('is-tilting');
        book.style.transform = '';
      });
    }
  } catch (err) { console.error('[tilt]', err); }

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
