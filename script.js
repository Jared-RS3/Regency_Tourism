/* ============================================================
   DAYBREAK PROPOSAL SYSTEM · behaviour + data layer
   Build: Regency Tourism — Website & Trade Lead Capture
   Ref:   DB-RGT-001 · V1

   RULE: no price, hour count or date is typed into index.html.
   Everything below is bound into the page at runtime.
   ============================================================ */

/* ---------- 1. PROPOSAL DATA ---------- */
const proposalData = {
  clientName:   "Regency Tourism",
  projectName:  "Regency Tourism",
  docRef:       "DB-RGT-001 · V1",
  proposalDate: "22 August 2026",
  proposalValidityDays: 14,
  validUntil:   "5 September 2026",
  currency:     "ZAR",
  companyName:  "Daybreak",
  email:        "contact@daybreaktechinnovations.com",
  website:      "daybreaktech.agency",
  location:     "Cape Town, South Africa",
  startDate:    "1 September 2026",
  deliveryDate: "3 October 2026",
  buildWeeks:   5,
};

/* ---------- 2. RATES ---------- */
/* Every fee in this document is hours x one of these two rates. Nothing else. */
const standardRate = 850;   // ad-hoc engineering / roadmap rate
const packageRate  = 500;   // Phase 01 fixed-scope launch package rate
const supportRate  = 850;   // post-launch ad-hoc, billed in 30-minute units

/* ---------- 3. PHASE 01 — the quoted work ---------- */
/* [name, hours, description, workstream] */
const phaseLines = {
  p1: [
    ["Discovery & Information Architecture", 4,
     "Sitemap, page-by-page content plan, the B2B / traveller message split, and the field design for both enquiry forms.",
     "Design"],
    ["Design Direction & Page Design", 10,
     "The approved concept extended into a homepage, three interior templates and the form templates — desktop and mobile.",
     "Design"],
    ["Homepage Build", 8,
     "Hero, ground-partner trust strip, why-Regency, services grid, partner call-to-action and footer.",
     "Build"],
    ["Interior Page Build", 12,
     "About, Services, Destinations, Itineraries, Trade Partners, Groups & MICE, VIP & Corporate, Contact.",
     "Build"],
    ["Quote & Trade Partner Forms", 6,
     "Two validated forms with spam protection, branded auto-reply to the enquirer and instant notification to Regency.",
     "Forms & CRM"],
    ["Lead Capture Sheet", 4,
     "Every submission written to a structured lead record — name, company, country, travel type, source page, timestamp.",
     "Forms & CRM"],
    ["SEO Foundation, Schema & Analytics", 3,
     "Meta titles and descriptions, sitemap, robots, Organization and LocalBusiness schema, GA4 and Search Console, WhatsApp click tracking.",
     "Launch"],
    ["Testing, Deployment & Handover", 3,
     "Cross-browser and device QA, performance pass, domain, SSL and DNS, plus a recorded walkthrough of the lead sheet.",
     "Launch"],
  ],
};

/* ---------- 4. THE ROADMAP — priced, not quoted ---------- */
/* [name, hours, description] — costed at standardRate so the client can
   choose any combination later without a new rate conversation. */
const roadmap = [
  ["SEO Landing Page Programme", 18,
   "Ten individual pages for the money searches — Cape Town DMC, land arrangements, ground handling, group travel, airport transfers — rather than one page trying to rank for everything."],
  ["CRM Integration", 20,
   "The lead sheet replaced by a real pipeline: HubSpot or Zoho, deal stages, owner assignment, follow-up reminders and reporting."],
  ["Conversion Tracking Stack", 6,
   "Meta Pixel, LinkedIn Insight Tag and GA4 conversion events on every quote, partner and WhatsApp click, so spend can be measured."],
  ["Language Landing Pages", 8,
   "Per language. Four professionally translated B2B pages — not a machine translation of the whole site. Arabic, French, German, Italian, Spanish."],
  ["Reviews & Testimonials Module", 7,
   "Live Google Business review feed with client name, country, trip type and rating, plus a moderated trade-reference section."],
  ["Itinerary Library & PDF Download", 26,
   "Filterable sample itineraries by duration, region and traveller type, each downloadable as a branded PDF behind an email capture."],
  ["Trade Partner Portal", 44,
   "Login for approved agents: rate cards, fact sheets, vehicle and hotel lists, image library and downloadable contracting documents."],
  ["Enquiry-to-Quote Pipeline", 58,
   "Enquiry becomes a costed, branded quote inside the system — line items, margins, versioning and a client-facing acceptance link."],
  ["Copywriting — Full Site", 14,
   "Professional B2B copy for all nine pages, written for the trade audience and the target search terms."],
];

/* ---------- 5. CARE PLANS ---------- */
const care = {
  essential: { fee: 950,  label: "Essential" },
  growth:    { fee: 1850, label: "Growth" },
};

/* ---------- 6. THIRD-PARTY COSTS (client's own account) ---------- */
const thirdParty = [
  ["Domain registration",        "R250",   "per year",   "regencytourism.com or .co.za, renewed annually."],
  ["Web hosting",                "R0",     "per month",  "Netlify or Vercel free tier covers this site comfortably. R380 / month only if traffic warrants an upgrade."],
  ["SSL certificate",            "R0",     "included",   "Let's Encrypt, issued and renewed automatically."],
  ["Business email",             "R110",   "per user / month", "Google Workspace. Required for professional sending and form deliverability."],
  ["CRM licence",                "R0",     "per month",  "HubSpot Free carries the first stage. A paid tier (from R490 / user / month) is only needed at Phase 02."],
  ["Licensed photography",       "R2,500", "once-off, estimate", "Only if Regency's own Cape Town photography is unavailable. Own imagery is strongly preferred."],
  ["Professional translation",   "R2.10",  "per word, estimate", "Per language, for the four B2B pages. Roughly R4,800 per language."],
];

/* ---------- 7. DERIVATION ---------- */
const money = n => "R" + Math.round(n).toLocaleString("en-ZA").replace(/ /g, ",");
const hoursOf = key => phaseLines[key].reduce((t, l) => t + l[1], 0);

const p1Hours    = hoursOf("p1");
const p1Standard = p1Hours * standardRate;
const p1Fee      = p1Hours * packageRate;
const p1Saving   = p1Standard - p1Fee;
const p1SavingPct= Math.round((p1Saving / p1Standard) * 100);
const deposit    = p1Fee / 2;
const balance    = p1Fee - deposit;

const roadmapFee   = h => h * standardRate;
const roadmapTotal = roadmap.reduce((t, r) => t + roadmapFee(r[1]), 0);

/* workstream groups, derived from phaseLines so the bar cannot lie */
const workstreams = (() => {
  const order = [], map = {};
  phaseLines.p1.forEach(([, h, , g]) => {
    if (!(g in map)) { map[g] = 0; order.push(g); }
    map[g] += h;
  });
  return order.map(g => ({ name: g, hours: map[g] }));
})();

/* ---------- 8. FILLS ---------- */
const fills = {
  "client-name":     proposalData.clientName,
  "project-name":    proposalData.projectName,
  "doc-ref":         proposalData.docRef,
  "proposal-date":   proposalData.proposalDate,
  "validity-days":   String(proposalData.proposalValidityDays),
  "valid-until":     proposalData.validUntil,
  "start-date":      proposalData.startDate,
  "delivery-date":   proposalData.deliveryDate,
  "build-weeks":     String(proposalData.buildWeeks),
  "company-name":    proposalData.companyName,
  "company-email":   proposalData.email,
  "company-site":    proposalData.website,
  "company-location":proposalData.location,

  "build-hours":     String(p1Hours),
  "standard-rate":   money(standardRate),
  "package-rate":    money(packageRate),
  "support-rate":    money(supportRate),
  "p1-standard":     money(p1Standard),
  "p1-fee":          money(p1Fee),
  "p1-saving":       money(p1Saving),
  "p1-saving-pct":   p1SavingPct + "%",
  "deposit":         money(deposit),
  "balance":         money(balance),

  "care-essential":  money(care.essential.fee),
  "care-growth":     money(care.growth.fee),
  "care-essential-yr": money(care.essential.fee * 12),

  "roadmap-total":   money(roadmapTotal),
  "roadmap-count":   String(roadmap.length),
  "seo-fee":         money(roadmapFee(18)),
  "crm-fee":         money(roadmapFee(20)),
  "tracking-fee":    money(roadmapFee(6)),
  "language-fee":    money(roadmapFee(8)),
  "portal-fee":      money(roadmapFee(44)),
  "pipeline-fee":    money(roadmapFee(58)),

  "year-one-min":    money(p1Fee + (care.essential.fee * 12) + 250),
};

/* ---------- 9. RENDER ---------- */
function fillText(){
  document.querySelectorAll("[data-fill]").forEach(el => {
    const key = el.getAttribute("data-fill");
    if (key in fills) el.textContent = fills[key];
  });
}

function row(name, desc, hours, fee, cls){
  return '<div class="cost-row ' + (cls || '') + '">' +
    '<div class="cr-body"><div class="cr-name">' + name + '</div>' +
      (desc ? '<p class="cr-desc">' + desc + '</p>' : '') + '</div>' +
    '<div class="cr-figs">' +
      '<span class="cr-hours">' + (hours === null ? '' : hours + ' h') + '</span>' +
      '<span class="cr-fee">' + fee + '</span>' +
    '</div></div>';
}

function renderLedgers(){
  document.querySelectorAll("[data-lines]").forEach(host => {
    const key = host.getAttribute("data-lines");
    const lines = phaseLines[key];
    if (!lines) return;
    let html = lines.map(([n, h, d]) => row(n, d, h, money(h * packageRate))).join("");
    html += row("Subtotal at standard rate", null, p1Hours, money(p1Standard), "sub");
    html += row("Fixed-scope package adjustment", null, null, "−" + money(p1Saving), "sub");
    html += row("Phase 01 — total", null, p1Hours, money(p1Fee), "total");
    host.innerHTML = html;
  });
}

function renderRoadmap(){
  const host = document.querySelector("[data-roadmap]");
  if (!host) return;
  host.innerHTML = roadmap.map(([n, h, d]) =>
    '<div class="band"><div class="band-body"><h4>' + n + '</h4><p>' + d + '</p></div>' +
    '<div class="band-fig">' + money(roadmapFee(h)) + '<small>' + h + ' h</small></div></div>'
  ).join("");
}

function renderThirdParty(){
  const host = document.querySelector("[data-thirdparty]");
  if (!host) return;
  host.innerHTML = thirdParty.map(([n, f, u, d]) =>
    '<div class="band"><div class="band-body"><h4>' + n + '</h4><p>' + d + '</p></div>' +
    '<div class="band-fig">' + f + '<small>' + u + '</small></div></div>'
  ).join("");
}

function renderStack(){
  const bar = document.querySelector("[data-stack]");
  const brk = document.querySelector("[data-stack-brackets]");
  if (!bar) return;
  bar.innerHTML = workstreams.map(w =>
    '<div class="ti-seg" style="flex:' + w.hours + '">' + w.name + '</div>'
  ).join("");
  if (brk) brk.innerHTML = workstreams.map(w =>
    '<div class="ti-brk" style="flex:' + w.hours + '">' + w.hours + ' h</div>'
  ).join("");
}

/* ---------- 10. NAVIGATION & BEHAVIOUR ---------- */
const pages = Array.from(document.querySelectorAll(".proposal-page"));

function buildChrome(){
  const total = pages.length;
  const pad = n => String(n).padStart(2, "0");

  /* footers + ids */
  pages.forEach((p, i) => {
    p.id = "page-" + (i + 1);
    const num = p.querySelector(".page-num");
    if (num) num.textContent = pad(i + 1) + " / " + pad(total);
    const tag = p.querySelector(".page-tag");
    if (tag) tag.innerHTML = "PROPOSAL<i></i>" + proposalData.docRef;
  });

  /* side index */
  const nav = document.querySelector(".sidenav");
  if (nav){
    nav.innerHTML = pages.map((p, i) =>
      '<button class="sn-item" data-go="' + i + '">' +
        '<span class="sn-tick"></span>' +
        '<span class="sn-num">' + (p.dataset.num || "") + '</span>' +
        '<span class="sn-label">' + (p.dataset.title || "") + '</span>' +
      '</button>'
    ).join("");
    nav.addEventListener("click", e => {
      const b = e.target.closest("[data-go]");
      if (b) pages[+b.dataset.go].scrollIntoView({ behavior: "smooth" });
    });
  }

  /* top bar */
  const title = document.querySelector(".tb-title");
  const count = document.querySelector(".tb-count");
  const bar   = document.querySelector(".progress");
  let active  = 0;

  function setActive(i){
    active = i;
    if (title) title.textContent = pages[i].dataset.title || "";
    if (count) count.textContent = pad(i + 1) + " / " + pad(total);
    document.querySelectorAll(".sn-item").forEach((el, j) =>
      el.classList.toggle("is-active", j === i));
  }
  setActive(0);

  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) setActive(pages.indexOf(en.target));
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  pages.forEach(p => spy.observe(p));

  function go(delta){
    const next = Math.min(total - 1, Math.max(0, active + delta));
    pages[next].scrollIntoView({ behavior: "smooth" });
  }
  const prev = document.querySelector("[data-prev]");
  const next = document.querySelector("[data-next]");
  const print = document.querySelector("[data-print]");
  if (prev)  prev.addEventListener("click", () => go(-1));
  if (next)  next.addEventListener("click", () => go(1));
  if (print) print.addEventListener("click", () => window.print());

  document.addEventListener("keydown", e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (["ArrowDown","ArrowRight","PageDown"].includes(e.key)) { e.preventDefault(); go(1); }
    else if (["ArrowUp","ArrowLeft","PageUp"].includes(e.key)) { e.preventDefault(); go(-1); }
    else if (e.key === "Home") { e.preventDefault(); pages[0].scrollIntoView({behavior:"smooth"}); }
    else if (e.key === "End")  { e.preventDefault(); pages[total-1].scrollIntoView({behavior:"smooth"}); }
  });

  if (bar){
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
}

function buildReveal(){
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const kids = en.target.querySelectorAll(".page-inner > *, .split-dark > *, .split-light > *");
      kids.forEach((k, i) => { k.style.transitionDelay = Math.min(i * 55, 440) + "ms"; });
      en.target.classList.add("is-revealed");
      en.target.querySelectorAll(".split-dark, .split-light")
               .forEach(s => s.classList.add("is-revealed"));
      io.unobserve(en.target);
    });
  }, { threshold: 0.12 });
  pages.forEach(p => io.observe(p));
}

/* ---------- 11. GO ---------- */
fillText();
renderLedgers();
renderRoadmap();
renderThirdParty();
renderStack();
buildChrome();
buildReveal();
