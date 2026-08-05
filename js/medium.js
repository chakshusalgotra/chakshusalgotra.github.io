/**
 * medium.js - live Medium RSS fetch with graceful fallback.
 * --------------------------------------------------------
 * Exposes window.PortfolioLoadMedium() -> Promise<BlogData|null>.
 *
 * Medium's RSS feed does not allow browser CORS requests, so the feed is read
 * through the configured RSS-to-JSON endpoint. Results are normalized to the
 * BLOG shape used by render.js and cached briefly in sessionStorage.
 */
/* eslint-disable */
(function () {
  "use strict";

  const D = window.PORTFOLIO_DATA || {};
  const CFG = D.BLOG_CONFIG || {};
  const SNAP = D.BLOG || { posts: [] };

  const cacheKey = () => "medium_cache_" + (CFG.username || "feed");

  function configSignature() {
    return [CFG.feedUrl || "", CFG.maxPosts || 0, CFG.apiUrl || ""].join("|");
  }

  function readCache() {
    try {
      const raw = sessionStorage.getItem(cacheKey());
      if (!raw) return null;
      const cached = JSON.parse(raw);
      if (Date.now() - cached.t > (CFG.cacheMinutes || 30) * 60000) return null;
      if (cached.sig !== configSignature()) return null;
      return cached.data;
    } catch (e) {
      return null;
    }
  }

  function writeCache(data) {
    try {
      sessionStorage.setItem(
        cacheKey(),
        JSON.stringify({ t: Date.now(), sig: configSignature(), data })
      );
    } catch (e) {}
  }

  function cleanText(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function decodeEntities(value) {
    const doc = new DOMParser().parseFromString(String(value || ""), "text/html");
    return cleanText(doc.body.textContent);
  }

  function summarize(html) {
    const doc = new DOMParser().parseFromString(String(html || ""), "text/html");
    const lead = doc.querySelector("h4 em, p em, p");
    const text = cleanText(lead ? lead.textContent : doc.body.textContent);
    if (text.length <= 240) return text;
    const shortened = text.slice(0, 237).replace(/\s+\S*$/, "");
    return shortened + "...";
  }

  function safeUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
    } catch (e) {
      return null;
    }
  }

  function normalizeItem(item) {
    const url = safeUrl(item.link || item.guid);
    const date = String(item.pubDate || "").slice(0, 10);
    const title = decodeEntities(item.title);
    if (!url || !title || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;

    return {
      title,
      url,
      date,
      summary: summarize(item.description || item.content) || "Read the latest article on Medium.",
      tags: Array.isArray(item.categories)
        ? item.categories.map(cleanText).filter(Boolean).slice(0, 5)
        : [],
    };
  }

  async function fetchLive() {
    const endpoint = (CFG.apiUrl || "") + encodeURIComponent(CFG.feedUrl);
    const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Medium feed API " + response.status);

    const payload = await response.json();
    if (payload.status !== "ok" || !Array.isArray(payload.items)) {
      throw new Error("Medium feed API returned an invalid response");
    }

    let posts = payload.items.map(normalizeItem).filter(Boolean);
    posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    if (CFG.maxPosts > 0) posts = posts.slice(0, CFG.maxPosts);

    return {
      profileUrl: SNAP.profileUrl,
      fetchedAt: new Date().toISOString().slice(0, 10),
      posts,
    };
  }

  window.PortfolioLoadMedium = async function () {
    if (!CFG.liveFetch || !CFG.feedUrl || !CFG.apiUrl) return null;
    const cached = readCache();
    if (cached) return cached;

    try {
      const data = await fetchLive();
      if (!data.posts.length) return null;
      writeCache(data);
      return data;
    } catch (e) {
      console.warn("[portfolio] Medium live fetch failed - using snapshot.", e.message);
      return null;
    }
  };
})();