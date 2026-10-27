(function () {
  "use strict";

  window.balajuReady = true;
  const root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  // ---------- Títulos divididos en palabras ----------
  document.querySelectorAll(".split").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", words.join(" "));
    el.innerHTML = words
      .map((w, i) => '<span class="w" aria-hidden="true"><span style="--i:' + i + '">' + w + "</span></span>")
      .join(" ");
  });

  // ---------- Índices para las entradas escalonadas ----------
  document.querySelectorAll("[data-stagger]").forEach((group) => {
    [...group.children].forEach((child, i) => child.style.setProperty("--i", i));
  });
  document.querySelectorAll(".dishes").forEach((list) => {
    [...list.children].forEach((li, i) => li.style.setProperty("--i", i));
  });

  // ---------- Revelar al hacer scroll (una sola vez) ----------
  const revealables = document.querySelectorAll("[data-reveal], [data-stagger], .split:not(#hero-title)");
  if ("IntersectionObserver" in window) {
    const revealer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        revealer.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    const neonObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        neonObserver.unobserve(entry.target);
      });
    }, { threshold: 0.45 });
    revealables.forEach((el) => {
      // El neón se enciende cuando ya se ve buena parte del letrero
      if (el.dataset.reveal === "neon") neonObserver.observe(el);
      else revealer.observe(el);
    });
  } else {
    revealables.forEach((el) => el.classList.add("in"));
  }
  // El título principal entra al cargar
  requestAnimationFrame(() => document.getElementById("hero-title").classList.add("in"));

  // ---------- Pausar movimientos continuos fuera de pantalla ----------
  const ribbon = document.querySelector(".ribbon");
  const track = ribbon.querySelector(".ribbon-track");
  track.innerHTML += track.innerHTML; // segunda copia para el bucle continuo
  const hero = document.querySelector(".hero");
  if ("IntersectionObserver" in window) {
    const pauser = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("paused", !entry.isIntersecting));
    });
    pauser.observe(ribbon);
    pauser.observe(hero);
  }

  // ---------- Hora del centro de México ----------
  // Horario en minutos desde medianoche. 0 = domingo.
  const HOURS = {
    0: [510, 1320], 6: [510, 1320],                                                 // S–D 8:30–22:00
    1: [480, 1320], 2: [480, 1320], 3: [480, 1320], 4: [480, 1320], 5: [480, 1320] // L–V 8:00–22:00
  };
  const DAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

  function mexicoNow() {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Mexico_City", weekday: "short", hour: "numeric", minute: "numeric", hour12: false
    }).formatToParts(new Date());
    const get = (type) => parts.find((p) => p.type === type).value;
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { day, minutes: (parseInt(get("hour"), 10) % 24) * 60 + parseInt(get("minute"), 10) };
  }

  function fmt(min) {
    const h = Math.floor(min / 60), m = min % 60;
    return h + ":" + String(m).padStart(2, "0");
  }

  // ---------- Menú móvil ----------
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const toggleLabel = toggle.querySelector(".sr-only");

  function setNav(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggleLabel.textContent = open ? "Cerrar menú" : "Abrir menú";
  }
  toggle.addEventListener("click", () => setNav(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setNav(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setNav(false); });

  // ---------- Sombra del header ----------
  const header = document.querySelector(".site-header");
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 8);
    // Se oculta al bajar y vuelve al subir; nunca con el menú móvil abierto
    if (Math.abs(y - lastY) > 6) {
      header.classList.toggle("hide", y > lastY && y > 400 && !nav.classList.contains("open"));
      lastY = y;
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Enlace activo en la navegación ----------
  if ("IntersectionObserver" in window) {
    const links = new Map([...nav.querySelectorAll('a[href^="#"]:not(.btn)')].map((a) => [a.getAttribute("href").slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.remove("active"));
        const link = links.get(entry.target.id);
        if (link) link.classList.add("active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));
  }

  // ---------- Mañana / Tarde / Noche ----------
  const moments = [...document.querySelectorAll(".moment")];

  function openMoment(target) {
    moments.forEach((m) => {
      const isOpen = m === target;
      m.classList.toggle("open", isOpen);
      m.querySelector(".moment-toggle").setAttribute("aria-expanded", String(isOpen));
      const body = m.querySelector(".moment-body");
      body.inert = !isOpen;
      body.setAttribute("aria-hidden", String(!isOpen));
    });
  }

  function currentMoment(minutes) {
    if (minutes < 13 * 60) return "manana";
    if (minutes < 18 * 60) return "tarde";
    return "noche";
  }

  moments.forEach((m) => {
    m.querySelector(".moment-toggle").addEventListener("click", () => openMoment(m));
  });

  // ---------- Pestañas del menú ----------
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const ink = document.querySelector(".tab-ink");

  function moveInk(tab) {
    ink.style.transform = "translateX(" + tab.offsetLeft + "px) scaleX(" + tab.offsetWidth + ")";
  }

  function selectTab(tab) {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !selected;
    });
    moveInk(tab);
    tab.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (e) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!step) return;
      const next = tabs[(i + step + tabs.length) % tabs.length];
      selectTab(next);
      next.focus();
    });
  });

  const syncInk = () => moveInk(tabs.find((t) => t.getAttribute("aria-selected") === "true"));
  window.addEventListener("resize", syncInk);
  document.fonts && document.fonts.ready.then(syncInk);
  syncInk();

  // ---------- Abierto / cerrado, "Hoy" y momento actual ----------
  function update(first) {
    const { day, minutes } = mexicoNow();
    const [open, close] = HOURS[day];
    const isOpen = minutes >= open && minutes < close;

    const status = document.getElementById("openStatus");
    const text = status.querySelector(".status-text");
    status.classList.toggle("is-open", isOpen);
    status.classList.toggle("is-closed", !isOpen);
    if (isOpen) {
      text.textContent = "Abierto ahora, hasta las " + fmt(close);
    } else {
      const opensToday = minutes < open;
      const nextDay = opensToday ? day : (day + 1) % 7;
      const when = opensToday ? "hoy" : "mañana " + DAY_NAMES[nextDay];
      text.textContent = "Cerrado, abrimos " + when + " a las " + fmt(HOURS[nextDay][0]);
    }

    document.querySelectorAll("#hoursTable [data-days]").forEach((row) => {
      row.classList.toggle("today", row.dataset.days.split(",").map(Number).includes(day));
    });

    const now = currentMoment(minutes);
    moments.forEach((m) => { m.querySelector(".moment-now").hidden = !(isOpen && m.dataset.moment === now); });
    // Al cargar, abre el momento del día; cerrado, muestra la mañana siguiente.
    if (first) openMoment(moments.find((m) => m.dataset.moment === (isOpen ? now : "manana")));
  }
  update(true);
  setInterval(() => update(false), 60 * 1000);

  document.getElementById("year").textContent = new Date().getFullYear();
})();
