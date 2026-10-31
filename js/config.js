/* ═══════════════════════════════════════════════════════════
   config.js  ★ THE ONLY FILE YOU NEED FOR CONTENT CHANGES ★
   Followers, reels, brands, rates, cities, photos, email, Instagram… everything that changes lives here.
   ═══════════════════════════════════════════════════════════ */

const CONFIG = {

  /* ── Page order. Remove an id to hide that section; reorder to move it. ── */
  layout: ["hero", "numbers", "work", "look", "audience", "expect", "delivery", "rates", "contact"],

  /* ── 1. PROFILE ─────────────────────────────────────────────── */
  profile: {
    name: "Tanisha Tripathi",
    kitLabel: "Creator media kit · 2026",
    city: "Pune, India",
    year: 2026,
    email: "ttanishata@gmail.com",
    instagramHandle: "@taniisha.tripathii",
    instagramUrl: "https://www.instagram.com/taniisha.tripathii",
    statsSource: "Instagram Insights, Oct 2026",   // shown in footer
  },

  /* ── 2. HERO (first screen) ─────────────────────────────────── */
  hero: {
    headline: ["Looks good.", "Gets people talking."],   // line 2 is the gradient line
    lead: "Tanisha Tripathi — lifestyle & fashion creator from Pune, making brand stories feel like part of the feed.",
    tags: ["Lifestyle", "Fashion", "Beauty", "UGC"],
    cta: "Let’s create together",
    photos: ["assets/images/hero/hero-1.jpg", "assets/images/hero/hero-2.jpg", "assets/images/hero/hero-3.jpg"],              // 1–5 photos (file path or link). The collage re-arranges itself per count.
    chips: [                                             // 2 floating stat chips
      { value: "1.5M",  label: "views in 30 days" },
      { value: "10.4K", label: "followers" },
    ],
  },

  /* ── 3. SECTION HEADINGS (eyebrow + title + gradient accent) ─── */
  sections: {
    numbers:  { nav: true,  label: "Numbers",  eyebrow: "The numbers · Instagram Insights, Oct 2026", title: "Small circle.",       accent: "Big reach." },
    work:     { nav: true,  label: "Work",     eyebrow: "Best work",                                  title: "Reels that",           accent: "travel." },
    look:     { nav: false, label: "Look",     eyebrow: "The look",                                   title: "Style, travel &",      accent: "golden hour." },
    audience: { nav: false, label: "Audience", eyebrow: "Audience",                                   title: "Rooted in",            accent: "metro India." },
    expect:   { nav: false, label: "Why",      eyebrow: "Why brands work with me",                    title: "Aesthetic. Authentic.", accent: "Easy." },
    delivery: { nav: true,  label: "Delivery", eyebrow: "Fast & high-quality delivery",               title: "From brief to feed,",  accent: "fast and flawless." },
    rates:    { nav: true,  label: "Rates",    eyebrow: "Collaboration rates",                        title: "Simple rates.",        accent: "Custom packages welcome." },
    contact:  { nav: false, label: "Contact",  eyebrow: "Say hello",                                  title: "Let’s create something that", accent: "gets people talking." },
  },

  /* ── 4. NUMBERS (stat cards) ───────────────────────────────────
     icon  → eye · users · userplus · heart · comment · send · bookmark   (more can be added in ICONS below)
     featured: true → the big gradient card (use it on one card only).
     Add / remove / reorder cards freely; the grid adapts. */
  numbers: [
    { icon: "eye",      value: 1.5,  decimals: 1, suffix: "M", label: "Views in the last 30 days", featured: true },
    { icon: "users",    value: 10.4, decimals: 1, suffix: "K", label: "Followers" },
    { icon: "userplus", value: 2.1,  decimals: 1, suffix: "K", label: "New followers this month" },
    { icon: "heart",    value: 1000, suffix: "+", label: "Avg. likes per post" },
    { icon: "comment",  value: 300,  suffix: "+", label: "Avg. comments" },
    { icon: "send",     value: 450,  suffix: "+", label: "Avg. shares" },
    { icon: "bookmark", value: 350,  suffix: "+", label: "Avg. saves" },
  ],

  /* ── 5. TOP REELS (carousel) ─────────────────────────────────────
     ADD a reel     → copy one { … } line below, paste it where you want it, edit the text.
     REMOVE a reel  → delete its { … } block.
     CHANGE a cover → set image to a file path (e.g. "assets/images/reels/new-cover.jpg") OR a full web link.
     url: ""        → the card shows but isn’t clickable. Cards appear in this order. */
  reels: [
    { brand: "Off Duty",    image: "assets/images/reels/off-duty.jpg", url: "https://www.instagram.com/p/DcIlWXFsocL/",
      views: "2M",    viewsLabel: "views",                           stats: ["11K likes"] },
    { brand: "Shaper Cult", image: "assets/images/reels/shaper-cult.jpg",  url: "https://www.instagram.com/shapercult.official",
      views: "1.15M", viewsLabel: "views · 927K accounts reached",   stats: ["81.3K likes", "20.8K shares", "2,479 follows"] },
    { brand: "Reel",        image: "assets/images/reels/reel-hut.jpg",     url: "",
      views: "149K",  viewsLabel: "views · 127K accounts reached",   stats: ["2.3K likes", "568 shares"] },
    { brand: "Reel",        image: "assets/images/reels/reel-mirror.jpg",  url: "",
      views: "130K",  viewsLabel: "views · 98K accounts reached",    stats: ["5.7K likes", "4.9K shares", "860 follows"] },
    { brand: "Kraus Jeans", image: "assets/images/reels/kraus-jeans.jpg",   url: "https://www.instagram.com/reel/DeGkfhpPmcC/",
      views: "13K",   viewsLabel: "views",                           stats: ["265 likes", "45 saves"] },
  ],

  /* ── 6. BRANDS (scrolling strip + summary pills) ────────────── */
  brands: {
    names: ["Tira Beauty", "Off Duty", "Libas", "Shaper Cult", "Peeperly", "Dream Beauty", "KIXA",
            "Kraus Jeans", "Letsorum", "Peacetic", "Longstory", "Jewel Junction", "Esquare the Fern", "The High Spirits"],
    highlights: ["3 brands with 700K+ followers"],   // extra pills; first pill is auto: "<count> brand collaborations in <year>"
  },

  /* ── 7. PHOTO WALL ("Style, travel & golden hour") ───────────────
     ADD / REMOVE a photo → add or delete an entry. Each entry is a file path inside assets/images/gallery/ OR a full web link.
     Any number of photos works (the two rows rebalance themselves). */
  gallery: ["assets/images/gallery/photo-1.jpg", "assets/images/gallery/photo-2.jpg", "assets/images/gallery/photo-3.jpg", "assets/images/gallery/photo-4.jpg", "assets/images/gallery/photo-5.jpg", "assets/images/gallery/photo-6.jpg", "assets/images/gallery/photo-7.jpg", "assets/images/gallery/photo-8.jpg"],

  /* ── 8. AUDIENCE ────────────────────────────────────────────── */
  audience: {
    note: "Top cities ranked by audience share.",
    // Ordered by rank. Add `percent: 38` to any city to show a real figure.
    cities: [{ name: "Mumbai" }, { name: "Pune" }, { name: "Delhi" }, { name: "Bangalore" }],
  },

  /* ── 9. WHY BRANDS WORK WITH ME ─────────────────────────────── */
  expect: [
    { title: "High-quality content", text: "Thoughtful product integration that feels like a natural part of my feed while clearly communicating the product’s value." },
    { title: "Easy to work with",    text: "Creative freedom, professionalism, clear communication and quick turnaround." },
    { title: "Brand-first",          text: "I understand the brand before I create, so content works beyond the collab post." },
  ],

  /* ── 10. DELIVERY ───────────────────────────────────────────── */
  delivery: {
    steps: [
      { title: "Brief",   text: "I learn your brand and product first, so every frame starts with the right idea." },
      { title: "Create",  text: "Aesthetic, high-quality content with natural storytelling and clean visuals." },
      { title: "Deliver", text: "Quick turnaround and clear communication. On-brand and ready to post." },
    ],
    tags: ["Fast turnaround", "High-quality content", "Clear communication"],
  },

  /* ── 11. RATES (INR) ────────────────────────────────────────── */
  rates: {
    items: [
      { kind: "Story",          title: "Instagram Story",          price: 1500 },
      { kind: "Feed",           title: "Sponsored Post",           price: 4000 },
      { kind: "Video",          title: "Instagram Reel",           price: 8000 },
      { kind: "Video + rights", title: "Reel + 1 Month Ad Rights", price: 10000, highlight: true },
    ],
    note: "Custom packages and campaign requirements can be discussed separately.",
    customCta: "Discuss a custom package",
    customSubject: "Custom package enquiry",
  },

  /* ── 12. CONTACT ────────────────────────────────────────────── */
  contact: {
    text: "Open for brand collaborations, UGC and campaigns. Fast, high-quality delivery.",
    cta: "Let’s collab",
    emailSubject: "Collaboration enquiry",
    emailBody: "Hi Tanisha,\n\nI’d love to discuss a collaboration.\n\nBrand:\nCampaign details:\nTimeline:\n",
  },

  /* ── 13. SHARE & FEATURES ───────────────────────────────────── */
  share: {
    title: "Tanisha Tripathi — Creator Media Kit",
    url: "",                // leave empty to share the current page address; set your final URL once hosted
  },
  features: {
    carouselAutoplay: true, // reels carousel advances by itself
    carouselDelayMs: 4200,
    confetti: true,         // celebration burst on "Let’s collab"
  },
};
