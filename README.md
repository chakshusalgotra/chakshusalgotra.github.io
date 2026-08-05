# Chakshu Salgotra — Portfolio

A world-class, single-page developer portfolio built with **zero dependencies** —
just semantic HTML, modern CSS, and vanilla JavaScript. Data is sourced from a
résumé and a snapshot of the GitHub public API.

> Live data subject: **Chakshu Salgotra**, Data Engineer · ETL/ELT & cloud data platforms.

---

## ✨ Sections

| Section | What it shows |
| --- | --- |
| **Nav** | Glassmorphism sticky bar, gradient monogram logo, theme toggle, résumé download, active-section highlighting, mobile slide-down drawer. |
| **Hero** | Full-viewport animated gradient-mesh + floating particles, typewriter cycling job titles, real stats bar (years · projects · repos · stars), scroll progress + scroll indicator. |
| **About** | GitHub avatar with gradient ring, live profile chips, location + socials, three bio paragraphs, "What I bring" strengths grid, soft-skill chips, pulsing availability badge. |
| **Skills** | Category filter tabs (All / Languages / Frameworks / Databases / DevOps / Tools), Devicon-powered skill cards with first-letter fallback, color-coded by category, staggered scroll reveal. |
| **Experience** | Vertical timeline that draws in on scroll, alternating cards, calculated durations, impact bullets, color-coded tech pills, pulsing dot on the current role. |
| **Projects** | Featured repo hero with language-breakdown bar, plus a bento grid of repos with stars/forks/relative-time, topic tags, and filter bar (All / Most Stars / Recent / by language). |
| **Education & Achievements** | Education cards on the left; real, metric-driven achievements on the right (in place of certifications, which the résumé did not list). |
| **Writing** | Latest Medium posts fetched automatically from the RSS feed as cards (title, summary, tags, date), with a static offline fallback and a "Read more on Medium" CTA. |
| **Contact** | Clickable contact-method cards (Email · LinkedIn · GitHub · Medium · Phone) + a pure-HTML/CSS form with floating labels, inline validation, and a `mailto:` submit. |
| **Footer** | Brand, quick nav, social icons (GitHub · LinkedIn · LeetCode · Medium · Email), dynamic copyright year, and a back-to-top button. |

---

## 🗂 Project structure

```
.
├── index.html            # Markup shell, <head> meta, OG/Twitter, JSON-LD
├── css/
│   ├── reset.css         # Modern CSS reset
│   ├── variables.css     # Design tokens + light theme
│   ├── animations.css    # Keyframes & reveal states
│   └── main.css          # Component & layout styles
├── js/
│   ├── data.js           # ← Résumé data + GitHub fallback snapshot + config
│   ├── github.js         # Live GitHub API fetch (auto-updates repos) + caching
│   ├── medium.js         # Live Medium RSS fetch (auto-updates posts) + caching
│   ├── render.js         # DOM rendering functions
│   ├── animations.js     # Scroll observers, typewriter, count-up, ripple
│   └── main.js           # Init, theme, nav, filters, form, cursor, live refresh
├── assets/
│   └── icons/logo.svg     # Monogram logo (icons are inline SVG in render.js)
├── resume.pdf            # Downloadable résumé (linked from the nav)
└── README.md
```

---

## 🎨 Customizing colors & design

All design tokens live in [`css/variables.css`](css/variables.css). The default
is a PixelOS-style **cream** theme (under `:root`); a warm **charcoal** dark theme
lives under `[data-theme="dark"]`. Key tokens:

```css
--bg-primary: #fbf4d6;   /* warm cream canvas        */
--accent-1:   #2e7d54;   /* readable green "ink"     */
--accent-2:   #b5791c;   /* warm gold ink            */
--accent-3:   #ebd27a;   /* butter   — hero blob     */
--accent-4:   #a7d9b5;   /* mint     — hero blob     */
--accent-5:   #d9c24e;   /* olive    — hero blob     */
--gradient:   linear-gradient(135deg, #f4d65b, #e8b63c);  /* yellow button fill */
--bg-card / --text-primary / --radius-* / --space-* / --shadow-* / --ease-*
```

Re-skin the whole site by editing these — every glow, shadow, blob, and gradient
derives from the accents (the matching `--accent-N-rgb` channel tokens feed the
translucent fills). Headings and highlighted keywords use a **solid** accent color
(`--accent-1`) — there are no text gradients. The hero uses four soft pastel **blobs**
(butter, white, olive, mint) that morph and drift; on cream they blend with
`multiply` for defined shapes, on the dark theme they become luminous `screen` glows.

**Theme behavior:** the cream theme is the default. The site honors the visitor's
OS `prefers-color-scheme` (a dark OS shows the charcoal theme), and once they click
the toggle the choice is saved to `localStorage` and takes precedence.

---

## 📝 Updating your data

Everything the site renders comes from [`js/data.js`](js/data.js):

- **`RESUME`** — name, title, contact, links, bio, `experience[]`, `skills[]`
  (each with a `category`, `level`, and optional Devicon class), `education[]`,
  and `achievements[]`.
- **`GITHUB`** — a snapshot of the profile and repos. This is now an **offline
  fallback**: by default the site fetches your repos **live** at runtime (see below),
  but if the API is unreachable or rate-limited it renders this snapshot instead.
  Curated `summary` / `topics` / `languages` here are also reused for matching live
  repos so known projects keep their hand-written blurbs.
- **`BLOG`** — Medium profile URL + a fallback `posts[]` snapshot used when the
  live feed is unavailable.
- **`BLOG_CONFIG`** — automatic Medium RSS fetching, post limit, and cache settings.
- **`CONTACT`** — set `endpoint` to a [Formspree](https://formspree.io) or
  [Getform](https://getform.io) URL (e.g. `https://formspree.io/f/abcdwxyz`) to receive
  contact-form submissions **directly in your inbox**. Leave it `""` to use the
  `mailto:` fallback (opens the visitor's email client). The form shows inline
  success/error states and a "Sending…" button while posting.

### 🔄 Live GitHub repos (auto-updates)

The Projects section fetches your public repos from the GitHub API on each visit, so
**new repos appear automatically — no snapshot editing needed.** It's configured by
`GITHUB_CONFIG` in [`js/data.js`](js/data.js) and implemented in
[`js/github.js`](js/github.js):

```js
const GITHUB_CONFIG = {
  username: "chakshusalgotra",
  liveFetch: true,       // false → use only the static GITHUB snapshot
  includeForks: false,   // true  → also show forked repos
  maxRepos: 0,           // 0 = show ALL repos; or cap to a number
  cacheMinutes: 30,      // reuse a fetched result for this long (per session)
  featuredRepo: "my-macros", // pin the hero card; "" → newest repo is featured
};
```

How it works:
- Fetches `GET /users/<user>` and `GET /users/<user>/repos?sort=pushed&per_page=100`.
- Filters forks (unless `includeForks`), sorts **newest activity first**, and renders
  them all. The most recent repo becomes the featured card.
- Results are cached in `sessionStorage` for `cacheMinutes` to respect GitHub's
  unauthenticated rate limit (60 req/hr).
- Two API calls per refresh — no token required (public data, CORS-enabled).

> Want all repos including forks? Set `includeForks: true`. Want to go back to a
> fixed snapshot? Set `liveFetch: false`.

### 🔄 Live Medium posts (auto-updates)

The Writing section fetches the Medium RSS feed automatically during page startup,
so newly published posts appear without editing `BLOG.posts`. Medium does not expose
its RSS feed with browser CORS headers, so [`js/medium.js`](js/medium.js) reads it
through the configured RSS-to-JSON endpoint and normalizes each item for the cards.

```js
const BLOG_CONFIG = {
  username: "chakshu-salgotra",
  feedUrl: "https://medium.com/feed/@chakshu-salgotra",
  apiUrl: "https://api.rss2json.com/v1/api.json?rss_url=",
  liveFetch: true,       // false → use only the static BLOG snapshot
  maxPosts: 6,           // latest posts to display; 0 = all feed items
  cacheMinutes: 30,      // reuse a fetched result within the browser session
};
```

Results are sorted newest-first and cached in `sessionStorage`. If the feed, proxy,
or network is unavailable, the site keeps the static `BLOG.posts` snapshot already
rendered on screen.

> Skill icons use the [Devicon](https://devicon.dev) class names (e.g.
> `devicon-python-plain colored`). Any skill with `icon: null` automatically falls
> back to a colored first-letter avatar.

---

## 🚀 Deployment

The site is 100% static — no build step. Host the folder anywhere.

### GitHub Pages

1. Push this folder to a repo (e.g. `chakshusalgotra.github.io` for a user site, or any
   repo for a project site).
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source = Deploy from a branch**.
4. Choose branch `main` and folder `/ (root)`, then **Save**.
5. Your site appears at `https://<username>.github.io/` (user site) or
   `https://<username>.github.io/<repo>/` (project site) within a minute.

> If you use a project site, update the `<link rel="canonical">` and the
> `og:url` / `twitter` URLs in `index.html` to match the subpath.

### Vercel

1. Install the CLI: `npm i -g vercel` (or use the dashboard).
2. From the project folder run `vercel` and accept the defaults — no framework,
   no build command, output directory = `./`.
3. Run `vercel --prod` to promote to production.
   Dashboard alternative: **Add New → Project → Import** the repo →
   Framework Preset **Other** → **Deploy**.

### Netlify

1. **Drag-and-drop:** zip or drag the project folder onto
   [app.netlify.com/drop](https://app.netlify.com/drop).
2. **Git-based:** **Add new site → Import an existing project**, pick the repo,
   leave **Build command** empty and **Publish directory** = `.`, then **Deploy**.

---

## ♿ Accessibility & SEO

- Semantic landmarks (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`).
- Skip-to-content link, ARIA labels on icon-only buttons, keyboard-navigable filter tabs.
- Custom `:focus-visible` rings; full `prefers-reduced-motion` support.
- Complete meta tags, Open Graph + Twitter cards, canonical URL, and JSON-LD `Person` schema.

---

## ⚙️ Run locally

Any static server works, for example:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Built with ❤️ — open source on [GitHub](https://github.com/chakshusalgotra).
