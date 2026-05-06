// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Cursor glow
(function () {
  const glow = document.getElementById("cursorGlow");
  if (!glow) return;
  let tx = 0, ty = 0, cx = 0, cy = 0;
  document.addEventListener("mousemove", (e) => {
    tx = e.clientX; ty = e.clientY;
  });
  function loop() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    glow.style.left = cx + "px";
    glow.style.top = cy + "px";
    requestAnimationFrame(loop);
  }
  loop();
})();

// Scroll reveal
(function () {
  const targets = document.querySelectorAll(
    ".section-head, .about-text, .about-stats, .research-card, .pub-item, .tl-item, .proj-card, .skill-block, .contact-text, .contact-links"
  );
  targets.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // small stagger inside section
          setTimeout(() => entry.target.classList.add("visible"), i * 60);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
  );
  targets.forEach((el) => io.observe(el));
})();

// Project card mouse-tracked gradient
(function () {
  document.querySelectorAll(".proj-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty("--mx", x + "%");
      card.style.setProperty("--my", y + "%");
    });
  });
})();

// Smooth-scroll offset for fixed nav
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();
