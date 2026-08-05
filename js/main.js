/**
 * main.js — init & orchestration.
 * Renders the page, wires up theme, navigation, filters, the contact form,
 * scroll behaviors, and the custom cursor.
 */
/* eslint-disable */
(function () {
  "use strict";

  const root = document.documentElement;
  const prefersReducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

  // ── Boot ───────────────────────────────────────────────────────────────────
  function boot() {
    if (!window.PORTFOLIO_DATA || !window.PortfolioRender) {
      console.error("Portfolio data or render module missing.");
      return;
    }
    window.PortfolioRender();

    const anim = window.PortfolioAnimations.init();

    initTheme();
    initNav();
    initSmoothScroll();
    initScrollEffects(anim.timelineUpdate);
    initSkillFilters();
    initProjectFilters();
    initContactForm();
    initBackToTop();
    initActiveSection();
    initCursor();
    initLiveGitHub();
    initLiveMedium();
  }

  // ── Theme ──────────────────────────────────────────────────────────────────
  function initTheme() {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    function currentTheme() {
      const explicit = root.getAttribute("data-theme");
      if (explicit) return explicit;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    function syncPressed() {
      toggle.setAttribute("aria-pressed", currentTheme() === "dark" ? "true" : "false");
    }
    syncPressed();

    toggle.addEventListener("click", () => {
      const next = currentTheme() === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      syncPressed();
    });

    // React to OS theme change only when the user hasn't chosen explicitly.
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      let stored = null;
      try {
        stored = localStorage.getItem("theme");
      } catch (e) {}
      if (!stored) syncPressed();
    });
  }

  // ── Navigation (burger drawer, hide-on-scroll) ─────────────────────────────
  function initNav() {
    const nav = document.getElementById("nav");
    const burger = document.getElementById("navBurger");
    const drawer = document.getElementById("navDrawer");
    if (!nav || !burger || !drawer) return;

    function closeDrawer() {
      drawer.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Open menu");
    }
    function openDrawer() {
      drawer.classList.add("open");
      burger.classList.add("open");
      burger.setAttribute("aria-expanded", "true");
      burger.setAttribute("aria-label", "Close menu");
    }

    burger.addEventListener("click", () => {
      drawer.classList.contains("open") ? closeDrawer() : openDrawer();
    });
    drawer.querySelectorAll("[data-drawer-link]").forEach((a) => a.addEventListener("click", closeDrawer));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });
  }

  // ── Smooth scroll for in-page anchors ──────────────────────────────────────
  function initSmoothScroll() {
    const navHeight = parseFloat(getComputedStyle(root).getPropertyValue("--nav-height")) * 16 || 72;
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 1;
      window.scrollTo({
        top,
        behavior: prefersReducedMQ.matches ? "auto" : "smooth",
      });
      history.replaceState(null, "", id);
    });
  }

  // ── Scroll effects: progress bar, nav show/hide ────────────────────────────
  function initScrollEffects(timelineUpdate) {
    const nav = document.getElementById("nav");
    const progress = document.querySelector(".scroll-progress");
    let lastY = window.pageYOffset;
    let ticking = false;

    function onScroll() {
      const y = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? y / docHeight : 0;

      if (progress) progress.style.transform = `scaleX(${pct})`;

      if (nav) {
        nav.classList.toggle("scrolled", y > 20);
        // Hide when scrolling down past the hero, show on scroll up.
        if (y > 400 && y > lastY + 4) nav.classList.add("hidden");
        else if (y < lastY - 4) nav.classList.remove("hidden");
      }

      if (timelineUpdate) timelineUpdate();

      lastY = y;
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(onScroll);
          ticking = true;
        }
      },
      { passive: true }
    );
    onScroll();
  }

  // ── Skill filters ──────────────────────────────────────────────────────────
  function initSkillFilters() {
    const tabs = document.querySelectorAll("#skillsFilters .filter-tab");
    const cards = document.querySelectorAll("#skillsGrid .skill-card");
    if (!tabs.length) return;

    function applyFilter(filter) {
      cards.forEach((card) => {
        const show = filter === "All" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !show);
      });
    }
    wireTabs(tabs, (tab) => applyFilter(tab.dataset.filter));
  }

  // ── Project filters ────────────────────────────────────────────────────────
  function initProjectFilters() {
    const tabs = document.querySelectorAll("#projectsFilters .filter-tab");
    const grid = document.getElementById("projectsGrid");
    if (!tabs.length || !grid) return;
    const cards = Array.from(grid.querySelectorAll(".project-card"));

    function applyFilter(filter) {
      let ordered = cards.slice();
      cards.forEach((c) => c.classList.remove("is-hidden"));

      if (filter === "Most Stars") {
        ordered.sort((a, b) => (+b.dataset.stars) - (+a.dataset.stars));
      } else if (filter === "Recent") {
        ordered.sort((a, b) => (a.dataset.pushed < b.dataset.pushed ? 1 : -1));
      } else if (filter !== "All") {
        cards.forEach((c) => {
          if ((c.dataset.lang || "") !== filter) c.classList.add("is-hidden");
        });
      }
      // Re-append in new order (visible ones keep DOM order otherwise).
      ordered.forEach((c) => grid.appendChild(c));
    }
    wireTabs(tabs, (tab) => applyFilter(tab.dataset.projFilter));
  }

  // Shared tab a11y/wiring with animated selection.
  function wireTabs(tabs, onSelect) {
    tabs.forEach((tab, idx) => {
      tab.setAttribute("tabindex", tab.getAttribute("aria-selected") === "true" ? "0" : "-1");
      tab.addEventListener("click", () => select(idx));
      tab.addEventListener("keydown", (e) => {
        let target = null;
        if (e.key === "ArrowRight") target = (idx + 1) % tabs.length;
        else if (e.key === "ArrowLeft") target = (idx - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") target = 0;
        else if (e.key === "End") target = tabs.length - 1;
        if (target !== null) {
          e.preventDefault();
          select(target);
          tabs[target].focus();
        }
      });
    });
    function select(idx) {
      tabs.forEach((t, i) => {
        const on = i === idx;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.setAttribute("tabindex", on ? "0" : "-1");
      });
      onSelect(tabs[idx]);
    }
  }

  // ── Contact form (client validation → mailto) ──────────────────────────────
  function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    const RESUME = window.PORTFOLIO_DATA.RESUME;

    // Track select value for floating label.
    const select = form.querySelector("#cf-subject");
    select.addEventListener("change", () => {
      select.classList.toggle("has-value", !!select.value);
    });

    function setError(id, msg) {
      const field = form.querySelector("#" + id).closest(".field");
      const slot = form.querySelector(`[data-error-for="${id}"]`);
      field.classList.toggle("invalid", !!msg);
      if (slot) slot.textContent = msg || "";
    }

    function validate() {
      let ok = true;
      const name = form.querySelector("#cf-name").value.trim();
      const email = form.querySelector("#cf-email").value.trim();
      const subject = form.querySelector("#cf-subject").value;
      const message = form.querySelector("#cf-message").value.trim();

      if (!name) {
        setError("cf-name", "Please enter your name.");
        ok = false;
      } else setError("cf-name", "");

      if (!email) {
        setError("cf-email", "Please enter your email.");
        ok = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("cf-email", "Enter a valid email address.");
        ok = false;
      } else setError("cf-email", "");

      if (!subject) {
        setError("cf-subject", "Please choose a subject.");
        ok = false;
      } else setError("cf-subject", "");

      if (message.length < 10) {
        setError("cf-message", "Message should be at least 10 characters.");
        ok = false;
      } else setError("cf-message", "");

      return ok;
    }

    // Live-clear errors as the user types.
    form.querySelectorAll("input, textarea, select").forEach((input) => {
      input.addEventListener("input", () => {
        const slot = form.querySelector(`[data-error-for="${input.id}"]`);
        if (slot && slot.textContent) {
          input.closest(".field").classList.remove("invalid");
          slot.textContent = "";
        }
      });
    });

    const submitBtn = form.querySelector(".form-submit");
    const statusEl = form.querySelector("#formStatus");
    const CONTACT = window.PORTFOLIO_DATA.CONTACT || {};

    function setStatus(msg, type) {
      if (!statusEl) return;
      statusEl.textContent = msg || "";
      statusEl.className = "form-status" + (type ? " " + type : "");
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate()) {
        form.querySelector(".invalid input, .invalid textarea, .invalid select")?.focus();
        return;
      }
      const nameVal = form.querySelector("#cf-name").value.trim();
      const emailVal = form.querySelector("#cf-email").value.trim();
      const subjectVal = form.querySelector("#cf-subject").value;
      const messageVal = form.querySelector("#cf-message").value.trim();

      // Direct send via Formspree/Getform when an endpoint is configured.
      if (CONTACT.endpoint) {
        const original = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = "<span>Sending…</span>";
        setStatus("", "");
        try {
          const res = await fetch(CONTACT.endpoint, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: new FormData(form),
          });
          if (res.ok) {
            form.reset();
            form.querySelector("#cf-subject").classList.remove("has-value");
            setStatus("Thanks! Your message has been sent — I'll get back to you soon.", "success");
          } else {
            let msg = "Something went wrong. Please try again or email me directly.";
            try {
              const data = await res.json();
              if (data && data.errors && data.errors.length)
                msg = data.errors.map((x) => x.message).join(" ");
            } catch (_) {}
            setStatus(msg, "error");
          }
        } catch (err) {
          setStatus("Network error. Please try again or email me directly.", "error");
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = original;
        }
        return;
      }

      // Fallback: open the visitor's email client via mailto:.
      const subject = encodeURIComponent(`[${subjectVal}] Portfolio message from ${nameVal}`);
      const body = encodeURIComponent(`${messageVal}\n\n— ${nameVal} (${emailVal})`);
      window.location.href = `mailto:${RESUME.email}?subject=${subject}&body=${body}`;
    });
  }

  // ── Back to top ────────────────────────────────────────────────────────────
  function initBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          btn.classList.toggle("show", window.pageYOffset > 600);
          ticking = false;
        });
      },
      { passive: true }
    );
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMQ.matches ? "auto" : "smooth" });
    });
  }

  // ── Active section highlighting ────────────────────────────────────────────
  function initActiveSection() {
    const links = document.querySelectorAll(".nav__link");
    const map = {};
    links.forEach((l) => (map[l.getAttribute("href")] = l));
    const sections = document.querySelectorAll("main section[id]");
    if (!("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((l) => l.classList.remove("active"));
          const active = map["#" + entry.target.id];
          if (active) active.classList.add("active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
  }

  // ── Custom cursor (desktop, fine pointer only) ─────────────────────────────
  function initCursor() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || prefersReducedMQ.matches) {
      return;
    }
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    if (!dot || !ring) return;
    document.body.classList.add("has-cursor");

    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });
    (function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();

    document.addEventListener("mouseover", (e) => {
      if (e.target.closest("a, button, .skill-card, .project-card, input, textarea, select")) {
        document.body.classList.add("cursor-active");
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest("a, button, .skill-card, .project-card, input, textarea, select")) {
        document.body.classList.remove("cursor-active");
      }
    });
  }

  // ── Live GitHub refresh ─────────────────────────────────────────────────────
  // Pulls fresh repo data at runtime so new public repos appear automatically.
  // Falls back silently to the static snapshot already on screen if it fails.
  function initLiveGitHub() {
    if (!window.PortfolioLoadGitHub) return;
    window.PortfolioAfterGitHub = function () {
      initProjectFilters();
      if (window.PortfolioObserveReveals) window.PortfolioObserveReveals();
    };
    window
      .PortfolioLoadGitHub()
      .then((data) => {
        if (data && window.PortfolioUpdateGitHub) window.PortfolioUpdateGitHub(data);
      })
      .catch(() => {});
  }

  // ── Live Medium refresh ─────────────────────────────────────────────────────
  // Pulls the latest RSS posts at runtime and keeps the static snapshot on error.
  function initLiveMedium() {
    if (!window.PortfolioLoadMedium) return;
    window.PortfolioAfterBlog = function () {
      if (window.PortfolioObserveReveals) window.PortfolioObserveReveals();
    };
    window
      .PortfolioLoadMedium()
      .then((data) => {
        if (data && window.PortfolioUpdateBlog) window.PortfolioUpdateBlog(data);
      })
      .catch(() => {});
  }

  // ── Go ─────────────────────────────────────────────────────────────────────
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
