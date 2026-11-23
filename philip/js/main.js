/* =============================================================================
   Portfolio — behaviour
   Content lives in js/data.js. This file renders it and wires interactions.
   ========================================================================== */
(function () {
  "use strict";

  const D = window.PORTFOLIO || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.add("js");

  /* ---------- helpers ---------- */
  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (id, cls = "icon") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;

  const CATEGORY_LABELS = {
    web: "Web Development",
    uiux: "UI/UX Design",
    academic: "Academic",
    other: "Other",
    certificate: "Certificate",
    training: "Training & Webinar",
    competition: "Competition & Recognition"
  };
  const AWARD_LABELS = { ...CATEGORY_LABELS, academic: "Academic Achievement" };

  /* ===========================================================================
     1. BIND IDENTITY
     ======================================================================== */
  function bindIdentity() {
    if (D.name) {
      $$('[data-bind="name"]').forEach((el) => (el.textContent = D.name));
      document.title = `${D.name} — ${(D.roles || []).slice(0, 2).join(" & ") || "Portfolio"}`;
      $$('img[data-bind-src="profileImage"]').forEach((img) => (img.alt = `Portrait of ${D.name}`));
    }
    if (D.initials) $$('[data-bind="initials"]').forEach((el) => (el.textContent = D.initials));
    if (D.intro) $$('[data-bind="intro"]').forEach((el) => (el.textContent = D.intro));
    if (D.roles) $$('[data-bind="roles-text"]').forEach((el) => (el.textContent = D.roles.join(", ")));
    if (D.profileImage) $$('img[data-bind-src="profileImage"]').forEach((img) => (img.src = D.profileImage));
    if (D.email) {
      $$('[data-bind="email"]').forEach((el) => (el.textContent = D.email));
      $$('[data-bind-href="mailto"]').forEach((el) => {
        el.href = `mailto:${D.email}`;
        el.addEventListener("click", (e) => {
          const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          if (!isMobile) {
            // On desktop/laptop, standard mailto links fail silently if no desktop email client (like Outlook) is configured.
            // On desktop, open Gmail in a new tab and copy email to clipboard for guaranteed convenience.
            e.preventDefault();
            if (navigator.clipboard) {
              navigator.clipboard.writeText(D.email).catch(() => {});
              showToast("Email copied & opening Gmail…");
            }
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(D.email)}`;
            window.open(gmailUrl, "_blank", "noopener,noreferrer");
          }
        });
      });
    }
    if (D.phone) {
      $$('[data-bind="phone"]').forEach((el) => (el.textContent = D.phone));
      $$('[data-bind-href="tel"]').forEach((el) => (el.href = `tel:${D.phoneLink || D.phone.replace(/\s+/g, "")}`));
    } else {
      $$('[data-bind-href="tel"]').forEach((el) => el.remove());
    }

    // CV button: only shown when a CV file is configured in data.js.
    const cvBtn = $("#cv-btn");
    if (cvBtn && D.cvUrl) {
      cvBtn.href = D.cvUrl;
      cvBtn.setAttribute("download", "");
      cvBtn.hidden = false;
    }

    $("#year").textContent = new Date().getFullYear();
  }

  /* ===========================================================================
     2. ABOUT HIGHLIGHTS
     ======================================================================== */
  function renderHighlights() {
    const list = $("#highlights");
    if (!list || !D.highlights) return;
    list.innerHTML = D.highlights
      .map(
        (h, i) => `
        <li class="highlight reveal${h.placeholder ? " is-placeholder" : ""}" style="--d:${i * 0.07}s">
          <span class="highlight__icon">${icon(h.icon || "spark")}</span>
          <h3>${esc(h.title)}</h3>
          ${h.subtitle ? `<p class="highlight__subtitle">${esc(h.subtitle)}</p>` : ""}
          ${h.meta ? `<p class="highlight__meta">${esc(h.meta)}</p>` : ""}
          ${h.text ? `<p>${esc(h.text)}</p>` : ""}
          ${
            h.items
              ? `<ul class="highlight__list">${h.items
                  .map((it) => `<li><strong>${esc(it.label)}</strong> — ${esc(it.text)}</li>`)
                  .join("")}</ul>`
              : ""
          }
        </li>`
      )
      .join("");
  }

  /* ===========================================================================
     3. PROJECTS
     ======================================================================== */
  function projectActions(p, compact) {
    const out = [];
    if (!p.placeholder) {
      out.push(
        `<button type="button" class="btn btn--outline" data-project="${esc(p.id)}">View Project <span class="btn__arrow" aria-hidden="true">→</span></button>`
      );
    }
    if (p.liveUrl) {
      out.push(
        `<a class="btn ${compact ? "btn--ghost" : "btn--primary"}" href="${esc(p.liveUrl)}" target="_blank" rel="noopener noreferrer">${icon("external")} Live Demo<span class="sr-only"> of ${esc(p.title)} (opens in new tab)</span></a>`
      );
    }
    if (p.repoUrl) {
      out.push(
        `<a class="btn btn--ghost" href="${esc(p.repoUrl)}" target="_blank" rel="noopener noreferrer">${icon("github")} GitHub<span class="sr-only"> repository for ${esc(p.title)} (opens in new tab)</span></a>`
      );
    }
    return out.join("");
  }

  function projectCard(p, i) {
    const tech = (p.tech || []).map((t) => `<span class="chip">${esc(t)}</span>`).join("");
    const cats = (p.categories || []).join(" ");

    if (p.placeholder) {
      return `
        <article class="project project--placeholder reveal" data-cats="${cats}" style="--d:${i * 0.06}s" aria-label="Empty project slot">
          <div class="project__media"><span class="project__plus" aria-hidden="true">+</span></div>
          <div class="project__body">
            <div class="project__meta"><span>${esc(p.categoryLabel || "")}</span><span>Coming soon</span></div>
            <h3 class="project__title">${esc(p.title)}</h3>
            <p class="project__desc">${esc(p.description)}</p>
            ${tech ? `<div class="project__tech">${tech}</div>` : ""}
          </div>
        </article>`;
    }

    if (p.featured) {
      return `
        <article class="project project--featured reveal" data-cats="${cats}" aria-labelledby="pt-${esc(p.id)}">
          <div class="project__media">
            <span class="project__flag">★ Featured project</span>
            <img src="${esc(p.image)}" alt="Preview of the ${esc(p.title)} interface" loading="lazy" width="1600" height="1000" />
          </div>
          <div class="project__body">
            <div class="project__meta"><span>${esc(p.categoryLabel || "")}</span>${p.liveUrl ? '<span class="chip chip--accent">● Live</span>' : ""}</div>
            <h3 class="project__title" id="pt-${esc(p.id)}">${esc(p.title)}</h3>
            ${p.fullTitle ? `<p class="project__full">${esc(p.fullTitle)}</p>` : ""}
            <p class="project__desc">${esc(p.description)}</p>
            <div class="project__tech" aria-label="Technologies used">${tech}</div>
            <div class="project__actions">${projectActions(p)}</div>
          </div>
        </article>`;
    }

    return `
      <article class="project reveal${p.wide ? " project--wide" : ""}" data-cats="${cats}" style="--d:${i * 0.06}s" aria-labelledby="pt-${esc(p.id)}">
        <div class="project__media">${p.image ? `<img src="${esc(p.image)}" alt="Preview of the ${esc(p.title)} interface" loading="lazy" />` : ""}</div>
        <div class="project__body">
          <div class="project__meta"><span>${esc(p.categoryLabel || "")}</span></div>
          <h3 class="project__title" id="pt-${esc(p.id)}">${esc(p.title)}</h3>
          ${p.wide && p.fullTitle ? `<p class="project__full">${esc(p.fullTitle)}</p>` : ""}
          <p class="project__desc">${esc(p.description)}</p>
          ${tech ? `<div class="project__tech" aria-label="Technologies used">${tech}</div>` : ""}
          <div class="project__actions">${projectActions(p, !p.wide)}</div>
        </div>
      </article>`;
  }

  function renderProjects() {
    const wrap = $("#projects");
    if (!wrap || !D.projects) return;
    // featured first
    const items = [...D.projects].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    // A lone non-featured project gets a full-width layout instead of sitting in a 1/3 column.
    const others = items.filter((p) => !p.featured && !p.placeholder);
    const prepared = items.map((p) => (others.length === 1 && p === others[0] ? { ...p, wide: true } : p));
    wrap.innerHTML = prepared.map(projectCard).join("");

    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-project]");
      if (btn) openProject(btn.dataset.project, btn);
    });
  }

  function openProject(id, opener) {
    const p = (D.projects || []).find((x) => x.id === id);
    if (!p) return;
    const tech = (p.tech || []).map((t) => `<span class="chip">${esc(t)}</span>`).join("");
    const features = (p.features || []).map((f) => `<li>${esc(f)}</li>`).join("");
    const actions = [];
    if (p.liveUrl)
      actions.push(`<a class="btn btn--primary" href="${esc(p.liveUrl)}" target="_blank" rel="noopener noreferrer">${icon("external")} Visit live site</a>`);
    if (p.repoUrl)
      actions.push(`<a class="btn btn--outline" href="${esc(p.repoUrl)}" target="_blank" rel="noopener noreferrer">${icon("github")} View on GitHub</a>`);

    $("#project-modal-content").innerHTML = `
      ${p.image ? `<div class="pm__media"><img src="${esc(p.image)}" alt="Preview of the ${esc(p.title)} interface" /></div>` : ""}
      <div class="pm__body">
        <p class="section__index" style="margin:0">${esc(p.categoryLabel || "")}</p>
        <h3 class="pm__title" id="pm-title">${esc(p.title)}</h3>
        ${p.fullTitle ? `<p class="pm__full">${esc(p.fullTitle)}</p>` : ""}
        <p class="pm__desc">${esc(p.longDescription || p.description)}</p>
        ${features ? `<div><p class="pm__label">Key features</p><ul class="pm__features">${features}</ul></div>` : ""}
        ${tech ? `<div><p class="pm__label">Built with</p><div class="project__tech">${tech}</div></div>` : ""}
        ${actions.length ? `<div class="pm__actions">${actions.join("")}</div>` : ""}
      </div>`;
    openModal($("#project-modal"), opener);
  }

  /* ===========================================================================
     4. FILTERS (shared by projects + awards)
     ======================================================================== */
  function setupFilter(groupSel, itemsSel, matchFn, emptySel) {
    const group = $(groupSel);
    if (!group) return;
    group.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter");
      if (!btn || btn.classList.contains("is-active")) return;
      $$(".filter", group).forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      const f = btn.dataset.filter;
      const items = $$(itemsSel);
      const show = (el) => f === "all" || matchFn(el, f);

      // fade out, swap, fade in
      items.forEach((el) => el.classList.add("is-hiding"));
      window.setTimeout(
        () => {
          let visible = 0;
          items.forEach((el) => {
            const on = show(el);
            el.hidden = !on;
            if (on) visible++;
          });
          const empty = $(emptySel);
          if (empty) empty.hidden = visible > 0;
          void group.offsetWidth; // flush layout so the fade-in transition runs
          items.forEach((el) => el.classList.remove("is-hiding"));
        },
        reduceMotion ? 0 : 260
      );
    });
  }

  /* ===========================================================================
     THEME (light / dark) — initial theme is applied by the inline script in <head>
     ======================================================================== */
  function setupTheme() {
    const btn = $("#theme-toggle");
    const root = document.documentElement;
    const meta = $('meta[name="theme-color"]');
    const sync = () => {
      const light = root.dataset.theme === "light";
      const label = light ? "Switch to dark mode" : "Switch to light mode";
      if (btn) { btn.setAttribute("aria-label", label); btn.title = label; }
      if (meta) meta.setAttribute("content", light ? "#f6f6f2" : "#0c0d0f");
    };
    sync();
    if (!btn) return;
    btn.addEventListener("click", () => {
      const light = root.dataset.theme !== "light";
      if (light) root.dataset.theme = "light";
      else delete root.dataset.theme;
      try { localStorage.setItem("theme", light ? "light" : "dark"); } catch (e) {}
      sync();
    });
  }

  /* ===========================================================================
     5. SKILLS
     ======================================================================== */
  function renderSkills() {
    const grid = $("#skills-grid");
    if (!grid || !D.skills) return;
    grid.innerHTML = D.skills
      .map(
        (s, i) => `
        <li class="tech reveal${s.wide ? " tech--wide" : ""}" style="--d:${i * 0.06}s; --glow:${esc(s.glow || "#ffffff")}">
          <img class="tech__logo${s.logoLight ? " tech__logo--on-dark" : ""}" src="${esc(s.logo)}" alt="${esc(s.name)}" title="${esc(s.name)}" width="96" height="96" loading="lazy" decoding="async" />
          ${s.logoLight ? `<img class="tech__logo tech__logo--on-light" src="${esc(s.logoLight)}" alt="${esc(s.name)}" title="${esc(s.name)}" width="96" height="96" loading="lazy" decoding="async" />` : ""}
        </li>`
      )
      .join("");
  }

  /* ===========================================================================
     6. AWARDS + LIGHTBOX
     ======================================================================== */
  let visibleAwards = [];

  function renderAwards() {
    const grid = $("#awards-grid");
    if (!grid || !D.awards) return;
    grid.innerHTML = D.awards
      .map(
        (a, i) => `
        <button type="button" class="award reveal${a.placeholder ? " is-placeholder" : ""}" data-award="${i}" data-cat="${esc(a.category)}" style="--d:${(i % 4) * 0.07}s"
          aria-label="View ${esc(a.title)} certificate">
          <span class="award__media">
            ${a.placeholder ? '<span class="award__ph">Placeholder</span>' : ""}
            <img src="${esc(a.image)}" alt="" loading="lazy" width="800" height="600" />
            <span class="award__zoom" aria-hidden="true">${icon("expand")}</span>
          </span>
          <span class="award__body">
            <span class="award__cat">${esc(AWARD_LABELS[a.category] || a.category)}</span>
            <span class="award__title">${esc(a.title)}</span>
            <span class="award__org">${esc(a.org)}</span>
            <span class="award__desc">${esc(a.description)}</span>
            <span class="award__date">${esc(a.date)}</span>
          </span>
        </button>`
      )
      .join("");

    grid.addEventListener("click", (e) => {
      const card = e.target.closest("[data-award]");
      if (!card) return;
      visibleAwards = $$("[data-award]", grid).filter((el) => !el.hidden).map((el) => Number(el.dataset.award));
      showAward(Number(card.dataset.award), card);
    });
  }

  function showAward(index, opener) {
    const a = D.awards[index];
    if (!a) return;
    const pos = visibleAwards.indexOf(index);
    const multi = visibleAwards.length > 1;
    $("#award-modal-content").innerHTML = `
      <div class="lb">
        <div class="lb__media"><img src="${esc(a.image)}" alt="Certificate: ${esc(a.title)}" /></div>
        <div class="lb__body">
          <p class="award__cat">${esc(AWARD_LABELS[a.category] || a.category)}${a.placeholder ? " · Placeholder" : ""}</p>
          <h3 class="lb__title" id="am-title">${esc(a.title)}</h3>
          <p class="award__org">${esc(a.org)}</p>
          <p class="award__date" style="padding:0;margin:0">${esc(a.date)}</p>
          <p class="pm__desc">${esc(a.description)}</p>
          ${
            multi
              ? `<div class="lb__nav">
                  <button type="button" data-step="-1" aria-label="Previous achievement">←</button>
                  <button type="button" data-step="1" aria-label="Next achievement">→</button>
                </div>
                <p class="award__date" style="padding:0">${pos + 1} / ${visibleAwards.length}</p>`
              : ""
          }
        </div>
      </div>`;
    const modal = $("#award-modal");
    modal.dataset.index = index;
    if (!modal.open) openModal(modal, opener);
  }

  function stepAward(dir) {
    const modal = $("#award-modal");
    const cur = visibleAwards.indexOf(Number(modal.dataset.index));
    if (cur < 0 || visibleAwards.length < 2) return;
    const next = visibleAwards[(cur + dir + visibleAwards.length) % visibleAwards.length];
    showAward(next);
    const btn = $(`[data-step="${dir}"]`, modal);
    if (btn) btn.focus();
  }

  /* ===========================================================================
     7. MODALS (native <dialog>)
     ======================================================================== */
  let lastOpener = null;

  function openModal(modal, opener) {
    lastOpener = opener || document.activeElement;
    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
    document.body.classList.add("modal-open");
    const panel = $(".modal__panel", modal);
    if (panel) panel.scrollTop = 0;
  }

  function closeModal(modal) {
    if (typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
  }

  function setupModals() {
    $$(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target.closest("[data-close]")) closeModal(modal);
        const step = e.target.closest("[data-step]");
        if (step) stepAward(Number(step.dataset.step));
      });
      modal.addEventListener("close", () => {
        document.body.classList.remove("modal-open");
        if (lastOpener && document.contains(lastOpener)) lastOpener.focus();
      });
    });
    $("#award-modal").addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") stepAward(1);
      if (e.key === "ArrowLeft") stepAward(-1);
    });
  }

  /* ===========================================================================
     8. NAVIGATION
     ======================================================================== */
  function setupNav() {
    const nav = $("#nav");
    const toggle = $("#nav-toggle");
    const menu = $("#nav-menu");

    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 921px)").addEventListener("change", (e) => {
      if (e.matches) setOpen(false);
    });

    // Active section highlighting
    const links = $$("[data-nav]");
    const sections = links.map((l) => document.getElementById(l.dataset.nav)).filter(Boolean);
    const setActive = (id) =>
      links.forEach((l) => {
        const on = l.dataset.nav === id;
        l.classList.toggle("is-active", on);
        if (on) l.setAttribute("aria-current", "true");
        else l.removeAttribute("aria-current");
      });

    const pickActive = () => {
      const probe = window.innerHeight * 0.35;
      let current = sections[0].id;
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= probe) current = s.id;
      }
      // bottom of page → last section
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = sections[sections.length - 1].id;
      }
      setActive(current);
    };
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          pickActive();
          ticking = false;
        });
      },
      { passive: true }
    );
    window.addEventListener("resize", pickActive);
    pickActive();
  }

  /* ===========================================================================
     9. HERO — role rotator + spotlight
     ======================================================================== */
  function setupRotator() {
    const el = $("#role-rotator");
    const roles = D.roles || [];
    if (!el || !roles.length) return;
    el.textContent = roles[0];
    if (roles.length < 2 || reduceMotion) return;

    // Typewriter: type a phrase, pause, delete it, type the next one
    let i = 0;
    let chars = roles[0].length;
    let deleting = true;
    const tick = () => {
      const word = roles[i];
      if (document.hidden) return setTimeout(tick, 500);
      chars += deleting ? -1 : 1;
      el.textContent = word.slice(0, chars);
      let wait = deleting ? 35 : 75;
      if (!deleting && chars === word.length) {
        deleting = true;
        wait = 1800; // pause on the full phrase
      } else if (deleting && chars === 0) {
        deleting = false;
        i = (i + 1) % roles.length;
        wait = 350;
      }
      setTimeout(tick, wait);
    };
    setTimeout(tick, 2600); // first phrase stays a moment after the page loads
  }

  // "Good morning / afternoon / evening" based on the visitor's clock
  function setupGreeting() {
    const el = $("#greeting");
    if (!el) return;
    const h = new Date().getHours();
    const part = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
    el.textContent = `${part}, welcome to my portfolio`;
  }

  // Cards tilt slightly toward the mouse (mouse/trackpad only)
  function setupTilt() {
    if (reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const MAX = 5; // degrees
    document.addEventListener(
      "pointermove",
      (e) => {
        const card = e.target.closest && e.target.closest(".project, .award, .mini-project");
        if (!card) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--ry", `${(x * MAX * 2).toFixed(2)}deg`);
        card.style.setProperty("--rx", `${(-y * MAX * 2).toFixed(2)}deg`);
      },
      { passive: true }
    );
    $$(".project, .award, .mini-project").forEach((card) =>
      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--rx");
        card.style.removeProperty("--ry");
      })
    );
  }

  // Primary buttons lean toward the cursor a little
  function setupMagnetic() {
    if (reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    $$(".btn--primary").forEach((btn) => {
      btn.classList.add("is-magnetic");
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.translate = `${(x * 0.18).toFixed(1)}px ${(y * 0.25).toFixed(1)}px`;
      });
      btn.addEventListener("pointerleave", () => (btn.style.translate = ""));
    });
  }

  // A hello for developers who open the browser console
  function consoleHello() {
    try {
      console.log(
        "%cHi there, fellow developer!",
        "font: 600 16px Inter, system-ui, sans-serif; color: #c8f169;"
      );
      console.log(`Thanks for looking under the hood. Let's talk: ${D.email || ""}`);
    } catch (e) {}
  }

  function setupSpotlights() {
    if (reduceMotion || !window.matchMedia("(hover: hover)").matches) return;

    const hero = $(".hero");
    const spot = $(".hero__spot");
    if (hero && spot) {
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        spot.style.setProperty("--x", `${e.clientX - r.left}px`);
        spot.style.setProperty("--y", `${e.clientY - r.top}px`);
      });
    }

    // card spotlights
    document.addEventListener(
      "pointermove",
      (e) => {
        const card = e.target.closest && e.target.closest(".project");
        if (!card) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      },
      { passive: true }
    );
  }

  /* ===========================================================================
     10. CURSOR
     ======================================================================== */
  function setupCursor() {
    if (reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const c = $(".cursor");
    const dot = $(".cursor__dot");
    const ring = $(".cursor__ring");
    let x = -100, y = -100, rx = x, ry = y;

    window.addEventListener(
      "pointermove",
      (e) => {
        x = e.clientX;
        y = e.clientY;
        c.classList.add("is-visible");
        const t = e.target;
        c.classList.toggle("is-hover", !!t.closest("a, button, .filter, [data-award]"));
        c.classList.toggle("is-text", !!t.closest("input, textarea"));
      },
      { passive: true }
    );
    document.addEventListener("pointerleave", () => c.classList.remove("is-visible"));

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ===========================================================================
     11. SCROLL REVEAL
     ======================================================================== */
  function setupReveal() {
    const els = $$(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            const el = en.target;
            el.classList.add("is-visible");
            io.unobserve(el);
            // Once revealed, drop the helper classes so the element's own
            // hover transforms / transitions take over cleanly.
            const delay = parseFloat(getComputedStyle(el).getPropertyValue("--d")) || 0;
            window.setTimeout(() => el.classList.remove("reveal", "is-visible"), delay * 1000 + 950);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ===========================================================================
     12. CONTACT FORM
     ======================================================================== */
  function setupForm() {
    const form = $("#contact-form");
    if (!form) return;
    const status = $("#form-status");
    const note = $("#form-note");
    const submit = $("#form-submit");
    const hasEndpoint = !!D.formEndpoint;

    note.textContent = hasEndpoint
      ? "I usually reply within a few days."
      : "This opens your email app with your message ready to send.";

    const rules = {
      name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
      email: (v) =>
        !v.trim() ? "Please enter your email address." : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "That email address doesn't look right.",
      subject: (v) => (v.trim().length >= 3 ? "" : "Please add a short subject."),
      message: (v) => (v.trim().length >= 10 ? "" : "Your message should be at least 10 characters.")
    };

    const validateField = (input) => {
      const msg = rules[input.name] ? rules[input.name](input.value) : "";
      const field = input.closest(".field");
      field.classList.toggle("has-error", !!msg);
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      $(`#e-${input.name}`).textContent = msg;
      return !msg;
    };

    const inputs = $$("input, textarea", form);
    inputs.forEach((input) => {
      input.addEventListener("blur", () => input.value && validateField(input));
      input.addEventListener("input", () => input.closest(".field").classList.contains("has-error") && validateField(input));
    });

    const showStatus = (type, html) => {
      status.hidden = false;
      status.className = `form__status is-${type}`;
      status.innerHTML = html;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const results = inputs.map(validateField);
      if (results.includes(false)) {
        const firstBad = inputs[results.indexOf(false)];
        firstBad.focus();
        showStatus("error", "Please fix the highlighted fields and try again.");
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());

      if (hasEndpoint) {
        submit.setAttribute("aria-busy", "true");
        $(".btn__label", submit).textContent = "Sending…";
        try {
          const res = await fetch(D.formEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(data)
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          form.reset();
          showStatus("success", "Thanks — your message was sent. I'll get back to you soon.");
        } catch (err) {
          showStatus(
            "error",
            `Sorry, the message couldn't be sent right now. Please email me directly at <a href="mailto:${esc(D.email)}">${esc(D.email)}</a>.`
          );
        } finally {
          submit.removeAttribute("aria-busy");
          $(".btn__label", submit).textContent = "Send Message";
        }
        return;
      }

      // No backend configured: hand off to the visitor's email client.
      const body = `${data.message}\n\n— ${data.name}\n${data.email}`;
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        const href = `mailto:${encodeURIComponent(D.email || "")}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = href;
      } else {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(D.email || "")}&su=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl, "_blank", "noopener,noreferrer");
      }
      showStatus(
        "success",
        `Your email app or Gmail should now open with the message ready — just press send. Nothing opened? Email me directly at <a href="mailto:${esc(D.email)}">${esc(D.email)}</a>.`
      );
    });
  }

  /* ===========================================================================
     13. SOCIALS
     ======================================================================== */
  function renderSocials() {
    // rendered in the same style as the email / phone lines
    const list = $("#contact-lines");
    if (!list) return;
    list.insertAdjacentHTML(
      "beforeend",
      (D.socials || [])
        .filter((s) => s.url)
        .map(
          (s) => `<a class="contact__email" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${icon(s.icon || "external")}<span>${esc(s.label)}</span><span class="sr-only"> (opens in new tab)</span></a>`
        )
        .join("")
    );
  }

  /* ===========================================================================
     14. EXTRAS — scroll progress, back to top, copy email, quick navigation
     ======================================================================== */
  // Small message at the bottom of the screen, e.g. "Email copied"
  let toastTimer;
  function showToast(text) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  // Progress bar + back-to-top button both react to scrolling
  function setupScrollExtras() {
    const bar = $("#scroll-progress");
    const toTop = $("#to-top");
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (bar) bar.style.transform = `scaleX(${progress})`;
      if (toTop) toTop.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.8);
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", update);
    update();

    if (toTop) {
      toTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        const logo = $(".nav__logo");
        if (logo) logo.focus({ preventScroll: true });
      });
    }
  }

  async function copyEmail() {
    if (!D.email) return;
    try {
      await navigator.clipboard.writeText(D.email);
      showToast("Email copied to clipboard");
    } catch (e) {
      // clipboard blocked (e.g. page opened as a file) — fall back to the email app
      window.location.href = `mailto:${D.email}`;
    }
  }

  function setupCopyEmail() {
    const btn = $("#copy-email");
    if (btn) btn.addEventListener("click", copyEmail);
  }

  /* ===========================================================================
     INIT
     ======================================================================== */
  bindIdentity();
  renderHighlights();
  renderProjects();
  renderSkills();
  renderAwards();
  renderSocials();

  setupFilter("#project-filters", "#projects .project", (el, f) => el.dataset.cats.split(" ").includes(f), "#projects-empty");
  setupFilter("#award-filters", "#awards-grid .award", (el, f) => el.dataset.cat === f, "#awards-empty");
  setupModals();
  setupNav();
  setupTheme();
  setupRotator();
  setupSpotlights();
  setupCursor();
  setupReveal();
  setupForm();
  setupScrollExtras();
  setupCopyEmail();
  setupGreeting();
  setupTilt();
  setupMagnetic();
  consoleHello();

  // trigger hero entrance after first paint
  requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("is-loaded")));
})();
