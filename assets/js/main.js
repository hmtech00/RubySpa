/* ============================================================
   RUBY SPA — main.js
   Modular vanilla JS. No dependencies.
   ============================================================ */

(function () {
  "use strict";

  /* ----------------------------------------------------------
     Config
     ---------------------------------------------------------- */

  // Configure the external booking destination here.
  // Leave empty to keep Book Now buttons as inert placeholders.
  const bookingUrl = "";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  /* ----------------------------------------------------------
     Experiences data
     Single source of truth for the ritual menu.
     Content below reflects the structure of the reference site
     and should be treated as editable placeholder content.
     ---------------------------------------------------------- */
  const experiences = [
    {
      id: "essential",
      number: "01",
      name: "Essential",
      duration: "30 MIN",
      price: "€80",
      summary:
        "A focused introduction to the Ruby ritual — an unhurried session designed to ease tension and settle the senses.",
      whatToExpect:
        "A calm arrival, a brief consultation, and a 30-minute session paced around your comfort. Lighting, temperature and pressure are adjusted to your preference throughout.",
      info: [
        "Please arrive 10 minutes before your appointment time.",
        "Suitable as a first introduction to Ruby Spa.",
        "Speak with your therapist about any areas of focus.",
      ],
      photo: "photo--silk",
    },
    {
      id: "classic",
      number: "02",
      name: "Classic",
      duration: "30 MIN",
      price: "€100",
      summary:
        "Our most requested session — a considered balance of pressure and pace, tailored in the room to how you feel that day.",
      whatToExpect:
        "A 30-minute session with a short check-in beforehand so your therapist can adapt technique and pressure to your needs on arrival.",
      info: [
        "Please arrive 10 minutes before your appointment time.",
        "A good choice if you are unsure which experience to book.",
        "Discretion and privacy are maintained throughout your visit.",
      ],
      photo: "photo--velvet",
    },
    {
      id: "premium",
      number: "03",
      name: "Premium",
      duration: "30 MIN",
      price: "€120",
      summary:
        "An elevated version of the Classic, with extended attention given to areas that need it most.",
      whatToExpect:
        "A 30-minute session with additional time reserved at the start for consultation, so the experience can be shaped closely around you.",
      info: [
        "Please arrive 10 minutes before your appointment time.",
        "Recommended for returning guests with specific preferences.",
        "Discretion and privacy are maintained throughout your visit.",
      ],
      photo: "photo--copper",
    },
    {
      id: "four-hands",
      number: "04",
      name: "Four Hands",
      duration: "30 MIN",
      price: "€240",
      summary:
        "Two therapists, one synchronised session — a fuller, more immersive experience from start to finish.",
      whatToExpect:
        "A 30-minute session delivered by two therapists working in tandem. A short consultation beforehand ensures the pacing suits you.",
      info: [
        "Please arrive 10 minutes before your appointment time.",
        "Subject to availability of two therapists at your preferred time.",
        "Discretion and privacy are maintained throughout your visit.",
      ],
      photo: "photo--espresso",
    },
  ];

  /* ----------------------------------------------------------
     initNavigation — mobile fullscreen menu
     ---------------------------------------------------------- */
  function initNavigation() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const menu = document.querySelector("[data-mobile-menu]");
    if (!toggle || !menu) return;

    const closeBtn = menu.querySelector("[data-menu-close]");
    const links = menu.querySelectorAll("a");

    function openMenu() {
      menu.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open");
      const firstLink = menu.querySelector("a");
      if (firstLink) firstLink.focus({ preventScroll: true });
    }

    function closeMenu() {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
      toggle.focus({ preventScroll: true });
    }

    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.contains("is-open");
      isOpen ? closeMenu() : openMenu();
    });

    if (closeBtn) closeBtn.addEventListener("click", closeMenu);

    links.forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        closeMenu();
      }
    });
  }

  /* ----------------------------------------------------------
     initHeader — sticky/scrolled state
     ---------------------------------------------------------- */
  function initHeader() {
    const header = document.querySelector("[data-site-header]");
    if (!header) return;

    function updateHeader() {
      if (window.scrollY > 24) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  /* ----------------------------------------------------------
     initScrollReveal — IntersectionObserver fade/reveal
     ---------------------------------------------------------- */
  function initScrollReveal() {
    const targets = document.querySelectorAll(".reveal, .editorial-image");
    if (!targets.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -60px 0px" }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* ----------------------------------------------------------
     initParallax — subtle hero parallax on mouse move
     ---------------------------------------------------------- */
  function initParallax() {
    const bg = document.querySelector("[data-hero-parallax]");
    if (!bg) return;

    if (prefersReducedMotion || isTouchDevice || window.innerWidth < 768) {
      return;
    }

    const strength = 14;
    let frame = null;

    function handleMove(e) {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * strength;
        const y = (e.clientY / window.innerHeight - 0.5) * strength;
        bg.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.05)`;
        frame = null;
      });
    }

    window.addEventListener("mousemove", handleMove, { passive: true });
  }

  /* ----------------------------------------------------------
     initExperiences — render menu list + experience detail page
     ---------------------------------------------------------- */
  function initExperiences() {
    renderMenuList();
    renderExperienceDetail();
  }

  function svgArrow() {
    return (
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>"
    );
  }

  function renderMenuList() {
    const list = document.querySelector("[data-menu-list]");
    if (!list) return;

    const markup = experiences
      .map(
        (exp) => `
      <li class="menu-item reveal">
        <span class="menu-item-num" aria-hidden="true">${exp.number}</span>
        <div class="menu-item-info">
          <h3 class="h3">${exp.name}</h3>
          <p class="body" style="margin-bottom:14px;">${exp.summary}</p>
          <div class="menu-item-actions">
            <div class="menu-item-meta">
              <span class="caption">${exp.duration}</span>
              <span class="menu-item-rule" aria-hidden="true"></span>
              <span class="menu-item-price">${exp.price}</span>
            </div>
            <a class="link-arrow" href="experience.html?id=${exp.id}">
              Discover ${svgArrow()}
            </a>
          </div>
        </div>
        <a class="menu-item-figure" href="experience.html?id=${exp.id}" aria-label="View ${exp.name} experience">
          <span class="photo ${exp.photo}"></span>
        </a>
      </li>`
      )
      .join("");

    list.innerHTML = markup;
    initScrollReveal();
  }

  function renderExperienceDetail() {
    const root = document.querySelector("[data-experience-detail]");
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const experience =
      experiences.find((exp) => exp.id === id) || experiences[0];

    document.title = `${experience.name} — Ruby Spa`;

    root.querySelector("[data-exp-eyebrow]").textContent = "EXPERIENCE";
    root.querySelector("[data-exp-name]").textContent = experience.name;
    root.querySelector("[data-exp-duration]").textContent =
      experience.duration;
    root.querySelector("[data-exp-price]").textContent = experience.price;
    root.querySelector("[data-exp-summary]").textContent = experience.summary;
    root.querySelector("[data-exp-expect]").textContent =
      experience.whatToExpect;

    const infoList = root.querySelector("[data-exp-info]");
    if (infoList) {
      infoList.innerHTML = experience.info
        .map((item) => `<li>${item}</li>`)
        .join("");
    }

    const figure = root.querySelector("[data-exp-figure]");
    if (figure) {
      figure.className = `photo ${experience.photo}`;
    }

    const bookBtn = root.querySelector("[data-exp-book]");
    if (bookBtn) {
      bookBtn.textContent = `Book ${experience.name}`;
    }

    // Related experiences (excluding the current one)
    const related = document.querySelector("[data-exp-related]");
    if (related) {
      const others = experiences.filter((exp) => exp.id !== experience.id);
      related.innerHTML = others
        .map(
          (exp) => `
        <li class="menu-item reveal">
          <span class="menu-item-num" aria-hidden="true">${exp.number}</span>
          <div class="menu-item-info">
            <h3 class="h3">${exp.name}</h3>
            <div class="menu-item-actions">
              <div class="menu-item-meta">
                <span class="caption">${exp.duration}</span>
                <span class="menu-item-rule" aria-hidden="true"></span>
                <span class="menu-item-price">${exp.price}</span>
              </div>
              <a class="link-arrow" href="experience.html?id=${exp.id}">Discover ${svgArrow()}</a>
            </div>
          </div>
          <a class="menu-item-figure" href="experience.html?id=${exp.id}" aria-label="View ${exp.name} experience">
            <span class="photo ${exp.photo}"></span>
          </a>
        </li>`
        )
        .join("");
    }

    initScrollReveal();
  }

  /* ----------------------------------------------------------
     initBooking — wire up all Book Now CTAs
     ---------------------------------------------------------- */
  function initBooking() {
    const buttons = document.querySelectorAll("[data-book-now]");
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      if (bookingUrl) {
        if (btn.tagName === "A") {
          btn.href = bookingUrl;
          btn.target = "_blank";
          btn.rel = "noopener noreferrer";
        } else {
          btn.addEventListener("click", () => {
            window.open(bookingUrl, "_blank", "noopener,noreferrer");
          });
        }
      } else {
        btn.setAttribute("aria-disabled", "true");
        btn.title = "Booking coming soon";
      }
    });
  }

  /* ----------------------------------------------------------
     initCursor — discreet custom cursor (desktop only)
     ---------------------------------------------------------- */
  function initCursor() {
    if (isTouchDevice || prefersReducedMotion || window.innerWidth < 992) {
      return;
    }

    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    dot.setAttribute("aria-hidden", "true");
    document.body.appendChild(dot);

    let x = 0;
    let y = 0;

    window.addEventListener(
      "mousemove",
      (e) => {
        x = e.clientX;
        y = e.clientY;
        dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        dot.classList.add("is-active");
      },
      { passive: true }
    );

    const expandables = document.querySelectorAll(
      "a, button, .menu-item-figure, .photo"
    );
    expandables.forEach((el) => {
      el.addEventListener("mouseenter", () => dot.classList.add("is-expanded"));
      el.addEventListener("mouseleave", () =>
        dot.classList.remove("is-expanded")
      );
    });

    document.addEventListener("mouseleave", () =>
      dot.classList.remove("is-active")
    );
  }

  /* ----------------------------------------------------------
     initFooterYear
     ---------------------------------------------------------- */
  function initFooterYear() {
    const el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------
     initActiveNav — highlight current page in nav
     ---------------------------------------------------------- */
  function initActiveNav() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-nav-link]").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        link.classList.add("is-active");
      }
    });
  }

  /* ----------------------------------------------------------
     Boot
     ---------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initHeader();
    initActiveNav();
    initParallax();
    initExperiences();
    initBooking();
    initCursor();
    initFooterYear();
    initScrollReveal();
  });
})();
