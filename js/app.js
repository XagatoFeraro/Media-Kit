/* ═══════════════════════════════════════════════════════════
   app.js
   Logic: renders every section from config.js, plus carousel, share sheet, copy/mail/print helpers. Rarely needs edits.
   ═══════════════════════════════════════════════════════════ */

"use strict";

/* ───────── 4.1 Utilities ───────── */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const inr = n => "₹" + Number(n).toLocaleString("en-IN");

/** Run fn; if it throws, log it and keep the rest of the page alive. */
function safe(label, fn, fallback) {
  try { return fn(); } catch (err) { console.error(`[media-kit] "${label}" failed:`, err); return fallback; }
}
/** Image paths are used as-is (a file in assets/images/ or a full web link). */
const imgSrc = path => path || "";
const img = (key, alt, attrs = "") => { const s = imgSrc(key); return s ? `<img src="${s}" alt="${esc(alt)}" ${attrs}>` : ""; };

const ICONS = {
  mail:  '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
  ig:    '<rect x="3" y="3" width="18" height="18" rx="5.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".7" fill="currentColor"/>',
  copy:  '<rect x="9" y="9" width="11" height="11" rx="3"/><path d="M5 15V8a3 3 0 0 1 3-3h7"/>',
  share: '<path d="M12 15V3M8 7l4-4 4 4"/><path d="M8 11H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-2"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  heart: '<path d="M12 20.5s-7.5-4.6-9-9.2C2 8 4 5 7.2 5c2 0 3.6 1 4.8 2.7C13.2 6 14.8 5 16.8 5 20 5 22 8 21 11.3c-1.5 4.6-9 9.2-9 9.2z"/>',
  pdf:   '<path d="M12 4v11m-4-4 4 4 4-4"/><path d="M5 19h14"/>',
  link:  '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  arrow: '<path d="M7 17 17 7M8 7h9v9"/>',
  up:    '<path d="M12 19V5M6 11l6-6 6 6"/>',
  eye:      '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  users:    '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M17 14.2c2.5.3 4.2 2.4 4.2 4.8"/>',
  userplus: '<circle cx="10" cy="8" r="3.5"/><path d="M3.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5"/><path d="M19 8v6M16 11h6"/>',
  comment:  '<path d="M3.2 20.8l1.1-4A9.2 9.2 0 1 1 8 19.7z"/>',
  send:     '<path d="M21.5 3 10.2 14.3"/><path d="M21.5 3 14.8 21l-4.6-6.7L3.5 9.7z"/>',
  play: '<path d="m8 5 11 7-11 7z" fill="currentColor" stroke="none"/>',
  home: '<path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-6h6v6"/>',
  bookmark: '<path d="M6 3.5h12v17l-6-4.5-6 4.5z"/>',
};
const icon = n => ICONS[n] ? `<svg class="ic" aria-hidden="true" viewBox="0 0 24 24">${ICONS[n]}</svg>` : "";

/* Derived values used in several places */
const P = () => CONFIG.profile;
const IG_LINK = () => `href="${esc(P().instagramUrl)}" target="_blank" rel="noopener noreferrer"`;
const mailto = (subject, body = "") => `mailto:${P().email}?subject=${encodeURIComponent(subject)}${body ? "&body=" + encodeURIComponent(body) : ""}`;
const shareUrl = () => CONFIG.share.url || (() => { try { return location.href; } catch { return ""; } })();

/* Small HTML helpers */
const head = s => `<p class="ey">${esc(s.eyebrow)}</p><h2>${esc(s.title)} <span class="gt">${esc(s.accent)}</span></h2>`;
const section = (id, inner, cls = "") => `<section id="${id}" class="rv ${cls}">${inner}</section>`;

/* Where each hero photo sits, by number of photos (1–5). Edit a string to nudge a photo. */
const HERO_SLOTS = {
  1: ["left:21%;top:8%;--rot:-3deg"],
  2: ["left:0;top:4%;--rot:-6deg", "right:0;bottom:6%;--rot:5deg;z-index:2"],
  3: ["left:0;top:2%;--rot:-6deg", "right:0;top:20%;--rot:5deg;z-index:2", "left:10%;bottom:0;--rot:-2deg;z-index:1"],
  4: ["left:0;top:2%;--rot:-6deg", "right:0;top:16%;--rot:5deg;z-index:2", "left:6%;bottom:0;--rot:-2deg;z-index:1", "right:2%;bottom:-2%;width:38%;--rot:4deg;z-index:3"],
  5: ["left:0;top:2%;--rot:-6deg", "right:0;top:14%;--rot:5deg;z-index:2", "left:8%;bottom:0;--rot:-2deg;z-index:1", "right:2%;bottom:-2%;width:36%;--rot:4deg;z-index:3", "left:-3%;top:42%;width:34%;--rot:-9deg;z-index:3"],
};

/* ───────── 4.2 Section renderers (one per CONFIG.layout id) ───────── */
const RENDER = {

  hero() {
    const H = CONFIG.hero, photos = (H.photos || []).slice(0, 5), slots = HERO_SLOTS[photos.length] || [];
    return `<section class="hero${photos.length ? "" : " solo"}" id="home" tabindex="-1">
      <div>
        <p class="ey">${esc(P().kitLabel)}</p>
        <h1><span class="ln1">${esc(H.headline[0])}</span><br><span class="ln1" style="--d:.2s"><span class="gt">${esc(H.headline[1])}</span></span></h1>
        <p class="lead">${esc(H.lead).replace(esc(P().name), `<strong class="nm">${esc(P().name)}</strong>`)}</p>
        <div class="tags">${H.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>
        <div class="cta">
          <a class="btn w" href="#contact" data-action="collab">${icon("heart")}${esc(H.cta)}</a>
          <a class="btn g" href="#numbers" aria-label="View audience and follower statistics">${icon("eye")}<span class="bt">View audience</span></a>
          <a class="btn g" ${IG_LINK()} aria-label="Instagram ${esc(P().instagramHandle)}">${icon("ig")}<span class="bt">${esc(P().instagramHandle)}</span></a>
          <button class="btn g" type="button" data-action="share" aria-label="Share or save as PDF">${icon("share")}<span class="bt">Share</span></button>
        </div>
      </div>
      ${photos.length ? `<div class="cl">
        ${photos.map((k, i) => img(k, P().name, `style="${slots[i]};animation-delay:${(.15 + i * .2).toFixed(2)}s,${-i * 2}s"`)).join("")}
        ${(H.chips || []).slice(0, 2).map((c, i) => `<div class="fc f${i + 1}">${esc(c.value)}<small>${esc(c.label)}</small></div>`).join("")}
      </div>` : ""}
    </section>`;
  },

  numbers() {
    const cards = CONFIG.numbers.map(n => `<div class="card${n.featured ? " hot w2" : ""}">
      <div class="big" data-count="${n.value}" data-decimals="${n.decimals || 0}" data-suffix="${esc(n.suffix || "")}">${esc(Number(n.value).toLocaleString("en-IN", { minimumFractionDigits: n.decimals || 0, maximumFractionDigits: n.decimals || 0 }) + (n.suffix || ""))}</div>
      <p class="lbl il">${n.icon ? icon(n.icon) : ""}<span>${esc(n.label)}</span></p></div>`).join("");
    return section("numbers", head(CONFIG.sections.numbers) + `<div class="bento">${cards}</div>`);
  },

  work() {
    const cards = CONFIG.reels.map(r => {
      const inner = `${img(r.image, (r.brand && r.brand !== "Reel" ? r.brand + " reel" : "Instagram reel"))}<span class="br">${esc(r.brand)}</span>
        <div class="inf"><div class="v">${esc(r.views)}<small>${esc(r.viewsLabel)}</small></div>
        <div class="m">${(r.stats || []).map(s => `<span>${esc(s)}</span>`).join("")}</div></div>`;
      return r.url ? `<a class="rl" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${inner}</a>` : `<div class="rl">${inner}</div>`;
    }).join("");
    const B = CONFIG.brands;
    const pills = [`${B.names.length} brand collaborations in ${P().year}`, ...(B.highlights || [])];
    return section("work", head(CONFIG.sections.work) + `
      <div class="car" id="car" tabindex="0" role="region" aria-label="Top reels">${cards}</div>
      <div class="cnav noprint"><button type="button" id="pv" aria-label="Previous reel">‹</button><div id="dots"></div><button type="button" id="nx" aria-label="Next reel">›</button></div>
      <div class="pills">${pills.map(p => `<span>${esc(p)}</span>`).join("")}</div>
      <div class="mq" aria-label="Brands I’ve worked with"><div class="tk">${B.names.map(n => `<span>${esc(n)}</span>`).join("")}${B.names.map(n => `<span class="dup" aria-hidden="true">${esc(n)}</span>`).join("")}</div></div>`);
  },

  look() {
    const photos = CONFIG.gallery.map(k => img(k, P().name + " photo", 'loading="lazy"')).join("");
    return section("look", head(CONFIG.sections.look) + `<div class="mrq" id="gallery">${photos}</div>`);
  },

  audience() {
    const A = CONFIG.audience;
    const cities = A.cities.map((city, index) => `
      <article class="city-card" style="--city-delay:${index * 90}ms">
        <div class="city-map">
          ${img(city.map, `Illustrated street map of ${city.name}`, 'loading="lazy"')}
          <span class="city-rank">${String(index + 1).padStart(2, "0")}</span>
          <span class="city-pin" aria-hidden="true"></span>
        </div>
        <div class="city-meta"><h3>${esc(city.name)}</h3><p>${esc(city.vibe || "A top audience city")}</p></div>
      </article>`).join("");
    return section("audience", head(CONFIG.sections.audience) + `
      <div class="city-grid" aria-label="Top audience cities">${cities}</div>
      <p class="city-note">${esc(A.note)}</p>`);
  }

  expect() {
    return section("expect", head(CONFIG.sections.expect) + `<div class="ex">${CONFIG.expect.map(e => `<div class="card"><h3>${esc(e.title)}</h3><p>${esc(e.text)}</p></div>`).join("")}</div>`);
  },

  delivery() {
    const D = CONFIG.delivery;
    return section("delivery", head(CONFIG.sections.delivery) + `
      <div class="steps">${D.steps.map((s, i) => `<div class="card"><span class="num gt">${String(i + 1).padStart(2, "0")}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join("")}</div>
      <div class="pills">${D.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>`);
  },

  rates() {
    const R = CONFIG.rates;
    return section("rates", head(CONFIG.sections.rates) + `
      <div class="rates">${R.items.map(r => `<div class="card rc${r.highlight ? " hot" : ""}"><div><span class="rk">${esc(r.kind)}</span><h3>${esc(r.title)}</h3></div><div class="pr">${inr(r.price)}</div></div>`).join("")}</div>
      <p class="note">${esc(R.note)}</p>
      <a class="btn g" href="${mailto(R.customSubject)}">${icon("mail")}${esc(R.customCta)}</a>`);
  },

  contact() {
    const C = CONFIG.contact;
    return `<div id="contact" class="cn rv">
      <p class="ey">${esc(CONFIG.sections.contact.eyebrow)}</p>
      <h2>${esc(CONFIG.sections.contact.title)} <span class="gt">${esc(CONFIG.sections.contact.accent)}</span></h2>
      <p class="sb">${esc(C.text)}</p>
      <div class="ls">
        <div class="li" id="emailRow"><a class="lm" href="${mailto(C.emailSubject, C.emailBody)}"><span class="ci">${icon("mail")}</span><span class="tx"><small>Email</small>${esc(P().email)}</span></a>
          <button class="cb" type="button" data-action="copy-email" aria-label="Copy email address">${icon("copy")}</button></div>
        <a class="li lm" ${IG_LINK()}><span class="ci">${icon("ig")}</span><span class="tx"><small>Instagram</small>${esc(P().instagramHandle)}</span><span class="ar">${icon("arrow")}</span></a>
      </div>
      <button class="btn w" type="button" data-action="collab">${icon("heart")}Let’s create together</button>
    </div>`;
  },
};

/* ───────── 4.3 Page chrome: nav, footer, share sheet, back-to-top ───────── */
function renderChrome() {
  const navItems = CONFIG.layout.filter(id => CONFIG.sections[id]?.nav && document.getElementById(id));
  const navLinks = `<a href="#home" data-nav-home>Home</a>${navItems.map(id => `<a href="#${id}">${esc(CONFIG.sections[id].label)}</a>`).join("")}`;
  const nav = `<nav><div>
      <a class="brand-lockup" ${IG_LINK()} aria-label="Visit Tanisha Tripathi on Instagram">
        ${icon("ig")}<b class="nh">${esc(P().name)}</b>
      </a>
      <span class="lk" id="lk"><i class="hl"></i>${navLinks}</span>
      <span class="ac">
        <button class="ib" type="button" data-action="share" aria-label="Share or save as PDF">${icon("share")}</button>
        <button class="btn w s" type="button" data-action="collab">${icon("heart")}<span>Let’s create together</span></button>
      </span></div></nav>`;
  const footer = `<footer>© ${P().year} ${esc(P().name)} · ${esc(P().city)} · Figures from ${esc(P().statsSource)}
      <div class="fl noprint"><a ${IG_LINK()}>${icon("ig")}${esc(P().instagramHandle)}</a><a href="mailto:${esc(P().email)}">${icon("mail")}${esc(P().email)}</a></div></footer>`;
  const shareSheet = `<div class="sh noprint" id="sh" hidden><div class="sc" role="dialog" aria-modal="true" aria-label="Share this media kit"><h3>Share this media kit</h3>
      <div class="sl">
        ${navigator.share ? `<button type="button" data-action="share-native">${icon("share")}Share…</button>` : ""}
        <button type="button" data-action="share-link">${icon("link")}Copy link</button>
        <button type="button" data-action="share-pdf">${icon("pdf")}Save as PDF</button>
        <button type="button" data-action="share-mail">${icon("mail")}Send by email</button>
      </div><button class="x" type="button" data-action="share-close">Close</button></div></div>`;
  const top = `<button class="totop noprint" id="toTop" type="button" data-action="top" aria-label="Back to top">${icon("up")}</button>`;
  $("#app").insertAdjacentHTML("afterbegin", nav);
  const collabDialog = `<div class="collab-modal noprint" id="collabDialog" hidden>
      <section class="collab-panel" role="dialog" aria-modal="true" aria-labelledby="collabTitle" aria-describedby="collabDescription">
        <button class="modal-close" type="button" data-action="collab-close" aria-label="Close dialog">×</button>
        <span class="modal-mark">${icon("heart")}</span>
        <p class="ey">Brand collaborations</p>
        <h2 id="collabTitle">Let’s create together.</h2>
        <p id="collabDescription">Choose how you’d like to get in touch with Tanisha.</p>
        <a class="contact-choice email-choice" href="${mailto(CONFIG.contact.emailSubject, CONFIG.contact.emailBody)}" data-action="collab-email">${icon("mail")}<span><strong>Email</strong><small>${esc(P().email)}</small></span>${icon("arrow")}</a>
        <a class="contact-choice" href="https://ig.me/m/taniisha.tripathii" target="_blank" rel="noopener noreferrer" data-action="collab-dm">${icon("ig")}<span><strong>Instagram DM</strong><small>Message on Instagram</small></span>${icon("arrow")}</a>
        <p class="modal-note">For brand partnerships, campaign enquiries and UGC.</p>
      </section>
    </div>`;
  const quickDock = `<div class="quick-dock noprint" role="navigation" aria-label="Quick navigation">
      <a href="#home" data-dock-item="home" aria-label="Back to home">${icon("home")}<span>Home</span></a>
      <a href="#numbers" data-dock-item="numbers" aria-label="View audience numbers">${icon("eye")}<span>Numbers</span></a>
      <a href="#work" data-dock-item="work" aria-label="View creator work">${icon("play")}<span>Work</span></a>
    </div>`;
  $("#app").insertAdjacentHTML("beforeend", footer + shareSheet + top + collabDialog + quickDock);
}

/* ───────── 4.4 Behaviours (each is independent + guarded) ───────── */

/** Fade-in on scroll, count-up numbers, animated bars, staggered cards. */
function initSectionNavigation() {
  const nav = $("#lk");
  const navLinks = nav ? $$("a[href^='#']", nav) : [];
  const dock = $(".quick-dock");
  const dockLinks = dock ? $$("a[data-dock-item]", dock) : [];
  const controls = [...navLinks, ...dockLinks];
  const sections = $$("#app > section[id], #app > .cn[id]");
  if (!controls.length || !sections.length) return;

  let navigationTarget = "";
  let settleTimer = 0;
  let frame = 0;

  const highlightPill = link => {
    if (!nav || !link) return;
    const pill = $(".hl", nav);
    if (!pill) return;
    pill.style.width = link.offsetWidth + "px";
    pill.style.transform = `translateX(${link.offsetLeft}px)`;
    pill.classList.add("show");
  };

  const setActive = id => {
    controls.forEach(link => {
      const active = link.getAttribute("href") === "#" + id;
      link.classList.toggle("on", active);
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    highlightPill(navLinks.find(link => link.getAttribute("href") === "#" + id));
  };

  const finishNavigation = () => {
    if (!navigationTarget) return;
    navigationTarget = "";
    clearTimeout(settleTimer);
    updateFromScroll();
  };

  controls.forEach(link => link.addEventListener("click", event => {
    const id = link.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    navigationTarget = id;
    clearTimeout(settleTimer);
    setActive(id);
    history.replaceState(null, "", "#" + id);
    const headerHeight = $("nav")?.getBoundingClientRect().height || 0;
    const top = target.getBoundingClientRect().top + scrollY - headerHeight - 18;
    window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? "auto" : "smooth" });
    settleTimer = setTimeout(finishNavigation, reduceMotion ? 0 : 1800);
  }));

  if (nav) {
    navLinks.forEach(link => link.addEventListener("mouseenter", () => highlightPill(link)));
    nav.addEventListener("mouseleave", () => highlightPill(navLinks.find(link => link.classList.contains("on"))));
  }

  const updateFromScroll = () => {
    if (navigationTarget) {
      setActive(navigationTarget);
      clearTimeout(settleTimer);
      settleTimer = setTimeout(finishNavigation, 180);
      return;
    }
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const line = Math.min(innerHeight * 0.32, 240);
      let current = sections[0];
      for (const item of sections) {
        if (item.getBoundingClientRect().top <= line) current = item;
        else break;
      }
      if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4) {
        current = sections[sections.length - 1];
      }
      setActive(current?.id || "");
    });
  };

  addEventListener("scroll", updateFromScroll, { passive: true });
  addEventListener("scrollend", finishNavigation, { passive: true });
  addEventListener("resize", updateFromScroll, { passive: true });
  updateFromScroll();
}

function initReveal() {
  const reveal = el => {
    el.classList.add("on");
    $$(".card", el).forEach((c, i) => { c.style.transitionDelay = i * 80 + "ms"; setTimeout(() => c.style.transitionDelay = "", 1500 + i * 80); });
    $$("[data-w]", el).forEach(b => b.style.width = b.dataset.w + "%");
    $$("[data-count]", el).forEach(countUp);
  };
  if (!("IntersectionObserver" in window)) return $$(".rv").forEach(reveal);
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  $$(".rv").forEach(el => io.observe(el));
}
function countUp(el) {
  const to = +el.dataset.count, dec = +el.dataset.decimals, suf = el.dataset.suffix;
  if (reduceMotion || isNaN(to)) return;
  const t0 = performance.now(), fmt = v => v.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  (function tick(t) { const p = Math.min(1, (t - t0) / 1300); el.textContent = fmt(to * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(tick); })(t0);
}

/** Reels: 3D coverflow carousel with arrows, dots, swipe, keyboard and autoplay. */
function initCarousel() {
  const car = $("#car"), dots = $("#dots"); if (!car || !car.children.length) return;
  const cards = [...car.children]; let cur = 0, hold = false, visible = false, holdT;
  cards.forEach((_, i) => { const d = document.createElement("i"); d.onclick = () => go(i); dots.append(d); });
  const fx = () => {
    const c = car.getBoundingClientRect(), mid = c.left + c.width / 2; let best = 0, bd = 1e9;
    cards.forEach((r, i) => {
      const b = r.getBoundingClientRect(), d = (b.left + b.width / 2 - mid) / b.width, a = Math.abs(d);
      r.style.setProperty("--s", (1 - Math.min(.14, a * .1)).toFixed(3));
      r.style.setProperty("--o", (1 - Math.min(.55, a * .3)).toFixed(3));
      r.style.setProperty("--r", (-Math.sign(d) * Math.min(28, a * 18)).toFixed(1) + "deg");
      if (a < bd) { bd = a; best = i; }
    });
    cur = best; [...dots.children].forEach((d, i) => d.classList.toggle("on", i === best));
  };
  function go(i) { const r = cards[(i + cards.length) % cards.length]; car.scrollTo({ left: r.offsetLeft - (car.clientWidth - r.offsetWidth) / 2, behavior: reduceMotion ? "auto" : "smooth" }); }
  car.addEventListener("scroll", () => requestAnimationFrame(fx), { passive: true });
  addEventListener("resize", fx);
  $("#pv").onclick = () => go(cur - 1); $("#nx").onclick = () => go(cur + 1);
  car.addEventListener("keydown", e => { if (e.key === "ArrowRight") { e.preventDefault(); go(cur + 1); } if (e.key === "ArrowLeft") { e.preventDefault(); go(cur - 1); } });
  ["pointerenter", "touchstart", "focusin"].forEach(t => car.addEventListener(t, () => { clearTimeout(holdT); hold = true; }, { passive: true }));
  ["pointerleave", "touchend", "focusout"].forEach(t => car.addEventListener(t, () => { clearTimeout(holdT); holdT = setTimeout(() => hold = false, 2500); }, { passive: true }));
  if ("IntersectionObserver" in window) new IntersectionObserver(e => visible = e[0].isIntersecting, { threshold: .5 }).observe(car);
  if (CONFIG.features.carouselAutoplay && !reduceMotion) setInterval(() => { if (visible && !hold && !document.hidden) go(cur + 1); }, CONFIG.features.carouselDelayMs);
  fx();
}

/** Photo wall: two counter-scrolling rows + full-screen viewer. */
function initGallery() {
  const box = $("#gallery"); if (!box) return;
  const imgs = [...box.children]; if (!imgs.length) return;
  const mid = Math.ceil(imgs.length / 2); box.innerHTML = "";
  [imgs.slice(0, mid), imgs.slice(mid)].filter(g => g.length).forEach((g, k) => {
    const row = document.createElement("div"); row.className = "rw" + (k ? " rev" : "");
    g.forEach(x => { x.tabIndex = 0; x.setAttribute("role", "button"); row.append(x); });
    g.forEach(x => { const c = x.cloneNode(); c.setAttribute("aria-hidden", "true"); c.alt = ""; c.removeAttribute("tabindex"); c.removeAttribute("role"); row.append(c); });   // duplicate for a seamless loop
    box.append(row);
  });
  box.addEventListener("click", e => { if (e.target.tagName === "IMG") openViewer(e.target.src); });
  box.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.tagName === "IMG") { e.preventDefault(); openViewer(e.target.src); } });
}
function openViewer(src) {
  const lb = document.createElement("div"); lb.className = "lb"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-label", "Photo viewer");
  lb.innerHTML = `<img alt="Photo"><button type="button" class="lbx" aria-label="Close photo">×</button>`;
  $("img", lb).src = src; lb.onclick = closeViewer; document.body.append(lb); document.body.style.overflow = "hidden"; $("button", lb).focus();
}
function closeViewer() { $(".lb")?.remove(); document.body.style.overflow = ""; }

/** Scroll progress bar, hero parallax/tilt, back-to-top visibility. */
function initScroll() {
  const pg = $("#pg"), cl = $(".cl"), top = $("#toTop"); let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight, y = scrollY;
    pg.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    cl?.style.setProperty("--py", (-y * .07) + "px");
    top?.classList.toggle("show", y > innerHeight * .8);
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
  if (cl && !reduceMotion) $(".hero").addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    cl.style.setProperty("--ry", ((e.clientX / innerWidth - .5) * 10) + "deg");
    cl.style.setProperty("--rx", (-(e.clientY / innerHeight - .5) * 8) + "deg");
  });
}

/* ───────── 4.5 Feedback helpers: toast, copy, confetti, scrolling ───────── */
let toastTimer;
/** toast("text") or toast("text", [{label, run}, …]) */
function toast(msg, actions = []) {
  const t = $("#toast"); if (!t) return;
  actions = [].concat(actions || []);
  t.innerHTML = `<span>${esc(msg)}</span>` + actions.map((a, i) => `<button type="button" data-i="${i}">${esc(a.label)}</button>`).join("");
  $$("button", t).forEach(b => b.onclick = () => { actions[b.dataset.i].run(); t.classList.remove("show"); });
  t.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), actions.length ? 8000 : 2800);
}
async function copyText(text, okMsg = "Copied ✓") {
  let ok = false;
  try { await navigator.clipboard.writeText(text); ok = true; }
  catch { try { const a = document.createElement("textarea"); a.value = text; a.readOnly = true; a.style.cssText = "position:fixed;opacity:0"; document.body.append(a); a.select(); ok = document.execCommand("copy"); a.remove(); } catch {} }
  toast(ok ? okMsg : "Couldn’t copy automatically. Please copy it manually: " + text);
  return ok;
}
function scrollToId(id) {
  const el = document.getElementById(id); if (!el) return false;
  el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" }); return true;
}
function confetti(x, y) {
  if (!CONFIG.features.confetti || reduceMotion) return;
  const colors = ["#f0905f", "#d6506a", "#a8408a", "#ffd166", "#ff7eb3", "#7be0ad"];
  for (let i = 0; i < 22; i++) {
    const p = document.createElement("i"), s = 6 + Math.random() * 7, a = Math.random() * Math.PI * 2, d = 70 + Math.random() * 130;
    p.style.cssText = `position:fixed;z-index:80;pointer-events:none;left:${x}px;top:${y}px;width:${s}px;height:${s * (Math.random() > .5 ? 1 : .45)}px;border-radius:${Math.random() > .5 ? "50%" : "2px"};background:${colors[i % colors.length]}`;
    document.body.append(p);
    p.animate([{ transform: "translate(0,0) rotate(0)", opacity: 1 }, { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d + 60}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }],
      { duration: 900 + Math.random() * 500, easing: "cubic-bezier(.2,.8,.3,1)" }).onfinish = () => p.remove();
  }
}
/** Click position (keyboard "clicks" report 0,0, so use the element centre instead). */
const clickPoint = (e, el) => { if (e.clientX || e.clientY) return [e.clientX, e.clientY]; const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

/** Opens the visitor's email app. If nothing seems to happen (no mail app, blocked in a preview, etc.)
    it offers Gmail in a new tab or copying the address, so the click never feels dead. */
function openMail(href) {
  let to = "", subject = "", body = "";
  try { const u = new URL(href); to = decodeURIComponent(u.pathname); subject = u.searchParams.get("subject") || ""; body = u.searchParams.get("body") || ""; } catch {}
  let left = false; const mark = () => left = true;
  addEventListener("blur", mark, { once: true }); document.addEventListener("visibilitychange", mark, { once: true });
  try { location.href = href; } catch (err) { console.warn("[media-kit] mailto blocked:", err); }
  setTimeout(() => {
    removeEventListener("blur", mark); document.removeEventListener("visibilitychange", mark);
    if (left) return;
    const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast("No email app opened?", [
      { label: "Open Gmail", run: () => window.open(gmail, "_blank", "noopener") },
      to ? { label: "Copy address", run: () => copyText(to, "Email copied ✓") } : { label: "Copy link", run: () => copyText(shareUrl(), "Link copied ✓") },
    ]);
  }, 1600);
}
/** Opens the print dialog (used for "Save as PDF"). If the browser blocks it, explains what to do instead. */
function printPage() {
  let opened = false; const mark = () => opened = true;
  ["beforeprint", "blur"].forEach(ev => addEventListener(ev, mark, { once: true }));
  setTimeout(() => { try { print(); } catch (err) { console.warn("[media-kit] print blocked:", err); } }, 250);
  setTimeout(() => {
    if (opened) return;
    toast("The print window didn’t open here. Press Ctrl/Cmd + P and choose “Save as PDF”.", [{ label: "Open in new tab", run: () => window.open(shareUrl(), "_blank", "noopener") }]);
  }, 1600);
}

/* ───────── 4.6 Actions: everything a button with data-action="…" does ───────── */
const sheet = { open() { const s = $("#sh"); if (s) { s.hidden = false; $("button", s)?.focus(); } }, close() { const s = $("#sh"); if (s) s.hidden = true; } };
let previousFocus = null;
const collab = {
  open() { const dialog = $("#collabDialog"); if (!dialog) return; previousFocus = document.activeElement; dialog.hidden = false; document.body.classList.add("modal-open"); $(".contact-choice", dialog)?.focus(); },
  close() { const dialog = $("#collabDialog"); if (!dialog || dialog.hidden) return; dialog.hidden = true; document.body.classList.remove("modal-open"); previousFocus?.focus?.(); }
};
const ACTIONS = {
  collab(e, el) { e.preventDefault(); collab.open(); },
  "collab-close": () => collab.close(),
  "collab-email": () => collab.close(),
  "collab-dm": () => collab.close(),
  /* "Let’s collab" (contact card): confetti, then the normal mailto link opens the email app. */
  email(e, el) { confetti(...clickPoint(e, el)); },
  "copy-email": (e, el) => copyText(P().email, "Email copied ✓").then(ok => { if (!ok) return; el._h ??= el.innerHTML; el.innerHTML = icon("check"); clearTimeout(el._t); el._t = setTimeout(() => el.innerHTML = el._h, 1700); }),
  share: () => sheet.open(),
  "share-close": () => sheet.close(),
  async "share-native"() {
    try { await navigator.share({ title: CONFIG.share.title, url: shareUrl() }); }
    catch (err) { if (err.name !== "AbortError") toast("Sharing isn’t available here. Try “Copy link” instead."); }
    sheet.close();
  },
  "share-link": () => copyText(shareUrl(), "Link copied ✓").then(() => sheet.close()),
  "share-pdf"() { sheet.close(); printPage(); },
  "share-mail"() {
    sheet.close();
    openMail(`mailto:?subject=${encodeURIComponent(CONFIG.share.title)}&body=${encodeURIComponent("Have a look at this creator media kit: " + shareUrl())}`);
  },
  top() { scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); setTimeout(() => $("#home")?.focus?.({ preventScroll: true }), 400); },
};
function initActions() {
  document.addEventListener("click", e => {
    if (e.target === $("#sh")) return sheet.close();
    if (e.target === $("#collabDialog")) return collab.close();
    const el = e.target.closest("[data-action]");
    if (el) { const fn = ACTIONS[el.dataset.action]; if (fn) safe("action:" + el.dataset.action, () => fn(e, el)); else console.warn("Unknown action", el.dataset.action); }
    const m = e.target.closest('a[href^="mailto:"]');                       // every email link goes through openMail (with fallback)
    if (m) { e.preventDefault(); openMail(m.href); }
  });
  addEventListener("keydown", e => {
    if (e.key === "Escape") { sheet.close(); collab.close(); closeViewer(); return; }
    const dialog = $("#collabDialog");
    if (e.key !== "Tab" || !dialog || dialog.hidden) return;
    const focusable = $('a[href], button:not([disabled])', dialog);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  addEventListener("error", e => console.error("[media-kit] runtime error:", e.message));
  document.addEventListener("error", e => { if (e.target.tagName === "IMG") e.target.remove(); }, true);   // broken image → remove quietly
}

/* ───────── 4.7 Boot ───────── */
function validate() {
  [["profile.email", P().email], ["profile.instagramUrl", P().instagramUrl], ["layout", CONFIG.layout?.length]]
    .forEach(([k, v]) => { if (!v) console.warn(`[media-kit] CONFIG.${k} is empty`); });
  CONFIG.layout.forEach(id => { if (!RENDER[id]) console.warn(`[media-kit] CONFIG.layout contains unknown section "${id}"`); });
}
function boot() {
  try {
    validate();
    document.title = `${P().name} — ${CONFIG.share.title.split("—").pop().trim()}`;
    $("#app").innerHTML = CONFIG.layout.map(id => RENDER[id] ? safe("render:" + id, RENDER[id], "") : "").join("");
    safe("render:chrome", renderChrome);
    [["reveal", initReveal], ["section-navigation", initSectionNavigation], ["carousel", initCarousel], ["gallery", initGallery], ["scroll", initScroll], ["actions", initActions]]
      .forEach(([name, fn]) => safe("init:" + name, fn));
  } catch (err) {
    console.error("[media-kit] fatal:", err);
    $("#app").innerHTML = `<p style="padding:120px 24px;text-align:center;font:17px system-ui">Something went wrong loading this page. Please refresh, or reach out at ${esc(CONFIG?.profile?.email || "")}.</p>`;
  }
}

/* Start once the page is ready */
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : boot();
