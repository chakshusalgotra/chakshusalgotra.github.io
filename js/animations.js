/**
 * animations.js — scroll observers & motion.
 * Exposes window.PortfolioAnimations.init(), called by main.js after render.
 * All motion respects prefers-reduced-motion.
 */
/* eslint-disable */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Scroll-triggered reveals ───────────────────────────────────────────────
  function initReveals() {
    const items = document.querySelectorAll("[data-reveal]");
    if (prefersReduced || !("IntersectionObserver" in window)) {
      items.forEach((i) => i.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((i) => io.observe(i));
  }

  // ── Typewriter ─────────────────────────────────────────────────────────────
  function initTypewriter() {
    const target = document.getElementById("typewriter");
    if (!target) return;
    const words = (window.PORTFOLIO_DATA.RESUME.roles || []).slice();
    if (!words.length) return;

    if (prefersReduced) {
      target.textContent = words[0];
      return;
    }

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const word = words[wordIndex];
      if (!deleting) {
        charIndex++;
        target.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) {
          deleting = true;
          return setTimeout(tick, 1600);
        }
      } else {
        charIndex--;
        target.textContent = word.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      const base = deleting ? 45 : 95;
      const jitter = Math.random() * 60;
      setTimeout(tick, base + jitter);
    }
    setTimeout(tick, 600);
  }

  // ── Count-up on stats ──────────────────────────────────────────────────────
  function initCountUp() {
    const nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    if (prefersReduced || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          obs.unobserve(entry.target);
          animateCount(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    nums.forEach((n) => io.observe(n));
  }

  function animateCount(node) {
    const raw = node.getAttribute("data-count");
    const match = String(raw).match(/^(\d+)(.*)$/);
    if (!match) return;
    const end = parseInt(match[1], 10);
    const suffix = match[2] || "";
    if (end === 0) {
      node.textContent = "0" + suffix;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      node.textContent = Math.round(eased * end) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // ── Timeline draw on scroll ────────────────────────────────────────────────
  function initTimelineDraw() {
    const timeline = document.querySelector(".timeline");
    if (!timeline || prefersReduced) {
      if (timeline) timeline.style.setProperty("--timeline-progress", "1");
      return;
    }
    function update() {
      const rect = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const total = rect.height + start - vh * 0.2;
      const scrolled = start - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      timeline.style.setProperty("--timeline-progress", progress.toFixed(3));
    }
    update();
    return update; // returned so main.js can attach to its scroll loop
  }

  // ── Ripple effect on buttons ───────────────────────────────────────────────
  function initRipple() {
    if (prefersReduced) return;
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn");
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  }

  window.PortfolioAnimations = {
    init() {
      initReveals();
      initTypewriter();
      initCountUp();
      initRipple();
      return { timelineUpdate: initTimelineDraw() };
    },
  };

  // Re-observe any reveal targets added after the initial render (e.g. live GitHub).
  window.PortfolioObserveReveals = initReveals;
})();
