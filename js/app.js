(function () {
  'use strict';

  if (window.lucide) lucide.createIcons();

  /* ---------- Wipe Intro ---------- */
  (function wipe() {
    var el = document.getElementById('wipe');
    if (!el) return;
    var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function done() {
      el.classList.add('done');
      document.body.classList.remove('lock');
      setTimeout(function () {
        el.remove();
      }, 900);
    }
    setTimeout(done, rm ? 200 : 1400);
  })();

  /* ---------- Navigation ---------- */
  var nav = document.getElementById('nav');
  window.addEventListener(
    'scroll',
    function () {
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    },
    { passive: true }
  );

  var menuBtn = document.getElementById('menuBtn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      document.body.classList.toggle('menu-open');
    });
  }

  document.querySelectorAll('#menuOverlay a').forEach(function (a) {
    a.addEventListener('click', function () {
      document.body.classList.remove('menu-open');
    });
  });

  /* ---------- Scroll Reveal ---------- */
  var obs = new IntersectionObserver(
    function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          obs.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  document.querySelectorAll('.rv').forEach(function (el) {
    obs.observe(el);
  });

  /* ---------- Section Title Scramble Effect ---------- */
  var SCR = '#/\\<>[]{}=+*';
  function scramble(el) {
    if (el.dataset.busy) return;
    el.dataset.busy = '1';
    var orig = el.textContent,
      n = orig.length,
      frame = 0;
    var iv = setInterval(function () {
      frame++;
      var out = '';
      for (var i = 0; i < n; i++) {
        out += i < frame * 1.6 ? orig[i] : SCR[(Math.random() * SCR.length) | 0];
      }
      el.textContent = out;
      if (frame * 1.6 >= n) {
        clearInterval(iv);
        el.textContent = orig;
        delete el.dataset.busy;
      }
    }, 32);
  }

  var sobs = new IntersectionObserver(
    function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) {
          scramble(en.target);
          sobs.unobserve(en.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll('[data-scramble]').forEach(function (el) {
    sobs.observe(el);
  });

  /* ---------- Rotating Role Words ---------- */
  (function rotor() {
    var box = document.getElementById('rotor');
    if (!box) return;
    var words = box.querySelectorAll('.rotor-word');
    var idx = 0;

    function size() {
      var w = words[idx];
      box.style.width = w.offsetWidth + 'px';
    }

    function init() {
      words[0].classList.add('is-on');
      size();
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        init();
        setTimeout(size, 300);
      });
    } else {
      setTimeout(init, 400);
    }

    setInterval(function () {
      words[idx].classList.remove('is-on');
      idx = (idx + 1) % words.length;
      words[idx].classList.add('is-on');
      size();
    }, 2700);

    window.addEventListener('resize', size);
  })();

  /* ---------- Custom Cursor ---------- */
  (function cursor() {
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    var dot = document.querySelector('.cur-dot'),
      ring = document.querySelector('.cur-ring'),
      label = ring.querySelector('.cur-label');

    var x = innerWidth / 2,
      y = innerHeight / 2,
      rx = x,
      ry = y;

    document.addEventListener('mousemove', function (e) {
      x = e.clientX;
      y = e.clientY;
      dot.style.left = x + 'px';
      dot.style.top = y + 'px';
      dot.style.opacity = 1;
      ring.classList.add('on');
    });

    document.addEventListener('mousedown', function () {
      ring.classList.add('is-down');
    });

    document.addEventListener('mouseup', function () {
      ring.classList.remove('is-down');
    });

    document.addEventListener('mouseleave', function () {
      dot.style.opacity = 0;
      ring.classList.remove('on');
    });

    (function loop() {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();

    document.addEventListener('mouseover', function (e) {
      var t = e.target;
      ring.classList.remove('is-link', 'is-drag', 'is-flip');
      label.textContent = '';
      if (t.closest('.flip-card')) {
        ring.classList.add('is-flip');
        label.textContent = 'FLIP';
      } else if (t.closest('[data-cursor="drag"]')) {
        ring.classList.add('is-drag');
        label.textContent = 'DRAG';
      } else if (t.closest('a,button')) {
        ring.classList.add('is-link');
      }
    });
  })();

  /* ---------- Flip Cards ---------- */
  document.querySelectorAll('.flip-card').forEach(function (card) {
    function toggle() {
      card.classList.toggle('flipped');
      card.setAttribute('aria-pressed', card.classList.contains('flipped') ? 'true' : 'false');
    }

    card.addEventListener('click', function (e) {
      if (e.target.closest('a,button')) return;
      toggle();
    });

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  /* ---------- Skill Accordion Rows ---------- */
  document.querySelectorAll('.skill-row').forEach(function (row) {
    var head = row.querySelector('.sk-head');
    if (head) {
      head.addEventListener('click', function () {
        row.classList.toggle('open');
      });
    }
  });

  /* ---------- Toast & Copy Email ---------- */
  var toastTimer;
  function toast(msg) {
    var t = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      t.classList.remove('show');
    }, 2600);
  }

  var EMAIL = 'krishankumar01705@gmail.com';
  var copyBtn = document.getElementById('copyEmail');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      function ok() {
        toast('EMAIL COPIED TO CLIPBOARD');
        copyBtn.innerHTML = '<i data-lucide="check"></i>COPIED';
        if (window.lucide) lucide.createIcons();
        setTimeout(function () {
          copyBtn.innerHTML = '<i data-lucide="copy"></i>COPY';
          if (window.lucide) lucide.createIcons();
        }, 2000);
      }

      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = EMAIL;
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          ok();
        } catch (e) {
          toast(EMAIL);
        }
        ta.remove();
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL).then(ok).catch(fallback);
      } else {
        fallback();
      }
    });
  }

  /* ---------- Dynamic Copyright Year ---------- */
  var yrEl = document.getElementById('yr');
  if (yrEl) yrEl.textContent = new Date().getFullYear();
})();