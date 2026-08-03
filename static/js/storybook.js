/* ==========================================================================
   A LETTER FOR HIMANSHI - Storybook Interactive Chapter Animations Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // Disable GSAP ScrollTrigger auto-refresh on mobile vertical resize (address bar toggle)
  ScrollTrigger.config({
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
  });

  initChapterReveals();
  initChapterCanvases();
});

/* ==========================================================================
   1. CHAPTER SCROLLTRIGGER REVEALS
   ========================================================================== */
function initChapterReveals() {
  const chapterSections = document.querySelectorAll('.chapter-section');

  // Pre-calculate and lock fixed height once on every .chapter-card
  chapterSections.forEach((section) => {
    const card = section.querySelector('.chapter-card');
    if (card) {
      const fullHeight = card.getBoundingClientRect().height;
      if (fullHeight > 0) {
        card.style.height = `${Math.ceil(fullHeight)}px`;
        card.style.minHeight = `${Math.ceil(fullHeight)}px`;
      }
    }
  });

  chapterSections.forEach((section) => {
    const card = section.querySelector('.chapter-card');
    const badge = section.querySelector('.chapter-badge');
    const title = section.querySelector('.chapter-title');
    const paragraphs = section.querySelectorAll('.chapter-text p');

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true
      }
    });

    if (card) {
      timeline.fromTo(card, 
        { opacity: 0, scale: 0.98 }, 
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
      );
    }

    if (badge) {
      timeline.fromTo(badge,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' },
        "-=0.5"
      );
    }

    if (title) {
      timeline.fromTo(title,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        "-=0.3"
      );
    }

    if (paragraphs.length > 0) {
      timeline.fromTo(paragraphs,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.12, ease: 'power2.out' },
        "-=0.2"
      );
    }

    const memoryBlocks = section.querySelectorAll('.memory-quote-block, .memory-ending-block');
    if (memoryBlocks.length > 0) {
      timeline.fromTo(memoryBlocks,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.35, ease: 'power2.out' },
        "-=0.2"
      );
    }
  });
}

/* ==========================================================================
   2. INDIVIDUAL CHAPTER CANVAS BACKGROUND ANIMATIONS
   ========================================================================== */
function initChapterCanvases() {
  initCh1Canvas(); // Airplane floating
  initCh3Canvas(); // Campfire sparks
  initChMemoriesCanvas(); // Floating memory particles
  initCh8Canvas(); // Fireworks
  initCh9Canvas(); // Rain
  initCh10Canvas(); // Garba Bokeh
  initChSaidCanvas(); // Gentle starlight dots
  initChDifferentlyCanvas(); // Soft drifting stars
  initChMoonCanvas(); // Soft moonlight dust
  initChLearnedCanvas(); // Soft warm light particles
  initFinalCanvas(); // Floating Lanterns
}

// Chapter 15: Soft Moonlight Dust Canvas
function initChMoonCanvas() {
  const canvas = document.getElementById('canvas-ch-moon');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 18 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    alpha: Math.random() * 0.5 + 0.2,
    speedY: - (Math.random() * 0.15 + 0.05)
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y += p.speedY;
      if (p.y < -10) p.y = canvas.height + 10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 244, 224, ${Math.max(0.1, p.alpha)})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#fff4e0';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// Chapter 14: Soft Drifting Stars Canvas
function initChDifferentlyCanvas() {
  const canvas = document.getElementById('canvas-ch-differently');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({ length: 22 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2.2 + 1,
    alpha: Math.random() * 0.6 + 0.2,
    speedX: Math.random() * 0.3 - 0.15,
    speedY: - (Math.random() * 0.2 + 0.1)
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.x += s.speedX;
      s.y += s.speedY;
      if (s.y < -10) s.y = canvas.height + 10;
      if (s.x < -10) s.x = canvas.width + 10;
      if (s.x > canvas.width + 10) s.x = -10;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230, 230, 250, ${Math.max(0.1, s.alpha)})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#e6e6fa';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// Chapter 11: Gentle Starlight Dots Canvas
function initChSaidCanvas() {
  const canvas = document.getElementById('canvas-ch-said');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const dots = Array.from({ length: 30 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 0.8,
    alpha: Math.random() * 0.7 + 0.2,
    vAlpha: (Math.random() * 0.01 + 0.005) * (Math.random() < 0.5 ? 1 : -1)
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(d => {
      d.alpha += d.vAlpha;
      if (d.alpha > 0.95 || d.alpha < 0.15) d.vAlpha = -d.vAlpha;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 230, 240, ${Math.max(0.1, d.alpha)})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#ffe6f0';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// Chapter 13: Soft Warm Light Canvas
function initChLearnedCanvas() {
  const canvas = document.getElementById('canvas-ch-learned');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 20 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 3 + 1,
    alpha: Math.random() * 0.5 + 0.3,
    speedY: - (Math.random() * 0.3 + 0.1),
    pulse: Math.random() * 0.015
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y += p.speedY;
      p.alpha += Math.sin(Date.now() * 0.0015) * p.pulse;
      if (p.y < -10) p.y = canvas.height + 10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 215, 0, ${Math.max(0.15, Math.min(0.75, p.alpha))})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffd700';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// Chapter 5: Floating Memory Particles Canvas
function initChMemoriesCanvas() {
  const canvas = document.getElementById('canvas-ch-memories');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 25 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2.5 + 1,
    alpha: Math.random() * 0.6 + 0.2,
    speedY: - (Math.random() * 0.4 + 0.1),
    pulse: Math.random() * 0.02
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y += p.speedY;
      p.alpha += Math.sin(Date.now() * 0.002) * p.pulse;
      if (p.y < -10) p.y = canvas.height + 10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 183, 197, ${Math.max(0.1, Math.min(0.8, p.alpha))})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ffb7c5';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// Chapter 1: Paper Airplane Canvas
function initCh1Canvas() {
  const canvas = document.getElementById('canvas-ch1');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let planeX = -50;
  let planeY = canvas.height * 0.4;
  let angle = 0;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    planeX += 1.5;
    planeY += Math.sin(planeX * 0.02) * 0.8;
    if (planeX > canvas.width + 80) {
      planeX = -80;
      planeY = canvas.height * 0.3 + Math.random() * 100;
    }

    ctx.save();
    ctx.translate(planeX, planeY);
    ctx.rotate(Math.sin(planeX * 0.02) * 0.1);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillStyle = 'rgba(255, 183, 197, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffd700';

    // Paper Airplane Shape
    ctx.beginPath();
    ctx.moveTo(30, 0);
    ctx.lineTo(-20, -15);
    ctx.lineTo(-10, 0);
    ctx.lineTo(-20, 15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Dotted flight trail line
    ctx.restore();
    ctx.save();
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.4);
    ctx.lineTo(planeX - 20, planeY);
    ctx.stroke();
    ctx.restore();

    requestAnimationFrame(animate);
  }
  animate();
}

// Chapter 3: Campfire Sparks Canvas
function initCh3Canvas() {
  const canvas = document.getElementById('canvas-ch3');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const sparks = [];
  for (let i = 0; i < 40; i++) {
    sparks.push({
      x: canvas.width * 0.5 + (Math.random() - 0.5) * 60,
      y: canvas.height * 0.85,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -(Math.random() * 2 + 1),
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.8 + 0.2
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sparks.forEach(s => {
      s.y += s.vy;
      s.x += s.vx;
      s.alpha -= 0.008;

      if (s.alpha <= 0 || s.y < 0) {
        s.x = canvas.width * 0.5 + (Math.random() - 0.5) * 60;
        s.y = canvas.height * 0.85;
        s.vx = (Math.random() - 0.5) * 1.5;
        s.vy = -(Math.random() * 2 + 1);
        s.alpha = 1;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, s.alpha);
      ctx.fillStyle = '#ff7700';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ffd700';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(animate);
  }
  animate();
}

// Chapter 8: Fireworks Spark Bursts Canvas
function initCh8Canvas() {
  const canvas = document.getElementById('canvas-ch8');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  function createBurst() {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * (canvas.height * 0.5);
    const color = Math.random() > 0.5 ? '#ffb7c5' : '#ffd700';

    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: color
      });
    }
  }

  setInterval(createBurst, 2000);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.015;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// Chapter 9: Rain Droplets Canvas
function initCh9Canvas() {
  const canvas = document.getElementById('canvas-ch9');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const drops = [];
  for (let i = 0; i < 50; i++) {
    drops.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 15 + 10,
      vy: Math.random() * 8 + 6,
      opacity: Math.random() * 0.4 + 0.2
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(230, 230, 250, 0.4)';
    ctx.lineWidth = 1.2;

    drops.forEach(d => {
      d.y += d.vy;
      if (d.y > canvas.height) {
        d.y = -20;
        d.x = Math.random() * canvas.width;
      }
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 1, d.y + d.length);
      ctx.stroke();
    });

    requestAnimationFrame(animate);
  }
  animate();
}

// Chapter 10: Garba Festive Bokeh Lights Canvas
function initCh10Canvas() {
  const canvas = document.getElementById('canvas-ch10');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const bokehs = [];
  const colors = ['#ff6b8b', '#ffd700', '#c084fc', '#ffaa00'];

  for (let i = 0; i < 25; i++) {
    bokehs.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 20 + 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.4 + 0.1,
      vAlpha: (Math.random() - 0.5) * 0.005
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bokehs.forEach(b => {
      b.alpha += b.vAlpha;
      if (b.alpha > 0.5 || b.alpha < 0.1) b.vAlpha = -b.vAlpha;

      ctx.save();
      ctx.globalAlpha = Math.max(0, b.alpha);
      ctx.fillStyle = b.color;
      ctx.shadowBlur = 30;
      ctx.shadowColor = b.color;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(animate);
  }
  animate();
}

// Final Chapter: Floating Sky Lanterns Canvas
function initFinalCanvas() {
  const canvas = document.getElementById('canvas-ch-final');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const lanterns = [];
  for (let i = 0; i < 18; i++) {
    lanterns.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height + canvas.height,
      size: Math.random() * 12 + 10,
      vy: -(Math.random() * 0.6 + 0.4),
      vx: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.6 + 0.4
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    lanterns.forEach(l => {
      l.y += l.vy;
      l.x += l.vx;

      if (l.y < -30) {
        l.y = canvas.height + 20;
        l.x = Math.random() * canvas.width;
      }

      ctx.save();
      ctx.globalAlpha = l.alpha;
      ctx.fillStyle = '#ffaa33';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ffd700';

      // Lantern shape
      ctx.beginPath();
      ctx.roundRect(l.x - l.size / 2, l.y - l.size, l.size, l.size * 1.3, 4);
      ctx.fill();

      // Inner glow core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(l.x, l.y - l.size * 0.3, l.size * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(animate);
  }
  animate();
}
