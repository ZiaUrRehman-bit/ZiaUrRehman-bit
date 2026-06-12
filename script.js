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

// Nav shadow on scroll
(function () {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// 3D tilt effect for cards
(function () {
  const els = document.querySelectorAll(".tilt");
  if (!els.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const MAX_ROTATE = 7; // degrees
  const LIFT = 18; // px

  els.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      el.classList.add("tilting");
      el.style.setProperty("--tz", LIFT + "px");
    });
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (0.5 - py) * 2 * MAX_ROTATE;
      const ry = (px - 0.5) * 2 * MAX_ROTATE;
      el.style.setProperty("--rx", rx.toFixed(2) + "deg");
      el.style.setProperty("--ry", ry.toFixed(2) + "deg");
    });
    el.addEventListener("mouseleave", () => {
      el.classList.remove("tilting");
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--tz", "0px");
    });
  });
})();

// Whole-site 3D network background (Three.js sphere, follows scroll)
(function () {
  const container = document.getElementById("hero3d");
  if (!container || typeof THREE === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / Math.max(window.innerHeight, 1),
    0.1,
    100
  );
  camera.position.set(0, 0, 9);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();
  group.position.set(1.6, 0.2, -1);
  scene.add(group);

  // Evenly distributed nodes on a sphere (Fibonacci sphere)
  const COUNT = 220;
  const RADIUS = 2.6;
  const colorA = new THREE.Color(0x3b82f6); // blue
  const colorB = new THREE.Color(0x7c3aed); // purple
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const verts = [];

  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    const v = new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(RADIUS);
    verts.push(v);
    positions[i * 3] = v.x;
    positions[i * 3 + 1] = v.y;
    positions[i * 3 + 2] = v.z;

    const c = colorA.clone().lerp(colorB, (y + 1) / 2);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  pointsGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  group.add(
    new THREE.Points(
      pointsGeo,
      new THREE.PointsMaterial({ size: 0.075, vertexColors: true, transparent: true, opacity: 0.9, sizeAttenuation: true })
    )
  );

  // Connect nearby nodes with thin lines (network look)
  const avgSpacing = RADIUS * Math.sqrt((4 * Math.PI) / COUNT);
  const threshold = avgSpacing * 1.4;
  const linePositions = [];
  for (let i = 0; i < COUNT; i++) {
    for (let j = i + 1; j < COUNT; j++) {
      if (verts[i].distanceTo(verts[j]) < threshold) {
        linePositions.push(verts[i].x, verts[i].y, verts[i].z, verts[j].x, verts[j].y, verts[j].z);
      }
    }
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePositions), 3));
  group.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.18 })));

  let mouseX = 0, mouseY = 0;
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  });

  // Track scroll so the sphere keeps turning/drifting as the page scrolls
  let scrollY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      scrollY = window.scrollY;
    },
    { passive: true }
  );

  function onResize() {
    const w = window.innerWidth, h = Math.max(window.innerHeight, 1);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", onResize);

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    group.rotation.y = t * 0.12 + scrollY * 0.0006;
    group.rotation.x = Math.sin(t * 0.2) * 0.12 + scrollY * 0.0002;
    group.rotation.z = scrollY * 0.00035;
    camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 0.8 - camera.position.y) * 0.04;
    renderer.render(scene, camera);
  }
  animate();
})();
