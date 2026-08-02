/* ==========================================================================
   A LETTER FOR HIMANSHI - Main Application Controller (GSAP + Interactions)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  initCursor();
  initLandingSequence();
  initAudioToggle();
  initPage1Typing();
  initPage1SkyCanvas();
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
    setTimeout(() => {
      landingScreen.style.display = 'none';
    }, 1500);
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
   4. PAGE 1: TYPING EFFECT FOR HANDWRITTEN LETTER
   ========================================================================== */
function initPage1Typing() {
  const container = document.getElementById('page1-typed-letter');
  const scrollIndicator = document.querySelector('#page-1 .scroll-indicator');
  if (!container) return;

  const paragraphs = [
    "I never imagined that one simple message, almost three years ago, would become a story filled with so many memories.",
    "Some of those memories still make me smile.",
    "One of them is the mistake I wish I could take back.",
    "This website isn't here to convince you of anything.",
    "It's simply the story of us, told from my heart.",
    "If you're willing...",
    "keep scrolling.",
    "— Siddharth"
  ];

  let hasStarted = false;

  ScrollTrigger.create({
    trigger: '#page-1',
    start: 'top 60%',
    onEnter: () => {
      if (hasStarted) return;
      hasStarted = true;
      typeParagraph(0);
    }
  });

  function typeParagraph(pIndex) {
    if (pIndex >= paragraphs.length) {
      if (scrollIndicator) {
        scrollIndicator.style.opacity = '0.9';
        scrollIndicator.style.transform = 'translate(-50%, 0)';
      }
      return;
    }

    const isSignature = pIndex === paragraphs.length - 1;
    const isWilling = paragraphs[pIndex] === "If you're willing..." || paragraphs[pIndex] === "keep scrolling.";
    const pEl = document.createElement(isSignature ? 'div' : 'p');

    if (isSignature) {
      pEl.className = 'letter-signature';
    } else if (isWilling) {
      pEl.className = 'typed-para paragraph-italic';
    } else {
      pEl.className = 'typed-para';
    }

    container.appendChild(pEl);

    const text = paragraphs[pIndex];
    let charIndex = 0;

    function typeChar() {
      if (charIndex < text.length) {
        pEl.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, 35);
      } else {
        // Pause briefly between paragraphs
        const pauseTime = isSignature ? 500 : 450;
        setTimeout(() => {
          typeParagraph(pIndex + 1);
        }, pauseTime);
      }
    }

    typeChar();
  }
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
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: idx * 0.15,
      ease: 'power3.out'
    });
  });

  // Page 3: Sincere Card Fade
  gsap.from('#page-3 .sincere-card', {
    scrollTrigger: {
      trigger: '#page-3',
      start: 'top 75%',
      toggleActions: 'play none none none',
      once: true
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
        toggleActions: 'play none none none',
        once: true
      },
      opacity: 0,
      y: 40,
      scale: 0.85,
      duration: 0.9,
      delay: idx * 0.2,
      ease: 'back.out(1.7)'
    });
  });

  // Page 8: Apology letter fade in
  gsap.from('#page-8 .vintage-letter', {
    scrollTrigger: {
      trigger: '#page-8',
      start: 'top 80%',
      toggleActions: 'play none none none',
      once: true
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
            ease: 'power2.out'
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

/* ==========================================================================
   9. PAGE 1 ANIMATED NIGHT SKY CANVAS ENGINE
   ========================================================================== */
function initPage1SkyCanvas() {
  const canvas = document.getElementById('page1-sky-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Thousands of tiny twinkling stars (250 stars)
  const stars = [];
  for (let i = 0; i < 250; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      vAlpha: (Math.random() - 0.5) * 0.012
    });
  }

  // Small fireflies floating slowly (35 fireflies)
  const fireflies = [];
  for (let i = 0; i < 35; i++) {
    fireflies.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.7 + 0.3,
      color: Math.random() > 0.4 ? '#ffb7c5' : '#ffd700'
    });
  }

  // Soft glowing floating hearts (subtle particles, low opacity)
  const subtleHearts = [];
  for (let i = 0; i < 16; i++) {
    subtleHearts.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 8 + 6,
      vy: -(Math.random() * 0.3 + 0.2),
      vx: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.25 + 0.1,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 0.5
    });
  }

  function drawHeart(x, y, size, color, alpha, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = color;

    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size);
    ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stars
    stars.forEach(s => {
      s.alpha += s.vAlpha;
      if (s.alpha > 0.95 || s.alpha < 0.15) s.vAlpha = -s.vAlpha;
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
      ctx.shadowBlur = 12;
      ctx.shadowColor = f.color;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Soft subtle floating hearts
    subtleHearts.forEach(h => {
      h.y += h.vy;
      h.x += h.vx;
      h.rotation += h.vRot;

      if (h.y < -20) {
        h.y = canvas.height + 20;
        h.x = Math.random() * canvas.width;
      }

      drawHeart(h.x, h.y, h.size, '#ffb7c5', h.alpha, h.rotation);
    });

    requestAnimationFrame(animate);
  }
  animate();
}


