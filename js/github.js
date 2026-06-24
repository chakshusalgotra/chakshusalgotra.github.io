/**
 * github.js — live GitHub fetch with graceful fallback.
 * ----------------------------------------------------
 * Exposes window.PortfolioLoadGitHub() → Promise<GitHubData|null>.
 *
 * - Fetches the public profile + ALL public repos at runtime so newly-created
 *   repos appear automatically (no snapshot to maintain).
 * - Filters forks (configurable), sorts newest-first, and merges the curated
 *   summaries/topics/languages from the data.js snapshot when a repo matches by
 *   name (so known repos keep their hand-written blurbs).
 * - Caches the result in sessionStorage to avoid re-hitting the API on refresh
 *   and to stay within GitHub's unauthenticated rate limit (60 req/hr).
 * - On any failure (offline, rate-limited) it returns null and the page keeps
 *   the static snapshot already rendered from data.js.
 */
/* eslint-disable */
(function () {
  "use strict";

  const D = window.PORTFOLIO_DATA || {};
  const CFG = D.GITHUB_CONFIG || {};
  const SNAP = D.GITHUB || { repos: [] };

  const cacheKey = () => "gh_cache_" + CFG.username;

  function curatedSignature() {
    // Include fields that drive rendered project copy so cache refreshes on edits.
    return (SNAP.repos || [])
      .map((r) => [r.name || "", r.description || "", r.summary || "", r.language || ""].join("|"))
      .join("||");
  }

  function readCache() {
    try {
      const raw = sessionStorage.getItem(cacheKey());
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (Date.now() - obj.t > (CFG.cacheMinutes || 30) * 60000) return null;
      if (obj.sig !== curatedSignature()) return null;
      return obj.data;
    } catch (e) {
      return null;
    }
  }

  function writeCache(data) {
    try {
      sessionStorage.setItem(cacheKey(), JSON.stringify({ t: Date.now(), sig: curatedSignature(), data }));
    } catch (e) {}
  }

  async function api(path) {
    const res = await fetch("https://api.github.com" + path, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) throw new Error("GitHub API " + res.status);
    return res.json();
  }

  const curatedByName = (name) => (SNAP.repos || []).find((r) => r.name === name);

  function buildRepos(raw) {
    let list = raw.filter((r) => (CFG.includeForks ? true : !r.fork) && !r.private);
    // Newest activity first, so freshly-created/pushed repos surface at the top.
    list.sort((a, b) => (a.pushed_at < b.pushed_at ? 1 : a.pushed_at > b.pushed_at ? -1 : 0));
    // Optionally pin a specific repo as the featured (hero) card.
    if (CFG.featuredRepo) {
      const fi = list.findIndex((r) => r.name === CFG.featuredRepo);
      if (fi > 0) {
        const [pinned] = list.splice(fi, 1);
        list.unshift(pinned);
      }
    }
    if (CFG.maxRepos > 0) list = list.slice(0, CFG.maxRepos);

    return list.map((r, i) => {
      const cur = curatedByName(r.name);
      const lang = r.language || (cur && cur.language) || null;
      const languages = cur && cur.languages ? cur.languages : lang ? { [lang]: 1 } : {};
      return {
        name: r.name,
        description: r.description || (cur && cur.description) || "",
        summary:
          (cur && cur.summary) ||
          r.description ||
          `A ${lang || "code"} project by @${CFG.username}.`,
        url: r.html_url,
        homepage: r.homepage || null,
        language: lang,
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        openIssues: r.open_issues_count || 0,
        pushedAt: (r.pushed_at || "").slice(0, 10),
        topics: r.topics && r.topics.length ? r.topics : (cur && cur.topics) || [],
        languages,
        featured: i === 0,
      };
    });
  }

  function primaryLanguage(repos) {
    const counts = {};
    repos.forEach((r) => {
      if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
    });
    let best = null,
      bestN = 0;
    Object.keys(counts).forEach((k) => {
      if (counts[k] > bestN) {
        best = k;
        bestN = counts[k];
      }
    });
    return best || SNAP.primaryLanguage;
  }

  async function fetchLive() {
    const [user, raw] = await Promise.all([
      api("/users/" + CFG.username),
      api("/users/" + CFG.username + "/repos?sort=pushed&per_page=100&type=public"),
    ]);
    const repos = buildRepos(raw);
    return {
      username: CFG.username,
      name: user.name || SNAP.name,
      bio: user.bio || SNAP.bio,
      avatar: user.avatar_url || SNAP.avatar,
      profileUrl: user.html_url || SNAP.profileUrl,
      followers: user.followers != null ? user.followers : SNAP.followers,
      following: user.following != null ? user.following : SNAP.following,
      publicRepos: user.public_repos != null ? user.public_repos : SNAP.publicRepos,
      totalStars: repos.reduce((a, r) => a + (r.stars || 0), 0),
      primaryLanguage: primaryLanguage(repos),
      fetchedAt: new Date().toISOString().slice(0, 10),
      repos,
    };
  }

  window.PortfolioLoadGitHub = async function () {
    if (!CFG || !CFG.liveFetch || !CFG.username) return null;
    const cached = readCache();
    if (cached) return cached;
    try {
      const data = await fetchLive();
      if (data.repos && data.repos.length) {
        writeCache(data);
        return data;
      }
      return null;
    } catch (e) {
      console.warn("[portfolio] GitHub live fetch failed — using snapshot.", e.message);
      return null;
    }
  };
})();
