const body = document.body;
const siteHeader = document.getElementById("siteHeader");

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileNav = document.getElementById("mobileNav");
const mobileNavBackdrop = document.getElementById("mobileNavBackdrop");
const mobileNavLinks = document.querySelectorAll(".mobile-nav__links a");

const requestForm = document.getElementById("requestForm");
const formMessage = document.getElementById("formMessage");

const navLinks = document.querySelectorAll(
  '.main-nav a[href^="#"], .mobile-nav__links a[href^="#"]'
);
const sections = document.querySelectorAll("main section[id]");

const revealElements = document.querySelectorAll(
  ".section, .pause-section, .soft-card, .glass-card, .advantage-item, .photo-card, .steps-card, .form-side, .form-card"
);

/* ==========================================================================
   COLLECTIONS
   ========================================================================== */

const collectionTabs = Array.from(document.querySelectorAll(".collection-tab"));
const collectionShowcase = document.getElementById("collectionShowcase");
const collectionShowcaseImageCurrent = document.getElementById("collectionShowcaseImageCurrent");
const collectionShowcaseImageNext = document.getElementById("collectionShowcaseImageNext");
const collectionShowcaseMeta = document.getElementById("collectionShowcaseMeta");
const collectionShowcaseTitle = document.getElementById("collectionShowcaseTitle");
const collectionShowcaseText = document.getElementById("collectionShowcaseText");
const collectionShowcaseTones = document.getElementById("collectionShowcaseTones");
const collectionPrev = document.getElementById("collectionPrev");
const collectionNext = document.getElementById("collectionNext");

const COLLECTION_IMAGE_DURATION = 1200;
const COLLECTION_TEXT_OUT_DELAY = 220;
const COLLECTION_AUTOPLAY_DELAY = 6200;

const collectionsData = [
  {
    meta: "Коллекция 01",
    title: "Империя",
    text: "Классика с декоративной выразительностью для интерьеров, где важны масштаб, ритм и статусная подача.",
    tones: "Белый / слоновая кость",
    image: "./img/empire-main.jpg",
    alt: "Коллекция Империя"
  },
  {
    meta: "Коллекция 02",
    title: "Верди",
    text: "Орнамент и ритм в благородной подаче для выразительных классических интерьеров.",
    tones: "Слоновая кость",
    image: "./img/verdi-main.jpg",
    alt: "Коллекция Верди"
  },
  {
    meta: "Коллекция 03",
    title: "Кастилия",
    text: "Строгий классический строй с собранной геометрией и более контрастной подачей пространства.",
    tones: "Белый / чёрный",
    image: "./img/castilia-main.jpg",
    alt: "Коллекция Кастилия"
  },
  {
    meta: "Коллекция 04",
    title: "Версаль",
    text: "Масштаб, объём и статус для интерьеров, где важны выразительность и завершённость образа.",
    tones: "Белый глянец / бежевый глянец",
    image: "./img/versailles-main.jpg",
    alt: "Коллекция Версаль"
  },
  {
    meta: "Коллекция 05",
    title: "Сиртаки",
    text: "Современная классика для спокойных премиальных интерьеров с мягкой цветовой вариативностью.",
    tones: "Белый / миндаль / малахит",
    image: "./img/sirtaki-main.jpg",
    alt: "Коллекция Сиртаки"
  },
  {
    meta: "Коллекция 06",
    title: "Дубай",
    text: "Премиальная линия с чистой подачей, ясной геометрией и белым матовым исполнением.",
    tones: "Белый матовый",
    image: "./img/dubai-main.jpg",
    alt: "Коллекция Дубай"
  }
];

/* ==========================================================================
   STATE
   ========================================================================== */

let lastScrollY = window.scrollY;
let mobileMenuOpen = false;
let ticking = false;

let collectionAutoplayId = null;
let currentCollectionIndex = 0;
let isCollectionAnimating = false;
let collectionAnimationTimeout = null;

/* ==========================================================================
   HELPERS
   ========================================================================== */

function getHeaderOffset() {
  if (window.innerWidth <= 768) return 84;
  if (window.innerWidth <= 1024) return 92;
  return 108;
}

function clearCollectionAnimationTimeout() {
  if (collectionAnimationTimeout) {
    window.clearTimeout(collectionAnimationTimeout);
    collectionAnimationTimeout = null;
  }
}

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
}

/* ==========================================================================
   HEADER / NAV
   ========================================================================== */

function setHeaderState() {
  if (!siteHeader) return;

  const currentScrollY = window.scrollY;

  siteHeader.classList.toggle("is-scrolled", currentScrollY > 20);

  if (!mobileMenuOpen) {
    if (currentScrollY > lastScrollY && currentScrollY > 220) {
      siteHeader.classList.add("is-hidden");
    } else {
      siteHeader.classList.remove("is-hidden");
    }
  }

  lastScrollY = currentScrollY;
}

function updateActiveNavLink() {
  if (!sections.length || !navLinks.length) return;

  const scrollPosition = window.scrollY + getHeaderOffset() + 52;
  let currentId = "";

  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (scrollPosition >= top && scrollPosition < bottom) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const isActive = href === `#${currentId}`;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function onScroll() {
  if (ticking) return;

  window.requestAnimationFrame(() => {
    setHeaderState();
    updateActiveNavLink();
    ticking = false;
  });

  ticking = true;
}

/* ==========================================================================
   MOBILE MENU
   ========================================================================== */

function openMobileMenu() {
  if (!mobileNav || !mobileMenuBtn) return;

  mobileMenuOpen = true;
  mobileNav.hidden = false;

  requestAnimationFrame(() => {
    mobileNav.classList.add("is-open");
    mobileMenuBtn.classList.add("is-open");
  });

  mobileMenuBtn.setAttribute("aria-expanded", "true");
  mobileMenuBtn.setAttribute("aria-label", "Закрыть меню");
  body.classList.add("menu-open");

  if (siteHeader) {
    siteHeader.classList.remove("is-hidden");
  }
}

function closeMobileMenu() {
  if (!mobileNav || !mobileMenuBtn) return;

  mobileMenuOpen = false;
  mobileNav.classList.remove("is-open");
  mobileMenuBtn.classList.remove("is-open");

  mobileMenuBtn.setAttribute("aria-expanded", "false");
  mobileMenuBtn.setAttribute("aria-label", "Открыть меню");
  body.classList.remove("menu-open");

  window.setTimeout(() => {
    if (!mobileMenuOpen) {
      mobileNav.hidden = true;
    }
  }, 360);
}

function bindMenuEvents() {
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      if (mobileMenuOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener("click", closeMobileMenu);
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenuOpen) {
      closeMobileMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024 && mobileMenuOpen) {
      closeMobileMenu();
    }
  });
}

/* ==========================================================================
   SMOOTH SCROLL
   ========================================================================== */

function bindSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      event.preventDefault();

      const targetPosition =
        targetElement.getBoundingClientRect().top +
        window.pageYOffset -
        getHeaderOffset() +
        2;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    });
  });
}

/* ==========================================================================
   REVEAL
   ========================================================================== */

function initReveal() {
  if (!revealElements.length) return;

  body.classList.add("js");

  revealElements.forEach((element) => {
    element.classList.add("reveal");
  });

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible", "active");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible", "active");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

/* ==========================================================================
   PHONE MASK
   ========================================================================== */

function formatPhone(value) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  let normalized = digits;

  if (normalized.startsWith("8")) {
    normalized = "7" + normalized.slice(1);
  }

  if (!normalized.startsWith("7")) {
    normalized = "7" + normalized;
  }

  normalized = normalized.slice(0, 11);

  let result = "+7";

  if (normalized.length > 1) result += " (" + normalized.slice(1, 4);
  if (normalized.length >= 4) result += ")";
  if (normalized.length > 4) result += " " + normalized.slice(4, 7);
  if (normalized.length > 7) result += "-" + normalized.slice(7, 9);
  if (normalized.length > 9) result += "-" + normalized.slice(9, 11);

  return result;
}

function initPhoneMask() {
  const phoneInput = document.getElementById("phone");
  if (!phoneInput) return;

  phoneInput.addEventListener("input", (event) => {
    event.target.value = formatPhone(event.target.value);
  });

  phoneInput.addEventListener("focus", (event) => {
    if (!event.target.value.trim()) {
      event.target.value = "+7";
    }
  });
}

/* ==========================================================================
   FORM
   ========================================================================== */

function setFormMessage(text, type = "") {
  if (!formMessage) return;

  formMessage.textContent = text;
  formMessage.classList.remove("form-message--error", "form-message--success");

  if (type === "error") {
    formMessage.classList.add("form-message--error");
  }

  if (type === "success") {
    formMessage.classList.add("form-message--success");
  }
}

function initForm() {
  if (!requestForm) return;

  requestForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = requestForm.elements.name?.value.trim() || "";
    const phone = requestForm.elements.phone?.value.trim() || "";
    const phoneDigits = phone.replace(/\D/g, "");

    if (!name) {
      setFormMessage("Пожалуйста, укажите имя.", "error");
      return;
    }

    if (name.length < 2) {
      setFormMessage("Имя должно быть чуть длиннее.", "error");
      return;
    }

    if (phoneDigits.length < 11) {
      setFormMessage("Пожалуйста, укажите корректный телефон.", "error");
      return;
    }

    setFormMessage("Спасибо. Заявка принята, мы свяжемся с вами.", "success");
    requestForm.reset();
  });
}

/* ==========================================================================
   COLLECTIONS SHOWCASE
   ========================================================================== */

function setActiveCollectionTab(index) {
  collectionTabs.forEach((tab, tabIndex) => {
    const isActive = tabIndex === index;

    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.setAttribute("tabindex", isActive ? "0" : "-1");
  });

  const activeTab = collectionTabs[index];
  if (activeTab && collectionShowcase) {
    collectionShowcase.setAttribute("aria-labelledby", activeTab.id);
  }
}

function updateCollectionText(item) {
  if (
    !collectionShowcase ||
    !collectionShowcaseMeta ||
    !collectionShowcaseTitle ||
    !collectionShowcaseText ||
    !collectionShowcaseTones
  ) {
    return;
  }

  collectionShowcase.classList.add("is-text-changing");

  window.setTimeout(() => {
    collectionShowcaseMeta.textContent = item.meta;
    collectionShowcaseTitle.textContent = item.title;
    collectionShowcaseText.textContent = item.text;
    collectionShowcaseTones.textContent = item.tones;

    requestAnimationFrame(() => {
      collectionShowcase.classList.remove("is-text-changing");
    });
  }, COLLECTION_TEXT_OUT_DELAY);
}

async function updateCollectionShowcase(index, { immediate = false } = {}) {
  const item = collectionsData[index];

  if (
    !item ||
    !collectionShowcase ||
    !collectionShowcaseImageCurrent ||
    !collectionShowcaseImageNext ||
    !collectionShowcaseMeta ||
    !collectionShowcaseTitle ||
    !collectionShowcaseText ||
    !collectionShowcaseTones
  ) {
    return;
  }

  if (isCollectionAnimating && !immediate) return;
  if (index === currentCollectionIndex && !immediate) return;

  setActiveCollectionTab(index);

  if (immediate) {
    collectionShowcaseMeta.textContent = item.meta;
    collectionShowcaseTitle.textContent = item.title;
    collectionShowcaseText.textContent = item.text;
    collectionShowcaseTones.textContent = item.tones;

    collectionShowcaseImageCurrent.src = item.image;
    collectionShowcaseImageCurrent.alt = item.alt;
    collectionShowcaseImageCurrent.style.transform = "scale(1.015)";
    collectionShowcaseImageCurrent.style.filter = "blur(0)";
    collectionShowcaseImageNext.src = item.image;
    collectionShowcaseImageNext.alt = "";

    currentCollectionIndex = index;
    return;
  }

  isCollectionAnimating = true;
  clearCollectionAnimationTimeout();

  try {
    await preloadImage(item.image);
  } catch (error) {
    collectionShowcaseMeta.textContent = item.meta;
    collectionShowcaseTitle.textContent = item.title;
    collectionShowcaseText.textContent = item.text;
    collectionShowcaseTones.textContent = item.tones;
    collectionShowcaseImageCurrent.src = item.image;
    collectionShowcaseImageCurrent.alt = item.alt;
    collectionShowcaseImageNext.src = item.image;
    collectionShowcaseImageNext.alt = "";
    currentCollectionIndex = index;
    isCollectionAnimating = false;
    return;
  }

  collectionShowcaseImageNext.src = item.image;
  collectionShowcaseImageNext.alt = "";

  updateCollectionText(item);

  requestAnimationFrame(() => {
    collectionShowcase.classList.add("is-changing");
  });

  collectionAnimationTimeout = window.setTimeout(() => {
    collectionShowcaseImageCurrent.src = item.image;
    collectionShowcaseImageCurrent.alt = item.alt;
    collectionShowcaseImageCurrent.style.transform = "scale(1.015)";
    collectionShowcaseImageCurrent.style.filter = "blur(0)";

    collectionShowcaseImageNext.src = item.image;
    collectionShowcaseImageNext.alt = "";
    collectionShowcaseImageNext.style.transform = "scale(1.07)";
    collectionShowcaseImageNext.style.filter = "blur(4px)";

    collectionShowcase.classList.remove("is-changing");
    currentCollectionIndex = index;
    isCollectionAnimating = false;
    collectionAnimationTimeout = null;
  }, COLLECTION_IMAGE_DURATION);
}

function nextCollectionSlide() {
  const nextIndex = (currentCollectionIndex + 1) % collectionsData.length;
  updateCollectionShowcase(nextIndex);
}

function prevCollectionSlide() {
  const prevIndex =
    (currentCollectionIndex - 1 + collectionsData.length) % collectionsData.length;
  updateCollectionShowcase(prevIndex);
}

function stopCollectionAutoplay() {
  if (collectionAutoplayId) {
    window.clearInterval(collectionAutoplayId);
    collectionAutoplayId = null;
  }
}

function startCollectionAutoplay() {
  if (!collectionTabs.length || !collectionShowcase) return;

  stopCollectionAutoplay();

  collectionAutoplayId = window.setInterval(() => {
    if (!isCollectionAnimating) {
      nextCollectionSlide();
    }
  }, COLLECTION_AUTOPLAY_DELAY);
}

function restartCollectionAutoplay() {
  startCollectionAutoplay();
}

function initCollectionKeyboard() {
  if (!collectionTabs.length) return;

  collectionTabs.forEach((tab, tabIndex) => {
    tab.addEventListener("keydown", (event) => {
      let nextIndex = null;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = (tabIndex + 1) % collectionTabs.length;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = (tabIndex - 1 + collectionTabs.length) % collectionTabs.length;
      }

      if (event.key === "Home") {
        nextIndex = 0;
      }

      if (event.key === "End") {
        nextIndex = collectionTabs.length - 1;
      }

      if (nextIndex === null) return;

      event.preventDefault();
      collectionTabs[nextIndex].focus();
      updateCollectionShowcase(nextIndex);
      restartCollectionAutoplay();
    });
  });
}

function initCollectionShowcase() {
  if (
    !collectionTabs.length ||
    !collectionShowcase ||
    !collectionShowcaseImageCurrent ||
    !collectionShowcaseImageNext ||
    !collectionShowcaseMeta ||
    !collectionShowcaseTitle ||
    !collectionShowcaseText ||
    !collectionShowcaseTones
  ) {
    return;
  }

  collectionTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const index = Number(tab.dataset.collection);
      if (Number.isNaN(index)) return;

      updateCollectionShowcase(index);
      restartCollectionAutoplay();
    });
  });

  if (collectionNext) {
    collectionNext.addEventListener("click", () => {
      nextCollectionSlide();
      restartCollectionAutoplay();
    });
  }

  if (collectionPrev) {
    collectionPrev.addEventListener("click", () => {
      prevCollectionSlide();
      restartCollectionAutoplay();
    });
  }

  collectionShowcase.addEventListener("mouseenter", stopCollectionAutoplay);
  collectionShowcase.addEventListener("mouseleave", startCollectionAutoplay);
  collectionShowcase.addEventListener("focusin", stopCollectionAutoplay);

  collectionShowcase.addEventListener("focusout", (event) => {
    if (!collectionShowcase.contains(event.relatedTarget)) {
      startCollectionAutoplay();
    }
  });

  initCollectionKeyboard();
  updateCollectionShowcase(0, { immediate: true });
  startCollectionAutoplay();
}

/* ==========================================================================
   INIT
   ========================================================================== */

function init() {
  setHeaderState();
  updateActiveNavLink();
  bindMenuEvents();
  bindSmoothScroll();
  initReveal();
  initPhoneMask();
  initForm();
  initCollectionShowcase();
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("DOMContentLoaded", init);
