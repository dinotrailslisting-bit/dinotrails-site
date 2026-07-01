# ELI5 — Dino Trails Site

_Explain-Like-I'm-5 overview of what this project is, what it's for, and a feature checklist you can verify item-by-item. Every checked box below was confirmed against the real code on 2026-07-01._

---

## 1. What it is

This is a **password-protected marketing website for a real-estate listing** — the "Dino Trails Getaway," an 80-guest group-hospitality compound for sale in Jensen, Utah, near Dinosaur National Monument (list price $1,950,000). It's a plain static website (hand-written HTML, one CSS file, one JavaScript file — no framework, no server, no database). You put in a password, and then you can browse pages of photos, financials, FAQs, guest reviews, and an area guide, and send an inquiry through a contact form. It's built to be dropped onto Cloudflare Pages (or any static host) and handed to a buyer.

## 2. Goals

- Give serious prospects a **private, polished listing presentation** they reach with a shared password (not open to the public web).
- Tell the investment story across focused pages: the property, the **numbers** (revenue, cap rate), the **upside/vision**, **group-rental** appeal, **guest reviews**, and a local **area guide**.
- Capture leads by letting a prospect **submit a contact form** that emails Stockton (via Formspree), with no back-end to run.
- Stay **cheap and portable**: pure static files that any static host can serve, easy to hand off to a buyer along with the accounts.

## 3. How to run / use it

- **No build step is needed** to view the site — it's static HTML. Open `index.html` in a browser, or serve the folder with any static server (e.g. `npx serve .`) and visit `index.html`.
- The password is set in `js/main.js` (`const PASS = 'SignedListing'`). Enter it in the gate to unlock; the unlock is remembered for the browser session (`sessionStorage`), and a "Lock" button re-locks it.
- The contact form on the home page posts to a **Formspree** endpoint (`https://formspree.io/f/mdabnzer`); submissions go to whatever inbox that Formspree form is wired to.
- `package.json` only exists for the one-off handoff-document generator (`build_handoff_doc.js`, which uses the `docx` package); it is **not** needed to run the website. That file, `node_modules/`, and `package.json` are gitignored.
- Deployment target is a static host such as Cloudflare Pages; `_headers` sets security + caching headers for that host.

---

## Feature checklist (verify each one)

Legend: `[x]` = confirmed present in code on 2026-07-01. `[ ]` = could not confirm / needs a human check (with note).

### Access & shell
- [x] **Password gate** on every page — overlay asks for a password before showing content (`js/main.js` PASS gate + `#password-gate` markup present in all 8 HTML pages).
- [x] **Session-remembered unlock** — once unlocked, stays unlocked for the browser session via `sessionStorage` key `dtg_auth` (`unlock()`/session check in `js/main.js`).
- [x] **"Lock" button** re-locks the site and clears the session (`#gate-logout` + `lock()` in `js/main.js`).
- [x] **Preview/dev banner** appears after unlock (`#dev-banner` element + `banner.classList.add('visible')`).
- [x] **Responsive mobile nav** — hamburger toggle opens/closes the menu and closes on link click (`.nav-toggle` / `.nav-links` handlers in `js/main.js`).
- [x] **Sticky navbar shadow on scroll** — navbar gets a `scrolled` class past 20px (`#navbar` scroll listener).
- [x] **Scroll fade-in animations** — elements with `.fade-in` reveal on scroll via `IntersectionObserver` (164 `fade-in` uses across the pages).

### Pages (8 total, all sharing the gate + nav + `js/main.js`)
- [x] **Home / listing overview** (`index.html`) — headline, price ($1,950,000), overview and location content, contact form.
- [x] **Photo gallery** (`gallery.html`) — 15 real images under `images/gallery/01–15.jpg`.
- [x] **FAQ** (`faq.html`) — categorized questions (Property, Financials, Market, Financing, Acquisition Process).
- [x] **Investment & Acquisition** (`investment.html`) — financial/stat/table content (revenue, cap rate).
- [x] **Vision & Upside** (`vision.html`).
- [x] **Group Rentals & Reunions** (`groups.html`) — group/reunion/capacity content.
- [x] **Guest Reviews & Ratings** (`reviews.html`) — review-card / star-rating content.
- [x] **Area Guide** (`area-guide.html`) — things to do near Dinosaur National Monument.

### Gallery features
- [x] **Category filter tabs** — All / Exterior & Grounds / Interior / Amenities filter items by `data-category` (`.gallery-tab` handler + `data-cat`/`data-category` markup in `gallery.html`).
- [x] **Lightbox viewer** — click a photo to open a full-screen lightbox with caption and counter (`#lightbox`, `#lb-img`, `#lb-caption`, `#lb-counter` present; `show()`/`close()` in `js/main.js`).
- [x] **Lightbox prev/next + keyboard nav** — arrows, Escape to close, ArrowLeft/ArrowRight to navigate, click-backdrop to close (`#lb-prev`/`#lb-next` + keydown handler).
- [x] **Lazy-loaded gallery images** — `loading="lazy"` on gallery `<img>` tags.

### FAQ features
- [x] **FAQ category switcher** — buttons swap which `.faq-section` is visible (`.faq-cat-btn` handler + `#faq-<cat>` sections).
- [x] **Accordion questions** — click a question to expand its answer; opening one closes the others in that list (`.faq-question` handler toggling `.open`).

### Lead capture
- [x] **Contact form on home page** wired to Formspree (`action="https://formspree.io/f/mdabnzer"` in `index.html`).
- [x] **AJAX submit with inline success + no page reload** — JS intercepts submit, shows `#form-success`, disables the button, handles errors (`contact-form` handler in `js/main.js`).
- [ ] **Form actually delivers to a monitored inbox** — ⚠ not confirmed from code alone; requires sending a real test message and checking the destination inbox (this exact check is already an open Human/Blocker item in `TODO.md`).

### Hosting / SEO / hardening
- [x] **Social/SEO meta tags** — `description`, Open Graph title/description/image/type on the home page (`index.html` head), plus an `images/og-image.jpg`.
- [x] **Security + cache headers file** for static host — `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and long-cache rules for css/js/images (`_headers`).
- [ ] **Live at a custom domain** — ⚠ not confirmed; no domain is wired in the repo, and "register/point a custom domain + map in Cloudflare Pages" is an open ⛔ blocker in `TODO.md`.

---

## Findings summary

The site is a complete, self-contained static listing microsite. **Every code-level feature in the checklist was verified directly in the source** (`index.html` + 7 sibling pages, `js/main.js`, `css/styles.css` with 32 `@media` blocks for responsiveness, `_headers`, and the `images/gallery/` folder of 15 photos). The JavaScript behaviors (password gate, mobile nav, scroll effects, gallery lightbox + tabs, FAQ accordion + category switch, AJAX contact form) each have matching HTML hooks on the pages that use them, so they are wired correctly.

Two items are intentionally left **unchecked** because they cannot be proven from the code and depend on external state — (1) whether the Formspree contact form actually lands in a monitored inbox, and (2) whether the site is live on a custom domain. Both already exist as open items under `## 🧑 Human / Blockers` in `TODO.md`. Nothing in the code appears broken.

_Password of note: the access password is `SignedListing`, hard-coded in `js/main.js` (client-side gate — presentation privacy, not real security)._
