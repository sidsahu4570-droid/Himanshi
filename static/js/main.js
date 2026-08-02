/* ==========================================================================
   A LETTER FOR HIMANSHI - Main Application Controller (GSAP + Interactions)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  initCursor();
  initLandingSequence();
  initAudioToggle();
  initPage1Typing();
  initScrollAnimations();
  initCinematicApologyScene();
  initPolaroids();
  initFinalButton();
});

/* ==========================================================================
   1. CUSTOM CURSOR
   ========================================================================== */
function initCursor() {
  const glow = document.querySelector('.cursor-glow');
  const dot = document.querySelector('.cursor-dot');

  if (!glow || !dot) return;

  window.addEventListener('mousemove', (e) => {
    gsap.to(glow, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.6,
      ease: 'power2.out'
    });
    gsap.to(dot, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
      ease: 'power2.out'
    });
  });
}

/* ==========================================================================
   2. LANDING SCREEN SEQUENCE
   ========================================================================== */
function initLandingSequence() {
  const subtitleEl = document.getElementById('landing-subtitle-text');
  const titleEl = document.getElementById('landing-title');
  const btnEl = document.getElementById('open-btn');
  const landingScreen = document.getElementById('landing-screen');
  const audioBtn = document.getElementById('audio-toggle-btn');

  const phrase = "For Someone Very Special...";
  let charIdx = 0;

  // Type letter-by-letter
  function typeSubtitle() {
    if (charIdx < phrase.length) {
      subtitleEl.textContent += phrase.charAt(charIdx);
      charIdx++;
      setTimeout(typeSubtitle, 70);
    } else {
      // Reveal Title "Himanshi ❤️"
      setTimeout(() => {
        titleEl.classList.add('show');
        setTimeout(() => {
          btnEl.classList.add('show');
        }, 800);
      }, 500);
    }
  }

  setTimeout(typeSubtitle, 600);

  // Click "Please Open This"
  btnEl.addEventListener('click', () => {
    // Start Audio
    if (window.romanticAudio) {
      window.romanticAudio.start();
    }
    if (audioBtn) {
      audioBtn.classList.add('visible');
    }

    // Fade out Landing Screen
    landingScreen.classList.add('fade-out');

    // Scroll to Page 1
    setTimeout(() => {
      document.getElementById('page-1').scrollIntoView({ behavior: 'smooth' });
    }, 400);
  });
}

/* ==========================================================================
   3. AUDIO TOGGLE BUTTON
   ========================================================================== */
function initAudioToggle() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    if (window.romanticAudio) {
      const playing = window.romanticAudio.toggle();
      audioBtn.style.color = playing ? '#ffd700' : 'rgba(255,255,255,0.4)';
    }
  });
}

/* ==========================================================================
   4. PAGE 1: PEACEFUL NIGHT & LUXURY IVORY HANDWRITTEN LETTER
   ========================================================================== */
function initPage1PeacefulNight() {
  const section = document.getElementById('page-1');
  const paperCard = document.getElementById('page1-paper-card');
  const headerEl = document.getElementById('page1-ink-header');
  const bodyEl = document.getElementById('page1-typed-letter');
  const moon = section ? section.querySelector('.night-moon') : null;

  if (!section || !paperCard || !bodyEl) return;

  initPage1NightCanvas();

  // Mouse move 3D tilt on paper card
  section.addEventListener('mousemove', (e) => {
    const rect = paperCard.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const tiltX = (y / rect.height) * 8;
    const tiltY = -(x / rect.width) * 8;

    paperCard.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });

  section.addEventListener('mouseleave', () => {
    paperCard.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  });

  const headerText = "Dear Himanshi,";
  const bodyText = `I don't know why you're upset with me, but I can feel the distance between us.

Maybe I made mistakes that hurt you.
Maybe I didn't understand your feelings.

Whatever the reason is...
I genuinely want to understand.

If I hurt you...
I'm truly sorry.`;

  let hasStarted = false;

  ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    onEnter: () => {
      if (hasStarted) return;
      hasStarted = true;

      // 1. Moon slowly brightens
      if (moon) {
        gsap.to(moon, { opacity: 1, scale: 1, duration: 2.0, ease: 'power2.out' });
      }

      // 2. Paper gently unfolds
      gsap.to(paperCard, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.8,
        ease: 'power3.out',
        onComplete: () => {
          // 3. Title writes itself with ink
          typeHeader(0);
        }
      });
    }
  });

  function typeHeader(idx) {
    if (idx < headerText.length) {
      if (headerEl) headerEl.textContent += headerText.charAt(idx);
      setTimeout(() => typeHeader(idx + 1), 60);
    } else {
      // 4. Paragraph appears with typewriter effect
      setTimeout(() => typeBody(0), 400);
    }
  }

  function typeBody(idx) {
    if (idx < bodyText.length) {
      bodyEl.textContent += bodyText.charAt(idx);
      setTimeout(() => typeBody(idx + 1), 35);
    }
  }
}

// Night Canvas Engine for Page 1: Twinkling stars, fireflies, and occasional floating flower petal
function initPage1NightCanvas() {
  const canvas = document.getElementById('page1-night-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Stars
  const stars = [];
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      vAlpha: (Math.random() - 0.5) * 0.008
    });
  }

  // Fireflies
  const fireflies = [];
  for (let i = 0; i < 22; i++) {
    fireflies.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.8 + 0.2
    });
  }

  // Single occasional floating flower petal
  const petal = {
    x: -50,
    y: Math.random() * canvas.height * 0.5,
    size: 10,
    vx: 0.8,
    vy: 0.3,
    rotation: 0,
    active: false
  };

  setInterval(() => {
    if (!petal.active && Math.random() > 0.3) {
      petal.x = -20;
      petal.y = Math.random() * (canvas.height * 0.6);
      petal.active = true;
    }
  }, 8000);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Stars
    stars.forEach(s => {
      s.alpha += s.vAlpha;
      if (s.alpha > 0.9 || s.alpha < 0.2) s.vAlpha = -s.vAlpha;
      ctx.save();
      ctx.globalAlpha = Math.max(0, s.alpha);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw Fireflies
    fireflies.forEach(f => {
      f.x += f.vx;
      f.y += f.vy;
      if (f.x < 0) f.x = canvas.width;
      if (f.x > canvas.width) f.x = 0;
      if (f.y < 0) f.y = canvas.height;
      if (f.y > canvas.height) f.y = 0;

      ctx.save();
      ctx.globalAlpha = f.alpha;
      ctx.fillStyle = '#c084fc';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#e6e6fa';
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw Occasional Floating Flower Petal
    if (petal.active) {
      petal.x += petal.vx;
      petal.y += petal.vy + Math.sin(petal.x * 0.01) * 0.4;
      petal.rotation += 0.5;

      if (petal.x > canvas.width + 50) {
        petal.active = false;
      }

      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate((petal.rotation * Math.PI) / 180);
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = '#e6e6fa';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-petal.size, -petal.size, -petal.size, petal.size, 0, petal.size * 1.4);
      ctx.bezierCurveTo(petal.size, petal.size, petal.size, -petal.size, 0, 0);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   5. GSAP SCROLLTRIGGER ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  // Page 2: Timeline cards sequential fade-in
  const timelineCards = document.querySelectorAll('.timeline-card-wrapper');
  timelineCards.forEach((card, idx) => {
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: idx * 0.2,
      ease: 'power3.out'
    });
  });

  // Page 3: Sincere Card Fade
  gsap.from('#page-3 .sincere-card', {
    scrollTrigger: {
      trigger: '#page-3',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    scale: 0.9,
    duration: 1.2,
    ease: 'power3.out'
  });

  // Page 5: Promises blooming sequential reveal
  const promiseCards = document.querySelectorAll('.promise-card');
  promiseCards.forEach((card, idx) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 40,
      scale: 0.85,
      duration: 0.9,
      delay: idx * 0.25,
      ease: 'back.out(1.7)'
    });
  });

  // Page 8: Apology letter fade in
  gsap.from('#page-8 .vintage-letter', {
    scrollTrigger: {
      trigger: '#page-8',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 50,
    duration: 1.2,
    ease: 'power3.out'
  });
}

/* ==========================================================================
   6. POLAROID 3D TILT & HOVER EFFECT
   ========================================================================== */
function initPolaroids() {
  const polaroids = document.querySelectorAll('.polaroid-frame');
  polaroids.forEach(p => {
    p.addEventListener('mousemove', (e) => {
      const rect = p.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const tiltX = (y / rect.height) * 15;
      const tiltY = -(x / rect.width) * 15;

      p.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.06)`;
    });

    p.addEventListener('mouseleave', () => {
      p.style.transform = '';
    });
  });
}

/* ==========================================================================
   7. FINAL PAGE BUTTON - HEART SHOWER EXPLOSION
   ========================================================================== */
function initFinalButton() {
  const finalBtn = document.getElementById('final-heart-btn');
  if (!finalBtn) return;

  finalBtn.addEventListener('click', () => {
    if (typeof window.triggerHeartShower === 'function') {
      window.triggerHeartShower();
    }
  });
}

/* ==========================================================================
   8. CINEMATIC APOLOGY SCENE ENGINE
   ========================================================================== */
function initCinematicApologyScene() {
  const section = document.getElementById('cinematic-apology-scene');
  const card = document.getElementById('cinematic-card');
  const reliveOverlay = document.getElementById('relive-moment-overlay');
  const relivePart1 = document.getElementById('relive-part1');
  const relivePart2 = document.getElementById('relive-part2');

  if (!section || !card) return;

  initCinematicCanvas();

  const sentences = [
    { id: 'line-1', text: "I've replayed that moment in my mind many times." },
    { id: 'line-2', text: "I wish I had chosen patience instead of anger." },
    { id: 'line-3', text: "You deserved kindness." },
    { id: 'line-4', text: "Not raised voices." },
    { id: 'line-5', text: "I'm deeply sorry." }
  ];

  let hasStarted = false;

  ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    onEnter: () => {
      if (hasStarted) return;
      hasStarted = true;

      // Card Fades in while gently floating
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 1.6,
        ease: 'power3.out',
        onComplete: () => {
          playSentenceSequence(0);
        }
      });
    }
  });

  function playSentenceSequence(index) {
    if (index < sentences.length) {
      const item = sentences[index];
      const el = document.getElementById(item.id);
      if (!el) return;

      let charIdx = 0;
      function typeChar() {
        if (charIdx < item.text.length) {
          el.textContent += item.text.charAt(charIdx);
          charIdx++;
          setTimeout(typeChar, 42);
        } else {
          // Pause between sentences
          const pauseDuration = (index === sentences.length - 1) ? 2400 : 1200;
          setTimeout(() => {
            playSentenceSequence(index + 1);
          }, pauseDuration);
        }
      }
      typeChar();
    } else {
      // Card slowly fades away after final sentence
      gsap.to(card, {
        opacity: 0,
        scale: 0.95,
        duration: 1.6,
        ease: 'power2.inOut',
        onComplete: () => {
          card.style.display = 'none';
          playReliveOverlay();
        }
      });
    }
  }

  function playReliveOverlay() {
    reliveOverlay.style.display = 'flex';

    // Sentence Part 1: "If I could relive one moment..."
    gsap.to(relivePart1, {
      opacity: 1,
      y: 0,
      duration: 1.4,
      ease: 'power2.out',
      onComplete: () => {
        // Pause 2 seconds
        setTimeout(() => {
          // Sentence Part 2: "...it would be that one."
          gsap.to(relivePart2, {
            opacity: 1,
            y: 0,
            duration: 1.4,
            ease: 'power2.out',
            onComplete: () => {
              // Pause 3 seconds, then smooth scroll to next section
              setTimeout(() => {
                const nextSection = document.getElementById('page-5');
                if (nextSection) {
                  nextSection.scrollIntoView({ behavior: 'smooth' });
                }
              }, 3000);
            }
          });
        }, 2000);
      }
    });
  }
}

// Canvas engine for moonlight, tiny stars, fireflies, and light fog
function initCinematicCanvas() {
  const canvas = document.getElementById('cinematic-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Tiny Stars
  const stars = [];
  for (let i = 0; i < 140; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      vAlpha: (Math.random() - 0.5) * 0.01
    });
  }

  // Fireflies
  const fireflies = [];
  for (let i = 0; i < 28; i++) {
    fireflies.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      color: '#e6e6fa'
    });
  }

  // Moving Fog particles near bottom
  const fog = [];
  for (let i = 0; i < 18; i++) {
    fog.push({
      x: Math.random() * canvas.width,
      y: canvas.height * 0.82 + Math.random() * (canvas.height * 0.18),
      radius: Math.random() * 60 + 40,
      vx: Math.random() * 0.3 + 0.1,
      alpha: Math.random() * 0.15 + 0.05
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stars
    stars.forEach(s => {
      s.alpha += s.vAlpha;
      if (s.alpha > 0.9 || s.alpha < 0.2) s.vAlpha = -s.vAlpha;
      ctx.save();
      ctx.globalAlpha = Math.max(0, s.alpha);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Fireflies
    fireflies.forEach(f => {
      f.x += f.vx;
      f.y += f.vy;
      if (f.x < 0) f.x = canvas.width;
      if (f.x > canvas.width) f.x = 0;
      if (f.y < 0) f.y = canvas.height;
      if (f.y > canvas.height) f.y = 0;

      ctx.save();
      ctx.globalAlpha = Math.max(0, f.alpha);
      ctx.fillStyle = f.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#c084fc';
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Drifting Fog
    fog.forEach(fg => {
      fg.x += fg.vx;
      if (fg.x - fg.radius > canvas.width) {
        fg.x = -fg.radius;
      }
      ctx.save();
      ctx.globalAlpha = fg.alpha;
      ctx.fillStyle = 'rgba(230, 230, 250, 0.1)';
      ctx.shadowBlur = 40;
      ctx.shadowColor = 'rgba(230, 230, 250, 0.2)';
      ctx.beginPath();
      ctx.arc(fg.x, fg.y, fg.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(animate);
  }
  animate();
}

