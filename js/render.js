/**
 * render.js — DOM rendering functions.
 * Reads from window.PORTFOLIO_DATA and injects markup into the section
 * containers defined in index.html. All animation hooks (data-reveal, etc.)
 * are added here; the behavior lives in animations.js / main.js.
 */
/* eslint-disable */
(function () {
  "use strict";

  const { RESUME, LANGUAGE_COLORS, CATEGORY_COLORS } = window.PORTFOLIO_DATA;
  // GITHUB is mutable: the live fetch (js/github.js) can swap it in at runtime.
  let GITHUB = window.PORTFOLIO_DATA.GITHUB;
  // BLOG is mutable: the live fetch (js/medium.js) can swap it in at runtime.
  let BLOG = window.PORTFOLIO_DATA.BLOG;

  // ── Helpers ────────────────────────────────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const el = (html) => {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function fmtMonth(ym) {
    if (!ym) return "Present";
    const [y, m] = ym.split("-").map(Number);
    return `${MONTHS[m - 1]} ${y}`;
  }
  function fmtBlogDate(ymd) {
    const [y, m, d] = ymd.split("-").map(Number);
    return `${MONTHS[m - 1]} ${d}, ${y}`;
  }
  function durationBetween(start, end) {
    const [sy, sm] = start.split("-").map(Number);
    const e = end ? end.split("-").map(Number) : [new Date().getFullYear(), new Date().getMonth() + 1];
    let months = (e[0] - sy) * 12 + (e[1] - sm);
    months = Math.max(months, 1);
    const yrs = Math.floor(months / 12);
    const mos = months % 12;
    const parts = [];
    if (yrs) parts.push(`${yrs} yr${yrs > 1 ? "s" : ""}`);
    if (mos) parts.push(`${mos} mo${mos > 1 ? "s" : ""}`);
    return parts.join(" ");
  }
  function relativeTime(ymd) {
    const then = new Date(ymd + "T00:00:00Z").getTime();
    const days = Math.floor((Date.now() - then) / 86400000);
    if (days < 1) return "today";
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    const y = Math.floor(days / 365);
    return `${y}y ago`;
  }
  // Deterministic vibrant color from a string (for letter avatars / logos).
  function colorFromString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
    const hue = Math.abs(h) % 360;
    return `hsl(${hue} 70% 55%)`;
  }
  function langColor(lang) {
    return LANGUAGE_COLORS[lang] || LANGUAGE_COLORS.Other;
  }

  // Inline SVG icon set (stroke = currentColor).
  const ICONS = {
    github:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.4 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.6 18 4.9 18 4.9c.6 1.6.2 2.8.1 3.1.8.9 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>',
    linkedin:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.3a1.7 1.7 0 1 1 0-3.5 1.7 1.7 0 0 1 0 3.5zM19 19h-3v-4.7c0-1.1 0-2.6-1.6-2.6S12.6 13 12.6 14.2V19h-3v-9h2.9v1.2h.1a3.2 3.2 0 0 1 2.9-1.6c3.1 0 3.7 2 3.7 4.7z"/></svg>',
    leetcode:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M13.5 2 7 8.6a3 3 0 0 0 0 4.2l6.5 6.6 1.8-1.8-6.5-6.6a.5.5 0 0 1 0-.7L15.3 3.8 13.5 2zm2.4 14.9-1.8 1.8 1.7 1.7 1.8-1.8-1.7-1.7zM9.4 11.1a1.3 1.3 0 1 0 0 2.6h9.3a1.3 1.3 0 0 0 0-2.6H9.4z"/></svg>',
    medium:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.52 6.42-3.39 6.42s-3.39-2.88-3.39-6.42 1.52-6.42 3.39-6.42 3.39 2.88 3.39 6.42M24 12c0 3.17-.53 5.75-1.19 5.75s-1.19-2.58-1.19-5.75.53-5.75 1.19-5.75S24 8.83 24 12z"/></svg>',
    mail:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    phone:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
    location:
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    external:
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
    star:
      '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>',
    fork:
      '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="4" r="2"/><circle cx="18" cy="4" r="2"/><circle cx="12" cy="20" r="2"/><path d="M6 6v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6M12 12v6"/></svg>',
    code:
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/></svg>',
    arrow:
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    pipeline:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="6" height="6" rx="1"/><rect x="16" y="14" width="6" height="6" rx="1"/><path d="M8 7h6a3 3 0 0 1 3 3v4"/></svg>',
    cloud:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6-1.5A4 4 0 0 0 6 19z"/></svg>',
    shield:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5z"/><path d="m9 12 2 2 4-4"/></svg>',
    users:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></svg>',
    grad:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5"/></svg>',
    download:
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
    trophy:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9a6 6 0 0 0 12 0V3H6z"/><path d="M6 5H3v2a3 3 0 0 0 3 3M18 5h3v2a3 3 0 0 1-3 3M9 21h6M12 15v6"/></svg>',
    play:
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M7 4v16l13-8z"/></svg>',
  };

  const NAV_LINKS = [
    ["Home", "#home"],
    ["About", "#about"],
    ["Skills", "#skills"],
    ["Experience", "#experience"],
    ["Projects", "#projects"],
    ["Blog", "#blog"],
    ["Contact", "#contact"],
  ];

  // ── Navigation ─────────────────────────────────────────────────────────────
  function renderNav() {
    const nav = $("#nav");
    nav.innerHTML = `
      <div class="nav__inner">
        <a href="#home" class="nav__logo gradient-text" aria-label="${esc(RESUME.name)} home">${esc(RESUME.initials)}_</a>
        <div class="nav__links" role="list">
          ${NAV_LINKS.map(([t, h]) => `<a class="nav__link" role="listitem" href="${h}">${t}</a>`).join("")}
        </div>
        <div class="nav__right">
          <button class="theme-toggle" id="themeToggle" aria-label="Toggle color theme" aria-pressed="false">
            <svg class="moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
            <svg class="sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
          </button>
          <a class="btn btn-gradient-border btn-sm" href="${esc(RESUME.resumeFile)}" download aria-label="Download resume">
            ${ICONS.download}<span>Resume</span>
          </a>
          <button class="nav__burger" id="navBurger" aria-label="Open menu" aria-expanded="false" aria-controls="navDrawer">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>`;

    $("#navDrawer").innerHTML = NAV_LINKS.map(
      ([t, h]) => `<a href="${h}" data-drawer-link>${t}</a>`
    ).join("");
  }

  // ── Hero ───────────────────────────────────────────────────────────────────
  function renderHero() {
    const exp = totalYears();
    const stats = [
      { num: exp + "+", label: "Years Experience" },
      { num: countProjects(), label: "Projects Delivered" },
      { num: GITHUB.publicRepos, label: "GitHub Repos", key: "repos" },
    ];
    $("#heroContent").innerHTML = `
      <span class="hero__wave" data-load style="--load-delay:0ms">👋 <span>Hi, I'm</span></span>
      <h1 class="hero__name gradient-text" data-load style="--load-delay:120ms">${esc(RESUME.name)}</h1>
      <p class="hero__title" data-load style="--load-delay:240ms">
        <span id="typewriter"></span><span class="typewriter-cursor" aria-hidden="true"></span>
      </p>
      <p class="hero__tagline" data-load style="--load-delay:360ms">${esc(RESUME.tagline)}</p>
      <div class="hero__cta" data-load style="--load-delay:480ms">
        <a class="btn btn-primary" href="#projects">${ICONS.play}<span>View My Work</span></a>
        <a class="btn btn-ghost" href="#contact">${ICONS.mail}<span>Let's Talk</span></a>
      </div>
      <div class="hero__stats" data-load style="--load-delay:600ms">
        ${stats
          .map(
            (s) => `<div class="stat"${s.key ? ` data-stat="${s.key}"` : ""}>
              <div class="stat__num gradient-text" data-count="${esc(s.num)}">${esc(s.num)}</div>
              <div class="stat__label">${esc(s.label)}</div>
            </div>`
          )
          .join("")}
      </div>`;

    // Particles
    const pc = $("#heroParticles");
    let frag = "";
    for (let i = 0; i < 20; i++) {
      const left = Math.random() * 100;
      const top = 30 + Math.random() * 70;
      const dur = 10 + Math.random() * 12;
      const delay = -Math.random() * 12;
      const op = 0.25 + Math.random() * 0.5;
      const size = 2 + Math.random() * 3;
      frag += `<span class="particle" style="left:${left}%;top:${top}%;width:${size}px;height:${size}px;--p-duration:${dur}s;--p-delay:${delay}s;--p-opacity:${op}"></span>`;
    }
    pc.innerHTML = frag;
  }

  function totalYears() {
    const first = RESUME.experience.reduce((min, e) => (e.start < min ? e.start : min), "9999-12");
    const [y, m] = first.split("-").map(Number);
    const now = new Date();
    let months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
    return Math.max(1, Math.round(months / 12));
  }
  function countProjects() {
    // Named enterprise initiatives across roles + standout repos.
    return 10;
  }

  // ── About ──────────────────────────────────────────────────────────────────
  function renderAbout() {
    const socials = [];
    if (RESUME.links.github) socials.push(["github", RESUME.links.github, "GitHub"]);
    if (RESUME.links.linkedin) socials.push(["linkedin", RESUME.links.linkedin, "LinkedIn"]);
    if (RESUME.links.leetcode) socials.push(["leetcode", RESUME.links.leetcode, "LeetCode"]);
    if (RESUME.links.medium) socials.push(["medium", RESUME.links.medium, "Medium"]);
    socials.push(["mail", "mailto:" + RESUME.email, "Email"]);
    if (RESUME.links.twitter) socials.push(["external", RESUME.links.twitter, "Twitter"]);

    $("#aboutGrid").innerHTML = `
      <aside class="about__card" data-reveal="left">
        <div class="about__avatar-wrap gradient-ring">
          <img class="about__avatar" src="${esc(GITHUB.avatar)}" alt="Portrait of ${esc(RESUME.name)}" width="150" height="150" loading="lazy" />
        </div>
        <div class="about__github-name">${esc(GITHUB.name)}</div>
        <div class="about__github-handle">@${esc(GITHUB.username)}</div>
        <div class="chip-row">
          <span class="chip">${ICONS.github} <strong>${GITHUB.publicRepos}</strong> repos</span>
          <span class="chip"><strong>${GITHUB.followers}</strong> followers</span>
          <span class="chip"><strong>${esc(GITHUB.primaryLanguage)}</strong> primary</span>
        </div>
        <div class="location-badge">${ICONS.location} ${esc(RESUME.location)}</div>
        <div class="social-row">
          ${socials
            .map(
              ([icon, href, label]) =>
                `<a class="social-btn" href="${esc(href)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(label)}">${ICONS[icon]}</a>`
            )
            .join("")}
        </div>
      </aside>

      <div class="about__body" data-reveal="right">
        <span class="section-badge">⚡ About Me</span>
        <h2 class="section-title" id="about-title">
          Building reliable <span class="gradient-text">data platforms</span>
        </h2>
        ${RESUME.about.map((p) => `<p>${p}</p>`).join("")}

        <div class="about__strengths">
          ${RESUME.strengths
            .map(
              (s) => `<div class="strength">
                <span class="strength__icon">${ICONS[s.icon] || ICONS.pipeline}</span>
                <div>
                  <div class="strength__title">${esc(s.title)}</div>
                  <div class="strength__text">${esc(s.text)}</div>
                </div>
              </div>`
            )
            .join("")}
        </div>

        <div class="soft-skills">
          ${RESUME.softSkills.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}
        </div>

        <div class="availability">
          <span class="availability-dot" aria-hidden="true"></span>
          ${esc(RESUME.availability)}
        </div>
      </div>`;
  }

  // ── Skills ─────────────────────────────────────────────────────────────────
  function renderSkills() {
    $("#skillsSubtitle").textContent = `${RESUME.skills.length} technologies across ${
      RESUME.skillCategories.length - 1
    } categories — from languages and frameworks to cloud infrastructure.`;

    $("#skillsFilters").innerHTML = RESUME.skillCategories
      .map(
        (c, i) =>
          `<button class="filter-tab" role="tab" data-filter="${esc(c)}" aria-selected="${
            i === 0 ? "true" : "false"
          }">${esc(c)}</button>`
      )
      .join("");

    $("#skillsGrid").innerHTML = RESUME.skills
      .map((s, i) => {
        const color = CATEGORY_COLORS[s.category] || "var(--accent-1)";
        const visual = s.icon
          ? `<div class="skill-card__icon"><i class="${esc(s.icon)}" aria-hidden="true"></i></div>`
          : `<div class="skill-card__letter" style="background:${color}" aria-hidden="true">${esc(
              s.name[0]
            )}</div>`;
        return `<div class="skill-card" data-reveal="scale" data-category="${esc(
          s.category
        )}" style="--cat-color:${color};--reveal-delay:${(i % 8) * 60}ms">
          ${visual}
          <div class="skill-card__name">${esc(s.name)}</div>
          <div class="skill-card__level">${esc(s.level)}</div>
        </div>`;
      })
      .join("");
  }

  // ── Experience ─────────────────────────────────────────────────────────────
  function renderExperience() {
    $("#expSubtitle").textContent = `${totalYears()}+ years building and scaling data systems across ${RESUME.experience.length} roles.`;
    $("#timeline").innerHTML = RESUME.experience
      .map((e, i) => {
        const logoColor = colorFromString(e.company);
        const dates = `${fmtMonth(e.start)} – ${fmtMonth(e.end)}`;
        const dur = durationBetween(e.start, e.end);
        const side = i % 2 === 0 ? "right" : "left";
        return `<article class="tl-entry" data-reveal="${side}">
          <span class="timeline-dot ${e.current ? "is-current" : ""}" aria-hidden="true"></span>
          <div class="tl-meta">
            <span class="tl-type">${esc(e.type)}</span>
            <div class="tl-company">
              <span class="company-logo" style="background:${logoColor}" aria-hidden="true">${esc(
          e.company[0]
        )}</span>
              ${
                e.url
                  ? `<a class="tl-company__name" href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">${esc(
                      e.company
                    )}</a>`
                  : `<span class="tl-company__name">${esc(e.company)}</span>`
              }
            </div>
            <div class="tl-dates">${dates} · ${dur}</div>
          </div>
          <div class="tl-card">
            <h3 class="tl-role gradient-text">${esc(e.role)}</h3>
            <div class="tl-card__sub">
              <span>${ICONS.location} ${esc(e.location)}</span>
            </div>
            <ul class="tl-bullets">
              ${e.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}
            </ul>
            <div class="pill-row">
              ${e.stack.map((t) => `<span class="pill">${esc(t)}</span>`).join("")}
            </div>
          </div>
        </article>`;
      })
      .join("");
  }

  // ── Projects ───────────────────────────────────────────────────────────────
  function langBreakdown(languages) {
    const entries = Object.entries(languages || {});
    if (!entries.length) return null;
    const total = entries.reduce((a, [, v]) => a + v, 0);
    return entries
      .sort((a, b) => b[1] - a[1])
      .map(([name, bytes]) => ({ name, pct: (bytes / total) * 100 }));
  }
  function langBarHTML(languages, withLegend) {
    const bd = langBreakdown(languages);
    if (!bd) return "";
    const bar = `<div class="lang-bar" aria-hidden="true">${bd
      .map((l) => `<span style="width:${l.pct}%;background:${langColor(l.name)}"></span>`)
      .join("")}</div>`;
    if (!withLegend) return bar;
    const legend = `<div class="lang-legend">${bd
      .slice(0, 5)
      .map(
        (l) =>
          `<span class="ll"><span class="lang-dot" style="background:${langColor(
            l.name
          )}"></span>${esc(l.name)} ${l.pct.toFixed(1)}%</span>`
      )
      .join("")}</div>`;
    return bar + legend;
  }

  function renderProjects() {
    $("#projSubtitle").textContent = `A selection of ${GITHUB.repos.length} public repositories — data tooling, automation, and apps.`;

    // Filters
    // Filters — language tabs are derived from the actual repos so live data fits.
    const langs = [...new Set(GITHUB.repos.map((r) => r.language).filter(Boolean))].slice(0, 4);
    const filters = ["All", "Recent", ...langs];
    $("#projectsFilters").innerHTML = filters
      .map(
        (f, i) =>
          `<button class="filter-tab" role="tab" data-proj-filter="${esc(f)}" aria-selected="${
            i === 0 ? "true" : "false"
          }">${esc(f)}</button>`
      )
      .join("");

    // Featured
    const feat = GITHUB.repos.find((r) => r.featured) || GITHUB.repos[0];
    $("#featuredProject").innerHTML = `
      <article class="featured-project" data-reveal>
        <div class="featured-project__banner" aria-hidden="true"></div>
        <div class="featured-project__body">
          <div>
            <span class="featured-tag">${ICONS.star} Featured Project</span>
            <h3 class="featured-project__name mono gradient-text">${esc(feat.name)}</h3>
            <p class="featured-project__desc">${esc(feat.summary)}</p>
            <div class="featured-stats">
              <span class="fs">${ICONS.fork}<strong>${feat.forks}</strong> forks</span>
              <span class="fs">${ICONS.code}<strong>${esc(feat.language || "—")}</strong></span>
            </div>
            <div class="featured-project__cta">
              <a class="btn btn-primary btn-sm" href="${esc(feat.url)}" target="_blank" rel="noopener noreferrer">${ICONS.github}<span>View Code</span></a>
              ${
                feat.homepage
                  ? `<a class="btn btn-ghost btn-sm" href="${esc(feat.homepage)}" target="_blank" rel="noopener noreferrer">${ICONS.external}<span>Live Demo</span></a>`
                  : ""
              }
            </div>
          </div>
          <div>
            <p class="lang-badge" style="margin-bottom:8px">Language breakdown</p>
            ${langBarHTML(feat.languages, true)}
            <div class="project-card__topics" style="margin-top:16px">
              ${feat.topics.map((t) => `<span class="topic-tag">#${esc(t)}</span>`).join("")}
            </div>
          </div>
        </div>
      </article>`;

    // Grid (remaining repos)
    const rest = GITHUB.repos.filter((r) => r !== feat);
    $("#projectsGrid").innerHTML = rest.map((r, i) => projectCard(r, i)).join("");
  }

  function projectCard(r, i) {
    const color = langColor(r.language);
    return `<article class="project-card" data-reveal="scale" data-lang="${esc(
      r.language || ""
    )}" data-stars="${r.stars}" data-pushed="${esc(r.pushedAt)}" style="--reveal-delay:${(i % 3) * 90}ms">
      <div class="project-card__bar" style="background:${color}"></div>
      <div class="project-card__body">
        <div class="project-card__top">
          <span class="lang-badge"><span class="lang-dot" style="background:${color}"></span>${esc(
            r.language || "Misc"
          )}</span>
          <span class="lang-badge">${relativeTime(r.pushedAt)}</span>
        </div>
        <h3 class="project-card__name">${esc(r.name)}</h3>
        <p class="project-card__desc">${esc(r.summary)}</p>
        <div class="project-card__topics">
          ${r.topics
            .slice(0, 4)
            .map((t) => `<span class="topic-tag">#${esc(t)}</span>`)
            .join("")}
        </div>
        <div class="project-card__footer">
          <div class="project-stats">
            <span>${ICONS.fork}${r.forks}</span>
            ${r.openIssues ? `<span>${ICONS.code}${r.openIssues}</span>` : ""}
          </div>
          <div class="project-links">
            <a class="icon-btn" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(
      r.name
    )} on GitHub">${ICONS.github}</a>
            ${
              r.homepage
                ? `<a class="icon-btn" href="${esc(r.homepage)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(
                    r.name
                  )} live demo">${ICONS.external}</a>`
                : ""
            }
          </div>
        </div>
      </div>
    </article>`;
  }

  // ── Education & Achievements ───────────────────────────────────────────────
  function renderEducation() {
    const eduHTML = RESUME.education
      .map(
        (e) => `<article class="edu-card" data-reveal="left">
          <span class="edu-icon">${ICONS.grad}</span>
          <div>
            <div class="edu-card__degree">${esc(e.degree)}</div>
            <div class="edu-card__field">${esc(e.field)}</div>
            <div class="edu-card__meta">
              <span>${esc(e.institution)}</span>
              <span>${fmtMonth(e.start)} – ${fmtMonth(e.end)}</span>
              ${e.gpa ? `<span>GPA ${esc(e.gpa)}</span>` : ""}
            </div>
            <div class="edu-card__meta" style="margin-top:4px">${ICONS.location} ${esc(e.location)}</div>
          </div>
        </article>`
      )
      .join("");

    const achvHTML = RESUME.achievements
      .map(
        (a, i) => `<article class="achv-card" data-reveal="right" style="--reveal-delay:${i * 70}ms">
          <span class="achv-metric gradient-text">${esc(a.metric)}</span>
          <div>
            <div class="achv-card__label">${esc(a.label)}</div>
            <div class="achv-card__detail">${esc(a.detail)}</div>
          </div>
        </article>`
      )
      .join("");

    $("#eduGrid").innerHTML = `
      <div>
        <h3 class="col-title">${ICONS.grad} Education</h3>
        ${eduHTML}
      </div>
      <div>
        <h3 class="col-title">${ICONS.trophy} Key Achievements</h3>
        ${achvHTML}
      </div>`;
  }

  // ── Contact ────────────────────────────────────────────────────────────────
  function renderContact() {
    const methods = [
      ["mail", "Email", RESUME.email, "mailto:" + RESUME.email],
      ["linkedin", "LinkedIn", "/in/chakshu-salgotra", RESUME.links.linkedin],
      ["github", "GitHub", "@" + GITHUB.username, RESUME.links.github],
      ["medium", "Medium", "@chakshu-salgotra", RESUME.links.medium],
      ["phone", "Phone", RESUME.phone, "tel:" + RESUME.phoneHref],
    ];

    $("#contactGrid").innerHTML = `
      <div class="contact__left" data-reveal="left">
        <span class="section-badge">📬 Contact</span>
        <h2 class="contact__lead" id="contact-title">Let's build something <span class="gradient-text">great together.</span></h2>
        <p class="contact__copy">
          I'm always open to discussing data engineering roles, freelance pipelines,
          or interesting collaborations. Drop a message and I'll get back to you.
        </p>
        <div class="contact-methods">
          ${methods
            .map(
              ([icon, label, value, href]) => `<a class="contact-method" href="${esc(
                href
              )}" ${href.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}>
                <span class="contact-method__icon">${ICONS[icon]}</span>
                <span>
                  <span class="contact-method__label">${esc(label)}</span><br />
                  <span class="contact-method__value">${esc(value)}</span>
                </span>
                <span class="contact-method__arrow" aria-hidden="true">${ICONS.arrow}</span>
              </a>`
            )
            .join("")}
        </div>
        <span class="response-badge">⚡ Usually responds within 24 hours</span>
      </div>

      <form class="contact-form" id="contactForm" data-reveal="right" novalidate>
        <div class="field">
          <input type="text" id="cf-name" name="name" placeholder=" " autocomplete="name" required />
          <label for="cf-name">Your name</label>
          <span class="field__error" data-error-for="cf-name"></span>
        </div>
        <div class="field">
          <input type="email" id="cf-email" name="email" placeholder=" " autocomplete="email" required />
          <label for="cf-email">Email address</label>
          <span class="field__error" data-error-for="cf-email"></span>
        </div>
        <div class="field">
          <select id="cf-subject" name="subject" required>
            <option value="" disabled selected hidden></option>
            <option>Job Opportunity</option>
            <option>Freelance</option>
            <option>Collaboration</option>
            <option>Other</option>
          </select>
          <label for="cf-subject">Subject</label>
          <span class="field__error" data-error-for="cf-subject"></span>
        </div>
        <div class="field">
          <textarea id="cf-message" name="message" placeholder=" " required></textarea>
          <label for="cf-message">Your message</label>
          <span class="field__error" data-error-for="cf-message"></span>
        </div>
        <button type="submit" class="btn btn-primary form-submit">
          <span>Send Message</span>${ICONS.arrow}
        </button>
        <p class="form-status" id="formStatus" role="status" aria-live="polite"></p>
      </form>`;
  }

  // ── Footer ─────────────────────────────────────────────────────────────────
  function renderFooter() {
    const socials = [
      ["github", RESUME.links.github, "GitHub"],
      ["linkedin", RESUME.links.linkedin, "LinkedIn"],
      ["leetcode", RESUME.links.leetcode, "LeetCode"],
      ["medium", RESUME.links.medium, "Medium"],
      ["mail", "mailto:" + RESUME.email, "Email"],
    ];
    $("#footer").innerHTML = `
      <div class="container">
        <div class="footer__top">
          <div class="footer__brand">
            <div class="footer__logo gradient-text">${esc(RESUME.initials)}_</div>
            <p class="footer__tagline">${esc(RESUME.title)} crafting reliable, scalable data platforms. ${esc(
      RESUME.location
    )}.</p>
          </div>
          <nav class="footer__nav" aria-label="Footer">
            ${NAV_LINKS.map(([t, h]) => `<a href="${h}">${t}</a>`).join("")}
          </nav>
          <div class="footer__socials">
            ${socials
              .map(
                ([icon, href, label]) =>
                  `<a class="social-btn" href="${esc(href)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(
                    label
                  )}">${ICONS[icon]}</a>`
              )
              .join("")}
          </div>
        </div>
        <div class="footer__bottom">
          <span>Built with ❤️ by ${esc(RESUME.name)} · <a href="${esc(
      RESUME.links.github
    )}" target="_blank" rel="noopener noreferrer" style="color:var(--accent-1)">Open source on GitHub</a></span>
          <span>© <span id="footerYear"></span> ${esc(RESUME.name)}. All rights reserved.</span>
        </div>
      </div>`;
    $("#footerYear").textContent = new Date().getFullYear();
  }

  // ── Blog / Writing ─────────────────────────────────────────────────────────
  function renderBlog() {
    const sub = $("#blogSubtitle");
    if (sub)
      sub.textContent =
        "Thoughts on data engineering, AI, and the modern data stack — published on Medium.";
    const grid = $("#blogGrid");
    if (grid) {
      grid.innerHTML = BLOG.posts
        .map(
          (p, i) => `<article class="blog-card" data-reveal style="--reveal-delay:${i * 80}ms">
            <div class="blog-card__head">
              <span class="blog-source">${ICONS.medium} Medium</span>
              <span class="blog-date">${fmtBlogDate(p.date)}</span>
            </div>
            <h3 class="blog-card__title">${esc(p.title)}</h3>
            <p class="blog-card__summary">${esc(p.summary)}</p>
            <div class="project-card__topics">
              ${(p.tags || []).map((t) => `<span class="topic-tag">#${esc(t)}</span>`).join("")}
            </div>
            <a class="blog-card__link" href="${esc(
              p.url
            )}" target="_blank" rel="noopener noreferrer">Read article ${ICONS.arrow}</a>
          </article>`
        )
        .join("");
    }
    const cta = $("#blogCta");
    if (cta) {
      cta.innerHTML = `<a class="btn btn-ghost" href="${esc(
        BLOG.profileUrl
      )}" target="_blank" rel="noopener noreferrer">${ICONS.medium}<span>Read more on Medium</span>${ICONS.arrow}</a>`;
    }
  }

  // Live GitHub refresh: swap in freshly-fetched data and re-render the
  // GitHub-dependent sections (projects, about chips, repo count).
  window.PortfolioUpdateGitHub = function (data) {
    if (!data) return;
    GITHUB = data;
    window.PORTFOLIO_DATA.GITHUB = data;
    renderAbout();
    renderProjects();
    const repoStat = document.querySelector('[data-stat="repos"] .stat__num');
    if (repoStat) repoStat.textContent = String(data.publicRepos);
    if (typeof window.PortfolioAfterGitHub === "function") window.PortfolioAfterGitHub();
  };

  // Live Medium refresh: swap in freshly-fetched posts and re-render writing.
  window.PortfolioUpdateBlog = function (data) {
    if (!data) return;
    BLOG = data;
    window.PORTFOLIO_DATA.BLOG = data;
    renderBlog();
    if (typeof window.PortfolioAfterBlog === "function") window.PortfolioAfterBlog();
  };

  // Expose a single render entry point.
  window.PortfolioRender = function renderAll() {
    renderNav();
    renderHero();
    renderAbout();
    renderSkills();
    renderExperience();
    renderProjects();
    renderEducation();
    renderBlog();
    renderContact();
    renderFooter();
  };
})();
